'use client';

import ControllerView from './controller';
import { DrawDiagonalView } from './elevationDiagonal';
import styles from './page.module.css';

export default function App() {
  return (
    <main className={styles.main}>
      <div className={styles.mapWrapper}>
        <DrawDiagonalView />
      </div>
      <ControllerView></ControllerView>
    </main>
  );
}
