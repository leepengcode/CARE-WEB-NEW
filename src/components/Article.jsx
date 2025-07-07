import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegCalendarAlt, FaRegNewspaper } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PageComponents from "./PageComponents";

export default function ArticleList() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 12;
  const restoredFromCache = React.useRef(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const cards = document.querySelectorAll(".article-card");
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, [articles]);

  useEffect(() => {
    const cache = sessionStorage.getItem("articleCache");
    if (cache) {
      const { articles, totalItems, currentPage, searchTerm, submittedSearch } =
        JSON.parse(cache);
      setArticles(articles);
      setTotalItems(totalItems);
      setCurrentPage(currentPage);
      setSearchTerm(searchTerm);
      setSubmittedSearch(submittedSearch);
      restoredFromCache.current = true;
      sessionStorage.removeItem("articleCache");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const scroll = sessionStorage.getItem("articleScroll");
      if (scroll) {
        window.scrollTo(0, parseInt(scroll, 10));
        sessionStorage.removeItem("articleScroll");
      }
    }
  }, [isLoading, articles]);

  useEffect(() => {
    if (restoredFromCache.current) {
      restoredFromCache.current = false;
      return; // Skip fetch if just restored from cache
    }
    fetchArticles();
    // eslint-disable-next-line
  }, [currentPage, submittedSearch]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const res = await axios.get(
        `https://externalchecking.com/api/api_rone_new/public/api/get_articles_public`,
        {
          params: {
            offset,
            limit: itemsPerPage,
            search: submittedSearch,
          },
        }
      );
      setArticles(res.data.data || []);
      setTotalItems(res.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch articles", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleArticleClick = (articleId) => {
    sessionStorage.setItem("articleScroll", window.scrollY);
    sessionStorage.setItem(
      "articleCache",
      JSON.stringify({
        articles,
        totalItems,
        currentPage,
        searchTerm,
        submittedSearch,
      })
    );
    navigate(`/article/${articleId}`);
  };

  const ArticleSkeleton = () => (
    <div className="bg-white p-2 rounded shadow animate-pulse transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
      <div className="w-full h-48 bg-gray-200 rounded mb-3"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-0 md:py-5 md:px-10">
        {/* Hero Section */}

        <div
          className={`relative pt-10 pb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl mb-8 animate-pulse-slow">
              <FaRegNewspaper className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent p-3 mb-6 leading-tight">
              {t("article.title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("article.subtitle")}
            </p>
          </div>
        </div>

        <div className="mb-6 mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmittedSearch(searchTerm);
              setCurrentPage(1);
            }}
            className="flex flex-row gap-2 md:gap-4 items-center"
          >
            <input
              type="text"
              placeholder={t("article.search_placeholder")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full md:w-1/2 px-4 py-2 border rounded-full shadow-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              {t("article.search_button")}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <ArticleSkeleton key={index} />
            ))
          ) : articles.length === 0 && submittedSearch ? (
            <div className="text-center text-gray-600">
              {t("article.no_results")}
            </div>
          ) : (
            articles.map((article, index) => (
              <div
                key={article.id}
                className="article-card bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer opacity-0 flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="overflow-hidden rounded-t-2xl">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-44 object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex-1 flex flex-col p-4">
                  <h2 className="font-khmer font-bold text-lg md:text-xl text-gray-900 mb-2 ">
                    {article.title}
                  </h2>
                  <div className="font-khmer flex items-center text-xs text-gray-400 mb-2">
                    <FaRegCalendarAlt className="w-4 h-4 mr-1" />
                    {new Date(article.created_at).toLocaleDateString()}
                  </div>
                  <div className="font-khmer text-gray-600 text-sm flex-1 mb-2 line-clamp-3 relative">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: article.description?.slice(0, 150) + "...",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!isLoading && totalPages > 0 && (
          <div className="flex justify-center mt-6 space-x-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Use a standard <style> tag without the jsx attribute */}
      <style>{`
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
          font-family: 'Noto Sans Khmer', Hanuman, Battambang, Siemreap, sans-serif;
        }
      `}</style>
    </PageComponents>
  );
}
