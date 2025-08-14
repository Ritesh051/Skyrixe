import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { onImageHandler } from "../../Utils/uploadFile.js";
import S3FileUpload from "react-s3/lib/ReactS3";
import { useDispatch } from "react-redux";
import { personalInfoApiSlice } from "../../reduxToolkit/Slices/Auth/auth.js";
import AddAddress from "./AddAddress.js";

const initialState = {
  name: "",
  gender: "",
  dob: "",
  email: "",
  photo: "",
  img: "",
  addressModal: false,
  additional_phone: "",
  phone_valid: true,
  errors: {},
  registerDetails:"",
};

const CreateAccount = ({
  setCreateAccountModal,
  createAccountModal,
  userDetail,
}) => {
  const [iState, updateState] = useState(initialState);
  const {
    name,
    gender,
    dob,
    email,
    photo,
    img,
    additional_phone,
    phone_valid,
    errors,
    registerDetails,
  } = iState;
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name == "additional_phone") {
      let modifiedValue = value >= 0 ? value : additional_phone + "";
      updateState({ ...iState, additional_phone: modifiedValue, errors: "" });
    } else {
      updateState({ ...iState, [name]: value, errors: "" });
    }
  };

  const handleImage = async (e) => {
    let data = await onImageHandler(e);
    console.log(data, "here data");
    console.log(data[0], "here data1");

    updateState({
      ...iState,
      photo: data[0],
      img: data[1]?.location,
      errors: "",
    });
  };

  const handleValidation = () => {
    let error = {};
    let formIsValid = true;

    // if (!img) {
    //   error.imgError = "*Image is required";
    //   formIsValid = false;
    // }

    if (!name?.trim()) {
      error.nameError = "*Name is required";
      formIsValid = false;
    }

    if (!gender?.trim()) {
      error.genderError = "*Gender is required";
      formIsValid = false;
    }

    if (!dob?.trim()) {
      error.dobError = "*Date of birth is required";
      formIsValid = false;
    }
    if (email?.trim()) {
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
  const handleNext = () => {
    let formIsValid = handleValidation();
    if (formIsValid) {
      const payload = {
        userId: `${userDetail?.userId}/customerdata`,
        data: {
          name,
          gender,
          email,
          dob,
          photo,
          alternatePhone: additional_phone,
        },
      };
      dispatch(personalInfoApiSlice(payload))
        .then((res) => {
          console.log({ res });
          if (res?.payload?.status == 200) {
            setCreateAccountModal(false);
            window.localStorage.setItem("LoginTimer",false);
            updateState({ ...initialState, addressModal: true,registerDetails:res?.payload?.data?.data });
          }
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  };

  useEffect(() => {
    updateState({
      ...iState,
      name: userDetail?.data?.personalInfo?.name,
      gender: userDetail?.data?.personalInfo?.gender,
      email: userDetail?.data?.personalInfo?.email,
      photo: userDetail?.data?.personalInfo?.photo,
      dob: userDetail?.data?.personalInfo?.dob?.split("T")?.at(0),
    });
  }, [userDetail]);

  const handleKeyDown = (e) => {
    const { name } = e.target;
    if (e.key == "Backspace" && name == "additional_phone") {
      updateState({ ...iState, phone_valid: true });
    }
  };

  useEffect(() => {
    let newState = { ...iState };
    if (additional_phone?.length >= 10) {
      newState = { ...newState, phone_valid: false };
    }
    updateState(newState);
  }, [additional_phone]);

  return (
    <>
      <Modal className="ModalBox" show={createAccountModal}>
        <a
          onClick={() => {
            setCreateAccountModal(false);
            window.localStorage.setItem("LoginTimer",true);
          }}
          className="CloseModal"
        >
          ×
        </a>
        <div className="ModalArea">
          <h3>Create Account</h3>
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
                <input type="file" onChange={handleImage} />
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
                  Email Address <small>(Optional)</small>
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
            <button className="Button" onClick={handleNext}>
              Next
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

export default CreateAccount;
