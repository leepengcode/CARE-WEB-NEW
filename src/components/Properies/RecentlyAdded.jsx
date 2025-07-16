import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Add useNavigate
import { fetchRecentlyAdded } from "../../api/propertyApi";
import PageComponents from "../PageComponents";
import PropertyCard from "../shared/PropertyCard";
import PropertyCardSkeleton from "../shared/PropertyCardSkeleton";

export default function RecentlyAdded() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [view, setView] = useState("grid");
  const [Properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  // Load data from cache or fetch fresh data
  useEffect(() => {
    const cache = sessionStorage.getItem("recentlyAddedCache");
    if (cache) {
      const { Properties, view } = JSON.parse(cache);
      setProperties(Properties);
      setView(view);
      setLoading(false);
      sessionStorage.removeItem("recentlyAddedCache");
    } else {
      fetchData();
    }
  }, []);

  // Restore scroll position after loading
  useEffect(() => {
    if (!loading) {
      const scroll = sessionStorage.getItem("recentlyAddedScroll");
      if (scroll) {
        window.scrollTo(0, parseInt(scroll, 10));
        sessionStorage.removeItem("recentlyAddedScroll");
      }
    }
  }, [loading]);

  const fetchData = async () => {
    setLoading(true);
    setFadeIn(false);
    try {
      const data = await fetchRecentlyAdded(12);
      // Use the full property object as returned from the API
      setProperties(data.filter((property) => property.status === 1));

      // Add delay for smoother transition
      setTimeout(() => {
        setLoading(false);
        setFadeIn(true);
      }, 300);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setFadeIn(true);
    }
  };

  const handlePropertyClick = (property) => {
    // Save state to cache before navigating
    sessionStorage.setItem("recentlyAddedScroll", window.scrollY);
    sessionStorage.setItem(
      "recentlyAddedCache",
      JSON.stringify({
        Properties,
        view,
      })
    );
    navigate(`/property/${property.id}`, {
      state: {
        from: window.location.pathname,
        property: property,
      },
    });
  };

  const handleViewChange = (newView) => {
    if (newView !== view) {
      setView(newView);
    }
  };

  if (loading) {
    return (
      <PageComponents>
        <div className="w-full max-w-7xl mx-auto py-4 md:py-10 lg:px-18">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md md:text-xl animate-pulse bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
              {t("recently_added.title")}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  view === "grid"
                    ? "bg-blue-800 text-white shadow-lg"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <Squares2X2Icon className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-200" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  view === "list"
                    ? "bg-blue-800 text-white shadow-lg"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <ListBulletIcon className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-200" />
              </button>
            </div>
          </div>
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              view === "grid"
                ? "grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 lg:grid-cols-2"
            } gap-4`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <PropertyCardSkeleton view={view} />
              </div>
            ))}
          </div>
        </div>
      </PageComponents>
    );
  }

  if (error) {
    return (
      <PageComponents>
        <div className="w-full max-w-7xl mx-auto py-4 md:py-10 lg:px-18">
          <div className="animate-fade-in-up bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-medium mb-2">
              Oops! Something went wrong
            </div>
            <p className="text-red-500">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </PageComponents>
    );
  }

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-4 md:py-10 lg:px-18">
        <div className="flex justify-between items-center mb-3">
          <h2
            className={`text-md md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-500 ease-in-out transform ${
              fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("recently_added.title")}
          </h2>

          <div
            className={`flex gap-2 transition-all duration-500 ease-in-out transform ${
              fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ animationDelay: "100ms" }}
          >
            <button
              onClick={() => handleViewChange("grid")}
              className={`p-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                view === "grid"
                  ? "bg-blue-800 text-white shadow-lg ring-2 ring-blue-300"
                  : "bg-gray-200 hover:bg-gray-300 hover:shadow-md"
              }`}
            >
              <Squares2X2Icon className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-200" />
            </button>
            <button
              onClick={() => handleViewChange("list")}
              className={`p-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
                view === "list"
                  ? "bg-blue-800 text-white shadow-lg ring-2 ring-blue-300"
                  : "bg-gray-200 hover:bg-gray-300 hover:shadow-md"
              }`}
            >
              <ListBulletIcon className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-200" />
            </button>
          </div>
        </div>
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            view === "grid"
              ? "grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 lg:grid-cols-2"
          } gap-4`}
        >
          {Properties.map((property, index) => (
            <div
              key={property.id}
              className={`transform transition-all duration-500 ease-in-out hover:scale-[1.02] hover:-translate-y-1 cursor-pointer animate-fade-in-up ${
                fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
              onClick={() => handlePropertyClick(property)}
            >
              <div className="transition-all duration-300 ease-in-out hover:shadow-xl rounded-lg overflow-hidden">
                <PropertyCard property={property} view={view} />
              </div>
            </div>
          ))}
        </div>

        {/* End of properties grid */}
      </div>

      {/* Enhanced CSS for smooth animations */}
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Enhanced transitions for better performance */
          * {
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            -webkit-perspective: 1000;
            perspective: 1000;
          }
          
          /* Custom scrollbar for better UX */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
            transition: background 0.3s ease;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          
          /* Smooth focus states */
          button:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
          }
          
          /* Improve text rendering */
          .text-smooth {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}
      </style>
    </PageComponents>
  );
}
