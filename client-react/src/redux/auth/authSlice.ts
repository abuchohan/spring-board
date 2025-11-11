import { createSlice } from '@reduxjs/toolkit'

interface authSlice {
    isValidated: boolean
}

const initialState: authSlice = { isValidated: false }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        action() {},
    },
})

export const { action } = authSlice.actions
export default authSlice.reducer
