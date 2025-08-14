import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createOrder,
  deleteCartProduct,
  editCart,
  orderSummary,
  placeOrder,
} from "../../reduxToolkit/Slices/Cart/bookingApis";
import { Modal } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { toast } from "react-toastify";
import { addressListing } from "../../reduxToolkit/Slices/Auth/auth";
import { slotListApi } from "../../reduxToolkit/Slices/ProductList/listApis";
import { convertTimeFormat } from "../../Utils/commonFunctions";
import Multiselect from "multiselect-react-dropdown";
import RazorpayPayment from "./RazorpayPayment";
import AddAddress from "../Modals/AddAddress";

const initialState = {
  dateAdded: "",
  minDate: "",
  slot: "",
  slotList: [],
  ballonColor: "",
  custom_name: "",
  mentionAge: "",
  ageBalloonColor: "",
  borderColor: "",
  customer_req: "",
  additional_Phone: "",
  phone_valid: true,
  customization: "",
  editModal: false,
  deleteModal: false,
  addressListModal: false,
  addressList: "",
  decorationArea: "",
  decorationLocation: "",
  aboutX: "",
  occasion: "",
  decorArea: [
    "Party Lawn",
    "Banquet",
    "Hotel/ Restaurant",
    "At your home/ your owned property",
  ],
  aboutArr: [
    "Friend",
    "Google",
    "Instagram",
    "Facebook",
    "Email",
    "Used Before",
    "Amazon",
    "Advertisement",
    "Other",
  ],
  occasionArr: [
    "Anniversary",
    "Baby Shower",
    "First Birthday",
    "Bachelorette",
    "Festival",
    "Partner's Birthday",
    "Casual Outing",
    "For my Parents",
    "For my Kids",
    "For Brother or Sister",
    "Valentine's",
    "Karvachauth",
    "Welcome Baby",
    "House Warming",
    "Shop Inauguration",
    "Office",
    "Other",
  ],
  addressModal: false,
  editMode: false,
};
const Checkout1 = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getAddressList } = useSelector((state) => state.auth);
  const [iState, updateState] = useState(initialState);
  // const [displayRazorpay, setDisplayRazorpay] = useState(false);

  const [options, setOptions] = useState([
    { name: "Same as product", id: 1 },
    { name: "Red", id: 2 },
    { name: "Blue", id: 3 },
    { name: "Black", id: 4 },
    { name: "Golden", id: 5 },
    { name: "White", id: 6 },
    { name: "Pink", id: 7 },
  ]);
  const [selectedValue, setSelectedValue] = useState([]);

  const {
    dateAdded,
    minDate,
    slot,
    slotList,
    customization,
    editModal,
    deleteModal,
    ballonColor,
    custom_name,
    additional_Phone,
    customer_req,
    phone_valid,
    addressList,
    addressListModal,
    decorationArea,
    decorArea,
    decorationLocation,
    aboutArr,
    aboutX,
    occasionArr,
    occasion,
    borderColor,
    mentionAge,
    ageBalloonColor,
    addressModal,
    editMode,
  } = iState;
  const { getOrderSummaryDetail, loader } = useSelector(
    (state) => state.orderSummary
  );
  const { getProductDetails, getSlotList } = useSelector(
    (state) => state.productList
  );
  const state = location?.state;
  const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));

  const onSelect = (selectedList, selectedItem) => {
    setSelectedValue(selectedList);

    // Add any other logic needed when an item is selected
  };

  const onRemove = (selectedList, removedItem) => {
    setSelectedValue(selectedList);
    // Add any other logic needed when an item is removed
  };

  const [orderDetails, setOrderDetails] = useState({
    amount: null, // Amount in INR
    currency: "INR",
    orderId: null,
    name: null,
    email: "johndoe@example.com",
    contact: "9999999999",
    logo: "https://example.com/your_logo.png",
    businessName: "Skyrixe.com",
    razorpayKey: process.env.REACT_APP_RAZORPAY_KEY_ID,
  });

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "additional_Phone") {
      let modifiedValue = value >= 0 ? value : additional_Phone + "";
      updateState({ ...iState, additional_Phone: modifiedValue, errors: "" });
    } else if (name == "addressList") {
      updateState({
        ...iState,
        [name]: JSON.parse(value),
        addressListModal: false,
      });
    } else {
      updateState({ ...iState, [name]: value });
    }
  };

  const handleCheckOut = () => {};

  const handleDateTimeSlot = () => {
    const data = {
      detail: {
        dateAdded,
        slot,
        userId: getOrderSummaryDetail?.data?.userId,
        productId: getOrderSummaryDetail?.data?.productId,
      },
      id: getOrderSummaryDetail?.data?._id,
    };

    dispatch(editCart(data)).then((res) => {
      console.log({ res });
      if (res?.payload?.status == 200) {
        updateState({ ...iState, editModal: false });
        toast?.success("Edit Successfully Successfully");
        dispatch(orderSummary({ userId: state?.userId }));
      }
    });
  };

  console.log({ decorArea });

  const handleCustomTrash = (item) => {
    const data = {
      detail: {
        customization: customization?.filter(
          (custom) => custom?._id !== item?._id
        ),
        totalAmount:
          Number(getOrderSummaryDetail?.data?.totalAmount) -
          Number(item?.price) * item?.quantity,
        userId: getOrderSummaryDetail?.data?.userId,
        productId: getOrderSummaryDetail?.data?.productId,
      },
      id: getOrderSummaryDetail?.data?._id,
    };

    dispatch(editCart(data)).then((res) => {
      console.log({ res });
      if (res?.payload?.status == 200) {
        toast?.success("Customization Deleted Successfully");
        dispatch(orderSummary({ userId: state?.userId }));
      }
    });
  };

  const handleDeleteProdcut = () => {
    const data = {
      id: getOrderSummaryDetail?.data?._id,
    };
    console.log({ data });
    dispatch(deleteCartProduct(data)).then((res) => {
      console.log({ res });
      if (res?.payload?.status == 200) {
        toast?.success(res?.payload?.message);
        dispatch(orderSummary({ userId: userDetail?._id }));
        navigate("/");
        window.scrollTo({ top: 150, behavior: "smooth" });
      }
    });
  };

  useEffect(() => {
    dispatch(orderSummary({ userId: state?.userId }));
  }, [state]);

  useEffect(() => {
    console.log("yess");
    if (getOrderSummaryDetail) {
      updateState({
        ...iState,
        dateAdded: getOrderSummaryDetail?.data?.dateAdded,
        slot: getOrderSummaryDetail?.data?.slot,
        customization: getOrderSummaryDetail?.data?.productcustomizeDetails,
        addressList: getAddressList?.data?.Addresses?.at(0),
      });
      dispatch(
        slotListApi({
          date: new Date().toISOString().split("T")[0],
          productId: getOrderSummaryDetail?.data?.productId,
        })
      );
    }
  }, [getOrderSummaryDetail, getAddressList]);

  useEffect(() => {
    let newState = { ...iState };
    if (additional_Phone?.length >= 10) {
      newState = { ...newState, phone_valid: false };
    }
    updateState(newState);
  }, [additional_Phone]);

  const handleKeyDown = (e) => {
    const { name } = e.target;
    if (e.key == "Backspace" && name == "additional_Phone") {
      updateState({ ...iState, phone_valid: true });
    }
  };

  useEffect(() => {
    dispatch(addressListing({ userId: userDetail?._id }));
  }, []);

  useEffect(() => {
    if (getSlotList) {
      updateState({
        ...iState,
        // dateAdded: getSlotList?.date,
        minDate: minDate ? minDate : getSlotList?.date,
        slotList: getSlotList?.availableSlots,
      });
    }
  }, [getSlotList]);
  console.log({
    customization,
    getOrderSummaryDetail,
    state,
    addressList,
    ageBalloonColor,
  });

  // console.log(displayRazorpay,"displayRazorpay")
  return (
    <>
      <section className="CheckOutArea">
        <div className="container-fluid">
          <h4>Checkout</h4>
          <p>Showing your choices product</p>
        </div>
      </section>
      <section className="CheckOutDetails">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8 col-md-7">
              <div className="BookingBox">
                <h4>Booking Date and Time</h4>
                <aside>
                  <div>
                    <h5>
                      {" "}
                      <img src={require("../../assets/images/date.png")} />
                      {getOrderSummaryDetail?.data?.dateAdded}
                    </h5>
                    <p>
                      {" "}
                      <img src={require("../../assets/images/time.png")} />{" "}
                      {getOrderSummaryDetail?.data?.slot}
                    </p>
                  </div>
                  <a
                    className="EditBtn"
                    onClick={() => updateState({ ...iState, editModal: true })}
                  >
                    Edit
                  </a>
                </aside>
              </div>
              <div className="VenueAddress">
                <h4>Venue Address </h4>
                {getAddressList?.data?.Addresses?.length > 0 ? (
                  <aside>
                    <div>
                      <a className="GreenLocation">
                        <img
                          src={require("../../assets/images/green-location.png")}
                        />
                      </a>
                      <h5>
                        {addressList?.street}{" "}
                        <span>
                          {addressList?.addresstype == "home"
                            ? "Home"
                            : "Office"}{" "}
                          Address
                        </span>
                      </h5>
                      <p>{userDetail?.phone}</p>
                      <p>{`${addressList?.street} ${addressList?.landmark} ${addressList?.city} ${addressList?.pincode}`}</p>
                    </div>

                    <a
                      className="EditBtn"
                      onClick={() =>
                        updateState({ ...iState, addressListModal: true })
                      }
                    >
                      Other Address
                    </a>
                  </aside>
                ) : (
                  <div>
                    <p>No address found Please add an address.</p>
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
                  </div>
                )}

                {/* <p>No Address found please add an Address</p> */}
              </div>
              <div className="VenueAddress customChange">
                <div className="row">
                  <div className="col-12 pl-0">
                    <label>
                      <span>Where do you want us to do the decoration?</span>
                      <span className="question_astric">*</span>
                      <span> (Max 1)</span>
                    </label>
                  </div>
                  {decorArea?.length > 0
                    ? decorArea?.map((item, i) => {
                        return (
                          <div className="col-sm-6 col-12" key={i}>
                            <div className="form-group">
                              <label className="Radio">
                                <p>{item}</p>
                                <input
                                  name="decorationLocation"
                                  value={item}
                                  type="radio"
                                  onChange={handleInputChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </div>
                          </div>
                        );
                      })
                    : ""}
                </div>
                <div className="row">
                  <div className="col-12 pl-0">
                    <label>
                      <span>How did you come to know about Skyrixe?</span>
                    </label>
                  </div>
                  {aboutArr?.length > 0
                    ? aboutArr?.map((item, i) => {
                        return (
                          <div className="col-sm-6 col-12" key={i}>
                            <div className="form-group">
                              <label className="Radio">
                                <p>{item}</p>
                                <input
                                  name="aboutX"
                                  type="radio"
                                  value={item}
                                  onChange={handleInputChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </div>
                          </div>
                        );
                      })
                    : ""}
                </div>
                <div className="row">
                  <div className="col-12 pl-0">
                    <label>
                      <span>What is the occasion?</span>
                    </label>
                  </div>
                  {occasionArr?.length > 0
                    ? occasionArr?.map((item, i) => {
                        return (
                          <div className="col-sm-6 col-12" key={i}>
                            <div className="form-group">
                              <label className="Radio">
                                <p>{item}</p>
                                <input
                                  name="occasion"
                                  value={item}
                                  type="radio"
                                  onChange={handleInputChange}
                                />
                                <span className="checkmark" />
                              </label>
                            </div>
                          </div>
                        );
                      })
                    : ""}

                  <form style={{ marginTop: "5px" }}>
                    <div className="row">
                      <div
                        className="col-lg-6 col-md-12"
                        style={{ marginBottom: "27px" }}
                      >
                        <div className="form-group">
                          <h6>Select Ballons color(Max 3)</h6>
                          {/* <input
                            type="text"
                            className="form-control"
                            name="ballonColor"
                            value={ballonColor}
                            onChange={handleInputChange}
                          /> */}
                          <Multiselect
                            options={options}
                            selectedValues={selectedValue}
                            onSelect={onSelect}
                            onRemove={onRemove}
                            displayValue="name"
                            selectionLimit={3}
                          />
                        </div>
                      </div>
                      <div
                        className="col-lg-6 col-md-12"
                        style={{ marginBottom: "27px" }}
                      >
                        <div className="form-group">
                          <h6>Additional Phone Number</h6>
                          <input
                            placeholder="Enter Additional Phone Number"
                            type="text"
                            className="form-control"
                            name="additional_Phone"
                            value={additional_Phone}
                            onChange={phone_valid ? handleInputChange : null}
                            onKeyDown={handleKeyDown}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-lg-6 col-md-12"
                        style={{ marginBottom: "27px" }}
                      >
                        <div className="form-group">
                          <h6>
                            Please provide your name for the customization?
                          </h6>
                          <input
                            type="text"
                            className="form-control"
                            name="custom_name"
                            value={custom_name}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-12">
                        <div className="form-group mb-3">
                          <h6>
                            Mention the age or anniversary year for foil
                            balloons? (Max 2)
                          </h6>
                          <input
                            type="number"
                            className="form-control"
                            name="mentionAge"
                            value={mentionAge}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-12">
                        <div className="form-group mb-3">
                          <h6>
                            Select the color of the age balloon or foil balloon?
                          </h6>
                          <select
                            name="ageBalloonColor"
                            onChange={handleInputChange}
                            className="form-control"
                          >
                            <option value="">--Select Color--</option>
                            <option value="Golden">Golden</option>
                            <option value="Rose Gold">Rose Gold</option>
                            <option value="Silver">Silver</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                          <h6>Customer Requirement</h6>
                          <textarea
                            cols={5}
                            type="text"
                            className="form-control"
                            name="customer_req"
                            value={customer_req}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="ProductBox">
                <aside>
                  <h4>Product</h4>
                  <a
                    className="EditBtn"
                    onClick={() =>
                      updateState({ ...iState, deleteModal: true })
                    }
                  >
                    Remove Product
                  </a>
                </aside>
                <article>
                  <figure>
                    <img src={getOrderSummaryDetail?.data?.productImage} />
                  </figure>
                  <figcaption>
                    <h5>{getOrderSummaryDetail?.data?.productName}</h5>
                    <p
                      // data-tooltip-id="my-tooltip1"
                      // data-tooltip-content={
                      //   getOrderSummaryDetail?.data?.productDescription
                      // }
                      dangerouslySetInnerHTML={{
                        __html:
                          getOrderSummaryDetail?.data?.productDescription
                            ?.length > 100
                            ? getOrderSummaryDetail?.data?.productDescription?.slice(
                                0,
                                100
                              ) + "..."
                            : getOrderSummaryDetail?.data?.productDescription,
                      }}
                    ></p>
                    <h3>₹{getOrderSummaryDetail?.data?.price}</h3>
                  </figcaption>
                </article>
              </div>
              <div className="CustomProduct">
                <h4>Customizations Product</h4>
                {customization?.length > 0
                  ? customization?.map((item, i) => {
                      return (
                        <article key={i}>
                          <figure>
                            <img src={item?.customimages} />
                          </figure>
                          <figcaption>
                            <h2>{item?.name}</h2>
                            <h3>
                              ₹{item?.price} x {item?.quantity}
                            </h3>
                          </figcaption>
                          <a
                            className="TrashIcon"
                            onClick={() => handleCustomTrash(item)}
                          >
                            <img
                              src={require("../../assets/images/trash.png")}
                            />
                          </a>
                        </article>
                      );
                    })
                  : "No Customization Added"}
              </div>
            </div>
            <div className="col-lg-4 col-md-5">
              <div className="ProductSummary">
                <h3>Product Summary</h3>
                <table>
                  <tbody>
                    <tr>
                      <td>{getOrderSummaryDetail?.data?.productName}</td>
                      <td>₹{getOrderSummaryDetail?.data?.price}</td>
                    </tr>
                  </tbody>
                </table>
                <h3>Customizations Product</h3>
                <table>
                  <tbody>
                    {getOrderSummaryDetail?.data?.productcustomizeDetails
                      ?.length > 0
                      ? getOrderSummaryDetail?.data?.productcustomizeDetails?.map(
                          (item, i) => {
                            return (
                              <tr
                                key={i}
                                className={
                                  i ==
                                  getOrderSummaryDetail?.data
                                    ?.productcustomizeDetails?.length -
                                    1
                                    ? "CustomBottom"
                                    : ""
                                }
                              >
                                <td>{item?.name}</td>
                                <td>
                                  ₹{item?.price} x {item?.quantity}
                                </td>
                              </tr>
                            );
                          }
                        )
                      : ""}

                    <tr className="CustomTr">
                      <td>Total Price</td>
                      <td>₹{getOrderSummaryDetail?.data?.totalAmount}</td>
                    </tr>
                    <tr className="CustomTr">
                      <td>Tax &amp; Fee</td>
                      <td>₹0</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total Price</td>
                      <td>₹{getOrderSummaryDetail?.data?.totalAmount}</td>
                    </tr>
                  </tfoot>
                </table>
                <RazorpayPayment
                  orderDetails={orderDetails}
                  getOrderSummaryDetail={getOrderSummaryDetail}
                  iState={iState}
                  selectedValue={selectedValue}
                />
              </div>
              <div className="CommonGreyBox">
                <ul>
                  <li>
                    <img src={require("../../assets/images/method-1.png")} />
                  </li>
                  <li>
                    <img src={require("../../assets/images/method-2.png")} />
                  </li>
                  <li>
                    <img src={require("../../assets/images/method-3.png")} />
                  </li>
                  <li>
                    <img src={require("../../assets/images/method-4.png")} />
                  </li>
                  <li>
                    <img src={require("../../assets/images/method-5.png")} />
                  </li>
                </ul>
                <h3>Guaranteed Safe Checkout</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* edit Date and Slots */}
      <Modal
        centered
        className="ModalBox"
        show={editModal}
        onHide={() => updateState({ ...iState, editModal: false })}
      >
        {/* <a
          onClick={() =>updateState({...iState,editModal:false})}
          className="CloseModal"
        >
          ×
        </a> */}
        <div className="ModalArea">
          <h3>Edit Date and Slot</h3>
          <div className="FormArea">
            <form>
              <div className="form-group">
                <h6>Select Date</h6>
                <input
                  type="date"
                  className="form-control"
                  name="dateAdded"
                  value={dateAdded}
                  min={minDate}
                  onChange={(e) => {
                    updateState({ ...iState, dateAdded: e.target.value });
                    dispatch(
                      slotListApi({
                        date: e.target.value,
                        productId: getOrderSummaryDetail?.data?.productId,
                      })
                    );
                  }}
                />
              </div>
              <div className="form-group">
                <select
                  className="form-control"
                  name="slot"
                  onClick={(e) =>
                    updateState({ ...iState, slot: e.target.value })
                  }
                >
                  <option value="" selected={slot == ""}>
                    Select Slots
                  </option>
                  {slotList?.length > 0
                    ? slotList?.map((item, i) => {
                        return (
                          <option
                            selected={
                              slot ==
                              `${convertTimeFormat(
                                item?.startTime,
                                item?.endTime
                              )}`
                            }
                            key={i}
                            value={`${convertTimeFormat(
                              item?.startTime,
                              item?.endTime
                            )}`}
                          >{`${convertTimeFormat(
                            item?.startTime,
                            item?.endTime
                          )}`}</option>
                        );
                      })
                    : ""}
                </select>
              </div>
            </form>
            <button className="Button" onClick={handleDateTimeSlot}>
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* delete product */}
      <Modal
        centered
        className="ModalBox"
        show={deleteModal}
        onHide={() => updateState({ ...iState, deleteModal: false })}
      >
        {/* <a
          onClick={() =>updateState({...iState,deleteModal:false})}
          className="CloseModal"
        >
          ×
        </a> */}
        <div className="ModalArea">
          <h3>Are you sure you want to delete this Product?</h3>
          <div className="FormArea" style={{ display: "flex" }}>
            <button
              className="Button me-5"
              onClick={() => updateState({ ...iState, deleteModal: false })}
            >
              No
            </button>
            <button className="Button ms-5" onClick={handleDeleteProdcut}>
              Yes
            </button>
          </div>
        </div>
      </Modal>

      {/* address list */}
      <Modal
        centered
        className="ModalBox"
        show={addressListModal}
        onHide={() => updateState({ ...iState, addressListModal: false })}
      >
        <a
          onClick={() => updateState({ ...iState, addressListModal: false })}
          className="CloseModal"
        >
          ×
        </a>
        <div className="ModalArea">
          <h3 style={{ textAlign: "center" }}>Address List</h3>
          {getAddressList?.data?.Addresses?.length > 0 ? (
            getAddressList?.data?.Addresses?.map((item, i) => {
              return (
                <div className="FormArea" style={{ display: "flex" }}>
                  <div className="form-group mb-2" key={i}>
                    <label className="Radio">
                      <div className="AddressBox">
                        <p className="greenLabel">
                          {item?.addresstype == "home" ? "Home" : "Office"}
                        </p>
                        <h6>
                          {`${item?.houseNo},${item?.street},
                              ${item?.landmark},${item?.pincode},
                              ${item?.city},${item?.state}`}
                        </h6>
                      </div>
                      <input
                        type="radio"
                        name="addressList"
                        value={JSON.stringify(item)}
                        checked={item?._id == addressList?._id}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center" }}>No Address Found.</p>
          )}
        </div>
      </Modal>

      <AddAddress
        naviState={iState}
        navupdateState={updateState}
        userDetail={userDetail}
      />
      <Tooltip id="my-tooltip1" place="bottom" />
    </>
  );
};

export default Checkout1;
