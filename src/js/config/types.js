// ==========================================================================
// Uiza supported types and providers
// ==========================================================================

export const providers = {
  html5: 'html5',
  hlsjs: 'hlsjs',
  dashjs: 'dashjs',
};

export const types = {
  audio: 'audio',
  video: 'video',
};

/**
 * Get provider by URL
 * @param {String} url
 */
export function getProviderByUrl(url) {
  // Hlsjs
  if (/^https?:\/\/(.*).m3u8(.?)/.test(url)) {
    return providers.hlsjs;
  }
  // Dashjs
  if (/^https?:\/\/(.*).mpd(.?)/.test(url)) {
    return providers.dashjs;
  }

  return null;
}

export default { providers, types };
