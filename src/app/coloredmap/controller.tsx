import { ColorSelector } from '@/components/colorSelector';
import RangeSelector from '../../components/rangeSelector';
import styles from './controller.module.css';

export default function ControllerView() {
  return (
    <div className={styles.outer}>
      <RangeSelector />
      <ColorSelector />
    </div>
  );
}
