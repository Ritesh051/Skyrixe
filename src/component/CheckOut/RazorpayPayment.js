import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import WebIcon from "../../assets/images/fav_Logo.png";
import {
  createCODorder,
  createOrder,
  placeOrder,
  verifyPayment,
} from "../../reduxToolkit/Slices/Cart/bookingApis";

const RazorpayPayment = ({
  orderDetails,
  getOrderSummaryDetail,
  iState,
  selectedValue,
}) => {
  const {
    addressList,
    additional_Phone,
    decorationLocation,
    aboutX,
    occasion,
    mentionAge,
    ageBalloonColor,
    slot,
    customer_req,
    custom_name,
  } = iState;
  console.log({ orderDetails, getOrderSummaryDetail, iState, selectedValue });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));

  function loadScript(src) {
    console.log("script loading...");
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  const handleCODPayment = () => {
    const data = {
      userId: getOrderSummaryDetail?.data?.userId,
      itemQuantity: 1,
      placedon:  getOrderSummaryDetail?.data?.dateAdded,
      slot: slot,
      prodimages: getOrderSummaryDetail?.data?.productImage,
      productAmount: getOrderSummaryDetail?.data?.price,
      productDescription: getOrderSummaryDetail?.data?.productDescription,
      totalAmount: getOrderSummaryDetail?.data?.totalAmount,
      productId: getOrderSummaryDetail?.data?.productId,
      deliveryAddress: addressList,
      decorationLocation,
      aboutX,
      occasion,
      altContact: additional_Phone,
      ballonsName: selectedValue,
      custom_name,
      customerage: parseInt(mentionAge),
      ageColour: ageBalloonColor,
      messageBoard: customer_req,
      productName: getOrderSummaryDetail?.data?.productName,
      customerName: userDetail?.personalInfo?.name,
      productcustomizeDetails:
        getOrderSummaryDetail?.data?.productcustomizeDetails,
    };

    dispatch(createCODorder(data))
      .then((res) => {
        console.log({ res });
        toast?.success("🎉 Your order has been placed successfully with Cash on Delivery !!");
        if (res?.payload?.status == 201) {
          navigate("/payment-success");
        }
      })
      .catch((err) => {
        toast?.success(err?.payload?.message);
        console.log({ err });
      });
  };

  const displayRazorpay = async (partialPayment) => {
    if (addressList) {
      window.localStorage.setItem("PaymentTimer", true);
      console.log("razorpay clicked");
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const data = {
        totalAmount: partialPayment
          ? Number(partialPayment)
          : Number(getOrderSummaryDetail?.data?.totalAmount),
        currency: "INR",
        userId: userDetail?._id,
        paymentMode: "",
        // partialPayment: "",
      };

      dispatch(createOrder(data)).then((res) => {
        console.log("res", res);
        // if (res?.payload?.status === 200) {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: partialPayment
            ? Number(partialPayment)
            : Number(getOrderSummaryDetail?.data?.totalAmount),
          currency: "INR",
          name: "Skyrixe.com",
          image: WebIcon,
          description: "Test Transaction",

          order_id: res?.payload?.orderId,
          handler: async function (response) {
            console.log("response: ", response);
            const paymentData = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              paymentMode: "",
            };
            console.log("data to save transaction data", paymentData);

            // dispatch(verifyPayment(paymentData)).then((res) => {
            // console.log({ res }, "here");
            // if (res?.payload?.success) {
            const data = {
              userId: getOrderSummaryDetail?.data?.userId,
              itemQuantity: 1,
              placedon: getOrderSummaryDetail?.data?.dateAdded,
              slot: slot,
              prodimages: getOrderSummaryDetail?.data?.productImage,
              productAmount: getOrderSummaryDetail?.data?.price,
              totalAmount: getOrderSummaryDetail?.data?.totalAmount,
              productId: getOrderSummaryDetail?.data?.productId,
              productDescription:
                getOrderSummaryDetail?.data?.productDescription,
              deliveryAddress: addressList,
              decorationLocation,
              aboutX,
              occasion,
              altContact: additional_Phone,
              ballonsName: selectedValue,
              custom_name,
              customerage: parseInt(mentionAge),
              ageColour: ageBalloonColor,
              messageBoard: customer_req,
              productName: getOrderSummaryDetail?.data?.productName,
              customerName: userDetail?.personalInfo?.name,
              productcustomizeDetails:
                getOrderSummaryDetail?.data?.productcustomizeDetails,
              orderId: response.razorpay_order_id,
              paidAmount: partialPayment ? Number(partialPayment) : 0,
              remainingAmount: partialPayment
                ? Number(getOrderSummaryDetail?.data?.totalAmount) -
                  Number(partialPayment)
                : 0,
            };
            dispatch(placeOrder(data))
              .then((res) => {
                console.log({ res });
                toast?.success(res?.payload?.message);
                if (res?.payload?.status == 200) {
                  navigate("/payment-success");
                }
              })
              .catch((err) => {
                toast?.success(err?.payload?.message);
                console.log({ err });
              });
            // }
            // });
          },
          prefill: {
            name: "Skyrixe.com",
            email: "SKYRIXE@example.com",
            contact: "9004898839",
          },
          notes: {
            address: "SKYRIXE",
          },
          theme: {
            color: "#f5876f",
            // color: "#61dafb",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response) {
          alert("Payment Failed");
          console.log("Payment failed!", response);
        });
        paymentObject.open();
        // }
      });
    } else {
      toast.error("Please Add an Address!!");
    }
  };

  console.log({ addressList });

  return (
    <>
      <a style={{marginTop:"10px"}} className="CheckoutBtn" onClick={handleCODPayment}>
        COD
      </a>
      <a
      style={{marginTop:"10px"}}
        className="CheckoutBtn"
        onClick={() =>
          displayRazorpay((getOrderSummaryDetail?.data?.totalAmount * 40) / 100)
        }
      >
        Partial Payment{" "}
        {`(₹ ${(getOrderSummaryDetail?.data?.totalAmount * 40) / 100})`}
      </a>
      <a  style={{marginTop:"10px"}} className="CheckoutBtn" onClick={() => displayRazorpay()}>
        Pay Full Payment
      </a>
    </>
  );
};

export default RazorpayPayment;
