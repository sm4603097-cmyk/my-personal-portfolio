export interface MetricSegment {
  number: string | null;
  text: string;
}

const LEADING_NUMBER = /^([0-9][0-9.,/+\s%-]*?)\s+(.*)$/;

export const splitMetricSegments = (text: string, separator = '·'): MetricSegment[] => {
  return text.split(separator).map((raw) => {
    const seg = raw.trim();
    const match = seg.match(LEADING_NUMBER);
    if (match) {
      return { number: match[1].replace(/\s+/g, ' ').trim(), text: match[2].trim() };
    }
    return { number: null, text: seg };
  });
};