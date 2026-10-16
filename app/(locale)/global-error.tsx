"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely to an external service or analytics
    // We intentionally DO NOT render error.message or error.stack here
    // to prevent leaking sensitive information (like Supabase keys or DB queries)
    console.error("Securely logged client-side error:", error.digest || "Unknown Error");
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-sans p-6">
          <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-black mb-3 text-gray-900 tracking-tight">Something went wrong</h1>
            
            <p className="text-gray-500 mb-8 leading-relaxed text-sm">
              An unexpected error occurred while processing your request. We've securely logged this issue and our team will investigate.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>
              
              <Link 
                href="/"
                className="w-full bg-gray-100 text-gray-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors block"
              >
                Go back home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
