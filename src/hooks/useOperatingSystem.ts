import { useEffect, useState } from 'react';
import type { PlatformId } from '@site/static/data/downloads';

export type UseOperatingSystemReturn = {
  detected: PlatformId | null;
  selected: PlatformId | null;
  select: (platform: PlatformId) => void;
};

/**
 * Work out which desktop OS a user agent belongs to, or null when it is not
 * one Podman runs on. Takes its inputs as arguments so it can be tested with
 * plain strings.
 */
export function detectOperatingSystem(userAgent: string, platform = '', maxTouchPoints = 0): PlatformId | null {
  const ua = `${userAgent} ${platform}`.toLowerCase();

  /* Checked first because these impersonate desktop systems: Android embeds
     "linux", iOS embeds "mac os x", and iPadOS 13+ reports "MacIntel" —
     distinguishable from a real Mac only by its touch points. */
  const isIpadPretendingToBeAMac = ua.includes('macintel') && maxTouchPoints > 1;
  if (/android|iphone|ipad|ipod/.test(ua) || isIpadPretendingToBeAMac) {
    return null;
  }

  if (/windows|win32|win64/.test(ua)) {
    return 'windows';
  }
  if (/macintosh|mac os x|macintel/.test(ua)) {
    return 'mac';
  }
  if (/linux|x11|cros/.test(ua)) {
    return 'linux';
  }
  return null;
}

/** Detected platform plus the visitor's manual override, if they set one. */
export function useOperatingSystem(): UseOperatingSystemReturn {
  const [detected, setDetected] = useState<PlatformId | null>(null);
  const [override, setOverride] = useState<PlatformId | null>(null);

  /* Detection runs here rather than during render because Docusaurus builds
     these pages in Node, where `navigator` does not exist. Starting at null
     also keeps the server and first client render identical. */
  useEffect(() => {
    if (typeof navigator === 'undefined') {
      return;
    }
    setDetected(
      detectOperatingSystem(navigator.userAgent ?? '', navigator.platform ?? '', navigator.maxTouchPoints ?? 0),
    );
  }, []);

  return {
    detected,
    selected: override ?? detected,
    select: setOverride,
  };
}

export default useOperatingSystem;
