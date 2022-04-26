import { createSlice } from "@reduxjs/toolkit";
export default createSlice({
  name: "notify-slice",
  initialState: {
    isShow: false,
    type: "success",
    msg: [],
  },
  reducers: {
    showNotify: (state, { payload }) => {
      state.isShow = true;
      state.type = payload.type;
      state.msg = payload.msg;
    },
    hideNotify: (state) => {
      state.isShow = false;
    },
  },
});
