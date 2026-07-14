/* Progressive accessibility repair for self-contained project pages. */
(() => {
  const humanize = (value) => String(value || "")
    .replace(/^(f_|p-|c-|checkout-|cust-|admin-)/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();

  const labelFor = (control) => {
    if (control.id) {
      const explicit = document.querySelector(`label[for="${CSS.escape(control.id)}"]`);
      if (explicit?.textContent.trim()) return explicit.textContent.trim();
    }
    const container = control.closest(
      ".field, .form-field, .form-group, .admin-form-group, .checkout-field, .filter-group, .input-group"
    );
    const nearby = container?.querySelector("label");
    if (nearby?.textContent.trim()) return nearby.textContent.trim();
    if (control.previousElementSibling?.tagName === "LABEL") {
      const previous = control.previousElementSibling.textContent.trim();
      if (previous) return previous;
    }
    return control.getAttribute("placeholder") || humanize(control.id || control.name || control.type || control.tagName);
  };

  const enhance = () => {
    document.querySelectorAll("input:not([type='hidden']), select, textarea").forEach((control) => {
      if (control.getAttribute("aria-label") || control.getAttribute("aria-labelledby") || control.closest("label")) return;
      const label = labelFor(control);
      if (label) control.setAttribute("aria-label", label);
    });

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      link.setAttribute("rel", [...rel].join(" "));
    });

    document.querySelectorAll("iframe:not([title])").forEach((frame, index) => {
      frame.title = frame.getAttribute("aria-label") || frame.dataset.title || `Prévia interativa ${index + 1}`;
    });
  };

  const start = () => {
    enhance();
    let scheduled = false;
    new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        enhance();
      });
    }).observe(document.body, { childList: true, subtree: true });
    window.addEventListener("load", enhance, { once: true });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
