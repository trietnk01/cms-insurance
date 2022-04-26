export const checkedLogin = (state) => state.userReducer.isLogin;
export const checkedShowLoading = (state) => state.loadingReducer.isShow;
export const isShowNotify = (state) => state.notifyReducer.isShow;
export const getTypeNotify = (state) => state.notifyReducer.type;
export const getMsgNotify = (state) => state.notifyReducer.msg;
