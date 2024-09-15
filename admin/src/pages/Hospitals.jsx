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
import { fetchHospitals } from '../store/dataSlice';
import Loading from '../components/Loading';
import axios from 'axios';

const Hospitals = () => {
  const dispatch = useDispatch();
  const { hospitals, status } = useSelector((state) => state.data);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });
  const [dialogContent, setDialogContent] = useState('Are you sure you want to delete this hospital?');
  const [showSuccess, setShowSuccess] = useState(false);

  const cities = ["Gujranwala", "Gujrat", "Mandi-Baha-Uddin"];

  useEffect(() => {
    dispatch(fetchHospitals());
  }, [dispatch]);

  if (status === 'loading') {
    return <Loading />;
  }

  const handleDeleteClickOpen = (hospital) => {
    setSelectedHospital(hospital);
    setDialogContent('Are you sure you want to delete this hospital?');
    setShowSuccess(false);
    setOpenDeleteDialog(true);
  };

  const handleUpdateClickOpen = (hospital) => {
    setSelectedHospital(hospital);
    setFormData({
      name: hospital.name,
      email: hospital.email,
      phone: hospital.phone,
      address: hospital.address,
      city: hospital.city,
    });
    setOpenUpdateDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
    setOpenUpdateDialog(false);
    setSelectedHospital(null);
    setDialogContent('Are you sure you want to delete this hospital?');
    setShowSuccess(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://lifeflow-server.up.railway.app/api/hospitals/${selectedHospital._id}`);
      setDialogContent('Hospital deleted successfully');
      setShowSuccess(true);
      dispatch(fetchHospitals());
    } catch (error) {
      console.error('Error deleting hospital:', error);
      setDialogContent('Failed to delete hospital');
      setShowSuccess(true);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://lifeflow-server.up.railway.app/api/hospitals/${selectedHospital._id}`, formData);
      setOpenUpdateDialog(false);
      dispatch(fetchHospitals());
    } catch (error) {
      console.error('Error updating hospital:', error);
      alert('Failed to update hospital');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Hospitals</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>City</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(hospitals) && hospitals.map((hospital, index) => (
              <TableRow key={hospital._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{hospital.name}</TableCell>
                <TableCell>{hospital.email}</TableCell>
                <TableCell>{hospital.phone}</TableCell>
                <TableCell>{hospital.address}</TableCell>
                <TableCell>{hospital.city}</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="edit" onClick={() => handleUpdateClickOpen(hospital)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" aria-label="delete" onClick={() => handleDeleteClickOpen(hospital)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleClose}>
        <DialogTitle>Delete Hospital</DialogTitle>
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
        <DialogTitle>Update Hospital</DialogTitle>
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

export default Hospitals;
