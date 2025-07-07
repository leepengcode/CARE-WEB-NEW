import React from "react";
import PageComponents from "../PageComponents";

const Hero = () => {
  return (
    <PageComponents>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-8 lg:p-12 mb-8 lg:mb-12">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-300/20 rounded-full blur-2xl transform -translate-x-16 translate-y-8"></div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
                <FaChartPie className="text-3xl lg:text-4xl text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"></h1>
              <p className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto font-medium"></p>
            </div>
          </div>
        </div>
      </div>
    </PageComponents>
  );
};

export default Hero;
