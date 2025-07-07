import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../../components/shared/CustomDropdown";

const PropertyFilters = ({ onFilter, onClear }) => {
  const { t } = useTranslation();

  const saleRentOptions = [
    { value: null, label: t("properties_page.filters.all") },
    { value: "sell", label: t("properties_page.filters.sell") },
    { value: "rent", label: t("properties_page.filters.rent") },
  ];

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Filter states
  const [saleRent, setSaleRent] = useState(null);
  const [propertyType, setPropertyType] = useState(null);
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [commune, setCommune] = useState(null);
  const [village, setVillage] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [keyword, setKeyword] = useState("");

  // Address dropdown options
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);

  // Fetch address data
  const fetchAddress = async (code = "", types) => {
    try {
      const response = await fetch(
        `https://externalchecking.com/api/api_rone_new/public/api/get_address?code=${code}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      if (!Array.isArray(result)) {
        console.error(
          `Expected array for code=${code}, types=${types}, got:`,
          result
        );
        return [{ value: null, label: "No data available" }];
      }

      const options = result
        .filter((item) => types.includes(item.type))
        .map((item) => ({
          value: item.code,
          label: item.name,
        }));

      if (options.length === 0) {
        return [{ value: null, label: "No data available" }];
      }

      return [
        { value: null, label: t("properties_page.filters.all") },
        ...options,
      ];
    } catch (err) {
      console.error(`Error fetching types=${types} for code=${code}:`, err);
      return [{ value: null, label: "No data available" }];
    }
  };

  // Load provinces on mount
  useEffect(() => {
    fetchAddress("855", ["province"]).then(setProvinceOptions);
  }, []);

  // Fetch districts/khans when province changes
  useEffect(() => {
    if (province && province.value) {
      fetchAddress(province.value, ["district", "khan"]).then((options) => {
        setDistrictOptions(options);
        setDistrict(null);
        setCommuneOptions([]);
        setCommune(null);
        setVillageOptions([]);
        setVillage(null);
      });
    } else {
      setDistrictOptions([]);
      setDistrict(null);
      setCommuneOptions([]);
      setCommune(null);
      setVillageOptions([]);
      setVillage(null);
    }
  }, [province]);

  // Fetch communes/sangkats when district changes
  useEffect(() => {
    if (district && district.value) {
      fetchAddress(district.value, ["commune", "sangkat"]).then((options) => {
        setCommuneOptions(options);
        setCommune(null);
        setVillageOptions([]);
        setVillage(null);
      });
    } else {
      setCommuneOptions([]);
      setCommune(null);
      setVillageOptions([]);
      setVillage(null);
    }
  }, [district]);

  // Fetch villages when commune changes
  useEffect(() => {
    if (commune && commune.value) {
      fetchAddress(commune.value, ["village"]).then((options) => {
        setVillageOptions(options);
        setVillage(null);
      });
    } else {
      setVillageOptions([]);
      setVillage(null);
    }
  }, [commune]);

  const handleFilterClick = () => {
    const filters = {
      type: saleRent?.value ? saleRent.value.toLowerCase() : null,
      category: propertyType?.value || null,
      city: province?.value || null,
      district: district?.value || null,
      commune: commune?.value || null,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      keyword: keyword || null,
    };
    onFilter(filters);
  };

  const clearFilters = () => {
    setSaleRent(null);
    setPropertyType(null);
    setProvince(null);
    setDistrict(null);
    setCommune(null);
    setVillage(null);
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
              {t("properties_page.filters.title")}
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
              options={saleRentOptions}
              value={saleRent}
              onChange={setSaleRent}
              placeholder={t("properties_page.filters.sale_rent_placeholder")}
            />
            <CustomDropdown
              options={propertyTypeOptions}
              value={propertyType}
              onChange={setPropertyType}
              placeholder={t("properties_page.filters.type_label")}
            />
            <CustomDropdown
              options={provinceOptions}
              value={province}
              onChange={setProvince}
              placeholder={t("properties_page.filters.province_placeholder")}
            />
            <CustomDropdown
              options={districtOptions}
              value={district}
              onChange={setDistrict}
              placeholder={t("properties_page.filters.district_placeholder")}
              isDisabled={!province || provinceOptions.length <= 1}
            />
            <CustomDropdown
              options={communeOptions}
              value={commune}
              onChange={setCommune}
              placeholder={t("properties_page.filters.commune_placeholder")}
              isDisabled={!district || districtOptions.length <= 1}
            />
            <CustomDropdown
              options={villageOptions}
              value={village}
              onChange={setVillage}
              placeholder={t("properties_page.filters.village_placeholder")}
              isDisabled={!commune || communeOptions.length <= 1}
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

export default PropertyFilters;
