import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  productDetails,
  signUpState,
  slotListApi,
  staticSlotListApi,
} from "../../reduxToolkit/Slices/ProductList/listApis";
import { toast } from "react-toastify";
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
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  Clock,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Check,
  Shield,
  Award,
  CreditCard,
  Camera,
  Users,
  Palette
} from "lucide-react";

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
  isWishlisted: false,
  selectedImageIndex: 0,
};

const ProductDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const item = location?.state;
  const [iState, updateState] = useState(initialState);
  const [productDetailsClone, setProductDetailsClone] = useState("");
  const [activePage, updateActivePage] = useState(1);
  const [activeTab, setActiveTab] = useState("inclusion");
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Get user details and pincode from localStorage
  const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));
  const LennyPincode = JSON.parse(window.localStorage.getItem("LennyPincode"));

  // Destructure state
  const {
    largeImg,
    pincode,
    minDate,
    dateAdded,
    slots,
    slotList,
    errors,
    pincode_valid,
    customModal,
    customization,
    totalPrice,
    readMore,
    id,
    rating,
    isWishlisted,
    selectedImageIndex,
  } = iState;

  // Redux selectors
  const { getProductDetails, getSlotList, getStaticSlotList, loader } = useSelector((state) => state.productList);
  const { getRatingReviewList, loading } = useSelector((state) => state.reviewRating);
  const { getAddressList } = useSelector((state) => state.auth);

  // Memoized calculations
  const discountPercentage = useMemo(() => {
    if (getProductDetails?.data?.product?.priceDetails?.discountedPrice) {
      const original = Number(getProductDetails.data.product.priceDetails.price);
      const discounted = Number(getProductDetails.data.product.priceDetails.discountedPrice);
      return Math.round(((original - discounted) / original) * 100);
    }
    return 0;
  }, [getProductDetails]);

  const currentPrice = useMemo(() => {
    return getProductDetails?.data?.product?.priceDetails?.discountedPrice ||
      getProductDetails?.data?.product?.priceDetails?.price;
  }, [getProductDetails]);

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

  const handleWishlist = () => {
    updateState({ ...iState, isWishlisted: !isWishlisted });
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      { position: "top-center" }
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: getProductDetails?.data?.product?.productDetails?.productname,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!", { position: "top-center" });
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
        (element) => {
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
                customization: customization?.map((custom) =>
                  custom?.id === item?._id ? { ...custom, qty: newQty } : custom
                ),
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
          if (element._id === item._id && Number(item.quantity) > 1) {
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
                customization: customization?.map((custom) =>
                  custom?.id === item?._id ? { ...custom, qty: newQty } : custom
                ),
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

  const handleRemove = (item) => {
    setProductDetailsClone((prev) => {
      const updatedItems = prev?.data?.product?.productcustomizeDetails?.map(
        (element) => {
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
      customization: customization?.filter((custom) => custom?.id !== item?._id),
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
        prodprice: currentPrice,
        prodimages: getProductDetails?.data?.product?.productimages?.at(0),
        productDescription:
          getProductDetails?.data?.product?.productDetails?.producttitledescription,
        dateAdded,
        quantity: 1,
        slot: slots,
        customization: skip === "skip" ? [] : customization,
        totalAmount: skip === "skip" ? currentPrice : totalPrice,
      };

      dispatch(addtoCart(data))
        .then((res) => {
          if (res?.payload?.message === "Added Successfully") {
            navigate("/checkout-1", { state: { ...data, totalPrice } });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  // Enhanced Breadcrumb Component
  const Breadcrumb = () => (
    <nav className="modern-breadcrumb">
      <div className="breadcrumb-container">
        <button
          onClick={() => navigate("/")}
          className="breadcrumb-item breadcrumb-home"
        >
          Home
        </button>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-item">
          {getProductDetails?.data?.product?.productDetails?.productcategory}
        </span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-item breadcrumb-current">
          {getProductDetails?.data?.product?.productDetails?.productname}
        </span>
      </div>
    </nav>
  );

  // Enhanced Image Gallery Component
  const ImageGallery = () => (
    <div className="modern-image-gallery">
      <div className="main-image-container">
        <img
          src={getProductDetails?.data?.product?.productimages?.[selectedImageIndex]}
          alt="Product"
          className="main-image"
          onClick={() => {
            setPhotoIndex(selectedImageIndex);
            setIsOpen(true);
          }}
        />
        <div className="image-overlay">
          <button className="zoom-button" onClick={() => setIsOpen(true)}>
            <Camera size={20} />
            View Gallery
          </button>
        </div>
      </div>
      <div className="thumbnail-container">
        {getProductDetails?.data?.product?.productimages?.map((img, i) => (
          <button
            key={i}
            className={`thumbnail ${i === selectedImageIndex ? 'active' : ''}`}
            onClick={() => updateState({ ...iState, selectedImageIndex: i })}
          >
            <img src={img} alt={`Product ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );

  // Enhanced Product Info Component
  const ProductInfo = () => (
    <div className="modern-product-info">
      <div className="product-header">
        <div className="product-title-section">
          <h1 className="product-title">
            {getProductDetails?.data?.product?.productDetails?.productname}
          </h1>
          <div className="product-actions">
            <button
              className={`action-button ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlist}
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button className="action-button" onClick={handleShare}>
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <div className="rating-section">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < 4 ? '#ffc107' : 'none'}
                color="#ffc107"
              />
            ))}
          </div>
          <span className="rating-text">4.0 (0 Reviews)</span>
        </div>

        <div className="price-section">
          <div className="price-container">
            <span className="current-price">₹{currentPrice}</span>
            {getProductDetails?.data?.product?.priceDetails?.discountedPrice && (
              <>
                <span className="original-price">
                  ₹{getProductDetails.data.product.priceDetails.price}
                </span>
                <span className="discount-badge">{discountPercentage}% OFF</span>
              </>
            )}
          </div>
          <span className="price-per">
            per {getProductDetails?.data?.product?.productDetails?.productcategory}
          </span>
        </div>
      </div>

      <div className="product-description">
        <p
          className="description-text"
          dangerouslySetInnerHTML={{
            __html: readMore
              ? getProductDetails?.data?.product?.productDetails?.producttitledescription
              : getProductDetails?.data?.product?.productDetails?.producttitledescription?.slice(0, 200) + "..."
          }}
        />
        <button
          className="read-more-button"
          onClick={() => updateState({ ...iState, readMore: !readMore })}
        >
          {readMore ? 'Show Less' : 'Read More'}
        </button>
      </div>

      <div className="booking-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} />
              Pincode
            </label>
            <input
              type="text"
              className={`form-input ${errors?.pincodeError ? 'error' : ''}`}
              placeholder="Enter pincode"
              name="pincode"
              value={pincode}
              maxLength="6"
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => {
                // Only allow numeric input
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  handleInputChange({
                    target: {
                      name: 'pincode',
                      value: value,
                      checked: false
                    }
                  });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && e.target.name === "pincode") {
                  updateState({ ...iState, pincode_valid: true });
                }
              }}
            />
            {errors?.pincodeError && (
              <span className="error-message">{errors.pincodeError}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Calendar size={16} />
              Date
            </label>
            <input
              type="date"
              className={`form-input ${errors?.dateAddedError ? 'error' : ''}`}
              name="dateAdded"
              value={dateAdded}
              min={minDate}
              onChange={handleInputChange}
            />
            {errors?.dateAddedError && (
              <span className="error-message">{errors.dateAddedError}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Clock size={16} />
              Time Slot
            </label>
            <select
              className={`form-input ${errors?.slotsError ? 'error' : ''}`}
              name="slots"
              value={slots}
              onChange={handleInputChange}
            >
              <option value="">Select time slot</option>
              {slotList?.map((item, i) => {
                const timeSlot = convertTimeFormat(item?.startTime, item?.endTime);
                return (
                  <option key={i} value={timeSlot}>
                    {timeSlot}
                  </option>
                );
              })}
            </select>
            {errors?.slotsError && (
              <span className="error-message">{errors.slotsError}</span>
            )}
          </div>
        </div>

        <button
          onClick={
            productDetailsClone?.data?.product?.productcustomizeDetails?.length === 0
              ? () => handleBook("skip", true)
              : handleNext
          }
          className="Buttons"
        >
          <ShoppingCart size={20} />
          Book Now
        </button>
      </div>

      <div className="trust-badges">
        <div className="badge-grid">
          <div className="trust-badge">
            <Shield size={20} />
            <span>Safe & Secure Payments</span>
          </div>
          <div className="trust-badge">
            <Award size={20} />
            <span>Guaranteed Service Excellence</span>
          </div>
          <div className="trust-badge">
            <CreditCard size={20} />
            <span>Flexible Payment Plans</span>
          </div>
          <div className="trust-badge">
            <Camera size={20} />
            <span>Authentic Event Photos</span>
          </div>
          <div className="trust-badge">
            <Users size={20} />
            <span>Verified Client Reviews</span>
          </div>
          <div className="trust-badge">
            <Palette size={20} />
            <span>Professional Decor Experts</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Tabs Component
  const ProductTabs = () => (
    <div className="modern-tabs">
      <div className="tab-navigation">
        {[
          { id: 'inclusion', label: 'Inclusion' },
          { id: 'experience', label: 'About The Experience' },
          { id: 'need-to-know', label: 'Need To Know' },
          { id: 'cancellation', label: 'Cancellation Policy' }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'inclusion' && (
          <div className="tab-panel">
            <h3>Inclusion</h3>
            <ul className="inclusion-list">
              {getProductDetails?.data?.product?.productdescription?.inclusion?.map((item, i) => (
                <li key={i} className="inclusion-item">
                  <Check size={16} className="check-icon" />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="tab-panel">
            <h3>About The Experience</h3>
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: getProductDetails?.data?.product?.productdescription?.aboutexperience,
              }}
            />
          </div>
        )}

        {activeTab === 'need-to-know' && (
          <div className="tab-panel">
            <h3>Need To Know</h3>
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: getProductDetails?.data?.product?.productdescription?.need,
              }}
            />
          </div>
        )}

        {activeTab === 'cancellation' && (
          <div className="tab-panel">
            <h3>Cancellation Policy</h3>
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: getProductDetails?.data?.product?.productdescription?.cancellation,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced Similar Products Component
  const SimilarProducts = () => (
    <section className="similar-products-section">
      <div className="PrivateDining">
        <div className="section-title"><h2>Similar Products</h2></div>
        <div className="products-grid">
          {getProductDetails?.data?.similarProducts?.map((item, i) => (
            <div key={i} className="product-card">
              <div className="product-image">
                <img
                  src={item?.productimages?.at(0)}
                  alt={item?.productDetails?.productname}
                  onClick={() => handleProduct(item)}
                />
              </div>
              <div className="product-info">
                <h4 className="product-name">{item?.productDetails?.productname}</h4>
                <div className="product-rating">
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={14}
                        fill={starIndex < 4 ? '#ffc107' : 'none'}
                        color="#ffc107"
                      />
                    ))}
                  </div>
                  <span>4.8 | {14 + i} reviews</span>
                </div>
                <div className="product-price">
                  {item?.priceDetails?.discountedPrice ? (
                    <>
                      <span className="current-price">₹{item.priceDetails.discountedPrice}</span>
                      <span className="original-price">₹{item.priceDetails.price}</span>
                      <span className="discount">
                        {Math.round(
                          ((item.priceDetails.price - item.priceDetails.discountedPrice) /
                            item.priceDetails.price) * 100
                        )}% off
                      </span>
                    </>
                  ) : (
                    <span className="current-price">₹{item?.priceDetails?.price}</span>
                  )}
                </div>
                <button
                  className="product-book-button"
                  onClick={() => handleProduct(item)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Enhanced Reviews Section
  // Enhanced Reviews Section
  const ReviewsSection = () => (
    <section className="reviews-section">
      <div className="container-fluid">
        <div className="reviews-header">
          <h2>Product Reviews</h2>
          <div className="reviews-summary">
            <div className="rating-overview">
              <CircularProgressbar
                value={getRatingReviewList?.data?.overallRating || 0}
                text={`${getRatingReviewList?.data?.overallRating || 0}`}
                styles={buildStyles({
                  pathColor: "#2ba501",
                  textColor: "#2ba501",
                })}
              />
              <div className="rating-details">
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.floor(getRatingReviewList?.data?.overallRating || 0) ? '#ffc107' : 'none'}
                      color="#ffc107"
                    />
                  ))}
                </div>
                <p>from {getRatingReviewList?.data?.totalReviews || 0} reviews</p>
              </div>
            </div>
            <div className="rating-breakdown">
              {getRatingReviewList?.data?.ratingSummary?.map((item, i) => (
                <div key={i} className="rating-bar">
                  <span className="rating-label">{item.rating} ⭐</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.count}%` }}
                    />
                  </div>
                  <span className="rating-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="PrivateDining">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3">
                <div
                  className="FilterArea"
                  style={{
                    height: "100%",
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
    </section>
  );

  // Enhanced Customization Modal
  const CustomizationModal = () => (
    <Modal
      className="modern-modal customization-modal"
      show={customModal}
      onHide={() => updateState({ ...iState, customModal: false })}
      size="xl"
      centered
    >
      <div className="modal-header">
        <h2>Select Customizations</h2>
        <button
          className="close-button"
          onClick={() => updateState({ ...iState, customModal: false })}
        >
          <X size={24} />
        </button>
      </div>
      <div className="modal-body">
        <div className="customizations-grid">
          {productDetailsClone?.data?.product?.productcustomizeDetails?.length > 0 ? (
            productDetailsClone.data.product.productcustomizeDetails.map((item, i) => (
              <div key={i} className="customization-card">
                <div className="customization-image">
                  <img src={item?.customimages} alt={item?.name} />
                </div>
                <div className="customization-info">
                  <h4>{item?.name}</h4>
                  <p className="customization-price">₹{item?.price}</p>
                  {customization?.find((custom) => custom?.id === item._id) ? (
                    <div className="quantity-controls">
                      <button
                        className="quantity-button"
                        onClick={() => handleDecrement(item)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity">{item?.quantity}</span>
                      <button
                        className="quantity-button"
                        onClick={() => handleIncrement(item)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : null}
                  <div className="customization-actions">
                    {customization?.find((custom) => custom?.id === item?._id) ? (
                      <>
                        <span className="added-indicator">
                          <Check size={16} />
                          Added
                        </span>
                        <button
                          className="remove-button"
                          onClick={() => handleRemove(item)}
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <button
                        className="add-button"
                        onClick={() => handleCart(item)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-customizations">
              <p>No customizations available</p>
            </div>
          )}
        </div>
      </div>
      <div className="modal-footer">
        <div className="total-section">
          <h3>Total: ₹{totalPrice}</h3>
        </div>
        <div className="modal-actions">
          <button
            className="skip-button"
            onClick={() => handleBook("skip", false)}
          >
            Skip Customizations
          </button>
          <button
            className="book-button"
            onClick={() => handleBook("", false)}
          >
            Book with Customizations
          </button>
        </div>
      </div>
    </Modal>
  );
  // Effects
  useEffect(() => {
    if (customization?.length > 0) {
      const data = {
        userId: userDetail?._id,
        productId: getProductDetails?.data?.product?._id,
        prodname: getProductDetails?.data?.product?.productDetails?.productname,
        prodprice: currentPrice,
        prodimages: getProductDetails?.data?.product?.productimages?.at(0),
        productDescription:
          getProductDetails?.data?.product?.productDetails?.producttitledescription,
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
        minDate: minDate || getSlotList?.date,
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
    if (getAddressList?.data?.Addresses?.length > 0) {
      updateState({
        ...iState,
        pincode: getAddressList.data.Addresses.at(0).pincode,
      });
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

  if (loader) {
    return (
      <div className="loading-screen">
        <BeatLoader loading={loader} size={15} color="#02366f" />
      </div>
    );
  }

  return (
    <div className="modern-product-details">
      <style jsx>{`
                      .modern-product-details {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                        min-height: 100vh;
                      }
              
                      .modern-breadcrumb {
                        background: white;
                        padding: 1rem 0;
                        border-bottom: 1px solid #e2e8f0;
                      }
              
                      .breadcrumb-container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 0 1rem;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                      }
              
                      .breadcrumb-item {
                        color: #64748b;
                        text-decoration: none;
                        font-size: 0.875rem;
                        transition: color 0.2s;
                      }
              
                      .breadcrumb-home {
                        background: none;
                        border: none;
                        cursor: pointer;
                      }
              
                      .breadcrumb-home:hover {
                        color: #0ea5e9;
                      }
              
                      .breadcrumb-current {
                        color: #1e293b;
                        font-weight: 500;
                      }
              
                      .breadcrumb-separator {
                        color: #cbd5e1;
                      }
              
                      .product-container {
                        max-width: 1400px; /* Increase max width */
                        margin: 0 auto;
                        padding: 2rem 1.5rem;
                      }
              
                      .product-layout {
                        display: grid;
                        grid-template-columns: minmax(300px, 1fr) minmax(400px, 1fr);
                        gap: 3rem;
                        margin-bottom: 3rem;
                      }
              
                      .modern-image-gallery {
                        position: sticky;
                        top: 2rem;
                      }
              
                      .main-image-container {
                        position: relative;
                        border-radius: 1rem;
                        overflow: hidden;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                        margin-bottom: 1rem;
                      }
              
                      .main-image {
                        width: 100%;
                        height: 500px;
                        object-fit: cover;
                        cursor: pointer;
                        transition: transform 0.3s ease;
                      }
              
                      .main-image:hover {
                        transform: scale(1.02);
                      }
              
                      .image-overlay {
                        position: absolute;
                        bottom: 1rem;
                        right: 1rem;
                        opacity: 0;
                        transition: opacity 0.3s;
                      }
              
                      .main-image-container:hover .image-overlay {
                        opacity: 1;
                      }
              
                      .zoom-button {
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 0.5rem;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-size: 0.875rem;
                        cursor: pointer;
                        backdrop-filter: blur(10px);
                      }
              
                      .thumbnail-container {
                        display: flex;
                        gap: 0.75rem;
                        overflow-x: auto;
                        padding: 0.25rem;
                      }
              
                      .thumbnail {
                        flex-shrink: 0;
                        width: 80px;
                        height: 80px;
                        border-radius: 0.5rem;
                        overflow: hidden;
                        border: 2px solid transparent;
                        cursor: pointer;
                        transition: all 0.2s;
                        background: none;
                      }
              
                      .thumbnail.active {
                        border-color: #0ea5e9;
                        box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
                      }
              
                      .thumbnail img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      }
              
                      .modern-product-info {
                        space-y: 2rem;
                      }
              
                      .product-header {
                        border-bottom: 1px solid #e2e8f0;
                        padding-bottom: 1.5rem;
                        margin-bottom: 0.5rem;
                      }
              
                      .product-title-section {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 1rem;
                      }
              
                      .product-title {
                        font-size: 2rem;
                        font-weight: 700;
                        color: #1e293b;
                        line-height: 1.2;
                        margin: 0;
                        flex: 1;
                      }
              
                      .product-actions {
                        display: flex;
                        gap: 0.5rem;
                      }
              
                      .action-button {
                        width: 44px;
                        height: 44px;
                        border-radius: 50%;
                        border: 1px solid #e2e8f0;
                        background: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.2s;
                      }
              
                      .action-button:hover {
                        background: #f8fafc;
                        border-color: #cbd5e1;
                      }
              
                      .action-button.active {
                        background: #fef2f2;
                        border-color: #fca5a5;
                        color: #dc2626;
                      }
              
                      .rating-section {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        margin-bottom: 1rem;
                      }
              
                      .stars {
                        display: flex;
                        gap: 0.125rem;
                      }
              
                      .rating-text {
                        color: #64748b;
                        font-size: 0.875rem;
                      }
              
                      .price-container {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        margin-bottom: 0.25rem;
                      }
              
                      .current-price {
                        font-size: 2rem;
                        font-weight: 700;
                        color: #059669;
                      }
              
                      .original-price {
                        font-size: 1.25rem;
                        color: #9ca3af;
                        text-decoration: line-through;
                      }
              
                      .discount-badge {
                        background: linear-gradient(135deg, #ef4444, #dc2626);
                        color: white;
                        padding: 0.25rem 0.75rem;
                        border-radius: 9999px;
                        font-size: 0.875rem;
                        font-weight: 600;
                      }
              
                      .price-per {
                        color: #64748b;
                        font-size: 0.875rem;
                      }
              
                      .product-description {
                        margin-bottom: 2rem;
                      }
              
                      .description-text {
                        color: #475569;
                        line-height: 1.7;
                        margin-bottom: 0.75rem;
                      }
              
                      .read-more-button {
                        color: #0ea5e9;
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-weight: 500;
                        font-size: 0.875rem;
                      }
              
                      .booking-form {
                        max-width: 800px; /* Increase max width */
                        margin: 0 auto;
                        padding: 2rem;
                        background: white;
                        border-radius: 1rem;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        margin-bottom: 2rem;
                      }
              
                      .form-row {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1rem;
                        margin-bottom: 1rem;
                      }
              
                      .form-group {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        max-width: 500px; /* Increase max width */
                        margin: 0 auto;
                      }
              
                      .form-label {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-weight: 500;
                        color: #374151;
                        margin-bottom: 0.5rem;
                        font-size: 0.875rem;
                      }
              
                      .form-input {
                        width: 100%;
                        padding: 12px 16px;
                        font-size: 16px;
                        border: 1px solid #d1d5db;
                        border-radius: 0.5rem;
                        transition: all 0.2s;
                        background: white;
                      }
              
                      .form-input:focus {
                        outline: none;
                        border-color: #0ea5e9;
                        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
                      }
              
                      .form-input.error {
                        border-color: #ef4444;
                        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
                      }
              
                      .error-message {
                        color: #ef4444;
                        font-size: 0.75rem;
                        margin-top: 0.25rem;
                      }
              
                      
                      .book-now-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.4);
                      }
              
                      .trust-badges {
                        margin-top: 2rem;
                      }
              
                      .badge-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                      }
              
                      .trust-badge {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        padding: 1rem;
                        background: white;
                        border-radius: 0.75rem;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s;
                      }
              
                      .trust-badge:hover {
                        transform: translateY(-2px);
                      }
              
                      .trust-badge svg {
                        fill: #0ea5e9;
                        color: #0ea5e9;
                        flex-shrink: 0;
                      }
              
                      .trust-badge span {
                        font-size: 0.875rem;
                        font-weight: 500;
                        color: #374151;
                      }
              
                      .modern-tabs {
                        background: white;
                        border-radius: 1rem;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                        margin-bottom: 3rem;
                      }
              
                      .tab-navigation {
                        display: flex;
                        border-bottom: 1px solid #e2e8f0;
                        overflow-x: auto;
                      }
              
                      .tab-button {
                        padding: 1rem 1.5rem;
                        border: none;
                        background: none;
                        cursor: pointer;
                        font-weight: 500;
                        color: #64748b;
                        transition: all 0.2s;
                        white-space: nowrap;
                        border-bottom: 3px solid transparent;
                      }
              
                      .tab-button.active {
                        color: #0ea5e9;
                        border-bottom-color: #0ea5e9;
                        background: rgba(14, 165, 233, 0.05);
                      }
              
                      .tab-button:hover:not(.active) {
                        color: #374151;
                        background: #f8fafc;
                      }
              
                      .tab-content {
                        padding: 2rem;
                      }
              
                      .tab-panel h3 {
                        font-size: 1.5rem;
                        font-weight: 600;
                        color: #1e293b;
                        margin-bottom: 1rem;
                      }
              
                      .inclusion-list {
                        list-style: none;
                        padding: 0;
                      }
              
                      .inclusion-item {
                        display: flex;
                        align-items: flex-start;
                        gap: 0.75rem;
                        padding: 0.75rem 0;
                        border-bottom: 1px solid #f1f5f9;
                      }
              
                      .check-icon {
                        color: #059669;
                        margin-top: 0.125rem;
                        flex-shrink: 0;
                      }
              
                      .similar-products-section {
                        background: white;
                        border-radius: 1rem;
                        padding: 2rem;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        margin-bottom: 3rem;
                      }
              
                      // .section-title {
                      //   font-size: 1.75rem;
                      //   font-weight: 700;
                      //   color: #1e293b;
                      //   text-align: center;
                      //   margin-bottom: 2rem;
                      // }
              
                      .products-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 1.5rem;
                      }
              
                      .product-card {
                        background: white;
                        border-radius: 1rem;
                        overflow: hidden;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        transition: all 0.3s;
                      }
              
                      .product-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
                      }
              
                      .product-image {
                        height: 200px;
                        overflow: hidden;
                      }
              
                      .product-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        cursor: pointer;
                        transition: transform 0.3s;
                      }
              
                      .product-card:hover .product-image img {
                        transform: scale(1.05);
                      }
              
                      .product-info {
                        padding: 1.5rem;
                      }
              
                      .product-name {
                        font-size: 1.1rem;
                        font-weight: 600;
                        color: #1e293b;
                        margin-bottom: 0.75rem;
                      }
              
                      .product-rating {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 1rem;
                      }
              
                      .product-rating span {
                        font-size: 0.875rem;
                        color: #64748b;
                      }
              
                      .product-price {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        margin-bottom: 1rem;
                      }
              
                      .product-price .current-price {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #059669;
                      }
              
                      .product-price .original-price {
                        font-size: 0.875rem;
                        color: #9ca3af;
                        text-decoration: line-through;
                      }
              
                      .product-price .discount {
                        background: #ef4444;
                        color: white;
                        padding: 0.125rem 0.5rem;
                        border-radius: 0.25rem;
                        font-size: 0.75rem;
                        font-weight: 600;
                      }
              
                      .product-book-button {
                        width: 100%;
                        background: linear-gradient(135deg, #0ea5e9, #0284c7);
                        color: white;
                        border: none;
                        padding: 0.75rem;
                        border-radius: 0.5rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                      }
              
                      .product-book-button:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
                      }
              
                      .reviews-section {
                        background: white;
                        border-radius: 1rem;
                        padding: 2rem;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                      }
              
                      .reviews-header {
                        margin-bottom: 2rem;
                      }
              
                      .reviews-header h2 {
                        font-size: 1.75rem;
                        font-weight: 700;
                        color: #1e293b;
                        margin-bottom: 1.5rem;
                      }
              
                      .reviews-summary {
                        display: grid;
                        grid-template-columns: auto 1fr;
                        gap: 2rem;
                        align-items: center;
                      }
              
                      .rating-overview {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                      }
              
                      .rating-overview .CircularProgressbar {
                        width: 80px;
                        height: 80px;
                      }
              
                      .rating-details .stars {
                        margin-bottom: 0.5rem;
                      }
              
                      .rating-breakdown {
                        space-y: 0.75rem;
                      }
              
                      .rating-bar {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                      }
              
                      .rating-label {
                        min-width: 60px;
                        font-size: 0.875rem;
                        color: #64748b;
                      }
              
                      .progress-bar {
                        flex: 1;
                        height: 8px;
                        background: #f1f5f9;
                        border-radius: 4px;
                        overflow: hidden;
                      }
              
                      .progress-fill {
                        height: 100%;
                        background: linear-gradient(90deg, #fbbf24, #f59e0b);
                        border-radius: 4px;
                        transition: width 0.3s;
                      }
              
                      .rating-count {
                        min-width: 40px;
                        text-align: right;
                        font-size: 0.875rem;
                        color: #64748b;
                      }
              
                      .reviews-content {
                        display: grid;
                        grid-template-columns: 300px 1fr;
                        gap: 2rem;
                        margin-top: 2rem;
                      }
              
                      .reviews-filter {
                        background: #f8fafc;
                        padding: 1.5rem;
                        border-radius: 0.75rem;
                        height: fit-content;
                      }
              
                      .reviews-filter h3 {
                        font-size: 1.25rem;
                        font-weight: 600;
                        color: #1e293b;
                        margin-bottom: 1rem;
                      }
              
                      .filter-options {
                        space-y: 0.75rem;
                      }
              
                      .filter-checkbox {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        cursor: pointer;
                        padding: 0.5rem;
                        border-radius: 0.5rem;
                        transition: background 0.2s;
                      }
              
                      .filter-checkbox:hover {
                        background: rgba(14, 165, 233, 0.05);
                      }
              
                      .filter-checkbox input {
                        margin: 0;
                      }
              
                      .reviews-list h3 {
                        font-size: 1.25rem;
                        font-weight: 600;
                        color: #1e293b;
                        margin-bottom: 1.5rem;
                      }
              
                      .review-card {
                        background: #f8fafc;
                        padding: 1.5rem;
                        border-radius: 0.75rem;
                        margin-bottom: 1rem;
                        border: 1px solid #e2e8f0;
                      }
              
                      .review-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 1rem;
                      }
              
                      .reviewer-info {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                      }
              
                      .reviewer-avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        object-fit: cover;
                      }
              
                      .reviewer-info h4 {
                        font-size: 1rem;
                        font-weight: 600;
                        color: #1e293b;
                        margin: 0;
                      }
              
                      .reviewer-info p {
                        font-size: 0.875rem;
                        color: #64748b;
                        margin: 0;
                      }
              
                      .review-rating {
                        display: flex;
                        gap: 0.125rem;
                      }
              
                      .review-text {
                        color: #475569;
                        line-height: 1.6;
                        margin-bottom: 1rem;
                      }
              
                      .review-image {
                        width: 100px;
                        height: 100px;
                        object-fit: cover;
                        border-radius: 0.5rem;
                      }
              
                      .no-reviews {
                        text-align: center;
                        color: #64748b;
                        font-style: italic;
                        padding: 2rem;
                      }
              
                      .loading-container {
                        display: flex;
                        justify-content: center;
                        padding: 2rem;
                      }
              
                      .modern-modal .modal-content {
                        border: none;
                        border-radius: 1rem;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                      }
              
                      .modal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 1.5rem 2rem;
                        border-bottom: 1px solid #e2e8f0;
                      }
              
                      .modal-header h2 {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #1e293b;
                        margin: 0;
                      }
              
                      .close-button {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: #64748b;
                        transition: color 0.2s;
                      }
              
                      .close-button:hover {
                        color: #1e293b;
                      }
              
                      .modal-body {
                        padding: 2rem;
                        max-height: 60vh;
                        overflow-y: auto;
                      }
              
                      .customizations-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 1.5rem;
                      }
              
                      .customization-card {
                        background: white;
                        border: 1px solid #e2e8f0;
                        border-radius: 0.75rem;
                        overflow: hidden;
                        transition: all 0.2s;
                      }
              
                      .customization-card:hover {
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                      }
              
                      .customization-image {
                        height: 150px;
                        overflow: hidden;
                      }
              
                      .customization-image img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                      }
              
                      .customization-info {
                        padding: 1rem;
                      }
              
                      .customization-info h4 {
                        font-size: 1rem;
                        font-weight: 600;
                        color: #1e293b;
                        margin: 0 0 0.5rem 0;
                      }
              
                      .customization-price {
                        font-size: 1.1rem;
                        font-weight: 700;
                        color: #059669;
                        margin-bottom: 1rem;
                      }
              
                      .quantity-controls {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 1rem;
                        margin-bottom: 1rem;
                      }
              
                      .quantity-button {
                        width: 32px;
                        height: 32px;
                        border: 1px solid #d1d5db;
                        background: white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.2s;
                      }
              
                      .quantity-button:hover:not(:disabled) {
                        background: #f3f4f6;
                        border-color: #9ca3af;
                      }
              
                      .quantity-button:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                      }
              
                      .quantity {
                        font-weight: 600;
                        color: #1e293b;
                      }
              
                      .customization-actions {
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                      }
              
                      .added-indicator {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        color: #059669;
                        font-weight: 600;
                        font-size: 0.875rem;
                      }
              
                      .add-button {
                        width: 100%;
                        background: linear-gradient(135deg, #0ea5e9, #0284c7);
                        color: white;
                        border: none;
                        padding: 0.75rem;
                        border-radius: 0.5rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                      }
              
                      .add-button:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
                      }
              
                      .remove-button {
                        width: 100%;
                        background: #ef4444;
                        color: white;
                        border: none;
                        padding: 0.75rem;
                        border-radius: 0.5rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                      }
              
                      .remove-button:hover {
                        background: #dc2626;
                      }
              
                      .no-customizations {
                        grid-column: 1 / -1;
                        text-align: center;
                        color: #64748b;
                        font-style: italic;
                        padding: 3rem;
                      }
              
                      .modal-footer {
                        padding: 1.5rem 2rem;
                        border-top: 1px solid #e2e8f0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      }
              
                      .total-section h3 {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #1e293b;
                        margin: 0;
                      }
              
                      .modal-actions {
                        display: flex;
                        gap: 1rem;
                      }
              
                      .skip-button {
                        padding: 0.75rem 1.5rem;
                        border: 1px solid #d1d5db;
                        background: white;
                        color: #374151;
                        border-radius: 0.5rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                      }
              
                      .skip-button:hover {
                        background: #f3f4f6;
                        border-color: #9ca3af;
                      }
              
                      .book-button {
                        padding: 0.75rem 1.5rem;
                        background: linear-gradient(135deg, #0ea5e9, #0284c7);
                        color: white;
                        border: none;
                        border-radius: 0.5rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                      }
              
                      .book-button:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
                      }
              
                      .loading-screen {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background: #f8fafc;
                      }
              
                      /* Responsive Design */
                      @media (max-width: 768px) {
                        .product-layout {
                          grid-template-columns: 1fr;
                          gap: 2rem;
                        }
              
                        .modern-image-gallery {
                          position: static;
                        }
              
                        .form-row {
                          grid-template-columns: 1fr;
                        }
              
                        .badge-grid {
                          grid-template-columns: 1fr;
                        }
              
                        .reviews-content {
                          grid-template-columns: 1fr;
                        }
              
                        .reviews-summary {
                          grid-template-columns: 1fr;
                          gap: 1rem;
                        }
              
                        .rating-overview {
                          justify-content: center;
                        }
              
                        .product-title {
                          font-size: 1.5rem;
                        }
              
                        .current-price {
                          font-size: 1.5rem;
                        }
              
                        .customizations-grid {
                          grid-template-columns: 1fr;
                        }
              
                        .modal-actions {
                          flex-direction: column;
                          width: 100%;
                        }
              
                        .skip-button,
                        .book-button {
                          width: 100%;
                        }
                      }
              
                      @media (max-width: 480px) {
                        .breadcrumb-container {
                          padding: 0 0.5rem;
                        }
              
                        .product-container {
                          padding: 1rem 0.5rem;
                        }
              
                        .booking-form,
                        .similar-products-section,
                        .reviews-section,
                        .modern-tabs {
                          margin-left: -0.5rem;
                          margin-right: -0.5rem;
                          border-radius: 0;
                        }
              
                        .tab-navigation {
                          padding: 0;
                        }
              
                        .tab-button {
                          padding: 0.75rem 1rem;
                          font-size: 0.875rem;
                        }
                      }
                    `}</style>

      <Breadcrumb />

      <div className="product-container">
        <div className="product-layout">
          <ImageGallery />
          <ProductInfo />
        </div>

        <ProductTabs />
        <SimilarProducts />
        <ReviewsSection />
      </div>

      {/* Lightbox for image gallery */}
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
            setPhotoIndex((photoIndex + 1) % getProductDetails?.data?.product?.productimages.length)
          }
        />
      )}

      {/* Customization Modal */}
      <CustomizationModal />
    </div>
  );
};

export default ProductDetails;
