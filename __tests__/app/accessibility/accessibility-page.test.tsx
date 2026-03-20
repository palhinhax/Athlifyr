/**
 * @jest-environment node
 */

import AccessibilityPage, {
  generateMetadata,
} from "@/app/[locale]/accessibility/page";

const mockTranslations: Record<string, string> = {
  metaTitle: "Accessibility",
  metaDescription: "Our accessibility commitment",
  title: "Accessibility Statement",
  lastUpdated: "Last updated: {date}",
  "intro.title": "Our Commitment",
  "intro.content": "We are committed to accessibility.",
  "currentSupport.title": "Current Support",
  "currentSupport.web.title": "Web Platform",
  "currentSupport.web.items.language": "Language attribute",
  "currentSupport.web.items.skipLink": "Skip to content link",
  "currentSupport.web.items.semanticHtml": "Semantic HTML",
  "currentSupport.web.items.headingHierarchy": "Heading hierarchy",
  "currentSupport.web.items.imageAlt": "Image alt text",
  "currentSupport.web.items.screenReader": "Screen reader support",
  "currentSupport.web.items.modals": "Accessible modals",
  "currentSupport.web.items.tabs": "Keyboard tabs",
  "currentSupport.web.items.cookieConsent": "Cookie consent",
  "currentSupport.web.items.notifications": "Notifications",
  "currentSupport.web.items.ariaLabels": "ARIA labels",
  "currentSupport.web.items.darkMode": "Dark mode",
  "currentSupport.mobile.title": "Mobile App",
  "currentSupport.mobile.items.eventCards": "Event cards",
  "currentSupport.mobile.items.searchInput": "Search input",
  "currentSupport.mobile.items.viewToggle": "View toggle",
  "currentSupport.mobile.items.loadingIndicators": "Loading indicators",
  "currentSupport.mobile.items.translations": "Translations",
  "currentSupport.mobile.items.touchTargets": "Touch targets",
  "testing.title": "Testing Methods",
  "testing.content": "We test with multiple methods.",
  "testing.items.automated": "Automated testing",
  "testing.items.keyboard": "Keyboard testing",
  "testing.items.screenReaders": "Screen reader testing",
  "testing.items.codeReview": "Code review",
  "testing.items.wcag": "WCAG checklist",
  "limitations.title": "Known Limitations",
  "limitations.content": "Some known limitations exist.",
  "limitations.items.maps": "Maps",
  "limitations.items.colorContrast": "Color contrast",
  "limitations.items.formErrors": "Form errors",
  "limitations.items.loadingStates": "Loading states",
  "limitations.items.mobileLabels": "Mobile labels",
  "limitations.items.textScaling": "Text scaling",
  "limitations.items.thirdParty": "Third party",
  "contact.title": "Contact Us",
  "contact.content": "Contact us about accessibility.",
  "contact.email": "a11y@athlifyr.com",
  "contact.subject": "Accessibility Issue",
  "contact.emailLabel": "Email: {email}",
  "contact.subjectHint": "Subject: {subject}",
  "contact.responseTime": "We respond within 5 business days.",
  "standards.title": "Standards",
  "standards.content": "We follow WCAG 2.1.",
  "standards.note": "This page was last reviewed on March 2026.",
};

jest.mock("next-intl/server", () => ({
  setRequestLocale: jest.fn(),
  getTranslations: jest.fn(
    (namespaceOrOptions?: string | { locale: string; namespace: string }) => {
      const namespace =
        typeof namespaceOrOptions === "string"
          ? namespaceOrOptions
          : (namespaceOrOptions?.namespace ?? "");

      const t = (key: string, params?: Record<string, string>) => {
        const prefix =
          namespace === "legal"
            ? ""
            : namespace === "legal.accessibility"
              ? ""
              : `${namespace}.`;
        const fullKey = `${prefix}${key}`;
        let value = mockTranslations[fullKey] ?? mockTranslations[key] ?? key;
        if (params) {
          for (const [k, v] of Object.entries(params)) {
            value = value.replace(`{${k}}`, v);
          }
        }
        return value;
      };
      return t;
    }
  ),
}));

jest.mock("@/i18n/routing", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) =>
    `<a href="${href}">${children}</a>`,
}));

jest.mock("lucide-react", () => ({
  ChevronLeft: () => "ChevronLeft",
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/components/page-container", () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => children,
}));

describe("AccessibilityPage", () => {
  describe("generateMetadata", () => {
    it("returns correct title and description", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "en" }),
      });

      expect(metadata.title).toBe("Accessibility");
      expect(metadata.description).toBe("Our accessibility commitment");
    });

    it("includes canonical URL with locale", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "pt" }),
      });

      expect(metadata.alternates?.canonical).toBe(
        "https://www.athlifyr.com/pt/accessibility"
      );
    });
  });

  describe("page component", () => {
    it("renders without errors", async () => {
      const result = await AccessibilityPage({
        params: Promise.resolve({ locale: "en" }),
      });

      expect(result).toBeDefined();
    });

    it("renders for different locales", async () => {
      const result = await AccessibilityPage({
        params: Promise.resolve({ locale: "pt" }),
      });

      expect(result).toBeDefined();
    });
  });
});
