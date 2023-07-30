'use client';

import styles from './dropper.module.css';

import { useCallback, useState } from 'react';
import { FileDrop } from 'react-file-drop';
import { useAppStore } from '../lib/store';

export default function Dropper() {
  const [isOver, setIsOver] = useState(false);
  const setGpxFile = useAppStore((state) => state.setGpxFile);

  // const onFileDrop = useCallback((files: FileList | null) => {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     // console.log('onFileDrop()', 'onload');
  //     console.log(reader.result);
  //   };
  // }, []);

  const onFrameFileDrop = useCallback(
    (event: DragEvent) => {
      const file = event.dataTransfer?.files[0];
      if (file == null) {
        console.log('ファイルの情報を取得できませんでした');
        return;
      }
      const reader = new FileReader();

      reader.onload = () => {
        // ファイル読込後の処理
        // console.log(reader.result);
        const result = reader.result;
        if (result == undefined) {
          return;
        }
        const r = setGpxFile(result.toString());
        if (!r) {
          console.log(
            'GPXファイルを表示できませんでした（ファイル内容不正等）'
          );
        }
      };

      reader.readAsBinaryString(file);
      event.preventDefault();
    },
    [setGpxFile]
  );

  return (
    <FileDrop
      // onFrameDragEnter={(event) => setIsOver(true)}
      // onFrameDragLeave={(event) => setIsOver(false)}
      // onFrameDrop={(event) => console.log('onFrameDrop', event)}
      onDragOver={(event) => setIsOver(true)}
      onDragLeave={(event) => setIsOver(false)}
      // onDrop={(files, event) => {
      //   setIsOver(false);
      //   onFileDrop(files);
      //   console.log('onDrop!', files, event);
      // }}
      onFrameDrop={(event) => {
        // console.log('onFrameDrop!', event);
        onFrameFileDrop(event);
      }}
      dropEffect="link"
      draggingOverFrameClassName={styles.over}
    >
      {/* <div className={`${styles.box} ${isOver ? styles.over : ''}`}> */}
      <div className={styles.box}>
        GPXファイルを
        <br />
        ここにドロップ
      </div>
    </FileDrop>
  );
}
