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
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Header from "components/Header";
import Footer from "components/Footer";
import PaystackPop from "@paystack/inline-js";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  DOB: Yup.string().required("Date of birth is required"),
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

function BecomePlayer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handlePaystackPopup = (access_code) => {
    const popup = new PaystackPop();
    popup.resumeTransaction(access_code);
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

        // Submit form data to database
        const response = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbfoundation_players",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to submit application");
        }

        // Get the response with payment access code
        const data = await response.json();
        if (data.paymentKey.response.result.data.access_code) {
          // Initialize Paystack popup with access code, player ID and reference
          handlePaystackPopup(
            data.paymentKey.response.result.data.access_code,
            data.result1.id,
            data.paymentKey.response.result.data.reference
          );
        } else {
          throw new Error("Payment initialization failed");
        }
      } catch (err) {
        setError(err.message);
        setIsSubmitting(false);
      }
    },
  });

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
        <MKBox
          flex={1}
          width="100%"
          sx={{
            backgroundImage: `linear-gradient(rgba(128, 0, 0, 0.8), rgba(128, 0, 0, 0.8)), url('/images/soccer-player.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Container>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <MKTypography variant="h1" color="white" mb={3}>
                  Become a Player
                </MKTypography>
                <MKTypography variant="body1" color="white" mb={4}>
                  Join our program and take your soccer career to the next level. Fill out the
                  application form to get started on your journey.
                </MKTypography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, backdropFilter: "saturate(200%) blur(30px)" }}>
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
                        type="email"
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        required
                      />
                    </MKBox>
                    <MKBox mb={2}>
                      <MKInput
                        fullWidth
                        type="date"
                        label="Date of Birth"
                        name="DOB"
                        value={formik.values.DOB}
                        onChange={formik.handleChange}
                        error={formik.touched.DOB && Boolean(formik.errors.DOB)}
                        helperText={formik.touched.DOB && formik.errors.DOB}
                        required
                      />
                    </MKBox>
                    <MKBox mb={2}>
                      <MKInput
                        fullWidth
                        label="Position"
                        name="position"
                        value={formik.values.position}
                        onChange={formik.handleChange}
                        error={formik.touched.position && Boolean(formik.errors.position)}
                        helperText={formik.touched.position && formik.errors.position}
                        required
                      />
                    </MKBox>
                    <MKBox mb={2}>
                      <MKInput
                        fullWidth
                        label="Phone Number"
                        name="phonNumber"
                        value={formik.values.phonNumber}
                        onChange={formik.handleChange}
                        error={formik.touched.phonNumber && Boolean(formik.errors.phonNumber)}
                        helperText={formik.touched.phonNumber && formik.errors.phonNumber}
                        required
                      />
                    </MKBox>
                    <MKBox mb={2}>
                      <FormControl fullWidth variant="standard">
                        <InputLabel shrink>How did you hear about us?</InputLabel>
                        <Select
                          name="Channel"
                          value={formik.values.Channel}
                          onChange={formik.handleChange}
                          error={formik.touched.Channel && Boolean(formik.errors.Channel)}
                          displayEmpty
                          sx={{
                            height: "43px",
                            "& .MuiSelect-select": {
                              paddingTop: "12px",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select an option
                          </MenuItem>
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
                    </MKBox>
                    {formik.values.Channel === "Other" && (
                      <MKBox mb={2}>
                        <MKInput
                          fullWidth
                          label="Please specify"
                          name="otherChannel"
                          value={formik.values.otherChannel}
                          onChange={formik.handleChange}
                          error={formik.touched.otherChannel && Boolean(formik.errors.otherChannel)}
                          helperText={formik.touched.otherChannel && formik.errors.otherChannel}
                        />
                      </MKBox>
                    )}
                    <MKBox mb={2}>
                      <FormControl fullWidth variant="standard">
                        <InputLabel shrink>Education Level</InputLabel>
                        <Select
                          name="education"
                          value={formik.values.education}
                          onChange={formik.handleChange}
                          error={formik.touched.education && Boolean(formik.errors.education)}
                          displayEmpty
                          sx={{
                            height: "43px",
                            "& .MuiSelect-select": {
                              paddingTop: "12px",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select your education level
                          </MenuItem>
                          <MenuItem value="Wrote WASSCE">Wrote WASSCE</MenuItem>
                          <MenuItem value="Currently in SHS">Currently in SHS</MenuItem>
                          <MenuItem value="Completed SHS">Completed SHS</MenuItem>
                        </Select>
                        {formik.touched.education && formik.errors.education && (
                          <MKTypography variant="caption" color="error">
                            {formik.errors.education}
                          </MKTypography>
                        )}
                      </FormControl>
                    </MKBox>
                    <MKBox mb={2}>
                      <FormControl fullWidth variant="standard">
                        <InputLabel shrink>Shirt Size</InputLabel>
                        <Select
                          name="shirtSize"
                          value={formik.values.shirtSize}
                          onChange={formik.handleChange}
                          error={formik.touched.shirtSize && Boolean(formik.errors.shirtSize)}
                          displayEmpty
                          sx={{
                            height: "43px",
                            "& .MuiSelect-select": {
                              paddingTop: "12px",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select your shirt size
                          </MenuItem>
                          <MenuItem value="Small">Small</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="Large">Large</MenuItem>
                        </Select>
                        {formik.touched.shirtSize && formik.errors.shirtSize && (
                          <MKTypography variant="caption" color="error">
                            {formik.errors.shirtSize}
                          </MKTypography>
                        )}
                      </FormControl>
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
                      {isSubmitting ? "Processing..." : "Submit Application"}
                    </MKButton>
                  </form>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </MKBox>
      </MKBox>
      <Footer />
    </>
  );
}

export default BecomePlayer;
