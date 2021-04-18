import ReactPlayer from 'react-player';
import React, { useEffect, useRef, useState } from 'react';

export default function Sound({ doc, sound }) {
  const playerRef = useRef();
  const [soundUrl, setSoundUrl] = useState(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(doc.files[sound.fileName]);
    setSoundUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [doc.files, sound.fileName]);

  return (
    <ReactPlayer
      ref={playerRef}
      url={soundUrl}
      width="100%"
      height="100%"
      controls
      progressInterval={100}
      />
  );
}
