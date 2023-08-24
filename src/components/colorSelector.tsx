import { useColorState } from '@/lib/store';
import styles from './colorSelector.module.css';

// 斜度に応じた色を選択するコンポーネント。
export function ColorSelector() {
  // colors の方が delimiters より1つ多い。
  const [delimiters, delimitersString, colors, changeColor, changeDelimitersString] = useColorState(
    (st) => [
      st.delimiters,
      st.delimitersString,
      st.colors,
      st.changeColor,
      st.changeDelimitersString,
    ]
  );
  const elements = [];

  for (let i = 0; i < colors.length; i++) {
    const c = colors[i];

    elements.push(
      <div key={`colors-${i}`}>
        <input type="color" value={c} onChange={(e) => changeColor(i, e.currentTarget.value)} />
      </div>
    );

    if (i < delimitersString.length) {
      const d = delimitersString[i];
      elements.push(
        <div key={`delimiters-${i}`}>
          <input
            type="text"
            value={d}
            name={`delimiters-${i}`}
            size={4}
            onChange={(e) => {
              changeDelimitersString(i, e.currentTarget.value);
            }}
          />
        </div>
      );
    }
  }

  return (
    <div className={styles.box}>
      <p className={styles.label}>斜度と色選択</p>
      {elements}
    </div>
  );
}
