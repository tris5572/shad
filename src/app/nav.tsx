'use client';

import Link from 'next/link';
import styles from './nav.module.css';
import { usePathname } from 'next/navigation';
import Dropper from './dropper';

export default function Nav() {
  const path = usePathname();

  return (
    <div className={styles.nav}>
      <ul>
        <Link href="/">
          <li className={`${styles.listItem} ${path === '/' ? styles.selectedItem : ''}`}>GPX</li>
        </Link>
        <Link href="/coloredmap">
          <li className={`${styles.listItem} ${path == '/coloredmap' ? styles.selectedItem : ''}`}>
            色付き地図
          </li>
        </Link>
        <Link href="/draw2">
          <li className={`${styles.listItem} ${path == '/draw2' ? styles.selectedItem : ''}`}>
            2Dグラフ
          </li>
        </Link>
      </ul>
      <Dropper />
    </div>
  );
}
