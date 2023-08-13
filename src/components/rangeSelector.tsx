import { useAppStore } from '@/lib/store';
import styles from './rangeSelector.module.css';

export default function RangeSelector() {
  const [rangeStart, setRangeStart] = useAppStore((state) => [
    state.rangeStart,
    state.setRangeStart,
  ]);
  const [rangeEnd, setRangeEnd] = useAppStore((state) => [
    state.rangeEnd,
    state.setRangeEnd,
  ]);
  const [modRangeStart, modRangeEnd] = useAppStore((st) => [
    st.modRangeStart,
    st.modRangeEnd,
  ]);
  const rangeMax = useAppStore((state) => state.gpxData?.points.length) || 1;
  const gpxData = useAppStore((state) => state.gpxData);

  let kmStart = '???';
  let kmEnd = '???';
  if (gpxData) {
    const st = gpxData.points[rangeStart].dist;
    const en = gpxData.points[rangeEnd].dist;
    kmStart = `${(st / 1000).toFixed(2)}km`;
    kmEnd = `${(en / 1000).toFixed(2)}km`;
  }

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
        開始:
        <button className={styles.modButton} onClick={() => modRangeStart(-5)}>
          -5
        </button>
        <button className={styles.modButton} onClick={() => modRangeStart(-1)}>
          -1
        </button>
        <button className={styles.modButton} onClick={() => modRangeStart(1)}>
          +1
        </button>
        <button className={styles.modButton} onClick={() => modRangeStart(5)}>
          +5
        </button>
        &nbsp;
        {kmStart}
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
        終了:
        <button className={styles.modButton} onClick={() => modRangeEnd(-5)}>
          -5
        </button>
        <button className={styles.modButton} onClick={() => modRangeEnd(-1)}>
          -1
        </button>
        <button className={styles.modButton} onClick={() => modRangeEnd(1)}>
          +1
        </button>
        <button className={styles.modButton} onClick={() => modRangeEnd(5)}>
          +5
        </button>
        &nbsp;
        {kmEnd}
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
