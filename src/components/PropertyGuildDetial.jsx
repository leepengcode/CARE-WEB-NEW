import { useTranslation } from "react-i18next";
import { FaChartLine, FaHandshake, FaHome, FaKey } from "react-icons/fa";
import PageComponents from "./PageComponents";

export default function PropertyGuildDetail() {
  const { t } = useTranslation();
  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-4  md:py-8 px-0 md:px-10">
        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[50vh] rounded-xl overflow-hidden mb-8">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
            alt="Property Guide"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
              {t("property_guide_detail.title")}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Buying Section */}
          <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaHome className="text-2xl text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {t("property_guide_detail.buying_title")}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-gray-600">
                  {t("property_guide_detail.buying_desc")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>{t("property_guide_detail.buying_list1")}</li>
                  <li>{t("property_guide_detail.buying_list2")}</li>
                  <li>{t("property_guide_detail.buying_list3")}</li>
                  <li>{t("property_guide_detail.buying_list4")}</li>
                  <li>{t("property_guide_detail.buying_list5")}</li>
                  <li>{t("property_guide_detail.buying_list6")}</li>
                </ul>
              </div>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
                alt="Buying Property"
                className="rounded-lg shadow-md w-full h-64 object-cover"
              />
            </div>
          </section>

          {/* Selling Section */}
          <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <FaHandshake className="text-2xl text-green-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {t("property_guide_detail.selling_title")}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
                alt="Selling Property"
                className="rounded-lg shadow-md w-full h-64 object-cover md:order-2"
              />
              <div className="space-y-4 md:order-1">
                <p className="text-gray-600">
                  {t("property_guide_detail.selling_desc")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>{t("property_guide_detail.selling_list1")}</li>
                  <li>{t("property_guide_detail.selling_list2")}</li>
                  <li>{t("property_guide_detail.selling_list3")}</li>
                  <li>{t("property_guide_detail.selling_list4")}</li>
                  <li>{t("property_guide_detail.selling_list5")}</li>
                  <li>{t("property_guide_detail.selling_list6")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Renting Section */}
          <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-100 p-3 rounded-full">
                <FaKey className="text-2xl text-purple-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {t("property_guide_detail.renting_title")}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-gray-600">
                  {t("property_guide_detail.renting_desc")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>{t("property_guide_detail.renting_list1")}</li>
                  <li>{t("property_guide_detail.renting_list2")}</li>
                  <li>{t("property_guide_detail.renting_list3")}</li>
                  <li>{t("property_guide_detail.renting_list4")}</li>
                  <li>{t("property_guide_detail.renting_list5")}</li>
                  <li>{t("property_guide_detail.renting_list6")}</li>
                </ul>
              </div>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
                alt="Renting Property"
                className="rounded-lg shadow-md w-full h-64 object-cover"
              />
            </div>
          </section>

          {/* Investing Section */}
          <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaChartLine className="text-2xl text-yellow-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {t("property_guide_detail.investing_title")}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3"
                alt="Property Investment"
                className="rounded-lg shadow-md w-full h-64 object-cover md:order-2"
              />
              <div className="space-y-4 md:order-1">
                <p className="text-gray-600">
                  {t("property_guide_detail.investing_desc")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>{t("property_guide_detail.investing_list1")}</li>
                  <li>{t("property_guide_detail.investing_list2")}</li>
                  <li>{t("property_guide_detail.investing_list3")}</li>
                  <li>{t("property_guide_detail.investing_list4")}</li>
                  <li>{t("property_guide_detail.investing_list5")}</li>
                  <li>{t("property_guide_detail.investing_list6")}</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageComponents>
  );
}
