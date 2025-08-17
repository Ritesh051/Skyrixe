import React, { Children, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { categoryProductList } from "../../reduxToolkit/Slices/ProductList/listApis";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Accordion } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

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

const initialState = {
  city: false,
  pincode: 0,
  filter_city: false,
  minPrice: 0,
  maxPrice: 10000,
  filter_minPrice: 0,
  filter_maxPrice: 10000,
  showAll: false,
  set_minPrice: 0,
  set_maxPrice: 0,
  set_filter_minPrice: 0,
  set_filter_maxPrice: 0,
  cityApply: false,
  isLoc_open: false,
  isPrice_open: false,
  isBestfilter_open: false,
  sameDay: false,
  discount: false,
};

const Product = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [iState, updateState] = useState(initialState);
  const {
    city,
    pincode,
    filter_city,
    minPrice,
    maxPrice,
    filter_minPrice,
    filter_maxPrice,
    showAll,
    set_maxPrice,
    set_minPrice,
    set_filter_minPrice,
    set_filter_maxPrice,
    cityApply,
    isLoc_open,
    isPrice_open,
    isBestfilter_open,
    sameDay,
    discount,
  } = iState;
  const [value, setValue] = useState([minPrice, maxPrice]);
  const selectCity = window.localStorage.getItem("LennyCity");
  const { loader, getCategoryProductList, getCityList } = useSelector(
    (state) => state.productList
  );
  const state = location?.state;
  const navigate = useNavigate();
  const handleProduct = (item) => {
    navigate("product-details", { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChangeSlider = (event) => {
    updateState({
      ...iState,
      minPrice: event[0],
      maxPrice: event[1],
    });
    setValue([event[0], event[1]]);

    console.log(event[0]);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "city" || name == "filter_city") {
      if (checked) {
        if (name == "city") {
          window.localStorage?.setItem(
            "LennyCity",
            JSON.parse(value)?.cityName
          );
          window.localStorage?.setItem(
            "LennyPincode",
            JSON.stringify(JSON.parse(value)?.pincode)
          );
        }

        updateState({
          ...iState,
          [name]: JSON.parse(value)?.cityName,
          pincode: JSON.parse(value)?.pincode,
        });
      } else {
        updateState({ ...iState, [name]: false, pincode: 0 });
      }
    } else if (name == "minPrice" || name == "maxPrice") {
      let modifiedValue =
        name == "minPrice"
          ? value >= 0
            ? value
            : minPrice + ""
          : value >= 0
          ? value
          : maxPrice + "";
      updateState({ ...iState, [name]: modifiedValue });
    } else if (name == "sameDay" || name == "discount") {
      updateState({ ...iState, [name]: checked });
    }
  };

  const handleCategory = (item, subCat) => {
    navigate("/products", { state: { item, subCat, selectCity } });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleBestFilterApply = () => {
    updateState({
      ...iState,
      isBestfilter_open: !isBestfilter_open,
    });
    const data = {
      category: state?.item?.categoryName,
      subcategory: state?.subCat,
      city: selectCity,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sameDay,
      discount,
    };

    dispatch(categoryProductList(data));
  };

  const handleCityApply = () => {
    window.localStorage?.setItem("LennyCity", filter_city);
    window.localStorage?.setItem("LennyPincode", pincode);
    updateState({ ...iState, isLoc_open: !isLoc_open });
  };

  const handleRangeApply = () => {
    updateState({ ...iState, isPrice_open: !isPrice_open });
    const data = {
      category: state?.item?.categoryName,
      subcategory: state?.subCat,
      city: selectCity,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sameDay,
      discount,
    };

    const timeoutId = setTimeout(() => {
      dispatch(categoryProductList(data));
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const settings = {
    infinite: true,
    loop: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    margin: 10,
    rewind: true,
    autoplay: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1200, // < 1200px
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992, // < 992px
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // < 768px
        settings: {
          slidesToShow: 3,
          arrows: true,
        },
      },
      {
        breakpoint: 576, // < 576px
        settings: {
          slidesToShow: 2.5,
          arrows: true,
          margin: 5,
        },
      },
    ],
  };

  useEffect(() => {
    if (state || selectCity) {
      updateState({ ...iState, city: selectCity, filter_city: selectCity });
      const data = {
        category: state?.item?.categoryName,
        subcategory: state?.subCat,
        city: selectCity,
      };
      dispatch(categoryProductList(data));
    }
  }, [state, selectCity, window.localStorage]);

  useEffect(() => {
    const data = {
      category: state?.item?.categoryName,
      subcategory: state?.subCat,
      city: selectCity,
      sameDay,
      discount,
    };
    if (!isBestfilter_open) {
      dispatch(categoryProductList(data));
    }
  }, [sameDay, discount]);

  useEffect(() => {
    const data = {
      category: state?.item?.categoryName,
      subcategory: state?.subCat,
      city: selectCity,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sameDay,
      discount,
    };
    if (!isPrice_open) {
      const timeoutId = setTimeout(() => {
        dispatch(categoryProductList(data));
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [minPrice, maxPrice]);

  useEffect(() => {
    console.log("heyyyy", minPrice, maxPrice);
    if (getCategoryProductList) {
      updateState({
        ...iState,
        set_minPrice:
          set_minPrice == 0 ? getCategoryProductList?.minPrice : set_minPrice,
        set_maxPrice:
          set_maxPrice == 0 ? getCategoryProductList?.maxPrice : set_maxPrice,
        minPrice: minPrice == 0 ? getCategoryProductList?.minPrice : minPrice,
        maxPrice:
          maxPrice == 10000 ? getCategoryProductList?.maxPrice : maxPrice,
      });
    }
  }, [getCategoryProductList]);

  console.log(
    { maxPrice, minPrice, set_maxPrice, set_minPrice },
    getCategoryProductList,
    getCategoryProductList?.maxPrice
  );

  console.log(
    {
      state,
      filter_city,
      city,
      selectCity,
      isLoc_open,
      isPrice_open,
    },
    state?.item?.categoryName
  );

  console.log(sameDay, discount, "filters");

  return (
    <>
      <div className="Main">
        <div className="BirthdayDecorationArea p-0">
          <img
            src={
              state?.item?.categoryName == "BIRTHDAY"
                ? require("../../assets/images/Birthday inner banner.png")
                : state?.item?.categoryName == "ROOM & HALL DECOR'S"
                ? require("../../assets/images/room decor inner banner.png")
                : state?.item?.categoryName == "KID'S PARTY"
                ? require("../../assets/images/Party Magic.png")
                : state?.item?.categoryName == "PREMIUM DECOR'S"
                ? require("../../assets/images/PREMIUM DECOR'S inner banner.png")
                : state?.item?.categoryName == "THEME DECOR'S"
                ? require("../../assets/images/THEME DECOR'S inner banner.png")
                : state?.item?.categoryName == "ANNIVERSARY"
                ? require("../../assets/images/Anniversary inner banner png.png")
                : state?.item?.categoryName == "BABY SHOWER"
                ? require("../../assets/images/baby shower inner banner.png")
                : state?.item?.categoryName == "BALLOON BOUQUET"
                ? require("../../assets/images/ballon banguetes inner banner.png")
                : ""
            }
          />
        </div>
        <div className="FeatureArea carouselPadding">
          {getCategoryProductList?.subcategory?.length <= 3 ? (
            <div
              className="container-fluid"
              style={{
                width: "96%",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              {getCategoryProductList?.subcategory?.map((item, i) => {
                return (
                  <div key={i}>
                    <div className="item">
                      <div className="FeatureBoxMain">
                        <div className="FeatureBox1" style={{ height: "auto" }}>
                          <figure
                            onClick={() =>
                              handleCategory(
                                { categoryName: state?.item?.categoryName },
                                item?.subcategoryName
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <img src={item?.subcategoryImage} />
                          </figure>

                          <h4
                            // data-tooltip-id="my-tooltip"
                            data-tooltip-content={item?.subcategoryName}
                          >
                            {item?.subcategoryName}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            getCategoryProductList && (
              <div
                className="container-fluid"
                style={{
                  width: "96%",
                }}
              >
                <Slider {...settings}>
                  {getCategoryProductList?.subcategory?.length > 0
                    ? getCategoryProductList?.subcategory?.map((item, i) => {
                        return (
                          <div className="item" key={i}>
                            <div className="FeatureBoxMain">
                              <div className="FeatureBox1">
                                <figure
                                  onClick={() =>
                                    handleCategory(
                                      {
                                        categoryName: state?.item?.categoryName,
                                      },
                                      item?.subcategoryName
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <img src={item?.subcategoryImage} />
                                </figure>

                                <h4
                                  // data-tooltip-id="my-tooltip"
                                  data-tooltip-content={item?.subcategoryName}
                                >
                                  {item?.subcategoryName}
                                </h4>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : ""}
                </Slider>
              </div>
            )
          )}
        </div>
        <div className="PrivateDining">
          <div className="container-fluid">
            <div className="section-title">
              <h2>{state?.subCat}</h2>
              {/* <p>
                Lorem ipsum dolor sit amet consectetur. Integer cursus cursus in
              </p> */}
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                <div className="FilterArea">
                  <h3 className="Heading">Filter Option</h3>

                  <Accordion defaultActiveKey={["0", "1", "2"]} alwaysOpen>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Best Filters</Accordion.Header>
                      <Accordion.Body>
                        <div className="card card-body">
                          <label className="CheckBox">
                            {" "}
                            Same-day delivery
                            <input
                              type="checkbox"
                              name="sameDay"
                              onClick={handleInputChange}
                            />
                            <span className="checkmark" />
                          </label>
                          <label className="CheckBox">
                            {" "}
                            Discount
                            <input
                              type="checkbox"
                              name="discount"
                              onClick={handleInputChange}
                            />
                            <span className="checkmark" />
                          </label>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Location</Accordion.Header>
                      <Accordion.Body>
                        <div className="card card-body">
                          {getCityList?.data?.length && showAll == false > 0
                            ? getCityList?.data?.map((cityItem, i) => {
                                if (i < 5) {
                                  return (
                                    <div className="form-group mb-2" key={i}>
                                      <label className="Radio">
                                        {cityItem?.cityName
                                          .charAt(0)
                                          .toUpperCase() +
                                          cityItem?.cityName.slice(1)}
                                        <input
                                          type="radio"
                                          name="city"
                                          value={JSON.stringify(cityItem)}
                                          checked={city == cityItem?.cityName}
                                          onChange={handleInputChange}
                                        />
                                        <span className="checkmark" />
                                      </label>
                                    </div>
                                  );
                                }
                              })
                            : ""}
                          {getCityList?.data?.length && showAll == true > 0
                            ? getCityList?.data?.map((cityItem, i) => {
                                return (
                                  <div className="form-group mb-2" key={i}>
                                    <label className="Radio">
                                      {cityItem?.cityName
                                        .charAt(0)
                                        .toUpperCase() +
                                        cityItem?.cityName.slice(1)}
                                      <input
                                        type="radio"
                                        name="city"
                                        value={JSON.stringify(cityItem)}
                                        checked={city == cityItem?.cityName}
                                        onChange={handleInputChange}
                                      />
                                      <span className="checkmark" />
                                    </label>
                                  </div>
                                );
                              })
                            : ""}
                          <a
                            className="ShowAll"
                            onClick={() =>
                              updateState({ ...iState, showAll: !showAll })
                            }
                          >
                            Show {showAll ? "Less" : "All"}
                          </a>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>Price Range</Accordion.Header>
                      <Accordion.Body>
                        <div className="card card-body border-0">
                          {/* <div className="PriceRangeBox">
                            <select className="form-control">
                              <option selected="">INR</option>
                            </select>
                            <input
                              type="text"
                              name="minPrice"
                              value={minPrice}
                              onChange={handleInputChange}
                              placeholder="Minimum price"
                            />
                          </div>
                          <div className="PriceRangeBox">
                            <select className="form-control">
                              <option selected="">INR</option>
                            </select>
                            <input
                              type="text"
                              name="maxPrice"
                              value={maxPrice}
                              onChange={handleInputChange}
                              placeholder="Maximum price"
                            />
                          </div> */}
                          <RangeSlider
                            value={value}
                            onInput={(event) => handleChangeSlider(event)}
                            min={set_minPrice}
                            max={set_maxPrice}
                          />
                          <ul>
                            <p
                              style={{ marginTop: "10px" }}
                            >{`₹${minPrice}-₹${maxPrice}`}</p>
                            <li />
                          </ul>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <br />
                </div>
              </div>
              <div className="col-lg-9 col-md-8 col-sm-6 col-12">
                <div className="col-12">
                  <div className="FilterArea2">
                    <ul className="Tabs">
                      <li>
                        <a
                          onClick={() =>
                            updateState({
                              ...iState,
                              isBestfilter_open: !isBestfilter_open,
                            })
                          }
                          className="bestFilterBtn "
                        >
                          Best Filters
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() =>
                            updateState({ ...iState, isLoc_open: !isLoc_open })
                          }
                          className="locationFilterBtn"
                        >
                          Location
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() =>
                            updateState({
                              ...iState,
                              isPrice_open: !isPrice_open,
                            })
                          }
                          className="priceRangeBtn"
                        >
                          Price Range
                        </a>
                      </li>
                    </ul>

                    <div
                      className={
                        isBestfilter_open
                          ? `bestFilterBox bestFilterBoxAdd`
                          : `bestFilterBox`
                      }
                    >
                      <ul>
                        <h5>Best Filter</h5>
                        <li>
                          <label class="CheckBox">
                            {" "}
                            Same-day delivery
                            <input
                              type="checkbox"
                              name="sameDay"
                              onClick={handleInputChange}
                            />
                            <span class="checkmark"></span>
                          </label>
                        </li>
                        <li>
                          <label class="CheckBox">
                            {" "}
                            Discount
                            <input
                              type="checkbox"
                              name="discount"
                              onClick={handleInputChange}
                            />
                            <span class="checkmark"></span>
                          </label>
                        </li>
                      </ul>
                      <div className="Buttons">
                        <button
                          className="closeBestFilter"
                          style={{ color: "red" }}
                          onClick={() =>
                            updateState({
                              ...iState,
                              isBestfilter_open: !isBestfilter_open,
                            })
                          }
                        >
                          Close
                        </button>
                        <button
                          className="closeBestFilter"
                          style={{ color: "#4a174b" }}
                          onClick={handleBestFilterApply}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                    <div
                      className={
                        isLoc_open
                          ? `locationFilterBox locationFilterAdd`
                          : `locationFilterBox`
                      }
                    >
                      <ul>
                        {getCityList?.data?.length && showAll == false > 0
                          ? getCityList?.data?.map((cityItem, i) => {
                              if (i < 5) {
                                return (
                                  <li key={i}>
                                    <label className="Radio">
                                      {cityItem?.cityName
                                        .charAt(0)
                                        .toUpperCase() +
                                        cityItem?.cityName.slice(1)}
                                      <input
                                        type="radio"
                                        name="filter_city"
                                        value={JSON.stringify(cityItem)}
                                        checked={
                                          filter_city == cityItem?.cityName
                                        }
                                        onChange={handleInputChange}
                                      />
                                      <span className="checkmark" />
                                    </label>
                                  </li>
                                );
                              }
                            })
                          : ""}
                        {getCityList?.data?.length && showAll == true > 0
                          ? getCityList?.data?.map((cityItem, i) => {
                              return (
                                <div className="form-group mb-2" key={i}>
                                  <label className="Radio">
                                    {cityItem?.cityName
                                      .charAt(0)
                                      .toUpperCase() +
                                      cityItem?.cityName.slice(1)}
                                    <input
                                      type="radio"
                                      name="filter_city"
                                      value={JSON.stringify(cityItem)}
                                      checked={
                                        filter_city == cityItem?.cityName
                                      }
                                      onChange={handleInputChange}
                                    />
                                    <span className="checkmark" />
                                  </label>
                                </div>
                              );
                            })
                          : ""}
                      </ul>
                      <a
                        className="showAllBtn"
                        onClick={() =>
                          updateState({ ...iState, showAll: !showAll })
                        }
                      >
                        Show {showAll ? "Less" : "All"}
                      </a>
                      <div className="Buttons">
                        <button
                          className="closeLocationFilter"
                          style={{ color: "red" }}
                          onClick={() =>
                            updateState({ ...iState, isLoc_open: !isLoc_open })
                          }
                        >
                          Close
                        </button>
                        <button
                          style={{ color: "#4a174b" }}
                          className="closeLocationFilter"
                          onClick={handleCityApply}
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    <div
                      className={
                        isPrice_open
                          ? `priceRangeBox priceRangeBoxAdd`
                          : `priceRangeBox`
                      }
                    >
                      Price Range
                      <div className="filterRange">
                        <RangeSlider
                          value={value}
                          onInput={(event) => handleChangeSlider(event)}
                          min={set_minPrice}
                          max={set_maxPrice}
                        />
                        <ul>
                          <p
                            style={{ marginTop: "10px" }}
                          >{`₹${minPrice}-₹${maxPrice}`}</p>
                          <li />
                        </ul>
                      </div>
                      <div className="Buttons">
                        <button
                          className="closePriceFilter"
                          style={{ color: "red" }}
                          onClick={() =>
                            updateState({
                              ...iState,
                              isPrice_open: !isPrice_open,
                            })
                          }
                        >
                          Close
                        </button>
                        <button
                          style={{ color: "#4a174b" }}
                          className="closePriceFilter"
                          onClick={handleRangeApply}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row gy-5">
                  {getCategoryProductList?.data?.length > 0 ? (
                    getCategoryProductList?.data?.map((item, i) => {
                      return (
                        <div
                          className="col-lg-4 col-md-6 col-sm-12 col-6"
                          key={i}
                        >
                          <div className="PrivateDiningBox flexDirection">
                            <figure>
                              <img
                                onClick={() => handleProduct(item)}
                                src={item?.productimages?.at(0)}
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
                                  4.8 <i class="fa-solid fa-star" style="background-color:yellow"></i> |{" "}
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
                  ) : !loader ? (
                    <p className="para">No Data found.</p>
                  ) : (
                    ""
                  )}
                </div>
                {loader ? (
                  <p className="load">
                    <BeatLoader loading={loader} size={10} color="#02366f" />
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Tooltip id="my-tooltip" place="bottom" /> */}
    </>
  );
};

export default Product;
