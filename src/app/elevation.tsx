import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './elevation.module.css';

/**
 * 標高を表すグラフ。
 */
export default function Elevation() {
  const elm = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const sizeHandler = useCallback(() => {
    if (elm.current == null) {
      return;
    }
    // 幅いっぱいにするとよく分からない挙動になるので、少し小さくする。CSSムズカシイ。
    setWidth(elm.current.scrollWidth - 10);
    setHeight(elm.current.scrollHeight - 10);
  }, []);

  // 最初の呼び出し時にサイズの設定を反映するとともに、サイズが変わったときのハンドラを設定。
  useEffect(() => {
    sizeHandler();
    window.addEventListener('resize', sizeHandler);
    return () => window.removeEventListener('resize', sizeHandler);
  });

  return (
    <div className={styles.main} ref={elm}>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
      >
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          stroke="red"
          fill="gray"
        />
      </svg>
    </div>
  );
}
