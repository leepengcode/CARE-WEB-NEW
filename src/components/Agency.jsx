import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTelegram,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { fetchAgencies } from "../api/propertyApi";
import PageComponents from "./PageComponents";

const AgencySkeleton = ({ delay = 0 }) => (
  <div
    className="bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Agency() {
  const { t } = useTranslation();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    fetchAgencyData();
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchAgencyData = async () => {
    try {
      const data = await fetchAgencies();
      setAgencies(data);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgencyClick = (agency) => {
    setSelectedAgency(agency);
  };

  const handleCloseModal = () => {
    setSelectedAgency(null);
  };

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
              {t("agency_page.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("agency_page.subtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6)
              .fill(null)
              .map((_, index) => (
                <AgencySkeleton key={index} delay={index * 100} />
              ))
          ) : agencies.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <MdGroups className="text-blue-400 mb-4" size={80} />
              <div className="text-2xl font-semibold text-gray-500">
                {t("agency_page.not_found")}
              </div>
            </div>
          ) : (
            agencies.map((agency) => (
              <div
                key={agency.id}
                onClick={() => handleAgencyClick(agency)}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={agency.profile}
                      alt={agency.name}
                      className="w-20 h-20 rounded-full object-contain"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {agency.name}
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center">
                        <FaPhoneAlt className="mr-2" />
                        {agency.mobile}
                      </p>
                      <p className="text-gray-600 text-sm flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        {agency.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Slide-in Panel */}
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ease-in-out ${
            selectedAgency ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl w-[90%] md:w-[70%] h-auto mx-4 transform transition-transform duration-300 ease-in-out ${
              selectedAgency ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {selectedAgency && (
              <div className="p-4 md:p-8 h-full flex flex-col">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <IoClose size={24} />
                </button>

                <div className="flex flex-col md:flex-row gap-4 md:gap-8  justify-center h-full">
                  <div className="flex-shrink-0 w-full md:w-auto ">
                    <img
                      src={selectedAgency.profile}
                      alt={selectedAgency.name}
                      className="w-full h-[60vh] md:h-[70vh] rounded-lg object-cover"
                    />
                  </div>
                  <div className="hidden md:block w-px h-[70vh] bg-gradient-to-b from-gray-200 via-gray-400 to-gray-200 mx-4" />
                  <div className="w-full h-px md:hidden bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 my-4" />
                  <div className="flex-1 w-full md:w-auto py-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">
                      {selectedAgency.name}
                    </h2>

                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-center text-gray-600 text-base md:text-lg">
                        <FaPhoneAlt className="w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4 text-blue-600" />
                        <span>{selectedAgency.mobile}</span>
                      </div>

                      <div className="flex items-center text-gray-600 text-base md:text-lg">
                        <FaMapMarkerAlt className="w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4 text-blue-600" />
                        <span>{selectedAgency.address}</span>
                      </div>

                      {selectedAgency.email && (
                        <a
                          href={`mailto:${selectedAgency.email}`}
                          className="flex items-center text-blue-600 hover:text-blue-800 text-base md:text-lg"
                        >
                          <FaEnvelope className="w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4" />
                          <span>{selectedAgency.email}</span>
                        </a>
                      )}

                      {selectedAgency.telegram_link && (
                        <a
                          href={`https://t.me/${selectedAgency.telegram_link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 text-base md:text-lg"
                        >
                          <FaTelegram className="w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4" />
                          <span>{t("agency_page.contact_telegram")}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overlay */}
        {selectedAgency && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={handleCloseModal}
          />
        )}
      </div>
    </PageComponents>
  );
}
