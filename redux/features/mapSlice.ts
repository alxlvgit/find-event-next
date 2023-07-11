import { IMapState } from "@/interfaces/interfaces";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: IMapState = {
    markersOnScreen: []
};

export const mapSlice = createSlice({
    name: "map",
    initialState,
    reducers: {
        setMarkersOnScreen: (state, action: PayloadAction<string[]>) => {
            state.markersOnScreen = action.payload;
        }
    }
});


export const { setMarkersOnScreen } = mapSlice.actions;

export default mapSlice.reducer;

