import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Card } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal");
  return {
    title: t("termsTitle"),
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage() {
  const t = await getTranslations("legal");
  const locale = await getLocale();

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6 lg:p-8">
        <h1 className="font-display text-3xl font-extrabold text-ink mb-4">
          {t("termsTitle")}
        </h1>
        <p className="text-ink-muted text-sm mb-6">{t("lastUpdated")}</p>
        {locale === "en" ? (
          <div className="space-y-4 text-ink text-[15px] leading-relaxed">
            <p>
              By using FluentUp you agree to these terms. The service is governed
              by applicable laws in your jurisdiction.
            </p>
            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Scope
            </h2>
            <p>
              FluentUp provides digital English-learning content, games, and
              tools. Features may change as we improve the product.
            </p>
            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Account security
            </h2>
            <p>
              You are responsible for keeping your login credentials secure.
              Contact us if you notice suspicious activity.
            </p>
            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Free use
            </h2>
            <p>
              Core features may be offered free of charge. If paid plans are
              introduced, you will see clear pricing before you pay.
            </p>
            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Limitation
            </h2>
            <p>
              The service is provided &ldquo;as is&rdquo;. Learning outcomes
              depend on your effort; we do not guarantee exam or certificate
              results.
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
            <p>
              FluentUp platformunu kullanarak bu şartları kabul etmiş olursunuz.
              Hizmet Türkiye Cumhuriyeti kanunlarına tabidir; uyuşmazlıklarda
              Türkiye mahkemeleri yetkilidir.
            </p>

            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Hizmetin kapsamı
            </h2>
            <p>
              FluentUp, İngilizce öğrenmeye yardımcı dijital içerik, oyunlar ve
              araçlar sunar. Özellikler sürekli geliştirilebilir veya
              değiştirilebilir.
            </p>

            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Hesap ve güvenlik
            </h2>
            <p>
              Hesap bilgilerinizi gizli tutmak sizin sorumluluğunuzdadır. Şüpheli
              kullanım fark ederseniz derhal bize bildirin.
            </p>

            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Ücretsiz kullanım
            </h2>
            <p>
              Platform temel özellikleri ücretsiz sunulabilir. İleride ücretli
              planlar eklenirse, ödeme öncesinde net şekilde bilgilendirilirsiniz.
            </p>

            <h2 className="font-display text-xl font-extrabold text-ink mt-6">
              Sorumluluğun sınırı
            </h2>
            <p>
              Hizmet &ldquo;olduğu gibi&rdquo; sunulur. Öğrenme sonuçları kişisel
              çalışmaya bağlıdır; belirli bir sınav veya sertifika sonucu garanti
              edilmez.
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
