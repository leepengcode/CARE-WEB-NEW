import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaFacebook,
  FaInstagram,
  FaRegCalendarAlt,
  FaRegCopy,
  FaRegTimesCircle,
  FaShareAlt,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import PageComponents from "./PageComponents";

const getShareUrl = (id) => `${window.location.origin}/article/${id}`;

export default function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticleDetail();
  }, [id]);

  const fetchArticleDetail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8001/api/get_articles_public`,
        { params: { limit: 1000 } }
      );
      if (response.data && response.data.data) {
        const found = response.data.data.find(
          (a) => String(a.id) === String(id)
        );
        setArticle(found || null);
      } else {
        setArticle(null);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      setArticle(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareUrl(article.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shareOptions = [
    {
      label: "Facebook",
      icon: <FaFacebook className="text-blue-600 w-6 h-6" />,
      url: (id) =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          getShareUrl(id)
        )}`,
    },
    {
      label: "Telegram",
      icon: <FaTelegram className="text-blue-400 w-6 h-6" />,
      url: (id) =>
        `https://t.me/share/url?url=${encodeURIComponent(
          getShareUrl(id)
        )}&text=${encodeURIComponent(article.title)}`,
    },
    {
      label: "Instagram",
      icon: <FaInstagram className="text-pink-500 w-6 h-6" />,
      url: () => `https://www.instagram.com/`,
      disabled: true,
    },
    {
      label: "X",
      icon: <FaTwitter className="text-black w-6 h-6" />,
      url: (id) =>
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          getShareUrl(id)
        )}&text=${encodeURIComponent(article.title)}`,
    },
    {
      label: copied ? "Copied!" : "Copy Link",
      icon: <FaRegCopy className="text-gray-700 w-6 h-6" />,
      action: handleCopy,
    },
  ];

  if (isLoading) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-2 md:py-5 md:px-10">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </PageComponents>
    );
  }

  if (!article) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-2 md:py-5 md:px-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Article Not Found
          </h2>
          <button
            onClick={() => navigate("/article")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Articles
          </button>
        </div>
      </PageComponents>
    );
  }

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-2 md:py-5 md:px-10">
        {/* iPhone-style Back Button */}
        <button
          onClick={() => navigate("/article")}
          className="flex items-center gap-2 px-4 py-2 mb-4 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-100 active:bg-gray-200 transition text-blue-600 font-medium w-fit"
        >
          <FaChevronLeft className="w-4 h-4" />
          <span className="text-base">Back</span>
        </button>
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 md:p-4 flex items-center justify-between">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 font-khmer">
              {article.title}
            </h1>
            <button
              className="ml-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowShare(true)}
              title="Share"
            ></button>
          </div>
          <div className="relative w-full h-full">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 md:p-6">
            <div className="flex items-center justify-between text-gray-600 mb-6">
              <span className="mr-4 flex items-center">
                <FaRegCalendarAlt className="w-5 h-5 mr-1" />
                {new Date(article.created_at).toLocaleDateString()}
              </span>
              <button
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowShare(true)}
                title="Share"
              >
                <FaShareAlt className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
              </button>
            </div>
            <div
              className="prose prose-lg max-w-none font-khmer"
              dangerouslySetInnerHTML={{ __html: article.description }}
            />
          </div>
        </article>

        {showShare && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-40 transition-all">
            <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-lg w-full max-w-md mx-auto p-6 animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg text-gray-800">
                  Share Article
                </span>
                <button
                  onClick={() => setShowShare(false)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <FaRegTimesCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {shareOptions.map((opt) =>
                  opt.action ? (
                    <button
                      key={opt.label}
                      onClick={() => {
                        opt.action();
                      }}
                      className="flex flex-col items-center p-2 hover:bg-gray-100 rounded min-w-[70px]"
                      disabled={opt.disabled}
                    >
                      {opt.icon}
                      <span className="text-xs mt-1">{opt.label}</span>
                    </button>
                  ) : (
                    <a
                      key={opt.label}
                      href={opt.url(article.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded min-w-[70px] ${
                        opt.disabled ? "opacity-50 pointer-events-none" : ""
                      }`}
                      onClick={() => setShowShare(false)}
                    >
                      {opt.icon}
                      <span className="text-xs mt-1">{opt.label}</span>
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUpModal 0.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInUpModal {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .font-khmer {
          font-family: 'Noto Sans Khmer', Hanuman, Battambang, Siemreap, sans-serif;
        }
      `}</style>
    </PageComponents>
  );
}
