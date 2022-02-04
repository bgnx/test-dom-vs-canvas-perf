let h = React.createElement;

let actualize = () => {
  ReactDOM.render(h(App), document.firstElementChild);
};

let AppState = {
  currentMax: 11,
  baseW: 80,
  heightFactor: 0,
  lean: 0
};

window.onmousemove = (e) => {
  const [x, y] = [e.clientX, e.clientY];
  const scaleFactor = d3.scaleLinear().domain([window.innerHeight, 0]).range([0, 0.8]);
  const scaleLean = d3.scaleLinear().domain([0, window.innerWidth / 2, window.innerWidth]).range([0.5, 0, -0.5]);

  AppState.heightFactor = scaleFactor(y);
  AppState.lean = scaleLean(x);
  actualize();
}

let App = () => {
  return h(`svg`, { width: window.innerWidth, height: window.innerHeight }, Pythagoras({
    w: AppState.baseW,
    h: AppState.baseW,
    heightFactor: AppState.heightFactor,
    lean: AppState.lean,
    x: window.innerWidth / 2 - 40,
    y: window.innerHeight - AppState.baseW,
    lvl: 0,
    maxlvl: AppState.currentMax,
  }));
}

const Pythagoras = ({ w, x, y, heightFactor, lean, left, right, lvl, maxlvl }) => {
  if (lvl >= maxlvl || w < 1) return null;

  let nextRight = Math.sqrt((heightFactor * w) ** 2 + (w * (0.5 - lean)) ** 2);
  let nextLeft = Math.sqrt((heightFactor * w) ** 2 + (w * (0.5 + lean)) ** 2);
  let A = Math.atan((heightFactor * w) / ((0.5 + lean) * w)) * (180 / Math.PI);
  let B = Math.atan((heightFactor * w) / ((0.5 - lean) * w)) * (180 / Math.PI);

  return h(`g`, { transform: `translate(${x} ${y}) ${left ? `rotate(${-A} 0 ${w})` : right ? `rotate(${B} ${w} ${w})` : ``}` },
    h(`rect`, { width: w, height: w, x: 0, y: 0, style: { fill: `rgba(${255 / 11 * lvl}, 0, 0, 1)` } }),
    Pythagoras({
      w: nextLeft,
      x: 0,
      y: -nextLeft,
      lvl: lvl + 1,
      maxlvl: maxlvl,
      heightFactor: heightFactor,
      lean: lean,
      left: true,
    }),
    Pythagoras({
      w: nextRight,
      x: w - nextRight,
      y: -nextRight,
      lvl: lvl + 1,
      maxlvl: maxlvl,
      heightFactor: heightFactor,
      lean: lean,
      right: true
    })
  );
};

actualize();