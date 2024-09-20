import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: "language",
  initialState: "ar",
  reducers: {
    changeLanguage: (state, action) => action.payload,
  },
});

export const { changeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
