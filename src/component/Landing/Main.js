import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "bootstrap";
import {
  birthdayDecoList,
  categoryList,
  dealBannerList,
} from "../../reduxToolkit/Slices/ProductList/listApis";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ReactImageZoom from "react-image-zoom";

const CustomPrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev" onClick={onClick}>
    <i class="fa-solid fa-angle-left"></i>
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div className="custom-arrow next" onClick={onClick}>
    <i class="fa-solid fa-angle-right"></i>
  </div>
);

const Main = () => {
  const {
    getBirthdayList,
    getAnniversaryList,
    getKidsList,
    getWeddingDecoList,
    getCategoryList,
    getDealBannerList,
    getTopBannerList,
    loader,
  } = useSelector((state) => state.productList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectCity = window.localStorage.getItem("LennyCity");
  // const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));

  const handleCategory = (item, subCat) => {
    navigate("/products", { state: { item, subCat, selectCity } });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleProduct = (item) => {
    navigate("/products/product-details", { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const settings = {
    infinite: true,
    loop: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    rewind: true,
    autoplay: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  const settings1 = {
    infinite: false,
    loop: false,
    dots: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
  };

  useEffect(() => {
    const myCarousel = document.querySelector("#carouselExampleIndicators");
    if (myCarousel) {
      new Carousel(myCarousel, {
        interval: 5000,
        pause: false,
        ride: "carousel", // Ensure autoplay starts
      });
    }
  }, []);

  console.log({ getBirthdayList });

  console.log({ getDealBannerList });

  return (
    <>
      <div className="Hero-Section">
        <div id="carouselExampleIndicators" className="carousel slide">
          <div className="carousel-inner">
            {getTopBannerList?.data?.length > 0
              ? getTopBannerList?.data?.map((item, i) => {
                  return (
                    <div className={`carousel-item ${i == 0 ? "active" : ""}`}>
                      <div>
                        <div className="HeroRight">
                          <img src={item?.bannerImage} />
                        </div>
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
          <div className="carousel-indicators">
            {getTopBannerList?.data?.length > 0
              ? getTopBannerList?.data?.map((item, i) => {
                  return (
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to={i}
                      className={`${i == 0 ? "active" : ""}`}
                      aria-current={`${i == 0 ? "true" : "false"}`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  );
                })
              : ""}
          </div>
        </div>
      </div>

      <div className="Main">
        <div className="FeatureArea">
          <div className="container-fluid" style={{ width: "96%" }}>
            <div className="section-title">
              <h2>Features Category</h2>
            </div>
            {/* <Slider {...settings}>
              {getCategoryList?.data?.length > 0
                ? getCategoryList?.data?.map((item, i) => {
                    return (
                      <div className="item" key={i}>
                        <div className="FeatureBoxMain">
                          <div className="FeatureBox">
                            <aside
                              style={{ cursor: "pointer" }}
                              onClick={() => handleCategory(item)}
                              className={
                                i == 0
                                  ? "Blue"
                                  : i == 1
                                  ? "Green"
                                  : i % 2 == 0
                                  ? "Orange"
                                  : i % 3 == 0
                                  ? "Cyan"
                                  : i % 4 == 0
                                  ? "Yellow"
                                  : i % 5 == 0
                                  ? "DarkGreen"
                                  : "Pink"
                              }
                            >
                              <figure>
                                <img src={item?.categoryImage} />
                              </figure>
                            </aside>
                            <h4
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content={item?.categoryName}
                            >
                              {item?.categoryName}
                            </h4>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </Slider> */}
            <div className="row">
              {getCategoryList?.data?.length > 0
                ? getCategoryList?.data?.map((item, i) => {
                    return (
                      <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
                        <div className="FeatureBoxMain">
                          <div className="FeatureBox">
                            <aside
                              style={{ cursor: "pointer" }}
                              onClick={() => handleCategory(item)}
                              className={
                                i == 0
                                  ? "Blue"
                                  : i == 1
                                  ? "Green"
                                  : i % 2 == 0
                                  ? "Orange"
                                  : i % 3 == 0
                                  ? "Cyan"
                                  : i % 4 == 0
                                  ? "Yellow"
                                  : i % 5 == 0
                                  ? "DarkGreen"
                                  : "Pink"
                              }
                            >
                              <figure>
                                <img src={item?.categoryImage} />
                              </figure>
                            </aside>
                            <h4
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content={item?.categoryName}
                            >
                              {item?.categoryName}
                            </h4>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        </div>
        <div className="BirthdayDecorationArea">
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
                if (item?.dealbannerTitle == "Birthday Decoration") {
                  return (
                    <img
                      key={i}
                      src={item?.dealbannerImage}
                      onClick={() =>
                        handleCategory({ categoryName: "BIRTHDAY" })
                      }
                      style={{ cursor: "pointer" }}
                    />
                  );
                }
              })
            : ""}
          {/* </Slider> */}
        </div>

        <div className="BirthdayDecorationArea BirthDecImage">
          <div className="container-fluid">
            <div className="section-title">
              <h2>Birthday Decoration</h2>
              <p>
                Transform Your Birthday into a Magical Celebration with Stunning
                Decorations!
              </p>
            </div>
            <div className="row gy-sm-5 gy-2">
              {getBirthdayList?.data?.length > 0 ? (
                getBirthdayList?.data?.map((item, i) => {
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
                      <div className="PrivateDiningBox flexDirection">
                        <figure>
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                          />
                        </figure>
                        <h6>{item?.productDetails?.productname}</h6>
                        <div className="Info">
                          
                        <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // center row
    gap: "1rem",              // spacing between buttons
  }}
>
  <button className="Buttons" onClick={() => handleProduct(item)}>
    Book
  </button>
  <button className="Buttons" onClick={() => handleProduct(item)}>
   <div
  style={{
    display: "flex",
    alignItems: "center",   // vertically center
    gap: "6px"              // spacing between + and icon
  }}
>
+ cart
  
</div>

   

  </button>
</div>

                          
                          <div className="text-right">
                            <div className="priceArea">
                              {item?.priceDetails?.discountedPrice ? (
                                <h5>
                                  ₹{item?.priceDetails?.discountedPrice}
                                  <p className="actualPrice">
                                    ₹{item?.priceDetails?.price}
                                  </p>
                                </h5>
                              ) : (
                                <h5>₹{item?.priceDetails?.price}</h5>
                              )}
                              {item?.priceDetails?.discountedPrice ? (
                                <span>
                                  {Math.round(
                                    ((Number(item?.priceDetails?.price) -
                                      Number(
                                        item?.priceDetails?.discountedPrice
                                      )) /
                                      Number(item?.priceDetails?.price)) *
                                      100
                                  )}
                                  % off
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <p>
                              4.8 <i class="fa-solid fa-star"></i> |{" "}
                              {i % 2 == 0 && i !== 0
                                ? `${i % 2}` + 5 + i - 1
                                : i == 0
                                ? `14${i % 2}`
                                : `${i % 2}` + 2 + i - 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No item Available</p>
              )}
            </div>
          </div>
        </div>
        <div className="viewAll">
          <a
            style={{
              "text-decoration": "underline",
              color: "#2BA501",
              fontSize: "17px",
            }}
            onClick={() => handleCategory({ categoryName: "BIRTHDAY" })}
          >
            View All
          </a>
        </div>

        <div className="BirthdayDecorationArea">
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
                if (item?.dealbannerTitle == "Anniversary Decoration") {
                  return (
                    <img
                      key={i}
                      src={item?.dealbannerImage}
                      onClick={() =>
                        handleCategory({ categoryName: "ANNIVERSARY" })
                      }
                      style={{ cursor: "pointer" }}
                    />
                  );
                }
              })
            : ""}
          {/* </Slider> */}
        </div>

        <div className="BirthdayDecorationArea AnniDecImage">
          <div className="container-fluid">
            <div className="section-title">
              <h2>Anniversary Decoration</h2>
              <p>
                Celebrate Your Love with Elegant & Breathtaking Anniversary
                Decorations!
              </p>
            </div>
            <div className="row gy-sm-5 gy-2">
              {getAnniversaryList?.data?.length > 0 ? (
                getAnniversaryList?.data?.map((item, i) => {
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
                      <div className="PrivateDiningBox flexDirection">
                        <figure>
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                          />
                        </figure>
                        <h6>{item?.productDetails?.productname}</h6>
                        <div className="Info">
                          <button
                            className="Buttons"
                            onClick={() => handleProduct(item)}
                          >
                            Book
                          </button>
                          <div className="text-right">
                            <div className="priceArea">
                              {item?.priceDetails?.discountedPrice ? (
                                <h5>
                                  ₹{item?.priceDetails?.discountedPrice}
                                  <p className="actualPrice">
                                    ₹{item?.priceDetails?.price}
                                  </p>
                                </h5>
                              ) : (
                                <h5>₹{item?.priceDetails?.price}</h5>
                              )}
                              {item?.priceDetails?.discountedPrice ? (
                                <span>
                                  {Math.round(
                                    ((Number(item?.priceDetails?.price) -
                                      Number(
                                        item?.priceDetails?.discountedPrice
                                      )) /
                                      Number(item?.priceDetails?.price)) *
                                      100
                                  )}
                                  % off
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <p>
                              4.8 <i class="fa-solid fa-star"></i> |{" "}
                              {i % 2 == 0 && i !== 0
                                ? `${i % 2}` + 5 + i - 1
                                : i == 0
                                ? `14${i % 2}`
                                : `${i % 2}` + 2 + i - 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No item Available</p>
              )}
            </div>
          </div>
        </div>

        <div className="viewAll">
          <a
            style={{
              "text-decoration": "underline",
              color: "#2BA501",
              fontSize: "17px",
            }}
            onClick={() => handleCategory({ categoryName: "ANNIVERSARY" })}
          >
            View All
          </a>
        </div>

        <div className="BirthdayDecorationArea" style={{ cursor: "pointer" }}>
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
                if (item?.dealbannerTitle == "Kids Party") {
                  return (
                    <img
                      key={i}
                      src={item?.dealbannerImage}
                      onClick={() =>
                        handleCategory({ categoryName: "KID'S PARTY" })
                      }
                    />
                  );
                }
              })
            : ""}
          {/* </Slider> */}
        </div>

        <div className="BirthdayDecorationArea BirthDecImage">
          <div className="container-fluid">
            <div className="section-title">
              <h2>Kid's Party</h2>
              <p>
                Turn Your Kid’s Party into a Whimsical Wonderland of Fun &
                Magic!
              </p>
            </div>
            <div className="row gy-5">
              {getKidsList?.data?.length > 0 ? (
                getKidsList?.data?.map((item, i) => {
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
                      <div className="PrivateDiningBox flexDirection">
                        
                        <figure>
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                          />
                        </figure>

                        <h6>{item?.productDetails?.productname}</h6>
                        <div className="Info">
                          <button
                            className="Buttons"
                            onClick={() => handleProduct(item)}
                          >
                            Book
                          </button>
                          <div className="text-right">
                            <div className="priceArea">
                              {item?.priceDetails?.discountedPrice ? (
                                <h5>
                                  ₹{item?.priceDetails?.discountedPrice}
                                  <p className="actualPrice">
                                    ₹{item?.priceDetails?.price}
                                  </p>
                                </h5>
                              ) : (
                                <h5>₹{item?.priceDetails?.price}</h5>
                              )}
                              {item?.priceDetails?.discountedPrice ? (
                                <span>
                                  {Math.round(
                                    ((Number(item?.priceDetails?.price) -
                                      Number(
                                        item?.priceDetails?.discountedPrice
                                      )) /
                                      Number(item?.priceDetails?.price)) *
                                      100
                                  )}
                                  % off
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <p>
                              4.8 <i class="fa-solid fa-star"></i> |{" "}
                              {i % 2 == 0 && i !== 0
                                ? `${i % 2}` + 5 + i - 1
                                : i == 0
                                ? `14${i % 2}`
                                : `${i % 2}` + 2 + i - 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No item Available</p>
              )}
            </div>
          </div>
        </div>

        <div className="viewAll">
          <a
            style={{
              "text-decoration": "underline",
              color: "#2BA501",
              fontSize: "17px",
            }}
            onClick={() => handleCategory({ categoryName: "KID'S PARTY" })}
          >
            View All
          </a>
        </div>

        <div className="BirthdayDecorationArea" style={{ cursor: "pointer" }}>
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
                if (item?.dealbannerTitle == "Baby Shower") {
                  return (
                    <img
                      key={i}
                      src={item?.dealbannerImage}
                      onClick={() =>
                        handleCategory({ categoryName: "BABY SHOWER" })
                      }
                    />
                  );
                }
              })
            : ""}
          {/* </Slider> */}
        </div>

        <div className="BirthdayDecorationArea AnniDecImage">
          <div className="container-fluid">
            <div className="section-title">
              <h2>Baby Shower</h2>
              <p>
                Celebrate the Joy of New Beginnings with Enchanting Baby Shower
                Decor!
              </p>
            </div>
            <div className="row gy-5">
              {getWeddingDecoList?.data?.length > 0 ? (
                getWeddingDecoList?.data?.map((item, i) => {
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
                      <div className="PrivateDiningBox flexDirection">
                        <figure>
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                          />
                        </figure>
                        <h6>{item?.productDetails?.productname}</h6>
                        <div className="Info">
                          <button
                            className="Buttons"
                            onClick={() => handleProduct(item)}
                          >
                            Book
                          </button>
                          <div className="text-right">
                            <div className="priceArea">
                              {item?.priceDetails?.discountedPrice ? (
                                <h5>
                                  ₹{item?.priceDetails?.discountedPrice}
                                  <p className="actualPrice">
                                    ₹{item?.priceDetails?.price}
                                  </p>
                                </h5>
                              ) : (
                                <h5>₹{item?.priceDetails?.price}</h5>
                              )}
                              {item?.priceDetails?.discountedPrice ? (
                                <span>
                                  {Math.round(
                                    ((Number(item?.priceDetails?.price) -
                                      Number(
                                        item?.priceDetails?.discountedPrice
                                      )) /
                                      Number(item?.priceDetails?.price)) *
                                      100
                                  )}
                                  % off
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                            <p>
                              4.8 <i class="fa-solid fa-star"></i> |{" "}
                              {i % 2 == 0 && i !== 0
                                ? `${i % 2}` + 5 + i - 1
                                : i == 0
                                ? `14${i % 2}`
                                : `${i % 2}` + 2 + i - 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No item Available</p>
              )}
            </div>
          </div>
        </div>
        <div className="viewAll">
          <a
            style={{
              "text-decoration": "underline",
              color: "#2BA501",
              fontSize: "17px",
            }}
            onClick={() => handleCategory({ categoryName: "BABY SHOWER" })}
          >
            View All
          </a>
        </div>
        <div className="BirthdayDecorationArea">
          <img src={require("../../assets/images/Photos 1.png")} />
        </div>
        <article>
          <img
            style={{ margin: "10px 0" }}
            src={require("../../assets/images/stats 2.png")}
          />
        </article>
        <div className="BirthdayDecorationArea">
          <img src={require("../../assets/images/Our Clients.png")} />
        </div>
      </div>
      <Tooltip id="my-tooltip" place="bottom" />
    </>
  );
};

export default Main;
