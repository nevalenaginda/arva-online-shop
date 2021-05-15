import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCart,
  deleteCart,
  getCart,
} from "../../../src/config/redux/actions/carts";
import Rupiah from "../../../src/helper/rupiah";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import axiosApiInstance from "../../../src/helper/axios";
import withAuth from "../../../src/helper/authNext";

function index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { carts } = useSelector((state) => state.carts);
  const [state, setState] = useState(null);
  const [isSelected, setisSelected] = useState([]);
  const [load, setLoad] = useState(true);
  const [dataSelected, setDataSelected] = useState([]);
  const [count, setCount] = useState(0);
  const [check, setCheck] = useState([]);
  const [activeBtn, setActiveBtn] = useState("");

  const handleSelected = (item) => {
    setDataSelected([...dataSelected, item]);
    const newId = isSelected.push(String(item.id));
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // const uniqueId = [...new Set(isSelected)];
        const data = {
          cartId: JSON.stringify(check),
        };
        axiosApiInstance
          .post(`${process.env.api}/v1/cart/delete`, data)
          .then((res) => {
            setLoad(true);
            setCheck([]);
            Swal.fire("Success", res, "success");
          })
          .catch((err) => {
            Swal.fire("Something Error!", err, "error");
          });
      }
    });
  };

  const handleCheck = (e) => {
    if (check.includes(e.target.id)) {
      const index = check.indexOf(e.target.id);
      if (index > -1) {
        check.splice(index, 1);
      }
      setCheck(check);
    } else {
      setCheck([...check, e.target.id]);
    }
  };

  const handleAdd = (item) => {
    if (item.quantity < item.stockProduct) {
      const data = {
        productId: item.productId,
        quantity: 1,
      };
      dispatch(addCart(data));
      setActiveBtn(true);
      setLoad(true);
    } else {
      setActiveBtn(false);
    }
  };

  const handleRemove = (item) => {
    if (item.quantity <= 1) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // const uniqueId = [...new Set(isSelected)];
          const data = {
            cartId: JSON.stringify(item.id),
          };
          axiosApiInstance
            .post(`${process.env.api}/v1/cart/delete`, data)
            .then((res) => {
              setLoad(true);
              setDataSelected([]);
              Swal.fire("Success", res, "success");
            })
            .catch((err) => {
              Swal.fire("Something Error!", err, "error");
            });
        }
      });
      // setActiveBtn(false);
    } else {
      if (item.quantity >= 1) {
        const data = {
          productId: item.productId,
          quantity: -1,
        };
        dispatch(addCart(data));
        setActiveBtn(true);
        setLoad(true);
      } else {
        setActiveBtn(false);
      }
    }
  };

  const handleBuy = () => {
    // console.log(
    //   check.map(
    //     (item) =>
    //       state.dataCart.filter((item2) => item2.id.toString() === item)[0]
    //   )
    // );
    dispatch({
      type: "ADD_CART",
      payload: check.map(
        (item) =>
          state.dataCart.filter((item2) => item2.id.toString() === item)[0]
      ),
    });
    router.push("/app/checkout");
  };

  useEffect(() => {
    if (load) {
      dispatch(getCart())
        .then(() => setLoad(false))
        .catch(() => {
          setState({ dataCart: [] });
          setLoad(false);
        });
    }
  }, [handleAdd, handleRemove, handleDelete]);

  useEffect(() => {
    if (carts.dataCart) {
      if (carts.dataCart.length > 0) {
        setState(carts);
      } else {
        setState([]);
      }
    }
  }, [carts]);

  return (
    <div>
      <div className="container">
        <div className="row mt-7 mb-5">
          <h2 className="mt-3 fw-bold mb-4">My bag</h2>
          <div className="col-lg-8">
            {/* Selecet items */}
            <div className="card card-shadow border-0  mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <input
                    className="form-check-input bg-danger border-0 rounded-0 shadow-none"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    onClick={(e) => {
                      if (check.length === state.dataCart.length) {
                        setCheck([]);
                      } else {
                        setCheck(
                          state.dataCart.map((item) => item.id.toString())
                        );
                      }
                    }}
                    checked={
                      state && check.length === state.dataCart.length
                        ? true
                        : false
                    }
                  />
                  <span className="fw-bold ms-3 me-auto me-md-0">
                    Select all items
                  </span>
                  <span className="text-muted ms-1 me-auto d-none d-md-block">
                    ({check.length} items selected)
                  </span>
                  <button
                    className="btn text-danger fw-bold shadow-none"
                    onClick={handleDelete}
                    disabled={check.length === 0 ? true : false}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            {/* end selecet items */}

            {state &&
              state.dataCart.map((item, index) => {
                return (
                  <>
                    <div className="card card-shadow border-0 mb-3" key={index}>
                      <div className="card-body">
                        <div className="d-sm-block d-md-flex justify-content-between align-items-center">
                          <input
                            className="d-sm-inline-block form-check-input bg-danger border-0 rounded-0 shadow-none"
                            type="checkbox"
                            id={item.id}
                            onChange={handleCheck}
                            checked={check.includes(item.id.toString())}
                            onClick={() => handleSelected(item)}
                          />
                          <div className="d-none d-md-flex border-image ms-3">
                            <img
                              alt="item"
                              src={item.imageProduct[0]}
                              className="border-image"
                            />
                          </div>
                          <div className="d-inline-block d-md-flex ms-3  me-auto">
                            <div className=" d-flex flex-column ">
                              <span
                                className="fw-bold d-inline-block text-truncate"
                                style={{ maxWidth: "180px" }}
                              >
                                {item.nameProduct}
                              </span>
                              <span className="text-muted">
                                {item.nameSeller}
                              </span>
                            </div>
                          </div>
                          <div
                            className="d-inline-block mt-3  mt-sm-3 mt-md-0 ms-0 ms-sm-5 ms-md-0 float-start text-center"
                            style={{ width: "180px" }}
                          >
                            <button
                              className={`btn btn-grup radius-50 shadow-none  ${
                                activeBtn === `remove-${index}`
                                  ? "btn-active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                handleRemove(item);
                                setActiveBtn(`remove-${index}`);
                              }}
                            >
                              <span className="material-icons f-14 ">
                                remove
                              </span>
                            </button>
                            <p
                              className="d-inline-block mx-3 fw-bold"
                              style={{ width: "40px" }}
                            >
                              {item.quantity}
                            </p>
                            <button
                              className={`btn btn-grup radius-50 text-center shadow-none  ${
                                activeBtn === `add-${index}` ? "btn-active" : ""
                              }`}
                              onClick={(e) => {
                                handleAdd(item);
                                setActiveBtn(`add-${index}`);
                              }}
                            >
                              <span className="material-icons f-14 fw-bold">
                                add
                              </span>
                            </button>
                          </div>
                          <div
                            className="d-inline-block mt-3  mt-sm-3 mt-md-0 me-0 me-sm-5 me-md-0  ms-md-5 fw-bold f-18 float-end"
                            style={{ width: "120px" }}
                          >
                            {Rupiah(`Rp ${item.totalPrice}`)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>

          <div className="col-12 col-md-12 col-lg-4 ">
            {/* shopping summarry */}
            <div className="card card-shadow border-0">
              <div className="card-body">
                <p className="fw-bold">Shopping summary</p>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Total price</span>
                  <span className="fw-bold f-18">
                    {state &&
                      check.length > 0 &&
                      Rupiah(
                        `Rp ${check
                          .map(
                            (item) =>
                              state.dataCart.filter(
                                (item2) => item2.id.toString() === item
                              )[0].totalPrice
                          )
                          .reduce((a, b) => a + b, 0)}`
                      )}
                  </span>
                </div>
                <div className="row justify-content-center">
                  <div className="col-sm-12 col-md-8 col-lg-12">
                    <button
                      className="mt-3 btn w-100 bg-danger round text-white shadow-none btn-hover"
                      onClick={handleBuy}
                      disabled={check.length === 0 ? true : false}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/*end  shopping summarry */}
          </div>
        </div>
      </div>
      <style jsx>{`
        .f-14 {
          font-size: 14px;
        }
        .f-16 {
          font-size: 16px;
        }
        .f-18 {
          font-size: 18px;
        }
        .round {
          border-radius: 25px !important;
        }
        .card-shadow {
          box-shadow: 0px 0px 8px rgba(115, 115, 115, 0.25);
          border-radius: 4px;
        }
        .border-image {
          border-radius: 8px !important;
          width: 69px;
          height: 69px;
          object-fit: contain;
        }
        .radius-50 {
          border-radius: 50%;
        }
        .btn-grup {
          width: 40px !important;
          height: 40px !important;
        }
        .btn-active {
          background: #d5d5d5;
          color: white;
        }

        .button {
          transition-duration: 0.4s;
        }
        .btn-hover:hover {
          background-color: rgba(219, 48, 34, 0.95) !important;
        }

        @media (max-width: 768px) {
          .border-image {
            border-radius: 8px !important;
            width: 120px;
            height: 120px;
            object-fit: cover;
          }
        }
      `}</style>
    </div>
  );
}

export default withAuth(index);
