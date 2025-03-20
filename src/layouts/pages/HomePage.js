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
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function HomePage() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [sponsoredPlayers, setSponsoredPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuredPlayers, setFeaturedPlayers] = useState([]);

  const handleVideoOpen = () => setVideoOpen(true);
  const handleVideoClose = () => setVideoOpen(false);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

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

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbfoundation_players"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        const data = await response.json();
        
        // Get only players with images
        const playersWithImages = data.filter(
          (player) => player.image && player.image.url
        );
        
        // Shuffle array to get random players
        const shuffled = playersWithImages.sort(() => 0.5 - Math.random());
        
        // Get sub-array of first n elements after shuffled
        setFeaturedPlayers(shuffled.slice(0, 8));
      } catch (error) {
        // Handle error silently
        setFeaturedPlayers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const TacticalBoard = () => {
    // Group players by position
    const playersByPosition = {
      GK: sponsoredPlayers.filter(p => p.position === "GK"),
      CB: sponsoredPlayers.filter(p => p.position === "CB"),
      FB: sponsoredPlayers.filter(p => p.position === "FB"),
      CDM: sponsoredPlayers.filter(p => p.position === "CDM"),
      CM: sponsoredPlayers.filter(p => p.position === "CM"),
      CAM: sponsoredPlayers.filter(p => p.position === "CAM"),
      W: sponsoredPlayers.filter(p => p.position === "W"),
      ST: sponsoredPlayers.filter(p => p.position === "ST"),
      CF: sponsoredPlayers.filter(p => p.position === "CF"),
    };

    const PlayerCard = ({ player }) => (
      <MKBox
        onClick={() => handlePlayerClick(player)}
        sx={{
          position: 'relative',
          width: { xs: 60, md: 80 },
          height: { xs: 60, md: 80 },
          margin: '0 auto',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <Avatar
          src={player.image.url || ''}
          alt={player.fullName}
          sx={{
            width: '100%',
            height: '100%',
            border: '2px solid white',
            boxShadow: 2,
            bgcolor: 'error.main',
            fontSize: { xs: '1rem', md: '1.25rem' },
          }}
        >
          {getInitials(player.fullName)}
        </Avatar>
        <MKBox
          sx={{
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: { xs: '0.7rem', md: '0.8rem' },
            whiteSpace: 'nowrap',
            zIndex: 1,
          }}
        >
          {player.fullName}
          <MKTypography
            variant="caption"
            sx={{
              display: 'block',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.6rem',
            }}
          >
            {player.position}
          </MKTypography>
        </MKBox>
      </MKBox>
    );

    return (
      <MKBox
        sx={{
          background: 'linear-gradient(0deg, #2d5a27 0%, #348f2d 100%)',
          borderRadius: '10px',
          padding: 3,
          margin: '40px 0',
          position: 'relative',
          minHeight: '400px',
          border: '5px solid #fff',
          boxShadow: 3,
          overflow: 'hidden',
        }}
      >
        {/* Field Markings */}
        <MKBox
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            '&::before': {
              // Half Circle
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '150px',
              height: '75px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '150px 150px 0 0',
              borderBottom: 'none',
            },
          }}
        >
          {/* Penalty Area */}
          <MKBox
            sx={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: '40%',
              border: '2px solid rgba(255,255,255,0.3)',
              borderBottom: 'none',
              '&::before': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40%',
                height: '50%',
                border: '2px solid rgba(255,255,255,0.3)',
                borderBottom: 'none',
              },
            }}
          />
        </MKBox>

        {/* Player Positions */}
        <Grid container sx={{ height: '100%', position: 'relative', zIndex: 1 }}>
          {/* Forwards (ST, CF) - Top Row */}
          <Grid item xs={12} sx={{ height: '20%', display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={2} justifyContent="center">
              {[...playersByPosition.ST, ...playersByPosition.CF].map((player, index) => (
                <Grid item xs={3} key={player.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <PlayerCard player={player} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Attacking Midfielders (CAM, W) */}
          <Grid item xs={12} sx={{ height: '20%', display: 'flex', alignItems: 'center' }}>
            <Grid container spacing={2} justifyContent="space-around">
              {[...playersByPosition.CAM, ...playersByPosition.W].map((player, index) => (
                <Grid item xs={3} key={player.id}>
                  <PlayerCard player={player} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Central Midfielders (CM, CDM) */}
          <Grid item xs={12} sx={{ height: '20%', display: 'flex', alignItems: 'center' }}>
            <Grid container spacing={2} justifyContent="space-around">
              {[...playersByPosition.CM, ...playersByPosition.CDM].map((player, index) => (
                <Grid item xs={3} key={player.id}>
                  <PlayerCard player={player} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Defenders (CB, FB) */}
          <Grid item xs={12} sx={{ height: '20%', display: 'flex', alignItems: 'center' }}>
            <Grid container spacing={2} justifyContent="space-around">
              {[...playersByPosition.CB, ...playersByPosition.FB].map((player, index) => (
                <Grid item xs={3} key={player.id}>
                  <PlayerCard player={player} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Goalkeeper (GK) - Bottom Row */}
          <Grid item xs={12} sx={{ height: '20%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            {playersByPosition.GK.map((player, index) => (
              <Grid item xs={3} key={player.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <PlayerCard player={player} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {isLoading && (
          <MKBox
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}
          >
            <CircularProgress sx={{ color: 'white' }} />
          </MKBox>
        )}
      </MKBox>
    );
  };

  const PlayerDetailModal = () => {
    if (!selectedPlayer) return null;

    const details = [
      { label: "Full Name", value: selectedPlayer.fullName },
      { label: "Position", value: selectedPlayer.position },
      { label: "Date of Birth", value: selectedPlayer.DOB },
      { label: "Education", value: selectedPlayer.education },
      { label: "Shirt Size", value: selectedPlayer.shirtSize },
      { label: "Registration Date", value: new Date(selectedPlayer.created_at).toLocaleDateString() },
    ];

    return (
      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <MKBox display="flex" alignItems="center" justifyContent="space-between">
            <MKBox display="flex" alignItems="center" gap={2}>
              <Avatar 
                src={selectedPlayer.image?.url}
                sx={{ 
                  width: 56,
                  height: 56,
                  bgcolor: 'error.main',
                  '& img': {
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    width: '100%',
                    height: '100%',
                  }
                }}
              >
                {!selectedPlayer.image && getInitials(selectedPlayer.fullName)}
              </Avatar>
              <MKBox>
                <MKTypography variant="h6">{selectedPlayer.fullName}</MKTypography>
                <MKTypography variant="caption" color="text.secondary">
                  {selectedPlayer.position}
                </MKTypography>
              </MKBox>
            </MKBox>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </MKBox>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {details.map((detail) => (
              detail.value && (
                <Grid item xs={12} key={detail.label}>
                  <MKBox>
                    <MKTypography variant="caption" color="text.secondary">
                      {detail.label}
                    </MKTypography>
                    <MKTypography variant="body1">
                      {detail.value}
                    </MKTypography>
                  </MKBox>
                </Grid>
              )
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <MKButton onClick={handleCloseModal} color="error">
            Close
          </MKButton>
        </DialogActions>
      </Dialog>
    );
  };

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
                <MKButton 
                  component={Link}
                  to="/become-sponsor"
                  color="error" 
                  variant="contained"
                >
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
                <MKButton 
                  component={Link}
                  to="/become-sponsor"
                  color="error" 
                  variant="contained" 
                  size="large"
                >
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

        {/* Tactical Board Section */}
        <Container sx={{ py: 6 }}>
          <MKTypography variant="h3" textAlign="center" mb={3}>
            Featured Players
          </MKTypography>
          <MKTypography variant="body1" textAlign="center" color="text" mb={4}>
            Meet our talented players who need your support.
          </MKTypography>
          <TacticalBoard />
        </Container>
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

      <PlayerDetailModal />
      <Footer />
    </>
  );
}

export default HomePage;
