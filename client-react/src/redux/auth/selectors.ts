import type { RootState } from '../store'

export const authSelectors = {
    isAuthenticated: (state: RootState) => state.auth.isAuthenticated,
    status: (state: RootState) => state.auth.status,
    user: (state: RootState) => state.auth.user,
    slice: (state: RootState) => state.auth,
}
