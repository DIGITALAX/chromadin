import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProfileState {
  handle: string;
  id: string;
}

const initialProfileState: ProfileState = {
  handle: "",
  id: "",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialProfileState,
  reducers: {
    setProfile: (
      state: ProfileState,
      { payload: { actionHandle, actionId } }
    ) => {
      state.handle = actionHandle;
      state.id = actionId;
    },
  },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
