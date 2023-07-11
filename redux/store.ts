import { configureStore } from '@reduxjs/toolkit';
import sidebarSlice from './features/sidebarSlice';
import mapSlice from './features/mapSlice';

export const store = configureStore({
    reducer: {
        sidebarSlice,
        mapSlice
    }
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
