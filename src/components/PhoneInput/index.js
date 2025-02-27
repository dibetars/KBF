import PropTypes from "prop-types";
import MKInput from "components/MKInput";

function PhoneInput({ value, onChange, error, helperText, ...props }) {
  const handleChange = (event) => {
    let phoneNumber = event.target.value.replace(/\D/g, ""); // Remove non-digits

    // Limit to 10 digits (standard phone number)
    phoneNumber = phoneNumber.substring(0, 10);

    // Format: XXX-XXX-XXXX
    if (phoneNumber.length > 0) {
      if (phoneNumber.length > 3) {
        phoneNumber = phoneNumber.slice(0, 3) + phoneNumber.slice(3);
      }
      if (phoneNumber.length > 7) {
        phoneNumber = phoneNumber.slice(0, 7) + phoneNumber.slice(7);
      }
    }

    onChange({
      target: {
        name: props.name,
        value: phoneNumber,
      },
    });
  };

  return (
    <MKInput
      {...props}
      type="tel"
      value={value}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      placeholder="XXX-XXX-XXXX"
    />
  );
}

// Add PropTypes validation
PhoneInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  name: PropTypes.string.isRequired,
};

// Add default props
PhoneInput.defaultProps = {
  value: "",
  error: false,
  helperText: "",
};

export default PhoneInput;
