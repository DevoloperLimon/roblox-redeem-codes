"use client";

import { useRef, useEffect, useState } from "react";

interface SandboxedHtmlProps {
  html: string;
}

/**
 * Renders arbitrary HTML/CSS inside a sandboxed <iframe> using srcdoc.
 * This guarantees complete CSS isolation — custom <style> tags, animations,
 * and global selectors inside the content cannot leak out and affect the
 * parent page's layout, header, footer, or body.
 *
 * The iframe dynamically adjusts its height to match its content so there
 * is no visible scrollbar or fixed-height cut-off.
 */
export default function SandboxedHtml({ html }: SandboxedHtmlProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(200);

  // Build the srcdoc with a small reset + the user HTML
  const srcdoc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    /* Minimal reset so content looks reasonable */
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                   "Helvetica Neue", Arial, sans-serif;
      font-size: 14px;
      line-height: 1.7;
      color: #d4d4d8;          /* matches muted-foreground on dark theme */
      background: transparent;
      overflow: hidden;         /* prevent internal scrollbar */
      word-break: break-word;
    }
    a { color: #818cf8; }
    img, video { max-width: 100%; height: auto; border-radius: 8px; }
    h1, h2, h3, h4, h5, h6 {
      color: #f4f4f5;
      margin: 1em 0 0.5em;
      line-height: 1.3;
    }
    h1 { font-size: 1.6em; }
    h2 { font-size: 1.35em; }
    h3 { font-size: 1.15em; }
    p { margin: 0.6em 0; }
    ul, ol { padding-left: 1.4em; }
    code {
      background: rgba(255,255,255,0.06);
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    pre {
      background: rgba(255,255,255,0.06);
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid rgba(255,255,255,0.1);
      padding: 8px 12px;
      text-align: left;
    }
    th { background: rgba(255,255,255,0.04); }
  </style>
</head>
<body>
  ${html}
  <script>
    // Notify parent of content height changes so the iframe can resize.
    function postHeight() {
      var h = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: '__sandboxed_html_height__', height: h }, '*');
    }
    // Initial + after all assets load
    postHeight();
    window.addEventListener('load', postHeight);
    // Observe DOM mutations (e.g. lazy images, dynamic content)
    new MutationObserver(postHeight).observe(document.body, {
      childList: true, subtree: true, attributes: true
    });
    // Also re-measure on resize
    window.addEventListener('resize', postHeight);
  <\/script>
</body>
</html>`;

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (
        e.data &&
        e.data.type === "__sandboxed_html_height__" &&
        typeof e.data.height === "number"
      ) {
        // Only accept messages from our own iframe
        if (iframeRef.current && e.source === iframeRef.current.contentWindow) {
          setHeight(e.data.height);
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcdoc}
      sandbox="allow-scripts"
      title="Game description"
      style={{
        width: "100%",
        height: `${height}px`,
        border: "none",
        display: "block",
        overflow: "hidden",
        background: "transparent",
        colorScheme: "dark",
      }}
    />
  );
}
