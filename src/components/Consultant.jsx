import { FaComments, FaHandshake, FaUserTie } from "react-icons/fa";
import PageComponents from "./PageComponents";

export default function Consultant() {
  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-8 px-2 md:px-10">
        <div className="text-center">
          {/* Animated Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 animate-bounce">
            Coming Soon!
          </h1>

          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <FaUserTie className="w-24 h-24 text-blue-500 animate-pulse" />
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                <FaUserTie className="w-12 h-12 text-blue-500 animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Consultants</h3>
              <p className="text-gray-600">
                Professional real estate experts at your service
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                <FaComments
                  className="w-12 h-12 text-green-500 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Always here to help with your questions
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-4">
                <FaHandshake
                  className="w-12 h-12 text-purple-500 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Personalized Service
              </h3>
              <p className="text-gray-600">Tailored solutions for your needs</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 animate-pulse">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600 animate-bounce">
                    75%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  className="w-3/4 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 relative"
                  style={{
                    animation: "progress-animation 2s ease-in-out infinite",
                    background:
                      "linear-gradient(90deg, #3B82F6 0%, #60A5FA 50%, #3B82F6 100%)",
                    backgroundSize: "200% 100%",
                  }}
                >
                  <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin-slow">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes progress-animation {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </PageComponents>
  );
}
