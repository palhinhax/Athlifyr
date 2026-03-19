import { renderHook, act } from "@testing-library/react-native";
import { useToast } from "@/src/hooks/useToast";

describe("useToast", () => {
  it("starts with toast hidden", () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toast.visible).toBe(false);
    expect(result.current.toast.message).toBe("");
    expect(result.current.toast.type).toBe("success");
  });

  it("shows toast with message and default type", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("Saved!");
    });

    expect(result.current.toast.visible).toBe(true);
    expect(result.current.toast.message).toBe("Saved!");
    expect(result.current.toast.type).toBe("success");
  });

  it("shows toast with custom type", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("Something went wrong", "error");
    });

    expect(result.current.toast.type).toBe("error");
  });

  it("hides toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("Hello");
    });
    expect(result.current.toast.visible).toBe(true);

    act(() => {
      result.current.hideToast();
    });
    expect(result.current.toast.visible).toBe(false);
  });

  it("supports all toast types", () => {
    const { result } = renderHook(() => useToast());

    const types: Array<"success" | "error" | "info" | "warning"> = [
      "success",
      "error",
      "info",
      "warning",
    ];

    types.forEach((type) => {
      act(() => {
        result.current.showToast(`Test ${type}`, type);
      });
      expect(result.current.toast.type).toBe(type);
    });
  });
});
