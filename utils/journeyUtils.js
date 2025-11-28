export function calculateJourney(route, startIdx, endIdx) {
  if (startIdx === endIdx) return { numStops: 0, totalTime: 0 };
  let s = Math.min(startIdx, endIdx);
  let e = Math.max(startIdx, endIdx);
  let numStops = e - s;
  let totalTime = 0;
  for (let i = s + 1; i <= e; ++i) {
    totalTime += route.approxTravelTimes[i];
  }
  return { numStops, totalTime };
}
