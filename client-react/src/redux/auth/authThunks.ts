import { createAsyncThunk } from '@reduxjs/toolkit'
import { clearUser } from './authSlice'

// fetch session
export const fetchSession = createAsyncThunk(
    'auth/fetchSession',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/me', {
                credentials: 'include',
            })

            if (!res.ok) {
                const error = await res.json()
                return rejectWithValue(error || 'Unauthenticated')
            }

            const data = await res.json()
            return data.user
        } catch (err) {
            return rejectWithValue(err || 'Network error')
        }
    }
)

// register user
export const registerUser = createAsyncThunk(
    'auth/RegisterUser',
    async (
        { email, password }: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                const error = await res.json()
                return rejectWithValue(error || 'Error')
            }

            const data = await res.json()
            return data
        } catch (err) {
            return rejectWithValue(err || 'Network error')
        }
    }
)

// login user
export const loginUser = createAsyncThunk(
    'auth/LoginUser',
    async (
        { email, password }: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                const error = await res.json()
                return rejectWithValue(error || 'Error')
            }

            const data = await res.json()
            return data
        } catch (err) {
            return rejectWithValue(err || 'Network error')
        }
    }
)

// logout user
export const logoutUser = createAsyncThunk(
    'auth/LogoutUser',
    async (_, { dispatch, rejectWithValue }) => {
        dispatch(clearUser())

        try {
            const res = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })

            if (!res.ok) {
                const error = await res.json()
                return rejectWithValue(error || 'Error')
            }

            //TODO how are we going to check if the user has logged out or if there is a problem
            return true
        } catch (err) {
            return rejectWithValue(err || 'Network error')
        }
    }
)

// reset password
export const ResetPassword = createAsyncThunk(
    'auth/ResetPassword',
    async ({ email }: { email: string }, { rejectWithValue }) => {
        try {
            const res = await fetch(
                'http://localhost:5000/api/auth/reset-password',
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                }
            )

            if (!res.ok) {
                const error = await res.json()
                return rejectWithValue(error || 'Error')
            }

            const data = await res.json()
            return data
        } catch (err) {
            return rejectWithValue(err || 'Network error')
        }
    }
)

// validate reset token
export const validateResetToken = createAsyncThunk(
    'auth/validateResetToken',
    async (resetToken: string, { rejectWithValue }) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/auth/reset-password/${resetToken}/validate`
            )

            if (!res.ok) {
                const error = await res.json()
                return rejectWithValue(error || 'Invalid token')
            }

            return true
        } catch (err) {
            return rejectWithValue(err || 'Network error')
        }
    }
)

// reset password with token
export const ResetPasswordToken = createAsyncThunk(
    'auth/ResetPasswordToken',
    async (
        { password, resetToken }: { password: string; resetToken?: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/auth/reset-password/${resetToken}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ password }),
                }
            )

            if (!res.ok) {
                const error = await res.json()
                return rejectWithValue(error || 'Error')
            }

            const data = await res.json()
            return data
        } catch (err) {
            return rejectWithValue(err || 'Network error')
        }
    }
)
