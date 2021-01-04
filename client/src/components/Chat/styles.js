import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  menuButton: {
    marginRight: "20px",
    [theme.breakpoints.up(680)]: {
      display: "none"
    }
  }
}));
