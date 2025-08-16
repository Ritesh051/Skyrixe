import React from 'react';
import { X, Building } from 'lucide-react';
import '../../assets/css/CitySelector.css';
import delhi from '../../assets/images/delhi.svg';
import Mumbai from '../../assets/images/mumbai.png';
import Lucknow from '../../assets/images/lucknow.png';
import Hyderabad from '../../assets/images/hyderabad.png';
import kanpur from '../../assets/images/kanpur.png';
import ahmed from '../../assets/images/ahmed.png';
import Mau from '../../assets/images/mau.png';
import Nashik from '../../assets/images/nasik.png';
 import Azamgarh from '../../assets/images/azamgarh.png';
import Prayagraj from '../../assets/images/Prayagraj.png';
import Pune from '../../assets/images/pune.png';
import Jaunpur from '../../assets/images/jaunpur.png';

const CityPopup = ({ cities, onSelect, onClose }) => {
  const cityIcons = {
    'Mumbai': (props) => <img src={Mumbai} alt="Mumbai" {...props} style={{ height: 48 }} />,
    'Delhi': (props) => <img src={delhi} alt="Delhi" {...props} style={{ height: 40, width: 40, objectFit: 'contain' }} />,
    'Azamgarh': (props) => <img src={Azamgarh} alt="Azamgarh" {...props} style={{ height: 40, width: 40, objectFit: 'contain' }} />,
    'Lucknow': (props) => <img src={Lucknow} alt="Lucknow" {...props} style={{ height: 68 }} />,
    'Prayagraj': (props) => <img src={Prayagraj} alt="Prayagraj" {...props} style={{ height: 40, width: 40, objectFit: 'contain' }} />,
    'Hyderabad': (props) => <img src={Hyderabad} alt="Hyderabad" {...props} style={{ height: 60 }} />,
    'Ambedkar Nagar': (props) => <img src={ahmed} alt="Ambedkar Nagar" {...props} style={{ height: 40, width: 40, objectFit: 'contain' }} />,
    'Mau': (props) => <img src={Mau} alt="Mau" {...props} style={{ height: 40, width: 40, objectFit: 'contain' }} />,
    'Nashik': (props) => <img src={Nashik} alt="Nashik" {...props} style={{ height: 40, width: 40, objectFit: 'contain' }} />,
    'Pune': (props) => <img src={Pune} alt="Pune" {...props} style={{ height: 40, width: 40, objectFit: 'contain' }} />,
    'Jaunpur': (props) => <img src={Jaunpur} alt="Jaunpur" {...props} style={{ height: 40, width: 40, objectFit: 'contain' }} />,
    'Kanpur': (props) => <img src={kanpur} alt="Kanpur" {...props} style={{ height: 40, width: 40, objectFit: 'contain' }} />,
    'Ahmedabad': (props) => <img src={ahmed} alt="Ahmedabad" {...props} style={{ height: 40, width: 40, objectFit: 'contain' }} />
  };

  const handleCitySelect = (city) => {
    onSelect(city);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  

  return (
    <div className="city-popup-overlay" onClick={handleOverlayClick}>
      <div className="city-popup-modal">
        {/* Header */}
        <div className="city-popup-header">
          <h2 className="city-popup-title">Select your City</h2>
          <button 
            onClick={onClose}
            className="city-popup-close"
            type="button"
          >
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="city-popup-content">
          {/* <p className="experience-text">CherishX Experience available in:</p>
          <p className="cities-list">
            Mumbai, Delhi, Azamgarh, Lucknow, Prayagraj, Hyderabad, Ambedkar Nagar, Mau, Nashik, Pune, Jaunpur, Kanpur
          </p> */}
          <p className="description-text">Find more than 3000 decorations, gifts and surprises!</p>
        </div>

        {/* City Grid */}
        <div className="city-grid">
          <div className="cities-container">
            {cities?.map((city, index) => {
              const IconComponent = cityIcons[city.cityName] || ((props) => <Building {...props} size={48} />);
              return (
                <button
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="city-card"
                  type="button"
                >
                  <div className="city-icon">
                    <IconComponent />
                  </div>
                  <span className="city-name">
                    {city.cityName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPopup;