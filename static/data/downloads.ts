/**
 * DOWNLOADS PAGE DATA
 *
 * All copy, links, and version numbers for the /downloads page live here.
 *
 * To update this page after a release you should only ever need to edit:
 *   1. `LATEST_VERSION` / `LATEST_DESKTOP_VERSION` in `static/data/global.ts`
 *   2. the asset filenames below, if a release renames or adds one
 *
 * No JSX/React knowledge is required to maintain this file.
 */
import { LATEST_VERSION, LATEST_DESKTOP_VERSION, LATEST_DESKTOP_DOWNLOAD_URL } from './global';

/* RELEASE ASSET LOCATIONS */

const PODMAN_REPO = 'https://github.com/podman-container-tools/podman';
const PODMAN_ASSETS = `${PODMAN_REPO}/releases/download/v${LATEST_VERSION}`;

const DESKTOP_REPO = 'https://github.com/podman-desktop/podman-desktop';
const DESKTOP_ASSETS = `${DESKTOP_REPO}/releases/download/v${LATEST_DESKTOP_VERSION}`;

const INSTALL_DOCS = '/docs/installation';

/* TYPES */

export type DownloadAsset = {
  label: string;
  detail: string;
  path: string;
  recommended?: boolean;
  isDocs?: boolean;
  /* Update alongside the filenames when a release changes. */
  size?: string;
};

export type PlatformDownloads = {
  assets?: DownloadAsset[];
  note?: string;
};

export type PlatformId = 'windows' | 'mac' | 'linux';

/* PAGE HEADER */

const header = {
  title: 'Download Podman',
  subtitle:
    'Get the Podman command line tool, the Podman Desktop graphical application, or both. Everything here is free and open source under the Apache License 2.0.',
  docsLink: {
    text: 'Full installation documentation',
    path: INSTALL_DOCS,
  },
};

/* PLATFORMS (ORDER DETERMINES THE TAB ORDER) */

const platforms: { id: PlatformId; label: string; icon: string }[] = [
  { id: 'windows', label: 'Windows', icon: 'fa6-brands:windows' },
  { id: 'mac', label: 'macOS', icon: 'fa6-brands:apple' },
  { id: 'linux', label: 'Linux', icon: 'fa6-brands:linux' },
];

/* PRODUCTS */

export type Product = {
  id: 'cli' | 'desktop';
  title: string;
  tagline: string;
  icon: string;
  version: string;
  releaseNotes: { text: string; path: string };
  docsLink: { text: string; path: string };
  /* Omit when a project publishes no checksum file. Do not link one that does
     not exist — Podman Desktop currently publishes none. */
  checksums?: { text: string; path: string };
  downloads: Record<PlatformId, PlatformDownloads>;
};

const products: Product[] = [
  {
    id: 'cli',
    title: 'Podman CLI',
    tagline:
      'The command line tool. Build, run, and manage containers and pods from your terminal — daemonless and rootless.',
    icon: 'material-symbols:terminal-rounded',
    version: LATEST_VERSION,
    releaseNotes: {
      text: `Release notes for v${LATEST_VERSION}`,
      path: `${PODMAN_REPO}/releases/tag/v${LATEST_VERSION}`,
    },
    docsLink: { text: 'Other install options', path: INSTALL_DOCS },
    checksums: { text: 'Verify SHA-256 checksums', path: `${PODMAN_ASSETS}/shasums` },
    downloads: {
      windows: {
        assets: [
          {
            label: 'Windows (x86_64)',
            detail: `Installer · podman-installer-windows-amd64.msi`,
            path: `${PODMAN_ASSETS}/podman-installer-windows-amd64.msi`,
            recommended: true,
            size: '26.6 MB',
          },
          {
            label: 'Windows (arm64)',
            detail: `Installer · podman-installer-windows-arm64.msi`,
            path: `${PODMAN_ASSETS}/podman-installer-windows-arm64.msi`,
            size: '24.5 MB',
          },
        ],
        note: 'Podman on Windows runs your containers inside a WSL 2 guest, which the installer sets up for you.',
      },
      mac: {
        assets: [
          {
            label: 'Apple Silicon (arm64)',
            detail: `Installer · podman-installer-macos-arm64.pkg`,
            path: `${PODMAN_ASSETS}/podman-installer-macos-arm64.pkg`,
            recommended: true,
            size: '71.8 MB',
          },
          {
            label: 'Intel Mac (x86_64)',
            detail: 'No installer in this release — see the install guide',
            path: INSTALL_DOCS,
            isDocs: true,
          },
        ],
        note: 'After installing, run `podman machine init` and `podman machine start` to create the Linux guest that runs your containers.',
      },
      linux: {},
    },
  },
  {
    id: 'desktop',
    title: 'Podman Desktop',
    tagline:
      'The graphical application. Manage containers, pods, images, and Kubernetes from a desktop UI — built on top of the Podman engine.',
    icon: 'material-symbols:desktop-windows-outline-rounded',
    version: LATEST_DESKTOP_VERSION,
    releaseNotes: {
      text: `Release notes for v${LATEST_DESKTOP_VERSION}`,
      path: LATEST_DESKTOP_DOWNLOAD_URL,
    },
    docsLink: { text: 'All Podman Desktop downloads', path: 'https://podman-desktop.io/downloads' },
    downloads: {
      windows: {
        assets: [
          {
            label: 'Windows (x86_64)',
            detail: `Installer · podman-desktop-${LATEST_DESKTOP_VERSION}-setup-x64.exe`,
            path: `${DESKTOP_ASSETS}/podman-desktop-${LATEST_DESKTOP_VERSION}-setup-x64.exe`,
            recommended: true,
            size: '143.5 MB',
          },
          {
            label: 'Windows (arm64)',
            detail: `Installer · podman-desktop-${LATEST_DESKTOP_VERSION}-setup-arm64.exe`,
            path: `${DESKTOP_ASSETS}/podman-desktop-${LATEST_DESKTOP_VERSION}-setup-arm64.exe`,
            size: '136.8 MB',
          },
        ],
        note: 'Podman Desktop can install and configure the Podman CLI for you on first launch.',
      },
      mac: {
        assets: [
          {
            label: 'Universal (Apple Silicon & Intel)',
            detail: `Disk image · podman-desktop-${LATEST_DESKTOP_VERSION}-universal.dmg`,
            path: `${DESKTOP_ASSETS}/podman-desktop-${LATEST_DESKTOP_VERSION}-universal.dmg`,
            recommended: true,
            size: '392.3 MB',
          },
          {
            label: 'Apple Silicon (arm64)',
            detail: `Disk image · podman-desktop-${LATEST_DESKTOP_VERSION}-arm64.dmg`,
            path: `${DESKTOP_ASSETS}/podman-desktop-${LATEST_DESKTOP_VERSION}-arm64.dmg`,
            size: '225.2 MB',
          },
          {
            label: 'Intel Mac (x86_64)',
            detail: `Disk image · podman-desktop-${LATEST_DESKTOP_VERSION}-x64.dmg`,
            path: `${DESKTOP_ASSETS}/podman-desktop-${LATEST_DESKTOP_VERSION}-x64.dmg`,
            size: '230.6 MB',
          },
        ],
        note: 'The universal disk image works on both Apple Silicon and Intel Macs. Pick an architecture-specific build only if you need a smaller download.',
      },
      linux: {
        /* No `recommended` asset: on Linux the Flathub command is the route we
           point people at, so no archive should be styled as primary. */
        assets: [
          {
            label: 'Flatpak bundle',
            detail: `podman-desktop-${LATEST_DESKTOP_VERSION}.flatpak`,
            path: `${DESKTOP_ASSETS}/podman-desktop-${LATEST_DESKTOP_VERSION}.flatpak`,
            size: '109.7 MB',
          },
          {
            label: 'Archive (x86_64)',
            detail: `podman-desktop-${LATEST_DESKTOP_VERSION}-x64.tar.gz`,
            path: `${DESKTOP_ASSETS}/podman-desktop-${LATEST_DESKTOP_VERSION}-x64.tar.gz`,
            size: '152.1 MB',
          },
          {
            label: 'Archive (arm64)',
            detail: `podman-desktop-${LATEST_DESKTOP_VERSION}-arm64.tar.gz`,
            path: `${DESKTOP_ASSETS}/podman-desktop-${LATEST_DESKTOP_VERSION}-arm64.tar.gz`,
            size: '151.6 MB',
          },
        ],
      },
    },
  },
];

export { header, platforms, products };
