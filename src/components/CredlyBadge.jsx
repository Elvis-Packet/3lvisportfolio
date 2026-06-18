// src/components/CredlyBadge.jsx
import React, { useEffect, useRef } from 'react';

const CredlyBadge = ({ badgeId, width = 150, height = 270 }) => {
  const badgeContainerRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Load Credly embed script
    const loadCredlyScript = () => {
      if (scriptLoadedRef.current) {
        // Script already loaded, just refresh badges
        if (window.CredlyBadge) {
          window.CredlyBadge.refresh();
        }
        return;
      }

      const script = document.createElement('script');
      script.src = '//cdn.credly.com/assets/utilities/embed.js';
      script.async = true;
      script.type = 'text/javascript';

      script.onload = () => {
        scriptLoadedRef.current = true;
      };

      document.body.appendChild(script);
    };

    loadCredlyScript();

    // Cleanup function
    return () => {
      // We don't remove the script on unmount as it might be used by other badges
    };
  }, [badgeId]);

  return (
    <div
      ref={badgeContainerRef}
      data-iframe-width={width}
      data-iframe-height={height}
      data-share-badge-id={badgeId}
      data-share-badge-host="https://www.credly.com"
      className="credly-badge-container flex items-center justify-center"
    />
  );
};

export default CredlyBadge;
