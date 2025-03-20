import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

function PlayerRegistration() {
  const [registrationStatus, setRegistrationStatus] = useState(true);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState("");
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const response = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/registration_status"
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch registration status");
        }
        
        const data = await response.json();
        setIsRegistrationOpen(data.isOpen);
      } catch (error) {
        // Error handling
        setIsRegistrationOpen(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRegistrationStatus();
  }, []);

  return (
    <>
      <Header />
      <MKBox
        minHeight="100vh"
        width="100%"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid
            container
            item
            xs={12}
            lg={8}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            sx={{ mx: "auto", textAlign: "center" }}
          >
            <MKTypography
              variant="h1"
              color="white"
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            >
              Player Registration
            </MKTypography>
            <MKTypography
              variant="body1"
              color="white"
              opacity={0.8}
              mt={1}
              mb={3}
            >
              Join KB Foundation's Football Academy
            </MKTypography>
          </Grid>
        </Container>
        <Container>
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={12} sm={10} md={8}>
              <Card>
                <MKBox
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                  mx={2}
                  mt={-3}
                  p={3}
                  mb={1}
                  textAlign="center"
                >
                  <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    Registration Form
                  </MKTypography>
                </MKBox>
                <MKBox pt={4} pb={3} px={3}>
                  {isLoading ? (
                    <MKBox display="flex" justifyContent="center" p={3}>
                      <CircularProgress />
                    </MKBox>
                  ) : statusError ? (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {statusError}
                    </Alert>
                  ) : !isRegistrationOpen ? (
                    <Alert 
                      severity="info" 
                      sx={{ 
                        mb: 3,
                        '& .MuiAlert-message': {
                          fontSize: '1rem',
                          textAlign: 'center',
                          width: '100%'
                        }
                      }}
                    >
                      <MKTypography variant="h6" mb={1}>
                        Registration is Currently Closed
                      </MKTypography>
                      <MKTypography variant="body2">
                        Thank you for your interest. Player registration is currently closed. 
                        Please check back later or contact us for more information.
                      </MKTypography>
                    </Alert>
                  ) : (
                    <MKBox component="form" role="form">
                      {/* Your existing form components */}
                    </MKBox>
                  )}
                </MKBox>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </MKBox>
      <Footer />
    </>
  );
}

export default PlayerRegistration; 