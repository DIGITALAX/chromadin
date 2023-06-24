import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HasMoreBuyerHistorysState {
  value: boolean;
}

const initialHasMoreBuyerHistorysState: HasMoreBuyerHistorysState = {
  value: true,
};

export const hasMoreBuyerHistorysSlice = createSlice({
  name: "hasMoreBuyerHistorys",
  initialState: initialHasMoreBuyerHistorysState,
  reducers: {
    setHasMoreBuyerHistorysRedux: (state: HasMoreBuyerHistorysState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setHasMoreBuyerHistorysRedux } = hasMoreBuyerHistorysSlice.actions;

export default hasMoreBuyerHistorysSlice.reducer;
