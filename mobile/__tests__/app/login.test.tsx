import React from "react";
import { render } from "@testing-library/react-native";
import LoginScreen from "@/app/login";

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockCanGoBack = jest.fn(() => false);

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    replace: mockReplace,
    canGoBack: mockCanGoBack,
  }),
  useFocusEffect: (fn: () => void) => fn(),
}));

jest.mock("lucide-react-native", () => ({
  ArrowLeft: () => "ArrowLeft",
  Eye: () => "Eye",
  EyeOff: () => "EyeOff",
  Mail: () => "Mail",
  Lock: () => "Lock",
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("expo-apple-authentication", () => ({
  AppleAuthenticationButton: () => null,
  AppleAuthenticationButtonType: { SIGN_IN: 0 },
  AppleAuthenticationButtonStyle: { BLACK: 0 },
}));

jest.mock("@/src/lib/auth-store", () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ login: jest.fn(), isAuthenticated: false }),
}));

jest.mock("@/src/hooks/useGoogleAuth", () => ({
  useGoogleAuth: () => ({
    promptAsync: jest.fn(),
    isReady: true,
    isLoading: false,
    error: null,
  }),
}));

jest.mock("@/src/hooks/useAppleAuth", () => ({
  useAppleAuth: () => ({
    signIn: jest.fn(),
    isLoading: false,
    isAvailable: false,
    error: null,
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

describe("LoginScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders title", () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText("login.title")).toBeTruthy();
  });

  it("renders email and password fields", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText("login.emailPlaceholder")).toBeTruthy();
    expect(getByPlaceholderText("login.passwordPlaceholder")).toBeTruthy();
  });

  it("renders sign in button", () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText("login.signInButton")).toBeTruthy();
  });

  it("renders Google sign in button", () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText("login.continueWithGoogle")).toBeTruthy();
  });

  it("renders sign up link", () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText("login.signUp")).toBeTruthy();
  });

  it("renders forgot password link", () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText("login.forgotPassword")).toBeTruthy();
  });
});
