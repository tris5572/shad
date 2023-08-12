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

  const route = useAppStore((st) => st.gpxData);
  const [rangeStart, rangeEnd] = useAppStore((st) => [
    st.rangeStart,
    st.rangeEnd,
  ]);

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
  }, [sizeHandler]);

  // Y軸(標高)の描画範囲を設定。
  // TODO: 最小値と最大値を踏まえて、妥当な値にする。
  const minEle = (route && route.minElevation - 100) || 0;
  const maxEle = (route && route.maxElevation + 100) || 1000;

  return (
    <div className={styles.main} ref={elm}>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
      >
        {route &&
          drawSelectedArea(
            route,
            10,
            10,
            width - 20,
            height - 20,
            minEle,
            maxEle,
            rangeStart,
            rangeEnd
          )}
        {route &&
          drawLine(route, 10, 10, width - 20, height - 20, minEle, maxEle)}
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
 * @param minEle Y軸(標高)の値の最小値
 * @param maxEle Y軸(標高)の値の最大値
 * @returns SVG要素の中身
 */
function drawLine(
  data: RouteData,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  minEle: number,
  maxEle: number
) {
  const result: JSX.Element[] = [];
  const points: [number, number][] = [];

  // 標高の線を描画
  for (const d of data.points) {
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

/**
 * 選択範囲のエリアを描画する。
 * @param data 描画対象のデータ
 * @param startX 開始X座標(左上)
 * @param startY 開始Y座標(左上)
 * @param endX 終了X座標(右下)
 * @param endY 終了Y座標(右下)
 * @param minEle Y軸(標高)の値の最小値
 * @param maxEle Y軸(標高)の値の最大値
 * @param rangeStart 描画範囲の開始インデックス
 * @param rangeEnd 描画範囲の終了インデックス
 * @returns SVG要素の中身
 */
function drawSelectedArea(
  data: RouteData,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  minEle: number,
  maxEle: number,
  rangeStart: number,
  rangeEnd: number
) {
  const result: JSX.Element[] = [];
  const points: [number, number][] = [];

  // 選択エリアの標高を描画。範囲の追加では、一応閉じておく。
  for (let i = 0; i < data.points.length; i++) {
    if (rangeStart <= i && i <= rangeEnd) {
      const d = data.points[i];
      const x = startX + (endX - startX) * (d.dist / data.totalDistance);
      const y = endY - (endY - startY) * ((d.ele - minEle) / (maxEle - minEle));
      points.push([x, y]);
    }
  }
  points.push([points[points.length - 1][0], endY]);
  points.push([points[0][0], endY]);
  points.push([points[0][0], points[0][1]]);

  const pointsString = points.map((v) => `${v[0]},${v[1]}`).join(' ');
  const line = (
    <polyline key="line" stroke="none" fill="#F88A" points={pointsString} />
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
