import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MakePostState {
  value: boolean;
}

const initialMakePostState: MakePostState = {
  value: false,
};

export const makePostSlice = createSlice({
  name: "makePost",
  initialState: initialMakePostState,
  reducers: {
    setMakePost: (state: MakePostState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setMakePost } = makePostSlice.actions;

export default makePostSlice.reducer;
