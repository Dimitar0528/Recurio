"use client"
import { useTranslations } from "next-intl";

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacy_policy_page");
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
              {t("sections.data_controller.title")}
            </h2>
            <p>{t("sections.data_controller.p1")}</p>
            <p className="mt-3">{t("sections.data_controller.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.categories.title")}
            </h2>
            <p>{t("sections.categories.intro")}</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="font-medium text-foreground">
                  {t("sections.categories.items.account.title")}
                </p>
                <p>{t("sections.categories.items.account.desc")}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {t("sections.categories.items.subscription.title")}
                </p>
                <p>{t("sections.categories.items.subscription.desc")}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {t("sections.categories.items.technical.title")}
                </p>
                <p>{t("sections.categories.items.technical.desc")}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {t("sections.categories.items.usage.title")}
                </p>
                <p>{t("sections.categories.items.usage.desc")}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {t("sections.categories.items.communication.title")}
                </p>
                <p>{t("sections.categories.items.communication.desc")}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.purposes.title")}
            </h2>
            <p>{t("sections.purposes.intro")}</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>{t("sections.purposes.items.maintain")}</li>
              <li>{t("sections.purposes.items.store")}</li>
              <li>{t("sections.purposes.items.authenticate")}</li>
              <li>{t("sections.purposes.items.improve")}</li>
              <li>{t("sections.purposes.items.secure")}</li>
              <li>{t("sections.purposes.items.communicate")}</li>
              <li>{t("sections.purposes.items.comply")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.legal_basis.title")}
            </h2>
            <p>{t("sections.legal_basis.intro")}</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>
                {t.rich("sections.legal_basis.items.contractual", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("sections.legal_basis.items.legitimate", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("sections.legal_basis.items.consent", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("sections.legal_basis.items.legal", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.sharing.title")}
            </h2>
            <p>{t("sections.sharing.intro")}</p>
            <div className="mt-4 space-y-3">
              <p>
                {t.rich("sections.sharing.items.auth", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
              <p>
                {t.rich("sections.sharing.items.infra", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
              <p>
                {t.rich("sections.sharing.items.analytics", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
              <p>
                {t.rich("sections.sharing.items.email", {
                  bold: (chunks) => <strong>{chunks}</strong>,
                })}
              </p>
            </div>
            <p className="mt-4">{t("sections.sharing.outro")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.retention.title")}
            </h2>
            <p>{t("sections.retention.p1")}</p>
            <p className="mt-3">{t("sections.retention.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.rights.title")}
            </h2>
            <p>{t("sections.rights.intro")}</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>{t("sections.rights.items.access")}</li>
              <li>{t("sections.rights.items.rectification")}</li>
              <li>{t("sections.rights.items.erasure")}</li>
              <li>{t("sections.rights.items.portability")}</li>
              <li>{t("sections.rights.items.restrict")}</li>
              <li>{t("sections.rights.items.object")}</li>
              <li>{t("sections.rights.items.withdraw")}</li>
            </ul>
            <p className="mt-3">{t("sections.rights.outro")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.security.title")}
            </h2>
            <p>{t("sections.security.p1")}</p>
            <p className="mt-3">{t("sections.security.p2")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.international.title")}
            </h2>
            <p>{t("sections.international.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.cookies.title")}
            </h2>
            <p>{t("sections.cookies.p1")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("sections.children.title")}
            </h2>
            <p>{t("sections.children.p1")}</p>
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
