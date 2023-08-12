'use client';

import ControllerView from './controller';
import MapView from './map';
import styles from './page.module.css';

export default function App() {
  return (
    <main className={styles.main}>
      <div className={styles.mapWrapper}>
        <MapView></MapView>
      </div>
      <ControllerView></ControllerView>
    </main>
  );
}
