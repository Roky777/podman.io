import React, { useState } from 'react';
import CopyButton from '@theme-original/CodeBlock/CopyButton';

/**
 * Wraps the theme's copy button with a live region.
 *
 * The stock button only swaps its icon on success, which tells a screen reader
 * user nothing. The wrapper span uses `display: contents` so it adds no box of
 * its own and the button group's layout is untouched.
 */
export default function CopyButtonWrapper(props: React.ComponentProps<typeof CopyButton>): JSX.Element {
  const [announcement, setAnnouncement] = useState('');

  const announce = () => {
    setAnnouncement('Copied to clipboard');
    window.setTimeout(() => setAnnouncement(''), 2000);
  };

  return (
    <>
      <span style={{ display: 'contents' }} onClick={announce}>
        <CopyButton {...props} />
      </span>
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </>
  );
}
