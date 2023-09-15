/** 図にするときの距離の単位 */
export const DistanceUnit = { M1000: 1000, M500: 500, M200: 200, M100: 100 } as const;
export type DistanceUnit = (typeof DistanceUnit)[keyof typeof DistanceUnit];
