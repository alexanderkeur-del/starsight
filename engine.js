// ══════════════════════════════════════════════════════
//  STARSIGHT ENGINE
//  Astronomical computation extracted from Celestial Navigator
//  Ephemeris, correction, sight reduction, fix computation
// ══════════════════════════════════════════════════════

// 58 Navigational Stars — Hipparcos J2000.0 coordinates
// ra0: right ascension (degrees), dec0: declination (degrees)
// pmR/pmD: proper motion in RA/Dec (arcsec/year)
const STARS = [
  {n:"Acamar",      ra0:44.565,  dec0:-40.305, pmR:-0.0035, pmD:-0.078, mag:3.2},
  {n:"Achernar",    ra0:24.429,  dec0:-57.237, pmR:0.088,   pmD:-0.040, mag:0.5},
  {n:"Acrux",       ra0:186.650, dec0:-63.099, pmR:-0.035,  pmD:-0.012, mag:0.8},
  {n:"Adhara",      ra0:104.656, dec0:-28.972, pmR:0.003,   pmD:0.002,  mag:1.5},
  {n:"Aldebaran",   ra0:68.980,  dec0:16.509,  pmR:0.063,   pmD:-0.190, mag:0.9},
  {n:"Alioth",      ra0:193.507, dec0:55.960,  pmR:0.111,   pmD:-0.009, mag:1.8},
  {n:"Alkaid",      ra0:206.885, dec0:49.313,  pmR:-0.121,  pmD:-0.015, mag:1.9},
  {n:"Alnair",      ra0:332.058, dec0:-46.961, pmR:0.127,   pmD:-0.148, mag:1.7},
  {n:"Alnilam",     ra0:84.053,  dec0:-1.202,  pmR:0.001,   pmD:-0.001, mag:1.7},
  {n:"Alphard",     ra0:141.897, dec0:-8.659,  pmR:-0.014,  pmD:0.033,  mag:2.0},
  {n:"Alphecca",    ra0:233.672, dec0:26.715,  pmR:0.121,   pmD:-0.089, mag:2.2},
  {n:"Alpheratz",   ra0:2.097,   dec0:29.090,  pmR:0.136,   pmD:-0.163, mag:2.1},
  {n:"Altair",      ra0:297.696, dec0:8.868,   pmR:0.536,   pmD:0.386,  mag:0.8},
  {n:"Ankaa",       ra0:6.571,   dec0:-42.306, pmR:0.233,   pmD:-0.356, mag:2.4},
  {n:"Antares",     ra0:247.352, dec0:-26.432, pmR:-0.010,  pmD:-0.023, mag:1.1},
  {n:"Arcturus",    ra0:213.915, dec0:19.182,  pmR:-1.094,  pmD:-1.999, mag:-0.1},
  {n:"Atria",       ra0:252.166, dec0:-69.028, pmR:0.018,   pmD:-0.032, mag:1.9},
  {n:"Avior",       ra0:125.628, dec0:-59.509, pmR:-0.025,  pmD:0.014,  mag:1.9},
  {n:"Bellatrix",   ra0:81.283,  dec0:6.350,   pmR:-0.009,  pmD:-0.013, mag:1.6},
  {n:"Betelgeuse",  ra0:88.793,  dec0:7.407,   pmR:0.027,   pmD:0.011,  mag:0.5},
  {n:"Canopus",     ra0:95.988,  dec0:-52.696, pmR:0.019,   pmD:0.024,  mag:-0.7},
  {n:"Capella",     ra0:79.172,  dec0:45.998,  pmR:0.075,   pmD:-0.427, mag:0.1},
  {n:"Deneb",       ra0:310.358, dec0:45.280,  pmR:0.002,   pmD:0.002,  mag:1.3},
  {n:"Denebola",    ra0:177.265, dec0:14.572,  pmR:-0.499,  pmD:-0.114, mag:2.1},
  {n:"Diphda",      ra0:10.897,  dec0:-17.987, pmR:0.233,   pmD:0.032,  mag:2.0},
  {n:"Dubhe",       ra0:165.932, dec0:61.751,  pmR:-0.137,  pmD:-0.035, mag:1.8},
  {n:"Elnath",      ra0:81.573,  dec0:28.607,  pmR:0.023,   pmD:-0.175, mag:1.7},
  {n:"Eltanin",     ra0:269.152, dec0:51.489,  pmR:-0.008,  pmD:-0.023, mag:2.2},
  {n:"Enif",        ra0:326.046, dec0:9.875,   pmR:0.026,   pmD:-0.001, mag:2.4},
  {n:"Fomalhaut",   ra0:344.413, dec0:-29.622, pmR:0.329,   pmD:-0.165, mag:1.2},
  {n:"Gacrux",      ra0:187.791, dec0:-57.113, pmR:0.027,   pmD:-0.264, mag:1.6},
  {n:"Gienah",      ra0:183.952, dec0:-17.542, pmR:-0.159,  pmD:0.023,  mag:2.6},
  {n:"Hadar",       ra0:210.956, dec0:-60.373, pmR:-0.033,  pmD:-0.024, mag:0.6},
  {n:"Hamal",       ra0:31.793,  dec0:23.463,  pmR:0.188,   pmD:-0.148, mag:2.1},
  {n:"Kaus Aus.",   ra0:276.043, dec0:-34.385, pmR:-0.039,  pmD:-0.124, mag:1.9},
  {n:"Kochab",      ra0:222.677, dec0:74.156,  pmR:-0.032,  pmD:0.012,  mag:2.1},
  {n:"Markab",      ra0:346.190, dec0:15.205,  pmR:0.061,   pmD:-0.043, mag:2.5},
  {n:"Menkar",      ra0:45.570,  dec0:4.090,   pmR:-0.006,  pmD:-0.078, mag:2.5},
  {n:"Menkent",     ra0:211.671, dec0:-36.370, pmR:-0.519,  pmD:-0.518, mag:2.1},
  {n:"Miaplacidus", ra0:138.300, dec0:-69.717, pmR:-0.156,  pmD:0.108,  mag:1.7},
  {n:"Mirfak",      ra0:51.081,  dec0:49.861,  pmR:0.024,   pmD:-0.026, mag:1.8},
  {n:"Nunki",       ra0:283.816, dec0:-26.297, pmR:0.013,   pmD:-0.054, mag:2.1},
  {n:"Peacock",     ra0:306.412, dec0:-56.735, pmR:0.007,   pmD:-0.086, mag:1.9},
  {n:"Polaris",     ra0:37.955,  dec0:89.264,  pmR:0.044,   pmD:-0.012, mag:2.0},
  {n:"Pollux",      ra0:116.329, dec0:28.026,  pmR:-0.625,  pmD:-0.046, mag:1.2},
  {n:"Procyon",     ra0:114.826, dec0:5.225,   pmR:-0.715,  pmD:-1.037, mag:0.4},
  {n:"Rasalhague",  ra0:263.734, dec0:12.560,  pmR:0.109,   pmD:-0.226, mag:2.1},
  {n:"Regulus",     ra0:152.093, dec0:11.967,  pmR:-0.249,  pmD:0.006,  mag:1.4},
  {n:"Rigel",       ra0:78.634,  dec0:-8.202,  pmR:0.001,   pmD:-0.001, mag:0.1},
  {n:"Rigil Kent",  ra0:219.902, dec0:-60.834, pmR:-3.679,  pmD:0.474,  mag:-0.3},
  {n:"Sabik",       ra0:257.595, dec0:-15.725, pmR:0.041,   pmD:0.097,  mag:2.4},
  {n:"Schedar",     ra0:10.127,  dec0:56.537,  pmR:0.050,   pmD:-0.033, mag:2.2},
  {n:"Shaula",      ra0:263.402, dec0:-37.104, pmR:-0.008,  pmD:-0.030, mag:1.6},
  {n:"Sirius",      ra0:101.287, dec0:-16.716, pmR:-0.546,  pmD:-1.223, mag:-1.5},
  {n:"Spica",       ra0:201.298, dec0:-11.161, pmR:-0.042,  pmD:-0.031, mag:1.0},
  {n:"Suhail",      ra0:136.999, dec0:-43.433, pmR:-0.024,  pmD:0.014,  mag:2.2},
  {n:"Vega",        ra0:279.235, dec0:38.784,  pmR:0.201,   pmD:0.286,  mag:0.0},
  {n:"Zubenelg.",   ra0:222.720, dec0:-16.042, pmR:-0.106,  pmD:-0.069, mag:2.8},
];

const PLANET_NAMES={venus:'Venus',mars:'Mars',jupiter:'Jupiter',saturn:'Saturn'};
const PLANET_MAGS={venus:-4.0,mars:0.0,jupiter:-2.5,saturn:0.5};

// ══════════════════════════════════════════════════════
//  MATH HELPERS
// ══════════════════════════════════════════════════════
const R=Math.PI/180, D=180/Math.PI;
const mod360=x=>((x%360)+360)%360;
const sin=x=>Math.sin(x*R), cos=x=>Math.cos(x*R), asin=x=>Math.asin(x)*D, acos=x=>Math.acos(Math.max(-1,Math.min(1,x)))*D;

// ══════════════════════════════════════════════════════
//  ASTRONOMICAL FUNCTIONS
// ══════════════════════════════════════════════════════

function julianDate(d){
  let Y=d.getUTCFullYear(),M=d.getUTCMonth()+1,D2=d.getUTCDate();
  const h=d.getUTCHours()+d.getUTCMinutes()/60+d.getUTCSeconds()/3600;
  if(M<=2){Y--;M+=12;}
  const A=Math.floor(Y/100),B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(Y+4716))+Math.floor(30.6001*(M+1))+D2+B-1524.5+h/24;
}

// ══════════════════════════════════════════════════════
//  NUTATION — top 5 IAU 1980 terms (Meeus Ch. 22)
// ══════════════════════════════════════════════════════
function nutation(date){
  const JD=julianDate(date);
  const T=(JD-2451545.0)/36525;
  const omega=mod360(125.04452-1934.136261*T);
  const Ls=mod360(280.4665+36000.7698*T);
  const Dm=mod360(297.8502+445267.1115*T);
  const F=mod360(93.2721+483202.0175*T);
  const oR=omega*R, LsR=Ls*R, DR=Dm*R, FR=F*R;
  const dpsi=(-17.20*Math.sin(oR)
              -1.32*Math.sin(2*(FR-DR+oR))
              -0.23*Math.sin(2*(FR+oR))
              +0.21*Math.sin(2*oR)
              +0.14*Math.sin(LsR))/3600;
  const deps=(9.20*Math.cos(oR)
             +0.57*Math.cos(2*(FR-DR+oR))
             +0.10*Math.cos(2*(FR+oR))
             -0.09*Math.cos(2*oR))/3600;
  return{dpsi,deps};
}

function ghaAries(date){
  const JD=julianDate(date);
  const dJ=JD-2451545.0;
  const T=dJ/36525;
  const gha=280.46061837+360.98564736629*dJ+0.000387933*T*T-T*T*T/38710000;
  const nut=nutation(date);
  const eps=(23.439291-0.013004*T+nut.deps)*R;
  return mod360(gha+nut.dpsi*Math.cos(eps));
}

function precessStar(star,date){
  const JD=julianDate(date);
  const T=(JD-2451545.0)/36525;
  const yr=T*100;
  const ra0=star.ra0+star.pmR/3600*yr/Math.cos(star.dec0*R);
  const dec0=star.dec0+star.pmD/3600*yr;
  const zA =(2306.2181*T+1.09468*T*T+0.018203*T*T*T)/3600*R;
  const zB =(2306.2181*T+0.30188*T*T+0.017998*T*T*T)/3600*R;
  const th =(2004.3109*T-0.42665*T*T-0.041833*T*T*T)/3600*R;
  const raR=ra0*R, decR=dec0*R;
  const x0=Math.cos(decR)*Math.cos(raR);
  const y0=Math.cos(decR)*Math.sin(raR);
  const z0=Math.sin(decR);
  const cosZA=Math.cos(zA),sinZA=Math.sin(zA);
  const cosZB=Math.cos(zB),sinZB=Math.sin(zB);
  const cosTh=Math.cos(th),sinTh=Math.sin(th);
  const x1= cosZB*x0-sinZB*y0;
  const y1= sinZB*x0+cosZB*y0;
  const z1=z0;
  const x2=cosTh*x1-sinTh*z1;
  const y2=y1;
  const z2=sinTh*x1+cosTh*z1;
  const x3= cosZA*x2-sinZA*y2;
  const y3= sinZA*x2+cosZA*y2;
  const z3=z2;
  const dec=Math.asin(Math.max(-1,Math.min(1,z3)))*D;
  const ra=mod360(Math.atan2(y3,x3)*D);
  const nut=nutation(date);
  const eps0=23.439291-0.013004*T;
  const eps=(eps0+nut.deps)*R;
  const raR2=ra*R, decR2=dec*R;
  const dRA=nut.dpsi*(Math.cos(eps)+Math.sin(eps)*Math.sin(raR2)*Math.tan(decR2))
            -nut.deps*Math.cos(raR2)*Math.tan(decR2);
  const dDec=nut.dpsi*Math.sin(eps)*Math.cos(raR2)+nut.deps*Math.sin(raR2);
  const raF=mod360(ra+dRA);
  const decF=dec+dDec;
  return{sha:mod360(360-raF), dec:decF, ra:raF};
}

function ghaStar(star,date){
  const p=precessStar(star,date);
  return mod360(ghaAries(date)+p.sha);
}
function lhaStar(star,date,lonE){return mod360(ghaStar(star,date)+lonE);}

// Solar position — VSOP87 truncation (Meeus Ch.25)
function solarPosition(date){
  const JD=julianDate(date);
  const T=(JD-2451545.0)/36525;
  const tau=T/10;
  function vSum(terms){let s=0;for(const[A,B,C]of terms)s+=A*Math.cos(B+C*tau);return s;}
  const L0=vSum([
    [175347046,0,0],[3341656,4.6693,6283.0758],[34894,4.6261,12566.1517],
    [3497,2.7441,5507.5534],[3418,2.8289,3.5232],[3136,3.6277,77713.7715],
    [2676,4.4182,7860.4194],[2343,6.1352,3930.2097],[1324,0.7425,11506.7698],
    [1273,2.0371,529.6910],[1199,1.1096,1577.3435],[990,5.2327,5884.9268],
    [902,2.0450,26.2983],[857,3.5085,398.1490],[780,1.1788,5223.6939],
    [753,2.5332,5507.5534],[505,4.5827,18849.2275],[492,4.2051,775.5226],
    [357,2.9198,0.0671],[317,5.8490,11790.6291],[284,1.8987,796.2983],
    [271,0.3148,10977.0788],[243,0.3449,5486.7778],[206,4.8065,2544.3144],
    [205,1.8695,5573.1428],[202,2.4584,6069.7768],[156,0.8331,213.2991],
    [132,3.4112,2942.4634],[126,1.0830,20.7754],[115,0.6454,0.9803],
    [103,0.6360,4694.0030],[99,6.210,2146.165],[98,0.680,155.420],
    [86,5.980,161000.686],[85,1.300,6275.962],[85,3.670,71430.696],
    [80,1.810,17260.155],
  ]);
  const L1=vSum([
    [628331966747,0,0],[206059,2.6781,6283.0758],[4303,2.6351,12566.1517],
    [425,1.590,3.523],[119,5.796,26.298],[109,2.966,1577.344],
    [93,2.59,18849.23],[72,1.14,529.69],[68,1.87,398.15],
    [67,4.41,5507.55],[59,2.89,5223.69],[56,2.17,155.42],
    [45,0.40,796.30],[36,0.47,775.52],[29,2.65,7.11],[21,5.34,0.98],
  ]);
  const L2=vSum([
    [52919,0,0],[8720,1.0721,6283.0758],[309,0.867,12566.152],
    [27,0.05,3.52],[16,5.19,26.30],
  ]);
  const L3=vSum([[289,5.844,6283.076],[35,0,0],[17,5.49,12566.15]]);
  const L4=vSum([[114,3.142,0],[8,4.13,6283.08],[1,3.84,12566.15]]);
  const L5=vSum([[1,3.14,0]]);
  let Lrad=(L0+L1*tau+L2*tau*tau+L3*tau*tau*tau+L4*Math.pow(tau,4)+L5*Math.pow(tau,5))*1e-8;
  let sunLong=mod360(Lrad*D+180);
  const omega2=(176.002+12036.266*tau)*R;
  sunLong-=(0.03916*(Math.cos(omega2)-Math.sin(omega2)))/3600;
  sunLong-=20.4898/3600;
  const nut=nutation(date);
  sunLong+=nut.dpsi;
  const eps0=23.439291-0.013004*T-1.64e-7*T*T+5.04e-7*T*T*T;
  const eps=eps0+nut.deps;
  const lamR=sunLong*R, epsR=eps*R;
  const ra=mod360(Math.atan2(Math.cos(epsR)*Math.sin(lamR),Math.cos(lamR))*D);
  const dec=Math.asin(Math.sin(epsR)*Math.sin(lamR))*D;
  const sha=mod360(360-ra);
  return{ra,dec,sha,gha:mod360(ghaAries(date)-ra),lambda:sunLong};
}

// Planetary positions — Standish (1992) mean elements
const PLANET_ELEMS={
  Venus:  {L0:181.97973,Ld:58517.81539,a:0.72333199,e0:0.00677323,ed:-0.00004938,i0:3.39471,id:-0.00163,O0:76.68069, Od:0.90174, w0:131.53298,wd:0.00864},
  Mars:   {L0:355.45332,Ld:19140.30268,a:1.52366231,e0:0.09341233,ed:0.00011902, i0:1.85061,id:-0.00652,O0:49.57854, Od:0.77099, w0:336.04084,wd:1.84073},
  Jupiter:{L0:34.40438, Ld:3034.90567, a:5.20336301,e0:0.04839266,ed:-0.00012880,i0:1.30530,id:-0.00186,O0:100.55615,Od:1.01744, w0:14.75385, wd:0.16174},
  Saturn: {L0:49.94432, Ld:1222.11494, a:9.53707032,e0:0.05415060,ed:-0.00036762,i0:2.48446,id:0.00193, O0:113.71504,Od:0.87594, w0:92.43194, wd:0.16675},
  Earth:  {L0:100.46435,Ld:36000.76983,a:1.00000011,e0:0.01671022,ed:-0.00003804,i0:0.00005,id:-0.01294,O0:-11.26064,Od:0.18203, w0:102.94719,wd:0.32327},
};

function helioPos(el,T){
  const L=mod360(el.L0+el.Ld*T);
  const e=el.e0+el.ed*T;
  const i=el.i0+el.id*T;
  const Om=mod360(el.O0+el.Od*T);
  const pomega=mod360(el.w0+el.wd*T);
  const M=mod360(L-pomega)*R;
  const omega=(pomega-Om)*R;
  let E=M;
  for(let j=0;j<15;j++){
    const dE=(M-E+e*Math.sin(E))/(1-e*Math.cos(E));
    E+=dE;
    if(Math.abs(dE)<1e-12)break;
  }
  const nu=2*Math.atan2(Math.sqrt(1+e)*Math.sin(E/2),Math.sqrt(1-e)*Math.cos(E/2));
  const r=el.a*(1-e*Math.cos(E));
  const u=omega+nu;
  const xp=r*Math.cos(u), yp=r*Math.sin(u);
  const OmR=Om*R, iR=i*R;
  const cO=Math.cos(OmR),sO=Math.sin(OmR),cI=Math.cos(iR),sI=Math.sin(iR);
  return{
    x:cO*xp-sO*cI*yp,
    y:sO*xp+cO*cI*yp,
    z:sI*yp
  };
}

function planetPosition(name,date){
  const JD=julianDate(date);
  const T=(JD-2451545.0)/36525;
  const p=helioPos(PLANET_ELEMS[name],T);
  const e=helioPos(PLANET_ELEMS.Earth,T);
  const X=p.x-e.x, Y=p.y-e.y, Z=p.z-e.z;
  let lam=Math.atan2(Y,X);
  const bet=Math.atan2(Z,Math.sqrt(X*X+Y*Y));
  const pA=(5029.0966*T+2.22226*T*T)/3600*R;
  lam+=pA;
  const nut=nutation(date);
  lam+=nut.dpsi*R;
  const eps0=23.439291-0.013004*T;
  const eps=(eps0+nut.deps)*R;
  const ra=mod360(Math.atan2(Math.sin(lam)*Math.cos(eps)-Math.tan(bet)*Math.sin(eps),Math.cos(lam))*D);
  const dec=Math.asin(Math.sin(bet)*Math.cos(eps)+Math.cos(bet)*Math.sin(eps)*Math.sin(lam))*D;
  const sha=mod360(360-ra);
  return{ra,dec,sha,gha:mod360(ghaAries(date)-ra)};
}

// Moon position — Meeus Ch.45 simplified lunar theory
function moonPosition(date){
  const JD=julianDate(date);
  const T=(JD-2451545.0)/36525;
  const Lp=mod360(218.3165+481267.8813*T);
  const Dm=mod360(297.8502+445267.1115*T);
  const M =mod360(357.5291+35999.0503*T);
  const Mp=mod360(134.9634+477198.8676*T);
  const F =mod360(93.2721+483202.0175*T);
  const A1=mod360(119.75+131.849*T);
  const A2=mod360(53.09+479264.290*T);
  const A3=mod360(313.45+481266.484*T);
  const E=1-0.002516*T-0.0000074*T*T;
  const E2=E*E;
  const LR=[
    [0,0,1,0, 6288774,-20905355],[2,0,-1,0, 1274027,-3699111],[2,0,0,0, 658314,-2955968],
    [0,0,2,0, 213618,-569925],[0,1,0,0, -185116,48888],[0,0,0,2, -114332,-3149],
    [2,0,-2,0, 58793,246158],[2,-1,-1,0, 57066,-152138],[2,0,1,0, 53322,-170733],
    [2,-1,0,0, 45758,-204586],[0,1,-1,0, -40923,-129620],[1,0,0,0, -34720,108743],
    [0,1,1,0, -30383,104755],[2,0,0,-2, 15327,10321],[0,0,1,2, -12528,0],
    [0,0,1,-2, 10980,79661],[4,0,-1,0, 10675,-34782],[0,0,3,0, 10034,-23210],
    [4,0,-2,0, 8548,-21636],[2,1,-1,0, -7888,24208],[2,1,0,0, -6766,30824],
    [1,0,-1,0, -5163,-8379],[1,1,0,0, 4987,-16675],[2,-1,1,0, 4036,-12831],
    [2,0,2,0, 3994,-10445],[4,0,0,0, 3861,-11650],[2,0,-3,0, 3665,14403],
    [0,1,-2,0, -2689,-7003],[2,0,-1,2, -2602,0],[2,-1,-2,0, 2390,10056],
    [1,0,1,0, -2348,6322],[2,-2,0,0, 2236,-9884],[0,1,2,0, -2120,5751],
    [0,2,0,0, -2069,0],[2,-2,-1,0, 2048,-4950],[2,0,1,-2, -1773,4130],
    [2,0,0,2, -1595,0],[4,-1,-1,0, 1215,-3958],[0,0,2,2, -1110,0],
    [3,0,-1,0, -892,3258],[2,1,1,0, -810,2616],[4,-1,-2,0, 759,-1897],
    [0,2,-1,0, -713,-2117],[2,2,-1,0, -700,2354],[2,1,-2,0, 691,0],
    [2,-1,0,-2, 596,0],[4,0,1,0, 549,-1423],[0,0,4,0, 537,-1117],
    [4,-1,0,0, 520,-1571],[1,0,-2,0, -487,-1739],[2,1,0,-2, -399,0],
    [0,0,2,-2, -381,-4421],[1,1,1,0, 351,0],[3,0,-2,0, -340,0],
    [4,0,-3,0, 330,0],[2,-1,2,0, 327,0],[0,2,1,0, -323,1165],
    [1,1,-1,0, 299,0],[2,0,3,0, 294,0],[2,0,-1,-2, 0,8752],
  ];
  const B=[
    [0,0,0,1, 5128122],[0,0,1,1, 280602],[0,0,1,-1, 277693],[2,0,0,-1, 173237],
    [2,0,-1,1, 55413],[2,0,-1,-1, 46271],[2,0,0,1, 32573],[0,0,2,1, 17198],
    [2,0,1,-1, 9266],[0,0,2,-1, 8822],[2,-1,0,-1, 8216],[2,0,-2,-1, 4324],
    [2,0,1,1, 4200],[2,1,0,-1, -3359],[2,-1,-1,1, 2463],[2,-1,0,1, 2211],
    [2,-1,-1,-1, 2065],[0,1,-1,-1, -1870],[4,0,-1,-1, 1828],[0,1,0,1, -1794],
    [0,0,0,3, -1749],[0,1,-1,1, -1565],[1,0,0,1, -1491],[0,1,1,1, -1475],
    [0,1,1,-1, -1410],[0,1,0,-1, -1344],[1,0,0,-1, -1335],[0,0,3,1, 1107],
    [4,0,0,-1, 1021],[4,0,-1,1, 833],
  ];
  let sumL=0, sumR=0, sumB=0;
  for(const t of LR){
    const arg=(t[0]*Dm+t[1]*M+t[2]*Mp+t[3]*F)*R;
    let eF=1;
    if(Math.abs(t[1])===1) eF=E;
    else if(Math.abs(t[1])===2) eF=E2;
    sumL+=t[4]*eF*Math.sin(arg);
    sumR+=t[5]*eF*Math.cos(arg);
  }
  for(const t of B){
    const arg=(t[0]*Dm+t[1]*M+t[2]*Mp+t[3]*F)*R;
    let eF=1;
    if(Math.abs(t[1])===1) eF=E;
    else if(Math.abs(t[1])===2) eF=E2;
    sumB+=t[4]*eF*Math.sin(arg);
  }
  sumL+=3958*Math.sin(A1*R)+1962*Math.sin((Lp-F)*R)+318*Math.sin(A2*R);
  sumB+=-2235*Math.sin(Lp*R)+382*Math.sin(A3*R)+175*Math.sin((A1-F)*R)
       +175*Math.sin((A1+F)*R)+127*Math.sin((Lp-Mp)*R)-115*Math.sin((Lp+Mp)*R);
  const lambda=Lp+sumL/1000000;
  const beta=sumB/1000000;
  const dist=385000.56+sumR/1000;
  const nut=nutation(date);
  const lamCorr=lambda+nut.dpsi;
  const eps0=23.439291-0.013004*T;
  const eps=eps0+nut.deps;
  const lamR=lamCorr*R, betR=beta*R, epsR=eps*R;
  const ra=mod360(Math.atan2(Math.sin(lamR)*Math.cos(epsR)-Math.tan(betR)*Math.sin(epsR),Math.cos(lamR))*D);
  const dec=Math.asin(Math.sin(betR)*Math.cos(epsR)+Math.cos(betR)*Math.sin(epsR)*Math.sin(lamR))*D;
  const sha=mod360(360-ra);
  const gha=mod360(ghaAries(date)-ra);
  const HP=Math.asin(6378.14/dist)*D*60;
  const SD=0.2725*HP;
  return{ra,dec,sha,gha,dist,HP,SD,lambda:lamCorr};
}

// ══════════════════════════════════════════════════════
//  CORRECTION & SIGHT REDUCTION
// ══════════════════════════════════════════════════════

function refraction(alt){
  if(alt<-1)return 0;
  return -1.02/Math.tan((alt+10.3/(alt+5.11))*R);
}

function dip(hM){return hM>0?-1.76*Math.sqrt(hM):0;}

function dipAlt(hM){
  if(hM<=0)return 0;
  const Re=6371000;
  const geom=Math.acos(Re/(Re+hM))*D;
  return -(geom*(1-0.13))*60;
}

function computeDip(dipMode,val){
  if(dipMode==='artHz')return 0;
  if(dipMode==='alt')return dipAlt(val*0.3048);
  return dip(val);
}

function correct(hsDeg,ieMoa,dipC,bodyType,HP,SD,limb){
  const hs=hsDeg-ieMoa/60;
  const ha=hs+dipC/60;
  const refC=refraction(ha);
  let ho=ha+refC/60;
  let parC=0;
  if(HP&&HP>0){
    parC=HP*Math.cos(ho*R);
    ho+=parC/60;
  }
  let sdC=0;
  if(SD&&SD>0&&limb&&limb!=='center'){
    sdC=limb==='lower'?SD:-SD;
    ho+=sdC/60;
  }
  return {ho,dipC,refC,ha,parC,sdC};
}

function reduce(latDeg,decDeg,lhaDeg){
  const sinHc=sin(latDeg)*sin(decDeg)+cos(latDeg)*cos(decDeg)*cos(lhaDeg);
  const Hc=asin(sinHc);
  const cosHc=Math.cos(Hc*R);
  const cosZ=(sin(decDeg)-sinHc*sin(latDeg))/(cosHc*cos(latDeg));
  const Z=acos(cosZ);
  const Zn=lhaDeg>180?Z:360-Z;
  return{Hc,Zn};
}

// ══════════════════════════════════════════════════════
//  FIX COMPUTATION
// ══════════════════════════════════════════════════════

function lsFix(lops){
  if(!lops.length)return null;
  if(lops.length===1){
    const l=lops[0],z=l.azimuth*R;
    return{dx:l.intercept*Math.sin(z),dy:l.intercept*Math.cos(z),cov:null};
  }
  let A00=0,A01=0,A11=0,b0=0,b1=0;
  for(const l of lops){
    const z=l.azimuth*R,s=Math.sin(z),c=Math.cos(z),a=l.intercept;
    A00+=s*s;A01+=s*c;A11+=c*c;b0+=a*s;b1+=a*c;
  }
  const det=A00*A11-A01*A01;
  if(Math.abs(det)<1e-12)return{dx:0,dy:0,cov:null};
  const dx=(A11*b0-A01*b1)/det;
  const dy=(A00*b1-A01*b0)/det;
  let sse=0;
  for(const l of lops){
    const z=l.azimuth*R;
    const pred=dx*Math.sin(z)+dy*Math.cos(z);
    sse+=(l.intercept-pred)*(l.intercept-pred);
  }
  const sigma2=lops.length>2?sse/(lops.length-2):sse;
  const cov=lops.length>=2?{
    a:sigma2*A11/det, b:-sigma2*A01/det,
    c:-sigma2*A01/det, d:sigma2*A00/det
  }:null;
  return{dx,dy,cov};
}

function covToEllipse(cov,confidence){
  if(!cov)return null;
  const chi2=confidence===0.90?4.605:5.991;
  const trace=cov.a+cov.d;
  const det=cov.a*cov.d-cov.b*cov.c;
  const disc=Math.sqrt(Math.max(0,trace*trace/4-det));
  const lam1=trace/2+disc;
  const lam2=Math.max(0,trace/2-disc);
  const semiA=Math.sqrt(lam1*chi2);
  const semiB=Math.sqrt(lam2*chi2);
  const theta=Math.atan2(cov.b,lam1-cov.d);
  return{semiA,semiB,theta};
}

function sightToCOP(s){
  let star=s.star;
  if(!star){
    const pol=STARS.find(st=>st.n==='Polaris');
    star=pol?precessStar(pol,s.utc):{sha:322.0,dec:89.3};
  }
  const ghaA=ghaAries(s.utc);
  const ghaSt=mod360(ghaA+star.sha);
  return{gpLat:star.dec, gpLonE:-ghaSt, ho:s.ho, name:s.star?s.star.n:'Polaris'};
}

function angDist(lat1,lon1,lat2,lon2){
  const v=sin(lat1)*sin(lat2)+cos(lat1)*cos(lat2)*cos(lon1-lon2);
  return Math.acos(Math.max(-1,Math.min(1,v)))*D;
}

function linearSeed(cops,hint){
  const n=cops.length;
  const G=[],b=[];
  for(const c of cops){
    const decR=c.gpLat*R, lonR=c.gpLonE*R;
    G.push([Math.cos(decR)*Math.cos(lonR),Math.cos(decR)*Math.sin(lonR),Math.sin(decR)]);
    b.push(Math.sin(c.ho*R));
  }
  if(n===2){
    const g1=G[0],g2=G[1],b1=b[0],b2=b[1];
    const d11=g1[0]*g1[0]+g1[1]*g1[1]+g1[2]*g1[2];
    const d12=g1[0]*g2[0]+g1[1]*g2[1]+g1[2]*g2[2];
    const d22=g2[0]*g2[0]+g2[1]*g2[1]+g2[2]*g2[2];
    const det2=d11*d22-d12*d12;
    if(Math.abs(det2)<1e-15)return null;
    const al=(b1*d22-b2*d12)/det2, be=(b2*d11-b1*d12)/det2;
    const pp=[al*g1[0]+be*g2[0],al*g1[1]+be*g2[1],al*g1[2]+be*g2[2]];
    const dir=[g1[1]*g2[2]-g1[2]*g2[1],g1[2]*g2[0]-g1[0]*g2[2],g1[0]*g2[1]-g1[1]*g2[0]];
    const ppL2=pp[0]*pp[0]+pp[1]*pp[1]+pp[2]*pp[2];
    const dL2=dir[0]*dir[0]+dir[1]*dir[1]+dir[2]*dir[2];
    if(dL2<1e-15)return null;
    const disc=(1-ppL2)/dL2;
    if(disc<0)return null;
    const t=Math.sqrt(disc);
    const cands=[-t,t].map(tt=>{
      const x=pp[0]+tt*dir[0],y=pp[1]+tt*dir[1],z=pp[2]+tt*dir[2];
      return{lat:Math.asin(Math.max(-1,Math.min(1,z)))*D,lon:Math.atan2(y,x)*D};
    });
    if(hint){
      cands.sort((a,b)=>angDist(hint.lat,hint.lon,a.lat,a.lon)-angDist(hint.lat,hint.lon,b.lat,b.lon));
    }else{
      cands.sort((a,b)=>b.lat-a.lat);
    }
    return cands[0];
  }
  const GtG=[[0,0,0],[0,0,0],[0,0,0]], Gtb=[0,0,0];
  for(let i=0;i<n;i++){
    for(let j=0;j<3;j++){
      Gtb[j]+=G[i][j]*b[i];
      for(let k=0;k<3;k++) GtG[j][k]+=G[i][j]*G[i][k];
    }
  }
  const det=GtG[0][0]*(GtG[1][1]*GtG[2][2]-GtG[1][2]*GtG[2][1])
       -GtG[0][1]*(GtG[1][0]*GtG[2][2]-GtG[1][2]*GtG[2][0])
       +GtG[0][2]*(GtG[1][0]*GtG[2][1]-GtG[1][1]*GtG[2][0]);
  if(Math.abs(det)<1e-15)return null;
  const inv=1/det;
  const xyz=[
    inv*(Gtb[0]*(GtG[1][1]*GtG[2][2]-GtG[1][2]*GtG[2][1])-GtG[0][1]*(Gtb[1]*GtG[2][2]-GtG[1][2]*Gtb[2])+GtG[0][2]*(Gtb[1]*GtG[2][1]-GtG[1][1]*Gtb[2])),
    inv*(GtG[0][0]*(Gtb[1]*GtG[2][2]-GtG[1][2]*Gtb[2])-Gtb[0]*(GtG[1][0]*GtG[2][2]-GtG[1][2]*GtG[2][0])+GtG[0][2]*(GtG[1][0]*Gtb[2]-Gtb[1]*GtG[2][0])),
    inv*(GtG[0][0]*(GtG[1][1]*Gtb[2]-Gtb[1]*GtG[2][1])-GtG[0][1]*(GtG[1][0]*Gtb[2]-Gtb[1]*GtG[2][0])+Gtb[0]*(GtG[1][0]*GtG[2][1]-GtG[1][1]*GtG[2][0]))
  ];
  const len=Math.sqrt(xyz[0]*xyz[0]+xyz[1]*xyz[1]+xyz[2]*xyz[2]);
  if(len<1e-10)return null;
  return{lat:Math.asin(Math.max(-1,Math.min(1,xyz[2]/len)))*D, lon:Math.atan2(xyz[1],xyz[0])*D};
}

function directFix(sights,hint){
  const cops=sights.map(sightToCOP);
  const n=cops.length;
  if(n<2)return null;
  let fix=linearSeed(cops,hint);
  if(!fix) fix=hint||{lat:45,lon:0};
  for(let iter=0;iter<20;iter++){
    let J00=0,J01=0,J10=0,J11=0,r0=0,r1=0;
    for(const c of cops){
      const d=angDist(fix.lat,fix.lon,c.gpLat,c.gpLonE);
      const target=90-c.ho;
      const resid=(d-target)*R;
      if(Math.abs(d)<1e-10||Math.abs(d-180)<1e-10) continue;
      const sinD=Math.sin(d*R);
      const dLat=-(cos(fix.lat)*sin(c.gpLat)-sin(fix.lat)*cos(c.gpLat)*cos(fix.lon-c.gpLonE))/sinD;
      const dLon=(cos(c.gpLat)*Math.sin((fix.lon-c.gpLonE)*R)*cos(fix.lat))/sinD;
      J00+=dLat*dLat; J01+=dLat*dLon;
      J10+=dLon*dLat; J11+=dLon*dLon;
      r0+=dLat*resid; r1+=dLon*resid;
    }
    const det=J00*J11-J01*J10;
    if(Math.abs(det)<1e-20) break;
    const dLat=-(J11*r0-J01*r1)/det*D;
    const dLon=-(J00*r1-J10*r0)/det*D;
    fix.lat+=dLat;
    fix.lon+=dLon;
    if(Math.abs(dLat)<1e-8&&Math.abs(dLon)<1e-8) break;
  }
  fix.residuals=cops.map(c=>{
    const d=angDist(fix.lat,fix.lon,c.gpLat,c.gpLonE);
    return{name:c.name, resid:(d-(90-c.ho))*60};
  });
  return fix;
}

// ══════════════════════════════════════════════════════
//  SKY COMPUTATION
// ══════════════════════════════════════════════════════

function computeSky(lat,lon,utc){
  const ghaA=ghaAries(utc);
  const bodies=[];
  STARS.forEach(s=>{
    const p=precessStar(s,utc);
    const gha=mod360(ghaA+p.sha);
    const lha=mod360(gha+lon);
    const {Hc,Zn}=reduce(lat,p.dec,lha);
    bodies.push({name:s.n,alt:Hc,az:Zn,mag:s.mag,type:'star',ra:p.ra,dec:p.dec});
  });
  const sun=solarPosition(utc);
  const sunLha=mod360(mod360(ghaA+sun.sha)+lon);
  const sunR=reduce(lat,sun.dec,sunLha);
  bodies.push({name:'Sun',alt:sunR.Hc,az:sunR.Zn,mag:-26.7,type:'sun',ra:mod360(360-sun.sha),dec:sun.dec});
  for(const [key,name] of Object.entries(PLANET_NAMES)){
    const pos=planetPosition(name,utc);
    const lha=mod360(mod360(ghaA+pos.sha)+lon);
    const r=reduce(lat,pos.dec,lha);
    bodies.push({name,alt:r.Hc,az:r.Zn,mag:PLANET_MAGS[key],type:'planet',ra:mod360(360-pos.sha),dec:pos.dec});
  }
  const moon=moonPosition(utc);
  const moonLha=mod360(mod360(ghaA+moon.sha)+lon);
  const moonR=reduce(lat,moon.dec,moonLha);
  bodies.push({name:'Moon',alt:moonR.Hc,az:moonR.Zn,mag:-12.6,type:'moon',ra:mod360(360-moon.sha),dec:moon.dec});
  return bodies;
}

// ══════════════════════════════════════════════════════
//  PLATE SOLVING — Blind star identification
//  Given angular separations between observed bright spots,
//  match against known star catalog triangles
// ══════════════════════════════════════════════════════

// Angular separation between two catalog stars (J2000, position-independent)
function starAngSep(s1,s2){
  const ra1=s1.ra0*R, dec1=s1.dec0*R;
  const ra2=s2.ra0*R, dec2=s2.dec0*R;
  const cosD=Math.sin(dec1)*Math.sin(dec2)+Math.cos(dec1)*Math.cos(dec2)*Math.cos(ra1-ra2);
  return Math.acos(Math.max(-1,Math.min(1,cosD)))*D;
}

// Build triangle index for plate solving
// Returns array of {i,j,k, sides:[d01,d02,d12] sorted ascending}
function buildTriangleIndex(stars,maxMag){
  const bright=stars.map((s,i)=>({...s,idx:i})).filter(s=>s.mag<=maxMag);
  const triangles=[];
  for(let a=0;a<bright.length;a++){
    for(let b=a+1;b<bright.length;b++){
      const d01=starAngSep(bright[a],bright[b]);
      for(let c=b+1;c<bright.length;c++){
        const d02=starAngSep(bright[a],bright[c]);
        const d12=starAngSep(bright[b],bright[c]);
        const sides=[d01,d02,d12].sort((x,y)=>x-y);
        triangles.push({
          stars:[bright[a].idx,bright[b].idx,bright[c].idx],
          names:[bright[a].n,bright[b].n,bright[c].n],
          sides
        });
      }
    }
  }
  return triangles;
}

// Match observed triangle (3 angular separations) against index
// tolerance in degrees (default 2° for gyro error)
function solveTriangle(obsSides,triangleIndex,tolerance){
  tolerance=tolerance||2;
  const obs=[...obsSides].sort((a,b)=>a-b);
  const matches=[];
  for(const tri of triangleIndex){
    const diffs=[
      Math.abs(obs[0]-tri.sides[0]),
      Math.abs(obs[1]-tri.sides[1]),
      Math.abs(obs[2]-tri.sides[2])
    ];
    if(diffs[0]<tolerance&&diffs[1]<tolerance&&diffs[2]<tolerance){
      const score=diffs[0]+diffs[1]+diffs[2];
      matches.push({...tri,score});
    }
  }
  matches.sort((a,b)=>a.score-b.score);
  return matches;
}

// Identify nearest navigational star given approximate azimuth/altitude
// Requires assumed position (can be rough)
function identifyNearest(phoneAz,phoneAlt,bodies,maxSep){
  maxSep=maxSep||10;
  let best=null,bestSep=Infinity;
  for(const b of bodies){
    if(b.alt<-5)continue;
    if(b.type==='aux')continue;
    let dAz=Math.abs(b.az-phoneAz);
    if(dAz>180)dAz=360-dAz;
    const dAlt=Math.abs(b.alt-phoneAlt);
    const sep=Math.sqrt(dAz*dAz*cos(phoneAlt)*cos(phoneAlt)+dAlt*dAlt);
    if(sep<bestSep&&sep<maxSep){
      bestSep=sep;
      best={...b,sep};
    }
  }
  return best;
}
