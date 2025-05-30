import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaChevronLeft, FaCopy, FaShareAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import PageComponents from "./PageComponents";

const getShareUrl = (id) => `${window.location.origin}/article/${id}`;

export default function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const shareMenuRef = useRef(null);

  useEffect(() => {
    fetchArticleDetail();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchArticleDetail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get_articles_public`,
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl(article.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="flex justify-between items-center mb-4">
          {/* Back Button */}
          <button
            onClick={() => navigate("/article")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-100 active:bg-gray-200 transition text-blue-600 font-medium"
          >
            <FaChevronLeft className="w-4 h-4" />
            <span className="text-base">Back</span>
          </button>

          {/* Share Button */}
          <div className="relative" ref={shareMenuRef}>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-200"
            >
              <FaShareAlt className="w-5 h-5 text-gray-600" />
            </button>

            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg p-4 z-50 animate-fade-in-up">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">
                      Share Article
                    </h3>
                    <button
                      onClick={() => setShowShareMenu(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <IoClose size={20} />
                    </button>
                  </div>

                  {/* Social Media Buttons */}
                  <div className="flex justify-between gap-2">
                    <FacebookShareButton
                      url={getShareUrl(article.id)}
                      quote={article.title}
                    >
                      <FacebookIcon size={40} round />
                    </FacebookShareButton>

                    <TwitterShareButton
                      url={getShareUrl(article.id)}
                      title={article.title}
                    >
                      <TwitterIcon size={40} round />
                    </TwitterShareButton>

                    <TelegramShareButton
                      url={getShareUrl(article.id)}
                      title={article.title}
                    >
                      <TelegramIcon size={40} round />
                    </TelegramShareButton>

                    <WhatsappShareButton
                      url={getShareUrl(article.id)}
                      title={article.title}
                    >
                      <WhatsappIcon size={40} round />
                    </WhatsappShareButton>
                  </div>

                  {/* Copy Link Button */}
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <FaCheck className="text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FaCopy />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 md:p-4">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 font-khmer">
              {article.title}
            </h1>
          </div>
          <div className="relative w-full h-full">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 md:p-6">
            <div
              className="prose prose-lg max-w-none font-khmer"
              dangerouslySetInnerHTML={{ __html: article.description }}
            />
          </div>
        </article>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .font-khmer {
          font-family: 'Noto Sans Khmer', Hanuman, Battambang, Siemreap, sans-serif;
        }
      `}</style>
    </PageComponents>
  );
}
