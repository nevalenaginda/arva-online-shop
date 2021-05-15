import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
// import axios from 'axios'
import Image from "next/image";
import { useDispatch } from "react-redux";
import { login } from "../../src/config/redux/actions/users";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [togglestate, setToggleState] = useState(1);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const tooglePasswordVisibility = () => {
    setIsPasswordShow(!isPasswordShow);
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "user",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required!"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      dispatch(login(values))
        .then((res) => {
          Swal.fire("Success", res, "success");
          router.push("/app");
        })
        .catch((err) => {
          Swal.fire("Something Error!", err, "error");
        });
    },
  });
  const formik2 = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "seller",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required!"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      dispatch(login(values))
        .then((res) => {
          Swal.fire("Success", res, "success");
          router.push("/app");
        })
        .catch((err) => {
          Swal.fire("Something Error!", err, "error");
        });
    },
  });

  const toggleTab = (index) => {
    setToggleState(index);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/app");
    }
  }, []);

  return (
    <div className="auth-login mt-4 mb-5">
      <div className="container">
        <div className="d-flex justify-content-center">
          <Image src="/img/logo_navbar.png" width={34} height={44} />
          <h4 className="text-danger ms-3 my-auto fw-bold">ARVA SHOP</h4>
        </div>
        <h1 className="mt-4">Please login with your account</h1>
        <div className="tab-button-auth mt-4">
          <button
            type="button"
            className={
              togglestate === 1 ? "btn-active-auth" : "btn-nonactive-auth"
            }
            onClick={() => toggleTab(1)}
          >
            Custommer
          </button>
          <button
            type="button"
            className={
              togglestate === 2 ? "btn-active-auth" : "btn-nonactive-auth"
            }
            onClick={() => toggleTab(2)}
          >
            Seller
          </button>
          {togglestate === 1 && (
            <>
              <form className="mt-4" onSubmit={formik.handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="error">{formik.errors.email}</p>
                  )}
                </div>
                <div className="form-group mt-3 mb-4 password-input">
                  <input
                    type={isPasswordShow ? "text" : "password"}
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.password && formik.touched.password && (
                    <p className="error">{formik.errors.password}</p>
                  )}
                  {/* <i className={`fa ${isPasswordShow ? "fa-eye-slash" : "fa-eye"} password-icon`} onClick={tooglePasswordVisibility} /> */}
                </div>
                <div className="text-forgot mb-4">
                  <Link href="/auth/reset-password">
                    <a>Forgot Password?</a>
                  </Link>
                </div>
                <button type="submit" className="btn-auth">
                  Login
                </button>
                <p className="text-center mt-4 text-account">
                  Don’t have a arvashop.id account?{" "}
                  <Link href="/auth/register">
                    <a>Sign Up</a>
                  </Link>{" "}
                </p>
              </form>
            </>
          )}

          {togglestate === 2 && (
            <>
              <form className="mt-4" onSubmit={formik2.handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={formik2.values.email}
                    onChange={formik2.handleChange}
                  />
                  {formik2.errors.email && formik2.touched.email && (
                    <p className="error">{formik2.errors.email}</p>
                  )}
                </div>
                <div className="form-group mt-3 mb-4 password-input">
                  <input
                    type={isPasswordShow ? "text" : "password"}
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={formik2.values.password}
                    onChange={formik2.handleChange}
                  />
                  {formik2.errors.password && formik2.touched.password && (
                    <p className="error">{formik2.errors.password}</p>
                  )}
                  {/* <i className={`fa ${isPasswordShow ? "fa-eye-slash" : "fa-eye"} password-icon`} onClick={tooglePasswordVisibility} /> */}
                </div>
                <div className="text-forgot mb-4">
                  <Link href="/auth/reset-password">
                    <a>Forgot Password?</a>
                  </Link>
                </div>
                <button type="submit" className="btn-auth">
                  Login
                </button>
                <p className="text-center mt-4 text-account">
                  Don’t have a arvashop.id account?{" "}
                  <Link href="/auth/register">
                    <a>Sign Up</a>
                  </Link>{" "}
                </p>
              </form>
            </>
          )}
        </div>

        <style jsx>
          {`
            img {
              margin-left: auto;
              margin-right: auto;
            }
            ,
            h1 {
              text-align: center;
              font-family: Metropolis;
              font-style: normal;
              font-weight: bold;
              font-size: 18px;
              line-height: 18px;
              color: #222222;
            }
            ,
            p {
              font-family: Metropolis;
              font-style: normal;
              font-weight: normal;
              font-size: 14px;
              line-height: 14px;
              color: #222222;
            }
            ,
            a {
              font-family: Metropolis;
              font-style: normal;
              font-weight: normal;
              font-size: 14px;
              line-height: 14px;
              color: #db3022;
            }

            // pindahin ke component reusable
            .btn-auth {
              border: none;
              height: 48px;
              width: 401px;
              border-radius: 25px;
              background: #db3022;
              font-family: Metropolis;
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              text-align: center;
              color: #ffffff;
            }
            .btn-active-auth {
              border: none;
              height: 48px;
              width: 123px;
              background: #db3022;
              box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.05);
              border-radius: 0px;
              font-family: Metropolis;
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              align-items: center;
              color: #ffffff;
            }
            .btn-nonactive-auth {
              height: 48px;
              width: 123px;
              border: 1px solid #9b9b9b;
              box-sizing: border-box;
              filter: drop-shadow(0px 1px 8px rgba(0, 0, 0, 0.05));
              border-radius: 0px;
              font-family: Metropolis;
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              align-items: center;
              color: #9b9b9b;
            }
            // pindahin ke component reusable

            .form-group input {
              height: 48px;
              width: 400px;
              margin-left: auto;
              margin-right: auto;
              border: 1px solid #9b9b9b;
              box-sizing: border-box;
              filter: drop-shadow(0px 1px 8px rgba(0, 0, 0, 0.05));
              border-radius: 4px;
              font-family: Metropolis;
              font-style: normal;
              font-weight: 500;
              font-size: 14px;
              line-height: 20px;
              color: #9b9b9b;
              text-align: left;
            }
            .error {
              margin-top: 3px;
              margin-left: -290px;
              color: #d41a1a;
              font-size: 12px;
            }
            .text-forgot {
              margin-left: 280px;
            }
          `}
        </style>
      </div>
    </div>
  );
}
