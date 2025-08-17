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

  // Step Handlers
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

  // Edit handlers
  const handleEditDate = () => setCurrentStep(1);
  const handleEditTime = () => setCurrentStep(2);
  const handleEditCustomizations = () => setCurrentStep(3);

  return (
    <>
      <DateSelectionModal
        show={show && currentStep === 1}
        onHide={resetFlow}
        onDateSelect={handleDateSelect}
        onBack={goToPreviousStep}
      />

      <TimeSlotModal
        show={show && currentStep === 2}
        onHide={resetFlow}
        selectedDate={bookingDetails.selectedDate}
        onTimeSelect={handleTimeSelect}
        onBack={goToPreviousStep}
      />

      <CustomizationsModal
        show={show && currentStep === 3}
        onHide={resetFlow}
        selectedDate={bookingDetails.selectedDate}
        selectedTimeSlot={bookingDetails.selectedTimeSlot}
        onCustomizationsSelect={handleCustomizationsSelect}
        onBack={goToPreviousStep}
      />

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
