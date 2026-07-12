// A tiny neutral placeholder shown (blurred) while a remote photo loads.
// 8×6 SVG in the brand surface tone → data URL usable as next/image blurDataURL.
const SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6"><rect width="8" height="6" fill="#e7eef0"/></svg>';

export const BLUR_DATA_URL = `data:image/svg+xml;base64,${Buffer.from(SVG).toString("base64")}`;
