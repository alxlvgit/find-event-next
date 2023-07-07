import { IEvent, ISideBarState } from '@/interfaces/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ISideBarState = {
    sideBarDataLoading: false,
    events: [],
};

const sidebarSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setSideBarDataLoading: (state, action: PayloadAction<boolean>) => {
            state.sideBarDataLoading = action.payload;
        },
        setEvents: (state, action: PayloadAction<IEvent[]>) => {
            state.events = action.payload;
        }
    }
});


export const { setSideBarDataLoading, setEvents } = sidebarSlice.actions;

export default sidebarSlice.reducer;

