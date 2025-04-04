import { useState, useEffect, useCallback } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import Header from "components/Header";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MKButton from "components/MKButton";
import Grid from "@mui/material/Grid";
import PeopleIcon from '@mui/icons-material/People';
import HandshakeIcon from '@mui/icons-material/Handshake';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LockIcon from '@mui/icons-material/Lock';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  TablePagination,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TableChart as TableIcon,
  Payment as BillingIcon,
  Person as ProfileIcon,
  Menu as MenuIcon,
  TrendingUp,
  ShoppingCart,
  ThumbUp,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [players, setPlayers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSponsors, setAvailableSponsors] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [signupLinkModalOpen, setSignupLinkModalOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [linkType, setLinkType] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentView, setCurrentView] = useState('dashboard');
  const [registrationTrends, setRegistrationTrends] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [sponsorshipDistribution, setSponsorshipDistribution] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log("Starting to fetch data...");
        
        // Fetch registration status
        const regStatusResponse = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbkregstat/603bee96-f7bc-45f2-ad62-7eba2d4ab90a"
        );

        if (!regStatusResponse.ok) {
          throw new Error("Failed to fetch registration status");
        }

        const regStatusData = await regStatusResponse.json();
        console.log("Registration status:", regStatusData);
        setRegistrationStatus(regStatusData.Status);

        // Fetch players
        console.log("Fetching players...");
        const playersResponse = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbfoundation_players"
        );

        // Fetch sponsors
        console.log("Fetching sponsors...");
        const sponsorsResponse = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbfoundation"
        );

        if (!playersResponse.ok || !sponsorsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const playersData = await playersResponse.json();
        const sponsorsData = await sponsorsResponse.json();

        console.log("Players data:", playersData);
        console.log("Sponsors data:", sponsorsData);

        setPlayers(playersData);
        setSponsors(sponsorsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      console.log("User is authenticated, fetching data...");
      fetchData();
    } else {
      console.log("User is not authenticated, skipping data fetch");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      // Calculate registration trends
      const trends = calculateRegistrationTrends();
      setRegistrationTrends(trends);

      // Calculate payment statistics
      const payments = calculatePaymentStats();
      setPaymentStats(payments);

      // Calculate sponsorship distribution
      const sponsorships = calculateSponsorshipDistribution();
      setSponsorshipDistribution(sponsorships);
    }
  }, [players, sponsors, isAuthenticated]);

  const validatePassword = (pwd) => {
    if (pwd === "H4y^%dew") {
      return "admin";
    } else if (pwd === "We342(;s") {
      return "sponsor";
    }
    return null;
  };

  const handleLogin = () => {
    const role = validatePassword(password);
    if (role) {
      setUserRole(role);
      setIsAuthenticated(true);
      setLoginError("");
      // Set initial view based on role
      setCurrentView(role === "sponsor" ? "players" : "dashboard");
      // Store authentication in session storage
      sessionStorage.setItem("dashboardAuth", JSON.stringify({ role }));
    } else {
      setLoginError("Invalid password. Please try again.");
    }
  };

  useEffect(() => {
    // Check for existing authentication
    const auth = sessionStorage.getItem("dashboardAuth");
    if (auth) {
      const { role } = JSON.parse(auth);
      setUserRole(role);
      setIsAuthenticated(true);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (paymentReference) => {
    return paymentReference ? "success" : "warning";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatCurrency = (amount) => {
    return `GHS ${Number(amount).toLocaleString()}`;
  };

  const playerAmountTemplate = () => {
    return <MKTypography variant="body2">GHS 465</MKTypography>;
  };

  const sponsorAmountTemplate = (rowData) => {
    const amount = rowData.sponsorNumber ? rowData.sponsorNumber / 100 : 0;
    return <MKTypography variant="body2">{formatCurrency(amount)}</MKTypography>;
  };

  const statusBodyTemplate = (rowData) => {
    let status;
    let color;

    if (rowData.Sponsor && rowData.sponsorsID) {
      status = "Sponsored";
      color = "success";
    } else if (rowData.paymentReference) {
      status = "Paid";
      color = "info";
    } else {
      status = "Pending";
      color = "warning";
    }

    return (
      <Chip 
        label={status}
        color={color}
        size="small"
      />
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <MKBox display="flex" alignItems="center">
        <Avatar 
          sx={{ 
            bgcolor: activeTab === 0 ? 'error.main' : 'primary.main',
            width: 40,
            height: 40,
            marginRight: 2
          }}
        >
          {getInitials(rowData.fullName)}
        </Avatar>
        <MKBox>
          <MKTypography variant="subtitle2" fontWeight="medium">
            {rowData.fullName}
          </MKTypography>
          <MKTypography variant="caption" color="text.secondary">
            {rowData.email}
          </MKTypography>
        </MKBox>
      </MKBox>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.created_at).toLocaleDateString();
  };

  const mobileNameBodyTemplate = (rowData) => {
    return (
      <MKBox display="flex" flexDirection="column" gap={1}>
        <MKBox display="flex" alignItems="center" gap={1}>
          <Avatar 
            sx={{ 
              bgcolor: activeTab === 0 ? 'error.main' : 'primary.main',
              width: 32,
              height: 32
            }}
          >
            {getInitials(rowData.fullName)}
          </Avatar>
          <MKTypography variant="subtitle2" fontWeight="medium">
            {rowData.fullName}
          </MKTypography>
        </MKBox>
        <MKBox pl={5}>
          <MKTypography variant="caption" color="text.secondary">
            {rowData.email}
          </MKTypography>
          {activeTab === 0 && (
            <MKTypography variant="caption" display="block" color="text.secondary">
              {rowData.position}
            </MKTypography>
          )}
        </MKBox>
      </MKBox>
    );
  };

  const getVisibleColumns = () => {
    if (isMobile) {
      return ['fullName', 'paymentReference'];
    }
    if (isMobile) {
      return ['fullName', 'paymentReference', 'created_at'];
    }
    return ['fullName', 'position', 'paymentReference', 'Channel', 'created_at'];
  };

  const customStyles = {
    header: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[2],
    },
    card: {
      overflow: 'hidden',
      border: 'none',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2),
    },
    tabs: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1),
      marginBottom: theme.spacing(3),
    },
    table: {
      '& .p-datatable-wrapper': {
        padding: theme.spacing(1),
      },
      '& .p-datatable-header': {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
      },
      '& .p-datatable-tbody > tr > td': {
        padding: {
          xs: theme.spacing(1.5),
          sm: theme.spacing(2),
        },
      },
      '& .p-paginator': {
        padding: theme.spacing(2),
      },
      '& .p-datatable-footer': {
        padding: theme.spacing(2),
      },
    }
  };

  const calculateStats = () => {
    const playerCount = players.length;
    const sponsorCount = sponsors.length;
    
    // Calculate player revenue (GHS 465 per paid player)
    const playerRevenue = players
      .filter(player => player.paymentReference)
      .length * 465;

    // Calculate sponsor revenue (sponsorNumber / 100) only for paid sponsors
    const sponsorRevenue = sponsors
      .filter(sponsor => sponsor.paymentReference) // Only include paid sponsors
      .reduce((total, sponsor) => {
        return total + (sponsor.sponsorNumber ? sponsor.sponsorNumber / 100 : 0);
      }, 0);

    return {
      playerCount,
      sponsorCount,
      playerRevenue,
      sponsorRevenue
    };
  };

  const stats = calculateStats();

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <MKBox
        p={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <MKBox>
          <MKTypography
            variant="button"
            color="text"
            fontWeight="regular"
            opacity={0.7}
          >
            {title}
          </MKTypography>
          <MKTypography
            variant="h4"
            fontWeight="bold"
            sx={{ 
              mt: 1,
              color: color || 'inherit'
            }}
          >
            {value}
          </MKTypography>
        </MKBox>
        <MKBox
          sx={{
            width: 48,
            height: 48,
            backgroundColor: color || 'primary.main',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </MKBox>
      </MKBox>
    </Card>
  );

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const calculateSponsorLimit = (sponsorNumber) => {
    return Math.floor((sponsorNumber || 0) / 46500);
  };

  const sponsorNameTemplate = (rowData) => {
    if (!rowData.sponsorsID) return null;
    const sponsor = sponsors.find(s => s.id === rowData.sponsorsID);
    return sponsor ? sponsor.fullName : 'Unknown';
  };

  const DetailModal = () => {
    if (!selectedRow) return null;

    const isPlayer = activeTab === 0 || activeTab === 2;
    const isTeamMember = activeTab === 2;
    
    const getSponsoredPlayers = () => {
      return players.filter(player => player.sponsorsID === selectedRow.id);
    };

    const getSponsorshipStatus = () => {
      if (!selectedRow.paymentReference) return null;
      const limit = calculateSponsorLimit(selectedRow.sponsorNumber);
      const current = getSponsoredPlayers().length;
      return {
        limit,
        current,
        remaining: limit - current
      };
    };

    const handleSponsorAssignment = async (sponsorId) => {
      try {
        if (sponsorId) {
          const sponsor = sponsors.find(s => s.id === sponsorId);
          const sponsoredCount = players.filter(p => p.sponsorsID === sponsorId).length;
          const sponsorLimit = calculateSponsorLimit(sponsor.sponsorNumber);
          
          if (sponsoredCount >= sponsorLimit) {
            setAssignmentError(`This sponsor has reached their limit of ${sponsorLimit} player${sponsorLimit !== 1 ? 's' : ''}`);
            return;
          }
        }

        setIsAssigning(true);
        setAssignmentError("");

        const response = await fetch(
          `https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/assign/${selectedRow.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              kbfoundation_sponsors_id: sponsorId
            })
          }
        );

        if (!response.ok) {
          throw new Error("Failed to assign sponsor");
        }

        // Refresh the players data
        const updatedPlayersResponse = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbfoundation_players"
        );
        const updatedPlayers = await updatedPlayersResponse.json();
        setPlayers(updatedPlayers);

      } catch (error) {
        setAssignmentError("Failed to assign sponsor. Please try again.");
      } finally {
        setIsAssigning(false);
      }
    };

    const details = isPlayer ? [
      { label: "Full Name", value: selectedRow.fullName },
      { label: "Email", value: selectedRow.email },
      { label: "Date of Birth", value: selectedRow.DOB },
      { label: "Position", value: selectedRow.position },
      { label: "Phone Number", value: selectedRow.phonNumber },
      { label: "Channel", value: selectedRow.Channel },
      { label: "Other Channel", value: selectedRow.otherChannel },
      { label: "Education", value: selectedRow.education },
      { label: "Shirt Size", value: selectedRow.shirtSize },
      { label: "Career Highlight", value: selectedRow.highlight },
      { 
        label: "Status", 
        value: selectedRow.sponsorsID ? "Sponsored" : (selectedRow.paymentReference ? "Paid" : "Pending")
      },
      { 
        label: "Sponsor", 
        value: selectedRow.sponsorsID ? sponsorNameTemplate(selectedRow) : "Not Sponsored"
      },
      { label: "Registration Date", value: new Date(selectedRow.created_at).toLocaleDateString() },
    ] : [
      { label: "Full Name", value: selectedRow.fullName },
      { label: "Email", value: selectedRow.email },
      { label: "Phone Number", value: selectedRow.phoneNumber },
      { label: "Amount", value: formatCurrency(selectedRow.sponsorNumber / 100) },
      { label: "Status", value: selectedRow.paymentReference ? "Paid" : "Pending" },
      { label: "Registration Date", value: new Date(selectedRow.created_at).toLocaleDateString() },
    ];

    return (
      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <MKBox display="flex" alignItems="center" justifyContent="space-between">
            <MKBox display="flex" alignItems="center" gap={2}>
              {selectedRow.image ? (
                <Avatar 
                  src={selectedRow.image.url}
                  sx={{ 
                    width: 56,
                    height: 56,
                    bgcolor: isPlayer ? 'error.main' : 'primary.main',
                    '& img': {
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      width: '100%',
                      height: '100%',
                    }
                  }}
                />
              ) : (
                <Avatar 
                  sx={{ 
                    bgcolor: isPlayer ? 'error.main' : 'primary.main',
                    width: 56,
                    height: 56
                  }}
                >
                  {getInitials(selectedRow.fullName)}
                </Avatar>
              )}
              <MKBox>
                <MKTypography variant="h6">{selectedRow.fullName}</MKTypography>
                <MKTypography variant="caption" color="text.secondary">
                  {isPlayer ? "Player Details" : "Sponsor Details"}
                </MKTypography>
              </MKBox>
            </MKBox>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </MKBox>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {details.map((detail) => (
              detail.value && (
                <Grid item xs={12} key={detail.label}>
                  <MKBox>
                    <MKTypography variant="caption" color="text.secondary">
                      {detail.label}
                    </MKTypography>
                    <MKTypography variant="body1">
                      {detail.value}
                    </MKTypography>
                  </MKBox>
                </Grid>
              )
            ))}

            {/* Sponsored Players Section for Sponsors */}
            {!isPlayer && selectedRow.paymentReference && (
              <Grid item xs={12}>
                <MKBox mt={2}>
                  <MKBox 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center"
                    mb={2}
                  >
                    <MKTypography variant="h6">
                      Sponsored Players
                    </MKTypography>
                    {getSponsorshipStatus() && (
                      <Chip
                        label={`${getSponsorshipStatus().current}/${getSponsorshipStatus().limit} Players`}
                        color={getSponsorshipStatus().remaining > 0 ? "success" : "default"}
                        size="small"
                      />
                    )}
                  </MKBox>
                  {getSponsoredPlayers().length > 0 ? (
                    <Grid container spacing={2}>
                      {getSponsoredPlayers().map((player) => (
                        <Grid item xs={12} sm={6} key={player.id}>
                          <Card 
                                  sx={{ 
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'action.hover',
                                transform: 'translateY(-2px)',
                                transition: 'transform 0.2s',
                              },
                              p: 2,
                                      height: '100%',
                              display: 'flex',
                              alignItems: 'center'
                                  }}
                            onClick={() => handleRowClick(player)}
                          >
                            <Box display="flex" alignItems="center" width="100%">
                                <Avatar 
                                  sx={{ 
                                    bgcolor: 'error.main',
                                    width: 40,
                                  height: 40,
                                  mr: 2
                                  }}
                                >
                                  {getInitials(player.fullName)}
                                </Avatar>
                              <Box flex={1} sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" fontWeight="medium" noWrap>
                                  {player.fullName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  {player.position}
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <MKBox 
                      p={3} 
                      bgcolor="grey.100" 
                      borderRadius="lg"
                      textAlign="center"
                    >
                      <MKTypography variant="body2" color="text.secondary">
                        No players currently sponsored
                      </MKTypography>
                      {getSponsorshipStatus() && (
                        <MKTypography variant="caption" color="text.secondary" display="block" mt={1}>
                          Can sponsor up to {getSponsorshipStatus().limit} player{getSponsorshipStatus().limit !== 1 ? 's' : ''}
                        </MKTypography>
                      )}
                    </MKBox>
                  )}
                </MKBox>
              </Grid>
            )}

            {/* Sponsor Assignment for Players */}
            {isPlayer && !selectedRow.sponsorsID && (
              <Grid item xs={12}>
                <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
                  <InputLabel>Assign Sponsor</InputLabel>
                  <Select
                    value={selectedRow.sponsorsID || ''}
                    onChange={(e) => handleSponsorAssignment(e.target.value)}
                    disabled={isAssigning}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {sponsors
                      .filter(s => s.paymentReference) // Only show paid sponsors
                      .map((sponsor) => {
                        const sponsoredCount = players.filter(p => p.sponsorsID === sponsor.id).length;
                        const sponsorLimit = calculateSponsorLimit(sponsor.sponsorNumber);
                        const isAtLimit = sponsoredCount >= sponsorLimit;
                        
                        return (
                          <MenuItem 
                            key={sponsor.id} 
                            value={sponsor.id}
                            disabled={isAtLimit}
                          >
                            {sponsor.fullName} ({sponsoredCount}/{sponsorLimit} players)
                          </MenuItem>
                        );
                      })}
                  </Select>
                  {assignmentError && (
                    <MKTypography variant="caption" color="error" sx={{ mt: 1 }}>
                      {assignmentError}
                    </MKTypography>
                  )}
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <MKButton onClick={handleCloseModal} color="error">
            Close
          </MKButton>
        </DialogActions>
      </Dialog>
    );
  };

  const handleRegistrationToggle = async () => {
    try {
      setIsStatusLoading(true);
      setStatusError("");

      const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbkregstat/603bee96-f7bc-45f2-ad62-7eba2d4ab90a",
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Status: !registrationStatus
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update registration status");
      }

      const data = await response.json();
      setRegistrationStatus(data.Status);

    } catch (error) {
      setStatusError("Failed to update registration status");
    } finally {
      setIsStatusLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    try {
      setIsGeneratingLink(true);
      const response = await fetch(
        "https://x8ki-letl-twmt.n7.xano.io/api:LfeuGUZr/generate-signup-link",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: linkType
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate signup link");
      }

      const data = await response.json();
      
      // Get the link from the response data
      const link = data.result1 || data.url || data.link;
      
      if (!link) {
        throw new Error("No link received from API");
      }

      // Set the full URL including the base URL if needed
      const baseUrl = window.location.origin; // Get the current origin (e.g., http://localhost:3000)
      const fullLink = link.startsWith('http') ? link : `${baseUrl}/signup/${link}`;
      setGeneratedLink(fullLink);
      
      setSnackbarMessage("Link generated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to generate link. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink).then(
      () => {
        setSnackbarMessage("Link copied to clipboard!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      },
      (err) => {
        setSnackbarMessage("Failed to copy link");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    );
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenSignupLinkModal = () => {
    setSignupLinkModalOpen(true);
    setGeneratedLink("");
    setLinkType("");
  };

  const handleCloseSignupLinkModal = () => {
    setSignupLinkModalOpen(false);
    setGeneratedLink("");
    setLinkType("");
  };

  const SignupLinkModal = () => {
  return (
      <Dialog
        open={signupLinkModalOpen}
        onClose={handleCloseSignupLinkModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <MKBox display="flex" alignItems="center" justifyContent="space-between">
            <MKTypography variant="h6">Generate Signup Link</MKTypography>
            <IconButton onClick={handleCloseSignupLinkModal}>
              <CloseIcon />
            </IconButton>
          </MKBox>
        </DialogTitle>
        <DialogContent dividers>
          <MKBox mb={3}>
            <FormControl fullWidth variant="standard">
              <InputLabel>Link Type</InputLabel>
              <Select
                value={linkType}
                onChange={(e) => setLinkType(e.target.value)}
                disabled={isGeneratingLink}
              >
                <MenuItem value="player">Player</MenuItem>
                <MenuItem value="sponsor">Sponsor</MenuItem>
              </Select>
            </FormControl>
          </MKBox>
          
          <MKTypography variant="caption" color="text.secondary" mb={2}>
            Status: {isGeneratingLink ? 'Generating...' : generatedLink ? 'Link Generated' : 'Waiting'}
          </MKTypography>

          {/* Always show the text field, but disable it when no link */}
          <MKBox mt={3}>
            <TextField
              fullWidth
              label="Generated Link"
              value={generatedLink}
              placeholder="Link will appear here after generation"
              disabled={!generatedLink}
              InputProps={{
                readOnly: true,
                endAdornment: generatedLink && (
                  <IconButton onClick={handleCopyLink} edge="end" size="small">
                    <ContentCopyIcon />
                  </IconButton>
                ),
              }}
            />
            {generatedLink && (
              <MKBox mt={2} display="flex" justifyContent="center">
                <MKButton
                  variant="contained"
                  color="info"
                  onClick={handleCopyLink}
                  startIcon={<ContentCopyIcon />}
                  fullWidth
                >
                  Copy to Clipboard
                </MKButton>
              </MKBox>
            )}
          </MKBox>
        </DialogContent>
        <DialogActions>
          <MKButton onClick={handleCloseSignupLinkModal} color="error">
            Cancel
          </MKButton>
          <MKButton
            onClick={handleGenerateLink}
            color="info"
            disabled={!linkType || isGeneratingLink}
          >
            {isGeneratingLink ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Generate Link"
            )}
          </MKButton>
        </DialogActions>
      </Dialog>
    );
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear authentication from session storage
    sessionStorage.removeItem("dashboardAuth");
    
    // Reset state
    setIsAuthenticated(false);
    setUserRole(null);
    setPassword("");
    setCurrentView('dashboard');

    // Show success message
    setSnackbarMessage("Successfully logged out");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    // Redirect to home page after a short delay
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const sidebarContent = (
    <Box sx={{ 
      width: 250,
      height: '100%',
      bgcolor: 'background.paper',
      p: 2,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pl: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          KBF Dashboard
        </Typography>
        {isMobile && (
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ ml: 'auto' }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <List sx={{ flex: 1 }}>
        {userRole === "admin" && (
          <>
            <ListItem 
              button 
              onClick={() => handleViewChange('dashboard')}
              sx={{ 
                borderRadius: 2,
                mb: 1,
                bgcolor: currentView === 'dashboard' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
              }}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => handleViewChange('players')}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: currentView === 'players' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
              }}
            >
              <ListItemIcon>
                <TableIcon />
              </ListItemIcon>
              <ListItemText primary="Players" />
            </ListItem>
            <ListItem 
              button 
              onClick={() => handleViewChange('sponsors')}
              sx={{ 
                borderRadius: 2,
                mb: 1,
                bgcolor: currentView === 'sponsors' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
              }}
            >
              <ListItemIcon>
                <BillingIcon />
              </ListItemIcon>
              <ListItemText primary="Sponsors" />
            </ListItem>
          </>
        )}
        {userRole === "sponsor" && (
          <ListItem 
            button 
            onClick={() => handleViewChange('players')}
            sx={{
              borderRadius: 2,
              mb: 1,
              bgcolor: currentView === 'players' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
            }}
          >
            <ListItemIcon>
              <TableIcon />
            </ListItemIcon>
            <ListItemText primary="Players" />
          </ListItem>
        )}
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        <ListItem 
          button 
          onClick={handleLogout}
          sx={{ 
            borderRadius: 2,
            color: 'error.main',
            '&:hover': { 
              bgcolor: 'error.light',
              color: 'error.dark'
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: 'inherit' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ 
              fontWeight: 'medium'
            }} 
          />
        </ListItem>
      </List>
    </Box>
  );

  const calculateRegistrationTrends = useCallback(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        players: 0,
        sponsors: 0
      };
    }).reverse();

    players.forEach(player => {
      const playerDate = new Date(player.created_at);
      const monthIndex = last6Months.findIndex(item => 
        item.month === playerDate.toLocaleString('default', { month: 'short' })
      );
      if (monthIndex !== -1) {
        last6Months[monthIndex].players++;
      }
    });

    sponsors.forEach(sponsor => {
      const sponsorDate = new Date(sponsor.created_at);
      const monthIndex = last6Months.findIndex(item => 
        item.month === sponsorDate.toLocaleString('default', { month: 'short' })
      );
      if (monthIndex !== -1) {
        last6Months[monthIndex].sponsors++;
      }
    });

    return last6Months;
  }, [players, sponsors]);

  const calculatePaymentStats = useCallback(() => {
    const playersPaid = players.filter(p => p.paymentReference).length;
    const playersUnpaid = players.length - playersPaid;
    const sponsorsPaid = sponsors.filter(s => s.paymentReference).length;
    const sponsorsUnpaid = sponsors.length - sponsorsPaid;

    return [
      { name: 'Players', paid: playersPaid, unpaid: playersUnpaid },
      { name: 'Sponsors', paid: sponsorsPaid, unpaid: sponsorsUnpaid }
    ];
  }, [players, sponsors]);

  const calculateSponsorshipDistribution = useCallback(() => {
    const positionCounts = {
      'Forward': 0,
      'Midfielder': 0,
      'Defender': 0,
      'Goalkeeper': 0
    };

    const categorizePosition = (position) => {
      if (!position) return 'Unknown';
      position = position.toLowerCase().trim();

      // Forwards/Attackers
      if (position.match(/\b(st|cf|striker|forward|attacker|rw\/cf|lw\/rw|rw|lw)\b/) ||
          position.includes('striker') ||
          position.includes('forward') ||
          position === 'attacker') {
        return 'Forward';
      }

      // Midfielders
      if (position.match(/\b(cam|cdm|cm|dm|winger|midfielder)\b/) ||
          position.includes('midfielder') ||
          position.includes('wing') ||
          position.match(/\b(cm\/cam|cdm\/cam|cm\/cdm)\b/)) {
        return 'Midfielder';
      }

      // Defenders
      if (position.match(/\b(cb|rb|lb|rwb|lwb|rfb|defender)\b/) ||
          position.includes('back') ||
          position.includes('defender') ||
          position.match(/\b(cb\/rb|rb\/cb|lb\/cb)\b/)) {
        return 'Defender';
      }

      // Goalkeepers
      if (position.match(/\b(gk|goalkeeper|keeper)\b/)) {
        return 'Goalkeeper';
      }

      // Handle hybrid positions based on first mentioned role
      if (position.includes('/')) {
        const firstPosition = position.split('/')[0].trim();
        return categorizePosition(firstPosition);
      }

      return 'Unknown';
    };

    players.forEach(player => {
      const category = categorizePosition(player.position);
      if (category !== 'Unknown') {
        positionCounts[category]++;
      }
    });

    return Object.entries(positionCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({
        name,
        value
      }));
  }, [players]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  p: 3, 
                  bgcolor: 'error.main',
                  color: 'white',
                  borderRadius: 2,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Active Players
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {stats.playerCount}
                  </Typography>
                  <Typography variant="body2">
                    Total registered players
                  </Typography>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ShoppingCart />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Revenue
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    GHS {stats.playerRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Total player revenue
                  </Typography>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ThumbUp />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Sponsors
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {stats.sponsorCount}
                  </Typography>
                  <Typography variant="body2">
                    Total sponsors
                  </Typography>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MonetizationOnIcon />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Sponsorships
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    GHS {stats.sponsorRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Total sponsorship revenue
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Graphs Section */}
            <Grid container spacing={3}>
              {/* Registration Trends */}
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Registration Trends
                  </Typography>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart data={registrationTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="players" 
                          stroke="#ff1744" 
                          name="Players"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sponsors" 
                          stroke="#2196f3" 
                          name="Sponsors"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
            </Grid>

              {/* Payment Statistics */}
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Payment Status
                  </Typography>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={paymentStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="paid" name="Paid" fill="#4caf50" />
                        <Bar dataKey="unpaid" name="Unpaid" fill="#ff9800" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
          </Grid>

              {/* Sponsorship Distribution */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Position Distribution
                  </Typography>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={sponsorshipDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sponsorshipDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Recent Activity
                  </Typography>
                  <List>
                    {players.slice(-5).reverse().map((player) => (
                      <ListItem key={player.id} divider>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'error.main' }}>
                            {getInitials(player.fullName)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={player.fullName}
                          secondary={`Registered on ${new Date(player.created_at).toLocaleDateString()}`}
                        />
                        <Chip
                          label={player.paymentReference ? "Paid" : "Pending"}
                          color={player.paymentReference ? "success" : "warning"}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
            </Grid>
          </>
        );

      case 'players':
        if (userRole === 'sponsor') {
          // Add detailed logging for debugging
          console.log("=== Sponsor View Debug Logs ===");
          console.log("1. All players:", players);
          console.log("2. Players with Sponsor field:", players.map(p => ({
            name: p.fullName,
            sponsor: p.Sponsor,
            sponsorId: p.sponsorsID,
            paymentRef: p.paymentReference
          })));
          
          // Use consistent filtering logic
          const sponsoredPlayers = players.filter(player => player.Sponsor === true);
          const regularPlayers = players.filter(player => player.Sponsor !== true);
          console.log("3. Filtered sponsored players:", sponsoredPlayers);
          console.log("4. Filtered regular players:", regularPlayers);

          // Group players by position
          const groupPlayersByPosition = (playersList) => {
            return {
              'Forwards': playersList.filter(p => {
                const pos = p.position?.toLowerCase() || '';
                return ['st', 'cf', 'striker', 'forward', 'attacker', 'rw', 'lw'].includes(pos);
              }),
              'Midfielders': playersList.filter(p => {
                const pos = p.position?.toLowerCase() || '';
                return ['cdm', 'cam', 'winger', 'midfielder', 'dm'].includes(pos);
              }),
              'Defenders': playersList.filter(p => {
                const pos = p.position?.toLowerCase() || '';
                return ['defender', 'cb', 'rb', 'lb'].includes(pos);
              }),
              'Goalkeepers': playersList.filter(p => {
                const pos = p.position?.toLowerCase() || '';
                return pos === 'gk';
              })
            };
          };

          const sponsoredPositions = groupPlayersByPosition(sponsoredPlayers);
          const regularPositions = groupPlayersByPosition(regularPlayers);

          // Add pagination handlers
          const handleChangePage = (event, newPage) => {
            setPage(newPage);
          };

          const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          };

          return (
            <Box>
              <Typography variant="h5" sx={{ mb: 3 }}>Players Management</Typography>
              
              {/* Sponsored Players Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Sponsored Players
                </Typography>
                <Grid container spacing={3}>
                  {Object.entries(sponsoredPositions).map(([position, positionPlayers]) => {
                    // Apply pagination to position players
                    const start = page * rowsPerPage;
                    const paginatedPlayers = positionPlayers.slice(start, start + rowsPerPage);
                    
                    return positionPlayers.length > 0 && (
                      <Grid item xs={12} md={6} key={position}>
                        <Card sx={{ p: 3, height: '100%' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 2,
                            pb: 2,
                            borderBottom: 1,
                            borderColor: 'divider'
                          }}>
                            <Typography variant="h6">{position}</Typography>
                            <Chip 
                              label={`${positionPlayers.length} Player${positionPlayers.length !== 1 ? 's' : ''}`}
                              color="primary"
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                          <Grid container spacing={2}>
                            {paginatedPlayers.map((player) => (
                              <Grid item xs={12} sm={6} key={player.id}>
                                <Card 
                                  sx={{ 
                                    cursor: 'pointer',
                                    '&:hover': {
                                      bgcolor: 'action.hover',
                                      transform: 'translateY(-2px)',
                                      transition: 'transform 0.2s',
                                    },
                                    p: 2,
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  onClick={() => handleRowClick(player)}
                                >
                                  <Box display="flex" alignItems="center" width="100%">
                                    <Avatar 
                                      sx={{ 
                                        bgcolor: 'error.main',
                                        width: 40,
                                        height: 40,
                                        mr: 2
                                      }}
                                    >
                                      {getInitials(player.fullName)}
                                    </Avatar>
                                    <Box flex={1} sx={{ minWidth: 0 }}>
                                      <Typography variant="subtitle2" fontWeight="medium" noWrap>
                                        {player.fullName}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" noWrap>
                                        {player.position}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                          {positionPlayers.length > rowsPerPage && (
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                              <TablePagination
                                component="div"
                                count={positionPlayers.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 15]}
                                showFirstButton
                                showLastButton
                                sx={{
                                  '.MuiTablePagination-actions': {
                                    marginLeft: 2
                                  }
                                }}
                              />
                            </Box>
                          )}
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>

              {/* Regular Players Section - Only show for admin */}
              {userRole !== 'sponsor' && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Regular Players
                </Typography>
                <Grid container spacing={3}>
                  {Object.entries(regularPositions).map(([position, positionPlayers]) => (
                    positionPlayers.length > 0 && (
                        <Grid item xs={12} md={6} key={position}>
                        <Card sx={{ p: 3, height: '100%' }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 2,
                            pb: 2,
                            borderBottom: 1,
                            borderColor: 'divider'
                          }}>
                            <Typography variant="h6">{position}</Typography>
                            <Chip 
                              label={`${positionPlayers.length} Player${positionPlayers.length !== 1 ? 's' : ''}`}
                              color="primary"
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                          <Grid container spacing={2}>
                            {positionPlayers.map((player) => (
                                <Grid item xs={12} sm={6} key={player.id}>
                                <Card 
                                  sx={{ 
                                    cursor: 'pointer',
                                    '&:hover': {
                                      bgcolor: 'action.hover',
                                      transform: 'translateY(-2px)',
                                      transition: 'transform 0.2s',
                                    },
                                      p: 2,
                                      height: '100%',
                                      display: 'flex',
                                      alignItems: 'center'
                                  }}
                                  onClick={() => handleRowClick(player)}
                                >
                                    <Box display="flex" alignItems="center" width="100%">
                                    <Avatar 
                                      sx={{ 
                                        bgcolor: 'primary.main',
                                          width: 40,
                                          height: 40,
                                        mr: 2
                                      }}
                                    >
                                      {getInitials(player.fullName)}
                                    </Avatar>
                                      <Box flex={1} sx={{ minWidth: 0 }}>
                                        <Typography variant="subtitle2" fontWeight="medium" noWrap>
                                        {player.fullName}
                                      </Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap>
                                        {player.position}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Card>
                      </Grid>
                    )
                  ))}
                </Grid>
              </Box>
              )}
            </Box>
          );
        }

        console.log("Rendering admin players view with data:", players);
        return (
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Players Management</Typography>
              {userRole === 'admin' && (
                <MKButton
                  variant="contained"
                  color="error"
                  startIcon={<AddLinkIcon />}
                  onClick={handleOpenSignupLinkModal}
                >
                  Generate Player Link
                </MKButton>
              )}
            </Box>

            {/* Group players by position for admin view */}
            {(() => {
              const groupPlayersByPosition = (playersList) => {
                return {
                  'Forwards': playersList.filter(p => {
                    const pos = p.position?.toLowerCase() || '';
                    return ['st', 'cf', 'striker', 'forward', 'attacker', 'rw', 'lw'].includes(pos);
                  }),
                  'Midfielders': playersList.filter(p => {
                    const pos = p.position?.toLowerCase() || '';
                    return ['cdm', 'cam', 'winger', 'midfielder', 'dm'].includes(pos);
                  }),
                  'Defenders': playersList.filter(p => {
                    const pos = p.position?.toLowerCase() || '';
                    return ['defender', 'cb', 'rb', 'lb'].includes(pos);
                  }),
                  'Goalkeepers': playersList.filter(p => {
                    const pos = p.position?.toLowerCase() || '';
                    return pos === 'gk';
                  })
                };
              };

              const sponsoredPlayers = players.filter(player => player.Sponsor === true);
              const regularPlayers = players.filter(player => player.Sponsor !== true);
              
              const sponsoredPositions = groupPlayersByPosition(sponsoredPlayers);
              const regularPositions = groupPlayersByPosition(regularPlayers);

              return (
                <>
            {/* Sponsored Players Section */}
            <Box sx={{ mb: userRole === 'admin' ? 4 : 0 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {userRole === 'admin' ? 'Sponsored Players' : 'Sponsored Players'}
              </Typography>
                    <Grid container spacing={3}>
                      {Object.entries(sponsoredPositions).map(([position, positionPlayers]) => (
                        positionPlayers.length > 0 && (
                          <Grid item xs={12} md={6} key={position}>
                            <Card sx={{ p: 3, height: '100%' }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: 2,
                                pb: 2,
                                borderBottom: 1,
                                borderColor: 'divider'
                              }}>
                                <Typography variant="h6">{position}</Typography>
                                <Chip 
                                  label={`${positionPlayers.length} Player${positionPlayers.length !== 1 ? 's' : ''}`}
                                  color="primary"
                                  size="small"
                                  sx={{ ml: 2 }}
                                />
                              </Box>
                              <Grid container spacing={2}>
                                {positionPlayers.map((player) => (
                                  <Grid item xs={12} sm={6} key={player.id}>
                                    <Card 
                                      sx={{ 
                                        cursor: 'pointer',
                                        '&:hover': {
                                          bgcolor: 'action.hover',
                                          transform: 'translateY(-2px)',
                                          transition: 'transform 0.2s',
                                        },
                                        p: 2,
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                      onClick={() => handleRowClick(player)}
                                    >
                                      <Box display="flex" alignItems="center" width="100%">
                                        <Avatar 
                                          sx={{ 
                                            bgcolor: 'error.main',
                                            width: 40,
                                            height: 40,
                                            mr: 2
                                          }}
                                        >
                                          {getInitials(player.fullName)}
                                        </Avatar>
                                        <Box flex={1} sx={{ minWidth: 0 }}>
                                          <Typography variant="subtitle2" fontWeight="medium" noWrap>
                                            {player.fullName}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary" noWrap>
                                            {player.position}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Card>
                                  </Grid>
                                ))}
                              </Grid>
                            </Card>
                          </Grid>
                        )
                      ))}
                    </Grid>
            </Box>

                  {/* Regular Players Section - Only show for admin */}
                  {userRole !== 'sponsor' && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Regular Players
              </Typography>
                      <Grid container spacing={3}>
                        {Object.entries(regularPositions).map(([position, positionPlayers]) => (
                          positionPlayers.length > 0 && (
                            <Grid item xs={12} md={6} key={position}>
                              <Card sx={{ p: 3, height: '100%' }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  mb: 2,
                                  pb: 2,
                                  borderBottom: 1,
                                  borderColor: 'divider'
                                }}>
                                  <Typography variant="h6">{position}</Typography>
                                  <Chip 
                                    label={`${positionPlayers.length} Player${positionPlayers.length !== 1 ? 's' : ''}`}
                                    color="primary"
                                    size="small"
                                    sx={{ ml: 2 }}
                                  />
                                </Box>
                                <Grid container spacing={2}>
                                  {positionPlayers.map((player) => (
                                    <Grid item xs={12} sm={6} key={player.id}>
                                      <Card 
                                        sx={{ 
                                          cursor: 'pointer',
                                          '&:hover': {
                                            bgcolor: 'action.hover',
                                            transform: 'translateY(-2px)',
                                            transition: 'transform 0.2s',
                                          },
                                          p: 2,
                                          height: '100%',
                                          display: 'flex',
                                          alignItems: 'center'
                                        }}
                                        onClick={() => handleRowClick(player)}
                                      >
                                        <Box display="flex" alignItems="center" width="100%">
                                          <Avatar 
                                            sx={{ 
                                              bgcolor: 'primary.main',
                                              width: 40,
                                              height: 40,
                                              mr: 2
                                            }}
                                          >
                                            {getInitials(player.fullName)}
                                          </Avatar>
                                          <Box flex={1} sx={{ minWidth: 0 }}>
                                            <Typography variant="subtitle2" fontWeight="medium" noWrap>
                                              {player.fullName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" noWrap>
                                              {player.position}
                                            </Typography>
                                          </Box>
            </Box>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                              </Card>
                            </Grid>
                          )
                        ))}
                      </Grid>
                    </Box>
                  )}
                </>
              );
            })()}
          </Card>
        );

      case 'sponsors':
        console.log("Rendering sponsors view with data:", sponsors);
        return (
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Sponsors Management</Typography>
              <MKButton
                variant="contained"
                color="error"
                startIcon={<AddLinkIcon />}
                onClick={handleOpenSignupLinkModal}
              >
                Generate Sponsor Link
              </MKButton>
            </Box>
              <DataTable 
                value={sponsors} 
                paginator 
              rows={10}
                filterDisplay={isMobile ? "menu" : "row"}
                stripedRows
                responsiveLayout="stack"
                breakpoint="960px"
                emptyMessage="No sponsors found."
                className="custom-datatable"
                onRowClick={(e) => handleRowClick(e.data)}
                rowClassName={() => 'cursor-pointer'}
              >
                <Column 
                  field="fullName" 
                  header="Sponsor" 
                  body={isMobile ? mobileNameBodyTemplate : nameBodyTemplate}
                  sortable 
                  filter
                  filterPlaceholder="Search by name"
                />
                {!isMobile && (
                  <Column 
                    field="phoneNumber" 
                    header="Phone Number" 
                    sortable 
                  />
                )}
                <Column 
                  field="sponsorNumber" 
                  header="Amount" 
                  body={sponsorAmountTemplate}
                  sortable
                />
                <Column 
                  field="paymentReference" 
                  header="Status" 
                  body={statusBodyTemplate}
                  sortable
                />
                {!isMobile && (
                  <Column 
                    field="created_at" 
                    header="Registration Date" 
                    body={dateBodyTemplate}
                    sortable
                  />
                )}
              </DataTable>
          </Card>
        );

      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <MKBox
          sx={{
            backgroundColor: "#f8f9fa",
            minHeight: '100vh',
            paddingTop: { xs: '60px', sm: '70px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Container maxWidth="sm">
            <Card sx={{ p: 4 }}>
              <MKBox textAlign="center" mb={3}>
                <LockIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                <MKTypography variant="h4" mb={1}>
                  Dashboard Access
                </MKTypography>
                <MKTypography variant="body2" color="text">
                  Please enter your password to access the dashboard
                </MKTypography>
              </MKBox>
              
              <MKBox component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <MKBox mb={3}>
                  <MKInput
                    type="password"
                    label="Password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </MKBox>
                {loginError && (
                  <MKTypography color="error" variant="caption" mb={2} display="block">
                    {loginError}
                  </MKTypography>
                )}
                <MKButton
                  variant="contained"
                  color="info"
                  fullWidth
                  type="submit"
                >
                  Access Dashboard
                </MKButton>
              </MKBox>
            </Card>
          </Container>
        </MKBox>
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar 
          position="fixed" 
          sx={{ 
            bgcolor: 'background.paper',
            boxShadow: 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: 'error.main', ml: 2 }}>
              KBF Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: 250 },
          flexShrink: { md: 0 }
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': { width: 250 },
            }}
          >
            {sidebarContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box' },
            }}
            open
          >
            {sidebarContent}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 250px)` },
          mt: { xs: 8, md: 0 },
        }}
      >
        <Container maxWidth="xl">
          {renderMainContent()}
        </Container>
      </Box>

      {/* Modals */}
      <DetailModal />
      <SignupLinkModal />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const styles = `
  .cursor-pointer {
    cursor: pointer;
  }
  .cursor-pointer:hover {
    background-color: rgba(0, 0, 0, 0.04) !important;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Dashboard; 