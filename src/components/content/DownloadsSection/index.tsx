import React, { useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import CodeBlock from '@theme/CodeBlock';
/* HOOKS */
import useOperatingSystem from '@site/src/hooks/useOperatingSystem';
/* PAGE DATA */
import { platforms, products } from '@site/static/data/downloads';
import type { DownloadAsset, GlossaryTerm, InstallCommand, PlatformId, Product } from '@site/static/data/downloads';

/* Shared focus indicator. purple-500 clears 3:1 against both the white cards
   (3.8:1) and the dark background (4.6:1), so it stays visible in either
   theme where the browser default outline does not. */
const focusRing =
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900';

/* Podman purple for the CLI, Podman Desktop purple for Desktop, so the two
   products read as distinct. Written out in full because Tailwind only ships
   classes it can find literally in the source. */
const accents = {
  cli: {
    text: 'text-purple-700 dark:text-purple-300',
    iconBox: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100',
    button: 'bg-purple-700 text-white hover:bg-purple-900 hover:text-white dark:bg-purple-700 dark:hover:bg-purple-900',
    rule: 'border-purple-300 dark:border-purple-700',
  },
  desktop: {
    text: 'text-deep-purple-700 dark:text-deep-purple-300',
    iconBox: 'bg-deep-purple-100 text-deep-purple-700 dark:bg-deep-purple-900 dark:text-deep-purple-100',
    button:
      'bg-deep-purple-700 text-white hover:bg-deep-purple-900 hover:text-white dark:bg-deep-purple-700 dark:hover:bg-deep-purple-900',
    rule: 'border-deep-purple-300 dark:border-deep-purple-700',
  },
};

type PlatformTabsProps = {
  selected: PlatformId | null;
  onSelect: (platform: PlatformId) => void;
};

type DistroCommandsProps = {
  commands: InstallCommand[];
  accent: (typeof accents)[keyof typeof accents];
};

type ProductCardProps = {
  product: Product;
  platform: PlatformId;
};

/* GLOSSARY TERM */
const Term = ({ term, definition, accent }: GlossaryTerm & { accent: string }): JSX.Element => {
  const [open, setOpen] = useState(false);
  const id = `term-${term}`;

  return (
    <span className="relative inline-block">
      <button
        type="button"
        /* Always references the definition, so assistive technology announces
           it on focus rather than only on hover. */
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={event => event.key === 'Escape' && setOpen(false)}
        className={`cursor-help rounded-sm border-0 bg-transparent p-0 font-semibold underline decoration-dotted underline-offset-4 ${accent} ${focusRing}`}>
        {term}
      </button>
      {/* Opacity rather than visibility, so the text stays in the accessibility
          tree for aria-describedby while hidden. */}
      <span
        id={id}
        role="tooltip"
        className={`absolute left-0 top-full z-10 mt-2 w-64 rounded-md border-2 border-gray-500 bg-white p-3 text-sm font-normal leading-relaxed text-gray-700 shadow-lg transition-opacity duration-150 motion-reduce:transition-none dark:bg-gray-900 dark:text-gray-100 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}>
        {definition}
      </span>
    </span>
  );
};

/** The asset a visitor on this platform should most likely download. */
function getRecommendedAsset(product: Product, platform: PlatformId): DownloadAsset | undefined {
  const assets = product.downloads[platform]?.assets ?? [];
  return assets.find(asset => asset.recommended && !asset.isDocs);
}

/* PLATFORM TABS */
const PlatformTabs = ({ selected, onSelect }: PlatformTabsProps): JSX.Element => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const lastIndex = platforms.length - 1;
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === 'ArrowLeft') nextIndex = index === 0 ? lastIndex : index - 1;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = lastIndex;

    if (nextIndex === null) return;
    event.preventDefault();
    onSelect(platforms[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Choose your operating system"
      className="mx-auto flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:justify-center">
      {platforms.map((platform, index) => {
        const isSelected = platform.id === selected;
        return (
          <button
            key={platform.id}
            ref={element => (tabRefs.current[index] = element)}
            role="tab"
            id={`platform-tab-${platform.id}`}
            aria-selected={isSelected}
            aria-controls={`platform-panel-${platform.id}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(platform.id)}
            onKeyDown={event => handleKeyDown(event, index)}
            className={`${focusRing} flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-md border-2 px-6 py-3 text-lg font-semibold transition duration-150 ease-in-out motion-reduce:transition-none ${
              isSelected
                ? 'border-purple-700 bg-purple-700 text-white dark:border-purple-500 dark:bg-purple-700 dark:text-white'
                : 'border-gray-100 bg-white text-gray-700 hover:border-purple-300 hover:text-purple-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-purple-500 dark:hover:text-purple-300'
            }`}>
            <Icon icon={platform.icon} className="text-2xl" aria-hidden="true" />
            {platform.label}
          </button>
        );
      })}
    </div>
  );
};

/* FAST PATH */
const FastPath = ({ platform }: { platform: PlatformId }): JSX.Element | null => {
  const platformLabel = platforms.find(item => item.id === platform)?.label ?? '';

  /* Desktop is the more common first download, except on Linux where Podman
     runs natively and the terminal is the expected route. */
  const primaryId = platform === 'linux' ? 'cli' : 'desktop';
  const primary = products.find(product => product.id === primaryId);
  const secondary = products.find(product => product.id !== primaryId);
  if (!primary) return null;

  const accent = accents[primary.id];
  const asset = getRecommendedAsset(primary, platform);
  const command = primary.downloads[platform]?.commands?.[0];

  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-100">
        Detected {platformLabel}
      </p>
      <div className="rounded-md border-2 border-purple-300 bg-white p-6 shadow-md dark:border-purple-700 dark:bg-gray-900">
        <h2 className={`mb-4 text-2xl ${accent.text}`}>
          {primary.title} {primary.version}
        </h2>

        {asset ? (
          <>
            <a
              href={asset.path}
              aria-label={`Download ${primary.title} ${primary.version} for ${asset.label}, ${asset.detail}${
                asset.size ? `, ${asset.size}` : ''
              }`}
              className={`${focusRing} mx-auto flex max-w-md items-center justify-center gap-3 rounded-md px-8 py-4 text-xl font-semibold no-underline shadow-md transition duration-150 ease-in-out motion-reduce:transition-none hover:no-underline hover:shadow-lg ${accent.button}`}>
              <Icon icon="material-symbols:download-rounded" className="text-2xl" aria-hidden="true" />
              Download for {platformLabel}
            </a>
            <p className="mt-3 mb-0 text-sm text-gray-700 dark:text-gray-100">
              {asset.detail}
              {asset.size && ` · ${asset.size}`}
            </p>
          </>
        ) : (
          <div className="text-left">
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-100">{command?.label}</p>
            <CodeBlock language="bash">{command?.command}</CodeBlock>
          </div>
        )}

        {primary.checksums && (
          <p className="mt-2 mb-0 text-sm">
            <a href={primary.checksums.path} className={`rounded-sm ${accent.text} ${focusRing}`}>
              {primary.checksums.text}
            </a>
          </p>
        )}
      </div>

      {/* Secondary intent: available in one click, deliberately not competing. */}
      {secondary && (
        <p className="mt-4 mb-0 text-gray-700 dark:text-gray-100">
          <a href="#all-downloads" className={`rounded-sm ${accent.text} ${focusRing}`}>
            Just need {secondary.id === 'cli' ? 'the CLI' : 'the desktop app'}?
          </a>
        </p>
      )}
    </div>
  );
};

/* PACKAGE MANAGER COMMANDS */
const DistroCommands = ({ commands, accent }: DistroCommandsProps): JSX.Element => {
  const [activeLabel, setActiveLabel] = useState(commands[0].label);
  const active = commands.find(command => command.label === activeLabel) ?? commands[0];

  if (commands.length === 1) {
    return (
      <div className="mb-4">
        <h3 className="mb-2 text-base font-semibold text-gray-700 dark:text-gray-100">{commands[0].label}</h3>
        <CodeBlock language="bash">{commands[0].command}</CodeBlock>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h3 className="mb-3 text-base font-semibold text-gray-700 dark:text-gray-100">Choose your distribution</h3>
      <div className="mb-3 flex flex-wrap gap-2">
        {commands.map(command => {
          const isActive = command.label === active.label;
          return (
            <button
              key={command.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveLabel(command.label)}
              className={`${focusRing} cursor-pointer rounded-md border-2 px-3 py-1 text-sm font-semibold transition duration-150 ease-in-out motion-reduce:transition-none ${
                isActive
                  ? `border-transparent ${accent.button}`
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500 dark:border-gray-500 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-gray-300'
              }`}>
              {command.label}
            </button>
          );
        })}
      </div>
      <CodeBlock language="bash">{active.command}</CodeBlock>
    </div>
  );
};

/* PRODUCT CARDS */
const ProductCard = ({ product, platform }: ProductCardProps): JSX.Element => {
  const accent = accents[product.id];
  const { assets, commands, note } = product.downloads[platform];
  const isLinux = platform === 'linux';

  return (
    <article className="flex flex-1 flex-col rounded-md border-2 border-gray-100 bg-white p-6 shadow-md transition duration-150 ease-in-out motion-reduce:transition-none hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 lg:p-8">
      <header className={`mb-6 border-b-2 pb-6 ${accent.rule}`}>
        <div className="flex items-center gap-4">
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-md ${accent.iconBox}`}>
            <Icon icon={product.icon} className="text-3xl" aria-hidden="true" />
          </span>
          <div>
            <h2 className={`mb-1 text-2xl ${accent.text}`}>{product.title}</h2>
            <p className="mb-0 font-mono text-sm text-gray-700 dark:text-gray-100">Version {product.version}</p>
          </div>
        </div>
        <p className="mt-4 mb-0 leading-relaxed text-gray-700 dark:text-gray-100">
          {product.tagline}
          {product.terms?.map((entry, index) => (
            <React.Fragment key={entry.term}>
              {index === 0 ? ' ' : ' and '}
              <Term {...entry} accent={accent.text} />
            </React.Fragment>
          ))}
          {product.terms && '.'}
        </p>
      </header>

      {isLinux && commands && commands.length > 0 && <DistroCommands commands={commands} accent={accent} />}

      {assets && assets.length > 0 && (
        <ul className="mb-4 flex list-none flex-col gap-3 p-0">
          {isLinux && (
            <li className="mb-1 text-base font-semibold text-gray-700 dark:text-gray-100">Or download directly</li>
          )}
          {assets.map(asset => (
            <li key={asset.label}>
              <a
                href={asset.path}
                aria-label={`${asset.isDocs ? 'Installation guide' : 'Download'} ${product.title} ${
                  product.version
                } for ${asset.label}, ${asset.detail}${asset.size ? `, ${asset.size}` : ''}`}
                className={`${focusRing} flex items-center gap-3 rounded-md px-5 py-3 no-underline transition duration-150 ease-in-out motion-reduce:transition-none hover:no-underline hover:shadow-md ${
                  asset.recommended
                    ? `font-semibold ${accent.button}`
                    : 'border-2 border-gray-500 bg-white text-gray-700 hover:border-gray-700 dark:border-gray-500 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-gray-300'
                }`}>
                <Icon
                  icon={asset.isDocs ? 'fa6-solid:book' : 'material-symbols:download-rounded'}
                  className="shrink-0 text-xl"
                  aria-hidden="true"
                />
                <span className="flex flex-col">
                  <span>{asset.label}</span>
                  <span className={`text-sm font-normal ${asset.recommended ? 'text-white' : ''}`}>
                    {asset.detail}
                    {asset.size && ` · ${asset.size}`}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {!isLinux && commands && commands.length > 0 && <DistroCommands commands={commands} accent={accent} />}

      {note && <p className="mb-0 text-sm leading-relaxed text-gray-700 dark:text-gray-100">{note}</p>}

      <footer className="mt-auto flex flex-wrap gap-x-6 gap-y-2 border-t-2 border-gray-100 pt-6 dark:border-gray-700">
        <a href={product.releaseNotes.path} className={`rounded-sm text-sm ${accent.text} ${focusRing}`}>
          {product.releaseNotes.text}
        </a>
        {product.checksums && (
          <a href={product.checksums.path} className={`rounded-sm text-sm ${accent.text} ${focusRing}`}>
            {product.checksums.text}
          </a>
        )}
        <a href={product.docsLink.path} className={`rounded-sm text-sm ${accent.text} ${focusRing}`}>
          {product.docsLink.text}
        </a>
      </footer>
    </article>
  );
};

const ProductGrid = ({ platform }: { platform: PlatformId }): JSX.Element => (
  <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
    {products.map(product => (
      <ProductCard key={product.id} product={product} platform={platform} />
    ))}
  </div>
);

/* SECTION CONTENT */
function DownloadsSection(): JSX.Element {
  const { detected, selected, select } = useOperatingSystem();

  return (
    <section className="container my-12 lg:my-16">
      {detected && (
        <div className="mb-12">
          <FastPath platform={detected} />
        </div>
      )}

      <div id="all-downloads" className="mb-6 scroll-mt-24 text-center">
        {detected && <hr className="mx-auto mb-8 max-w-3xl border-t-2 border-gray-100 dark:border-gray-700" />}
        <h2 className="mb-2 text-2xl text-gray-900 dark:text-gray-100">
          {detected ? 'Looking for a specific version or platform?' : 'Choose your platform'}
        </h2>
        <p className="mx-auto max-w-2xl text-gray-700 dark:text-gray-100">
          Every download for every platform — other architectures, the other product, and package manager instructions.
        </p>
      </div>

      <PlatformTabs selected={selected} onSelect={select} />

      <div className="mt-8">
        {selected ? (
          <div role="tabpanel" id={`platform-panel-${selected}`} aria-labelledby={`platform-tab-${selected}`}>
            <ProductGrid platform={selected} />
          </div>
        ) : (
          /* No detection yet, or it failed: show every platform rather than guess. */
          <div className="flex flex-col gap-12">
            {platforms.map(platform => (
              <div
                key={platform.id}
                role="tabpanel"
                id={`platform-panel-${platform.id}`}
                aria-labelledby={`platform-tab-${platform.id}`}>
                <h2 className="mb-4 flex items-center gap-3 text-2xl text-gray-900 dark:text-gray-100">
                  <Icon icon={platform.icon} className="text-3xl" aria-hidden="true" />
                  {platform.label}
                </h2>
                <ProductGrid platform={platform.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default DownloadsSection;
