import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';

function RegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <MKBox
        minHeight="100vh"
        width="100%"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-design-system/assets/img/city-profile.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Card
          sx={{
            p: 4,
            mx: { xs: 2, lg: 3 },
            mt: 8,
            mb: 8,
            backgroundColor: ({ palette: { white }, functions: { rgba } }) => rgba(white.main, 0.8),
            backdropFilter: "saturate(200%) blur(30px)",
            boxShadow: ({ boxShadows: { xxl } }) => xxl,
            textAlign: "center",
          }}
        >
          <MKBox
            component={CheckCircleIcon}
            color="success"
            sx={{ fontSize: 64, mb: 2 }}
          />
          <MKTypography variant="h3" mb={1}>
            Registration Successful!
          </MKTypography>
          <MKTypography variant="body1" color="text" mb={4}>
            Thank you for registering. We will review your application and contact you soon.
          </MKTypography>
          <MKButton
            variant="contained"
            color="info"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
          >
            Return to Home
          </MKButton>
        </Card>
      </MKBox>
    </Container>
  );
}

export default RegistrationSuccess; 