import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/shared/Breadcrumb.jsx";
import Footer from "../components/shared/Footer.jsx";
import { useStateContext } from "../contexts/ContextProvider.jsx";

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
  const [openMenu, setOpenMenu] = useState(null);
  const [openMobileMenu, setOpenMobileMenu] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
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
    { name: "Home", to: "/", current: true },
    {
      name: "Property",
      to: "/property",
      current: true,
      children: [
        { name: "Properties", to: "/properties" },
        { name: "My Property", to: "/my-property" },
        { name: "Add Property", to: "/add-property" },
      ],
    },
    {
      name: "Category",
      to: " ",
      current: true,
      children: [
        { name: "Residential", to: "/residential" },
        { name: "Condo", to: "/condo" },
        { name: "Commercial", to: "/commercial" },
        { name: "Industrial", to: "/industrial" },
        { name: "Land", to: "/land" },
        { name: "Business for sell", to: "/business-for-sell" },
        { name: "Algricalture Land", to: "/agriculture-land" },
        { name: "High Building", to: "/high-building" },
      ],
    },
    {
      name: "Page",
      to: "/page",
      current: true,
      children: [
        { name: "About", to: "/about" },
        { name: "Article", to: "/article" },
        { name: "Favorite", to: "/favorites" },
        { name: "Mortgage", to: "/mortgage-calculator" },
        { name: "Agency", to: "/agency" },
        { name: "Consultant", to: "/consultant" },
        { name: "Certificate ", to: "/Certificate" },
        { name: "Services", to: "/services" },
      ],
    },
    { name: "Contact", to: "/contact", current: true },
  ];

  return (
    <div className="min-h-full bg-gray-50">
      <Disclosure
        as="nav"
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-white shadow-md ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <img
                  className="h-auto w-44 md:w-52"
                  src="https://externalchecking.com/logo/care.png"
                  alt="Company Logo"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center md:space-x-0 lg:space-x-4">
              {navigation.map((item, idx) => (
                <div key={item.name} className="relative">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(openMenu === idx ? null : idx)
                        }
                        className={classNames(
                          "px-3 py-2 rounded-md text-sm font-semibold uppercase flex items-center gap-1 transition-all",
                          openMenu === idx
                            ? "text-blue-600"
                            : "text-gray-700 hover:text-blue-600"
                        )}
                      >
                        {item.name}
                        <ChevronDownIcon
                          className={classNames(
                            "w-4 h-4 transition-transform",
                            openMenu === idx ? "rotate-180" : ""
                          )}
                        />
                      </button>
                      <div
                        className={classNames(
                          "absolute left-0 mt-4 w-44 rounded-md shadow-lg bg-white overflow-hidden transition-all duration-200 z-20",
                          openMenu === idx
                            ? "max-h-96 opacity-100 visible"
                            : "max-h-0 opacity-0 invisible"
                        )}
                        style={{ transitionProperty: "max-height, opacity" }}
                      >
                        <div className="py-1">
                          {item.children.map((subItem) => (
                            <NavLink
                              key={subItem.name}
                              to={subItem.to}
                              className={({ isActive }) =>
                                classNames(
                                  "block px-4 py-2 text-sm transition-all",
                                  isActive
                                    ? "bg-red-600 text-white font-semibold"
                                    : "text-gray-700 hover:bg-blue-600 hover:text-white"
                                )
                              }
                              onClick={() => setOpenMenu(null)}
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
                            : "text-gray-700 hover:text-blue-600",
                          "px-3 py-2 rounded-md text-sm font-semibold uppercase transition-all"
                        )
                      }
                      onClick={() => setOpenMenu(null)}
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
                  className="p-0 m-0 border-none bg-transparent"
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
                  className="bg-blue-500 py-2 px-4 rounded-md text-white hover:bg-blue-600 transition-colors"
                >
                  Login
                </button>
              )}
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

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 max-w-full bg-white shadow-2xl transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 bg-blue-600 text-white rounded-full"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
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
                      "flex justify-between px-3 items-center w-full text-left text-md text-gray-700 hover:text-blue-600",
                      openMobileMenu === idx ? "text-blue-600" : ""
                    )}
                  >
                    {item.name}
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform ${
                        openMobileMenu === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={classNames(
                      "overflow-hidden transition-all duration-200",
                      openMobileMenu === idx
                        ? "max-h-96 opacity-100 visible"
                        : "max-h-0 opacity-0 invisible"
                    )}
                    style={{ transitionProperty: "max-height, opacity" }}
                  >
                    <div className="mt-2 pl-4 space-y-2">
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
                              "block rounded-md px-3 py-2 text-base transition-all"
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
                      "block rounded-md px-3 py-2 text-md transition-all"
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
              My Profile
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
              Sign out
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

      <div className="pt-20">
        <Breadcrumb />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
