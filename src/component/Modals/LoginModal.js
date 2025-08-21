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
  handleGoogleLoginPopup,
  handleFacebookLogin,
  handleSocialLoginSuccess,
  handleSocialLoginError,
  validateSocialAuthEnvironment
} from "../../Utils/SocialAuthUtil.js";

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
  const [isLoading, setIsLoading] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const { getUserDetailState } = useSelector((state) => state.productList);

  // Cookies
  const [cookies, setCookie] = useCookies(["LennyPhone_number", "LennyCheck"]);

  // Initialize and check auth environment on mount
  useEffect(() => {
    validateSocialAuthEnvironment();
    
    // Pre-fill mobile number from cookies if available
    if (cookies.LennyPhone_number) {
      setMobileNumber(cookies.LennyPhone_number);
    }
  }, [cookies.LennyPhone_number]);

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

  // Reset login state when modal closes
  useEffect(() => {
    if (!show) {
      resetLoginState();
    }
  }, [show]);

  // Handle Mobile Login
  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!mobileNumber || mobileNumber.length !== 10) {
      setErrors({ mobile: "Please enter a valid 10-digit mobile number" });
      return;
    }

    // Check for valid Indian mobile number pattern
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(mobileNumber)) {
      setErrors({ mobile: "Please enter a valid Indian mobile number" });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await dispatch(loginApiSlice({ phone: mobileNumber }));
      console.log('Login API response:', response);
      
      if (response?.payload?.status === 200) {
        setShowOtp(true);
        setOtpTimer(60); // Start 60 second timer
        toast.success(`OTP sent to +91 ${mobileNumber}`);
      } else {
        const errorMessage = response?.payload?.message || "Failed to send OTP. Please try again.";
        toast.error(errorMessage);
        setErrors({ mobile: errorMessage });
      }
    } catch (err) {
      console.error('Login API error:', err);
      const errorMessage = err?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      setErrors({ mobile: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpInputChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow digits
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
        setTimeout(() => handleOtpVerification(fullOtp), 100); // Small delay for better UX
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
  const handleOtpVerification = async (otpToVerify = null) => {
    const otpString = otpToVerify || otpValues.join("");

    if (!otpString || otpString.length !== 4) {
      setErrors({ otp: "Please enter a valid 4-digit OTP" });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await dispatch(otpVerificationApiSlice({
        phone: mobileNumber,
        otp: Number(otpString)
      }));
      
      console.log('OTP verification response:', response);

      if (response?.payload?.response?.data?.status === 400) {
        const errorMessage = response?.payload?.response?.data?.message || "Invalid OTP. Please try again.";
        toast.error(errorMessage);
        setErrors({ otp: errorMessage });
        
        // Reset OTP inputs on error
        setOtpValues(Array(4).fill(""));
        const firstInput = document.querySelector(`input[name="otp-0"]`);
        if (firstInput) firstInput.focus();
        
      } else if (response?.payload?.data?.status === 200) {
        // Check if user needs to create account
        if (!response?.payload?.data?.message?.endsWith("Login successful.")) {
          // New user - show create account modal
          setUserDetail(response?.payload?.data);
          setCreateAccountModal(true);
          resetLoginState();
        } else {
          // Existing user - complete login
          const userData = response?.payload?.data?.data;
          
          // Store user data
          window.localStorage.setItem("LennyUserDetail", JSON.stringify(userData));
          window.localStorage.setItem("LoginTimer", "false");

          // Set cookies
          setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
          setCookie("LennyPhone_number", mobileNumber, { path: "/" }, { expires: new Date("9999-12-31") });

          // Update Redux state
          dispatch(userDetailState(true));

          toast.success("Login successful!");
          
          // Call success callback
          onLoginSuccess({
            mobileNumber,
            method: "mobile",
            userData: userData
          });
          
          resetLoginState();
          onHide(); // Close modal
        }
      } else {
        toast.error("Verification failed. Please try again.");
        setErrors({ otp: "Verification failed. Please try again." });
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      const errorMessage = err?.response?.data?.message || "Verification failed. Please try again.";
      toast.error(errorMessage);
      setErrors({ otp: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Manual Submit
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    handleOtpVerification();
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (otpTimer > 0) return;

    setIsLoading(true);
    
    try {
      const response = await dispatch(loginApiSlice({ phone: mobileNumber }));
      
      if (response?.payload?.status === 200) {
        setOtpTimer(60);
        setOtpValues(Array(4).fill(""));
        setErrors({});
        toast.success("OTP resent successfully!");
        
        // Focus first input
        const firstInput = document.querySelector(`input[name="otp-0"]`);
        if (firstInput) firstInput.focus();
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Login
  const handleEmailSubmit = async (e) => {
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

    // Password validation
    if (password.length < 6) {
      setErrors({ email: "Password must be at least 6 characters long" });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Simulate email login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      const userData = {
        _id: `email_${Date.now()}`,
        userId: `email_${Date.now()}`,
        data: {
          personalInfo: {
            name: "Email User", // You'd get this from your API
            email: email,
            photo: "",
            phone: "",
            gender: "",
            dob: "",
          },
          addresses: [],
          authMethod: 'email',
        }
      };

      // Store user data
      window.localStorage.setItem("LennyUserDetail", JSON.stringify(userData));
      window.localStorage.setItem("LoginTimer", "false");
      setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
      dispatch(userDetailState(true));

      toast.success("Email login successful!");
      onLoginSuccess({ email, method: "email", userData });
      resetLoginState();
      onHide();
      
    } catch (error) {
      console.error('Email login error:', error);
      toast.error("Login failed. Please check your credentials.");
      setErrors({ email: "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Social Login - FIXED VERSION
  const handleSocialLogin = async (method) => {
    console.log('Social login initiated:', method);
    setIsLoading(true);

    try {
      if (method === "google") {
        // Try the popup version first, fallback to original if needed
        try {
          const result = await handleGoogleLoginPopup();
          console.log('Google login result:', result);
          
          if (result.success) {
            // Store user data
            window.localStorage.setItem("LennyUserDetail", JSON.stringify(result.userData));
            window.localStorage.setItem("LoginTimer", "false");
            setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
            dispatch(userDetailState(true));

            toast.success(result.message);
            
            // Call success callback with proper data structure
            onLoginSuccess({
              method: "google",
              userData: result.userData,
              user: result.userData // Add this for compatibility
            });
            
            onHide(); // Close the modal on successful login
          } else {
            throw new Error(result.error || 'Google login failed');
          }
        } catch (error) {
          console.error('Google popup login failed, trying original method:', error);
          
          // Fallback to original method
          try {
            const result = await handleGoogleLogin();
            console.log('Google login fallback result:', result);
            
            if (result.success) {
              // Store user data
              window.localStorage.setItem("LennyUserDetail", JSON.stringify(result.userData));
              window.localStorage.setItem("LoginTimer", "false");
              setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
              dispatch(userDetailState(true));

              toast.success(result.message);
              
              // Call success callback
              onLoginSuccess({
                method: "google",
                userData: result.userData,
                user: result.userData // Add this for compatibility
              });
              
              onHide(); // Close the modal on successful login
            } else {
              throw new Error(result.error || 'Google login failed');
            }
          } catch (fallbackError) {
            console.error('Both Google login methods failed:', fallbackError);
            handleSocialLoginError(fallbackError, 'Google');
          }
        }
      } else if (method === "facebook") {
        try {
          const result = await handleFacebookLogin();
          console.log('Facebook login result:', result);
          
          if (result.success) {
            // Store user data
            window.localStorage.setItem("LennyUserDetail", JSON.stringify(result.userData));
            window.localStorage.setItem("LoginTimer", "false");
            setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
            dispatch(userDetailState(true));

            toast.success(result.message);
            
            // Call success callback
            onLoginSuccess({
              method: "facebook",
              userData: result.userData,
              user: result.userData // Add this for compatibility
            });
            
            onHide(); // Close the modal on successful login
          } else {
            throw new Error(result.error || 'Facebook login failed');
          }
        } catch (error) {
          console.error('Facebook login failed:', error);
          handleSocialLoginError(error, 'Facebook');
        }
      } else if (method === "email") {
        setLoginMethod("email");
        setShowEmailForm(true);
        setIsLoading(false);
        return; // Don't set loading to false at the end
      }
    } catch (error) {
      console.error(`${method} login error:`, error);
      toast.error(`${method} login failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset login state
  const resetLoginState = () => {
    setMobileNumber(cookies.LennyPhone_number || ""); // Keep saved mobile number
    setEmail("");
    setPassword("");
    setOtp("");
    setOtpValues(Array(4).fill(""));
    setShowOtp(false);
    setShowEmailForm(false);
    setErrors({});
    setOtpTimer(0);
    setLoginMethod("mobile");
    setIsLoading(false);
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
    onHide();
  };

  // Go back to mobile login
  const goBackToMobile = () => {
    setLoginMethod("mobile");
    setShowEmailForm(false);
    setErrors({});
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
                            disabled={isLoading}
                          />
                          {errors.mobile && <span className="ErrorText">{errors.mobile}</span>}
                        </div>
                        <button type="submit" className="LoginBtn" disabled={isLoading}>
                          {isLoading ? "SENDING OTP..." : "LOG IN VIA OTP"}
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
                                setErrors({});
                              }}
                              disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                              >
                                {isLoading ? "Sending..." : "Resend OTP"}
                              </button>
                            )}
                          </div>
                        </div>

                        <button type="submit" className="LoginBtn" disabled={isLoading}>
                          {isLoading ? "VERIFYING..." : "VERIFY OTP & CONTINUE"}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Email Login */}
                {loginMethod === "email" && (
                  <div className="EmailLogin">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                      <button
                        type="button"
                        className="BackBtn"
                        onClick={goBackToMobile}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          fontSize: '20px',
                          cursor: 'pointer',
                          marginRight: '10px'
                        }}
                      >
                        ←
                      </button>
                      <h4>Email Login</h4>
                    </div>
                    
                    <form onSubmit={handleEmailSubmit}>
                      <div className="FormGroup">
                        <input
                          type="email"
                          className="FormInput"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="FormGroup">
                        <input
                          type="password"
                          className="FormInput"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                        />
                        {errors.email && <span className="ErrorText">{errors.email}</span>}
                      </div>
                      <button type="submit" className="LoginBtn" disabled={isLoading}>
                        {isLoading ? "LOGGING IN..." : "LOGIN WITH EMAIL"}
                      </button>
                    </form>

                    <div className="ForgotPassword">
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                )}

                {/* Show social login options only for mobile login method */}
                {loginMethod === "mobile" && (
                  <>
                    <div className="Divider">
                      <span>or continue with</span>
                    </div>

                    {/* Social Login */}
                    <div className="SocialLogin">
                      <button
                        className="SocialBtn GoogleBtn"
                        onClick={() => handleSocialLogin("google")}
                        disabled={isLoading}
                      >
                        <i className="fab fa-google"></i>
                        {isLoading ? "Loading..." : "Google"}
                      </button>

                      <button
                        className="SocialBtn FacebookBtn"
                        onClick={() => handleSocialLogin("facebook")}
                        disabled={isLoading}
                      >
                        <i className="fab fa-facebook-f"></i>
                        {isLoading ? "Loading..." : "Facebook"}
                      </button>

                      <button
                        className="SocialBtn EmailBtn"
                        onClick={() => handleSocialLogin("email")}
                        disabled={isLoading}
                      >
                        <i className="fas fa-envelope"></i>
                        {isLoading ? "Loading..." : "Email"}
                      </button>
                    </div>
                  </>
                )}

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
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80x80?text=Product";
                      }}
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