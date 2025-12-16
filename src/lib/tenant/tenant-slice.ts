import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tenant } from '@/types';

export interface TenantState {
  tenant: Tenant | null;
  status: 'idle' | 'loading' | 'active' | 'suspended' | 'pending' | 'error';
  error?: string;
}

const initialState: TenantState = {
  tenant: null,
  status: 'idle',
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant(state, action: PayloadAction<Tenant | null>) {
      state.tenant = action.payload;
      state.status = action.payload?.status || 'idle';
      state.error = undefined;
    },
    setTenantStatus(state, action: PayloadAction<TenantState['status']>) {
      state.status = action.payload;
    },
    setTenantError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'error';
    },
    clearTenant(state) {
      state.tenant = null;
      state.status = 'idle';
      state.error = undefined;
    },
  },
});

export const { setTenant, setTenantStatus, setTenantError, clearTenant } = tenantSlice.actions;
export default tenantSlice.reducer;
