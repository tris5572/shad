export type PointData = {
  lat: number; // 緯度
  lng: number; // 経度
  ele: number; // 標高
  dist: number; // その地点までの累積距離
  eleDiff: number; // 前の座標との標高の差分。登りならプラス、下りならマイナス
  distDiff: number; // 前の座標との距離(メートル)
};

export type RouteData = {
  data: PointData[];
  minElevation: number;
  maxElevation: number;
  totalDistance: number;
  totalAscent: number;
  totalDescent: number;
};
