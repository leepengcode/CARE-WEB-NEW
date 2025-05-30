import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
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
  const [loanAmount, setLoanAmount] = useState(defaultLoanAmount);
  const [interest, setInterest] = useState(defaultInterest);
  const [term, setTerm] = useState(defaultTerm);

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
        backgroundColor: ["#2563eb", "#ef4444"],
        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };
  const doughnutOptions = {
    cutout: "80%",
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

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-0 md:py-5 md:px-10">
        {/* Introduction Section */}
        <div className="text-center mb-8 md:mb-12">
          {/* <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Property Mortgage Repayment Calculator
          </h1> */}
        </div>

        {/* Main Calculator Section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Controls */}
          <div className="flex-1 space-y-6 sm:space-y-8">
            {/* Loan Amount */}
            <div className="bg-white rounded-xl shadow p-4 sm:p-5 flex flex-col gap-2 transition-all duration-200 hover:shadow-lg">
              <label className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">
                Loan Amount
              </label>
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded-l-lg border border-gray-200 text-base sm:text-lg font-bold text-gray-700">
                  $
                </span>
                <input
                  type="number"
                  min={0}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="flex-1 text-base sm:text-lg font-semibold border border-gray-200 rounded-r-lg px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <input
                type="range"
                min={0}
                max={5000000}
                step={1000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-blue-600 mt-2"
              />
            </div>

            {/* Interest Rate */}
            <div className="bg-white rounded-xl shadow p-4 sm:p-5 flex flex-col gap-2 transition-all duration-200 hover:shadow-lg">
              <label className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">
                Interest Rate
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={interest}
                  onChange={(e) => setInterest(Number(e.target.value))}
                  className="flex-1 text-base sm:text-lg font-semibold border border-gray-200 rounded-lg px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <span className="text-base sm:text-lg font-bold text-gray-700">
                  %
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.01}
                value={interest}
                onChange={(e) => setInterest(Number(e.target.value))}
                className="w-full accent-blue-600 mt-2"
              />
            </div>

            {/* Loan Term */}
            <div className="bg-white rounded-xl shadow p-4 sm:p-5 flex flex-col gap-2 transition-all duration-200 hover:shadow-lg">
              <label className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg">
                Loan Term
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                  className="flex-1 text-base sm:text-lg font-semibold border border-gray-200 rounded-lg px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <span className="text-base sm:text-lg font-bold text-gray-700">
                  years
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className="w-full accent-blue-600 mt-2"
              />
            </div>
          </div>

          {/* Chart and Payment */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6">
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex justify-center">
                <div className="relative w-full max-w-[16rem] sm:max-w-xs md:max-w-sm lg:max-w-md aspect-square">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                      $
                      {monthlyPayment.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{" "}
                      <span className="text-sm sm:text-base font-normal">
                        / month
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-xs sm:text-sm md:text-base">
                  <span className="text-red-500 font-semibold">
                    $
                    {principalPayment.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>{" "}
                  <span className="text-gray-700">
                    principal payment per month
                  </span>
                </div>
                <div className="text-xs sm:text-sm md:text-base">
                  <span className="text-blue-600 font-semibold">
                    $
                    {interestPayment.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>{" "}
                  <span className="text-gray-700">
                    interest payment per month
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-8 sm:mt-10 md:mt-12 bg-white rounded-xl shadow p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 border-b-2 border-black pb-2">
            Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-2 text-sm sm:text-base md:text-lg">
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="font-medium text-gray-700">
                Principal Payment
              </span>
              <span className="font-bold text-gray-900">
                $
                {principalPayment.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="font-medium text-gray-700">
                Interest Payment
              </span>
              <span className="font-bold text-gray-900">
                $
                {interestPayment.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="font-medium text-gray-700">Monthly Payment</span>
              <span className="font-bold text-gray-900">
                $
                {monthlyPayment.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="font-medium text-gray-700">Total Payments</span>
              <span className="font-bold text-gray-900">
                $
                {totalPayments.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="font-medium text-gray-700">
                Total Interest Payments
              </span>
              <span className="font-bold text-gray-900">
                $
                {totalInterest.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Mortgage Tips Section */}
        <div className="mt-8 sm:mt-10 md:mt-12 bg-white rounded-xl shadow p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 border-b-2 border-black pb-2">
            Mortgage Planning Tips
          </h2>
          <ul className="list-disc list-inside space-y-3 text-sm sm:text-base md:text-lg text-gray-700">
            <li>
              <span className="font-semibold">Compare Interest Rates:</span>{" "}
              Shop around to find the best mortgage rates, as even a small
              difference can save you thousands over the loan term.
            </li>
            <li>
              <span className="font-semibold">Consider Shorter Terms:</span> A
              shorter loan term (e.g., 15 years) often comes with lower interest
              rates and less total interest, though monthly payments will be
              higher.
            </li>
            <li>
              <span className="font-semibold">
                Budget for Additional Costs:
              </span>{" "}
              Factor in property taxes, insurance, and maintenance costs when
              planning your mortgage budget.
            </li>
            <li>
              <span className="font-semibold">Make Extra Payments:</span> Paying
              more than the minimum each month can reduce your principal faster
              and save on interest over time.
            </li>
            <li>
              <span className="font-semibold">Check Your Credit Score:</span> A
              higher credit score can help you qualify for better mortgage
              rates, so review your score before applying.
            </li>
          </ul>
        </div>
      </div>
    </PageComponents>
  );
}
