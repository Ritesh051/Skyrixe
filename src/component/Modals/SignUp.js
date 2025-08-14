import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { loginApiSlice } from "../../reduxToolkit/Slices/Auth/auth";
import OtpVerification from "./OtpVerification";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signUpState } from "../../reduxToolkit/Slices/ProductList/listApis";

const SignUp = ({ iState, updateState }) => {
  const { signUpModal } = iState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getSignUpState } = useSelector((state) => state.productList);
  const [cookies, setCookie] = useCookies(["LennyPhone_number", "LennyCheck"]);

  const signState = {
    phone: cookies?.LennyPhone_number ? cookies?.LennyPhone_number : "",
    check: cookies?.LennyCheck,
    phone_valid: true,
    disable: false,
    otpModal: false,
    errors: {},
    otp: "",
    init: "temp",
  };

  const [states, updateSignState] = useState(signState);
  const { phone, check, phone_valid, disable, errors } = states;

  const handleClose = () => {
    updateState({ ...iState, signUpModal: false });
    window.localStorage.setItem("LoginTimer", true);
    dispatch(signUpState(false));
    updateSignState(signState);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;

    if (name == "phone") {
      let modifiedValue = value >= 0 ? value : phone + "";
      updateSignState({ ...states, phone: modifiedValue, errors: "" });
    } else {
      if (checked) {
        updateSignState({ ...states, [name]: true });
        // setCookie('LennyCheck', true, { path: '/landing' }, { expires: new Date('9999-12-31') })
      } else {
        updateSignState({ ...states, [name]: false });
        // setCookie('LennyCheck', false, { path: '/landing' }, { expires: new Date('9999-12-31') })
      }
    }
  };

  const handleValidation = () => {
    let error = {};
    let formIsValid = true;
    if (!phone) {
      error.phoneError = "*Phone Number is required";
      formIsValid = false;
    }
    if (phone && !phone?.toString()?.trim()) {
      error.phoneError = "*Phone Number is required";
      formIsValid = false;
    }

    if (phone && phone?.toString()?.trim()?.length != 10) {
      error.phoneError = "*Phone Number must be 10 digits";
      formIsValid = false;
    }
    updateSignState({ ...states, errors: error });
    return formIsValid;
  };

  const handleSignIn = () => {
    let formIsValid = handleValidation();
    if (formIsValid) {
      dispatch(loginApiSlice({ phone }))
        .then((res) => {
          console.log({ res });
          if (res?.payload?.status == 200) {
            updateSignState({
              ...states,
              otp: res?.payload?.data?.otp,
              otpModal: true,
              init: 59,
            });
            window.localStorage.setItem("LoginTimer", false);
            updateState({ ...iState, signUpModal: false });
            toast.success(`${res?.payload?.data?.message}`);
          }
        })
        .catch((err) => {
          console.log({ err });
        });
    }
  };

  useEffect(() => {
    let newState = { ...states };
    if (phone?.length >= 10) {
      newState = { ...newState, phone_valid: false };
    }
    updateSignState(newState);
  }, [phone]);

  const handleKeyDown = (e) => {
    const { name } = e.target;
    if (e.key == "Backspace" && name == "phone") {
      updateSignState({ ...states, phone_valid: true });
    }
  };

  console.log({ phone });

  useEffect(() => {
    if (getSignUpState) {
      updateState({ ...iState, signUpModal: true });
    }
  }, [getSignUpState]);

  return (
    <>
      <Modal className="ModalBox" show={signUpModal} onHide={handleClose}>
        <a onClick={handleClose} className="CloseModal">
          ×
        </a>
        <div className="ModalArea">
          <h3>Sign In/Sign Up</h3>
          <div className="FormArea">
            <form>
              <div className="form-group">
                <h6>Phone Number</h6>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter your Number"
                  name="phone"
                  value={phone}
                  onChange={phone_valid ? handleInputChange : null}
                  onKeyDown={handleKeyDown}
                  pattern="[0-9]*" // Ensures numeric input
                  inputMode="numeric"
                />
                <span className="error">{errors?.phoneError}</span>
              </div>
              <div className="form-group">
                <label className="CheckBox">
                  {" "}
                  Remember Me
                  <input
                    type="checkbox"
                    name="check"
                    checked={check}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark" />
                </label>
              </div>
              <p>
                By creating your account you agree to our{" "}
                <span
                  onClick={() => {
                    navigate("/terms-conditions");
                    updateState({ ...iState, signUpModal: false });
                  }}
                  className="termHover"
                >
                  Terms &amp; conditions
                </span>
              </p>
            </form>
            <button
              className="Button"
              disabled={disable}
              onClick={handleSignIn}
              type="submit"
            >
              Sign In
            </button>
          </div>
        </div>
      </Modal>
      <OtpVerification
        states={states}
        updateSignState={updateSignState}
        editModal={iState}
        editUpdate={updateState}
        cookies={cookies}
        setCookie={setCookie}
      />
    </>
  );
};

export default SignUp;
