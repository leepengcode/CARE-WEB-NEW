import { useState } from "react";
import PageComponents from "./PageComponents";

export default function Services() {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <PageComponents>
      {/* Main content container */}
      <div className="w-full max-w-6xl mx-auto py-4 md:py-8 px-2 md:px-10 ">
        {/* Content wrapped for relative positioning */}
        <div className="relative z-10 ">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Section (Logo, Description, Book Now) - 30% width, blue background */}
            <div className="md:w-[50%] flex flex-col items-center md:items-start text-center md:text-left bg-blue-200 text-white p-2 rounded-lg relative">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
              )}
              <img
                src="https://externalchecking.com/logo/aboutus.png"
                alt="Care Logo"
                className="w-full h-full object-cover rounded-xl transition-opacity duration-300"
                style={{ opacity: imageLoading ? 0 : 1 }}
                onLoad={() => setImageLoading(false)}
              />
            </div>

            {/* Right Section (Our Services) - 70% width, white background */}
            <div className="md:w-[60%] bg-white md:p-6 p-0 rounded-lg">
              <h2 className="text-3xl font-bold mb-6 text-center md:text-left text-gray-800">
                OUR SERVICES
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {/* Service 1 */}
                <div className="md:p-4 p-2 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-blue-200 transition-colors duration-300">
                  <div>
                    <p className="font-semibold font-khmer md:text-2xl text-xl  text-gray-800">
                      ប្រឹក្សាយោបល់អចលនទ្រព្យ
                    </p>
                    <p className="md:text-2xl text-xl   text-gray-700">
                      Real Estate Agency & Consultancy
                    </p>
                    <p className="text-xl text-gray-600">房地产中介</p>
                  </div>
                  <div className="text-5xl font-bold text-blue-800 opacity-50">
                    01
                  </div>
                </div>
                {/* Service 2 */}
                <div className="p-4 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-blue-200 transition-colors duration-300">
                  <div>
                    <p className="font-semibold font-khmer md:text-2xl text-xl text-gray-800">
                      វាយតម្លៃអចលនទ្រព្យ
                    </p>
                    <p className="md:text-2xl text-xl text-gray-700">
                      Property Valuation
                    </p>
                    <p className="text-xl text-gray-600">物业估价</p>
                  </div>
                  <div className="text-5xl font-bold text-blue-800 opacity-50">
                    02
                  </div>
                </div>
                {/* Service 3 */}
                <div className="p-4 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-blue-200 transition-colors duration-300">
                  <div>
                    <p className="font-semibold font-khmer  md:text-2xl text-xl text-gray-800">
                      អភិវឌ្ឍន៍គម្រោងអចលនទ្រព្យ
                    </p>
                    <p className="md:text-2xl text-xl text-gray-700">
                      Property Development
                    </p>
                    <p className="text-xl text-gray-600">房地产开发</p>
                  </div>
                  <div className="text-5xl font-bold text-blue-800 opacity-50">
                    03
                  </div>
                </div>
                {/* Service 4 */}
                <div className="p-4 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-blue-200 transition-colors duration-300">
                  <div>
                    <p className="font-semibold font-khmer  md:text-2xl text-xl text-gray-800">
                      ប្រឹក្សាអំពីមូលនិធិ វិនិយោគផ្នែកអចលនទ្រព្យ
                    </p>

                    <p className="md:text-2xl text-xl text-gray-700">
                      Real Estate Investment Funds Advisory
                    </p>
                    <p className="text-xl text-gray-600">房地产投资基金</p>
                  </div>
                  <div className="text-5xl font-bold text-blue-800 opacity-50">
                    04
                  </div>
                </div>
                {/* Service 5 */}
                <div className="p-4 rounded-lg flex items-center justify-between bg-gray-50 hover:bg-blue-200 transition-colors duration-300">
                  <div>
                    <p className="font-semibold font-khmer  md:text-2xl text-xl text-gray-800">
                      សម្របសម្រួលបែបបទជូនបរទេសចូលជាសញ្ញាតិខ្មែរ
                    </p>

                    <p className="md:text-2xl text-xl text-gray-700">
                      Acquisition of Cambodian Citizenship
                    </p>
                    <p className="text-xl text-gray-600">获得柬埔寨公民身份</p>
                  </div>
                  <div className="text-5xl font-bold text-blue-800 opacity-50">
                    05
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use a standard <style> tag without the jsx attribute */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;600;700&family=Hanuman:wght@400;700&display=swap');

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out forwards;
        }
        .font-khmer {
          font-family: 'Hanuman', 'Noto Sans Khmer', Battambang, Siemreap, sans-serif;
        }
      `}</style>
    </PageComponents>
  );
}
