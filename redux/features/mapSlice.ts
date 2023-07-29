import { IMapState } from "@/interfaces/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IMapState = {
  markersOnScreen: [],
  activePopup: null,
  selectedClassification: "",
  sortSelection: "relevance,desc",
  showMap: false,
  showSearchButton: false,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMarkersOnScreen: (state, action: PayloadAction<string[]>) => {
      state.markersOnScreen = action.payload;
    },
    setActivePopup: (state, action: PayloadAction<string | null>) => {
      state.activePopup = action.payload;
    },
    setSelectedClassification: (state, action: PayloadAction<string>) => {
      state.selectedClassification = action.payload;
    },
    setSortSelection: (state, action: PayloadAction<string>) => {
      state.sortSelection = action.payload;
    },
    setShowMap: (state, action: PayloadAction<boolean>) => {
      state.showMap = action.payload;
    },
    setShowSearchButton: (state, action: PayloadAction<boolean>) => {
      state.showSearchButton = action.payload;
    },
  },
});

export const {
  setMarkersOnScreen,
  setActivePopup,
  setSelectedClassification,
  setSortSelection,
  setShowMap,
  setShowSearchButton,
} = mapSlice.actions;

export default mapSlice.reducer;
