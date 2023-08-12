import { XMLParser } from 'fast-xml-parser';
import { PointData, RouteData } from './types';

/**
 *
 * @param gpx GPXファイルの中身の文字列
 * @returns 座標データの配列。生成できなかった場合は undefined
 */
export function gpxToData(gpx: string): RouteData | undefined {
  const array: PointData[] = [];

  // パース時のオプション。trkpt の lat と lon を取得するために指定。
  const parsingOptions = {
    ignoreAttributes: false,
  };

  const parser = new XMLParser(parsingOptions);
  let jsonObj = parser.parse(gpx);

  // GPXでなかったり、正常に生成できない恐れがあるときは undefined を返す。
  if (jsonObj.gpx?.trk?.trkseg?.trkpt == null) {
    return undefined;
  }

  const points = jsonObj.gpx.trk.trkseg.trkpt;
  let totalDistance = 0;
  let totalAscent = 0;
  let totalDescent = 0;
  let minElevation = 9999999;
  let maxElevation = -9999999;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const lat = Number(p['@_lat']);
    const lng = Number(p['@_lon']);
    const ele = p['ele'] ? Number(p['ele']) : 0;
    const eleDiff = i === 0 ? 0 : ele - array[i - 1].ele;
    const distDiff =
      i === 0 ? 0 : calcDistance(lat, lng, array[i - 1].lat, array[i - 1].lng);
    const dist =
      i === 0
        ? 0
        : array[i - 1].dist +
          calcDistance(lat, lng, array[i - 1].lat, array[i - 1].lng);

    totalDistance += distDiff;
    minElevation = Math.min(minElevation, ele);
    maxElevation = Math.max(maxElevation, ele);
    if (0 < eleDiff) {
      totalAscent += eleDiff;
    } else {
      totalDescent += eleDiff;
    }

    array.push({
      lat,
      lng,
      ele,
      eleDiff,
      distDiff,
      dist,
    });
  }

  return {
    points: array,
    totalDistance,
    minElevation,
    maxElevation,
    totalAscent,
    totalDescent,
  };
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

/**
 * 2点間の距離[m]を算出する。
 * @param lat1 1点目の緯度
 * @param lng1 1点目の経度
 * @param lat2 2点目の緯度
 * @param lng2 2点目の経度
 * @returns 距離[m]
 */
export function calcDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  // ヒュベニの公式
  lat1 = (lat1 * Math.PI) / 180;
  lng1 = (lng1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;
  lng2 = (lng2 * Math.PI) / 180;
  const latDiff = lat1 - lat2; // 緯度差
  const lngDiff = lng1 - lng2; // 経度差算
  const latAvg = (lat1 + lat2) / 2.0; // 平均緯度
  const a = 6378137.0; // 赤道半径
  const b = 6356752.314140356; // 極半径
  const e2 = 0.00669438002301188; // 第一離心率^2
  const a1e2 = 6335439.32708317; // 赤道上の子午線曲率半径
  const sinLat = Math.sin(latAvg);
  const W2 = 1.0 - e2 * (sinLat * sinLat);
  const M = a1e2 / (Math.sqrt(W2) * W2); // 子午線曲率半径M
  const N = a / Math.sqrt(W2); // 卯酉線曲率半径

  const t1 = M * latDiff;
  const t2 = N * Math.cos(latAvg) * lngDiff;
  return Math.sqrt(t1 * t1 + t2 * t2);
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

/**
 * 座標のデータのリストからGeoJSONを生成する。
 * @param data 座標データ<PointData[]>
 * @returns GeoJSONのデータ
 */
export function geojsonFromData(data?: PointData[]) {
  const coods = [];

  if (data != null) {
    for (const d of data) {
      coods.push([d.lng, d.lat]);
    }
  }

  const json = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: coods,
          type: 'LineString',
        },
      },
    ],
  };

  return json;
}

// -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

/**
 * 座標のデータのリストで、指定したインデックスの範囲内からGeoJSONを生成する。
 * @param data 座標データ<PointData[]>
 * @param start 開始インデックス
 * @param end 終了インデックス
 * @returns GeoJSONのデータ
 */
export function geojsonFromDataInRange(
  data: PointData[] | undefined,
  start: number,
  end: number
) {
  const coods = [];

  if (data != null) {
    for (let i = 0; i < data.length; i++) {
      if (start <= i && i <= end) {
        const d = data[i];
        coods.push([d.lng, d.lat]);
      }
    }
  }

  const json = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: coods,
          type: 'LineString',
        },
      },
    ],
  };

  return json;
}
