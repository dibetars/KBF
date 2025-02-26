import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import SportsIcon from "@mui/icons-material/Sports";
import { TypeAnimation } from "react-type-animation";
import Header from "components/Header";
import Footer from "components/Footer";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";

function HomePage() {
  const [videoOpen, setVideoOpen] = useState(false);

  const handleVideoOpen = () => setVideoOpen(true);
  const handleVideoClose = () => setVideoOpen(false);

  const solutions = [
    {
      icon: <SportsIcon />,
      title: "Talent Identification & Development Camps",
      description: "Scouting and training programs that equip players with elite-level skills.",
    },
    {
      icon: <SchoolIcon />,
      title: "Academic Support",
      description: "Helping athletes meet the educational requirements for scholarships.",
    },
    {
      icon: <MonetizationOnIcon />,
      title: "Scholarships & Financial Assistance",
      description: "Covering registration fees, travel expenses, and essential resources.",
    },
  ];

  return (
    <>
      <Header />
      <MKBox sx={{ paddingTop: "60px" }} bgcolor="white">
        {/* Hero Section */}
        <MKBox
          minHeight="85vh"
          width="100%"
          sx={{
            backgroundImage: `url('/images/soccer-player.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center -500px",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Container>
            <Grid container item xs={12} lg={7} mx="auto" textAlign="center">
              <Grid item xs={12}>
                <MKTypography variant="h1" color="white" mb={3}>
                  The Kwame Bofrot Foundation
                </MKTypography>
                <TypeAnimation
                  sequence={["Changing Lives,", 1000, "Impacting Generations"]}
                  wrapper="div"
                  speed={50}
                  style={{
                    fontSize: "3rem",
                    fontWeight: "700",
                    color: "white",
                    marginBottom: "1rem",
                    fontFamily: '"Roboto Slab", sans-serif',
                  }}
                  repeat={0}
                />
              </Grid>
              <MKTypography
                variant="body1"
                color="white"
                textAlign="center"
                px={{ xs: 6, lg: 12 }}
                mt={1}
                mx="auto"
                sx={{ maxWidth: "600px" }}
              >
                Empowering Young Soccer Players in Africa.
              </MKTypography>
              <Grid container justifyContent="center" mt={3}>
                <MKButton color="error" variant="contained">
                  Discover More
                </MKButton>
              </Grid>
            </Grid>
          </Container>
        </MKBox>

        {/* Challenges Section */}
        <Container sx={{ mt: 6, mb: 6 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MKBox p={4} bgcolor="error.main" borderRadius="xl">
                <MKTypography variant="h6" color="black" mb={2}>
                  Too many gifted soccer players in West Africa face financial barriers
                </MKTypography>
                <MKTypography variant="h3" color="black">
                  preventing them from reaching their full potential.
                </MKTypography>
              </MKBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ p: 3, height: "100%" }}>
                    <MKBox display="flex" alignItems="center">
                      <MonetizationOnIcon color="error" sx={{ fontSize: 30, mr: 2 }} />
                      <MKBox>
                        <MKTypography variant="h6">Financial Constraints</MKTypography>
                        <MKTypography variant="body2" color="text">
                          Many players cannot afford registration fees, equipment, or travel costs
                          for trials.
                        </MKTypography>
                      </MKBox>
                    </MKBox>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ p: 3, height: "100%" }}>
                    <MKBox display="flex" alignItems="center">
                      <SearchIcon color="error" sx={{ fontSize: 30, mr: 2 }} />
                      <MKBox>
                        <MKTypography variant="h6">Scouting Challenges</MKTypography>
                        <MKTypography variant="body2" color="text">
                          Talented players struggle to gain visibility from international scouts and
                          college coaches.
                        </MKTypography>
                      </MKBox>
                    </MKBox>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>

        {/* Solutions Section */}
        <MKBox bgcolor="grey.100" py={6}>
          <Container>
            <MKTypography variant="h3" mb={4}>
              Our Solution: Building a Bridge to Success
            </MKTypography>
            <MKTypography variant="body1" color="text" mb={4}>
              At the Kwame Bofrot Foundation, we provide the crucial support young athletes need to
              reach their full potential. Through strategic programs and partnerships, we ensure
              that no talent goes unnoticed and that every promising player gets a fair shot at
              success.
            </MKTypography>
            <Grid container spacing={3}>
              {solutions.map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ p: 3, height: "100%" }}>
                    <MKBox display="flex" alignItems="center" mb={2}>
                      <MKBox color="error.main" mr={2}>
                        {item.icon}
                      </MKBox>
                      <MKTypography variant="h6">{item.title}</MKTypography>
                    </MKBox>
                    <MKTypography variant="body2" color="text">
                      {item.description}
                    </MKTypography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </MKBox>

        {/* Sponsor Section */}
        <MKBox
          minHeight="50vh"
          width="100%"
          sx={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/soccer-feet.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MKTypography variant="h2" color="white" mb={2}>
                  Sponsor A Player, Change A Life
                </MKTypography>
                <MKTypography variant="h4" color="white" mb={3}>
                  300 Players In Need Of Sponsorship.
                </MKTypography>
                <MKTypography variant="body1" color="white" mb={4}>
                  Your support can make the difference between a dream deferred and a dream
                  realized. By sponsoring a player, you help cover essential costs like registration
                  fees, travel, and academic preparation.
                </MKTypography>
                <MKButton color="error" variant="contained" size="large">
                  Sponsor a Player
                </MKButton>
              </Grid>
              <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
                <MKBox
                  component="div"
                  onClick={handleVideoOpen}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                      bgcolor: "rgba(250, 230, 230, 0.3)",
                    },
                  }}
                >
                  <PlayArrowIcon sx={{ color: "white", fontSize: 40 }} />
                </MKBox>
              </Grid>
            </Grid>
          </Container>
        </MKBox>
      </MKBox>

      {/* Video Dialog */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={videoOpen}
        onClose={handleVideoClose}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
      >
        <MKBox
          component="iframe"
          src="/videos/foundation-video.mp4"
          title="Foundation Video"
          width="100%"
          height="500px"
          sx={{ border: "none" }}
          allowFullScreen
        />
      </Dialog>

      <Footer />
    </>
  );
}

export default HomePage;
