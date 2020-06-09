const sources = [
  {
    title: 'Live',
    src: 'https://asia-southeast1-live.uizacdn.net/f785bc511967473fbe6048ee5fb7ea59-live/10f49bcf-513c-4860-aa34-8b355780e416/playlist_dvr.m3u8',
  },
  {
    title: 'VOD HLS ts with preview thumbnail',
    src: 'https://teamplayer-vod.uizacdn.net/01e137ad1b534004ad822035bf89b29f-stream/11695bca-746f-4bae-b090-0b3c32f98be2/package/playlist_ts.m3u8',
    poster: 'https://teamplayer-static.uizacdn.net/01e137ad1b534004ad822035bf89b29f-static/2019/10/25/11695bca-746f-4bae-b090-0b3c32f98be2/thumbnail-10-8-720.jpeg',
    preview: ['./media/View_From_A_Blue_Moon_Trailer-thumbs-small.vtt', './media/View_From_A_Blue_Moon_Trailer-thumbs-large.vtt'],
  },
  {
    title: 'VOD HLS ts with captions',
    src: 'https://wowzaec2demo.streamlock.net/vod-multitrack/_definst_/smil:ElephantsDream/elephantsdream2.smil/playlist.m3u8',
  },
  {
    title: 'VOD HLS ts',
    poster: 'https://teamplayer-static.uizacdn.net/01e137ad1b534004ad822035bf89b29f-static/2019/03/13/aaa8d4f0-1099-4064-a912-cd57e963fb70/thumbnail-10-8-720.jpeg',
    src: 'https://teamplayer-vod.uizacdn.net/01e137ad1b534004ad822035bf89b29f-stream/aaa8d4f0-1099-4064-a912-cd57e963fb70/package/playlist_ts.m3u8',
  },
  {
    title: 'VOD HLS fmp4',
    poster: 'https://teamplayer-static.uizacdn.net/01e137ad1b534004ad822035bf89b29f-static/2019/03/13/aaa8d4f0-1099-4064-a912-cd57e963fb70/thumbnail-10-8-720.jpeg',
    src: 'https://teamplayer-vod.uizacdn.net/01e137ad1b534004ad822035bf89b29f-stream/aaa8d4f0-1099-4064-a912-cd57e963fb70/package/playlist.m3u8',
  },
];

export default sources;
