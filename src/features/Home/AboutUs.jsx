import { PhoneIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBuilding,
  FaHistory,
  FaInfoCircle,
  FaRegChartBar,
  FaRegHandshake,
  FaRegStar,
  FaRegUser,
  FaServicestack,
} from "react-icons/fa";
import { MdHome, MdMail } from "react-icons/md";
import PageComponents from "../../components/PageComponents";

const ABOUT_IMAGE = "https://externalchecking.com/logo/aboutus.png";

const TEAM = [
  {
    name: "Alex Vanndoung",
    position: "Chief Operation Officer",
    image: "https://externalchecking.com/logo/doung.png",
    phone: "(+855) 69 78 78 87 - 63 78 78 87",
    email: "om@angkorrealestate.com",
  },
  {
    name: "Sorn Sovanndara",
    position: "Business Operation Officer",
    image: "https://externalchecking.com/logo/dara.png",
    phone: "(+855) 96 76 11 225 - 99 845 833",
    email: "valuationpp@angkorrealestate.com",
  },
  {
    name: "Oum Mouylim",
    position: "Valuation Officer",
    image: "https://externalchecking.com/logo/lim.png",
    phone: "(+855) 10 306 239",
    email: "valuationpp@angkorrealestate.com",
  },
  {
    name: "Alex Vanndoung",
    position: "Chief Operation Officer",
    image: "https://externalchecking.com/logo/doung.png",
    phone: "(+855) 69 78 78 87 - 63 78 78 87",
    email: "om@angkorrealestate.com",
  },
  {
    name: "Sorn Sovanndara",
    position: "Business Operation Officer",
    image: "https://externalchecking.com/logo/dara.png",
    phone: "(+855) 96 76 11 225 - 99 845 833",
    email: "valuationpp@angkorrealestate.com",
  },
  {
    name: "Oum Mouylim",
    position: "Valuation Officer",
    image: "https://externalchecking.com/logo/lim.png",
    phone: "(+855) 10 306 239",
    email: "valuationpp@angkorrealestate.com",
  },
  {
    name: "Alex Vanndoung",
    position: "Chief Operation Officer",
    image: "https://externalchecking.com/logo/doung.png",
    phone: "(+855) 69 78 78 87 - 63 78 78 87",
    email: "om@angkorrealestate.com",
  },
  {
    name: "Sorn Sovanndara",
    position: "Business Operation Officer",
    image: "https://externalchecking.com/logo/dara.png",
    phone: "(+855) 96 76 11 225 - 99 845 833",
    email: "valuationpp@angkorrealestate.com",
  },
  {
    name: "Oum Mouylim",
    position: "Valuation Officer",
    image: "https://externalchecking.com/logo/lim.png",
    phone: "(+855) 10 306 239",
    email: "valuationpp@angkorrealestate.com",
  },
  {
    name: "Alex Vanndoung",
    position: "Chief Operation Officer",
    image: "https://externalchecking.com/logo/doung.png",
    phone: "(+855) 69 78 78 87 - 63 78 78 87",
    email: "om@angkorrealestate.com",
  },
  {
    name: "Sorn Sovanndara",
    position: "Business Operation Officer",
    image: "https://externalchecking.com/logo/dara.png",
    phone: "(+855) 96 76 11 225 - 99 845 833",
    email: "valuationpp@angkorrealestate.com",
  },
  {
    name: "Oum Mouylim",
    position: "Valuation Officer",
    image: "https://externalchecking.com/logo/lim.png",
    phone: "(+855) 10 306 239",
    email: "valuationpp@angkorrealestate.com",
  },
];

export default function AboutUs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef();

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Move TAB_CONTENT inside the component to access t
  const TAB_CONTENT = [
    {
      label: (
        <span className="flex items-center gap-2">
          <FaInfoCircle className="text-white" /> {t("about.tabs.about")}
        </span>
      ),
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full h-20"></div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("about.our_story")}
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="text-lg">{t("about.our_story_content1")}</p>
                <p className="text-lg">{t("about.our_story_content2")}</p>
                <p className="text-lg">{t("about.our_story_content3")}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <FaServicestack className="text-white" /> {t("about.tabs.service")}
        </span>
      ),
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-l-4 border-blue-500 shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaRegHandshake className="text-white text-xl" />
                </div>
                <h4 className="font-bold text-blue-900 text-lg">
                  {t("about.service.agency_title")}
                </h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("about.service.agency_content")}
              </p>
            </div>
          </div>

          <div className="group hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-l-4 border-green-500 shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <FaRegChartBar className="text-white text-xl" />
                </div>
                <h4 className="font-bold text-green-900 text-lg">
                  {t("about.service.valuation_title")}
                </h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("about.service.valuation_content")}
              </p>
            </div>
          </div>

          <div className="group hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border-l-4 border-purple-500 shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <FaBuilding className="text-white text-xl" />
                </div>
                <h4 className="font-bold text-purple-900 text-lg">
                  {t("about.service.development_title")}
                </h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("about.service.development_content")}
              </p>
            </div>
          </div>

          <div className="group hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border-l-4 border-orange-500 shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <FaRegChartBar className="text-white text-xl" />
                </div>
                <h4 className="font-bold text-orange-900 text-lg">
                  {t("about.service.investment_title")}
                </h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("about.service.investment_content")}
              </p>
            </div>
          </div>

          <div className="group hover:scale-105 transition-all duration-300 md:col-span-2">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border-l-4 border-red-500 shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <FaRegUser className="text-white text-xl" />
                </div>
                <h4 className="font-bold text-red-900 text-lg">
                  {t("about.service.citizenship_title")}
                </h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {t("about.service.citizenship_content")}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <FaHistory className="text-white" /> {t("about.tabs.history")}
        </span>
      ),
      content: (
        <div className="space-y-8">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-yellow-500"></div>

            <div className="relative flex items-start gap-6 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <FaRegStar className="text-white text-2xl" />
              </div>
              <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  {t("about.vision_title")}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {t("about.vision_content")}
                </p>
              </div>
            </div>

            <div className="relative flex items-start gap-6 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <FaRegHandshake className="text-white text-2xl" />
              </div>
              <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-green-900 mb-3">
                  {t("about.mission_title")}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {t("about.mission_content")}
                </p>
              </div>
            </div>

            <div className="relative flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <FaRegUser className="text-white text-2xl" />
              </div>
              <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-500">
                <h3 className="text-xl font-bold text-yellow-900 mb-3">
                  {t("about.core_values_title")}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {t("about.core_values_content")}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const STATS = [
    {
      icon: <FaBuilding className="text-blue-600 text-3xl md:text-4xl" />,
      value: 44401,
      label: "Total Property",
      bg: "bg-blue-50",
      color: "blue",
    },
    {
      icon: <MdHome className="text-green-600 text-3xl md:text-4xl" />,
      value: 1412,
      label: "Total Rent Properties",
      bg: "bg-green-50",
      color: "green",
    },
    {
      icon: <FaRegChartBar className="text-purple-600 text-3xl md:text-4xl" />,
      value: 1382,
      label: "Total Sell Properties",
      bg: "bg-purple-50",
      color: "purple",
    },
    {
      icon: <FaRegUser className="text-orange-600 text-3xl md:text-4xl" />,
      value: 9,
      label: "Our Team",
      bg: "bg-orange-50",
      color: "orange",
    },
  ];

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            STATS.forEach((stat, index) => {
              let current = 0;
              const increment = stat.value / 100;
              const timer = setInterval(() => {
                current += increment;
                if (current >= stat.value) {
                  setCounts((prev) => {
                    const newCounts = [...prev];
                    newCounts[index] = stat.value;
                    return newCounts;
                  });
                  clearInterval(timer);
                } else {
                  setCounts((prev) => {
                    const newCounts = [...prev];
                    newCounts[index] = Math.floor(current);
                    return newCounts;
                  });
                }
              }, 20);
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-0 md:py-8 px-4 lg:px-8">
        {/* Hero Section */}

        <div
          className={`relative pt-10 pb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl mb-8 animate-pulse-slow">
              <FaRegHandshake className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent p-3 mb-6  leading-tight">
              {t("about.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("about.subtitle")}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
              <div className="relative p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div
                  className={`text-3xl md:text-4xl font-bold text-${stat.color}-600 mb-2`}
                >
                  {counts[idx].toLocaleString()}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Tab Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row bg-gradient-to-r from-gray-50 to-gray-100">
            {TAB_CONTENT.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 flex items-center justify-center gap-3 text-sm md:text-base relative overflow-hidden group
                  ${
                    activeTab === idx
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-blue-600 hover:bg-white"
                  }`}
              >
                {activeTab === idx && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-gray-50 to-white min-h-[400px]">
            <div className="transform transition-all duration-500 ease-in-out">
              {TAB_CONTENT[activeTab].content}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {t("about.team_title", "Our Team")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
          </div>

          <div className="flex flex-col sm:flex-col md:flex-row md:flex-wrap md:gap-6 gap-6">
            {TEAM.map((member, index) => (
              <div
                key={member.email}
                className="w-full sm:w-full md:w-[calc(50%-0.75rem)]"
              >
                <TeamMemberCard member={member} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageComponents>
  );
}

function TeamMemberCard({ member, index }) {
  const cardRef = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className={`transform transition-all duration-1000 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div
          className={`flex flex-col lg:flex-row ${
            isEven ? "" : "lg:flex-row-reverse"
          }`}
        >
          {/* Image Section */}
          <div className="lg:w-2/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-72 sm:h-80 lg:h-96 object-contain object-center transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

            {/* Floating badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-md">
              Team Member
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-3/5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center relative">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-lg sm:text-xl text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold">
                {member.position}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2  bg-gray-50/50 hover:bg-green-50/50 rounded-2xl transition-colors duration-300 group/item">
                <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover/item:shadow-lg transition-shadow duration-300">
                  <PhoneIcon className="text-white w-4 h-4" />
                </div>
                <a
                  href={`tel:${member.phone.replace(/\s+/g, "")}`}
                  className="text-gray-700 hover:text-green-600 transition-colors duration-300  flex-1"
                >
                  {member.phone}
                </a>
              </div>

              <div className="flex items-center gap-2 bg-gray-50/50 hover:bg-blue-50/50 rounded-2xl transition-colors duration-300 group/item">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover/item:shadow-lg transition-shadow duration-300">
                  <MdMail className="text-white w-4 h-4" />
                </div>
                <a
                  href={`mailto:${member.email}`}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-300 flex-1 text-sm sm:text-base"
                >
                  {member.email}
                </a>
              </div>

              {member.location && (
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 hover:bg-purple-50/50 rounded-2xl transition-colors duration-300 group/item">
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover/item:shadow-lg transition-shadow duration-300">
                    <MapPin className="text-white w-4 h-4" />
                  </div>
                  <span className="text-gray-700  flex-1">
                    {member.location}
                  </span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {member.twitter && (
                <a
                  href={member.twitter}
                  className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:scale-110 transition-all duration-300"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
