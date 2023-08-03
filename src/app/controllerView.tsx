import RangeSelector from './rangeSelector';
import styles from './controllerView.module.css';
import Dropper from './dropper';

export default function ControllerView() {
  return (
    <div className={styles.outer}>
      <Dropper />
      <RangeSelector />
    </div>
  );
}
