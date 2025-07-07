import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import PageComponents from "../PageComponents";

export default function Breadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Do not render breadcrumb on home page
  if (pathnames.length === 0) return null;

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto   lg:px-10 pt-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-blue-700 hover:underline">
                {t("breadcrumb.home")}
              </Link>
            </li>
            {pathnames.map((value, idx) => {
              const to = "/" + pathnames.slice(0, idx + 1).join("/");
              const isLast = idx === pathnames.length - 1;
              // Try translation, fallback to prettified value
              const label =
                t(`breadcrumb.${value}`) !== `breadcrumb.${value}`
                  ? t(`breadcrumb.${value}`)
                  : value.replace(/-/g, " ");
              return (
                <li key={to} className="flex items-center">
                  <span className="mx-2 text-gray-400">{" > "}</span>
                  {isLast ? (
                    <span className="text-gray-900 font-semibold">{label}</span>
                  ) : (
                    <Link to={to} className="text-blue-700 hover:underline">
                      {label}
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
