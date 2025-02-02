'use client';

import { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import { getRoom, updateRoom } from "@/roomActions";

export function Video ({ id, url, cursor }) {
  const playedSeconds = useRef(cursor);

  async function refreshRoom(){
    const room = await getRoom(id);
    playedSeconds.current = room.cursor;
  }

  useEffect(() => {
    refreshRoom();
  }, []);

  function saveRoom() {
    updateRoom({ id, cursor: playedSeconds.current });
  }

  return <ReactPlayer url={url} width={"100%"} height={"100%"} onProgress={x => {
    playedSeconds.current = parseInt(x.playedSeconds);
    saveRoom();
  }} controls  config={{
    youtube: {
      playerVars: {
        start: playedSeconds.current
      }
    }
  }}/>;
}