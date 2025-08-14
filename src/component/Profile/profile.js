import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal, Nav, Tab, TabContainer } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { userDetailState } from "../../reduxToolkit/Slices/ProductList/listApis";
import { onImageHandler } from "../../Utils/uploadFile";
import {
  addressDelete,
  addressListing,
  personalInfoEditApi,
  personalInfoUpdateSlice,
} from "../../reduxToolkit/Slices/Auth/auth";
import { toast } from "react-toastify";
import AddAddress from "../Modals/AddAddress";
import {
  pastBooking,
  upcomingBooking,
} from "../../reduxToolkit/Slices/Cart/bookingApis";
import { formatDate } from "../../Utils/commonFunctions";
import { addReview } from "../../reduxToolkit/Slices/ReviewAndRating/reviewRatingApis";

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
    addressModal,
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
    editMode,
    addressDetail,
    deleteModal,
    logType,
    reviewModal,
    productId,
    review,
    review_image,
  } = iState;
  const { type } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetail = JSON?.parse(
    window?.localStorage?.getItem("LennyUserDetail")
  );

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
    console.log(data, "here data");
    console.log(data[0], "here data1");
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
        console.log({ res }, "profile");
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
        console.log({ res });
        if (res?.payload?.status == 200) {
          toast.success("Review Submit Successfully!!");
          updateState({ ...iState, reviewModal: false, productId: "" });
        } else {
          toast.error("Error");
        }
      })
      .catch((err) => {
        console.log({ err });
      });
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

  useEffect(() => {
    let newState = { ...iState };
    if (additional_phone?.length >= 10) {
      newState = { ...newState, phone_valid: false };
    }
    updateState(newState);
    dispatch(addressListing({ userId: userDetail?._id }));
    dispatch(upcomingBooking({ userId: userDetail?._id }));
    dispatch(pastBooking({ userId: userDetail?._id }));
  }, [additional_phone]);

  console.log({ starLength, review_image, addressListing });
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
                  <Tab.Pane className="tab-pane" eventKey="upcoming-bookings">
                    <div className="PastBookingArea">
                      {getUpcomingBooking?.data?.length > 0 ? (
                        getUpcomingBooking?.data?.map((item, i) => {
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
                                <div className="PastCutomBookingBox" key={i}>
                                  <h6>Product Customizations</h6>
                                  {item?.productcustomizeDetails?.length > 0
                                    ? item?.productcustomizeDetails?.map(
                                        (item, i) => {
                                          return (
                                            <article key={i}>
                                              <figure>
                                                <img src={item?.customimages} />
                                              </figure>
                                              <figcaption>
                                                <p>{item?.name}</p>
                                                <h3>
                                                  ₹{item?.price}X
                                                  {item?.quantity}
                                                </h3>
                                              </figcaption>
                                            </article>
                                          );
                                        }
                                      )
                                    : ""}
                                </div>
                              ) : (
                                ""
                              )}

                              <div className="timeSlot">
                                <h5>
                                  {" "}
                                  <img
                                    src={require("../../assets/images/date.png")}
                                  />
                                  {formatDate(
                                    item?.placedon?.split("T")?.at(0)
                                  )}
                                </h5>
                                <p>
                                  {" "}
                                  <img
                                    src={require("../../assets/images/time.png")}
                                  />
                                  {item?.slot}
                                </p>
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
                          <h3>Empty Order List</h3>
                          <p>You don't have any products in your order list.</p>
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
                  <Tab.Pane className="tab-pane" eventKey="past-bookings">
                    {/* <div className="EmptyOrderArea">
                      <span>
                        <img
                          src={require("../../assets/images/empty-img.png")}
                        />
                      </span>
                      <h3>Empty Order List</h3>
                      <p>You don't have any products in your order list.</p>
                      <button
                        className="ContinueBtn"
                        onClick={() => navigate("/")}
                      >
                        Continue Shopping
                      </button>
                    </div> */}
                    {/* <div className="PastBookingArea">
                      <div className="PastBookingBox">
                        <article>
                          <figure>
                            <img src="assets/images/product-1.png" />
                          </figure>
                          <figcaption>
                            <h5>Glitzy Silver and Black Birthday Decor</h5>
                            <p>
                              It is a long established fact that a reader will
                              be distracted by the readable .....
                            </p>
                            <h3>₹49</h3>
                          </figcaption>
                        </article>
                        <div>
                          <h5>
                            {" "}
                            <img src="assets/images/date.png" /> 28 September
                            2024
                          </h5>
                          <button
                            onClick={() =>
                              updateState({ ...iState, reviewModal: true })
                            }
                          >
                            Add Review
                          </button>
                          <p>
                            {" "}
                            <img src="assets/images/time.png" /> 08 PM to 11 PM
                          </p>
                        </div>
                      </div>
                    </div> */}

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
                              <div className="PastCutomBookingBox" key={i}>
                                <h6>Product Customizations</h6>
                                {item?.productcustomizeDetails?.length > 0
                                  ? item?.productcustomizeDetails?.map(
                                      (item, i) => {
                                        return (
                                          <article key={i}>
                                            <figure>
                                              <img src={item?.customimages} />
                                            </figure>
                                            <figcaption>
                                              <p>{item?.name}</p>
                                              <h3>
                                                ₹{item?.price}X{item?.quantity}
                                              </h3>
                                            </figcaption>
                                          </article>
                                        );
                                      }
                                    )
                                  : ""}
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="timeSlot">
                              <h5>
                                {" "}
                                <img
                                  src={require("../../assets/images/date.png")}
                                />
                                {formatDate(item?.placedon?.split("T")?.at(0))}
                              </h5>
                              <p>
                                {" "}
                                <img
                                  src={require("../../assets/images/time.png")}
                                />
                                {item?.slot}
                              </p>
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
                        <h3>Empty Order List</h3>
                        <p>You don't have any products in your order list.</p>
                        <button
                          className="ContinueBtn"
                          onClick={() => navigate("/")}
                        >
                          Continue Shopping
                        </button>
                      </div>
                    )}
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
                            <div className="AddressBox">
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
                  onClick={handleInputChange}
                >
                  <option selected="" value="">
                    --select--
                  </option>
                  <option value="Male" selected={gender == "Male"}>
                    Male
                  </option>
                  <option value="Female" selected={gender == "Female"}>
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

      <Modal
        centered
        className="ModalBox"
        show={reviewModal}
        onHide={() =>
          updateState({ ...iState, reviewModal: false, productId: "" })
        }
      >
        <a
          onClick={() =>
            updateState({ ...iState, reviewModal: false, productId: "" })
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
                  <i class="fa-solid fa-star"></i>
                </a>
              ))}

              {Array.from({ length: 5 - starLength }).map((_, index) => (
                <a
                  key={index}
                  onClick={() => setStarsLength(starLength + index + 1)}
                >
                  <i class="fa-regular fa-star"></i>
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
                  />
                  <i class="fa-solid fa-camera"></i>
                </div>
                <div
                  className="uploadPreviewImg1"
                  style={{ width: "150px", height: "150px" }}
                >
                  {review_image ? (
                    <div style={{ position: "relative" }}>
                      <img src={review_image} />
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
                Maximum size:5 MB ,jpeg,jpg or png
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
