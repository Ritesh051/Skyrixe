import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "../component/Root";
import Main from "../component/Landing/Main";
import Profile from "../component/Profile/profile";
import Product from "../component/Product/Product";
import ProductDetails from "../component/Product/ProductDetails";
import Checkout1 from "../component/CheckOut/Checkout1";
import Checkout2 from "../component/CheckOut/Checkout2";
import PaymentSuccess from "../component/Payment/PaymentSuccess";
import StaticContent from "../component/StaticContent/StaticContent";
import SearchProducts from "../component/Product/SearchProducts";
import PrivateRoute from "./PrivateRoutes";

let basename = "/";

if (process.env.NODE_ENV === "production") {
  basename = "/";
}

export const routes = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "",
          element: <Main />,
        },
        {
          path: ":type",
          element: <Profile />,
        },
        {
          path: "products",
          element: <Product />,
        },
        {
          path: "products/product-details",
          element: <ProductDetails />,
        },
        {
          path: "search/products",
          element: <SearchProducts />,
        },
        {
          path: "checkout-1",
          element: <Checkout1 />,
        },
        {
          path: "checkout-2",
          element: <Checkout2 />,
        },
        {
          path: "payment-success",
          element: <PaymentSuccess />,
        },

        {
          path: "about-us",
          element: <StaticContent />,
        },
        {
          path: "terms-conditions",
          element: <StaticContent />,
        },
        {
          path: "privacy-policy",
          element: <StaticContent />,
        },
        {
          path: "contact-us",
          element: <StaticContent />,
        },
        {
          path: "faq",
          element: <StaticContent />,
        },
        {
          path: "return-policy",
          element: <StaticContent />,
        },
      ],
    },
  ],
  { basename }
);
