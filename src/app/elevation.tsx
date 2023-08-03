import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './elevation.module.css';
import { RouteData } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { gpxToData } from '@/lib/gpx';

/**
 * 標高を表すグラフ。
 */
export default function Elevation() {
  const elm = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const route = useAppStore((state) => state.gpxData);

  const sizeHandler = useCallback(() => {
    if (elm.current == null) {
      return;
    }
    // 幅いっぱいにするとよく分からない挙動になるので、少し小さくする。CSSムズカシイ。
    setWidth(elm.current.scrollWidth - 10);
    setHeight(elm.current.scrollHeight - 10);
  }, []);

  // 最初の呼び出し時にサイズの設定を反映するとともに、サイズが変わったときのハンドラを設定。
  useEffect(() => {
    sizeHandler();
    window.addEventListener('resize', sizeHandler);
    return () => window.removeEventListener('resize', sizeHandler);
  });

  return (
    <div className={styles.main} ref={elm}>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
      >
        {route && drawLine(route, 10, 10, width - 20, height - 20)}
      </svg>
    </div>
  );
}

/**
 * 標高の線を描画する。SVGの中身が返される。
 * @param data 描画対象のデータ
 * @param startX 開始X座標(左上)
 * @param startY 開始Y座標(左上)
 * @param endX 終了X座標(右下)
 * @param endY 終了Y座標(右下)
 * @returns SVG要素
 */
function drawLine(
  data: RouteData,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const result = [];
  const points = [];

  // 描画する標高の値を設定（とりあえず適当）
  const maxEle = data.maxElevation + 100;
  const minEle = data.minElevation - 100;

  // 標高の線を描画
  for (const d of data.data) {
    const x = startX + (endX - startX) * (d.dist / data.totalDistance);
    const y = endY - (endY - startY) * ((d.ele - minEle) / (maxEle - minEle));
    points.push([x, y]);
  }

  const pointsString = points.map((v) => `${v[0]},${v[1]}`).join(' ');
  const line = (
    <polyline key="line" stroke="red" fill="none" points={pointsString} />
  );
  result.push(line);

  // 0の線を描画
  result.push(
    <rect
      key="horizontal-bottom"
      x={startX}
      y={endY - 1}
      width={endX - startX}
      height={2}
      fill="orange"
    ></rect>
  );
  result.push(
    <rect
      key="vertical-left"
      x={startX - 1}
      y={startY}
      width={2}
      height={endY - startY}
      fill="orange"
    ></rect>
  );

  return <>{...result}</>;
}
