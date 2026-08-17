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
    <header className="bg-gradient-to-r from-blue-500 to-purple-700 dark:from-blue-700 dark:to-purple-900">
      <div className="container pt-12 text-center lg:pt-16">
        <h1 className="mb-4 text-white dark:text-gray-50">{header.title}</h1>
        <p className="mx-auto max-w-2xl leading-relaxed text-white dark:text-gray-50">{header.subtitle}</p>
      </div>
      <WaveBorder />
    </header>
  );
};

/* PAGE CONTENT */
function Downloads() {
  return (
    <Layout title={header.title} description="Download the Podman CLI and Podman Desktop for Windows, macOS, and Linux.">
      <DownloadsHeader />
      <DownloadsSection />
    </Layout>
  );
}

export default Downloads;
