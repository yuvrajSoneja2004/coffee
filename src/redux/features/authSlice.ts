import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  name: string;
  role: string;
}

let initialState: InitialState = {
  name: "",
  role: "",
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeAuthInfo(state, action) {
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
  },
});

export const { storeAuthInfo } = auth.actions;
export default auth.reducer;
