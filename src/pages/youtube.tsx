import React from 'react';
import Layout from '@theme/Layout';
/* COMPONENTS */
import WaveBorder from '@site/src/components/shapes/WaveBorder';
import YouTubeSection from '@site/src/components/content/YouTubeSection';
/* PAGE DATA */
import { header } from '@site/static/data/youtube';

/* PAGE COMPONENTS */
const YouTubeHeader = () => {
  return (
    <header className="overflow-hidden bg-gradient-to-r from-blue-900 to-purple-900">
      <div className="container pb-14 pt-12 text-center">
        <h1 className="mb-4 text-white">{header.title}</h1>
        <p className="mx-auto max-w-2xl leading-relaxed text-white">{header.subtitle}</p>
      </div>
      <WaveBorder width="140" height="45" layout="-translate-x-[24.25%]" />
    </header>
  );
};

/* PAGE CONTENT */
function YouTube() {
  return (
    <Layout
      title={header.title}
      description="Community meetings, demos, and release walkthroughs from the Podman team.">
      <YouTubeHeader />
      <YouTubeSection />
    </Layout>
  );
}

export default YouTube;
