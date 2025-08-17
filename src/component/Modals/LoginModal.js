import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/LoginModal.css";

const LoginModal = ({
  show,
  onHide,
  onLoginSuccess,
  onBack,
  bookingDetails,
  onEditDate,
  onEditTime,
  onEditCustomizations
}) => {
  const [loginMethod, setLoginMethod] = useState("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [errors, setErrors] = useState({});

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length !== 10) {
      setErrors({ mobile: "Please enter a valid 10-digit mobile number" });
      return;
    }
    setErrors({});
    setShowOtp(true);
    console.log('OTP sent to:', mobileNumber);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }
    setErrors({});
    console.log('OTP verified:', otp);
    onLoginSuccess({ mobileNumber, method: "mobile" });
  };

  const handleSocialLogin = (method) => {
    console.log('Social login:', method);
    onLoginSuccess({ method });
  };

  const handleEmailLogin = () => {
    setLoginMethod("email");
  };

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
    const basePrice = 21999; 
    const customizationsTotal = bookingDetails?.selectedCustomizations?.reduce((sum, item) => sum + item.price, 0) || 0;
    return basePrice + customizationsTotal;
  };

  return (
    <Modal className="ModalBox LoginModal" show={show} onHide={onHide} centered size="xl">
      <div className="ModalArea">
        <div className="ModalContent">
          <div className="LoginSection">
            <h3>Please Login to Continue Booking</h3>
            
            <div className="LoginMethods">
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
                        </p>
                        <input
                          type="text"
                          className="FormInput"
                          placeholder="Enter 6 digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          maxLength={6}
                        />
                        {errors.otp && <span className="ErrorText">{errors.otp}</span>}
                      </div>
                      <button type="submit" className="LoginBtn">
                        VERIFY OTP & CONTINUE
                      </button>
                    </form>
                  )}
                </div>
              )}

              <div className="Divider">
                <span>or</span>
              </div>

              <div className="SocialLogin">
                <button 
                  className="SocialBtn FacebookBtn"
                  onClick={() => handleSocialLogin("facebook")}
                >
                  <i className="fab fa-facebook-f"></i>
                  Facebook Login
                </button>
                
                <button 
                  className="SocialBtn GoogleBtn"
                  onClick={() => handleSocialLogin("google")}
                >
                  <i className="fab fa-google"></i>
                  Google Login
                </button>
                
                <button 
                  className="SocialBtn EmailBtn"
                  onClick={handleEmailLogin}
                >
                  <i className="fa-solid fa-envelope"></i>
                  Email Login
                </button>
              </div>

              <div className="TermsText">
                By Logging in you are agreeing to our{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>Terms and Conditions</a>{" "}
                and our{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              </div>
            </div>
          </div>

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
                  <img src={require("../../assets/images/custom-1.png")} alt="Product" />
                </div>
                <div className="ProductDetails">
                  <h5>Luxury Suite Stay & Terrace Dining by Hilton</h5>
                  <div className="ProductPrice">₹ 21999</div>
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
            <span>Unable to login or facing payment issues ? <a href="#" onClick={(e) => e.preventDefault()}>Click to connect on WhatsApp</a></span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
