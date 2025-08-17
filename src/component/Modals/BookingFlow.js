import React, { useState } from "react";
import DateSelectionModal from "./DateSelectionModal";
import TimeSlotModal from "./TimeSlotModal";
import CustomizationsModal from "./CustomizationsModal";
import LoginModal from "./LoginModal";

const BookingFlow = ({ show, onHide, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    selectedDate: null,
    selectedTimeSlot: null,
    selectedCustomizations: [],
  });

  // Handlers for each step
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
    goToNextStep();
  };

  const handleLoginSuccess = (loginData) => {
    onComplete({ ...bookingDetails, loginData });
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

  // Edit handlers for order summary
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

      {/* Step 4: Login */}
      <LoginModal
        show={show && currentStep === 4}
        onHide={resetFlow}
        bookingDetails={bookingDetails}
        onLoginSuccess={handleLoginSuccess}
        onBack={goToPreviousStep}
        onEditDate={handleEditDate}
        onEditTime={handleEditTime}
        onEditCustomizations={handleEditCustomizations}
      />
    </>
  );
};

export default BookingFlow;
