import { useTranslation } from "react-i18next";
import PageComponents from "../../components/PageComponents";

export default function Partner() {
  const { t } = useTranslation();
  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-4 md:py-1 lg:px-18">
        <div className="text-center text-2xl md:text-3xl font-bold text-blue-900">
          <h1>{t("partner_page.title")}</h1>
        </div>
        <div className="pt-5 flex justify-center">
          <img
            src="https://externalchecking.com/logo/bank_partner.png"
            alt={t("partner_page.alt")}
            className=""
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </PageComponents>
  );
}
