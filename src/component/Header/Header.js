import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SignUp from "../Modals/SignUp";
import { useDispatch, useSelector } from "react-redux";
import CategoryMenu from "./CategoryMenu";
import "../Header/CitySelection.css"
import delhi from "../delhi.png"
import {
  anniversaryDecoList,
  birthdayDecoList,
  categoryList,
  categorySubCatList,
  cityList,
  dealBannerList,
  kidsDecoList,
  topBannerList,
  userDetailState,
  weddingBalloonDecoList,
} from "../../reduxToolkit/Slices/ProductList/listApis";
import {
  deleteCartProduct,
  orderSummary,
} from "../../reduxToolkit/Slices/Cart/bookingApis";
import { getPathName } from "../../Utils/commonFunctions";
import { toast } from "react-toastify";

const initialState = {
  signUpModal: false,
  selectCity: "",
  cancelsState: false,
  search: "",
  citySearch: "",
  openSidebar: false,
};

const Header = () => {
  const [iState, updateState] = useState(initialState);
  let categoryArr = ["Birthday", "Anniversary", "Kid's Party", "Baby Shower"];
  const dispatch = useDispatch();
  const pathDetail = useLocation();

  const navigate = useNavigate();
  const [disableHover, setDisableHover] = useState(false);

  const { selectCity, cancelsState, search, citySearch, openSidebar } = iState;
  const { getUserDetailState, getCityList, getCategorySubCatList } =
    useSelector((state) => state.productList);
  const LoginTimer = JSON.parse(window.localStorage.getItem("LoginTimer"));
  const { getOrderSummaryDetail } = useSelector((state) => state.orderSummary);
  const [userDetail, setUserDetail] = useState(() => {
    return JSON.parse(window.localStorage.getItem("LennyUserDetail")) || null;
  });

   const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Select Your City');

const cities = [
  { name: "Delhi NCR", img:delhi },
  { name: "Jaipur", img: delhi },
  { name: "Bangalore", img:delhi },
  { name: "Kolkata", img:delhi },
  { name: "Indore", img: delhi },
  { name: "Pune", img:delhi },
  { name: "Across India", img:delhi },
  { name: "Hyderabad", img:delhi },
  { name: "Mumbai", img:delhi },
  { name: "Kanpur", img: delhi },
  { name: "Chennai", img:delhi },
  { name: "Jammu", img: delhi },
];

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsPopupOpen(false);
  };

  const handleCategory = (item, subCat) => {
    setDisableHover(true);
    updateState({ ...iState, openSidebar: false });
    navigate("/products", { state: { item, subCat, selectCity } });
    // setDisableHover(false);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleDeleteProduct = () => {
    const data = {
      id: getOrderSummaryDetail?.data?._id,
    };
    console.log({ data });
    dispatch(deleteCartProduct(data)).then((res) => {
      console.log({ res });
      if (res?.payload?.status == 200) {
        toast?.success(res?.payload?.message);
        dispatch(orderSummary({ userId: userDetail?._id }));
        navigate("/");
        window.scrollTo({ top: 150, behavior: "smooth" });
      }
    });
  };

  const [showCityPopup, setShowCityPopup] = useState(false);

  useEffect(() => {
    if (getUserDetailState) {
      setUserDetail(JSON.parse(window.localStorage.getItem("LennyUserDetail")));
    } else {
      setUserDetail(null);
    }
    if (selectCity) {
      dispatch(birthdayDecoList({ selectCity }));
      dispatch(anniversaryDecoList({ selectCity }));
      dispatch(kidsDecoList({ selectCity }));
      dispatch(weddingBalloonDecoList({ selectCity }));
      dispatch(categorySubCatList());
    }
    dispatch(orderSummary({ userId: userDetail?._id }));
  }, [getUserDetailState, selectCity]);

  useEffect(() => {
    dispatch(cityList());
    dispatch(categoryList());
    dispatch(dealBannerList());
    dispatch(topBannerList());
    dispatch(orderSummary({ userId: userDetail?._id }));

    window.localStorage.setItem("LoginTimer", userDetail?._id ? false : true);
  }, []);

  useEffect(() => {
    if (getCityList && citySearch == "") {
      updateState({
        ...iState,
        selectCity: getCityList?.data?.at(0)?.cityName,
      });
      window.localStorage?.setItem(
        "LennyCity",
        getCityList?.data?.at(0)?.cityName
      );
      window.localStorage?.setItem(
        "LennyPincode",
        JSON.stringify(getCityList?.data?.at(0)?.pincode)
      );
    }
  }, [getCityList]);

  useEffect(() => {
    if (search) {
      navigate("/search/products", { state: search });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (!search && pathDetail?.pathname == "/search/products") {
      navigate("/");
    }
  }, [search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const data = { search: citySearch };
      dispatch(cityList(data));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [citySearch]);

  useEffect(() => {
    if (LoginTimer) {
      const timeoutId = setInterval(() => {
        console.log("start");
        updateState({ ...iState, signUpModal: true });
        window.localStorage.setItem("LoginTimer", false);
      }, 500000);

      return () => clearInterval(timeoutId);
    }
  }, [LoginTimer]);

  console.log({ LoginTimer });
  return (
    <>
      <header className="newHeader">
        <nav class="navbar navbar-expand-lg navbar-light">
          <div class="container-fluid">
            <div className="logoArea">
              {openSidebar ? (
                <a
                  href="#"
                  onClick={() => updateState({ ...iState, openSidebar: false })}
                  className="navbar-toggler"
                  id="navbarToggleClose"
                  style={{ display: "block" }}
                >
                  <i class="fa-solid fa-xmark"></i>
                </a>
              ) : (
                <a
                  href="#"
                  onClick={() => updateState({ ...iState, openSidebar: true })}
                  className="navbar-toggler"
                  id="navbarToggle"
                >
                  <i class="fa-solid fa-bars-staggered"></i>
                </a>
              )}
              <a
                className="navbar-brand"
                onClick={() => {
                  updateState({ ...iState, search: "" });
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <img src={require("../../assets/images/Header_Logo.png")} />
              </a>
            </div>
            <form class="headerTwoBtn d-block d-lg-none">
              <div className="d-flex">
             

                {/* <button class="loginBtn" type="submit">
                  Login
                </button> */}
              </div>
            </form>
            <ul className="CategoriesResponsive2">
              <li className="nav-item dropdown-item Categories">
                <div
                  className={`Categories_hover ${
                    disableHover ? "disable-hover" : ""
                  }`}
                >
                  <div className="CategoriesMenu">
                    <p>All Categories</p>

                    <div className="Categories_dropdown">
                      <article>
                        {getCategorySubCatList?.data?.length > 0
                          ? getCategorySubCatList?.data?.map((item, i) => {
                              return (
                                <aside key={i}>
                                  <h6
                                  // style={{ color: i%2==0 ? "#02366F" : "Orange" }}
                                  >
                                    {item?.categoryName}
                                  </h6>
                                  <ul>
                                    {item?.subcategories?.length > 0
                                      ? item?.subcategories?.map(
                                          (subCat, index) => {
                                            if (index <= 4) {
                                              return (
                                                <li key={index}>
                                                  <a
                                                    onClick={() =>
                                                      handleCategory(
                                                        item,
                                                        subCat
                                                      )
                                                    }
                                                  >
                                                    {subCat}
                                                  </a>
                                                </li>
                                              );
                                            }
                                          }
                                        )
                                      : ""}
                                  </ul>
                                  <div className="category-border"></div>
                                </aside>
                              );
                            })
                          : ""}
                      </article>
                    </div>
                  </div>
                </div>

                <div className="CategoriesSearch">
                  <input
                    name="search"
                    value={search}
                    onChange={(e) => {
                      updateState({ ...iState, search: e.target.value });
                    }}
                    className="form-control me-2"
                    type="search"
                    placeholder="What are you looking for ?"
                  />
                  <span>
                    <img
                      src={require("../../assets/images/search-normal.png")}
                    />
                  </span>
                </div>
              </li>
            </ul>

            {/* <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button> */}
            <div
              class={`collapse navbar-collapse ${openSidebar ? "Left" : ""}`}
              id={`${openSidebar ? "navbarSupportedContent" : "link"}`}
            >
              <ul style={{
                padding:"10px"
              }} class="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
               <></>
                <li className="nav-item dropdown-item Categories your-class">
                  <div
                    className={`Categories_hover ${
                      disableHover ? "disable-hover" : ""
                    }`}
                  >
                    {/* <div
                      className="CategoriesMenu"
                      onMouseEnter={() => setDisableHover(false)}
                    >
                      <p>All Categories</p>
                      <div className="Categories_dropdown">
                        <article>
                          {getCategorySubCatList?.data?.length > 0
                            ? getCategorySubCatList?.data?.map((item, i) => {
                                return (
                                  <aside key={i}>
                                    <h6
                                    // style={{ color: i%2==0 ? "#02366F" : "Orange" }}
                                    >
                                      {item?.categoryName}
                                    </h6>
                                    <ul>
                                      {item?.subcategories?.length > 0
                                        ? item?.subcategories?.map(
                                            (subCat, index) => {
                                              if (index <= 4) {
                                                return (
                                                  <li key={index}>
                                                    <a
                                                      onClick={() =>
                                                        handleCategory(
                                                          item,
                                                          subCat
                                                        )
                                                      }
                                                    >
                                                      {subCat}
                                                    </a>
                                                  </li>
                                                );
                                              }
                                            }
                                          )
                                        : ""}
                                    </ul>
                                    <div className="category-border"></div>
                                  </aside>
                                );
                              })
                            : ""}
                        </article>
                      </div>
                    </div> */}
                  </div>

                  <div className="CategoriesSearch">
                    <input
                      name="search"
                      value={search}
                      onChange={(e) => {
                        updateState({ ...iState, search: e.target.value });
                      }}
                      className="form-control me-2"
                      type="search"
                      placeholder="What are you looking for ?"
                    />
                    <span>
                      <img
                        src={require("../../assets/images/search-normal.png")}
                      />
                    </span>
                  </div>
                </li>
                <li className="nav-item dropdown-item Categories d-block d-lg-none">
                  <div
                    className={`Categories_hover ${
                      disableHover ? "disable-hover" : ""
                    }`}
                  >
                    <div
                      className="CategoriesMenu"
                      onMouseEnter={() => setDisableHover(false)}
                    >
                      <p>All Categories</p>
                      <div className="Categories_dropdown">
                        <article>
                          {getCategorySubCatList?.data?.length > 0
                            ? getCategorySubCatList?.data?.map((item, i) => {
                                return (
                                  <aside key={i}>
                                    <h6
                                    // style={{ color: i%2==0 ? "#02366F" : "Orange" }}
                                    >
                                      {item?.categoryName}
                                    </h6>
                                    <ul>
                                      {item?.subcategories?.length > 0
                                        ? item?.subcategories?.map(
                                            (subCat, index) => {
                                              if (index <= 4) {
                                                return (
                                                  <li key={index}>
                                                    <a
                                                      onClick={() =>
                                                        handleCategory(
                                                          item,
                                                          subCat
                                                        )
                                                      }
                                                    >
                                                      {subCat}
                                                    </a>
                                                  </li>
                                                );
                                              }
                                            }
                                          )
                                        : ""}
                                    </ul>
                                    <div className="category-border"></div>
                                  </aside>
                                );
                              })
                            : ""}
                        </article>
                      </div>
                    </div>
                  </div>

                  <div className="CategoriesSearch d-none">
                    <input
                      name="search"
                      value={search}
                      onChange={(e) => {
                        updateState({ ...iState, search: e.target.value });
                      }}
                      className="form-control me-2"
                      type="search"
                      placeholder="Find the perfect decor for your special event.."
                    />
                    <span>
                      <img
                        src={require("../../assets/images/search-normal.png")}
                      />
                    </span>
                  </div>
                </li>
              </ul>
              <form class="headerTwoBtn your-class">
                <div className="d-flex align-items-center">

                     <div className="city-popup-container">
      <button
        onClick={togglePopup}
        className="city-selection-button"
      >
        {selectedCity}
        <br/>
        <span className="dropdown-icon">
          <svg
  className={`icon ${isPopupOpen ? 'rotate' : ''}`}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="currentColor"
>
  <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 
           0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
</svg>
        </span>
      </button>

      {isPopupOpen && (
        <div className="city-popup">
          <div className="popup-header">
            <h3>Select your City</h3>
            <p>Find more than 3000 decorations, gifts and surprises!</p>
          </div>
          
          <div className="city-list">
      <div className="city-grid" role="list">
        {cities.map((city) => (
          <button
            key={city.name}
            type="button"
            role="listitem"
            aria-pressed={selectedCity === city.name}
            onClick={() => handleCitySelect(city)}
            className={`city-item ${selectedCity === city.name ? "selected" : ""}`}
          >
            <img
              src={city.img}
              alt=""
              className="city-icon"
              loading="lazy"
              width="72"
              height="72"
            />
            <span className="city-label">{city.name}</span>
          </button>
        ))}
      </div>
    </div>
        </div>
      )}
    </div>

                  {userDetail && getOrderSummaryDetail ? (
                    <div className="Icons Avater">
                      <a className="UserIcon subAvater">
                        <img
                          src={require("../../assets/images/shopping-cart.png")}
                        />
                      </a>
                      <div className="cartArea">
                        <h5>Complete Your Booking</h5>
                        <div className="row">
                          <div className="col-6">
                            <img
                              src={getOrderSummaryDetail?.data?.productImage}
                            />
                          </div>
                          <div className="col-6">
                            <div className="ProdectDec">
                              <h6>
                                {getOrderSummaryDetail?.data?.productName}
                              </h6>
                              <p>
                                For Date: {}
                                {getOrderSummaryDetail?.data?.dateAdded}
                              </p>

                              <div className="Links">
                                <a
                                  style={{ marginRight: "25px" }}
                                  onClick={handleDeleteProduct}
                                >
                                  Cancel
                                </a>
                                <a
                                  onClick={() =>
                                    navigate("/checkout-1", {
                                      state: { userId: userDetail?._id },
                                    })
                                  }
                                >
                                  Checkout
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <ul className="Icons">
                    <li>
                      {userDetail ? (
                        <Link to="/profile" className="UserIcon">
                          <img src={require("../../assets/images/user.png")} />
                        </Link>
                      ) : (
                        <a
                          onClick={() =>
                            updateState({ ...iState, signUpModal: true })
                          }
                          class="Login loginBtn"
                        >
                          Login
                        </a>
                      )}
                    </li>

                  </ul>
                   

                  {/* <button class="loginBtn" type="submit">
                    Login
                  </button> */}
                </div>
              </form>
            </div>

            <div className="searchLoginIcon d-block d-lg-none">
              {/* <a href="#" className="resNav searchIcon">
                <i class="fa-solid fa-magnifying-glass"></i>
              </a>

              <a href="#" className="resNav loginIcon">
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
              </a> */}
              <ul className="Icons responsiveLogin ">
                <li>
                  {userDetail ? (
                    <Link to="/profile" className="UserIcon">
                      <img src={require("../../assets/images/user.png")} />
                    </Link>
                  ) : (
                    <a
                      onClick={() =>
                        updateState({ ...iState, signUpModal: true })
                      }
                      class="Login loginBtn ml-0 ms-0"
                    >
                      Login
                    </a>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <ul className="CategoriesResponsive hidePara">
          <li className="nav-item dropdown-item Categories">
            <div
              className={`Categories_hover ${
                disableHover ? "disable-hover" : ""
              }`}
            >
              <div className="CategoriesMenu">
                <p>All Categories</p>

                <div className="Categories_dropdown">
                  <article>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          return (
                            <aside key={i}>
                              <h6
                              // style={{ color: i%2==0 ? "#02366F" : "Orange" }}
                              >
                                {item?.categoryName}
                              </h6>
                              <ul>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        if (index <= 4) {
                                          return (
                                            <li key={index}>
                                              <a
                                                onClick={() =>
                                                  handleCategory(item, subCat)
                                                }
                                              >
                                                {subCat}
                                              </a>
                                            </li>
                                          );
                                        }
                                      }
                                    )
                                  : ""}
                              </ul>
                              <div className="category-border"></div>
                            </aside>
                          );
                        })
                      : ""}
                  </article>
                </div>
              </div>
            </div>

            <div className="CategoriesSearch" style={{ height: "42px" }}>
              <input
                name="search"
                value={search}
                onChange={(e) => {
                  updateState({ ...iState, search: e.target.value });
                }}
                className="form-control me-2"
                type="search"
                placeholder="Find the perfect decor for your special event.."
              />
              <span>
                <img src={require("../../assets/images/search-normal.png")} />
              </span>
            </div>
          </li>
        </ul>
      </header>
      <CategoryMenu/>

      <SignUp iState={iState} updateState={updateState} />
    </>
  );
};

export default Header;
