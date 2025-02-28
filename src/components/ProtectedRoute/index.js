import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import MKBox from "components/MKBox";
import CircularProgress from '@mui/material/CircularProgress';

function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Add a small delay to prevent flash
      await new Promise(resolve => setTimeout(resolve, 300));
      const auth = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(auth);
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
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
        <CircularProgress 
          color="error"
          size={40}
          thickness={4}
        />
      </MKBox>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute; 