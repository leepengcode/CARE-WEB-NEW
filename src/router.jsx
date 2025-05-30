import { createBrowserRouter, Navigate } from "react-router-dom";
import AboutUs from "./components/AboutUs.jsx";
import Agency from "./components/Agency.jsx";
import Article from "./components/Article.jsx";
import ArticleDetail from "./components/ArticleDetail.jsx";
import Contact from "./components/Contact.jsx";
import Favorites from "./components/Favorites.jsx";
import MortgageCalculator from "./components/MortgageCalculator.jsx";
import AddProperty from "./components/Properies/AddProperty.jsx";
import CategoryProperties from "./components/Properies/CategoryProperties.jsx";
import MyProperty from "./components/Properies/MyProperty.jsx";
import Properties from "./components/Properies/Properties.jsx";
import PropertyDetail from "./components/PropertyDetail.jsx";
import DefaultLayout from "./layouts/DefaultLayout.jsx";
import Home from "./views/Home.jsx";
import Login from "./views/Login.jsx";
import OtpVerify from "./views/OtpVerify.jsx";
import Profile from "./views/Profile.jsx";
import Signup from "./views/Signup.jsx";

const categoryRoutes = [
  {
    path: "/category/residential",
    category: "Residential",
    title: "Residential",
    image:
      "https://saltosystems.com/sites/default/files/styles/breakpoint_1920/public/images/contents/residential_background_1.jpg?itok=yErIXYOm",
  },
  {
    path: "/category/condo",
    category: "Condo",
    title: "Condo",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    path: "/category/commercial",
    category: "Commercial",
    title: "Commercial",
    image:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
  },
  {
    path: "/category/industrial",
    category: "Industrial",
    title: "Industrial",
    image:
      "https://www.adoralivingspace.com/wp-content/uploads/2023/09/Ban2.jpg",
  },
  {
    path: "/category/land",
    category: "Land",
    title: "Land",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    path: "/category/business-for-sell",
    category: "Business for sell",
    title: "Business for Sell",
    image:
      "https://poonawallafincorp.com/documents/213163/213167/blog_banner-business-models-dektop.jpg",
  },
  {
    path: "/category/agriculture-land",
    category: "Algricalture Lan",
    title: "Agriculture Land",
    image:
      "https://www.rliland.com/Portals/0/xBlog/uploads/2022/5/17/fivestepsincreasevalueoflistingblogimage-countryside-1149680_1920-1210x423.jpg",
  },
  {
    path: "/category/high-building",
    category: "High Building",
    title: "High Building",
    image:
      "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=80",
  },
];

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
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/agency",
        element: <Agency />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
      {
        path: "/my-property",
        element: <MyProperty />,
      },
      {
        path: "/add-property",
        element: <AddProperty />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      ...categoryRoutes.map(({ path, category, title, image }) => ({
        path,
        element: (
          <CategoryProperties category={category} title={title} image={image} />
        ),
      })),
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/otp",
    element: <OtpVerify />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

export default router;
