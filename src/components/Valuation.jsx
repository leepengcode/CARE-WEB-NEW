import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaRegCheckCircle,
  FaRegQuestionCircle,
  FaTelegramPlane,
} from "react-icons/fa";
import {
  MdGroups,
  MdOutlineAssessment,
  MdOutlineTrendingUp,
  MdOutlineVerifiedUser,
} from "react-icons/md";
import PageComponents from "./PageComponents";

export default function Valuation() {
  const { t } = useTranslation();
  // Pop-in animation for contact cards and sections
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
      <div className="w-full max-w-7xl mx-auto py-0 md:py-8 px-2 md:px-10">
        {/* Hero Section */}

        <div
          className={`relative pt-10 pb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl mb-8 animate-pulse-slow">
              <MdGroups className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent p-3 mb-6 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full max-w-7xl mx-auto mb-10">
          <div
            ref={(el) => (cardsRef.current[2] = el)}
            data-id={2}
            className={`flex flex-col md:flex-row items-center gap-4 bg-white rounded-2xl shadow-lg border border-blue-100 p-6 md:p-8 transition-all duration-500 ${
              visibleCards[2]
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex-shrink-0 flex items-center justify-center bg-blue-50 rounded-full w-20 h-20 md:w-24 md:h-24 mr-0 md:mr-6 mb-4 md:mb-0 animate-fade-in">
              <MdGroups className="text-blue-500 text-4xl md:text-5xl animate-spin-slow" />
            </div>
            <div className="flex-1 text-gray-700 text-base md:text-lg leading-relaxed">
              {t("info.description")}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div
          ref={(el) => (cardsRef.current[3] = el)}
          data-id={3}
          className={`w-full flex flex-col md:flex-row gap-8 mt-8 mb-10 transition-all duration-500 ${
            visibleCards[3]
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex-1 flex flex-col items-center text-center bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-xl border border-blue-100 p-8 mb-6 md:mb-0 animate-fade-in">
            <MdOutlineAssessment className="text-blue-500 text-5xl mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-blue-900 mb-2">
              {t("benefits.why_title")}
            </h2>
            <ul className="text-gray-700 text-base md:text-lg space-y-2">
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-green-500" />{" "}
                {t("benefits.why_1")}
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-green-500" />{" "}
                {t("benefits.why_2")}
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-green-500" />{" "}
                {t("benefits.why_3")}
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-green-500" />{" "}
                {t("benefits.why_4")}
              </li>
            </ul>
          </div>
          <div className="flex-1 flex flex-col items-center text-center bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-xl border border-blue-100 p-8 animate-fade-in">
            <MdOutlineTrendingUp className="text-blue-500 text-5xl mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-blue-900 mb-2">
              {t("benefits.for_you_title")}
            </h2>
            <ul className="text-gray-700 text-base md:text-lg space-y-2">
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-green-500" />{" "}
                {t("benefits.for_you_1")}
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-green-500" />{" "}
                {t("benefits.for_you_2")}
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-green-500" />{" "}
                {t("benefits.for_you_3")}
              </li>
              <li className="flex items-center gap-2">
                <FaRegCheckCircle className="text-green-500" />{" "}
                {t("benefits.for_you_4")}
              </li>
            </ul>
          </div>
        </div>

        {/* Process Section */}
        <div
          ref={(el) => (cardsRef.current[4] = el)}
          data-id={4}
          className={`w-full bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mt-10 mb-10 transition-all duration-500 ${
            visibleCards[4]
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          } animate-fade-in`}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 flex items-center justify-center bg-blue-50 rounded-full w-20 h-20 md:w-24 md:h-24 animate-bounce mb-4 md:mb-0">
              <MdOutlineVerifiedUser className="text-blue-500 text-4xl md:text-5xl" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">
                {t("process.title")}
              </h2>
              <ol className="list-decimal ml-6 text-gray-700 text-base md:text-lg space-y-1">
                <li>{t("process.step_1")}</li>
                <li>{t("process.step_2")}</li>
                <li>{t("process.step_3")}</li>
                <li>{t("process.step_4")}</li>
                <li>{t("process.step_5")}</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div
          ref={(el) => (cardsRef.current[5] = el)}
          data-id={5}
          className={`w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-lg border border-blue-100 p-8 mt-10 mb-10 transition-all duration-500 ${
            visibleCards[5]
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          } animate-fade-in`}
        >
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-6 text-center">
            {t("testimonials.title")}
          </h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col items-center text-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Client 1"
                className="w-16 h-16 rounded-full mb-2 border-2 border-blue-200 animate-bounce"
              />
              <p className="text-gray-700 italic mb-2">
                {t("testimonials.1.text")}
              </p>
              <span className="font-semibold text-blue-800">
                {t("testimonials.1.name")}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center text-center">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Client 2"
                className="w-16 h-16 rounded-full mb-2 border-2 border-blue-200 animate-bounce"
              />
              <p className="text-gray-700 italic mb-2">
                {t("testimonials.2.text")}
              </p>
              <span className="font-semibold text-blue-800">
                {t("testimonials.2.name")}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center text-center">
              <img
                src="https://randomuser.me/api/portraits/men/65.jpg"
                alt="Client 3"
                className="w-16 h-16 rounded-full mb-2 border-2 border-blue-200 animate-bounce"
              />
              <p className="text-gray-700 italic mb-2">
                {t("testimonials.3.text")}
              </p>
              <span className="font-semibold text-blue-800">
                {t("testimonials.3.name")}
              </span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div
          ref={(el) => (cardsRef.current[6] = el)}
          data-id={6}
          className={`w-full bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mt-10 mb-10 transition-all duration-500 ${
            visibleCards[6]
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          } animate-fade-in`}
        >
          <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-6 text-center">
            {t("faq.title")}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FaRegQuestionCircle className="text-blue-400 text-2xl mt-1 animate-bounce" />
              <div>
                <p className="font-semibold text-gray-800">
                  {t("faq.q1.question")}
                </p>
                <p className="text-gray-700">{t("faq.q1.answer")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaRegQuestionCircle className="text-blue-400 text-2xl mt-1 animate-bounce" />
              <div>
                <p className="font-semibold text-gray-800">
                  {t("faq.q2.question")}
                </p>
                <p className="text-gray-700">{t("faq.q2.answer")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaRegQuestionCircle className="text-blue-400 text-2xl mt-1 animate-bounce" />
              <div>
                <p className="font-semibold text-gray-800">
                  {t("faq.q3.question")}
                </p>
                <p className="text-gray-700">{t("faq.q3.answer")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaRegQuestionCircle className="text-blue-400 text-2xl mt-1 animate-bounce" />
              <div>
                <p className="font-semibold text-gray-800">
                  {t("faq.q4.question")}
                </p>
                <p className="text-gray-700">{t("faq.q4.answer")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Cards Section (original) */}
        <div className="w-full flex flex-col md:flex-row gap-8 mt-8">
          {/* Contact Card 1 */}
          <div className="flex-1 flex justify-center items-stretch">
            <div
              ref={(el) => (cardsRef.current[0] = el)}
              data-id={0}
              className={`w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-2xl border border-blue-100 p-10 flex flex-col items-center text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl transform ${
                visibleCards[0]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <FaTelegramPlane className="text-blue-500 text-6xl mb-6 animate-pulse" />
              <h2 className="text-2xl font-bold text-blue-900 mb-2">
                {t("contacts.0.name")}
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                {t("contacts.0.title")}
              </p>
              <a
                href="https://t.me/Sovanndara07"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors text-lg text-center text-nowrap"
              >
                <FaTelegramPlane className="text-2xl" />{" "}
                {t("contacts.0.button")}
              </a>
            </div>
          </div>
          {/* Contact Card 2 */}
          <div className="flex-1 flex justify-center items-stretch">
            <div
              ref={(el) => (cardsRef.current[1] = el)}
              data-id={1}
              className={`w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-2xl border border-blue-100 p-10 flex flex-col items-center text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl transform ${
                visibleCards[1]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <FaTelegramPlane className="text-blue-500 text-6xl mb-6 animate-pulse" />
              <h2 className="text-2xl font-bold text-blue-900 mb-2">
                {t("contacts.1.name")}
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                {t("contacts.1.title")}
              </p>
              <a
                href="https://t.me/Vanndoung7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors text-lg text-center text-nowrap"
              >
                <FaTelegramPlane className="text-2xl" />{" "}
                {t("contacts.1.button")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageComponents>
  );
}
