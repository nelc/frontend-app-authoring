/**
 * Course intro video: turn what an author pastes into a YouTube video ID.
 *
 * The backend stores `<iframe src=".../embed/{id}?rel=0">`, so only a bare ID is safe to save.
 * This is the SAME rule as edx-platform `normalize_youtube_video_id`; keep the two identical:
 *   1. blank / whitespace = no video; the input is trimmed.
 *   2. a full match of VIDEO_ID_PATTERN is the ID.
 *   3. otherwise parse as a URL (http, https, no scheme or `//host`; any other scheme is rejected).
 *      The lowercased host must be exactly one of WATCH_HOSTS, NOCOOKIE_HOSTS or `youtu.be`.
 *   4. youtu.be/<ID>: first path segment. `/watch` (WATCH_HOSTS only) -> `v=`;
 *      `/embed/<ID>`, `/shorts/<ID>`, `/live/<ID>` -> 2nd segment. Other query params (t, start...) are dropped.
 *   5. the result must match VIDEO_ID_PATTERN, else it is an error (never a guessed value).
 */
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const WATCH_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com']);
const NOCOOKIE_HOSTS = new Set(['youtube-nocookie.com', 'www.youtube-nocookie.com']);
const ID_PATH_PREFIXES = ['embed', 'shorts', 'live'];

/** True for a blank value (no video) or a well-formed 11-character ID. */
const isValidVideoId = (value) => !value || VIDEO_ID_PATTERN.test(value);

/**
 * Returns the ID found in a recognised YouTube link, otherwise the trimmed input unchanged.
 * It never guesses: an unrecognised link or junk comes back as-is and fails `isValidVideoId`.
 */
const normalizeVideoInput = (input) => {
  const text = (input || '').trim();
  if (VIDEO_ID_PATTERN.test(text)) {
    return text;
  }
  const scheme = text.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase();
  if (scheme && scheme !== 'http' && scheme !== 'https') {
    return text; // ftp:, javascript:, ...
  }
  let absolute = scheme ? text : `https://${text}`;
  if (text.startsWith('//')) { absolute = `https:${text}`; }
  let url;
  try {
    url = new URL(absolute);
  } catch {
    return text;
  }
  const [first, second] = url.pathname.split('/').filter(Boolean);
  if (url.hostname === 'youtu.be') {
    return first || text;
  }
  if (WATCH_HOSTS.has(url.hostname) && url.pathname.replace(/\/$/, '') === '/watch') {
    return url.searchParams.get('v') || text; // nocookie hosts only serve /embed
  }
  if ((WATCH_HOSTS.has(url.hostname) || NOCOOKIE_HOSTS.has(url.hostname)) && ID_PATH_PREFIXES.includes(first)) {
    return second || text;
  }
  return text;
};

export { VIDEO_ID_PATTERN, isValidVideoId, normalizeVideoInput };
