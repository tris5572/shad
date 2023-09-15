import RangeSelector from '../components/rangeSelector';
import styles from './controllerView.module.css';

export default function ControllerView() {
  return (
    <div className={styles.outer}>
      <RangeSelector />
    </div>
  );
}
