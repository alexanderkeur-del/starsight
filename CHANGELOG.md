# Changelog

## 0.1.0 — 2026-03-25

Initial release.

### Features
- AR camera overlay with star, planet, and Moon identification
- Device orientation tracking (iOS + Android) for altitude and azimuth
- Compass calibration with lock-and-track for stable azimuth at all tilt angles
- Sight capture workflow with tap-to-cycle candidate selection
- Position fix via Gauss-Newton circle-of-position iteration
- GPS position cross-check with error display in nautical miles
- Plate-solving engine for blind star identification from angular separations
- Computation engine extracted from Celestial Navigator:
  - VSOP87 solar ephemeris
  - Standish planetary elements (Venus, Mars, Jupiter, Saturn)
  - Meeus Ch.45 lunar theory
  - 58 navigational stars (Hipparcos J2000 + proper motion + IAU precession)
  - Full Hs→Ho correction (refraction, dip, IE, parallax, semi-diameter)
  - Least-squares and direct fix computation
- Night vision: gamma-boosted grayscale camera processing for faint star enhancement
- Manual position entry for overlay calibration
- Azimuth trim control for fine compass alignment
- Demo mode (no camera/sensors) with simulated sky and drag navigation
- PWA with service worker for offline use
- HTTPS dev server with self-signed certificate generation
- 22 computation tests validated against reference data
