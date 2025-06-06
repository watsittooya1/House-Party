import { Grid } from "@mui/material";
import StyledText from "./StyledText";

const LogoHeader: React.FC = () => {
  return (
    <Grid container>
      <Grid>
        <img src="../../../static/favicon.png" />
      </Grid>
      <Grid>
        <StyledText name="h4">House Party!</StyledText>
      </Grid>
    </Grid>
  );
};

export default LogoHeader;
