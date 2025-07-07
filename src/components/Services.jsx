import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBalanceScale,
  FaClipboardCheck,
  FaLightbulb,
  FaMapMarkerAlt,
  FaRegChartBar,
  FaRegClock,
  FaRegHandshake,
  FaRegUser,
  FaShieldAlt,
  FaUserTie,
} from "react-icons/fa";
import {
  MdOutlineAssessment,
  MdOutlineBusinessCenter,
  MdOutlineDomain,
  MdOutlineHowToVote,
} from "react-icons/md";
import PageComponents from "./PageComponents";

export default function Services() {
  const { t } = useTranslation();
  // const [imageLoading, setImageLoading] = useState(true);

  // Popup modal state for service card
  const [selectedService, setSelectedService] = useState(null);

  // Service keys for translation
  const serviceKeys = [
    {
      icon: <MdOutlineBusinessCenter className="text-blue-600 text-6xl mb-4" />,
      key: "agency",
    },
    {
      icon: <MdOutlineAssessment className="text-green-600 text-6xl mb-4" />,
      key: "valuation",
    },
    {
      icon: <MdOutlineDomain className="text-yellow-500 text-6xl mb-4" />,
      key: "development",
    },
    {
      icon: <FaRegChartBar className="text-purple-600 text-6xl mb-4" />,
      key: "investment",
    },
    {
      icon: <MdOutlineHowToVote className="text-red-500 text-6xl mb-4" />,
      key: "citizenship",
    },
    {
      icon: <FaRegUser className="text-blue-500 text-6xl mb-4" />,
      key: "support",
    },
  ];

  // For card pop-in animation on scroll
  const cardsRef = useRef([]);
  const [visibleCards, setVisibleCards] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => ({
              ...prev,
              [entry.target.dataset.id]: true,
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    return () => {
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <PageComponents>
      {/* Hero Section */}
      <div className="w-full mt-5 md-mt-0 max-w-7xl mx-auto py-0 md:py-8 px-2 md:px-10">
        {/*<div className="relative w-full h-[140px] md:h-[200px] rounded-2xl overflow-hidden mb-10 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 shadow-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <FaRegHandshake className="text-blue-200 text-5xl md:text-7xl opacity-30" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-blue-900 mb-2 drop-shadow-lg">
              {t("services_page.title")}
            </h1>
            <p className="text-blue-800 text-base md:text-lg font-medium max-w-2xl mx-auto">
              {t("services_page.subtitle")}
            </p>
          </div>
        </div> */}

        <div
          className={`relative pt-10 pb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl mb-8 animate-pulse-slow">
              <FaRegHandshake className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent p-3 mb-6 leading-tight">
              {t("services_page.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("services_page.subtitle")}
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceKeys.map((service, idx) => (
            <div
              key={service.key}
              ref={(el) => (cardsRef.current[idx] = el)}
              data-id={idx}
              className={`bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-500 cursor-pointer transform ${
                visibleCards[idx]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              onClick={() => setSelectedService(service)}
            >
              {service.icon}
              <h2 className="font-bold text-xl md:text-2xl text-blue-900 mb-2">
                {t(`services_page.service_list.${service.key}.title`)}
              </h2>
              <p className="text-gray-600">
                {t(`services_page.service_list.${service.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="w-full max-w-7xl mx-auto mb-10 md:px-10 mt-5 md:mt-0">
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-6 md:p-12 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 text-center flex items-center justify-center gap-3">
            <FaLightbulb className="text-yellow-400 text-2xl md:text-3xl" />{" "}
            {t("services_page.why_choose")}
          </h2>
          <div className="flex flex-col divide-y divide-blue-100">
            {t("services_page.why", { returnObjects: true }).map(
              (item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 py-6"
                >
                  <div className="flex items-center w-full md:w-[30%] md:basis-[30%]">
                    {/* Use icons as before, or optionally map icons by idx if needed */}
                    {/* For now, keep the original icons for each section as in the previous code */}
                    {
                      [
                        <FaClipboardCheck className="text-blue-500 text-3xl md:text-4xl mr-4" />,
                        <FaShieldAlt className="text-green-500 text-3xl md:text-4xl mr-4" />,
                        <FaUserTie className="text-purple-500 text-3xl md:text-4xl mr-4" />,
                        <FaMapMarkerAlt className="text-pink-500 text-3xl md:text-4xl mr-4" />,
                        <FaLightbulb className="text-yellow-400 text-3xl md:text-4xl mr-4" />,
                        <FaBalanceScale className="text-blue-700 text-3xl md:text-4xl mr-4" />,
                        <FaRegClock className="text-red-400 text-3xl md:text-4xl mr-4" />,
                      ][idx]
                    }
                    <span className="font-bold text-lg md:text-xl text-blue-900">
                      {item.title}
                    </span>
                  </div>
                  <div className="text-gray-700 text-base md:text-lg w-full md:w-[70%] md:basis-[70%] md:pl-6">
                    {item.desc}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Service Popup Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in-up">
          <div className="relative max-w-md w-full mx-auto">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute -top-12 right-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8 flex flex-col items-center animate-fade-in-up">
              {selectedService.icon}
              <h2 className="font-bold text-2xl text-blue-900 mb-2 text-center">
                {t(`services_page.service_list.${selectedService.key}.title`)}
              </h2>
              <p className="text-gray-600 text-center">
                {t(`services_page.service_list.${selectedService.key}.desc`)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Use a standard <style> tag without the jsx attribute */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;600;700&family=Hanuman:wght@400;700&display=swap');

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out forwards;
        }
        .font-khmer {
          font-family: 'Hanuman', 'Noto Sans Khmer', Battambang, Siemreap, sans-serif;
        }
      `}</style>
    </PageComponents>
  );
}
