import { DrawState, useAppStore, useColorState, useDrawState } from '@/lib/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './elevationDiagonal.module.css';
import { RouteData } from '@/lib/types';

export function DrawDiagonalView() {
  const elm = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const { colorFromSlope } = useColorState();
  const drawState = useDrawState();

  const route = useAppStore((st) => st.routeDataInRange());

  const sizeHandler = useCallback(() => {
    if (elm.current == null) {
      return;
    }
    // なぜかスクロールバーが出るので、高さを少し小さくする。
    setWidth(elm.current.scrollWidth);
    setHeight(elm.current.scrollHeight - 8);
  }, []);

  // 最初の呼び出し時にサイズの設定を反映するとともに、サイズが変わったときのハンドラを設定。
  useEffect(() => {
    sizeHandler();
    window.addEventListener('resize', sizeHandler);
    return () => window.removeEventListener('resize', sizeHandler);
  }, [sizeHandler]);

  return (
    <div className={styles.box} ref={elm}>
      {route &&
        createProfile(
          route,
          width,
          height,
          100,
          150,
          route.minElevation - 100,
          route.maxElevation + 100,
          1000,
          colorFromSlope,
          drawState
        )}
    </div>
  );
}

// コンポーネントの幅と高さ
// 図の部分のマージン
// 図の部分の下の標高と上の標高
function createProfile(
  route: RouteData,
  componentWidth: number,
  componentHeight: number,
  marginX: number,
  marginY: number,
  bottomEle: number,
  topEle: number,
  distanceUnit: number,
  colorFromSlope: (slope: number) => string,
  drawState: DrawState
) {
  const svg = [];
  const startX = marginX; // 描画範囲の左上
  const startY = marginY * 1.5; // 描画範囲の右下
  // const startY = componentHeight - marginY;
  const endX = componentWidth - marginX; // 描画範囲の左上
  const endY = componentHeight - marginY / 2; // 描画範囲の右下

  const targetData: { distance: number; ele: number }[] = [];
  let nextDistance = distanceUnit;
  let totalDistance = 0;

  function yWithDiagonal(x: number, y: number): number {
    return y - (x - startX) * drawState.diagonalRate;
  }

  // ルートデータから、区切りの距離ごとに標高を取得する。
  for (let i = 0; i < route.points.length; i++) {
    const point = route.points[i];

    // 1個目は必ず追加する。
    if (i === 0) {
      targetData.push({ distance: 0, ele: point.ele });
      continue;
    }

    // 最後は必ず追加する。
    if (i === route.points.length - 1) {
      targetData.push({ distance: totalDistance, ele: point.ele });
      break;
    }

    totalDistance += point.distDiff;

    // 表示範囲の累積距離が次の区切りを超えたとき、追加する。
    if (nextDistance <= totalDistance) {
      // 直前の座標と比較し、区切りに近い方を追加する。（Issue #9 の対応）
      const diffPrev = Math.abs(totalDistance - point.distDiff - nextDistance);
      const diffNow = Math.abs(totalDistance - nextDistance);
      if (diffNow <= diffPrev) {
        targetData.push({ distance: totalDistance, ele: point.ele });
      } else {
        targetData.push({ distance: totalDistance - point.distDiff, ele: route.points[i - 1].ele });
      }

      nextDistance += distanceUnit;
    }
  }

  // 開始からの累積距離を元にX座標を計算する。
  const xFromDistance = (distance: number): number => {
    const x = ((componentWidth - 2 * marginX) * distance) / totalDistance + marginX;
    return x;
  };

  const yFromElevation = (elevation: number): number => {
    const y = endY - (endY - startY) * ((elevation - bottomEle) / (topEle - bottomEle));
    return y;
  };

  // 描画用のデータを生成する。
  const drawData: { x: number; y: number; slope: number; distance: number }[] = [];

  for (let i = 0; i < targetData.length; i++) {
    const d = targetData[i];

    if (i === 0) {
      drawData.push({ x: xFromDistance(0), y: yFromElevation(d.ele), slope: 0, distance: 0 });
      continue;
    }

    const sl = ((d.ele - targetData[i - 1].ele) / (d.distance - targetData[i - 1].distance)) * 100;
    drawData.push({
      x: xFromDistance(d.distance),
      y: yFromElevation(d.ele),
      slope: sl,
      distance: d.distance,
    });
  }

  // 標高の線と奥の線
  for (let i = 0; i < drawData.length - 1; i++) {
    const d1 = drawData[i];
    const d2 = drawData[i + 1];
    const xx = drawState.diagonalRoadX;
    const yy = drawState.diagonalRoadY;
    // 道路の塗り潰し
    svg.push(
      <polygon
        key={`fill-road-${i}`}
        points={`${d1.x},${yWithDiagonal(d1.x, d1.y)} ${d2.x},${yWithDiagonal(d2.x, d2.y)} ${
          d2.x - xx
        },${yWithDiagonal(d2.x, d2.y) - yy} ${d1.x - xx},${yWithDiagonal(d1.x, d1.y) - yy}`}
        fill={colorFromSlope(d2.slope)}
        fillOpacity={0.9}
      />
    );
    // 奥の線
    svg.push(
      <line
        key={`line-front-${i}`}
        x1={d1.x - xx}
        y1={yWithDiagonal(d1.x, d1.y) - yy}
        x2={d2.x - xx}
        y2={yWithDiagonal(d2.x, d2.y) - yy}
        stroke={colorFromSlope(d2.slope)}
        strokeWidth={4}
      />
    );
    // 手前の線
    svg.push(
      <line
        key={`line-back-${i}`}
        x1={d1.x}
        y1={yWithDiagonal(d1.x, d1.y)}
        x2={d2.x}
        y2={yWithDiagonal(d2.x, d2.y)}
        stroke={colorFromSlope(d2.slope)}
        strokeWidth={4}
      />
    );
  }

  // 標高の塗り潰し、斜度の値
  for (let i = 0; i < drawData.length - 1; i++) {
    const d1 = drawData[i];
    const d2 = drawData[i + 1];
    const xx = drawState.diagonalRoadX;
    const yy = drawState.diagonalRoadY;

    // 左下の塗り潰し
    if (i === 0) {
      // console.log("left")
      svg.push(
        <polygon
          key={`fill-road-left`}
          points={`${d1.x},${yWithDiagonal(d1.x, d1.y)} ${d1.x - xx},${
            yWithDiagonal(d1.x, d1.y) - yy
          } ${d1.x - xx},${yWithDiagonal(d1.x, endY) - yy} ${d1.x},${yWithDiagonal(d1.x, endY)}`}
          fill={colorFromSlope(d2.slope)}
          fillOpacity={0.9}
        />
      );
    }

    svg.push(
      <polygon
        key={`fill${i}`}
        points={`${d1.x},${yWithDiagonal(d1.x, d1.y)} ${d2.x},${yWithDiagonal(d2.x, d2.y)} ${
          d2.x
        },${yWithDiagonal(d2.x, endY)} ${d1.x},${yWithDiagonal(d1.x, endY)}`}
        fill={colorFromSlope(d2.slope)}
        fillOpacity={0.5}
      />
    );
    svg.push(
      <text
        x={d1.x + (d2.x - d1.x) / 2}
        y={yWithDiagonal(d1.x + (d2.x - d1.x) / 2, endY - 20)}
        fill={drawState.slopeColor}
        fontSize={drawState.slopeFontSize + 'px'}
        style={{ fontWeight: 'bold', textAnchor: 'middle', transformBox: 'fill-box' }}
        transform={`skewY(${-drawState.diagonalRate * 55})`}
        key={`text-slope-${i}`}
      >
        {d2.slope.toFixed(1)}
      </text>
    );
  }

  // 距離の値
  // TODO: 1km単位前提の処理になっているため、後で修正する
  for (let i = 0; i < drawData.length; i++) {
    const d = drawData[i];
    let t = (d.distance / 1000).toFixed(1);
    // 端数省略設定時、小数点第一位が「0」だったら省略する。
    if (drawState.fractionOmitFlag) {
      if (t.endsWith('.0')) {
        t = (d.distance / 1000).toFixed(0);
      }
    }
    svg.push(
      <text
        x={d.x}
        y={yWithDiagonal(d.x, endY + 26)}
        fill="black"
        fontSize={drawState.distanceFontSize + 'px'}
        style={{ fontWeight: 'bold', textAnchor: 'middle', transformBox: 'fill-box' }}
        transform={`skewY(${-drawState.diagonalRate * 55})`}
        key={`text-distance-${i}`}
      >
        {t /*+ 'km' */}
      </text>
    );
  }

  // 0の線を描画
  svg.push(
    <line key="lh" x1={startX} y1={endY} x2={endX} y2={yWithDiagonal(endX, endY)} stroke="orange" />
  );
  // svg.push(<line key="lv" x1={startX} y1={startY} x2={startX} y2={endY} stroke="orange" />);

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={componentWidth}
      height={componentHeight}
    >
      {...svg}
    </svg>
  );
}
