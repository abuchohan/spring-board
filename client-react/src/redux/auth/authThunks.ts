import { createAsyncThunk } from '@reduxjs/toolkit'
import { clearUser } from './authSlice'

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
