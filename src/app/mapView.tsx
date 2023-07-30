import styles from './mapView.module.css';
import mapStyle from '../misc/style.json';

import Map, { Layer, LayerProps, Source } from 'react-map-gl/maplibre';
import { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppStore } from '@/lib/store';
import { geojsonFromData } from '@/lib/gpx';

const LINE_KEY = 'route-line';

const routeLayer: LayerProps = {
  id: LINE_KEY,
  type: 'line',
  source: LINE_KEY,
  layout: {
    'line-join': 'round',
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#F88',
    'line-width': 4,
  },
};

export default function MapView() {
  const routeData = useAppStore((state) => state.gpxData);
  const geojson = geojsonFromData(routeData);

  return (
    <Map
      initialViewState={{
        longitude: 138.7,
        latitude: 36.3,
        zoom: 7,
      }}
      style={{ width: '100%', height: '100dvh' }}
      mapStyle={mapStyle as StyleSpecification}
    >
      <Source type="geojson" data={geojson}>
        <Layer {...routeLayer} />
      </Source>
    </Map>
  );
}
