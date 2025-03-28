import { useState, useEffect } from "react";
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

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
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
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordAttempts, setPasswordAttempts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch registration status
        const regStatusResponse = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbkregstat/603bee96-f7bc-45f2-ad62-7eba2d4ab90a"
        );

        if (!regStatusResponse.ok) {
          throw new Error("Failed to fetch registration status");
        }

        const regStatusData = await regStatusResponse.json();
        setRegistrationStatus(regStatusData.Status);

        // Fetch players
        const playersResponse = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbfoundation_players"
        );

        // Fetch sponsors
        const sponsorsResponse = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/kbfoundation"
        );

        if (!playersResponse.ok || !sponsorsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const playersData = await playersResponse.json();
        const sponsorsData = await sponsorsResponse.json();

        setPlayers(playersData);
        setSponsors(sponsorsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = () => {
    if (password === "H4y^%dew") {
      setIsAuthenticated(true);
      setPasswordError("");
      // Store in session storage to maintain authentication during the session
      sessionStorage.setItem("dashboardAuthenticated", "true");
    } else {
      setPasswordAttempts(prevAttempts => prevAttempts + 1);
      setPasswordError("Incorrect password. Please try again.");
      
      // Lock for 30 seconds after 5 attempts
      if (passwordAttempts >= 4) {
        setPasswordError("Too many incorrect attempts. Please try again in 30 seconds.");
        setPassword("");
        setTimeout(() => {
          setPasswordAttempts(0);
          setPasswordError("");
        }, 30000);
      }
    }
  };

  // Check for existing authentication on component mount
  useEffect(() => {
    const authenticated = sessionStorage.getItem("dashboardAuthenticated") === "true";
    setIsAuthenticated(authenticated);
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

    if (activeTab === 0) { // Unsponsored Players
      status = rowData.paymentReference ? "Paid" : "Pending";
      color = rowData.paymentReference ? "info" : "warning";
    } else if (activeTab === 1) { // Sponsors
      status = rowData.paymentReference ? "Paid" : "Pending";
      color = rowData.paymentReference ? "success" : "warning";
    } else { // Team (Sponsored Players)
      status = rowData.sponsorsID ? "Sponsored" : "Available";
      color = rowData.sponsorsID ? "success" : "info";
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
    if (isTablet) {
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
      { 
        label: "Status", 
        value: selectedRow.sponsorsID ? "Sponsored" : (selectedRow.paymentReference ? "Paid" : "Pending")
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
                        <Grid item xs={12} key={player.id}>
                          <Card sx={{ p: 2 }}>
                            <MKBox display="flex" alignItems="center" gap={2}>
                              {player.image ? (
                                <Avatar 
                                  src={player.image.url}
                                  sx={{ 
                                    width: 40,
                                    height: 40,
                                    bgcolor: 'error.main',
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
                                    bgcolor: 'error.main',
                                    width: 40,
                                    height: 40
                                  }}
                                >
                                  {getInitials(player.fullName)}
                                </Avatar>
                              )}
                              <MKBox>
                                <MKTypography variant="body2" fontWeight="medium">
                                  {player.fullName}
                                </MKTypography>
                                <MKTypography variant="caption" color="text.secondary">
                                  {player.position}
                                </MKTypography>
                              </MKBox>
                            </MKBox>
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

            {/* Only show sponsor assignment for Team tab */}
            {isTeamMember && !selectedRow.sponsorsID && (
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
              
              <MKBox component="form" onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }}>
                <MKBox mb={3}>
                  <MKInput
                    type="password"
                    label="Password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!passwordError}
                    disabled={passwordAttempts >= 5}
                  />
                  {passwordError && (
                    <MKTypography variant="caption" color="error">
                      {passwordError}
                    </MKTypography>
                  )}
                </MKBox>
                <MKButton
                  variant="gradient"
                  color="error"
                  fullWidth
                  type="submit"
                  disabled={!password || passwordAttempts >= 5}
                >
                  Login
                </MKButton>
              </MKBox>
            </Card>
          </Container>
        </MKBox>
      </>
    );
  }

  return (
    <>
      <Header />
      <MKBox
        sx={{
          backgroundColor: "#f8f9fa",
          minHeight: '100vh',
          paddingTop: { xs: '60px', sm: '70px' },
          paddingBottom: { xs: '20px', sm: '30px' },
        }}
      >
        <Container maxWidth="xl">
          <MKBox sx={customStyles.header} mb={3}>
            <MKBox 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={2}
            >
              <MKTypography 
                variant={isMobile ? "h4" : "h3"} 
                mb={{ xs: 1, sm: 2 }}
                sx={{ 
                  fontSize: { 
                    xs: '1.5rem', 
                    sm: '2rem', 
                    md: '2.5rem' 
                  } 
                }}
              >
                Dashboard
              </MKTypography>
              <MKBox 
                display="flex" 
                alignItems="center" 
                gap={2}
                sx={{
                  backgroundColor: 'background.paper',
                  padding: 2,
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <MKButton
                  variant="contained"
                  color="info"
                  startIcon={<AddLinkIcon />}
                  onClick={handleOpenSignupLinkModal}
                >
                  Generate Signup Link
                </MKButton>
                <FormControlLabel
                  control={
                    <Switch
                      checked={registrationStatus}
                      onChange={handleRegistrationToggle}
                      disabled={isStatusLoading}
                      color="primary"
                    />
                  }
                  label={
                    <MKTypography variant="button" fontWeight="regular">
                      {registrationStatus ? "Registration Open" : "Registration Closed"}
                    </MKTypography>
                  }
                />
                {isStatusLoading && (
                  <CircularProgress size={20} />
                )}
                {statusError && (
                  <MKTypography variant="caption" color="error">
                    {statusError}
                  </MKTypography>
                )}
              </MKBox>
            </MKBox>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={customStyles.tabs}
            >
              <Tab label="Players" />
              <Tab label="Sponsors" />
              <Tab label="Team" />
            </Tabs>
          </MKBox>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Players"
                value={stats.playerCount}
                icon={<PeopleIcon sx={{ color: 'white' }} />}
                color="error.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Sponsors"
                value={stats.sponsorCount}
                icon={<HandshakeIcon sx={{ color: 'white' }} />}
                color="info.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Players Revenue"
                value={`GHS ${stats.playerRevenue.toLocaleString()}`}
                icon={<MonetizationOnIcon sx={{ color: 'white' }} />}
                color="success.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Sponsors Revenue"
                value={`GHS ${stats.sponsorRevenue.toLocaleString()}`}
                icon={<MonetizationOnIcon sx={{ color: 'white' }} />}
                color="warning.main"
              />
            </Grid>
          </Grid>

          <Card sx={customStyles.card}>
            {isLoading ? (
              <MKBox p={3} textAlign="center">
                <MKTypography variant="body1">Loading data...</MKTypography>
              </MKBox>
            ) : error ? (
              <MKBox p={3} textAlign="center" color="error">
                <MKTypography variant="body1">{error}</MKTypography>
              </MKBox>
            ) : activeTab === 0 ? (
              <DataTable 
                value={players.filter(player => !player.Sponsor)} 
                paginator 
                rows={isMobile ? 5 : 10}
                filterDisplay={isMobile ? "menu" : "row"}
                stripedRows
                responsiveLayout="stack"
                breakpoint="960px"
                emptyMessage="No players found."
                className="custom-datatable"
                style={{ 
                  fontSize: isMobile ? '0.875rem' : '1rem',
                }}
                sx={customStyles.table}
                onRowClick={(e) => handleRowClick(e.data)}
                rowClassName={() => 'cursor-pointer'}
              >
                <Column 
                  field="fullName" 
                  header="Player" 
                  body={isMobile ? mobileNameBodyTemplate : nameBodyTemplate}
                  sortable 
                  filter
                  filterPlaceholder="Search by name"
                  style={{ minWidth: isMobile ? '200px' : '300px' }}
                />
                {!isMobile && (
                  <Column 
                    field="position" 
                    header="Position" 
                    sortable 
                  />
                )}
                <Column 
                  field="paymentReference" 
                  header="Status" 
                  body={statusBodyTemplate}
                  sortable
                  style={{ width: isMobile ? '100px' : '150px' }}
                />
                {!isTablet && (
                  <Column 
                    field="Channel" 
                    header="Channel" 
                    sortable 
                  />
                )}
                {!isMobile && (
                  <Column 
                    field="created_at" 
                    header="Registration Date" 
                    body={dateBodyTemplate}
                    sortable
                  />
                )}
              </DataTable>
            ) : activeTab === 1 ? (
              <DataTable 
                value={sponsors} 
                paginator 
                rows={isMobile ? 5 : 10}
                filterDisplay={isMobile ? "menu" : "row"}
                stripedRows
                responsiveLayout="stack"
                breakpoint="960px"
                emptyMessage="No sponsors found."
                className="custom-datatable"
                style={{ 
                  fontSize: isMobile ? '0.875rem' : '1rem',
                }}
                sx={customStyles.table}
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
                  style={{ minWidth: isMobile ? '200px' : '300px' }}
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
                  style={{ width: '150px' }}
                />
                <Column 
                  field="paymentReference" 
                  header="Status" 
                  body={statusBodyTemplate}
                  sortable
                  style={{ width: isMobile ? '100px' : '150px' }}
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
            ) : (
              <DataTable 
                value={players.filter(player => player.Sponsor)}
                paginator 
                rows={isMobile ? 5 : 10}
                filterDisplay={isMobile ? "menu" : "row"}
                stripedRows
                responsiveLayout="stack"
                breakpoint="960px"
                emptyMessage="No players found."
                className="custom-datatable"
                style={{ 
                  fontSize: isMobile ? '0.875rem' : '1rem',
                }}
                sx={customStyles.table}
                onRowClick={(e) => handleRowClick(e.data)}
                rowClassName={() => 'cursor-pointer'}
              >
                <Column 
                  field="fullName" 
                  header="Player" 
                  body={isMobile ? mobileNameBodyTemplate : nameBodyTemplate}
                  sortable 
                  filter
                  filterPlaceholder="Search by name"
                  style={{ minWidth: isMobile ? '200px' : '300px' }}
                />
                {!isMobile && (
                  <Column 
                    field="position" 
                    header="Position" 
                    sortable 
                  />
                )}
                <Column 
                  field="paymentReference" 
                  header="Status" 
                  body={statusBodyTemplate}
                  sortable
                  style={{ width: isMobile ? '100px' : '150px' }}
                />
                {!isTablet && (
                  <Column 
                    field="Channel" 
                    header="Channel" 
                    sortable 
                  />
                )}
                {!isMobile && (
                  <Column 
                    field="created_at" 
                    header="Registration Date" 
                    body={dateBodyTemplate}
                    sortable
                  />
                )}
              </DataTable>
            )}
          </Card>
        </Container>
      </MKBox>
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
    </>
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