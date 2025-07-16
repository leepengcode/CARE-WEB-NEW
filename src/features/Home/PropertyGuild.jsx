import { useTranslation } from "react-i18next";
import { FaBook, FaCalculator } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PageComponents from "../../components/PageComponents";

export default function PropertyGuild() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate("/property-guide-detail");
  };

  const handletrynow = () => {
    navigate("/mortgage-calculator");
  };

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-2  md:py-10 px-0 md:px-0 ">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-7xl mx-auto">
          {/* Property Guides Card */}
          <div className="bg-white rounded-lg shadow-md border border-blue-500 p-3 md:p-5 hover:shadow-lg transition-all duration-300 ">
            <div className="flex flex-col items-center text-center">
              {/* Content for Property Guides Card */}
              <div className="bg-blue-100 p-2 md:p-3 rounded-full mb-2 md:mb-4">
                <FaBook className="text-xl md:text-2xl text-blue-600" />
              </div>
              <h3 className="text-base md:text-md font-semibold text-gray-800 mb-1 md:mb-2">
                {t("property_guide.title")}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4">
                {t("property_guide.desc")}
              </p>
              <button
                onClick={handleReadMore}
                className="bg-blue-600 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs hover:bg-blue-700 transition-colors duration-300"
              >
                {t("property_guide.read_more")}
              </button>
            </div>
          </div>

          {/* Mortgage Calculator Card */}
          <div className="bg-white rounded-lg shadow-md border border-blue-500 p-3 md:p-5 hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Content for Mortgage Calculator Card */}
              <div className="bg-green-100 p-2 md:p-3 rounded-full mb-2 md:mb-4">
                <FaCalculator className="text-xl md:text-2xl text-green-600" />
              </div>
              <h3 className="text-base md:text-md font-semibold text-gray-800 mb-1 md:mb-2">
                {t("property_guide.mortgage_title")}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4">
                {t("property_guide.mortgage_desc")}
              </p>
              <button
                onClick={handletrynow}
                className="bg-green-600 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs hover:bg-green-700 transition-colors duration-300"
              >
                {t("property_guide.try_now")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageComponents>
  );
}
