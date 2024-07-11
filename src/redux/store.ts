import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import authSlice from "./features/authSlice";
import inventoryFilter from "./features/inventoryFilter";

export const store = configureStore({
  reducer: {
    authSlice,
    inventoryFilter,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.getState;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
