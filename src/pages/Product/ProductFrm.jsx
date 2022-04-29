import axios from "axios";
import { API_ENDPOINT, FOLDER_IMAGE, NOTIFY_NAME, PATH_NAME, TIME_OUT, URL_SERVER } from "configs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import loadingSlice from "redux/loadingSlice";
import notifySlice from "redux/notifySlice";
function ProductFrm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { productId } = useParams();
  const [categoryProductItems, setCategoryProductItems] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [base64URL, setBase64URL] = useState(null);
  const [dataColor, setDataColor] = useState([]);
  const [dataPermission, setDataPermission] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const onSubmit = ({ fullname, sku, alias, category_product_id, color, status, permission }) => {
    let msg = new Array();
    let typeNotify = "";
    let url = "";
    let method = "";
    let frmData = new FormData();
    frmData.append("fullname", fullname ? fullname.toString().trim() : "");
    frmData.append("sku", sku);
    frmData.append("alias", alias ? alias.toString().trim() : "");
    frmData.append("category_product_id", category_product_id);
    console.log("color = ", color);
    console.log("status = ", status);
    console.log("permission = ", permission);
    if (featuredImage) {
      frmData.append("product_image", featuredImage);
    }
    dispatch(loadingSlice.actions.show());
    if (parseInt(productId).toString() !== "NaN") {
      method = "PUT";
      url = `${API_ENDPOINT}/${PATH_NAME.ADMIN_PRODUCT}/${parseInt(productId)}`;
    } else {
      method = "POST";
      url = `${API_ENDPOINT}/${PATH_NAME.ADMIN_PRODUCT}`;
    }
    axios({
      method,
      url,
      data: frmData,
      timeout: TIME_OUT,
    })
      .then((res) => {
        if (res && parseInt(res.status) === 200) {
          if (res.data.checked === true) {
            msg.push(NOTIFY_NAME.NOTI_SAVE_SUCCESSFULLY);
            typeNotify = NOTIFY_NAME.NOTI_TYPE_SUCCESS;
            navigate(`/${PATH_NAME.ADMIN_MASTER}/${PATH_NAME.ADMIN_PRODUCT}/${parseInt(res.data.item.id)}`);
          } else {
            res.data.msg.forEach((element) => {
              msg.push(element);
            });
            typeNotify = NOTIFY_NAME.NOTI_TYPE_WARNING;
          }
        } else {
          msg.push(NOTIFY_NAME.NOTI_SAVE_FAIL);
          typeNotify = NOTIFY_NAME.NOTI_TYPE_DANGER;
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
            type: NOTIFY_NAME.NOTI_TYPE_DANGER,
            msg: err.message,
          })
        );
      });
  };
  useEffect(() => {
    if (parseInt(productId).toString() === "NaN") {
      setValue("fullname", "");
      setValue("sku", "");
      setValue("alias", "");
      setValue("category_product_id", "");
      setFeaturedImage(null);
      setBase64URL(`${URL_SERVER}/${FOLDER_IMAGE}/no-image.jpg`);
    } else {
      axios({
        method: "GET",
        url: `${API_ENDPOINT}/${PATH_NAME.ADMIN_PRODUCT}/${parseInt(productId)}`,
        timeout: TIME_OUT,
      })
        .then((res) => {
          if (res && parseInt(res.status) === 200 && res.data) {
            setValue("fullname", res.data.fullname);
            setValue("sku", res.data.sku);
            setValue("alias", res.data.alias);
            setValue("category_product_id", res.data.category_product_id);
            setValue("color", ["123", "167"]);
            setValue("permission", ["461", "499"]);
            setValue("status", "disabled");
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
              type: NOTIFY_NAME.NOTI_TYPE_DANGER,
              msg: err.message,
            })
          );
          navigate("*");
        });
    }
  }, [productId]);
  useEffect(() => {
    dispatch(loadingSlice.actions.show());
    axios({
      method: "GET",
      url: `${API_ENDPOINT}/${PATH_NAME.ADMIN_CATEGORY_PRODUCT}`,
      timeout: TIME_OUT,
    })
      .then((res) => {
        if (res && parseInt(res.status) === 200 && res.data.checked === true && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setCategoryProductItems(res.data.data);
          let data_color = [
            {
              id: 123,
              name: "Red",
            },
            {
              id: 145,
              name: "Yellow",
            },
            {
              id: 167,
              name: "Pink",
            },
          ];
          let data_permission = [
            {
              id: 461,
              name: "Administrator",
            },
            {
              id: 458,
              name: "CopyWriter",
            },
            {
              id: 499,
              name: "Setting",
            },
          ];
          setDataColor(data_color);
          setDataPermission(data_permission);
        }
        dispatch(loadingSlice.actions.hide());
      })
      .catch(() => {});
  }, []);
  const getSelectedBoxCategoryProduct = () => {
    let xSelectedBox = null;
    let dataCopy = [...categoryProductItems];
    dataCopy.unshift({ id: "", fullname: "[---Category product---]" });
    if (dataCopy.length > 0) {
      let xHtmlOption = dataCopy.map((elmt) => {
        return (
          <option value={elmt.id} key={elmt.id}>
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
  function getCheckBoxColor() {
    let xHtml = dataColor.map((item) => {
      return (
        <div className="flex items-center gap-x-2" key={item.id}>
          <input type="checkbox" {...register("color")} value={parseInt(item.id)} /> <span>{item.name}</span>
        </div>
      );
    });
    return xHtml;
  }
  function getCheckBoxPermission() {
    let xHtml = dataPermission.map((item) => {
      return (
        <div className="flex items-center gap-x-2" key={item.id}>
          <input type="checkbox" {...register("permission")} value={parseInt(item.id)} />
          <span>{item.name}</span>
        </div>
      );
    });
    return xHtml;
  }
  function getStatus() {
    let xHtml = (
      <div className="flex flex-col">
        <div className="flex items-center gap-x-2">
          <input type="radio" {...register("status")} value="enabled" />
          <span>Enabled</span>
        </div>
        <div className="flex items-center gap-x-2">
          <input type="radio" {...register("status")} value="disabled" />
          <span>Disabled</span>
        </div>
      </div>
    );
    return xHtml;
  }
  function handleImagePreview(event) {
    if (event.target.files && event.target.files.length > 0) {
      setFeaturedImage(event.target.files[0]);
      setBase64URL(URL.createObjectURL(event.target.files[0]));
    }
  }
  const handleKeyPressSku = (event) => {
    let code = event.which;
    let val = event.target.value;
    let checked = true;
    if (code < 48 || code > 57) {
      checked = false;
    }
    if (val.toString().length > 6) {
      checked = false;
    }
    if (checked === false) event.preventDefault();
  };
  return (
    <form className="border p-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-x-2">
          <i className="fa fa-address-book-o" aria-hidden="true"></i>
          <span>Product</span>
        </div>
        <div className="flex justify-end gap-x-2">
          <Link to={`/${PATH_NAME.ADMIN_MASTER}/${PATH_NAME.ADMIN_PRODUCT}/add`} className="no-underline flex justify-center items-center gap-x-2 bg-blue-500 text-white border-0 p-2 hover:bg-blue-600">
            <span className="text-white">Add new</span>
            <i className="fa fa-plus text-white" aria-hidden="true"></i>
          </Link>
          <button name="btnSubmit" type="submit" className="no-underline flex justify-center items-center gap-x-2 bg-green-500 text-white border-0 p-2 hover:bg-blue-600">
            <span className="text-white">Submit</span>
            <i className="fa fa-floppy-o text-white" aria-hidden="true"></i>
          </button>
          <Link to={`/${PATH_NAME.ADMIN_MASTER}/${PATH_NAME.ADMIN_PRODUCT}/list`} className="no-underline flex justify-center items-center gap-x-2 bg-red-500 text-white border-0 p-2 hover:bg-red-600">
            <span className="text-white">Back</span>
            <i className="fa fa-backward text-white" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
      <hr className="my-2" />
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-col w-full">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">
              <b>Product name</b>
            </div>
            <div className="grow">
              <input type="text" className="border border-gray-400 w-full p-2 outline-0" {...register("fullname", { required: true })} />
            </div>
          </div>
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end"></div>
            <div className="grow">{errors.fullname && <span className="text-red-500">This field is required</span>}</div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">
              <b>SKU</b>
            </div>
            <div className="grow">
              <input type="text" className="border border-gray-400 w-full p-2 outline-0" {...register("sku", { required: true })} onKeyPress={handleKeyPressSku} />
            </div>
          </div>
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end"></div>
            <div className="grow">{errors.sku && <span className="text-red-500">This field is required</span>}</div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">
              <b>Alias</b>
            </div>
            <div className="grow">
              <input type="text" className="border border-gray-400 w-full p-2 outline-0" {...register("alias", { required: true })} />
            </div>
          </div>
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end"></div>
            <div className="grow">{errors.alias && <span className="text-red-500">This field is required</span>}</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">
              <b>Category</b>
            </div>
            <div className="grow">{getSelectedBoxCategoryProduct()}</div>
          </div>
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end"></div>
            <div className="grow">{errors.category_product_id && <span className="text-red-500">This field is required</span>}</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">
              <b>Featured image</b>
            </div>
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
        <div className="flex flex-col w-full">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">
              <b>Color</b>
            </div>
            <div className="grow flex flex-col">{getCheckBoxColor()}</div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">
              <b>Permission</b>
            </div>
            <div className="grow">{getCheckBoxPermission()}</div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-x-2">
            <div className="w-60 flex items-center justify-end">
              <b>RadioButton</b>
            </div>
            <div className="grow">{getStatus()}</div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ProductFrm;
