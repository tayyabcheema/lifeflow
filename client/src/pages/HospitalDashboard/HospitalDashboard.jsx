import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  Drawer as MuiDrawer,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  AppBar as MuiAppBar,
  Divider,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation, Route, Routes } from "react-router-dom";
import axios from "axios";
import PrivateRoute from "../../PrivateRoute";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBarStyled = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const HospitalDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(location.pathname.split("/")[2] || "home");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [appointmentToComplete, setAppointmentToComplete] = useState(null);
  const [newBloodStock, setNewBloodStock] = useState({ bloodGroup: "", quantity: "" });

  const [appointments, setAppointments] = useState([]);
  const [bloodStock, setBloodStock] = useState([]);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/LoginPage");
    } else {
      setProfileData({
        name: storedUser.hospitalName,
        email: storedUser.hospitalEmail,
      });
      fetchProfileData(storedUser.hospitalId);
      fetchAppointments(storedUser.hospitalId);
      fetchBloodStock(storedUser.hospitalId);
    }
  }, [navigate]);

  const fetchProfileData = async (hospitalId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/hospitals/${hospitalId}`);
      const { data } = response;
      setProfileData(data.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchAppointments = async (hospitalId) => {
    try {
      const response = await axios.get("http://localhost:8000/api/appointments");
      const { data } = response;
      const filteredAppointments = data.filter(appointment => appointment.center && appointment.center._id === hospitalId);
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  

  const fetchBloodStock = async (hospitalId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/blood-stock?hospitalId=${hospitalId}`);
      const { data } = response;
      setBloodStock(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching blood stock:", error);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/LoginPage");
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    navigate(`/HospitalDashboard/${section}`);
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    try {
      await axios.put(`http://localhost:8000/api/hospitals/${storedUser.hospitalId}`, {
        address: profileData.address,
        city: profileData.city,
      });
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Error updating profile. Please try again.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/appointments/${id}/status`, { status: newStatus });
      setAppointments((prev) =>
        prev.map((appointment) => (appointment._id === id ? { ...appointment, status: newStatus } : appointment))
      );
      setSuccessMessage("Appointment status updated successfully!");
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setErrorMessage("Error updating appointment status. Please try again.");
    }
  };

  const handleConfirmComplete = async () => {
    try {
      await axios.put(`http://localhost:8000/api/appointments/${appointmentToComplete}/status`, { status: "Completed" });
      setAppointments((prev) =>
        prev.map((appointment) => (appointment._id === appointmentToComplete ? { ...appointment, status: "Completed" } : appointment))
      );
      setSuccessMessage("Appointment marked as completed!");
      setConfirmDialogOpen(false);
      setAppointmentToComplete(null);
    } catch (error) {
      console.error("Error completing appointment:", error);
      setErrorMessage("Error completing appointment. Please try again.");
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/appointments/${id}`);
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
      setSuccessMessage("Appointment deleted successfully!");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setErrorMessage("Error deleting appointment. Please try again.");
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    try {
      await axios.put(`http://localhost:8000/api/blood-stock/${id}/quantity`, { quantity: newQuantity });
      setBloodStock((prev) =>
        prev.map((stock) => (stock._id === id ? { ...stock, quantity: newQuantity } : stock))
      );
      setSuccessMessage("Blood stock quantity updated successfully!");
    } catch (error) {
      console.error("Error updating blood stock quantity:", error);
      setErrorMessage("Error updating blood stock quantity. Please try again.");
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewBloodStockChange = (e) => {
    const { name, value } = e.target;
    setNewBloodStock((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateBloodStock = async (event) => {
    event.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.post(`http://localhost:8000/api/blood-stock`, {
        hospitalId: storedUser.hospitalId,
        bloodGroup: newBloodStock.bloodGroup,
        quantity: newBloodStock.quantity,
      });
      setSuccessMessage("Blood stock created successfully!");
      fetchBloodStock(storedUser.hospitalId);
      setNewBloodStock({ bloodGroup: "", quantity: "" });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Blood stock already exists for this blood group. Please update the existing stock.");
      } else {
        setErrorMessage("Error creating blood stock. Please try again.");
      }
    }
  };

  const renderHome = () => (
    <Card sx={{ textAlign: 'center', mx: 'auto', width: '80%' }}>
      <CardContent>
        <Typography variant="h4" component="div" gutterBottom>
          Welcome, {profileData.name}!
        </Typography>
        <Typography variant="body1" component="div" gutterBottom>
          Thank you for being a valuable part of our community. Your efforts help save lives.
          Managing blood donations and stocks efficiently is crucial. 
          Your contribution is highly appreciated and it plays a vital role in saving lives.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSectionChange("appointments")}
          sx={{ mt: 3 }}
        >
          Manage Blood Donations
        </Button>
      </CardContent>
    </Card>
  );

  const renderAppointments = () => (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Manage Appointments
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Donor</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.donor.name}</TableCell>
                  <TableCell>{appointment.donor.phone}</TableCell>
                  <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.donor.bloodGroup}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <Select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                        disabled={appointment.status === "Completed"}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Confirmed">Confirmed</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteAppointment(appointment._id)}
                      disabled={appointment.status === "Completed"}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderBloodStock = () => (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Blood Stock
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Blood Group</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bloodStock.map((stock) => (
                <TableRow key={stock._id}>
                  <TableCell>{stock.bloodGroup}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={stock.quantity}
                      onChange={(e) => handleQuantityChange(stock._id, e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderProfile = () => (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Profile
        </Typography>
        <form onSubmit={handleProfileUpdate}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                name="name"
                value={profileData.name}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Email Address"
                name="email"
                value={profileData.email}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Phone"
                name="phone"
                value={profileData.phone}
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                name="address"
                value={profileData.address}
                variant="outlined"
                onChange={handleProfileChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <Select
                  label="City"
                  name="city"
                  value={profileData.city}
                  onChange={handleProfileChange}
                >
                  <MenuItem value="Gujranwala">Gujranwala</MenuItem>
                  <MenuItem value="Gujrat">Gujrat</MenuItem>
                  <MenuItem value="Mandi-Baha-Uddin">Mandi-Baha-Uddin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth type="submit">
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );

  const renderCreateBloodStock = () => (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Create Blood Stock
        </Typography>
        <form onSubmit={handleCreateBloodStock}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <Select
                  label="Blood Group"
                  name="bloodGroup"
                  value={newBloodStock.bloodGroup}
                  onChange={handleNewBloodStockChange}
                  required
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Quantity"
                name="quantity"
                type="number"
                value={newBloodStock.quantity}
                onChange={handleNewBloodStockChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth type="submit">
                Create Blood Stock
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case "appointments":
        return renderAppointments();
      case "bloodstock":
        return renderBloodStock();
      case "profile":
        return renderProfile();
      case "createBloodStock":
        return renderCreateBloodStock();
      default:
        return renderHome();
    }
  };

  return (
    <PrivateRoute>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBarStyled position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Hospital Dashboard
            </Typography>
            <Button color="inherit" onClick={handleLogout} style={{ marginLeft: "auto" }}>
              Logout
            </Button>
          </Toolbar>
        </AppBarStyled>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItemButton onClick={() => handleSectionChange("appointments")}>
              <ListItemIcon>
                <EventNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Appointments" />
            </ListItemButton>
            <ListItemButton onClick={() => handleSectionChange("bloodstock")}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Blood Stock" />
            </ListItemButton>
            <ListItemButton onClick={() => handleSectionChange("profile")}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton onClick={() => handleSectionChange("createBloodStock")}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Create Blood Stock" />
            </ListItemButton>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Routes>
            <Route path="/" element={renderHome()} />
            <Route path="appointments" element={renderAppointments()} />
            <Route path="bloodstock" element={renderBloodStock()} />
            <Route path="profile" element={renderProfile()} />
            <Route path="createBloodStock" element={renderCreateBloodStock()} />
          </Routes>
        </Box>
      </Box>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(false)}
      >
        <Alert onClose={() => setSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
      >
        <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Completion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this appointment as completed? Once marked as completed, it cannot be changed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmComplete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </PrivateRoute>
  );
};

export default HospitalDashboard;
