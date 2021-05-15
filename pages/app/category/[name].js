import React, { useState, useEffect } from "react";
// import Image from "next/image";
import Link from "next/link";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryProduct } from "../../../src/config/redux/actions/product";
import { CardProduct } from "../../../src/component/base";
import Rupiah from "../../../src/helper/rupiah";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function index() {
  const { query } = useRouter();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { product } = useSelector((state) => state.product);
  const [state, setState] = useState(null);
  let [queryPage, setQueryPage] = useState("0");
  let [querySize, setQuerySize] = useState("4");
  let [totalPage, setTotalPage] = useState("1");
  // const dataCategory = String(query.name)
  const [dataCategory, setDataCategory] = useState(null);

  const size = [
    {
      label: "Limit 4",
      value: "4",
    },
    {
      label: "Limit 6",
      value: "6",
    },
    {
      label: "Limit 8",
      value: "8",
    },
    {
      label: "Limit 10",
      value: "10",
    },
    {
      label: "Limit 12",
      value: "12",
    },
  ];

  useEffect(() => {
    if (dataCategory) {
      dispatch(getCategoryProduct(dataCategory, queryPage, querySize))
        .then((res) => {
          setTotalPage(res.data.data.totalPages);
          setState(res.data.data);
        })
        .catch((err) => {
          setTotalPage(1);
          setQueryPage(0);
        });
    }
    setDataCategory(window.location.pathname.split("/")[3]);
  }, [dispatch, dataCategory, query.name, queryPage, querySize]);

  useEffect(() => {
    if (product.product) {
      if (product.product.length > 0) {
        setState(product);
      }
    }
  }, [product]);

  const handleChangePage = (item, i) => {
    setQueryPage(i - 1);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <div className="container h-100">
        <div className="row mt-7 mb-5 ">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/app">
                  <a>Home</a>
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/app">
                  <a>Category</a>
                </Link>
              </li>
              {query.name && (
                <li className="breadcrumb-item active" aria-current="page">
                  {capitalizeFirstLetter(query.name)}
                </li>
              )}
            </ol>
          </nav>

          <div className="col-12 d-flex justify-content-between   align-items-center">
            {query.name && (
              <h2 className=" mt-3 fw-bold">
                {capitalizeFirstLetter(query.name)}
              </h2>
            )}
            <select
              onChange={(event) => {
                setQueryPage(0);
                setQuerySize(event.target.value);
              }}
              className="ms-3 form-select shadow-none border border-danger bg-danger text-white"
              style={{ width: "120px", height: "35px" }}
            >
              {size.map((item, index) => {
                return (
                  <option value={item.value} key={index}>
                    {item.label}
                  </option>
                );
              })}
            </select>
          </div>

          {state &&
            state.product.map((item, index) => {
              return (
                <>
                  <CardProduct
                    key={item.id}
                    image={item.image[0]}
                    titleProduct={item.name}
                    price={Rupiah(`Rp.${item.price}`)}
                    linkDetailProduct={`/app/product/${item.id}`}
                    seller={item.sellerName}
                  />
                </>
              );
            })}
        </div>
        <div className="row mb-1 mx-auto">
          <div className="col-12 d-flex justify-content-center">
            <div className={classes.root}>
              <Pagination
                page={parseInt(queryPage) + 1}
                defaultPage={1}
                onChange={handleChangePage}
                count={parseInt(totalPage)}
                variant="outlined"
                shape="rounded"
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .f-14 {
            font-size: 14px;
          }

          .color-muted {
            color: #9b9b9b;
          }
        `}
      </style>
    </div>
  );
}

export default index;
