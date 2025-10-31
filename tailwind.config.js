#!/usr/bin/env bash
set -euo pipefail

# == Enter repo ==
for d in "$HOME/workspace/SFSDataQueryEngine" "$HOME/SFSDataQueryEngine" "$PWD"; do
  [ -d "$d/.git" ] && { cd "$d"; break; }; done
git rev-parse --is-inside-work-tree >/dev/null

TS="$(date -u +%Y%m%dT%H%M%SZ)"
BK=".sfs-theme-backups/$TS"
mkdir -p "$BK"

echo "== Detect client root =="
CLIENT=""
for c in client src web app; do
  [ -d "$c" ] && CLIENT="$c" && break
done
[ -z "$CLIENT" ] && CLIENT="client"
mkdir -p "$CLIENT"

# Guess entry html
HTML=""
for h in index.html "$CLIENT/index.html" public/index.html; do
  [ -f "$h" ] && HTML="$h" && break
done
[ -z "$HTML" ] && { HTML="index.html"; echo "<!doctype html><html><head><meta charset='utf-8'><title>SFS</title></head><body><div id='root'></div></body></html>" > "$HTML"; }

echo "== Create styles directory and backup originals =="
mkdir -p src/styles "$CLIENT/components"
[ -f "$HTML" ] && cp -f "$HTML" "$BK/$(basename "$HTML").bak" || true
[ -f "tailwind.config.js" ] && cp -f tailwind.config.js "$BK/tailwind.config.js.bak" || true

echo "== Write starfield + glass CSS: [src/styles/smartflow.css] =="
cat > src/styles/smartflow.css <<'CSS'
:root{
  --sf-bg:#0b0b0f; --sf-ink:#0e0d10; --sf-brown:#1a120b;
  --sf-gold:#D5B35E; --sf-gold-2:#F0D58B;
  --sf-text:#EAE6DF; --sf-sub:#C9C3B5;
  --sf-border:rgba(255,255,255,0.08); --sf-glow:rgba(213,179,94,0.35);
}

/* Base colors even without Tailwind */
html,body{background:var(--sf-bg); color:var(--sf-text); min-height:100%;}

/* Starry background (static, no canvas) */
.sf-stars{
  --dot:
    radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.7), transparent 60%),
    radial-gradient(1.5px 1.5px at 80% 70%, rgba(255,255,255,.55), transparent 60%),
    radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,.45), transparent 60%),
    radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,.35), transparent 60%);
  background:
    var(--dot),
    radial-gradient(900px 500px at 10% -10%, rgba(213,179,94,.08), transparent 70%),
    radial-gradient(700px 400px at 110% 10%, rgba(240,213,139,.06), transparent 70%),
    var(--sf-ink);
  position:fixed; inset:0; z-index:-2;
}
.sf-vignette::before{
  content:""; position:fixed; inset:0; pointer-events:none; z-index:-1;
  background:
    radial-gradient(1200px 700px at 50% -10%, rgba(213,179,94,.07), transparent 60%),
    radial-gradient(900px 600px at 80% 120%, rgba(255,255,255,.05), transparent 60%),
    linear-gradient(180deg, transparent, rgba(0,0,0,.45));
}

/* Glass card utility (class usable without Tailwind) */
.sf-glass{
  background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  border:1px solid var(--sf-border); border-radius:16px;
  box-shadow:0 1px 0 0 rgba(255,255,255,.08) inset, 0 20px 50px -20px rgba(0,0,0,.5);
  backdrop-filter: blur(8px);
}

/* Gold underline accent */
.sf-gold-underline{ position:relative; }
.sf-gold-underline::after{
  content:""; position:absolute; left:0; bottom:-6px; width:56px; height:2px;
  background:linear-gradient(90deg, var(--sf-gold), var(--sf-gold-2)); border-radius:2px;
  box-shadow:0 0 12px var(--sf-glow);
}

/* Optional Tailwind-friendly color class fallbacks if Tailwind is absent */
.bg-sf-bg{background-color:var(--sf-bg)!important}
.text-sf-text{color:var(--sf-text)!important}
.text-sf-sub{color:var(--sf-sub)!important}
.text-sf-gold{color:var(--sf-gold)!important}
.border-sf{border-color:var(--sf-border)!important}
CSS

echo "== Ensure tailwind.config.js has theme tokens (non-destructive) =="
# Create minimal Tailwind config if missing (won't break if you don't use it)
if [ ! -f tailwind.config.js ]; then
  cat > tailwind.config.js <<'TW'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html","./{client,server,src}/**/*.{ts,tsx,js,jsx,html}"],
  theme: {
    extend: {
      colors: {
        sf: {
          bg:"#0b0b0f", ink:"#0e0d10", brown:"#1a120b",
          gold:"#D5B35E", gold2:"#F0D58B", text:"#EAE6DF", sub:"#C9C3B5",
          border:"rgba(255,255,255,0.08)", glow:"rgba(213,179,94,0.35)"
        }
      },
      boxShadow: {
        glass: "0 1px 0 0 rgba(255,255,255,0.08) inset, 0 20px 50px -20px rgba(0,0,0,0.5)"
      }
    }
  },
  plugins: []
}
TW
fi

echo "== Wire styles + background layers into [$HTML] =="
# Insert <link> and fixed background layers if not present
if ! grep -q "src/styles/smartflow.css" "$HTML"; then
  # Add link before </head>
  awk '1; /<\/head>/ && !x {print "    <link rel=\"stylesheet\" href=\"/src/styles/smartflow.css\">"; x=1}' "$HTML" > "$HTML.tmp" && mv "$HTML.tmp" "$HTML"
fi
if ! grep -q "sf-stars" "$HTML"; then
  # Add star/vignette layers right after <body>
  awk 'BEGIN{added=0}
       {print}
       /<body[^>]*>/ && !added {print "    <div class=\"sf-stars\"></div>\n    <div class=\"sf-vignette\"></div>"; added=1}' "$HTML" > "$HTML.tmp" && mv "$HTML.tmp" "$HTML"
fi
# Add body classes if body tag exists
sed -i 's/<body\(.*\)>/<body class="bg-sf-bg text-sf-text"\1>/' "$HTML" || true

echo "== Create React GlassCard component if missing =="
if [ ! -f "$CLIENT/components/GlassCard.tsx" ]; then
  cat > "$CLIENT/components/GlassCard.tsx" <<'TSX'
import React from "react";

type Props = React.PropsWithChildren<{ title?: string; className?: string; footer?: React.ReactNode }>;

export default function GlassCard({ title, children, className = "", footer }: Props) {
  return (
    <article className={`sf-glass p-5 md:p-6 relative overflow-hidden ${className}`} role="region" aria-label={title ?? "Card"}>
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 0 1px rgba(213,179,94,0.15)" }} />
      {title && <h3 className="text-xl md:text-2xl font-semibold sf-gold-underline mb-3">{title}</h3>}
      <div className="text-sf-sub">{children}</div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </article>
  );
}
TSX
fi

echo "== Optional demo hero (only if no App.tsx found) =="
if [ ! -f "$CLIENT/App.tsx" ]; then
  cat > "$CLIENT/App.tsx" <<'TSX'
import React from "react";
import GlassCard from "./components/GlassCard";

export default function App() {
  return (
    <main className="min-h-screen w-full selection:text-sf-text">
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <header className="mb-10">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            SFS <span className="text-sf-gold">Data Query Engine</span>
          </h1>
          <p className="mt-3 text-sf-sub max-w-2xl">
            Starry backdrop. Glass cards. Premium black/brown + gold — matched with SmartFlowSite.
          </p>
        </header>
        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard title="AI Bot">Natural language → SQL with safeguards.</GlassCard>
          <GlassCard title="Booking">Calendar/slots endpoints. Offline-first cache.</GlassCard>
          <GlassCard title="E-com Search">Fast product search with embeddings + rules.</GlassCard>
        </div>
      </section>
    </main>
  );
}
TSX
fi

echo "== Try to reference the TSX entry if index.html looks like a Vite app =="
# Best-effort insert script tag if none exists
if ! grep -q "type=\"module\"" "$HTML"; then
  awk '1; /<\/body>/ && !x {print "    <script type=\"module\" src=\"/'"$CLIENT"'/main.tsx\"></script>"; x=1}' "$HTML" > "$HTML.tmp" && mv "$HTML.tmp" "$HTML"
fi

echo "== Commit changes =="
git add "$HTML" src/styles/smartflow.css "$CLIENT/components/GlassCard.tsx" 2>/dev/null || true
[ -f "$CLIENT/App.tsx" ] && git add "$CLIENT/App.tsx" || true
[ -f tailwind.config.js ] && git add tailwind.config.js || true
git commit -m "ui(theme): starry background + glass cards + premium gold theme (SmartFlowSite match)" || true
git push -u origin "$(git rev-parse --abbrev-ref HEAD)"

echo "== Done. If you use a dev client, run: npm run dev"
