import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { Link } from "react-router-dom";

function Header() {
  return (
    <MKBox
      component="header"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      zIndex={3}
      sx={{
        backgroundColor: "rgba(139, 0, 0, 0.95)",
        backdropFilter: "saturate(200%) blur(30px)",
      }}
    >
      <Container>
        <Grid container py={1} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Link to="/">
              <MKBox
                component="img"
                src="/images/logo.png"
                alt="The Kwame Bofrot Foundation"
                height="50px"
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            </Link>
          </Grid>
          <Grid item>
            <MKBox component="nav" display="flex" gap={2}>
              <MKButton
                variant="text"
                color="white"
                sx={{ textTransform: "none" }}
                component={Link}
                to="/become-player"
              >
                Become a Player
              </MKButton>
              <MKButton
                variant="contained"
                color="white"
                sx={{ textTransform: "none" }}
                component={Link}
                to="/become-sponsor"
              >
                Become a Sponsor
              </MKButton>
            </MKBox>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Header;
