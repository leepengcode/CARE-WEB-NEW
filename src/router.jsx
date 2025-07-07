import { createBrowserRouter, Navigate } from "react-router-dom";
import Agency from "./components/Agency.jsx";
import Article from "./components/Article.jsx";
import ArticleDetail from "./components/ArticleDetail.jsx";
import Certificate from "./components/Certificate.jsx";
import Contact from "./components/Contact.jsx";
import Favorites from "./components/Favorites.jsx";
import Measurement from "./components/Measurement.jsx";
import MortgageCalculator from "./components/MortgageCalculator.jsx";
import PropertyDetail from "./components/PropertyDetail.jsx";
import PropertyGuildDetail from "./components/PropertyGuildDetial.jsx";
import Services from "./components/Services.jsx";
import Privacy from "./components/shared/Privacy.jsx";
import Valuation from "./components/Valuation.jsx";
import AboutUs from "./features/Home/AboutUs.jsx";
import Home from "./features/Home/Home.jsx";
import AddProperty from "./features/Properties/AddProperty.jsx";
import CategoryProperties from "./features/Properties/CategoryProperties.jsx";
import EditProperty from "./features/Properties/EditProperty.jsx";
import MyProperty from "./features/Properties/MyProperty.jsx";
import Properties from "./features/Properties/Properties.jsx";
import DefaultLayout from "./layouts/DefaultLayout.jsx";
import Login from "./views/Login.jsx";
import OtpVerify from "./views/OtpVerify.jsx";
import Profile from "./views/Profile.jsx";
import Signup from "./views/Signup.jsx";

const categoryRoutes = [
  {
    path: "/residential",
    category: "Residential",
    title: "Residential",
    image:
      "https://saltosystems.com/sites/default/files/styles/breakpoint_1920/public/images/contents/residential_background_1.jpg?itok=yErIXYOm",
  },
  {
    path: "/condo",
    category: "Condo",
    title: "Condo",
    image:
      "https://www.mahsing.com.my/web/storage/2020/10/concept-main-banner.jpg",
  },
  {
    path: "/commercial",
    category: "Commercial",
    title: "Commercial",
    image:
      "https://www.realpage.com/storage/files/pages/images/2022/08/home-header.jpg",
  },
  {
    path: "/industrial",
    category: "Industrial",
    title: "Industrial",
    image:
      "https://st.depositphotos.com/1927453/3279/i/450/depositphotos_32796667-stock-photo-oil-refinery-industrial-plant-at.jpg",
  },
  {
    path: "/land",
    category: "Land",
    title: "Land",
    image:
      "https://img.freepik.com/free-photo/land-plot-with-nature-landscape-location-pin_23-2149937913.jpg?semt=ais_hybrid&w=740",
  },
  {
    path: "/agriculture-land",
    category: "Algricalture Land",
    title: "Agriculture Land",
    image:
      "https://media.istockphoto.com/id/1437629749/photo/land-plot-in-aerial-view-in-chiang-mai-of-thailand.jpg?s=612x612&w=0&k=20&c=07y-L9_WJwFGmvvhrZULYbfTfDtUPHnxJhbxWPTiqYg=",
  },
  {
    path: "/business-for-sell",
    category: "Business for sell",
    title: "Business for Sell",
    image:
      "https://lionspiritmedia.co.uk/wp-content/uploads/2024/03/marketing_in_business_success.jpg.webp",
  },

  {
    path: "/high-building",
    category: "High Building",
    title: "High Building",
    image:
      "https://images.adsttc.com/media/images/619d/4b60/f91c/818c/6e00/0006/large_jpg/shutterstock_728342668.jpg?1637698337",
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
        path: "/privacy",
        element: <Privacy />,
      },
      {
        path: "/mortgage-calculator",
        element: <MortgageCalculator />,
      },
      {
        path: "/property",
        element: <Properties />,
      },
      {
        path: "/property/:id",
        element: <PropertyDetail />,
      },
      {
        path: "/edit-property/:id",
        element: <EditProperty />,
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
      {
        path: "/Certificate",
        element: <Certificate />,
      },
      {
        path: "/valuation",
        element: <Valuation />,
      },
      {
        path: "/measurement",
        element: <Measurement />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/property-guide-detail",
        element: <PropertyGuildDetail />,
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
