import { Publication } from "@/components/Home/types/lens.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DecryptProfileFeedState {
  value: Publication[];
}

const initialDecryptProfileFeedState: DecryptProfileFeedState = {
  value: [],
};

export const decryptProfileFeedSlice = createSlice({
  name: "decryptProfileFeed",
  initialState: initialDecryptProfileFeedState,
  reducers: {
    setDecryptProfileFeedRedux: (
      state: DecryptProfileFeedState,
      action: PayloadAction<Publication[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setDecryptProfileFeedRedux } = decryptProfileFeedSlice.actions;

export default decryptProfileFeedSlice.reducer;
