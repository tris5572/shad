import { create } from 'zustand';
import { PointData, RouteData } from './types';
import { gpxToData } from './gpx';

export type AppState = {
  /** GPXファイルの中身をデータ化したもの。 */
  gpxData: RouteData | undefined;

  /** 設定されたGPXファイルの中身。 */
  gpxFile: string;

  /** 表示範囲の開始インデックス。 */
  rangeStart: number;

  /** 表示範囲の終了インデックス。 */
  rangeEnd: number;

  // -  -  -  -  - 関数 -  -  -  -  -

  /**
   * GPXファイルをセットする。
   * @param gpx GPXファイルの中身
   * @returns セットに成功したかどうか。GPXファイルが不正な場合等は false。
   */
  setGpxFile: (gpx: string) => boolean;

  setRangeStart: (index: number) => void;
  setRangeEnd: (index: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
  gpxData: undefined,
  gpxFile: '',
  rangeStart: 0,
  rangeEnd: 1,

  setGpxFile: (gpx: string) => {
    // GPXファイルをパースしてデータ化する。
    const data = gpxToData(gpx);
    if (data == undefined) {
      return false;
    }

    set((state) => {
      return {
        gpxFile: gpx,
        gpxData: data,
        rangeStart: 0,
        rangeEnd: data.data.length - 1,
      };
    });
    return true;
  },

  setRangeStart: (index: number) => {
    set((state) => ({
      rangeStart: index,
    }));
  },

  setRangeEnd: (index: number) => {
    set((state) => ({
      rangeEnd: index,
    }));
  },
}));
