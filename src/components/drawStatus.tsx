import { DistanceUnit } from '@/lib/constants';
import styles from './drawStatus.module.css';
import { useAppStore, useDrawState } from '@/lib/store';
import { useState } from 'react';

const MARGIN_LEFT = 100;
const MARGIN_RIGHT = 100;
const MARGIN_TOP = 100;
const MARGIN_BOTTOM = 100;

export default function DrawStatus() {
  const draw = useDrawState();
  const [slopeFontSize, setSlopeFontSize] = useState(String(draw.slopeFontSize));
  const [distanceFontSize, setDistanceFontSize] = useState(String(draw.distanceFontSize));

  function unitChanged(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    draw.changeUnit(v);
  }

  function slopeFontSizeChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setSlopeFontSize(v);
    const n = Number(v);
    if (n !== 0) {
      draw.setSlopeFontSize(n);
    }
  }

  function distanceFontSizeChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setDistanceFontSize(v);
    const n = Number(v);
    if (n !== 0) {
      draw.setDistanceFontSize(n);
    }
  }

  return (
    <div className={styles.box}>
      {/* <div>
        <label className={styles.label} htmlFor="distance-unit">
          距離単位
        </label>
        <select name="unit" id="distance-unit" onChange={unitChanged} defaultValue={draw.unit}>
          <option value="1000">1km</option>
          <option value="500">500m</option>
          <option value="200">200m</option>
          <option value="100">100m</option>
        </select>
      </div>
      <label className={styles.label} htmlFor="start">
        最後から、最初から
      </label> */}
      <h2 className={styles.title}>プロフィール</h2>
      <h3 className={styles.category}>斜度</h3>
      <div className={styles.inner}>
        <label className={styles.label}>サイズ</label>
        <input
          type="number"
          id="slope-font-size"
          value={slopeFontSize}
          min="6"
          max="36"
          size={5}
          onChange={slopeFontSizeChanged}
        />
      </div>
      <div className={styles.inner}>
        <label className={styles.label}>色</label>
        <input
          type="color"
          value={draw.slopeColor}
          onChange={(e) => draw.setSlopeColor(e.currentTarget.value)}
        />
      </div>
      <h3 className={styles.category}>距離</h3>
      <div className={styles.inner}>
        <label className={styles.label}>サイズ</label>
        <input
          type="number"
          id="distance-font-size"
          value={distanceFontSize}
          min="6"
          max="36"
          size={5}
          onChange={distanceFontSizeChanged}
        />
      </div>
      <div className={styles.inner}>
        <label className={styles.label}>端数省略</label>
        <input
          type="checkbox"
          id="fraction-omit"
          checked={draw.fractionOmitFlag}
          onChange={(e) => draw.setFractionOmitFlag(!draw.fractionOmitFlag)}
        />
      </div>
    </div>
  );
}
