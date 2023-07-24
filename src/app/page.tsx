'use client';

import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './page.module.css';
import mapStyle from '../misc/style.json';

import Map from 'react-map-gl/maplibre';
import { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className={styles.main}>
      <Map
        initialViewState={{
          longitude: 138.73,
          latitude: 35.36,
          zoom: 10,
        }}
        style={{ width: '100%', height: '100dvh' }}
        mapStyle={mapStyle as StyleSpecification}
      />
    </main>
  );
}
