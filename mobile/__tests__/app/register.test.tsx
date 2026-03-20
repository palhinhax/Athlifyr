import React from "react";
import { render } from "@testing-library/react-native";
import RegisterScreen from "@/app/register";

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: mockReplace,
    canGoBack: () => false,
  }),
}));

jest.mock("lucide-react-native", () => ({
  ArrowLeft: () => "ArrowLeft",
  Eye: () => "Eye",
  EyeOff: () => "EyeOff",
  Mail: () => "Mail",
  Lock: () => "Lock",
  User: () => "User",
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("expo-apple-authentication", () => ({
  AppleAuthenticationButton: () => null,
  AppleAuthenticationButtonType: { SIGN_UP: 0 },
  AppleAuthenticationButtonStyle: { BLACK: 0 },
}));

jest.mock("@/src/lib/api", () => ({
  api: { post: jest.fn() },
}));

jest.mock("@/src/lib/auth-store", () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ logout: jest.fn(), isAuthenticated: false }),
}));

jest.mock("@/src/hooks/useGoogleAuth", () => ({
  useGoogleAuth: () => ({
    promptAsync: jest.fn(),
    isReady: true,
    isLoading: false,
  }),
}));

jest.mock("@/src/hooks/useAppleAuth", () => ({
  useAppleAuth: () => ({
    signIn: jest.fn(),
    isLoading: false,
    isAvailable: false,
  }),
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

jest.mock("@/src/components/GoogleIcon", () => ({
  GoogleIcon: () => "GoogleIcon",
}));

jest.mock("axios", () => ({
  isAxiosError: () => false,
}));

describe("RegisterScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders title", () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText("register.title")).toBeTruthy();
  });

  it("renders name, email and password fields", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    expect(getByPlaceholderText("register.namePlaceholder")).toBeTruthy();
    expect(getByPlaceholderText("register.emailPlaceholder")).toBeTruthy();
    expect(getByPlaceholderText("register.passwordPlaceholder")).toBeTruthy();
  });

  it("renders create account button", () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText("register.createAccountButton")).toBeTruthy();
  });

  it("renders Google sign up button", () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText("register.continueWithGoogle")).toBeTruthy();
  });

  it("renders sign in link", () => {
    const { getByText } = render(<RegisterScreen />);
    expect(getByText("register.signIn")).toBeTruthy();
  });
});
