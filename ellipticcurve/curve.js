//
// Elliptic Curve Equation
//
// y^2 = x^3 + A*x + B (mod P)
//

const BigInt = require("big-integer");
const Point = require("./point").Point;
const modulo = require("./utils/integer").modulo;


class CurveFp {
    constructor(A, B, P, N, Gx, Gy, name, oid, nistName=null) {
        this.A = A;
        this.B = B;
        this.P = P;
        this.N = N;
        this.G = new Point(Gx, Gy);
        this.name = name;
        this.nistName = nistName;
        this._oid = oid;
    };

    contains(p) {
        if (p.x < 0 || p.x > this.P.minus(1)) {
            return false;
        }
        if (p.y < 0 || p.y > this.P.minus(1)) {
            return false;
        }
        if (!modulo(((p.y.pow(2)).minus((p.x.pow(3)).add(this.A.multiply(p.x)).add(this.B))), this.P).equals(0)) {
            return false;
        }
        return true;
    };

    length() {
        return Math.floor((1 + this.N.toString(16).length) / 2);
    };

    get oid() {
        return this._oid.slice();
    }
};


let secp256k1 = new CurveFp(
    BigInt("0000000000000000000000000000000000000000000000000000000000000000", 16),
    BigInt("0000000000000000000000000000000000000000000000000000000000000007", 16),
    BigInt("fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f", 16),
    BigInt("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", 16),
    BigInt("79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", 16),
    BigInt("483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", 16),
    "secp256k1",
    [1, 3, 132, 0, 10]
);

let prime256v1 = new CurveFp(
    BigInt("ffffffff00000001000000000000000000000000fffffffffffffffffffffffc", 16),
    BigInt("5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b", 16),
    BigInt("ffffffff00000001000000000000000000000000ffffffffffffffffffffffff", 16),
    BigInt("ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551", 16),
    BigInt("6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296", 16),
    BigInt("4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5", 16),
    "prime256v1",
    [1, 2, 840, 10045, 3, 1, 7],
    "P-256"
);

// Define the P-192 curve
const secp192r1 = new CurveFp(
    BigInt(-3), // A
    BigInt('0x64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1'), // B
    BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF'), // P
    BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831'), // N
    BigInt('0x188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012'), // Gx
    BigInt('0x07192B95FFC8DA78631011ED6B24CDD573F977A11E794811'), // Gy
    'secp192r1', // Name
    [1, 2, 840, 10045, 3, 1, 1], // OID
    'P-192' // NistName
);


let p256 = prime256v1;

let supportedCurves = [
    secp256k1,
    prime256v1,
    secp192r1
];

let curvesByOid = {};
supportedCurves.forEach((curve) => {curvesByOid[curve.oid] = curve});


exports.CurveFp = CurveFp;
exports.curvesByOid = curvesByOid;
exports.secp256k1 = secp256k1
exports.prime256v1 = prime256v1
exports.p256 = p256
exports.supportedCurves = supportedCurves;
