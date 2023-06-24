import { Profile } from "@/components/Home/types/lens.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AutographState {
  value: Profile | undefined;
}

const initialAutographState: AutographState = {
  value: undefined,
};

export const autographSlice = createSlice({
  name: "autograph",
  initialState: initialAutographState,
  reducers: {
    setAutographRedux: (
      state: AutographState,
      action: PayloadAction<Profile | undefined>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setAutographRedux } = autographSlice.actions;

export default autographSlice.reducer;
