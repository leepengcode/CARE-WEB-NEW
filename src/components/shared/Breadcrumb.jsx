import { Link, useLocation } from "react-router-dom";
import PageComponents from "../PageComponents";

const PATH_NAMES = {
  "": "Home",
  "mortgage-calculator": "Property Mortgage ",
  "my-property": "My Property",
  agency: "Agency",
  properties: "Properties",
  category: "Category",
  page: "Page",
  about: "About",
  article: "Article",
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  land: "Land",
  business: "Business",
  agriculture: "Agriculture",
  highBuilding: "High Building",
  condo: "Condo",

  // Add more mappings as needed
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Do not render breadcrumb on home page
  if (pathnames.length === 0) return null;

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto   lg:px-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-blue-700 hover:underline">
                Home
              </Link>
            </li>
            {pathnames.map((value, idx) => {
              const to = "/" + pathnames.slice(0, idx + 1).join("/");
              const isLast = idx === pathnames.length - 1;
              return (
                <li key={to} className="flex items-center">
                  <span className="mx-2 text-gray-400">{" > "}</span>
                  {isLast ? (
                    <span className="text-gray-900 font-semibold">
                      {PATH_NAMES[value] || value.replace(/-/g, " ")}
                    </span>
                  ) : (
                    <Link to={to} className="text-blue-700 hover:underline">
                      {PATH_NAMES[value] || value.replace(/-/g, " ")}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </PageComponents>
  );
}
