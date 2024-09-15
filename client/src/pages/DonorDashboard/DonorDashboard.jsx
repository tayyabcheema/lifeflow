import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  AppBar as MuiAppBar,
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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HistoryIcon from "@mui/icons-material/History";
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

const DonorDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(location.pathname.split("/")[2] || "home");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: "",
    bloodGroup: "",
    medicalFit: "",
    phone: "",
    address: "",
    city: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [newAppointment, setNewAppointment] = useState({
    center: "",
    date: "",
    time: "",
  });
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/LoginPage");
    } else {
      setUser({
        ...user,
        name: storedUser.donorName,
        email: storedUser.donorEmail,
      });
      fetchProfileData(storedUser.donorId);
      fetchAppointments(storedUser.donorId);
      fetchDonationHistory(storedUser.donorId);
    }
    fetchHospitals();

    window.addEventListener("beforeunload", saveLastState);

    return () => {
      window.removeEventListener("beforeunload", saveLastState);
    };
  }, []);

  const saveLastState = () => {
    localStorage.setItem("lastState", JSON.stringify({ path: location.pathname, state: { user, appointments, donationHistory } }));
  };

  const fetchProfileData = async (donorId) => {
    try {
      const response = await axios.get(`https://lifeflow-server.up.railway.app/api/donors/${donorId}`);
      const { data } = response;
      setUser(data.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchAppointments = async (donorId) => {
    try {
      const response = await axios.get(`https://lifeflow-server.up.railway.app/api/appointments/not-completed`);
      const { data } = response;
      const userAppointments = data.filter((appointment) => appointment.donor && appointment.donor._id === donorId);
      setAppointments(userAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchDonationHistory = async (donorId) => {
    try {
      const response = await axios.get(`https://lifeflow-server.up.railway.app/api/appointments/completed`);
      const { data } = response;
      const userCompletedAppointments = data.filter((appointment) => appointment.donor && appointment.donor._id === donorId);
      setDonationHistory(userCompletedAppointments);
    } catch (error) {
      console.error("Error fetching donation history:", error);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await axios.get("https://lifeflow-server.up.railway.app/api/hospitals");
      const { data } = response;
      setHospitals(data.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
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

  const handleProfileUpdate = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    try {
      await axios.put(`https://lifeflow-server.up.railway.app/api/donors/${storedUser.donorId}`, {
        address: user.address,
        city: user.city,
      });
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Error updating profile. Please try again.");
    }
  };

  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();
    if (validateAppointment()) {
      const lastAppointmentDate = new Date(
        Math.max(...appointments.map(a => new Date(a.date)))
      );

      const threeMonthsLater = new Date(lastAppointmentDate);
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

      if (new Date(newAppointment.date) < threeMonthsLater) {
        setErrorMessage("You can only book a new appointment 3 months after your last appointment.");
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await axios.post("https://lifeflow-server.up.railway.app/api/appointments", {
          donorId: storedUser.donorId,
          hospitalId: newAppointment.center,
          date: newAppointment.date,
          time: newAppointment.time,
        });
        setAppointments([...appointments, response.data]);
        setSuccessMessage("Appointment booked successfully!");
        setNewAppointment({ center: "", date: "", time: "" });
      } catch (error) {
        console.error("Error booking appointment:", error);
        setErrorMessage("Error booking appointment. Please try again.");
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    navigate(`/DonorDashboard/${section}`);
  };

  const validateAppointment = () => {
    const errors = {};

    if (!newAppointment.center) errors.center = "Center is required";
    if (!newAppointment.date) errors.date = "Date is required";
    if (!newAppointment.time) errors.time = "Time is required";

    if (newAppointment.date && isDateUnavailable(newAppointment.date)) {
      errors.date = "Appointment already exists on this date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isDateUnavailable = (date) => {
    return appointments.some((appointment) => appointment.date.split("T")[0] === date);
  };

  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
    setErrorMessage("");
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setNewAppointment({ ...newAppointment, date: value });
    if (isDateUnavailable(value)) {
      setErrorMessage("Appointment already exists on this date");
    } else {
      setErrorMessage("");
    }
  };

  const renderHome = () => (
    <Card sx={{ textAlign: "center", mx: "auto", width: "80%" }}>
      <CardContent>
        <Typography variant="h4" component="div" gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="body1" component="div" gutterBottom>
          Thank you for being a valuable part of our community. Your donations help save lives.
          Donating blood is a simple, safe, and quick process that can make a big difference.
          Your contribution is highly appreciated and it plays a vital role in saving lives.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSectionChange("book")}
          sx={{ mt: 3 }}
        >
          Donate Now
        </Button>
      </CardContent>
    </Card>
  );

  const renderProfile = () => (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              name="name"
              value={user.name}
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
              value={user.email}
              variant="outlined"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Age"
              name="age"
              value={user.age}
              variant="outlined"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="bloodGroup-label">Blood Group</InputLabel>
              <Select
                labelId="bloodGroup-label"
                name="bloodGroup"
                value={user.bloodGroup}
                inputProps={{ readOnly: true }}
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <MenuItem key={bg} value={bg}>
                    {bg}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="medicalFit-label">Medically Fit</InputLabel>
              <Select
                labelId="medicalFit-label"
                name="medicalFit"
                value={user.medicalFit}
                inputProps={{ readOnly: true }}
              >
                {["Yes", "No"].map((fit) => (
                  <MenuItem key={fit} value={fit}>
                    {fit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              value={user.phone}
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
              value={user.address}
              variant="outlined"
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                name="city"
                value={user.city}
                onChange={(e) => setUser({ ...user, city: e.target.value })}
              >
                {["Gujranwala", "Gujrat", "Mandi-Baha-Uddin"].map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleProfileUpdate}>
              Update
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderAppointments = () => (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Appointments
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Center Name</TableCell>
                <TableCell>Center Contact</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment, index) => (
                <TableRow key={index}>
                  <TableCell>{appointment.center?.name || "N/A"}</TableCell>
                  <TableCell>{appointment.center?.phone || "N/A"}</TableCell>
                  <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderHistory = () => (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Donation History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Center</TableCell>
                <TableCell>Blood Group</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donationHistory.map((history, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(history.date).toLocaleDateString()}</TableCell>
                  <TableCell>{history.center?.name || "N/A"}</TableCell>
                  <TableCell>{history.donor?.bloodGroup || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderBookAppointment = () => (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Book Appointment
        </Typography>
        <form onSubmit={handleAppointmentSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="center-label">Select Center</InputLabel>
            <Select
              labelId="center-label"
              name="center"
              value={newAppointment.center}
              onChange={handleAppointmentChange}
              required
            >
              {hospitals.map((hospital) => (
                <MenuItem key={hospital._id} value={hospital._id}>
                  {hospital.name}
                </MenuItem>
              ))}
            </Select>
            {formErrors.center && <Typography color="error">{formErrors.center}</Typography>}
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Select Date"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newAppointment.date}
            onChange={handleDateChange}
            required
            inputProps={{
              min: new Date().toISOString().split("T")[0],
            }}
            error={!!formErrors.date}
            helperText={formErrors.date}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Select Time"
            name="time"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={newAppointment.time}
            onChange={handleAppointmentChange}
            required
            error={!!formErrors.time}
            helperText={formErrors.time}
          />
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Book Today
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case "profile":
        return renderProfile();
      case "appointments":
        return renderAppointments();
      case "history":
        return renderHistory();
      case "book":
        return renderBookAppointment();
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
              Donor Dashboard
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
          <List>
            <ListItemButton onClick={() => handleSectionChange("profile")}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
            <ListItemButton onClick={() => handleSectionChange("appointments")}>
              <ListItemIcon>
                <EventNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Appointments" />
            </ListItemButton>
            <ListItemButton onClick={() => handleSectionChange("history")}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Donation History" />
            </ListItemButton>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Routes>
            <Route path="/" element={renderHome()} />
            <Route path="profile" element={renderProfile()} />
            <Route path="appointments" element={renderAppointments()} />
            <Route path="history" element={renderHistory()} />
            <Route path="book" element={renderBookAppointment()} />
          </Routes>
        </Box>
      </Box>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </PrivateRoute>
  );
};

export default DonorDashboard;
