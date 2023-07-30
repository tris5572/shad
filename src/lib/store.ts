import { create } from 'zustand';
import { PointData } from './types';
import { gpxToPoints } from './gpx';

export type AppState = {
  /**
   * GPXファイルの中身をデータ化したもの。
   */
  gpxData: PointData[];

  /**
   * 設定されたGPXファイルの中身。
   */
  gpxFile: string;

  /**
   * GPXファイルをセットする。
   * @param gpx GPXファイルの中身
   * @returns セットに成功したかどうか。GPXファイルが不正な場合等は false。
   */
  setGpxFile: (gpx: string) => boolean;
};

export const useAppStore = create<AppState>((set) => ({
  gpxData: [],
  gpxFile: '',

  setGpxFile: (gpx: string) => {
    // GPXファイルをパースしてデータ化する。
    const data = gpxToPoints(gpx);
    if (data == undefined) {
      return false;
    }

    set((state) => {
      return { gpxFile: gpx, gpxData: data };
    });
    return true;
  },
}));
