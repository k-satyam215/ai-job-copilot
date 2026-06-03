"use client";

import { useEffect, useState } from "react";
import { useSSE } from "../lib/useSSE";
import { useToast } from "./ToastProvider";

export default function NotificationListener() {
  const { toast } = useToast();

  useSSE((event) => {
    if (event.type === "new_job") {
      toast(`🎯 ${event.score}% match: ${event.title} at ${event.company}`, "success");
    } else if (event.type === "apply_update") {
      toast(`📋 Application update: ${event.message || event.status}`, "info");
    } else if (event.type === "credits_low") {
      toast(`⚡ Low AI credits! ${event.remaining} remaining. Upgrade your plan.`, "warning");
    }
  });

  return null;
}
