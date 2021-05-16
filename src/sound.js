import ReactPlayer from 'react-player';
import MediaControls from './media-controls';
import React, { useEffect, useRef, useState } from 'react';

const playStates = {
  INITIALIZING: 'initializing',
  BUFFERING: 'buffering',
  STOPPED: 'stopped',
  PLAYING: 'playing',
  PAUSING: 'pausing'
};

export default function Sound({ doc, sound }) {
  const playerRef = useRef();
  const [soundUrl, setSoundUrl] = useState(null);
  const [playState, setPlayState] = useState(playStates.INITIALIZING);
  const [durationInSeconds, setDurationInSeconds] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(doc.files[sound.fileName]);
    setSoundUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [doc.files, sound.fileName]);

  const handleReady = () => {
    setPlayState(playStates.STOPPED);
  };

  const handleBuffer = () => {
    setPlayState(playStates.BUFFERING);
  };

  const handlePlay = () => {
    setPlayState(playStates.PLAYING);
  };

  const handlePause = () => {
    setPlayState(playStates.PAUSING);
  };

  const handleStop = () => {
    setPlayState(playStates.STOPPED);
  };

  const handleMediaControlSeek = percentage => {
    playerRef.current.seekTo(percentage);
    setPlayState(playStates.PLAYING);
  };

  const handleMediaControlTogglePlay = () => {
    setPlayState(prevState => {
      switch (prevState) {
        case playStates.INITIALIZING:
          return playStates.STOPPED;
        case playStates.BUFFERING:
          return playStates.BUFFERING;
        case playStates.PLAYING:
          return playStates.PAUSING;
        case playStates.PAUSING:
        case playStates.STOPPED:
          return playStates.PLAYING;
        default:
          throw new Error(`Invalid play state: ${prevState}`);
      }
    });
  };

  const handleProgress = ({ playedSeconds }) => {
    setPlayedSeconds(playedSeconds);
  };

  const handleDuration = durationInSeconds => {
    setDurationInSeconds(durationInSeconds);
  };

  const handleVolumeChange = volume => {
    setVolume(volume);
  };

  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        url={soundUrl}
        width="100%"
        height="0%"
        volume={volume}
        progressInterval={100}
        playing={playState === playStates.PLAYING || playState === playStates.BUFFERING}
        onReady={handleReady}
        onBuffer={handleBuffer}
        onStart={handlePlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleStop}
        onDuration={handleDuration}
        onProgress={handleProgress}
        />
      <MediaControls
        isPlaying={playState === playStates.PLAYING}
        durationInSeconds={durationInSeconds}
        playedSeconds={playedSeconds}
        volume={volume}
        onSeek={handleMediaControlSeek}
        onTogglePlay={handleMediaControlTogglePlay}
        onVolumeChange={handleVolumeChange}
        />
    </div>
  );
}
