import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { orderSummary } from "../../reduxToolkit/Slices/Cart/bookingApis";

const PaymentSuccess = () => {
  const navigate = useNavigate();
 const dispatch=useDispatch();
 const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));

 useEffect(()=>{
  window.scrollTo({ top: 0, behavior: "smooth" });
  dispatch(orderSummary({ userId: userDetail?._id }))

 },[])

  return (
    <div className="PaymentSuccessFulArea">
      <span>
        <img src={require("../../assets/images/checkgreen.png")} />
      </span>
      <h3>Your Payment is Succesfull</h3>
      <p>
        Your payment will be proceed in 30 mins. If any problem please chat to
        customer service. <br />
        Detail information will included below.
      </p>
      <div className="">
        <button className="Button Black" onClick={() => navigate("/", { replace: true })}>
          Back to home
        </button>
        <button className="Button Grey" onClick={() => navigate("/upcoming-bookings", { replace: true })}>Check Detail</button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
