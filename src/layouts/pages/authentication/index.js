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

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = localStorage.getItem("isAuthenticated");
      if (isAuth === "true") {
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for smooth transition
        navigate("/dashboard");
      }
      setIsChecking(false);
    };
    checkAuth();
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
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      if (credentials.username === "levi" && credentials.password === "#r5439:2fgs") {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <MKBox
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress color="error" />
      </MKBox>
    );
  }

  return (
    <Fade in={!isChecking} timeout={600}>
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