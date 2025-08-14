function loadScript(src) {
    console.log('script loading...');
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

const displayRazorpay = async () => {
    console.log('razorpay clicked');
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }

    const data = {
        amount: Number(props?.amount) * 100,
        currency: 'INR',
    };

    dispatch(orderIdForPaymentApi(data)).then((res) => {
        console.log('res', res);

        if (res?.payload?.status === 200) {
            const options = {
                key: process.env.REACT_APP_RAZORPAY_APP_ID,
                amount: Number(props?.amount) * 100,
                currency: 'INR',
                name: "Soumya Corp.",
                description: "Test Transaction",
                order_id: res?.payload?.data?.transaction?.orderId,
                handler: async function (response) {
                    console.log('response: ', response);
                    const paymentData = {
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };

                    console.log('data to save transaction data', paymentData);
                    dispatch(verifyPaymentApi(paymentData)).then((res) => {
                        if (res?.payload?.status === 200) {
                            toast.info('Payment Successful', {
                                position: 'top-center',
                                autoclose: 1000
                            });
                            setShow(true);

                            const bookingData = {
                                serviceId: data1?.serviceId,
                                serviceOption: data1?.serviceOption,
                                duration: data1?.time,
                                price: data1?.price,
                                language: data2?.language,
                                callType: "video",
                                slots: {
                                    astrologerId: data2?.slot?.astrologerId,
                                    day: data2?.slot?.day,
                                    date: data2?.date,
                                    startTime: data2?.slot?.startTime,
                                    endTime: data2?.slot?.endTime
                                },
                                basicDetails: {
                                    profile1: {
                                        name: data3?.name1,
                                        dob: data3?.dob1,
                                        time: data3?.timeOfBirth1,
                                        birthPlace: data3?.addr1,
                                        addr1lat: data3?.addr1lat,
                                        addr1lng: data3?.addr1lng,
                                        relation: data3?.relation1 ?? ""
                                    },
                                    profile2: {
                                        name: data3?.name2,
                                        dob: data3?.dob2,
                                        time: data3?.timeOfBirth2,
                                        birthPlace: data3?.addr2,
                                        addr2lat: data3?.addr2lat,
                                        addr2lng: data3?.addr2lng,
                                        relation: data3?.relation2 ?? ""
                                    },
                                    question: data3?.questionsArray,
                                },
                                paymentDetails: {
                                    orderId: response.razorpay_order_id,
                                    paymentId: response.razorpay_payment_id,
                                },
                                paymentStatus: "success"
                            };

                            dispatch(addBookingApi(bookingData)).then((res) => {
                                console.log('Response of add booking after payment', res);
                                if (res?.payload?.status === 200) {
                                    dispatch(clearSlots());
                                    navigate(`/appointmentManagement/upcoming`);
                                    window.localStorage.removeItem('BookedSlotDetail');
                                    window.localStorage.removeItem('selectedServiceDetail');
                                    window.localStorage.removeItem('serviceDetail');
                                    window.localStorage.removeItem('userDetail');
                                }
                            });
                        }
                    });
                },
                prefill: {
                    name: "Soumya Dey",
                    email: "SoumyaDey@example.com",
                    contact: "9999999999",
                },
                notes: {
                    address: "Soumya Dey Corporate Office",
                },
                theme: {
                    color: "#61dafb",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                alert('Payment Failed');
                console.log('Payment failed!', response);
            });
            paymentObject.open();
        }
    });
};
