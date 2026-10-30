export const METRICS = ['performance', 'accessibility', 'bestPractices', 'seo', 'lcp', 'fcp', 'cls', 'tbt', 'speedIndex', 'transferBytes', 'requests', 'mainThreadMs', 'ttfb'];
export function median(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (!sorted.length) return null;
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
export function summarize(samples, expectedRuns) {
  const groups = new Map();
  for (const sample of samples) {
    const key = `${sample.path}:${sample.profile}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(sample);
  }
  return [...groups.values()].map((group) => {
    const { path, profile } = group[0];
    const measured = group.filter((sample) => sample.status === 'TESTED');
    const metrics = Object.fromEntries(METRICS.map((key) => [key, median(measured.map((sample) => sample[key]))]));
    const complete = measured.length === expectedRuns && group.length === expectedRuns;
    const targetMet = metrics.performance >= 0.9 && metrics.accessibility >= 0.95 && metrics.bestPractices >= 0.95 && metrics.seo >= 0.95;
    return { path, profile, status: complete ? (targetMet ? 'PASS' : 'FAIL') : 'BLOCKED', runs: measured.length, expectedRuns, ...metrics };
  });
}
export const toCsv = (rows) => rows.map((row) => row.map((value) => JSON.stringify(value ?? '')).join(',')).join('\n') + '\n';
