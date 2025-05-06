import React, { useEffect, useRef, useState } from 'react'
import { FaBuilding, FaRegHeart, FaRuler } from 'react-icons/fa'
import {
  MdAgriculture,
  MdApartment,
  MdArticle,
  MdAttachMoney,
  MdBusiness,
  MdFactory,
  MdGroups,
  MdHome,
  MdLocationOn,
  MdPerson,
  MdStore,
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import PageComponents from './PageComponents'

const categories = [
  { name: 'Residential', icon: <MdHome size={22} />, to: '/category/residential' },
  { name: 'Commercial', icon: <MdBusiness size={22} />, to: '/category/commercial' },
  { name: 'Industrial', icon: <MdFactory size={22} />, to: '/category/industrial' },
  { name: 'Agriculture', icon: <MdAgriculture size={22} />, to: '/category/agriculture' },
  { name: 'Land', icon: <MdLocationOn size={22} />, to: '/category/land' },
  { name: 'Building', icon: <FaBuilding size={22} />, to: '/category/building' },
  { name: 'Condo', icon: <MdApartment size={22} />, to: '/category/condo' },
  { name: 'Business', icon: <MdStore size={22} />, to: '/category/business' },
  { name: 'Measurement', icon: <FaRuler size={22} />, to: '/category/measurement' },
  { name: 'Consultant', icon: <MdPerson size={22} />, to: '/category/consultant' },
  { name: 'Mortgage', icon: <MdAttachMoney size={22} />, to: '/category/mortgage' },
  { name: 'Favorite', icon: <FaRegHeart size={22} />, to: '/category/favorite' },
  { name: 'Blog', icon: <MdArticle size={22} />, to: '/category/blog' },
  { name: 'Agency', icon: <MdGroups size={22} />, to: '/category/agency' },
  { name: 'Achievement', icon: <MdGroups size={22} />, to: '/category/achievement' },
  { name: 'More', icon: <MdGroups size={22} />, to: '/category/more' },
]

const PAGE_SIZE = 8
const totalPages = Math.ceil(categories.length / PAGE_SIZE)

export default function Categories() {
  const [page, setPage] = useState(0)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  // Update page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return
      const scrollLeft = scrollRef.current.scrollLeft
      const width = scrollRef.current.offsetWidth
      const newPage = Math.round(scrollLeft / width)
      setPage(newPage)
    }
    const ref = scrollRef.current
    if (ref) ref.addEventListener('scroll', handleScroll)
    return () => ref && ref.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to page when indicator is clicked
  const goToPage = (p) => {
    if (!scrollRef.current) return
    const width = scrollRef.current.offsetWidth
    scrollRef.current.scrollTo({ left: p * width, behavior: 'smooth' })
  }

  return (
    <PageComponents>
      <div className="w-full  max-w-7xl mx-auto py-4  md:py-5 md:px-3">
        {/* Small screens: horizontal scrollable carousel */}
        <div className="block md:hidden relative">
          <div
            ref={scrollRef}
            className="flex overflow-hidden scrollbar-none snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {Array.from({ length: totalPages }).map((_, pageIdx) => (
              <div
                key={pageIdx}
                className="min-w-full flex flex-wrap items-center justify-center snap-start"
                style={{ rowGap: '0.1rem', columnGap: '1.3rem' }}
              >
                {categories.slice(pageIdx * PAGE_SIZE, (pageIdx + 1) * PAGE_SIZE).map((cat) => (
                  <button
                    key={cat.name}
                    className="w-1/5 flex flex-col items-center focus:outline-none"
                    style={{ marginBottom: '2rem' }}
                    onClick={() => navigate(cat.to)}
                  >
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl w-10 h-10  md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center mb-2 shadow-md">
                      <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white">{cat.icon}</span>
                    </div>
                    <span className="text-blue-700 font-semibold text-xs text-center mt-1">{cat.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
          {/* Dot Indicators */}
          <div className="flex justify-center mt-2 gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx)}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200 focus:outline-none ${
                  page === idx ? 'bg-blue-500 border-blue-500' : 'bg-white border-blue-500'
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        {/* md+ screens: full grid */}
        <div className="hidden md:grid md:grid-cols-8 gap-x-4 justify-items-center min-h-[250px]">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col items-center cursor-pointer focus:outline-none"
              onClick={() => navigate(cat.to)}
              tabIndex={0}
              role="button"
              onKeyPress={(e) => {
                if (e.key === 'Enter') navigate(cat.to)
              }}
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-2 shadow-md">
                <span className="text-2xl md:text-3xl text-white">{cat.icon}</span>
              </div>
              <span className="text-blue-700 font-semibold text-base md:text-sm text-center mt-1">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </PageComponents>
  )
}
