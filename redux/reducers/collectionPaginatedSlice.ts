import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CollectionPaginatedState {
  value: any;
}

const initialCollectionPaginatedState: CollectionPaginatedState = {
  value: {},
};

export const collectionPaginatedSlice = createSlice({
  name: "collectionPaginated",
  initialState: initialCollectionPaginatedState,
  reducers: {
    setCollectionPaginated: (
      state: CollectionPaginatedState,
      action: PayloadAction<any>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCollectionPaginated } = collectionPaginatedSlice.actions;

export default collectionPaginatedSlice.reducer;
