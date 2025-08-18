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
  activeRecommendedTab: "recommended",
  activeFilterTag: "Entry Gate Arch",
  recommendedScrollPosition: 0,
  maxScrollPosition: 0
};

const ProductDetails = () => {

  // State to track favourite products (by id)
  const [favouriteProducts, setFavouriteProducts] = useState([]);

  // Toggle favourite status for a product
  const handleFavouriteToggle = (productId) => {
    setFavouriteProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };
  const [showBookingFlow, setShowBookingFlow] = useState(false);
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
    activeRecommendedTab,
    activeFilterTag,
    recommendedScrollPosition,
    maxScrollPosition
  } = iState;
  const { getProductDetails, getSlotList, getStaticSlotList, loader } =
    useSelector((state) => state.productList);
  const { getRatingReviewList, loading } = useSelector(
    (state) => state.reviewRating
  );
  const { getAddressList } = useSelector((state) => state.auth);


  const handleCategoryClick = (categoryName) => {
    try {
      // Navigate to a general products page with category filter
      navigate('/products', { state: { category: categoryName } });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback: just navigate to products page
      navigate('/products');
    }
  };

  // Handle recommended tab clicks
  const handleRecommendedTabClick = (tabName) => {
    updateState({
      ...iState,
      activeRecommendedTab: tabName
    });
  };

  // Handle filter tag clicks
  const handleFilterTagClick = (tagName) => {
    updateState({
      ...iState,
      activeFilterTag: tagName
    });
  };

  // Function to handle scrolling in recommended section
  const handleRecommendedScroll = (direction) => {
    const container = document.querySelector('.recommended-products-grid');
    if (!container) return;

    const cardWidth = 280; // Approximate width of each card including margin
    const scrollAmount = cardWidth * 2; // Scroll 2 cards at a time

    if (direction === 'left') {
      const newPosition = Math.max(0, recommendedScrollPosition - scrollAmount);
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      updateState({
        ...iState,
        recommendedScrollPosition: newPosition
      });
    } else if (direction === 'right') {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition = Math.min(maxScroll, recommendedScrollPosition + scrollAmount);
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      updateState({
        ...iState,
        recommendedScrollPosition: newPosition
      });
    }
  };

  // Function to update scroll position and button states
  const updateScrollPosition = () => {
    const container = document.querySelector('.recommended-products-grid');
    if (!container) return;

    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    updateState({
      ...iState,
      recommendedScrollPosition: currentScroll,
      maxScrollPosition: maxScroll
    });
  };

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

  // booking flow handler
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
        if (res?.payload?.message == "Added Successfully") {
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
          if (res?.payload?.message == "Added Successfully") {
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


  useEffect(() => {
    const container = document.querySelector('.recommended-products-grid');
    if (container) {
      container.addEventListener('scroll', updateScrollPosition);

      // Initial calculation
      const maxScroll = container.scrollWidth - container.clientWidth;
      updateState({
        ...iState,
        maxScrollPosition: maxScroll
      });

      return () => {
        container.removeEventListener('scroll', updateScrollPosition);
      };
    }
  }, [getProductDetails?.data?.similarProducts]);

  const FixedBottomBookingBar = ({
    productPrice,
    discountedPrice,
    onBookNowClick,
    activeTab = "Overview"
  }) => {
    const [currentTab, setCurrentTab] = useState(activeTab);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldShow = scrollTop > 300;
        setIsVisible(shouldShow);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTabClick = (tabName) => {
      setCurrentTab(tabName);
      const sectionMap = {
        'Overview': 'product-info',
        'Inclusions': '.inclusions-section',
        'Reviews': '.reviews-section-card'
      };

      const targetSection = document.querySelector(sectionMap[tabName]);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    if (!isVisible) return null;

    return (
      <div className="fixed-bottom-booking-bar">
        <div className="bottom-booking-container">
          <div className="bottom-booking-left">
            <div className="bottom-booking-tabs">
              <button
                className={`bottom-booking-tab ${currentTab === 'Overview' ? 'active' : ''}`}
                onClick={() => handleTabClick('Overview')}
              >
                Overview
              </button>
              <button
                className={`bottom-booking-tab ${currentTab === 'Inclusions' ? 'active' : ''}`}
                onClick={() => handleTabClick('Inclusions')}
              >
                Inclusions
              </button>
              <button
                className={`bottom-booking-tab ${currentTab === 'Reviews' ? 'active' : ''}`}
                onClick={() => handleTabClick('Reviews')}
              >
                Reviews
              </button>
            </div>
          </div>

          <div className="bottom-booking-right">
            <div className="bottom-booking-price-section">
              <div className="bottom-booking-price">
                <span className="bottom-booking-currency">₹</span>
                <span className="bottom-booking-amount">
                  {discountedPrice || productPrice}
                </span>
              </div>
              <span className="bottom-booking-setup-text">/ setup</span>
            </div>

            <button
              className="bottom-booking-button"
              onClick={onBookNowClick}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  };

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
                      <span className="booking-summary-type">/ Setup</span>
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

                      {/* MAIN BOOK NOW BUTTON */}
                      <button
                        className="booking-summary-book-btn"
                        onClick={() => setShowBookingFlow(true)}
                      >
                        BOOK NOW <span className="booking-summary-arrow"><i className="fa-solid fa-arrow-right"></i></span>
                      </button>
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
                              src={require("../../assets/images/verified.png")}
                              alt="Professional"
                            />
                          </div>
                          <span className="trust-text">Verified Reviews</span>
                        </div>
                        <div className="trust-item">
                          <div className="trust-icon">
                            <img
                              src={require("../../assets/images/professional.png")}
                              alt="Professional"
                            />
                          </div>
                          <span className="trust-text">Expert Professionals</span>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="recommended-section">
                    <div className="recommended-tabs">
                      <button
                        className={`recommended-tab ${activeRecommendedTab === 'recommended' ? 'active' : ''}`}
                        onClick={() => handleRecommendedTabClick('recommended')}
                      >
                        Recommended
                      </button>
                      <button
                        className={`recommended-tab ${activeRecommendedTab === 'engagement' ? 'active' : ''}`}
                        onClick={() => handleRecommendedTabClick('engagement')}
                      >
                        Engagement Activity
                      </button>
                    </div>

                    <div className="recommended-filter-tags">
                      <button
                        className={`filter-tag ${activeFilterTag === 'Entry Gate Arch' ? 'active' : ''}`}
                        onClick={() => handleFilterTagClick('Entry Gate Arch')}
                      >
                        Entry Gate Arch
                      </button>
                      <button
                        className={`filter-tag ${activeFilterTag === 'Cake Table' ? 'active' : ''}`}
                        onClick={() => handleFilterTagClick('Cake Table')}
                      >
                        Cake Table
                      </button>
                      <button
                        className={`filter-tag ${activeFilterTag === 'Digit Foil Balloons' ? 'active' : ''}`}
                        onClick={() => handleFilterTagClick('Digit Foil Balloons')}
                      >
                        Digit Foil Balloons
                      </button>
                      <button
                        className={`filter-tag ${activeFilterTag === 'Led Digit' ? 'active' : ''}`}
                        onClick={() => handleFilterTagClick('Led Digit')}
                      >
                        Led Digit
                      </button>
                      <button
                        className={`filter-tag ${activeFilterTag === 'Lights' ? 'active' : ''}`}
                        onClick={() => handleFilterTagClick('Lights')}
                      >
                        Lights
                      </button>
                      <button
                        className={`filter-tag ${activeFilterTag === 'Occasion Bunting' ? 'active' : ''}`}
                        onClick={() => handleFilterTagClick('Occasion Bunting')}
                      >
                        Occasion Bunting
                      </button>
                    </div>

                    <div className="recommended-products-container">
                      <div className="recommended-products-grid">
                        {getProductDetails?.data?.similarProducts?.slice(0, 8)?.map((item, i) => (
                          <div className="recommended-product-card" key={i}>
                            <div className="recommended-product-image">
                              <img
                                src={item?.productimages?.at(0)}
                                alt={item?.productDetails?.productname}
                                onClick={() => handleProduct(item)}
                              />
                            </div>

                            <div className="recommended-product-info">
                              <h4 className="recommended-product-title">
                                {item?.productDetails?.productname?.length > 40
                                  ? `${item?.productDetails?.productname?.substring(0, 40)}...`
                                  : item?.productDetails?.productname
                                }
                              </h4>

                              <p className="recommended-product-description">
                                {item?.productDetails?.producttitledescription?.length > 60
                                  ? `${item?.productDetails?.producttitledescription?.substring(0, 60)}...`
                                  : item?.productDetails?.producttitledescription || 'Beautiful decoration for your special occasions'
                                }
                              </p>

                              <div className="recommended-product-link">
                                <span onClick={() => handleProduct(item)}>see more</span>
                              </div>

                              <div className="recommended-product-footer">
                                <div className="recommended-product-price">
                                  ₹{item?.priceDetails?.discountedPrice || item?.priceDetails?.price}
                                </div>
                                <label className="recommended-product-toggle">
                                  <input type="checkbox" />
                                  <span className="toggle-slider"></span>
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* If less than 8 similar products, show fallback cards */}
                        {getProductDetails?.data?.similarProducts?.length < 8 && (
                          Array.from({ length: 8 - (getProductDetails?.data?.similarProducts?.length || 0) }).map((_, i) => (
                            <div className="recommended-product-card" key={`fallback-${i}`}>
                              <div className="recommended-product-image">
                                <img
                                  src="https://via.placeholder.com/200x150/f0f0f0/666666?text=Product"
                                  alt="Recommended Product"
                                />
                              </div>

                              <div className="recommended-product-info">
                                <h4 className="recommended-product-title">
                                  {i === 0 ? 'Double Door Balloon Arch' :
                                    i === 1 ? 'L-Shaped Balloon Gate' :
                                      i === 2 ? 'Balloon Entry Gate Decor' :
                                        i === 3 ? 'Small Door Entrance' :
                                          i === 4 ? 'Premium Balloon Arch' :
                                            i === 5 ? 'Deluxe Gate Decoration' :
                                              i === 6 ? 'Royal Entry Arch' : 'Classic Balloon Gate'}
                                </h4>

                                <p className="recommended-product-description">
                                  {i === 0 ? 'Add 200 Latex and Chrome Balloons gate for two door entrance...' :
                                    i === 1 ? 'Add L-shaped balloon gate of 100 latex and metallic balloons by...' :
                                      i === 2 ? '200 Latex & Chrome balloons gate for an entrance with lady...' :
                                        i === 3 ? '150 Latex and Chrome Balloons gate to cover single door using wall...' :
                                          i === 4 ? 'Premium balloon arch with metallic finish and LED lights...' :
                                            i === 5 ? 'Deluxe gate decoration with floral arrangements and balloons...' :
                                              i === 6 ? 'Royal entry arch with gold and silver balloon combinations...' :
                                                'Classic balloon gate with traditional color schemes...'}
                                </p>

                                <div className="recommended-product-link">
                                  <span>see more</span>
                                </div>

                                <div className="recommended-product-footer">
                                  <div className="recommended-product-price">
                                    ₹{i === 0 ? '1599' : i === 1 ? '999' : i === 2 ? '1999' :
                                      i === 3 ? '1399' : i === 4 ? '2299' : i === 5 ? '2799' :
                                        i === 6 ? '3199' : '1799'}
                                  </div>
                                  <label className="recommended-product-toggle">
                                    <input type="checkbox" />
                                    <span className="toggle-slider"></span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Navigation arrows with functionality */}
                      <button
                        className={`recommended-nav-arrow recommended-nav-prev ${recommendedScrollPosition <= 0 ? 'disabled' : ''}`}
                        onClick={() => handleRecommendedScroll('left')}
                        disabled={recommendedScrollPosition <= 0}
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>
                      <button
                        className={`recommended-nav-arrow recommended-nav-next ${recommendedScrollPosition >= maxScrollPosition ? 'disabled' : ''}`}
                        onClick={() => handleRecommendedScroll('right')}
                        disabled={recommendedScrollPosition >= maxScrollPosition}
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                  {/* INCLUSIONS SECTION */}
                  <div className="inclusions-section">
                    <div className="section-title">
                      <i className="fa-solid fa-list-check"></i>
                      Inclusions
                    </div>
                    <div className="inclusion-list">
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

                  {/* EXPERIENCE SECTION */}
                  <div className="experience-section">
                    <div className="section-title">
                      <i className="fa-solid fa-info-circle"></i>
                      About The Experience
                    </div>
                    <div className="description-content">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: getProductDetails?.data?.product?.productdescription?.aboutexperience,
                        }}
                      />
                      {!readMore && (
                        <span
                          className="show-less-link"
                          onClick={() => updateState({ ...iState, readMore: true })}
                        >
                          - Show Less
                        </span>
                      )}
                    </div>
                  </div>

                  {/* REVIEWS SECTION */}
                  <div className="reviews-section-card">
                    <div className="section-title">
                      <i className="fa-solid fa-star reviews-section-icon" />
                      Reviews
                    </div>
                    <div className="reviews-header">
                      <h3 className="reviews-title">
                        {getRatingReviewList?.data?.overallRating?.toFixed(2)}
                      </h3>
                      <div className="reviews-summary">
                        <span className="reviews-stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`fa-star ${i < Math.round(getRatingReviewList?.data?.overallRating || 0) ? 'fa-solid reviews-star-filled' : 'fa-regular reviews-star-empty'}`}></i>
                          ))}
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

                  {/* NEED TO KNOW SECTION */}
                  <div className="need-to-know-section">
                    <div className="section-title">
                      <i className="fas fa-info-circle needtoknow-icon" />
                      Need To Know
                    </div>
                    <div className="needtoknow-content" dangerouslySetInnerHTML={{
                      __html: getProductDetails?.data?.product?.productdescription?.need,
                    }} />
                  </div>

                  {/* FAQ SECTION */}
                  <div className="faq-section">
                    <div className="section-title">
                      <i className="fas fa-question-circle faq-icon" />
                      Frequently Asked Questions
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

                  {/* LOCATION SECTION */}
                  <div className="location-section">
                    <div className="section-title">
                      <i className="fas fa-map-marker-alt location-icon" />
                      Location
                    </div>
                    <div className="location-content">At Your Home</div>
                  </div>

                  {/* CANCELLATION POLICY SECTION */}
                  <div className="cancellation-section">
                    <div className="section-title">
                      <i className="fa-solid fa-ban cancellation-icon" />
                      Cancellation Policy
                    </div>
                    <div className="cancellation-content" dangerouslySetInnerHTML={{
                      __html: getProductDetails?.data?.product?.productdescription?.cancellation,
                    }} />
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

      {/* Similar Products Section */}
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
              ? getProductDetails?.data?.similarProducts?.map((item, i) => {
                const productId = item?.productDetails?.id || item?.productDetails?._id || i;
                const isFavourite = favouriteProducts.includes(productId);
                return (
                  <div className="product-card" key={productId}>
                    <div className="product-image-wrapper">
                      <img
                        onClick={() => handleProduct(item)}
                        src={item?.productimages?.at(0)}
                        alt={item?.productDetails?.productname}
                        className="product-image"
                      />
                      {/* Favourite button */}
                      <button
                        className="product-favorite"
                        onClick={() => handleFavouriteToggle(productId)}
                        aria-label={isFavourite ? "Unfavourite" : "Favourite"}
                        style={{ background: "none", border: "none", cursor: "pointer", position: "absolute", top: "15px", right: "15px", zIndex: 2 }}
                      >
                        <i className={isFavourite ? "fa-solid fa-heart" : "fa-regular fa-heart"} style={{ color: isFavourite ? "#e5097f" : "#b1b1b1", fontSize: "1.5rem" }}></i>
                      </button>
                     
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
                );
              })
              : (
                <div className="no-products">
                  <i className="fa-solid fa-box-open"></i>
                  <p>No similar products found</p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      <div className="recently-viewed-section">
        <div className="container-fluid">
          <div className="section-header">
            <h2 className="section-title recently-viewed-title">
              Recently Viewed
            </h2>
          </div>

          <div className="recently-viewed-grid">
            {getProductDetails?.data?.recentlyViewed?.length > 0 ? (
              getProductDetails?.data?.recentlyViewed?.map((item, i) => (
                <div className="recently-viewed-card" key={i}>
                  <div className="recently-viewed-image-wrapper">
                    <img
                      onClick={() => handleProduct(item)}
                      src={item?.productimages?.at(0)}
                      alt={item?.productDetails?.productname}
                      className="recently-viewed-image"
                    />

                    {/* Favorite Button */}
                    <button className="recently-viewed-favorite">
                      <i className="fa-regular fa-heart"></i>
                    </button>

                    {/* Location Badge */}
                    <div className="location-badge">
                      At Your Location
                    </div>

                    {/* Hover Overlay */}
                    <div className="recently-viewed-overlay">
                      <button
                        className="recently-viewed-quick-btn"
                        onClick={() => handleProduct(item)}
                      >
                        <i className="fa-solid fa-eye"></i>
                        Quick View
                      </button>
                    </div>
                  </div>

                  <div className="recently-viewed-info">
                    <h3 className="recently-viewed-name">
                      {item?.productDetails?.productname}
                    </h3>

                    <div className="recently-viewed-pricing">
                      <span className="recently-viewed-price">
                        ₹{item?.priceDetails?.discountedPrice || item?.priceDetails?.price}
                      </span>
                    </div>

                    <div className="recently-viewed-rating">
                      <div className="recently-viewed-stars">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <i key={index} className="fa-solid fa-star"></i>
                        ))}
                      </div>
                      <span className="recently-viewed-rating-text">
                        {(4.0 + (i * 0.2)).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-recently-viewed">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <p>No recently viewed items</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Categories Section */}
      <div className="similar-categories-section">
        <div className="container-fluid">
          <div className="section-header">
            <h2 className="section-title similar-categories-title">
              Similar Categories
            </h2>
          </div>


          <div className="similar-categories-tags">
            {getProductDetails?.data?.product?.productDetails?.productcategory && (
              <>
                <span className="category-tag" onClick={() => handleCategoryClick(getProductDetails?.data?.product?.productDetails?.productcategory)}>
                  #{getProductDetails?.data?.product?.productDetails?.productcategory}
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('birthday-decorations')}>
                  #BirthdayDecorationsforHomeorRoom
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('birthday-decors')}>
                  #BirthdayDecorsForHer
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('new-year-party')}>
                  #NewYearParty
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('new-year-special')}>
                  #NewYearSpecial
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('balloon-decorations')}>
                  #Balloon&RoomDecorations
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('house-party')}>
                  #HousePartyDecorations
                </span>
                <span className="category-tag" onClick={() => handleCategoryClick('available-now')}>
                  #AvailableNow
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Event Partner Section*/}
      <div className="event-partner-section">
        <div className="container-fluid">
          <h2 className="event-partner-title">
            Event Partner for over 1 Million+ Celebrations
          </h2>

          {/* Stats Row */}
          <div className="event-partner-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <img src={require("../../assets/images/medal.png")} alt="Medal" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">1 Million+</h3>
                <p className="stat-description">Happy Customers over 10 Years</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <img src={require("../../assets/images/google-reviews.png")} alt="Google Reviews" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">4.6/5 Rating</h3>
                <p className="stat-description">from 5000+ Reviews on Google</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <img src={require("../../assets/images/social-media.png")} alt="Social Media" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">1 Lakh+ Followers</h3>
                <p className="stat-description">on Social Media</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <img src={require("../../assets/images/brands.png")} alt="Top Brands" />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">Top Brands</h3>
                <p className="stat-description">Partnered with top brands</p>
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

      <BookingFlow
        show={showBookingFlow}
        onHide={() => setShowBookingFlow(false)}
        onComplete={handleBookingFlowComplete}
        selectedProduct={getProductDetails?.data?.product}
      />

      {/* Fixed Bottom Booking Bar */}
      <FixedBottomBookingBar
        productPrice={getProductDetails?.data?.product?.priceDetails?.price}
        discountedPrice={getProductDetails?.data?.product?.priceDetails?.discountedPrice}
        onBookNowClick={() => setShowBookingFlow(true)}
        activeTab="Overview"
      />

    </>
  );
};

export default ProductDetails;