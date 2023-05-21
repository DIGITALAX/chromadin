import { Publication } from "@/components/Home/types/lens.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DecryptFeedState {
  value: Publication[];
}

const initialDecryptFeedState: DecryptFeedState = {
  value: [],
};

export const decryptFeedSlice = createSlice({
  name: "decryptFeed",
  initialState: initialDecryptFeedState,
  reducers: {
    setDecryptFeedRedux: (
      state: DecryptFeedState,
      action: PayloadAction<Publication[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setDecryptFeedRedux } = decryptFeedSlice.actions;

export default decryptFeedSlice.reducer;
