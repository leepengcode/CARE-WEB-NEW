import {
  FaDownload,
  FaEye,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
} from "react-icons/fa";
import PageComponents from "./PageComponents";

export default function Achievement() {
  // Sample achievement data - replace with actual data from your backend
  const achievements = [
    {
      id: 1,
      title: "Real Estate License",
      type: "pdf",
      fileUrl: "/path/to/license.pdf",
      thumbnail: "https://externalchecking.com/logo/care.png",
      date: "2023-12-15",
      description: "Professional real estate license certification",
    },
    {
      id: 2,
      title: "Sales Achievement 2023",
      type: "word",
      fileUrl: "/path/to/sales.docx",
      thumbnail: "https://externalchecking.com/logo/care.png",
      date: "2023-12-01",
      description: "Annual sales performance report",
    },
    {
      id: 3,
      title: "Property Portfolio",
      type: "image",
      fileUrl: "/path/to/portfolio.jpg",
      thumbnail: "https://externalchecking.com/logo/care.png",
      date: "2023-11-20",
      description: "Collection of managed properties",
    },
    // Add more achievements as needed
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FaFilePdf className="w-8 h-8 text-red-500" />;
      case "word":
        return <FaFileWord className="w-8 h-8 text-blue-500" />;
      case "image":
        return <FaFileImage className="w-8 h-8 text-green-500" />;
      default:
        return <FaFilePdf className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-8 px-2 md:px-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            My Achievements
          </h1>
          <p className="text-gray-600">
            View and manage your professional achievements and certifications
          </p>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Thumbnail/Preview */}
              <div className="relative h-48 bg-gray-100">
                {achievement.thumbnail ? (
                  <img
                    src={achievement.thumbnail}
                    alt={achievement.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(achievement.type)}
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="View"
                  >
                    <FaEye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="Download"
                  >
                    <FaDownload className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {achievement.title}
                  </h3>
                  {getFileIcon(achievement.type)}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {achievement.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(achievement.date).toLocaleDateString()}</span>
                  <span className="capitalize">{achievement.type}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Achievement Box */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2 border-dashed border-gray-300">
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Add New Achievement
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload your certificates, documents, or images
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Upload File
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageComponents>
  );
}
