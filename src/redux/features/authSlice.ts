import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  name: string;
  role: string;
  slNoStarts: number;
  slNoMaterial: number;
  reloadHandler: number;
}

let initialState: InitialState = {
  name: "",
  role: "",
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
    },
    handleSlNo(state, action) {
      console.log(action.payload.no - 1, "action");
      state.slNoStarts = action.payload.no - 1;
    },
    handleSlNoMaterial(state, action) {
      console.log(action.payload.no - 1, "action");
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
