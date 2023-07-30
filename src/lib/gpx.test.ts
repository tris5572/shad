import { describe, expect, it } from 'vitest';
import { gpxToPoints } from './gpx';

describe('gpxToPoints()', () => {
  it('正常ケース', () => {
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="TestGPX" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd" version="1.1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
  <metadata>
  <time>2023-01-02T03:04:05Z</time>
  </metadata>
  <trk>
  <name>テストGPX</name>
  <type>1</type>
  <trkseg>
    <trkpt lat="35.6814833" lon="139.7659831">
    <ele>10.5</ele>
    <time>2023-01-02T03:04:06Z</time>
    <extensions>
      <gpxtpx:TrackPointExtension>
      <gpxtpx:atemp>26</gpxtpx:atemp>
      <gpxtpx:cad>80</gpxtpx:cad>
      </gpxtpx:TrackPointExtension>
    </extensions>
    </trkpt>
    <trkpt lat="35.6816750" lon="139.7646102">
    <ele>12.5</ele>
    <time>2023-01-02T03:04:07Z</time>
    <extensions>
      <gpxtpx:TrackPointExtension>
      <gpxtpx:atemp>26.1</gpxtpx:atemp>
      <gpxtpx:cad>85</gpxtpx:cad>
      </gpxtpx:TrackPointExtension>
    </extensions>
    </trkpt>
    <trkpt lat="35.6821979" lon="139.7622076">
    <ele>11.5</ele>
    <time>2023-01-02T03:04:08Z</time>
    <extensions>
      <gpxtpx:TrackPointExtension>
      <gpxtpx:atemp>26.2</gpxtpx:atemp>
      <gpxtpx:cad>90</gpxtpx:cad>
      </gpxtpx:TrackPointExtension>
    </extensions>
    </trkpt>
  </trkseg>
  </trk>
</gpx>
    `;
    const data = gpxToPoints(gpx)!;
    expect(data.length).toBe(3);
    expect(data[0].lat).toBeCloseTo(35.6814833);
    expect(data[0].lng).toBeCloseTo(139.7659831);
    expect(data[0].ele).toBeCloseTo(10.5);
    expect(data[1].lat).toBeCloseTo(35.681675);
    expect(data[1].lng).toBeCloseTo(139.7646102);
    expect(data[1].ele).toBeCloseTo(12.5);
    expect(data[2].lat).toBeCloseTo(35.6821979);
    expect(data[2].lng).toBeCloseTo(139.7622076);
    expect(data[2].ele).toBeCloseTo(11.5);

    expect(data[0].eleDiff).toBeCloseTo(0);
    expect(data[1].eleDiff).toBeCloseTo(2);
    expect(data[2].eleDiff).toBeCloseTo(-1);

    expect(data[0].dist).toBeCloseTo(0);
    expect(data[1].dist).toBeCloseTo(126.088);
    expect(data[2].dist).toBeCloseTo(225.099);
  });

  it('非GPXファイルケース', () => {
    const gpx = 'This file is not GPX.';
    const data = gpxToPoints(gpx);
    expect(data).toBeUndefined();
  });
});
