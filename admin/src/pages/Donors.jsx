import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDonors } from '../store/dataSlice';
import Loading from '../components/Loading';
import axios from 'axios';

const Donors = () => {
  const dispatch = useDispatch();
  const { donors, status } = useSelector((state) => state.data);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodGroup: '',
    medicalFit: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });
  const [dialogContent, setDialogContent] = useState('Are you sure you want to delete this donor?');
  const [showSuccess, setShowSuccess] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const medicalFits = ["Yes", "No"];
  const cities = ["Gujranwala", "Gujrat", "Mandi-Baha-Uddin"];

  useEffect(() => {
    dispatch(fetchDonors());
  }, [dispatch]);

  if (status === 'loading') {
    return <Loading />;
  }

  const handleDeleteClickOpen = (donor) => {
    setSelectedDonor(donor);
    setDialogContent('Are you sure you want to delete this donor?');
    setShowSuccess(false);
    setOpenDeleteDialog(true);
  };

  const handleUpdateClickOpen = (donor) => {
    setSelectedDonor(donor);
    setFormData({
      name: donor.name,
      age: donor.age,
      bloodGroup: donor.bloodGroup,
      medicalFit: donor.medicalFit,
      email: donor.email,
      phone: donor.phone,
      address: donor.address,
      city: donor.city,
    });
    setOpenUpdateDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
    setOpenUpdateDialog(false);
    setSelectedDonor(null);
    setDialogContent('Are you sure you want to delete this donor?');
    setShowSuccess(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://lifeflow-server.up.railway.app/api/donors/${selectedDonor._id}`);
      setDialogContent('Donor deleted successfully');
      setShowSuccess(true);
      dispatch(fetchDonors());
    } catch (error) {
      console.error('Error deleting donor:', error);
      setDialogContent('Failed to delete donor');
      setShowSuccess(true);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://lifeflow-server.up.railway.app/api/donors/${selectedDonor._id}`, formData);
      setOpenUpdateDialog(false);
      dispatch(fetchDonors());
    } catch (error) {
      console.error('Error updating donor:', error);
      alert('Failed to update donor');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Blood Donors</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Medically Fit</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>City</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(donors) && donors.map((donor, index) => (
              <TableRow key={donor._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{donor.name}</TableCell>
                <TableCell>{donor.bloodGroup}</TableCell>
                <TableCell>{donor.age}</TableCell>
                <TableCell>{donor.phone}</TableCell>
                <TableCell>{donor.email}</TableCell>
                <TableCell>{donor.medicalFit}</TableCell>
                <TableCell>{donor.city}</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="edit" onClick={() => handleUpdateClickOpen(donor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" aria-label="delete" onClick={() => handleDeleteClickOpen(donor)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleClose}>
        <DialogTitle>Delete Donor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!showSuccess ? (
            <>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDelete} color="secondary">
                Delete
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateDialog} onClose={handleClose}>
        <DialogTitle>Update Donor</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Age"
            type="number"
            fullWidth
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Blood Group</InputLabel>
            <Select
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              {bloodGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Medically Fit</InputLabel>
            <Select
              label="Medically Fit"
              name="medicalFit"
              value={formData.medicalFit}
              onChange={handleChange}
            >
              {medicalFits.map((fit) => (
                <MenuItem key={fit} value={fit}>
                  {fit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>City</InputLabel>
            <Select
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            >
              {cities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Donors;
