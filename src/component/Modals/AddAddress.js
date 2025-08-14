import React, { useEffect, useState } from "react";
import { Modal, ToastHeader } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  addressListing,
  personalAddrApiSlice,
  personalInfoApiSlice,
  personalInfoEditApi,
} from "../../reduxToolkit/Slices/Auth/auth";
import SuccessFull from "./SuccessFull";
import { toast } from "react-toastify";

const initialState = {
  addressType: "",
  houseNo: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  congratsModal: false,
  errors: {},
  allDetails:"",
};

const AddAddress = ({ naviState, navupdateState, userDetail }) => {
  const [iState, updateState] = useState(initialState);
  const {
    addressType,
    houseNo,
    street,
    landmark,
    city,
    state,
    pincode,
    errors,
    allDetails
  } = iState;
  const { addressModal, editMode, addressDetail,registerDetails } = naviState;
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateState({ ...iState, [name]: value, errors: "" });
  };

  console.log({ userDetail }, editMode);
  const handleValidation = () => {
    let error = {};
    let formIsValid = true;

    if (!addressType?.trim()) {
      error.addressTypeError = "*Address Type is required";
      formIsValid = false;
    }

    if (!houseNo?.trim()) {
      error.houseNoError = "*House Number is required";
      formIsValid = false;
    }

    if (!street?.trim()) {
      error.streetError = "*Street Name is required";
      formIsValid = false;
    }

    if (!landmark?.trim()) {
      error.landmarkError = "*Landmark is required";
      formIsValid = false;
    }

    if (!pincode?.trim()) {
      error.pincodeError = "*Pincode is required";
      formIsValid = false;
    }
    if (!city?.trim()) {
      error.cityError = "*City is required";
      formIsValid = false;
    }
    if (!state?.trim()) {
      error.stateError = "*State is required";
      formIsValid = false;
    }

    updateState({ ...iState, errors: error });
    return formIsValid;
  };

  const handleSave = () => {
    let formIsValid = handleValidation();
    if (formIsValid) {
    const payload = {
      userId: userDetail?._id,
      addressId: addressDetail?._id,
      data: {
        address: {
          houseNo,
          landmark,
          street,
          city,
          state,
          pincode,
          addresstype: addressType,
        },
      },
    };
    dispatch(personalInfoEditApi(payload)).then((res) => {
      toast?.success(res?.payload?.data?.message);
      navupdateState({ ...naviState, addressModal: false });
      dispatch(addressListing({ userId: userDetail?._id }));
    });
    }
  };

  const handleAccount = () => {
    let formIsValid = handleValidation();
    if (formIsValid) {
      const payload = {
        userId: editMode === false ? userDetail?._id : userDetail?.userId,
        data: {
          address: {
            houseNo,
            landmark,
            street,
            city,
            state,
            pincode,
            addresstype: addressType,
          },
        },
      };
      dispatch(personalAddrApiSlice(payload))
        .then((res) => {
          console.log({ res });
          if (res?.payload?.status == 200) {
            toast?.success(res?.payload?.data?.message);
            navupdateState({ ...naviState, addressModal: false });
            if (editMode === false) {
              dispatch(addressListing({ userId: userDetail?._id }));
              updateState(initialState);
            }
            if (editMode !== false) {
              window.localStorage.setItem("LoginTimer",false);
              updateState({ ...initialState, congratsModal: true,allDetails: res?.payload?.data?.data});
            }
          }
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  };

  useEffect(() => {
    if (editMode) {
      updateState({
        ...iState,
        addressType: addressDetail?.addresstype,
        houseNo: addressDetail?.houseNo,
        street: addressDetail?.street,
        landmark: addressDetail?.landmark,
        city: addressDetail?.city,
        state: addressDetail?.state,
        pincode: addressDetail?.pincode,
      });
    }
  }, [editMode]);

  console.log({ addressDetail });

  return (
    <>
      <Modal className="ModalBox" show={addressModal}>
        <a
          className="CloseModal"
          onClick={() => navupdateState({ ...naviState, addressModal: false })}
        >
          ×
        </a>
        <div className="ModalArea">
          <h3>{editMode ? "Edit" : "Add"} Address</h3>
          <div className="FormArea">
            <form>
              <div className="form-group">
                <h6>Enter Address Type</h6>
                <select
                  className="form-control"
                  name="addressType"
                  onChange={handleInputChange}
                >
                  <option value="" selected={addressType == ""}>
                    --Select--
                  </option>
                  <option value="home" selected={addressType == "home"}>
                    Home
                  </option>
                  <option value="office" selected={addressType == "office"}>
                    Office
                  </option>
                </select>
                <span className="error">{errors?.addressTypeError}</span>
              </div>
              <div className="form-group">
                <h6>Flat no/ House no/ Room no</h6>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Flat no/ House no/ Room no name"
                  name="houseNo"
                  value={houseNo}
                  onChange={handleInputChange}
                />
                <span className="error">{errors?.houseNoError}</span>
              </div>
              <div className="form-group">
                <h6>Street Name</h6>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Street Name"
                  name="street"
                  value={street}
                  onChange={handleInputChange}
                />
                <span className="error">{errors?.streetError}</span>
              </div>
              <div className="form-group">
                <h6>Landmark</h6>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Landmark"
                  name="landmark"
                  value={landmark}
                  onChange={handleInputChange}
                />
                <span className="error">{errors?.landmarkError}</span>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <h6>Pin Code</h6>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Pin Code"
                      name="pincode"
                      value={pincode}
                      onChange={handleInputChange}
                    />
                    <span className="error">{errors?.pincodeError}</span>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <h6>City</h6>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter City"
                      name="city"
                      value={city}
                      onChange={handleInputChange}
                    />
                    <span className="error">{errors?.cityError}</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <h6>State</h6>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter State"
                  name="state"
                  value={state}
                  onChange={handleInputChange}
                />
                <span className="error">{errors?.stateError}</span>
              </div>
            </form>
            {editMode ? (
              <button className="Button" onClick={handleSave}>
                Save
              </button>
            ) : (
              <>
                <button
                  className="Button"
                  onClick={handleAccount}
                  style={{ marginBottom: "10px" }}
                >
                  Add Address
                </button>

                {editMode !== false ? (
                  <button
                    className="Button"
                    onClick={() => {
                      navupdateState({ ...naviState, addressModal: false });
                      updateState({ ...initialState, congratsModal: true,allDetails: registerDetails});
                    }}
                  >
                    Skip
                  </button>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
      <SuccessFull iState={iState} updateState={updateState} />
    </>
  );
};

export default AddAddress;
