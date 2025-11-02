/**
 * FormWrapper Component
 * Provides common form handling: loading state, errors, success messages
 * All text in Italian
 */

"use client";

import { FormSpinner } from "@/components/ui/form-spinner";
import { italianLabels } from "@/lib/types/italian";
import { ReactNode } from "react";

interface FormWrapperProps {
  /**
   * Whether form submission is in progress
   */
  isPending?: boolean;

  /**
   * Error message to display
   */
  error?: string | null;

  /**
   * Success message to display
   */
  successMessage?: string | null;

  /**
   * Field-specific errors
   */
  fieldErrors?: Record<string, string[]>;

  /**
   * Form content (typically form elements)
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Form wrapper component providing common form UI patterns
 * Displays loading spinner, errors, and success messages
 * All text in Italian
 */
export function FormWrapper({
  isPending = false,
  error,
  successMessage,
  fieldErrors,
  children,
  className = "",
}: FormWrapperProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Loading State */}
      {isPending && (
        <div className="bg-blue-50 p-4 rounded-md">
          <FormSpinner
            isPending={true}
            label={italianLabels.submission_in_progress}
          />
        </div>
      )}

      {/* Error Message */}
      {error && !isPending && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Field Errors */}
      {fieldErrors && Object.keys(fieldErrors).length > 0 && !isPending && (
        <div className="space-y-2">
          {Object.entries(fieldErrors).map(([field, errors]) => (
            <div key={field} className="bg-red-50 p-3 rounded-md">
              <p className="font-medium text-red-600 text-xs">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </p>
              <ul className="mt-1 text-red-700 text-sm">
                {errors.map((err, idx) => (
                  <li key={idx}>• {err}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Success Message */}
      {successMessage && !isPending && (
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-green-700 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Form Content */}
      <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
}
