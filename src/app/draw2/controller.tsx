import { ColorSelector } from '@/components/colorSelector';
import styles from './controller.module.css';
import DrawStatus from '@/components/drawStatus';

export default function ControllerView() {
  return (
    <div className={styles.outer}>
      <ColorSelector />
      {/* <DrawStatus /> */}
    </div>
  );
}
