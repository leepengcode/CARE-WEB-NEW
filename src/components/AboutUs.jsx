import React, { useEffect, useRef, useState } from "react";
import { MdApartment, MdBarChart, MdHome, MdPeople } from "react-icons/md";
import PageComponents from "./PageComponents";

const ABOUT_IMAGE = "https://externalchecking.com/logo/aboutus.png";

const TAB_CONTENT = [
  {
    label: "About Us",
    content: (
      <>
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Our Story</h3>
        <p>
          Cambodia Angkor Real Estate Co. Ltd (CARE) was the first company of
          its kind to be licensed by the Royal Government of Cambodia. Our
          operator's license was granted on 8th January 2002 and a copy of the
          license is available for inspection on this web-site.
        </p>
        <p className="mt-3">
          The company has spent the last few years developing and improving its
          services and has grown to become one of the largest and most
          professional real estate companies within Cambodia. We are constantly
          striving to improve our customer care and to provide clear and concise
          advice about the domestic property market.
        </p>
        <p className="mt-3">
          We hope that the above information gives potential investors an idea
          of how Cambodia Angkor Real Estate Co. Ltd. conducts its business and
          that, knowing this, you will feel confident that your investment is in
          good hands.
        </p>
      </>
    ),
  },
  {
    label: "Service",
    content: (
      <>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-red-600">
              Real Estate Agency & Consultancy
            </h4>
            <p>
              We provide assistance to clients seeking to purchase, sell, or
              rent of any kind of property in Cambodia through the country's
              most extensive and experienced sales network – one that covers
              every district of the Kingdom.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-red-600">Property Valuation</h4>
            <p>
              In a rapidly developing market like Cambodia, credible and
              strategic valuation services are vital measure taken by lenders to
              protect their own risk as well as to ensure they are not giving a
              loan greater than the value of the property or not lending against
              non-marketable one
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-red-600">Property Development</h4>
            <p>
              We aim to identify the intrinsic value of each property that we
              manage or design, and then execute a management plan that is best
              suited to that property.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-red-600">
              Investment funds & Consultancy
            </h4>
            <p>
              Our consultation services include all regulatory information as
              well as data on macroeconomic trends, industry and sector analysis
              and consumer trends.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-red-600">
              Acquisition of Cambodia Citizenship
            </h4>
            <p>
              Due to the accelerating demand for visa and citizenship for
              foreign investors and other foreign nationals from every corner of
              the world.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    label: "History",
    content: (
      <>
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Vision</h3>
        <div className="space-y-3">
          <p>
            To be the most professional real estate agency in Cambodia and the
            fastest growing and successful agency in all of our branches
            nationwide.
          </p>
        </div>
        <h3 className="text-lg font-semibold text-blue-900 my-3">Mission</h3>
        <div className="space-y-3">
          <p>
            To provide excellent real-estate services in Cambodia by exceeding
            the expectations of our clients and by conducting business with
            honesty and integrity.
          </p>
        </div>
        <h3 className="text-lg font-semibold text-blue-900 my-3">
          Core Values
        </h3>
        <div className="space-y-3">
          <p>
            C-A-R-E places top priority on the integrity, not only of its
            products and services, but also its appreciation of local practices
            and legal requirements. The company conducts transparent business,
            is accountable for its actions and takes responsibility for its
            results. C-A-R-E has established a reputation as a highly reliable
            company by refusing to compromise its integrity in pursuit of
            profit. Integrity is the cornerstone of the company's most valuable
            intangible asset: Trust.
          </p>
        </div>
      </>
    ),
  },
];

const STATS = [
  {
    icon: <MdApartment className="text-white text-xl md:text-3xl" />,
    value: 44401,
    label: "Total Property",
  },
  {
    icon: <MdHome className="text-white text-xl md:text-3xl" />,
    value: 1412,
    label: "Total Rent Properties",
  },
  {
    icon: <MdBarChart className="text-white text-xl md:text-3xl" />,
    value: 1382,
    label: "Total Sell Properties",
  },
  {
    icon: <MdPeople className="text-white text-xl md:text-3xl" />,
    value: 9,
    label: "Our Team",
  },
];

function useCountUp(isActive, end, duration = 1200) {
  const [count, setCount] = React.useState(0);
  useEffect(() => {
    if (!isActive) return;
    let start = 0;
    const increment = end / (duration / 16);
    let raf;
    function animate() {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        raf = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }
    animate();
    return () => raf && cancelAnimationFrame(raf);
  }, [isActive, end, duration]);
  return count;
}

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState(0);
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef(null);

  // Use useCountUp for each stat individually to avoid calling hooks in a loop
  const count0 = useCountUp(statsInView, STATS[0].value);
  const count1 = useCountUp(statsInView, STATS[1].value);
  const count2 = useCountUp(statsInView, STATS[2].value);
  const count3 = useCountUp(statsInView, STATS[3].value);
  const counts = [count0, count1, count2, count3];

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsInView(true);
      },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <PageComponents>
      <div className="w-full  max-w-6xl mx-auto py-4   md:py-5 lg:px-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch justify-center w-full max-w-6xl mx-auto ">
          {/* Image Card */}
          <div className="w-full md:w-1/2 flex justify-center items-stretch">
            <div className="bg-white rounded-xl shadow-lg p-2 md:p-4 w-full h-full flex items-stretch">
              <img
                src={ABOUT_IMAGE}
                alt={TAB_CONTENT[activeTab].label}
                className="rounded-lg w-full h-full object-cover transition-opacity duration-500"
                style={{ minHeight: "180px" }}
              />
            </div>
          </div>
          {/* Text and Stats */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 h-full justify-between">
            {/* Tabs */}
            <div className="flex rounded-t-lg overflow-hidden w-full mb-2">
              {TAB_CONTENT.map((tab, idx) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 py-2 md:py-3 text-sm md:text-base font-semibold border-none focus:outline-none transition-colors duration-200
                  ${
                    activeTab === idx
                      ? "bg-red-600 text-white"
                      : "bg-blue-900 text-white hover:bg-red-700"
                  }
                  ${idx === 0 ? "rounded-l-lg" : ""} ${
                    idx === TAB_CONTENT.length - 1 ? "rounded-r-lg" : ""
                  }
                `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            <div className="bg-white rounded-b-lg p-4 text-gray-700 text-xs md:text-base border border-t-0 border-gray-200 min-h-[120px]">
              {TAB_CONTENT[activeTab].content}
            </div>
            {/* Stats Grid */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-3 md:gap-4 mt-2"
            >
              {STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="flex items-stretch bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-blue-900 flex items-center justify-center px-3 md:px-5">
                    {stat.icon}
                  </div>
                  <div className="flex flex-col justify-center px-2 md:px-4 py-2">
                    <span className="text-red-600 font-bold text-lg md:text-2xl leading-tight">
                      {counts[idx]}
                    </span>
                    <span className="text-blue-900 text-xs md:text-base font-semibold">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageComponents>
  );
}
