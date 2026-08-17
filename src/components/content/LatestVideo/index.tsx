import React, { useState } from 'react';
import { Icon } from '@iconify/react';
/* HOOKS */
import type { Video } from '@site/src/hooks/useLatestVideos';
/* PAGE DATA */
import { CHANNEL_URL } from '@site/static/data/youtube';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900';

/* Fixed locale and time zone so the server and browser render the same string.
   Letting either default produces a hydration mismatch. */
export const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

/* Shown when the build could not fetch anything. Never a blank space. */
export const VideoFallbackCard = (): JSX.Element => (
  <div className="mx-auto max-w-3xl rounded-md bg-white p-8 text-center shadow-md dark:bg-gray-700">
    <Icon
      icon="fa6-brands:youtube"
      className="mx-auto mb-4 block text-5xl text-purple-700 dark:text-purple-300"
      aria-hidden="true"
    />
    <h3 className="mb-2 text-xl text-purple-700 dark:text-purple-300">Watch our latest videos on YouTube</h3>
    <p className="mb-4 text-gray-700 dark:text-gray-100">
      Community meetings, demos, and release walkthroughs from the Podman team.
    </p>
    <a
      href={CHANNEL_URL}
      className={`${focusRing} inline-flex items-center gap-2 rounded-md bg-purple-700 px-6 py-3 font-semibold text-white no-underline shadow-md transition duration-150 ease-in-out motion-reduce:transition-none hover:bg-purple-900 hover:text-white hover:no-underline hover:shadow-lg dark:bg-purple-700 dark:hover:bg-purple-900`}>
      Visit the Podman channel
      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl" aria-hidden="true" />
    </a>
  </div>
);

/**
 * The featured video card. Kept as its own component so the homepage can embed
 * it later without pulling in the rest of the YouTube page.
 *
 * The YouTube iframe is only mounted after an explicit click, so visitors who
 * never watch do not pay for the player.
 */
function LatestVideo({ video }: { video?: Video }): JSX.Element {
  const [playing, setPlaying] = useState(false);

  if (!video) {
    return <VideoFallbackCard />;
  }

  const publishedLabel = formatDate(video.publishedAt);

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-md bg-white shadow-md transition duration-150 ease-in-out motion-reduce:transition-none hover:shadow-lg dark:bg-gray-700">
      {/* Fixed 16:9 box with object-cover, so a thumbnail of any ratio fills it
          predictably instead of cropping at whatever size it happens to be. */}
      <div className="relative aspect-video w-full bg-gray-900">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play latest video: ${video.title}`}
            className={`${focusRing} group absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent p-0`}>
            <img src={video.thumbnail} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition duration-150 ease-in-out motion-reduce:transition-none group-hover:bg-black/50">
              <Icon
                icon="material-symbols:play-circle-rounded"
                className="text-6xl text-white drop-shadow-lg"
                aria-hidden="true"
              />
            </span>
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Real text, not only an image alt, so the title is readable content. */}
        <h3 className="mb-1 text-lg font-semibold leading-snug text-gray-900 dark:text-gray-50">{video.title}</h3>
        {publishedLabel && (
          <p className="mb-3 text-sm text-gray-700 dark:text-gray-100">
            <time dateTime={video.publishedAt}>{publishedLabel}</time>
          </p>
        )}
        <a href={video.url} className={`rounded-sm text-sm text-purple-700 dark:text-purple-300 ${focusRing}`}>
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}

export default LatestVideo;
