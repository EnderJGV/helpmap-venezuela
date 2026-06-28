// Real share helpers. Per CLAUDE.md §5: WhatsApp/Telegram have URL share intents;
// Instagram does not — fall back to copy-link + "paste in your story" guidance.

export function patientPath(id: string) {
  return `/p/${id}`;
}

export function patientUrl(id: string) {
  if (typeof window === "undefined") return patientPath(id);
  return window.location.origin + patientPath(id);
}

export function shareText(name: string, statusLabel: string, locationName: string) {
  return `${name} · ${statusLabel} · ${locationName} · HelpMap Venezuela`;
}

// Google Maps directions to a center's coordinates ("Cómo llegar"). Works on web
// and deep-links into the Maps app on mobile.
export function mapsDirectionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function whatsappUrl(url: string, text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`;
}

export function telegramUrl(url: string, text: string) {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

export function openShare(href: string) {
  if (typeof window !== "undefined") window.open(href, "_blank", "noopener,noreferrer");
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

// Generates the patient story banner (1080×1920 PNG via /p/[id]/story) and hands
// it to the native share sheet as a FILE — on mobile the user can then pick
// Instagram → Story/Chat (the only way to reach IG stories; IG has no web share
// intent). Falls back to downloading the image when file-share is unsupported.
export type StoryShareResult = "shared" | "downloaded" | "error";

export async function shareStoryImage(id: string, title: string): Promise<StoryShareResult> {
  try {
    const res = await fetch(patientPath(id) + "/story");
    if (!res.ok) return "error";
    const blob = await res.blob();
    const file = new File([blob], `helpmap-${id}.png`, { type: "image/png" });

    const canShareFile =
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] });

    if (canShareFile && typeof navigator.share === "function") {
      try {
        await navigator.share({ files: [file], title });
        return "shared";
      } catch {
        /* user cancelled → fall through to download */
      }
    }

    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = `helpmap-${id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objUrl);
    return "downloaded";
  } catch {
    return "error";
  }
}

// Native OS share sheet (mobile) — shows WhatsApp/Instagram/Telegram directly.
// Returns false if unsupported or cancelled so callers can fall back.
export async function nativeShare(opts: { title: string; text: string; url: string }): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share(opts);
      return true;
    }
  } catch {
    /* user cancelled or share failed */
  }
  return false;
}
