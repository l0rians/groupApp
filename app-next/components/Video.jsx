'use client';

import ReactPlayer from 'react-player';

export function Video ({ id, url }) {
  return <ReactPlayer url={url} width={"100%"} height={"100%"}/>;
}