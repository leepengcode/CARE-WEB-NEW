import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy load components
const Agency = lazy(() => import("./components/Agency.jsx"));
const Article = lazy(() => import("./components/Article.jsx"));
const ArticleDetail = lazy(() => import("./components/ArticleDetail.jsx"));
const Certificate = lazy(() => import("./components/Certificate.jsx"));
const Contact = lazy(() => import("./components/Contact.jsx"));
const Favorites = lazy(() => import("./components/Favorites.jsx"));
const Measurement = lazy(() => import("./components/Measurement.jsx"));
const MortgageCalculator = lazy(() =>
  import("./components/MortgageCalculator.jsx")
);
const PropertyDetail = lazy(() => import("./components/PropertyDetail.jsx"));
const PropertyGuildDetail = lazy(() =>
  import("./components/PropertyGuildDetial.jsx")
);
const Services = lazy(() => import("./components/Services.jsx"));
const Privacy = lazy(() => import("./components/shared/Privacy.jsx"));
const Valuation = lazy(() => import("./components/Valuation.jsx"));

// Home feature components
const AboutUs = lazy(() => import("./features/Home/AboutUs.jsx"));
const Home = lazy(() => import("./features/Home/Home.jsx"));

// Properties feature components
const AddProperty = lazy(() => import("./features/Properties/AddProperty.jsx"));
const CategoryProperties = lazy(() =>
  import("./features/Properties/CategoryProperties.jsx")
);
const EditProperty = lazy(() =>
  import("./features/Properties/EditProperty.jsx")
);
const MyProperty = lazy(() => import("./features/Properties/MyProperty.jsx"));
const Properties = lazy(() => import("./features/Properties/Properties.jsx"));

// Layout (keep this as regular import since it's needed immediately)
import DefaultLayout from "./layouts/DefaultLayout.jsx";

// Auth components
const Login = lazy(() => import("./views/Login.jsx"));
const OtpVerify = lazy(() => import("./views/OtpVerify.jsx"));
const Profile = lazy(() => import("./views/Profile.jsx"));
const Signup = lazy(() => import("./views/Signup.jsx"));

// Helper component to wrap lazy components with Suspense
const LazyWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

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
    category: "Agriculture Land", // Fixed typo
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
        element: (
          <LazyWrapper>
            <Home />
          </LazyWrapper>
        ),
      },
      {
        path: "/privacy",
        element: (
          <LazyWrapper>
            <Privacy />
          </LazyWrapper>
        ),
      },
      {
        path: "/mortgage-calculator",
        element: (
          <LazyWrapper>
            <MortgageCalculator />
          </LazyWrapper>
        ),
      },
      {
        path: "/property",
        element: (
          <LazyWrapper>
            <Properties />
          </LazyWrapper>
        ),
      },
      {
        path: "/property/:id",
        element: (
          <LazyWrapper>
            <PropertyDetail />
          </LazyWrapper>
        ),
      },
      {
        path: "/edit-property/:id",
        element: (
          <LazyWrapper>
            <EditProperty />
          </LazyWrapper>
        ),
      },
      {
        path: "/article",
        element: (
          <LazyWrapper>
            <Article />
          </LazyWrapper>
        ),
      },
      {
        path: "/article/:id",
        element: (
          <LazyWrapper>
            <ArticleDetail />
          </LazyWrapper>
        ),
      },
      {
        path: "/about",
        element: (
          <LazyWrapper>
            <AboutUs />
          </LazyWrapper>
        ),
      },
      {
        path: "/contact",
        element: (
          <LazyWrapper>
            <Contact />
          </LazyWrapper>
        ),
      },
      {
        path: "/agency",
        element: (
          <LazyWrapper>
            <Agency />
          </LazyWrapper>
        ),
      },
      {
        path: "/favorites",
        element: (
          <LazyWrapper>
            <Favorites />
          </LazyWrapper>
        ),
      },
      {
        path: "/my-property",
        element: (
          <LazyWrapper>
            <MyProperty />
          </LazyWrapper>
        ),
      },
      {
        path: "/add-property",
        element: (
          <LazyWrapper>
            <AddProperty />
          </LazyWrapper>
        ),
      },
      {
        path: "/profile",
        element: (
          <LazyWrapper>
            <Profile />
          </LazyWrapper>
        ),
      },
      {
        path: "/certificate",
        element: (
          <LazyWrapper>
            <Certificate />
          </LazyWrapper>
        ),
      },
      {
        path: "/valuation",
        element: (
          <LazyWrapper>
            <Valuation />
          </LazyWrapper>
        ),
      },
      {
        path: "/measurement",
        element: (
          <LazyWrapper>
            <Measurement />
          </LazyWrapper>
        ),
      },
      {
        path: "/services",
        element: (
          <LazyWrapper>
            <Services />
          </LazyWrapper>
        ),
      },
      {
        path: "/property-guide-detail",
        element: (
          <LazyWrapper>
            <PropertyGuildDetail />
          </LazyWrapper>
        ),
      },

      // Category routes with lazy loading
      ...categoryRoutes.map(({ path, category, title, image }) => ({
        path,
        element: (
          <LazyWrapper>
            <CategoryProperties
              category={category}
              title={title}
              image={image}
            />
          </LazyWrapper>
        ),
      })),
    ],
  },

  // Auth routes (outside DefaultLayout)
  {
    path: "/login",
    element: (
      <LazyWrapper>
        <Login />
      </LazyWrapper>
    ),
  },
  {
    path: "/signup",
    element: (
      <LazyWrapper>
        <Signup />
      </LazyWrapper>
    ),
  },
  {
    path: "/otp",
    element: (
      <LazyWrapper>
        <OtpVerify />
      </LazyWrapper>
    ),
  },
]);

export default router;
