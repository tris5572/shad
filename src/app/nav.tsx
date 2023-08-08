'use client';

import Link from 'next/link';
import styles from './nav.module.css';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const path = usePathname();

  return (
    <div className={styles.nav}>
      <ul>
        <Link href="/">
          <li
            className={`${styles.listItem} ${
              path === '/' ? styles.selectedItem : ''
            }`}
          >
            GPX
          </li>
        </Link>
        <Link href="/slope">
          <li
            className={`${styles.listItem} ${
              path == '/slope' ? styles.selectedItem : ''
            }`}
          >
            斜度表示
          </li>
        </Link>
      </ul>
    </div>
  );
}
