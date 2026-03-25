#!/usr/bin/env node
// ══════════════════════════════════════════════════════
//  Starsight Engine Test Suite
//  Validates astronomical computation functions
//  Reference: JPL Horizons, Nautical Almanac
// ══════════════════════════════════════════════════════

const vm = require('vm');
const fs = require('fs');

// Load engine.js into a VM sandbox
const engineSrc = fs.readFileSync(__dirname + '/engine.js', 'utf8');
const sandbox = {
  Math, Date, console, NaN, Infinity, isNaN, parseFloat, parseInt,
  String, Number, Boolean, Array, Object, JSON, Error, RegExp,
  Map, Set, Symbol, Promise, undefined, isFinite,
};
vm.createContext(sandbox);
vm.runInContext(engineSrc, sandbox);

// Evaluate expression inside sandbox (keeps prototype chains intact)
function calc(expr) {
  return vm.runInContext(expr, sandbox);
}

let pass = 0, fail = 0;

function assert(cond, msg) {
  if (cond) { pass++; }
  else { fail++; console.log('  FAIL: ' + msg); }
}

function assertNear(val, expected, tol, msg) {
  const diff = Math.abs(val - expected);
  if (diff <= tol) { pass++; }
  else { fail++; console.log('  FAIL: ' + msg + ' | got ' + val.toFixed(4) + ', expected ' + expected.toFixed(4) + ' (diff ' + diff.toFixed(4) + ', tol ' + tol + ')'); }
}

// ── Julian Date ──
console.log('Julian Date');
(function() {
  const jd = calc('julianDate(new Date(Date.UTC(2000, 0, 1, 12, 0, 0)))');
  assertNear(jd, 2451545.0, 0.0001, 'J2000.0 epoch');
  const jd2 = calc('julianDate(new Date(Date.UTC(2026, 0, 1, 0, 0, 0)))');
  assertNear(jd2, 2461041.5, 0.0001, '2026-01-01 00:00 UTC');
})();

// ── GHA Aries ──
console.log('GHA Aries');
(function() {
  const gha = calc('ghaAries(new Date(Date.UTC(2026, 0, 1, 0, 0, 0)))');
  assertNear(gha, 100.1, 1.0, 'GHA Aries 2026-01-01');
})();

// ── Solar Position ──
console.log('Solar Position');
(function() {
  const sunDec = calc('solarPosition(new Date(Date.UTC(2026, 2, 20, 12, 0, 0))).dec');
  assertNear(sunDec, 0, 1.0, 'Sun dec near equinox');
  const sunDecS = calc('solarPosition(new Date(Date.UTC(2026, 5, 21, 12, 0, 0))).dec');
  assertNear(sunDecS, 23.44, 0.5, 'Sun dec near solstice');
})();

// ── Star Precession ──
console.log('Star Precession');
(function() {
  const sha = calc('precessStar(STARS.find(function(s){return s.n==="Sirius"}), new Date(Date.UTC(2026, 0, 1, 0, 0, 0))).sha');
  assertNear(sha, 258.6, 0.5, 'Sirius SHA 2026');
  const dec = calc('precessStar(STARS.find(function(s){return s.n==="Sirius"}), new Date(Date.UTC(2026, 0, 1, 0, 0, 0))).dec');
  assertNear(dec, -16.7, 0.3, 'Sirius Dec 2026');
})();

// ── Moon Position ──
console.log('Moon Position');
(function() {
  const hp = calc('moonPosition(new Date(Date.UTC(2026, 0, 1, 0, 0, 0))).HP');
  assert(hp > 50 && hp < 65, 'Moon HP in range: ' + hp.toFixed(1));
  const dec = calc('moonPosition(new Date(Date.UTC(2026, 0, 1, 0, 0, 0))).dec');
  assert(dec > -30 && dec < 30, 'Moon dec in range: ' + dec.toFixed(1));
})();

// ── Planet Positions ──
console.log('Planet Positions');
(function() {
  const vDec = calc('planetPosition("Venus", new Date(Date.UTC(2026, 0, 1, 0, 0, 0))).dec');
  assert(vDec > -30 && vDec < 30, 'Venus dec in range: ' + vDec.toFixed(1));
  const jDec = calc('planetPosition("Jupiter", new Date(Date.UTC(2026, 0, 1, 0, 0, 0))).dec');
  assert(jDec > -30 && jDec < 30, 'Jupiter dec in range: ' + jDec.toFixed(1));
})();

// ── Sight Reduction ──
console.log('Sight Reduction');
(function() {
  const hc = calc('reduce(30, 30, 0).Hc');
  assertNear(hc, 90, 0.01, 'Body at zenith');
  const hc2 = calc('reduce(0, 0, 90).Hc');
  assertNear(hc2, 0, 0.01, 'Body on equatorial horizon');
})();

// ── Refraction ──
console.log('Refraction');
(function() {
  const ref0 = calc('refraction(0)');
  assertNear(ref0, -29.0, 1.0, 'Refraction at horizon (Bennett)');
  const ref45 = calc('refraction(45)');
  assertNear(ref45, -1.0, 0.3, 'Refraction at 45 deg');
})();

// ── Direct Fix ──
console.log('Direct Fix');
(function() {
  // Synthetic test: compute sky from known position, take 3 star sights, verify fix
  const result = calc(`
    (function(){
      var utc = new Date(Date.UTC(2026, 5, 15, 4, 0, 0));
      var bodies = computeSky(34, -118, utc);
      var visible = bodies.filter(function(b){ return b.alt > 20 && b.alt < 70 && b.type === "star"; });
      if (visible.length < 3) return null;
      var sights = [];
      for (var i = 0; i < 3; i++) {
        var b = visible[i];
        var star = STARS.find(function(s){ return s.n === b.name; });
        sights.push({ ho: b.alt, utc: utc, star: precessStar(star, utc) });
      }
      return directFix(sights);
    })()
  `);
  assert(result !== null, 'Direct fix converged');
  if (result) {
    assertNear(result.lat, 34, 0.5, 'Fix latitude');
    assertNear(result.lon, -118, 0.5, 'Fix longitude');
  }
})();

// ── Plate Solving ──
console.log('Plate Solving');
(function() {
  const count = calc('buildTriangleIndex(STARS, 1.5).length');
  assert(count > 0, 'Triangle index has ' + count + ' entries');

  // Test with known star triangle: Sirius, Betelgeuse, Rigel
  const matched = calc(`
    (function(){
      var sirius = STARS.find(function(s){return s.n==="Sirius"});
      var betel = STARS.find(function(s){return s.n==="Betelgeuse"});
      var rigel = STARS.find(function(s){return s.n==="Rigel"});
      var d1 = starAngSep(sirius, betel);
      var d2 = starAngSep(sirius, rigel);
      var d3 = starAngSep(betel, rigel);
      var idx = buildTriangleIndex(STARS, 1.5);
      var matches = solveTriangle([d1, d2, d3], idx, 0.5);
      if (matches.length === 0) return null;
      return matches[0].names;
    })()
  `);
  assert(matched !== null, 'Plate solve found matches');
  if (matched) {
    const names = Array.from(matched);
    assert(
      names.includes('Sirius') && names.includes('Betelgeuse') && names.includes('Rigel'),
      'Plate solve correctly identified Sirius-Betelgeuse-Rigel: ' + names.join(', ')
    );
  }
})();

// ── Star Identification ──
console.log('Star Identification');
(function() {
  const result = calc(`
    (function(){
      var utc = new Date(Date.UTC(2026, 0, 15, 22, 0, 0));
      var bodies = computeSky(40, -74, utc);
      var sirius = bodies.find(function(b){return b.name==="Sirius"});
      if (!sirius || sirius.alt <= 0) return "skip";
      var found = identifyNearest(sirius.az, sirius.alt, bodies, 5);
      return found ? found.name : null;
    })()
  `);
  if (result === 'skip') {
    console.log('  SKIP: Sirius not visible at test time/location');
  } else {
    assert(result === 'Sirius', 'Correctly identified Sirius (got: ' + result + ')');
  }
})();

// ── Angular Separation ──
console.log('Angular Separation');
(function() {
  // Sirius to Betelgeuse: known separation ~27.1°
  const sep = calc(`
    starAngSep(
      STARS.find(function(s){return s.n==="Sirius"}),
      STARS.find(function(s){return s.n==="Betelgeuse"})
    )
  `);
  assertNear(sep, 27.1, 1.0, 'Sirius-Betelgeuse separation');
})();

// ── Summary ──
console.log('\n' + (pass + fail) + ' tests: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail > 0 ? 1 : 0);
