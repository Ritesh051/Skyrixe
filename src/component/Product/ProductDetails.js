import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  productDetails,
  signUpState,
  slotListApi,
  staticSlotListApi,
} from "../../reduxToolkit/Slices/ProductList/listApis";
import { toast, useToast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { addtoCart } from "../../reduxToolkit/Slices/Cart/bookingApis";
import { convertTimeFormat, formatDate } from "../../Utils/commonFunctions";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { ratingReviewList } from "../../reduxToolkit/Slices/ReviewAndRating/reviewRatingApis";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { BeatLoader } from "react-spinners";
import { addressListing } from "../../reduxToolkit/Slices/Auth/auth";

const initialState = {
  largeImg: "",
  pincode: "",
  minDate: "",
  dateAdded: "",
  slots: "",
  slotList: [],
  errors: "",
  pincode_valid: true,
  customModal: false,
  customization: [],
  totalPrice: 0,
  readMore: false,
  id: "",
  rating: [],
};

const ProductDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const item = location?.state;
  const [qty, setQty] = useState(1);
  const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));
  const LennyPincode = JSON.parse(window.localStorage.getItem("LennyPincode"));
  const [productDetailsClone, setProductDetailsClone] = useState("");
  const [activePage, updateActivePage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [iState, updateState] = useState(initialState);
  const {
    largeImg,
    pincode,
    slots,
    slotList,
    minDate,
    dateAdded,
    errors,
    pincode_valid,
    customModal,
    customization,
    totalPrice,
    readMore,
    id,
    rating,
  } = iState;
  const { getProductDetails, getSlotList, getStaticSlotList, loader } =
    useSelector((state) => state.productList);
  const { getRatingReviewList, loading } = useSelector(
    (state) => state.reviewRating
  );
  const { getAddressList } = useSelector((state) => state.auth);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "pincode") {
      let modifiedValue = value >= 0 ? value : pincode + "";
      updateState({
        ...iState,
        pincode: modifiedValue,
        errors: {
          ...errors,
          pincodeError: value >= 0 ? "" : errors?.pincodeError,
        },
      });

      if (
        modifiedValue?.length == 6 &&
        modifiedValue != LennyPincode?.find((item) => item == modifiedValue) &&
        e.key != "Backspace"
      ) {
        toast.error(
          "Sorry, our service is currently unavailable for the entered Pincode!!",
          {
            position: "top-center",
          }
        );
      } else if (
        modifiedValue?.length == 6 &&
        modifiedValue == LennyPincode?.find((item) => item == modifiedValue)
      ) {
        toast.success(
          "Our service is available in your location, Please proceed with your booking.",
          {
            position: "top-center",
          }
        );
      }
    } else if (name == "dateAdded") {
      updateState({
        ...iState,
        [name]: value,
        errors: { ...errors, slotsError: "", dateAddedError: "" },
      });
      dispatch(slotListApi({ date: value, productId: item?._id }));
    } else if (name == "rating") {
      console.log(checked, "checked");
      if (checked) {
        if (!rating?.includes(Number(value))) {
          updateState({ ...iState, rating: [...rating, Number(value)] });
        }
      } else {
        updateState({
          ...iState,
          rating: rating?.filter((item, i) => item !== Number(value)),
        });
      }
    } else {
      updateState({
        ...iState,
        [name]: value,
        errors: { ...errors, slotsError: "", dateAddedError: "" },
      });
    }
  };

  const handleValidation = () => {
    console.log("here in validation");
    let error = {};
    let formIsValid = true;

    if (!pincode) {
      error.pincodeError = "*Pincode is required";
      formIsValid = false;
    }
    if (pincode?.length < 6) {
      error.pincodeError = "*Pincode should contain at least 6 digits";
      formIsValid = false;
    }

    if (pincode && pincode != LennyPincode?.find((item) => item == pincode)) {
      error.pincodeError = "*Service is currently unavailable for this pincode";
      formIsValid = false;
      toast.error(
        "Sorry, our service is currently unavailable for the entered Pincode!!",
        {
          position: "top-center",
        }
      );
    }
    if (!dateAdded) {
      error.dateAddedError = "*Date is required";
      formIsValid = false;
    }
    if (!slots || !slots.trim()) {
      error.slotsError = "*Slots is required";
      formIsValid = false;
    }
    updateState({ ...iState, errors: error });
    return formIsValid;
  };

  console.log("slot", slots);

  const handleNext = () => {
    let formIsValid = handleValidation();
    // if (userDetail) {
    if (formIsValid) {
      if (userDetail) {
        updateState({
          ...iState,
          customModal: true,
          totalPrice: getProductDetails.data.product.priceDetails
            .discountedPrice
            ? getProductDetails.data.product.priceDetails.discountedPrice
            : getProductDetails?.data?.product?.priceDetails?.price,
          errors: "",
        });
      } else {
        updateState({ ...iState, errors: "" });
        dispatch(signUpState(true));
        toast.info("Please Login!!");
      }
    }
    // } else {
    //   updateState({...iState,errors:{}})
    //   dispatch(signUpState(true));
    //   toast.info("Please Login!!");
    // }
  };

  const handleCart = (item) => {
    const data = {
      name: item?.name,
      price: item?.price,
      customimages: item?.customimages,
      qty: item?.quantity,
      id: item?._id,
    };
    updateState({
      ...iState,
      customization: [...customization, data],
      totalPrice: totalPrice + item?.price,
    });
  };

  const handleIncrement = (item) => {
    setProductDetailsClone((prev) => {
      const updatedItems = prev?.data?.product?.productcustomizeDetails?.map(
        (element, i) => {
          if (element._id == item._id) {
            const newQty = Number(element.quantity) + 1;
            const data = {
              name: item?.name,
              price: item?.price,
              customimages: item?.customimages,
              qty: newQty,
              id: item?._id,
            };
            if (customization?.find((custom) => custom?.id == item?._id)) {
              updateState({
                ...iState,
                totalPrice: totalPrice + item?.price,
                customization: customization?.map((custom, i) => {
                  if (custom?.id == item?._id) {
                    return { ...custom, qty: newQty };
                  }
                  return custom;
                }),
              });
            } else {
              updateState({
                ...iState,
                totalPrice: totalPrice + item?.price,
                customization: [...customization, data],
              });
            }

            return { ...element, quantity: newQty };
          }
          return element;
        }
      );
      return {
        ...prev,
        data: {
          ...prev?.data,
          product: {
            ...prev?.data?.product,
            productcustomizeDetails: updatedItems,
          },
        },
      };
    });
  };

  const handleDecrement = (item) => {
    setProductDetailsClone((prev) => {
      const updatedItems = prev?.data?.product?.productcustomizeDetails?.map(
        (element, i) => {
          if (element._id == item._id) {
            console.log("qtyy", item.quantity);
            if (Number(item.quantity) > 1) {
              const newQty = Number(element.quantity) - 1;
              const data = {
                name: item?.name,
                price: item?.price,
                customimages: item?.customimages,
                qty: newQty,
                id: item?._id,
              };
              if (customization?.find((custom) => custom?.id == item?._id)) {
                updateState({
                  ...iState,
                  totalPrice: totalPrice - item?.price,
                  customization: customization?.map((custom, i) => {
                    if (custom?.id == item?._id) {
                      return { ...custom, qty: newQty };
                    }
                    return custom;
                  }),
                });
              } else {
                updateState({
                  ...iState,
                  totalPrice: totalPrice - item?.price,
                  customization: [...customization, data],
                });
              }

              return { ...element, quantity: newQty };
            }
          }
          return element;
        }
      );
      return {
        ...prev,
        data: {
          ...prev?.data,
          product: {
            ...prev?.data?.product,
            productcustomizeDetails: updatedItems,
          },
        },
      };
    });
  };

  const handleRemove = (item) => {
    setProductDetailsClone((prev) => {
      const updatedItems = prev?.data?.product?.productcustomizeDetails?.map(
        (element, i) => {
          if (element._id == item._id) {
            return { ...element, quantity: 1 };
          }
          return element;
        }
      );
      return {
        ...prev,
        data: {
          ...prev?.data,
          product: {
            ...prev?.data?.product,
            productcustomizeDetails: updatedItems,
          },
        },
      };
    });

    updateState({
      ...iState,
      customization: customization?.filter(
        (custom) => custom?.id !== item?._id
      ),
      totalPrice: totalPrice - item?.quantity * item?.price,
    });
  };
  const handleProduct = (item) => {
    navigate("/products/product-details", { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBook = (skip, isCustomEmpty) => {
    let formIsValid = isCustomEmpty ? handleValidation() : true;
    if (formIsValid) {
      const data = {
        userId: userDetail?._id,
        productId: getProductDetails?.data?.product?._id,
        prodname: getProductDetails?.data?.product?.productDetails?.productname,
        prodprice: getProductDetails?.data?.product?.priceDetails
          ?.discountedPrice
          ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
          : getProductDetails?.data?.product?.priceDetails?.price,
        prodimages: getProductDetails?.data?.product?.productimages?.at(0),
        productDescription:
          getProductDetails?.data?.product?.productDetails
            ?.producttitledescription,
        dateAdded,
        quantity: 1,
        slot: slots,
        customization: skip == "skip" ? [] : customization,
        totalAmount:
          skip == "skip"
            ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
              ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
              : getProductDetails?.data?.product?.priceDetails?.price
            : totalPrice,
      };
      dispatch(addtoCart(data))
        .then((res) => {
          console.log({ res });
          if (res?.payload?.message == "Added Successfully") {
            navigate("/checkout-1", { state: { ...data, totalPrice } });
          }
        })
        .catch((err) => {});
    }
  };

  const handlePageChange = (pageNumber) => {
    updateActivePage(pageNumber);
    ratingReviewList({
      customerId: userDetail?._id,
      productId: item?._id,
      page: pageNumber,
    })
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log("res in search", err);
      });
  };

  useEffect(() => {
    if (customization?.length > 0) {
      const data = {
        userId: userDetail?._id,
        productId: getProductDetails?.data?.product?._id,
        prodname: getProductDetails?.data?.product?.productDetails?.productname,
        prodprice: getProductDetails?.data?.product?.priceDetails
          ?.discountedPrice
          ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
          : getProductDetails?.data?.product?.priceDetails?.price,
        prodimages: getProductDetails?.data?.product?.productimages?.at(0),
        productDescription:
          getProductDetails?.data?.product?.productDetails
            ?.producttitledescription,
        dateAdded,
        quantity: 1,
        slot: slots,
        customization,
        totalAmount: totalPrice,
      };
      dispatch(addtoCart(data));
    }
  }, [customization]);

  useEffect(() => {
    let newState = { ...iState };
    if (pincode?.length >= 6) {
      newState = { ...newState, pincode_valid: false };
    }
    updateState(newState);
  }, [pincode]);

  const handleKeyDown = (e) => {
    const { name } = e.target;
    if (e.key == "Backspace" && name == "pincode") {
      updateState({ ...iState, pincode_valid: true });
    }
  };

  useEffect(() => {
    if (item) {
      dispatch(productDetails({ id: item?._id }));
      dispatch(
        ratingReviewList({ customerId: userDetail?._id, productId: item?._id })
      );
      dispatch(
        slotListApi({
          date: new Date().toISOString().split("T")[0],
          productId: item?._id,
        })
      );
      dispatch(addressListing({ userId: userDetail?._id }));
    }
  }, [item]);

  useEffect(() => {
    if (getSlotList) {
      updateState({
        ...iState,
        dateAdded: getSlotList?.date,
        minDate: minDate ? minDate : getSlotList?.date,
        slotList: getSlotList?.availableSlots,
      });
    }
    console.log("yess", getStaticSlotList, getSlotList);
    if (getStaticSlotList) {
      updateState({
        ...iState,
        slotList: getStaticSlotList?.slots,
      });
    }
  }, [getSlotList, getStaticSlotList]);

  useEffect(() => {
    if (getProductDetails) {
      setProductDetailsClone(getProductDetails);
    }
  }, [getProductDetails]);

  useEffect(() => {
    console.log("here in address");
    if (getAddressList) {
      if (getAddressList) {
        updateState({
          ...iState,
          pincode:
            getAddressList?.data?.Addresses?.length > 0
              ? getAddressList?.data?.Addresses?.at(0)?.pincode
              : "",
        });
      }
    }
  }, [getAddressList]);

  useEffect(() => {
    dispatch(
      ratingReviewList({
        customerId: userDetail?._id,
        productId: item?._id,
        rating,
      })
    );
  }, [rating]);

  console.log({ rating });

  // 2025-03-04

  return (
    <>
      <section>
        <div className="container-fluid">
          <div className="ProductDetailsArea">
            <div className="row">
              {/* <div className="col-12"> */}
              <div className="BreadCumbs">
                <ul>
                  <li>
                    <a
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a>
                      {
                        getProductDetails?.data?.product?.productDetails
                          ?.productcategory
                      }
                    </a>
                  </li>
                  <li>
                    {" "}
                    {
                      getProductDetails?.data?.product?.productDetails
                        ?.productname
                    }
                  </li>
                </ul>
              </div>
              {/* </div> */}
              <div className="col-md-6 col-12">
                <div
                  id="carouselExampleIndicators"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="row">
                    <div className="col-lg-3 order-2 order-lg-1">
                      <div className="zoomCarousel">
                        <div className="carousel-indicators">
                          {getProductDetails?.data?.product?.productimages?.map(
                            (img, i) => {
                              return (
                                <img
                                  key={i}
                                  data-bs-target="#carouselExampleIndicators"
                                  data-bs-slide-to={i}
                                  className={i == 0 ? "active" : ""}
                                  aria-current="true"
                                  aria-label={`Slide ${i + 1}`}
                                  src={img}
                                />
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-9 order-1 order-lg-2">
                      <div className="carousel-inner">
                        {getProductDetails?.data?.product?.productimages?.map(
                          (img, i) => {
                            return (
                              <div
                                className={
                                  i == 0
                                    ? "carousel-item active"
                                    : "carousel-item"
                                }
                                key={i}
                              >
                                <img
                                  key={i}
                                  src={img}
                                  alt={`Product ${i}`}
                                  className="d-block w-100 mb-2"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setPhotoIndex(i);
                                    setIsOpen(true);
                                  }}
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isOpen && (
                <Lightbox
                  toolbarButtons={[
                    <span
                      key="image-counter"
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        padding: "0 10px",
                      }}
                    >
                      {photoIndex + 1} /{" "}
                      {getProductDetails?.data?.product?.productimages.length}
                    </span>,
                  ]}
                  mainSrc={
                    getProductDetails?.data?.product?.productimages[photoIndex]
                  }
                  nextSrc={
                    getProductDetails?.data?.product?.productimages[
                      (photoIndex + 1) %
                        getProductDetails?.data?.product?.productimages.length
                    ]
                  }
                  prevSrc={
                    getProductDetails?.data?.product?.productimages[
                      (photoIndex +
                        getProductDetails?.data?.product?.productimages.length -
                        1) %
                        getProductDetails?.data?.product?.productimages.length
                    ]
                  }
                  onCloseRequest={() => setIsOpen(false)}
                  onMovePrevRequest={() =>
                    setPhotoIndex(
                      (photoIndex +
                        getProductDetails?.data?.product?.productimages.length -
                        1) %
                        getProductDetails?.data?.product?.productimages.length
                    )
                  }
                  onMoveNextRequest={() =>
                    setPhotoIndex(
                      (photoIndex + 1) %
                        getProductDetails?.data?.product?.productimages.length
                    )
                  }
                />
              )}
              <div className="col-md-6 col-12">
                <div className="PdRight">
                  <article>
                    <h3>
                      {
                        getProductDetails?.data?.product?.productDetails
                          ?.productname
                      }
                    </h3>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: getProductDetails?.data?.product?.productDetails
                          ?.producttitledescription
                          ? readMore
                            ? getProductDetails?.data?.product?.productDetails
                                ?.producttitledescription
                            : getProductDetails?.data?.product?.productDetails?.producttitledescription?.slice(
                                0,
                                200
                              ) + "..."
                          : "",
                      }}
                    ></p>
                    <span>
                      {" "}
                      <a
                        className="ShowAll"
                        onClick={() => {
                          updateState({ ...iState, readMore: !readMore });
                          window.scrollTo({ top: 150, behavior: "smooth" });
                        }}
                      >
                        Read {readMore ? "Less" : "More"}
                      </a>
                    </span>
                    <div className="Ratings">
                      <img
                        src={require("../../assets/images/rating-profile.png")}
                      />
                      <i class="fa-solid fa-star"></i>
                      <i class="fa-solid fa-star"></i>
                      <i class="fa-solid fa-star"></i>
                      <i class="fa-solid fa-star"></i>

                      <span>0 (0 Reviews)</span>
                    </div>
                    <h5>
                      <strong>₹</strong>
                      {getProductDetails?.data?.product?.priceDetails
                        ?.discountedPrice ? (
                        <>
                          <span className="discountedPrice">
                            {
                              getProductDetails.data.product.priceDetails
                                .discountedPrice
                            }
                          </span>
                          <span className="actualPrice">
                            ₹{getProductDetails.data.product.priceDetails.price}
                          </span>
                        </>
                      ) : (
                        <span className="price">
                          {
                            getProductDetails?.data?.product?.priceDetails
                              ?.price
                          }
                        </span>
                      )}
                      {getProductDetails?.data?.product?.priceDetails?.discountedPrice ? (
                        <span className="discountPercent">
                          {Math.round(
                            ((Number(getProductDetails?.data?.product?.priceDetails?.price) -
                              Number(getProductDetails?.data?.product?.priceDetails?.discountedPrice)) /
                              Number(getProductDetails?.data?.product?.priceDetails?.price)) *
                              100
                          )}
                          % off
                        </span>
                      ) : (
                        ""
                      )}
                      <span></span> /
                      {
                        getProductDetails?.data?.product?.productDetails
                          ?.productcategory
                      }
                    </h5>
                  </article>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Pin"
                          style={{
                            paddingLeft: 40,
                            border: errors?.pincodeError
                              ? "1px solid red"
                              : "1px solid rgba(48, 57, 67, 1)",
                          }}
                          name="pincode"
                          value={pincode}
                          onChange={pincode_valid ? handleInputChange : null}
                          onKeyDown={handleKeyDown}
                        />
                        <span className="error">{errors?.pincodeError}</span>
                        <i className="fa-solid fa-location-dot" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <input
                          type="date"
                          className="form-control"
                          name="dateAdded"
                          value={dateAdded}
                          min={minDate}
                          onChange={handleInputChange}
                          style={{
                            border: errors?.dateAddedError
                              ? "1px solid red"
                              : "1px solid rgba(48, 57, 67, 1)",
                          }}
                        />
                        <span className="error">{errors?.dateAddedError}</span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <select
                          className="form-control"
                          name="slots"
                          value={slots}
                          onChange={handleInputChange}
                          style={{
                            border: errors?.slotsError
                              ? "1px solid red"
                              : "1px solid rgba(48, 57, 67, 1)",
                          }}
                        >
                          <option value="">Select Slots</option>
                          {slotList?.length > 0
                            ? slotList?.map((item, i) => {
                                const timeSlot = convertTimeFormat(
                                  item?.startTime,
                                  item?.endTime
                                );
                                return (
                                  <option key={i} value={timeSlot}>
                                    {timeSlot}
                                  </option>
                                );
                              })
                            : ""}
                        </select>
                        <span className="error">{errors?.slotsError}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    onClick={
                      productDetailsClone?.data?.product
                        ?.productcustomizeDetails?.length == 0
                        ? () => handleBook("skip", true)
                        : () => handleNext()
                    }
                    className="Button"
                  >
                    Book Now
                  </a>
                  {/* <article >
                    <img  style={{margin:"10px 0"}}src={require("../../assets/images/Stats 1.png")}/>
                  </article> */}
                  {/* <aside>
                    <ul>
                      <li>
                        <img
                          src={require("../../assets/images/method-1.png")}
                        />
                      </li>
                      <li>
                        <img
                          src={require("../../assets/images/method-2.png")}
                        />
                      </li>
                      <li>
                        <img
                          src={require("../../assets/images/method-3.png")}
                        />
                      </li>
                      <li>
                        <img
                          src={require("../../assets/images/method-4.png")}
                        />
                      </li>
                      <li>
                        <img
                          src={require("../../assets/images/method-5.png")}
                        />
                      </li>
                    </ul>
                    <h3>Guaranteed Safe Checkout</h3>
                  </aside> */}
                  <div className="sixImages">
                    <ul>
                      <li>
                        <figure>
                          <img
                            src={require("../../assets/images/safe-secure.png")}
                            alt="img"
                          />
                          <figcaption>Safe & Secure Payments</figcaption>
                        </figure>
                      </li>
                      <li>
                        <figure>
                          <img
                            src={require("../../assets/images/guarantee.png")}
                            alt="img"
                          />
                          <figcaption>Guaranteed Service Excellence</figcaption>
                        </figure>
                      </li>
                      <li>
                        <figure>
                          <img
                            src={require("../../assets/images/flexible.png")}
                            alt="img"
                          />
                          <figcaption>Flexible Payment Plans</figcaption>
                        </figure>
                      </li>
                      <li>
                        <figure>
                          <img
                            src={require("../../assets/images/authentic.png")}
                            alt="img"
                          />
                          <figcaption>Authentic Event Photos</figcaption>
                        </figure>
                      </li>
                      <li>
                        <figure>
                          <img
                            src={require("../../assets/images/professional.png")}
                            alt="img"
                          />
                          <figcaption>Verified Client Reviews</figcaption>
                        </figure>
                      </li>
                      <li>
                        <figure>
                          <img
                            src={require("../../assets/images/decor.png")}
                            alt="img"
                          />
                          <figcaption>Professional Decor Experts</figcaption>
                        </figure>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="Main">
        <div className="TabsContentArea">
          <div className="container-fluid">
            <div className="Tabs">
              <ul className="nav">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    href="#Inclusion"
                    data-bs-toggle="tab"
                  >
                    Inclusion
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#AboutTheExperience"
                    data-bs-toggle="tab"
                  >
                    About The Experience
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#NeedToKnow"
                    data-bs-toggle="tab"
                  >
                    Need To Know
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#CancellationPolicy"
                    data-bs-toggle="tab"
                  >
                    Cancellation Policy
                  </a>
                </li>
              </ul>
            </div>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="Inclusion">
                <div className="Inclusion">
                  <div className="InclusionArea">
                    <h5>Inclusion</h5>
                    <ul>
                      {getProductDetails?.data?.product?.productdescription?.inclusion?.map(
                        (item, i) => {
                          return (
                            <li key={i}>
                              <i className="fa-solid fa-check" />
                              <span
                                dangerouslySetInnerHTML={{ __html: item }}
                              ></span>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="AboutTheExperience">
                <div className="AboutExperience">
                  <h5>About The Experience</h5>
                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        getProductDetails?.data?.product?.productdescription
                          ?.aboutexperience,
                    }}
                  />
                </div>
              </div>
              <div className="tab-pane fade" id="NeedToKnow">
                <div className="NeedToKnowArea">
                  <h5>Need To Know</h5>
                  <ul>
                    <li>
                      {/* <img src={require("../../assets/images/mark.png")} /> */}
                      <span
                        dangerouslySetInnerHTML={{
                          __html:
                            getProductDetails?.data?.product?.productdescription
                              ?.need,
                        }}
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="tab-pane fade" id="CancellationPolicy">
                <div className="CancellationPolicyArea">
                  <h5 />
                  <ul>
                    <li>
                      {/* <img src={require("../../assets/images/mark.png")} /> */}
                      <span
                        dangerouslySetInnerHTML={{
                          __html:
                            getProductDetails?.data?.product?.productdescription
                              ?.cancellation,
                        }}
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="PrivateDining" style={{ paddingTop: "20px" }}>
          <div className="container-fluid">
            <div className="section-title">
              <h2>Similar Product</h2>
            </div>
            <div className="row gy-5">
              {getProductDetails?.data?.similarProducts?.length > 0
                ? getProductDetails?.data?.similarProducts?.map((item, i) => {
                    return (
                      <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
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
                : ""}
            </div>
          </div>
        </div>
        <section>
          <div className="container-fluid">
            <div className="ProductReviewsArea">
              <h6>Product Reviews</h6>
              <div className="ReviewBox">
                <aside>
                  <CircularProgressbar
                    value={getRatingReviewList?.data?.overallRating}
                    text={`${
                      getRatingReviewList?.data?.overallRating
                        ? getRatingReviewList?.data?.overallRating
                        : 0
                    }`}
                    styles={buildStyles({
                      pathColor: "#2ba501",
                    })}
                  />
                  <div className="RatingBox">
                    <div className="Star">
                      {/* filled */}
                      {Array?.from({
                        length: Math.floor(
                          getRatingReviewList?.data?.overallRating
                        ),
                      })?.map((_, index) => (
                        <i class="fa-solid fa-star"></i>
                      ))}
                      {/* half-filled */}
                      {Number(getRatingReviewList?.data?.overallRating) >
                      Math?.floor(getRatingReviewList?.data?.overallRating) ? (
                        <i class="fa-solid fa-star-half-stroke"></i>
                      ) : (
                        ""
                      )}
                      {/* ufilled */}
                      {5 -
                        Math?.floor(getRatingReviewList?.data?.overallRating) ==
                      5 - Number(getRatingReviewList?.data?.overallRating)
                        ? Array?.from({
                            length:
                              5 -
                              Math.floor(
                                getRatingReviewList?.data?.overallRating
                              ),
                          })?.map((_, index) => (
                            <i class="fa-regular fa-star" key={index}></i>
                          ))
                        : Array?.from({
                            length:
                              5 -
                              Math.floor(
                                getRatingReviewList?.data?.overallRating
                              ) -
                              1,
                          })?.map((_, index) => (
                            <i class="fa-regular fa-star" key={index}></i>
                          ))}
                    </div>
                    <p>
                      from {getRatingReviewList?.data?.totalReviews} reviews
                    </p>
                  </div>
                </aside>
                <aside>
                  <div className="ProgressBarArea">
                    <ul>
                      {getRatingReviewList?.data?.ratingSummary?.length > 0
                        ? getRatingReviewList?.data?.ratingSummary?.map(
                            (item, i) => {
                              return (
                                <li>
                                  <label>
                                    {item?.rating}.0{" "}
                                    <i class="fa-solid fa-star"></i>
                                  </label>
                                  <div className="ProgressBar">
                                    <span
                                      className="Progress"
                                      style={{ width: `${item?.count}%` }}
                                    />
                                  </div>
                                  <strong>{item?.count}</strong>
                                </li>
                              );
                            }
                          )
                        : ""}
                    </ul>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>
        <div className="PrivateDining">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3">
                <div
                  className="FilterArea"
                  style={{
                    boxShadow: "none",
                    border: "1px solid #E4E9EE",
                    borderRadius: 12,
                  }}
                >
                  <h3 className="Heading">Reviews Filter</h3>
                  <div className="LeftCommonBox Green">
                    <div
                      className="FilterHeader"
                      data-bs-toggle="collapse"
                      href="#collapseExample"
                      role="button"
                      aria-expanded="true"
                      aria-controls="collapseExample"
                    >
                      <h6>Rating</h6>
                    </div>
                    <div className="collapse show" id="collapseExample">
                      <div className="card card-body">
                        <label className="CheckBox">
                          {" "}
                          <i class="fa-solid fa-star"></i> 5
                          <input
                            type="checkbox"
                            name="rating"
                            value={5}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark" />
                        </label>
                        <label className="CheckBox">
                          {" "}
                          <i class="fa-solid fa-star"></i> 4
                          <input
                            type="checkbox"
                            name="rating"
                            value={4}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark" />
                        </label>
                        <label className="CheckBox">
                          {" "}
                          <i class="fa-solid fa-star"></i> 3
                          <input
                            type="checkbox"
                            name="rating"
                            value={3}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark" />
                        </label>
                        <label className="CheckBox">
                          {" "}
                          <i class="fa-solid fa-star"></i> 2
                          <input
                            type="checkbox"
                            name="rating"
                            value={2}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark" />
                        </label>
                        <label className="CheckBox">
                          {" "}
                          <i class="fa-solid fa-star"></i> 1
                          <input
                            type="checkbox"
                            name="rating"
                            value={1}
                            onChange={handleInputChange}
                          />
                          <span className="checkmark" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9">
                <div className="ReviewListsArea">
                  <h3>Review Lists</h3>
                  {getRatingReviewList?.data?.review?.length > 0 ? (
                    getRatingReviewList?.data?.review?.map((item, i) => {
                      return (
                        <div className="RatingCommonBox">
                          <div className="RatingBox">
                            {Array?.from({ length: item?.rating })?.map(
                              (_, index) => {
                                return (
                                  <i class="fa-solid fa-star" key={index}></i>
                                );
                              }
                            )}
                            {Array?.from({
                              length: 5 - Number(item?.rating),
                            })?.map((_, index) => {
                              return (
                                <i class="fa-regular fa-star" key={index}></i>
                              );
                            })}
                          </div>
                          <h3>{item?.review}</h3>
                          <img src={item?.image} style={{ width: "70px" }} />
                          <p>
                            {formatDate(item?.createdAt?.split("T")?.at(0))}
                          </p>
                          <figure>
                            <img
                              src={item?.data?.personalInfo?.photo}
                              alt="img"
                            />
                            <figcaption>
                              {item?.data?.personalInfo?.name}
                            </figcaption>
                          </figure>
                        </div>
                      );
                    })
                  ) : !loading ? (
                    <p className="para">No Rating found.</p>
                  ) : (
                    ""
                  )}
                </div>
                {loading ? (
                  <p className="load">
                    <BeatLoader loading={loading} size={10} color="#02366f" />
                  </p>
                ) : (
                  ""
                )}
                {/* <div className="pagination">
                  <ul className="pagination">
                    {getRatingReviewList?.data?.pagination?.totalPages > 0 && (
                      <Pagination
                        activePage={activePage}
                        itemsCountPerPage={10}
                        totalItemsCount={
                          getRatingReviewList?.data?.pagination?.totalPages
                        }
                        pageRangeDisplayed={5}
                        onChange={handlePageChange}
                        itemClass="page-item"
                        linkClass="page-link"
                      />
                    )}
                  </ul>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="ModalBox LargeModal"
        show={customModal}
        onHide={() => updateState({ ...iState, customModal: false })}
      >
        <a
          className="CloseModal"
          onClick={() => updateState({ ...iState, customModal: false })}
        >
          ×
        </a>
        <div className="ModalArea">
          <h3>Select Customizations</h3>
          <div className="FormArea">
            <section>
              <div className="CustomizationsArea Modal">
                <div className="scrollDiv">
                  <div className="row gy-4">
                    {productDetailsClone?.data?.product?.productcustomizeDetails
                      ?.length > 0 ? (
                      productDetailsClone?.data?.product?.productcustomizeDetails?.map(
                        (item, i) => {
                          return (
                            <div
                              className="col-lg-3 col-md-4 col-sm-6 col-6"
                              key={i}
                            >
                              <div className="PrivateDiningBox customeDiningBox">
                                <figure>
                                  <img src={item?.customimages} alt="img" />
                                </figure>
                                <h6>{item?.name}</h6>

                                <div className="Info">
                                  <h5>₹{item?.price}</h5>
                                  {customization?.find(
                                    (custom) => custom?.id == item._id
                                  ) ? (
                                    <div
                                      className="quantityBtn"
                                      style={{ marginBottom: "11px" }}
                                    >
                                      <span
                                        className="Btn"
                                        onClick={() => handleDecrement(item)}
                                      >
                                        -
                                      </span>
                                      {item?.quantity}
                                      <span
                                        className="Btn"
                                        onClick={() => handleIncrement(item)}
                                      >
                                        +
                                      </span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="Info">
                                  {customization?.find(
                                    (custom) => custom?.id == item?._id
                                  ) ? (
                                    <a
                                      onClick={() => handleRemove(item)}
                                      className="AddToCartBtn"
                                      style={{ backgroundColor: "#e93030" }}
                                    >
                                      Remove
                                      <i
                                        style={{ marginLeft: "3px" }}
                                        class="fa-solid fa-xmark"
                                      ></i>
                                    </a>
                                  ) : (
                                    ""
                                  )}

                                  {customization?.find(
                                    (custom) => custom?.id == item?._id
                                  ) ? (
                                    <span>
                                      Added<i class="fa-solid fa-check"></i>
                                    </span>
                                  ) : (
                                    <a
                                      className="AddToCartBtn"
                                      onClick={() => handleCart(item)}
                                      style={{
                                        cursor: customization?.find(
                                          (custom) => custom?.id == item?._id
                                        )
                                          ? "not-allowed"
                                          : "pointer",
                                      }}
                                    >
                                      Add to Cart
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                    ) : (
                      <p style={{ textAlign: "center" }}>
                        No Customization are Available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
            <a
              style={{
                fontWeight: "700",
                marginTop: "20px",
                display: "inline-block",
              }}
            >
              Total: ₹{totalPrice}
            </a>
            <div className="bookButton mt-3 ml-auto ms-auto text-end">
              <button
                className="Button"
                onClick={() => handleBook("skip", false)}
              >
                Skip
              </button>

              <button
                className="Button"
                onClick={() => handleBook("", false)}
                style={{
                  backgroundColor: "#b1b1b1",
                  color: "#000",
                  outline: "none",
                  borderColor: "transparent",
                  marginLeft: "10px",
                }}
              >
                Book
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductDetails;
