import React from 'react';
import './media-controls.scss';
import PropTypes from 'prop-types';
import { Progress } from 'react-soundplayer/components';

function MediaControls({ durationInSeconds, playedSeconds, isPlaying, onSeek }) {
  const playedPercentage = isPlaying && durationInSeconds ? playedSeconds / durationInSeconds * 100 : 0;
  return (
    <div className="MediaControls">
      <Progress className="MediaControls-progress" value={playedPercentage} onSeekTrack={onSeek} />
    </div>
  );
}

MediaControls.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onSeek: PropTypes.func.isRequired,
  onTogglePlay: PropTypes.func.isRequired,
  playedSeconds: PropTypes.number.isRequired
};

export default MediaControls;
