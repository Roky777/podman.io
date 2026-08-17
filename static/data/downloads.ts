/**
 * DOWNLOADS PAGE DATA
 *
 * All copy, links, and version numbers for the /downloads page live here.
 *
 * No JSX/React knowledge is required to maintain this file.
 */

const INSTALL_DOCS = '/docs/installation';

/* TYPES */

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

export { header, platforms };
