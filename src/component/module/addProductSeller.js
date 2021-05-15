import React, { useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import axiosApiInstance from "../../helper/axios";
import swal from "sweetalert";
export default function AddProductSeller() {
  const [files, setFiles] = useState([]);
  const [state, setState] = useState({
    createProduct: {
      name: "",
      price: "",
      stock: "",
      desc: "",
      img: "",
      thumbnail: "",
      category: "",
      condition: {
        baru: true,
        bekas: false,
      },
    },
    errorValidationMessage: {
      name: "",
      price: "",
      stock: "",
      desc: "",
      img: "",
      category: "",
    },
    loading: false,
  });
  const Url = process.env.api;
  // setup dropzone and validator
  function fileSizeValidator(file) {
    if (file.size > 3000000) {
      return {
        code: "file-too-large",
        message: `file to large`,
      };
    }
    return null;
  }
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragActive,
    isDragReject,
  } = useDropzone({
    noClick: false,
    accept: "image/png, image/jpeg",
    onDrop: (acceptedFiles) => {
      const image = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      if (acceptedFiles.length !== 0) {
        if (files.length < 4) {
          setFiles([...files, image[0]]);
          setState({
            ...state,
            errorValidationMessage: {
              ...state.errorValidationMessage,
              img: "",
            },
          });
        }
      }
    },
    maxFiles: 4,
    multiple: false,
    validator: fileSizeValidator,
  });
  const baseStyle = {
    width: "100 %",
    border: " 3px #c4c0c0 dashed",
    borderRadius: "1rem",
    padding: "2rem",
  };
  const activeStyle = {
    borderColor: "#2196f3",
  };
  const acceptStyle = {
    borderColor: "#00e676",
  };
  const rejectStyle = {
    borderColor: "#ff1744",
  };
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  const setCategory = (e) => {
    setState({
      ...state,
      createProduct: { ...state.createProduct, category: e.target.id },
      errorValidationMessage: { ...state.errorValidationMessage, category: "" },
    });
  };
  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );
  const thumbs = files.map((file, index) => (
    <div key={file.name} className="col-6 col-lg-3 position-relative">
      <div
        className="d-flex justify-content-center rounded-md overflow-hidden"
        style={{ width: "150px", height: "250px" }}
      >
        <img
          src={file.preview}
          className="w-100 align-self-center"
          style={{ objectFit: "contain" }}
        />
      </div>
      <button
        className="border-0 material-icons text-white rounded-circle p-1"
        style={{
          background: "rgba(0,0,0,0.4)",
          position: "absolute",
          right: "10px",
          top: "35px",
          fontSize: "14px",
        }}
        onClick={() => {
          const index = files.indexOf(file);
          if (index > -1) {
            files.splice(index, 1);
            setFiles([...files]);
          }
        }}
      >
        close
      </button>
    </div>
  ));
  // ------
  // save function
  const addProduct = () => {
    if (state.createProduct.name.length === 0) {
      setState({
        ...state,
        errorValidationMessage: {
          ...state.errorValidationMessage,
          name: "* Name produk dibutuhkan",
        },
      });
    } else if (state.createProduct.price.length === 0) {
      setState({
        ...state,
        errorValidationMessage: {
          ...state.errorValidationMessage,
          price: "* Harga produk dibutuhkan",
        },
      });
    } else if (state.createProduct.stock.length === 0) {
      setState({
        ...state,
        errorValidationMessage: {
          ...state.errorValidationMessage,
          stock: "* Stock produk dibutuhkan",
        },
      });
    } else if (state.createProduct.desc.length === 0) {
      setState({
        ...state,
        errorValidationMessage: {
          ...state.errorValidationMessage,
          desc: "* Deskripsi produk dibutuhkan",
        },
      });
    } else if (files.length === 0) {
      setState({
        ...state,
        errorValidationMessage: {
          ...state.errorValidationMessage,
          img: "* Gambar produk minimal 1",
        },
      });
    } else if (state.createProduct.category.length === 0) {
      setState({
        ...state,
        errorValidationMessage: {
          ...state.errorValidationMessage,
          category: "* kategori produk dibutuhkan",
        },
      });
    } else {
      setState({ ...state, loading: true });
      const form = new FormData();
      form.append("name", state.createProduct.name);
      form.append("price", state.createProduct.price);
      form.append("stock", state.createProduct.stock);
      form.append("category", state.createProduct.category);
      form.append(
        "condition",
        state.createProduct.condition.baru ? "new" : "old"
      );
      files.map((item) => {
        form.append("image", item);
      });
      axiosApiInstance
        .post(`${Url}/v1/product`, form)
        .then((res) => {
          setState({ ...state, loading: false, createProduct:{ ...state.createProduct,
            name: "",
            price: "",
            stock: "",
            desc: "",
            img: ""
        } });
          swal("success", res.data.message, "success");
        })
        .catch((err) => {});
    }
  };
  // -----
  return (
    <div>
      {/* form */}
      <div className="my-4">
        <div className="bg-white border p-4 rounded-top">
          <h4 className="fw-bold">Inventory</h4>
        </div>
        <div className="bg-white border p-4 rounded-bottom">
          <label htmlFor="input" className="mb-3">
            Name of goods
          </label>
          <div>
            <input
              type="text"
              className="p-2 border rounded w-100-sm w-50-lg"
              style={{ outline: "none" }}
              onChange={(e) => {
                setState({
                  ...state,
                  createProduct: {
                    ...state.createProduct,
                    name: e.target.value,
                  },
                  errorValidationMessage: {
                    ...state.errorValidationMessage,
                    name: "",
                  },
                });
              }}
            />
            <p className="text-danger my-2" style={{ fontStyle: "italic" }}>
              {state.errorValidationMessage.name}
            </p>
          </div>
        </div>
      </div>
      <div className="my-4">
        <div className="bg-white border p-4 rounded-top">
          <h4 className="fw-bold">Item details</h4>
        </div>
        <div className="bg-white border p-4 rounded-bottom">
          <div className="mb-3">
            <label htmlFor="input" className="mb-3">
              Unit price
            </label>
            <div>
              <input
                type="text"
                className="p-2 border rounded w-100-sm w-50-lg"
                style={{ outline: "none" }}
                onChange={(e) => {
                  setState({
                    ...state,
                    createProduct: {
                      ...state.createProduct,
                      price: e.target.value,
                    },
                    errorValidationMessage: {
                      ...state.errorValidationMessage,
                      price: "",
                    },
                  });
                }}
              />
              <p className="text-danger my-2" style={{ fontStyle: "italic" }}>
                {state.errorValidationMessage.price}
              </p>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="input" className="mb-3">
              stock
            </label>
            <div className="d-flex">
              <div className="d-flex border rounded w-100-sm w-50-lg me-4">
                <input
                  type="number"
                  className="w-100 border-0 p-2"
                  style={{ outline: "none" }}
                  onChange={(e) => {
                    setState({
                      ...state,
                      createProduct: {
                        ...state.createProduct,
                        stock: e.target.value,
                      },
                      errorValidationMessage: {
                        ...state.errorValidationMessage,
                        stock: "",
                      },
                    });
                  }}
                />
                <p className="m-0 p-2">buah</p>
              </div>
              <div className="d-flex me-4">
                <input
                  type="radio"
                  className="me-2 my-auto"
                  checked={state.createProduct.condition.baru}
                  onChange={() => {
                    setState({
                      ...state,
                      createProduct: {
                        ...state.createProduct,
                        condition: {
                          baru: true,
                          bekas: false,
                        },
                      },
                    });
                  }}
                />
                <label className="my-auto">Baru</label>
              </div>
              <div className="d-flex">
                <input
                  type="radio"
                  className="me-2 my-auto"
                  checked={state.createProduct.condition.bekas}
                  onChange={() => {
                    setState({
                      ...state,
                      createProduct: {
                        ...state.createProduct,
                        condition: {
                          baru: false,
                          bekas: true,
                        },
                      },
                    });
                  }}
                />
                <label className="my-auto">bekas</label>
              </div>
            </div>
            <p className="text-danger my-2" style={{ fontStyle: "italic" }}>
              {state.errorValidationMessage.stock}
            </p>
          </div>
          <div className="mb-3">
            <label htmlFor="input" className="mb-3">
              Category
            </label>
            <div class="dropdown">
              <button
                className="bg-transparent py-2 px-2 border w-100-sm w-50-lg text-black dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {state.createProduct.category}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a
                    class="dropdown-item"
                    id="High heels"
                    onClick={setCategory}
                  >
                    High heels
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    id="Wristwatch"
                    onClick={setCategory}
                  >
                    Wristwatch
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" id="Handbag" onClick={setCategory}>
                    Handbag
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" id="Bagpack" onClick={setCategory}>
                    Bagpack
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" id="Socks" onClick={setCategory}>
                    Socks
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" id="Glasses" onClick={setCategory}>
                    Glasses
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" id="Cap" onClick={setCategory}>
                    Cap
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" id="Tie" onClick={setCategory}>
                    Tie
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" id="Dress" onClick={setCategory}>
                    Dress
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    id="Format Suite"
                    onClick={setCategory}
                  >
                    Format Suite
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    id="Accessories"
                    onClick={setCategory}
                  >
                    Accessories
                  </a>
                </li>
              </ul>
            </div>
            <p className="text-danger my-2" style={{ fontStyle: "italic" }}>
              {state.errorValidationMessage.category}
            </p>
          </div>
          <div className="mb-3">
            <label htmlFor="input" className="mb-3">
              Description
            </label>
            <div className="d-flex border rounded w-100-sm w-50-lg">
              <textarea
                rows={5}
                className="border w-100"
                style={{ outline: "none" }}
                onChange={(e) => {
                  setState({
                    ...state,
                    createProduct: {
                      ...state.createProduct,
                      desc: e.target.value,
                    },
                    errorValidationMessage: {
                      ...state.errorValidationMessage,
                      desc: "",
                    },
                  });
                }}
              />
            </div>
            <p className="text-danger my-2" style={{ fontStyle: "italic" }}>
              {state.errorValidationMessage.desc}
            </p>
          </div>
        </div>
      </div>
      {/* --- */}
      {/* dropzone */}
      <div className="my-4">
        <div className="bg-white border p-4 rounded-top">
          <h4 className="fw-bold">Photo of goods</h4>
          <div className="bg-white border p-4 rounded-bottom">
            <div>
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p className="m-0 text-center color-gray">
                  Geser dan Lepas file anda di area ini, hanya mendukung format
                  gambar png, jpeg dan jpg, maks ukuran per file sebesar 3Mb,
                  jumlah file yang dapat di upload maks 4
                </p>
              </div>
              <div className="row mt-4">{thumbs}</div>
              <p className="text-danger my-2" style={{ fontStyle: "italic" }}>
                {state.errorValidationMessage.img}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* button save */}
      <div className="w-100 d-flex justify-content-end my-5">
        <button
          className="bg-danger text-white border-0 rounded-pill px-5 py-2 me-3"
          onClick={addProduct}
        >
          {state.loading === true ? "...loading" : "save"}
        </button>
      </div>
    </div>
  );
}
