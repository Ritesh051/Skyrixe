import React from "react";
import "./CityPopup.css";

const cities = [
  { name: "Delhi NCR", icon: require("../../assets/icons/delhi.png") },
  { name: "Jaipur", icon: require("../../assets/icons/delhi.png") },
  { name: "Bangalore", icon: require("../../assets/icons/delhi.png") },
  { name: "Kolkata", icon: require("../../assets/icons/delhi.png") },
  { name: "Indore", icon: require("../../assets/icons/delhi.png") },
  { name: "Pune", icon: require("../../assets/icons/delhi.png") },
  { name: "Across India", icon: require("../../assets/icons/delhi.png") },
  { name: "Hyderabad", icon: require("../../assets/icons/delhi.png") },
  { name: "Mumbai", icon: require("../../assets/icons/delhi.png") },
  { name: "Kanpur", icon: require("../../assets/icons/delhi.png") },
  { name: "Chennai", icon: require("../../assets/icons/delhi.png") },
  { name: "Jammu", icon: require("../../assets/icons/delhi.png") },
  { name: "Lucknow", icon: require("../../assets/icons/delhi.png") },
  { name: "Chandigarh", icon: require("../../assets/icons/delhi.png") },
  { name: "Ahmedabad", icon: require("../../assets/icons/delhi.png") },
];


export default function CityPopup({ onClose, onSelect }) {
  return (
    <div className="city-popup-overlay">
      <div className="city-popup">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Select your City</h2>
        <p>Find more than 3000 decorations, gifts and surprises!</p>
        <div className="city-grid">
          {cities.map((city, i) => (
            <div
              key={i}
              className="city-card"
              onClick={() => onSelect(city.name)}
            >
              <img src={city.icon} alt={city.name} />
              <span>{city.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
