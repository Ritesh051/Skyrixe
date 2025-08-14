<>
<header>
<div className="container-fluid">
  <nav>
    <a
      className="navbar-brand"
      onClick={() => {
        updateState({ ...iState, search: "" });
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      style={{ width: "100px" }}
    >
      <img src={require("../../assets/images/skyrixe logo.png")} />
    </a>
    <div className="CatMenu">
      <ul>
        {categoryArr?.map((category_name, index) => {
          return (
            <>
              <li className="CatMenu_dropdown" key={index}>
                <a
                  style={{
                    "--hover-color": `${
                      index == 0
                        ? "#f26a10"
                        : index == 1
                        ? "#f2c210"
                        : index == 3
                        ? "#ff3f6c"
                        : "#0db7af"
                    }`,
                  }}
                >
                  {category_name}
                </a>
                {category_name == "Birthday" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "BIRTHDAY") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#f26a10",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : category_name == "Anniversary" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "ANNIVERSARY") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#f2c210",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : category_name == "Kid's Pary" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "KID'S PARTY") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#0db7af",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : category_name == "Baby Shower" ? (
                  <ol>
                    {getCategorySubCatList?.data?.length > 0
                      ? getCategorySubCatList?.data?.map((item, i) => {
                          if (item?.categoryName == "BABY SHOWER") {
                            return (
                              <>
                                {item?.subcategories?.length > 0
                                  ? item?.subcategories?.map(
                                      (subCat, index) => {
                                        return (
                                          <li key={index}>
                                            <a
                                              style={{
                                                "--hover-color":
                                                  "#ff3f6c",
                                              }}
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
                                    )
                                  : ""}
                              </>
                            );
                          }
                        })
                      : ""}
                  </ol>
                ) : (
                  ""
                )}
              </li>
            </>
          );
        })}
      </ul>
    </div>

    <div className="Categories">
      <div className="CategoriesMenu">
        <p>All Categories</p>

        <div className="Categories_dropdown">
          <article>
            {getCategorySubCatList?.data?.length > 0
              ? getCategorySubCatList?.data?.map((item, i) => {
                  return (
                    <aside key={i}>
                      <h6
                      
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

      <div className="CategoriesSearch">
        <input
          name="search"
          value={search}
          onChange={(e) => {
            updateState({ ...iState, search: e.target.value });
          }}
          className="form-control me-2"
          type="search"
          placeholder="Search"
        />
        <span>
          <img src={require("../../assets/images/search-normal.png")} />
        </span>
      </div>
    </div>

    <div className="HeaderArea">
      {/* <div className="HeaderSearch">
        <div className="Select" >
          All Categories
        </div>

        <ul
          className="AllCategoryDrop dropdown-menu"
          aria-labelledby="dropdownMenuButton"
        >
          <h2>All Categories</h2>
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
                    </aside>
                  );
                })
              : ""}
          </article>
        </ul>
        <div className="position-relative w-100">
          <input
            name="search"
            value={search}
            onChange={(e) => {
              updateState({ ...iState, search: e.target.value });
            }}
            className="form-control me-2"
            type="search"
            placeholder="Search"
          />
          <span>
            <img
              src={require("../../assets/images/search-normal.png")}
            />
          </span>
        </div>
      </div> */}
      <div className="HeaderRight">
        <span className="LocationIcon" onClick={() => setShowCityPopup(true)}>
  <img src={require("../../assets/images/location.png")} />
</span>
{showCityPopup && (
  <CityPopup
    onClose={() => setShowCityPopup(false)}
    onSelect={(city) => {
      updateState({ ...iState, selectCity: city });
      localStorage.setItem("LennyCity", city);
      setShowCityPopup(false);
    }}
  />
)}

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
                    <h6>{getOrderSummaryDetail?.data?.productName}</h6>
                    <p>
                      For Date: {}
                      {getOrderSummaryDetail?.data?.dateAdded}
                    </p>

                    <div className="Links">
                      {/* <a >Cancel</a> */}
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
                class="Login"
              >
                Login
              </a>
            )}
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
</header>

<img className="star" src={require("../../assets/images/star-icon.png")}/></>