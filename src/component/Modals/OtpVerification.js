import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  loginApiSlice,
  otpVerificationApiSlice,
} from "../../reduxToolkit/Slices/Auth/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import CreateAccount from "./CreateAccount";
import { userDetailState } from "../../reduxToolkit/Slices/ProductList/listApis";

const initialState = {
  userDetail: "",
};

const OtpVerification = ({
  states,
  updateSignState,
  editModal,
  editUpdate,
  cookies,
  setCookie,
}) => {
  const [iState, updateState] = useState(initialState);
  const { userDetail } = iState;
  const { signUpModal } = editModal;
  const { otpModal, phone, otp, init, check } = states;
  const [createAccountModal, setCreateAccountModal] = useState(false);
  const { getUserDetailState } = useSelector((state) => state.productList);

  // const init = 10;
  const [showresend, setshow] = useState(false);
  let [seconds, setSeconds] = useState(init);
  const [str, setStr] = useState("");
  const dispatch = useDispatch();

  const inputRefs = useRef(Array.from({ length: 4 }, () => React.createRef()));
  const [otpValues, setOtpValues] = useState(Array(4).fill(""));
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log({ inputRefs, otpValues });

  useEffect(() => {
    setSeconds(init);
    if (otp) {
      setOtpValues(otp?.toString()?.split(""));
    }
  }, [states]);
  console.log(otp?.toString()?.at(0), "here");

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    const modifiedValue = value >= 0 ? value : "";
    const newOtpValues = [...otpValues];
    newOtpValues[index] = modifiedValue;
    setOtpValues(newOtpValues);

    // Move focus to the next input field if not the last one
    if (index < inputRefs.current.length - 1 && modifiedValue !== "") {
      setCurrentIndex(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    // Reverse focus to the previous input field on backspace
    if (e.key === "Backspace" && index > 0) {
      console.log({ index });
      const newOtpValues = [...otpValues];
      newOtpValues[index] = "";
      setOtpValues(newOtpValues);
      setTimeout(() => {
        if (index > 0) {
          setCurrentIndex(index - 1);
        }
      }, 0);
    }
  };
  console.log({ otpValues });

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds >= 0) {
        setSeconds((pre) => pre - 1);
      }
    }, 1000);

    let sec;
    sec = "0" + seconds;
    setStr(sec.slice(-2));
    if (seconds < 0) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let str = otpValues.join("");
    // if (otp == str) {
    dispatch(otpVerificationApiSlice({ phone, otp: Number(str) }))
      .then((res) => {
        console.log({ res }, "res yaha");
        if (res?.payload?.response?.data?.status == 400) {
          toast.error(res?.payload?.response?.data?.message);
        } else if (res?.payload?.data?.status == 200) {
          updateSignState({ ...states, otpModal: false });
          if (!res?.payload?.data?.message?.endsWith("Login successful.")) {
            setCreateAccountModal(true);
            window.localStorage.setItem("LoginTimer", false);
          } else {
            window.localStorage?.setItem(
              "LennyUserDetail",
              JSON?.stringify(res?.payload?.data?.data)
            );
            window.localStorage.setItem("LoginTimer", false);
            dispatch(userDetailState(true));
            setCookie(
              "LennyCheck",
              check,
              { path: "/" },
              { expires: new Date("9999-12-31") }
            );
            setCookie(
              "LennyPhone_number",
              phone,
              { path: "/" },
              { expires: new Date("9999-12-31") }
            );
          }
          updateState({ ...iState, userDetail: res?.payload?.data });
        }
      })
      .catch((err) => {
        console.log({ err });
      });
    // } else {
    //   toast.error("Invalid OTP");
    // }
  };

  const handleResend = () => {
    setOtpValues(Array(4).fill(""));
    inputRefs.current[0]?.current?.focus();
    dispatch(loginApiSlice({ phone }))
      .then((res) => {
        console.log({ res });
        if (res?.payload?.status == 200) {
          updateSignState({
            ...states,
            otp: res?.payload?.data?.otp,
            init: 59,
          });
          toast.success(`${res?.payload?.data?.message}`);
        }
      })
      .catch((err) => {
        console.log({ err });
      });
    setshow(false);
    setSeconds(0);
  };

  useEffect(() => {
    inputRefs.current[currentIndex]?.current?.focus();
    // setOtpValues(Array(4).fill(""));
  }, [currentIndex]);

  console.log({ states, str, seconds, showresend });
  console.log({ currentIndex });
  return (
    <>
      <Modal
        className="ModalBox"
        show={otpModal}
        // onHide={() => updateSignState({ ...states, otpModal: false })}
      >
        <a
          className="CloseModal"
          onClick={() => {
            updateSignState({ ...states, otpModal: false });
            window.localStorage.setItem("LoginTimer", true);
          }}
        >
          ×
        </a>
        <div className="ModalArea">
          <h3>Sign In/Sign Up</h3>
          <div className="FormArea">
            <form>
              <h5>OTP Verification</h5>
              <h6 className="Heading">
                Please enter the code sent to you on <br />
                <span className="Grey">
                  +91-{phone}{" "}
                  <a
                    className="Black"
                    onClick={() => {
                      updateSignState({ ...states, otpModal: false });
                      editUpdate({ ...editModal, signUpModal: true });
                    }}
                  >
                    Edit
                  </a>
                </span>
              </h6>
              <div className="form-group">
                <div className="OTPBox">
                  {otpValues?.map((value, index) => (
                    <input
                      type="tel"
                      className="form-control"
                      key={index}
                      ref={inputRefs.current[index]}
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleInputChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      pattern="[0-9]*" // Ensures numeric input
                      inputMode="numeric"
                    />
                  ))}
                </div>
              </div>
            </form>
            <button
              className="Button"
              type="submit"
              onClick={handleSubmit}
              // data-bs-target="#CreateAccountModal"
              // data-bs-dismiss="modal"
            >
              Verify OTP
            </button>
            {showresend == false ? (
              <p className="Resend">
                {seconds >= 0
                  ? `00:${str}s`
                  : seconds !== "temp"
                  ? setshow(true)
                  : ""}
              </p>
            ) : (
              <p className="Resend">
                <span onClick={handleResend} style={{ cursor: "pointer" }}>
                  Resend OTP
                </span>
              </p>
            )}
          </div>
        </div>
      </Modal>
      <CreateAccount
        setCreateAccountModal={setCreateAccountModal}
        createAccountModal={createAccountModal}
        userDetail={userDetail}
      />
    </>
  );
};

export default OtpVerification;
