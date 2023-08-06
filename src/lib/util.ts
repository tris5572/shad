import { LngLatBoundsLike } from 'maplibre-gl';
import { PointData } from './types';

// 渡された座標から境界を返す。
// 中途半端な実装なので、子午線(太平洋)をまたぐとうまく動かない。
// 適度な余白も加味して返す。
// [west, south, east, north]
export function getBounds(data: PointData[]): LngLatBoundsLike {
  let minLng = 999;
  let maxLng = -999;
  let minLat = 999;
  let maxLat = -999;
  const MARGIN = 0.01;

  for (const d of data) {
    minLng = Math.min(minLng, d.lng);
    maxLng = Math.max(maxLng, d.lng);
    minLat = Math.min(minLat, d.lat);
    maxLat = Math.max(maxLat, d.lat);
  }

  return [minLng - MARGIN, minLat - MARGIN, maxLng + MARGIN, maxLat + MARGIN];
}
