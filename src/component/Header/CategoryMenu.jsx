import React from "react";
import "./CategoryMenu.css";

const MENU = [
  { label: "Anniversary", sub: ["Romantic Setups", "Room Décor", "Photo Cakes", "Flowers"] },
  { label: "Birthdays", sub: ["Kid Birthday", "Theme Décor", "Cakes", "Balloon Bouquets"] },
  { label: "Gifts", sub: ["Flowers", "Hampers", "Personalised", "Plants"] },
  { label: "Candlelight Dinners", sub: ["Rooftop", "Poolside", "Private Cabana", "Home Dining"] },
  { label: "Decorations", sub: ["Home Décor", "Hotel Décor", "Car Boot", "Office Décor"] },
  { label: "Festivals", sub: ["Valentine", "Holi", "Diwali", "New Year"] },
  { label: "Kid's Celebrations", sub: ["1st Birthday", "Superhero", "Princess", "Photo Booth"] },
  // stand-alone item (highlighted)
  { label: "Corporate Events", sub: ["Team Parties", "Office Décor", "Product Launch", "Annual Day"], featured: true }
];

export default function CategoryMenu() {
  return (
    <nav className="catnav">
      <ul className="catnav-list">
        {MENU.map((item) => (
          <li key={item.label} className={`catnav-item ${item.featured ? "featured" : ""}`}>
            <button className="catnav-link" type="button">
              {item.label}
              <svg className="caret" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Dropdown */}
            <div className="dropdown">
              <ul>
                {item.sub.map((s) => (
                  <li key={s}><a href="#">{s}</a></li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
