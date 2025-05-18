import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  fetchBillsStart,
  fetchBillsSuccess,
  fetchBillsFailure,
} from '../store/slices/billsSlice';
import axios from 'axios';
import { RootState } from '../store';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { bills, loading, error } = useSelector((state: RootState) => state.bills);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
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

    fetchBills();
  }, [dispatch, token]);

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingBills = bills.filter((bill) => bill.status === 'pending');
  const overdueBills = bills.filter((bill) => bill.status === 'overdue');

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
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Bills
            </Typography>
            <Typography component="p" variant="h4">
              ${totalAmount.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Pending Bills
            </Typography>
            <Typography component="p" variant="h4">
              {pendingBills.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="error" gutterBottom>
              Overdue Bills
            </Typography>
            <Typography component="p" variant="h4">
              {overdueBills.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Bills
            </Typography>
            {bills.slice(0, 5).map((bill) => (
              <Box key={bill.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  {bill.title} - ${bill.amount.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due: {format(new Date(bill.due_date), 'MMM dd, yyyy')}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 