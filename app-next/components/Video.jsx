'use client';

import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { getRoom, updateRoom } from "@/roomActions";

export function Video ({ id, url, cursor, state }) {
  const playedSeconds = useRef(cursor);
  const videoState = useRef(state);

  async function refreshRoom(){
    const room = await getRoom(id);
    playedSeconds.current = room.cursor;
    videoState.current = room.state;
  }

  useEffect(() => {
    const intervalId = setInterval(refreshRoom, 3000);
    return () => clearInterval(intervalId);
  }, []);

  function saveRoom() {
    updateRoom({ id, cursor: playedSeconds.current, video_state: videoState.current });
  }

  return <ReactPlayer url={url} width={"100%"} height={"100%"} onProgress={x => {
    playedSeconds.current = parseInt(x.playedSeconds);
    saveRoom();
  }} controls
  playing={videoState.current === 'playing'}
  muted={videoState.current === 'playing'}
  onPlay={() => {
    videoState.current = 'playing';
    saveRoom();
  }}
  onPause={() => {
    videoState.current = 'paused';
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