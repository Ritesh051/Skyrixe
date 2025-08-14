import React, { useEffect } from "react";
import { getPathName } from "../../Utils/commonFunctions";
import { useDispatch, useSelector } from "react-redux";
import { staticDataList } from "../../reduxToolkit/Slices/StaticData/staticGetApis";

const StaticContent = () => {
  const pathname = getPathName();
  const dispatch = useDispatch();
  const { getStaticList, loader } = useSelector((state) => state.staticList);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const data = {
      endUrl:
        pathname == "about-us"
          ? "aboutusget"
          : pathname == "terms-conditions"
          ? "termget"
          : pathname == "privacy-policy"
          ? "privacyget"
          : pathname == "contact-us"
          ? "contactdata"
          : pathname == "return-policy"
          ? "returnpolicyget"
          : pathname == "faq"
          ? "faqget"
          : "",
    };
    dispatch(staticDataList(data));
  }, [pathname]);

  console.log({ getStaticList });
  return (
    <>
      <div id="Main">
        <div className="PolicyBanner">
          <h3>
            {pathname == "about-us"
              ? "About Us"
              : pathname == "terms-conditions"
              ? "Terms and Conditions"
              : pathname == "privacy-policy"
              ? "Privacy Policy"
              : pathname == "contact-us"
              ? "Contact Us"
              : pathname == "return-policy"
              ? "Return Policy"
              : pathname == "faq"
              ? "Frequently Asked Questions"
              : ""}
          </h3>
        </div>
        <div className="PrivacyPolicyArea">
          <div className="VerticalTabs">
            <div className="row">
              <div className="col-md-12">
                <div className="TabCommonBox TermsConditionsContent">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getStaticList?.data?.at(0)?.details,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticContent;
