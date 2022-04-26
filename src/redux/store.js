import { configureStore } from "@reduxjs/toolkit";
import loadingSlice from "./loadingSlice";
import notifySlice from "./notifySlice";
import userSlice from "./userSlice";
const store = configureStore({
  reducer: {
    userReducer: userSlice.reducer,
    loadingReducer: loadingSlice.reducer,
    notifyReducer: notifySlice.reducer,
  },
});
export default store;
