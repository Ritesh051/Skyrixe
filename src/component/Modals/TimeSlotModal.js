import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/TimeSlotModal.css";

const timeSlots = [
  { id: 1, time: "2:00 PM to 11:00 AM", available: true },
];

const TimeSlotModal = ({ show, onHide, onTimeSelect, onBack, selectedDate }) => {
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  // Reset selection when modal opens/closes
  useEffect(() => {
    if (!show) {
      setSelectedSlotId(null);
    }
  }, [show]);

  const handleSlotSelect = (slot) => {
    if (!slot.available) return;
    
    console.log('Time slot selected:', slot);
    setSelectedSlotId(slot.id);
    
    // Auto-advance after short delay for better UX
    setTimeout(() => {
      onTimeSelect(slot);
    }, 300);
  };

  const formatDate = (date) => {
    if (!date) return "No date selected";
    if (typeof date === 'string') return date;
    if (date instanceof Date) {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
    return "Invalid date";
  };

  return (
    <Modal show={show} onHide={onHide} centered className="ModalBox TimeSlotModal">
      <div className="ModalArea">
        <div className="ModalHeader">
          <button className="BackBtn" onClick={onBack}>
            Back
          </button>
          <h3>Select slot</h3>
          <button className="CloseModal" onClick={onHide}>
            ×
          </button>
        </div>
        
        <div className="SelectedDateInfo">
          <p>Selected Date: <strong>{formatDate(selectedDate)}</strong></p>
        </div>
        
        <div className="TimeSlotsList">
          {timeSlots.map(slot => (
            <div 
              key={slot.id} 
              className={`TimeSlotItem ${selectedSlotId === slot.id ? 'selected' : ''} ${!slot.available ? 'unavailable' : ''}`}
              onClick={() => handleSlotSelect(slot)}
            >
              <div className="SlotContent">
                <span className="SlotTime">{slot.time}</span>
                <div className="RadioButton">
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot.id}
                    checked={selectedSlotId === slot.id}
                    onChange={() => {}}
                    disabled={!slot.available}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="WhatsAppHelp">
          <div className="HelpIcon">
            <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" alt="help" />
          </div>
          <span>Can't find required Date or Time? <a href="#" onClick={(e) => e.preventDefault()}>Click here to connect with us on Whatsapp</a></span>
        </div>
      </div>
    </Modal>
  );
};

export default TimeSlotModal;