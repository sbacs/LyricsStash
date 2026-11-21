import * as ImageManipulator from 'expo-image-manipulator';
import { decode } from 'jpeg-js';
import { Buffer } from 'buffer';
import { oklch, formatHex, clampChroma } from 'culori';

// Pastel range (OKLCH lightness 0..1)
const MIN_L = 0.75; // anything darker than this gets lightened up to it
const MAX_L = 0.8;  // anything lighter gets pulled down to it
const MAX_C = 0.1;  // chroma cap: keeps the result soft instead of vivid

const FALLBACK_HEX = '#d9d4c7';
const SAMPLE_WIDTH = 48;

export async function pastelFromCover(url: string): Promise<string> {
  try {
    const small = await ImageManipulator.manipulateAsync(
      url,
      [{ resize: { width: SAMPLE_WIDTH } }],
      { format: ImageManipulator.SaveFormat.JPEG, base64: true, compress: 0.9 }
    );

    const { data } = decode(Buffer.from(small.base64!, 'base64'), { useTArray: true });

    // Dominant color: group pixels into 16 levels per channel (4096 buckets)
    // and take the most populated bucket, averaged over its pixels
    const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.n++;
        bucket.r += r;
        bucket.g += g;
        bucket.b += b;
      } else {
        buckets.set(key, { n: 1, r, g, b });
      }
    }

    let top: { n: number; r: number; g: number; b: number } | null = null;
    for (const bucket of buckets.values()) {
      if (!top || bucket.n > top.n) top = bucket;
    }
    if (!top) return FALLBACK_HEX;

    const dominant = oklch({
      mode: 'rgb',
      r: top.r / top.n / 255,
      g: top.g / top.n / 255,
      b: top.b / top.n / 255,
    });
    if (!dominant) return FALLBACK_HEX;

    // Lighten if too dark (and tone down if too light), then cap the chroma
    const l = Math.min(MAX_L, Math.max(MIN_L, dominant.l));
    const c = Math.min(MAX_C, dominant.c);
    const h = dominant.h ?? 0; // grays have no hue, but their chroma is ~0 anyway

    // clampChroma keeps the color inside the sRGB gamut without shifting hue
    return formatHex(clampChroma({ mode: 'oklch', l, c, h }, 'oklch'));
  } catch {
    return FALLBACK_HEX;
  }
}