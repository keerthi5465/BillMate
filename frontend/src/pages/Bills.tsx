import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { RootState } from '../store';
import {
  fetchBillsStart,
  fetchBillsSuccess,
  fetchBillsFailure,
  addBill,
  updateBill,
  deleteBill,
} from '../store/slices/billsSlice';

const categories = [
  'Utilities',
  'Rent',
  'Insurance',
  'Entertainment',
  'Transportation',
  'Food',
  'Other',
];

const Bills: React.FC = () => {
  const dispatch = useDispatch();
  const { bills, loading, error } = useSelector((state: RootState) => state.bills);
  const { token } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    due_date: '',
    category: '',
  });

  useEffect(() => {
    fetchBills();
  }, [dispatch, token]);

  const fetchBills = async () => {
    dispatch(fetchBillsStart());
    try {
      const response = await axios.get('http://localhost:8000/bills/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchBillsSuccess(response.data));
    } catch (err: any) {
      dispatch(fetchBillsFailure(err.response?.data?.detail || 'Failed to fetch bills'));
    }
  };

  const handleOpen = (bill?: any) => {
    if (bill) {
      setEditingBill(bill);
      setFormData({
        title: bill.title,
        description: bill.description,
        amount: bill.amount.toString(),
        due_date: format(new Date(bill.due_date), 'yyyy-MM-dd'),
        category: bill.category,
      });
    } else {
      setEditingBill(null);
      setFormData({
        title: '',
        description: '',
        amount: '',
        due_date: '',
        category: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBill(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const billData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    try {
      if (editingBill) {
        const response = await axios.put(
          `http://localhost:8000/bills/${editingBill.id}`,
          billData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(updateBill(response.data));
      } else {
        const response = await axios.post(
          'http://localhost:8000/bills/',
          billData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(addBill(response.data));
      }
      handleClose();
    } catch (err: any) {
      console.error('Error saving bill:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/bills/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(deleteBill(id));
    } catch (err: any) {
      console.error('Error deleting bill:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Bills</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add New Bill
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.title}</TableCell>
                <TableCell>${bill.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {format(new Date(bill.due_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{bill.category}</TableCell>
                <TableCell>{bill.status}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleOpen(bill)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(bill.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingBill ? 'Edit Bill' : 'Add New Bill'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Due Date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              margin="normal"
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingBill ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bills; 