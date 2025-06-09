

const possibleEvents = new Set(["input", "onpropertychange", "keyup", "change", "paste"]);

window.onload = function () {
  const diaInput = document.getElementById("dia")
  const sfmInput = document.getElementById("sfm")
  const flutesInput = document.getElementById("flutes")
  const iptInput = document.getElementById("ipt")
  debugger;
  const radialInput = document.getElementById("radial")
  const axialInput = document.getElementById("axial")
  const calculator = new Calculator(
      diaInput, sfmInput, flutesInput, iptInput, radialInput, axialInput);
  setLabel("rpm", "---")
    possibleEvents.forEach(function (eventName) {
      diaInput.addEventListener(eventName, function () {
        calculator.calc();
      });
      sfmInput.addEventListener(eventName, function () {
        calculator.calc();
      });
      flutesInput.addEventListener(eventName, function () {
        calculator.calc();
      });
      iptInput.addEventListener(eventName, function () {
        calculator.calc();
      });
      radialInput.addEventListener(eventName, function () {
        calculator.calc();
      });
      axialInput.addEventListener(eventName, function () {
        calculator.calc();
      });
  });

}

const Calculator =
/** @class */
function () {
  function Calculator(diameterElement,
                      sfmElement,
                      flutesElement,
                      iptElement,
                      radialElement,
                      axialElement) {
    this.diameterElement = diameterElement;
    this.sfmElement = sfmElement;
    this.flutesElement = flutesElement;
    this.iptElement = iptElement;
    this.radialElement = radialElement;
    this.axialElement = axialElement;
  }

  Calculator.prototype.calc = function () {
    let rpm = 0
    const dia = Number(this.diameterElement.value)
    const sfm = Number(this.sfmElement.value);
    if (dia && sfm) {
      rpm = Math.round(3.8197 / dia * sfm);
      setLabel("rpm", rpm)
    }

    let ipm = 0
    const flutes = Number(this.flutesElement.value)
    const ipt = Number(this.iptElement.value)
    if (rpm && flutes && ipt) {
      ipm = rpm * ipt * flutes
      setLabel("ipm", fixedDisplayNum(ipm, 1))
    } else {
      setLabel("ipm", "--")
    }

    const radial = Number(this.radialElement.value)
    const axial = Number(this.axialElement.value)
    if (radial && axial && ipm) {
      const mrr = radial * axial * ipm
      setLabel("mrr", fixedDisplayNum(mrr, 2))
    }
  }
  return Calculator;
}();

function fixedDisplayNum(value, precision) {
  if (Number.isNaN(value) || value === Infinity || !value) {
    return "--";
  } else {
    return value.toFixed(precision);
  }
}


function setLabel(id, value) {
  const output = document.getElementById(id);
  output.innerHTML = String(value);
}
