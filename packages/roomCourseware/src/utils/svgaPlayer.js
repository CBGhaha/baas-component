import { Player, Parser } from 'svgaplayerweb';

export default function svgaPlayer(el, svga) {

  const player = new Player(document.getElementById(el));
  const parse = new Parser();
  parse.load(svga, (videoItem) => {
    player.setVideoItem(videoItem);
    player.startAnimation();
  });
  return player;
}