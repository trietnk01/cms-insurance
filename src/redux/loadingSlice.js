import { createSlice } from "@reduxjs/toolkit";
export default createSlice({
  name: "loading-slice",
  initialState: {
    isShow: false,
  },
  reducers: {
    show: (state) => {
      state.isShow = true;
    },
    hide: (state) => {
      state.isShow = false;
    },
  },
});
