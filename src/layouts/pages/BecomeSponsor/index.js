import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PaystackPop from "@paystack/inline-js";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Header from "components/Header";
import Footer from "components/Footer";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import PhoneInput from "components/PhoneInput";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Form validation schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters")
    .min(2, "Name is too short")
    .max(50, "Name is too long")
    .required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\+?[0-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),
  sponsorNumber: Yup.number()
    .min(1, "Must sponsor at least 1 player")
    .max(10, "Maximum 10 players per sponsor")
    .required("Number of players is required"),
  emailUpdates: Yup.boolean(),
});

function BecomeSponsor() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [emailExists, setEmailExists] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const PRICE_PER_PLAYER_USD = 30;
  const USD_TO_GHS_RATE = 15.5;

  const calculateTotalPrice = (numberOfPlayers) => {
    return numberOfPlayers * PRICE_PER_PLAYER_USD;
  };

  const calculatePaystackAmount = (numberOfPlayers) => {
    // Convert USD to GHS and then to pesewas
    const amountUSD = calculateTotalPrice(numberOfPlayers);
    const amountGHS = amountUSD * USD_TO_GHS_RATE;
    return Math.round(amountGHS * 100); // Convert to pesewas and round to whole number
  };

  const handlePaystackPopup = (access_code) => {
    const popup = new PaystackPop();
    popup.resumeTransaction(access_code);
  };

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
      return !!data.email; // Returns true if email exists, false otherwise
    } catch (err) {
      // Error occurred while checking email
      return false;
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      sponsorNumber: "",
      emailUpdates: false,
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
          setError("This email is already registered as a sponsor. Please use a different email address.");
          setIsSubmitting(false);
          return;
        }

        // Submit form data to database with amount in pesewas
        const response = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbfoundation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...values,
              sponsorNumber: calculatePaystackAmount(values.sponsorNumber), // Only send GHS amount in pesewas
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to submit application");
        }

        // Get the response with payment access code
        const data = await response.json();
        if (data.paymentKey.response.result.data.access_code) {
          handlePaystackPopup(data.paymentKey.response.result.data.access_code);
        } else {
          throw new Error("Payment initialization failed");
        }
      } catch (err) {
        setError(err.message);
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
        formik.setFieldError('email', 'This email is already registered as a sponsor');
      }
    }
  };

  // Generate array of numbers 1-10 for select options
  const playerOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const ThankYouModal = () => (
    <Dialog 
      open={showThankYou} 
      onClose={() => setShowThankYou(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        <MKBox 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          textAlign="center" 
          py={3}
        >
          <CheckCircleIcon 
            sx={{ 
              fontSize: 64, 
              color: 'success.main',
              mb: 2 
            }} 
          />
          <MKTypography variant="h4" mb={2}>
            Thank You for Your Sponsorship!
          </MKTypography>
          <MKTypography variant="body1" color="text.secondary" mb={3}>
            Your generous support will help make a difference in young athletes' lives. 
            We'll send you updates about your sponsored players via email.
          </MKTypography>
          <MKButton 
            variant="contained" 
            color="error" 
            onClick={() => setShowThankYou(false)}
          >
            Close
          </MKButton>
        </MKBox>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Header />
      <MKBox
        sx={{
          paddingTop: "60px",
          minHeight: "calc(100vh - 60px)", // Subtract header height
          display: "flex",
          flexDirection: "column",
        }}
        bgcolor="white"
      >
        <Container
          sx={{
            py: 6,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MKTypography variant="h2" mb={3}>
                Become a Sponsor
              </MKTypography>
              <MKTypography variant="body1" color="text" mb={4}>
                Your support can change a young athlete&apos;s life. Fill out the form below to
                start your sponsorship journey.
              </MKTypography>
              <Card sx={{ p: 3 }}>
                <form onSubmit={formik.handleSubmit}>
                  <MKBox mb={2}>
                    <MKInput
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                      helperText={formik.touched.fullName && formik.errors.fullName}
                      required
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      fullWidth
                      type="email"
                      label="Email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={(e) => {
                        formik.handleBlur(e);
                        handleEmailBlur(e);
                      }}
                      error={
                        (formik.touched.email && Boolean(formik.errors.email)) ||
                        emailExists
                      }
                      helperText={
                        (formik.touched.email && formik.errors.email) ||
                        (emailExists && "This email is already registered as a sponsor")
                      }
                      required
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <PhoneInput
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                      helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                      required
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel shrink>Number of Players to Sponsor</InputLabel>
                      <Select
                        name="sponsorNumber"
                        value={formik.values.sponsorNumber}
                        onChange={formik.handleChange}
                        error={formik.touched.sponsorNumber && Boolean(formik.errors.sponsorNumber)}
                        displayEmpty
                        sx={{
                          height: "43px",
                          "& .MuiSelect-select": {
                            paddingTop: "12px",
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select number of players
                        </MenuItem>
                        {playerOptions.map((number) => (
                          <MenuItem key={number} value={number}>
                            {number} Player{number > 1 ? "s" : ""} - ${calculateTotalPrice(number)}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.sponsorNumber && formik.errors.sponsorNumber && (
                        <MKTypography variant="caption" color="error">
                          {formik.errors.sponsorNumber}
                        </MKTypography>
                      )}
                    </FormControl>
                  </MKBox>

                  {formik.values.sponsorNumber && (
                    <MKBox mb={3}>
                      <MKTypography variant="body2" color="text">
                        Total Sponsorship Amount: $
                        {calculateTotalPrice(formik.values.sponsorNumber)} USD (₵
                        {(
                          calculateTotalPrice(formik.values.sponsorNumber) * USD_TO_GHS_RATE
                        ).toFixed(2)}{" "}
                        GHS)
                      </MKTypography>
                    </MKBox>
                  )}

                  <MKBox mb={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="emailUpdates"
                          checked={formik.values.emailUpdates}
                          onChange={(e) => {
                            formik.handleChange(e);
                            formik.setFieldValue("emailUpdates", e.target.checked);
                          }}
                          onBlur={formik.handleBlur}
                          color="error"
                        />
                      }
                      label="Receive email updates about sponsored players"
                      sx={{ width: "100%" }}
                    />
                  </MKBox>
                  {error && (
                    <MKTypography color="error" variant="caption" mb={2}>
                      {error}
                    </MKTypography>
                  )}
                  <MKButton
                    type="submit"
                    variant="contained"
                    color="error"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Sponsor Now"}
                  </MKButton>
                </form>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} display="flex" alignItems="center">
              <MKBox
                component="img"
                src="/images/sponsor-image.jpg"
                alt="Young soccer player"
                sx={{
                  width: "100%",
                  height: "100%",
                  maxHeight: "600px",
                  objectFit: "cover",
                  borderRadius: "xl",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </MKBox>
      <ThankYouModal />
      <Footer />
    </>
  );
}

export default BecomeSponsor;
