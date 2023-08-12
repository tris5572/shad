import { useAppStore } from '@/lib/store';
import styles from './rangeSelector.module.css';

// TODO: 座標のプラスとマイナスを1個ずつ変えるボタンを付ける。

export default function RangeSelector() {
  const [rangeStart, setRangeStart] = useAppStore((state) => [
    state.rangeStart,
    state.setRangeStart,
  ]);
  const [rangeEnd, setRangeEnd] = useAppStore((state) => [
    state.rangeEnd,
    state.setRangeEnd,
  ]);
  const rangeMax = useAppStore((state) => state.gpxData?.data.length) || 1;
  const gpxData = useAppStore((state) => state.gpxData);

  let kmStart = '???';
  let kmEnd = '???';
  if (gpxData) {
    // const st = useAppStore((state)=>state.gpxData?.data[rangeStart])
    const st = gpxData.data[rangeStart].dist;
    const en = gpxData.data[rangeEnd].dist;
    kmStart = `${(st / 1000).toFixed(3)}km`;
    kmEnd = `${(en / 1000).toFixed(3)}km`;
  }

  // const handleChangeStart = useMemo(
  //   () => (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setRangeStart(Number(e.target.value));
  //   },
  //   [setRangeStart]
  // );
  const handleChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (v < rangeEnd) {
      setRangeStart(v);
    }
  };
  const handleChangeEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (rangeStart < v) {
      setRangeEnd(v);
    }
  };

  return (
    <div className={styles.box}>
      <p className={styles.label}>表示範囲指定</p>
      <label htmlFor="startPoint" className={styles.rangeLabel}>
        開始: {kmStart}
      </label>
      <input
        type="range"
        id="startPoint"
        className={styles.slider}
        min="0"
        max={rangeMax}
        value={rangeStart}
        onChange={handleChangeStart}
      />
      <br />
      <label htmlFor="endPoint" className={styles.rangeLabel}>
        終了: {kmEnd}
      </label>
      <input
        type="range"
        id="endPoint"
        className={styles.slider}
        min="0"
        max={rangeMax - 1}
        value={rangeEnd}
        onChange={handleChangeEnd}
      />
    </div>
  );
}
