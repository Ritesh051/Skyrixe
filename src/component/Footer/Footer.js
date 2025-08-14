import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const { getCityList, getCategoryList } = useSelector(
    (state) => state.productList
  );

  const phoneNumber = "9004898839"; // Replace with your WhatsApp number
  const message = encodeURIComponent(
    "Hello, I have a question about https://skyrixe.com/"
  );

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <>
      <footer>
        <div className="FooterTop">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="FooterLogo">
                  <Link to="/" style={{ width: "140px" }}>
                    <img
                      src={require("../../assets/images/Footer_Logo.png")}
                    />
                  </Link>
                  <p>
                    Making Every Celebration Unforgettable From intimate room
                    surprises to grand setups, we bring creativity, elegance,
                    and joy to every occasion.
                  </p>
                </div>
              </div>
              <div className="col-lg-9 col-md-12">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="FooterLinks">
                      <h3>Category</h3>
                      <ul>
                        {getCategoryList?.data?.length > 0
                          ? getCategoryList?.data?.map((item, i) => {
                              if (i <= 4) {
                                return (
                                  <li>
                                    <a>{item?.categoryName}</a>
                                  </li>
                                );
                              }
                            })
                          : ""}
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="FooterLinks">
                      <h3>City</h3>
                      <ul>
                        {getCityList?.data?.length > 0
                          ? getCityList?.data?.map((city, i) => {
                              if (i <= 4) {
                                return (
                                  <li>
                                    <a>
                                      {city?.cityName.charAt(0).toUpperCase() +
                                        city?.cityName.slice(1)}
                                    </a>
                                  </li>
                                );
                              }
                            })
                          : ""}
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="FooterLinks">
                      <h3>About Skyrixe</h3>
                      <ul>
                        <li>
                          <Link to="/about-us">About Us</Link>
                        </li>
                        <li>
                          <Link to="/terms-conditions">
                            Terms and Conditions
                          </Link>
                        </li>
                        <li>
                          <Link to="/return-policy">Return Policy</Link>
                        </li>
                        <li>
                          <Link to="/privacy-policy">Privacy Policy</Link>
                        </li>
                        <li>
                          <Link to="/contact-us">Contact Us</Link>
                        </li>
                        <li>
                          <Link to="/faq">FAQ</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="FooterLinks">
                      <h3>Contact Us</h3>
                      <ul>
                        <li>
                          <a
                            onClick={handleClick}
                            style={{ cursor: "pointer" }}
                          >
                            Whatsapp Us
                          </a>
                        </li>
                        <li>
                          <a>Call Us</a>
                        </li>
                      </ul>

                      <p>Skyrixe Services Pvt Ltd</p>
                      <p>Office Address: Bandra West, Mumbai, India</p>
                      <p>Email: Contact@skyrixe.com</p>
                      <p>Phone: +91 9004898839</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="FooterBottom">
          <div className="container-fluid">
            <div className="footer-icons">
              <p>COPYRIGHT © SKYRIXE CO.. LTD. ALL RIGHTS RESERVED.</p>
              <p>
                <i class="fa-brands fa-facebook-f"></i>
                <i class="fa-brands fa-instagram"></i>
                <i class="fa-brands fa-pinterest"></i>
                <i class="fa-brands fa-twitter"></i>
                <i class="fa-brands fa-youtube"></i>
                {/* <Link to="https://www.facebook.com/login/" target="_main">
                  <i class="fa-brands fa-facebook-f"></i>
                </Link>
                <Link to="https://www.instagram.com/accounts/login/" target="_main">
                  <i class="fa-brands fa-instagram"></i>
                </Link>
                <Link >
                  <i class="fa-brands fa-pinterest"></i>
                </Link>

                <Link>
                  <i class="fa-brands fa-twitter"></i>
                </Link>

                <Link>
                  <i class="fa-brands fa-youtube"></i>
                </Link> */}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
