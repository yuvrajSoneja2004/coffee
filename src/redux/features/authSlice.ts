import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  name: string;
  role: string;
  userId: string;
  sheetId: string;
  subsheetsIds: {
    CASH: string;
    "DAILY WORK DATA": string;
    "ELEMENTS COMPOSITION": string;
    INVENTORY: string;
    "LIST AND OPTIONS": string;
    "LIST AND OPTIONS A": string;
    MATERIAL: string;
    METEOROLOGICAL: string;
    SPRAY: string;
  };
  slNoStarts: number;
  slNoMaterial: number;
  reloadHandler: number;
}

let initialState: InitialState = {
  name: "",
  role: "",
  userId: "",
  sheetId: "",
  subsheetsIds: {
    CASH: "",
    "DAILY WORK DATA": "",
    "ELEMENTS COMPOSITION": "",
    INVENTORY: "",
    "LIST AND OPTIONS": "",
    "LIST AND OPTIONS A": "",
    MATERIAL: "",
    METEOROLOGICAL: "",
    SPRAY: "",
  },
  // Ignore SLNO for now
  slNoStarts: 1,
  slNoMaterial: 0,
  reloadHandler: 0,
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeAuthInfo(state, action) {
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.sheetId = action.payload.sheetId;
      state.subsheetsIds = action.payload.subsheetsIds;
    },
    handleSlNo(state, action) {
      state.slNoStarts = action.payload.no + 1;
    },
    handleSlNoMaterial(state, action) {
      state.slNoMaterial = action.payload.no;
    },
    handleReload(state, action) {
      state.reloadHandler++;
    },
  },
});

export const { storeAuthInfo, handleSlNo, handleSlNoMaterial, handleReload } =
  auth.actions;
export default auth.reducer;
