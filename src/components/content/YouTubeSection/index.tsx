import React from 'react';
import { Icon } from '@iconify/react';
/* HOOKS */
import useLatestVideos from '@site/src/hooks/useLatestVideos';
import type { Video } from '@site/src/hooks/useLatestVideos';
/* COMPONENTS */
import LatestVideo, { VideoFallbackCard, formatDate } from '@site/src/components/content/LatestVideo';
/* PAGE DATA */
import { chips, browseAll, sections } from '@site/static/data/youtube';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900';

/* CONTEXT LINE
   One line of text with icon accents rather than three pills. The page already
   carries five card surfaces; three more above the fold competed with the
   featured thumbnail instead of letting it lead. */
const ContextLine = (): JSX.Element => (
  <ul className="mx-auto mb-8 flex max-w-3xl list-none flex-wrap items-center justify-center gap-x-3 gap-y-2 p-0 text-sm text-gray-700 dark:text-gray-100">
    {chips.map((chip, index) => (
      <li key={chip.text} className="flex items-center gap-2">
        {index > 0 && (
          <span className="mr-1 text-gray-500 dark:text-gray-500" aria-hidden="true">
            ·
          </span>
        )}
        <Icon icon={chip.icon} className="shrink-0 text-base text-purple-700 dark:text-purple-300" aria-hidden="true" />
        {chip.text}
      </li>
    ))}
  </ul>
);

/* GRID CARD
   The small end of the same card system as the featured card: same radius,
   same surface, same title and date treatment one step down in scale. */
const VideoCard = ({ video }: { video: Video }): JSX.Element => {
  const publishedLabel = formatDate(video.publishedAt);

  return (
    <article className="flex flex-1 flex-col overflow-hidden rounded-md bg-white shadow-md transition duration-150 ease-in-out motion-reduce:transform-none motion-reduce:transition-none hover:-translate-y-1 hover:shadow-lg dark:bg-gray-700">
      <a href={video.url} className={`${focusRing} block rounded-md no-underline hover:no-underline`}>
        <div className="relative aspect-video w-full bg-gray-900">
          <img src={video.thumbnail} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="p-4">
          <h3 className="mb-1 text-base font-semibold leading-snug text-gray-900 dark:text-gray-50">{video.title}</h3>
          {publishedLabel && (
            <p className="mb-0 text-xs text-gray-700 dark:text-gray-100">
              <time dateTime={video.publishedAt}>{publishedLabel}</time>
            </p>
          )}
        </div>
      </a>
    </article>
  );
};

/* BROWSE ALL CALL TO ACTION */
const BrowseAllCard = (): JSX.Element => (
  <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 rounded-md bg-white p-6 text-center shadow-md dark:bg-gray-700 sm:flex-row sm:text-left">
    <Icon
      icon="fa6-brands:youtube"
      className="shrink-0 text-4xl text-purple-700 dark:text-purple-300"
      aria-hidden="true"
    />
    <div className="flex-1">
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-50">{browseAll.title}</h3>
      <p className="mb-0 text-sm text-gray-700 dark:text-gray-100">{browseAll.description}</p>
    </div>
    <a
      href={browseAll.button.path}
      className={`${focusRing} flex shrink-0 items-center gap-2 rounded-md bg-purple-700 px-6 py-3 font-semibold text-white no-underline shadow-md transition duration-150 ease-in-out motion-reduce:transition-none hover:bg-purple-900 hover:text-white hover:no-underline hover:shadow-lg dark:bg-purple-700 dark:hover:bg-purple-900`}>
      {browseAll.button.text}
      <Icon icon="material-symbols:arrow-outward-rounded" className="text-xl" aria-hidden="true" />
    </a>
  </div>
);

/* SECTION CONTENT */
function YouTubeSection(): JSX.Element {
  const [featured, ...rest] = useLatestVideos();

  return (
    /* The section sits a shade off the page white so the cards read as raised
       surfaces rather than outlined boxes on a flat plane. */
    <section className="bg-gray-50 pb-12 pt-8 dark:bg-gray-900 lg:pb-16 lg:pt-10">
      <div className="container">
        <ContextLine />

        <h2 className="mb-4 text-center text-2xl text-gray-900 dark:text-gray-100">{sections.featured}</h2>
        {featured ? <LatestVideo video={featured} /> : <VideoFallbackCard />}

        {rest.length > 0 && (
          <>
            <h2 className="mb-4 mt-12 text-center text-2xl text-gray-900 dark:text-gray-100">{sections.more}</h2>
            <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row">
              {rest.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </>
        )}

        {/* Close to the grid above, so it reads as the end of the same run
            rather than a card floating on its own. */}
        <div className="mt-8">
          <BrowseAllCard />
        </div>
      </div>
    </section>
  );
}

export default YouTubeSection;
