import { useTranslation } from "react-i18next";
import { HeaderRoute } from "../components/HeaderRoute";

export function DiscordPage() {
  const { t } = useTranslation();

  return (
    <HeaderRoute>
      <section class="h-full">
        <div class="flex h-full flex-col items-center justify-center">
          <div class="flex flex-col items-center p-6">
            <p class="font-roboto text-4xl font-bold">{t("discord.title")}</p>
            <span class="font-roboto text-3xl">{t("discord.sub")}</span>
          </div>
          <a href="https://discord.gg/unblocker" class="p-6">
            <button class="font-roboto h-14 w-56 rounded-2xl border border-input-border-color bg-input p-2 text-center text-xl placeholder:text-input-text focus:outline-none">
              {t("discord.button1")}
            </button>
          </a>
          <a href="${window.location.href = '/go/' + encodeURIComponent(https://discord.gg/unblocker)}" class="p-6">
            <button class="font-roboto h-14 w-56 rounded-2xl border border-input-border-color bg-input p-2 text-center text-xl placeholder:text-input-text focus:outline-none">
              {t("discord.button2")}
            </button>
          </a>
        </div>
      </section>
    </HeaderRoute>
  );
}
