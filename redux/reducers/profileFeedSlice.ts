import { Publication } from "@/components/Home/types/lens.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProfileFeedState {
  value: Publication[];
}

const initialProfileFeedState: ProfileFeedState = {
  value: [],
};

export const profileFeedSlice = createSlice({
  name: "profileFeed",
  initialState: initialProfileFeedState,
  reducers: {
    setProfileFeedRedux: (
      state: ProfileFeedState,
      action: PayloadAction<Publication[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setProfileFeedRedux } = profileFeedSlice.actions;

export default profileFeedSlice.reducer;
