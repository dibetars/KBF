import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  DOB: Yup.string()
    .required("Date of birth is required")
    .test("DOB", "Date must be between 1990 and 2009", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date >= new Date("1990-01-01") && date <= new Date("2009-12-31");
    }),
  position: Yup.string().required("Position is required"),
  phonNumber: Yup.string().required("Phone number is required"),
  Channel: Yup.string().required("Please select how you heard about us"),
  otherChannel: Yup.string().when("Channel", {
    is: "Other",
    then: Yup.string().required("Please specify how you heard about us"),
  }),
  education: Yup.string().required("Education level is required"),
  shirtSize: Yup.string().required("Shirt size is required"),
});

const POSITIONS = [
  { value: "GK", label: "Goalkeeper (GK)" },
  { value: "CB", label: "Center-Back (CB)" },
  { value: "FB", label: "Full-Back (LB/RB)" },
  { value: "WB", label: "Wing-Back (LWB/RWB)" },
  { value: "SW", label: "Sweeper (SW)" },
  { value: "CDM", label: "Defensive Midfielder (CDM)" },
  { value: "CM", label: "Central Midfielder (CM)" },
  { value: "CAM", label: "Attacking Midfielder (CAM)" },
  { value: "WM", label: "Wide Midfielder (LM/RM)" },
  { value: "W", label: "Winger (LW/RW)" },
  { value: "ST", label: "Striker (ST)" },
  { value: "CF", label: "Center Forward (CF)" },
  { value: "SS", label: "Second Striker (SS)" },
];

function SignupWithToken() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsLoading(true);
        setError("");

        if (!token) {
          throw new Error("No registration link provided");
        }

        const response = await fetch(
          `https://x8ki-letl-twmt.n7.xano.io/api:LfeuGUZr/kbflinks/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Invalid or expired link");
        }

        const data = await response.json();
        
        if (!data || !data.type) {
          throw new Error("Invalid response from server");
        }

        if (data.used) {
          throw new Error("This registration link has already been used");
        }

        setTokenData(data);
      } catch (err) {
        setError(err.message || "An error occurred while verifying the link");
        setTimeout(() => navigate("/"), 5000);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/check_email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      return !!data.email;
    } catch (err) {
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      DOB: "",
      position: "",
      phonNumber: "",
      Channel: "",
      otherChannel: "",
      education: "",
      shirtSize: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null);

        // Check if email exists before proceeding
        const exists = await checkEmailExists(values.email);
        if (exists) {
          setEmailExists(true);
          setError("This email is already registered. Please use a different email address.");
          setIsSubmitting(false);
          return;
        }

        // Submit registration with token
        const registerResponse = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbfoundation_players",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...values,
              paymentReference: "",
              pId: "",
              Sponsor: false,
              image: null,
              sponsorsID: null
            }),
          }
        );

        if (!registerResponse.ok) {
          throw new Error("Registration failed. Please try again.");
        }

        // Mark token as used
        const markUsedResponse = await fetch(
          `https://x8ki-letl-twmt.n7.xano.io/api:LfeuGUZr/tokenExp/${token}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              type: tokenData.type,
              used: true,
              expires_at: null
            }),
          }
        );

        if (!markUsedResponse.ok) {
          // Failed to mark token as used, but continue with registration success
        }

        // Show success message
        setIsSuccess(true);
        
        // Redirect to success page after 5 seconds
        setTimeout(() => {
          navigate("/registration-success");
        }, 5000);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleEmailBlur = async (e) => {
    const email = e.target.value;
    if (email && formik.touched.email && !formik.errors.email) {
      const exists = await checkEmailExists(email);
      setEmailExists(exists);
      if (exists) {
        formik.setFieldError('email', 'This email is already registered');
      }
    }
  };

  if (isLoading) {
    return (
      <MKBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </MKBox>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <MKBox mt={6}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <MKTypography variant="body2" textAlign="center">
            Redirecting to home page...
          </MKTypography>
        </MKBox>
      </Container>
    );
  }

  if (isSuccess) {
    return (
      <Container maxWidth="sm">
        <MKBox mt={6}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Thank you for submitting your registration! You will be redirected to the success page shortly.
          </Alert>
          <MKTypography variant="body2" textAlign="center">
            Redirecting to success page...
          </MKTypography>
        </MKBox>
      </Container>
    );
  }

  return (
    <MKBox
      minHeight="100vh"
      width="100%"
      sx={{
        backgroundImage: `linear-gradient(rgba(128, 0, 0, 0.8), rgba(128, 0, 0, 0.8)), url('/images/soccer-player.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        py: 4
      }}
    >
      <Container>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card sx={{ p: 4 }}>
              <MKBox textAlign="center" mb={4}>
                <MKTypography variant="h3" mb={1}>
                  Player Registration
                </MKTypography>
                <MKTypography variant="body2" color="text">
                  Please fill in your details below
                </MKTypography>
              </MKBox>

              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <MKInput
                      type="text"
                      label="Full Name"
                      name="fullName"
                      fullWidth
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                      helperText={formik.touched.fullName && formik.errors.fullName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      type="email"
                      label="Email"
                      name="email"
                      fullWidth
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={handleEmailBlur}
                      error={formik.touched.email && (Boolean(formik.errors.email) || emailExists)}
                      helperText={formik.touched.email && (formik.errors.email || (emailExists && "This email is already registered"))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MKInput
                      type="date"
                      label="Date of Birth"
                      name="DOB"
                      fullWidth
                      value={formik.values.DOB}
                      onChange={formik.handleChange}
                      error={formik.touched.DOB && Boolean(formik.errors.DOB)}
                      helperText={formik.touched.DOB && formik.errors.DOB}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={formik.touched.position && Boolean(formik.errors.position)}>
                      <InputLabel>Position</InputLabel>
                      <Select
                        name="position"
                        value={formik.values.position}
                        onChange={formik.handleChange}
                        label="Position"
                      >
                        {POSITIONS.map((pos) => (
                          <MenuItem key={pos.value} value={pos.value}>
                            {pos.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.position && formik.errors.position && (
                        <MKTypography variant="caption" color="error">
                          {formik.errors.position}
                        </MKTypography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      type="tel"
                      label="Phone Number"
                      name="phonNumber"
                      fullWidth
                      value={formik.values.phonNumber}
                      onChange={formik.handleChange}
                      error={formik.touched.phonNumber && Boolean(formik.errors.phonNumber)}
                      helperText={formik.touched.phonNumber && formik.errors.phonNumber}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={formik.touched.Channel && Boolean(formik.errors.Channel)}>
                      <InputLabel>How did you hear about us?</InputLabel>
                      <Select
                        name="Channel"
                        value={formik.values.Channel}
                        onChange={formik.handleChange}
                        label="How did you hear about us?"
                      >
                        <MenuItem value="Social Media">Social Media</MenuItem>
                        <MenuItem value="A Coach">A Coach</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                      {formik.touched.Channel && formik.errors.Channel && (
                        <MKTypography variant="caption" color="error">
                          {formik.errors.Channel}
                        </MKTypography>
                      )}
                    </FormControl>
                  </Grid>
                  {formik.values.Channel === "Other" && (
                    <Grid item xs={12} md={6}>
                      <MKInput
                        type="text"
                        label="Please specify"
                        name="otherChannel"
                        fullWidth
                        value={formik.values.otherChannel}
                        onChange={formik.handleChange}
                        error={formik.touched.otherChannel && Boolean(formik.errors.otherChannel)}
                        helperText={formik.touched.otherChannel && formik.errors.otherChannel}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={formik.touched.education && Boolean(formik.errors.education)}>
                      <InputLabel>Education</InputLabel>
                      <Select
                        name="education"
                        value={formik.values.education}
                        onChange={formik.handleChange}
                        label="Education"
                      >
                        <MenuItem value="Wrote WASSCE">Wrote WASSCE</MenuItem>
                        <MenuItem value="Completed SHS">Completed SHS</MenuItem>
                        <MenuItem value="Currently in SHS">Currently in SHS</MenuItem>
                      </Select>
                      {formik.touched.education && formik.errors.education && (
                        <MKTypography variant="caption" color="error">
                          {formik.errors.education}
                        </MKTypography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={formik.touched.shirtSize && Boolean(formik.errors.shirtSize)}>
                      <InputLabel>Shirt Size</InputLabel>
                      <Select
                        name="shirtSize"
                        value={formik.values.shirtSize}
                        onChange={formik.handleChange}
                        label="Shirt Size"
                      >
                        <MenuItem value="Large">Large</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Small">Small</MenuItem>
                      </Select>
                      {formik.touched.shirtSize && formik.errors.shirtSize && (
                        <MKTypography variant="caption" color="error">
                          {formik.errors.shirtSize}
                        </MKTypography>
                      )}
                    </FormControl>
                  </Grid>
                  {error && (
                    <Grid item xs={12}>
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <MKButton
                      type="submit"
                      variant="gradient"
                      color="error"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Submit Registration"
                      )}
                    </MKButton>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default SignupWithToken;
