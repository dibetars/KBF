import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function Footer() {
  return (
    <MKBox
      component="footer"
      py={2}
      sx={{
        background: "black",
        color: "red",
      }}
    >
      <Container>
        <Grid container justifyContent="center">
          <Grid item>
            <MKTypography variant="button" color="white">
              Kwame Bofrot Foundation © {new Date().getFullYear()} | KB Foundation is a Christian organization dedicated to developing young talents through football.
            </MKTypography>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Footer;
