import { Data } from "@/pages/api/player";
import React from "react";

type PlayerInfo = Omit<Data['data'][number], 'location'>;

interface PlayerProps extends PlayerInfo {
  count: number | null;
  result: 'success' | 'fail' | null;
}


function Player({ name, count, result }: PlayerProps) {
  if (result === null) {
    return <li>{name}: {result}</li>
  }
  if (String(count).includes('3') || String(count).includes('6') || String(count).includes('9')) {
    if (result === 'success') {
      return <li>{name}: 👏</li>
    }
    if (result === 'fail') {
      return <li>{name}: {count} 💢</li>
    }
  } else {
    if (result === 'success') {
      return <li>{name}: {count}</li>
    }
    if (result === 'fail') {
      return <li>{name}: 👏 💢</li>
    }

  }
}

export default React.memo(Player);