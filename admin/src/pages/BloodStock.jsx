import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBloodStock } from '../store/dataSlice';
import Loading from '../components/Loading';

const BloodStock = () => {
  const dispatch = useDispatch();
  const { bloodStock, status } = useSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchBloodStock());
  }, [dispatch]);

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Blood Stock</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hospital Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Group</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bloodStock.map((stock, index) => (
              <TableRow key={stock._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{stock.hospital?.name || "N/A"}</TableCell>
                <TableCell>{stock.bloodGroup}</TableCell>
                <TableCell>{stock.quantity}  units</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BloodStock;







// import React, { useEffect, useState } from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import IconButton from '@mui/material/IconButton';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchBloodStock } from '../store/dataSlice';
// import Loading from '../components/Loading';
// import axios from 'axios';

// const BloodStock = () => {
//   const dispatch = useDispatch();
//   const { bloodStock, status } = useSelector((state) => state.data);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
//   const [selectedStock, setSelectedStock] = useState(null);
//   const [formData, setFormData] = useState({
//     hospital: '',
//     bloodGroup: '',
//     quantity: '',
//   });
//   const [dialogContent, setDialogContent] = useState('Are you sure you want to delete this blood stock entry?');
//   const [showSuccess, setShowSuccess] = useState(false);

//   const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

//   useEffect(() => {
//     dispatch(fetchBloodStock());
//   }, [dispatch]);

//   if (status === 'loading') {
//     return <Loading />;
//   }

//   const handleDeleteClickOpen = (stock) => {
//     setSelectedStock(stock);
//     setDialogContent('Are you sure you want to delete this blood stock entry?');
//     setShowSuccess(false);
//     setOpenDeleteDialog(true);
//   };

//   const handleUpdateClickOpen = (stock) => {
//     setSelectedStock(stock);
//     setFormData({
//       hospital: stock.hospital._id,
//       bloodGroup: stock.bloodGroup,
//       quantity: stock.quantity,
//     });
//     setOpenUpdateDialog(true);
//   };

//   const handleClose = () => {
//     setOpenDeleteDialog(false);
//     setOpenUpdateDialog(false);
//     setSelectedStock(null);
//     setDialogContent('Are you sure you want to delete this blood stock entry?');
//     setShowSuccess(false);
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`http://localhost:8000/api/blood-stock/${selectedStock._id}`);
//       setDialogContent('Blood stock entry deleted successfully');
//       setShowSuccess(true);
//       dispatch(fetchBloodStock());
//     } catch (error) {
//       console.error('Error deleting blood stock entry:', error);
//       setDialogContent('Failed to delete blood stock entry');
//       setShowSuccess(true);
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(`http://localhost:8000/api/blood-stock/${selectedStock._id}`, formData);
//       setOpenUpdateDialog(false);
//       dispatch(fetchBloodStock());
//     } catch (error) {
//       console.error('Error updating blood stock entry:', error);
//       alert('Failed to update blood stock entry');
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Blood Stock</h2>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Hospital Name</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Blood Group</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {bloodStock.map((stock, index) => (
//               <TableRow key={stock._id}>
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell>{stock.hospital?.name || "N/A"}</TableCell>
//                 <TableCell>{stock.bloodGroup}</TableCell>
//                 <TableCell>{stock.quantity}</TableCell>
//                 <TableCell>
//                   <IconButton color="primary" aria-label="edit" onClick={() => handleUpdateClickOpen(stock)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton color="secondary" aria-label="delete" onClick={() => handleDeleteClickOpen(stock)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog open={openDeleteDialog} onClose={handleClose}>
//         <DialogTitle>Delete Blood Stock Entry</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             {dialogContent}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           {!showSuccess ? (
//             <>
//               <Button onClick={handleClose} color="primary">
//                 Cancel
//               </Button>
//               <Button onClick={handleDelete} color="secondary">
//                 Delete
//               </Button>
//             </>
//           ) : (
//             <Button onClick={handleClose} color="primary">
//               Close
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>

//       <Dialog open={openUpdateDialog} onClose={handleClose}>
//         <DialogTitle>Update Blood Stock Entry</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="dense">
//             <InputLabel>Blood Group</InputLabel>
//             <Select
//               label="Blood Group"
//               name="bloodGroup"
//               value={formData.bloodGroup}
//               onChange={handleChange}
//             >
//               {bloodGroups.map((bg) => (
//                 <MenuItem key={bg} value={bg}>
//                   {bg}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <TextField
//             margin="dense"
//             label="Quantity"
//             type="number"
//             fullWidth
//             name="quantity"
//             value={formData.quantity}
//             onChange={handleChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleUpdate} color="primary">
//             Update
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default BloodStock;
