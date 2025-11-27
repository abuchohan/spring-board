import { createSlice } from '@reduxjs/toolkit'
import { fetchSession, loginUser } from './authThunks'

interface User {
    id: string
    email: string
    name?: string
    avatar?: string
}

interface authSlice {
    isAuthenticated: boolean
    user: User | null
    status: 'idle' | 'checking' | 'authenticated' | 'unauthenticated'
}

const initialState: authSlice = {
    isAuthenticated: false,
    user: null,
    status: 'idle',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearUser(state) {
            state.user = null
            state.status = 'unauthenticated'
            state.isAuthenticated = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSession.pending, (state) => {
                state.status = 'checking'
            })
            .addCase(fetchSession.fulfilled, (state, action) => {
                state.user = action.payload
                state.isAuthenticated = true
                state.status = 'authenticated'
            })
            .addCase(fetchSession.rejected, (state) => {
                state.user = null
                state.isAuthenticated = false
                state.status = 'unauthenticated'
            })
            .addCase(loginUser.pending, () => {})
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.isAuthenticated = true
                state.status = 'authenticated'
            })
            .addCase(loginUser.rejected, (state) => {
                state.status = 'unauthenticated'
            })
    },
})

export const { clearUser } = authSlice.actions
export default authSlice.reducer
