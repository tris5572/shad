import styles from './mapView.module.css';
import mapStyle from '../misc/style.json';

import Map, { Layer, LayerProps, Source, useMap } from 'react-map-gl/maplibre';
import { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppStore } from '@/lib/store';
import { geojsonFromData, geojsonFromDataInRange } from '@/lib/gpx';
import { getBounds } from '@/lib/util';

const LINE_KEY = 'route-line';

export default function MapView() {
  const [start, end] = useAppStore((st) => [st.rangeStart, st.rangeEnd]);

  const routeData = useAppStore((state) => state.gpxData);
  const geojson = geojsonFromData(routeData?.data);
  const geojsonInRange = geojsonFromDataInRange(routeData?.data, start, end);

  let allRouteLayer: LayerProps = {
    id: 'all-route',
    type: 'line',
    source: LINE_KEY,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#0005',
      'line-width': 4,
    },
  };
  let inRangeLayer: LayerProps = {
    id: 'in-range',
    type: 'line',
    source: LINE_KEY,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#F88',
      'line-width': 6,
    },
  };

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
        <Source type="geojson" data={geojson}>
          <Layer {...allRouteLayer} />
        </Source>
        <Source type="geojson" data={geojsonInRange}>
          <Layer {...inRangeLayer} />
        </Source>
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
  const data = useAppStore((state) => state.gpxData?.data);

  if (data != undefined) {
    const bounds = getBounds(data);
    map?.fitBounds(bounds, { offset: [10, 10] });
  }

  return <></>;
}
