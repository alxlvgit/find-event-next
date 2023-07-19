import { IEvent, ISideBarState } from '@/interfaces/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ISideBarState = {
    dataIsLoading: false,
    events: [],
    visibleEvents: [],
    hasMoreEvents: false,
    searchBarQuery: "",
};

const sidebarSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setSideBarDataLoading: (state, action: PayloadAction<boolean>) => {
            state.dataIsLoading = action.payload;
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
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchBarQuery = action.payload;
        }
    }
});


export const { setSideBarDataLoading, setEvents, setHasMoreEvents, setVisibleEvents, setSearchQuery } = sidebarSlice.actions;

export default sidebarSlice.reducer;

