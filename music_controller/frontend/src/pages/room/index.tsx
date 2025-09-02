import { useNavigate } from "react-router-dom";
import { useGetCurrentRoomQuery } from "../../api/housePartyApi";
import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { PageGrid } from "../../components/common/PageGrid";

const CodelessRoom: React.FC = () => {
  // ideally, the user should never land on this page.
  // regardless, if the user has a room, send them to it
  // otherwise, boot them to the front page
  const { data, isLoading } = useGetCurrentRoomQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (data?.code == undefined || data?.code == null) {
      navigate("/");
    } else {
      navigate(`/room/${data.code}`);
    }
  }, [data, isLoading, navigate]);

  return <PageGrid>{isLoading && <CircularProgress />}</PageGrid>;
};

export default CodelessRoom;
