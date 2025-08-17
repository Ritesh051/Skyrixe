import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  productDetails,
  slotListApi,
} from "../../reduxToolkit/Slices/ProductList/listApis";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { addtoCart } from "../../reduxToolkit/Slices/Cart/bookingApis";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { ratingReviewList } from "../../reduxToolkit/Slices/ReviewAndRating/reviewRatingApis";
import "react-circular-progressbar/dist/styles.css";
import { BeatLoader } from "react-spinners";
import { addressListing } from "../../reduxToolkit/Slices/Auth/auth";
import BookingFlow from "../Modals/BookingFlow";
import "./ProductDetails.css";

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
  // Simplified modal flow - only use BookingFlow
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const item = location?.state;
  const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));
  const LennyPincode = JSON.parse(window.localStorage.getItem("LennyPincode"));
  const [productDetailsClone, setProductDetailsClone] = useState("");
  const [activePage, updateActivePage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [iState, updateState] = useState(initialState);
  const {
    pincode,
    slots,
    minDate,
    dateAdded,
    errors,
    pincode_valid,
    customModal,
    customization,
    totalPrice,
    rating,
  } = iState;
  const { getProductDetails, getSlotList, getStaticSlotList, loader } =
    useSelector((state) => state.productList);
  const { getRatingReviewList } = useSelector(
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
        modifiedValue?.length === 6 &&
        modifiedValue != LennyPincode?.find((item) => item === modifiedValue) &&
        e.key != "Backspace"
      ) {
        toast.error(
          "Sorry, our service is currently unavailable for the entered Pincode!!",
          {
            position: "top-center",
          }
        );
      } else if (
        modifiedValue?.length === 6 &&
        modifiedValue === LennyPincode?.find((item) => item === modifiedValue)
      ) {
        toast.success(
          "Our service is available in your location, Please proceed with your booking.",
          {
            position: "top-center",
          }
        );
      }
    } else if (name === "dateAdded") {
      updateState({
        ...iState,
        [name]: value,
        errors: { ...errors, slotsError: "", dateAddedError: "" },
      });
      dispatch(slotListApi({ date: value, productId: item?._id }));
    } else if (name === "rating") {
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

    if (pincode && pincode != LennyPincode?.find((item) => item === pincode)) {
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

  // Simplified booking flow handler
  const handleBookingFlowComplete = (bookingData) => {
    console.log('Booking completed with data:', bookingData);
    setShowBookingFlow(false);

    // Navigate to checkout or handle booking completion
    const cartData = {
      userId: userDetail?._id,
      productId: getProductDetails?.data?.product?._id,
      prodname: getProductDetails?.data?.product?.productDetails?.productname,
      prodprice: getProductDetails?.data?.product?.priceDetails?.discountedPrice
        ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
        : getProductDetails?.data?.product?.priceDetails?.price,
      prodimages: getProductDetails?.data?.product?.productimages?.at(0),
      productDescription: getProductDetails?.data?.product?.productDetails?.producttitledescription,
      dateAdded: bookingData.selectedDate,
      quantity: 1,
      slot: bookingData.selectedTimeSlot?.time,
      customization: bookingData.selectedCustomizations || [],
      totalAmount: getProductDetails?.data?.product?.priceDetails?.discountedPrice
        ? getProductDetails?.data?.product?.priceDetails?.discountedPrice +
        (bookingData.selectedCustomizations?.reduce((sum, item) => sum + item.price, 0) || 0)
        : getProductDetails?.data?.product?.priceDetails?.price +
        (bookingData.selectedCustomizations?.reduce((sum, item) => sum + item.price, 0) || 0),
    };

    dispatch(addtoCart(cartData))
      .then((res) => {
        if (res?.payload?.message === "Added Successfully") {
          navigate("/checkout-1", { state: cartData });
        }
      })
      .catch((err) => {
        console.error('Cart error:', err);
      });
  };

  const handleNext = () => {
    let formIsValid = handleValidation();
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
        navigate("/login");
      }
    }
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
          if (element._id === item._id) {
            const newQty = Number(element.quantity) + 1;
            const data = {
              name: item?.name,
              price: item?.price,
              customimages: item?.customimages,
              qty: newQty,
              id: item?._id,
            };
            if (customization?.find((custom) => custom?.id === item?._id)) {
              updateState({
                ...iState,
                totalPrice: totalPrice + item?.price,
                customization: customization?.map((custom, i) => {
                  if (custom?.id === item?._id) {
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
        (element) => {
          if (element._id === item._id) {
            if (Number(item.quantity) > 1) {
              const newQty = Number(element.quantity) - 1;
              const data = {
                name: item?.name,
                price: item?.price,
                customimages: item?.customimages,
                qty: newQty,
                id: item?._id,
              };
              if (customization?.find((custom) => custom?.id === item?._id)) {
                updateState({
                  ...iState,
                  totalPrice: totalPrice - item?.price,
                  customization: customization?.map((custom, i) => {
                    if (custom?.id === item?._id) {
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
          if (element._id === item._id) {
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
          skip === "skip"
            ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
              ? getProductDetails?.data?.product?.priceDetails?.discountedPrice
              : getProductDetails?.data?.product?.priceDetails?.price
            : totalPrice,
      };
      dispatch(addtoCart(data))
        .then((res) => {
          if (res?.payload?.message === "Added Successfully") {
            navigate("/checkout-1", { state: { ...data, totalPrice } });
          }
        })
        .catch((err) => { });
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
      })
      .catch((err) => {
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
    if (e.key == "Backspace" && name === "pincode") {
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

  return (
    <>
      <section className="product-details-section">
        <div className="container-fluid">
          {loader ? (
            <div className="loading-wrapper">
              <BeatLoader loading={loader} size={15} color="#e5097f" />
            </div>
          ) : (
            <div className="ProductDetailsArea enhanced">
              <div className="row">
                {/* Breadcrumbs */}
                <div className="col-12">
                  <nav className="BreadCumbs enhanced" aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a
                          onClick={() => navigate("/")}
                          className="breadcrumb-link"
                        >
                          <i className="fa-solid fa-home"></i> Home
                        </a>
                      </li>
                      <li className="breadcrumb-item">
                        <a className="breadcrumb-link">
                          {getProductDetails?.data?.product?.productDetails?.productcategory}
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        {getProductDetails?.data?.product?.productDetails?.productname}
                      </li>
                    </ol>
                  </nav>
                </div>

                {/* Product Gallery */}
                <div className="col-lg-6 col-12">
                  <div className="product-gallery-wrapper">
                    <div className="main-image-container">
                      {/* Discount Badge on Image */}
                      {getProductDetails?.data?.product?.priceDetails?.discountedPrice && (
                        <div className="image-discount-badge">
                          {Math.round(
                            ((Number(getProductDetails?.data?.product?.priceDetails?.price) -
                              Number(getProductDetails?.data?.product?.priceDetails?.discountedPrice)) /
                              Number(getProductDetails?.data?.product?.priceDetails?.price)) *
                            100
                          )}% OFF
                        </div>
                      )}

                      <div className="carousel-inner enhanced">
                        <div className="carousel-item active">
                          <div className="image-zoom-wrapper">
                            <InnerImageZoom
                              src={getProductDetails?.data?.product?.productimages?.[photoIndex]}
                              zoomSrc={getProductDetails?.data?.product?.productimages?.[photoIndex]}
                              alt={`${getProductDetails?.data?.product?.productDetails?.productname} - Image ${photoIndex + 1}`}
                              className="main-product-image"
                              onClick={() => {
                                setIsOpen(true);
                              }}
                            />
                            <div className="image-overlay">
                              <i className="fa-solid fa-expand"></i>
                              <span>Click to zoom</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image Counter */}
                      <div className="image-counter">
                        <span>
                          {photoIndex + 1} / {getProductDetails?.data?.product?.productimages?.length}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className="thumbnail-gallery">
                      <div className="thumbnails-wrapper">
                        {getProductDetails?.data?.product?.productimages?.map(
                          (img, i) => (
                            <div
                              key={i}
                              className={`thumbnail-item ${i === photoIndex ? "active" : ""}`}
                              onClick={() => setPhotoIndex(i)}
                            >
                              <img
                                src={img}
                                alt={`Thumbnail ${i + 1}`}
                                className="thumbnail-image"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Why Skyrixe Info Box */}
                  <div className="why-skyrixe-box">
                    <h3 className="why-skyrixe-title">
                      Why <span className="why-skyrixe-heart">❤</span> Skyrixe ?
                    </h3>
                    <ul className="why-skyrixe-list">
                      <li>
                        <span className="why-skyrixe-icon">👍</span>
                        <span><b>Trusted Platform</b> - More than 10,000 celebrations every month</span>
                      </li>
                      <li>
                        <span className="why-skyrixe-icon">👍</span>
                        <span><b>Professional Team</b> - Follows all Safety Measures & Sanitisation Requirements</span>
                      </li>
                      <li>
                        <span className="why-skyrixe-icon">👍</span>
                        <span><b>Complete Confidence</b> - Browse all Verified Reviews and Original Photographs</span>
                      </li>
                      <li>
                        <span className="why-skyrixe-icon">👍</span>
                        <span><b>100% Refund</b> - In case of non-availability, a complete refund of total amount is initiated</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Product Information */}
                <div className="col-lg-6 col-12">
                  <div className="product-info-wrapper">
                    <div className="product-info">
                      <nav className="product-info-breadcrumb">
                        <span className="breadcrumb-link" onClick={() => navigate("/")}>Home</span>
                        <span className="breadcrumb-separator">&gt;</span>
                        <span className="breadcrumb-current">
                          {getProductDetails?.data?.product?.productDetails?.productname}
                        </span>
                      </nav>
                      <h2 className="product-info-title">
                        {getProductDetails?.data?.product?.productDetails?.productname}
                      </h2>
                      <p className="product-info-subtitle">
                        {getProductDetails?.data?.product?.productDetails?.productname}
                      </p>
                      <div className="product-info-rating">
                        <span className="product-info-stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`fa-solid fa-star${i < Math.round(getRatingReviewList?.data?.overallRating || 0) ? ' filled' : ''}`}></i>
                          ))}
                        </span>
                        <span className="product-info-reviews">
                          {getRatingReviewList?.data?.totalReviews || 0} Reviews
                          <i className="fa-solid fa-chevron-right" style={{ marginLeft: '5px' }}></i>
                        </span>
                      </div>
                    </div>

                    <div className="booking-summary-box">
                      <div className="booking-summary-price">
                        <span className="booking-summary-currency">₹</span>
                        <span className="booking-summary-amount">
                          {getProductDetails?.data?.product?.priceDetails?.discountedPrice || getProductDetails?.data?.product?.priceDetails?.price}
                        </span>
                        <span className="booking-summary-type">/ decoration</span>
                      </div>
                      <div className="booking-summary-form">
                        <div className="booking-summary-group">
                          <span className="booking-summary-icon"><i className="fa-solid fa-location-dot"></i></span>
                          <input
                            type="text"
                            className={`booking-summary-input ${errors?.pincodeError ? 'error' : ''}`}
                            placeholder="Enter Pincode"
                            name="pincode"
                            value={pincode}
                            onChange={pincode_valid ? handleInputChange : null}
                            onKeyDown={handleKeyDown}
                            maxLength="6"
                          />
                        </div>
                        <div className="booking-summary-hint">Don't know pincode?</div>
                        <div className="booking-summary-group">
                          <span className="booking-summary-icon"><i className="fa-solid fa-calendar"></i></span>
                          <button
                            className="booking-summary-date-btn"
                            onClick={() => setShowBookingFlow(true)}
                          >
                            Select Date & Time
                          </button>
                        </div>
                        <div className="booking-summary-note">
                          Our decorator will come and complete the decoration <b>anytime between the selected time range</b>
                        </div>

                        {/* MAIN BOOK NOW BUTTON - SIMPLIFIED */}
                        <button
                          className="booking-summary-book-btn"
                          onClick={() => setShowBookingFlow(true)}
                        >
                          BOOK NOW <span className="booking-summary-arrow"><i className="fa-solid fa-arrow-right"></i></span>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Trust Indicators */}
                  <div className="trust-indicators">
                    <div className="trust-grid">
                      <div className="trust-item">
                        <div className="trust-icon">
                          <img
                            src={require("../../assets/images/safe-secure.png")}
                            alt="Safe & Secure"
                          />
                        </div>
                        <span className="trust-text">Safe & Secure Payments</span>
                      </div>
                      <div className="trust-item">
                        <div className="trust-icon">
                          <img
                            src={require("../../assets/images/guarantee.png")}
                            alt="Guarantee"
                          />
                        </div>
                        <span className="trust-text">Service Excellence</span>
                      </div>
                      <div className="trust-item">
                        <div className="trust-icon">
                          <img
                            src={require("../../assets/images/flexible.png")}
                            alt="Flexible"
                          />
                        </div>
                        <span className="trust-text">Flexible Plans</span>
                      </div>
                      <div className="trust-item">
                        <div className="trust-icon">
                          <img
                            src={require("../../assets/images/authentic.png")}
                            alt="Authentic"
                          />
                        </div>
                        <span className="trust-text">Authentic Work</span>
                      </div>
                      <div className="trust-item">
                        <div class="trust-icon">
                          <img
                            src={require("../../assets/images/professional.png")}
                            alt="Professional"
                          />
                        </div>
                        <span className="trust-text">Verified Reviews</span>
                      </div>
                      <div className="trust-item">
                        <div className="trust-icon">
                          <img
                            src={require("../../assets/images/decor.png")}
                            alt="Professional"
                          />
                        </div>
                        <span className="trust-text">Expert Professionals</span>
                      </div>
                    </div>
                  </div>

                  {/* Inclusions Section */}
                  <div className="product-info-wrapper inclusions-section">
                    <div className="product-info">
                      <div className="section-title"><i className="fa-solid fa-list-check"></i>Inclusions</div>
                      <hr />
                      <div className="inclusions-list">
                        {getProductDetails?.data?.product?.productdescription?.inclusion?.map(
                          (item, i) => (
                            <div key={i} className="inclusion-item">
                              <div
                                className="inclusion-text"
                                dangerouslySetInnerHTML={{ __html: item }}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Experience Section */}
                    <div className="product-info">
                      <div className="section-title"><i className="fa-solid fa-info-circle"></i>About The Experience</div>
                      <div className="description-content">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: getProductDetails?.data?.product?.productdescription?.aboutexperience,
                          }}
                        />
                      </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviews-section-card">
                      <div className="section-title">
                        <i className="fa-solid fa-star reviews-section-icon" /> Reviews
                      </div>
                      <div className="reviews-header">
                        <h3 className="reviews-title">Reviews</h3>
                        <div className="reviews-summary">
                          <span className="reviews-rating">
                            {getRatingReviewList?.data?.overallRating?.toFixed(2)}
                            <span className="reviews-stars">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <i key={i} className={`fa-star ${i < Math.round(getRatingReviewList?.data?.overallRating || 0) ? 'fa-solid reviews-star-filled' : 'fa-regular reviews-star-empty'}`}></i>
                              ))}
                            </span>
                          </span>
                          <span className="reviews-count">{getRatingReviewList?.data?.totalReviews} Reviews</span>
                        </div>
                      </div>
                      <div className="reviews-list">
                        {getRatingReviewList?.data?.review?.length > 0 ? (
                          getRatingReviewList?.data?.review?.slice(0, 3).map((item, i) => (
                            <div key={i} className="review-item">
                              <div className="review-avatar">
                                <i className="fa-solid fa-user"></i>
                              </div>
                              <div className="review-content">
                                <div className="review-author">{item?.data?.personalInfo?.name || 'Anonymous'}</div>
                                <div className="review-date">Reviewed in August</div>
                                <div className="review-verified">Verified Purchase</div>
                                <div className="review-stars">
                                  {Array.from({ length: item?.rating }).map((_, idx) => (
                                    <i key={idx} className="fa-solid fa-star reviews-star-filled"></i>
                                  ))}
                                  {Array.from({ length: 5 - Number(item?.rating) }).map((_, idx) => (
                                    <i key={idx} className="fa-regular fa-star reviews-star-empty"></i>
                                  ))}
                                </div>
                                <div className="review-text">{item?.review}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no-reviews">No reviews yet.</div>
                        )}
                      </div>
                      <div className="reviews-readmore">
                        <span className="reviews-readmore-link">+ Read More Reviews</span>
                      </div>
                    </div>

                    <div className="need-to-know-section">
                      <div className="section-title">
                        <i className="fas fa-info-circle needtoknow-icon" /> Need To Know
                      </div>
                      <div className="needtoknow-content" dangerouslySetInnerHTML={{
                        __html: getProductDetails?.data?.product?.productdescription?.need,
                      }} />
                    </div>

                    <div className="faq-section">
                      <div className="section-title">
                        <i className="fas fa-question-circle faq-icon" /> Frequently Asked Questions
                      </div>
                      <div className="faq-list">
                        <div className="faq-item">
                          <div className="faq-question">How will you take my address and other details ?</div>
                          <div className="faq-answer">After the payment is completed a form will open on the website or the app which will ask you for your address, balloon color choices, cake flavor etc. Which you can fill online. If we have any doubts someone from CherishX team will call you and take additional details. You will always have our post-sales number in-case you want to discuss something.</div>
                        </div>
                        <div className="faq-item">
                          <div className="faq-question">What balloon colors do you have & how can I select the balloon colors?</div>
                          <div className="faq-answer">Decoration will be done as in the pictures. In case you require different color balloons combination, please inform us over email or call us at 8081833833</div>
                        </div>
                        <div className="faq-readmore">+ Read More FAQ's</div>
                      </div>
                    </div>

                    <div className="location-section">
                      <div className="section-title">
                        <i className="fas fa-map-marker-alt location-icon" /> Location
                      </div>
                      <div className="location-content">At Your Home</div>
                    </div>

                    {/* Cancellation Policy Section */}
                    <div className="cancellation-section">
                      <div className="section-title">
                        <i className="fa-solid fa-ban cancellation-icon" /> Cancellation Policy
                      </div>
                      <div className="cancellation-content" dangerouslySetInnerHTML={{
                        __html: getProductDetails?.data?.product?.productdescription?.cancellation,
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox for Image Gallery */}
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
              {photoIndex + 1} / {getProductDetails?.data?.product?.productimages.length}
            </span>,
          ]}
          mainSrc={getProductDetails?.data?.product?.productimages[photoIndex]}
          nextSrc={
            getProductDetails?.data?.product?.productimages[
            (photoIndex + 1) % getProductDetails?.data?.product?.productimages.length
            ]
          }
          prevSrc={
            getProductDetails?.data?.product?.productimages[
            (photoIndex + getProductDetails?.data?.product?.productimages.length - 1) %
            getProductDetails?.data?.product?.productimages.length
            ]
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + getProductDetails?.data?.product?.productimages.length - 1) %
              getProductDetails?.data?.product?.productimages.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex(
              (photoIndex + 1) % getProductDetails?.data?.product?.productimages.length
            )
          }
        />
      )}


      <div className="similar-products-section">
        <div className="container-fluid">
          <div className="section-header">
            <h2 className="section-title">
              Similar Products
            </h2>
            <a href="#" className="view-more-link">View More</a>
          </div>

          <div className="similar-products-grid">
            {getProductDetails?.data?.similarProducts?.length > 0
              ? getProductDetails?.data?.similarProducts?.map((item, i) => (
                <div className="product-card" key={i}>
                  <div className="product-image-wrapper">
                    <img
                      onClick={() => handleProduct(item)}
                      src={item?.productimages?.at(0)}
                      alt={item?.productDetails?.productname}
                      className="product-image"
                    />

                    {/* Favorite/Heart Button */}
                    <button className="product-favorite">
                      <i className="fa-regular fa-heart"></i>
                    </button>

                    {/* Discount Badge */}
                    {item?.priceDetails?.discountedPrice && (
                      <div className="discount-badge">
                        {Math.round(
                          ((Number(item?.priceDetails?.price) -
                            Number(item?.priceDetails?.discountedPrice)) /
                            Number(item?.priceDetails?.price)) *
                          100
                        )}% OFF
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="product-overlay">
                      <button
                        className="quick-view-btn"
                        onClick={() => handleProduct(item)}
                      >
                        <i className="fa-solid fa-eye"></i>
                        Quick View
                      </button>
                    </div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">
                      {item?.productDetails?.productname}
                    </h3>

                    <div className="product-pricing">
                      {item?.priceDetails?.discountedPrice ? (
                        <div className="price-container">
                          <span className="current-price">
                            ₹{item?.priceDetails?.discountedPrice}
                          </span>
                          <span className="original-price">
                            ₹{item?.priceDetails?.price}
                          </span>
                        </div>
                      ) : (
                        <span className="current-price">
                          ₹{item?.priceDetails?.price}
                        </span>
                      )}
                    </div>

                    <div className="product-rating">
                      <div className="stars">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <i key={index} className="fa-solid fa-star"></i>
                        ))}
                      </div>
                      <span className="rating-count">
                        4.{Math.floor(Math.random() * 9) + 1} ({10 + i * 3 + Math.floor(Math.random() * 50)})
                      </span>
                    </div>
                  </div>
                </div>
              ))
              : (
                <div className="no-products">
                  <i className="fa-solid fa-box-open"></i>
                  <p>No similar products found</p>
                </div>
              )}
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
                                        className="fa-solid fa-xmark"
                                      ></i>
                                    </a>
                                  ) : (
                                    ""
                                  )}

                                  {customization?.find(
                                    (custom) => custom?.id == item?._id
                                  ) ? (
                                    <span>
                                      Added<i className="fa-solid fa-check"></i>
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

      {/* MAIN BOOKING FLOW MODAL - SIMPLIFIED */}
      <BookingFlow
        show={showBookingFlow}
        onHide={() => setShowBookingFlow(false)}
        onComplete={handleBookingFlowComplete}
      />
    </>
  );
};

export default ProductDetails;