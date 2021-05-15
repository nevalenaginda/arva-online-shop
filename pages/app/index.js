import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getHomeProduct } from "../../src/config/redux/actions/product";
import Carousel, { consts } from "react-elastic-carousel";
import { useMediaQuery } from "react-responsive";
import {
  NextArrow,
  PreviousArrow,
  CardProduct,
  PaginationCarousel,
} from "../../src/component/base";
import { Navbar } from "../../src/component/module";
import Rupiah from "../../src/helper/rupiah";

export default function App() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.product);
  const [homeProduct, setHomeProduct] = useState(null);
  const isMobile = useMediaQuery({
    query: "(min-device-width: 992px)",
  });
  const [state, setState] = useState({
    showArrows: true,
  });
  // config responsive carousel atas
  const responsive = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 1, itemsToScroll: 1 },
    { width: 850, itemsToShow: 2 },
    { width: 1150, itemsToShow: 2, itemsToScroll: 1 },
    { width: 1450, itemsToShow: 3 },
    { width: 1750, itemsToShow: 4 },
  ];
  // ----
  // config responsive carousel bawah
  const responsive2 = [
    { width: 1, itemsToShow: 4 },
    { width: 550, itemsToShow: 4, itemsToScroll: 1 },
    { width: 850, itemsToShow: 4 },
    { width: 1150, itemsToShow: 4, itemsToScroll: 1 },
    { width: 1450, itemsToShow: 6 },
    { width: 1750, itemsToShow: 6 },
  ];
  // ----
  // config posisi dan fungsi panah carousel atas
  const myArrow = ({ type, onClick, isEdge }) => {
    if (type === consts.PREV) {
      return <PreviousArrow onClick={onClick} disabled={isEdge} />;
    } else {
      return <NextArrow onClick={onClick} disabled={isEdge} />;
    }
  };

  // ---
  // config posisi dan fungsi panah carousel bawah
  const myArrow2 = ({ type, onClick, isEdge }) => {
    if (type === consts.PREV) {
      return (
        <button
          className="material-icons btn-navigation"
          onClick={onClick}
          disabled={isEdge}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translate(0, -90%)",
            left: 0,
            zIndex: 8,
          }}
        >
          arrow_back_ios
        </button>
      );
    } else {
      return (
        <button
          className="material-icons btn-navigation"
          onClick={onClick}
          disabled={isEdge}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translate(0, -90%)",
            left: "65px",
            zIndex: 8,
          }}
        >
          arrow_forward_ios
        </button>
      );
    }
  };
  // ---
  // config posisi dan fungsi paginasi carousel atas dan bawah
  const myPagination = ({ pages, activePage, onClick }) => {
    return (
      <div className="d-flex my-4 me-auto" style={{}}>
        {pages.map((page) => {
          const isActivePage = activePage === page;
          return (
            <PaginationCarousel
              onClick={() => {
                onClick(page);
              }}
              active={isActivePage}
            />
          );
        })}
      </div>
    );
  };
  // ---
  useEffect(() => {
    dispatch(getHomeProduct());
  }, [dispatch]);

  useEffect(() => {
    if (product.newProduct || product.popularProduct) {
      if (product.newProduct.length > 0 || product.popularProduct.length > 0) {
        setHomeProduct(product);
      }
    }
  }, [product]);

  return (
    <div className="">
      <div className="mt-7"></div>
      <div className="container">
        {/* carousel ats */}
        <div style={{ position: "relative" }}>
          <Carousel
            itemsToScroll={2}
            itemsToShow={2}
            breakPoints={responsive}
            renderArrow={myArrow}
            renderPagination={myPagination}
            showArrows={isMobile == true ? true : false}
          >
            <div
              className="d-flex text-white w-100 mx-3 rounded-md"
              style={{
                background: "URL(/img/carouselUp.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "270px",
              }}
            >
              <p className="mx-auto fs-2 my-auto">Trends in 2021</p>
            </div>
            <div
              className="d-flex text-white w-100 mx-3 rounded-md"
              style={{
                background: "URL(/img/blackEdition.png)",
                backgroundSize: "cover",
                height: "270px",
              }}
            >
              <p className="mx-auto fs-2 my-auto">Black Edition</p>
            </div>
            <div
              className="d-flex text-white w-100 mx-3 rounded-md"
              style={{
                background: "URL(/img/limited.jpg)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "270px",
              }}
            >
              <p className="mx-auto fs-2 my-auto">Limited Edition</p>
            </div>
          </Carousel>
        </div>
      </div>
      <div className="py-4" style={{ background: "#F0F1F9" }}>
        <div className="container">
          <div className="row position-relative">
            <div className="col-12 col-lg-4">
              <h2 className="fw-bold">Category</h2>
              <p className="color-gray" style={{ fontSize: "14px" }}>
                What are you currently looking for
              </p>
            </div>
            <div className="col-12 col-lg-8">
              <Carousel
                itemsToScroll={2}
                itemsToShow={2}
                breakPoints={responsive2}
                renderArrow={myArrow2}
                renderPagination={myPagination}
                showArrows={isMobile == true ? true : false}
              >
                <div
                  onClick={() => router.push("/app/category/bagpack")}
                  className="d-flex text-white w-100 mx-3 rounded-md"
                  style={{
                    background: "#AC50D8",
                    height: "220px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <img
                    className="my-3"
                    src="/img/bagpackCat.png"
                    style={{
                      objectFit: "contain",
                      position: "absolute",
                      left: "-10px",
                      top: "10px",
                    }}
                  />
                  <p className="mx-auto fs-2 my-auto" style={{ zIndex: "3" }}>
                    Bagpack
                  </p>
                </div>
                <div
                  onClick={() => router.push("/app/category/glasses")}
                  className="d-flex text-white w-100 mx-3 rounded-md"
                  style={{
                    background: "#5086D8",
                    height: "220px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <img
                    className="my-3"
                    src="/img/glasses.png"
                    style={{
                      width: "99%",
                      objectFit: "contain",
                      position: "absolute",
                      left: "0",
                      top: "55px",
                    }}
                  />
                  <p className="mx-auto fs-2 my-auto" style={{ zIndex: "3" }}>
                    Glasses
                  </p>
                </div>
                <div
                  onClick={() => router.push("/app/category/cap")}
                  className="d-flex text-white w-100 mx-3 rounded-md"
                  style={{
                    background: "#53D850",
                    height: "220px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <img
                    className="my-3"
                    src="/img/cap.png"
                    style={{
                      width: "90%",
                      objectFit: "contain",
                      position: "absolute",
                      left: "0",
                      top: "50px",
                    }}
                  />
                  <p className="mx-auto fs-2 my-auto" style={{ zIndex: "3" }}>
                    Cap
                  </p>
                </div>
                <div
                  className="d-flex text-white w-100 mx-3 rounded-md"
                  style={{
                    background: "#D85091",
                    height: "220px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <img
                    className="my-3"
                    src="/img/dress.png"
                    style={{
                      width: "90%",
                      objectFit: "contain",
                      position: "absolute",
                      left: "5px",
                      top: "13px",
                    }}
                  />
                  <p className="mx-auto fs-2 my-auto" style={{ zIndex: "3" }}>
                    Dress
                  </p>
                </div>
                <div
                  className="d-flex text-white w-100 mx-3 rounded-md"
                  style={{
                    background: "#50D8AF",
                    height: "220px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <img
                    className="my-3"
                    src="/img/formal.png"
                    style={{
                      width: "90%",
                      objectFit: "contain",
                      position: "absolute",
                      left: "5px",
                      top: "13px",
                    }}
                  />
                  <p className="mx-auto fs-2 my-auto" style={{ zIndex: "3" }}>
                    Formal
                  </p>
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row mb-4 mt-4">
          <div className="mb-1">
            <h2 className="fw-bold">New</h2>
            <p className="color-gray" style={{ fontSize: "14px" }}>
              You’ve never seen it before!
            </p>
          </div>

          {homeProduct &&
            homeProduct.newProduct.map((item) => {
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
      </div>
      <div className="container">
        <div className="row mb-4">
          <div>
            <h2 className="mb-1 fw-bold">Popular</h2>
            <p className="color-gray mb-0" style={{ fontSize: "12px" }}>
              Find clothes that are trending recently
            </p>
          </div>

          {homeProduct &&
            homeProduct.popularProduct.map((item) => {
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
      </div>
    </div>
  );
}
