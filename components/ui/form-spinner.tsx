/**
 * FormSpinner Component
 * Displays a loading spinner during form submission
 * Can be used in button or standalone
 */

"use client";

import { italianLabels } from "@/lib/types/italian";
import { Spinner } from "./spinner";

interface FormSpinnerProps {
  /**
   * Whether the form is currently submitting
   */
  isPending?: boolean;

  /**
   * Size of the spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg";

  /**
   * Display text alongside spinner
   * @default "Caricamento..."
   */
  label?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Loading spinner component for form submissions
 * Shows spinner with optional text when pending is true
 */
export function FormSpinner({
  isPending = false,
  size = "md",
  label = italianLabels.loading,
  className = "",
}: FormSpinnerProps) {
  if (!isPending) {
    return null;
  }

  const sizeClass = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  }[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Spinner className={sizeClass} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
