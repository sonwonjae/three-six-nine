import { useEffect, useState } from "react";
import { Data } from "./api/player";
import axios from "axios";
import Player from "@/components/Player";
import calculateRate from "@/utils/caculateRate";
import LeaderBoard from "@/components/LeaderBoard";

export default function Home() {
  const [state, setState] = useState<{
    data: Data['data'] | null;
    isLoading: boolean;
  }>({
    data: null,
    isLoading: false,
  });
  const [situation, setSituation] = useState<{
    turn: number | null;
    count: number | null;
    result: 'success' | 'fail' | null;
  }>({
    turn: null,
    count: null,
    result: null,
  });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    (async () => {
      setState({
        data: state.data,
        isLoading: true,
      });
      const { data } = await axios.get('/api/player');
      setState({
        data: data.data,
        isLoading: false,
      });
    })()
  }, []);

  if (state.isLoading || !state.data) {
    return (
      <div>
        loading...
      </div>
    )
  }

  const players = state.data

  if (players.length === 0) {
    return (
      <div>이건 말도 안돼 플레이어가 없다니 ㅠ</div>
    )
  }

  const startGame = () => {
    setIsPlaying(true);
    const playerRates = players.map(({success, fail}) => {
      return {
        success,
        fail,
      }
    })
    let count = 0;
    let turn = situation.turn ?? -1;
    // NOTE: set next turn
    if (turn + 1 < players.length) {
      turn = turn + 1;
    } else {
      turn = 0;
    }

    const stopGame = () => {
      setIsPlaying(false);
      setState({
        data: players.map((player, index) => {
          return {
            ...player,
            ...playerRates[index],
          }
        }),
        isLoading: false,
      });
      clearInterval(intervalId);
    }

    const intervalId = setInterval(() => {
      if (count > 1000) {
        stopGame()
        return;
      }

      // NOTE: count up
      count += 1;
      
      // NOTE: play turn
      const player = playerRates[turn];
      const rate = calculateRate(player);
      const pass = Math.random() <= rate;
      const result = pass ? 'success' : 'fail';
      playerRates[turn][result] += 1;
      setSituation({
        turn,
        count,
        result,
      })
      if (!pass) {
        stopGame();
        return;
      }

      // NOTE: set next turn
      if (turn + 1 < players.length) {
        turn = turn + 1;
      } else {
        turn = 0;
      }

    }, 500)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 4rem' }}>
        <ul>
          {players.map(({ id, name, success, fail }) => {
            return (
              <Player
                key={`${id}-${situation.turn === id}`}
                id={id}
                name={name}
                success={success}
                fail={fail}
                count={situation.turn === id ? situation.count: null}
                result={situation.turn === id ? situation.result: null}
              />
            );
          })}
        </ul>
        <ul>
          {
            [...players]
              .sort((a, b) => {
                const aRate = calculateRate({success: a.success, fail: a.fail});
                const bRate = calculateRate({success: b.success, fail: b.fail});
                return bRate - aRate;
              })
              .map(({ id, name, success, fail }, index) => {
                return (
                  <LeaderBoard
                    key={`${id}-${success}-${fail}`}
                    rank={index + 1}
                    name={name}
                    success={success}
                    fail={fail}
                  />
                );
              })
          }
        </ul>
      </div>

      <div
        style={{
          padding: '1rem 4rem',
        }}
      >
        <button
          disabled={isPlaying}
          onClick={startGame}
        >
          Game Start!
        </button>
      </div>
    </div>
  );
}
