import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { FaChartPie, FaInfoCircle, FaPercent } from "react-icons/fa";
import { MdAttachMoney, MdInfo, MdOutlineCalendarToday } from "react-icons/md";
import PageComponents from "./PageComponents";

ChartJS.register(ArcElement, Tooltip, Legend);

const defaultLoanAmount = 2000000;
const defaultInterest = 4.5;
const defaultTerm = 30;

function calculateMonthlyPayment(P, r, n) {
  if (r === 0) return P / (n * 12);
  const monthlyRate = r / 12 / 100;
  const numPayments = n * 12;
  return (P * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
}

export default function MortgageCalculator() {
  const { t } = useTranslation();
  const [loanAmount, setLoanAmount] = useState(defaultLoanAmount);
  const [interest, setInterest] = useState(defaultInterest);
  const [term, setTerm] = useState(defaultTerm);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const monthlyPayment = calculateMonthlyPayment(loanAmount, interest, term);
  const totalPayments = monthlyPayment * term * 12;
  const totalInterest = totalPayments - loanAmount;
  const principalPayment = loanAmount / (term * 12);
  const interestPayment = monthlyPayment - principalPayment;

  // Chart.js Doughnut config
  const doughnutData = {
    labels: ["Principal", "Interest"],
    datasets: [
      {
        data: [principalPayment, interestPayment],
        backgroundColor: ["#3b82f6", "#ef4444"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };
  const doughnutOptions = {
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PageComponents>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
          {/* Hero Section */}

          <div
            className={`relative pt-10 pb-16 transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl mb-8 animate-pulse-slow">
                <FaChartPie className="text-white text-3xl" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent p-3 mb-6 leading-tight">
                {t("mortgage_calculator.title")}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("mortgage_calculator.subtitle")}
              </p>
            </div>
          </div>

          {/* Main Calculator Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 mb-8 lg:mb-12">
            {/* Input Controls */}
            <div className="xl:col-span-2 space-y-6 lg:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Loan Amount */}
                <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                  <label className="flex items-center gap-3 text-lg lg:text-xl font-bold text-gray-800 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <MdAttachMoney className="text-white text-xl" />
                    </div>
                    {t("mortgage_calculator.loan_amount")}
                  </label>

                  <div className="relative mb-6">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-blue-600">
                      $
                    </div>
                    <input
                      type="number"
                      min={0}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full pl-12 pr-4 py-4 text-xl lg:text-2xl font-bold bg-blue-50 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="range"
                      min={0}
                      max={5000000}
                      step={1000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-3 bg-blue-200 rounded-full appearance-none cursor-pointer slider-blue"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>$0</span>
                      <span>$5M</span>
                    </div>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100">
                  <label className="flex items-center gap-3 text-lg lg:text-xl font-bold text-gray-800 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FaPercent className="text-white text-lg" />
                    </div>
                    {t("mortgage_calculator.interest_rate")}
                  </label>

                  <div className="relative mb-6">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.01}
                      value={interest}
                      onChange={(e) => setInterest(Number(e.target.value))}
                      className="w-full pr-12 pl-4 py-4 text-xl lg:text-2xl font-bold bg-red-50 border-2 border-red-200 rounded-2xl focus:border-red-500 focus:outline-none transition-all duration-300"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-red-600">
                      %
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={0.01}
                      value={interest}
                      onChange={(e) => setInterest(Number(e.target.value))}
                      className="w-full h-3 bg-red-200 rounded-full appearance-none cursor-pointer slider-red"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>0%</span>
                      <span>10%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Term */}
              <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <label className="flex items-center gap-3 text-lg lg:text-xl font-bold text-gray-800 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                    <MdOutlineCalendarToday className="text-white text-xl" />
                  </div>
                  {t("mortgage_calculator.loan_term")}
                </label>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={term}
                      onChange={(e) => setTerm(Number(e.target.value))}
                      className="w-full pr-20 pl-4 py-4 text-xl lg:text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-gray-500 focus:outline-none transition-all duration-300"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg font-bold text-gray-600">
                      {t("mortgage_calculator.years")}
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="range"
                      min={1}
                      max={40}
                      value={term}
                      onChange={(e) => setTerm(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider-gray"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>1 year</span>
                      <span>40 years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="xl:col-span-1">
              <div className="sticky top-8 bg-white/90 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-8 text-center">
                  Monthly Payment
                </h3>

                <div className="relative mb-8">
                  <div className="w-full max-w-xs mx-auto aspect-square">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                        $
                        {monthlyPayment.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      <div className="text-sm lg:text-base text-gray-600 font-medium">
                        {t("mortgage_calculator.per_month")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold text-gray-700">
                        Principal
                      </span>
                    </div>
                    <span className="font-bold text-blue-600">
                      $
                      {principalPayment.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="font-semibold text-gray-700">
                        Interest
                      </span>
                    </div>
                    <span className="font-bold text-red-600">
                      $
                      {interestPayment.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 lg:p-8 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <MdAttachMoney className="text-3xl lg:text-4xl text-blue-100" />
                <span className="text-sm lg:text-base font-medium opacity-90">
                  Monthly Payment
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold">
                $
                {monthlyPayment.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-6 lg:p-8 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <MdInfo className="text-3xl lg:text-4xl text-red-100" />
                <span className="text-sm lg:text-base font-medium opacity-90">
                  Total Payments
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold">
                $
                {totalPayments.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl p-6 lg:p-8 text-white shadow-lg sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <FaPercent className="text-3xl lg:text-4xl text-gray-100" />
                <span className="text-sm lg:text-base font-medium opacity-90">
                  Total Interest
                </span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold">
                $
                {totalInterest.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaInfoCircle className="text-white text-xl" />
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                {t("mortgage_calculator.tips_title")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Compare Rates
                    </h4>
                    <p className="text-gray-600 text-sm lg:text-base">
                      {t("mortgage_calculator.tip_compare_rates")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Shorter Terms
                    </h4>
                    <p className="text-gray-600 text-sm lg:text-base">
                      {t("mortgage_calculator.tip_shorter_terms")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Budget for Costs
                    </h4>
                    <p className="text-gray-600 text-sm lg:text-base">
                      {t("mortgage_calculator.tip_budget_costs")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl border border-gray-100">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Extra Payments
                    </h4>
                    <p className="text-gray-600 text-sm lg:text-base">
                      {t("mortgage_calculator.tip_extra_payments")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }

        .slider-blue::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
        }

        .slider-red::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
          transition: all 0.3s ease;
        }

        .slider-red::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(239, 68, 68, 0.4);
        }

        .slider-gray::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #6b7280, #4b5563);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(107, 114, 128, 0.3);
          transition: all 0.3s ease;
        }

        .slider-gray::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(107, 114, 128, 0.4);
        }

        .slider-blue::-moz-range-thumb,
        .slider-red::-moz-range-thumb,
        .slider-gray::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
        }

        .slider-blue::-moz-range-thumb {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .slider-red::-moz-range-thumb {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
        }

        .slider-gray::-moz-range-thumb {
          background: linear-gradient(135deg, #6b7280, #4b5563);
          box-shadow: 0 4px 8px rgba(107, 114, 128, 0.3);
        }
      `}</style>
    </PageComponents>
  );
}
