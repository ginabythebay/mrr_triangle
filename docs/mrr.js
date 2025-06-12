

/*
  Copyright Gina White 2025

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const possibleEvents = new Set(["input", "onpropertychange", "keyup", "change", "paste"]);

window.onload = function () {
  const diaInput = document.getElementById("dia")
  const sfmInput = document.getElementById("sfm")
  const flutesInput = document.getElementById("flutes")
  const iptInput = document.getElementById("ipt")
  const radialInput = document.getElementById("radial")
  const axialInput = document.getElementById("axial")

  const urlParams = new URLSearchParams(window.location.search);
  initValue(diaInput, urlParams, "dia")
  initValue(sfmInput, urlParams, "sfm")
  initValue(flutesInput, urlParams, "flutes")
  initValue(iptInput, urlParams, "ipt")
  initValue(radialInput, urlParams, "radial")
  initValue(axialInput, urlParams, "axial")

  const calculator = new Calculator(
      diaInput, sfmInput, flutesInput, iptInput, radialInput, axialInput);

    possibleEvents.forEach(function (eventName) {
      diaInput.addEventListener(eventName, function () {
        saveParam(diaInput, "dia")
        calculator.calc();
      });
      sfmInput.addEventListener(eventName, function () {
        saveParam(diaInput, "sfm")
        calculator.calc();
      });
      flutesInput.addEventListener(eventName, function () {
        saveParam(diaInput, "flutes")
        calculator.calc();
      });
      iptInput.addEventListener(eventName, function () {
        saveParam(diaInput, "ipt")
        calculator.calc();
      });
      radialInput.addEventListener(eventName, function () {
        saveParam(diaInput, "radial")
        calculator.calc();
      });
      axialInput.addEventListener(eventName, function () {
        saveParam(diaInput, "axial")
        calculator.calc();
      });
  });

  const resetBtn = document.getElementById("reset");
  resetBtn.addEventListener("click", function () {
    diaInput.value = "";
    sfmInput.value = "";
    flutesInput.value = "";
    iptInput.value = "";
    radialInput.value = "";
    axialInput.value = "";

    const url = new URL(window.location.href);
    url.searchParams.delete("dia");
    url.searchParams.delete("sfm");
    url.searchParams.delete("flutes");
    url.searchParams.delete("ipt");
    url.searchParams.delete("radial");
    url.searchParams.delete("axial");
    window.history.pushState({ path: url.href }, '', url.href);

    calculator.calc();
  })

  setTimeout(drawTriangle, 250);
  calculator.calc();
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
    const dia = Inches(this.diameterElement.value)
    const sfm = Inches(this.sfmElement.value);
    if (dia && sfm) {
      rpm = Math.round(3.8197 / dia * sfm);
      setLabel("rpm", rpm)
    } else {
      setLabel("rpm", "---")
    }

    let ipm = 0
    const flutes = Inches(this.flutesElement.value)
    const ipt = Inches(this.iptElement.value)
    if (rpm && flutes && ipt) {
      ipm = rpm * ipt * flutes
      setLabel("ipm", fixedDisplayNum(ipm, 1))
    } else {
      setLabel("ipm", "--")
    }

    const radial = Inches(this.radialElement.value)
    const axial = Inches(this.axialElement.value)
    if (radial && axial && ipm) {
      const mrr = radial * axial * ipm
      setLabel("mrr", fixedDisplayNum(mrr, 2))
    } else {
      setLabel("mrr", "---")
    }
  }
  return Calculator;
}();

function initValue(element, params, key) {
  if (params.has(key)) {
    element.value = params.get(key);
  }
}

function saveParam(element, key) {
  const url = new URL(window.location.href);
  let value = Inches(element.value)
  if (value) {
    url.searchParams.set(key, element.value);
  } else {
    url.searchParams.delete(key);
  }
  window.history.pushState({ path: url.href }, '', url.href);
}

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

function offsetRect(r, offset) {
  return {
    left: r.left - offset.left,
    top: r.top - offset.top,
    right: r.right - offset.left,
    bottom: r.bottom - offset.top,
  }
}

function setLine(line, from, to) {
   const dStr =
      "M" +
      (from.x      ) + "," + (from.y) + " " +
      "L" +
      (to.x      ) + "," + (to.y);
  line.setAttribute("d", dStr);
}

function drawTriangle() {
  const divIpm       = document.querySelector("#ipm_pair");
  const divRadial       = document.querySelector("#radial_pair");
  const divAxial       = document.querySelector("#axial_pair");

  const arrowLeft = document.querySelector("#arrowLeft");
  const arrowRight = document.querySelector("#arrowRight");
  const arrowCenter = document.querySelector("#arrowCenter");

  let ipmRect = divIpm.getBoundingClientRect();
  let radialRect = divRadial.getBoundingClientRect();
  let axialRect = divAxial.getBoundingClientRect();

  const containerRect = document.querySelector("#container").getBoundingClientRect()
  ipmRect = offsetRect(ipmRect, containerRect)
  radialRect = offsetRect(radialRect, containerRect)
  axialRect = offsetRect(axialRect, containerRect)
  const posnIpmBtmLeft = {
    x: ((ipmRect.right + ipmRect.left)/2 - 32),
    y: ipmRect.bottom + 16
  };
  const posnIpmBtmRight = {
    x: ((ipmRect.right + ipmRect.left)/2) + 32,
    y: ipmRect.bottom + 16
  };
  const posnRadialTop = {
    x: (radialRect.left + radialRect.right) / 2,
    y: radialRect.top - 48,
  };
  const posnAxialTop = {
    x: (axialRect.right + axialRect.left) / 2,
    y: axialRect.top - 48,
  }
  const posnRadialRight = {
    x: radialRect.right + 16,
    y: ((radialRect.bottom + radialRect.top) / 2) - 8,
  }
  const posnAxialLeft = {
    x: axialRect.left - 16,
    y: ((axialRect.bottom + axialRect.top) / 2) - 8,
  }

  setLine(arrowLeft, posnRadialTop, posnIpmBtmLeft)
  setLine(arrowRight, posnAxialTop, posnIpmBtmRight)
  setLine(arrowCenter, posnRadialRight, posnAxialLeft)
  const dStrCenter =
      "M" +
      (posnRadialRight.x      ) + "," + (posnRadialRight.y) + " " +
      "L" +
      (posnAxialLeft.x      ) + "," + (posnAxialLeft.y);
  arrowCenter.setAttribute("d", dStrCenter);
}