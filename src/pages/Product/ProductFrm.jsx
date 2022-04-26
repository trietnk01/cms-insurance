import axios from "axios";
import { ADMIN_FOLDER, API_ENDPOINT, FOLDER_IMAGE, NOTI_SAVE_FAIL, NOTI_SAVE_SUCCESSFULLY, NOTI_TYPE_DANGER, NOTI_TYPE_SUCCESS, NOTI_TYPE_WARNING, TIME_OUT, URL_SERVER } from "configs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import loadingSlice from "redux/loadingSlice";
import notifySlice from "redux/notifySlice";
function ProductFrm() {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  let { productId } = useParams();
  const [categoryProductItems, setCategoryProductItems] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [base64URL, setBase64URL] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    let msg = new Array();
    let typeNotify = "";
    let url = "";
    let method = "";
    let frmData = new FormData();
    frmData.append("fullname", data.fullname);
    frmData.append("category_product_id", data.category_product_id);
    if (featuredImage) {
      frmData.append("product_image", featuredImage);
    }
    dispatch(loadingSlice.actions.show());
    if (parseInt(productId).toString() !== "NaN") {
      method = "PATCH";
      url = `${API_ENDPOINT}/product/${parseInt(productId)}`;
    } else {
      method = "POST";
      url = `${API_ENDPOINT}/product`;
    }
    axios({
      method,
      url,
      data: frmData,
      timeout: TIME_OUT,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        if (res && parseInt(res.status) === 200) {
          if (res.data.checked === true) {
            msg.push(NOTI_SAVE_SUCCESSFULLY);
            typeNotify = NOTI_TYPE_SUCCESS;
            navigate(`/${ADMIN_FOLDER}/product/${parseInt(res.data.item.id)}`);
          } else {
            res.data.msg.forEach((element) => {
              msg.push(element);
            });
            typeNotify = NOTI_TYPE_WARNING;
          }
        } else {
          msg.push(NOTI_SAVE_FAIL);
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
      .catch((err) => {
        dispatch(loadingSlice.actions.hide());
        dispatch(
          notifySlice.actions.showNotify({
            type: NOTI_TYPE_DANGER,
            msg: err.message,
          })
        );
      });
  };
  useEffect(() => {
    if (parseInt(productId).toString() === "NaN") {
      setValue("fullname", "");
      setValue("category_product_id", "");
      setFeaturedImage(null);
      setBase64URL(`${URL_SERVER}/${FOLDER_IMAGE}/no-image.jpg`);
    }
  }, [productId]);
  useEffect(() => {
    dispatch(loadingSlice.actions.show());
    axios({
      method: "GET",
      url: `${API_ENDPOINT}/category-product`,
      timeout: TIME_OUT,
    })
      .then((res) => {
        if (res && parseInt(res.status) === 200 && res.data.checked === true && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setCategoryProductItems(res.data.data);
        }
        dispatch(loadingSlice.actions.hide());
      })
      .catch(() => {});
    if (parseInt(productId).toString() !== "NaN") {
      axios({
        method: "GET",
        url: `${API_ENDPOINT}/product/${parseInt(productId)}`,
        timeout: TIME_OUT,
      })
        .then((res) => {
          if (res && parseInt(res.status) === 200 && res.data) {
            setValue("fullname", res.data.fullname);
            setValue("category_product_id", res.data.category_product_id);
            setBase64URL(`${URL_SERVER}/${FOLDER_IMAGE}/${res.data.featured_image}`);
          } else {
            navigate("*");
          }
          dispatch(loadingSlice.actions.hide());
        })
        .catch((err) => {
          dispatch(loadingSlice.actions.hide());
          dispatch(
            notifySlice.actions.showNotify({
              type: NOTI_TYPE_DANGER,
              msg: err.message,
            })
          );
          navigate("*");
        });
    }
  }, []);
  const getSelectedBoxCategoryProduct = () => {
    let xSelectedBox = null;
    let dataCopy = [...categoryProductItems];
    dataCopy.unshift({ id: "", fullname: "[---Category product---]" });
    if (dataCopy.length > 0) {
      let xHtmlOption = dataCopy.map((elmt, idx) => {
        return (
          <option value={elmt.id} key={idx}>
            {elmt.fullname}
          </option>
        );
      });
      xSelectedBox = (
        <select className="border border-gray-400 w-full p-2" {...register("category_product_id", { required: true })}>
          {xHtmlOption}
        </select>
      );
    }
    return xSelectedBox;
  };
  function handleImagePreview(event) {
    if (event.target.files && event.target.files.length > 0) {
      setFeaturedImage(event.target.files[0]);
      setBase64URL(URL.createObjectURL(event.target.files[0]));
    }
  }
  return (
    <form className="border p-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-x-2">
          <i className="fa fa-address-book-o" aria-hidden="true"></i>
          <span>Product</span>
        </div>
        <div className="flex justify-end gap-x-2">
          <Link to={`/${ADMIN_FOLDER}/product/add`} className="no-underline flex justify-center items-center gap-x-2 bg-blue-500 text-white border-0 p-2 hover:bg-blue-600">
            <span className="text-white">Add new</span>
            <i className="fa fa-plus text-white" aria-hidden="true"></i>
          </Link>
          <button name="btnSubmit" type="submit" className="no-underline flex justify-center items-center gap-x-2 bg-green-500 text-white border-0 p-2 hover:bg-blue-600">
            <span className="text-white">Submit</span>
            <i className="fa fa-floppy-o text-white" aria-hidden="true"></i>
          </button>
          <Link to={`/${ADMIN_FOLDER}/product/list`} className="no-underline flex justify-center items-center gap-x-2 bg-red-500 text-white border-0 p-2 hover:bg-red-600">
            <span className="text-white">Back</span>
            <i className="fa fa-backward text-white" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
      <hr className="my-2" />
      <div>
        <div className="flex flex-col gap-y-2 w-full">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">Product name</div>
            <div className="grow">
              <input type="text" className="border border-gray-400 w-full p-2" {...register("fullname", { required: true })} />
            </div>
          </div>
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end"></div>
            <div className="grow">{errors.fullname && <span className="text-red-500">This field is required</span>}</div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">Category</div>
            <div className="grow">{getSelectedBoxCategoryProduct()}</div>
          </div>
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end"></div>
            <div className="grow">{errors.category_product_id && <span className="text-red-500">This field is required</span>}</div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">Featured image</div>
            <div className="grow">
              <input type="file" onChange={handleImagePreview} />
            </div>
          </div>
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end"></div>
            <div className="grow">
              <img src={base64URL} width="200" height="200" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ProductFrm;
