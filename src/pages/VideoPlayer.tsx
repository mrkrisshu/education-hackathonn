import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import styles from '../styles/VideoPlayer.module.css';

// Define types for our component
interface Comment {
  id: number;
  timestamp: number;
  text: string;
  author: string;
  createdAt: string;
}

interface VideoPlayerProps {
  videoUrl: string;
  initialComments?: Comment[];
}

// Helper function for time formatting
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  initialComments = [] 
}) => {
  const playerRef = useRef<ReactPlayer>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>('');
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isYouTube, setIsYouTube] = useState<boolean>(false);
  
  // Check if the URL is YouTube
  useEffect(() => {
    setIsYouTube(ReactPlayer.canPlay(videoUrl) && videoUrl.includes('youtube'));
  }, [videoUrl]);

  // Handle video metadata loaded and progress
  const handleDuration = (duration: number): void => {
    setDuration(duration);
  };

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }): void => {
    setCurrentTime(state.playedSeconds);
  };

  // Toggle play/pause
  const togglePlay = (): void => {
    setIsPlaying(!isPlaying);
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!playerRef.current) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  // Add a new comment at current timestamp
  const addComment = (): void => {
    if (newComment.trim() === '') return;
    
    const newCommentObj: Comment = {
      id: Date.now(),
      timestamp: currentTime,
      text: newComment,
      author: 'You', // Could be dynamic based on user authentication
      createdAt: new Date().toISOString()
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
    setShowCommentForm(false);
  };

  // Jump to timestamp
  const jumpToTimestamp = (timestamp: number): void => {
    if (!playerRef.current) return;
    
    playerRef.current.seekTo(timestamp);
    setCurrentTime(timestamp);
    if (!isPlaying) togglePlay();
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Handle playback rate change
  const handlePlaybackRateChange = (rate: number): void => {
    setPlaybackRate(rate);
  };

  // Toggle fullscreen
  const toggleFullScreen = (): void => {
    if (!videoContainerRef.current) return;
    
    if (!isFullScreen) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      } else if ((videoContainerRef.current as any).webkitRequestFullscreen) {
        (videoContainerRef.current as any).webkitRequestFullscreen();
      } else if ((videoContainerRef.current as any).msRequestFullscreen) {
        (videoContainerRef.current as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
    
    setIsFullScreen(!isFullScreen);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (
        e.target instanceof HTMLElement && 
        (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')
      ) return;
      
      if (!playerRef.current) return;
      
      switch(e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          playerRef.current.seekTo(currentTime + 10);
          break;
        case 'ArrowLeft':
          playerRef.current.seekTo(currentTime - 10);
          break;
        case 'f':
          toggleFullScreen();
          break;
        case 'm':
          setVolume(volume === 0 ? 1 : 0);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, currentTime, volume]);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = (): void => {
      setIsFullScreen(
        !!document.fullscreenElement || 
        !!(document as any).webkitFullscreenElement || 
        !!(document as any).msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('msfullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('msfullscreenchange', handleFullScreenChange);
    };
  }, []);

  // Sort comments by timestamp
  const sortedComments = [...comments].sort((a, b) => a.timestamp - b.timestamp);

  // Check if there are comments around the current timestamp
  const activeComments = sortedComments.filter(
    comment => Math.abs(comment.timestamp - currentTime) < 5
  );

  return (
    <div className={styles.videoPlayerContainer} ref={videoContainerRef}>
      <div className={styles.videoWrapper}>
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={volume}
          playbackRate={playbackRate}
          onDuration={handleDuration}
          onProgress={handleProgress}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
          config={{
            youtube: {
              playerVars: { 
                origin: window.location.origin,
                modestbranding: 1,
                rel: 0
              }
            },
          }}
          controls={isYouTube} // Use YouTube's native controls for YouTube videos
        />
        
        {activeComments.length > 0 && (
          <div className={styles.activeCommentOverlay}>
            {activeComments.map(comment => (
              <div key={comment.id} className={styles.activeComment}>
                <span className={styles.commentAuthor}>{comment.author}:</span> {comment.text}
              </div>
            ))}
          </div>
        )}
        
        {/* Only show our custom controls for non-YouTube videos or when we want to override YouTube controls */}
        {!isYouTube && (
          <div className={styles.controls}>
            <button className={styles.playButton} onClick={togglePlay}>
              {isPlaying ? '❚❚' : '▶'}
            </button>
            
            <div className={styles.progressBarContainer} onClick={handleProgressClick}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              
              {/* Timestamp markers for comments */}
              {sortedComments.map((comment) => (
                <div
                                   key={comment.id}
                  className={styles.commentMarker}
                  style={{ left: `${(comment.timestamp / duration) * 100}%` }}
                  title={comment.text}
                  onClick={(e) => {
                    e.stopPropagation();
                    jumpToTimestamp(comment.timestamp);
                  }}
                />
              ))}
            </div>
            
            <span className={styles.timeDisplay}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            
            <div className={styles.volumeControl}>
              <button 
                className={styles.muteButton} 
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
              >
                {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
              />
            </div>
            
            <div className={styles.playbackRateControl}>
              <select 
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className={styles.playbackRateSelect}
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
            
            <button 
              className={styles.fullscreenButton} 
              onClick={toggleFullScreen}
            >
              {isFullScreen ? '⤓' : '⤢'}
            </button>
            
            <button 
              className={styles.addCommentButton} 
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              {showCommentForm ? 'Cancel' : 'Add Comment'}
            </button>
          </div>
        )}
      </div>

      {showCommentForm && (
        <div className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment for this timestamp..."
            className={styles.commentInput}
          />
          <div className={styles.commentFormFooter}>
            <span>Adding comment at {formatTime(currentTime)}</span>
            <button onClick={addComment} className={styles.submitCommentButton}>
              Save Comment
            </button>
          </div>
        </div>
      )}

      <div className={styles.commentsSection}>
        <h3>Video Comments</h3>
        {sortedComments.length === 0 ? (
          <p className={styles.noComments}>No comments yet. Add the first one!</p>
        ) : (
          <ul className={styles.commentsList}>
            {sortedComments.map((comment) => (
              <li key={comment.id} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <strong>{comment.author}</strong>
                  <button 
                    className={styles.timestampButton}
                    onClick={() => jumpToTimestamp(comment.timestamp)}
                  >
                    {formatTime(comment.timestamp)}
                  </button>
                </div>
                <p className={styles.commentText}>{comment.text}</p>
                <div className={styles.commentActions}>
                  <button 
                    className={styles.deleteCommentButton}
                    onClick={() => setComments(comments.filter(c => c.id !== comment.id))}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className={styles.keyboardShortcutsInfo}>
        <h4>Keyboard Shortcuts</h4>
        <ul>
          <li>Space/K: Play/Pause</li>
          <li>→: Forward 10s</li>
          <li>←: Rewind 10s</li>
          <li>F: Fullscreen</li>
          <li>M: Mute/Unmute</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayer;