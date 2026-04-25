"use client";
import { useState, useEffect, useCallback } from "react";
import { Eye, Check, MessageSquare, RotateCcw, ChevronDown, ChevronRight, X, Send, Clock, AlertTriangle, CheckCircle, Package, Image, Zap, ArrowRight, Search, RefreshCw, Trash2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase Client ────────────────────────────────────────────────
const supabase = createClient(
  "https://eulbuwqbabkhloobuasa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bGJ1d3FiYWJraGxvb2J1YXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MDE0NjMsImV4cCI6MjA5MjQ3NzQ2M30.-6WM8hEcl9OaJ6faL3jl9Fx-q0U1fX1ekSzBN8L_aMA"
);

// ── Status Config ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  awaiting_form: { label: "Awaiting Form", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: Clock },
  queued: { label: "Queued", color: "#8B8FA3", bg: "rgba(139,143,163,0.08)", icon: Package },
  processing: { label: "Processing", color: "#3B82F6", bg: "rgba(59,130,246,0.1)", icon: Zap },
  review: { label: "Ready for Review", color: "#A855F7", bg: "rgba(168,85,247,0.12)", icon: Eye },
  revision: { label: "Needs Revision", color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: AlertTriangle },
  sent_to_customer: { label: "Sent to Customer", color: "#F97316", bg: "rgba(249,115,22,0.1)", icon: Send },
  approved: { label: "Approved", color: "#10B981", bg: "rgba(16,185,129,0.1)", icon: CheckCircle },
  completed: { label: "Completed", color: "#6B7280", bg: "rgba(107,114,128,0.1)", icon: CheckCircle },
};

const CATEGORY_COLORS = {
  Graduation: "#F59E0B",
  Superhero: "#EF4444",
  Wedding: "#EC4899",
  Sports: "#3B82F6",
};

// ── Helpers ────────────────────────────────────────────────────────
function getTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function mapOrder(row) {
  return {
    id: row.order_number || row.id,
    dbId: row.id,
    name: row.customer_name || "Unknown",
    email: row.customer_email || "",
    category: row.category || "",
    artStyle: row.art_style || "",
    status: row.status || "queued",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    orientation: row.orientation || "",
    listing: row.etsy_listing_name || "",
    scenepose: row.scene_pose || "",
    description: row.description || "",
    extras: row.extras || "",
    message: row.puzzle_message || "",
    buildChoice: row.build_choice || "",
    formSubmitted: row.form_submitted || false,
    referencePhoto: row.reference_photo_url || null,
    finalImage: row.ai_generated_url || row.art_applied_url || null,
    traits: row.extracted_traits || null,
    prompt: row.generated_prompt || "",
    summary: row.summary || "",
    revisionNote: row.customer_revision_note || "",
    revisionCount: row.revision_count || 0,
    customerApproved: row.customer_approved || false,
    internalApproved: row.internal_approved || false,
  };
}

// ── Components ─────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.queued;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 6,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.03em",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function CategoryTag({ category }) {
  const color = CATEGORY_COLORS[category] || "#8B8FA3";
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4,
      border: `1px solid ${color}40`, color,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {category}
    </span>
  );
}

function ImageSlot({ src, label, size = 140 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, maxWidth: size }}>
      <div
        onClick={() => { if (src) window.open(src, "_blank"); }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: size, height: size, borderRadius: 10,
          background: src ? "transparent" : "rgba(255,255,255,0.03)",
          border: src ? "1px solid rgba(255,255,255,0.08)" : "1px dashed rgba(255,255,255,0.1)",
          overflow: "hidden", position: "relative",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered && src ? "scale(1.03)" : "scale(1)",
          boxShadow: hovered && src ? "0 8px 30px rgba(0,0,0,0.4)" : "none",
          cursor: src ? "pointer" : "default",
        }}
      >
        {src ? (
          <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 4,
          }}>
            <Image size={20} style={{ opacity: 0.15 }} />
            <span style={{ fontSize: 9, opacity: 0.2, fontFamily: "'JetBrains Mono', monospace" }}>PENDING</span>
          </div>
        )}
        {hovered && src && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "rgba(0,0,0,0.7)", padding: "4px 6px",
            fontSize: 8, color: "rgba(255,255,255,0.6)",
            fontFamily: "'JetBrains Mono', monospace",
            textAlign: "center",
          }}>
            Click to view full size
          </div>
        )}
      </div>
      <span style={{
        fontSize: 9, color: "rgba(255,255,255,0.35)",
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        {label}
      </span>
    </div>
  );
}

function OrderCard({ order, onSelect, isSelected }) {
  const timeAgo = getTimeAgo(order.createdAt);
  return (
    <div
      onClick={() => onSelect(order.id)}
      style={{
        background: isSelected
          ? "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(59,130,246,0.05))"
          : "rgba(255,255,255,0.02)",
        border: isSelected
          ? "1px solid rgba(168,85,247,0.3)"
          : "1px solid rgba(255,255,255,0.05)",
        borderRadius: 14, padding: 18, cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => {
        if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        if (!isSelected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
      }}
      onMouseLeave={e => {
        if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        if (!isSelected) e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            {order.id}
          </span>
          <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.9)", fontFamily: "'Outfit', sans-serif", marginTop: 2 }}>
            {order.name}
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <CategoryTag category={order.category} />
        {order.artStyle && (
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
            {order.artStyle}
          </span>
        )}
      </div>

      {/* Two-image preview: Reference → Final */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <ImageSlot src={order.referencePhoto} label="Reference" size={72} />
        <ArrowRight size={12} style={{ opacity: 0.15, flexShrink: 0 }} />
        <ImageSlot src={order.finalImage} label="Final" size={72} />
      </div>

      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>
          {timeAgo}
        </span>
        {order.revisionCount > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: "rgba(239,68,68,0.6)", fontFamily: "'JetBrains Mono', monospace" }}>
            <RotateCcw size={10} /> {order.revisionCount} revision{order.revisionCount > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

function DetailPanel({ order, onClose, onApprove, onRevise, onRerun, onDelete, onCloseOut }) {
  const [comment, setComment] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [showTraits, setShowTraits] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  if (!order) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.15)", fontFamily: "'Outfit', sans-serif", fontSize: 15 }}>
      Select an order to review
    </div>
  );

  const canAction = order.status === "review" || order.status === "revision";
  const canSendToCustomer = order.status === "review" || order.status === "revision";
  const canCloseOut = order.status === "sent_to_customer" || order.status === "approved";

  const handleApprove = async () => {
    setActionLoading("approve");
    await onApprove(order.dbId);
    setActionLoading(null);
  };

  const handleCloseOut = async () => {
    setActionLoading("closeout");
    await onCloseOut(order.dbId);
    setActionLoading(null);
  };

  const handleRevise = async () => {
    if (!comment.trim()) return;
    setActionLoading("revise");
    await onRevise(order.dbId, comment);
    setComment("");
    setActionLoading(null);
  };

  const handleRerun = async () => {
    setActionLoading("rerun");
    await onRerun(order.dbId);
    setActionLoading(null);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", background: "rgba(255,255,255,0.01)", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.95)", margin: 0, letterSpacing: "-0.02em" }}>
            {order.name}
          </h2>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
            {order.email}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <CategoryTag category={order.category} />
            {order.artStyle && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>{order.artStyle}</span>}
            {order.orientation && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>{order.orientation}</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onDelete(order.dbId)} title="Delete order" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, padding: 8, cursor: "pointer", color: "rgba(239,68,68,0.5)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(239,68,68,0.5)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)"; }}
          >
            <Trash2 size={14} />
          </button>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, padding: 8, cursor: "pointer", color: "rgba(255,255,255,0.4)" }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Awaiting Form State */}
      {!order.formSubmitted && (
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: 20, marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <Clock size={22} style={{ color: "#F59E0B", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: "#F59E0B", fontSize: 14, marginBottom: 4 }}>Tally Form Not Submitted</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>Customer purchased but hasn&apos;t submitted their customization form yet.</div>
          </div>
        </div>
      )}

      {/* Two-Image Pipeline: Reference → Final */}
      {order.formSubmitted && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>IMAGE COMPARISON</div>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <ImageSlot src={order.referencePhoto} label="Customer Reference" size={220} />
            <div style={{ display: "flex", alignItems: "center", paddingTop: 95 }}>
              <ArrowRight size={20} style={{ opacity: 0.2 }} />
            </div>
            <ImageSlot src={order.finalImage} label="Final Output" size={220} />
          </div>
        </div>
      )}

      {/* Summary */}
      {order.summary && (
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setShowSummary(!showSummary)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {showSummary ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            AI SUMMARY
          </button>
          {showSummary && (
            <div style={{ marginTop: 10, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 10, padding: 14, fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", fontFamily: "'Outfit', sans-serif" }}>
              {order.summary}
            </div>
          )}
        </div>
      )}

      {/* Order Details */}
      {order.formSubmitted && (
        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", padding: 18, marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>ORDER DETAILS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
            {[
              ["Scene/Pose", order.scenepose],
              ["Listing", order.listing],
              ["Description", order.description],
              ["Extras", order.extras],
              ["Message", order.message || "\u2014"],
              ["Orientation", order.orientation],
              ["Build Choice", order.buildChoice || "\u2014"],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'Outfit', sans-serif", lineHeight: 1.4 }}>{val || "\u2014"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Traits */}
      {order.traits && (
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setShowTraits(!showTraits)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {showTraits ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            EXTRACTED TRAITS (GPT VISION)
          </button>
          {showTraits && (
            <div style={{ marginTop: 10, background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 10, padding: 14 }}>
              {typeof order.traits === "object" ? Object.entries(order.traits).map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 12, marginBottom: 6, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ color: "rgba(59,130,246,0.6)", minWidth: 70, textTransform: "capitalize" }}>{k}:</span>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{String(v)}</span>
                </div>
              )) : (
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>{String(order.traits)}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Generated Prompt */}
      {order.prompt && (
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => setShowPrompt(!showPrompt)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {showPrompt ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            GENERATED PROMPT
          </button>
          {showPrompt && (
            <div style={{ marginTop: 10, background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.1)", borderRadius: 10, padding: 14, fontSize: 11, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace", wordBreak: "break-word" }}>
              {order.prompt}
            </div>
          )}
        </div>
      )}

      {/* Revision Notes */}
      {order.revisionNote && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>REVISION NOTES</div>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 12, borderLeft: "2px solid rgba(239,68,68,0.4)" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'Outfit', sans-serif", lineHeight: 1.5 }}>{order.revisionNote}</div>
          </div>
        </div>
      )}

      {/* Action Panel - Review/Revision */}
      {canSendToCustomer && (
        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", padding: 18 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add revision notes..."
              style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 14px", color: "rgba(255,255,255,0.8)", fontFamily: "'Outfit', sans-serif", fontSize: 13, outline: "none" }}
              onFocus={e => { e.target.style.borderColor = "rgba(168,85,247,0.3)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
              onKeyDown={e => { if (e.key === "Enter" && comment.trim()) handleRevise(); }}
            />
            <button
              onClick={handleRevise}
              disabled={actionLoading === "revise"}
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 16px", cursor: comment.trim() ? "pointer" : "default", color: "#EF4444", display: "flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.03em", whiteSpace: "nowrap", opacity: comment.trim() ? 1 : 0.4 }}
            >
              <Send size={13} /> {actionLoading === "revise" ? "..." : "REVISE"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleApprove}
              disabled={actionLoading === "approve"}
              style={{ flex: 1, background: "linear-gradient(135deg, #F97316, #EA580C)", border: "none", borderRadius: 10, padding: "12px 20px", color: "white", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.02em", boxShadow: "0 4px 15px rgba(249,115,22,0.25)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Send size={16} /> {actionLoading === "approve" ? "Sending..." : "Send to Customer"}
            </button>
            <button
              onClick={handleRerun}
              disabled={actionLoading === "rerun"}
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "12px 16px", cursor: "pointer", color: "#3B82F6", display: "flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.03em" }}
            >
              <RotateCcw size={14} /> {actionLoading === "rerun" ? "..." : "RE-RUN"}
            </button>
          </div>
        </div>
      )}

      {/* Action Panel - Close Out */}
      {canCloseOut && (
        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", padding: 18 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleCloseOut}
              disabled={actionLoading === "closeout"}
              style={{ flex: 1, background: "linear-gradient(135deg, #10B981, #059669)", border: "none", borderRadius: 10, padding: "12px 20px", color: "white", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.02em", boxShadow: "0 4px 15px rgba(16,185,129,0.25)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <CheckCircle size={16} /> {actionLoading === "closeout" ? "Closing..." : "Close Out Order"}
            </button>
            <button
              onClick={handleRevise}
              disabled={!comment.trim() || actionLoading === "revise"}
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", cursor: comment.trim() ? "pointer" : "default", color: "#EF4444", display: "flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.03em", opacity: comment.trim() ? 1 : 0.4 }}
            >
              <RotateCcw size={14} /> {actionLoading === "revise" ? "..." : "REVISE"}
            </button>
          </div>
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add revision notes if needed..."
            style={{ width: "100%", marginTop: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "10px 14px", color: "rgba(255,255,255,0.8)", fontFamily: "'Outfit', sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box" }}
            onFocus={e => { e.target.style.borderColor = "rgba(168,85,247,0.3)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────
export default function ManifestoDashboard() {
  const [orders, setOrders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Fetch orders from Supabase
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setOrders((data || []).map(mapOrder));
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + real-time subscription
  useEffect(() => {
    fetchOrders().then(() => setTimeout(() => setLoaded(true), 100));

    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchOrders]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const selectedOrder = orders.find(o => o.id === selectedId);

  const filteredOrders = orders.filter(o => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (searchQuery && !o.name.toLowerCase().includes(searchQuery.toLowerCase()) && !o.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // ── Actions (via n8n webhook) ────────────────────────────────
  const WEBHOOK_URL = "/api/webhook";

  const callWebhook = async (payload) => {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
      return true;
    } catch (err) {
      console.error("Webhook failed:", err);
      alert("Action failed: " + err.message);
      return false;
    }
  };

  const handleApprove = async (dbId) => {
    const order = orders.find(o => o.dbId === dbId);
    const success = await callWebhook({
      action: "approve",
      order_id: dbId,
      order_number: order?.id || "",
    });
    if (success) await fetchOrders();
  };

  const handleRevise = async (dbId, note) => {
    const order = orders.find(o => o.dbId === dbId);
    const success = await callWebhook({
      action: "revise",
      order_id: dbId,
      order_number: order?.id || "",
      notes: note,
    });
    if (success) await fetchOrders();
  };

  const handleRerun = async (dbId) => {
    const order = orders.find(o => o.dbId === dbId);
    const success = await callWebhook({
      action: "rerun",
      order_id: dbId,
      order_number: order?.id || "",
      notes: "",
    });
    if (success) await fetchOrders();
  };

  const handleCloseOut = async (dbId) => {
    if (!window.confirm("Close out this order? This marks it as completed.")) return;
    const { error } = await supabase
      .from("orders")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", dbId);
    if (error) { console.error("Close out failed:", error); alert("Failed to close out: " + error.message); }
    else await fetchOrders();
  };

  const handleDelete = async (dbId) => {
    if (!window.confirm("Delete this order? This cannot be undone.")) return;
    const { error } = await supabase.from("orders").delete().eq("id", dbId);
    if (error) { console.error("Delete failed:", error); alert("Failed to delete: " + error.message); }
    else {
      setSelectedId(null);
      await fetchOrders();
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh", background: "#0A0B0F", color: "rgba(255,255,255,0.8)", display: "flex", flexDirection: "column", fontFamily: "'Outfit', sans-serif", overflow: "hidden", opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #A855F7, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 14, color: "white" }}>M</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.9)" }}>Manifesto Pieces</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ORDER COMMAND CENTER
              {lastRefresh && <span style={{ marginLeft: 8, opacity: 0.5 }}>updated {getTimeAgo(lastRefresh.toISOString())}</span>}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={fetchOrders} title="Refresh" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            <RefreshCw size={12} /> REFRESH
          </button>

          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const count = statusCounts[key] || 0;
              if (count === 0) return null;
              return (
                <button key={key} onClick={() => setFilterStatus(filterStatus === key ? "all" : key)} style={{ background: filterStatus === key ? cfg.bg : "rgba(255,255,255,0.02)", border: filterStatus === key ? `1px solid ${cfg.color}40` : "1px solid rgba(255,255,255,0.05)", borderRadius: 8, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: filterStatus === key ? cfg.color : "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, transition: "all 0.2s" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, opacity: filterStatus === key ? 1 : 0.4 }} />
                  {count}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ padding: "8px 28px", background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(239,68,68,0.15)", fontSize: 12, color: "#EF4444", fontFamily: "'JetBrains Mono', monospace", display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={14} /> Connection error: {error}
          <button onClick={fetchOrders} style={{ background: "rgba(239,68,68,0.15)", border: "none", borderRadius: 4, padding: "2px 8px", color: "#EF4444", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, marginLeft: 8 }}>RETRY</button>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Order List */}
        <div style={{ width: 400, flexShrink: 0, overflowY: "auto", padding: "16px 16px", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 12px", marginBottom: 14 }}>
            <Search size={14} style={{ opacity: 0.25 }} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search orders..." style={{ background: "none", border: "none", outline: "none", color: "rgba(255,255,255,0.7)", fontFamily: "'Outfit', sans-serif", fontSize: 13, flex: 1 }} />
          </div>

          {loading && orders.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
              Loading orders...
            </div>
          )}

          {!loading && filteredOrders.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
              {orders.length === 0 ? "No orders yet" : "No orders match filter"}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredOrders.map((order, i) => (
              <div key={order.dbId} style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(12px)", transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s` }}>
                <OrderCard order={order} isSelected={selectedId === order.id} onSelect={setSelectedId} />
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedId(null)}
          onApprove={handleApprove}
          onRevise={handleRevise}
          onRerun={handleRerun}
          onDelete={handleDelete}
          onCloseOut={handleCloseOut}
        />
      </div>
    </div>
  );
}