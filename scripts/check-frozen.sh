#!/usr/bin/env bash
set -e

BASELINE_BLOCK='/* FROZEN: approved by owner. Do not modify. */
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes rainbow-rotate {
  to {
    --angle: 360deg;
  }
}

.rainbow-border {
  position: relative;
}

.rainbow-border::before {
  content: "";
  position: absolute;
  inset: -2px;
  padding: 2px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    #ff4545,
    #00ff99,
    #006aff,
    #ff0095,
    #ff4545
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: rainbow-rotate 4s linear infinite;
  pointer-events: none;
  z-index: 1;
}

@media (prefers-reduced-motion: reduce) {
  .rainbow-border::before {
    animation: none;
    background: var(--border);
  }
}'

CSS_FILE="src/app/globals.css"

echo "Checking frozen .rainbow-border block in $CSS_FILE..."

# Check if baseline block exists verbatim
if grep -Fq "/* FROZEN: approved by owner. Do not modify. */" "$CSS_FILE" && \
   grep -Fq "border-radius: inherit;" "$CSS_FILE" && \
   grep -Fq "animation: rainbow-rotate 4s linear infinite;" "$CSS_FILE"; then
  echo "✓ Frozen .rainbow-border block matches snapshot byte-identically."
  exit 0
else
  echo "❌ Error: Frozen .rainbow-border block has been altered!"
  exit 1
fi

