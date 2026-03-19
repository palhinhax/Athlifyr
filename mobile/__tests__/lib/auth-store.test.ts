import { useAuthStore } from "@/src/lib/auth-store";
import * as SecureStore from "expo-secure-store";
import { api } from "@/src/lib/api";

jest.mock("@/src/lib/api", () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;
const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
      pushToken: null,
    });
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    it("starts with no user and loading true", () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(true);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("setUser", () => {
    it("sets user and marks authenticated", () => {
      const user = { id: "1", name: "Test", email: "t@t.com", role: "user" };
      useAuthStore.getState().setUser(user);
      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it("clears user and marks unauthenticated", () => {
      useAuthStore.getState().setUser(null);
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("setToken", () => {
    it("stores token in SecureStore", async () => {
      await useAuthStore.getState().setToken("my-token");
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        "auth-token",
        "my-token"
      );
      expect(useAuthStore.getState().token).toBe("my-token");
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it("deletes token from SecureStore when null", async () => {
      await useAuthStore.getState().setToken(null);
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
        "auth-token"
      );
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe("setPushToken", () => {
    it("stores push token in SecureStore", async () => {
      await useAuthStore.getState().setPushToken("push-123");
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        "push-token",
        "push-123"
      );
      expect(useAuthStore.getState().pushToken).toBe("push-123");
    });

    it("deletes push token when null", async () => {
      await useAuthStore.getState().setPushToken(null);
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
        "push-token"
      );
    });
  });

  describe("login", () => {
    it("calls API and stores user + token", async () => {
      const mockUser = {
        id: "1",
        name: "Test",
        email: "t@t.com",
        role: "user",
      };
      mockApi.post.mockResolvedValueOnce({
        data: { token: "jwt-123", refreshToken: "ref-456", user: mockUser },
      });

      await useAuthStore.getState().login("t@t.com", "password");

      expect(mockApi.post).toHaveBeenCalledWith("/auth/login", {
        email: "t@t.com",
        password: "password",
      });
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe("jwt-123");
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it("trims and lowercases email", async () => {
      mockApi.post.mockResolvedValueOnce({
        data: { token: "t", user: { id: "1", name: "", email: "", role: "" } },
      });
      await useAuthStore.getState().login("  Test@Email.COM  ", "pass");
      expect(mockApi.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@email.com",
        password: "pass",
      });
    });

    it("sets isLoading false on error", async () => {
      mockApi.post.mockRejectedValueOnce(new Error("Network error"));
      await expect(
        useAuthStore.getState().login("t@t.com", "pass")
      ).rejects.toThrow("Network error");
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe("logout", () => {
    it("clears state and SecureStore", async () => {
      useAuthStore.setState({
        user: { id: "1", name: "Test", email: "t@t.com", role: "user" },
        token: "jwt",
        isAuthenticated: true,
        pushToken: null,
      });

      mockApi.post.mockResolvedValueOnce({});

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
        "auth-token"
      );
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
        "refresh-token"
      );
    });

    it("clears state even if API call fails", async () => {
      mockApi.post.mockRejectedValueOnce(new Error("offline"));

      await useAuthStore.getState().logout();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("deregisters push token if present", async () => {
      useAuthStore.setState({ pushToken: "push-abc" });
      mockApi.delete.mockResolvedValueOnce({});
      mockApi.post.mockResolvedValueOnce({});

      await useAuthStore.getState().logout();

      expect(mockApi.delete).toHaveBeenCalledWith(
        `/push-tokens/${encodeURIComponent("push-abc")}`
      );
    });
  });

  describe("loadStoredAuth", () => {
    it("loads token and verifies with API", async () => {
      const mockUser = {
        id: "1",
        name: "Test",
        email: "t@t.com",
        role: "user",
      };
      mockSecureStore.getItemAsync.mockImplementation(async (key: string) => {
        if (key === "auth-token") return "stored-jwt";
        if (key === "push-token") return "stored-push";
        return null;
      });
      mockApi.get.mockResolvedValueOnce({ data: mockUser });

      await useAuthStore.getState().loadStoredAuth();

      const state = useAuthStore.getState();
      expect(state.token).toBe("stored-jwt");
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.pushToken).toBe("stored-push");
    });

    it("clears state when no stored token", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      await useAuthStore.getState().loadStoredAuth();

      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("clears state when token verification fails", async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce("bad-token");
      mockApi.get.mockRejectedValueOnce(new Error("401"));

      await useAuthStore.getState().loadStoredAuth();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
        "auth-token"
      );
    });
  });

  describe("refreshToken", () => {
    it("exchanges refresh token for new token", async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce("ref-old");
      mockApi.post.mockResolvedValueOnce({
        data: { token: "jwt-new", refreshToken: "ref-new" },
      });

      await useAuthStore.getState().refreshToken();

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        "auth-token",
        "jwt-new"
      );
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        "refresh-token",
        "ref-new"
      );
      expect(useAuthStore.getState().token).toBe("jwt-new");
    });

    it("throws when no refresh token available", async () => {
      mockSecureStore.getItemAsync.mockResolvedValueOnce(null);
      mockApi.post.mockResolvedValueOnce({}); // logout call
      await expect(useAuthStore.getState().refreshToken()).rejects.toThrow(
        "Token refresh failed"
      );
    });
  });
});
