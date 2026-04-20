"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Download } from "lucide-react";
import { useToast } from "@/lib/toast/context";
import { exportAccountData } from "@/lib/account/actions";
import { trackEvent } from "@/lib/analytics/events";

export function DataExportButton() {
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  async function handleExport() {
    setLoading(true);
    try {
      const data = await exportAccountData();
      if (!data) {
        show({
          title: "Export failed",
          description: "Please sign in first.",
          variant: "error",
        });
        return;
      }
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `fluentup-data-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
      trackEvent("data_exported", {});
      show({
        title: "Export ready",
        description: "Your data has been downloaded.",
        variant: "success",
      });
    } catch (err) {
      show({
        title: "Export failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="primary"
      shape="pill"
      icon={Download}
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? "Preparing…" : "Download my data"}
    </Button>
  );
}
