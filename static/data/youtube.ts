/**
 * YOUTUBE PAGE DATA
 *
 * Copy and links for the /youtube page. The videos themselves are fetched at
 * build time by plugins/youtube-latest and are not listed here.
 */

const CHANNEL_URL = 'https://www.youtube.com/@Podman';

const header = {
  title: 'Podman on YouTube',
  subtitle: "Community meetings, demos, and release walkthroughs — new videos as they're published.",
};

/* Short context chips shown above the featured video. Deliberately static:
   subscriber counts are not in the RSS feed and fetching them would need an
   extra API call that only works when a key is configured. */
const chips = [
  { icon: 'material-symbols:groups-rounded', text: 'Community meetings every month' },
  { icon: 'material-symbols:play-circle-rounded', text: 'Demos and release walkthroughs' },
  { icon: 'fa6-brands:youtube', text: 'Free and open to everyone' },
];

const browseAll = {
  title: 'Browse all videos on the Podman YouTube channel',
  description: 'Meeting recordings going back years, plus talks, demos, and deep dives from the maintainers.',
  button: { text: 'Open the Podman channel', path: CHANNEL_URL },
};

const sections = {
  featured: 'Latest video',
  more: 'More recent videos',
};

export { CHANNEL_URL, header, chips, browseAll, sections };
