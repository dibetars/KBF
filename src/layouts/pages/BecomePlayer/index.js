import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { initiateMobileMoneyPayment } from 'services/payment';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

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
  age: Yup.number()
    .min(13, "Must be at least 13 years old")
    .max(19, "Must be under 20 years old")
    .required("Age is required"),
  position: Yup.string()
    .oneOf(['goalkeeper', 'defender', 'midfielder', 'forward'], "Please select a valid position")
    .required("Position is required"),
  emailUpdates: Yup.boolean(),
  mobileMoneyProvider: Yup.string()
    .oneOf(['mtn', 'vod', 'atl'], "Please select a valid mobile money provider")
    .required("Mobile money provider is required"),
});

function BecomePlayer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [emailExists, setEmailExists] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const REGISTRATION_FEE_GHS = 465;

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
      phoneNumber: "",
      age: "",
      position: "",
      emailUpdates: false,
      mobileMoneyProvider: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null);
        setPaymentStatus(null);

        // Check if email exists before proceeding
        const exists = await checkEmailExists(values.email);
        if (exists) {
          setEmailExists(true);
          setError("This email is already registered. Please use a different email address.");
          setIsSubmitting(false);
          return;
        }

        // Initiate mobile money payment
        const paymentResponse = await initiateMobileMoneyPayment({
          email: values.email,
          amount: REGISTRATION_FEE_GHS,
          phone: values.phoneNumber,
          provider: values.mobileMoneyProvider
        });

        if (paymentResponse.status) {
          // Submit form data to database
          const response = await fetch(
            "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbfoundation",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...values,
                registrationFee: REGISTRATION_FEE_GHS * 100, // Convert to pesewas
                paymentReference: paymentResponse.data.reference,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to submit application");
          }

          setPaymentStatus({
            type: 'success',
            message: 'Payment initiated successfully. Please check your phone for the payment prompt.',
            reference: paymentResponse.data.reference
          });
          setShowThankYou(true);
        } else {
          throw new Error(paymentResponse.message || "Payment initiation failed");
        }
      } catch (err) {
        setError(err.message);
        setPaymentStatus({
          type: 'error',
          message: err.message
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <>
      <Header />
      <MKBox
        minHeight="100vh"
        width="100%"
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/soccer-feet.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingTop: "70px",
        }}
      >
        <Container>
          <Grid container justifyContent="center" py={6}>
            <Grid item xs={12} md={8} lg={6}>
              <Card sx={{ p: 4 }}>
                <MKTypography variant="h3" textAlign="center" mb={3}>
                  Become a Player
                </MKTypography>
                <form onSubmit={formik.handleSubmit}>
                  <MKBox mb={2}>
                    <MKInput
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                      helperText={formik.touched.fullName && formik.errors.fullName}
                      required
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <MKInput
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
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
                    <MKInput
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={formik.values.age}
                      onChange={formik.handleChange}
                      error={formik.touched.age && Boolean(formik.errors.age)}
                      helperText={formik.touched.age && formik.errors.age}
                      required
                    />
                  </MKBox>
                  <MKBox mb={2}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel shrink>Position</InputLabel>
                      <Select
                        name="position"
                        value={formik.values.position}
                        onChange={formik.handleChange}
                        error={formik.touched.position && Boolean(formik.errors.position)}
                        displayEmpty
                        sx={{
                          height: "43px",
                          "& .MuiSelect-select": {
                            paddingTop: "12px",
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select position
                        </MenuItem>
                        <MenuItem value="goalkeeper">Goalkeeper</MenuItem>
                        <MenuItem value="defender">Defender</MenuItem>
                        <MenuItem value="midfielder">Midfielder</MenuItem>
                        <MenuItem value="forward">Forward</MenuItem>
                      </Select>
                      {formik.touched.position && formik.errors.position && (
                        <MKTypography variant="caption" color="error">
                          {formik.errors.position}
                        </MKTypography>
                      )}
                    </FormControl>
                  </MKBox>

                  <MKBox mb={2}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel shrink>Mobile Money Provider</InputLabel>
                      <Select
                        name="mobileMoneyProvider"
                        value={formik.values.mobileMoneyProvider}
                        onChange={formik.handleChange}
                        error={formik.touched.mobileMoneyProvider && Boolean(formik.errors.mobileMoneyProvider)}
                        displayEmpty
                        sx={{
                          height: "43px",
                          "& .MuiSelect-select": {
                            paddingTop: "12px",
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select provider
                        </MenuItem>
                        <MenuItem value="mtn">MTN Mobile Money</MenuItem>
                        <MenuItem value="vod">Vodafone Cash</MenuItem>
                        <MenuItem value="atl">AirtelTigo Money</MenuItem>
                      </Select>
                      {formik.touched.mobileMoneyProvider && formik.errors.mobileMoneyProvider && (
                        <MKTypography variant="caption" color="error">
                          {formik.errors.mobileMoneyProvider}
                        </MKTypography>
                      )}
                    </FormControl>
                  </MKBox>

                  <MKBox mb={3}>
                    <MKTypography variant="body2" color="text">
                      Registration Fee: GHS {REGISTRATION_FEE_GHS}
                    </MKTypography>
                  </MKBox>

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
                      label="Receive email updates about training and events"
                      sx={{ width: "100%" }}
                    />
                  </MKBox>

                  {error && (
                    <MKTypography color="error" variant="caption" mb={2}>
                      {error}
                    </MKTypography>
                  )}

                  {paymentStatus && (
                    <Alert 
                      severity={paymentStatus.type} 
                      sx={{ mb: 2 }}
                    >
                      {paymentStatus.message}
                    </Alert>
                  )}

                  <MKButton
                    variant="contained"
                    color="error"
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Register Now"
                    )}
                  </MKButton>
                </form>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </MKBox>

      <Dialog
        open={showThankYou}
        onClose={() => setShowThankYou(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <MKBox textAlign="center" py={4}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <MKTypography variant="h4" mb={2}>
              Thank You for Registering!
            </MKTypography>
            <MKTypography variant="body1" mb={3}>
              Your application has been submitted successfully. Please check your phone for the mobile money payment prompt to complete your registration.
            </MKTypography>
            {paymentStatus?.reference && (
              <MKTypography variant="caption" color="text.secondary">
                Reference: {paymentStatus.reference}
              </MKTypography>
            )}
          </MKBox>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}

export default BecomePlayer;
