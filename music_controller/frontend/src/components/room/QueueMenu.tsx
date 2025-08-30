/// <reference types="spotify-web-playback-sdk" />
import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  Slide,
  Dialog,
  dialogClasses,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import styled from "@emotion/styled";
import { useLazySearchTrackQuery } from "../../api/spotifyApi";
import { useNavigate } from "react-router-dom";
import { removeQueryParam, useQueryParams } from "../../utility/queryParams";
import { PageGrid } from "../common/PageGrid";
import { pageGridPadding, queueWidth } from "../../utility/dimensions";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import colorScheme from "../../utility/colorScheme";
import TrackSearchResult from "./TrackSearchResult";
import { Flex } from "../common/Flex";
import StyledText from "../common/StyledText";
import { StyledTextField } from "../common/StyledTextField";

// this is how much we have to offset our dialog so dimensions line up with the music player
const queueMenuOffset =
  0.01 * queueWidth * (100 - 2 * pageGridPadding) + pageGridPadding;

const StyledDialog = styled(Dialog)`
  ${`& .${dialogClasses.paper}`} {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    position: absolute;
    left: ${`-${queueMenuOffset}%`};
    margin: 0;
    border-radius: 0px;
    overflow: hidden;
    box-shadow: none;
  }
`;

const Offset = styled.div`
  height: 100%;
  position: relative;
  left: ${`${queueMenuOffset}%`};
`;

const StyledReturn = styled(KeyboardArrowDownIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const StyledSearch = styled(SearchIcon)`
  color: ${colorScheme.gray};
  font-size: 50px;
`;

const SearchResultsContainer = styled(Flex)`
  overflow-y: auto;
  margin: 0% 10% 0% 10%;
`;

const StyledCircularProgress = styled(CircularProgress)``;

const QueueMenu: React.FC = () => {
  const [show] = useQueryParams(["queueTrack"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [triggerSearch, { isFetching }] = useLazySearchTrackQuery();
  const [searchResults, setSearchResults] = useState<Spotify.Track[]>([]);
  const [searchError, setSearchError] = useState<string>();
  const navigate = useNavigate();

  // cy TODO: handle empty searches in the search input! should show some sort of error
  // cy TODO: handle empty search results
  const handleSearch = useCallback(() => {
    if (searchQuery.length == 0) {
      setSearchError("Enter a search query");
    }
    triggerSearch({ query: searchQuery })
      .unwrap()
      .then((resp) => setSearchResults(resp.tracks));
  }, [searchQuery, triggerSearch]);

  useEffect(() => {
    return () => {
      navigate(`?${removeQueryParam("queueTrack")}`);
    };
  }, [navigate]);

  const handleExit = useCallback(() => {
    navigate(`?${removeQueryParam("queueTrack")}`);
  }, [navigate]);

  return (
    <Slide direction="up" in={!!show}>
      <StyledDialog open hideBackdrop>
        <Offset>
          <PageGrid justify="left" align="flex-end">
            <Flex
              width={`${100.0 - queueMenuOffset}%`}
              direction="column"
              height="95%"
            >
              <Flex
                width="100%"
                height="10%"
                direction="row"
                alignItems="center"
              >
                <Tooltip title="Exit Queue Menu">
                  <IconButton onClick={handleExit}>
                    <StyledReturn />
                  </IconButton>
                </Tooltip>
                <StyledTextField
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setSearchError(undefined);
                    setSearchQuery(e.target.value);
                  }}
                  label="search for a track"
                  type="search"
                  error={!!searchError}
                  helperText={searchError}
                />
                {isFetching ? (
                  <StyledCircularProgress />
                ) : (
                  <Tooltip title="Submit Search">
                    <IconButton onClick={handleSearch}>
                      <StyledSearch />
                    </IconButton>
                  </Tooltip>
                )}
              </Flex>
              <SearchResultsContainer
                width="100%"
                direction="column"
                grow="1"
                gap="1%"
              >
                {searchResults.length !== 0 ? (
                  searchResults.map((track) => (
                    <TrackSearchResult track={track} />
                  ))
                ) : (
                  <StyledText name="body">no tracks found</StyledText>
                )}
              </SearchResultsContainer>
            </Flex>
          </PageGrid>
        </Offset>
      </StyledDialog>
    </Slide>
  );
};

export default QueueMenu;
