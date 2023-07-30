'use client';

import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from './page.module.css';

import Controller from './controller';
import MapView from './mapView';

const inter = Inter({ subsets: ['latin'] });

export default function App() {
  return (
    <main className={styles.main}>
      <MapView />
      <Controller />
    </main>
  );
}
