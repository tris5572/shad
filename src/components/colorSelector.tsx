import { useColorState } from '@/lib/store';
import styles from './colorSelector.module.css';

// 斜度に応じた色を選択するコンポーネント。
export function ColorSelector() {
  // colors の方が delimiters より1つ多い。
  const [delimiters, colors, changeColor] = useColorState((st) => [
    st.delimiters,
    st.colors,
    st.changeColor,
  ]);
  const elements = [];

  // function changeColor(i: number, c: string) {
  //   console.log(i, c);
  // }

  for (let i = 0; i < colors.length; i++) {
    const c = colors[i];

    elements.push(
      <div key={`colors-${i}`}>
        <input
          type="color"
          value={c}
          onChange={(e) => changeColor(i, e.currentTarget.value)}
        />
      </div>
    );

    if (i < delimiters.length) {
      const d = delimiters[i];
      elements.push(
        <div key={`delimiters-${i}`}>
          <input type="text" value={d} size={4} />
        </div>
      );
    }
  }

  return (
    <div className={styles.box}>
      <p className={styles.label}>斜度と色選択</p>
      {/* <input type="color" /> */}
      {elements}
    </div>
  );
}
