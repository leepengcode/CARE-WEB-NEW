import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PageComponents from "./PageComponents";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const itemsPerPage = 12;
  const restoredFromCache = React.useRef(false);

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
      <div className="w-full max-w-6xl mx-auto py-2 md:py-5 md:px-10">
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
              placeholder="Search articles..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full md:w-1/2 px-4 py-2 border rounded-full shadow-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <ArticleSkeleton key={index} />
            ))
          ) : articles.length === 0 && submittedSearch ? (
            <div className="text-center text-gray-600">No results found.</div>
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
