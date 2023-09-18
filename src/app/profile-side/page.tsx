'use client';

import ControllerView from './controller';
import { Draw2View } from './elevation2D';
import styles from './page.module.css';

export default function App() {
  return (
    <main className={styles.main}>
      <div className={styles.mapWrapper}>
        <Draw2View />
      </div>
      <ControllerView></ControllerView>
    </main>
  );
}
