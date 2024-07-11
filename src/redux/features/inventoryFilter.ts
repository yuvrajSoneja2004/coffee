import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for your state
interface InventoryFiltersState {
  materialListB: string[];
  isFilterApplied: boolean;
}

// Define the initial state using that type
const initialState: InventoryFiltersState = {
  materialListB: [],
  isFilterApplied: false,
};

const inventoryFilters = createSlice({
  name: "inventoryFilters",
  initialState,
  reducers: {
    setMaterialList(state, action: PayloadAction<string[]>) {
      state.materialListB = action.payload;
    },
    handleFilterUpdate(state, action: PayloadAction<string[]>) {
      state.isFilterApplied = action.payload;
    },
  },
});

export const { setMaterialList, handleFilterUpdate } = inventoryFilters.actions;
export default inventoryFilters.reducer;
