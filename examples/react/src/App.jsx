import React, { useRef } from 'react';
import { CIBeforeAfterViewer } from 'js-cloudimage-before-after/react';

export default function App() {
  const viewerRef = useRef(null);

  return (
    <div>
      <h1>Before / After Viewer</h1>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => viewerRef.current?.setZoom((viewerRef.current?.getZoom() ?? 1) + 0.5)}>
          Zoom In
        </button>
        <button onClick={() => viewerRef.current?.setZoom((viewerRef.current?.getZoom() ?? 1) - 0.5)}>
          Zoom Out
        </button>
        <button onClick={() => viewerRef.current?.resetZoom()}>Reset</button>
      </div>

      <CIBeforeAfterViewer
        ref={viewerRef}
        aspectRatio="4/3"
        beforeSrc="https://scaleflex.cloudimg.io/v7/plugins/js-cloudimage-before-after/landscape-before-vG4KL646.svg?vh=c20954"
        afterSrc="https://scaleflex.cloudimg.io/v7/plugins/js-cloudimage-before-after/landscape-after-DbjDsLf5.svg?vh=6fafa4"
        beforeAlt="Living room before renovation"
        afterAlt="Living room after renovation"
        labels={{ before: 'Before', after: 'After' }}
        zoom
        theme="light"
        handleStyle="arrows"
        animate={{ duration: 800 }}
      />
    </div>
  );
}
