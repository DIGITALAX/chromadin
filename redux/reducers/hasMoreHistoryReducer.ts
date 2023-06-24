import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HasMoreHistorysState {
  value: boolean;
}

const initialHasMoreHistorysState: HasMoreHistorysState = {
  value: true,
};

export const hasMoreHistorysSlice = createSlice({
  name: "hasMoreHistorys",
  initialState: initialHasMoreHistorysState,
  reducers: {
    setHasMoreHistorysRedux: (state: HasMoreHistorysState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setHasMoreHistorysRedux } = hasMoreHistorysSlice.actions;

export default hasMoreHistorysSlice.reducer;
