import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
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

    fetchData();
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
    return (
      <Chip
        label={rowData.paymentReference ? "Paid" : "Pending"}
        color={getStatusColor(rowData.paymentReference)}
        size="small"
        sx={{
          borderRadius: '16px',
          fontSize: '0.75rem',
          fontWeight: 600
        }}
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

  const DetailModal = () => {
    if (!selectedRow) return null;

    const isPlayer = activeTab === 0;
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
      { label: "Payment Status", value: selectedRow.paymentReference ? "Paid" : "Pending" },
      { label: "Registration Date", value: new Date(selectedRow.created_at).toLocaleDateString() },
    ] : [
      { label: "Full Name", value: selectedRow.fullName },
      { label: "Email", value: selectedRow.email },
      { label: "Phone Number", value: selectedRow.phoneNumber },
      { label: "Amount", value: formatCurrency(selectedRow.sponsorNumber / 100) },
      { label: "Payment Status", value: selectedRow.paymentReference ? "Paid" : "Pending" },
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
              <Avatar 
                sx={{ 
                  bgcolor: isPlayer ? 'error.main' : 'primary.main',
                  width: 56,
                  height: 56
                }}
              >
                {getInitials(selectedRow.fullName)}
              </Avatar>
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
            <MKBox display="flex" justifyContent="space-between" alignItems="center">
              <MKTypography 
                variant={isMobile ? "h4" : "h3"} 
                mb={2}
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
            </MKBox>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={customStyles.tabs}
            >
              <Tab label="Players" />
              <Tab label="Sponsors" />
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
                value={players} 
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
                  filter={!isMobile}
                  filterPlaceholder="Search by name"
                  style={{ minWidth: isMobile ? '200px' : '300px' }}
                />
                {!isMobile && (
                  <Column 
                    field="position" 
                    header="Position" 
                    sortable 
                    filter
                    filterPlaceholder="Search position"
                  />
                )}
                <Column 
                  field="amount" 
                  header="Amount" 
                  body={playerAmountTemplate}
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
                {!isTablet && (
                  <Column 
                    field="Channel" 
                    header="Channel" 
                    sortable 
                    filter
                    filterPlaceholder="Search channel"
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
            ) : (
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
                  filter={!isMobile}
                  filterPlaceholder="Search by name"
                  style={{ minWidth: isMobile ? '200px' : '300px' }}
                />
                {!isMobile && (
                  <Column 
                    field="phoneNumber" 
                    header="Phone Number" 
                    sortable 
                    filter
                    filterPlaceholder="Search phone"
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
            )}
          </Card>
        </Container>
      </MKBox>
      <DetailModal />
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