import { useState, useEffect, useRef } from "react";
import { Eye, Check, MessageSquare, RotateCcw, ChevronDown, ChevronRight, X, Send, Clock, AlertTriangle, CheckCircle, Package, Image, Zap, ArrowRight, Filter, Search } from "lucide-react";

// ── Mock Data ──────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: "MP-4821",
    name: "Jessica Torres",
    category: "Graduation",
    artStyle: "Watercolor Dream",
    status: "review",
    createdAt: "2026-04-21T09:14:00Z",
    orientation: "Landscape",
    listing: "Graduation Puzzle",
    scenepose: "Cap toss celebration",
    description: "Outdoor ceremony, cherry blossoms, golden hour lighting",
    extras: "Add confetti falling from the sky",
    message: "Class of 2026!",
    formSubmitted: true,
    referencePhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop&crop=face",
    aiGenerated: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=300&h=300&fit=crop",
    artApplied: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop",
    traits: { skin: "Medium olive", hair: "Dark brown, wavy, shoulder-length", glasses: false, facial: "Round face, prominent cheekbones" },
    prompt: "Hyper-realistic graduation portrait, young woman with medium olive skin, dark brown wavy shoulder-length hair, round face with prominent cheekbones, wearing navy cap and gown, tossing cap in celebration, outdoor ceremony with cherry blossom trees, golden hour backlighting, confetti particles, text overlay 'Class of 2026', watercolor dream artistic filter --ar 3:2 --v 6.1",
    comments: [],
  },
  {
    id: "MP-4822",
    name: "Marcus Johnson",
    category: "Superhero",
    artStyle: "Cinematic Realism",
    status: "processing",
    createdAt: "2026-04-21T10:32:00Z",
    orientation: "Portrait",
    listing: "Superhero Puzzle",
    scenepose: "Rooftop hero stance",
    description: "Flying hero with energy powers, neon city skyline at night",
    extras: "Lightning crackling from hands",
    message: "",
    formSubmitted: true,
    referencePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    aiGenerated: null,
    artApplied: null,
    traits: { skin: "Dark brown", hair: "Short fade, black", glasses: false, facial: "Strong jawline, short beard" },
    prompt: "Generating...",
    comments: [],
  },
  {
    id: "MP-4823",
    name: "Aiko Yamamoto",
    category: "Wedding",
    artStyle: "Soft Renaissance",
    status: "approved",
    createdAt: "2026-04-20T16:45:00Z",
    orientation: "Portrait",
    listing: "Wedding Puzzle",
    scenepose: "First dance",
    description: "Elegant ballroom, chandelier lighting, romantic atmosphere",
    extras: "Rose petals on the floor",
    message: "Forever & Always",
    formSubmitted: true,
    referencePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    aiGenerated: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop",
    artApplied: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=300&fit=crop",
    traits: { skin: "Light", hair: "Black, straight, long", glasses: false, facial: "Oval face, soft features" },
    prompt: "Hyper-realistic wedding portrait, young woman with light skin, long straight black hair, oval face with soft features, elegant white gown, first dance pose in grand ballroom, crystal chandeliers, warm amber lighting, rose petals scattered on marble floor, text 'Forever & Always', soft renaissance painting style --ar 2:3 --v 6.1",
    comments: [{ text: "Perfect likeness. Approved!", time: "2026-04-20T18:30:00Z", author: "Clifton" }],
  },
  {
    id: "MP-4824",
    name: "DeShawn Williams",
    category: "Sports",
    artStyle: "Action Freeze",
    status: "revision",
    createdAt: "2026-04-20T14:20:00Z",
    orientation: "Landscape",
    listing: "Sports Puzzle",
    scenepose: "Mid-dunk slam",
    description: "Basketball court, sold out arena, spotlight on player",
    extras: "Flames trailing the ball",
    message: "",
    formSubmitted: true,
    referencePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    aiGenerated: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=300&fit=crop",
    artApplied: "https://images.unsplash.com/photo-1547153760-18fc86c3a880?w=300&h=300&fit=crop",
    traits: { skin: "Dark brown", hair: "Locs, medium length", glasses: false, facial: "Angular face, high cheekbones" },
    prompt: "Hyper-realistic basketball action shot, athletic man with dark brown skin, medium-length locs, angular face with high cheekbones, mid-dunk pose, sold-out arena with dramatic spotlight, flames trailing basketball, action freeze style --ar 3:2 --v 6.1",
    comments: [{ text: "Face doesn't match reference — needs another likeness pass. Also darken the arena background more.", time: "2026-04-20T17:10:00Z", author: "Clifton" }],
  },
  {
    id: "MP-4825",
    name: "Sarah Mitchell",
    category: "Graduation",
    artStyle: "",
    status: "awaiting_form",
    createdAt: "2026-04-21T11:05:00Z",
    orientation: "",
    listing: "Graduation Puzzle",
    scenepose: "",
    description: "",
    extras: "",
    message: "",
    formSubmitted: false,
    referencePhoto: null,
    aiGenerated: null,
    artApplied: null,
    traits: null,
    prompt: "",
    comments: [],
  },
  {
    id: "MP-4826",
    name: "Kevin Park",
    category: "Superhero",
    artStyle: "Comic Ink",
    status: "queued",
    createdAt: "2026-04-21T08:50:00Z",
    orientation: "Portrait",
    listing: "Superhero Puzzle",
    scenepose: "Shield block stance",
    description: "Armored hero blocking energy blast in ruined cityscape",
    extras: "Sparks flying off the shield",
    message: "Unstoppable",
    formSubmitted: true,
    referencePhoto: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=face",
    aiGenerated: null,
    artApplied: null,
    traits: null,
    prompt: "",
    comments: [],
  },
];

const STATUS_CONFIG = {
  awaiting_form: { label: "Awaiting Form", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: Clock },
  queued: { label: "Queued", color: "#8B8FA3", bg: "rgba(139,143,163,0.08)", icon: Package },
  processing: { label: "Processing", color: "#3B82F6", bg: "rgba(59,130,246,0.1)", icon: Zap },
  review: { label: "Ready for Review", color: "#A855F7", bg: "rgba(168,85,247,0.12)", icon: Eye },
  revision: { label: "Needs Revision", color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: AlertTriangle },
  approved: { label: "Approved", color: "#10B981", bg: "rgba(16,185,129,0.1)", icon: CheckCircle },
};

const CATEGORY_COLORS = {
  Graduation: "#F59E0B",
  Superhero: "#EF4444",
  Wedding: "#EC4899",
  Sports: "#3B82F6",
};

// ── Components ─────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
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
          cursor: src ? "zoom-in" : "default",
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
  const cfg = STATUS_CONFIG[order.status];
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
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: "rgba(255,255,255,0.4)", fontWeight: 500,
          }}>
            {order.id}
          </span>
          <div style={{
            fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.9)",
            fontFamily: "'Outfit', sans-serif", marginTop: 2,
          }}>
            {order.name}
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <CategoryTag category={order.category} />
        {order.artStyle && (
          <span style={{
            fontSize: 10, color: "rgba(255,255,255,0.3)",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {order.artStyle}
          </span>
        )}
      </div>

      {/* Image strip */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <ImageSlot src={order.referencePhoto} label="Reference" size={64} />
        <ArrowRight size={12} style={{ opacity: 0.15, flexShrink: 0 }} />
        <ImageSlot src={order.aiGenerated} label="AI Gen" size={64} />
        <ArrowRight size={12} style={{ opacity: 0.15, flexShrink: 0 }} />
        <ImageSlot src={order.artApplied} label="Final" size={64} />
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{
          fontSize: 10, color: "rgba(255,255,255,0.2)",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {timeAgo}
        </span>
        {order.comments.length > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 10, color: "rgba(255,255,255,0.3)",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <MessageSquare size={11} /> {order.comments.length}
          </span>
        )}
      </div>
    </div>
  );
}

function DetailPanel({ order, onClose, onApprove, onRevise, onRerun }) {
  const [comment, setComment] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [showTraits, setShowTraits] = useState(false);

  if (!order) return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      color: "rgba(255,255,255,0.15)", fontFamily: "'Outfit', sans-serif",
      fontSize: 15,
    }}>
      Select an order to review
    </div>
  );

  const canApprove = order.status === "review" || order.status === "revision";
  const canRerun = order.status === "review" || order.status === "revision";

  return (
    <div style={{
      flex: 1, overflowY: "auto", padding: "28px 32px",
      background: "rgba(255,255,255,0.01)",
      borderLeft: "1px solid rgba(255,255,255,0.05)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              color: "rgba(255,255,255,0.4)",
            }}>
              {order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 700,
            color: "rgba(255,255,255,0.95)", margin: 0, letterSpacing: "-0.02em",
          }}>
            {order.name}
          </h2>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <CategoryTag category={order.category} />
            {order.artStyle && (
              <span style={{
                fontSize: 11, color: "rgba(255,255,255,0.35)",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {order.artStyle}
              </span>
            )}
            <span style={{
              fontSize: 11, color: "rgba(255,255,255,0.2)",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {order.orientation}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.05)", border: "none",
            borderRadius: 8, padding: 8, cursor: "pointer", color: "rgba(255,255,255,0.4)",
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Awaiting form state */}
      {!order.formSubmitted && (
        <div style={{
          background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 12, padding: 20, marginBottom: 24,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <Clock size={22} style={{ color: "#F59E0B", flexShrink: 0 }} />
          <div>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 600,
              color: "#F59E0B", fontSize: 14, marginBottom: 4,
            }}>
              Tally Form Not Submitted
            </div>
            <div style={{
              fontSize: 12, color: "rgba(255,255,255,0.4)",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Customer purchased but hasn't submitted their customization form yet.
            </div>
            <button style={{
              marginTop: 10, background: "rgba(245,158,11,0.15)",
              border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8,
              padding: "6px 14px", color: "#F59E0B", fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
              cursor: "pointer", letterSpacing: "0.03em",
            }}>
              SEND FORM REMINDER
            </button>
          </div>
        </div>
      )}

      {/* Image comparison */}
      {order.formSubmitted && (
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 10, color: "rgba(255,255,255,0.25)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 14,
          }}>
            IMAGE PIPELINE
          </div>
          <div style={{
            display: "flex", gap: 16, alignItems: "flex-start",
            flexWrap: "wrap",
          }}>
            <ImageSlot src={order.referencePhoto} label="Customer Reference" size={180} />
            <div style={{ display: "flex", alignItems: "center", paddingTop: 75 }}>
              <ArrowRight size={16} style={{ opacity: 0.2 }} />
            </div>
            <ImageSlot src={order.aiGenerated} label="AI Recreation" size={180} />
            <div style={{ display: "flex", alignItems: "center", paddingTop: 75 }}>
              <ArrowRight size={16} style={{ opacity: 0.2 }} />
            </div>
            <ImageSlot src={order.artApplied} label="Art Style Applied" size={180} />
          </div>
        </div>
      )}

      {/* Order details */}
      {order.formSubmitted && (
        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.05)", padding: 18,
          marginBottom: 20,
        }}>
          <div style={{
            fontSize: 10, color: "rgba(255,255,255,0.25)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 12,
          }}>
            ORDER DETAILS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
            {[
              ["Scene/Pose", order.scenepose],
              ["Listing", order.listing],
              ["Description", order.description],
              ["Extras", order.extras],
              ["Message", order.message || "—"],
              ["Orientation", order.orientation],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{
                  fontSize: 9, color: "rgba(255,255,255,0.2)",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  marginBottom: 3,
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: 12, color: "rgba(255,255,255,0.6)",
                  fontFamily: "'Outfit', sans-serif", lineHeight: 1.4,
                }}>
                  {val || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Traits */}
      {order.traits && (
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setShowTraits(!showTraits)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, padding: 0,
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}
          >
            {showTraits ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            EXTRACTED TRAITS (GPT VISION)
          </button>
          {showTraits && (
            <div style={{
              marginTop: 10, background: "rgba(59,130,246,0.05)",
              border: "1px solid rgba(59,130,246,0.1)", borderRadius: 10,
              padding: 14,
            }}>
              {Object.entries(order.traits).map(([k, v]) => (
                <div key={k} style={{
                  display: "flex", gap: 12, marginBottom: 6,
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                }}>
                  <span style={{ color: "rgba(59,130,246,0.6)", minWidth: 70, textTransform: "capitalize" }}>{k}:</span>
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Generated Prompt */}
      {order.prompt && (
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, padding: 0,
              color: "rgba(255,255,255,0.35)",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}
          >
            {showPrompt ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            GENERATED PROMPT
          </button>
          {showPrompt && (
            <div style={{
              marginTop: 10, background: "rgba(168,85,247,0.05)",
              border: "1px solid rgba(168,85,247,0.1)", borderRadius: 10,
              padding: 14, fontSize: 11, lineHeight: 1.6,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'JetBrains Mono', monospace",
              wordBreak: "break-word",
            }}>
              {order.prompt}
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      {order.comments.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 10, color: "rgba(255,255,255,0.25)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 10,
          }}>
            REVISION NOTES
          </div>
          {order.comments.map((c, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 10,
              padding: 12, marginBottom: 8,
              borderLeft: "2px solid rgba(168,85,247,0.4)",
            }}>
              <div style={{
                fontSize: 12, color: "rgba(255,255,255,0.6)",
                fontFamily: "'Outfit', sans-serif", lineHeight: 1.5,
                marginBottom: 6,
              }}>
                {c.text}
              </div>
              <div style={{
                fontSize: 9, color: "rgba(255,255,255,0.2)",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {c.author} · {new Date(c.time).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action bar */}
      {canApprove && (
        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)", padding: 18,
        }}>
          {/* Comment input */}
          <div style={{
            display: "flex", gap: 8, marginBottom: 14,
          }}>
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add revision notes..."
              style={{
                flex: 1, background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "10px 14px",
                color: "rgba(255,255,255,0.8)",
                fontFamily: "'Outfit', sans-serif", fontSize: 13,
                outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.3)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            />
            <button
              onClick={() => {
                if (comment.trim()) {
                  onRevise(order.id, comment);
                  setComment("");
                }
              }}
              style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8, padding: "10px 16px", cursor: "pointer",
                color: "#EF4444", display: "flex", alignItems: "center", gap: 6,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
                letterSpacing: "0.03em", whiteSpace: "nowrap",
                opacity: comment.trim() ? 1 : 0.4,
              }}
            >
              <Send size={13} /> REVISE
            </button>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => onApprove(order.id)}
              style={{
                flex: 1, background: "linear-gradient(135deg, #10B981, #059669)",
                border: "none", borderRadius: 10, padding: "12px 20px",
                color: "white", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                letterSpacing: "0.02em",
                boxShadow: "0 4px 15px rgba(16,185,129,0.25)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <Check size={16} /> Approve & Send to Customer
            </button>
            <button
              onClick={() => onRerun(order.id)}
              style={{
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: 10, padding: "12px 16px", cursor: "pointer",
                color: "#3B82F6", display: "flex", alignItems: "center", gap: 6,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
                letterSpacing: "0.03em",
              }}
            >
              <RotateCcw size={14} /> RE-RUN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Main Dashboard ─────────────────────────────────────────────────

export default function ManifestoDashboard() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedId, setSelectedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

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

  const handleApprove = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "approved", comments: [...o.comments, { text: "Approved — sending to customer.", time: new Date().toISOString(), author: "Clifton" }] } : o));
  };

  const handleRevise = (id, text) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "revision", comments: [...o.comments, { text, time: new Date().toISOString(), author: "Clifton" }] } : o));
  };

  const handleRerun = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "processing", aiGenerated: null, artApplied: null } : o));
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "review", aiGenerated: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=300&h=300&fit=crop", artApplied: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop" } : o));
    }, 3000);
  };

  return (
    <div style={{
      width: "100%", height: "100vh",
      background: "#0A0B0F",
      color: "rgba(255,255,255,0.8)",
      display: "flex", flexDirection: "column",
      fontFamily: "'Outfit', sans-serif",
      overflow: "hidden",
      opacity: loaded ? 1 : 0,
      transition: "opacity 0.6s ease",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── Top Bar ── */}
      <div style={{
        padding: "16px 28px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(255,255,255,0.01)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #A855F7, #3B82F6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: 14, color: "white",
          }}>
            M
          </div>
          <div>
            <div style={{
              fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.9)",
            }}>
              Manifesto Pieces
            </div>
            <div style={{
              fontSize: 9, color: "rgba(255,255,255,0.25)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              ORDER COMMAND CENTER
            </div>
          </div>
        </div>

        {/* Status summary chips */}
        <div style={{ display: "flex", gap: 6 }}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = statusCounts[key] || 0;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
                style={{
                  background: filterStatus === key ? cfg.bg : "rgba(255,255,255,0.02)",
                  border: filterStatus === key ? `1px solid ${cfg.color}40` : "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 8, padding: "5px 10px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                  color: filterStatus === key ? cfg.color : "rgba(255,255,255,0.3)",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: cfg.color,
                  opacity: filterStatus === key ? 1 : 0.4,
                }} />
                {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ── Order List ── */}
        <div style={{
          width: 420, flexShrink: 0, overflowY: "auto",
          padding: "16px 16px",
          borderRight: "1px solid rgba(255,255,255,0.04)",
        }}>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10, padding: "8px 12px", marginBottom: 14,
          }}>
            <Search size={14} style={{ opacity: 0.25 }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              style={{
                background: "none", border: "none", outline: "none",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "'Outfit', sans-serif", fontSize: 13,
                flex: 1,
              }}
            />
          </div>

          {/* Order cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredOrders.map((order, i) => (
              <div
                key={order.id}
                style={{
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateY(0)" : "translateY(12px)",
                  transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s`,
                }}
              >
                <OrderCard
                  order={order}
                  isSelected={selectedId === order.id}
                  onSelect={setSelectedId}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail Panel ── */}
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedId(null)}
          onApprove={handleApprove}
          onRevise={handleRevise}
          onRerun={handleRerun}
        />
      </div>
    </div>
  );
}