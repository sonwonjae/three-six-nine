import { Data } from "@/pages/api/player";
import calculateRate from "@/utils/caculateRate";
import React from "react";

type LeaderBoardInfo = Pick<Data['data'][number], 'name' | 'success' | 'fail'>;

interface LeaderBoardProps extends LeaderBoardInfo {
  rank: number;
}


function LeaderBoard({ rank, name, success, fail }: LeaderBoardProps) {
  const rate = calculateRate({success, fail});
  return <li>{rank}등: {name}({rate.toFixed(2)})</li>
}

export default React.memo(LeaderBoard);