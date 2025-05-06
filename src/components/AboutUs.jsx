import React, { useEffect, useRef, useState } from 'react'
import { MdApartment, MdBarChart, MdHome, MdPeople } from 'react-icons/md'
import PageComponents from './PageComponents'

const TAB_CONTENT = [
  {
    label: 'About Us',
    content: (
      <>
        <p>Established in 2009, realtyone.app is the leading real estate platform in Cambodia.</p>
        <p className="mt-2">
          From our offices in Phnom Penh, we assist property seekers to find, inquire and secure properties for sale and
          rent in Cambodia.
        </p>
        <p className="mt-2">
          We provide a comprehensive property buying and renting experience; from searching to ultimately securing a
          property. By bringing together all parts of the real estate industry, we simplify property search, empower
          smart property decisions and make property transactions enjoyable.
        </p>
      </>
    ),
  },
  {
    label: 'Service',
    content: (
      <>
        <p>Research Cambodia's property market using our expert guides, videos, survey reports and market data.</p>
        <p className="mt-2">
          Find property for sale and rent across all of Cambodia on the realtyone.app website, app, physical expos and
          online events.
        </p>
        <p className="mt-2">
          Utilise our Concierge services to help you in selecting, negotiating and securing a property.
        </p>
        <p className="mt-2">
          Market your property for sale or rent to thousands of property hunters via the realtyone.app website and App.
        </p>
      </>
    ),
  },
  {
    label: 'History',
    content: (
      <>
        <p>
          Our ecosystem of services include our website and apps, our Concierge Service, physical expos held in
          Cambodia, online expos, thousands of expert guides and videos, the Cambodia Real Estate Awards and much more.
          Thanks to our unique approach, we help thousands of people secure a property each year, with millions of users
          on our websites and apps, 150,000+ attendees at our physical events, and an active database of over 100,000
          property hunters.
        </p>
      </>
    ),
  },
]

const STATS = [
  {
    icon: <MdApartment className="text-white text-xl md:text-3xl" />,
    value: 44401,
    label: 'Total Property',
  },
  {
    icon: <MdHome className="text-white text-xl md:text-3xl" />,
    value: 1412,
    label: 'Total Rent Properties',
  },
  {
    icon: <MdBarChart className="text-white text-xl md:text-3xl" />,
    value: 1382,
    label: 'Total Sell Properties',
  },
  {
    icon: <MdPeople className="text-white text-xl md:text-3xl" />,
    value: 9,
    label: 'Our Team',
  },
]

function useCountUp(isActive, end, duration = 1200) {
  const [count, setCount] = React.useState(0)
  useEffect(() => {
    if (!isActive) return
    let start = 0
    const increment = end / (duration / 16)
    let raf
    function animate() {
      start += increment
      if (start < end) {
        setCount(Math.floor(start))
        raf = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }
    animate()
    return () => raf && cancelAnimationFrame(raf)
  }, [isActive, end, duration])
  return count
}

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState(0)
  const [statsInView, setStatsInView] = useState(false)
  const statsRef = useRef(null)

  // Use useCountUp for each stat individually to avoid calling hooks in a loop
  const count0 = useCountUp(statsInView, STATS[0].value)
  const count1 = useCountUp(statsInView, STATS[1].value)
  const count2 = useCountUp(statsInView, STATS[2].value)
  const count3 = useCountUp(statsInView, STATS[3].value)
  const counts = [count0, count1, count2, count3]

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsInView(true)
      },
      { threshold: 0.4 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-4  md:py-5 md:px-3">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-stretch justify-center w-full max-w-6xl mx-auto ">
          {/* Image Card */}
          <div className="w-full md:w-1/2 flex justify-center items-stretch">
            <div className="bg-white rounded-xl shadow-lg p-2 md:p-4 w-full h-full flex items-stretch">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                alt="About Us"
                className="rounded-lg w-full h-full object-cover"
                style={{ minHeight: '180px' }}
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
                  ${activeTab === idx ? 'bg-red-600 text-white' : 'bg-blue-900 text-white hover:bg-red-700'}
                  ${idx === 0 ? 'rounded-l-lg' : ''} ${idx === TAB_CONTENT.length - 1 ? 'rounded-r-lg' : ''}
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
            <div ref={statsRef} className="grid grid-cols-2 gap-3 md:gap-4 mt-2">
              {STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="flex items-stretch bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-blue-900 flex items-center justify-center px-3 md:px-5">{stat.icon}</div>
                  <div className="flex flex-col justify-center px-2 md:px-4 py-2">
                    <span className="text-red-600 font-bold text-lg md:text-2xl leading-tight">{counts[idx]}</span>
                    <span className="text-blue-900 text-xs md:text-base font-semibold">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageComponents>
  )
}
