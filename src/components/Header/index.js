import { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
            {isMobile ? (
              <>
                <IconButton color="white" onClick={handleMenuOpen} sx={{ padding: 1 }}>
                  <MenuIcon sx={{ color: "white" }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: "rgba(139, 0, 0, 0.95)",
                      backdropFilter: "saturate(200%) blur(30px)",
                      mt: 1.5,
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleMenuClose}
                    component={Link}
                    to="/become-player"
                    sx={{
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                    }}
                  >
                    Become a Player
                  </MenuItem>
                  <MenuItem
                    onClick={handleMenuClose}
                    component={Link}
                    to="/become-sponsor"
                    sx={{
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                    }}
                  >
                    Become a Sponsor
                  </MenuItem>
                </Menu>
              </>
            ) : (
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
            )}
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Header;
