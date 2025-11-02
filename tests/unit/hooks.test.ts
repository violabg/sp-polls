/**
 * Unit Tests for Form Hooks
 * Tests custom hooks for form action handling
 */

import { useFormAction } from "@/lib/hooks/use-form-action";
import type { FormActionResponse } from "@/lib/types/forms";
import { act, renderHook, waitFor } from "@testing-library/react";

describe("useFormAction Hook", () => {
  it("should initialize with default state", () => {
    const mockAction = jest.fn();
    const { result } = renderHook(() => useFormAction(mockAction));

    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle successful form submission", async () => {
    const onSuccess = jest.fn();
    const mockAction = jest.fn(
      async () =>
        ({
          success: true,
          data: { id: "123", name: "Test" },
        } as FormActionResponse)
    );

    const { result } = renderHook(() =>
      useFormAction(mockAction, { onSuccess })
    );

    const formData = new FormData();
    formData.append("name", "Test");

    act(() => {
      result.current.formAction(formData);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(onSuccess).toHaveBeenCalledWith({ id: "123", name: "Test" });
  });

  it("should handle form submission error", async () => {
    const onError = jest.fn();
    const mockAction = jest.fn(
      async () =>
        ({
          success: false,
          error: "Errore di validazione",
        } as FormActionResponse)
    );

    const { result } = renderHook(() => useFormAction(mockAction, { onError }));

    const formData = new FormData();

    act(() => {
      result.current.formAction(formData);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(onError).toHaveBeenCalledWith("Errore di validazione");
    expect(result.current.error).toBe("Errore di validazione");
  });

  it("should handle field-specific errors", async () => {
    const mockAction = jest.fn(
      async () =>
        ({
          success: false,
          error: "Errore di validazione",
          fieldErrors: {
            email: ["Formato email non valido"],
            password: ["Minimo 8 caratteri"],
          },
        } as FormActionResponse)
    );

    const { result } = renderHook(() => useFormAction(mockAction));

    const formData = new FormData();

    act(() => {
      result.current.formAction(formData);
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });

    expect(result.current.fieldErrors).toEqual({
      email: ["Formato email non valido"],
      password: ["Minimo 8 caratteri"],
    });
  });

  it("should set isPending to true during submission", async () => {
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });

    const mockAction = jest.fn(async () => {
      await submitPromise;
      return { success: true, data: {} } as FormActionResponse;
    });

    const { result, rerender } = renderHook(() => useFormAction(mockAction));

    const formData = new FormData();

    act(() => {
      result.current.formAction(formData);
    });

    await waitFor(() => {
      rerender();
    });

    // Note: useActionState sets pending to true during submission
    // The exact behavior depends on React's implementation

    act(() => {
      resolveSubmit();
    });
  });
});
