"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  Clock,
  Zap,
  RotateCcw,
  Send,
  CheckCircle,
  FolderOpen,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase Client ────────────────────────────────────────────────
const supabase = createClient(
  "https://eulbuwqbabkhloobuasa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bGJ1d3FiYWJraGxvb2J1YXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MDE0NjMsImV4cCI6MjA5MjQ3NzQ2M30.-6WM8hEcl9OaJ6faL3jl9Fx-q0U1fX1ekSzBN8L_aMA"
);

// ── Status Config for Run Log ──────────────────────────────────────
const RUN_STATUS_CONFIG = {
  creation: {
    label: "Creation",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
    icon: Zap,
  },
  rerun: {
    label: "Re-run",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    icon: RotateCcw,
  },
  revise: {
    label: "Revise",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.1)",
    icon: FileText,
  },
  sent_to_customer: {
    label: "Sent to Customer",
    color: "#F97316",
    bg: "rgba(249,115,22,0.1)",
    icon: Send,
  },
  completed: {
    label: "Completed",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    icon: CheckCircle,
  },
  reopened: {
    label: "Reopened",
    color: "#A855F7",
    bg: "rgba(168,85,247,0.12)",
    icon: FolderOpen,
  },
};

// ── Helpers ────────────────────────────────────────────────────────
function getTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDateTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " · " + d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ── Components ─────────────────────────────────────────────────────
function RunStatusBadge({ status }) {
  const cfg = RUN_STATUS_CONFIG[status] || {
    label: status,
    color: "#8B8FA3",
    bg: "rgba(139,143,163,0.08)",
    icon: Clock,
  };
  const Icon = cfg.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: 6,
        background: cfg.bg,
        color: cfg.color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.03em",
        fontFamily: "'JetBrains Mono', monospace",
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function VersionBadge({ version }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 8px",
        borderRadius: 5,
        background: "rgba(168,85,247,0.08)",
        border: "1px solid rgba(168,85,247,0.15)",
        color: "#A855F7",
        fontSize: 10,
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.06em",
      }}
    >
      v{version}
    </span>
  );
}

function TimelineRow({ entry, isLast }) {
  const cfg = RUN_STATUS_CONFIG[entry.status] || {
    color: "#8B8FA3",
    icon: Clock,
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        position: "relative",
        paddingBottom: isLast ? 0 : 0,
      }}
    >
      {/* Timeline dot + line */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 20,
          flexShrink: 0,
          paddingTop: 2,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: cfg.color,
            boxShadow: `0 0 8px ${cfg.color}40`,
            flexShrink: 0,
            zIndex: 1,
          }}
        />
        {!isLast && (
          <div
            style={{
              width: 1,
              flex: 1,
              background: `linear-gradient(to bottom, ${cfg.color}30, rgba(255,255,255,0.04))`,
              minHeight: 40,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.035)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <RunStatusBadge status={entry.status} />
            <VersionBadge version={entry.version} />
          </div>
          <span
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {entry.run_id}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {entry.order_number}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
            title={formatDateTime(entry.created_at)}
          >
            {formatDateTime(entry.created_at)}
          </span>
        </div>

        {entry.revision_text && (
          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              background: "rgba(239,68,68,0.04)",
              borderLeft: "2px solid rgba(239,68,68,0.3)",
              borderRadius: "0 8px 8px 0",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "rgba(239,68,68,0.5)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              REVISION NOTE
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
                fontFamily: "'Outfit', sans-serif",
                lineHeight: 1.5,
              }}
            >
              {entry.revision_text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Flat table row (alternate view) ───────────────────────────────
function TableRow({ entry }) {
  const cfg = RUN_STATUS_CONFIG[entry.status] || {
    color: "#8B8FA3",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "100px 120px 60px 160px 1fr 180px",
        alignItems: "center",
        gap: 12,
        padding: "12px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        transition: "background 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.025)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {/* Run ID */}
      <span
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.3)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {entry.run_id}
      </span>

      {/* Order Number */}
      <span
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600,
        }}
      >
        {entry.order_number}
      </span>

      {/* Version */}
      <VersionBadge version={entry.version} />

      {/* Status */}
      <RunStatusBadge status={entry.status} />

      {/* Revision Text */}
      <span
        style={{
          fontSize: 12,
          color: entry.revision_text
            ? "rgba(255,255,255,0.5)"
            : "rgba(255,255,255,0.1)",
          fontFamily: "'Outfit', sans-serif",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={entry.revision_text || ""}
      >
        {entry.revision_text || "—"}
      </span>

      {/* Datetime */}
      <span
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.3)",
          fontFamily: "'JetBrains Mono', monospace",
          textAlign: "right",
        }}
      >
        {formatDateTime(entry.created_at)}
      </span>
    </div>
  );
}

// ── Main Run Log Page ──────────────────────────────────────────────
export default function RunLogPage() {
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [viewMode, setViewMode] = useState("timeline"); // "timeline" | "table"

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("run_log")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setEntries(data || []);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      console.error("Failed to fetch run log:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + realtime
  useEffect(() => {
    fetchEntries().then(() => setTimeout(() => setLoaded(true), 100));

    const channel = supabase
      .channel("run-log-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "run_log" },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEntries]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchEntries, 30000);
    return () => clearInterval(interval);
  }, [fetchEntries]);

  // Filter by order number
  const filteredEntries = entries.filter((e) => {
    if (!searchQuery) return true;
    return e.order_number.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Group entries by order number for timeline view
  const groupedByOrder = filteredEntries.reduce((acc, entry) => {
    const key = entry.order_number;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  // Sort groups by most recent entry
  const sortedGroups = Object.entries(groupedByOrder).sort((a, b) => {
    const aLatest = new Date(a[1][0].created_at).getTime();
    const bLatest = new Date(b[1][0].created_at).getTime();
    return bLatest - aLatest;
  });

  // Stats
  const totalRuns = entries.length;
  const uniqueOrders = new Set(entries.map((e) => e.order_number)).size;
  const statusCounts = entries.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#0A0B0F",
        color: "rgba(255,255,255,0.8)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Outfit', sans-serif",
        overflow: "hidden",
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        style={{
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.01)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #A855F7, #3B82F6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: 14,
              color: "white",
            }}
          >
            M
          </div>
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <a
                href="/"
                style={{
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 13,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                }}
              >
                <ArrowLeft size={14} />
                Dashboard
              </a>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
              Run Log
            </div>
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.25)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              FULL ORDER TIMELINE
              {lastRefresh && (
                <span style={{ marginLeft: 8, opacity: 0.5 }}>
                  updated {getTimeAgo(lastRefresh.toISOString())}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* View Mode Toggle */}
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {[
              { key: "timeline", label: "TIMELINE" },
              { key: "table", label: "TABLE" },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                style={{
                  background:
                    viewMode === mode.key
                      ? "rgba(168,85,247,0.12)"
                      : "transparent",
                  border: "none",
                  padding: "6px 12px",
                  cursor: "pointer",
                  color:
                    viewMode === mode.key
                      ? "#A855F7"
                      : "rgba(255,255,255,0.3)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  transition: "all 0.2s",
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchEntries}
            title="Refresh"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            <RefreshCw size={12} /> REFRESH
          </button>
        </div>
      </div>

      {/* ── Stats Bar ──────────────────────────────────────────── */}
      <div
        style={{
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          borderBottom: "1px solid rgba(255,255,255,0.03)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.25)" }}>RUNS</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
            {totalRuns}
          </span>
        </div>
        <div
          style={{
            width: 1,
            height: 14,
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.25)" }}>ORDERS</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
            {uniqueOrders}
          </span>
        </div>
        <div
          style={{
            width: 1,
            height: 14,
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(RUN_STATUS_CONFIG).map(([key, cfg]) => {
            const count = statusCounts[key] || 0;
            if (count === 0) return null;
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: cfg.color,
                  opacity: 0.7,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: cfg.color,
                  }}
                />
                {count} {cfg.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Error Banner ───────────────────────────────────────── */}
      {error && (
        <div
          style={{
            padding: "8px 28px",
            background: "rgba(239,68,68,0.08)",
            borderBottom: "1px solid rgba(239,68,68,0.15)",
            fontSize: 12,
            color: "#EF4444",
            fontFamily: "'JetBrains Mono', monospace",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AlertTriangle size={14} /> Connection error: {error}
          <button
            onClick={fetchEntries}
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "none",
              borderRadius: 4,
              padding: "2px 8px",
              color: "#EF4444",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              marginLeft: 8,
            }}
          >
            RETRY
          </button>
        </div>
      )}

      {/* ── Main Content ───────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Search bar */}
        <div style={{ padding: "16px 28px 0", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: "10px 14px",
              maxWidth: 360,
            }}
          >
            <Search size={14} style={{ opacity: 0.25 }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by order number..."
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                flex: 1,
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.3)",
                  padding: 2,
                  display: "flex",
                }}
              >
                <ChevronLeft size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Content area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 28px 40px",
          }}
        >
          {loading && entries.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                color: "rgba(255,255,255,0.2)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
              }}
            >
              Loading run log...
            </div>
          )}

          {!loading && filteredEntries.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                color: "rgba(255,255,255,0.15)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
              }}
            >
              {entries.length === 0
                ? "No runs logged yet"
                : "No runs match that order number"}
            </div>
          )}

          {/* ── Timeline View ────────────────────────────────── */}
          {viewMode === "timeline" &&
            sortedGroups.map(([orderNumber, groupEntries]) => (
              <div key={orderNumber} style={{ marginBottom: 32 }}>
                {/* Order group header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                    paddingBottom: 10,
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {orderNumber}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.2)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {groupEntries.length} event
                    {groupEntries.length !== 1 ? "s" : ""}
                  </span>
                  {/* Current version */}
                  <VersionBadge
                    version={Math.max(...groupEntries.map((e) => e.version))}
                  />
                </div>

                {/* Timeline entries */}
                <div style={{ paddingLeft: 8 }}>
                  {groupEntries.map((entry, idx) => (
                    <TimelineRow
                      key={entry.id}
                      entry={entry}
                      isLast={idx === groupEntries.length - 1}
                    />
                  ))}
                </div>
              </div>
            ))}

          {/* ── Table View ────────────────────────────────────── */}
          {viewMode === "table" && filteredEntries.length > 0 && (
            <div
              style={{
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden",
              }}
            >
              {/* Table header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 120px 60px 160px 1fr 180px",
                  gap: 12,
                  padding: "10px 20px",
                  background: "rgba(255,255,255,0.02)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {[
                  "RUN ID",
                  "ORDER",
                  "VER",
                  "STATUS",
                  "REVISION TEXT",
                  "DATETIME",
                ].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.2)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textAlign: h === "DATETIME" ? "right" : "left",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Table rows */}
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}