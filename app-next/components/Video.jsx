"use client";

import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { getRoom, updateRoom } from "@/actions/roomActions";

export function Video({ id, url, cursor, state }) {
  const videoRef = useRef(null);
  const playedSeconds = useRef(cursor);
  const [videoState, setVideoState] = useState(state);

  async function refreshRoom() {
    const room = await getRoom(id);

    if (Math.abs(playedSeconds.current - room.cursor) > 15)
      videoRef.seekTo(room.cursor, "seconds");
    else playedSeconds.current = room.cursor;
    setVideoState(room.video_state);
  }

  useEffect(() => {
    const intervalId = setInterval(refreshRoom, 3_000);
    return () => clearInterval(intervalId);
  }, []);

  function saveRoom(props) {
    updateRoom({ id, cursor: playedSeconds.current, ...props });
  }

  return (
    <ReactPlayer
      url={url}
      width={"100%"}
      height={"100%"}
      progressInterval={10_000}
      onProgress={(x) => {
        playedSeconds.current = parseInt(x.playedSeconds);
        saveRoom();
      }}
      controls
      playing={videoState === "playing"}
      muted={videoState === "playing"}
      onSeek={(seconds) => {
        playedSeconds.current = parseInt(seconds);
        saveRoom();
      }}
      onPlay={() => {
        setVideoState("playing");
        saveRoom({ video_state: "playing" });
      }}
      onPause={() => {
        setVideoState("paused");
        saveRoom({ video_state: "paused" });
      }}
      ref={videoRef}
      config={{
        youtube: {
          playerVars: {
            start: playedSeconds.current,
          },
        },
      }}
    />
  );
}
