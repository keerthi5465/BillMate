import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Bill {
  id: number;
  title: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  category: string;
  created_at: string;
  user_id: number;
}

interface BillsState {
  bills: Bill[];
  loading: boolean;
  error: string | null;
}

const initialState: BillsState = {
  bills: [],
  loading: false,
  error: null,
};

const billsSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    fetchBillsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBillsSuccess: (state, action: PayloadAction<Bill[]>) => {
      state.loading = false;
      state.bills = action.payload;
    },
    fetchBillsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addBill: (state, action: PayloadAction<Bill>) => {
      state.bills.push(action.payload);
    },
    updateBill: (state, action: PayloadAction<Bill>) => {
      const index = state.bills.findIndex((bill) => bill.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
    },
    deleteBill: (state, action: PayloadAction<number>) => {
      state.bills = state.bills.filter((bill) => bill.id !== action.payload);
    },
  },
});

export const {
  fetchBillsStart,
  fetchBillsSuccess,
  fetchBillsFailure,
  addBill,
  updateBill,
  deleteBill,
} = billsSlice.actions;

export default billsSlice.reducer; 