import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser, getCurrentUser, updateUser } from '../components/Api/Api'

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await loginUser(userData)
    return response.user
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUser(userData)
    return response.user
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null

    const response = await getCurrentUser(token)
    return response.user
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
    }
    return rejectWithValue({
      message: error.response?.data?.message || 'Session check failed',
      status: error.response?.status,
    })
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    const response = await updateUser(userData, auth.token)
    return response.user
  } catch (error) {
    return rejectWithValue(error)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: false,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      state.isAuthenticated = false
      state.user = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = false
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        if (action.payload.errors) {
          state.error = {
            errors: action.payload.errors,
          }
        }
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = false
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload.errors
          ? {
              errors: {
                username: action.payload.errors.username,
                email: action.payload.errors.email,
              },
            }
          : action.payload
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true
        state.error = false
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        localStorage.removeItem('token')
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = false
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        if (action.payload?.errors) {
          state.error = {
            errors: action.payload.errors,
          }
        } else {
          state.error = {
            message: action.payload.message,
          }
        }
      })
  },
})
export const { logout } = authSlice.actions
export default authSlice.reducer
