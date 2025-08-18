import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "bootstrap";
import {
  birthdayDecoList,
  categoryList,
  dealBannerList,
} from "../../reduxToolkit/Slices/ProductList/listApis";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ReactImageZoom from "react-image-zoom";

const CustomPrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev" onClick={onClick}>
    <i class="fa-solid fa-angle-left"></i>
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div className="custom-arrow next" onClick={onClick}>
    <i class="fa-solid fa-angle-right"></i>
  </div>
);

const Main = () => {
  const {
    getBirthdayList,
    getAnniversaryList,
    getKidsList,
    getWeddingDecoList,
    getCategoryList,
    getDealBannerList,
    getTopBannerList,
    loader,
  } = useSelector((state) => state.productList);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const anniversaryScrollRef = useRef(null);
  const kidsScrollRef = useRef(null);
  const babyShowerScrollRef = useRef(null);

  const handleAnniversaryScrollLeft = () => {
    if (anniversaryScrollRef.current) {
      const container = anniversaryScrollRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAnniversaryScrollRight = () => {
    if (anniversaryScrollRef.current) {
      const container = anniversaryScrollRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleKidsScrollLeft = () => {
    if (kidsScrollRef.current) {
      const container = kidsScrollRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleKidsScrollRight = () => {
    if (kidsScrollRef.current) {
      const container = kidsScrollRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBabyShowerScrollLeft = () => {
    if (babyShowerScrollRef.current) {
      const container = babyShowerScrollRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBabyShowerScrollRight = () => {
    if (babyShowerScrollRef.current) {
      const container = babyShowerScrollRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const selectCity = window.localStorage.getItem("LennyCity");
  // const userDetail = JSON.parse(window.localStorage.getItem("LennyUserDetail"));

  const handleCategory = (item, subCat) => {
    navigate("/products", { state: { item, subCat, selectCity } });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleProduct = (item) => {
    navigate("/products/product-details", { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const settings = {
    infinite: true,
    loop: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    rewind: true,
    autoplay: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  const settings1 = {
    infinite: false,
    loop: false,
    dots: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
  };

  useEffect(() => {
    const myCarousel = document.querySelector("#carouselExampleIndicators");
    if (myCarousel) {
      new Carousel(myCarousel, {
        interval: 5000,
        pause: false,
        ride: "carousel", // Ensure autoplay starts
      });
    }
  }, []);

  console.log({ getBirthdayList });

  console.log({ getDealBannerList });

  return (
    <>
      <div className="Hero-Section">
        <div className="cards">
          <div className="card1">
            <img src="https://cheetah.cherishx.com/website_layout/ganpati_menu_icon_desk.jpg?format=avif" alt="" />
            <p> Ganpati <br /> Decoration</p>
          </div>
          <div
            className="card1"
            style={{ cursor: "pointer" }}
            onClick={() => handleCategory({ categoryName: "KIDS BIRTHDAY" })}
          >
            <img
              src="https://cheetah.cherishx.com/website_layout/1755324921__original_layout_55.jpg?format=avif"
              alt="Kids Birthday"
            />
            <p>
              Kids birthday <br /> Decors
            </p>
          </div>
          <div className="card1">
            <img src="https://cheetah.cherishx.com/website_layout/1737544205__original_layout_55.jpg?format=avif" alt="" />
            <p> Same day <br /> Decoration</p>
          </div>
          <div
            className="card1"
            style={{ cursor: "pointer" }}
            onClick={() => handleCategory({ categoryName: "BIRTHDAY" })}
          >
            <img
              src="https://cheetah.cherishx.com/website_layout/120x86_Icons_Desktop_03_20241018_123157.jpg?format=avif"
              alt="Birthday Decoration"
            />
            <p>
              Birthday <br /> Decoration
            </p>
          </div>
          <div className="card1">
            <img src="https://cheetah.cherishx.com/website_layout/120x86_Icons_Desktop_03_20240930_132612.jpg?format=avif" alt="" />
            <p> Personalised <br /> Gifts</p>
          </div>
          <div
            className="card1"
            style={{ cursor: "pointer" }}
            onClick={() => handleCategory({ categoryName: "ANNIVERSARY" })}
          >
            <img
              src="https://cheetah.cherishx.com/website_layout/1755170285__original_layout_55.jpg?format=avif"
              alt="Candlelight Dinner"
            />
            <p>
              Candlelight <br /> Dinner
            </p>
          </div>

          <div
            className="card1"
            style={{ cursor: "pointer" }}
            onClick={() => handleCategory({ categoryName: "BABY SHOWER" })}
          >
            <img
              src="https://cheetah.cherishx.com/website_layout/120x86_Icons_Desktop_01_20241018_123157.jpg?format=avif"
              alt="Baby Shower"
            />
            <p>
              Baby <br /> Shower
            </p>
          </div>

          <div
            className="card1"
            style={{ cursor: "pointer" }}
            onClick={() => handleCategory({ categoryName: "BABY SHOWER" })}
          >
            <img
              src="https://cheetah.cherishx.com/website_layout/120x86_Icons_Desktop_01_20241018_123157.jpg?format=avif"
              alt="Baby Shower"
            />
            <p>
              Baby <br /> Welcome
            </p>
          </div>
          <div className="card1">
            <img src="https://cheetah.cherishx.com/website_layout/120x86_Icons_Desktop_02_20241018_123157.jpg?format=avif" alt="" />
            <p> Festive <br /> Celebrations</p>
          </div>
          <div className="card1">
            <img src="https://cheetah.cherishx.com/website_layout/120x86_Icons_Desktop_08_20240930_132612.jpg?format=avif" alt="" />
            <p> Games & <br /> Activities</p>
          </div>



        </div>
        <div id="carouselExampleIndicators" className="carousel slide">
          <div className="carousel-inner">
            {getTopBannerList?.data?.length > 0
              ? getTopBannerList?.data?.map((item, i) => {
                return (
                  <div className={`carousel-item ${i == 0 ? "active" : ""}`}>
                    <div>
                      <div className="HeroRight">
                        <img src={item?.bannerImage} />
                      </div>
                    </div>
                  </div>
                );
              })
              : ""}
          </div>
          <div className="carousel-indicators">
            {getTopBannerList?.data?.length > 0
              ? getTopBannerList?.data?.map((item, i) => {
                return (
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={i}
                    className={`${i == 0 ? "active" : ""}`}
                    aria-current={`${i == 0 ? "true" : "false"}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                );
              })
              : ""}
          </div>
        </div>
      </div>

      <div className="Main">
        <div className="FeatureArea">
          <div className="container-fluid" style={{ width: "96%" }}>
            <div className="section-title">
              <h2>Features Category</h2>
            </div>
            {/* <Slider {...settings}>
              {getCategoryList?.data?.length > 0
                ? getCategoryList?.data?.map((item, i) => {
                    return (
                      <div className="item" key={i}>
                        <div className="FeatureBoxMain">
                          <div className="FeatureBox">
                            <aside
                              style={{ cursor: "pointer" }}
                              onClick={() => handleCategory(item)}
                              className={
                                i == 0
                                  ? "Blue"
                                  : i == 1
                                  ? "Green"
                                  : i % 2 == 0
                                  ? "Orange"
                                  : i % 3 == 0
                                  ? "Cyan"
                                  : i % 4 == 0
                                  ? "Yellow"
                                  : i % 5 == 0
                                  ? "DarkGreen"
                                  : "Pink"
                              }
                            >
                              <figure>
                                <img src={item?.categoryImage} />
                              </figure>
                            </aside>
                            <h4
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content={item?.categoryName}
                            >
                              {item?.categoryName}
                            </h4>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </Slider> */}
            <div className="row">
              {getCategoryList?.data?.length > 0
                ? getCategoryList?.data?.map((item, i) => {
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6 top" key={i}>
                      <div className="FeatureBoxMain">
                        <div className="FeatureBox">
                          <aside
                            style={{ cursor: "pointer" }}
                            onClick={() => handleCategory(item)}
                            className={
                              i == 0
                                ? "Blue"
                                : i == 1
                                  ? "Green"
                                  : i % 2 == 0
                                    ? "Orange"
                                    : i % 3 == 0
                                      ? "Cyan"
                                      : i % 4 == 0
                                        ? "Yellow"
                                        : i % 5 == 0
                                          ? "DarkGreen"
                                          : "Pink"
                            }
                          >
                            <figure>
                              <img src={item?.categoryImage} />
                            </figure>
                          </aside>
                          <h4
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={item?.categoryName}
                          >
                            {item?.categoryName}
                          </h4>
                        </div>
                      </div>
                    </div>
                  );
                })
                : ""}
            </div>
          </div>
        </div>
        <div className="BirthdayDecorationArea">
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
              if (item?.dealbannerTitle == "Birthday Decoration") {
                return (
                  <img
                    key={i}
                    src={item?.dealbannerImage}
                    onClick={() =>
                      handleCategory({ categoryName: "BIRTHDAY" })
                    }
                    style={{ cursor: "pointer" }}
                  />
                );
              }
            })
            : ""}
          {/* </Slider> */}
        </div>

        <div className="BirthdayDecorationArea BirthDecImage">
          <div className="container-fluid">
            <div className="section-title">
              <h2>Birthday Decoration</h2>
              <p>
                Transform Your Birthday into a Magical Celebration with Stunning
                Decorations!
              </p>
            </div>

            <div className="scroll-container-wrapper">
              {/* Left Arrow */}
              <div
                className="custom-arrow prev birthday-scroll-arrow"
                onClick={handleScrollLeft}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <i className="fa-solid fa-angle-left"></i>
              </div>

              {/* Right Arrow */}
              <div
                className="custom-arrow next birthday-scroll-arrow"
                onClick={handleScrollRight}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <i className="fa-solid fa-angle-right"></i>
              </div>

              {/* Scrollable Content */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="birthday-scroll-container"
              >
                {getBirthdayList?.data?.length > 0 ? (
                  getBirthdayList?.data?.map((item, i) => {
                    return (
                      <div key={i} className="birthday-item">
                        <div className="PrivateDiningBox flexDirection">
                          <figure>
                            <img
                              src={item?.productimages?.at(0)}
                              onClick={() => handleProduct(item)}
                              style={{ cursor: 'pointer' }}
                            />
                          </figure>
                          <h6>{item?.productDetails?.productname}</h6>
                          <div className="loc">
                            <h1> At your location</h1>
                          </div>
                          <div className="Info">
                            <button
                              className="Buttons"
                              onClick={() => handleProduct(item)}
                            >
                              Book
                            </button>
                            <div className="text-right">
                              <div className="priceArea">
                                {item?.priceDetails?.discountedPrice ? (
                                  <h5>
                                    ₹{item?.priceDetails?.discountedPrice}
                                    <p className="actualPrice">
                                      ₹{item?.priceDetails?.price}
                                    </p>
                                  </h5>
                                ) : (
                                  <h5>₹{item?.priceDetails?.price}</h5>
                                )}
                                {item?.priceDetails?.discountedPrice ? (
                                  <span>
                                    {Math.round(
                                      ((Number(item?.priceDetails?.price) -
                                        Number(
                                          item?.priceDetails?.discountedPrice
                                        )) /
                                        Number(item?.priceDetails?.price)) *
                                      100
                                    )}
                                    % off
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                              <p>
                                4.8 <i className="fa-solid fa-star"></i> |{" "}
                                {i % 2 == 0 && i !== 0
                                  ? `${i % 2}` + 5 + i - 1
                                  : i == 0
                                    ? `14${i % 2}`
                                    : `${i % 2}` + 2 + i - 1}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No item Available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="viewAll">
          <a
            style={{
              "text-decoration": "underline",
              color: "#2BA501",
              fontSize: "17px",
            }}
            onClick={() => handleCategory({ categoryName: "BIRTHDAY" })}
          >
            View All
          </a>
        </div>

        <div className="BirthdayDecorationArea">
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
              if (item?.dealbannerTitle == "Anniversary Decoration") {
                return (
                  <img
                    key={i}
                    src={item?.dealbannerImage}
                    onClick={() =>
                      handleCategory({ categoryName: "ANNIVERSARY" })
                    }
                    style={{ cursor: "pointer" }}
                  />
                );
              }
            })
            : ""}
          {/* </Slider> */}
        </div>

        <div className="BirthdayDecorationArea AnniDecImage">
          <div className="container-fluid">
            <div className="section-title">
              <h2>Anniversary Decoration</h2>
              <p>
                Celebrate Your Love with Elegant & Breathtaking Anniversary
                Decorations!
              </p>
            </div>

            <div className="scroll-container-wrapper">
              {/* Left Arrow */}
              <div
                className="custom-arrow prev anniversary-scroll-arrow"
                onClick={handleAnniversaryScrollLeft}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <i className="fa-solid fa-angle-left"></i>
              </div>

              {/* Right Arrow */}
              <div
                className="custom-arrow next anniversary-scroll-arrow"
                onClick={handleAnniversaryScrollRight}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <i className="fa-solid fa-angle-right"></i>
              </div>

              {/* Scrollable Content */}
              <div
                ref={anniversaryScrollRef}
                className="anniversary-scroll-container"
              >
                {getAnniversaryList?.data?.length > 0 ? (
                  getAnniversaryList?.data?.map((item, i) => {
                    return (
                      <div key={i} className="anniversary-item">
                        <div className="PrivateDiningBox flexDirection">
                          <figure>
                            <img
                              src={item?.productimages?.at(0)}
                              onClick={() => handleProduct(item)}
                              style={{ cursor: 'pointer' }}
                            />
                          </figure>
                          <h6>{item?.productDetails?.productname}</h6>
                          <div className="loc">
                            <h1> At your location</h1>
                          </div>
                          <div className="Info">
                            <button
                              className="Buttons"
                              onClick={() => handleProduct(item)}
                            >
                              Book
                            </button>
                            <div className="text-right">
                              <div className="priceArea">
                                {item?.priceDetails?.discountedPrice ? (
                                  <h5>
                                    ₹{item?.priceDetails?.discountedPrice}
                                    <p className="actualPrice">
                                      ₹{item?.priceDetails?.price}
                                    </p>
                                  </h5>
                                ) : (
                                  <h5>₹{item?.priceDetails?.price}</h5>
                                )}
                                {item?.priceDetails?.discountedPrice ? (
                                  <span>
                                    {Math.round(
                                      ((Number(item?.priceDetails?.price) -
                                        Number(
                                          item?.priceDetails?.discountedPrice
                                        )) /
                                        Number(item?.priceDetails?.price)) *
                                      100
                                    )}
                                    % off
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                              <p>
                                4.8 <i className="fa-solid fa-star"></i> |{" "}
                                {i % 2 == 0 && i !== 0
                                  ? `${i % 2}` + 5 + i - 1
                                  : i == 0
                                    ? `14${i % 2}`
                                    : `${i % 2}` + 2 + i - 1}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No item Available</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="viewAll">
          <a
            style={{
              "text-decoration": "underline",
              color: "#2BA501 ",
              fontSize: "17px",
            }}
            onClick={() => handleCategory({ categoryName: "ANNIVERSARY" })}
          >
            View All
          </a>
        </div>

        <div className="BirthdayDecorationArea" style={{ cursor: "pointer" }}>
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
              if (item?.dealbannerTitle == "Kids Party") {
                return (
                  <img
                    key={i}
                    src={item?.dealbannerImage}
                    onClick={() =>
                      handleCategory({ categoryName: "KID'S PARTY" })
                    }
                  />
                );
              }
            })
            : ""}
          {/* </Slider> */}
        </div>

        <div className="BirthdayDecorationArea BirthDecImage">
          <div className="container-fluid">
            <div className="section-title">
              <h2>Kid's Party</h2>
              <p>
                Turn Your Kid's Party into a Whimsical Wonderland of Fun &
                Magic!
              </p>
            </div>

            <div className="scroll-container-wrapper">
              {/* Left Arrow */}
              <div
                className="custom-arrow prev kids-scroll-arrow"
                onClick={handleKidsScrollLeft}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <i className="fa-solid fa-angle-left"></i>
              </div>

              {/* Right Arrow */}
              <div
                className="custom-arrow next kids-scroll-arrow"
                onClick={handleKidsScrollRight}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <i className="fa-solid fa-angle-right"></i>
              </div>

              {/* Scrollable Content */}
              <div
                ref={kidsScrollRef}
                className="kids-scroll-container"
              >
                {getKidsList?.data?.length > 0 ? (
                  getKidsList?.data?.map((item, i) => {
                    return (
                      <div key={i} className="kids-item">
                        <div className="PrivateDiningBox flexDirection">
                          <figure>
                            <img
                              src={item?.productimages?.at(0)}
                              onClick={() => handleProduct(item)}
                              style={{ cursor: 'pointer' }}
                            />
                          </figure>
                          <h6>{item?.productDetails?.productname}</h6>
                          <div className="loc">
                            <h1> At your location</h1>
                          </div>
                          <div className="Info">
                            <button
                              className="Buttons"
                              onClick={() => handleProduct(item)}
                            >
                              Book
                            </button>
                            <div className="text-right">
                              <div className="priceArea">
                                {item?.priceDetails?.discountedPrice ? (
                                  <h5>
                                    ₹{item?.priceDetails?.discountedPrice}
                                    <p className="actualPrice">
                                      ₹{item?.priceDetails?.price}
                                    </p>
                                  </h5>
                                ) : (
                                  <h5>₹{item?.priceDetails?.price}</h5>
                                )}
                                {item?.priceDetails?.discountedPrice ? (
                                  <span>
                                    {Math.round(
                                      ((Number(item?.priceDetails?.price) -
                                        Number(
                                          item?.priceDetails?.discountedPrice
                                        )) /
                                        Number(item?.priceDetails?.price)) *
                                      100
                                    )}
                                    % off
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                              <p>
                                4.8 <i className="fa-solid fa-star"></i> |{" "}
                                {i % 2 == 0 && i !== 0
                                  ? `${i % 2}` + 5 + i - 1
                                  : i == 0
                                    ? `14${i % 2}`
                                    : `${i % 2}` + 2 + i - 1}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No item Available</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="viewAll">
          <a
            style={{
              "text-decoration": "underline",
              color: "#2BA501",
              fontSize: "17px",
            }}
            onClick={() => handleCategory({ categoryName: "KID'S PARTY" })}
          >
            View All
          </a>
        </div>

        <div className="BirthdayDecorationArea" style={{ cursor: "pointer" }}>
          {/* <Slider {...settings1}> */}
          {getDealBannerList?.data?.length > 0
            ? getDealBannerList?.data?.map((item, i) => {
              if (item?.dealbannerTitle == "Baby Shower") {
                return (
                  <img
                    key={i}
                    src={item?.dealbannerImage}
                    onClick={() =>
                      handleCategory({ categoryName: "BABY SHOWER" })
                    }
                  />
                );
              }
            })
            : ""}
          {/* </Slider> */}
        </div>

        <div className="BirthdayDecorationArea AnniDecImage">
          <div className="container-fluid">
            <div className="section-title">
              <h2>Baby Shower</h2>
              <p>
                Celebrate the Joy of New Beginnings with Enchanting Baby Shower
                Decor!
              </p>
            </div>

            <div className="scroll-container-wrapper">
              {/* Left Arrow */}
              <div
                className="custom-arrow prev baby-shower-scroll-arrow"
                onClick={handleBabyShowerScrollLeft}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <i className="fa-solid fa-angle-left"></i>
              </div>

              {/* Right Arrow */}
              <div
                className="custom-arrow next baby-shower-scroll-arrow"
                onClick={handleBabyShowerScrollRight}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <i className="fa-solid fa-angle-right"></i>
              </div>

              {/* Scrollable Content */}
              <div
                ref={babyShowerScrollRef}
                className="baby-shower-scroll-container"
              >
                {getWeddingDecoList?.data?.length > 0 ? (
                  getWeddingDecoList?.data?.map((item, i) => {
                    return (
                      <div key={i} className="baby-shower-item">
                        <div className="PrivateDiningBox flexDirection">
                          <figure>
                            <img
                              src={item?.productimages?.at(0)}
                              onClick={() => handleProduct(item)}
                              style={{ cursor: 'pointer' }}
                            />
                          </figure>
                          <h6>{item?.productDetails?.productname}</h6>
                          <div className="loc">
                            <h1> At your location</h1>
                          </div>
                          <div className="Info">
                            <button
                              className="Buttons"
                              onClick={() => handleProduct(item)}
                            >
                              Book
                            </button>
                            <div className="text-right">
                              <div className="priceArea">
                                {item?.priceDetails?.discountedPrice ? (
                                  <h5>
                                    ₹{item?.priceDetails?.discountedPrice}
                                    <p className="actualPrice">
                                      ₹{item?.priceDetails?.price}
                                    </p>
                                  </h5>
                                ) : (
                                  <h5>₹{item?.priceDetails?.price}</h5>
                                )}
                                {item?.priceDetails?.discountedPrice ? (
                                  <span>
                                    {Math.round(
                                      ((Number(item?.priceDetails?.price) -
                                        Number(
                                          item?.priceDetails?.discountedPrice
                                        )) /
                                        Number(item?.priceDetails?.price)) *
                                      100
                                    )}
                                    % off
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                              <p>
                                4.8 <i className="fa-solid fa-star"></i> |{" "}
                                {i % 2 == 0 && i !== 0
                                  ? `${i % 2}` + 5 + i - 1
                                  : i == 0
                                    ? `14${i % 2}`
                                    : `${i % 2}` + 2 + i - 1}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No item Available</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="viewAll">
          <a
            style={{
              "text-decoration": "underline",
              color: "#2BA501",
              fontSize: "17px",
            }}
            onClick={() => handleCategory({ categoryName: "BABY SHOWER" })}
          >
            View All
          </a>
        </div>
        <div className="BirthdayDecorationArea">
          <img src={require("../../assets/images/Photos 1.png")} />
        </div>
        <article>
          <img
            style={{ margin: "10px 0" }}
            src={require("../../assets/images/stats 2.png")}
          />
        </article>


        <div class="reviews">
          <h1 > Recent Customer Review </h1>
          <div class="inro">

            <div class="testimonials ">
              <div class="data">
                <div className="img">

                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />
                </div>
                <h2> Rahul </h2>
                <h3> Verified Purchase </h3>

                <p>very nice product</p>



                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>
              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Kunal </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Manya </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Shubham </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Raghav </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Tushar </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Siddharth </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Sumit </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Sanchit </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Tushika </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Yashika </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Neha </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Vansh </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>



              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Alok </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Prashant </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Ankita </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
            <div class="testimonials ">
              <div className="data">
                <div className="img">
                  <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="" />

                </div>
                <h2> Ankita </h2>
                <h3> Verified Purchase </h3>
                <p>very nice product</p>
                <div class="reviwedproduct">
                  <div class="image">
                    <img src="https://cheetah.cherishx.com/uploads/66a130a2fd89260dbe1e8e754e1f8a20_original.jpg" alt="" />
                  </div>
                  <div className="view">
                    Safari birthday package
                  </div>


                </div>

              </div>



            </div>
          </div>
        </div>

        <div className="text">
          <h1>
            <strong> Skyrixe – Celebrate Life’s Special Moments with us
              Us&nbsp;&nbsp;&nbsp;</strong>
          </h1>
          <p>
            <span>Each celebratory occasion needs a unique touch of excellence.
              Skyrixe&nbsp; devotes itself to providing memorable experiences for every
              moment. Do you&nbsp; remember the last time you got services tailored for
              you? Neither can we, and that’s exactly why we go above and beyond
              every single time, making sure that every service we offer is truly
              remarkable. With our setup services, every special moment can come to life.
              We provide romantic dinners and simple birthday decorations.</span>
          </p>
          <p class='second'>
            <span>In our ten years of operation, we have held many events across India. We
              have served thousands of customers as they created special memories. Our
              dedicated team creates impressive event experiences for our customers. We
              enhance celebrations with balloon decorations and themed party decor. We
              cater to both small home events and large banquet functions.</span>
          </p>
          <h2>
            <strong>Our Services – Fully Customizable For Your Every Event</strong>
          </h2>
          <p>
            <span>Every event requires a personalized touch to be unique. Skyrixe provides
              decoration solutions for basic birthday arrangements, anniversary
              decorations, and complete surprise party preparations. Our deep experience
              with multiple event decoration services enhances your special moments on all
              occasions.</span>
          </p>
          <button class="show"> Show more</button>
        </div>
        <div className="BirthdayDecorationArea client">

          <img src={require("../../assets/images/Our Clients.png")} />


        </div>
      </div>
      <Tooltip id="my-tooltip" place="bottom" />
    </>
  );
};

export default Main;
