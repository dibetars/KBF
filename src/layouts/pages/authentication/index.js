import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import Header from "components/Header";
import { useEffect } from "react";

function Authentication() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (isAuth === "true") {
      navigate("/dashboard");
    }
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

    // Hardcoded credentials check
    if (credentials.username === "levi" && credentials.password === "#r5439:2fgs") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
    setIsLoading(false);
  };

  return (
    <>
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
                    />
                  </MKBox>
                  {error && (
                    <MKTypography
                      variant="caption"
                      color="error"
                      textAlign="center"
                      display="block"
                      mb={2}
                    >
                      {error}
                    </MKTypography>
                  )}
                  <MKButton
                    variant="contained"
                    color="error"
                    fullWidth
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </MKButton>
                </form>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </MKBox>
    </>
  );
}

export default Authentication; 