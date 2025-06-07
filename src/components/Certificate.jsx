import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import PageComponents from "./PageComponents";

export default function Certificate() {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [visibleCards, setVisibleCards] = useState({});
  const cardsRef = useRef([]);

  // Sample Certificate  data - replace with actual data from your backend
  const Certificate = [
    {
      id: 1,
      title: "ការចុះបញ្ជីក្រុមហ៊ុន",
      thumbnail: "https://externalchecking.com/logo/ការចុះបញ្ជីក្រុមហ៊ុន.png",
    },
    {
      id: 2,
      title: "វិញ្ញាបណ្ណប័ត្រសមាជិក",
      thumbnail: "https://externalchecking.com/logo/វិញ្ញាបណ្ណប័ត្រសមាជិក.jpg",
    },
    {
      id: 3,
      title: "វិញ្ញាបណ្ណប័ត្រវិជ្ជាជីវះវាយតម្លៃ (អ៊ុង វណ្ណដួង)",
      thumbnail: "https://externalchecking.com/logo/1.jpg",
    },
    {
      id: 4,
      title: "វិញ្ញាបណ្ណប័ត្រវិជ្ជាជីវះវាយតម្លៃ (វង្ស ធីនន់)",
      thumbnail: "https://externalchecking.com/logo/2.jpg",
    },
    {
      id: 5,
      title: "វិញ្ញាបណ្ណប័ត្រវិជ្ជាជីវះវាយតម្លៃ (ខៀវ ដានី)",
      thumbnail: "https://externalchecking.com/logo/3.jpg",
    },
    {
      id: 6,
      title: "វិញ្ញាបណ្ណប័ត្រវិជ្ជាជីវះវាយតម្លៃ (ហឿន ស្រីផេក)",
      thumbnail: "https://externalchecking.com/logo/4.jpg",
    },
    {
      id: 7,
      title: "វិញ្ញាបណ្ណប័ត្រវិជ្ជាជីវះវាយតម្លៃ (សន សុវណ្ណតារា)",
      thumbnail: "https://externalchecking.com/logo/5.jpg",
    },
    {
      id: 8,
      title: "វិញ្ញាបណ្ណប័ត្រវិជ្ជាជីវះវាយតម្លៃ (សន សុវណ្ណតារា)",
      thumbnail: "https://externalchecking.com/logo/6.jpg",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => ({
              ...prev,
              [entry.target.dataset.id]: true,
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  const khmerStyle = {
    fontFamily:
      "'Khmer OS', 'Khmer OS System', 'Khmer OS Battambang', 'Khmer OS Bokor', 'Khmer OS Content', 'Khmer OS Freehand', 'Khmer OS Metal Chrieng', 'Khmer OS Muol', 'Khmer OS Muol Light', 'Khmer OS Muol Pali', 'Khmer OS Siemreap', 'Khmer OS System', sans-serif",
    lineHeight: "1.5",
  };

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-8 px-2 md:px-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Our Certificate
          </h1>
        </div>

        {/* Certificate  Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Certificate.map((Certificate, index) => (
            <div
              key={Certificate.id}
              ref={(el) => (cardsRef.current[index] = el)}
              data-id={Certificate.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-700 cursor-pointer transform ${
                visibleCards[Certificate.id]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              onClick={() => setSelectedCertificate(Certificate)}
            >
              <div className="relative">
                <div className="bg-gray-50 border border-gray-200">
                  <img
                    src={Certificate.thumbnail}
                    alt={Certificate.title}
                    className="w-full h-auto object-contain"
                  />
                </div>
                {/* Title at bottom */}
                <div className="bg-white bg-opacity-90 p-3 border-t border-gray-200">
                  <h3
                    className="text-lg font-semibold text-gray-800 truncate"
                    style={khmerStyle}
                  >
                    {Certificate.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Popup Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="relative max-h-[90vh] w-auto">
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute -top-12 right-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-600" />
              </button>
              <div className="bg-white rounded-lg overflow-hidden">
                <img
                  src={selectedCertificate.thumbnail}
                  alt={selectedCertificate.title}
                  className="max-h-[85vh] w-auto object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedCertificate.title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageComponents>
  );
}
