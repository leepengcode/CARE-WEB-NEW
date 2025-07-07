import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import cnFlag from "../assets/cn.webp";
import enFlag from "../assets/en.png";
import khFlag from "../assets/kh.png";
import Breadcrumb from "../components/shared/Breadcrumb.jsx";
import Footer from "../components/shared/Footer.jsx";
import { useStateContext } from "../contexts/ContextProvider.jsx";

// Set language from localStorage before component renders
const savedLang =
  typeof window !== "undefined" ? localStorage.getItem("lang") : null;
if (savedLang && savedLang !== window.i18next?.language) {
  window.i18next = window.i18next || {};
  window.i18next.language = savedLang;
  import("i18next").then((i18next) => {
    if (i18next.default.language !== savedLang) {
      i18next.default.changeLanguage(savedLang);
    }
  });
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DefaultLayout() {
  const navigate = useNavigate();
  const { userToken, setUserToken, setCurrentUser, currentUser } =
    useStateContext();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(null);
  const dropdownRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef(null);
  const [showAnniversaryModal, setShowAnniversaryModal] = useState(false);
  const [anniversaryCountdown, setAnniversaryCountdown] = useState(10);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
      setIsVisible(window.scrollY < lastScrollY || window.scrollY < 10);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsVisible(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    if (i18n.language === "km") {
      document.body.classList.add("khmer-font");
    } else {
      document.body.classList.remove("khmer-font");
    }
  }, [i18n.language]);

  useEffect(() => {
    // Show modal only if not shown before
    if (!localStorage.getItem("anniversaryModalShown")) {
      setShowAnniversaryModal(true);
      setAnniversaryCountdown(10);
    }
  }, []);

  useEffect(() => {
    if (!showAnniversaryModal) return;
    if (anniversaryCountdown === 0) {
      handleCloseAnniversaryModal();
      return;
    }
    const timer = setTimeout(() => {
      setAnniversaryCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showAnniversaryModal, anniversaryCountdown]);

  function logout(ev) {
    ev.preventDefault();
    // Optionally call backend logout endpoint
    // axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, {
    //   headers: { Authorization: `Bearer ${userToken}` }
    // });
    setUserToken(null);
    setCurrentUser({});
    localStorage.removeItem("userToken");
    localStorage.removeItem("currentUser");
    navigate("/");
  }

  const navigation = [
    { name: t("menu.home"), to: "/", current: true },
    {
      name: t("menu.property"),
      to: "/property",
      current: true,
      children: [
        { name: t("menu.Properties"), to: "/property" },
        { name: t("menu.my_property"), to: "/my-property" },
        { name: t("menu.add_property"), to: "/add-property" },
      ],
    },
    {
      name: t("menu.category"),
      to: " ",
      current: true,
      children: [
        { name: t("menu.residential"), to: "/residential" },
        { name: t("menu.condo"), to: "/condo" },
        { name: t("menu.commercial"), to: "/commercial" },
        { name: t("menu.industrial"), to: "/industrial" },
        { name: t("menu.land"), to: "/land" },
        { name: t("menu.business_for_sell"), to: "/business-for-sell" },
        { name: t("menu.agriculture_land"), to: "/agriculture-land" },
        { name: t("menu.high_building"), to: "/high-building" },
      ],
    },
    {
      name: t("menu.page"),
      to: "/page",
      current: true,
      children: [
        { name: t("menu.about"), to: "/about" },
        { name: t("menu.article"), to: "/article" },
        { name: t("menu.favorite"), to: "/favorites" },
        { name: t("menu.mortgage"), to: "/mortgage-calculator" },
        { name: t("menu.agency"), to: "/agency" },
        { name: t("menu.valuation"), to: "/valuation" },
        { name: t("menu.certificate"), to: "/Certificate" },
        { name: t("menu.services"), to: "/services" },
      ],
    },
    { name: t("menu.contact"), to: "/contact", current: true },
  ];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const languageOptions = [
    { code: "en", label: "EN", flag: enFlag },
    { code: "km", label: "ខ្មែរ", flag: khFlag },
    { code: "zh", label: "中文", flag: cnFlag },
  ];
  const currentLang =
    languageOptions.find((l) => l.code === i18n.language) || languageOptions[0];

  const handleCloseAnniversaryModal = () => {
    setShowAnniversaryModal(false);
    localStorage.setItem("anniversaryModalShown", "true");
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Anniversary Modal */}
      {showAnniversaryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-30">
          {/* Confetti Animation */}
          <div className="pointer-events-none absolute inset-0 z-[101] overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full opacity-80 animate-confetti`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20 + 2}%`,
                  width: `${Math.random() * 10 + 8}px`,
                  height: `${Math.random() * 10 + 8}px`,
                  background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  animationDuration: `${Math.random() * 1.5 + 1.5}s`,
                }}
              />
            ))}
          </div>
          <div className="relative w-[80vw] h-[80vh] bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-modal-pop p-8 border border-white/40">
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <h2
              className="text-5xl font-extrabold text-blue-700 mb-2 text-center tracking-tight drop-shadow-lg"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              27 Years Anniversary
            </h2>
            <div className="text-xl text-gray-700 mb-6 text-center font-semibold tracking-wide">
              Since 1998
            </div>
            <p className="text-2xl text-gray-800 mb-10 text-center max-w-2xl font-medium">
              We are proud to celebrate{" "}
              <span className="font-bold text-blue-700">27 years</span> of
              service.
              <br />
              Thank you for your trust and support!
            </p>
            <button
              onClick={handleCloseAnniversaryModal}
              className="mt-auto px-10 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200 text-xl z-10 flex items-center gap-2"
            >
              Close
              <span className="ml-2 text-white text-base">
                {anniversaryCountdown}
              </span>
            </button>
          </div>
          <style>{`
            @keyframes modal-pop {
              0% { opacity: 0; transform: scale(0.85) translateY(40px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-modal-pop {
              animation: modal-pop 0.5s cubic-bezier(.4,0,.2,1) both;
            }
            @keyframes confetti {
              0% { opacity: 0.8; transform: translateY(0) scale(1) rotate(0deg); }
              80% { opacity: 0.8; }
              100% { opacity: 0; transform: translateY(90vh) scale(1.2) rotate(360deg); }
            }
            .animate-confetti {
              animation: confetti linear forwards;
            }
          `}</style>
        </div>
      )}
      <Disclosure
        as="nav"
        className={`top-0 left-0 right-0 z-50 transition-all duration-300 h-16
          ${
            isAtTop
              ? "absolute bg-white/30 backdrop-blur-md shadow-sm"
              : "fixed bg-white shadow-md"
          }
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <NavLink to="/">
                  <img
                    className="h-auto w-40 xl:w-52 cursor-pointer"
                    src="https://externalchecking.com/logo/care.png"
                    alt="Company Logo"
                  />
                </NavLink>
              </div>
            </div>

            <div className="hidden md:flex items-center md:space-x-0 lg:space-x-4">
              {navigation.map((item, idx) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setHoveredMenu(idx)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        className={classNames(
                          "px-2 py-5 rounded-md  md:text-xs sm:text-sm xl:text-base uppercase  flex items-center gap-1 transition-all duration-200",
                          hoveredMenu === idx
                            ? "text-blue-600"
                            : "text-black hover:text-blue-600"
                        )}
                      >
                        {item.name}
                        <ChevronDownIcon
                          className={classNames(
                            "w-4 h-4 transition-transform duration-200",
                            hoveredMenu === idx ? "rotate-180" : ""
                          )}
                        />
                      </button>
                      <div
                        ref={hoveredMenu === idx ? dropdownRef : null}
                        className={classNames(
                          "absolute left-0  w-48  shadow-2xl bg-white overflow-hidden z-50 origin-top transition-all duration-300 ease-out",
                          hoveredMenu === idx
                            ? "scale-100 opacity-100 pointer-events-auto translate-y-0"
                            : "scale-95 opacity-0 pointer-events-none -translate-y-2"
                        )}
                      >
                        <div className="">
                          {item.children.map((subItem) => (
                            <NavLink
                              key={subItem.name}
                              to={subItem.to}
                              className={({ isActive }) =>
                                classNames(
                                  "block px-5 py-2 text-sm md:text-md xl:text-base uppercase transition-all duration-200  transform hover:translate-x-1",
                                  isActive
                                    ? "bg-blue-600 text-white font-semibold"
                                    : "text-black hover:bg-blue-50 hover:text-blue-700"
                                )
                              }
                            >
                              {subItem.name}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "text-blue-600"
                            : "text-black hover:text-blue-600",
                          "px-2 py-5 rounded-md  md:text-xs sm:text-sm xl:text-base uppercase transition-all duration-200"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {userToken ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="p-0 m-0 border rounded-full border-blue-900 bg-transparent"
                >
                  {currentUser?.profile ? (
                    <img
                      src={currentUser.profile}
                      alt={currentUser.name || "User"}
                      className="w-8 h-8 rounded-full  object-cover cursor-pointer"
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 bg-blue-600 p-2 text-white rounded-full cursor-pointer" />
                  )}
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-1 rounded bg-gradient-to-r from-blue-500 to-blue-700 text-white text-base hover:from-blue-600 hover:to-blue-800 transition-all duration-200 focus:outline-none ml-0"
                >
                  {t("menu.login")}
                </button>
              )}
              {/* Language Switcher Dropdown */}
              <div className="relative ml-2" ref={langRef}>
                <button
                  onClick={() => setLangDropdownOpen((open) => !open)}
                  className="flex items-center px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-blue-700 focus:outline-none"
                  aria-label="Select language"
                >
                  <img
                    src={currentLang.flag}
                    alt={currentLang.label}
                    className="w-6 h-5"
                  />
                  {/* {currentLang.label} */}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg z-50">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center w-full px-3 py-2 hover:bg-blue-50 ${
                          i18n.language === lang.code
                            ? "bg-blue-100 font-bold"
                            : ""
                        }`}
                      >
                        <img
                          src={lang.flag}
                          alt={lang.label}
                          className="w-7 h-5 mr-2"
                        />
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-gray-700 hover:text-blue-600"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </Disclosure>

      {/* Remove the floating/fixed language switcher for mobile. Only keep the one inside the mobile menu drawer below the close button. */}
      {mobileMenuOpen && (
        <div
          className={`fixed top-0 right-0 z-50 h-full w-72 max-w-full bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ maxHeight: "100vh" }}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{t("menu.menu")}</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 bg-blue-600 text-white rounded-full"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          {/* Language Switcher for Mobile - only here, under close button */}
          <div
            className="flex items-center justify-end px-4 py-2 border-b"
            ref={langRef}
          >
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen((open) => !open)}
                className="flex items-center px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-blue-700 focus:outline-none"
                aria-label="Select language"
              >
                <img
                  src={currentLang.flag}
                  alt={currentLang.label}
                  className="w-5 h-5 mr-1"
                />
                {currentLang.label}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg z-50">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center w-full px-3 py-2 hover:bg-blue-50 ${
                        i18n.language === lang.code
                          ? "bg-blue-100 font-bold"
                          : ""
                      }`}
                    >
                      <img
                        src={lang.flag}
                        alt={lang.label}
                        className="w-7 h-5 mr-2"
                      />
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="p-4 space-y-2">
            {navigation.map((item, idx) => (
              <div key={item.name} className="space-y-2">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMobileMenu(openMobileMenu === idx ? null : idx)
                      }
                      className={classNames(
                        "flex justify-between px-3 items-center w-full text-left text-md text-gray-700 hover:text-blue-600 transition-all duration-200",
                        openMobileMenu === idx ? "text-blue-600" : ""
                      )}
                    >
                      {item.name}
                      <ChevronDownIcon
                        className={`h-5 w-5 transition-transform duration-200 ${
                          openMobileMenu === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={classNames(
                        "overflow-hidden transition-all duration-300 ease-out",
                        openMobileMenu === idx
                          ? "max-h-96 opacity-100 visible"
                          : "max-h-0 opacity-0 invisible"
                      )}
                    >
                      <div className="mt-2 pl-4 space-y-1">
                        {item.children.map((subItem) => (
                          <NavLink
                            key={subItem.name}
                            to={subItem.to}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setOpenMobileMenu(null);
                            }}
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? "bg-blue-600 text-white font-semibold"
                                  : "text-gray-600 hover:text-blue-500",
                                "block rounded-md px-3 py-2 text-base transition-all duration-200 transform hover:translate-x-1"
                              )
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:text-blue-500",
                        "block rounded-md px-3 py-2 text-md transition-all duration-200"
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                )}
              </div>
            ))}

            {userToken && (
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block mt-4 px-4 py-2 text-center rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                {t("menu.my_profile")}
              </NavLink>
            )}

            {userToken ? (
              <button
                onClick={(ev) => {
                  logout(ev);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left mt-6 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                {t("menu.sign_out")}
              </button>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block mt-6 px-4 py-2 text-center rounded-md bg-blue-600 text-white hover:bg-blue-500"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
      <div className="pt-16"></div>
      <div>
        <Breadcrumb />
        <Outlet />
        <Footer />
      </div>

      <style>{`
        @keyframes dropdown-fade {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        .animate-dropdown-fade {
          animation: dropdown-fade 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        /* Smooth hover transitions */
        .hover\\:translate-x-1:hover {
          transform: translateX(0.25rem);
        }
        
        /* Mobile menu smooth transitions */
        .mobile-menu-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
