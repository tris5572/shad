import styles from './map.module.css';
import mapStyle from '../../misc/style.json';

import Map, { Layer, LayerProps, Source, useMap } from 'react-map-gl/maplibre';
import { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppStore } from '@/lib/store';
import { geojsonFromData } from '@/lib/gpx';
import { getBounds } from '@/lib/util';
import { PointData } from '@/lib/types';

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
  const data = useAppStore((state) => state.gpxData?.points);

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

  // 勾配から色を返す。
  // 本来なら設定した値を元に返すべきだが、暫定実装。
  const colorFrom = (slope: number): string => {
    if (10 <= slope) {
      return 'black';
    } else if (6 <= slope) {
      return 'red';
    } else if (3 <= slope) {
      return 'blue';
    } else if (0.5 < slope) {
      return 'limegreen';
    }
    return 'lightyellow';
  };

  const array = [];
  const points = props.points;

  const firstDist = points[0].dist;
  const totalDist = points[points.length - 1].dist - firstDist;

  for (const p of points) {
    const d = (p.dist - firstDist) / totalDist;
    const s = (p.eleDiff * 100) / p.distDiff;
    array.push(d, colorFrom(s));
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
      'line-width': 14,
      'line-gradient': ['step', ['line-progress'], 'transparent', ...array],
    },
  };

  return (
    <Source type="geojson" data={props.geojson} lineMetrics>
      <Layer {...step} />
    </Source>
  );
}
