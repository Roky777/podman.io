/**
 * BUILD TIME YOUTUBE FETCH
 *
 * Fetches the channel's most recent uploads while the site is being built and
 * hands them to the page as static data. Nothing about this runs in the
 * browser, so no API key is ever bundled into client JavaScript.
 *
 * The videos therefore update on each rebuild rather than live. That is the
 * expected behaviour for a static site, not a bug.
 *
 * Two sources, in order:
 *
 *   1. YouTube Data API `playlistItems.list`, used when YOUTUBE_API_KEY is set
 *      as a build environment variable. Costs one quota unit per build
 *      regardless of how many items are requested, because quota is charged
 *      per call. `search.list` would cost a hundred and is the wrong tool for
 *      fetching the latest uploads of a known channel.
 *
 *   2. The channel's public RSS feed, used when no key is present. It needs no
 *      key and consumes no quota, so forks, pull request builds and anyone
 *      cloning the repository still get real data.
 *
 * If both fail the build still succeeds and the page renders its fallback
 * card, because a missing video is not a reason to fail a deploy.
 */

const PODMAN_CHANNEL_ID = 'UCk8PKFfMXESWNXgGG5U_F_w';

/** How many uploads to fetch: one featured, the rest for the grid. */
const DEFAULT_LIMIT = 4;

/**
 * A channel's uploads playlist is its channel ID with the UC prefix swapped
 * for UU. Deriving it costs nothing; looking it up with channels.list would
 * spend an extra quota unit for the same answer.
 */
const uploadsPlaylistId = channelId => `UU${channelId.slice(2)}`;

/** Thumbnails are addressable from the video ID alone, so no API call. */
const thumbnailFor = videoId => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

const videoUrl = videoId => `https://www.youtube.com/watch?v=${videoId}`;

async function fetchFromApi(playlistId, apiKey, limit) {
  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems` +
    `?part=snippet&maxResults=${limit}&playlistId=${playlistId}&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`playlistItems.list returned ${response.status}: ${body.slice(0, 200)}`);
  }

  const { items } = await response.json();
  if (!items?.length) {
    throw new Error('playlistItems.list returned no items');
  }

  return items
    .map(({ snippet }) => {
      const id = snippet?.resourceId?.videoId;
      if (!id) return null;
      return {
        id,
        title: snippet.title,
        publishedAt: snippet.publishedAt,
        // The API gives real thumbnail URLs; prefer them over the derived one.
        thumbnail: snippet.thumbnails?.high?.url ?? thumbnailFor(id),
        url: videoUrl(id),
      };
    })
    .filter(Boolean);
}

async function fetchFromRss(playlistId, limit) {
  const response = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`);
  if (!response.ok) {
    throw new Error(`RSS feed returned ${response.status}`);
  }

  const xml = await response.text();
  // Each chunk after the split starts inside one <entry>, so the first <title>
  // it contains is the video's rather than the channel's.
  const entries = xml.split('<entry>').slice(1, limit + 1);
  if (!entries.length) {
    throw new Error('RSS feed contained no entries');
  }

  const videos = entries
    .map(entry => {
      const read = tag => entry.match(new RegExp(`<${tag}>([^<]+)</${tag}>`))?.[1];
      const id = read('yt:videoId');
      if (!id) return null;
      return {
        id,
        title: read('title'),
        publishedAt: read('published'),
        thumbnail: thumbnailFor(id),
        url: videoUrl(id),
      };
    })
    .filter(Boolean);

  if (!videos.length) {
    throw new Error('RSS entries contained no video IDs');
  }
  return videos;
}

module.exports = function youtubeLatestPlugin(_context, options = {}) {
  const channelId = options.channelId ?? PODMAN_CHANNEL_ID;
  const limit = options.limit ?? DEFAULT_LIMIT;
  const playlistId = uploadsPlaylistId(channelId);

  return {
    name: 'youtube-latest',

    async loadContent() {
      const apiKey = process.env.YOUTUBE_API_KEY;

      try {
        const useApi = Boolean(apiKey);
        const videos = useApi ? await fetchFromApi(playlistId, apiKey, limit) : await fetchFromRss(playlistId, limit);

        const source = useApi ? 'YouTube Data API' : 'RSS feed (no YOUTUBE_API_KEY set)';
        console.log(`[youtube-latest] ${source}: fetched ${videos.length} videos`);
        videos.forEach((video, index) => {
          console.log(
            `[youtube-latest]   ${index + 1}. ${video.publishedAt?.slice(0, 10)}  ${video.id}  ${video.title}`,
          );
        });

        return { videos, source: useApi ? 'api' : 'rss' };
      } catch (error) {
        // Never fail the build over this. The page renders a fallback card.
        console.warn(`[youtube-latest] could not fetch videos, page will fall back: ${error.message}`);
        return { videos: [], source: 'none' };
      }
    },

    async contentLoaded({ content, actions }) {
      // Serialised into the page as plain data. No key, no runtime request.
      actions.setGlobalData(content);
    },
  };
};
