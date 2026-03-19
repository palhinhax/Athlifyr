import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SettingsScreen from "@/app/settings";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("lucide-react-native", () => {
  const stub = () => "Icon";
  return {
    ArrowLeft: stub,
    User: stub,
    Settings: stub,
    Bell: stub,
    Database: stub,
    Mail: stub,
    Shield: stub,
    Trophy: stub,
    Languages: stub,
    Palette: stub,
    Download: stub,
    Trash2: stub,
    LogOut: stub,
    ChevronRight: stub,
    CheckCircle2: stub,
    AlertCircle: stub,
  };
});

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/src/lib/auth-store", () => ({
  useAuthStore: () => ({
    user: { name: "Test User", email: "test@mail.com", role: "USER" },
    logout: jest.fn(),
  }),
}));

jest.mock("@/src/lib/api", () => ({
  api: { patch: jest.fn(), delete: jest.fn() },
  API_URL: "http://localhost",
}));

jest.mock("@/src/components/ui/ConfirmModal", () => ({
  ConfirmModal: () => null,
}));

jest.mock("@/src/hooks/useToast", () => ({
  useToast: () => ({
    toast: { visible: false, message: "", type: "info" },
    showToast: jest.fn(),
    hideToast: jest.fn(),
  }),
}));

jest.mock("@/src/components/ui/Toast", () => ({
  Toast: () => null,
}));

jest.mock("@/src/lib/i18n", () => ({
  language: "en",
  changeLanguage: jest.fn(),
}));

jest.mock("expo-file-system", () => ({
  File: jest.fn(),
  Paths: { document: "/tmp" },
}));

jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(false)),
  shareAsync: jest.fn(),
}));

describe("SettingsScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders settings title", () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText("settings.title")).toBeTruthy();
  });

  it("renders all four tab buttons", () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText("settings.tabProfile")).toBeTruthy();
    expect(getByText("settings.tabPreferences")).toBeTruthy();
    expect(getByText("settings.tabNotifications")).toBeTruthy();
    expect(getByText("settings.tabAccount")).toBeTruthy();
  });

  it("renders profile tab by default with account info", () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText("settings.accountInfo")).toBeTruthy();
    expect(getByText("Test User")).toBeTruthy();
    expect(getByText("test@mail.com")).toBeTruthy();
  });

  it("switches to preferences tab", () => {
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText("settings.tabPreferences"));
    expect(getByText("settings.language")).toBeTruthy();
    expect(getByText("English")).toBeTruthy();
  });

  it("switches to notifications tab", () => {
    const { getByText } = render(<SettingsScreen />);
    fireEvent.press(getByText("settings.tabNotifications"));
    expect(getByText("settings.pushNotifications")).toBeTruthy();
    expect(getByText("settings.emailNotifications")).toBeTruthy();
  });

  it("switches to account tab", () => {
    const { getByText, getAllByText } = render(<SettingsScreen />);
    fireEvent.press(getByText("settings.tabAccount"));
    expect(getByText("settings.downloadData")).toBeTruthy();
    expect(
      getAllByText("settings.deleteAccount").length
    ).toBeGreaterThanOrEqual(1);
  });
});
