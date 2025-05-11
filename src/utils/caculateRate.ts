import { Data } from "@/pages/api/player";

type PlayerInfo = Pick<Data['data'][number], 'success' | 'fail'>;

const calculateRate = ({success, fail}: PlayerInfo) => {
  const ds = 1;
  const df = 1;
  const total = ds + success + df + fail;
  const rate = (ds + success) / total;

  return rate;
}

export default calculateRate