import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import { Carousel } from "bootstrap";
import { Tooltip } from "react-tooltip";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-tooltip/dist/react-tooltip.css";
const Main = () => {
  const {
    getBirthdayList,
    getAnniversaryList,
    getKidsList,
    getWeddingDecoList,
    getCategoryList,
    getDealBannerList,
    getTopBannerList,
  } = useSelector((state) => state.productList);

  const navigate = useNavigate();
  const selectCity = window.localStorage.getItem("LennyCity");

  const banners = Array.isArray(getTopBannerList?.data)
    ? getTopBannerList.data.filter((b) => b?.bannerImage)
    : [];
  const hasBanners = banners.length > 0;
  const showControls = banners.length > 1;

  const handleCategory = (item, subCat) => {
    navigate("/products", { state: { item, subCat, selectCity } });
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleProduct = (item) => {
    navigate("/products/product-details", { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const el = document.querySelector("#carouselExampleIndicators");
    if (!el) return;

    const instance = Carousel.getOrCreateInstance(el, {
      interval: 5000,
      pause: false,
      ride: "carousel",
      touch: true,
      wrap: true,
      keyboard: true,
    });

    return () => {
      try {
        instance.dispose();
      } catch {}
    };
  }, []);

  console.log({ getBirthdayList });
  console.log({ getDealBannerList });
  return (
    <>
      <div className="hero-section">
        <div
          id="carouselExampleIndicators"
          className="carousel slide" 
          data-bs-ride="carousel"
          data-bs-interval="5000"
          data-bs-wrap="true"
          data-bs-touch="true"
          data-bs-pause="false"
        >
          {/* Indicators */}
          {hasBanners && banners.length > 1 && (
            <div className="carousel-indicators">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to={i}
                  className={i === 0 ? "active" : ""}
                  aria-current={i === 0 ? "true" : undefined}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slides */}
          <div className="carousel-inner">
            {hasBanners &&
              banners.map((item, i) => (
                <div
                  key={i}
                  className={`carousel-item ${i === 0 ? "active" : ""}`}
                >
                  <div className="image-wrapper">
                    <img
                      src={item.bannerImage}
                      className="d-block w-100 hero-image"
                      alt={item?.alt || `Banner ${i + 1}`}
                      loading={i === 0 ? "eager" : "lazy"}
                    />

                    {/* Gradient overlay */}
                    <div className="gradient-overlay" />

                    {/* Optional pattern overlay (toggle with CSS class 'show' if needed) */}
                    <div className="pattern-overlay" />

                    {/* Captions (optional) */}
                    {(item?.title || item?.subtitle) && (
                      <div className="carousel-caption d-none d-md-block">
                        <h3>
                          {item?.title || "Make your pre-wedding celebration dreamy"}
                        </h3>
                        <p>
                          {item?.subtitle ||
                            "Decorations for Roka, Engagement, Mehendi, Haldi, Sangeet"}
                        </p>

                        {item?.ctaLabel && item?.ctaHref && (
                          <a className="btn btn-accent" href={item.ctaHref}>
                            {item.ctaLabel}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="Main">
        <div className="FeatureArea">
          <div className="container-fluid" style={{ width: "96%" }}>
            <div className="section-title">
              <h2>Features Category</h2>
            </div>

            {/* Grid fallback instead of Slider */}
            <div className="row">
              {getCategoryList?.data?.length > 0
                ? getCategoryList?.data?.map((item, i) => {
                    return (
                      <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
                        <div className="FeatureBoxMain">
                          <div className="FeatureBox">
                            <aside
                              style={{ cursor: "pointer" }}
                              onClick={() => handleCategory(item)}
                              className={
                                i === 0
                                  ? "Blue"
                                  : i === 1
                                  ? "Green"
                                  : i % 2 === 0
                                  ? "Orange"
                                  : i % 3 === 0
                                  ? "Cyan"
                                  : i % 4 === 0
                                  ? "Yellow"
                                  : i % 5 === 0
                                  ? "DarkGreen"
                                  : "Pink"
                              }
                            >
                              <figure>
                                <img src={item?.categoryImage} alt={item?.categoryName || "Category"} />
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
            <div className="row gy-sm-5 gy-2">
              {getBirthdayList?.data?.length > 0 ? (
                getBirthdayList?.data?.map((item, i) => {
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
                      <div className="PrivateDiningBox flexDirection">
                        <figure>
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                          />
                        </figure>
                        <h6>{item?.productDetails?.productname}</h6>
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
                              4.8 <i class="fa-solid fa-star"></i> |{" "}
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
            <div className="row gy-sm-5 gy-2">
              {getAnniversaryList?.data?.length > 0 ? (
                getAnniversaryList?.data?.map((item, i) => {
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
                      <div className="PrivateDiningBox flexDirection">
                        <figure>
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                          />
                        </figure>
                        <h6>{item?.productDetails?.productname}</h6>
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
                              4.8 <i class="fa-solid fa-star"></i> |{" "}
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

        <div className="viewAll">
          <a
            style={{
              "text-decoration": "underline",
              color: "#2BA501",
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
                Turn Your Kid’s Party into a Whimsical Wonderland of Fun &
                Magic!
              </p>
            </div>
            <div className="row gy-5">
              {getKidsList?.data?.length > 0 ? (
                getKidsList?.data?.map((item, i) => {
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
                      <div className="PrivateDiningBox flexDirection">
                        
                        <figure>
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                          />
                        </figure>

                        <h6>{item?.productDetails?.productname}</h6>
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
                              4.8 <i class="fa-solid fa-star"></i> |{" "}
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
            <div className="row gy-5">
              {getWeddingDecoList?.data?.length > 0 ? (
                getWeddingDecoList?.data?.map((item, i) => {
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={i}>
                      <div className="PrivateDiningBox flexDirection">
                        <figure>
                          <img
                            src={item?.productimages?.at(0)}
                            onClick={() => handleProduct(item)}
                          />
                        </figure>
                        <h6>{item?.productDetails?.productname}</h6>
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
                              4.8 <i class="fa-solid fa-star"></i> |{" "}
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
        <div className="BirthdayDecorationArea">
          <img src={require("../../assets/images/Our Clients.png")} />
        </div>
      </div>
      <Tooltip id="my-tooltip" place="bottom" />
    </>
  );
};

export default Main;
