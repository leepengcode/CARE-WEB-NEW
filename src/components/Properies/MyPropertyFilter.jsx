import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../shared/CustomDropdown";

const MyPropertyFilter = ({ onFilter, onClear }) => {
  const { t } = useTranslation();

  const propertyTypeOptions = [
    { value: null, label: t("properties_page.filters.all_types") },
    { value: "Residential", label: t("categories.residential") },
    { value: "Condo", label: t("categories.condo") },
    { value: "Commercial", label: t("categories.commercial") },
    { value: "Industrial", label: t("categories.industrial") },
    { value: "Land", label: t("categories.land") },
    { value: "Business for Sell", label: t("categories.business") },
    { value: "Agricultural Land", label: t("categories.agriculture") },
    { value: "High Building", label: t("categories.building") },
  ];

  const statusOptions = [
    { value: null, label: t("properties_page.filters.all_statuses") },
    { value: "0", label: t("properties_page.filters.pending") },
    { value: "1", label: t("properties_page.filters.active") },
  ];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Filter states
  const [propertyType, setPropertyType] = useState(null);
  const [status, setStatus] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleFilterClick = () => {
    const filters = {
      type: propertyType?.value || null,
      status: status?.value || null,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      keyword: keyword.trim() || null,
    };
    onFilter(filters);
  };

  const clearFilters = () => {
    setPropertyType(null);
    setStatus(null);
    setMinPrice("");
    setMaxPrice("");
    setKeyword("");
    onClear();
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={toggleFilters}
        className={`p-2 rounded-md bg-gray-200 hover:bg-gray-300`}
        aria-label="Toggle Filters"
      >
        <AdjustmentsHorizontalIcon className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* Filter Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {t("my_property_page.filters.title")}
            </h2>
            <button
              onClick={toggleFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <CustomDropdown
              options={propertyTypeOptions}
              value={propertyType}
              onChange={setPropertyType}
              placeholder={t("properties_page.filters.type_label")}
            />
            <CustomDropdown
              options={statusOptions}
              value={status}
              onChange={setStatus}
              placeholder={t("properties_page.filters.status_label")}
            />
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder={t("properties_page.filters.min_price_placeholder")}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder={t("properties_page.filters.max_price_placeholder")}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t("properties_page.filters.keyword_placeholder")}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                handleFilterClick();
                toggleFilters();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {t("properties_page.filters.apply")}
            </button>
            <button
              onClick={() => {
                clearFilters();
                toggleFilters();
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              {t("properties_page.filters.clear")}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleFilters}
        />
      )}
    </>
  );
};

export default MyPropertyFilter;
