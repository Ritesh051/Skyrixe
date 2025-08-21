import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal, Nav, Tab, TabContainer, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { userDetailState } from "../../reduxToolkit/Slices/ProductList/listApis";
import { onImageHandler } from "../../Utils/uploadFile";
import {
  addressDelete,
  addressListing,
  personalInfoUpdateSlice,
} from "../../reduxToolkit/Slices/Auth/auth";
import { toast } from "react-toastify";
import AddAddress from "../Modals/AddAddress";
import {
  cancelOrder,
  pastBooking,
  upcomingBooking,
} from "../../reduxToolkit/Slices/Cart/bookingApis";
import { formatDate } from "../../Utils/commonFunctions";
import { addReview } from "../../reduxToolkit/Slices/ReviewAndRating/reviewRatingApis";
import OrderProductDetails from "../Product/product-order";

const initialState = {
  profileEditModal: false,
  addressModal: false,
  photo: "",
  name: "",
  gender: "",
  dob: "",
  email: "",
  phone: "",
  img: "",
  errors: "",
  additional_phone: "",
  phone_valid: true,
  editMode: false,
  addressDetail: "",
  deleteModal: false,
  logType: false,
  reviewModal: false,
  productId: "",
  review: "",
  review_image: "",
  cancelModal: false,
  orderToCancel: null,
<<<<<<< HEAD
  cancellingOrders: [],
=======
>>>>>>> d20b5ea8f26a1e7ed10e32782289b9eeb86c2ae8
};

const Profile = () => {
  const [iState, updateState] = useState(initialState);
  const { getAddressList, loader } = useSelector((state) => state.auth);
  const [starLength, setStarsLength] = useState(5);
  const { getUpcomingBooking, getPastBooking } = useSelector(
    (state) => state.orderSummary
  );
  const {
    profileEditModal,
    name,
    gender,
    dob,
    email,
    phone,
    photo,
    img,
    errors,
    additional_phone,
    phone_valid,
    addressDetail,
    deleteModal,
    logType,
    reviewModal,
    productId,
    review,
    review_image,
    cancelModal,
    orderToCancel,
  } = iState;
  const { type } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetail = JSON?.parse(
    window?.localStorage?.getItem("LennyUserDetail")
  );
  const [showDetails, setShowDetails] = useState(false);
  const [order, setorder] = useState({});

  // console.log(upcomingBooking)

  const handleProfileModalHideShow = (type) => {
    if (type == "show") {
      updateState({
        ...iState,
        img: userDetail?.personalInfo?.photo,
        name: userDetail?.personalInfo?.name,
        gender: userDetail?.personalInfo?.gender,
        dob: userDetail?.personalInfo?.dob?.split("T")?.at(0),
        email: userDetail?.personalInfo?.email,
        phone: userDetail?.phone,
        additional_phone: userDetail?.alternatePhone,
        profileEditModal: true,
      });
    } else {
      updateState({ ...iState, profileEditModal: false, addressDetail: "" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "additional_phone") {
      let modifiedValue = value >= 0 ? value : additional_phone + "";
      updateState({ ...iState, additional_phone: modifiedValue, errors: "" });
    } else {
      updateState({ ...iState, [name]: value, errors: "" });
    }
  };

  const handleImage = async (e, type) => {
    let data = await onImageHandler(e);
    if (type == "profile") {
      updateState({
        ...iState,
        photo: data[0],
        img: data[1]?.location,
        errors: "",
      });
    } else {
      updateState({
        ...iState,
        review_image: data[1]?.location,
      });
    }
  };

  const handleImageClose = () => {
    updateState({ ...iState, review_image: "" });
  };

  const handleValidation = () => {
    let error = {};
    let formIsValid = true;
    if (!name) {
      error.nameError = "*Name is required";
      formIsValid = false;
    }
    if (!gender) {
      error.genderError = "*Gender is required";
      formIsValid = false;
    }
    if (!dob) {
      error.dobError = "*Date of birth is required";
      formIsValid = false;
    }
    if (email) {
      if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          email
        )
      ) {
        error.emailError = " *Email format is not valid";
        formIsValid = false;
      }
    }
    updateState({ ...iState, errors: error });
    return formIsValid;
  };

  const handleSave = () => {
    let formIsValid = handleValidation();
    if (formIsValid) {
      const payload = {
        data: {
          personalInfo: {
            name,
            gender,
            email,
            photo: img,
            dob,
          },
          alternatePhone: additional_phone,
        },
        userId: userDetail?._id,
      };
      dispatch(personalInfoUpdateSlice(payload)).then((res) => {
        toast?.success(res?.payload?.data?.message);
        window.localStorage?.setItem(
          "LennyUserDetail",
          JSON?.stringify(res?.payload?.data?.data)
        );
        updateState({ ...iState, profileEditModal: false });
      });
    }
  };

  const handleSubmitReview = () => {
    const data = {
      productId,
      customerId: userDetail?._id,
      rating: starLength,
      image: review_image,
      review,
    };
    dispatch(addReview(data))
      .then((res) => {
        if (res?.payload?.status == 200) {
          toast.success("Review Submit Successfully!!");
          updateState({
            ...iState,
            reviewModal: false,
            productId: "",
            review: "",
            review_image: "",
          });
          setStarsLength(5);
        } else {
          toast.error("Error");
        }
      })
      .catch((err) => {
        console.log({ err });
        toast.error("Error submitting review");
      });
  };

  const handleCancelOrder = (order) => {
    updateState({
      ...iState,
      cancelModal: true,
      orderToCancel: order,
    });
  };

  const confirmCancelOrder = () => {
    if (orderToCancel) {
      // Since cancelOrder is not available, we'll create a mock implementation
      // You'll need to implement the actual cancelOrder API call in your bookingApis file
      
<<<<<<< HEAD
      // Add order to cancelling list to show loading state
      const updatedState = {
        ...iState,
        cancelModal: false,
        orderToCancel: null,
        cancellingOrders: [...currentCancellingOrders, orderToCancel._id],
      };
      
      updateState(updatedState);
      
=======
>>>>>>> d20b5ea8f26a1e7ed10e32782289b9eeb86c2ae8
      const cancelData = {
        id: orderToCancel._id,
        userId: userDetail?._id,
      };
      
      // // Mock API call - Replace this with your actual API implementation
      // const mockCancelOrder = new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     // Simulate successful cancellation
      //     resolve({
      //       payload: {
      //         status: 200,
      //         data: {
      //           message: "Order cancelled successfully"
      //         }
      //       }
      //     });
      //   }, 2000); // Increased to 2 seconds to better show the loading state
      // });

<<<<<<< HEAD
      // mockCancelOrder
=======
      // Mock API call - Replace this with your actual API implementation
      const mockCancelOrder = new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate successful cancellation
          resolve({
            payload: {
              status: 200,
              data: {
                message: "Order cancelled successfully"
              }
            }
          });
        }, 1000);
      });

      mockCancelOrder
        .then((res) => {
          if (res?.payload?.status === 200) {
            toast.success("Order cancelled successfully!");
            // Refresh the orders
            dispatch(upcomingBooking({ userId: userDetail?._id }));
            dispatch(pastBooking({ userId: userDetail?._id }));
          } else {
            toast.error("Failed to cancel order");
          }
        })
        .catch((err) => {
          console.log({ err });
          toast.error("Error cancelling order");
        })
        .finally(() => {
          updateState({
            ...iState,
            cancelModal: false,
            orderToCancel: null,
          });
        });

      // TODO: Replace the above mock implementation with:
      // dispatch(cancelOrder(cancelData))
>>>>>>> d20b5ea8f26a1e7ed10e32782289b9eeb86c2ae8
      //   .then((res) => {
      //     if (res?.payload?.status === 200) {
      //       toast.success("Order cancelled successfully!");
      //       // Refresh the orders
      //       dispatch(upcomingBooking({ userId: userDetail?._id }));
      //       dispatch(pastBooking({ userId: userDetail?._id }));
      //     } else {
      //       toast.error("Failed to cancel order");
      //     }
      //   })
      //   .catch((err) => {
      //     console.log({ err });
      //     toast.error("Error cancelling order");
      //   })
      //   .finally(() => {
<<<<<<< HEAD
      //     // Remove order from cancelling list using the updated state
      //     const finalCancellingOrders = Array.isArray(updatedState.cancellingOrders) 
      //       ? updatedState.cancellingOrders.filter(id => id !== orderToCancel._id)
      //       : [];
            
      //     updateState(prevState => ({
      //       ...prevState,
      //       cancellingOrders: finalCancellingOrders,
      //     }));
=======
      //     updateState({
      //       ...iState,
      //       cancelModal: false,
      //       orderToCancel: null,
      //     });
>>>>>>> d20b5ea8f26a1e7ed10e32782289b9eeb86c2ae8
      //   });

      // TODO: Replace the above mock implementation with:
      dispatch(cancelOrder(cancelData))
        .then((res) => {
          if (res?.payload?.status === 200) {
            toast.success("Order cancelled successfully!");
            dispatch(upcomingBooking({ userId: userDetail?._id }));
            dispatch(pastBooking({ userId: userDetail?._id }));
          } else {
            toast.error("Failed to cancel order");
          }
        })
        .catch((err) => {
          console.log({ err });
          toast.error("Error cancelling order");
        })
        .finally(() => {
          const finalCancellingOrders = Array.isArray(updatedState.cancellingOrders) 
            ? updatedState.cancellingOrders.filter(id => id !== orderToCancel._id)
            : [];
          updateState(prevState => ({
            ...prevState,
            cancellingOrders: finalCancellingOrders,
          }));
        });
    }
  };

  const handleLogout = () => {
    navigate("/");
    window?.localStorage?.removeItem("LennyUserDetail");
    window.localStorage.setItem("LoginTimer", true);
    toast.success("Log Out Successfully!!");
    dispatch(userDetailState(false));
  };

  const handleKeyDown = (e) => {
    const { name } = e.target;
    if (e.key == "Backspace" && name == "additional_phone") {
      updateState({ ...iState, phone_valid: true });
    }
  };

  const handleDeleteAddress = () => {
    const data = {
      userId: userDetail?._id,
      addressId: addressDetail?._id,
    };
    dispatch(addressDelete(data)).then((res) => {
      toast?.success(res?.payload?.data?.message);
      updateState({ ...iState, deleteModal: false, addressDetail: "" });
      dispatch(addressListing({ userId: userDetail?._id }));
    });
  };

  const openReviewModal = (productId) => {
    updateState({
      ...iState,
      reviewModal: true,
      productId: productId,
    });
  };

  const handleViewDetails = (item) => {
    setorder(item);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  useEffect(() => {
    // Update phone validation state when additional_phone changes
    let newState = { ...iState };
    if (additional_phone?.length >= 10) {
      newState = { ...newState, phone_valid: false };
    }
    updateState(newState);
    dispatch(addressListing({ userId: userDetail?._id }));
    dispatch(upcomingBooking({ userId: userDetail?._id }));
    dispatch(pastBooking({ userId: userDetail?._id }));
  }, [additional_phone]);

  // useEffect(() => {
  //   // Fetch data when component mounts and when userDetail changes
  //   if (userDetail?._id) {
  //     dispatch(addressListing({ userId: userDetail._id }));
  //     dispatch(upcomingBooking({ userId: userDetail._id }));
  //     dispatch(pastBooking({ userId: userDetail._id }));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userDetail?._id]);

  return (
    <>
      <section className="CheckOutArea">
        <div className="container-fluid">
          <h4>Profile</h4>
          <p>Showing your choices product</p>
        </div>
      </section>
      <section className="CheckOutDetails" style={{ paddingBottom: 250 }}>
        <div className="container-fluid">
          <div className="row">
            <TabContainer defaultActiveKey={type}>
              <div className="col-lg-4 col-md-5">
                <div className="PersonalDetailsBox">
                  <Nav>
                    <Nav.Item>
                      <Nav.Link eventKey="profile" as={Link} to="/profile">
                        Personal Details
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="upcoming-bookings"
                        as={Link}
                        to="/upcoming-bookings"
                      >
                        My Orders
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="past-bookings"
                        as={Link}
                        to="/past-bookings"
                      >
                        Past Bookings
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="address" as={Link} to="/address">
                        Address
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        as={Link}
                        onClick={() =>
                          updateState({
                            ...iState,
                            deleteModal: true,
                            logType: true,
                          })
                        }
                      >
                        Log Out
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
              <div className="col-lg-8 col-md-7">
                <Tab.Content className="tab-content">
                  <Tab.Pane className="tab-pane" eventKey="profile">
                    <div className="ProfileDetailsBox">
                      <aside>
                        <figure>
                          <figcaption>Profile Details</figcaption>
                          <img
                            src={
                              userDetail?.personalInfo?.photo
                                ? userDetail?.personalInfo?.photo
                                : require("../../assets/images/human_icon.jpg")
                            }
                          />
                        </figure>
                        <a
                          className="EditBtn"
                          onClick={() => handleProfileModalHideShow("show")}
                        >
                          Edit
                        </a>
                      </aside>
                      <article>
                        <ul>
                          <li>
                            <h5>Name</h5>
                            <p>{userDetail?.personalInfo?.name}</p>
                          </li>
                          <li>
                            <h5>Gender</h5>
                            <p>{userDetail?.personalInfo?.gender}</p>
                          </li>
                          <li>
                            <h5>Date of Birth</h5>
                            <p>
                              {userDetail?.personalInfo?.dob?.split("T")?.at(0)}
                            </p>
                          </li>
                          <li>
                            <h5>Email Address</h5>
                            <p>{userDetail?.personalInfo?.email}</p>
                          </li>
                          <li>
                            <h5>Phone Number</h5>
                            <p>{userDetail?.phone}</p>
                          </li>
                        </ul>
                      </article>
                    </div>
                  </Tab.Pane>
                  {/* My Orders Tab - Current/Upcoming Orders */}
                  <Tab.Pane className="tab-pane" eventKey="upcoming-bookings">
                    {/* Only show if there are upcoming orders */}
                    {getUpcomingBooking?.data?.length > 0 ? (
                      <div className="PastBookingArea">
                        <h4 style={{ marginBottom: "20px" }}>My Current Orders</h4>
                        {getUpcomingBooking?.data?.map((item, i) => {
                          return (
                            <div className="PastBookingBox" key={i} onClick={() => handleViewDetails(item)}>
                              <article>
                                <figure>
                                  <img src={item?.prodimages} />
                                </figure>
                                <figcaption>
                                  <h5>
                                    {item?.productName}
                                    <span>
                                      {item?.remainingAmount !== undefined
                                        ? item?.remainingAmount == 0
                                          ? "Full Payment"
                                          : "Partial Payment"
                                        : "COD"}
                                    </span>
                                  </h5>
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        item?.productDescription?.length > 100
                                          ? item?.productDescription?.slice(
                                            0,
                                            100
                                          ) + "..."
                                          : item?.productDescription,
                                    }}
                                  ></p>
                                  <h3>₹{item?.totalAmount}</h3>
                                  {item?.remainingAmount ? (
                                    <>
                                      <p>
                                        Partial Payment:{`₹${item?.paidAmount}`}
                                      </p>
                                      <p>
                                        Remaining Amount:
                                        {`₹${item?.remainingAmount}`}
                                      </p>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </figcaption>
                              </article>
                              {item?.productcustomizeDetails?.length > 0 ? (
                                <div className="PastCutomBookingBox" key={i}>
                                  <h6>Product Customizations</h6>
                                  {item?.productcustomizeDetails?.map(
                                    (customItem, customIndex) => {
                                      return (
                                        <article key={customIndex}>
                                          <figure>
                                            <img src={customItem?.customimages} />
                                          </figure>
                                          <figcaption>
                                            <p>{customItem?.name}</p>
                                            <h3>
                                              ₹{customItem?.price}X
                                              {customItem?.quantity}
                                            </h3>
                                          </figcaption>
                                        </article>
                                      );
                                    }
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="timeSlot">
                                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                  <h5>
                                    <img
                                      src={require("../../assets/images/date.png")}
                                    />
                                    {formatDate(
                                      item?.placedon?.split("T")?.at(0)
                                    )}
                                  </h5>
                                  <p>
                                    <img
                                      src={require("../../assets/images/time.png")}
                                    />
                                    {item?.slot}
                                  </p>
                                </div>
<<<<<<< HEAD
                                {/* Cancel Order Button with Loading State */}
                                <div style={{ marginTop: "10px" }}>
                                  {Array.isArray(cancellingOrders) && cancellingOrders.includes(item._id) ? (
                                    <button
                                      className="btn btn-secondary"
                                      style={{
                                        backgroundColor: "#6c757d",
                                        border: "none",
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        color: "white",
                                        fontSize: "14px",
                                        cursor: "not-allowed",
                                      }}
                                      disabled
                                    >
                                      Cancelled
                                    </button>
                                  ) : item.status === "cancelled" ? (
                                    <button
                                      className="btn btn-secondary"
                                      style={{
                                        backgroundColor: "#6c757d",
                                        border: "none",
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        color: "white",
                                        fontSize: "14px",
                                        cursor: "not-allowed",
                                      }}
                                      disabled
                                    >
                                      Cancelled
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-danger"
                                      style={{
                                        backgroundColor: "#dc3545",
                                        border: "none",
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        color: "white",
                                        fontSize: "14px",
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelOrder(item);
                                      }}
                                    >
                                      Cancel Order
                                    </button>
                                  )}
=======
                                
                                {/* Cancel Order Button */}
                                <div style={{ marginTop: "10px" }}>
                                  <button
                                    className="btn btn-danger"
                                    style={{
                                      backgroundColor: "#dc3545",
                                      border: "none",
                                      padding: "8px 16px",
                                      borderRadius: "4px",
                                      color: "white",
                                      fontSize: "14px",
                                    }}
                                    onClick={() => handleCancelOrder(item)}
                                  >
                                    Cancel Order
                                  </button>
>>>>>>> d20b5ea8f26a1e7ed10e32782289b9eeb86c2ae8
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="EmptyOrderArea">
                        <span>
                          <img
                            src={require("../../assets/images/empty-img.png")}
                          />
                        </span>
                        <h3>Empty Order List</h3>
                        <p>You don't have any current orders.</p>
                        <button
                          className="ContinueBtn"
                          onClick={() => navigate("/")}
                        >
                          Continue Shopping
                        </button>
                      </div>
                    )}
                  </Tab.Pane>
                  {/* Past Bookings Tab - Order History */}
                  <Tab.Pane className="tab-pane" eventKey="past-bookings">
                    <div className="PastBookingArea">
                      <h4 style={{ marginBottom: "20px" }}>Order History</h4>
                      {getPastBooking?.data?.length > 0 ? (
                        getPastBooking?.data?.map((item, i) => {
                          return (
                            <div className="PastBookingBox" key={i}>
                              <article>
                                <figure>
                                  <img src={item?.prodimages} />
                                </figure>
                                <figcaption>
                                  <h5>
                                    {item?.productName}
                                    <span>
                                      {item?.remainingAmount !== undefined
                                        ? item?.remainingAmount == 0
                                          ? "Full Payment"
                                          : "Partial Payment"
                                        : "COD"}
                                    </span>
                                  </h5>
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        item?.productDescription?.length > 100
                                          ? item?.productDescription?.slice(
                                            0,
                                            100
                                          ) + "..."
                                          : item?.productDescription,
                                    }}
                                  ></p>
                                  <h3>₹{item?.totalAmount}</h3>
                                  {item?.remainingAmount ? (
                                    <>
                                      <p>
                                        Partial Payment:{`₹${item?.paidAmount}`}
                                      </p>
                                      <p>
                                        Remaining Amount:
                                        {`₹${item?.remainingAmount}`}
                                      </p>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </figcaption>
                              </article>
                              {item?.productcustomizeDetails?.length > 0 ? (
                                <div className="PastCutomBookingBox">
                                  <h6>Product Customizations</h6>
                                  {item?.productcustomizeDetails?.map(
                                    (customItem, customIndex) => {
                                      return (
                                        <article key={customIndex}>
                                          <figure>
                                            <img src={customItem?.customimages} />
                                          </figure>
                                          <figcaption>
                                            <p>{customItem?.name}</p>
                                            <h3>
                                              ₹{customItem?.price}X{customItem?.quantity}
                                            </h3>
                                          </figcaption>
                                        </article>
                                      );
                                    }
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="timeSlot">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <div>
                                    <h5>
                                      <img
                                        src={require("../../assets/images/date.png")}
                                      />
                                      {formatDate(item?.placedon?.split("T")?.at(0))}
                                    </h5>
                                    <p>
                                      <img
                                        src={require("../../assets/images/time.png")}
                                      />
                                      {item?.slot}
                                    </p>
                                  </div>
                                  {/* Add Review Button */}
                                  <div>
                                    <button
                                      className="btn btn-primary"
                                      style={{
                                        backgroundColor: "#007bff",
                                        border: "none",
                                        padding: "8px 16px",
                                        borderRadius: "4px",
                                        color: "white",
                                        fontSize: "14px",
                                      }}
                                      onClick={() => openReviewModal(item?.productId || item?._id)}
                                    >
                                      Add Review
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="EmptyOrderArea">
                          <span>
                            <img
                              src={require("../../assets/images/empty-img.png")}
                            />
                          </span>
                          <h3>No Order History</h3>
                          <p>You don't have any past orders.</p>
                          <button
                            className="ContinueBtn"
                            onClick={() => navigate("/")}
                          >
                            Continue Shopping
                          </button>
                        </div>
                      )}
                    </div>
                  </Tab.Pane>
                  <Tab.Pane className="tab-pane" eventKey="address">
                    <div className="AddressArea">
                      <h4>Address Details</h4>
                      <a
                        className="add"
                        onClick={() =>
                          updateState({
                            ...initialState,
                            addressModal: true,
                            editMode: false,
                          })
                        }
                      >
                        +Add
                      </a>
                      {getAddressList?.data?.Addresses?.length > 0 ? (
                        getAddressList?.data?.Addresses?.map((item, i) => {
                          return (
                            <div className="AddressBox" key={i}>
                              <p>
                                {item?.addresstype == "home"
                                  ? "Home"
                                  : "Office"}
                              </p>
                              <h6>
                                {`${item?.houseNo},${item?.street},
                            ${item?.landmark},${item?.pincode},
                            ${item?.city},${item?.state}`}
                              </h6>
                              <div className="Anchors">
                                <a
                                  style={{ marginRight: "13px" }}
                                  onClick={() =>
                                    updateState({
                                      ...initialState,
                                      addressDetail: item,
                                      addressModal: true,
                                      editMode: true,
                                    })
                                  }
                                >
                                  Edit
                                </a>
                                <a
                                  onClick={() =>
                                    updateState({
                                      ...iState,
                                      deleteModal: true,
                                      addressDetail: item,
                                    })
                                  }
                                >
                                  Delete
                                </a>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p style={{ textAlign: "center" }}>
                          No Address is found
                        </p>
                      )}
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </TabContainer>
          </div>
        </div>
      </section>
      {/* Order Details Modal - Popup */}
      <Modal
        show={showDetails}
        onHide={handleCloseDetails}
        size="lg"
        centered
        className="order-details-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OrderProductDetails item={order} />
        </Modal.Body>
      </Modal>
      {/* Profile Edit Modal */}
      <Modal
        className="ModalBox"
        show={profileEditModal}
        onHide={() => handleProfileModalHideShow("hide")}
      >
        <a
          onClick={() => handleProfileModalHideShow("hide")}
          className="CloseModal"
        >
          ×
        </a>
        <div className="ModalArea">
          <h3>Edit Profile Details</h3>
          <div className="FormArea">
            <figure className="Profile">
              <img
                style={{
                  borderRadius: "50%",
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
                src={img ? img : require("../../assets/images/human_icon.jpg")}
                alt=""
              />
              <span className="UploadOverlay">
                <input
                  type="file"
                  onChange={(e) => handleImage(e, "profile")}
                />
                <img
                  src={require("../../assets/images/camera.png")}
                  style={{ cursor: "pointer" }}
                />
              </span>
            </figure>
            <form>
              <div className="form-group">
                <h6>Full Name</h6>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                />
                <span className="error">{errors?.nameError}</span>
              </div>
              <div className="form-group">
                <h6>Select Gender</h6>
                <select
                  className="form-control"
                  name="gender"
                  onChange={handleInputChange}
                  value={gender}
                >
                  <option value="">
                    --select--
                  </option>
                  <option value="Male">
                    Male
                  </option>
                  <option value="Female">
                    Female
                  </option>
                </select>
                <span className="error">{errors?.genderError}</span>
              </div>
              <div className="form-group">
                <h6>Date of birth</h6>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  value={dob}
                  onChange={handleInputChange}
                />
                <span className="error">{errors?.dobError}</span>
              </div>
              <div className="form-group">
                <h6>
                  Email Address
                  <small>(Optional)</small>
                </h6>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your email address"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                />
                <span className="error">{errors?.emailError}</span>
              </div>
              <div className="form-group">
                <h6>Phone Number</h6>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your phone number"
                  name="phone"
                  value={phone}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="form-group">
                <h6>
                  Additional Phone Number <small>(Optional)</small>
                </h6>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your phone number"
                  name="additional_phone"
                  value={additional_phone}
                  onChange={phone_valid ? handleInputChange : null}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </form>
            <button className="Button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </Modal>
      {/* Delete/Logout Confirmation Modal */}
      <Modal
        centered
        className="ModalBox"
        show={deleteModal}
        onHide={() =>
          updateState({ ...iState, deleteModal: false, addressDetail: "" })
        }
      >
        <a
          onClick={() =>
            updateState({ ...iState, deleteModal: false, addressDetail: "" })
          }
          className="CloseModal"
        >
          ×
        </a>
        <div className="ModalArea">
          <h5 style={{ marginBottom: "70px" }}>
            Are you sure you want to{" "}
            {`${logType ? "Log out?" : "delete this Address?"}`}
          </h5>
          <div className="FormArea" style={{ display: "flex" }}>
            <button
              className="Button me-5"
              onClick={() => updateState({ ...iState, deleteModal: false })}
            >
              No
            </button>
            <button
              className="Button ms-5"
              onClick={
                logType ? () => handleLogout() : () => handleDeleteAddress()
              }
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
      {/* Cancel Order Confirmation Modal */}
      <Modal
        centered
        className="ModalBox"
        show={cancelModal}
        onHide={() =>
          updateState({ ...iState, cancelModal: false, orderToCancel: null })
        }
      >
        <a
          onClick={() =>
            updateState({ ...iState, cancelModal: false, orderToCancel: null })
          }
          className="CloseModal"
        >
          ×
        </a>
        <div className="ModalArea">
          <h5 style={{ marginBottom: "70px" }}>
            Are you sure you want to cancel this order?
          </h5>
          <div className="FormArea" style={{ display: "flex" }}>
            <button
              className="Button me-5"
              onClick={() => updateState({ ...iState, cancelModal: false, orderToCancel: null })}
            >
              No
            </button>
            <button
              className="Button ms-5"
              onClick={confirmCancelOrder}
            >
              Yes, Cancel Order
            </button>
          </div>
        </div>
      </Modal>
      {/* Review Modal */}
      <Modal
        centered
        className="ModalBox"
        show={reviewModal}
        onHide={() =>
          updateState({ ...iState, reviewModal: false, productId: "", review: "", review_image: "" })
        }
      >
        <a
          onClick={() =>
            updateState({ ...iState, reviewModal: false, productId: "", review: "", review_image: "" })
          }
          className="CloseModal"
        >
          ×
        </a>
        <div className="ModalArea">
          <h3 style={{ textAlign: "center" }}>Share Your Experience</h3>
          <div className="shareExperienceArea">
            <h4>How would you rate us?</h4>
            <div className="stars" style={{ fontSize: "18px" }}>
              {Array.from({ length: starLength }).map((_, index) => (
                <a key={index} onClick={() => setStarsLength(index + 1)}>
                  <i className="fa-solid fa-star"></i>
                </a>
              ))}
              {Array.from({ length: 5 - starLength }).map((_, index) => (
                <a
                  key={index}
                  onClick={() => setStarsLength(starLength + index + 1)}
                >
                  <i className="fa-regular fa-star"></i>
                </a>
              ))}
            </div>
            <div className="form-group">
              <h6>Review</h6>
              <textarea
                rows={5}
                className="form-control"
                name="review"
                value={review}
                onChange={handleInputChange}
                placeholder="Share your experience with this product..."
              ></textarea>
            </div>
            <div className="form-group">
              <h6>Upload</h6>
              <div className="d-flex">
                <div className="uploadBox" style={{ marginRight: 10 }}>
                  <input
                    type="file"
                    style={{ cursor: "pointer" }}
                    onChange={(e) => handleImage(e, "review")}
                    accept="image/*"
                  />
                  <i className="fa-solid fa-camera"></i>
                </div>
                <div
                  className="uploadPreviewImg1"
                  style={{ width: "150px", height: "150px" }}
                >
                  {review_image ? (
                    <div style={{ position: "relative" }}>
                      <img src={review_image} alt="Review" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <span className="cross-btn" onClick={handleImageClose}>
                        ×
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <small style={{ color: "#26303b" }}>
                Maximum size:5 MB, jpeg, jpg or png
              </small>
            </div>
            <button className="Button" onClick={handleSubmitReview}>
              Submit Review
            </button>
          </div>
        </div>
      </Modal>
      <AddAddress
        naviState={iState}
        navupdateState={updateState}
        userDetail={userDetail}
      />
    </>
  );
};

export default Profile;