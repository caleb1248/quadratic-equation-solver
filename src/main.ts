import "./style.css";
import "./latinmodernmath.woff2";
import temml from "temml";
const { renderToString } = temml;

const aInput = document.getElementById("a") as HTMLInputElement;
const bInput = document.getElementById("b") as HTMLInputElement;
const cInput = document.getElementById("c") as HTMLInputElement;
const dInput = document.getElementById("d") as HTMLInputElement;

/**
 * Rounds a number to the nearest 1000th for display purposes
 */
function round(num: number) {
  return Math.round(num * 1000) / 1000;
}

/**
 * Solves equations in the form ax^2+bx+c=d. `a` is currently not supported and is equivalent to 1
 */
function* solve(b: number, c: number, d: number): Generator<string, void, string> {
  yield "Your Equation: " + renderToString(`x^2+${b}x+${c}=${d}`);
  yield "<h3 style='margin-bottom:-1rem;font-weight:400'>Steps</h3>";

  const bOver2 = b / 2;
  const bOver2Squared = bOver2 * bOver2;
  const difference = bOver2Squared - c;
  const newD = d + difference;
  yield renderToString(`x^2+${b}x+${c}=${d}`);
  yield renderToString(`x^2+${b}x+${bOver2Squared}=${newD}`);
  yield renderToString(`(x${bOver2 < 0 ? "-" : "+"}${Math.abs(bOver2)})^2=${newD}`);

  if (newD === 0) {
    yield renderToString(`x${bOver2 < 0 ? "-" : "+"}${Math.abs(bOver2)}=${newD}`);
    ("<h3 style='margin-bottom:-1rem;font-weight:400'>Solution</h3>");
    yield renderToString(`x=${-bOver2}`);
  } else if (newD < 0) {
    yield "The solutions are not real numbers";
  } else {
    const root = Math.sqrt(newD);
    const solutions = [root - bOver2, -root - bOver2].map(
      (solution) => Math.round(solution * 1000) / 1000
    );
    yield renderToString(`x${bOver2 < 0 ? "-" : "+"}${Math.abs(bOver2)}=\\pm\\sqrt{${newD}}`);
    yield renderToString(`x=${-bOver2}\\pm\\sqrt{${newD}}`);
    yield "<div><h3 style='margin-bottom:0;font-weight:400'>Solutions</h3>" +
      renderToString(`x=${solutions[0]}`) +
      " or " +
      renderToString(`x=${solutions[1]}`) +
      "</div>";
  }
}

function* solveWithA(a: number, b: number, c: number, d: number) {
  yield "Your Equation: " + renderToString(`${a}x^2+${b}x+${c}=${d}`);
  yield "<h3 style='margin-bottom:-1rem;font-weight:400'>Steps</h3>";

  if (a === 0) {
    yield "<span style='color:red'>Error: cannot divide by 0</span>";
    return;
  }

  const oldA = a;
  const oldB = b;
  a *= oldA;
  b *= oldA;
  c *= oldA;
  d *= oldA;

  yield renderToString(`${a}x^2+${b}x+${c}=${d}`);

  const bOver2A = oldB / 2; // Same as b/(2a)
  const newC = bOver2A * bOver2A;
  const difference = newC - c;
  d += difference;

  yield renderToString(`${a}x^2+${b}x+${newC}=${d}`);
  yield renderToString(`(${oldA}x${bOver2A < 0 ? "-" : "+"}${Math.abs(bOver2A)})^2=${d}`);
  const sqrtD = Math.sqrt(d);
  yield renderToString(`${oldA}x${bOver2A < 0 ? "-" : "+"}${Math.abs(bOver2A)}=\\pm\\sqrt{${d}}`);
  yield renderToString(`${oldA}x=${bOver2A}\\pm\\sqrt{${d}}`);
  yield renderToString(`x=\\frac{${-bOver2A}\\pm\\sqrt{${d}}}{${oldA}}`);
  const solutions = [(-bOver2A + sqrtD) / oldA, (-bOver2A - sqrtD) / oldA].map(round);
  yield "<div><h3 style='margin-bottom:0;font-weight:400'>Solutions</h3>" +
    renderToString(`x=${solutions[0]}`) +
    " or " +
    renderToString(`x=${solutions[1]}`) +
    "</div>";
}

function* solveWithQuadraticFormula(a: number, b: number, c: number, d: number) {
  c -= d;
  yield renderToString(`${a}x^2+${b}x+${c}=0`);
  //
  yield renderToString(`x=\\frac{-(${b})\\pm\\sqrt{(${b})^2-4(${a})(${c})}}{2(${a})}`);
  const bSquared = b * b;
  const fourAC = 4 * a * c;

  yield renderToString(
    `x=\\frac{${-b}\\pm\\sqrt{${bSquared}${fourAC < 0 ? "+" : "-"}${Math.abs(fourAC)}}}{${2 * a}}`
  );

  yield renderToString(`x=\\frac{${-b}\\pm\\sqrt{${bSquared - fourAC}}}{${2 * a}}`);

  const theSquareRoot = Math.sqrt(bSquared - fourAC);
  yield renderToString(`x=\\frac{${-b}\\pm${round(theSquareRoot)}}{${2 * a}}`);
  yield renderToString(`x=\\frac{${round(-b + theSquareRoot)}}{${2 * a}}`) +
    " or " +
    renderToString(`x=\\frac{${round(-b - theSquareRoot)}}{${2 * a}}`);

  yield renderToString(`x=${round((-b + theSquareRoot) / (2 * a))}`) +
    " or " +
    renderToString(`x=${round((-b - theSquareRoot) / (2 * a))}`);
}

for (const elem of Array.from(document.querySelectorAll("input"))) {
  elem.style.width = "0";
  elem.addEventListener("input", () => {
    elem.style.width = "0";
    elem.style.width = elem.scrollWidth + "px";
  });
}

document.getElementById("solve-button").addEventListener("click", (e) => {
  const aValue = aInput.value;
  const a = aValue.length ? parseInt(aValue) : 1;
  const bValue = bInput.value;
  const b = bValue.length ? parseInt(bValue) : 1;
  const c = parseInt(cInput.value || "0");
  const d = parseInt(dInput.value || "");
  if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
    return;
  }

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "<hr>";
  if (a === 1) {
    for (const output of solve(b, c, d)) {
      outputDiv.innerHTML += output + "<br>";
    }
  } else {
    for (const output of solveWithA(a, b, c, d)) {
      outputDiv.innerHTML += output + "<br>";
    }
  }

  outputDiv.innerHTML += "<h3 style='margin-bottom:0;font-weight:400'>Quadratic Formula</h3>";
  for (const output of solveWithQuadraticFormula(a, b, c, d)) {
    outputDiv.innerHTML += output + "<div style='height:20px'></div>";
  }
});
