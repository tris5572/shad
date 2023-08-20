import styles from './map.module.css';
import mapStyle from '../../misc/style.json';

import Map, { Layer, LayerProps, Source, useMap } from 'react-map-gl/maplibre';
import { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppStore, useColorState } from '@/lib/store';
import { geojsonFromData } from '@/lib/gpx';
import { getBounds } from '@/lib/util';
import { PointData } from '@/lib/types';
import { useCallback } from 'react';

const LINE_KEY = 'route-line';

export default function MapView() {
  const routeData = useAppStore((st) => st.routeDataInRange());
  const geojson = geojsonFromData(routeData?.points);

  return (
    <div className={styles.map}>
      <Map
        reuseMaps
        initialViewState={{
          longitude: 138.7,
          latitude: 36.3,
          zoom: 7,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle as StyleSpecification}
      >
        <MapInner />
        {routeData && (
          <GradationLayer points={routeData?.points} geojson={geojson} />
        )}
      </Map>
    </div>
  );
}

/**
 * GPXファイルが変更されたときに地図の表示エリアをGPX座標の境界に一致させる。
 * `useMap()` を使うためにコンポーネントにしているが、もっと良いやり方がありそうな気がする。
 * @returns 空コンポーネント
 */
function MapInner() {
  const { current: map } = useMap();
  const data = useAppStore((st) => st.routeDataInRange()?.points);

  if (data != undefined) {
    const bounds = getBounds(data);
    map?.fitBounds(bounds, { offset: [10, 10] });
  }

  return <></>;
}

/**
 * 座標データからグラデーションを生成する。
 * @param props 座標の一覧とGeoJSON
 * @returns Sourceオブジェクト
 */
function GradationLayer(props: { points: PointData[]; geojson: any }) {
  // Layerだけを返す形ではなぜか上手く動かなかったので、Sourceを返す形としている。

  // colors と delimiters が変わった時にもレンダリングされるよう、全部を取得。
  const { colorFromSlope } = useColorState();

  // 複数地点をまとめて斜度を計算するための値。暫定実装。
  const groupCount = 10;

  const array = [];
  const points = props.points;

  const firstDist = points[0].dist;
  const totalDist = points[points.length - 1].dist - firstDist;

  let count = 0;
  let sumDist = 0;
  let sumEle = 0;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    sumDist += p.distDiff;
    sumEle += p.eleDiff;
    count++;

    if (count === groupCount || i === points.length - 1) {
      const d = (p.dist - firstDist) / totalDist;
      const s = (sumEle * 100) / sumDist;
      array.push(d, colorFromSlope(s));

      sumDist = 0;
      sumEle = 0;
      count = 0;
    }
  }

  const step: LayerProps = {
    id: 'gradient-line',
    type: 'line',
    source: LINE_KEY,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': 'red',
      'line-width': 6,
      'line-gradient': ['step', ['line-progress'], 'transparent', ...array],
    },
  };

  return (
    <Source type="geojson" data={props.geojson} lineMetrics>
      <Layer {...step} />
    </Source>
  );
}
