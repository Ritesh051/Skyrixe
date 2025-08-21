import React, { useEffect, useState } from "react";
import DateSelectionModal from "./DateSelectionModal";
import TimeSlotModal from "./TimeSlotModal";
import CustomizationsModal from "./CustomizationsModal";
import LoginModal from "./LoginModal";

const BookingFlow = ({ show, onHide, onComplete, selectedProduct, user }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [bookingDetails, setBookingDetails] = useState({
    selectedDate: null,
    selectedTimeSlot: null,
    selectedCustomizations: [],
  });

  const isLoggedIn = !!user;

  // Reset flow when modal is closed or reopened
  useEffect(() => {
    if (show) {
      setCurrentStep(1);
      setBookingDetails({
        selectedDate: null,
        selectedTimeSlot: null,
        selectedCustomizations: [],
      });
    }
  }, [show]);

  const handleDateSelect = (date) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setBookingDetails((prev) => ({ ...prev, selectedDate: formattedDate }));
    goToNextStep();
  };

  const handleTimeSelect = (timeSlot) => {
    setBookingDetails((prev) => ({ ...prev, selectedTimeSlot: timeSlot }));
    goToNextStep();
  };

  const handleCustomizationsSelect = (customizations) => {
    setBookingDetails((prev) => ({
      ...prev,
      selectedCustomizations: customizations,
    }));
    
    // Check if user is already logged in - if yes, complete booking
    if (isLoggedIn) {
      handleBookingComplete(customizations);
    } else {
      goToNextStep(); // Go to login step
    }
  };

  const handleBookingComplete = (customizations = null) => {
    const finalBookingDetails = {
      selectedDate: bookingDetails.selectedDate,
      selectedTimeSlot: bookingDetails.selectedTimeSlot,
      selectedCustomizations: customizations || bookingDetails.selectedCustomizations,
    };

    console.log('Completing booking with details:', finalBookingDetails);
    console.log('User data:', user);

    // Pass the complete booking details to parent
    onComplete({
      ...finalBookingDetails,
      loginData: { 
        user,
        method: user?.data?.authMethod || 'existing_user'
      }
    });
    
    resetFlow();
  };

  const handleLoginSuccess = (loginData) => {
    console.log('Login successful, completing booking:', loginData);
    
    // Complete the booking after successful login
    onComplete({ 
      ...bookingDetails, 
      loginData 
    });
    
    resetFlow();
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setBookingDetails({
      selectedDate: null,
      selectedTimeSlot: null,
      selectedCustomizations: [],
    });
    onHide();
  };

  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPreviousStep = () => setCurrentStep((prev) => prev - 1);

  const handleEditDate = () => setCurrentStep(1);
  const handleEditTime = () => setCurrentStep(2);
  const handleEditCustomizations = () => setCurrentStep(3);

  return (
    <>
      {/* Step 1: Date Selection */}
      <DateSelectionModal
        show={show && currentStep === 1}
        onHide={resetFlow}
        onDateSelect={handleDateSelect}
        onBack={goToPreviousStep}
      />

      {/* Step 2: Time Slot Selection */}
      <TimeSlotModal
        show={show && currentStep === 2}
        onHide={resetFlow}
        selectedDate={bookingDetails.selectedDate}
        selectedProduct={selectedProduct}
        onTimeSelect={handleTimeSelect}
        onBack={goToPreviousStep}
      />

      {/* Step 3: Customizations */}
      <CustomizationsModal
        show={show && currentStep === 3}
        onHide={resetFlow}
        selectedDate={bookingDetails.selectedDate}
        selectedTimeSlot={bookingDetails.selectedTimeSlot}
        onCustomizationsSelect={handleCustomizationsSelect}
        onBack={goToPreviousStep}
      />

      {/* Step 4: Login (only show if user is not logged in) */}
      {!isLoggedIn && (
        <LoginModal
          show={show && currentStep === 4}
          onHide={resetFlow}
          bookingDetails={bookingDetails}
          selectedProduct={selectedProduct}
          onLoginSuccess={handleLoginSuccess}
          onBack={goToPreviousStep}
          onEditDate={handleEditDate}
          onEditTime={handleEditTime}
          onEditCustomizations={handleEditCustomizations}
        />
      )}
    </>
  );
};

export default BookingFlow;