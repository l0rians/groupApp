'use client';

import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { getRoom, updateRoom } from "@/roomActions";

export function Video ({ id, url, cursor, state }) {
  const playedSeconds = useRef(cursor);
  const [videoState, setVideoState] = useState(state);

  async function refreshRoom(){
    const room = await getRoom(id);
    playedSeconds.current = room.cursor;
  }

  useEffect(() => {
    refreshRoom();
  }, []);

  function saveRoom() {
    updateRoom({ id, cursor: playedSeconds.current, video_state: videoState });
  }

  return <ReactPlayer url={url} width={"100%"} height={"100%"} onProgress={x => {
    playedSeconds.current = parseInt(x.playedSeconds);
    saveRoom();
  }} controls
  playing={videoState === 'playing'}
  muted={videoState === 'playing'}
  onPlay={() => {
    setVideoState('playing');
    saveRoom();
  }}
  onPause={() => {
    setVideoState('paused');
    saveRoom();
  }}
  config={{
    youtube: {
      playerVars: {
        start: playedSeconds.current
      }
    }
  }}/>;
}