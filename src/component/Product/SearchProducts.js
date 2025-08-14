import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProduct } from "../../reduxToolkit/Slices/ProductList/listApis";

const SearchProducts = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = location?.state;
  const selectCity = window.localStorage.getItem("LennyCity");
  const { getSearchProductList, loader } = useSelector(
    (state) => state.productList
  );

  const handleProduct = (item) => {
    navigate("/products/product-details", { state: item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  console.log({ search });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const data = {
        search: search,
        city: selectCity,
      };
      dispatch(searchProduct(data));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  console.log({ getSearchProductList });

  return (
    <>
      <div className="BirthdayDecorationArea BirthDecImage">
        <div className="container-fluid" style={{ width: "96%" }}>
          <div className="section-title">
            <h2>Top products based on your search</h2>
          </div>
          <div className="row gy-5">
            {getSearchProductList?.data?.product?.length > 0 ? (
              getSearchProductList?.data?.product?.map((item, i) => {
                return (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-6">
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
    </>
  );
};

export default SearchProducts;
