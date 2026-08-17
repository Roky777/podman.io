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
    <header className="bg-gradient-to-r from-blue-900 to-purple-900">
      <div className="container pt-12 text-center lg:pt-16">
        <h1 className="mb-4 text-white">{header.title}</h1>
        <p className="mx-auto max-w-2xl leading-relaxed text-white">{header.subtitle}</p>
      </div>
      <WaveBorder />
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
