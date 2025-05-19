import { PhoneIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaTelegram,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import MortgageCalculator from "./MortgageCalculator";
import PageComponents from "./PageComponents";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMortgage, setShowMortgage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionRef = useRef(null);
  const [isDescriptionLong, setIsDescriptionLong] = useState(false);
  const thumbnailContainerRef = useRef(null);

  useEffect(() => {
    fetchPropertyDetail();
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

  const fetchPropertyDetail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8001/api/get_property_public`,
        { params: { limit: 1000 } }
      );
      if (response.data && response.data.data) {
        const found = response.data.data.find(
          (p) => String(p.id) === String(id)
        );
        setProperty(found || null);
        if (found) {
          setSelectedImage(found.title_image);
        }
      }
    } catch (error) {
      console.error("Error fetching property:", error);
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

  if (isLoading) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-2 md:py-5 md:px-10">
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

  if (!property) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-2 md:py-5 md:px-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Property Not Found
          </h2>
          <button
            onClick={() => navigate("/property")}
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
      <div className="w-full max-w-6xl mx-auto py-2 md:py-5 md:px-10">
        <div className="flex justify-between items-center mb-4">
          {/* Back Button */}
          <button
            onClick={() => navigate("/property")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-100 active:bg-gray-200 transition text-blue-600 font-medium"
          >
            <FaChevronLeft className="w-4 h-4" />
            <span className="text-base">Back</span>
          </button>

          {/* Share and Favorite Buttons */}
          <div className="flex gap-2">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
              <FaShareAlt className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
              {property?.is_favourite ? (
                <FaHeart className="w-5 h-5 text-red-500" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-[300px] md:h-[600px]">
            <img
              src={selectedImage || property?.title_image}
              alt={property?.title}
              className="w-full h-full object-cover rounded-lg"
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
                className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar "
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
                    key={index}
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
            <p className="text-2xl py-2 md:py-4	 font-bold text-blue-600">
              ${property.price.toLocaleString()}
            </p>

            {/* Property Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 md:py-4">
              {property.parameters?.map((param) => (
                <div
                  key={param.id}
                  className="flex items-center  gap-2 bg-gray-50 rounded-lg"
                >
                  <div className="bg-blue-200 p-2 rounded-lg">
                    <img
                      src={param.image}
                      alt={param.name}
                      className=" w-4 h-4 md:w-6 md:h-6"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{param.name}</p>
                    <p className="font-semibold">{param.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr className=" my-2 md:my-4" />
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr />
            {/* Owner & Campany Information */}
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
            <div className="border-t pt-6">
              <button
                onClick={() => setShowMortgage(!showMortgage)}
                className="flex items-center gap-2 text-blue-600 font-semibold mb-4"
              >
                <span className="text-lg">Mortgage Calculator</span>
              </button>

              {showMortgage && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <MortgageCalculator initialLoanAmount={property.price} />
                </div>
              )}
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
      `}</style>
    </PageComponents>
  );
};

export default PropertyDetail;
