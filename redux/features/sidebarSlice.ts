import { IEvent, ISideBarState } from '@/interfaces/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ISideBarState = {
    sideBarDataLoading: false,
    events: [],
    visibleEvents: [],
    hasMoreEvents: false,
    markersOnScreen: []
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
        },
        setVisibleEvents: (state, action: PayloadAction<IEvent[]>) => {
            state.visibleEvents = action.payload;
        },
        setHasMoreEvents: (state, action: PayloadAction<boolean>) => {
            state.hasMoreEvents = action.payload;
        },
        setMarkersOnScreen: (state, action: PayloadAction<string[]>) => {
            state.markersOnScreen = action.payload;
        }
    }
});


export const { setSideBarDataLoading, setEvents, setHasMoreEvents, setVisibleEvents, setMarkersOnScreen } = sidebarSlice.actions;

export default sidebarSlice.reducer;

