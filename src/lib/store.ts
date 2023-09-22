import { create } from 'zustand';
import { PointData, RouteData } from './types';
import { gpxToData } from './gpx';
import { DistanceUnit } from './constants';

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

function routeDataInRangePrivate(data: RouteData, start: number, end: number): RouteData {
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
  /** 色の区切りになる斜度（これは不要かも） */
  delimiters: [number, number, number, number];

  /** 色の区切りになる斜度の文字列。テキストフィールドで入力するために保持する */
  delimitersString: [string, string, string, string];

  /** 斜度の色。現状では `#rrggbb` の16進表記のみ */
  colors: [string, string, string, string, string];

  /**
   * 指定された斜度が該当するカラーコードを返す。
   * @param slope 斜度
   * @returns カラーコード
   */
  colorFromSlope: (slope: number) => string;

  changeColor: (index: number, color: string) => void;

  /**
   * 色の区切りになる斜度を設定する。
   * @param delimiters 区切りのリスト。斜度が緩い方から並べる。
   * @returns
   */
  setDelimiters: (delimiters: [number, number, number, number]) => void;

  /**
   * 指定されたインデックスの斜度の値を変更する。
   * @param index インデックス
   * @param value 斜度の値（string）
   * @returns すべての斜度が昇順に並んでいるかどうか
   */
  changeDelimitersString: (index: number, value: string) => boolean;
};

export const useColorState = create<ColorState>((set, get) => ({
  delimiters: [0.5, 3, 6, 10],
  delimitersString: ['0.5', '3', '6', '10'],
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

  setDelimiters(delimiters) {
    set(() => ({ delimiters }));
  },

  changeDelimitersString(index, value) {
    const delimiters = get().delimiters;
    const delimitersString = get().delimitersString;
    delimitersString[index] = value;
    delimiters[index] = Number(value);
    set(() => ({ delimiters, delimitersString }));

    for (let i = 0; i < delimiters.length - 1; i++) {
      if (delimiters[i + 1] < delimiters[i]) {
        return false;
      }
    }
    return true;
  },
}));

// ======================================================================

export type DrawState = {
  width: number;
  height: number;
  unit: DistanceUnit;
  slopeFontSize: number;
  slopeColor: string;
  distanceFontSize: number;
  /** 距離の端数を省略するかどうかのフラグ。 */
  fractionOmitFlag: boolean;

  changeUnit: (v: string | number) => void;
  setSlopeFontSize: (size: number) => void;
  setSlopeColor: (color: string) => void;
  setDistanceFontSize: (size: number) => void;
  setFractionOmitFlag: (flag: boolean) => void;
};

export const useDrawState = create<DrawState>((set, get) => ({
  width: 600,
  height: 400,
  unit: DistanceUnit.M1000,
  slopeFontSize: 18,
  slopeColor: '#FFFFFF',
  distanceFontSize: 20,
  fractionOmitFlag: true,

  changeUnit(v) {
    const n = Number(v);
    switch (n) {
      case 500:
        set(() => ({ unit: DistanceUnit.M500 }));
        break;
      case 200:
        set(() => ({ unit: DistanceUnit.M200 }));
        break;
      case 100:
        set(() => ({ unit: DistanceUnit.M100 }));
        break;
      default:
        set(() => ({ unit: DistanceUnit.M1000 }));
        break;
    }
  },

  setSlopeFontSize(size) {
    set(() => ({ slopeFontSize: size }));
  },

  setSlopeColor(color) {
    set(() => ({ slopeColor: color }));
  },

  setDistanceFontSize(size) {
    set(() => ({ distanceFontSize: size }));
  },

  setFractionOmitFlag(flag) {
    set(() => ({ fractionOmitFlag: flag }));
  },
}));
