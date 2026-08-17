import React from 'react';
import Layout from '@theme/Layout';
/* COMPONENTS */
import WaveBorder from '@site/src/components/shapes/WaveBorder';
import DownloadsSection from '@site/src/components/content/DownloadsSection';
/* PAGE DATA */
import { header } from '@site/static/data/downloads';

/* PAGE COMPONENTS */
const DownloadsHeader = () => {
  return (
    /* Gradient darkened from blue-500: white text on that stop measured 1.89:1,
       well under the 4.5:1 AA needs. blue-900 gives 7.4:1. */
    <header className="overflow-hidden bg-gradient-to-r from-blue-900 to-purple-900">
      {/* pb-14 keeps 56px between the last line of text and the wave at every
          breakpoint, inside the 48-64px the design calls for. */}
      <div className="container pb-14 pt-12 text-center">
        <h1 className="mb-4 text-white">{header.title}</h1>
        <p className="mx-auto max-w-2xl leading-relaxed text-white">{header.subtitle}</p>
      </div>
      {/* The wave band occupies only the top 25% of the default 130-unit
          viewBox; the rest is background-coloured fill that added height for
          nothing, so it is cropped to 45. Widening to 140% and shifting left
          33.95% of the container puts the deepest crest at two thirds across
          instead of under the centred heading. */}
      <WaveBorder width="140" height="45" layout="-translate-x-[24.25%]" />
    </header>
  );
};

/* PAGE CONTENT */
function Downloads() {
  return (
    <Layout
      title={header.title}
      description="Download the Podman CLI and Podman Desktop for Windows, macOS, and Linux.">
      <DownloadsHeader />
      <DownloadsSection />
    </Layout>
  );
}

export default Downloads;
