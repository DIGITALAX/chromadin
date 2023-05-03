import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchState {
  value: string;
}

const initialSearchState: SearchState = {
  value: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState: initialSearchState,
  reducers: {
    setSearch: (state: SearchState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setSearch } = searchSlice.actions;

export default searchSlice.reducer;
