import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import {
  loginApiSlice,
  otpVerificationApiSlice
} from "../../reduxToolkit/Slices/Auth/auth";
import { userDetailState } from "../../reduxToolkit/Slices/ProductList/listApis";
import CreateAccount from "./CreateAccount";
import "../../assets/css/LoginModal.css";
import {
  handleGoogleLogin,
  handleFacebookLogin,
  handleSocialLoginSuccess,
  handleSocialLoginError
} from "../../Utils/SocialAuthUtil";

const LoginModal = ({
  show,
  onHide,
  onLoginSuccess,
  bookingDetails,
  selectedProduct,
  onEditDate,
  onEditTime,
  onEditCustomizations
}) => {
  // State management
  const [loginMethod, setLoginMethod] = useState("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpValues, setOtpValues] = useState(Array(4).fill(""));
  const [showOtp, setShowOtp] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpTimer, setOtpTimer] = useState(0);
  const [createAccountModal, setCreateAccountModal] = useState(false);
  const [userDetail, setUserDetail] = useState(null);

  // Redux
  const dispatch = useDispatch();
  const { getUserDetailState } = useSelector((state) => state.productList);

  // Cookies
  const [cookies, setCookie] = useCookies(["LennyPhone_number", "LennyCheck"]);

  // OTP Timer Effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Handle Mobile Login
  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length !== 10) {
      setErrors({ mobile: "Please enter a valid 10-digit mobile number" });
      return;
    }

    setErrors({});

    dispatch(loginApiSlice({ phone: mobileNumber }))
      .then((res) => {
        console.log('Login API response:', res);
        if (res?.payload?.status === 200) {
          setShowOtp(true);
          setOtpTimer(60); // Start 60 second timer
          toast.success(`OTP sent to +91 ${mobileNumber}`);
        } else {
          toast.error("Failed to send OTP. Please try again.");
        }
      })
      .catch((err) => {
        console.error('Login API error:', err);
        toast.error("Something went wrong. Please try again.");
      });
  };

  // Handle OTP input change
  const handleOtpInputChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }

      // Auto-submit when all 4 digits are filled
      if (newOtpValues.every(val => val.length === 1)) {
        const fullOtp = newOtpValues.join("");
        handleOtpVerification(fullOtp);
      }
    }
  };

  // Handle OTP key down for backspace
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) {
        prevInput.focus();
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
      }
    }
  };

  // Handle OTP Verification
  const handleOtpVerification = (otpToVerify = null) => {
    const otpString = otpToVerify || otpValues.join("");

    if (!otpString || otpString.length !== 4) {
      setErrors({ otp: "Please enter a valid 4-digit OTP" });
      return;
    }

    setErrors({});

    dispatch(otpVerificationApiSlice({
      phone: mobileNumber,
      otp: Number(otpString)
    }))
      .then((res) => {
        console.log('OTP verification response:', res);

        if (res?.payload?.response?.data?.status === 400) {
          toast.error(res?.payload?.response?.data?.message);
          setErrors({ otp: "Invalid OTP. Please try again." });
        } else if (res?.payload?.data?.status === 200) {

          // Check if user needs to create account
          if (!res?.payload?.data?.message?.endsWith("Login successful.")) {
            // New user - show create account modal
            setUserDetail(res?.payload?.data);
            setCreateAccountModal(true);
            resetLoginState();
          } else {
            // Existing user - complete login
            const userData = res?.payload?.data?.data;
            window.localStorage.setItem("LennyUserDetail", JSON.stringify(userData));
            window.localStorage.setItem("LoginTimer", "false");

            // Set cookies
            setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
            setCookie("LennyPhone_number", mobileNumber, { path: "/" }, { expires: new Date("9999-12-31") });

            dispatch(userDetailState(true));

            toast.success("Login successful!");
            onLoginSuccess({
              mobileNumber,
              method: "mobile",
              userData: userData
            });
            resetLoginState();
          }
        }
      })
      .catch((err) => {
        console.error('OTP verification error:', err);
        toast.error("Verification failed. Please try again.");
        setErrors({ otp: "Verification failed. Please try again." });
      });
  };

  // Handle OTP Manual Submit
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    handleOtpVerification();
  };

  // Handle Resend OTP
  const handleResendOtp = () => {
    if (otpTimer > 0) return;

    dispatch(loginApiSlice({ phone: mobileNumber }))
      .then((res) => {
        if (res?.payload?.status === 200) {
          setOtpTimer(60);
          setOtpValues(Array(4).fill(""));
          toast.success("OTP resent successfully!");
        }
      })
      .catch((err) => {
        console.error('Resend OTP error:', err);
        toast.error("Failed to resend OTP. Please try again.");
      });
  };

  // Handle Email Login
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrors({ email: "Please enter both email and password" });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setErrors({});

    // Simulate email login - you'll need to implement the actual API call
    toast.success("Email login functionality to be implemented");
    onLoginSuccess({ email, method: "email" });
    resetLoginState();
  };

  // Handle Social Login
const handleSocialLogin = (method) => {
  console.log('Social login:', method);

  if (method === "google") {
    handleGoogleLogin()
      .then((result) => {
        handleSocialLoginSuccess(result, setCookie, dispatch, onLoginSuccess);
      })
      .catch((error) => {
        handleSocialLoginError(error, 'Google');
      });
  } else if (method === "facebook") {
    handleFacebookLogin()
      .then((result) => {
        handleSocialLoginSuccess(result, setCookie, dispatch, onLoginSuccess);
      })
      .catch((error) => {
        handleSocialLoginError(error, 'Facebook');
      });
  } else if (method === "email") {
    setLoginMethod("email");
    setShowEmailForm(true);
  }
};

  // Reset login state
  const resetLoginState = () => {
    setMobileNumber("");
    setEmail("");
    setPassword("");
    setOtp("");
    setOtpValues(Array(4).fill(""));
    setShowOtp(false);
    setShowEmailForm(false);
    setErrors({});
    setOtpTimer(0);
    setLoginMethod("mobile");
  };

  // Handle create account completion
  const handleCreateAccountComplete = () => {
    setCreateAccountModal(false);
    onLoginSuccess({
      mobileNumber,
      method: "mobile",
      isNewUser: true
    });
    resetLoginState();
  };

  // Utility functions
  const formatDate = (date) => {
    if (!date) return "No date selected";
    if (typeof date === 'string') return date;
    if (date instanceof Date) {
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('en-US', options);
    }
    return "Invalid date";
  };

  const formatTime = (timeSlot) => {
    return timeSlot?.time || "No time selected";
  };

  const calculateTotal = () => {
    const basePrice = selectedProduct?.priceDetails?.discountedPrice ||
      selectedProduct?.priceDetails?.price ||
      0;
    const customizationsTotal = bookingDetails?.selectedCustomizations?.reduce((sum, item) => sum + item.price, 0) || 0;
    return basePrice + customizationsTotal;
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Modal className="ModalBox LoginModal" show={show} onHide={onHide} centered size="xl">
        <div className="ModalArea">
          <a className="CloseModal" onClick={onHide}>×</a>

          <div className="ModalContent">
            <div className="LoginSection">
              <h3>Please Login to Continue Booking</h3>

              <div className="LoginMethods">
                {/* Mobile Login */}
                {loginMethod === "mobile" && (
                  <div className="MobileLogin">
                    <h4>Mobile Login</h4>
                    {!showOtp ? (
                      <form onSubmit={handleMobileSubmit}>
                        <div className="FormGroup">
                          <input
                            type="tel"
                            className="FormInput"
                            placeholder="Enter 10 digit Mobile Number Eg: 8010679679"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                            maxLength={10}
                          />
                          {errors.mobile && <span className="ErrorText">{errors.mobile}</span>}
                        </div>
                        <button type="submit" className="LoginBtn">
                          LOG IN VIA OTP
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleOtpSubmit}>
                        <div className="FormGroup">
                          <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>
                            OTP sent to +91 {mobileNumber}
                            <button
                              type="button"
                              className="EditPhoneBtn"
                              onClick={() => {
                                setShowOtp(false);
                                setOtpValues(Array(4).fill(""));
                                setOtpTimer(0);
                              }}
                            >
                              Edit
                            </button>
                          </p>

                          <div className="OTPInputContainer">
                            {otpValues.map((value, index) => (
                              <input
                                key={index}
                                type="tel"
                                name={`otp-${index}`}
                                className="OTPInput"
                                maxLength="1"
                                value={value}
                                onChange={(e) => handleOtpInputChange(e, index)}
                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                pattern="[0-9]*"
                                inputMode="numeric"
                              />
                            ))}
                          </div>

                          {errors.otp && <span className="ErrorText">{errors.otp}</span>}

                          <div className="OTPActions">
                            {otpTimer > 0 ? (
                              <span className="TimerText">
                                Resend OTP in {formatTimer(otpTimer)}
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="ResendBtn"
                                onClick={handleResendOtp}
                              >
                                Resend OTP
                              </button>
                            )}
                          </div>
                        </div>

                        <button type="submit" className="LoginBtn">
                          VERIFY OTP & CONTINUE
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Email Login */}
                {loginMethod === "email" && (
                  <div className="EmailLogin">
                    <h4>Email Login</h4>
                    <form onSubmit={handleEmailSubmit}>
                      <div className="FormGroup">
                        <input
                          type="email"
                          className="FormInput"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="FormGroup">
                        <input
                          type="password"
                          className="FormInput"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.email && <span className="ErrorText">{errors.email}</span>}
                      </div>
                      <button type="submit" className="LoginBtn">
                        LOGIN WITH EMAIL
                      </button>
                    </form>

                    <div className="ForgotPassword">
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                )}

                <div className="Divider">
                  <span>or continue with</span>
                </div>

                {/* Social Login */}
                <div className="SocialLogin">
                  <button
                    className="SocialBtn GoogleBtn"
                    onClick={() => handleSocialLogin("google")}
                  >
                    <i className="fab fa-google"></i>
                    Google
                  </button>

                  <button
                    className="SocialBtn FacebookBtn"
                    onClick={() => handleSocialLogin("facebook")}
                  >
                    <i className="fab fa-facebook-f"></i>
                    Facebook
                  </button>


                  <button
                    className="SocialBtn EmailBtn"
                    onClick={() => handleSocialLogin("email")}
                  >
                    <i className="fab fa-envelope"></i>
                    Email
                  </button>
                </div>

                <div className="TermsText">
                  By logging in you are agreeing to our{" "}
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms and Conditions</a>{" "}
                  and our{" "}
                  <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="OrderSummary">
              <h4>Order Summary</h4>
              <div className="SummaryContent">
                <div className="LoginPrompt">
                  Please complete Login for Payment, Coupon and Edit booking options
                </div>

                <div className="BookingDetails">
                  <div className="BookingInfo">
                    <div className="InfoRow">
                      <i className="fa-solid fa-calendar"></i>
                      <span>{formatDate(bookingDetails?.selectedDate)}</span>
                      <button className="EditBtn" onClick={onEditDate}>
                        <i className="fa-solid fa-edit"></i>
                        Edit
                      </button>
                    </div>
                    <div className="InfoRow">
                      <i className="fa-solid fa-clock"></i>
                      <span>{formatTime(bookingDetails?.selectedTimeSlot)}</span>
                      <button className="EditBtn" onClick={onEditTime}>
                        <i className="fa-solid fa-edit"></i>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

                <div className="ProductInfo">
                  <div className="ProductImage">
                    <img
                      src={selectedProduct?.productimages?.[0] || require("../../assets/images/custom-1.png")}
                      alt="Product"
                    />
                  </div>
                  <div className="ProductDetails">
                    <h5>{selectedProduct?.productDetails?.productname || "Product Name"}</h5>
                    <div className="ProductPrice">
                      ₹ {selectedProduct?.priceDetails?.discountedPrice ||
                        selectedProduct?.priceDetails?.price ||
                        0}
                    </div>
                  </div>
                </div>

                <div className="CustomizationsInfo">
                  <h6>
                    Customisations
                    <i className="fa-solid fa-edit" onClick={onEditCustomizations}></i>
                  </h6>
                  {bookingDetails?.selectedCustomizations?.length > 0 ? (
                    <div className="CustomizationsList">
                      {bookingDetails.selectedCustomizations.map((item, index) => (
                        <div key={index} className="CustomizationItem">
                          <span>{item.name}</span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="NoCustomizations">No customization added</p>
                  )}
                </div>

                <div className="LocationInfo">
                  <div className="LocationRow">
                    <span>City</span>
                    <span>Delhi NCR</span>
                  </div>
                </div>

                <div className="SummaryTotal">
                  <div className="TotalRow">
                    <span>Total</span>
                    <span>₹ {calculateTotal()}</span>
                  </div>
                </div>

                <div className="SecurePayments">
                  <h6>100% Secure Payments</h6>
                  <div className="PaymentIcons">
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                    <i className="fab fa-cc-amex"></i>
                    <i className="fab fa-cc-paypal"></i>
                    <i className="fab fa-google-pay"></i>
                    <i className="fab fa-cc-paypal"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ModalFooter">
            <div className="WhatsAppHelp">
              <div className="HelpIcon">
                <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" alt="help" />
              </div>
              <span>
                Unable to login or facing payment issues? {" "}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Click to connect on WhatsApp
                </a>
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Create Account Modal */}
      <CreateAccount
        createAccountModal={createAccountModal}
        setCreateAccountModal={setCreateAccountModal}
        userDetail={userDetail}
        onComplete={handleCreateAccountComplete}
      />
    </>
  );
};

export default LoginModal;