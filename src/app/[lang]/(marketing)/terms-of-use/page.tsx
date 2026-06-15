"use client";

import { useTranslations } from "next-intl";

export default function TermsOfUsePage() {
  const t = useTranslations("terms_of_use_page");

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-16">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            {t("title")}
          </h1>
          <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>{t("intro.p1")}</p>
            <p>{t("intro.p2")}</p>
            <p>{t("intro.p3")}</p>
          </div>
        </header>

        <div className="space-y-14 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.eligibility.title")}
            </h2>
            <p>{t("sections.eligibility.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.account.title")}
            </h2>
            <p>{t("sections.account.p1")}</p>
            <p className="mt-3">{t("sections.account.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.service.title")}
            </h2>
            <p>{t("sections.service.p1")}</p>
            <p className="mt-3">{t("sections.service.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.responsibilities.title")}
            </h2>
            <p>{t("sections.responsibilities.intro")}</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>{t("sections.responsibilities.items.access")}</li>
              <li>{t("sections.responsibilities.items.reverse")}</li>
              <li>{t("sections.responsibilities.items.unlawful")}</li>
              <li>{t("sections.responsibilities.items.interfere")}</li>
              <li>{t("sections.responsibilities.items.scraping")}</li>
              <li>{t("sections.responsibilities.items.viruses")}</li>
              <li>{t("sections.responsibilities.items.violation")}</li>
            </ul>
            <p className="mt-4">{t("sections.responsibilities.outro")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.billing.title")}
            </h2>
            <p>{t("sections.billing.intro")}</p>
            <div className="mt-4 space-y-3">
              <p>
                {t.rich("sections.billing.items.cycle", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
              <p>
                {t.rich("sections.billing.items.renewal", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
              <p>
                {t.rich("sections.billing.items.price", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
              <p>
                {t.rich("sections.billing.items.refunds", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
              <p>
                {t.rich("sections.billing.items.processors", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.license.title")}
            </h2>
            <p>{t("sections.license.p1")}</p>
            <p className="mt-3">{t("sections.license.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.intellectual.title")}
            </h2>
            <p>{t("sections.intellectual.p1")}</p>
            <p className="mt-3">{t("sections.intellectual.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.data.title")}
            </h2>
            <p>{t("sections.data.p1")}</p>
            <p className="mt-3">{t("sections.data.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.availability.title")}
            </h2>
            <p>{t("sections.availability.p1")}</p>
            <p className="mt-3">{t("sections.availability.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.termination.title")}
            </h2>
            <p>{t("sections.termination.intro")}</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>{t("sections.termination.items.violate")}</li>
              <li>{t("sections.termination.items.law")}</li>
              <li>{t("sections.termination.items.risk")}</li>
              <li>{t("sections.termination.items.inactive")}</li>
            </ul>

            <p className="mt-4">{t("sections.termination.outro")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.liability.title")}
            </h2>
            <p>{t("sections.liability.p1")}</p>
            <p className="mt-3">{t("sections.liability.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.indemnification.title")}
            </h2>
            <p>{t("sections.indemnification.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.governing.title")}
            </h2>
            <p>{t("sections.governing.p1")}</p>
            <p className="mt-3">{t("sections.governing.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.changes.title")}
            </h2>
            <p>{t("sections.changes.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.contact.title")}
            </h2>
            <p>{t("sections.contact.p1")}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
