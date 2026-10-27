import { getTranslations } from "next-intl/server";
import { PageLoaderFull } from "@/components/ui/PageLoader";

export default async function LocaleLoading() {
  const t = await getTranslations("common");
  return <PageLoaderFull label={t("loading")} />;
}
