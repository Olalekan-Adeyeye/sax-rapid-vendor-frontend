import { isAxiosError } from "axios";

/**
 * Safely extracts a user-friendly error message from an API or network error.
 * Supports standard Axios errors, PascalCase backend responses (StatusCode/Message/Result),
 * and generic Error objects.
 */
export function getErrorMessage(err: unknown, fallback = "An unexpected error occurred. Please try again."): string {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    
    // Prioritize Result (detailed), then Message/message, then Axios base message
    return (
      data?.Result || 
      data?.Message || 
      data?.message || 
      err.message || 
      fallback
    );
  }

  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === "string") {
    return err;
  }

  return fallback;
}
