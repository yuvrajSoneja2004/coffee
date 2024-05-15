import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  name: string;
  role: string;
  slNoStarts: number;
}

let initialState: InitialState = {
  name: "",
  role: "",
  slNoStarts: 0,
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
      state.slNoStarts = action.payload.no;
    },
  },
});

export const { storeAuthInfo, handleSlNo } = auth.actions;
export default auth.reducer;
