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

// Create a Redux slice for inventory filters
const inventoryFilters = createSlice({
  name: "inventoryFilters",
  initialState,
  reducers: {
    // Reducer to set the material list
    setMaterialList(state, action: PayloadAction<string[]>) {
      state.materialListB = action.payload;
    },

    // Reducer to handle filter updates
    handleFilterUpdate(state, action: PayloadAction<boolean>) {
      state.isFilterApplied = action.payload;
    },
  },
});

// Export actions and reducer from the slice
export const { setMaterialList, handleFilterUpdate } = inventoryFilters.actions;
export default inventoryFilters.reducer;
