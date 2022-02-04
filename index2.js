let canvasEl = document.createElement(`canvas`);
document.firstElementChild.appendChild(canvasEl);
window.onresize = () => {
  canvasEl.width = window.innerWidth * window.devicePixelRatio;
  canvasEl.height = window.innerHeight * window.devicePixelRatio;
  actualize();
}
let CTX = canvasEl.getContext(`2d`);
let actualize = () => {
  CTX.clearRect(0, 0, canvasEl.width, canvasEl.height)
  App();
};

let AppState = {
  currentMax: 11,
  baseW: 80,
  heightFactor: 0,
  lean: 0
};

window.onmousemove = (e) => {
  const [x, y] = [e.clientX, e.clientY];
  const scaleFactor = d3.scaleLinear().domain([canvasEl.height, 0]).range([0, 0.8]);
  const scaleLean = d3.scaleLinear().domain([0, canvasEl.width / 2, canvasEl.width]).range([0.5, 0, -0.5]);

  AppState.heightFactor = scaleFactor(y);
  AppState.lean = scaleLean(x);
  actualize();
}

let App = () => {
  Pythagoras({
    w: AppState.baseW,
    h: AppState.baseW,
    heightFactor: AppState.heightFactor,
    lean: AppState.lean,
    x: canvasEl.width / 2 - 40,
    y: canvasEl.height - AppState.baseW,
    lvl: 0,
    maxlvl: AppState.currentMax,
  });
}

const Pythagoras = ({ w, x, y, heightFactor, lean, left, right, lvl, maxlvl }) => {
  if (lvl >= maxlvl || w < 1) return;
  let nextRight = Math.sqrt((heightFactor * w) ** 2 + (w * (0.5 - lean)) ** 2);
  let nextLeft = Math.sqrt((heightFactor * w) ** 2 + (w * (0.5 + lean)) ** 2);
  let A = Math.atan((heightFactor * w) / ((0.5 + lean) * w)) * (180 / Math.PI);
  let B = Math.atan((heightFactor * w) / ((0.5 - lean) * w)) * (180 / Math.PI);
  CTX.save();
  CTX.translate(x, y);
  if (left) {
    //CTX.translate(0, w);
    CTX.rotate(-A);
    CTX.translate(0, -w);
  } else if (right) {
    //CTX.translate(w, w);
    CTX.rotate(B);
    CTX.translate(-w, -w);
  }
  CTX.fillStyle = `rgba(${255 / 11 * lvl}, 0, 0, 1)`
  CTX.beginPath();
  CTX.moveTo(0, 0);
  CTX.lineTo(0, w);
  CTX.lineTo(w, w);
  CTX.lineTo(w, 0);
  CTX.closePath();
  CTX.fill();
  //CTX.fillRect(0, 0, w, w);
  Pythagoras({
    w: nextLeft,
    x: 0,
    y: -nextLeft,
    lvl: lvl + 1,
    maxlvl: maxlvl,
    heightFactor: heightFactor,
    lean: lean,
    left: true,
  });
  Pythagoras({
    w: nextRight,
    x: w - nextRight,
    y: -nextRight,
    lvl: lvl + 1,
    maxlvl: maxlvl,
    heightFactor: heightFactor,
    lean: lean,
    right: true
  });
  CTX.restore();
};

window.onresize();