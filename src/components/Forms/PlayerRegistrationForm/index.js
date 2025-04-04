import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

function PlayerRegistrationForm({ token, linkId }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    DOB: "",
    position: "",
    education: "",
    shirtSize: "",
    channel: "",
    otherChannel: "",
    highlight: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const positions = [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward",
  ];

  const shirtSizes = ["S", "M", "L", "XL", "XXL"];

  const channels = [
    "Social Media",
    "Friend",
    "School",
    "Church",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError("");

      // First, submit the registration
      const registerResponse = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:LfeuGUZr/register-player",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            linkId,
            ...formData,
          }),
        }
      );

      if (!registerResponse.ok) {
        throw new Error("Registration failed. Please try again.");
      }

      // Mark the link as used
      const markUsedResponse = await fetch(
        `https://x8ki-letl-twmt.n7.xano.io/api:LfeuGUZr/kbflinks/${linkId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            used: true
          }),
        }
      );

      if (!markUsedResponse.ok) {
        // Continue despite failure to mark link as used
      }

      setSuccess(true);
      // Redirect to success page after 3 seconds
      setTimeout(() => navigate("/registration-success"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <MKBox textAlign="center" p={3}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Registration successful!
        </Alert>
        <MKTypography variant="body2">
          Redirecting to success page...
        </MKTypography>
      </MKBox>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="DOB"
            type="date"
            value={formData.DOB}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Position</InputLabel>
            <Select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            >
              {positions.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Shirt Size</InputLabel>
            <Select
              name="shirtSize"
              value={formData.shirtSize}
              onChange={handleChange}
              required
            >
              {shirtSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>How did you hear about us?</InputLabel>
            <Select
              name="channel"
              value={formData.channel}
              onChange={handleChange}
              required
            >
              {channels.map((channel) => (
                <MenuItem key={channel} value={channel}>
                  {channel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {formData.channel === "Other" && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Please specify"
              name="otherChannel"
              value={formData.otherChannel}
              onChange={handleChange}
              required
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Career Highlight"
            name="highlight"
            value={formData.highlight}
            onChange={handleChange}
            multiline
            rows={3}
            placeholder="Share your best football achievement or moment"
          />
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <MKButton
            type="submit"
            variant="contained"
            color="info"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </MKButton>
        </Grid>
      </Grid>
    </form>
  );
}

PlayerRegistrationForm.propTypes = {
  token: PropTypes.string.isRequired,
  linkId: PropTypes.string.isRequired,
};

export default PlayerRegistrationForm; 