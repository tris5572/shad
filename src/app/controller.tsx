import styles from './controller.module.css';
import Dropper from './dropper';

export default function Controller() {
  return (
    <div className={styles.outer}>
      <Dropper />
      状態コントローラ
    </div>
  );
}
