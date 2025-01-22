import "./style.css";
import "./latinmodernmath.woff2";
import temml from "temml";
const { renderToString } = temml;
/**
 * Solves equations in the form ax^2+bx+c=d. `a` is currently not supported and is equivalent to 1
 */
function* solve(
  /**@type {number}*/ a,
  /**@type {number}*/ b,
  /**@type {number}*/ c,
  /**@type {number}*/ d
) {
  if(a === 0) {
    yield "<span style='color:red'>Error: cannot divide by 0</span>";
    return;
  }
  
  yield "Your Equation: " + renderToString(`${a===1?"":a}x^2+${b}x+${c}=${d}`);
  yield "<h3 style='margin-bottom:-1rem;font-weight:400'>Steps</h3>";
  b/=a;
  c/=a;
  d/=a;
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

for (const elem of document.querySelectorAll("input")) {
  elem.style.width = "0";
  elem.addEventListener("input", () => {
    elem.style.width = "0";
    elem.style.width = elem.scrollWidth + "px";
  });
}

document.getElementById("solve-button").addEventListener("click", (e) => {
  const aValue = document.getElementById("a").value;
  const a = aValue.length?parseInt(aValue):1;
  const bValue = document.getElementById("b").value;
  const b = bValue.length?parseInt(bValue):1
  const c = parseInt(document.getElementById("c").value || 0);
  const d = parseInt(document.getElementById("d").value || 0);
  if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
    return;
  }

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "<hr>";
  for (const output of solve(a, b, c, d)) {
    outputDiv.innerHTML += output + "<br>";
  }
});
