import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
/* HOOKS */
import useOperatingSystem from '@site/src/hooks/useOperatingSystem';
/* PAGE DATA */
import { platforms } from '@site/static/data/downloads';
import type { PlatformId } from '@site/static/data/downloads';

type PlatformTabsProps = {
  selected: PlatformId | null;
  onSelect: (platform: PlatformId) => void;
};

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
            className={`flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-md border-2 px-6 py-3 text-lg font-semibold transition duration-150 ease-in-out ${
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

/* SECTION CONTENT */
function DownloadsSection(): JSX.Element {
  const { selected, select } = useOperatingSystem();

  return (
    <section className="container my-12 lg:my-16">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl text-gray-900 dark:text-gray-100">Choose your platform</h2>
        <p className="mx-auto max-w-2xl text-gray-700 dark:text-gray-100">
          Podman runs on Windows, macOS, and Linux.
        </p>
      </div>

      <PlatformTabs selected={selected} onSelect={select} />

      <div className="mt-8">
        {selected ? (
          <div role="tabpanel" id={`platform-panel-${selected}`} aria-labelledby={`platform-tab-${selected}`} />
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
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default DownloadsSection;
