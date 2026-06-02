import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AdminUser } from '../api/authApi';

interface AuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  admin: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ admin: AdminUser }>) => {
      state.admin = action.payload.admin;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
