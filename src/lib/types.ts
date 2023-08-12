export type PointData = {
  /** 座標の緯度 */
  lat: number;
  /** 座標の経度 */
  lng: number;
  /** 座標の標高 */
  ele: number;
  /** 開始地点から当該座標までの累積距離 */
  dist: number;
  /** 前の座標との標高の差分[m]。登りならプラス、下りならマイナス */
  eleDiff: number;
  /** 前の座標との距離[m] */
  distDiff: number;
};

export type RouteData = {
  points: PointData[];
  minElevation: number;
  maxElevation: number;
  totalDistance: number;
  totalAscent: number;
  totalDescent: number;
};
