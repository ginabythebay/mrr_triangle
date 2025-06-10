
/*
  Copyright Gina White 2025

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const fractionRe = /((\d+)\s+)?(\d+)\/(\d+)/;
const mmRe = /(\d+(\.\d+)?)\s*mm/;

function Inches(text) {
    /* Try parsing it as an int/float */
    let value = Number(text);
    if (value) {
        return value;
    }

    /* Try parsing it ias a fraction */
    let match = text.match(fractionRe);
    if (match) {
        let inches = Number(match[2]);
        if (!inches) {
            inches = 0;
        }
        const numerator = Number(match[3]);
        const denominator = Number(match[4]);
        return inches + numerator / denominator;
    }

    /* Try parsing it as mm */
    match = text.match(mmRe);

    if (match) {
        const mm = Number(match[1]);
        return mm / 25.4;
    }

    return 0;
}