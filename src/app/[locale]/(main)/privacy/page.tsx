import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal");
  return {
    title: t("privacyTitle"),
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("legal");
  const locale = await getLocale();

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6 lg:p-8">
        <h1 className="font-display text-3xl font-extrabold text-ink mb-4">
          {t("privacyTitle")}
        </h1>
        <p className="text-ink-muted text-sm mb-6">{t("lastUpdated")}</p>
        {locale === "en" ? (
          <div className="space-y-4 text-ink text-[15px] leading-relaxed">
            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              What we collect
            </h2>
            <p>
              Account: email and optionally your name. Usage data (words studied,
              game scores, lessons completed, session time) is stored to provide
              the learning experience and show your statistics.
            </p>
            <p>
              Kid mode: we store age, parent email, and a record of parental
              consent.
            </p>
            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Children
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Under-13 accounts require a parent email and consent.</li>
              <li>No ads are shown in kid accounts.</li>
              <li>
                We do not sell kid account data to third parties for marketing.
              </li>
              <li>Parents may request deletion of a child account.</li>
              <li>The AI tutor is disabled in kid mode.</li>
            </ul>
            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              How we use data
            </h2>
            <p>
              Data is processed only to run the service, personalize content,
              and maintain security. We do not sell your data to third parties.
            </p>
            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Your rights
            </h2>
            <p>
              Contact{" "}
              <a
                className="text-primary font-bold underline"
                href="mailto:destek@fluentupenglish.com"
              >
                destek@fluentupenglish.com
              </a>{" "}
              for access, correction, deletion, or other privacy requests.
            </p>
            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Contact
            </h2>
            <p>
              <a
                className="text-primary font-bold underline"
                href="mailto:hello@fluentupenglish.com"
              >
                hello@fluentupenglish.com
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-ink text-[15px] leading-relaxed">
            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Hangi verileri topluyoruz
            </h2>
            <p>
              Hesabınız: e-posta adresi ve tercihen adınız. Uygulamada
              ilerlemeniz (ör. hangi kelimeleri çalıştığınız, oyun skorlarınız,
              ders tamamlamaları, oturum süreleri) öğrenme deneyimini sunmak ve
              istatistiklerinizi göstermek için kaydedilir.
            </p>
            <p>
              Çocuk modu: yaş bilgisi, ebeveyne ait e-posta adresi ve ebeveyn
              onayının kaydı tutulur.
            </p>

            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Çocuklar için özel notlar
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                13 yaş altı hesaplarda ebeveyn e-postası ve açık rıza kaydı
                zorunludur.
              </li>
              <li>Çocuk hesaplarında reklam göstermeyiz.</li>
              <li>
                Çocuk hesaplarında üçüncü taraflara pazarlama amaçlı veri satışı
                yapmayız.
              </li>
              <li>Ebeveyn, çocuk hesabının silinmesini talep edebilir.</li>
              <li>
                Yapay zekâ öğretmen özelliği çocuk modunda kullanıma kapalıdır.
              </li>
            </ul>

            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Verilerinizi nasıl kullanıyoruz
            </h2>
            <p>
              Veriler yalnızca hizmeti çalıştırmak, içeriği kişiselleştirmek ve
              güvenliği sağlamak için işlenir. Yasal zorunluluk olmadıkça üçüncü
              kişilere satmıyoruz.
            </p>

            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              KVKK kapsamındaki haklarınız
            </h2>
            <p>
              Kişisel verilerinize erişim, düzeltme, silme, işlemenin
              sınırlandırılması ve itiraz haklarına sahipsiniz. Taleplerinizi{" "}
              <a
                className="text-primary font-bold underline"
                href="mailto:destek@fluentupenglish.com"
              >
                destek@fluentupenglish.com
              </a>{" "}
              adresine iletebilirsiniz.
            </p>

            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              İletişim
            </h2>
            <p>
              <a
                className="text-primary font-bold underline"
                href="mailto:hello@fluentupenglish.com"
              >
                hello@fluentupenglish.com
              </a>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
