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

  /**
   * 表示範囲の開始インデックスを、指定数値だけ増減させる。
   * @param num 指定数値
   * @returns
   */
  modRangeStart: (num: number) => void;

  modRangeEnd: (num: number) => void;

  routeDataInRange: () => RouteData | undefined;
};

export const useAppStore = create<AppState>((set, get) => ({
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
        rangeEnd: data.points.length - 1,
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

  modRangeStart(num) {
    const v = get().rangeStart + num;
    const len = get().gpxData?.points.length;
    if (len == undefined) {
      return;
    }
    const en = get().rangeEnd;
    if (len <= v) {
      set(() => ({ rangeStart: len - 1 }));
    } else if (en <= v) {
      set(() => ({ rangeStart: en - 1 }));
    } else if (v <= 0) {
      set(() => ({ rangeStart: 0 }));
    } else {
      set(() => ({ rangeStart: v }));
    }
  },

  modRangeEnd(num) {
    const v = get().rangeEnd + num;
    const len = get().gpxData?.points.length;
    if (len == undefined) {
      return;
    }
    const st = get().rangeStart;
    if (len <= v) {
      set(() => ({ rangeEnd: len - 2 }));
    } else if (v <= st) {
      set(() => ({ rangeEnd: st + 1 }));
    } else if (v <= 1) {
      set(() => ({ rangeEnd: 1 }));
    } else {
      set(() => ({ rangeEnd: v }));
    }
  },

  routeDataInRange: () => {
    const data = get().gpxData;
    if (data == undefined) {
      return undefined;
    }
    const start = get().rangeStart;
    const end = get().rangeEnd;
    return routeDataInRangePrivate(data, start, end);
  },
}));

function routeDataInRangePrivate(
  data: RouteData,
  start: number,
  end: number
): RouteData {
  const array: PointData[] = [];
  let minElevation = 99999;
  let maxElevation = -99999;
  let totalDistance = 0;
  let totalAscent = 0;
  let totalDescent = 0;

  for (let i = start; i <= end; i++) {
    const p = data.points[i];
    array.push(p);
    totalDistance += p.distDiff;
    minElevation = Math.min(minElevation, p.ele);
    maxElevation = Math.max(maxElevation, p.ele);
    if (0 < p.eleDiff) {
      totalAscent += p.eleDiff;
    } else {
      totalDescent -= p.eleDiff;
    }
  }

  return {
    points: array,
    minElevation,
    maxElevation,
    totalDistance,
    totalAscent,
    totalDescent,
  };
}

// ======================================================================

export type ColorState = {
  /** 色の区切りになる斜度 */
  delimiters: [number, number, number, number];
  /** 斜度の色。現状では `#rrggbb` の16進表記のみ */
  colors: [string, string, string, string, string];

  /**
   * 指定された斜度が該当するカラーコードを返す。
   * @param slope 斜度
   * @returns カラーコード
   */
  colorFromSlope: (slope: number) => string;

  changeColor: (index: number, color: string) => void;
};

export const useColorState = create<ColorState>((set, get) => ({
  delimiters: [0.5, 3, 6, 10],
  colors: ['#dddddd', '#33dd33', '#3333ff', '#ff0000', '#000000'],

  colorFromSlope(slope) {
    const deli = get().delimiters;
    const col = get().colors;
    for (let i = 0; i < deli.length; i++) {
      const d = deli[deli.length - i - 1];
      if (d <= slope) {
        return col[col.length - 1 - i];
      }
    }
    return col[0];
  },

  changeColor(index, color) {
    const colors = get().colors;
    colors[index] = color;
    set(() => ({ colors }));
  },
}));
