import { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { FaCertificate, FaCheckCircle, FaTimes } from "react-icons/fa";
import PageComponents from "./PageComponents";

export default function Certificate() {
  const { t } = useTranslation();
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [visibleCards, setVisibleCards] = useState({});
  const cardsRef = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sample Certificate  data - replace with actual data from your backend
  const Certificate = [
    {
      id: 1,
      titleKey: "company_registration",
      thumbnail: "https://externalchecking.com/logo/ការចុះបញ្ជីក្រុមហ៊ុន.png",
    },
    {
      id: 2,
      titleKey: "membership_certificate",
      thumbnail: "https://externalchecking.com/logo/វិញ្ញាបណ្ណប័ត្រសមាជិក.jpg",
    },
    {
      id: 3,
      titleKey: "valuation_certificate_oung",
      thumbnail: "https://externalchecking.com/logo/1.jpg",
    },
    {
      id: 4,
      titleKey: "valuation_certificate_vong",
      thumbnail: "https://externalchecking.com/logo/2.jpg",
    },
    {
      id: 5,
      titleKey: "valuation_certificate_kiev",
      thumbnail: "https://externalchecking.com/logo/3.jpg",
    },
    {
      id: 6,
      titleKey: "valuation_certificate_heun",
      thumbnail: "https://externalchecking.com/logo/4.jpg",
    },
    {
      id: 7,
      titleKey: "valuation_certificate_san1",
      thumbnail: "https://externalchecking.com/logo/5.jpg",
    },
    {
      id: 8,
      titleKey: "valuation_certificate_san2",
      thumbnail: "https://externalchecking.com/logo/6.jpg",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
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

  const khmerStyle = {
    fontFamily:
      "'Khmer OS', 'Khmer OS System', 'Khmer OS Battambang', 'Khmer OS Bokor', 'Khmer OS Content', 'Khmer OS Freehand', 'Khmer OS Metal Chrieng', 'Khmer OS Muol', 'Khmer OS Muol Light', 'Khmer OS Muol Pali', 'Khmer OS Siemreap', 'Khmer OS System', sans-serif",
    lineHeight: "1.5",
  };

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-0 md:py-8 px-2 md:px-10">
        {/* Hero Section */}
        {/* <div className="relative mt-5 md-mt-0 w-full h-[140px] md:h-[200px] rounded-2xl overflow-hidden mb-10 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 shadow-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <FaCertificate className="text-yellow-300 text-5xl md:text-7xl opacity-30" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-blue-900 mb-2 drop-shadow-lg">
              {t("certificate_page.title")}
            </h1>
            <p className="text-blue-800 text-base md:text-lg font-medium max-w-2xl mx-auto">
              {t("certificate_page.subtitle")}
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
              <FaCertificate className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent p-3 mb-6 leading-tight">
              {t("certificate_page.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("certificate_page.subtitle")}
            </p>
          </div>
        </div>
        {/* Certificate  Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Certificate.map((Certificate, index) => (
            <div
              key={Certificate.id}
              ref={(el) => (cardsRef.current[index] = el)}
              data-id={Certificate.id}
              className={`bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-xl overflow-hidden border border-blue-100 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl flex flex-col ${
                visibleCards[Certificate.id]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              onClick={() => setSelectedCertificate(Certificate)}
            >
              <div className="relative flex-1 flex flex-col">
                <div className="bg-gray-50 border-b border-blue-100 flex-1 flex items-center justify-center min-h-[220px]">
                  <img
                    src={Certificate.thumbnail}
                    alt={Certificate.title}
                    className="w-full h-auto object-contain max-h-60"
                  />
                </div>
                {/* Title at bottom */}
                <div className="bg-white bg-opacity-90 p-4 border-t border-blue-100">
                  <h3
                    className="text-lg font-semibold text-blue-900 truncate text-center"
                    style={khmerStyle}
                  >
                    {t(`certificate_titles.${Certificate.titleKey}`)}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="w-full max-w-7xl mx-auto mt-12 mb-4">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-xl border border-blue-100 p-8 md:p-12 animate-fade-in-up">
            <div className="flex-shrink-0 flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 shadow-lg mb-6 md:mb-0">
              <FaCertificate className="text-white text-5xl md:text-6xl" />
            </div>
            <div className="flex-1 flex flex-col gap-5 text-blue-900 text-lg md:text-xl font-medium">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="w-7 h-7 text-green-500 flex-shrink-0 mt-1" />
                <span>
                  <Trans
                    i18nKey="certificate_page.info1"
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="w-7 h-7 text-green-500 flex-shrink-0 mt-1" />
                <span>
                  <Trans
                    i18nKey="certificate_page.info2"
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="w-7 h-7 text-green-500 flex-shrink-0 mt-1" />
                <span>
                  <Trans
                    i18nKey="certificate_page.info3"
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FaCheckCircle className="w-7 h-7 text-green-500 flex-shrink-0 mt-1" />
                <span>
                  <Trans
                    i18nKey="certificate_page.info4"
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="relative max-h-[90vh] w-auto">
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute -top-12 right-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-600" />
              </button>
              <div className="bg-white rounded-lg overflow-hidden">
                <img
                  src={selectedCertificate.thumbnail}
                  alt={selectedCertificate.title}
                  className="max-h-[85vh] w-auto object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t(`certificate_titles.${selectedCertificate.titleKey}`)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageComponents>
  );
}
