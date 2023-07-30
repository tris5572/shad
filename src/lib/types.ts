export type PointData = {
  lat: number; // 緯度
  lng: number; // 経度
  ele: number; // 標高
  eleDiff: number; // 前の座標との標高の差分。登りならプラス、下りならマイナス
  dist: number; // 前の座標との距離(メートル)
};

export type RouteData = {
  data: PointData[];
  minElevation: number;
  maxElevation: number;
  totalDistance: number;
  totalAscent: number;
  totalDescent: number;
};
