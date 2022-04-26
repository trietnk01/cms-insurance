import "assets/admin/admin-main.scss";
import axios from "axios";
import { ADMIN_FOLDER, API_ENDPOINT, NOTI_LOGIN_FAIL, NOTI_PERMISSION_DENINED, NOTI_TYPE_DANGER, NOTI_TYPE_WARNING, TIME_OUT } from "configs";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import loadingSlice from "redux/loadingSlice";
import notifySlice from "redux/notifySlice";
import userSlice from "redux/userSlice";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    let msg = new Array(0);
    let typeNotify = "";
    dispatch(loadingSlice.actions.show());
    axios({
      method: "POST",
      url: `${API_ENDPOINT}/user`,
      data,
      timeout: TIME_OUT,
    })
      .then(function (res) {
        if (res && parseInt(res.status) === 200 && parseInt(res.data.checked) === 1) {
          if (parseInt(res.data.user.status) === 1) {
            dispatch(userSlice.actions.login(res.data.user));
            navigate(`/${ADMIN_FOLDER}/dashboard`);
          } else {
            msg.push(NOTI_PERMISSION_DENINED);
            typeNotify = NOTI_TYPE_WARNING;
          }
        } else {
          msg.push(NOTI_LOGIN_FAIL);
          typeNotify = NOTI_TYPE_DANGER;
        }
        dispatch(loadingSlice.actions.hide());
        dispatch(
          notifySlice.actions.showNotify({
            type: typeNotify,
            msg,
          })
        );
      })
      .catch(function (err) {
        dispatch(
          notifySlice.actions.showNotify({
            type: NOTI_TYPE_DANGER,
            msg: err.message,
          })
        );
        dispatch(loadingSlice.actions.hide());
      });
  };
  return (
    <section className="sectionLogin h-screen text-base text-white">
      <div className="xForm absolute rounded px-10 top-1/2 left-1/2 flex items-center">
        <div className="frmContent relative w-full">
          <h1 className="mb-4 text-center text-4xl">Login</h1>
          <form className="frmLogin" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative mb-2">
              <input type="text" className="txtInput font-light outline-0 border-0 rounded px-2.5 py-2.5 w-full bg-transparent" {...register("email", { required: true })} />
              <i className="iconLogin absolute fa fa-envelope-o" aria-hidden="true"></i>
            </div>
            <div className="relative mb-2">
              <input type="password" className="txtInput font-light outline-0 border-0 rounded px-2.5 py-2.5 w-full bg-transparent" {...register("password", { required: true })} />
              <i className="iconLogin absolute fa fa-key" aria-hidden="true"></i>
            </div>
            <div className="relative mb-2 flex justify-center">
              <button type="submit" name="btn_login" className="btnLogin font-semibold relative flex items-center justify-center overflow-hidden">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
