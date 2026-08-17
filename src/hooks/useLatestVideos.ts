import { usePluginData } from '@docusaurus/useGlobalData';

export type Video = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
};

type YoutubeLatestData = {
  videos: Video[];
  source: 'api' | 'rss' | 'none';
};

/**
 * Reads the uploads fetched by plugins/youtube-latest while the site was built.
 *
 * This is a lookup into data already embedded in the page, not a request. No
 * API key reaches the browser and nothing is fetched at runtime, so the list
 * changes on rebuild rather than live.
 *
 * Returns an empty array when the build could not reach YouTube; callers are
 * expected to render a fallback rather than assume a video exists.
 */
export function useLatestVideos(): Video[] {
  const data = usePluginData('youtube-latest') as YoutubeLatestData | undefined;
  return data?.videos ?? [];
}

export default useLatestVideos;
