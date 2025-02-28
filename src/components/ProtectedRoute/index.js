import { useAuth } from 'context/AuthContext';
import { Navigate } from 'react-router-dom';
import MKBox from "components/MKBox";
import CircularProgress from '@mui/material/CircularProgress';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <MKBox
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <CircularProgress color="error" size={40} thickness={4} />
      </MKBox>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute; 