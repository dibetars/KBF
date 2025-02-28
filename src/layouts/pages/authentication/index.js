import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import Header from "components/Header";
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';

function Authentication() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const isAuth = localStorage.getItem("isAuthenticated");
        
        // Add a minimum delay to prevent flash
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!mounted) return;

        if (isAuth === "true") {
          navigate("/dashboard", { replace: true }); // Use replace to prevent back navigation
        } else {
          setFadeIn(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        if (mounted) {
          setIsChecking(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (credentials.username === "levi" && credentials.password === "#r5439:2fgs") {
        setFadeIn(false);
        await new Promise(resolve => setTimeout(resolve, 300));
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard", { replace: true });
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isChecking) {
    return (
      <MKBox
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <CircularProgress 
          color="error"
          size={40}
          thickness={4}
        />
      </MKBox>
    );
  }

  return (
    <Fade 
      in={fadeIn} 
      timeout={600}
      mountOnEnter
      unmountOnExit
    >
      <MKBox>
        <Header />
        <MKBox
          minHeight="100vh"
          width="100%"
          sx={{
            backgroundImage: `linear-gradient(rgba(128, 0, 0, 0.8), rgba(128, 0, 0, 0.8))`,
            display: "grid",
            placeItems: "center",
            paddingTop: "70px",
          }}
        >
          <Container>
            <Grid container justifyContent="center">
              <Grid item xs={12} sm={8} md={6} lg={4}>
                <Card 
                  sx={{ 
                    p: 4,
                    backdropFilter: "saturate(200%) blur(30px)",
                    background: "rgba(255, 255, 255, 0.9)",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <MKTypography variant="h3" textAlign="center" mb={3}>
                    Admin Login
                  </MKTypography>
                  <form onSubmit={handleSubmit}>
                    <MKBox mb={2}>
                      <MKInput
                        type="text"
                        name="username"
                        label="Username"
                        fullWidth
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </MKBox>
                    <MKBox mb={3}>
                      <MKInput
                        type="password"
                        name="password"
                        label="Password"
                        fullWidth
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </MKBox>
                    {error && (
                      <Fade in={!!error}>
                        <MKTypography
                          variant="caption"
                          color="error"
                          textAlign="center"
                          display="block"
                          mb={2}
                        >
                          {error}
                        </MKTypography>
                      </Fade>
                    )}
                    <MKButton
                      variant="contained"
                      color="error"
                      fullWidth
                      type="submit"
                      disabled={isLoading}
                      sx={{
                        position: 'relative',
                        '&.Mui-disabled': {
                          backgroundColor: 'error.main',
                          opacity: 0.7,
                        },
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress 
                          size={24} 
                          color="inherit" 
                          sx={{ 
                            color: 'white',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                          }}
                        />
                      ) : "Login"}
                    </MKButton>
                  </form>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </MKBox>
      </MKBox>
    </Fade>
  );
}

export default Authentication; 