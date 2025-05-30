import { PhoneIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaCopy,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaTelegram,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { fetchPropertyById, toggleFavorite } from "../api/propertyApi";
import { useStateContext } from "../contexts/ContextProvider";
import PageComponents from "./PageComponents";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDescriptionLong, setIsDescriptionLong] = useState(false);
  const descriptionRef = useRef(null);
  const thumbnailContainerRef = useRef(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef(null);
  const { userToken } = useStateContext();
  const [favLoading, setFavLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    fetchPropertyDetail();
    setImgLoaded(false);
  }, [id]);

  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseInt(
        window.getComputedStyle(descriptionRef.current).lineHeight
      );
      const height = descriptionRef.current.scrollHeight;
      const lines = height / lineHeight;
      setIsDescriptionLong(lines > 5);
    }
  }, [property?.description]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (property?.id) {
      const favIds = getFavoriteIds();
      setIsFav(favIds.includes(property.id));
    }
  }, [property?.id]);

  const fetchPropertyDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const propertyData = await fetchPropertyById(id);
      setProperty(propertyData);
      setSelectedImage(propertyData.title_image);
    } catch (error) {
      console.error("Error fetching property:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollThumbnailIntoView = (index) => {
    if (!thumbnailContainerRef.current) return;

    const thumbnailWidth = 88; // 80px width + 8px gap
    const containerWidth = thumbnailContainerRef.current.offsetWidth;
    const scrollPosition =
      index * thumbnailWidth - containerWidth / 2 + thumbnailWidth / 2;

    thumbnailContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  const handleNextImage = () => {
    if (!property?.gallery) return;
    const nextIndex = (currentImageIndex + 1) % (property.gallery.length + 1);
    setCurrentImageIndex(nextIndex);
    if (nextIndex === 0) {
      setSelectedImage(property.title_image);
    } else {
      setSelectedImage(property.gallery[nextIndex - 1].image_url);
    }
    scrollThumbnailIntoView(nextIndex);
  };

  const handlePrevImage = () => {
    if (!property?.gallery) return;
    const prevIndex =
      currentImageIndex === 0 ? property.gallery.length : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    if (prevIndex === 0) {
      setSelectedImage(property.title_image);
    } else {
      setSelectedImage(property.gallery[prevIndex - 1].image_url);
    }
    scrollThumbnailIntoView(prevIndex);
  };

  const handleBackClick = () => {
    const originPath = sessionStorage.getItem("originPath") || "/properties";
    navigate(originPath);
  };

  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for toast
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = `fixed right-8 top-8 z-50 px-6 py-3 rounded shadow text-white text-center transition-all duration-300 opacity-0 translate-x-10 ${
      type === "success"
        ? "bg-green-600"
        : type === "error"
        ? "bg-red-600"
        : "bg-blue-600"
    }`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove("opacity-0", "translate-x-10");
      toast.classList.add("opacity-100", "translate-x-0");
    }, 10);
    setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-x-0");
      toast.classList.add("opacity-0", "translate-x-10");
      setTimeout(() => document.body.removeChild(toast), 400);
    }, 2000);
  }

  // LocalStorage helpers for favorite property IDs
  function getFavoriteIds() {
    try {
      return JSON.parse(localStorage.getItem("favoritePropertyIds") || "[]");
    } catch {
      return [];
    }
  }
  function setFavoriteIds(ids) {
    localStorage.setItem("favoritePropertyIds", JSON.stringify(ids));
  }

  const handleToggleFavorite = async () => {
    if (!userToken) {
      showToast("Please log in to use favorites.", "error");
      return;
    }
    if (!property?.id || favLoading) return;
    setFavLoading(true);
    const type = isFav ? 0 : 1;
    try {
      const res = await toggleFavorite(property.id, type, userToken);
      if (!res.error) {
        let favIds = getFavoriteIds();
        if (type === 1) {
          favIds = [...new Set([...favIds, property.id])];
          showToast("Added to favorites!", "success");
        } else {
          favIds = favIds.filter((id) => id !== property.id);
          showToast("Removed from favorites!", "success");
        }
        setFavoriteIds(favIds);
        setIsFav(type === 1);
      }
    } catch {
      showToast("Failed to update favorite status.", "error");
    } finally {
      setFavLoading(false);
    }
  };

  // --- Custom Mortgage Calculator UI ---
  function MortgageCalculatorUI({ price }) {
    const [loanAmount, setLoanAmount] = useState(price || 0);
    const [interestRate, setInterestRate] = useState(4.5);
    const [loanTerm, setLoanTerm] = useState(30);

    // Mortgage calculation logic
    const principal = loanAmount;
    const monthlyInterest = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment =
      principal && interestRate && loanTerm
        ? Math.round(
            (principal * monthlyInterest) /
              (1 - Math.pow(1 + monthlyInterest, -numberOfPayments))
          )
        : 0;
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    const principalPayment = Math.round(
      monthlyPayment - principal * monthlyInterest
    );
    const interestPayment = Math.round(monthlyPayment - principalPayment);

    // For donut chart
    const principalPercent = principalPayment / monthlyPayment;
    const interestPercent = interestPayment / monthlyPayment;
    const donutRadius = 70;
    const donutCircumference = 2 * Math.PI * donutRadius;
    const principalStroke = donutCircumference * principalPercent;
    const interestStroke = donutCircumference * interestPercent;

    return (
      <div className="flex flex-col md:flex-row gap-6 mt-2">
        {/* Controls */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          {/* Loan Amount */}
          <div className="bg-white rounded-lg p-4 shadow">
            <label className="block text-gray-700 font-semibold mb-2">
              Loan Amount
            </label>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold">$</span>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full max-w-[160px]"
                value={loanAmount}
                min={0}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
            </div>
            <input
              type="range"
              min={0}
              max={price}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {/* Interest Rate */}
          <div className="bg-white rounded-lg p-4 shadow">
            <label className="block text-gray-700 font-semibold mb-2">
              Interest Rate
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                className="border rounded px-2 py-1 w-full max-w-[80px]"
                value={interestRate}
                min={0}
                step={0.01}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
              <span className="text-lg font-bold">%</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              step={0.01}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {/* Loan Term */}
          <div className="bg-white rounded-lg p-4 shadow">
            <label className="block text-gray-700 font-semibold mb-2">
              Loan Term
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                className="border rounded px-2 py-1 w-full max-w-[80px]"
                value={loanTerm}
                min={1}
                max={40}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
              />
              <span className="text-lg font-bold">years</span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        {/* Donut Chart and Summary */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          {/* Donut Chart */}
          <div className="flex flex-col items-center">
            <svg width={180} height={180} className="mb-2">
              <circle
                cx={90}
                cy={90}
                r={donutRadius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={18}
              />
              {/* Interest (blue) */}
              <circle
                cx={90}
                cy={90}
                r={donutRadius}
                fill="none"
                stroke="#2563eb"
                strokeWidth={18}
                strokeDasharray={`${interestStroke} ${donutCircumference}`}
                strokeDashoffset={0}
                transform="rotate(-90 90 90)"
              />
              {/* Principal (red) */}
              <circle
                cx={90}
                cy={90}
                r={donutRadius}
                fill="none"
                stroke="#ef4444"
                strokeWidth={18}
                strokeDasharray={`${principalStroke} ${donutCircumference}`}
                strokeDashoffset={interestStroke * -1}
                transform="rotate(-90 90 90)"
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                fontSize="1.7em"
                fontWeight="bold"
                fill="#222"
              >
                ${monthlyPayment.toLocaleString()}
              </text>
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                fontSize="1em"
                fill="#444"
              >
                / month
              </text>
            </svg>
            <div className="flex flex-col items-center text-sm">
              <span className="text-red-500 font-semibold">
                ${principalPayment.toLocaleString()} principal payment per month
              </span>
              <span className="text-blue-500 font-semibold">
                ${interestPayment.toLocaleString()} interest payment per month
              </span>
            </div>
          </div>
          {/* Summary Table */}
          <div className="bg-white rounded-lg shadow p-4 mt-4 w-full max-w-xl">
            <h3 className="font-bold text-lg mb-2">Summary</h3>
            {/* Desktop Table */}
            <table className="w-full min-w-[500px] hidden md:table">
              <tbody>
                <tr className="border-b">
                  <td className="font-semibold whitespace-nowrap">
                    Principal Payment
                  </td>
                  <td className="text-green-700 font-bold whitespace-nowrap">
                    ${principalPayment.toLocaleString()}
                  </td>
                  <td className="font-semibold whitespace-nowrap">
                    Interest Payment
                  </td>
                  <td className="text-blue-700 font-bold whitespace-nowrap">
                    ${interestPayment.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold whitespace-nowrap">
                    Monthly Payment
                  </td>
                  <td className="font-bold whitespace-nowrap">
                    ${monthlyPayment.toLocaleString()}
                  </td>
                  <td className="font-semibold whitespace-nowrap">
                    Total Payments
                  </td>
                  <td className="font-bold whitespace-nowrap">
                    ${totalPayment.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold whitespace-nowrap">
                    Total Interest Payments
                  </td>
                  <td className="font-bold text-blue-700 whitespace-nowrap">
                    ${totalInterest.toLocaleString()}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            {/* Mobile Stacked Summary */}
            <div className="flex flex-col gap-2 md:hidden">
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold">Principal Payment</span>
                <span className="text-green-700 font-bold">
                  ${principalPayment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold">Interest Payment</span>
                <span className="text-blue-700 font-bold">
                  ${interestPayment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold">Monthly Payment</span>
                <span className="font-bold">
                  ${monthlyPayment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold">Total Payments</span>
                <span className="font-bold">
                  ${totalPayment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Interest Payments</span>
                <span className="font-bold text-blue-700">
                  ${totalInterest.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-2 md:py-5 lg:px-10">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </PageComponents>
    );
  }

  if (error) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-2 md:py-5 md:px-10">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Property
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/properties")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </PageComponents>
    );
  }

  if (!property) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-2 md:py-5 md:px-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Property Not Found
          </h2>
          <button
            onClick={() => navigate("/properties")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </PageComponents>
    );
  }

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-2 md:py-5 lg:px-10">
        <div className="flex justify-between items-center mb-4">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-100 active:bg-gray-200 transition text-blue-600 font-medium"
          >
            <FaChevronLeft className="w-4 h-4" />
            <span className="text-base">Back</span>
          </button>

          {/* Share and Favorite Buttons */}
          <div className="flex gap-2">
            <button
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              onClick={handleToggleFavorite}
              disabled={favLoading}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              {favLoading ? (
                <svg
                  className="animate-spin w-5 h-5 text-gray-400"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : isFav ? (
                <FaHeart className="w-5 h-5 text-red-500" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={handleShareClick}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-200"
              >
                <FaShareAlt className="w-5 h-5 text-gray-600" />
              </button>

              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg p-4 z-50 animate-fade-in-up">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800">
                        Share Property
                      </h3>
                      <button
                        onClick={() => setShowShareMenu(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>

                    {/* Social Media Buttons */}
                    <div className="flex justify-between gap-2">
                      <FacebookShareButton
                        url={window.location.href}
                        quote={property?.title}
                      >
                        <FacebookIcon size={40} round />
                      </FacebookShareButton>

                      <TwitterShareButton
                        url={window.location.href}
                        title={property?.title}
                      >
                        <TwitterIcon size={40} round />
                      </TwitterShareButton>

                      <TelegramShareButton
                        url={window.location.href}
                        title={property?.title}
                      >
                        <TelegramIcon size={40} round />
                      </TelegramShareButton>

                      <WhatsappShareButton
                        url={window.location.href}
                        title={property?.title}
                      >
                        <WhatsappIcon size={40} round />
                      </WhatsappShareButton>
                    </div>

                    {/* Copy Link Button */}
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <>
                          <FaCheck className="text-green-500" />
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <FaCopy />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-[300px] md:h-[600px]">
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <svg
                  className="animate-spin h-12 w-12 text-blue-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              </div>
            )}
            <img
              src={selectedImage || property?.title_image}
              alt={property?.title}
              className="w-full h-full object-cover rounded-lg"
              onLoad={() => setImgLoaded(true)}
              style={{ display: imgLoaded ? "block" : "none" }}
            />

            {/* Navigation Buttons */}
            {property?.gallery && property.gallery.length > 0 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                >
                  <FaChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                >
                  <FaChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {property?.gallery && property.gallery.length > 0 && (
            <div className="py-2 bg-gray-50">
              <div
                ref={thumbnailContainerRef}
                className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar"
              >
                <div
                  onClick={() => {
                    setSelectedImage(property.title_image);
                    setCurrentImageIndex(0);
                    scrollThumbnailIntoView(0);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    currentImageIndex === 0
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={property.title_image}
                    alt="Main"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                {property.gallery.map((image, index) => (
                  <div
                    key={`gallery-${image.id || index}`}
                    onClick={() => {
                      setSelectedImage(image.image_url);
                      setCurrentImageIndex(index + 1);
                      scrollThumbnailIntoView(index + 1);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      currentImageIndex === index + 1
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Property Info */}
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-start mb-4 gap-4">
              <div className="flex items-center gap-2 text-white rounded-sm">
                <img
                  className="h-4 w-4 md:h-5 md:w-5"
                  src={property.category.image}
                  alt="category"
                />
                <p className="text-sm md:text-lg text-black">
                  {property.category.category}
                </p>
              </div>

              <div className="text-right bg-blue-400 py-1 px-2">
                <p className="text-sm text-white">{property.propery_type}</p>
              </div>
            </div>
            <div className="flex justify-between items-start py-2 md:py-2 gap-4">
              <div className="w-[90%] md:w-[100%]">
                <h1 className="text-md md:text-2xl font-bold text-gray-900 font-khmer mb-2">
                  {property.title}
                </h1>
              </div>
              <div className="w-[40%] md:w-[20%] text-right">
                <p className="text-sm md:text-xl text-black">
                  {property.post_created}
                </p>
              </div>
            </div>
            <p className="text-2xl py-2 md:py-4 font-bold text-blue-600">
              ${property.price.toLocaleString()}
            </p>

            {/* Property Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 md:py-4">
              {property.parameters?.map((param) => (
                <div
                  key={param.id}
                  className="flex items-center gap-2 bg-gray-50 rounded-lg"
                >
                  <div className="bg-blue-200 p-2 rounded-lg">
                    <img
                      src={param.image}
                      alt={param.name}
                      className="w-4 h-4 md:w-6 md:h-6"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{param.name}</p>
                    <p className="font-semibold">{param.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="my-2 md:my-4" />
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                About this property
              </h2>
              <div className="relative">
                <p
                  ref={descriptionRef}
                  className={`text-gray-600 font-khmer whitespace-pre-line ${
                    !showFullDescription && isDescriptionLong
                      ? "line-clamp-5"
                      : ""
                  }`}
                >
                  {property.description}
                </p>
                {isDescriptionLong && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 font-medium mt-2 hover:text-blue-700 transition-colors"
                  >
                    {showFullDescription ? "Show less" : "See more"}
                  </button>
                )}
              </div>
            </div>
            <hr />
            {/* Nearby Facilities */}
            {property.assign_facilities?.length > 0 && (
              <div className="py-2 md:py-4">
                <h2 className="text-lg font-semibold mb-2">
                  Outdoor Facilities
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {property.assign_facilities.map((facility) => (
                    <div
                      key={facility.id}
                      className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={facility.image}
                        alt={facility.name}
                        className="w-8 h-8"
                      />
                      <span className="text-sm text-center">
                        {facility.name}
                      </span>
                      <span className="text-sm text-center">
                        {facility.distance} KM
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr />
            {/* Owner & Company Information */}
            <div className="flex justify-between items-center py-4 md:py-4">
              <div className="w-[20%] md:w-auto rounded-full overflow-hidden">
                <img
                  src={property.agent_owner.profile}
                  alt="profile"
                  className="w-20 h-16 md:w-32 md:h-32 object-cover rounded-full"
                />
              </div>
              <div className="flex justify-between items-center w-[80%] md:w-auto md:flex-grow md:ml-4">
                <div className="w-[80%] md:w-auto px-2 md:px-4">
                  <h2 className="text-md md:text-xl font-semibold">
                    {property.agent_owner.name}
                  </h2>
                  <p className="text-sm md:text-lg text-gray-500">
                    {property.agent_owner.email}
                  </p>
                </div>
                <div className="w-[30%] md:w-auto px-2 md:px-4 flex gap-2 md:gap-4">
                  <a
                    href={`tel:${property.mobile || "0718489909"}`}
                    className="block"
                  >
                    <div className="bg-blue-500 rounded-full p-1 md:p-2 hover:bg-blue-600 transition-colors">
                      <PhoneIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                  </a>
                  <a
                    href={`https://t.me/${property.telegram_link || "121212"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="bg-blue-500 rounded-full p-1 md:p-2 hover:bg-blue-600 transition-colors">
                      <FaTelegram className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Mortgage Calculator */}
            <div className="border-t pt-2">
              <div className="flex items-center gap-2 text-blue-600 font-semibold ">
                <span className="text-lg">Mortgage Calculator</span>
              </div>
              <MortgageCalculatorUI price={property.price} />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .font-khmer {
          font-family: 'Noto Sans Khmer', Hanuman, Battambang, Siemreap, sans-serif;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out forwards;
        }
      `}</style>
    </PageComponents>
  );
};

export default PropertyDetail;
