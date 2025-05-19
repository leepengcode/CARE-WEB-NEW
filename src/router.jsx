import { createBrowserRouter, Navigate } from "react-router-dom";
import AboutUs from "./components/AboutUs.jsx";
import Article from "./components/Article.jsx";
import ArticleDetail from "./components/ArticleDetail.jsx";
import MortgageCalculator from "./components/MortgageCalculator.jsx";
import Properties from "./components/Properies/Properties.jsx";
import PropertyDetail from "./components/PropertyDetail.jsx";
import DefaultLayout from "./layouts/DefaultLayout.jsx";
import GuestLayout from "./layouts/GuestLayout.jsx";
import Home from "./views/Home.jsx";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Navigate to="/" />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/mortgage-calculator",
        element: <MortgageCalculator />,
      },
      {
        path: "/properties",
        element: <Properties />,
      },
      {
        path: "/property/:id",
        element: <PropertyDetail />,
      },
      {
        path: "/article",
        element: <Article />,
      },
      {
        path: "/article/:id",
        element: <ArticleDetail />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
    ],
  },

  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
