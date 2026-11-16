"use client";
import { useEffect } from "react";
/** Mounted only after the server's requireAdmin() check succeeds. */
export default function InternalAnalyticsExclusion() {
  useEffect(() => {
    localStorage.setItem('cvyon_analytics_exclude', 'true');
  }, []);
  return null;
}
