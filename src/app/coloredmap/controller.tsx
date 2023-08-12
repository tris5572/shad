import RangeSelector from '../../components/rangeSelector';
import styles from './controller.module.css';
// import Dropper from './dropper';

export default function ControllerView() {
  return (
    <div className={styles.outer}>
      {/* <Dropper /> */}
      <RangeSelector />
    </div>
  );
}
