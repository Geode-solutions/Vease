import { getCurrentScope as c3, onScopeDispose as i2, ref as se, markRaw as J0, defineAsyncComponent as An, warn as F0, reactive as ct, watchEffect as b2, toRef as R, capitalize as s0, Fragment as je, shallowRef as Ve, camelize as Er, isVNode as d3, Comment as f3, unref as s2, getCurrentInstance as p6, computed as E, provide as c2, inject as We, defineComponent as b6, h as Et, toRefs as Ol, toValue as u2, createVNode as g, mergeProps as me, createElementVNode as I, normalizeClass as ve, Text as w6, normalizeStyle as Ee, isRef as on, TransitionGroup as cn, Transition as G2, watch as be, onBeforeMount as dn, nextTick as e2, onBeforeUnmount as W2, withDirectives as g2, vShow as dt, effectScope as fn, toRaw as m2, onMounted as yt, onUpdated as x6, useId as Y2, readonly as ia, resolveDynamicComponent as S6, toDisplayString as a2, cloneVNode as k6, openBlock as Ne, createBlock as n2, withCtx as M, createTextVNode as pe, createCommentVNode as D2, Teleport as _6, onDeactivated as v3, createElementBlock as R2, normalizeProps as Fl, guardReactiveProps as Ll, withModifiers as Rt, createSlots as Bl, renderList as P0, onUnmounted as m3, useAttrs as g3, renderSlot as P6, withKeys as h3, onBeforeUpdate as y3 } from "vue";
import { Status as G0 } from "@ogw_front/app/utils/status.js";
import { api_fetch as C3 } from "@ogw_front/internal/utils/api_fetch.js";
import { appMode as $n } from "@ogw_front/app/utils/local/app_mode.js";
import { defineStore as V6 } from "pinia";
import { useFeedbackStore as p3 } from "@ogw_front/app/stores/feedback.js";
import { useInfraStore as Bi } from "@ogw_front/app/stores/infra.js";
const rl = "vease-modeling", b3 = "1.6.2", w3 = "Modeling extension for Vease", x3 = "Geode-solutions";
var S3 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function k3(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var tr = { exports: {} }, _3 = tr.exports, fs;
function P3() {
  return fs || (fs = 1, (function(e, t) {
    (function(n, a) {
      e.exports = a();
    })(_3, function() {
      var n = function(l, s) {
        return (n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, m) {
          d.__proto__ = m;
        } || function(d, m) {
          for (var C in m) Object.prototype.hasOwnProperty.call(m, C) && (d[C] = m[C]);
        })(l, s);
      }, a = function() {
        return (a = Object.assign || function(l) {
          for (var s, d = 1, m = arguments.length; d < m; d++) for (var C in s = arguments[d]) Object.prototype.hasOwnProperty.call(s, C) && (l[C] = s[C]);
          return l;
        }).apply(this, arguments);
      };
      function r(l, s, d) {
        for (var m, C = 0, b = s.length; C < b; C++) !m && C in s || ((m = m || Array.prototype.slice.call(s, 0, C))[C] = s[C]);
        return l.concat(m || Array.prototype.slice.call(s));
      }
      var i = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : S3, o = Object.keys, u = Array.isArray;
      function c(l, s) {
        return typeof s != "object" || o(s).forEach(function(d) {
          l[d] = s[d];
        }), l;
      }
      typeof Promise > "u" || i.Promise || (i.Promise = Promise);
      var f = Object.getPrototypeOf, v = {}.hasOwnProperty;
      function h(l, s) {
        return v.call(l, s);
      }
      function y(l, s) {
        typeof s == "function" && (s = s(f(l))), (typeof Reflect > "u" ? o : Reflect.ownKeys)(s).forEach(function(d) {
          k(l, d, s[d]);
        });
      }
      var p = Object.defineProperty;
      function k(l, s, d, m) {
        p(l, s, c(d && h(d, "get") && typeof d.get == "function" ? { get: d.get, set: d.set, configurable: !0 } : { value: d, configurable: !0, writable: !0 }, m));
      }
      function S(l) {
        return { from: function(s) {
          return l.prototype = Object.create(s.prototype), k(l.prototype, "constructor", l), { extend: y.bind(null, l.prototype) };
        } };
      }
      var w = Object.getOwnPropertyDescriptor, _ = [].slice;
      function V(l, s, d) {
        return _.call(l, s, d);
      }
      function A(l, s) {
        return s(l);
      }
      function T(l) {
        if (!l) throw new Error("Assertion Failed");
      }
      function O(l) {
        i.setImmediate ? setImmediate(l) : setTimeout(l, 0);
      }
      function Y(l, s) {
        if (typeof s == "string" && h(l, s)) return l[s];
        if (!s) return l;
        if (typeof s != "string") {
          for (var d = [], m = 0, C = s.length; m < C; ++m) {
            var b = Y(l, s[m]);
            d.push(b);
          }
          return d;
        }
        var P = s.indexOf(".");
        if (P !== -1) {
          var $ = l[s.substr(0, P)];
          return $ == null ? void 0 : Y($, s.substr(P + 1));
        }
      }
      function F(l, s, d) {
        if (l && s !== void 0 && !("isFrozen" in Object && Object.isFrozen(l))) if (typeof s != "string" && "length" in s) {
          T(typeof d != "string" && "length" in d);
          for (var m = 0, C = s.length; m < C; ++m) F(l, s[m], d[m]);
        } else {
          var b, P, $ = s.indexOf(".");
          $ !== -1 ? (b = s.substr(0, $), (P = s.substr($ + 1)) === "" ? d === void 0 ? u(l) && !isNaN(parseInt(b)) ? l.splice(b, 1) : delete l[b] : l[b] = d : F($ = !($ = l[b]) || !h(l, b) ? l[b] = {} : $, P, d)) : d === void 0 ? u(l) && !isNaN(parseInt(s)) ? l.splice(s, 1) : delete l[s] : l[s] = d;
        }
      }
      function x(l) {
        var s, d = {};
        for (s in l) h(l, s) && (d[s] = l[s]);
        return d;
      }
      var G = [].concat;
      function U(l) {
        return G.apply([], l);
      }
      var f0 = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(U([8, 16, 32, 64].map(function(l) {
        return ["Int", "Uint", "Float"].map(function(s) {
          return s + l + "Array";
        });
      }))).filter(function(l) {
        return i[l];
      }), ee = new Set(f0.map(function(l) {
        return i[l];
      })), J = null;
      function ae(l) {
        return J = /* @__PURE__ */ new WeakMap(), l = (function s(d) {
          if (!d || typeof d != "object") return d;
          var m = J.get(d);
          if (m) return m;
          if (u(d)) {
            m = [], J.set(d, m);
            for (var C = 0, b = d.length; C < b; ++C) m.push(s(d[C]));
          } else if (ee.has(d.constructor)) m = d;
          else {
            var P, $ = f(d);
            for (P in m = $ === Object.prototype ? {} : Object.create($), J.set(d, m), d) h(d, P) && (m[P] = s(d[P]));
          }
          return m;
        })(l), J = null, l;
      }
      var oe = {}.toString;
      function te(l) {
        return oe.call(l).slice(8, -1);
      }
      var L = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", X = typeof L == "symbol" ? function(l) {
        var s;
        return l != null && (s = l[L]) && s.apply(l);
      } : function() {
        return null;
      };
      function re(l, s) {
        return s = l.indexOf(s), 0 <= s && l.splice(s, 1), 0 <= s;
      }
      var we = {};
      function le(l) {
        var s, d, m, C;
        if (arguments.length === 1) {
          if (u(l)) return l.slice();
          if (this === we && typeof l == "string") return [l];
          if (C = X(l)) {
            for (d = []; !(m = C.next()).done; ) d.push(m.value);
            return d;
          }
          if (l == null) return [l];
          if (typeof (s = l.length) != "number") return [l];
          for (d = new Array(s); s--; ) d[s] = l[s];
          return d;
        }
        for (s = arguments.length, d = new Array(s); s--; ) d[s] = arguments[s];
        return d;
      }
      var ke = typeof Symbol < "u" ? function(l) {
        return l[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return !1;
      }, Cn = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], st = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(Cn), fe = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
      function ne(l, s) {
        this.name = l, this.message = s;
      }
      function Pe(l, s) {
        return l + ". Errors: " + Object.keys(s).map(function(d) {
          return s[d].toString();
        }).filter(function(d, m, C) {
          return C.indexOf(d) === m;
        }).join(`
`);
      }
      function Re(l, s, d, m) {
        this.failures = s, this.failedKeys = m, this.successCount = d, this.message = Pe(l, s);
      }
      function De(l, s) {
        this.name = "BulkError", this.failures = Object.keys(s).map(function(d) {
          return s[d];
        }), this.failuresByPos = s, this.message = Pe(l, this.failures);
      }
      S(ne).from(Error).extend({ toString: function() {
        return this.name + ": " + this.message;
      } }), S(Re).from(ne), S(De).from(ne);
      var de = st.reduce(function(l, s) {
        return l[s] = s + "Error", l;
      }, {}), Be = ne, ye = st.reduce(function(l, s) {
        var d = s + "Error";
        function m(C, b) {
          this.name = d, C ? typeof C == "string" ? (this.message = "".concat(C).concat(b ? `
 ` + b : ""), this.inner = b || null) : typeof C == "object" && (this.message = "".concat(C.name, " ").concat(C.message), this.inner = C) : (this.message = fe[s] || d, this.inner = null);
        }
        return S(m).from(Be), l[s] = m, l;
      }, {});
      ye.Syntax = SyntaxError, ye.Type = TypeError, ye.Range = RangeError;
      var f2 = Cn.reduce(function(l, s) {
        return l[s + "Error"] = ye[s], l;
      }, {}), F2 = st.reduce(function(l, s) {
        return ["Syntax", "Type", "Range"].indexOf(s) === -1 && (l[s + "Error"] = ye[s]), l;
      }, {});
      function Me() {
      }
      function _2(l) {
        return l;
      }
      function j2(l, s) {
        return l == null || l === _2 ? s : function(d) {
          return s(l(d));
        };
      }
      function Tt(l, s) {
        return function() {
          l.apply(this, arguments), s.apply(this, arguments);
        };
      }
      function ei(l, s) {
        return l === Me ? s : function() {
          var d = l.apply(this, arguments);
          d !== void 0 && (arguments[0] = d);
          var m = this.onsuccess, C = this.onerror;
          this.onsuccess = null, this.onerror = null;
          var b = s.apply(this, arguments);
          return m && (this.onsuccess = this.onsuccess ? Tt(m, this.onsuccess) : m), C && (this.onerror = this.onerror ? Tt(C, this.onerror) : C), b !== void 0 ? b : d;
        };
      }
      function B4(l, s) {
        return l === Me ? s : function() {
          l.apply(this, arguments);
          var d = this.onsuccess, m = this.onerror;
          this.onsuccess = this.onerror = null, s.apply(this, arguments), d && (this.onsuccess = this.onsuccess ? Tt(d, this.onsuccess) : d), m && (this.onerror = this.onerror ? Tt(m, this.onerror) : m);
        };
      }
      function M4(l, s) {
        return l === Me ? s : function(d) {
          var m = l.apply(this, arguments);
          c(d, m);
          var C = this.onsuccess, b = this.onerror;
          return this.onsuccess = null, this.onerror = null, d = s.apply(this, arguments), C && (this.onsuccess = this.onsuccess ? Tt(C, this.onsuccess) : C), b && (this.onerror = this.onerror ? Tt(b, this.onerror) : b), m === void 0 ? d === void 0 ? void 0 : d : c(m, d);
        };
      }
      function R4(l, s) {
        return l === Me ? s : function() {
          return s.apply(this, arguments) !== !1 && l.apply(this, arguments);
        };
      }
      function ti(l, s) {
        return l === Me ? s : function() {
          var d = l.apply(this, arguments);
          if (d && typeof d.then == "function") {
            for (var m = this, C = arguments.length, b = new Array(C); C--; ) b[C] = arguments[C];
            return d.then(function() {
              return s.apply(m, b);
            });
          }
          return s.apply(this, arguments);
        };
      }
      F2.ModifyError = Re, F2.DexieError = ne, F2.BulkError = De;
      var _t = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function $o(l) {
        _t = l;
      }
      var yn = {}, To = 100, f0 = typeof Promise > "u" ? [] : (function() {
        var l = Promise.resolve();
        if (typeof crypto > "u" || !crypto.subtle) return [l, f(l), l];
        var s = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [s, f(s), l];
      })(), Cn = f0[0], st = f0[1], f0 = f0[2], st = st && st.then, v0 = Cn && Cn.constructor, ni = !!f0, pn = function(l, s) {
        bn.push([l, s]), pa && (queueMicrotask(N4), pa = !1);
      }, ai = !0, pa = !0, m0 = [], ba = [], ri = _2, Zt = { id: "global", global: !0, ref: 0, unhandleds: [], onunhandled: Me, pgp: !1, env: {}, finalize: Me }, Te = Zt, bn = [], g0 = 0, wa = [];
      function Ie(l) {
        if (typeof this != "object") throw new TypeError("Promises must be constructed via new");
        this._listeners = [], this._lib = !1;
        var s = this._PSD = Te;
        if (typeof l != "function") {
          if (l !== yn) throw new TypeError("Not a function");
          return this._state = arguments[1], this._value = arguments[2], void (this._state === !1 && li(this, this._value));
        }
        this._state = null, this._value = null, ++s.ref, (function d(m, C) {
          try {
            C(function(b) {
              if (m._state === null) {
                if (b === m) throw new TypeError("A promise cannot be resolved with itself.");
                var P = m._lib && N0();
                b && typeof b.then == "function" ? d(m, function($, D) {
                  b instanceof Ie ? b._then($, D) : b.then($, D);
                }) : (m._state = !0, m._value = b, Fo(m)), P && z0();
              }
            }, li.bind(null, m));
          } catch (b) {
            li(m, b);
          }
        })(this, l);
      }
      var ii = { get: function() {
        var l = Te, s = _a;
        function d(m, C) {
          var b = this, P = !l.global && (l !== Te || s !== _a), $ = P && !Xt(), D = new Ie(function(N, W) {
            oi(b, new Oo(Bo(m, l, P, $), Bo(C, l, P, $), N, W, l));
          });
          return this._consoleTask && (D._consoleTask = this._consoleTask), D;
        }
        return d.prototype = yn, d;
      }, set: function(l) {
        k(this, "then", l && l.prototype === yn ? ii : { get: function() {
          return l;
        }, set: ii.set });
      } };
      function Oo(l, s, d, m, C) {
        this.onFulfilled = typeof l == "function" ? l : null, this.onRejected = typeof s == "function" ? s : null, this.resolve = d, this.reject = m, this.psd = C;
      }
      function li(l, s) {
        var d, m;
        ba.push(s), l._state === null && (d = l._lib && N0(), s = ri(s), l._state = !1, l._value = s, m = l, m0.some(function(C) {
          return C._value === m._value;
        }) || m0.push(m), Fo(l), d && z0());
      }
      function Fo(l) {
        var s = l._listeners;
        l._listeners = [];
        for (var d = 0, m = s.length; d < m; ++d) oi(l, s[d]);
        var C = l._PSD;
        --C.ref || C.finalize(), g0 === 0 && (++g0, pn(function() {
          --g0 == 0 && si();
        }, []));
      }
      function oi(l, s) {
        if (l._state !== null) {
          var d = l._state ? s.onFulfilled : s.onRejected;
          if (d === null) return (l._state ? s.resolve : s.reject)(l._value);
          ++s.psd.ref, ++g0, pn(D4, [d, l, s]);
        } else l._listeners.push(s);
      }
      function D4(l, s, d) {
        try {
          var m, C = s._value;
          !s._state && ba.length && (ba = []), m = _t && s._consoleTask ? s._consoleTask.run(function() {
            return l(C);
          }) : l(C), s._state || ba.indexOf(C) !== -1 || (function(b) {
            for (var P = m0.length; P; ) if (m0[--P]._value === b._value) return m0.splice(P, 1);
          })(s), d.resolve(m);
        } catch (b) {
          d.reject(b);
        } finally {
          --g0 == 0 && si(), --d.psd.ref || d.psd.finalize();
        }
      }
      function N4() {
        h0(Zt, function() {
          N0() && z0();
        });
      }
      function N0() {
        var l = ai;
        return pa = ai = !1, l;
      }
      function z0() {
        var l, s, d;
        do
          for (; 0 < bn.length; ) for (l = bn, bn = [], d = l.length, s = 0; s < d; ++s) {
            var m = l[s];
            m[0].apply(null, m[1]);
          }
        while (0 < bn.length);
        pa = ai = !0;
      }
      function si() {
        var l = m0;
        m0 = [], l.forEach(function(m) {
          m._PSD.onunhandled.call(null, m._value, m);
        });
        for (var s = wa.slice(0), d = s.length; d; ) s[--d]();
      }
      function xa(l) {
        return new Ie(yn, !1, l);
      }
      function v2(l, s) {
        var d = Te;
        return function() {
          var m = N0(), C = Te;
          try {
            return Qt(d, !0), l.apply(this, arguments);
          } catch (b) {
            s && s(b);
          } finally {
            Qt(C, !1), m && z0();
          }
        };
      }
      y(Ie.prototype, { then: ii, _then: function(l, s) {
        oi(this, new Oo(null, null, l, s, Te));
      }, catch: function(l) {
        if (arguments.length === 1) return this.then(null, l);
        var s = l, d = arguments[1];
        return typeof s == "function" ? this.then(null, function(m) {
          return (m instanceof s ? d : xa)(m);
        }) : this.then(null, function(m) {
          return (m && m.name === s ? d : xa)(m);
        });
      }, finally: function(l) {
        return this.then(function(s) {
          return Ie.resolve(l()).then(function() {
            return s;
          });
        }, function(s) {
          return Ie.resolve(l()).then(function() {
            return xa(s);
          });
        });
      }, timeout: function(l, s) {
        var d = this;
        return l < 1 / 0 ? new Ie(function(m, C) {
          var b = setTimeout(function() {
            return C(new ye.Timeout(s));
          }, l);
          d.then(m, C).finally(clearTimeout.bind(null, b));
        }) : this;
      } }), typeof Symbol < "u" && Symbol.toStringTag && k(Ie.prototype, Symbol.toStringTag, "Dexie.Promise"), Zt.env = Lo(), y(Ie, { all: function() {
        var l = le.apply(null, arguments).map(Pa);
        return new Ie(function(s, d) {
          l.length === 0 && s([]);
          var m = l.length;
          l.forEach(function(C, b) {
            return Ie.resolve(C).then(function(P) {
              l[b] = P, --m || s(l);
            }, d);
          });
        });
      }, resolve: function(l) {
        return l instanceof Ie ? l : l && typeof l.then == "function" ? new Ie(function(s, d) {
          l.then(s, d);
        }) : new Ie(yn, !0, l);
      }, reject: xa, race: function() {
        var l = le.apply(null, arguments).map(Pa);
        return new Ie(function(s, d) {
          l.map(function(m) {
            return Ie.resolve(m).then(s, d);
          });
        });
      }, PSD: { get: function() {
        return Te;
      }, set: function(l) {
        return Te = l;
      } }, totalEchoes: { get: function() {
        return _a;
      } }, newPSD: Yt, usePSD: h0, scheduler: { get: function() {
        return pn;
      }, set: function(l) {
        pn = l;
      } }, rejectionMapper: { get: function() {
        return ri;
      }, set: function(l) {
        ri = l;
      } }, follow: function(l, s) {
        return new Ie(function(d, m) {
          return Yt(function(C, b) {
            var P = Te;
            P.unhandleds = [], P.onunhandled = b, P.finalize = Tt(function() {
              var $, D = this;
              $ = function() {
                D.unhandleds.length === 0 ? C() : b(D.unhandleds[0]);
              }, wa.push(function N() {
                $(), wa.splice(wa.indexOf(N), 1);
              }), ++g0, pn(function() {
                --g0 == 0 && si();
              }, []);
            }, P.finalize), l();
          }, s, d, m);
        });
      } }), v0 && (v0.allSettled && k(Ie, "allSettled", function() {
        var l = le.apply(null, arguments).map(Pa);
        return new Ie(function(s) {
          l.length === 0 && s([]);
          var d = l.length, m = new Array(d);
          l.forEach(function(C, b) {
            return Ie.resolve(C).then(function(P) {
              return m[b] = { status: "fulfilled", value: P };
            }, function(P) {
              return m[b] = { status: "rejected", reason: P };
            }).then(function() {
              return --d || s(m);
            });
          });
        });
      }), v0.any && typeof AggregateError < "u" && k(Ie, "any", function() {
        var l = le.apply(null, arguments).map(Pa);
        return new Ie(function(s, d) {
          l.length === 0 && d(new AggregateError([]));
          var m = l.length, C = new Array(m);
          l.forEach(function(b, P) {
            return Ie.resolve(b).then(function($) {
              return s($);
            }, function($) {
              C[P] = $, --m || d(new AggregateError(C));
            });
          });
        });
      }), v0.withResolvers && (Ie.withResolvers = v0.withResolvers));
      var I2 = { awaits: 0, echoes: 0, id: 0 }, z4 = 0, Sa = [], ka = 0, _a = 0, j4 = 0;
      function Yt(l, s, d, m) {
        var C = Te, b = Object.create(C);
        return b.parent = C, b.ref = 0, b.global = !1, b.id = ++j4, Zt.env, b.env = ni ? { Promise: Ie, PromiseProp: { value: Ie, configurable: !0, writable: !0 }, all: Ie.all, race: Ie.race, allSettled: Ie.allSettled, any: Ie.any, resolve: Ie.resolve, reject: Ie.reject } : {}, s && c(b, s), ++C.ref, b.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        }, m = h0(b, l, d, m), b.ref === 0 && b.finalize(), m;
      }
      function j0() {
        return I2.id || (I2.id = ++z4), ++I2.awaits, I2.echoes += To, I2.id;
      }
      function Xt() {
        return !!I2.awaits && (--I2.awaits == 0 && (I2.id = 0), I2.echoes = I2.awaits * To, !0);
      }
      function Pa(l) {
        return I2.echoes && l && l.constructor === v0 ? (j0(), l.then(function(s) {
          return Xt(), s;
        }, function(s) {
          return Xt(), C2(s);
        })) : l;
      }
      function K4() {
        var l = Sa[Sa.length - 1];
        Sa.pop(), Qt(l, !1);
      }
      function Qt(l, s) {
        var d, m = Te;
        (s ? !I2.echoes || ka++ && l === Te : !ka || --ka && l === Te) || queueMicrotask(s ? (function(C) {
          ++_a, I2.echoes && --I2.echoes != 0 || (I2.echoes = I2.awaits = I2.id = 0), Sa.push(Te), Qt(C, !0);
        }).bind(null, l) : K4), l !== Te && (Te = l, m === Zt && (Zt.env = Lo()), ni && (d = Zt.env.Promise, s = l.env, (m.global || l.global) && (Object.defineProperty(i, "Promise", s.PromiseProp), d.all = s.all, d.race = s.race, d.resolve = s.resolve, d.reject = s.reject, s.allSettled && (d.allSettled = s.allSettled), s.any && (d.any = s.any))));
      }
      function Lo() {
        var l = i.Promise;
        return ni ? { Promise: l, PromiseProp: Object.getOwnPropertyDescriptor(i, "Promise"), all: l.all, race: l.race, allSettled: l.allSettled, any: l.any, resolve: l.resolve, reject: l.reject } : {};
      }
      function h0(l, s, d, m, C) {
        var b = Te;
        try {
          return Qt(l, !0), s(d, m, C);
        } finally {
          Qt(b, !1);
        }
      }
      function Bo(l, s, d, m) {
        return typeof l != "function" ? l : function() {
          var C = Te;
          d && j0(), Qt(s, !0);
          try {
            return l.apply(this, arguments);
          } finally {
            Qt(C, !1), m && queueMicrotask(Xt);
          }
        };
      }
      function ui(l) {
        Promise === v0 && I2.echoes === 0 ? ka === 0 ? l() : enqueueNativeMicroTask(l) : setTimeout(l, 0);
      }
      ("" + st).indexOf("[native code]") === -1 && (j0 = Xt = Me);
      var C2 = Ie.reject, y0 = "￿", Ot = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", Mo = "String expected.", K0 = [], Va = "__dbnames", ci = "readonly", di = "readwrite";
      function C0(l, s) {
        return l ? s ? function() {
          return l.apply(this, arguments) && s.apply(this, arguments);
        } : l : s;
      }
      var Ro = { type: 3, lower: -1 / 0, lowerOpen: !1, upper: [[]], upperOpen: !1 };
      function Ia(l) {
        return typeof l != "string" || /\./.test(l) ? function(s) {
          return s;
        } : function(s) {
          return s[l] === void 0 && l in s && delete (s = ae(s))[l], s;
        };
      }
      function Do() {
        throw ye.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
      }
      function Qe(l, s) {
        try {
          var d = No(l), m = No(s);
          if (d !== m) return d === "Array" ? 1 : m === "Array" ? -1 : d === "binary" ? 1 : m === "binary" ? -1 : d === "string" ? 1 : m === "string" ? -1 : d === "Date" ? 1 : m !== "Date" ? NaN : -1;
          switch (d) {
            case "number":
            case "Date":
            case "string":
              return s < l ? 1 : l < s ? -1 : 0;
            case "binary":
              return (function(C, b) {
                for (var P = C.length, $ = b.length, D = P < $ ? P : $, N = 0; N < D; ++N) if (C[N] !== b[N]) return C[N] < b[N] ? -1 : 1;
                return P === $ ? 0 : P < $ ? -1 : 1;
              })(zo(l), zo(s));
            case "Array":
              return (function(C, b) {
                for (var P = C.length, $ = b.length, D = P < $ ? P : $, N = 0; N < D; ++N) {
                  var W = Qe(C[N], b[N]);
                  if (W !== 0) return W;
                }
                return P === $ ? 0 : P < $ ? -1 : 1;
              })(l, s);
          }
        } catch {
        }
        return NaN;
      }
      function No(l) {
        var s = typeof l;
        return s != "object" ? s : ArrayBuffer.isView(l) ? "binary" : (l = te(l), l === "ArrayBuffer" ? "binary" : l);
      }
      function zo(l) {
        return l instanceof Uint8Array ? l : ArrayBuffer.isView(l) ? new Uint8Array(l.buffer, l.byteOffset, l.byteLength) : new Uint8Array(l);
      }
      function Ea(l, s, d) {
        var m = l.schema.yProps;
        return m ? (s && 0 < d.numFailures && (s = s.filter(function(C, b) {
          return !d.failures[b];
        })), Promise.all(m.map(function(C) {
          return C = C.updatesTable, s ? l.db.table(C).where("k").anyOf(s).delete() : l.db.table(C).clear();
        })).then(function() {
          return d;
        })) : d;
      }
      var wn = (jo.prototype.execute = function(l) {
        var s = this["@@propmod"];
        if (s.add !== void 0) {
          var d = s.add;
          if (u(d)) return r(r([], u(l) ? l : [], !0), d).sort();
          if (typeof d == "number") return (Number(l) || 0) + d;
          if (typeof d == "bigint") try {
            return BigInt(l) + d;
          } catch {
            return BigInt(0) + d;
          }
          throw new TypeError("Invalid term ".concat(d));
        }
        if (s.remove !== void 0) {
          var m = s.remove;
          if (u(m)) return u(l) ? l.filter(function(C) {
            return !m.includes(C);
          }).sort() : [];
          if (typeof m == "number") return Number(l) - m;
          if (typeof m == "bigint") try {
            return BigInt(l) - m;
          } catch {
            return BigInt(0) - m;
          }
          throw new TypeError("Invalid subtrahend ".concat(m));
        }
        return d = (d = s.replacePrefix) === null || d === void 0 ? void 0 : d[0], d && typeof l == "string" && l.startsWith(d) ? s.replacePrefix[1] + l.substring(d.length) : l;
      }, jo);
      function jo(l) {
        this["@@propmod"] = l;
      }
      function Ko(l, s) {
        for (var d = o(s), m = d.length, C = !1, b = 0; b < m; ++b) {
          var P = d[b], $ = s[P], D = Y(l, P);
          $ instanceof wn ? (F(l, P, $.execute(D)), C = !0) : D !== $ && (F(l, P, $), C = !0);
        }
        return C;
      }
      var Wo = (d2.prototype._trans = function(l, s, d) {
        var m = this._tx || Te.trans, C = this.name, b = _t && typeof console < "u" && console.createTask && console.createTask("Dexie: ".concat(l === "readonly" ? "read" : "write", " ").concat(this.name));
        function P(N, W, B) {
          if (!B.schema[C]) throw new ye.NotFound("Table " + C + " not part of transaction");
          return s(B.idbtrans, B);
        }
        var $ = N0();
        try {
          var D = m && m.db._novip === this.db._novip ? m === Te.trans ? m._promise(l, P, d) : Yt(function() {
            return m._promise(l, P, d);
          }, { trans: m, transless: Te.transless || Te }) : (function N(W, B, H, z) {
            if (W.idbdb && (W._state.openComplete || Te.letThrough || W._vip)) {
              var j = W._createTransaction(B, H, W._dbSchema);
              try {
                j.create(), W._state.PR1398_maxLoop = 3;
              } catch (K) {
                return K.name === de.InvalidState && W.isOpen() && 0 < --W._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), W.close({ disableAutoOpen: !1 }), W.open().then(function() {
                  return N(W, B, H, z);
                })) : C2(K);
              }
              return j._promise(B, function(K, q) {
                return Yt(function() {
                  return Te.trans = j, z(K, q, j);
                });
              }).then(function(K) {
                if (B === "readwrite") try {
                  j.idbtrans.commit();
                } catch {
                }
                return B === "readonly" ? K : j._completion.then(function() {
                  return K;
                });
              });
            }
            if (W._state.openComplete) return C2(new ye.DatabaseClosed(W._state.dbOpenError));
            if (!W._state.isBeingOpened) {
              if (!W._state.autoOpen) return C2(new ye.DatabaseClosed());
              W.open().catch(Me);
            }
            return W._state.dbReadyPromise.then(function() {
              return N(W, B, H, z);
            });
          })(this.db, l, [this.name], P);
          return b && (D._consoleTask = b, D = D.catch(function(N) {
            return console.trace(N), C2(N);
          })), D;
        } finally {
          $ && z0();
        }
      }, d2.prototype.get = function(l, s) {
        var d = this;
        return l && l.constructor === Object ? this.where(l).first(s) : l == null ? C2(new ye.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(m) {
          return d.core.get({ trans: m, key: l }).then(function(C) {
            return d.hook.reading.fire(C);
          });
        }).then(s);
      }, d2.prototype.where = function(l) {
        if (typeof l == "string") return new this.db.WhereClause(this, l);
        if (u(l)) return new this.db.WhereClause(this, "[".concat(l.join("+"), "]"));
        var s = o(l);
        if (s.length === 1) return this.where(s[0]).equals(l[s[0]]);
        var d = this.schema.indexes.concat(this.schema.primKey).filter(function($) {
          if ($.compound && s.every(function(N) {
            return 0 <= $.keyPath.indexOf(N);
          })) {
            for (var D = 0; D < s.length; ++D) if (s.indexOf($.keyPath[D]) === -1) return !1;
            return !0;
          }
          return !1;
        }).sort(function($, D) {
          return $.keyPath.length - D.keyPath.length;
        })[0];
        if (d && this.db._maxKey !== y0) {
          var b = d.keyPath.slice(0, s.length);
          return this.where(b).equals(b.map(function(D) {
            return l[D];
          }));
        }
        !d && _t && console.warn("The query ".concat(JSON.stringify(l), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(s.join("+"), "]"));
        var m = this.schema.idxByName;
        function C($, D) {
          return Qe($, D) === 0;
        }
        var P = s.reduce(function(B, D) {
          var N = B[0], W = B[1], B = m[D], H = l[D];
          return [N || B, N || !B ? C0(W, B && B.multi ? function(z) {
            return z = Y(z, D), u(z) && z.some(function(j) {
              return C(H, j);
            });
          } : function(z) {
            return C(H, Y(z, D));
          }) : W];
        }, [null, null]), b = P[0], P = P[1];
        return b ? this.where(b.name).equals(l[b.keyPath]).filter(P) : d ? this.filter(P) : this.where(s).equals("");
      }, d2.prototype.filter = function(l) {
        return this.toCollection().and(l);
      }, d2.prototype.count = function(l) {
        return this.toCollection().count(l);
      }, d2.prototype.offset = function(l) {
        return this.toCollection().offset(l);
      }, d2.prototype.limit = function(l) {
        return this.toCollection().limit(l);
      }, d2.prototype.each = function(l) {
        return this.toCollection().each(l);
      }, d2.prototype.toArray = function(l) {
        return this.toCollection().toArray(l);
      }, d2.prototype.toCollection = function() {
        return new this.db.Collection(new this.db.WhereClause(this));
      }, d2.prototype.orderBy = function(l) {
        return new this.db.Collection(new this.db.WhereClause(this, u(l) ? "[".concat(l.join("+"), "]") : l));
      }, d2.prototype.reverse = function() {
        return this.toCollection().reverse();
      }, d2.prototype.mapToClass = function(l) {
        var s, d = this.db, m = this.name;
        function C() {
          return s !== null && s.apply(this, arguments) || this;
        }
        (this.schema.mappedClass = l).prototype instanceof Do && ((function(D, N) {
          if (typeof N != "function" && N !== null) throw new TypeError("Class extends value " + String(N) + " is not a constructor or null");
          function W() {
            this.constructor = D;
          }
          n(D, N), D.prototype = N === null ? Object.create(N) : (W.prototype = N.prototype, new W());
        })(C, s = l), Object.defineProperty(C.prototype, "db", { get: function() {
          return d;
        }, enumerable: !1, configurable: !0 }), C.prototype.table = function() {
          return m;
        }, l = C);
        for (var b = /* @__PURE__ */ new Set(), P = l.prototype; P; P = f(P)) Object.getOwnPropertyNames(P).forEach(function(D) {
          return b.add(D);
        });
        function $(D) {
          if (!D) return D;
          var N, W = Object.create(l.prototype);
          for (N in D) if (!b.has(N)) try {
            W[N] = D[N];
          } catch {
          }
          return W;
        }
        return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = $, this.hook("reading", $), l;
      }, d2.prototype.defineClass = function() {
        return this.mapToClass(function(l) {
          c(this, l);
        });
      }, d2.prototype.add = function(l, s) {
        var d = this, m = this.schema.primKey, C = m.auto, b = m.keyPath, P = l;
        return b && C && (P = Ia(b)(l)), this._trans("readwrite", function($) {
          return d.core.mutate({ trans: $, type: "add", keys: s != null ? [s] : null, values: [P] });
        }).then(function($) {
          return $.numFailures ? Ie.reject($.failures[0]) : $.lastResult;
        }).then(function($) {
          if (b) try {
            F(l, b, $);
          } catch {
          }
          return $;
        });
      }, d2.prototype.upsert = function(l, s) {
        var d = this, m = this.schema.primKey.keyPath;
        return this._trans("readwrite", function(C) {
          return d.core.get({ trans: C, key: l }).then(function(b) {
            var P = b ?? {};
            return Ko(P, s), m && F(P, m, l), d.core.mutate({ trans: C, type: "put", values: [P], keys: [l], upsert: !0, updates: { keys: [l], changeSpecs: [s] } }).then(function($) {
              return $.numFailures ? Ie.reject($.failures[0]) : !!b;
            });
          });
        });
      }, d2.prototype.update = function(l, s) {
        return typeof l != "object" || u(l) ? this.where(":id").equals(l).modify(s) : (l = Y(l, this.schema.primKey.keyPath), l === void 0 ? C2(new ye.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(l).modify(s));
      }, d2.prototype.put = function(l, s) {
        var d = this, m = this.schema.primKey, C = m.auto, b = m.keyPath, P = l;
        return b && C && (P = Ia(b)(l)), this._trans("readwrite", function($) {
          return d.core.mutate({ trans: $, type: "put", values: [P], keys: s != null ? [s] : null });
        }).then(function($) {
          return $.numFailures ? Ie.reject($.failures[0]) : $.lastResult;
        }).then(function($) {
          if (b) try {
            F(l, b, $);
          } catch {
          }
          return $;
        });
      }, d2.prototype.delete = function(l) {
        var s = this;
        return this._trans("readwrite", function(d) {
          return s.core.mutate({ trans: d, type: "delete", keys: [l] }).then(function(m) {
            return Ea(s, [l], m);
          }).then(function(m) {
            return m.numFailures ? Ie.reject(m.failures[0]) : void 0;
          });
        });
      }, d2.prototype.clear = function() {
        var l = this;
        return this._trans("readwrite", function(s) {
          return l.core.mutate({ trans: s, type: "deleteRange", range: Ro }).then(function(d) {
            return Ea(l, null, d);
          });
        }).then(function(s) {
          return s.numFailures ? Ie.reject(s.failures[0]) : void 0;
        });
      }, d2.prototype.bulkGet = function(l) {
        var s = this;
        return this._trans("readonly", function(d) {
          return s.core.getMany({ keys: l, trans: d }).then(function(m) {
            return m.map(function(C) {
              return s.hook.reading.fire(C);
            });
          });
        });
      }, d2.prototype.bulkAdd = function(l, s, d) {
        var m = this, C = Array.isArray(s) ? s : void 0, b = (d = d || (C ? void 0 : s)) ? d.allKeys : void 0;
        return this._trans("readwrite", function(P) {
          var N = m.schema.primKey, $ = N.auto, N = N.keyPath;
          if (N && C) throw new ye.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
          if (C && C.length !== l.length) throw new ye.InvalidArgument("Arguments objects and keys must have the same length");
          var D = l.length, N = N && $ ? l.map(Ia(N)) : l;
          return m.core.mutate({ trans: P, type: "add", keys: C, values: N, wantResults: b }).then(function(j) {
            var B = j.numFailures, H = j.results, z = j.lastResult, j = j.failures;
            if (B === 0) return b ? H : z;
            throw new De("".concat(m.name, ".bulkAdd(): ").concat(B, " of ").concat(D, " operations failed"), j);
          });
        });
      }, d2.prototype.bulkPut = function(l, s, d) {
        var m = this, C = Array.isArray(s) ? s : void 0, b = (d = d || (C ? void 0 : s)) ? d.allKeys : void 0;
        return this._trans("readwrite", function(P) {
          var N = m.schema.primKey, $ = N.auto, N = N.keyPath;
          if (N && C) throw new ye.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
          if (C && C.length !== l.length) throw new ye.InvalidArgument("Arguments objects and keys must have the same length");
          var D = l.length, N = N && $ ? l.map(Ia(N)) : l;
          return m.core.mutate({ trans: P, type: "put", keys: C, values: N, wantResults: b }).then(function(j) {
            var B = j.numFailures, H = j.results, z = j.lastResult, j = j.failures;
            if (B === 0) return b ? H : z;
            throw new De("".concat(m.name, ".bulkPut(): ").concat(B, " of ").concat(D, " operations failed"), j);
          });
        });
      }, d2.prototype.bulkUpdate = function(l) {
        var s = this, d = this.core, m = l.map(function(P) {
          return P.key;
        }), C = l.map(function(P) {
          return P.changes;
        }), b = [];
        return this._trans("readwrite", function(P) {
          return d.getMany({ trans: P, keys: m, cache: "clone" }).then(function($) {
            var D = [], N = [];
            l.forEach(function(B, H) {
              var z = B.key, j = B.changes, K = $[H];
              if (K) {
                for (var q = 0, Z = Object.keys(j); q < Z.length; q++) {
                  var Q = Z[q], ie = j[Q];
                  if (Q === s.schema.primKey.keyPath) {
                    if (Qe(ie, z) !== 0) throw new ye.Constraint("Cannot update primary key in bulkUpdate()");
                  } else F(K, Q, ie);
                }
                b.push(H), D.push(z), N.push(K);
              }
            });
            var W = D.length;
            return d.mutate({ trans: P, type: "put", keys: D, values: N, updates: { keys: m, changeSpecs: C } }).then(function(B) {
              var H = B.numFailures, z = B.failures;
              if (H === 0) return W;
              for (var j = 0, K = Object.keys(z); j < K.length; j++) {
                var q, Z = K[j], Q = b[Number(Z)];
                Q != null && (q = z[Z], delete z[Z], z[Q] = q);
              }
              throw new De("".concat(s.name, ".bulkUpdate(): ").concat(H, " of ").concat(W, " operations failed"), z);
            });
          });
        });
      }, d2.prototype.bulkDelete = function(l) {
        var s = this, d = l.length;
        return this._trans("readwrite", function(m) {
          return s.core.mutate({ trans: m, type: "delete", keys: l }).then(function(C) {
            return Ea(s, l, C);
          });
        }).then(function(P) {
          var C = P.numFailures, b = P.lastResult, P = P.failures;
          if (C === 0) return b;
          throw new De("".concat(s.name, ".bulkDelete(): ").concat(C, " of ").concat(d, " operations failed"), P);
        });
      }, d2);
      function d2() {
      }
      function xn(l) {
        function s(P, $) {
          if ($) {
            for (var D = arguments.length, N = new Array(D - 1); --D; ) N[D - 1] = arguments[D];
            return d[P].subscribe.apply(null, N), l;
          }
          if (typeof P == "string") return d[P];
        }
        var d = {};
        s.addEventType = b;
        for (var m = 1, C = arguments.length; m < C; ++m) b(arguments[m]);
        return s;
        function b(P, $, D) {
          if (typeof P != "object") {
            var N;
            $ = $ || R4;
            var W = { subscribers: [], fire: D = D || Me, subscribe: function(B) {
              W.subscribers.indexOf(B) === -1 && (W.subscribers.push(B), W.fire = $(W.fire, B));
            }, unsubscribe: function(B) {
              W.subscribers = W.subscribers.filter(function(H) {
                return H !== B;
              }), W.fire = W.subscribers.reduce($, D);
            } };
            return d[P] = s[P] = W;
          }
          o(N = P).forEach(function(B) {
            var H = N[B];
            if (u(H)) b(B, N[B][0], N[B][1]);
            else {
              if (H !== "asap") throw new ye.InvalidArgument("Invalid event config");
              var z = b(B, _2, function() {
                for (var j = arguments.length, K = new Array(j); j--; ) K[j] = arguments[j];
                z.subscribers.forEach(function(q) {
                  O(function() {
                    q.apply(null, K);
                  });
                });
              });
            }
          });
        }
      }
      function Sn(l, s) {
        return S(s).from({ prototype: l }), s;
      }
      function W0(l, s) {
        return !(l.filter || l.algorithm || l.or) && (s ? l.justLimit : !l.replayFilter);
      }
      function fi(l, s) {
        l.filter = C0(l.filter, s);
      }
      function vi(l, s, d) {
        var m = l.replayFilter;
        l.replayFilter = m ? function() {
          return C0(m(), s());
        } : s, l.justLimit = d && !m;
      }
      function Aa(l, s) {
        if (l.isPrimKey) return s.primaryKey;
        var d = s.getIndexByKeyPath(l.index);
        if (!d) throw new ye.Schema("KeyPath " + l.index + " on object store " + s.name + " is not indexed");
        return d;
      }
      function qo(l, s, d) {
        var m = Aa(l, s.schema);
        return s.openCursor({ trans: d, values: !l.keysOnly, reverse: l.dir === "prev", unique: !!l.unique, query: { index: m, range: l.range } });
      }
      function $a(l, s, d, m) {
        var C = l.replayFilter ? C0(l.filter, l.replayFilter()) : l.filter;
        if (l.or) {
          var b = {}, P = function($, D, N) {
            var W, B;
            C && !C(D, N, function(H) {
              return D.stop(H);
            }, function(H) {
              return D.fail(H);
            }) || ((B = "" + (W = D.primaryKey)) == "[object ArrayBuffer]" && (B = "" + new Uint8Array(W)), h(b, B) || (b[B] = !0, s($, D, N)));
          };
          return Promise.all([l.or._iterate(P, d), Ho(qo(l, m, d), l.algorithm, P, !l.keysOnly && l.valueMapper)]);
        }
        return Ho(qo(l, m, d), C0(l.algorithm, C), s, !l.keysOnly && l.valueMapper);
      }
      function Ho(l, s, d, m) {
        var C = v2(m ? function(b, P, $) {
          return d(m(b), P, $);
        } : d);
        return l.then(function(b) {
          if (b) return b.start(function() {
            var P = function() {
              return b.continue();
            };
            s && !s(b, function($) {
              return P = $;
            }, function($) {
              b.stop($), P = Me;
            }, function($) {
              b.fail($), P = Me;
            }) || C(b.value, b, function($) {
              return P = $;
            }), P();
          });
        });
      }
      var W4 = (t2.prototype._read = function(l, s) {
        var d = this._ctx;
        return d.error ? d.table._trans(null, C2.bind(null, d.error)) : d.table._trans("readonly", l).then(s);
      }, t2.prototype._write = function(l) {
        var s = this._ctx;
        return s.error ? s.table._trans(null, C2.bind(null, s.error)) : s.table._trans("readwrite", l, "locked");
      }, t2.prototype._addAlgorithm = function(l) {
        var s = this._ctx;
        s.algorithm = C0(s.algorithm, l);
      }, t2.prototype._iterate = function(l, s) {
        return $a(this._ctx, l, s, this._ctx.table.core);
      }, t2.prototype.clone = function(l) {
        var s = Object.create(this.constructor.prototype), d = Object.create(this._ctx);
        return l && c(d, l), s._ctx = d, s;
      }, t2.prototype.raw = function() {
        return this._ctx.valueMapper = null, this;
      }, t2.prototype.each = function(l) {
        var s = this._ctx;
        return this._read(function(d) {
          return $a(s, l, d, s.table.core);
        });
      }, t2.prototype.count = function(l) {
        var s = this;
        return this._read(function(d) {
          var m = s._ctx, C = m.table.core;
          if (W0(m, !0)) return C.count({ trans: d, query: { index: Aa(m, C.schema), range: m.range } }).then(function(P) {
            return Math.min(P, m.limit);
          });
          var b = 0;
          return $a(m, function() {
            return ++b, !1;
          }, d, C).then(function() {
            return b;
          });
        }).then(l);
      }, t2.prototype.sortBy = function(l, s) {
        var d = l.split(".").reverse(), m = d[0], C = d.length - 1;
        function b(D, N) {
          return N ? b(D[d[N]], N - 1) : D[m];
        }
        var P = this._ctx.dir === "next" ? 1 : -1;
        function $(D, N) {
          return Qe(b(D, C), b(N, C)) * P;
        }
        return this.toArray(function(D) {
          return D.sort($);
        }).then(s);
      }, t2.prototype.toArray = function(l) {
        var s = this;
        return this._read(function(d) {
          var m = s._ctx;
          if (m.dir === "next" && W0(m, !0) && 0 < m.limit) {
            var C = m.valueMapper, b = Aa(m, m.table.core.schema);
            return m.table.core.query({ trans: d, limit: m.limit, values: !0, query: { index: b, range: m.range } }).then(function($) {
              return $ = $.result, C ? $.map(C) : $;
            });
          }
          var P = [];
          return $a(m, function($) {
            return P.push($);
          }, d, m.table.core).then(function() {
            return P;
          });
        }, l);
      }, t2.prototype.offset = function(l) {
        var s = this._ctx;
        return l <= 0 || (s.offset += l, W0(s) ? vi(s, function() {
          var d = l;
          return function(m, C) {
            return d === 0 || (d === 1 ? --d : C(function() {
              m.advance(d), d = 0;
            }), !1);
          };
        }) : vi(s, function() {
          var d = l;
          return function() {
            return --d < 0;
          };
        })), this;
      }, t2.prototype.limit = function(l) {
        return this._ctx.limit = Math.min(this._ctx.limit, l), vi(this._ctx, function() {
          var s = l;
          return function(d, m, C) {
            return --s <= 0 && m(C), 0 <= s;
          };
        }, !0), this;
      }, t2.prototype.until = function(l, s) {
        return fi(this._ctx, function(d, m, C) {
          return !l(d.value) || (m(C), s);
        }), this;
      }, t2.prototype.first = function(l) {
        return this.limit(1).toArray(function(s) {
          return s[0];
        }).then(l);
      }, t2.prototype.last = function(l) {
        return this.reverse().first(l);
      }, t2.prototype.filter = function(l) {
        var s;
        return fi(this._ctx, function(d) {
          return l(d.value);
        }), (s = this._ctx).isMatch = C0(s.isMatch, l), this;
      }, t2.prototype.and = function(l) {
        return this.filter(l);
      }, t2.prototype.or = function(l) {
        return new this.db.WhereClause(this._ctx.table, l, this);
      }, t2.prototype.reverse = function() {
        return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
      }, t2.prototype.desc = function() {
        return this.reverse();
      }, t2.prototype.eachKey = function(l) {
        var s = this._ctx;
        return s.keysOnly = !s.isMatch, this.each(function(d, m) {
          l(m.key, m);
        });
      }, t2.prototype.eachUniqueKey = function(l) {
        return this._ctx.unique = "unique", this.eachKey(l);
      }, t2.prototype.eachPrimaryKey = function(l) {
        var s = this._ctx;
        return s.keysOnly = !s.isMatch, this.each(function(d, m) {
          l(m.primaryKey, m);
        });
      }, t2.prototype.keys = function(l) {
        var s = this._ctx;
        s.keysOnly = !s.isMatch;
        var d = [];
        return this.each(function(m, C) {
          d.push(C.key);
        }).then(function() {
          return d;
        }).then(l);
      }, t2.prototype.primaryKeys = function(l) {
        var s = this._ctx;
        if (s.dir === "next" && W0(s, !0) && 0 < s.limit) return this._read(function(m) {
          var C = Aa(s, s.table.core.schema);
          return s.table.core.query({ trans: m, values: !1, limit: s.limit, query: { index: C, range: s.range } });
        }).then(function(m) {
          return m.result;
        }).then(l);
        s.keysOnly = !s.isMatch;
        var d = [];
        return this.each(function(m, C) {
          d.push(C.primaryKey);
        }).then(function() {
          return d;
        }).then(l);
      }, t2.prototype.uniqueKeys = function(l) {
        return this._ctx.unique = "unique", this.keys(l);
      }, t2.prototype.firstKey = function(l) {
        return this.limit(1).keys(function(s) {
          return s[0];
        }).then(l);
      }, t2.prototype.lastKey = function(l) {
        return this.reverse().firstKey(l);
      }, t2.prototype.distinct = function() {
        var l = this._ctx, l = l.index && l.table.schema.idxByName[l.index];
        if (!l || !l.multi) return this;
        var s = {};
        return fi(this._ctx, function(C) {
          var m = C.primaryKey.toString(), C = h(s, m);
          return s[m] = !0, !C;
        }), this;
      }, t2.prototype.modify = function(l) {
        var s = this, d = this._ctx;
        return this._write(function(m) {
          var C = typeof l == "function" ? l : function(K) {
            return Ko(K, l);
          }, b = d.table.core, N = b.schema.primaryKey, P = N.outbound, $ = N.extractKey, D = 200, N = s.db._options.modifyChunkSize;
          N && (D = typeof N == "object" ? N[b.name] || N["*"] || 200 : N);
          function W(K, Q) {
            var Z = Q.failures, Q = Q.numFailures;
            H += K - Q;
            for (var ie = 0, ue = o(Z); ie < ue.length; ie++) {
              var he = ue[ie];
              B.push(Z[he]);
            }
          }
          var B = [], H = 0, z = [], j = l === Uo;
          return s.clone().primaryKeys().then(function(K) {
            function q(Q) {
              var ie = Math.min(D, K.length - Q), ue = K.slice(Q, Q + ie);
              return (j ? Promise.resolve([]) : b.getMany({ trans: m, keys: ue, cache: "immutable" })).then(function(he) {
                var Se = [], ge = [], Ce = P ? [] : null, _e = j ? ue : [];
                if (!j) for (var xe = 0; xe < ie; ++xe) {
                  var $e = he[xe], Ue = { value: ae($e), primKey: K[Q + xe] };
                  C.call(Ue, Ue.value, Ue) !== !1 && (Ue.value == null ? _e.push(K[Q + xe]) : P || Qe($($e), $(Ue.value)) === 0 ? (ge.push(Ue.value), P && Ce.push(K[Q + xe])) : (_e.push(K[Q + xe]), Se.push(Ue.value)));
                }
                return Promise.resolve(0 < Se.length && b.mutate({ trans: m, type: "add", values: Se }).then(function(Ge) {
                  for (var Ze in Ge.failures) _e.splice(parseInt(Ze), 1);
                  W(Se.length, Ge);
                })).then(function() {
                  return (0 < ge.length || Z && typeof l == "object") && b.mutate({ trans: m, type: "put", keys: Ce, values: ge, criteria: Z, changeSpec: typeof l != "function" && l, isAdditionalChunk: 0 < Q }).then(function(Ge) {
                    return W(ge.length, Ge);
                  });
                }).then(function() {
                  return (0 < _e.length || Z && j) && b.mutate({ trans: m, type: "delete", keys: _e, criteria: Z, isAdditionalChunk: 0 < Q }).then(function(Ge) {
                    return Ea(d.table, _e, Ge);
                  }).then(function(Ge) {
                    return W(_e.length, Ge);
                  });
                }).then(function() {
                  return K.length > Q + ie && q(Q + D);
                });
              });
            }
            var Z = W0(d) && d.limit === 1 / 0 && (typeof l != "function" || j) && { index: d.index, range: d.range };
            return q(0).then(function() {
              if (0 < B.length) throw new Re("Error modifying one or more objects", B, H, z);
              return K.length;
            });
          });
        });
      }, t2.prototype.delete = function() {
        var l = this._ctx, s = l.range;
        return !W0(l) || l.table.schema.yProps || !l.isPrimKey && s.type !== 3 ? this.modify(Uo) : this._write(function(d) {
          var m = l.table.core.schema.primaryKey, C = s;
          return l.table.core.count({ trans: d, query: { index: m, range: C } }).then(function(b) {
            return l.table.core.mutate({ trans: d, type: "deleteRange", range: C }).then(function(D) {
              var $ = D.failures, D = D.numFailures;
              if (D) throw new Re("Could not delete some values", Object.keys($).map(function(N) {
                return $[N];
              }), b - D);
              return b - D;
            });
          });
        });
      }, t2);
      function t2() {
      }
      var Uo = function(l, s) {
        return s.value = null;
      };
      function q4(l, s) {
        return l < s ? -1 : l === s ? 0 : 1;
      }
      function H4(l, s) {
        return s < l ? -1 : l === s ? 0 : 1;
      }
      function X2(l, s, d) {
        return l = l instanceof Zo ? new l.Collection(l) : l, l._ctx.error = new (d || TypeError)(s), l;
      }
      function q0(l) {
        return new l.Collection(l, function() {
          return Go("");
        }).limit(0);
      }
      function Ta(l, s, d, m) {
        var C, b, P, $, D, N, W, B = d.length;
        if (!d.every(function(j) {
          return typeof j == "string";
        })) return X2(l, Mo);
        function H(j) {
          C = j === "next" ? function(q) {
            return q.toUpperCase();
          } : function(q) {
            return q.toLowerCase();
          }, b = j === "next" ? function(q) {
            return q.toLowerCase();
          } : function(q) {
            return q.toUpperCase();
          }, P = j === "next" ? q4 : H4;
          var K = d.map(function(q) {
            return { lower: b(q), upper: C(q) };
          }).sort(function(q, Z) {
            return P(q.lower, Z.lower);
          });
          $ = K.map(function(q) {
            return q.upper;
          }), D = K.map(function(q) {
            return q.lower;
          }), W = (N = j) === "next" ? "" : m;
        }
        H("next"), l = new l.Collection(l, function() {
          return Jt($[0], D[B - 1] + m);
        }), l._ondirectionchange = function(j) {
          H(j);
        };
        var z = 0;
        return l._addAlgorithm(function(j, K, q) {
          var Z = j.key;
          if (typeof Z != "string") return !1;
          var Q = b(Z);
          if (s(Q, D, z)) return !0;
          for (var ie = null, ue = z; ue < B; ++ue) {
            var he = (function(Se, ge, Ce, _e, xe, $e) {
              for (var Ue = Math.min(Se.length, _e.length), Ge = -1, Ze = 0; Ze < Ue; ++Ze) {
                var Q2 = ge[Ze];
                if (Q2 !== _e[Ze]) return xe(Se[Ze], Ce[Ze]) < 0 ? Se.substr(0, Ze) + Ce[Ze] + Ce.substr(Ze + 1) : xe(Se[Ze], _e[Ze]) < 0 ? Se.substr(0, Ze) + _e[Ze] + Ce.substr(Ze + 1) : 0 <= Ge ? Se.substr(0, Ge) + ge[Ge] + Ce.substr(Ge + 1) : null;
                xe(Se[Ze], Q2) < 0 && (Ge = Ze);
              }
              return Ue < _e.length && $e === "next" ? Se + Ce.substr(Se.length) : Ue < Se.length && $e === "prev" ? Se.substr(0, Ce.length) : Ge < 0 ? null : Se.substr(0, Ge) + _e[Ge] + Ce.substr(Ge + 1);
            })(Z, Q, $[ue], D[ue], P, N);
            he === null && ie === null ? z = ue + 1 : (ie === null || 0 < P(ie, he)) && (ie = he);
          }
          return K(ie !== null ? function() {
            j.continue(ie + W);
          } : q), !1;
        }), l;
      }
      function Jt(l, s, d, m) {
        return { type: 2, lower: l, upper: s, lowerOpen: d, upperOpen: m };
      }
      function Go(l) {
        return { type: 1, lower: l, upper: l };
      }
      var Zo = (Object.defineProperty(E2.prototype, "Collection", { get: function() {
        return this._ctx.table.db.Collection;
      }, enumerable: !1, configurable: !0 }), E2.prototype.between = function(l, s, d, m) {
        d = d !== !1, m = m === !0;
        try {
          return 0 < this._cmp(l, s) || this._cmp(l, s) === 0 && (d || m) && (!d || !m) ? q0(this) : new this.Collection(this, function() {
            return Jt(l, s, !d, !m);
          });
        } catch {
          return X2(this, Ot);
        }
      }, E2.prototype.equals = function(l) {
        return l == null ? X2(this, Ot) : new this.Collection(this, function() {
          return Go(l);
        });
      }, E2.prototype.above = function(l) {
        return l == null ? X2(this, Ot) : new this.Collection(this, function() {
          return Jt(l, void 0, !0);
        });
      }, E2.prototype.aboveOrEqual = function(l) {
        return l == null ? X2(this, Ot) : new this.Collection(this, function() {
          return Jt(l, void 0, !1);
        });
      }, E2.prototype.below = function(l) {
        return l == null ? X2(this, Ot) : new this.Collection(this, function() {
          return Jt(void 0, l, !1, !0);
        });
      }, E2.prototype.belowOrEqual = function(l) {
        return l == null ? X2(this, Ot) : new this.Collection(this, function() {
          return Jt(void 0, l);
        });
      }, E2.prototype.startsWith = function(l) {
        return typeof l != "string" ? X2(this, Mo) : this.between(l, l + y0, !0, !0);
      }, E2.prototype.startsWithIgnoreCase = function(l) {
        return l === "" ? this.startsWith(l) : Ta(this, function(s, d) {
          return s.indexOf(d[0]) === 0;
        }, [l], y0);
      }, E2.prototype.equalsIgnoreCase = function(l) {
        return Ta(this, function(s, d) {
          return s === d[0];
        }, [l], "");
      }, E2.prototype.anyOfIgnoreCase = function() {
        var l = le.apply(we, arguments);
        return l.length === 0 ? q0(this) : Ta(this, function(s, d) {
          return d.indexOf(s) !== -1;
        }, l, "");
      }, E2.prototype.startsWithAnyOfIgnoreCase = function() {
        var l = le.apply(we, arguments);
        return l.length === 0 ? q0(this) : Ta(this, function(s, d) {
          return d.some(function(m) {
            return s.indexOf(m) === 0;
          });
        }, l, y0);
      }, E2.prototype.anyOf = function() {
        var l = this, s = le.apply(we, arguments), d = this._cmp;
        try {
          s.sort(d);
        } catch {
          return X2(this, Ot);
        }
        if (s.length === 0) return q0(this);
        var m = new this.Collection(this, function() {
          return Jt(s[0], s[s.length - 1]);
        });
        m._ondirectionchange = function(b) {
          d = b === "next" ? l._ascending : l._descending, s.sort(d);
        };
        var C = 0;
        return m._addAlgorithm(function(b, P, $) {
          for (var D = b.key; 0 < d(D, s[C]); ) if (++C === s.length) return P($), !1;
          return d(D, s[C]) === 0 || (P(function() {
            b.continue(s[C]);
          }), !1);
        }), m;
      }, E2.prototype.notEqual = function(l) {
        return this.inAnyRange([[-1 / 0, l], [l, this.db._maxKey]], { includeLowers: !1, includeUppers: !1 });
      }, E2.prototype.noneOf = function() {
        var l = le.apply(we, arguments);
        if (l.length === 0) return new this.Collection(this);
        try {
          l.sort(this._ascending);
        } catch {
          return X2(this, Ot);
        }
        var s = l.reduce(function(d, m) {
          return d ? d.concat([[d[d.length - 1][1], m]]) : [[-1 / 0, m]];
        }, null);
        return s.push([l[l.length - 1], this.db._maxKey]), this.inAnyRange(s, { includeLowers: !1, includeUppers: !1 });
      }, E2.prototype.inAnyRange = function(Z, s) {
        var d = this, m = this._cmp, C = this._ascending, b = this._descending, P = this._min, $ = this._max;
        if (Z.length === 0) return q0(this);
        if (!Z.every(function(Q) {
          return Q[0] !== void 0 && Q[1] !== void 0 && C(Q[0], Q[1]) <= 0;
        })) return X2(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", ye.InvalidArgument);
        var D = !s || s.includeLowers !== !1, N = s && s.includeUppers === !0, W, B = C;
        function H(Q, ie) {
          return B(Q[0], ie[0]);
        }
        try {
          (W = Z.reduce(function(Q, ie) {
            for (var ue = 0, he = Q.length; ue < he; ++ue) {
              var Se = Q[ue];
              if (m(ie[0], Se[1]) < 0 && 0 < m(ie[1], Se[0])) {
                Se[0] = P(Se[0], ie[0]), Se[1] = $(Se[1], ie[1]);
                break;
              }
            }
            return ue === he && Q.push(ie), Q;
          }, [])).sort(H);
        } catch {
          return X2(this, Ot);
        }
        var z = 0, j = N ? function(Q) {
          return 0 < C(Q, W[z][1]);
        } : function(Q) {
          return 0 <= C(Q, W[z][1]);
        }, K = D ? function(Q) {
          return 0 < b(Q, W[z][0]);
        } : function(Q) {
          return 0 <= b(Q, W[z][0]);
        }, q = j, Z = new this.Collection(this, function() {
          return Jt(W[0][0], W[W.length - 1][1], !D, !N);
        });
        return Z._ondirectionchange = function(Q) {
          B = Q === "next" ? (q = j, C) : (q = K, b), W.sort(H);
        }, Z._addAlgorithm(function(Q, ie, ue) {
          for (var he, Se = Q.key; q(Se); ) if (++z === W.length) return ie(ue), !1;
          return !j(he = Se) && !K(he) || (d._cmp(Se, W[z][1]) === 0 || d._cmp(Se, W[z][0]) === 0 || ie(function() {
            B === C ? Q.continue(W[z][0]) : Q.continue(W[z][1]);
          }), !1);
        }), Z;
      }, E2.prototype.startsWithAnyOf = function() {
        var l = le.apply(we, arguments);
        return l.every(function(s) {
          return typeof s == "string";
        }) ? l.length === 0 ? q0(this) : this.inAnyRange(l.map(function(s) {
          return [s, s + y0];
        })) : X2(this, "startsWithAnyOf() only works with strings");
      }, E2);
      function E2() {
      }
      function Pt(l) {
        return v2(function(s) {
          return kn(s), l(s.target.error), !1;
        });
      }
      function kn(l) {
        l.stopPropagation && l.stopPropagation(), l.preventDefault && l.preventDefault();
      }
      var _n = "storagemutated", mi = "x-storagemutated-1", e0 = xn(null, _n), U4 = (Vt.prototype._lock = function() {
        return T(!Te.global), ++this._reculock, this._reculock !== 1 || Te.global || (Te.lockOwnerFor = this), this;
      }, Vt.prototype._unlock = function() {
        if (T(!Te.global), --this._reculock == 0) for (Te.global || (Te.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
          var l = this._blockedFuncs.shift();
          try {
            h0(l[1], l[0]);
          } catch {
          }
        }
        return this;
      }, Vt.prototype._locked = function() {
        return this._reculock && Te.lockOwnerFor !== this;
      }, Vt.prototype.create = function(l) {
        var s = this;
        if (!this.mode) return this;
        var d = this.db.idbdb, m = this.db._state.dbOpenError;
        if (T(!this.idbtrans), !l && !d) switch (m && m.name) {
          case "DatabaseClosedError":
            throw new ye.DatabaseClosed(m);
          case "MissingAPIError":
            throw new ye.MissingAPI(m.message, m);
          default:
            throw new ye.OpenFailed(m);
        }
        if (!this.active) throw new ye.TransactionInactive();
        return T(this._completion._state === null), (l = this.idbtrans = l || (this.db.core || d).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = v2(function(C) {
          kn(C), s._reject(l.error);
        }), l.onabort = v2(function(C) {
          kn(C), s.active && s._reject(new ye.Abort(l.error)), s.active = !1, s.on("abort").fire(C);
        }), l.oncomplete = v2(function() {
          s.active = !1, s._resolve(), "mutatedParts" in l && e0.storagemutated.fire(l.mutatedParts);
        }), this;
      }, Vt.prototype._promise = function(l, s, d) {
        var m = this;
        if (l === "readwrite" && this.mode !== "readwrite") return C2(new ye.ReadOnly("Transaction is readonly"));
        if (!this.active) return C2(new ye.TransactionInactive());
        if (this._locked()) return new Ie(function(b, P) {
          m._blockedFuncs.push([function() {
            m._promise(l, s, d).then(b, P);
          }, Te]);
        });
        if (d) return Yt(function() {
          var b = new Ie(function(P, $) {
            m._lock();
            var D = s(P, $, m);
            D && D.then && D.then(P, $);
          });
          return b.finally(function() {
            return m._unlock();
          }), b._lib = !0, b;
        });
        var C = new Ie(function(b, P) {
          var $ = s(b, P, m);
          $ && $.then && $.then(b, P);
        });
        return C._lib = !0, C;
      }, Vt.prototype._root = function() {
        return this.parent ? this.parent._root() : this;
      }, Vt.prototype.waitFor = function(l) {
        var s, d = this._root(), m = Ie.resolve(l);
        d._waitingFor ? d._waitingFor = d._waitingFor.then(function() {
          return m;
        }) : (d._waitingFor = m, d._waitingQueue = [], s = d.idbtrans.objectStore(d.storeNames[0]), (function b() {
          for (++d._spinCount; d._waitingQueue.length; ) d._waitingQueue.shift()();
          d._waitingFor && (s.get(-1 / 0).onsuccess = b);
        })());
        var C = d._waitingFor;
        return new Ie(function(b, P) {
          m.then(function($) {
            return d._waitingQueue.push(v2(b.bind(null, $)));
          }, function($) {
            return d._waitingQueue.push(v2(P.bind(null, $)));
          }).finally(function() {
            d._waitingFor === C && (d._waitingFor = null);
          });
        });
      }, Vt.prototype.abort = function() {
        this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new ye.Abort()));
      }, Vt.prototype.table = function(l) {
        var s = this._memoizedTables || (this._memoizedTables = {});
        if (h(s, l)) return s[l];
        var d = this.schema[l];
        if (!d) throw new ye.NotFound("Table " + l + " not part of transaction");
        return d = new this.db.Table(l, d, this), d.core = this.db.core.table(l), s[l] = d;
      }, Vt);
      function Vt() {
      }
      function gi(l, s, d, m, C, b, P, $) {
        return { name: l, keyPath: s, unique: d, multi: m, auto: C, compound: b, src: (d && !P ? "&" : "") + (m ? "*" : "") + (C ? "++" : "") + Yo(s), type: $ };
      }
      function Yo(l) {
        return typeof l == "string" ? l : l ? "[" + [].join.call(l, "+") + "]" : "";
      }
      function hi(l, s, d) {
        return { name: l, primKey: s, indexes: d, mappedClass: null, idxByName: (m = function(C) {
          return [C.name, C];
        }, d.reduce(function(C, b, P) {
          return P = m(b, P), P && (C[P[0]] = P[1]), C;
        }, {})) };
        var m;
      }
      var Pn = function(l) {
        try {
          return l.only([[]]), Pn = function() {
            return [[]];
          }, [[]];
        } catch {
          return Pn = function() {
            return y0;
          }, y0;
        }
      };
      function yi(l) {
        return l == null ? function() {
        } : typeof l == "string" ? (s = l).split(".").length === 1 ? function(d) {
          return d[s];
        } : function(d) {
          return Y(d, s);
        } : function(d) {
          return Y(d, l);
        };
        var s;
      }
      function Xo(l) {
        return [].slice.call(l);
      }
      var G4 = 0;
      function Vn(l) {
        return l == null ? ":id" : typeof l == "string" ? l : "[".concat(l.join("+"), "]");
      }
      function Z4(l, s, D) {
        function m(q) {
          if (q.type === 3) return null;
          if (q.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
          var z = q.lower, j = q.upper, K = q.lowerOpen, q = q.upperOpen;
          return z === void 0 ? j === void 0 ? null : s.upperBound(j, !!q) : j === void 0 ? s.lowerBound(z, !!K) : s.bound(z, j, !!K, !!q);
        }
        function C(H) {
          var z, j = H.name;
          return { name: j, schema: H, mutate: function(K) {
            var q = K.trans, Z = K.type, Q = K.keys, ie = K.values, ue = K.range;
            return new Promise(function(he, Se) {
              he = v2(he);
              var ge = q.objectStore(j), Ce = ge.keyPath == null, _e = Z === "put" || Z === "add";
              if (!_e && Z !== "delete" && Z !== "deleteRange") throw new Error("Invalid operation type: " + Z);
              var xe, $e = (Q || ie || { length: 1 }).length;
              if (Q && ie && Q.length !== ie.length) throw new Error("Given keys array must have same length as given values array.");
              if ($e === 0) return he({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
              function Ue(K2) {
                ++Q2, kn(K2);
              }
              var Ge = [], Ze = [], Q2 = 0;
              if (Z === "deleteRange") {
                if (ue.type === 4) return he({ numFailures: Q2, failures: Ze, results: [], lastResult: void 0 });
                ue.type === 3 ? Ge.push(xe = ge.clear()) : Ge.push(xe = ge.delete(m(ue)));
              } else {
                var Ce = _e ? Ce ? [ie, Q] : [ie, null] : [Q, null], He = Ce[0], B2 = Ce[1];
                if (_e) for (var M2 = 0; M2 < $e; ++M2) Ge.push(xe = B2 && B2[M2] !== void 0 ? ge[Z](He[M2], B2[M2]) : ge[Z](He[M2])), xe.onerror = Ue;
                else for (M2 = 0; M2 < $e; ++M2) Ge.push(xe = ge[Z](He[M2])), xe.onerror = Ue;
              }
              function Wa(K2) {
                K2 = K2.target.result, Ge.forEach(function(w0, Li) {
                  return w0.error != null && (Ze[Li] = w0.error);
                }), he({ numFailures: Q2, failures: Ze, results: Z === "delete" ? Q : Ge.map(function(w0) {
                  return w0.result;
                }), lastResult: K2 });
              }
              xe.onerror = function(K2) {
                Ue(K2), Wa(K2);
              }, xe.onsuccess = Wa;
            });
          }, getMany: function(K) {
            var q = K.trans, Z = K.keys;
            return new Promise(function(Q, ie) {
              Q = v2(Q);
              for (var ue, he = q.objectStore(j), Se = Z.length, ge = new Array(Se), Ce = 0, _e = 0, xe = function(Ge) {
                Ge = Ge.target, ge[Ge._pos] = Ge.result, ++_e === Ce && Q(ge);
              }, $e = Pt(ie), Ue = 0; Ue < Se; ++Ue) Z[Ue] != null && ((ue = he.get(Z[Ue]))._pos = Ue, ue.onsuccess = xe, ue.onerror = $e, ++Ce);
              Ce === 0 && Q(ge);
            });
          }, get: function(K) {
            var q = K.trans, Z = K.key;
            return new Promise(function(Q, ie) {
              Q = v2(Q);
              var ue = q.objectStore(j).get(Z);
              ue.onsuccess = function(he) {
                return Q(he.target.result);
              }, ue.onerror = Pt(ie);
            });
          }, query: (z = N, function(K) {
            return new Promise(function(q, Z) {
              q = v2(q);
              var Q, ie, ue, Ce = K.trans, he = K.values, Se = K.limit, xe = K.query, ge = Se === 1 / 0 ? void 0 : Se, _e = xe.index, xe = xe.range, Ce = Ce.objectStore(j), _e = _e.isPrimaryKey ? Ce : Ce.index(_e.name), xe = m(xe);
              if (Se === 0) return q({ result: [] });
              z ? ((ge = he ? _e.getAll(xe, ge) : _e.getAllKeys(xe, ge)).onsuccess = function($e) {
                return q({ result: $e.target.result });
              }, ge.onerror = Pt(Z)) : (Q = 0, ie = !he && "openKeyCursor" in _e ? _e.openKeyCursor(xe) : _e.openCursor(xe), ue = [], ie.onsuccess = function($e) {
                var Ue = ie.result;
                return Ue ? (ue.push(he ? Ue.value : Ue.primaryKey), ++Q === Se ? q({ result: ue }) : void Ue.continue()) : q({ result: ue });
              }, ie.onerror = Pt(Z));
            });
          }), openCursor: function(K) {
            var q = K.trans, Z = K.values, Q = K.query, ie = K.reverse, ue = K.unique;
            return new Promise(function(he, Se) {
              he = v2(he);
              var _e = Q.index, ge = Q.range, Ce = q.objectStore(j), Ce = _e.isPrimaryKey ? Ce : Ce.index(_e.name), _e = ie ? ue ? "prevunique" : "prev" : ue ? "nextunique" : "next", xe = !Z && "openKeyCursor" in Ce ? Ce.openKeyCursor(m(ge), _e) : Ce.openCursor(m(ge), _e);
              xe.onerror = Pt(Se), xe.onsuccess = v2(function($e) {
                var Ue, Ge, Ze, Q2, He = xe.result;
                He ? (He.___id = ++G4, He.done = !1, Ue = He.continue.bind(He), Ge = (Ge = He.continuePrimaryKey) && Ge.bind(He), Ze = He.advance.bind(He), Q2 = function() {
                  throw new Error("Cursor not stopped");
                }, He.trans = q, He.stop = He.continue = He.continuePrimaryKey = He.advance = function() {
                  throw new Error("Cursor not started");
                }, He.fail = v2(Se), He.next = function() {
                  var B2 = this, M2 = 1;
                  return this.start(function() {
                    return M2-- ? B2.continue() : B2.stop();
                  }).then(function() {
                    return B2;
                  });
                }, He.start = function(B2) {
                  function M2() {
                    if (xe.result) try {
                      B2();
                    } catch (K2) {
                      He.fail(K2);
                    }
                    else He.done = !0, He.start = function() {
                      throw new Error("Cursor behind last entry");
                    }, He.stop();
                  }
                  var Wa = new Promise(function(K2, w0) {
                    K2 = v2(K2), xe.onerror = Pt(w0), He.fail = w0, He.stop = function(Li) {
                      He.stop = He.continue = He.continuePrimaryKey = He.advance = Q2, K2(Li);
                    };
                  });
                  return xe.onsuccess = v2(function(K2) {
                    xe.onsuccess = M2, M2();
                  }), He.continue = Ue, He.continuePrimaryKey = Ge, He.advance = Ze, M2(), Wa;
                }, he(He)) : he(null);
              }, Se);
            });
          }, count: function(K) {
            var q = K.query, Z = K.trans, Q = q.index, ie = q.range;
            return new Promise(function(ue, he) {
              var Se = Z.objectStore(j), ge = Q.isPrimaryKey ? Se : Se.index(Q.name), Se = m(ie), ge = Se ? ge.count(Se) : ge.count();
              ge.onsuccess = v2(function(Ce) {
                return ue(Ce.target.result);
              }), ge.onerror = Pt(he);
            });
          } };
        }
        var b, P, $, W = (P = D, $ = Xo((b = l).objectStoreNames), { schema: { name: b.name, tables: $.map(function(H) {
          return P.objectStore(H);
        }).map(function(H) {
          var z = H.keyPath, q = H.autoIncrement, j = u(z), K = {}, q = { name: H.name, primaryKey: { name: null, isPrimaryKey: !0, outbound: z == null, compound: j, keyPath: z, autoIncrement: q, unique: !0, extractKey: yi(z) }, indexes: Xo(H.indexNames).map(function(Z) {
            return H.index(Z);
          }).map(function(ue) {
            var Q = ue.name, ie = ue.unique, he = ue.multiEntry, ue = ue.keyPath, he = { name: Q, compound: u(ue), keyPath: ue, unique: ie, multiEntry: he, extractKey: yi(ue) };
            return K[Vn(ue)] = he;
          }), getIndexByKeyPath: function(Z) {
            return K[Vn(Z)];
          } };
          return K[":id"] = q.primaryKey, z != null && (K[Vn(z)] = q.primaryKey), q;
        }) }, hasGetAll: 0 < $.length && "getAll" in P.objectStore($[0]) && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), D = W.schema, N = W.hasGetAll, W = D.tables.map(C), B = {};
        return W.forEach(function(H) {
          return B[H.name] = H;
        }), { stack: "dbcore", transaction: l.transaction.bind(l), table: function(H) {
          if (!B[H]) throw new Error("Table '".concat(H, "' not found"));
          return B[H];
        }, MIN_KEY: -1 / 0, MAX_KEY: Pn(s), schema: D };
      }
      function Y4(l, s, d, m) {
        var C = d.IDBKeyRange;
        return d.indexedDB, { dbcore: (m = Z4(s, C, m), l.dbcore.reduce(function(b, P) {
          return P = P.create, a(a({}, b), P(b));
        }, m)) };
      }
      function Oa(l, m) {
        var d = m.db, m = Y4(l._middlewares, d, l._deps, m);
        l.core = m.dbcore, l.tables.forEach(function(C) {
          var b = C.name;
          l.core.schema.tables.some(function(P) {
            return P.name === b;
          }) && (C.core = l.core.table(b), l[b] instanceof l.Table && (l[b].core = C.core));
        });
      }
      function Fa(l, s, d, m) {
        d.forEach(function(C) {
          var b = m[C];
          s.forEach(function(P) {
            var $ = (function D(N, W) {
              return w(N, W) || (N = f(N)) && D(N, W);
            })(P, C);
            (!$ || "value" in $ && $.value === void 0) && (P === l.Transaction.prototype || P instanceof l.Transaction ? k(P, C, { get: function() {
              return this.table(C);
            }, set: function(D) {
              p(this, C, { value: D, writable: !0, configurable: !0, enumerable: !0 });
            } }) : P[C] = new l.Table(C, b));
          });
        });
      }
      function Ci(l, s) {
        s.forEach(function(d) {
          for (var m in d) d[m] instanceof l.Table && delete d[m];
        });
      }
      function X4(l, s) {
        return l._cfg.version - s._cfg.version;
      }
      function Q4(l, s, d, m) {
        var C = l._dbSchema;
        d.objectStoreNames.contains("$meta") && !C.$meta && (C.$meta = hi("$meta", Jo("")[0], []), l._storeNames.push("$meta"));
        var b = l._createTransaction("readwrite", l._storeNames, C);
        b.create(d), b._completion.catch(m);
        var P = b._reject.bind(b), $ = Te.transless || Te;
        Yt(function() {
          return Te.trans = b, Te.transless = $, s !== 0 ? (Oa(l, d), N = s, ((D = b).storeNames.includes("$meta") ? D.table("$meta").get("version").then(function(W) {
            return W ?? N;
          }) : Ie.resolve(N)).then(function(W) {
            return H = W, z = b, j = d, K = [], W = (B = l)._versions, q = B._dbSchema = Ba(0, B.idbdb, j), (W = W.filter(function(Z) {
              return Z._cfg.version >= H;
            })).length !== 0 ? (W.forEach(function(Z) {
              K.push(function() {
                var Q = q, ie = Z._cfg.dbschema;
                Ma(B, Q, j), Ma(B, ie, j), q = B._dbSchema = ie;
                var ue = pi(Q, ie);
                ue.add.forEach(function(_e) {
                  bi(j, _e[0], _e[1].primKey, _e[1].indexes);
                }), ue.change.forEach(function(_e) {
                  if (_e.recreate) throw new ye.Upgrade("Not yet support for changing primary key");
                  var xe = j.objectStore(_e.name);
                  _e.add.forEach(function($e) {
                    return La(xe, $e);
                  }), _e.change.forEach(function($e) {
                    xe.deleteIndex($e.name), La(xe, $e);
                  }), _e.del.forEach(function($e) {
                    return xe.deleteIndex($e);
                  });
                });
                var he = Z._cfg.contentUpgrade;
                if (he && Z._cfg.version > H) {
                  Oa(B, j), z._memoizedTables = {};
                  var Se = x(ie);
                  ue.del.forEach(function(_e) {
                    Se[_e] = Q[_e];
                  }), Ci(B, [B.Transaction.prototype]), Fa(B, [B.Transaction.prototype], o(Se), Se), z.schema = Se;
                  var ge, Ce = ke(he);
                  return Ce && j0(), ue = Ie.follow(function() {
                    var _e;
                    (ge = he(z)) && Ce && (_e = Xt.bind(null, null), ge.then(_e, _e));
                  }), ge && typeof ge.then == "function" ? Ie.resolve(ge) : ue.then(function() {
                    return ge;
                  });
                }
              }), K.push(function(Q) {
                var ie, ue, he = Z._cfg.dbschema;
                ie = he, ue = Q, [].slice.call(ue.db.objectStoreNames).forEach(function(Se) {
                  return ie[Se] == null && ue.db.deleteObjectStore(Se);
                }), Ci(B, [B.Transaction.prototype]), Fa(B, [B.Transaction.prototype], B._storeNames, B._dbSchema), z.schema = B._dbSchema;
              }), K.push(function(Q) {
                B.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(B.idbdb.version / 10) === Z._cfg.version ? (B.idbdb.deleteObjectStore("$meta"), delete B._dbSchema.$meta, B._storeNames = B._storeNames.filter(function(ie) {
                  return ie !== "$meta";
                })) : Q.objectStore("$meta").put(Z._cfg.version, "version"));
              });
            }), (function Z() {
              return K.length ? Ie.resolve(K.shift()(z.idbtrans)).then(Z) : Ie.resolve();
            })().then(function() {
              Qo(q, j);
            })) : Ie.resolve();
            var B, H, z, j, K, q;
          }).catch(P)) : (o(C).forEach(function(W) {
            bi(d, W, C[W].primKey, C[W].indexes);
          }), Oa(l, d), void Ie.follow(function() {
            return l.on.populate.fire(b);
          }).catch(P));
          var D, N;
        });
      }
      function J4(l, s) {
        Qo(l._dbSchema, s), s.db.version % 10 != 0 || s.objectStoreNames.contains("$meta") || s.db.createObjectStore("$meta").add(Math.ceil(s.db.version / 10 - 1), "version");
        var d = Ba(0, l.idbdb, s);
        Ma(l, l._dbSchema, s);
        for (var m = 0, C = pi(d, l._dbSchema).change; m < C.length; m++) {
          var b = (function(P) {
            if (P.change.length || P.recreate) return console.warn("Unable to patch indexes of table ".concat(P.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
            var $ = s.objectStore(P.name);
            P.add.forEach(function(D) {
              _t && console.debug("Dexie upgrade patch: Creating missing index ".concat(P.name, ".").concat(D.src)), La($, D);
            });
          })(C[m]);
          if (typeof b == "object") return b.value;
        }
      }
      function pi(l, s) {
        var d, m = { del: [], add: [], change: [] };
        for (d in l) s[d] || m.del.push(d);
        for (d in s) {
          var C = l[d], b = s[d];
          if (C) {
            var P = { name: d, def: b, recreate: !1, del: [], add: [], change: [] };
            if ("" + (C.primKey.keyPath || "") != "" + (b.primKey.keyPath || "") || C.primKey.auto !== b.primKey.auto) P.recreate = !0, m.change.push(P);
            else {
              var $ = C.idxByName, D = b.idxByName, N = void 0;
              for (N in $) D[N] || P.del.push(N);
              for (N in D) {
                var W = $[N], B = D[N];
                W ? W.src !== B.src && P.change.push(B) : P.add.push(B);
              }
              (0 < P.del.length || 0 < P.add.length || 0 < P.change.length) && m.change.push(P);
            }
          } else m.add.push([d, b]);
        }
        return m;
      }
      function bi(l, s, d, m) {
        var C = l.db.createObjectStore(s, d.keyPath ? { keyPath: d.keyPath, autoIncrement: d.auto } : { autoIncrement: d.auto });
        return m.forEach(function(b) {
          return La(C, b);
        }), C;
      }
      function Qo(l, s) {
        o(l).forEach(function(d) {
          s.db.objectStoreNames.contains(d) || (_t && console.debug("Dexie: Creating missing table", d), bi(s, d, l[d].primKey, l[d].indexes));
        });
      }
      function La(l, s) {
        l.createIndex(s.name, s.keyPath, { unique: s.unique, multiEntry: s.multi });
      }
      function Ba(l, s, d) {
        var m = {};
        return V(s.objectStoreNames, 0).forEach(function(C) {
          for (var b = d.objectStore(C), P = gi(Yo(N = b.keyPath), N || "", !0, !1, !!b.autoIncrement, N && typeof N != "string", !0), $ = [], D = 0; D < b.indexNames.length; ++D) {
            var W = b.index(b.indexNames[D]), N = W.keyPath, W = gi(W.name, N, !!W.unique, !!W.multiEntry, !1, N && typeof N != "string", !1);
            $.push(W);
          }
          m[C] = hi(C, P, $);
        }), m;
      }
      function Ma(l, s, d) {
        for (var m = d.db.objectStoreNames, C = 0; C < m.length; ++C) {
          var b = m[C], P = d.objectStore(b);
          l._hasGetAll = "getAll" in P;
          for (var $ = 0; $ < P.indexNames.length; ++$) {
            var D = P.indexNames[$], N = P.index(D).keyPath, W = typeof N == "string" ? N : "[" + V(N).join("+") + "]";
            !s[b] || (N = s[b].idxByName[W]) && (N.name = D, delete s[b].idxByName[W], s[b].idxByName[D] = N);
          }
        }
        typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && i.WorkerGlobalScope && i instanceof i.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (l._hasGetAll = !1);
      }
      function Jo(l) {
        return l.split(",").map(function(s, d) {
          var b = s.split(":"), m = (C = b[1]) === null || C === void 0 ? void 0 : C.trim(), C = (s = b[0].trim()).replace(/([&*]|\+\+)/g, ""), b = /^\[/.test(C) ? C.match(/^\[(.*)\]$/)[1].split("+") : C;
          return gi(C, b || null, /\&/.test(s), /\*/.test(s), /\+\+/.test(s), u(b), d === 0, m);
        });
      }
      var e3 = (H0.prototype._createTableSchema = hi, H0.prototype._parseIndexSyntax = Jo, H0.prototype._parseStoresSpec = function(l, s) {
        var d = this;
        o(l).forEach(function(m) {
          if (l[m] !== null) {
            var C = d._parseIndexSyntax(l[m]), b = C.shift();
            if (!b) throw new ye.Schema("Invalid schema for table " + m + ": " + l[m]);
            if (b.unique = !0, b.multi) throw new ye.Schema("Primary key cannot be multiEntry*");
            C.forEach(function(P) {
              if (P.auto) throw new ye.Schema("Only primary key can be marked as autoIncrement (++)");
              if (!P.keyPath) throw new ye.Schema("Index must have a name and cannot be an empty string");
            }), C = d._createTableSchema(m, b, C), s[m] = C;
          }
        });
      }, H0.prototype.stores = function(d) {
        var s = this.db;
        this._cfg.storesSource = this._cfg.storesSource ? c(this._cfg.storesSource, d) : d;
        var d = s._versions, m = {}, C = {};
        return d.forEach(function(b) {
          c(m, b._cfg.storesSource), C = b._cfg.dbschema = {}, b._parseStoresSpec(m, C);
        }), s._dbSchema = C, Ci(s, [s._allTables, s, s.Transaction.prototype]), Fa(s, [s._allTables, s, s.Transaction.prototype, this._cfg.tables], o(C), C), s._storeNames = o(C), this;
      }, H0.prototype.upgrade = function(l) {
        return this._cfg.contentUpgrade = ti(this._cfg.contentUpgrade || Me, l), this;
      }, H0);
      function H0() {
      }
      function wi(l, s) {
        var d = l._dbNamesDB;
        return d || (d = l._dbNamesDB = new Ft(Va, { addons: [], indexedDB: l, IDBKeyRange: s })).version(1).stores({ dbnames: "name" }), d.table("dbnames");
      }
      function xi(l) {
        return l && typeof l.databases == "function";
      }
      function Si(l) {
        return Yt(function() {
          return Te.letThrough = !0, l();
        });
      }
      function ki(l) {
        return !("from" in l);
      }
      var L2 = function(l, s) {
        if (!this) {
          var d = new L2();
          return l && "d" in l && c(d, l), d;
        }
        c(this, arguments.length ? { d: 1, from: l, to: 1 < arguments.length ? s : l } : { d: 0 });
      };
      function In(l, s, d) {
        var m = Qe(s, d);
        if (!isNaN(m)) {
          if (0 < m) throw RangeError();
          if (ki(l)) return c(l, { from: s, to: d, d: 1 });
          var C = l.l, m = l.r;
          if (Qe(d, l.from) < 0) return C ? In(C, s, d) : l.l = { from: s, to: d, d: 1, l: null, r: null }, ts(l);
          if (0 < Qe(s, l.to)) return m ? In(m, s, d) : l.r = { from: s, to: d, d: 1, l: null, r: null }, ts(l);
          Qe(s, l.from) < 0 && (l.from = s, l.l = null, l.d = m ? m.d + 1 : 1), 0 < Qe(d, l.to) && (l.to = d, l.r = null, l.d = l.l ? l.l.d + 1 : 1), d = !l.r, C && !l.l && En(l, C), m && d && En(l, m);
        }
      }
      function En(l, s) {
        ki(s) || (function d(m, D) {
          var b = D.from, P = D.to, $ = D.l, D = D.r;
          In(m, b, P), $ && d(m, $), D && d(m, D);
        })(l, s);
      }
      function es(l, s) {
        var d = Ra(s), m = d.next();
        if (m.done) return !1;
        for (var C = m.value, b = Ra(l), P = b.next(C.from), $ = P.value; !m.done && !P.done; ) {
          if (Qe($.from, C.to) <= 0 && 0 <= Qe($.to, C.from)) return !0;
          Qe(C.from, $.from) < 0 ? C = (m = d.next($.from)).value : $ = (P = b.next(C.from)).value;
        }
        return !1;
      }
      function Ra(l) {
        var s = ki(l) ? null : { s: 0, n: l };
        return { next: function(d) {
          for (var m = 0 < arguments.length; s; ) switch (s.s) {
            case 0:
              if (s.s = 1, m) for (; s.n.l && Qe(d, s.n.from) < 0; ) s = { up: s, n: s.n.l, s: 1 };
              else for (; s.n.l; ) s = { up: s, n: s.n.l, s: 1 };
            case 1:
              if (s.s = 2, !m || Qe(d, s.n.to) <= 0) return { value: s.n, done: !1 };
            case 2:
              if (s.n.r) {
                s.s = 3, s = { up: s, n: s.n.r, s: 0 };
                continue;
              }
            case 3:
              s = s.up;
          }
          return { done: !0 };
        } };
      }
      function ts(l) {
        var s, d, m = (((s = l.r) === null || s === void 0 ? void 0 : s.d) || 0) - (((d = l.l) === null || d === void 0 ? void 0 : d.d) || 0), C = 1 < m ? "r" : m < -1 ? "l" : "";
        C && (s = C == "r" ? "l" : "r", d = a({}, l), m = l[C], l.from = m.from, l.to = m.to, l[C] = m[C], d[C] = m[s], (l[s] = d).d = ns(d)), l.d = ns(l);
      }
      function ns(d) {
        var s = d.r, d = d.l;
        return (s ? d ? Math.max(s.d, d.d) : s.d : d ? d.d : 0) + 1;
      }
      function Da(l, s) {
        return o(s).forEach(function(d) {
          l[d] ? En(l[d], s[d]) : l[d] = (function m(C) {
            var b, P, $ = {};
            for (b in C) h(C, b) && (P = C[b], $[b] = !P || typeof P != "object" || ee.has(P.constructor) ? P : m(P));
            return $;
          })(s[d]);
        }), l;
      }
      function _i(l, s) {
        return l.all || s.all || Object.keys(l).some(function(d) {
          return s[d] && es(s[d], l[d]);
        });
      }
      y(L2.prototype, ((st = { add: function(l) {
        return En(this, l), this;
      }, addKey: function(l) {
        return In(this, l, l), this;
      }, addKeys: function(l) {
        var s = this;
        return l.forEach(function(d) {
          return In(s, d, d);
        }), this;
      }, hasKey: function(l) {
        var s = Ra(this).next(l).value;
        return s && Qe(s.from, l) <= 0 && 0 <= Qe(s.to, l);
      } })[L] = function() {
        return Ra(this);
      }, st));
      var p0 = {}, Pi = {}, Vi = !1;
      function Na(l) {
        Da(Pi, l), Vi || (Vi = !0, setTimeout(function() {
          Vi = !1, Ii(Pi, !(Pi = {}));
        }, 0));
      }
      function Ii(l, s) {
        s === void 0 && (s = !1);
        var d = /* @__PURE__ */ new Set();
        if (l.all) for (var m = 0, C = Object.values(p0); m < C.length; m++) as(P = C[m], l, d, s);
        else for (var b in l) {
          var P, $ = /^idb\:\/\/(.*)\/(.*)\//.exec(b);
          $ && (b = $[1], $ = $[2], (P = p0["idb://".concat(b, "/").concat($)]) && as(P, l, d, s));
        }
        d.forEach(function(D) {
          return D();
        });
      }
      function as(l, s, d, m) {
        for (var C = [], b = 0, P = Object.entries(l.queries.query); b < P.length; b++) {
          for (var $ = P[b], D = $[0], N = [], W = 0, B = $[1]; W < B.length; W++) {
            var H = B[W];
            _i(s, H.obsSet) ? H.subscribers.forEach(function(q) {
              return d.add(q);
            }) : m && N.push(H);
          }
          m && C.push([D, N]);
        }
        if (m) for (var z = 0, j = C; z < j.length; z++) {
          var K = j[z], D = K[0], N = K[1];
          l.queries.query[D] = N;
        }
      }
      function t3(l) {
        var s = l._state, d = l._deps.indexedDB;
        if (s.isBeingOpened || l.idbdb) return s.dbReadyPromise.then(function() {
          return s.dbOpenError ? C2(s.dbOpenError) : l;
        });
        s.isBeingOpened = !0, s.dbOpenError = null, s.openComplete = !1;
        var m = s.openCanceller, C = Math.round(10 * l.verno), b = !1;
        function P() {
          if (s.openCanceller !== m) throw new ye.DatabaseClosed("db.open() was cancelled");
        }
        function $() {
          return new Ie(function(H, z) {
            if (P(), !d) throw new ye.MissingAPI();
            var j = l.name, K = s.autoSchema || !C ? d.open(j) : d.open(j, C);
            if (!K) throw new ye.MissingAPI();
            K.onerror = Pt(z), K.onblocked = v2(l._fireOnBlocked), K.onupgradeneeded = v2(function(q) {
              var Z;
              W = K.transaction, s.autoSchema && !l._options.allowEmptyDB ? (K.onerror = kn, W.abort(), K.result.close(), (Z = d.deleteDatabase(j)).onsuccess = Z.onerror = v2(function() {
                z(new ye.NoSuchDatabase("Database ".concat(j, " doesnt exist")));
              })) : (W.onerror = Pt(z), q = q.oldVersion > Math.pow(2, 62) ? 0 : q.oldVersion, B = q < 1, l.idbdb = K.result, b && J4(l, W), Q4(l, q / 10, W, z));
            }, z), K.onsuccess = v2(function() {
              W = null;
              var q, Z, Q, ie, ue, he = l.idbdb = K.result, Se = V(he.objectStoreNames);
              if (0 < Se.length) try {
                var ge = he.transaction((ie = Se).length === 1 ? ie[0] : ie, "readonly");
                if (s.autoSchema) Z = he, Q = ge, (q = l).verno = Z.version / 10, Q = q._dbSchema = Ba(0, Z, Q), q._storeNames = V(Z.objectStoreNames, 0), Fa(q, [q._allTables], o(Q), Q);
                else if (Ma(l, l._dbSchema, ge), ((ue = pi(Ba(0, (ue = l).idbdb, ge), ue._dbSchema)).add.length || ue.change.some(function(Ce) {
                  return Ce.add.length || Ce.change.length;
                })) && !b) return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), he.close(), C = he.version + 1, b = !0, H($());
                Oa(l, ge);
              } catch {
              }
              K0.push(l), he.onversionchange = v2(function(Ce) {
                s.vcFired = !0, l.on("versionchange").fire(Ce);
              }), he.onclose = v2(function() {
                l.close({ disableAutoOpen: !1 });
              }), B && (ue = l._deps, ge = j, he = ue.indexedDB, ue = ue.IDBKeyRange, xi(he) || ge === Va || wi(he, ue).put({ name: ge }).catch(Me)), H();
            }, z);
          }).catch(function(H) {
            switch (H?.name) {
              case "UnknownError":
                if (0 < s.PR1398_maxLoop) return s.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), $();
                break;
              case "VersionError":
                if (0 < C) return C = 0, $();
            }
            return Ie.reject(H);
          });
        }
        var D, N = s.dbReadyResolve, W = null, B = !1;
        return Ie.race([m, (typeof navigator > "u" ? Ie.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(H) {
          function z() {
            return indexedDB.databases().finally(H);
          }
          D = setInterval(z, 100), z();
        }).finally(function() {
          return clearInterval(D);
        }) : Promise.resolve()).then($)]).then(function() {
          return P(), s.onReadyBeingFired = [], Ie.resolve(Si(function() {
            return l.on.ready.fire(l.vip);
          })).then(function H() {
            if (0 < s.onReadyBeingFired.length) {
              var z = s.onReadyBeingFired.reduce(ti, Me);
              return s.onReadyBeingFired = [], Ie.resolve(Si(function() {
                return z(l.vip);
              })).then(H);
            }
          });
        }).finally(function() {
          s.openCanceller === m && (s.onReadyBeingFired = null, s.isBeingOpened = !1);
        }).catch(function(H) {
          s.dbOpenError = H;
          try {
            W && W.abort();
          } catch {
          }
          return m === s.openCanceller && l._close(), C2(H);
        }).finally(function() {
          s.openComplete = !0, N();
        }).then(function() {
          var H;
          return B && (H = {}, l.tables.forEach(function(z) {
            z.schema.indexes.forEach(function(j) {
              j.name && (H["idb://".concat(l.name, "/").concat(z.name, "/").concat(j.name)] = new L2(-1 / 0, [[[]]]));
            }), H["idb://".concat(l.name, "/").concat(z.name, "/")] = H["idb://".concat(l.name, "/").concat(z.name, "/:dels")] = new L2(-1 / 0, [[[]]]);
          }), e0(_n).fire(H), Ii(H, !0)), l;
        });
      }
      function Ei(l) {
        function s(b) {
          return l.next(b);
        }
        var d = C(s), m = C(function(b) {
          return l.throw(b);
        });
        function C(b) {
          return function(D) {
            var $ = b(D), D = $.value;
            return $.done ? D : D && typeof D.then == "function" ? D.then(d, m) : u(D) ? Promise.all(D).then(d, m) : d(D);
          };
        }
        return C(s)();
      }
      function za(l, s, d) {
        for (var m = u(l) ? l.slice() : [l], C = 0; C < d; ++C) m.push(s);
        return m;
      }
      var n3 = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(l) {
        return a(a({}, l), { table: function(s) {
          var d = l.table(s), m = d.schema, C = {}, b = [];
          function P(B, H, z) {
            var j = Vn(B), K = C[j] = C[j] || [], q = B == null ? 0 : typeof B == "string" ? 1 : B.length, Z = 0 < H, Z = a(a({}, z), { name: Z ? "".concat(j, "(virtual-from:").concat(z.name, ")") : z.name, lowLevelIndex: z, isVirtual: Z, keyTail: H, keyLength: q, extractKey: yi(B), unique: !Z && z.unique });
            return K.push(Z), Z.isPrimaryKey || b.push(Z), 1 < q && P(q === 2 ? B[0] : B.slice(0, q - 1), H + 1, z), K.sort(function(Q, ie) {
              return Q.keyTail - ie.keyTail;
            }), Z;
          }
          s = P(m.primaryKey.keyPath, 0, m.primaryKey), C[":id"] = [s];
          for (var $ = 0, D = m.indexes; $ < D.length; $++) {
            var N = D[$];
            P(N.keyPath, 0, N);
          }
          function W(B) {
            var H, z = B.query.index;
            return z.isVirtual ? a(a({}, B), { query: { index: z.lowLevelIndex, range: (H = B.query.range, z = z.keyTail, { type: H.type === 1 ? 2 : H.type, lower: za(H.lower, H.lowerOpen ? l.MAX_KEY : l.MIN_KEY, z), lowerOpen: !0, upper: za(H.upper, H.upperOpen ? l.MIN_KEY : l.MAX_KEY, z), upperOpen: !0 }) } }) : B;
          }
          return a(a({}, d), { schema: a(a({}, m), { primaryKey: s, indexes: b, getIndexByKeyPath: function(B) {
            return (B = C[Vn(B)]) && B[0];
          } }), count: function(B) {
            return d.count(W(B));
          }, query: function(B) {
            return d.query(W(B));
          }, openCursor: function(B) {
            var H = B.query.index, z = H.keyTail, j = H.isVirtual, K = H.keyLength;
            return j ? d.openCursor(W(B)).then(function(Z) {
              return Z && q(Z);
            }) : d.openCursor(B);
            function q(Z) {
              return Object.create(Z, { continue: { value: function(Q) {
                Q != null ? Z.continue(za(Q, B.reverse ? l.MAX_KEY : l.MIN_KEY, z)) : B.unique ? Z.continue(Z.key.slice(0, K).concat(B.reverse ? l.MIN_KEY : l.MAX_KEY, z)) : Z.continue();
              } }, continuePrimaryKey: { value: function(Q, ie) {
                Z.continuePrimaryKey(za(Q, l.MAX_KEY, z), ie);
              } }, primaryKey: { get: function() {
                return Z.primaryKey;
              } }, key: { get: function() {
                var Q = Z.key;
                return K === 1 ? Q[0] : Q.slice(0, K);
              } }, value: { get: function() {
                return Z.value;
              } } });
            }
          } });
        } });
      } };
      function Ai(l, s, d, m) {
        return d = d || {}, m = m || "", o(l).forEach(function(C) {
          var b, P, $;
          h(s, C) ? (b = l[C], P = s[C], typeof b == "object" && typeof P == "object" && b && P ? ($ = te(b)) !== te(P) ? d[m + C] = s[C] : $ === "Object" ? Ai(b, P, d, m + C + ".") : b !== P && (d[m + C] = s[C]) : b !== P && (d[m + C] = s[C])) : d[m + C] = void 0;
        }), o(s).forEach(function(C) {
          h(l, C) || (d[m + C] = s[C]);
        }), d;
      }
      function $i(l, s) {
        return s.type === "delete" ? s.keys : s.keys || s.values.map(l.extractKey);
      }
      var a3 = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(l) {
        return a(a({}, l), { table: function(s) {
          var d = l.table(s), m = d.schema.primaryKey;
          return a(a({}, d), { mutate: function(C) {
            var b = Te.trans, P = b.table(s).hook, $ = P.deleting, D = P.creating, N = P.updating;
            switch (C.type) {
              case "add":
                if (D.fire === Me) break;
                return b._promise("readwrite", function() {
                  return W(C);
                }, !0);
              case "put":
                if (D.fire === Me && N.fire === Me) break;
                return b._promise("readwrite", function() {
                  return W(C);
                }, !0);
              case "delete":
                if ($.fire === Me) break;
                return b._promise("readwrite", function() {
                  return W(C);
                }, !0);
              case "deleteRange":
                if ($.fire === Me) break;
                return b._promise("readwrite", function() {
                  return (function B(H, z, j) {
                    return d.query({ trans: H, values: !1, query: { index: m, range: z }, limit: j }).then(function(K) {
                      var q = K.result;
                      return W({ type: "delete", keys: q, trans: H }).then(function(Z) {
                        return 0 < Z.numFailures ? Promise.reject(Z.failures[0]) : q.length < j ? { failures: [], numFailures: 0, lastResult: void 0 } : B(H, a(a({}, z), { lower: q[q.length - 1], lowerOpen: !0 }), j);
                      });
                    });
                  })(C.trans, C.range, 1e4);
                }, !0);
            }
            return d.mutate(C);
            function W(B) {
              var H, z, j, K = Te.trans, q = B.keys || $i(m, B);
              if (!q) throw new Error("Keys missing");
              return (B = B.type === "add" || B.type === "put" ? a(a({}, B), { keys: q }) : a({}, B)).type !== "delete" && (B.values = r([], B.values)), B.keys && (B.keys = r([], B.keys)), H = d, j = q, ((z = B).type === "add" ? Promise.resolve([]) : H.getMany({ trans: z.trans, keys: j, cache: "immutable" })).then(function(Z) {
                var Q = q.map(function(ie, ue) {
                  var he, Se, ge, Ce = Z[ue], _e = { onerror: null, onsuccess: null };
                  return B.type === "delete" ? $.fire.call(_e, ie, Ce, K) : B.type === "add" || Ce === void 0 ? (he = D.fire.call(_e, ie, B.values[ue], K), ie == null && he != null && (B.keys[ue] = ie = he, m.outbound || F(B.values[ue], m.keyPath, ie))) : (he = Ai(Ce, B.values[ue]), (Se = N.fire.call(_e, he, ie, Ce, K)) && (ge = B.values[ue], Object.keys(Se).forEach(function(xe) {
                    h(ge, xe) ? ge[xe] = Se[xe] : F(ge, xe, Se[xe]);
                  }))), _e;
                });
                return d.mutate(B).then(function(ie) {
                  for (var ue = ie.failures, he = ie.results, Se = ie.numFailures, ie = ie.lastResult, ge = 0; ge < q.length; ++ge) {
                    var Ce = (he || q)[ge], _e = Q[ge];
                    Ce == null ? _e.onerror && _e.onerror(ue[ge]) : _e.onsuccess && _e.onsuccess(B.type === "put" && Z[ge] ? B.values[ge] : Ce);
                  }
                  return { failures: ue, results: he, numFailures: Se, lastResult: ie };
                }).catch(function(ie) {
                  return Q.forEach(function(ue) {
                    return ue.onerror && ue.onerror(ie);
                  }), Promise.reject(ie);
                });
              });
            }
          } });
        } });
      } };
      function rs(l, s, d) {
        try {
          if (!s || s.keys.length < l.length) return null;
          for (var m = [], C = 0, b = 0; C < s.keys.length && b < l.length; ++C) Qe(s.keys[C], l[b]) === 0 && (m.push(d ? ae(s.values[C]) : s.values[C]), ++b);
          return m.length === l.length ? m : null;
        } catch {
          return null;
        }
      }
      var r3 = { stack: "dbcore", level: -1, create: function(l) {
        return { table: function(s) {
          var d = l.table(s);
          return a(a({}, d), { getMany: function(m) {
            if (!m.cache) return d.getMany(m);
            var C = rs(m.keys, m.trans._cache, m.cache === "clone");
            return C ? Ie.resolve(C) : d.getMany(m).then(function(b) {
              return m.trans._cache = { keys: m.keys, values: m.cache === "clone" ? ae(b) : b }, b;
            });
          }, mutate: function(m) {
            return m.type !== "add" && (m.trans._cache = null), d.mutate(m);
          } });
        } };
      } };
      function is(l, s) {
        return l.trans.mode === "readonly" && !!l.subscr && !l.trans.explicit && l.trans.db._options.cache !== "disabled" && !s.schema.primaryKey.outbound;
      }
      function ls(l, s) {
        switch (l) {
          case "query":
            return s.values && !s.unique;
          case "get":
          case "getMany":
          case "count":
          case "openCursor":
            return !1;
        }
      }
      var i3 = { stack: "dbcore", level: 0, name: "Observability", create: function(l) {
        var s = l.schema.name, d = new L2(l.MIN_KEY, l.MAX_KEY);
        return a(a({}, l), { transaction: function(m, C, b) {
          if (Te.subscr && C !== "readonly") throw new ye.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(Te.querier));
          return l.transaction(m, C, b);
        }, table: function(m) {
          var C = l.table(m), b = C.schema, P = b.primaryKey, B = b.indexes, $ = P.extractKey, D = P.outbound, N = P.autoIncrement && B.filter(function(z) {
            return z.compound && z.keyPath.includes(P.keyPath);
          }), W = a(a({}, C), { mutate: function(z) {
            function j(xe) {
              return xe = "idb://".concat(s, "/").concat(m, "/").concat(xe), ie[xe] || (ie[xe] = new L2());
            }
            var K, q, Z, Q = z.trans, ie = z.mutatedParts || (z.mutatedParts = {}), ue = j(""), he = j(":dels"), Se = z.type, _e = z.type === "deleteRange" ? [z.range] : z.type === "delete" ? [z.keys] : z.values.length < 50 ? [$i(P, z).filter(function(xe) {
              return xe;
            }), z.values] : [], ge = _e[0], Ce = _e[1], _e = z.trans._cache;
            return u(ge) ? (ue.addKeys(ge), (_e = Se === "delete" || ge.length === Ce.length ? rs(ge, _e) : null) || he.addKeys(ge), (_e || Ce) && (K = j, q = _e, Z = Ce, b.indexes.forEach(function(xe) {
              var $e = K(xe.name || "");
              function Ue(Ze) {
                return Ze != null ? xe.extractKey(Ze) : null;
              }
              function Ge(Ze) {
                return xe.multiEntry && u(Ze) ? Ze.forEach(function(Q2) {
                  return $e.addKey(Q2);
                }) : $e.addKey(Ze);
              }
              (q || Z).forEach(function(Ze, B2) {
                var He = q && Ue(q[B2]), B2 = Z && Ue(Z[B2]);
                Qe(He, B2) !== 0 && (He != null && Ge(He), B2 != null && Ge(B2));
              });
            }))) : ge ? (Ce = { from: (Ce = ge.lower) !== null && Ce !== void 0 ? Ce : l.MIN_KEY, to: (Ce = ge.upper) !== null && Ce !== void 0 ? Ce : l.MAX_KEY }, he.add(Ce), ue.add(Ce)) : (ue.add(d), he.add(d), b.indexes.forEach(function(xe) {
              return j(xe.name).add(d);
            })), C.mutate(z).then(function(xe) {
              return !ge || z.type !== "add" && z.type !== "put" || (ue.addKeys(xe.results), N && N.forEach(function($e) {
                for (var Ue = z.values.map(function(He) {
                  return $e.extractKey(He);
                }), Ge = $e.keyPath.findIndex(function(He) {
                  return He === P.keyPath;
                }), Ze = 0, Q2 = xe.results.length; Ze < Q2; ++Ze) Ue[Ze][Ge] = xe.results[Ze];
                j($e.name).addKeys(Ue);
              })), Q.mutatedParts = Da(Q.mutatedParts || {}, ie), xe;
            });
          } }), B = function(j) {
            var K = j.query, j = K.index, K = K.range;
            return [j, new L2((j = K.lower) !== null && j !== void 0 ? j : l.MIN_KEY, (K = K.upper) !== null && K !== void 0 ? K : l.MAX_KEY)];
          }, H = { get: function(z) {
            return [P, new L2(z.key)];
          }, getMany: function(z) {
            return [P, new L2().addKeys(z.keys)];
          }, count: B, query: B, openCursor: B };
          return o(H).forEach(function(z) {
            W[z] = function(j) {
              var K = Te.subscr, q = !!K, Z = is(Te, C) && ls(z, j) ? j.obsSet = {} : K;
              if (q) {
                var Q = function(Ce) {
                  return Ce = "idb://".concat(s, "/").concat(m, "/").concat(Ce), Z[Ce] || (Z[Ce] = new L2());
                }, ie = Q(""), ue = Q(":dels"), K = H[z](j), q = K[0], K = K[1];
                if ((z === "query" && q.isPrimaryKey && !j.values ? ue : Q(q.name || "")).add(K), !q.isPrimaryKey) {
                  if (z !== "count") {
                    var he = z === "query" && D && j.values && C.query(a(a({}, j), { values: !1 }));
                    return C[z].apply(this, arguments).then(function(Ce) {
                      if (z === "query") {
                        if (D && j.values) return he.then(function(Ue) {
                          return Ue = Ue.result, ie.addKeys(Ue), Ce;
                        });
                        var _e = j.values ? Ce.result.map($) : Ce.result;
                        (j.values ? ie : ue).addKeys(_e);
                      } else if (z === "openCursor") {
                        var xe = Ce, $e = j.values;
                        return xe && Object.create(xe, { key: { get: function() {
                          return ue.addKey(xe.primaryKey), xe.key;
                        } }, primaryKey: { get: function() {
                          var Ue = xe.primaryKey;
                          return ue.addKey(Ue), Ue;
                        } }, value: { get: function() {
                          return $e && ie.addKey(xe.primaryKey), xe.value;
                        } } });
                      }
                      return Ce;
                    });
                  }
                  ue.add(d);
                }
              }
              return C[z].apply(this, arguments);
            };
          }), W;
        } });
      } };
      function os(l, s, d) {
        if (d.numFailures === 0) return s;
        if (s.type === "deleteRange") return null;
        var m = s.keys ? s.keys.length : "values" in s && s.values ? s.values.length : 1;
        return d.numFailures === m ? null : (s = a({}, s), u(s.keys) && (s.keys = s.keys.filter(function(C, b) {
          return !(b in d.failures);
        })), "values" in s && u(s.values) && (s.values = s.values.filter(function(C, b) {
          return !(b in d.failures);
        })), s);
      }
      function Ti(l, s) {
        return d = l, ((m = s).lower === void 0 || (m.lowerOpen ? 0 < Qe(d, m.lower) : 0 <= Qe(d, m.lower))) && (l = l, (s = s).upper === void 0 || (s.upperOpen ? Qe(l, s.upper) < 0 : Qe(l, s.upper) <= 0));
        var d, m;
      }
      function ss(l, s, H, m, C, b) {
        if (!H || H.length === 0) return l;
        var P = s.query.index, $ = P.multiEntry, D = s.query.range, N = m.schema.primaryKey.extractKey, W = P.extractKey, B = (P.lowLevelIndex || P).extractKey, H = H.reduce(function(z, j) {
          var K = z, q = [];
          if (j.type === "add" || j.type === "put") for (var Z = new L2(), Q = j.values.length - 1; 0 <= Q; --Q) {
            var ie, ue = j.values[Q], he = N(ue);
            Z.hasKey(he) || (ie = W(ue), ($ && u(ie) ? ie.some(function(xe) {
              return Ti(xe, D);
            }) : Ti(ie, D)) && (Z.addKey(he), q.push(ue)));
          }
          switch (j.type) {
            case "add":
              var Se = new L2().addKeys(s.values ? z.map(function($e) {
                return N($e);
              }) : z), K = z.concat(s.values ? q.filter(function($e) {
                return $e = N($e), !Se.hasKey($e) && (Se.addKey($e), !0);
              }) : q.map(function($e) {
                return N($e);
              }).filter(function($e) {
                return !Se.hasKey($e) && (Se.addKey($e), !0);
              }));
              break;
            case "put":
              var ge = new L2().addKeys(j.values.map(function($e) {
                return N($e);
              }));
              K = z.filter(function($e) {
                return !ge.hasKey(s.values ? N($e) : $e);
              }).concat(s.values ? q : q.map(function($e) {
                return N($e);
              }));
              break;
            case "delete":
              var Ce = new L2().addKeys(j.keys);
              K = z.filter(function($e) {
                return !Ce.hasKey(s.values ? N($e) : $e);
              });
              break;
            case "deleteRange":
              var _e = j.range;
              K = z.filter(function($e) {
                return !Ti(N($e), _e);
              });
          }
          return K;
        }, l);
        return H === l ? l : (H.sort(function(z, j) {
          return Qe(B(z), B(j)) || Qe(N(z), N(j));
        }), s.limit && s.limit < 1 / 0 && (H.length > s.limit ? H.length = s.limit : l.length === s.limit && H.length < s.limit && (C.dirty = !0)), b ? Object.freeze(H) : H);
      }
      function us(l, s) {
        return Qe(l.lower, s.lower) === 0 && Qe(l.upper, s.upper) === 0 && !!l.lowerOpen == !!s.lowerOpen && !!l.upperOpen == !!s.upperOpen;
      }
      function l3(l, s) {
        return (function(d, m, C, b) {
          if (d === void 0) return m !== void 0 ? -1 : 0;
          if (m === void 0) return 1;
          if ((m = Qe(d, m)) === 0) {
            if (C && b) return 0;
            if (C) return 1;
            if (b) return -1;
          }
          return m;
        })(l.lower, s.lower, l.lowerOpen, s.lowerOpen) <= 0 && 0 <= (function(d, m, C, b) {
          if (d === void 0) return m !== void 0 ? 1 : 0;
          if (m === void 0) return -1;
          if ((m = Qe(d, m)) === 0) {
            if (C && b) return 0;
            if (C) return -1;
            if (b) return 1;
          }
          return m;
        })(l.upper, s.upper, l.upperOpen, s.upperOpen);
      }
      function o3(l, s, d, m) {
        l.subscribers.add(d), m.addEventListener("abort", function() {
          var C, b;
          l.subscribers.delete(d), l.subscribers.size === 0 && (C = l, b = s, setTimeout(function() {
            C.subscribers.size === 0 && re(b, C);
          }, 3e3));
        });
      }
      var s3 = { stack: "dbcore", level: 0, name: "Cache", create: function(l) {
        var s = l.schema.name;
        return a(a({}, l), { transaction: function(d, m, C) {
          var b, P, $ = l.transaction(d, m, C);
          return m === "readwrite" && (P = (b = new AbortController()).signal, C = function(D) {
            return function() {
              if (b.abort(), m === "readwrite") {
                for (var N = /* @__PURE__ */ new Set(), W = 0, B = d; W < B.length; W++) {
                  var H = B[W], z = p0["idb://".concat(s, "/").concat(H)];
                  if (z) {
                    var j = l.table(H), K = z.optimisticOps.filter(function($e) {
                      return $e.trans === $;
                    });
                    if ($._explicit && D && $.mutatedParts) for (var q = 0, Z = Object.values(z.queries.query); q < Z.length; q++) for (var Q = 0, ie = (Se = Z[q]).slice(); Q < ie.length; Q++) _i((ge = ie[Q]).obsSet, $.mutatedParts) && (re(Se, ge), ge.subscribers.forEach(function($e) {
                      return N.add($e);
                    }));
                    else if (0 < K.length) {
                      z.optimisticOps = z.optimisticOps.filter(function($e) {
                        return $e.trans !== $;
                      });
                      for (var ue = 0, he = Object.values(z.queries.query); ue < he.length; ue++) for (var Se, ge, Ce, _e = 0, xe = (Se = he[ue]).slice(); _e < xe.length; _e++) (ge = xe[_e]).res != null && $.mutatedParts && (D && !ge.dirty ? (Ce = Object.isFrozen(ge.res), Ce = ss(ge.res, ge.req, K, j, ge, Ce), ge.dirty ? (re(Se, ge), ge.subscribers.forEach(function($e) {
                        return N.add($e);
                      })) : Ce !== ge.res && (ge.res = Ce, ge.promise = Ie.resolve({ result: Ce }))) : (ge.dirty && re(Se, ge), ge.subscribers.forEach(function($e) {
                        return N.add($e);
                      })));
                    }
                  }
                }
                N.forEach(function($e) {
                  return $e();
                });
              }
            };
          }, $.addEventListener("abort", C(!1), { signal: P }), $.addEventListener("error", C(!1), { signal: P }), $.addEventListener("complete", C(!0), { signal: P })), $;
        }, table: function(d) {
          var m = l.table(d), C = m.schema.primaryKey;
          return a(a({}, m), { mutate: function(b) {
            var P = Te.trans;
            if (C.outbound || P.db._options.cache === "disabled" || P.explicit || P.idbtrans.mode !== "readwrite") return m.mutate(b);
            var $ = p0["idb://".concat(s, "/").concat(d)];
            return $ ? (P = m.mutate(b), b.type !== "add" && b.type !== "put" || !(50 <= b.values.length || $i(C, b).some(function(D) {
              return D == null;
            })) ? ($.optimisticOps.push(b), b.mutatedParts && Na(b.mutatedParts), P.then(function(D) {
              0 < D.numFailures && (re($.optimisticOps, b), (D = os(0, b, D)) && $.optimisticOps.push(D), b.mutatedParts && Na(b.mutatedParts));
            }), P.catch(function() {
              re($.optimisticOps, b), b.mutatedParts && Na(b.mutatedParts);
            })) : P.then(function(D) {
              var N = os(0, a(a({}, b), { values: b.values.map(function(W, B) {
                var H;
                return D.failures[B] ? W : (W = (H = C.keyPath) !== null && H !== void 0 && H.includes(".") ? ae(W) : a({}, W), F(W, C.keyPath, D.results[B]), W);
              }) }), D);
              $.optimisticOps.push(N), queueMicrotask(function() {
                return b.mutatedParts && Na(b.mutatedParts);
              });
            }), P) : m.mutate(b);
          }, query: function(b) {
            if (!is(Te, m) || !ls("query", b)) return m.query(b);
            var P = ((N = Te.trans) === null || N === void 0 ? void 0 : N.db._options.cache) === "immutable", B = Te, $ = B.requery, D = B.signal, N = (function(j, K, q, Z) {
              var Q = p0["idb://".concat(j, "/").concat(K)];
              if (!Q) return [];
              if (!(K = Q.queries[q])) return [null, !1, Q, null];
              var ie = K[(Z.query ? Z.query.index.name : null) || ""];
              if (!ie) return [null, !1, Q, null];
              switch (q) {
                case "query":
                  var ue = ie.find(function(he) {
                    return he.req.limit === Z.limit && he.req.values === Z.values && us(he.req.query.range, Z.query.range);
                  });
                  return ue ? [ue, !0, Q, ie] : [ie.find(function(he) {
                    return ("limit" in he.req ? he.req.limit : 1 / 0) >= Z.limit && (!Z.values || he.req.values) && l3(he.req.query.range, Z.query.range);
                  }), !1, Q, ie];
                case "count":
                  return ue = ie.find(function(he) {
                    return us(he.req.query.range, Z.query.range);
                  }), [ue, !!ue, Q, ie];
              }
            })(s, d, "query", b), W = N[0], B = N[1], H = N[2], z = N[3];
            return W && B ? W.obsSet = b.obsSet : (B = m.query(b).then(function(j) {
              var K = j.result;
              if (W && (W.res = K), P) {
                for (var q = 0, Z = K.length; q < Z; ++q) Object.freeze(K[q]);
                Object.freeze(K);
              } else j.result = ae(K);
              return j;
            }).catch(function(j) {
              return z && W && re(z, W), Promise.reject(j);
            }), W = { obsSet: b.obsSet, promise: B, subscribers: /* @__PURE__ */ new Set(), type: "query", req: b, dirty: !1 }, z ? z.push(W) : (z = [W], (H = H || (p0["idb://".concat(s, "/").concat(d)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[b.query.index.name || ""] = z)), o3(W, z, $, D), W.promise.then(function(j) {
              return { result: ss(j.result, b, H?.optimisticOps, m, W, P) };
            });
          } });
        } });
      } };
      function ja(l, s) {
        return new Proxy(l, { get: function(d, m, C) {
          return m === "db" ? s : Reflect.get(d, m, C);
        } });
      }
      var Ft = (p2.prototype.version = function(l) {
        if (isNaN(l) || l < 0.1) throw new ye.Type("Given version is not a positive number");
        if (l = Math.round(10 * l) / 10, this.idbdb || this._state.isBeingOpened) throw new ye.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, l);
        var s = this._versions, d = s.filter(function(m) {
          return m._cfg.version === l;
        })[0];
        return d || (d = new this.Version(l), s.push(d), s.sort(X4), d.stores({}), this._state.autoSchema = !1, d);
      }, p2.prototype._whenReady = function(l) {
        var s = this;
        return this.idbdb && (this._state.openComplete || Te.letThrough || this._vip) ? l() : new Ie(function(d, m) {
          if (s._state.openComplete) return m(new ye.DatabaseClosed(s._state.dbOpenError));
          if (!s._state.isBeingOpened) {
            if (!s._state.autoOpen) return void m(new ye.DatabaseClosed());
            s.open().catch(Me);
          }
          s._state.dbReadyPromise.then(d, m);
        }).then(l);
      }, p2.prototype.use = function(l) {
        var s = l.stack, d = l.create, m = l.level, C = l.name;
        return C && this.unuse({ stack: s, name: C }), l = this._middlewares[s] || (this._middlewares[s] = []), l.push({ stack: s, create: d, level: m ?? 10, name: C }), l.sort(function(b, P) {
          return b.level - P.level;
        }), this;
      }, p2.prototype.unuse = function(l) {
        var s = l.stack, d = l.name, m = l.create;
        return s && this._middlewares[s] && (this._middlewares[s] = this._middlewares[s].filter(function(C) {
          return m ? C.create !== m : !!d && C.name !== d;
        })), this;
      }, p2.prototype.open = function() {
        var l = this;
        return h0(Zt, function() {
          return t3(l);
        });
      }, p2.prototype._close = function() {
        this.on.close.fire(new CustomEvent("close"));
        var l = this._state, s = K0.indexOf(this);
        if (0 <= s && K0.splice(s, 1), this.idbdb) {
          try {
            this.idbdb.close();
          } catch {
          }
          this.idbdb = null;
        }
        l.isBeingOpened || (l.dbReadyPromise = new Ie(function(d) {
          l.dbReadyResolve = d;
        }), l.openCanceller = new Ie(function(d, m) {
          l.cancelOpen = m;
        }));
      }, p2.prototype.close = function(d) {
        var s = (d === void 0 ? { disableAutoOpen: !0 } : d).disableAutoOpen, d = this._state;
        s ? (d.isBeingOpened && d.cancelOpen(new ye.DatabaseClosed()), this._close(), d.autoOpen = !1, d.dbOpenError = new ye.DatabaseClosed()) : (this._close(), d.autoOpen = this._options.autoOpen || d.isBeingOpened, d.openComplete = !1, d.dbOpenError = null);
      }, p2.prototype.delete = function(l) {
        var s = this;
        l === void 0 && (l = { disableAutoOpen: !0 });
        var d = 0 < arguments.length && typeof arguments[0] != "object", m = this._state;
        return new Ie(function(C, b) {
          function P() {
            s.close(l);
            var $ = s._deps.indexedDB.deleteDatabase(s.name);
            $.onsuccess = v2(function() {
              var D, N, W;
              D = s._deps, N = s.name, W = D.indexedDB, D = D.IDBKeyRange, xi(W) || N === Va || wi(W, D).delete(N).catch(Me), C();
            }), $.onerror = Pt(b), $.onblocked = s._fireOnBlocked;
          }
          if (d) throw new ye.InvalidArgument("Invalid closeOptions argument to db.delete()");
          m.isBeingOpened ? m.dbReadyPromise.then(P) : P();
        });
      }, p2.prototype.backendDB = function() {
        return this.idbdb;
      }, p2.prototype.isOpen = function() {
        return this.idbdb !== null;
      }, p2.prototype.hasBeenClosed = function() {
        var l = this._state.dbOpenError;
        return l && l.name === "DatabaseClosed";
      }, p2.prototype.hasFailed = function() {
        return this._state.dbOpenError !== null;
      }, p2.prototype.dynamicallyOpened = function() {
        return this._state.autoSchema;
      }, Object.defineProperty(p2.prototype, "tables", { get: function() {
        var l = this;
        return o(this._allTables).map(function(s) {
          return l._allTables[s];
        });
      }, enumerable: !1, configurable: !0 }), p2.prototype.transaction = function() {
        var l = (function(s, d, m) {
          var C = arguments.length;
          if (C < 2) throw new ye.InvalidArgument("Too few arguments");
          for (var b = new Array(C - 1); --C; ) b[C - 1] = arguments[C];
          return m = b.pop(), [s, U(b), m];
        }).apply(this, arguments);
        return this._transaction.apply(this, l);
      }, p2.prototype._transaction = function(l, s, d) {
        var m = this, C = Te.trans;
        C && C.db === this && l.indexOf("!") === -1 || (C = null);
        var b, P, $ = l.indexOf("?") !== -1;
        l = l.replace("!", "").replace("?", "");
        try {
          if (P = s.map(function(N) {
            if (N = N instanceof m.Table ? N.name : N, typeof N != "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
            return N;
          }), l == "r" || l === ci) b = ci;
          else {
            if (l != "rw" && l != di) throw new ye.InvalidArgument("Invalid transaction mode: " + l);
            b = di;
          }
          if (C) {
            if (C.mode === ci && b === di) {
              if (!$) throw new ye.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
              C = null;
            }
            C && P.forEach(function(N) {
              if (C && C.storeNames.indexOf(N) === -1) {
                if (!$) throw new ye.SubTransaction("Table " + N + " not included in parent transaction.");
                C = null;
              }
            }), $ && C && !C.active && (C = null);
          }
        } catch (N) {
          return C ? C._promise(null, function(W, B) {
            B(N);
          }) : C2(N);
        }
        var D = (function N(W, B, H, z, j) {
          return Ie.resolve().then(function() {
            var K = Te.transless || Te, q = W._createTransaction(B, H, W._dbSchema, z);
            if (q.explicit = !0, K = { trans: q, transless: K }, z) q.idbtrans = z.idbtrans;
            else try {
              q.create(), q.idbtrans._explicit = !0, W._state.PR1398_maxLoop = 3;
            } catch (ie) {
              return ie.name === de.InvalidState && W.isOpen() && 0 < --W._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), W.close({ disableAutoOpen: !1 }), W.open().then(function() {
                return N(W, B, H, null, j);
              })) : C2(ie);
            }
            var Z, Q = ke(j);
            return Q && j0(), K = Ie.follow(function() {
              var ie;
              (Z = j.call(q, q)) && (Q ? (ie = Xt.bind(null, null), Z.then(ie, ie)) : typeof Z.next == "function" && typeof Z.throw == "function" && (Z = Ei(Z)));
            }, K), (Z && typeof Z.then == "function" ? Ie.resolve(Z).then(function(ie) {
              return q.active ? ie : C2(new ye.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
            }) : K.then(function() {
              return Z;
            })).then(function(ie) {
              return z && q._resolve(), q._completion.then(function() {
                return ie;
              });
            }).catch(function(ie) {
              return q._reject(ie), C2(ie);
            });
          });
        }).bind(null, this, b, P, C, d);
        return C ? C._promise(b, D, "lock") : Te.trans ? h0(Te.transless, function() {
          return m._whenReady(D);
        }) : this._whenReady(D);
      }, p2.prototype.table = function(l) {
        if (!h(this._allTables, l)) throw new ye.InvalidTable("Table ".concat(l, " does not exist"));
        return this._allTables[l];
      }, p2);
      function p2(l, s) {
        var d = this;
        this._middlewares = {}, this.verno = 0;
        var m = p2.dependencies;
        this._options = s = a({ addons: p2.addons, autoOpen: !0, indexedDB: m.indexedDB, IDBKeyRange: m.IDBKeyRange, cache: "cloned" }, s), this._deps = { indexedDB: s.indexedDB, IDBKeyRange: s.IDBKeyRange }, m = s.addons, this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
        var C, b, P, $, D, N = { dbOpenError: null, isBeingOpened: !1, onReadyBeingFired: null, openComplete: !1, dbReadyResolve: Me, dbReadyPromise: null, cancelOpen: Me, openCanceller: null, autoSchema: !0, PR1398_maxLoop: 3, autoOpen: s.autoOpen };
        N.dbReadyPromise = new Ie(function(B) {
          N.dbReadyResolve = B;
        }), N.openCanceller = new Ie(function(B, H) {
          N.cancelOpen = H;
        }), this._state = N, this.name = l, this.on = xn(this, "populate", "blocked", "versionchange", "close", { ready: [ti, Me] }), this.once = function(B, H) {
          var z = function() {
            for (var j = [], K = 0; K < arguments.length; K++) j[K] = arguments[K];
            d.on(B).unsubscribe(z), H.apply(d, j);
          };
          return d.on(B, z);
        }, this.on.ready.subscribe = A(this.on.ready.subscribe, function(B) {
          return function(H, z) {
            p2.vip(function() {
              var j, K = d._state;
              K.openComplete ? (K.dbOpenError || Ie.resolve().then(H), z && B(H)) : K.onReadyBeingFired ? (K.onReadyBeingFired.push(H), z && B(H)) : (B(H), j = d, z || B(function q() {
                j.on.ready.unsubscribe(H), j.on.ready.unsubscribe(q);
              }));
            });
          };
        }), this.Collection = (C = this, Sn(W4.prototype, function(Z, q) {
          this.db = C;
          var z = Ro, j = null;
          if (q) try {
            z = q();
          } catch (Q) {
            j = Q;
          }
          var K = Z._ctx, q = K.table, Z = q.hook.reading.fire;
          this._ctx = { table: q, index: K.index, isPrimKey: !K.index || q.schema.primKey.keyPath && K.index === q.schema.primKey.name, range: z, keysOnly: !1, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: !0, isMatch: null, offset: 0, limit: 1 / 0, error: j, or: K.or, valueMapper: Z !== _2 ? Z : null };
        })), this.Table = (b = this, Sn(Wo.prototype, function(B, H, z) {
          this.db = b, this._tx = z, this.name = B, this.schema = H, this.hook = b._allTables[B] ? b._allTables[B].hook : xn(null, { creating: [ei, Me], reading: [j2, _2], updating: [M4, Me], deleting: [B4, Me] });
        })), this.Transaction = (P = this, Sn(U4.prototype, function(B, H, z, j, K) {
          var q = this;
          B !== "readonly" && H.forEach(function(Z) {
            Z = (Z = z[Z]) === null || Z === void 0 ? void 0 : Z.yProps, Z && (H = H.concat(Z.map(function(Q) {
              return Q.updatesTable;
            })));
          }), this.db = P, this.mode = B, this.storeNames = H, this.schema = z, this.chromeTransactionDurability = j, this.idbtrans = null, this.on = xn(this, "complete", "error", "abort"), this.parent = K || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new Ie(function(Z, Q) {
            q._resolve = Z, q._reject = Q;
          }), this._completion.then(function() {
            q.active = !1, q.on.complete.fire();
          }, function(Z) {
            var Q = q.active;
            return q.active = !1, q.on.error.fire(Z), q.parent ? q.parent._reject(Z) : Q && q.idbtrans && q.idbtrans.abort(), C2(Z);
          });
        })), this.Version = ($ = this, Sn(e3.prototype, function(B) {
          this.db = $, this._cfg = { version: B, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
        })), this.WhereClause = (D = this, Sn(Zo.prototype, function(B, H, z) {
          if (this.db = D, this._ctx = { table: B, index: H === ":id" ? null : H, or: z }, this._cmp = this._ascending = Qe, this._descending = function(j, K) {
            return Qe(K, j);
          }, this._max = function(j, K) {
            return 0 < Qe(j, K) ? j : K;
          }, this._min = function(j, K) {
            return Qe(j, K) < 0 ? j : K;
          }, this._IDBKeyRange = D._deps.IDBKeyRange, !this._IDBKeyRange) throw new ye.MissingAPI();
        })), this.on("versionchange", function(B) {
          0 < B.newVersion ? console.warn("Another connection wants to upgrade database '".concat(d.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(d.name, "'. Closing db now to resume the delete request.")), d.close({ disableAutoOpen: !1 });
        }), this.on("blocked", function(B) {
          !B.newVersion || B.newVersion < B.oldVersion ? console.warn("Dexie.delete('".concat(d.name, "') was blocked")) : console.warn("Upgrade '".concat(d.name, "' blocked by other connection holding version ").concat(B.oldVersion / 10));
        }), this._maxKey = Pn(s.IDBKeyRange), this._createTransaction = function(B, H, z, j) {
          return new d.Transaction(B, H, z, d._options.chromeTransactionDurability, j);
        }, this._fireOnBlocked = function(B) {
          d.on("blocked").fire(B), K0.filter(function(H) {
            return H.name === d.name && H !== d && !H._state.vcFired;
          }).map(function(H) {
            return H.on("versionchange").fire(B);
          });
        }, this.use(r3), this.use(s3), this.use(i3), this.use(n3), this.use(a3);
        var W = new Proxy(this, { get: function(B, H, z) {
          if (H === "_vip") return !0;
          if (H === "table") return function(K) {
            return ja(d.table(K), W);
          };
          var j = Reflect.get(B, H, z);
          return j instanceof Wo ? ja(j, W) : H === "tables" ? j.map(function(K) {
            return ja(K, W);
          }) : H === "_createTransaction" ? function() {
            return ja(j.apply(this, arguments), W);
          } : j;
        } });
        this.vip = W, m.forEach(function(B) {
          return B(d);
        });
      }
      var Ka, st = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", u3 = (Oi.prototype.subscribe = function(l, s, d) {
        return this._subscribe(l && typeof l != "function" ? l : { next: l, error: s, complete: d });
      }, Oi.prototype[st] = function() {
        return this;
      }, Oi);
      function Oi(l) {
        this._subscribe = l;
      }
      try {
        Ka = { indexedDB: i.indexedDB || i.mozIndexedDB || i.webkitIndexedDB || i.msIndexedDB, IDBKeyRange: i.IDBKeyRange || i.webkitIDBKeyRange };
      } catch {
        Ka = { indexedDB: null, IDBKeyRange: null };
      }
      function cs(l) {
        var s, d = !1, m = new u3(function(C) {
          var b = ke(l), P, $ = !1, D = {}, N = {}, W = { get closed() {
            return $;
          }, unsubscribe: function() {
            $ || ($ = !0, P && P.abort(), B && e0.storagemutated.unsubscribe(z));
          } };
          C.start && C.start(W);
          var B = !1, H = function() {
            return ui(j);
          }, z = function(K) {
            Da(D, K), _i(N, D) && H();
          }, j = function() {
            var K, q, Z;
            !$ && Ka.indexedDB && (D = {}, K = {}, P && P.abort(), P = new AbortController(), Z = (function(Q) {
              var ie = N0();
              try {
                b && j0();
                var ue = Yt(l, Q);
                return ue = b ? ue.finally(Xt) : ue;
              } finally {
                ie && z0();
              }
            })(q = { subscr: K, signal: P.signal, requery: H, querier: l, trans: null }), Promise.resolve(Z).then(function(Q) {
              d = !0, s = Q, $ || q.signal.aborted || (D = {}, (function(ie) {
                for (var ue in ie) if (h(ie, ue)) return;
                return 1;
              })(N = K) || B || (e0(_n, z), B = !0), ui(function() {
                return !$ && C.next && C.next(Q);
              }));
            }, function(Q) {
              d = !1, ["DatabaseClosedError", "AbortError"].includes(Q?.name) || $ || ui(function() {
                $ || C.error && C.error(Q);
              });
            }));
          };
          return setTimeout(H, 0), W;
        });
        return m.hasValue = function() {
          return d;
        }, m.getValue = function() {
          return s;
        }, m;
      }
      var b0 = Ft;
      function Fi(l) {
        var s = t0;
        try {
          t0 = !0, e0.storagemutated.fire(l), Ii(l, !0);
        } finally {
          t0 = s;
        }
      }
      y(b0, a(a({}, F2), { delete: function(l) {
        return new b0(l, { addons: [] }).delete();
      }, exists: function(l) {
        return new b0(l, { addons: [] }).open().then(function(s) {
          return s.close(), !0;
        }).catch("NoSuchDatabaseError", function() {
          return !1;
        });
      }, getDatabaseNames: function(l) {
        try {
          return s = b0.dependencies, d = s.indexedDB, s = s.IDBKeyRange, (xi(d) ? Promise.resolve(d.databases()).then(function(m) {
            return m.map(function(C) {
              return C.name;
            }).filter(function(C) {
              return C !== Va;
            });
          }) : wi(d, s).toCollection().primaryKeys()).then(l);
        } catch {
          return C2(new ye.MissingAPI());
        }
        var s, d;
      }, defineClass: function() {
        return function(l) {
          c(this, l);
        };
      }, ignoreTransaction: function(l) {
        return Te.trans ? h0(Te.transless, l) : l();
      }, vip: Si, async: function(l) {
        return function() {
          try {
            var s = Ei(l.apply(this, arguments));
            return s && typeof s.then == "function" ? s : Ie.resolve(s);
          } catch (d) {
            return C2(d);
          }
        };
      }, spawn: function(l, s, d) {
        try {
          var m = Ei(l.apply(d, s || []));
          return m && typeof m.then == "function" ? m : Ie.resolve(m);
        } catch (C) {
          return C2(C);
        }
      }, currentTransaction: { get: function() {
        return Te.trans || null;
      } }, waitFor: function(l, s) {
        return s = Ie.resolve(typeof l == "function" ? b0.ignoreTransaction(l) : l).timeout(s || 6e4), Te.trans ? Te.trans.waitFor(s) : s;
      }, Promise: Ie, debug: { get: function() {
        return _t;
      }, set: function(l) {
        $o(l);
      } }, derive: S, extend: c, props: y, override: A, Events: xn, on: e0, liveQuery: cs, extendObservabilitySet: Da, getByKeyPath: Y, setByKeyPath: F, delByKeyPath: function(l, s) {
        typeof s == "string" ? F(l, s, void 0) : "length" in s && [].map.call(s, function(d) {
          F(l, d, void 0);
        });
      }, shallowClone: x, deepClone: ae, getObjectDiff: Ai, cmp: Qe, asap: O, minKey: -1 / 0, addons: [], connections: K0, errnames: de, dependencies: Ka, cache: p0, semVer: "4.2.1", version: "4.2.1".split(".").map(function(l) {
        return parseInt(l);
      }).reduce(function(l, s, d) {
        return l + s / Math.pow(10, 2 * d);
      }) })), b0.maxKey = Pn(b0.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (e0(_n, function(l) {
        t0 || (l = new CustomEvent(mi, { detail: l }), t0 = !0, dispatchEvent(l), t0 = !1);
      }), addEventListener(mi, function(l) {
        l = l.detail, t0 || Fi(l);
      }));
      var U0, t0 = !1, ds = function() {
      };
      return typeof BroadcastChannel < "u" && ((ds = function() {
        (U0 = new BroadcastChannel(mi)).onmessage = function(l) {
          return l.data && Fi(l.data);
        };
      })(), typeof U0.unref == "function" && U0.unref(), e0(_n, function(l) {
        t0 || U0.postMessage(l);
      })), typeof addEventListener < "u" && (addEventListener("pagehide", function(l) {
        if (!Ft.disableBfCache && l.persisted) {
          _t && console.debug("Dexie: handling persisted pagehide"), U0?.close();
          for (var s = 0, d = K0; s < d.length; s++) d[s].close({ disableAutoOpen: !1 });
        }
      }), addEventListener("pageshow", function(l) {
        !Ft.disableBfCache && l.persisted && (_t && console.debug("Dexie: handling persisted pageshow"), ds(), Fi({ all: new L2(-1 / 0, [[]]) }));
      })), Ie.rejectionMapper = function(l, s) {
        return !l || l instanceof ne || l instanceof TypeError || l instanceof SyntaxError || !l.name || !f2[l.name] ? l : (s = new f2[l.name](s || l.message, l), "stack" in l && k(s, "stack", { get: function() {
          return this.inner.stack;
        } }), s);
      }, $o(_t), a(Ft, Object.freeze({ __proto__: null, Dexie: Ft, liveQuery: cs, Entity: Do, cmp: Qe, PropModification: wn, replacePrefix: function(l, s) {
        return new wn({ replacePrefix: [l, s] });
      }, add: function(l) {
        return new wn({ add: l });
      }, remove: function(l) {
        return new wn({ remove: l });
      }, default: Ft, RangeSet: L2, mergeRanges: En, rangesOverlap: es }), { default: Ft }), Ft;
    });
  })(tr)), tr.exports;
}
var V3 = P3();
const il = /* @__PURE__ */ k3(V3), vs = /* @__PURE__ */ Symbol.for("Dexie"), r0 = globalThis[vs] || (globalThis[vs] = il);
if (il.semVer !== r0.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${il.semVer} and ${r0.semVer}`);
const {
  liveQuery: lr,
  mergeRanges: ag,
  rangesOverlap: rg,
  RangeSet: ig,
  cmp: lg,
  Entity: og,
  PropModification: sg,
  replacePrefix: ug,
  add: cg,
  remove: dg,
  DexieYProvider: fg
} = r0, ms = {
  name: "camera_positions",
  schema: "++id, name"
}, gs = {
  name: "data_style",
  schema: "id"
}, hs = {
  name: "data",
  schema: "id, name, viewer_type, geode_object_type, visible, created_at, binary_light_viewable"
}, ys = {
  name: "model_component_datastyle",
  schema: "[id_model+id_component], id_model"
}, Cs = {
  name: "model_component_type_datastyle",
  schema: "[id_model+type], id_model"
}, ps = {
  name: "model_components_relation",
  schema: "[id+parent+child], type"
}, bs = {
  name: "model_components",
  schema: "[id+geode_id], [id+type], viewer_id, name, is_active"
};
class k0 extends r0 {
  static get initialStores() {
    return {
      [hs.name]: hs.schema,
      [bs.name]: bs.schema,
      [gs.name]: gs.schema,
      [ys.name]: ys.schema,
      [Cs.name]: Cs.schema,
      [ps.name]: ps.schema,
      [ms.name]: ms.schema,
      treeview_config: "id"
    };
  }
  clear() {
    return Promise.all(this.tables.map((t) => t.clear()));
  }
}
class I3 extends k0 {
  constructor(t, n, a) {
    super("Database");
    for (let r = 1; r <= t; r += 1)
      r === 1 ? this.version(1).stores(k0.initialStores) : this.version(r).stores(n);
    this.version(t + 1).stores({
      ...n,
      ...a
    });
  }
}
class I6 extends k0 {
  constructor() {
    super("Database"), this.version(3).stores(k0.initialStores);
  }
  static async addTable(t, n) {
    await this.addTables({ [t]: n });
  }
  static async addTables(t) {
    let n = 1, a = { ...k0.initialStores };
    if (await r0.exists("Database")) {
      const i = new r0("Database");
      await i.open(), n = i.verno, a = { ...k0.initialStores };
      for (const o of i.tables) {
        const u = o.schema.primKey.src, c = o.schema.indexes.map((v) => v.src), f = u ? [u, ...c] : c;
        a[o.name] = f.join(",");
      }
      i.close();
    }
    const r = Object.keys(t).every((i) => a[i]);
    if (tn.instance.close(), r) {
      const i = new r0("Database");
      for (let o = 1; o <= n; o += 1)
        o === 1 ? i.version(1).stores(k0.initialStores) : i.version(o).stores(a);
      await i.open(), tn.instance = i;
    } else {
      const i = new I3(n, a, t);
      await i.open(), tn.instance = i;
    }
  }
}
await r0.delete("Database");
const tn = { instance: new I6() };
tn.instance.clear();
const Nn = new Proxy(
  {},
  {
    get(e, t) {
      const n = tn.instance[t];
      return typeof n == "function" ? n.bind(tn.instance) : n;
    }
  }
), ws = {
  name: "classifications",
  schema: "id, type, name, created_at"
}, xs = {
  name: "classification_relations",
  schema: "id, classification_id, object_id"
};
async function E3(e) {
  await I6.addTables({
    [ws.name]: ws.schema,
    [xs.name]: xs.schema
  });
}
function A3(e, t) {
  return c3() ? (i2(e, t), !0) : !1;
}
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
function Ss(e, t) {
  const n = se(t?.initialValue), a = e.subscribe({
    next: (r) => n.value = r,
    error: t?.onError
  });
  return A3(() => {
    a.unsubscribe();
  }), n;
}
const vn = V6("classification", () => {
  const e = Nn.classifications, t = Nn.classification_relations, n = Ss(
    lr(() => e.toArray()),
    { initialValue: [] }
  ), a = Ss(
    lr(() => t.toArray()),
    { initialValue: [] }
  );
  async function r({ type: f, name: v }) {
    const y = {
      id: crypto.randomUUID(),
      type: f,
      name: v,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      return await e.add(y), y;
    } catch (p) {
      console.error("[ClassificationStore] Failed to create entity", p);
      return;
    }
  }
  async function i(f) {
    await e.delete(f), await t.where({ classification_id: f }).delete();
  }
  async function o(f, v) {
    await t.where({ object_id: f }).delete(), v && await t.add({
      id: crypto.randomUUID(),
      classification_id: v,
      object_id: f
    });
  }
  function u(f) {
    const v = f.toLowerCase();
    return n.value.filter((h) => h.type.toLowerCase() === v);
  }
  function c(f, v) {
    const h = v.toLowerCase(), y = new Set(
      a.value.filter((p) => {
        const k = n.value.find(
          (S) => S.id === p.classification_id
        );
        return k && k.type.toLowerCase() === h;
      }).map((p) => p.object_id)
    );
    return f.filter((p) => y.has(p.id));
  }
  return {
    classifications: n,
    relations: a,
    createEntity: r,
    deleteEntity: i,
    setRelation: o,
    getEntitiesByType: u,
    getItemsByType: c
  };
}), $3 = { model: { remesh: { $id: "vease_modeling_back/model/remesh", route: "/remesh", methods: ["POST"], type: "object", properties: { id: { type: "string", minLength: 32, maxLength: 32 }, name: { type: "string" }, default: { type: "number", description: "Default mesh size", exclusiveMinimum: 0 }, gradation: { type: "number", exclusiveMinimum: 0 }, corners: { type: "array", items: { type: "object", properties: { id: { type: "string", minLength: 36, maxLength: 36 }, metric: { type: "number", exclusiveMinimum: 0 } }, required: ["id", "metric"], additionalProperties: !1 } }, lines: { type: "array", items: { type: "object", properties: { id: { type: "string", minLength: 36, maxLength: 36 }, metric: { type: "number", exclusiveMinimum: 0 } }, required: ["id", "metric"], additionalProperties: !1 } }, surfaces: { type: "array", items: { type: "object", properties: { id: { type: "string", minLength: 36, maxLength: 36 }, metric: { type: "number", exclusiveMinimum: 0 } }, required: ["id", "metric"], additionalProperties: !1 } }, blocks: { type: "array", items: { type: "object", properties: { id: { type: "string", minLength: 36, maxLength: 36 }, metric: { type: "number", exclusiveMinimum: 0 } }, required: ["id", "metric"], additionalProperties: !1 } } }, required: ["id", "name", "default"], additionalProperties: !1 }, explicit: { $id: "vease_modeling_back/model/explicit", route: "/explicit", methods: ["POST"], type: "object", properties: { id: { type: "string", minLength: 32, maxLength: 32 }, name: { type: "string" }, faults: { type: "array", items: { type: "object", properties: { name: { type: "string" }, id: { type: "array", items: { type: "string" } } }, required: ["id", "name"], additionalProperties: !1 } }, horizons: { type: "array", items: { type: "object", properties: { name: { type: "string" }, id: { type: "array", items: { type: "string" } } }, required: ["id", "name"], additionalProperties: !1 } } }, required: ["id", "name"], additionalProperties: !1 } }, voi_curve: { $id: "vease_modeling_back/voi/create/curve", route: "/voi/create/curve", methods: ["POST"], type: "object", properties: { name: { type: "string", description: "Name of the VOI" }, topography_id: { type: "string", description: "ID of the topography (TriangulatedSurface3D or PolygonalSurface3D)" }, curve_id: { type: "string", description: "ID of the curve (EdgedCurve2D or 3D)" }, bottom_surface_depth: { type: "number", description: "Bottom surface depth" } }, required: ["name", "topography_id", "curve_id", "bottom_surface_depth"], additionalProperties: !1 }, voi_aoi: { $id: "vease_modeling_back/voi/create/aoi", route: "/voi/create/aoi", methods: ["POST"], type: "object", properties: { name: { type: "string", description: "Name of the VOI" }, aoi_id: { type: "string", description: "ID of the corresponding AOI" }, z_min: { type: "number", description: "Minimum Z coordinate" }, z_max: { type: "number", description: "Maximum Z coordinate" }, id: { type: "string", description: "Optional ID for updating existing VOI" } }, required: ["name", "aoi_id", "z_min", "z_max"], additionalProperties: !1 }, aoi: { $id: "vease_modeling_back/aoi/create", route: "/aoi/create", methods: ["POST"], type: "object", properties: { name: { type: "string", description: "Name of the AOI" }, points: { type: "array", items: { type: "object", properties: { x: { type: "number" }, y: { type: "number" } }, required: ["x", "y"], additionalProperties: !1 }, minItems: 3 }, z: { type: "number" }, id: { type: "string" } }, required: ["name", "points", "z"], additionalProperties: !1 } }, It = {
  vease_modeling_back: $3
}, T3 = 1e4, O3 = "443", A0 = V6("vease-modeling", {
  state: () => ({
    default_local_port: "5001",
    request_counter: 0,
    status: G0.NOT_CONNECTED,
    version: "0.0.0"
  }),
  getters: {
    protocol() {
      return Bi().app_mode === $n.CLOUD ? "https" : "http";
    },
    port() {
      return Bi().app_mode === $n.CLOUD ? O3 : this.default_local_port;
    },
    base_url() {
      const e = Bi();
      if (e.app_mode === $n.BROWSER || e.app_mode === $n.DESKTOP)
        return `${this.protocol}://${e.domain_name}:${this.port}`;
      let t = `${this.protocol}://${e.domain_name}:${this.port}`;
      if (e.app_mode === $n.CLOUD) {
        if (e.ID === "")
          throw new Error("ID must not be empty in cloud mode");
        t += `/${e.ID}/vease-modeling`;
      }
      return t;
    },
    is_busy() {
      return this.request_counter > 0;
    }
  },
  actions: {
    set_ping() {
      this.ping(), setInterval(() => {
        this.status === G0.CONNECTED && this.ping();
      }, T3);
    },
    ping() {
      const e = p3();
      return $fetch(It.vease_modeling_back.ping.$id, {
        baseURL: this.base_url,
        method: It.vease_modeling_back.ping.methods[0],
        body: {},
        onRequestError: ({ error: t }) => {
          e.$patch({ server_error: !0 }), this.status = G0.NOT_CONNECTED;
        },
        onResponse: ({ response: t }) => {
          t.ok && (e.$patch({ server_error: !1 }), this.status = G0.CONNECTED);
        },
        onResponseError: ({ response: t }) => {
          e.$patch({ server_error: !0 }), this.status = G0.NOT_CONNECTED;
        }
      });
    },
    start_request() {
      this.request_counter += 1;
    },
    stop_request() {
      this.request_counter -= 1;
    },
    connect() {
      return console.log("[VEASE-MODELING] Connecting to vease-modeling microservice..."), It.vease_modeling_back?.ping ? this.ping() : (console.log("[VEASE-MODELING] No ping schema, assuming connected"), this.status = G0.CONNECTED, Promise.resolve());
    },
    request({ schema: e, params: t }, n = {}) {
      return console.log("[VEASE-MODELING] Request:", e.$id), C3(
        this,
        { schema: e, params: t, headers: {} },
        {
          ...n,
          response_function: async (a) => {
            console.log("[VEASE-MODELING] Request completed:", e.$id), n.response_function && await n.response_function(a);
          }
        }
      );
    },
    get_version() {
      const e = It.vease_modeling_back.microservice_version;
      return this.request(
        { schema: e },
        {
          response_function: (t) => {
            this.version = t.version;
          }
        }
      );
    }
  },
  share: {
    omit: ["status"]
  }
}), Ml = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20width='1000'%20zoomAndPan='magnify'%20viewBox='0%200%20750%20749.999995'%20height='1000'%20preserveAspectRatio='xMidYMid%20meet'%20version='1.0'%3e%3cdefs%3e%3cclipPath%20id='90f2c5cffd'%3e%3cpath%20d='M%20474.441406%20466.234375%20L%20708.441406%20466.234375%20L%20708.441406%20700.234375%20L%20474.441406%20700.234375%20Z%20M%20474.441406%20466.234375%20'%20clip-rule='nonzero'/%3e%3c/clipPath%3e%3cclipPath%20id='4bf9681d98'%3e%3cpath%20d='M%20591.484375%20466.234375%20C%20526.84375%20466.234375%20474.441406%20518.636719%20474.441406%20583.277344%20C%20474.441406%20647.914062%20526.84375%20700.316406%20591.484375%20700.316406%20C%20656.125%20700.316406%20708.523438%20647.914062%20708.523438%20583.277344%20C%20708.523438%20518.636719%20656.125%20466.234375%20591.484375%20466.234375%20Z%20M%20591.484375%20466.234375%20'%20clip-rule='nonzero'/%3e%3c/clipPath%3e%3c/defs%3e%3cpath%20fill='%23FFFFFF'%20d='M%2048.097656%20623.480469%20L%20123.097656%20623.480469%20C%20123.589844%20623.480469%20124.078125%20623.527344%20124.558594%20623.621094%20C%20125.042969%20623.71875%20125.511719%20623.859375%20125.96875%20624.050781%20C%20126.421875%20624.238281%20126.855469%20624.46875%20127.265625%20624.742188%20C%20127.671875%20625.015625%20128.050781%20625.328125%20128.402344%20625.675781%20C%20128.75%20626.023438%20129.058594%20626.402344%20129.332031%20626.8125%20C%20129.605469%20627.222656%20129.839844%20627.652344%20130.027344%20628.109375%20C%20130.214844%20628.5625%20130.355469%20629.03125%20130.453125%20629.515625%20C%20130.550781%20630%20130.597656%20630.484375%20130.597656%20630.980469%20C%20130.597656%20631.472656%20130.550781%20631.957031%20130.453125%20632.441406%20C%20130.355469%20632.925781%20130.214844%20633.394531%20130.027344%20633.847656%20C%20129.839844%20634.304688%20129.605469%20634.734375%20129.332031%20635.144531%20C%20129.058594%20635.554688%20128.75%20635.933594%20128.402344%20636.28125%20C%20128.050781%20636.628906%20127.671875%20636.941406%20127.265625%20637.214844%20C%20126.855469%20637.488281%20126.421875%20637.71875%20125.96875%20637.90625%20C%20125.511719%20638.097656%20125.042969%20638.238281%20124.558594%20638.335938%20C%20124.078125%20638.429688%20123.589844%20638.480469%20123.097656%20638.480469%20L%2048.097656%20638.480469%20C%2047.605469%20638.480469%2047.117188%20638.429688%2046.632812%20638.335938%20C%2046.152344%20638.238281%2045.683594%20638.097656%2045.226562%20637.90625%20C%2044.773438%20637.71875%2044.339844%20637.488281%2043.929688%20637.214844%20C%2043.519531%20636.941406%2043.140625%20636.628906%2042.792969%20636.28125%20C%2042.445312%20635.933594%2042.136719%20635.554688%2041.859375%20635.144531%20C%2041.585938%20634.734375%2041.355469%20634.304688%2041.167969%20633.847656%20C%2040.980469%20633.394531%2040.835938%20632.925781%2040.742188%20632.441406%20C%2040.644531%20631.957031%2040.597656%20631.472656%2040.597656%20630.980469%20C%2040.597656%20630.484375%2040.644531%20630%2040.742188%20629.515625%20C%2040.835938%20629.03125%2040.980469%20628.5625%2041.167969%20628.109375%20C%2041.355469%20627.652344%2041.585938%20627.222656%2041.859375%20626.8125%20C%2042.136719%20626.402344%2042.445312%20626.023438%2042.792969%20625.675781%20C%2043.140625%20625.328125%2043.519531%20625.015625%2043.929688%20624.742188%20C%2044.339844%20624.46875%2044.773438%20624.238281%2045.226562%20624.050781%20C%2045.683594%20623.859375%2046.152344%20623.71875%2046.632812%20623.621094%20C%2047.117188%20623.527344%2047.605469%20623.480469%2048.097656%20623.480469%20Z%20M%20153.097656%20623.480469%20L%20228.097656%20623.480469%20C%20228.589844%20623.480469%20229.078125%20623.527344%20229.558594%20623.621094%20C%20230.042969%20623.71875%20230.511719%20623.859375%20230.96875%20624.050781%20C%20231.421875%20624.238281%20231.855469%20624.46875%20232.265625%20624.742188%20C%20232.671875%20625.015625%20233.050781%20625.328125%20233.402344%20625.675781%20C%20233.75%20626.023438%20234.058594%20626.402344%20234.332031%20626.8125%20C%20234.605469%20627.222656%20234.839844%20627.652344%20235.027344%20628.109375%20C%20235.214844%20628.5625%20235.355469%20629.03125%20235.453125%20629.515625%20C%20235.550781%20630%20235.597656%20630.484375%20235.597656%20630.980469%20C%20235.597656%20631.472656%20235.550781%20631.957031%20235.453125%20632.441406%20C%20235.355469%20632.925781%20235.214844%20633.394531%20235.027344%20633.847656%20C%20234.839844%20634.304688%20234.605469%20634.734375%20234.332031%20635.144531%20C%20234.058594%20635.554688%20233.75%20635.933594%20233.402344%20636.28125%20C%20233.050781%20636.628906%20232.671875%20636.941406%20232.265625%20637.214844%20C%20231.855469%20637.488281%20231.421875%20637.71875%20230.96875%20637.90625%20C%20230.511719%20638.097656%20230.042969%20638.238281%20229.558594%20638.335938%20C%20229.078125%20638.429688%20228.589844%20638.480469%20228.097656%20638.480469%20L%20153.097656%20638.480469%20C%20152.605469%20638.480469%20152.117188%20638.429688%20151.632812%20638.335938%20C%20151.152344%20638.238281%20150.683594%20638.097656%20150.226562%20637.90625%20C%20149.773438%20637.71875%20149.339844%20637.488281%20148.929688%20637.214844%20C%20148.519531%20636.941406%20148.140625%20636.628906%20147.792969%20636.28125%20C%20147.445312%20635.933594%20147.136719%20635.554688%20146.859375%20635.144531%20C%20146.585938%20634.734375%20146.355469%20634.304688%20146.167969%20633.847656%20C%20145.980469%20633.394531%20145.835938%20632.925781%20145.742188%20632.441406%20C%20145.644531%20631.957031%20145.597656%20631.472656%20145.597656%20630.980469%20C%20145.597656%20630.484375%20145.644531%20630%20145.742188%20629.515625%20C%20145.835938%20629.03125%20145.980469%20628.5625%20146.167969%20628.109375%20C%20146.355469%20627.652344%20146.585938%20627.222656%20146.859375%20626.8125%20C%20147.136719%20626.402344%20147.445312%20626.023438%20147.792969%20625.675781%20C%20148.140625%20625.328125%20148.519531%20625.015625%20148.929688%20624.742188%20C%20149.339844%20624.46875%20149.773438%20624.238281%20150.226562%20624.050781%20C%20150.683594%20623.859375%20151.152344%20623.71875%20151.632812%20623.621094%20C%20152.117188%20623.527344%20152.605469%20623.480469%20153.097656%20623.480469%20Z%20M%20258.097656%20623.480469%20L%20333.097656%20623.480469%20C%20333.589844%20623.480469%20334.078125%20623.527344%20334.558594%20623.621094%20C%20335.042969%20623.71875%20335.511719%20623.859375%20335.96875%20624.050781%20C%20336.421875%20624.238281%20336.855469%20624.46875%20337.265625%20624.742188%20C%20337.671875%20625.015625%20338.050781%20625.328125%20338.402344%20625.675781%20C%20338.75%20626.023438%20339.058594%20626.402344%20339.332031%20626.8125%20C%20339.605469%20627.222656%20339.839844%20627.652344%20340.027344%20628.109375%20C%20340.214844%20628.5625%20340.355469%20629.03125%20340.453125%20629.515625%20C%20340.550781%20630%20340.597656%20630.484375%20340.597656%20630.980469%20C%20340.597656%20631.472656%20340.550781%20631.957031%20340.453125%20632.441406%20C%20340.355469%20632.925781%20340.214844%20633.394531%20340.027344%20633.847656%20C%20339.839844%20634.304688%20339.605469%20634.734375%20339.332031%20635.144531%20C%20339.058594%20635.554688%20338.75%20635.933594%20338.402344%20636.28125%20C%20338.050781%20636.628906%20337.671875%20636.941406%20337.265625%20637.214844%20C%20336.855469%20637.488281%20336.421875%20637.71875%20335.96875%20637.90625%20C%20335.511719%20638.097656%20335.042969%20638.238281%20334.558594%20638.335938%20C%20334.078125%20638.429688%20333.589844%20638.480469%20333.097656%20638.480469%20L%20258.097656%20638.480469%20C%20257.605469%20638.480469%20257.117188%20638.429688%20256.632812%20638.335938%20C%20256.152344%20638.238281%20255.683594%20638.097656%20255.226562%20637.90625%20C%20254.773438%20637.71875%20254.339844%20637.488281%20253.929688%20637.214844%20C%20253.519531%20636.941406%20253.140625%20636.628906%20252.792969%20636.28125%20C%20252.445312%20635.933594%20252.136719%20635.554688%20251.859375%20635.144531%20C%20251.585938%20634.734375%20251.355469%20634.304688%20251.167969%20633.847656%20C%20250.980469%20633.394531%20250.835938%20632.925781%20250.742188%20632.441406%20C%20250.644531%20631.957031%20250.597656%20631.472656%20250.597656%20630.980469%20C%20250.597656%20630.484375%20250.644531%20630%20250.742188%20629.515625%20C%20250.835938%20629.03125%20250.980469%20628.5625%20251.167969%20628.109375%20C%20251.355469%20627.652344%20251.585938%20627.222656%20251.859375%20626.8125%20C%20252.136719%20626.402344%20252.445312%20626.023438%20252.792969%20625.675781%20C%20253.140625%20625.328125%20253.519531%20625.015625%20253.929688%20624.742188%20C%20254.339844%20624.46875%20254.773438%20624.238281%20255.226562%20624.050781%20C%20255.683594%20623.859375%20256.152344%20623.71875%20256.632812%20623.621094%20C%20257.117188%20623.527344%20257.605469%20623.480469%20258.097656%20623.480469%20Z%20M%20363.097656%20623.480469%20L%20438.097656%20623.480469%20C%20438.589844%20623.480469%20439.078125%20623.527344%20439.558594%20623.621094%20C%20440.042969%20623.71875%20440.511719%20623.859375%20440.96875%20624.050781%20C%20441.421875%20624.238281%20441.855469%20624.46875%20442.265625%20624.742188%20C%20442.671875%20625.015625%20443.050781%20625.328125%20443.402344%20625.675781%20C%20443.75%20626.023438%20444.058594%20626.402344%20444.332031%20626.8125%20C%20444.605469%20627.222656%20444.835938%20627.652344%20445.027344%20628.109375%20C%20445.214844%20628.5625%20445.355469%20629.03125%20445.453125%20629.515625%20C%20445.550781%20630%20445.597656%20630.484375%20445.597656%20630.980469%20C%20445.597656%20631.472656%20445.550781%20631.957031%20445.453125%20632.441406%20C%20445.355469%20632.925781%20445.214844%20633.394531%20445.027344%20633.847656%20C%20444.835938%20634.304688%20444.605469%20634.734375%20444.332031%20635.144531%20C%20444.058594%20635.554688%20443.75%20635.933594%20443.402344%20636.28125%20C%20443.050781%20636.628906%20442.671875%20636.941406%20442.265625%20637.214844%20C%20441.855469%20637.488281%20441.421875%20637.71875%20440.96875%20637.90625%20C%20440.511719%20638.097656%20440.042969%20638.238281%20439.558594%20638.335938%20C%20439.078125%20638.429688%20438.589844%20638.480469%20438.097656%20638.480469%20L%20363.097656%20638.480469%20C%20362.605469%20638.480469%20362.117188%20638.429688%20361.632812%20638.335938%20C%20361.152344%20638.238281%20360.683594%20638.097656%20360.226562%20637.90625%20C%20359.773438%20637.71875%20359.339844%20637.488281%20358.929688%20637.214844%20C%20358.519531%20636.941406%20358.140625%20636.628906%20357.792969%20636.28125%20C%20357.445312%20635.933594%20357.136719%20635.554688%20356.859375%20635.144531%20C%20356.585938%20634.734375%20356.355469%20634.304688%20356.167969%20633.847656%20C%20355.980469%20633.394531%20355.835938%20632.925781%20355.742188%20632.441406%20C%20355.644531%20631.957031%20355.597656%20631.472656%20355.597656%20630.980469%20C%20355.597656%20630.484375%20355.644531%20630%20355.742188%20629.515625%20C%20355.835938%20629.03125%20355.980469%20628.5625%20356.167969%20628.109375%20C%20356.355469%20627.652344%20356.585938%20627.222656%20356.859375%20626.8125%20C%20357.136719%20626.402344%20357.445312%20626.023438%20357.792969%20625.675781%20C%20358.140625%20625.328125%20358.519531%20625.015625%20358.929688%20624.742188%20C%20359.339844%20624.46875%20359.773438%20624.238281%20360.226562%20624.050781%20C%20360.683594%20623.859375%20361.152344%20623.71875%20361.632812%20623.621094%20C%20362.117188%20623.527344%20362.605469%20623.480469%20363.097656%20623.480469%20Z%20M%20363.097656%20623.480469%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%2033.070312%20623.5%20L%2032.824219%20548.5%20C%2032.824219%20548.007812%2032.871094%20547.523438%2032.964844%20547.039062%20C%2033.058594%20546.554688%2033.199219%20546.085938%2033.386719%20545.628906%20C%2033.574219%20545.175781%2033.804688%20544.742188%2034.074219%20544.332031%20C%2034.347656%20543.921875%2034.65625%20543.539062%2035.003906%20543.191406%20C%2035.351562%20542.84375%2035.730469%20542.53125%2036.136719%20542.253906%20C%2036.546875%20541.980469%2036.976562%20541.746094%2037.433594%20541.558594%20C%2037.886719%20541.367188%2038.355469%20541.222656%2038.839844%20541.125%20C%2039.320312%20541.027344%2039.808594%20540.980469%2040.300781%20540.976562%20C%2040.792969%20540.976562%2041.28125%20541.023438%2041.765625%20541.117188%20C%2042.246094%20541.210938%2042.71875%20541.351562%2043.171875%20541.539062%20C%2043.628906%20541.726562%2044.0625%20541.957031%2044.472656%20542.226562%20C%2044.882812%20542.5%2045.261719%20542.808594%2045.609375%20543.15625%20C%2045.960938%20543.503906%2046.273438%20543.882812%2046.546875%20544.289062%20C%2046.824219%20544.699219%2047.054688%20545.128906%2047.246094%20545.585938%20C%2047.433594%20546.039062%2047.578125%20546.507812%2047.675781%20546.988281%20C%2047.773438%20547.472656%2047.824219%20547.960938%2047.824219%20548.453125%20L%2048.070312%20623.453125%20C%2048.074219%20623.945312%2048.027344%20624.433594%2047.929688%20624.917969%20C%2047.835938%20625.398438%2047.695312%20625.867188%2047.507812%20626.324219%20C%2047.324219%20626.78125%2047.09375%20627.214844%2046.820312%20627.625%20C%2046.546875%20628.035156%2046.238281%20628.414062%2045.890625%20628.761719%20C%2045.542969%20629.113281%2045.167969%20629.425781%2044.757812%20629.699219%20C%2044.347656%20629.972656%2043.917969%20630.207031%2043.464844%20630.398438%20C%2043.007812%20630.585938%2042.539062%20630.730469%2042.058594%20630.828125%20C%2041.574219%20630.925781%2041.089844%20630.976562%2040.59375%20630.976562%20C%2040.101562%20630.980469%2039.613281%20630.933594%2039.132812%20630.835938%20C%2038.648438%20630.742188%2038.179688%20630.601562%2037.722656%20630.414062%20C%2037.269531%20630.226562%2036.835938%20630%2036.425781%20629.726562%20C%2036.015625%20629.453125%2035.632812%20629.144531%2035.285156%20628.796875%20C%2034.9375%20628.449219%2034.625%20628.074219%2034.347656%20627.664062%20C%2034.074219%20627.253906%2033.839844%20626.824219%2033.652344%20626.371094%20C%2033.460938%20625.914062%2033.316406%20625.445312%2033.21875%20624.964844%20C%2033.121094%20624.480469%2033.074219%20623.992188%2033.070312%20623.5%20Z%20M%2032.726562%20518.503906%20L%2032.480469%20443.503906%20C%2032.480469%20443.011719%2032.527344%20442.523438%2032.621094%20442.039062%20C%2032.714844%20441.554688%2032.855469%20441.085938%2033.042969%20440.628906%20C%2033.230469%20440.175781%2033.460938%20439.742188%2033.730469%20439.332031%20C%2034.003906%20438.921875%2034.3125%20438.542969%2034.660156%20438.191406%20C%2035.007812%20437.84375%2035.386719%20437.53125%2035.792969%20437.253906%20C%2036.203125%20436.980469%2036.632812%20436.75%2037.089844%20436.558594%20C%2037.542969%20436.367188%2038.011719%20436.222656%2038.496094%20436.125%20C%2038.976562%20436.027344%2039.464844%20435.980469%2039.957031%20435.976562%20C%2040.449219%20435.976562%2040.9375%20436.023438%2041.421875%20436.117188%20C%2041.902344%20436.210938%2042.375%20436.351562%2042.828125%20436.539062%20C%2043.285156%20436.726562%2043.71875%20436.957031%2044.128906%20437.226562%20C%2044.539062%20437.5%2044.917969%20437.808594%2045.269531%20438.15625%20C%2045.617188%20438.503906%2045.929688%20438.882812%2046.203125%20439.289062%20C%2046.480469%20439.699219%2046.710938%20440.128906%2046.902344%20440.585938%20C%2047.089844%20441.039062%2047.234375%20441.507812%2047.332031%20441.992188%20C%2047.429688%20442.472656%2047.480469%20442.960938%2047.480469%20443.453125%20L%2047.726562%20518.453125%20C%2047.730469%20518.945312%2047.683594%20519.433594%2047.585938%20519.917969%20C%2047.492188%20520.398438%2047.351562%20520.871094%2047.164062%20521.324219%20C%2046.980469%20521.78125%2046.75%20522.214844%2046.476562%20522.625%20C%2046.203125%20523.035156%2045.894531%20523.414062%2045.546875%20523.761719%20C%2045.199219%20524.113281%2044.824219%20524.425781%2044.414062%20524.699219%20C%2044.003906%20524.976562%2043.574219%20525.207031%2043.121094%20525.398438%20C%2042.664062%20525.585938%2042.195312%20525.730469%2041.714844%20525.828125%20C%2041.230469%20525.925781%2040.746094%20525.976562%2040.25%20525.976562%20C%2039.757812%20525.980469%2039.269531%20525.933594%2038.789062%20525.839844%20C%2038.304688%20525.742188%2037.835938%20525.601562%2037.378906%20525.414062%20C%2036.925781%20525.230469%2036.492188%20525%2036.082031%20524.726562%20C%2035.671875%20524.453125%2035.289062%20524.144531%2034.941406%20523.796875%20C%2034.59375%20523.449219%2034.28125%20523.074219%2034.003906%20522.664062%20C%2033.730469%20522.257812%2033.496094%20521.824219%2033.308594%20521.371094%20C%2033.117188%20520.914062%2032.972656%20520.449219%2032.875%20519.964844%20C%2032.777344%20519.480469%2032.730469%20518.996094%2032.726562%20518.503906%20Z%20M%2032.382812%20413.503906%20L%2032.136719%20338.503906%20C%2032.136719%20338.011719%2032.183594%20337.523438%2032.277344%20337.039062%20C%2032.371094%20336.554688%2032.511719%20336.085938%2032.699219%20335.632812%20C%2032.886719%20335.175781%2033.117188%20334.742188%2033.386719%20334.332031%20C%2033.660156%20333.921875%2033.96875%20333.542969%2034.316406%20333.191406%20C%2034.664062%20332.84375%2035.042969%20332.53125%2035.449219%20332.257812%20C%2035.859375%20331.980469%2036.289062%20331.75%2036.746094%20331.558594%20C%2037.199219%20331.367188%2037.667969%20331.226562%2038.152344%20331.128906%20C%2038.632812%20331.03125%2039.121094%20330.980469%2039.613281%20330.980469%20C%2040.105469%20330.976562%2040.59375%20331.023438%2041.078125%20331.117188%20C%2041.558594%20331.210938%2042.03125%20331.351562%2042.484375%20331.539062%20C%2042.941406%20331.726562%2043.375%20331.957031%2043.785156%20332.230469%20C%2044.195312%20332.5%2044.574219%20332.8125%2044.925781%20333.15625%20C%2045.273438%20333.503906%2045.585938%20333.882812%2045.859375%20334.292969%20C%2046.136719%20334.699219%2046.367188%20335.132812%2046.558594%20335.585938%20C%2046.746094%20336.039062%2046.890625%20336.507812%2046.988281%20336.992188%20C%2047.085938%20337.472656%2047.136719%20337.960938%2047.136719%20338.453125%20L%2047.382812%20413.453125%20C%2047.386719%20413.945312%2047.339844%20414.433594%2047.242188%20414.917969%20C%2047.148438%20415.402344%2047.007812%20415.871094%2046.820312%20416.324219%20C%2046.636719%20416.78125%2046.40625%20417.214844%2046.132812%20417.625%20C%2045.859375%20418.035156%2045.550781%20418.414062%2045.203125%20418.765625%20C%2044.855469%20419.113281%2044.480469%20419.425781%2044.070312%20419.699219%20C%2043.660156%20419.976562%2043.230469%20420.207031%2042.777344%20420.398438%20C%2042.320312%20420.585938%2041.851562%20420.730469%2041.371094%20420.828125%20C%2040.886719%20420.925781%2040.402344%20420.976562%2039.90625%20420.976562%20C%2039.414062%20420.980469%2038.925781%20420.933594%2038.445312%20420.839844%20C%2037.960938%20420.746094%2037.492188%20420.605469%2037.035156%20420.417969%20C%2036.582031%20420.230469%2036.148438%20420%2035.738281%20419.726562%20C%2035.328125%20419.457031%2034.945312%20419.144531%2034.597656%20418.796875%20C%2034.25%20418.453125%2033.9375%20418.074219%2033.660156%20417.664062%20C%2033.386719%20417.257812%2033.152344%20416.824219%2032.964844%20416.371094%20C%2032.773438%20415.917969%2032.628906%20415.449219%2032.53125%20414.964844%20C%2032.433594%20414.484375%2032.386719%20413.996094%2032.382812%20413.503906%20Z%20M%2032.039062%20308.503906%20L%2031.792969%20233.503906%20C%2031.792969%20233.011719%2031.839844%20232.523438%2031.933594%20232.039062%20C%2032.027344%20231.558594%2032.167969%20231.085938%2032.355469%20230.632812%20C%2032.542969%20230.175781%2032.773438%20229.742188%2033.042969%20229.332031%20C%2033.316406%20228.921875%2033.625%20228.542969%2033.972656%20228.191406%20C%2034.320312%20227.84375%2034.699219%20227.53125%2035.105469%20227.257812%20C%2035.515625%20226.980469%2035.945312%20226.75%2036.402344%20226.558594%20C%2036.855469%20226.371094%2037.324219%20226.226562%2037.808594%20226.128906%20C%2038.289062%20226.03125%2038.777344%20225.980469%2039.269531%20225.980469%20C%2039.761719%20225.976562%2040.25%20226.023438%2040.734375%20226.117188%20C%2041.214844%20226.214844%2041.6875%20226.355469%2042.140625%20226.539062%20C%2042.597656%20226.726562%2043.03125%20226.957031%2043.441406%20227.230469%20C%2043.851562%20227.5%2044.230469%20227.8125%2044.582031%20228.160156%20C%2044.929688%20228.503906%2045.242188%20228.882812%2045.515625%20229.292969%20C%2045.792969%20229.699219%2046.023438%20230.132812%2046.214844%20230.585938%20C%2046.402344%20231.039062%2046.546875%20231.507812%2046.644531%20231.992188%20C%2046.742188%20232.472656%2046.792969%20232.960938%2046.792969%20233.453125%20L%2047.039062%20308.453125%20C%2047.042969%20308.945312%2046.996094%20309.433594%2046.898438%20309.917969%20C%2046.804688%20310.402344%2046.664062%20310.871094%2046.476562%20311.324219%20C%2046.292969%20311.78125%2046.0625%20312.214844%2045.789062%20312.625%20C%2045.515625%20313.035156%2045.207031%20313.414062%2044.859375%20313.765625%20C%2044.511719%20314.113281%2044.136719%20314.425781%2043.726562%20314.699219%20C%2043.316406%20314.976562%2042.886719%20315.207031%2042.433594%20315.398438%20C%2041.976562%20315.589844%2041.507812%20315.730469%2041.027344%20315.828125%20C%2040.542969%20315.925781%2040.058594%20315.976562%2039.5625%20315.980469%20C%2039.070312%20315.980469%2038.582031%20315.933594%2038.101562%20315.839844%20C%2037.617188%20315.746094%2037.148438%20315.605469%2036.691406%20315.417969%20C%2036.238281%20315.230469%2035.804688%20315%2035.394531%20314.726562%20C%2034.984375%20314.457031%2034.601562%20314.144531%2034.253906%20313.800781%20C%2033.90625%20313.453125%2033.59375%20313.074219%2033.316406%20312.664062%20C%2033.042969%20312.257812%2032.808594%20311.824219%2032.621094%20311.371094%20C%2032.429688%20310.917969%2032.285156%20310.449219%2032.1875%20309.964844%20C%2032.089844%20309.484375%2032.042969%20308.996094%2032.039062%20308.503906%20Z%20M%2031.695312%20203.503906%20L%2031.449219%20128.503906%20C%2031.449219%20128.011719%2031.496094%20127.523438%2031.589844%20127.039062%20C%2031.683594%20126.558594%2031.824219%20126.085938%2032.011719%20125.632812%20C%2032.199219%20125.175781%2032.429688%20124.742188%2032.699219%20124.332031%20C%2032.972656%20123.921875%2033.28125%20123.542969%2033.628906%20123.195312%20C%2033.976562%20122.84375%2034.355469%20122.53125%2034.761719%20122.257812%20C%2035.171875%20121.984375%2035.601562%20121.75%2036.058594%20121.558594%20C%2036.511719%20121.371094%2036.980469%20121.226562%2037.464844%20121.128906%20C%2037.945312%20121.03125%2038.433594%20120.980469%2038.925781%20120.980469%20C%2039.417969%20120.976562%2039.90625%20121.023438%2040.390625%20121.117188%20C%2040.871094%20121.214844%2041.34375%20121.355469%2041.796875%20121.542969%20C%2042.253906%20121.726562%2042.6875%20121.957031%2043.097656%20122.230469%20C%2043.507812%20122.503906%2043.886719%20122.8125%2044.238281%20123.160156%20C%2044.585938%20123.507812%2044.898438%20123.882812%2045.171875%20124.292969%20C%2045.449219%20124.699219%2045.679688%20125.132812%2045.871094%20125.585938%20C%2046.058594%20126.042969%2046.203125%20126.507812%2046.300781%20126.992188%20C%2046.398438%20127.476562%2046.449219%20127.960938%2046.449219%20128.457031%20L%2046.695312%20203.453125%20C%2046.699219%20203.945312%2046.652344%20204.433594%2046.554688%20204.917969%20C%2046.460938%20205.402344%2046.320312%20205.871094%2046.132812%20206.328125%20C%2045.949219%20206.78125%2045.71875%20207.214844%2045.445312%20207.625%20C%2045.171875%20208.035156%2044.863281%20208.414062%2044.515625%20208.765625%20C%2044.167969%20209.113281%2043.792969%20209.425781%2043.382812%20209.703125%20C%2042.972656%20209.976562%2042.542969%20210.210938%2042.089844%20210.398438%20C%2041.632812%20210.589844%2041.164062%20210.734375%2040.683594%20210.832031%20C%2040.199219%20210.929688%2039.714844%20210.976562%2039.21875%20210.980469%20C%2038.726562%20210.980469%2038.238281%20210.933594%2037.757812%20210.839844%20C%2037.273438%20210.746094%2036.804688%20210.605469%2036.347656%20210.417969%20C%2035.894531%20210.230469%2035.460938%20210%2035.050781%20209.730469%20C%2034.640625%20209.457031%2034.257812%20209.148438%2033.910156%20208.800781%20C%2033.5625%20208.453125%2033.25%20208.074219%2032.972656%20207.667969%20C%2032.699219%20207.257812%2032.464844%20206.828125%2032.277344%20206.371094%20C%2032.085938%20205.917969%2031.941406%20205.449219%2031.84375%20204.964844%20C%2031.746094%20204.484375%2031.699219%20203.996094%2031.695312%20203.503906%20Z%20M%2031.351562%2098.503906%20L%2031.199219%2051.871094%20C%2031.199219%2051.378906%2031.246094%2050.890625%2031.339844%2050.410156%20C%2031.433594%2049.925781%2031.574219%2049.457031%2031.761719%2049%20C%2031.949219%2048.542969%2032.175781%2048.113281%2032.449219%2047.703125%20C%2032.722656%2047.289062%2033.03125%2046.910156%2033.378906%2046.5625%20C%2033.726562%2046.210938%2034.105469%2045.898438%2034.511719%2045.625%20C%2034.921875%2045.351562%2035.351562%2045.117188%2035.808594%2044.929688%20C%2036.261719%2044.738281%2036.730469%2044.59375%2037.210938%2044.496094%20C%2037.695312%2044.398438%2038.183594%2044.347656%2038.675781%2044.347656%20C%2039.167969%2044.347656%2039.65625%2044.390625%2040.136719%2044.488281%20C%2040.621094%2044.582031%2041.089844%2044.722656%2041.546875%2044.910156%20C%2042.003906%2045.097656%2042.4375%2045.324219%2042.847656%2045.597656%20C%2043.257812%2045.871094%2043.636719%2046.179688%2043.984375%2046.527344%20C%2044.335938%2046.875%2044.648438%2047.25%2044.921875%2047.660156%20C%2045.195312%2048.070312%2045.429688%2048.5%2045.621094%2048.953125%20C%2045.808594%2049.410156%2045.953125%2049.878906%2046.050781%2050.359375%20C%2046.148438%2050.84375%2046.199219%2051.332031%2046.199219%2051.824219%20L%2046.351562%2098.457031%20C%2046.355469%2098.949219%2046.308594%2099.4375%2046.210938%2099.917969%20C%2046.117188%20100.402344%2045.976562%20100.871094%2045.789062%20101.328125%20C%2045.605469%20101.78125%2045.375%20102.214844%2045.101562%20102.625%20C%2044.828125%20103.035156%2044.519531%20103.417969%2044.171875%20103.765625%20C%2043.824219%20104.113281%2043.449219%20104.425781%2043.039062%20104.703125%20C%2042.628906%20104.976562%2042.199219%20105.210938%2041.746094%20105.398438%20C%2041.289062%20105.589844%2040.820312%20105.734375%2040.339844%20105.832031%20C%2039.855469%20105.929688%2039.371094%20105.976562%2038.875%20105.980469%20C%2038.382812%20105.980469%2037.894531%20105.933594%2037.414062%20105.839844%20C%2036.929688%20105.746094%2036.460938%20105.605469%2036.003906%20105.417969%20C%2035.550781%20105.230469%2035.117188%20105%2034.707031%20104.730469%20C%2034.296875%20104.457031%2033.914062%20104.148438%2033.566406%20103.800781%20C%2033.21875%20103.453125%2032.90625%20103.074219%2032.628906%20102.667969%20C%2032.355469%20102.257812%2032.121094%20101.828125%2031.933594%20101.371094%20C%2031.742188%20100.917969%2031.597656%20100.449219%2031.5%2099.96875%20C%2031.402344%2099.484375%2031.355469%2098.996094%2031.351562%2098.503906%20Z%20M%2031.351562%2098.503906%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%20623.148438%2051.847656%20L%20548.148438%2051.847656%20C%20547.65625%2051.847656%20547.167969%2051.800781%20546.6875%2051.707031%20C%20546.203125%2051.609375%20545.734375%2051.46875%20545.28125%2051.277344%20C%20544.824219%2051.089844%20544.390625%2050.859375%20543.984375%2050.585938%20C%20543.574219%2050.3125%20543.195312%2050%20542.847656%2049.652344%20C%20542.496094%2049.304688%20542.1875%2048.925781%20541.914062%2048.515625%20C%20541.640625%2048.105469%20541.410156%2047.675781%20541.21875%2047.21875%20C%20541.03125%2046.765625%20540.890625%2046.296875%20540.792969%2045.8125%20C%20540.699219%2045.328125%20540.648438%2044.84375%20540.648438%2044.347656%20C%20540.648438%2043.855469%20540.699219%2043.371094%20540.792969%2042.886719%20C%20540.890625%2042.402344%20541.03125%2041.933594%20541.21875%2041.480469%20C%20541.410156%2041.023438%20541.640625%2040.59375%20541.914062%2040.183594%20C%20542.1875%2039.773438%20542.496094%2039.394531%20542.847656%2039.046875%20C%20543.195312%2038.699219%20543.574219%2038.386719%20543.984375%2038.113281%20C%20544.390625%2037.839844%20544.824219%2037.609375%20545.28125%2037.421875%20C%20545.734375%2037.230469%20546.203125%2037.089844%20546.6875%2036.992188%20C%20547.167969%2036.898438%20547.65625%2036.847656%20548.148438%2036.847656%20L%20623.148438%2036.847656%20C%20623.640625%2036.847656%20624.128906%2036.898438%20624.613281%2036.992188%20C%20625.09375%2037.089844%20625.566406%2037.230469%20626.019531%2037.421875%20C%20626.472656%2037.609375%20626.90625%2037.839844%20627.316406%2038.113281%20C%20627.726562%2038.386719%20628.105469%2038.699219%20628.453125%2039.046875%20C%20628.800781%2039.394531%20629.113281%2039.773438%20629.386719%2040.183594%20C%20629.660156%2040.59375%20629.890625%2041.023438%20630.078125%2041.480469%20C%20630.265625%2041.933594%20630.410156%2042.402344%20630.503906%2042.886719%20C%20630.601562%2043.371094%20630.648438%2043.855469%20630.648438%2044.347656%20C%20630.648438%2044.84375%20630.601562%2045.328125%20630.503906%2045.8125%20C%20630.410156%2046.296875%20630.265625%2046.765625%20630.078125%2047.21875%20C%20629.890625%2047.675781%20629.660156%2048.105469%20629.386719%2048.515625%20C%20629.113281%2048.925781%20628.800781%2049.304688%20628.453125%2049.652344%20C%20628.105469%2050%20627.726562%2050.3125%20627.316406%2050.585938%20C%20626.90625%2050.859375%20626.472656%2051.089844%20626.019531%2051.277344%20C%20625.566406%2051.46875%20625.09375%2051.609375%20624.613281%2051.707031%20C%20624.128906%2051.800781%20623.640625%2051.847656%20623.148438%2051.847656%20Z%20M%20518.148438%2051.847656%20L%20443.148438%2051.847656%20C%20442.65625%2051.847656%20442.167969%2051.800781%20441.6875%2051.707031%20C%20441.203125%2051.609375%20440.734375%2051.46875%20440.28125%2051.277344%20C%20439.824219%2051.089844%20439.390625%2050.859375%20438.984375%2050.585938%20C%20438.574219%2050.3125%20438.195312%2050%20437.847656%2049.652344%20C%20437.496094%2049.304688%20437.1875%2048.925781%20436.914062%2048.515625%20C%20436.640625%2048.105469%20436.410156%2047.675781%20436.21875%2047.21875%20C%20436.03125%2046.765625%20435.890625%2046.296875%20435.792969%2045.8125%20C%20435.699219%2045.328125%20435.648438%2044.84375%20435.648438%2044.347656%20C%20435.648438%2043.855469%20435.699219%2043.371094%20435.792969%2042.886719%20C%20435.890625%2042.402344%20436.03125%2041.933594%20436.21875%2041.480469%20C%20436.410156%2041.023438%20436.640625%2040.59375%20436.914062%2040.183594%20C%20437.1875%2039.773438%20437.496094%2039.394531%20437.847656%2039.046875%20C%20438.195312%2038.699219%20438.574219%2038.386719%20438.984375%2038.113281%20C%20439.390625%2037.839844%20439.824219%2037.609375%20440.28125%2037.421875%20C%20440.734375%2037.230469%20441.203125%2037.089844%20441.6875%2036.992188%20C%20442.167969%2036.898438%20442.65625%2036.847656%20443.148438%2036.847656%20L%20518.148438%2036.847656%20C%20518.640625%2036.847656%20519.128906%2036.898438%20519.613281%2036.992188%20C%20520.09375%2037.089844%20520.566406%2037.230469%20521.019531%2037.421875%20C%20521.472656%2037.609375%20521.90625%2037.839844%20522.316406%2038.113281%20C%20522.726562%2038.386719%20523.105469%2038.699219%20523.453125%2039.046875%20C%20523.800781%2039.394531%20524.113281%2039.773438%20524.386719%2040.183594%20C%20524.660156%2040.59375%20524.890625%2041.023438%20525.078125%2041.480469%20C%20525.265625%2041.933594%20525.410156%2042.402344%20525.503906%2042.886719%20C%20525.601562%2043.371094%20525.648438%2043.855469%20525.648438%2044.347656%20C%20525.648438%2044.84375%20525.601562%2045.328125%20525.503906%2045.8125%20C%20525.410156%2046.296875%20525.265625%2046.765625%20525.078125%2047.21875%20C%20524.890625%2047.675781%20524.660156%2048.105469%20524.386719%2048.515625%20C%20524.113281%2048.925781%20523.800781%2049.304688%20523.453125%2049.652344%20C%20523.105469%2050%20522.726562%2050.3125%20522.316406%2050.585938%20C%20521.90625%2050.859375%20521.472656%2051.089844%20521.019531%2051.277344%20C%20520.566406%2051.46875%20520.09375%2051.609375%20519.613281%2051.707031%20C%20519.128906%2051.800781%20518.640625%2051.847656%20518.148438%2051.847656%20Z%20M%20413.148438%2051.847656%20L%20338.148438%2051.847656%20C%20337.65625%2051.847656%20337.167969%2051.800781%20336.6875%2051.707031%20C%20336.203125%2051.609375%20335.734375%2051.46875%20335.28125%2051.277344%20C%20334.824219%2051.089844%20334.390625%2050.859375%20333.984375%2050.585938%20C%20333.574219%2050.3125%20333.195312%2050%20332.847656%2049.652344%20C%20332.496094%2049.304688%20332.1875%2048.925781%20331.914062%2048.515625%20C%20331.640625%2048.105469%20331.410156%2047.675781%20331.21875%2047.21875%20C%20331.03125%2046.765625%20330.890625%2046.296875%20330.792969%2045.8125%20C%20330.699219%2045.328125%20330.648438%2044.84375%20330.648438%2044.347656%20C%20330.648438%2043.855469%20330.699219%2043.371094%20330.792969%2042.886719%20C%20330.890625%2042.402344%20331.03125%2041.933594%20331.21875%2041.480469%20C%20331.410156%2041.023438%20331.640625%2040.59375%20331.914062%2040.183594%20C%20332.1875%2039.773438%20332.496094%2039.394531%20332.847656%2039.046875%20C%20333.195312%2038.699219%20333.574219%2038.386719%20333.984375%2038.113281%20C%20334.390625%2037.839844%20334.824219%2037.609375%20335.28125%2037.421875%20C%20335.734375%2037.230469%20336.203125%2037.089844%20336.6875%2036.992188%20C%20337.167969%2036.898438%20337.65625%2036.847656%20338.148438%2036.847656%20L%20413.148438%2036.847656%20C%20413.640625%2036.847656%20414.128906%2036.898438%20414.613281%2036.992188%20C%20415.09375%2037.089844%20415.566406%2037.230469%20416.019531%2037.421875%20C%20416.472656%2037.609375%20416.90625%2037.839844%20417.316406%2038.113281%20C%20417.726562%2038.386719%20418.105469%2038.699219%20418.453125%2039.046875%20C%20418.800781%2039.394531%20419.113281%2039.773438%20419.386719%2040.183594%20C%20419.660156%2040.59375%20419.890625%2041.023438%20420.078125%2041.480469%20C%20420.265625%2041.933594%20420.410156%2042.402344%20420.503906%2042.886719%20C%20420.601562%2043.371094%20420.648438%2043.855469%20420.648438%2044.347656%20C%20420.648438%2044.84375%20420.601562%2045.328125%20420.503906%2045.8125%20C%20420.410156%2046.296875%20420.265625%2046.765625%20420.078125%2047.21875%20C%20419.890625%2047.675781%20419.660156%2048.105469%20419.386719%2048.515625%20C%20419.113281%2048.925781%20418.800781%2049.304688%20418.453125%2049.652344%20C%20418.105469%2050%20417.726562%2050.3125%20417.316406%2050.585938%20C%20416.90625%2050.859375%20416.472656%2051.089844%20416.019531%2051.277344%20C%20415.566406%2051.46875%20415.09375%2051.609375%20414.613281%2051.707031%20C%20414.128906%2051.800781%20413.640625%2051.847656%20413.148438%2051.847656%20Z%20M%20308.148438%2051.847656%20L%20233.148438%2051.847656%20C%20232.65625%2051.847656%20232.167969%2051.800781%20231.6875%2051.707031%20C%20231.203125%2051.609375%20230.734375%2051.46875%20230.28125%2051.277344%20C%20229.824219%2051.089844%20229.390625%2050.859375%20228.984375%2050.585938%20C%20228.574219%2050.3125%20228.195312%2050%20227.847656%2049.652344%20C%20227.496094%2049.304688%20227.1875%2048.925781%20226.914062%2048.515625%20C%20226.640625%2048.105469%20226.410156%2047.675781%20226.21875%2047.21875%20C%20226.03125%2046.765625%20225.890625%2046.296875%20225.792969%2045.8125%20C%20225.699219%2045.328125%20225.648438%2044.84375%20225.648438%2044.347656%20C%20225.648438%2043.855469%20225.699219%2043.371094%20225.792969%2042.886719%20C%20225.890625%2042.402344%20226.03125%2041.933594%20226.21875%2041.480469%20C%20226.410156%2041.023438%20226.640625%2040.59375%20226.914062%2040.183594%20C%20227.1875%2039.773438%20227.496094%2039.394531%20227.847656%2039.046875%20C%20228.195312%2038.699219%20228.574219%2038.386719%20228.984375%2038.113281%20C%20229.390625%2037.839844%20229.824219%2037.609375%20230.28125%2037.421875%20C%20230.734375%2037.230469%20231.203125%2037.089844%20231.6875%2036.992188%20C%20232.167969%2036.898438%20232.65625%2036.847656%20233.148438%2036.847656%20L%20308.148438%2036.847656%20C%20308.640625%2036.847656%20309.128906%2036.898438%20309.613281%2036.992188%20C%20310.09375%2037.089844%20310.566406%2037.230469%20311.019531%2037.421875%20C%20311.472656%2037.609375%20311.90625%2037.839844%20312.316406%2038.113281%20C%20312.726562%2038.386719%20313.105469%2038.699219%20313.453125%2039.046875%20C%20313.800781%2039.394531%20314.113281%2039.773438%20314.386719%2040.183594%20C%20314.660156%2040.59375%20314.890625%2041.023438%20315.078125%2041.480469%20C%20315.265625%2041.933594%20315.410156%2042.402344%20315.503906%2042.886719%20C%20315.601562%2043.371094%20315.648438%2043.855469%20315.648438%2044.347656%20C%20315.648438%2044.84375%20315.601562%2045.328125%20315.503906%2045.8125%20C%20315.410156%2046.296875%20315.265625%2046.765625%20315.078125%2047.21875%20C%20314.890625%2047.675781%20314.660156%2048.105469%20314.386719%2048.515625%20C%20314.113281%2048.925781%20313.800781%2049.304688%20313.453125%2049.652344%20C%20313.105469%2050%20312.726562%2050.3125%20312.316406%2050.585938%20C%20311.90625%2050.859375%20311.472656%2051.089844%20311.019531%2051.277344%20C%20310.566406%2051.46875%20310.09375%2051.609375%20309.613281%2051.707031%20C%20309.128906%2051.800781%20308.640625%2051.847656%20308.148438%2051.847656%20Z%20M%20203.148438%2051.847656%20L%20128.148438%2051.847656%20C%20127.65625%2051.847656%20127.167969%2051.800781%20126.6875%2051.707031%20C%20126.203125%2051.609375%20125.734375%2051.46875%20125.28125%2051.277344%20C%20124.824219%2051.089844%20124.390625%2050.859375%20123.984375%2050.585938%20C%20123.574219%2050.3125%20123.195312%2050%20122.847656%2049.652344%20C%20122.5%2049.304688%20122.1875%2048.925781%20121.914062%2048.515625%20C%20121.640625%2048.105469%20121.410156%2047.675781%20121.21875%2047.21875%20C%20121.03125%2046.765625%20120.890625%2046.296875%20120.792969%2045.8125%20C%20120.699219%2045.328125%20120.648438%2044.84375%20120.648438%2044.347656%20C%20120.648438%2043.855469%20120.699219%2043.371094%20120.792969%2042.886719%20C%20120.890625%2042.402344%20121.03125%2041.933594%20121.21875%2041.480469%20C%20121.410156%2041.023438%20121.640625%2040.59375%20121.914062%2040.183594%20C%20122.1875%2039.773438%20122.5%2039.394531%20122.847656%2039.046875%20C%20123.195312%2038.699219%20123.574219%2038.386719%20123.984375%2038.113281%20C%20124.390625%2037.839844%20124.824219%2037.609375%20125.28125%2037.421875%20C%20125.734375%2037.230469%20126.203125%2037.089844%20126.6875%2036.992188%20C%20127.167969%2036.898438%20127.65625%2036.847656%20128.148438%2036.847656%20L%20203.148438%2036.847656%20C%20203.640625%2036.847656%20204.128906%2036.898438%20204.613281%2036.992188%20C%20205.09375%2037.089844%20205.566406%2037.230469%20206.019531%2037.421875%20C%20206.476562%2037.609375%20206.90625%2037.839844%20207.316406%2038.113281%20C%20207.726562%2038.386719%20208.105469%2038.699219%20208.453125%2039.046875%20C%20208.800781%2039.394531%20209.113281%2039.773438%20209.386719%2040.183594%20C%20209.660156%2040.59375%20209.890625%2041.023438%20210.078125%2041.480469%20C%20210.265625%2041.933594%20210.410156%2042.402344%20210.503906%2042.886719%20C%20210.601562%2043.371094%20210.648438%2043.855469%20210.648438%2044.347656%20C%20210.648438%2044.84375%20210.601562%2045.328125%20210.503906%2045.8125%20C%20210.410156%2046.296875%20210.265625%2046.765625%20210.078125%2047.21875%20C%20209.890625%2047.675781%20209.660156%2048.105469%20209.386719%2048.515625%20C%20209.113281%2048.925781%20208.800781%2049.304688%20208.453125%2049.652344%20C%20208.105469%2050%20207.726562%2050.3125%20207.316406%2050.585938%20C%20206.90625%2050.859375%20206.476562%2051.089844%20206.019531%2051.277344%20C%20205.566406%2051.46875%20205.09375%2051.609375%20204.613281%2051.707031%20C%20204.128906%2051.800781%20203.640625%2051.847656%20203.148438%2051.847656%20Z%20M%2098.148438%2051.847656%20L%2046.167969%2051.847656%20C%2045.675781%2051.847656%2045.1875%2051.800781%2044.707031%2051.707031%20C%2044.222656%2051.609375%2043.753906%2051.46875%2043.300781%2051.277344%20C%2042.84375%2051.089844%2042.414062%2050.859375%2042.003906%2050.585938%20C%2041.59375%2050.3125%2041.214844%2050%2040.867188%2049.652344%20C%2040.519531%2049.304688%2040.207031%2048.925781%2039.933594%2048.515625%20C%2039.660156%2048.105469%2039.429688%2047.675781%2039.242188%2047.21875%20C%2039.050781%2046.765625%2038.910156%2046.296875%2038.8125%2045.8125%20C%2038.71875%2045.328125%2038.667969%2044.84375%2038.667969%2044.347656%20C%2038.667969%2043.855469%2038.71875%2043.371094%2038.8125%2042.886719%20C%2038.910156%2042.402344%2039.050781%2041.933594%2039.242188%2041.480469%20C%2039.429688%2041.023438%2039.660156%2040.59375%2039.933594%2040.183594%20C%2040.207031%2039.773438%2040.519531%2039.394531%2040.867188%2039.046875%20C%2041.214844%2038.699219%2041.59375%2038.386719%2042.003906%2038.113281%20C%2042.414062%2037.839844%2042.84375%2037.609375%2043.300781%2037.421875%20C%2043.753906%2037.230469%2044.222656%2037.089844%2044.707031%2036.992188%20C%2045.1875%2036.898438%2045.675781%2036.847656%2046.167969%2036.847656%20L%2098.148438%2036.847656%20C%2098.640625%2036.847656%2099.128906%2036.898438%2099.613281%2036.992188%20C%20100.09375%2037.089844%20100.566406%2037.230469%20101.019531%2037.421875%20C%20101.476562%2037.609375%20101.90625%2037.839844%20102.316406%2038.113281%20C%20102.726562%2038.386719%20103.105469%2038.699219%20103.453125%2039.046875%20C%20103.800781%2039.394531%20104.113281%2039.773438%20104.386719%2040.183594%20C%20104.660156%2040.59375%20104.890625%2041.023438%20105.078125%2041.480469%20C%20105.265625%2041.933594%20105.410156%2042.402344%20105.503906%2042.886719%20C%20105.601562%2043.371094%20105.648438%2043.855469%20105.648438%2044.347656%20C%20105.648438%2044.84375%20105.601562%2045.328125%20105.503906%2045.8125%20C%20105.410156%2046.296875%20105.265625%2046.765625%20105.078125%2047.21875%20C%20104.890625%2047.675781%20104.660156%2048.105469%20104.386719%2048.515625%20C%20104.113281%2048.925781%20103.800781%2049.304688%20103.453125%2049.652344%20C%20103.105469%2050%20102.726562%2050.3125%20102.316406%2050.585938%20C%20101.90625%2050.859375%20101.476562%2051.089844%20101.019531%2051.277344%20C%20100.566406%2051.46875%20100.09375%2051.609375%2099.613281%2051.707031%20C%2099.128906%2051.800781%2098.640625%2051.847656%2098.148438%2051.847656%20Z%20M%2098.148438%2051.847656%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%20638.152344%2051.855469%20L%20638.152344%20126.855469%20C%20638.152344%20127.347656%20638.105469%20127.835938%20638.007812%20128.316406%20C%20637.910156%20128.800781%20637.769531%20129.269531%20637.582031%20129.722656%20C%20637.390625%20130.179688%20637.160156%20130.613281%20636.886719%20131.019531%20C%20636.613281%20131.429688%20636.304688%20131.808594%20635.953125%20132.15625%20C%20635.605469%20132.507812%20635.226562%20132.816406%20634.820312%20133.089844%20C%20634.410156%20133.363281%20633.976562%20133.59375%20633.523438%20133.785156%20C%20633.066406%20133.972656%20632.597656%20134.113281%20632.113281%20134.210938%20C%20631.632812%20134.304688%20631.144531%20134.355469%20630.652344%20134.355469%20C%20630.160156%20134.355469%20629.671875%20134.304688%20629.1875%20134.210938%20C%20628.707031%20134.113281%20628.238281%20133.972656%20627.78125%20133.785156%20C%20627.328125%20133.59375%20626.894531%20133.363281%20626.484375%20133.089844%20C%20626.074219%20132.816406%20625.695312%20132.507812%20625.347656%20132.15625%20C%20625%20131.808594%20624.6875%20131.429688%20624.414062%20131.019531%20C%20624.140625%20130.613281%20623.910156%20130.179688%20623.722656%20129.722656%20C%20623.535156%20129.269531%20623.390625%20128.800781%20623.296875%20128.316406%20C%20623.199219%20127.835938%20623.152344%20127.347656%20623.152344%20126.855469%20L%20623.152344%2051.855469%20C%20623.152344%2051.363281%20623.199219%2050.875%20623.296875%2050.390625%20C%20623.390625%2049.910156%20623.535156%2049.4375%20623.722656%2048.984375%20C%20623.910156%2048.53125%20624.140625%2048.097656%20624.414062%2047.6875%20C%20624.6875%2047.277344%20625%2046.898438%20625.347656%2046.550781%20C%20625.695312%2046.203125%20626.074219%2045.890625%20626.484375%2045.617188%20C%20626.894531%2045.34375%20627.328125%2045.113281%20627.78125%2044.925781%20C%20628.238281%2044.738281%20628.707031%2044.59375%20629.1875%2044.5%20C%20629.671875%2044.402344%20630.160156%2044.355469%20630.652344%2044.355469%20C%20631.144531%2044.355469%20631.632812%2044.402344%20632.113281%2044.5%20C%20632.597656%2044.59375%20633.066406%2044.738281%20633.523438%2044.925781%20C%20633.976562%2045.113281%20634.410156%2045.34375%20634.820312%2045.617188%20C%20635.226562%2045.890625%20635.605469%2046.203125%20635.953125%2046.550781%20C%20636.304688%2046.898438%20636.613281%2047.277344%20636.886719%2047.6875%20C%20637.160156%2048.097656%20637.390625%2048.53125%20637.582031%2048.984375%20C%20637.769531%2049.4375%20637.910156%2049.910156%20638.007812%2050.390625%20C%20638.105469%2050.875%20638.152344%2051.363281%20638.152344%2051.855469%20Z%20M%20638.152344%20156.855469%20L%20638.152344%20231.855469%20C%20638.152344%20232.347656%20638.105469%20232.835938%20638.007812%20233.316406%20C%20637.910156%20233.800781%20637.769531%20234.269531%20637.582031%20234.722656%20C%20637.390625%20235.179688%20637.160156%20235.613281%20636.886719%20236.019531%20C%20636.613281%20236.429688%20636.304688%20236.808594%20635.953125%20237.15625%20C%20635.605469%20237.507812%20635.226562%20237.816406%20634.820312%20238.089844%20C%20634.410156%20238.363281%20633.976562%20238.59375%20633.523438%20238.785156%20C%20633.066406%20238.972656%20632.597656%20239.113281%20632.113281%20239.210938%20C%20631.632812%20239.304688%20631.144531%20239.355469%20630.652344%20239.355469%20C%20630.160156%20239.355469%20629.671875%20239.304688%20629.1875%20239.210938%20C%20628.707031%20239.113281%20628.238281%20238.972656%20627.78125%20238.785156%20C%20627.328125%20238.59375%20626.894531%20238.363281%20626.484375%20238.089844%20C%20626.074219%20237.816406%20625.695312%20237.507812%20625.347656%20237.15625%20C%20625%20236.808594%20624.6875%20236.429688%20624.414062%20236.019531%20C%20624.140625%20235.613281%20623.910156%20235.179688%20623.722656%20234.722656%20C%20623.535156%20234.269531%20623.390625%20233.800781%20623.296875%20233.316406%20C%20623.199219%20232.835938%20623.152344%20232.347656%20623.152344%20231.855469%20L%20623.152344%20156.855469%20C%20623.152344%20156.363281%20623.199219%20155.875%20623.296875%20155.390625%20C%20623.390625%20154.910156%20623.535156%20154.4375%20623.722656%20153.984375%20C%20623.910156%20153.53125%20624.140625%20153.097656%20624.414062%20152.6875%20C%20624.6875%20152.277344%20625%20151.898438%20625.347656%20151.550781%20C%20625.695312%20151.203125%20626.074219%20150.890625%20626.484375%20150.617188%20C%20626.894531%20150.34375%20627.328125%20150.113281%20627.78125%20149.925781%20C%20628.238281%20149.738281%20628.707031%20149.59375%20629.1875%20149.5%20C%20629.671875%20149.402344%20630.160156%20149.355469%20630.652344%20149.355469%20C%20631.144531%20149.355469%20631.632812%20149.402344%20632.113281%20149.5%20C%20632.597656%20149.59375%20633.066406%20149.738281%20633.523438%20149.925781%20C%20633.976562%20150.113281%20634.410156%20150.34375%20634.820312%20150.617188%20C%20635.226562%20150.890625%20635.605469%20151.203125%20635.953125%20151.550781%20C%20636.304688%20151.898438%20636.613281%20152.277344%20636.886719%20152.6875%20C%20637.160156%20153.097656%20637.390625%20153.53125%20637.582031%20153.984375%20C%20637.769531%20154.4375%20637.910156%20154.910156%20638.007812%20155.390625%20C%20638.105469%20155.875%20638.152344%20156.363281%20638.152344%20156.855469%20Z%20M%20638.152344%20261.855469%20L%20638.152344%20336.855469%20C%20638.152344%20337.347656%20638.105469%20337.835938%20638.007812%20338.316406%20C%20637.910156%20338.800781%20637.769531%20339.269531%20637.582031%20339.722656%20C%20637.390625%20340.179688%20637.160156%20340.613281%20636.886719%20341.019531%20C%20636.613281%20341.429688%20636.304688%20341.808594%20635.953125%20342.15625%20C%20635.605469%20342.507812%20635.226562%20342.816406%20634.820312%20343.089844%20C%20634.410156%20343.363281%20633.976562%20343.59375%20633.523438%20343.785156%20C%20633.066406%20343.972656%20632.597656%20344.113281%20632.113281%20344.210938%20C%20631.632812%20344.304688%20631.144531%20344.355469%20630.652344%20344.355469%20C%20630.160156%20344.355469%20629.671875%20344.304688%20629.1875%20344.210938%20C%20628.707031%20344.113281%20628.238281%20343.972656%20627.78125%20343.785156%20C%20627.328125%20343.59375%20626.894531%20343.363281%20626.484375%20343.089844%20C%20626.074219%20342.816406%20625.695312%20342.507812%20625.347656%20342.15625%20C%20625%20341.808594%20624.6875%20341.429688%20624.414062%20341.019531%20C%20624.140625%20340.613281%20623.910156%20340.179688%20623.722656%20339.722656%20C%20623.535156%20339.269531%20623.390625%20338.800781%20623.296875%20338.316406%20C%20623.199219%20337.835938%20623.152344%20337.347656%20623.152344%20336.855469%20L%20623.152344%20261.855469%20C%20623.152344%20261.363281%20623.199219%20260.875%20623.296875%20260.390625%20C%20623.390625%20259.910156%20623.535156%20259.4375%20623.722656%20258.984375%20C%20623.910156%20258.53125%20624.140625%20258.097656%20624.414062%20257.6875%20C%20624.6875%20257.277344%20625%20256.898438%20625.347656%20256.550781%20C%20625.695312%20256.203125%20626.074219%20255.890625%20626.484375%20255.617188%20C%20626.894531%20255.34375%20627.328125%20255.113281%20627.78125%20254.925781%20C%20628.238281%20254.738281%20628.707031%20254.59375%20629.1875%20254.5%20C%20629.671875%20254.402344%20630.160156%20254.355469%20630.652344%20254.355469%20C%20631.144531%20254.355469%20631.632812%20254.402344%20632.113281%20254.5%20C%20632.597656%20254.59375%20633.066406%20254.738281%20633.523438%20254.925781%20C%20633.976562%20255.113281%20634.410156%20255.34375%20634.820312%20255.617188%20C%20635.226562%20255.890625%20635.605469%20256.203125%20635.953125%20256.550781%20C%20636.304688%20256.898438%20636.613281%20257.277344%20636.886719%20257.6875%20C%20637.160156%20258.097656%20637.390625%20258.53125%20637.582031%20258.984375%20C%20637.769531%20259.4375%20637.910156%20259.910156%20638.007812%20260.390625%20C%20638.105469%20260.875%20638.152344%20261.363281%20638.152344%20261.855469%20Z%20M%20638.152344%20366.855469%20L%20638.152344%20441.855469%20C%20638.152344%20442.347656%20638.105469%20442.835938%20638.007812%20443.316406%20C%20637.910156%20443.800781%20637.769531%20444.269531%20637.582031%20444.722656%20C%20637.390625%20445.179688%20637.160156%20445.613281%20636.886719%20446.019531%20C%20636.613281%20446.429688%20636.304688%20446.808594%20635.953125%20447.15625%20C%20635.605469%20447.507812%20635.226562%20447.816406%20634.820312%20448.089844%20C%20634.410156%20448.363281%20633.976562%20448.59375%20633.523438%20448.785156%20C%20633.066406%20448.972656%20632.597656%20449.113281%20632.113281%20449.210938%20C%20631.632812%20449.304688%20631.144531%20449.355469%20630.652344%20449.355469%20C%20630.160156%20449.355469%20629.671875%20449.304688%20629.1875%20449.210938%20C%20628.707031%20449.113281%20628.238281%20448.972656%20627.78125%20448.785156%20C%20627.328125%20448.59375%20626.894531%20448.363281%20626.484375%20448.089844%20C%20626.074219%20447.816406%20625.695312%20447.507812%20625.347656%20447.15625%20C%20625%20446.808594%20624.6875%20446.429688%20624.414062%20446.019531%20C%20624.140625%20445.613281%20623.910156%20445.179688%20623.722656%20444.722656%20C%20623.535156%20444.269531%20623.390625%20443.800781%20623.296875%20443.316406%20C%20623.199219%20442.835938%20623.152344%20442.347656%20623.152344%20441.855469%20L%20623.152344%20366.855469%20C%20623.152344%20366.363281%20623.199219%20365.875%20623.296875%20365.390625%20C%20623.390625%20364.910156%20623.535156%20364.4375%20623.722656%20363.984375%20C%20623.910156%20363.53125%20624.140625%20363.097656%20624.414062%20362.6875%20C%20624.6875%20362.277344%20625%20361.898438%20625.347656%20361.550781%20C%20625.695312%20361.203125%20626.074219%20360.890625%20626.484375%20360.617188%20C%20626.894531%20360.34375%20627.328125%20360.113281%20627.78125%20359.925781%20C%20628.238281%20359.738281%20628.707031%20359.59375%20629.1875%20359.5%20C%20629.671875%20359.402344%20630.160156%20359.355469%20630.652344%20359.355469%20C%20631.144531%20359.355469%20631.632812%20359.402344%20632.113281%20359.5%20C%20632.597656%20359.59375%20633.066406%20359.738281%20633.523438%20359.925781%20C%20633.976562%20360.113281%20634.410156%20360.34375%20634.820312%20360.617188%20C%20635.226562%20360.890625%20635.605469%20361.203125%20635.953125%20361.550781%20C%20636.304688%20361.898438%20636.613281%20362.277344%20636.886719%20362.6875%20C%20637.160156%20363.097656%20637.390625%20363.53125%20637.582031%20363.984375%20C%20637.769531%20364.4375%20637.910156%20364.910156%20638.007812%20365.390625%20C%20638.105469%20365.875%20638.152344%20366.363281%20638.152344%20366.855469%20Z%20M%20638.152344%20366.855469%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cg%20clip-path='url(%2390f2c5cffd)'%3e%3cg%20clip-path='url(%234bf9681d98)'%3e%3cpath%20stroke-linecap='butt'%20transform='matrix(0.75,%200,%200,%200.75,%20474.443356,%20466.234509)'%20fill='none'%20stroke-linejoin='miter'%20d='M%20156.0547%20-0.000179038%20C%2069.867196%20-0.000179038%20-0.00259904%2069.869616%20-0.00259904%20156.05712%20C%20-0.00259904%20242.239416%2069.867196%20312.109211%20156.0547%20312.109211%20C%20242.242204%20312.109211%20312.106791%20242.239416%20312.106791%20156.05712%20C%20312.106791%2069.869616%20242.242204%20-0.000179038%20156.0547%20-0.000179038%20Z%20M%20156.0547%20-0.000179038%20'%20stroke='%23FFFFFF'%20stroke-width='44'%20stroke-opacity='1'%20stroke-miterlimit='4'/%3e%3c/g%3e%3c/g%3e%3cpath%20stroke-linecap='round'%20transform='matrix(-0.75,%200,%200,%20-0.75,%20749.989598,%20591.906207)'%20fill='none'%20stroke-linejoin='miter'%20d='M%2011.501756%2011.499943%20L%20124.012179%2011.499943%20'%20stroke='%23FFFFFF'%20stroke-width='23'%20stroke-opacity='1'%20stroke-miterlimit='4'/%3e%3cpath%20stroke-linecap='round'%20transform='matrix(0,%20-0.75,%200.75,%200,%20582.859606,%20532.542354)'%20fill='none'%20stroke-linejoin='miter'%20d='M%2011.499181%2011.499692%20L%20132.202312%2011.499692%20'%20stroke='%23FFFFFF'%20stroke-width='23'%20stroke-opacity='1'%20stroke-miterlimit='4'/%3e%3cpath%20stroke-linecap='round'%20transform='matrix(-0.75,%200,%200,%20-0.75,%20533.667625,%20591.906207)'%20fill='none'%20stroke-linejoin='miter'%20d='M%2011.499542%2011.499943%20L%20122.759964%2011.499943%20'%20stroke='%23FFFFFF'%20stroke-width='23'%20stroke-opacity='1'%20stroke-miterlimit='4'/%3e%3cpath%20stroke-linecap='round'%20transform='matrix(0,%20-0.75,%200.75,%200,%20582.862654,%20741.78872)'%20fill='none'%20stroke-linejoin='miter'%20d='M%2011.499544%2011.500837%20L%20126.551633%2011.500837%20'%20stroke='%23FFFFFF'%20stroke-width='23'%20stroke-opacity='1'%20stroke-miterlimit='4'/%3e%3c/svg%3e", E6 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3csvg%20viewBox='0%200%201000%201000'%20version='1.1'%20id='svg141'%20sodipodi:docname='remesh.svg'%20inkscape:version='1.1.2%20(0a00cf5339,%202022-02-04)'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3cdefs%20id='defs145'%20/%3e%3csodipodi:namedview%20id='namedview143'%20pagecolor='%23505050'%20bordercolor='%23eeeeee'%20borderopacity='1'%20inkscape:pageshadow='0'%20inkscape:pageopacity='0'%20inkscape:pagecheckerboard='0'%20showgrid='false'%20inkscape:zoom='0.3905'%20inkscape:cx='-300.89629'%20inkscape:cy='236.8758'%20inkscape:window-width='1920'%20inkscape:window-height='964'%20inkscape:window-x='0'%20inkscape:window-y='0'%20inkscape:window-maximized='1'%20inkscape:current-layer='svg141'%20/%3e%3c!--%20Circular%20Arrow%20(Thinner%20&%20Elegant)%20--%3e%3cg%20fill='none'%20stroke='%23ffffff'%20stroke-width='70'%20stroke-linecap='round'%20id='g103'%20transform='matrix(1.2778718,0,0,1.2778718,-140.86288,-125.12462)'%3e%3cpath%20d='M%20850,500%20A%20350,350%200%201%201%20780,280'%20id='path101'%20/%3e%3c/g%3e%3c!--%20Sharp%20Arrowhead%20--%3e%3cg%20transform='matrix(1.2584581,-0.2219001,0.2219001,1.2584581,887.0142,226.05286)'%20id='g107'%3e%3cpath%20d='M%2016.623652,-69.96958%2011.299083,98.80668%20-114.63484,-13.685223%20Z'%20fill='%23ffffff'%20stroke-linejoin='round'%20id='path105'%20style='stroke-width:1.02012'%20/%3e%3c/g%3e%3c!--%20Isometric%20Cube%20(Correct%20Proportions)%20--%3e%3c!--%20Center:%20(500,%20500)%20--%3e%3c!--%20Vertices:%20T(500,%20200),%20TR(760,%20350),%20BR(760,%20650),%20B(500,%20800),%20BL(240,%20650),%20TL(240,%20350)%20--%3e%3cg%20fill='%23ffffff'%20stroke='%23000000'%20stroke-width='18'%20stroke-linejoin='round'%20stroke-linecap='round'%20id='g139'%20transform='matrix(1.2076003,0,0,1.2076003,-104.71929,-97.775922)'%3e%3c!--%20Top%20Face%20--%3e%3cpath%20d='M%20500,200%20760,350%20500,500%20240,350%20Z'%20id='path109'%20/%3e%3cline%20x1='500'%20y1='200'%20x2='500'%20y2='500'%20id='line111'%20/%3e%3cline%20x1='240'%20y1='350'%20x2='760'%20y2='350'%20id='line113'%20/%3e%3cline%20x1='370'%20y1='275'%20x2='630'%20y2='425'%20id='line115'%20/%3e%3cline%20x1='630'%20y1='275'%20x2='370'%20y2='425'%20id='line117'%20/%3e%3c!--%20Right%20Face%20--%3e%3cpath%20d='M%20500,500%20760,350%20V%20650%20L%20500,800%20Z'%20id='path119'%20/%3e%3cline%20x1='760'%20y1='350'%20x2='500'%20y2='800'%20id='line121'%20/%3e%3cline%20x1='500'%20y1='500'%20x2='760'%20y2='650'%20id='line123'%20/%3e%3cline%20x1='630'%20y1='425'%20x2='630'%20y2='725'%20id='line125'%20/%3e%3cline%20x1='760'%20y1='500'%20x2='500'%20y2='650'%20id='line127'%20/%3e%3c!--%20Left%20Face%20--%3e%3cpath%20d='M%20500,500%20240,350%20v%20300%20l%20260,150%20z'%20id='path129'%20/%3e%3cline%20x1='240'%20y1='350'%20x2='500'%20y2='800'%20id='line131'%20/%3e%3cline%20x1='500'%20y1='500'%20x2='240'%20y2='650'%20id='line133'%20/%3e%3cline%20x1='370'%20y1='425'%20x2='370'%20y2='725'%20id='line135'%20/%3e%3cline%20x1='240'%20y1='500'%20x2='500'%20y2='650'%20id='line137'%20/%3e%3c/g%3e%3c/svg%3e", A6 = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20xmlns:dc='http://purl.org/dc/elements/1.1/'%20xmlns:cc='http://creativecommons.org/ns%23'%20xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23'%20xmlns:svg='http://www.w3.org/2000/svg'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20width='18.141853mm'%20height='18.141851mm'%20viewBox='0%200%2064.282157%2064.282151'%20id='svg2'%20version='1.1'%20inkscape:version='0.92.3%20(2405546,%202018-03-11)'%20sodipodi:docname='model.svg'%3e%3csodipodi:namedview%20id='base'%20pagecolor='%23ffffff'%20bordercolor='%23666666'%20borderopacity='1.0'%20inkscape:pageopacity='0.0'%20inkscape:pageshadow='2'%20inkscape:zoom='1'%20inkscape:cx='-11.727746'%20inkscape:cy='237.02384'%20inkscape:document-units='px'%20inkscape:current-layer='layer1'%20showgrid='false'%20inkscape:window-width='1853'%20inkscape:window-height='1025'%20inkscape:window-x='67'%20inkscape:window-y='27'%20inkscape:window-maximized='1'%20fit-margin-top='0'%20fit-margin-left='0'%20fit-margin-right='0'%20fit-margin-bottom='0'%20/%3e%3cdefs%20id='defs4'%20/%3e%3cmetadata%20id='metadata7'%3e%3crdf:RDF%3e%3ccc:Work%20rdf:about=''%3e%3cdc:format%3eimage/svg+xml%3c/dc:format%3e%3cdc:type%20rdf:resource='http://purl.org/dc/dcmitype/StillImage'%20/%3e%3cdc:title%3e%3c/dc:title%3e%3c/cc:Work%3e%3c/rdf:RDF%3e%3c/metadata%3e%3cg%20id='layer1'%20inkscape:groupmode='layer'%20inkscape:label='Calque%201'%20transform='translate(-150.0732,-1105.2926)'%3e%3cg%20transform='matrix(1.0162645,0.18864628,-0.01050876,0.9820451,11.286293,-16.179033)'%20id='g4557'%3e%3cpath%20sodipodi:nodetypes='ccccc'%20inkscape:connector-curvature='0'%20id='path4474'%20d='m%20166.45128,1121.5698%20-10.76135,18.9265%20c%2020.82651,-13.244%2019.79873,13.6594%2039.13799,-0.2679%20l%209.42856,-19.4231%20c%20-19.01679,9.4089%20-19.93162,-9.9818%20-37.8052,0.7645%20z'%20style='color:%23000000;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:%23000000;solid-opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:%23000000;stroke-width:4.24248075;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate'%20/%3e%3cpath%20style='color:%23000000;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:%23000000;solid-opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:%23000000;stroke-width:4.24248075;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate'%20d='m%20155.68993,1158.4249%20c%2020.82651,-13.244%2019.79873,13.3915%2039.13799,-0.5357%20l%209.42856,-20.8696'%20id='path4532'%20inkscape:connector-curvature='0'%20sodipodi:nodetypes='ccc'%20/%3e%3cpath%20style='color:%23000000;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:%23000000;solid-opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:%23000000;stroke-width:4.24248075;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate'%20d='m%20155.68993,1140.4963%20v%2017.9286'%20id='path4534'%20inkscape:connector-curvature='0'%20sodipodi:nodetypes='cc'%20/%3e%3cpath%20style='color:%23000000;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:%23000000;solid-opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:%23000000;stroke-width:4.24248075;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate'%20d='m%20204.25648,1120.8053%20v%2016.2143'%20id='path4536'%20inkscape:connector-curvature='0'%20sodipodi:nodetypes='cc'%20/%3e%3cpath%20style='color:%23000000;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:%23000000;solid-opacity:1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:%23000000;stroke-width:4.24248075;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate'%20d='m%20194.82792,1140.2284%20v%2017.6608'%20id='path4538'%20inkscape:connector-curvature='0'%20sodipodi:nodetypes='cc'%20/%3e%3c/g%3e%3c/g%3e%3c/svg%3e", $6 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20width='1000'%20zoomAndPan='magnify'%20viewBox='0%200%20750%20749.999995'%20height='1000'%20preserveAspectRatio='xMidYMid%20meet'%20version='1.0'%3e%3cdefs%3e%3cclipPath%20id='3999f56c05'%3e%3cpath%20d='M%20364.507812%20522.804688%20L%20536.925781%20522.804688%20L%20536.925781%20695.222656%20L%20364.507812%20695.222656%20Z%20M%20364.507812%20522.804688%20'%20clip-rule='nonzero'/%3e%3c/clipPath%3e%3cclipPath%20id='3dd2ef3fdd'%3e%3cpath%20d='M%20450.714844%20522.804688%20C%20403.105469%20522.804688%20364.507812%20561.398438%20364.507812%20609.011719%20C%20364.507812%20656.625%20403.105469%20695.222656%20450.714844%20695.222656%20C%20498.328125%20695.222656%20536.925781%20656.625%20536.925781%20609.011719%20C%20536.925781%20561.398438%20498.328125%20522.804688%20450.714844%20522.804688%20Z%20M%20450.714844%20522.804688%20'%20clip-rule='nonzero'/%3e%3c/clipPath%3e%3c/defs%3e%3cpath%20fill='%23FFFFFF'%20d='M%20476.285156%20197.066406%20L%20476.285156%20257.066406%20C%20476.285156%20257.460938%20476.246094%20257.847656%20476.167969%20258.234375%20C%20476.09375%20258.621094%20475.976562%20258.996094%20475.828125%20259.359375%20C%20475.675781%20259.726562%20475.492188%20260.070312%20475.273438%20260.398438%20C%20475.054688%20260.726562%20474.804688%20261.027344%20474.527344%20261.308594%20C%20474.25%20261.585938%20473.945312%20261.835938%20473.617188%20262.054688%20C%20473.289062%20262.273438%20472.945312%20262.457031%20472.582031%20262.609375%20C%20472.214844%20262.757812%20471.839844%20262.871094%20471.453125%20262.949219%20C%20471.070312%20263.027344%20470.679688%20263.066406%20470.285156%20263.066406%20C%20469.890625%20263.066406%20469.5%20263.027344%20469.113281%20262.949219%20C%20468.726562%20262.871094%20468.351562%20262.757812%20467.988281%20262.609375%20C%20467.625%20262.457031%20467.277344%20262.273438%20466.949219%20262.054688%20C%20466.625%20261.835938%20466.320312%20261.585938%20466.042969%20261.308594%20C%20465.761719%20261.027344%20465.515625%20260.726562%20465.296875%20260.398438%20C%20465.078125%20260.070312%20464.890625%20259.726562%20464.742188%20259.359375%20C%20464.589844%20258.996094%20464.476562%20258.621094%20464.398438%20258.234375%20C%20464.324219%20257.847656%20464.285156%20257.460938%20464.285156%20257.066406%20L%20464.285156%20197.066406%20C%20464.285156%20196.671875%20464.324219%20196.28125%20464.398438%20195.894531%20C%20464.476562%20195.507812%20464.589844%20195.132812%20464.742188%20194.769531%20C%20464.890625%20194.40625%20465.078125%20194.058594%20465.296875%20193.730469%20C%20465.515625%20193.402344%20465.761719%20193.101562%20466.042969%20192.824219%20C%20466.320312%20192.542969%20466.625%20192.296875%20466.949219%20192.078125%20C%20467.277344%20191.855469%20467.625%20191.671875%20467.988281%20191.523438%20C%20468.351562%20191.371094%20468.726562%20191.257812%20469.113281%20191.179688%20C%20469.5%20191.101562%20469.890625%20191.066406%20470.285156%20191.066406%20C%20470.679688%20191.066406%20471.070312%20191.101562%20471.453125%20191.179688%20C%20471.839844%20191.257812%20472.214844%20191.371094%20472.582031%20191.523438%20C%20472.945312%20191.671875%20473.289062%20191.855469%20473.617188%20192.078125%20C%20473.945312%20192.296875%20474.25%20192.542969%20474.527344%20192.824219%20C%20474.804688%20193.101562%20475.054688%20193.402344%20475.273438%20193.730469%20C%20475.492188%20194.058594%20475.675781%20194.40625%20475.828125%20194.769531%20C%20475.976562%20195.132812%20476.09375%20195.507812%20476.167969%20195.894531%20C%20476.246094%20196.28125%20476.285156%20196.671875%20476.285156%20197.066406%20Z%20M%20476.285156%20281.066406%20L%20476.285156%20341.066406%20C%20476.285156%20341.457031%20476.246094%20341.847656%20476.167969%20342.234375%20C%20476.09375%20342.621094%20475.976562%20342.996094%20475.828125%20343.359375%20C%20475.675781%20343.726562%20475.492188%20344.070312%20475.273438%20344.398438%20C%20475.054688%20344.726562%20474.804688%20345.027344%20474.527344%20345.308594%20C%20474.25%20345.585938%20473.945312%20345.835938%20473.617188%20346.054688%20C%20473.289062%20346.273438%20472.945312%20346.457031%20472.582031%20346.609375%20C%20472.214844%20346.757812%20471.839844%20346.871094%20471.453125%20346.949219%20C%20471.070312%20347.027344%20470.679688%20347.066406%20470.285156%20347.066406%20C%20469.890625%20347.066406%20469.5%20347.027344%20469.113281%20346.949219%20C%20468.726562%20346.871094%20468.351562%20346.757812%20467.988281%20346.609375%20C%20467.625%20346.457031%20467.277344%20346.273438%20466.949219%20346.054688%20C%20466.625%20345.835938%20466.320312%20345.585938%20466.042969%20345.308594%20C%20465.761719%20345.027344%20465.515625%20344.726562%20465.296875%20344.398438%20C%20465.078125%20344.070312%20464.890625%20343.726562%20464.742188%20343.359375%20C%20464.589844%20342.996094%20464.476562%20342.621094%20464.398438%20342.234375%20C%20464.324219%20341.847656%20464.285156%20341.457031%20464.285156%20341.066406%20L%20464.285156%20281.066406%20C%20464.285156%20280.671875%20464.324219%20280.28125%20464.398438%20279.894531%20C%20464.476562%20279.507812%20464.589844%20279.132812%20464.742188%20278.769531%20C%20464.890625%20278.40625%20465.078125%20278.058594%20465.296875%20277.730469%20C%20465.515625%20277.402344%20465.761719%20277.101562%20466.042969%20276.824219%20C%20466.320312%20276.542969%20466.625%20276.296875%20466.949219%20276.078125%20C%20467.277344%20275.855469%20467.625%20275.671875%20467.988281%20275.523438%20C%20468.351562%20275.371094%20468.726562%20275.257812%20469.113281%20275.179688%20C%20469.5%20275.101562%20469.890625%20275.066406%20470.285156%20275.066406%20C%20470.679688%20275.066406%20471.070312%20275.101562%20471.453125%20275.179688%20C%20471.839844%20275.257812%20472.214844%20275.371094%20472.582031%20275.523438%20C%20472.945312%20275.671875%20473.289062%20275.855469%20473.617188%20276.078125%20C%20473.945312%20276.296875%20474.25%20276.542969%20474.527344%20276.824219%20C%20474.804688%20277.101562%20475.054688%20277.402344%20475.273438%20277.730469%20C%20475.492188%20278.058594%20475.675781%20278.40625%20475.828125%20278.769531%20C%20475.976562%20279.132812%20476.09375%20279.507812%20476.167969%20279.894531%20C%20476.246094%20280.28125%20476.285156%20280.671875%20476.285156%20281.066406%20Z%20M%20476.285156%20365.066406%20L%20476.285156%20425.066406%20C%20476.285156%20425.457031%20476.246094%20425.847656%20476.167969%20426.234375%20C%20476.09375%20426.621094%20475.976562%20426.996094%20475.828125%20427.359375%20C%20475.675781%20427.726562%20475.492188%20428.070312%20475.273438%20428.398438%20C%20475.054688%20428.726562%20474.804688%20429.027344%20474.527344%20429.308594%20C%20474.25%20429.585938%20473.945312%20429.835938%20473.617188%20430.054688%20C%20473.289062%20430.273438%20472.945312%20430.457031%20472.582031%20430.609375%20C%20472.214844%20430.757812%20471.839844%20430.871094%20471.453125%20430.949219%20C%20471.070312%20431.027344%20470.679688%20431.066406%20470.285156%20431.066406%20C%20469.890625%20431.066406%20469.5%20431.027344%20469.113281%20430.949219%20C%20468.726562%20430.871094%20468.351562%20430.757812%20467.988281%20430.609375%20C%20467.625%20430.457031%20467.277344%20430.273438%20466.949219%20430.054688%20C%20466.625%20429.835938%20466.320312%20429.585938%20466.042969%20429.308594%20C%20465.761719%20429.027344%20465.515625%20428.726562%20465.296875%20428.398438%20C%20465.078125%20428.070312%20464.890625%20427.726562%20464.742188%20427.359375%20C%20464.589844%20426.996094%20464.476562%20426.621094%20464.398438%20426.234375%20C%20464.324219%20425.847656%20464.285156%20425.457031%20464.285156%20425.066406%20L%20464.285156%20365.066406%20C%20464.285156%20364.671875%20464.324219%20364.28125%20464.398438%20363.894531%20C%20464.476562%20363.507812%20464.589844%20363.132812%20464.742188%20362.769531%20C%20464.890625%20362.40625%20465.078125%20362.058594%20465.296875%20361.730469%20C%20465.515625%20361.402344%20465.761719%20361.101562%20466.042969%20360.824219%20C%20466.320312%20360.542969%20466.625%20360.296875%20466.949219%20360.078125%20C%20467.277344%20359.855469%20467.625%20359.671875%20467.988281%20359.523438%20C%20468.351562%20359.371094%20468.726562%20359.257812%20469.113281%20359.179688%20C%20469.5%20359.101562%20469.890625%20359.066406%20470.285156%20359.066406%20C%20470.679688%20359.066406%20471.070312%20359.101562%20471.453125%20359.179688%20C%20471.839844%20359.257812%20472.214844%20359.371094%20472.582031%20359.523438%20C%20472.945312%20359.671875%20473.289062%20359.855469%20473.617188%20360.078125%20C%20473.945312%20360.296875%20474.25%20360.542969%20474.527344%20360.824219%20C%20474.804688%20361.101562%20475.054688%20361.402344%20475.273438%20361.730469%20C%20475.492188%20362.058594%20475.675781%20362.40625%20475.828125%20362.769531%20C%20475.976562%20363.132812%20476.09375%20363.507812%20476.167969%20363.894531%20C%20476.246094%20364.28125%20476.285156%20364.671875%20476.285156%20365.066406%20Z%20M%20476.285156%20449.066406%20L%20476.285156%20509.066406%20C%20476.285156%20509.457031%20476.246094%20509.847656%20476.167969%20510.234375%20C%20476.09375%20510.621094%20475.976562%20510.996094%20475.828125%20511.359375%20C%20475.675781%20511.726562%20475.492188%20512.070312%20475.273438%20512.398438%20C%20475.054688%20512.726562%20474.804688%20513.027344%20474.527344%20513.308594%20C%20474.25%20513.585938%20473.945312%20513.835938%20473.617188%20514.054688%20C%20473.289062%20514.273438%20472.945312%20514.457031%20472.582031%20514.609375%20C%20472.214844%20514.757812%20471.839844%20514.871094%20471.453125%20514.949219%20C%20471.070312%20515.027344%20470.679688%20515.066406%20470.285156%20515.066406%20C%20469.890625%20515.066406%20469.5%20515.027344%20469.113281%20514.949219%20C%20468.726562%20514.871094%20468.351562%20514.757812%20467.988281%20514.609375%20C%20467.625%20514.457031%20467.277344%20514.273438%20466.949219%20514.054688%20C%20466.625%20513.835938%20466.320312%20513.585938%20466.042969%20513.308594%20C%20465.761719%20513.027344%20465.515625%20512.726562%20465.296875%20512.398438%20C%20465.078125%20512.070312%20464.890625%20511.726562%20464.742188%20511.359375%20C%20464.589844%20510.996094%20464.476562%20510.621094%20464.398438%20510.234375%20C%20464.324219%20509.847656%20464.285156%20509.457031%20464.285156%20509.066406%20L%20464.285156%20449.066406%20C%20464.285156%20448.671875%20464.324219%20448.28125%20464.398438%20447.894531%20C%20464.476562%20447.507812%20464.589844%20447.132812%20464.742188%20446.769531%20C%20464.890625%20446.40625%20465.078125%20446.058594%20465.296875%20445.730469%20C%20465.515625%20445.402344%20465.761719%20445.101562%20466.042969%20444.824219%20C%20466.320312%20444.542969%20466.625%20444.296875%20466.949219%20444.078125%20C%20467.277344%20443.855469%20467.625%20443.671875%20467.988281%20443.523438%20C%20468.351562%20443.371094%20468.726562%20443.257812%20469.113281%20443.179688%20C%20469.5%20443.101562%20469.890625%20443.066406%20470.285156%20443.066406%20C%20470.679688%20443.066406%20471.070312%20443.101562%20471.453125%20443.179688%20C%20471.839844%20443.257812%20472.214844%20443.371094%20472.582031%20443.523438%20C%20472.945312%20443.671875%20473.289062%20443.855469%20473.617188%20444.078125%20C%20473.945312%20444.296875%20474.25%20444.542969%20474.527344%20444.824219%20C%20474.804688%20445.101562%20475.054688%20445.402344%20475.273438%20445.730469%20C%20475.492188%20446.058594%20475.675781%20446.40625%20475.828125%20446.769531%20C%20475.976562%20447.132812%20476.09375%20447.507812%20476.167969%20447.894531%20C%20476.246094%20448.28125%20476.285156%20448.671875%20476.285156%20449.066406%20Z%20M%20476.285156%20449.066406%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%20654.71875%20473.570312%20L%20612.292969%20515.996094%20C%20612.015625%20516.277344%20611.710938%20516.523438%20611.382812%20516.746094%20C%20611.054688%20516.964844%20610.710938%20517.148438%20610.347656%20517.296875%20C%20609.980469%20517.449219%20609.605469%20517.5625%20609.21875%20517.640625%20C%20608.835938%20517.71875%20608.445312%20517.753906%20608.050781%20517.753906%20C%20607.65625%20517.753906%20607.265625%20517.71875%20606.878906%20517.640625%20C%20606.492188%20517.5625%20606.117188%20517.449219%20605.753906%20517.296875%20C%20605.390625%20517.148438%20605.042969%20516.964844%20604.714844%20516.746094%20C%20604.390625%20516.523438%20604.085938%20516.277344%20603.808594%20515.996094%20C%20603.527344%20515.71875%20603.28125%20515.417969%20603.0625%20515.089844%20C%20602.84375%20514.761719%20602.65625%20514.414062%20602.507812%20514.050781%20C%20602.355469%20513.6875%20602.242188%20513.3125%20602.164062%20512.925781%20C%20602.089844%20512.539062%20602.050781%20512.148438%20602.050781%20511.753906%20C%20602.050781%20511.363281%20602.089844%20510.972656%20602.164062%20510.585938%20C%20602.242188%20510.199219%20602.355469%20509.824219%20602.507812%20509.460938%20C%20602.65625%20509.09375%20602.84375%20508.75%20603.0625%20508.421875%20C%20603.28125%20508.09375%20603.527344%20507.792969%20603.808594%20507.511719%20L%20646.234375%20465.085938%20C%20646.511719%20464.808594%20646.816406%20464.558594%20647.144531%20464.339844%20C%20647.46875%20464.121094%20647.816406%20463.9375%20648.179688%20463.785156%20C%20648.542969%20463.636719%20648.917969%20463.519531%20649.304688%20463.445312%20C%20649.691406%20463.367188%20650.082031%20463.328125%20650.476562%20463.328125%20C%20650.871094%20463.328125%20651.261719%20463.367188%20651.648438%20463.445312%20C%20652.035156%20463.519531%20652.410156%20463.636719%20652.773438%20463.785156%20C%20653.136719%20463.9375%20653.480469%20464.121094%20653.808594%20464.339844%20C%20654.136719%20464.558594%20654.441406%20464.808594%20654.71875%20465.085938%20C%20654.996094%20465.363281%20655.246094%20465.667969%20655.464844%20465.996094%20C%20655.683594%20466.324219%20655.867188%20466.667969%20656.019531%20467.03125%20C%20656.171875%20467.398438%20656.285156%20467.773438%20656.359375%20468.160156%20C%20656.4375%20468.542969%20656.476562%20468.933594%20656.476562%20469.328125%20C%20656.476562%20469.722656%20656.4375%20470.113281%20656.359375%20470.5%20C%20656.285156%20470.886719%20656.171875%20471.261719%20656.019531%20471.625%20C%20655.867188%20471.988281%20655.683594%20472.335938%20655.464844%20472.664062%20C%20655.246094%20472.988281%20654.996094%20473.292969%20654.71875%20473.570312%20Z%20M%20595.320312%20532.96875%20L%20552.894531%20575.394531%20C%20552.617188%20575.671875%20552.3125%20575.921875%20551.988281%20576.140625%20C%20551.660156%20576.359375%20551.3125%20576.542969%20550.949219%20576.695312%20C%20550.585938%20576.847656%20550.210938%20576.960938%20549.824219%20577.035156%20C%20549.4375%20577.113281%20549.046875%20577.152344%20548.652344%20577.152344%20C%20548.257812%20577.152344%20547.867188%20577.113281%20547.484375%20577.035156%20C%20547.097656%20576.960938%20546.722656%20576.847656%20546.355469%20576.695312%20C%20545.992188%20576.542969%20545.648438%20576.359375%20545.320312%20576.140625%20C%20544.992188%20575.921875%20544.6875%20575.671875%20544.410156%20575.394531%20C%20544.132812%20575.117188%20543.882812%20574.8125%20543.664062%20574.484375%20C%20543.445312%20574.15625%20543.261719%20573.8125%20543.109375%20573.449219%20C%20542.960938%20573.085938%20542.84375%20572.710938%20542.769531%20572.324219%20C%20542.691406%20571.9375%20542.652344%20571.546875%20542.652344%20571.152344%20C%20542.652344%20570.757812%20542.691406%20570.367188%20542.769531%20569.980469%20C%20542.84375%20569.59375%20542.960938%20569.21875%20543.109375%20568.855469%20C%20543.261719%20568.492188%20543.445312%20568.144531%20543.664062%20567.820312%20C%20543.882812%20567.492188%20544.132812%20567.1875%20544.410156%20566.910156%20L%20586.835938%20524.484375%20C%20587.117188%20524.203125%20587.417969%20523.957031%20587.746094%20523.738281%20C%20588.074219%20523.519531%20588.417969%20523.332031%20588.785156%20523.183594%20C%20589.148438%20523.03125%20589.523438%20522.917969%20589.910156%20522.839844%20C%20590.296875%20522.765625%20590.6875%20522.726562%20591.078125%20522.726562%20C%20591.472656%20522.726562%20591.863281%20522.765625%20592.25%20522.839844%20C%20592.636719%20522.917969%20593.011719%20523.03125%20593.375%20523.183594%20C%20593.738281%20523.332031%20594.085938%20523.519531%20594.414062%20523.738281%20C%20594.742188%20523.957031%20595.042969%20524.203125%20595.320312%20524.484375%20C%20595.601562%20524.761719%20595.847656%20525.066406%20596.066406%20525.390625%20C%20596.289062%20525.71875%20596.472656%20526.066406%20596.621094%20526.429688%20C%20596.773438%20526.792969%20596.886719%20527.167969%20596.964844%20527.554688%20C%20597.042969%20527.941406%20597.078125%20528.332031%20597.078125%20528.726562%20C%20597.078125%20529.121094%20597.042969%20529.511719%20596.964844%20529.894531%20C%20596.886719%20530.28125%20596.773438%20530.65625%20596.621094%20531.023438%20C%20596.472656%20531.386719%20596.289062%20531.730469%20596.066406%20532.058594%20C%20595.847656%20532.386719%20595.601562%20532.691406%20595.320312%20532.96875%20Z%20M%20595.320312%20532.96875%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%2012%20643.519531%20L%2072%20643.519531%20C%2072.394531%20643.519531%2072.785156%20643.558594%2073.171875%20643.636719%20C%2073.558594%20643.710938%2073.933594%20643.828125%2074.296875%20643.976562%20C%2074.660156%20644.128906%2075.003906%20644.3125%2075.332031%20644.53125%20C%2075.660156%20644.75%2075.964844%20645%2076.242188%20645.277344%20C%2076.519531%20645.554688%2076.769531%20645.859375%2076.988281%20646.1875%20C%2077.207031%20646.515625%2077.390625%20646.859375%2077.542969%20647.222656%20C%2077.695312%20647.589844%2077.808594%20647.964844%2077.882812%20648.351562%20C%2077.960938%20648.738281%2078%20649.125%2078%20649.519531%20C%2078%20649.914062%2077.960938%20650.304688%2077.882812%20650.691406%20C%2077.808594%20651.078125%2077.695312%20651.453125%2077.542969%20651.816406%20C%2077.390625%20652.179688%2077.207031%20652.527344%2076.988281%20652.855469%20C%2076.769531%20653.179688%2076.519531%20653.484375%2076.242188%20653.761719%20C%2075.964844%20654.042969%2075.660156%20654.289062%2075.332031%20654.507812%20C%2075.003906%20654.726562%2074.660156%20654.914062%2074.296875%20655.0625%20C%2073.933594%20655.214844%2073.558594%20655.328125%2073.171875%20655.40625%20C%2072.785156%20655.480469%2072.394531%20655.519531%2072%20655.519531%20L%2012%20655.519531%20C%2011.605469%20655.519531%2011.214844%20655.480469%2010.828125%20655.40625%20C%2010.441406%20655.328125%2010.066406%20655.214844%209.703125%20655.0625%20C%209.339844%20654.914062%208.996094%20654.726562%208.667969%20654.507812%20C%208.339844%20654.289062%208.035156%20654.042969%207.757812%20653.761719%20C%207.480469%20653.484375%207.230469%20653.179688%207.011719%20652.855469%20C%206.792969%20652.527344%206.609375%20652.179688%206.457031%20651.816406%20C%206.304688%20651.453125%206.191406%20651.078125%206.117188%20650.691406%20C%206.039062%20650.304688%206%20649.914062%206%20649.519531%20C%206%20649.125%206.039062%20648.738281%206.117188%20648.351562%20C%206.191406%20647.964844%206.304688%20647.589844%206.457031%20647.222656%20C%206.609375%20646.859375%206.792969%20646.515625%207.011719%20646.1875%20C%207.230469%20645.859375%207.480469%20645.554688%207.757812%20645.277344%20C%208.035156%20645%208.339844%20644.75%208.667969%20644.53125%20C%208.996094%20644.3125%209.339844%20644.128906%209.703125%20643.976562%20C%2010.066406%20643.828125%2010.441406%20643.710938%2010.828125%20643.636719%20C%2011.214844%20643.558594%2011.605469%20643.519531%2012%20643.519531%20Z%20M%2096%20643.519531%20L%20156%20643.519531%20C%20156.394531%20643.519531%20156.785156%20643.558594%20157.171875%20643.636719%20C%20157.558594%20643.710938%20157.933594%20643.828125%20158.296875%20643.976562%20C%20158.660156%20644.128906%20159.003906%20644.3125%20159.332031%20644.53125%20C%20159.660156%20644.75%20159.964844%20645%20160.242188%20645.277344%20C%20160.519531%20645.554688%20160.769531%20645.859375%20160.988281%20646.1875%20C%20161.207031%20646.515625%20161.390625%20646.859375%20161.542969%20647.222656%20C%20161.695312%20647.589844%20161.808594%20647.964844%20161.882812%20648.351562%20C%20161.960938%20648.738281%20162%20649.125%20162%20649.519531%20C%20162%20649.914062%20161.960938%20650.304688%20161.882812%20650.691406%20C%20161.808594%20651.078125%20161.695312%20651.453125%20161.542969%20651.816406%20C%20161.390625%20652.179688%20161.207031%20652.527344%20160.988281%20652.855469%20C%20160.769531%20653.179688%20160.519531%20653.484375%20160.242188%20653.761719%20C%20159.964844%20654.042969%20159.660156%20654.289062%20159.332031%20654.507812%20C%20159.003906%20654.726562%20158.660156%20654.914062%20158.296875%20655.0625%20C%20157.933594%20655.214844%20157.558594%20655.328125%20157.171875%20655.40625%20C%20156.785156%20655.480469%20156.394531%20655.519531%20156%20655.519531%20L%2096%20655.519531%20C%2095.605469%20655.519531%2095.214844%20655.480469%2094.828125%20655.40625%20C%2094.441406%20655.328125%2094.066406%20655.214844%2093.703125%20655.0625%20C%2093.339844%20654.914062%2092.992188%20654.726562%2092.667969%20654.507812%20C%2092.339844%20654.289062%2092.035156%20654.042969%2091.757812%20653.761719%20C%2091.480469%20653.484375%2091.230469%20653.179688%2091.011719%20652.855469%20C%2090.792969%20652.527344%2090.609375%20652.179688%2090.457031%20651.816406%20C%2090.304688%20651.453125%2090.191406%20651.078125%2090.117188%20650.691406%20C%2090.039062%20650.304688%2090%20649.914062%2090%20649.519531%20C%2090%20649.125%2090.039062%20648.738281%2090.117188%20648.351562%20C%2090.191406%20647.964844%2090.304688%20647.589844%2090.457031%20647.222656%20C%2090.609375%20646.859375%2090.792969%20646.515625%2091.011719%20646.1875%20C%2091.230469%20645.859375%2091.480469%20645.554688%2091.757812%20645.277344%20C%2092.035156%20645%2092.339844%20644.75%2092.667969%20644.53125%20C%2092.992188%20644.3125%2093.339844%20644.128906%2093.703125%20643.976562%20C%2094.066406%20643.828125%2094.441406%20643.710938%2094.828125%20643.636719%20C%2095.214844%20643.558594%2095.605469%20643.519531%2096%20643.519531%20Z%20M%20180%20643.519531%20L%20240%20643.519531%20C%20240.394531%20643.519531%20240.785156%20643.558594%20241.171875%20643.636719%20C%20241.558594%20643.710938%20241.933594%20643.828125%20242.296875%20643.976562%20C%20242.660156%20644.128906%20243.003906%20644.3125%20243.332031%20644.53125%20C%20243.660156%20644.75%20243.964844%20645%20244.242188%20645.277344%20C%20244.519531%20645.554688%20244.769531%20645.859375%20244.988281%20646.1875%20C%20245.207031%20646.515625%20245.390625%20646.859375%20245.542969%20647.222656%20C%20245.695312%20647.589844%20245.808594%20647.964844%20245.882812%20648.351562%20C%20245.960938%20648.738281%20246%20649.125%20246%20649.519531%20C%20246%20649.914062%20245.960938%20650.304688%20245.882812%20650.691406%20C%20245.808594%20651.078125%20245.695312%20651.453125%20245.542969%20651.816406%20C%20245.390625%20652.179688%20245.207031%20652.527344%20244.988281%20652.855469%20C%20244.769531%20653.179688%20244.519531%20653.484375%20244.242188%20653.761719%20C%20243.964844%20654.042969%20243.660156%20654.289062%20243.332031%20654.507812%20C%20243.003906%20654.726562%20242.660156%20654.914062%20242.296875%20655.0625%20C%20241.933594%20655.214844%20241.558594%20655.328125%20241.171875%20655.40625%20C%20240.785156%20655.480469%20240.394531%20655.519531%20240%20655.519531%20L%20180%20655.519531%20C%20179.605469%20655.519531%20179.214844%20655.480469%20178.828125%20655.40625%20C%20178.441406%20655.328125%20178.066406%20655.214844%20177.703125%20655.0625%20C%20177.339844%20654.914062%20176.992188%20654.726562%20176.667969%20654.507812%20C%20176.339844%20654.289062%20176.035156%20654.042969%20175.757812%20653.761719%20C%20175.480469%20653.484375%20175.230469%20653.179688%20175.011719%20652.855469%20C%20174.792969%20652.527344%20174.609375%20652.179688%20174.457031%20651.816406%20C%20174.304688%20651.453125%20174.191406%20651.078125%20174.117188%20650.691406%20C%20174.039062%20650.304688%20174%20649.914062%20174%20649.519531%20C%20174%20649.125%20174.039062%20648.738281%20174.117188%20648.351562%20C%20174.191406%20647.964844%20174.304688%20647.589844%20174.457031%20647.222656%20C%20174.609375%20646.859375%20174.792969%20646.515625%20175.011719%20646.1875%20C%20175.230469%20645.859375%20175.480469%20645.554688%20175.757812%20645.277344%20C%20176.035156%20645%20176.339844%20644.75%20176.667969%20644.53125%20C%20176.992188%20644.3125%20177.339844%20644.128906%20177.703125%20643.976562%20C%20178.066406%20643.828125%20178.441406%20643.710938%20178.828125%20643.636719%20C%20179.214844%20643.558594%20179.605469%20643.519531%20180%20643.519531%20Z%20M%20264%20643.519531%20L%20324%20643.519531%20C%20324.394531%20643.519531%20324.785156%20643.558594%20325.171875%20643.636719%20C%20325.558594%20643.710938%20325.933594%20643.828125%20326.296875%20643.976562%20C%20326.660156%20644.128906%20327.003906%20644.3125%20327.332031%20644.53125%20C%20327.660156%20644.75%20327.964844%20645%20328.242188%20645.277344%20C%20328.519531%20645.554688%20328.769531%20645.859375%20328.988281%20646.1875%20C%20329.207031%20646.515625%20329.390625%20646.859375%20329.542969%20647.222656%20C%20329.695312%20647.589844%20329.808594%20647.964844%20329.882812%20648.351562%20C%20329.960938%20648.738281%20330%20649.125%20330%20649.519531%20C%20330%20649.914062%20329.960938%20650.304688%20329.882812%20650.691406%20C%20329.808594%20651.078125%20329.695312%20651.453125%20329.542969%20651.816406%20C%20329.390625%20652.179688%20329.207031%20652.527344%20328.988281%20652.855469%20C%20328.769531%20653.179688%20328.519531%20653.484375%20328.242188%20653.761719%20C%20327.964844%20654.042969%20327.660156%20654.289062%20327.332031%20654.507812%20C%20327.003906%20654.726562%20326.660156%20654.914062%20326.296875%20655.0625%20C%20325.933594%20655.214844%20325.558594%20655.328125%20325.171875%20655.40625%20C%20324.785156%20655.480469%20324.394531%20655.519531%20324%20655.519531%20L%20264%20655.519531%20C%20263.605469%20655.519531%20263.214844%20655.480469%20262.828125%20655.40625%20C%20262.441406%20655.328125%20262.066406%20655.214844%20261.703125%20655.0625%20C%20261.339844%20654.914062%20260.992188%20654.726562%20260.667969%20654.507812%20C%20260.339844%20654.289062%20260.035156%20654.042969%20259.757812%20653.761719%20C%20259.480469%20653.484375%20259.230469%20653.179688%20259.011719%20652.855469%20C%20258.792969%20652.527344%20258.609375%20652.179688%20258.457031%20651.816406%20C%20258.304688%20651.453125%20258.191406%20651.078125%20258.117188%20650.691406%20C%20258.039062%20650.304688%20258%20649.914062%20258%20649.519531%20C%20258%20649.125%20258.039062%20648.738281%20258.117188%20648.351562%20C%20258.191406%20647.964844%20258.304688%20647.589844%20258.457031%20647.222656%20C%20258.609375%20646.859375%20258.792969%20646.515625%20259.011719%20646.1875%20C%20259.230469%20645.859375%20259.480469%20645.554688%20259.757812%20645.277344%20C%20260.035156%20645%20260.339844%20644.75%20260.667969%20644.53125%20C%20260.992188%20644.3125%20261.339844%20644.128906%20261.703125%20643.976562%20C%20262.066406%20643.828125%20262.441406%20643.710938%20262.828125%20643.636719%20C%20263.214844%20643.558594%20263.605469%20643.519531%20264%20643.519531%20Z%20M%20348%20643.519531%20L%20358.507812%20643.519531%20C%20358.902344%20643.519531%20359.292969%20643.558594%20359.679688%20643.636719%20C%20360.066406%20643.710938%20360.441406%20643.828125%20360.804688%20643.976562%20C%20361.167969%20644.128906%20361.511719%20644.3125%20361.839844%20644.53125%20C%20362.167969%20644.75%20362.472656%20645%20362.75%20645.277344%20C%20363.027344%20645.554688%20363.277344%20645.859375%20363.496094%20646.1875%20C%20363.714844%20646.515625%20363.898438%20646.859375%20364.050781%20647.222656%20C%20364.203125%20647.589844%20364.316406%20647.964844%20364.390625%20648.351562%20C%20364.46875%20648.738281%20364.507812%20649.125%20364.507812%20649.519531%20C%20364.507812%20649.914062%20364.46875%20650.304688%20364.390625%20650.691406%20C%20364.316406%20651.078125%20364.203125%20651.453125%20364.050781%20651.816406%20C%20363.898438%20652.179688%20363.714844%20652.527344%20363.496094%20652.855469%20C%20363.277344%20653.179688%20363.027344%20653.484375%20362.75%20653.761719%20C%20362.472656%20654.042969%20362.167969%20654.289062%20361.839844%20654.507812%20C%20361.511719%20654.726562%20361.167969%20654.914062%20360.804688%20655.0625%20C%20360.441406%20655.214844%20360.066406%20655.328125%20359.679688%20655.40625%20C%20359.292969%20655.480469%20358.902344%20655.519531%20358.507812%20655.519531%20L%20348%20655.519531%20C%20347.605469%20655.519531%20347.214844%20655.480469%20346.828125%20655.40625%20C%20346.441406%20655.328125%20346.066406%20655.214844%20345.703125%20655.0625%20C%20345.339844%20654.914062%20344.992188%20654.726562%20344.667969%20654.507812%20C%20344.339844%20654.289062%20344.035156%20654.042969%20343.757812%20653.761719%20C%20343.480469%20653.484375%20343.230469%20653.179688%20343.011719%20652.855469%20C%20342.792969%20652.527344%20342.609375%20652.179688%20342.457031%20651.816406%20C%20342.304688%20651.453125%20342.191406%20651.078125%20342.117188%20650.691406%20C%20342.039062%20650.304688%20342%20649.914062%20342%20649.519531%20C%20342%20649.125%20342.039062%20648.738281%20342.113281%20648.351562%20C%20342.191406%20647.964844%20342.304688%20647.589844%20342.457031%20647.222656%20C%20342.609375%20646.859375%20342.792969%20646.515625%20343.011719%20646.1875%20C%20343.230469%20645.859375%20343.480469%20645.554688%20343.757812%20645.277344%20C%20344.035156%20645%20344.339844%20644.75%20344.667969%20644.53125%20C%20344.992188%20644.3125%20345.339844%20644.128906%20345.703125%20643.976562%20C%20346.066406%20643.828125%20346.441406%20643.710938%20346.828125%20643.636719%20C%20347.214844%20643.558594%20347.605469%20643.519531%20348%20643.519531%20Z%20M%20348%20643.519531%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%20-0.00390625%20643.515625%20L%20-0.00390625%20583.515625%20C%20-0.00390625%20583.121094%200.0351562%20582.730469%200.109375%20582.34375%20C%200.1875%20581.957031%200.300781%20581.582031%200.453125%20581.21875%20C%200.601562%20580.855469%200.789062%20580.507812%201.007812%20580.183594%20C%201.226562%20579.855469%201.472656%20579.550781%201.753906%20579.273438%20C%202.03125%20578.996094%202.332031%20578.746094%202.660156%20578.527344%20C%202.988281%20578.308594%203.335938%20578.121094%203.699219%20577.972656%20C%204.0625%20577.820312%204.4375%20577.707031%204.824219%20577.628906%20C%205.210938%20577.554688%205.601562%20577.515625%205.996094%20577.515625%20C%206.390625%20577.515625%206.777344%20577.554688%207.164062%20577.628906%20C%207.550781%20577.707031%207.925781%20577.820312%208.289062%20577.972656%20C%208.65625%20578.121094%209%20578.308594%209.328125%20578.527344%20C%209.65625%20578.746094%209.957031%20578.996094%2010.238281%20579.273438%20C%2010.515625%20579.550781%2010.765625%20579.855469%2010.984375%20580.183594%20C%2011.203125%20580.507812%2011.386719%20580.855469%2011.539062%20581.21875%20C%2011.6875%20581.582031%2011.804688%20581.957031%2011.878906%20582.34375%20C%2011.957031%20582.730469%2011.996094%20583.121094%2011.996094%20583.515625%20L%2011.996094%20643.515625%20C%2011.996094%20643.910156%2011.957031%20644.300781%2011.878906%20644.6875%20C%2011.804688%20645.074219%2011.6875%20645.449219%2011.539062%20645.8125%20C%2011.386719%20646.175781%2011.203125%20646.519531%2010.984375%20646.847656%20C%2010.765625%20647.175781%2010.515625%20647.480469%2010.238281%20647.757812%20C%209.957031%20648.035156%209.65625%20648.285156%209.328125%20648.503906%20C%209%20648.722656%208.65625%20648.90625%208.289062%20649.058594%20C%207.925781%20649.210938%207.550781%20649.324219%207.164062%20649.398438%20C%206.777344%20649.476562%206.390625%20649.515625%205.996094%20649.515625%20C%205.601562%20649.515625%205.210938%20649.476562%204.824219%20649.398438%20C%204.4375%20649.324219%204.0625%20649.210938%203.699219%20649.058594%20C%203.335938%20648.90625%202.988281%20648.722656%202.660156%20648.503906%20C%202.332031%20648.285156%202.03125%20648.035156%201.753906%20647.757812%20C%201.472656%20647.480469%201.226562%20647.175781%201.007812%20646.847656%20C%200.789062%20646.519531%200.601562%20646.175781%200.453125%20645.8125%20C%200.300781%20645.449219%200.1875%20645.074219%200.109375%20644.6875%20C%200.0351562%20644.300781%20-0.00390625%20643.910156%20-0.00390625%20643.515625%20Z%20M%20-0.00390625%20559.515625%20L%20-0.00390625%20499.515625%20C%20-0.00390625%20499.121094%200.0351562%20498.730469%200.109375%20498.34375%20C%200.1875%20497.957031%200.300781%20497.582031%200.453125%20497.21875%20C%200.601562%20496.855469%200.789062%20496.507812%201.007812%20496.183594%20C%201.226562%20495.855469%201.472656%20495.550781%201.753906%20495.273438%20C%202.03125%20494.996094%202.332031%20494.746094%202.660156%20494.527344%20C%202.988281%20494.308594%203.335938%20494.121094%203.699219%20493.972656%20C%204.0625%20493.820312%204.4375%20493.707031%204.824219%20493.628906%20C%205.210938%20493.554688%205.601562%20493.515625%205.996094%20493.515625%20C%206.390625%20493.515625%206.777344%20493.554688%207.164062%20493.628906%20C%207.550781%20493.707031%207.925781%20493.820312%208.289062%20493.972656%20C%208.65625%20494.121094%209%20494.308594%209.328125%20494.527344%20C%209.65625%20494.746094%209.957031%20494.996094%2010.238281%20495.273438%20C%2010.515625%20495.550781%2010.765625%20495.855469%2010.984375%20496.183594%20C%2011.203125%20496.507812%2011.386719%20496.855469%2011.539062%20497.21875%20C%2011.6875%20497.582031%2011.804688%20497.957031%2011.878906%20498.34375%20C%2011.957031%20498.730469%2011.996094%20499.121094%2011.996094%20499.515625%20L%2011.996094%20559.515625%20C%2011.996094%20559.910156%2011.957031%20560.300781%2011.878906%20560.6875%20C%2011.804688%20561.074219%2011.6875%20561.449219%2011.539062%20561.8125%20C%2011.386719%20562.175781%2011.203125%20562.519531%2010.984375%20562.847656%20C%2010.765625%20563.175781%2010.515625%20563.480469%2010.238281%20563.757812%20C%209.957031%20564.035156%209.65625%20564.285156%209.328125%20564.503906%20C%209%20564.722656%208.65625%20564.90625%208.289062%20565.058594%20C%207.925781%20565.210938%207.550781%20565.324219%207.164062%20565.398438%20C%206.777344%20565.476562%206.390625%20565.515625%205.996094%20565.515625%20C%205.601562%20565.515625%205.210938%20565.476562%204.824219%20565.398438%20C%204.4375%20565.324219%204.0625%20565.210938%203.699219%20565.058594%20C%203.335938%20564.90625%202.988281%20564.722656%202.660156%20564.503906%20C%202.332031%20564.285156%202.03125%20564.035156%201.753906%20563.757812%20C%201.472656%20563.480469%201.226562%20563.175781%201.007812%20562.847656%20C%200.789062%20562.519531%200.601562%20562.175781%200.453125%20561.8125%20C%200.300781%20561.449219%200.1875%20561.074219%200.109375%20560.6875%20C%200.0351562%20560.300781%20-0.00390625%20559.910156%20-0.00390625%20559.515625%20Z%20M%20-0.00390625%20475.515625%20L%20-0.00390625%20415.515625%20C%20-0.00390625%20415.121094%200.0351562%20414.730469%200.109375%20414.34375%20C%200.1875%20413.957031%200.300781%20413.582031%200.453125%20413.21875%20C%200.601562%20412.855469%200.789062%20412.507812%201.007812%20412.183594%20C%201.226562%20411.855469%201.472656%20411.550781%201.753906%20411.273438%20C%202.03125%20410.996094%202.332031%20410.746094%202.660156%20410.527344%20C%202.988281%20410.308594%203.335938%20410.125%203.699219%20409.972656%20C%204.0625%20409.820312%204.4375%20409.707031%204.824219%20409.628906%20C%205.210938%20409.554688%205.601562%20409.515625%205.996094%20409.515625%20C%206.390625%20409.515625%206.777344%20409.554688%207.164062%20409.628906%20C%207.550781%20409.707031%207.925781%20409.820312%208.289062%20409.972656%20C%208.65625%20410.125%209%20410.308594%209.328125%20410.527344%20C%209.65625%20410.746094%209.957031%20410.996094%2010.238281%20411.273438%20C%2010.515625%20411.550781%2010.765625%20411.855469%2010.984375%20412.183594%20C%2011.203125%20412.507812%2011.386719%20412.855469%2011.539062%20413.21875%20C%2011.6875%20413.582031%2011.804688%20413.957031%2011.878906%20414.34375%20C%2011.957031%20414.730469%2011.996094%20415.121094%2011.996094%20415.515625%20L%2011.996094%20475.515625%20C%2011.996094%20475.910156%2011.957031%20476.300781%2011.878906%20476.6875%20C%2011.804688%20477.074219%2011.6875%20477.449219%2011.539062%20477.8125%20C%2011.386719%20478.175781%2011.203125%20478.519531%2010.984375%20478.847656%20C%2010.765625%20479.175781%2010.515625%20479.480469%2010.238281%20479.757812%20C%209.957031%20480.035156%209.65625%20480.285156%209.328125%20480.503906%20C%209%20480.722656%208.65625%20480.90625%208.289062%20481.058594%20C%207.925781%20481.210938%207.550781%20481.324219%207.164062%20481.398438%20C%206.777344%20481.476562%206.390625%20481.515625%205.996094%20481.515625%20C%205.601562%20481.515625%205.210938%20481.476562%204.824219%20481.398438%20C%204.4375%20481.324219%204.0625%20481.210938%203.699219%20481.058594%20C%203.335938%20480.90625%202.988281%20480.722656%202.660156%20480.503906%20C%202.332031%20480.285156%202.03125%20480.035156%201.753906%20479.757812%20C%201.472656%20479.480469%201.226562%20479.175781%201.007812%20478.847656%20C%200.789062%20478.519531%200.601562%20478.175781%200.453125%20477.8125%20C%200.300781%20477.449219%200.1875%20477.074219%200.109375%20476.6875%20C%200.0351562%20476.300781%20-0.00390625%20475.910156%20-0.00390625%20475.515625%20Z%20M%20-0.00390625%20391.515625%20L%20-0.00390625%20331.515625%20C%20-0.00390625%20331.121094%200.0351562%20330.730469%200.109375%20330.34375%20C%200.1875%20329.957031%200.300781%20329.582031%200.453125%20329.21875%20C%200.601562%20328.855469%200.789062%20328.507812%201.007812%20328.183594%20C%201.226562%20327.855469%201.472656%20327.550781%201.753906%20327.273438%20C%202.03125%20326.996094%202.332031%20326.746094%202.660156%20326.527344%20C%202.988281%20326.308594%203.335938%20326.125%203.699219%20325.972656%20C%204.0625%20325.820312%204.4375%20325.707031%204.824219%20325.632812%20C%205.210938%20325.554688%205.601562%20325.515625%205.996094%20325.515625%20C%206.390625%20325.515625%206.777344%20325.554688%207.164062%20325.628906%20C%207.550781%20325.707031%207.925781%20325.820312%208.289062%20325.972656%20C%208.65625%20326.125%209%20326.308594%209.328125%20326.527344%20C%209.65625%20326.746094%209.957031%20326.996094%2010.238281%20327.273438%20C%2010.515625%20327.550781%2010.765625%20327.855469%2010.984375%20328.183594%20C%2011.203125%20328.507812%2011.386719%20328.855469%2011.539062%20329.21875%20C%2011.6875%20329.582031%2011.804688%20329.957031%2011.878906%20330.34375%20C%2011.957031%20330.730469%2011.996094%20331.121094%2011.996094%20331.515625%20L%2011.996094%20391.515625%20C%2011.996094%20391.910156%2011.957031%20392.300781%2011.878906%20392.6875%20C%2011.804688%20393.074219%2011.6875%20393.449219%2011.539062%20393.8125%20C%2011.386719%20394.175781%2011.203125%20394.519531%2010.984375%20394.847656%20C%2010.765625%20395.175781%2010.515625%20395.480469%2010.238281%20395.757812%20C%209.957031%20396.035156%209.65625%20396.285156%209.328125%20396.503906%20C%209%20396.722656%208.65625%20396.90625%208.289062%20397.058594%20C%207.925781%20397.210938%207.550781%20397.324219%207.164062%20397.398438%20C%206.777344%20397.476562%206.390625%20397.515625%205.996094%20397.515625%20C%205.601562%20397.515625%205.210938%20397.476562%204.824219%20397.398438%20C%204.4375%20397.324219%204.0625%20397.210938%203.699219%20397.058594%20C%203.335938%20396.90625%202.988281%20396.722656%202.660156%20396.503906%20C%202.332031%20396.285156%202.03125%20396.035156%201.753906%20395.757812%20C%201.472656%20395.480469%201.226562%20395.175781%201.007812%20394.847656%20C%200.789062%20394.519531%200.601562%20394.175781%200.453125%20393.8125%20C%200.300781%20393.449219%200.1875%20393.074219%200.109375%20392.6875%20C%200.0351562%20392.300781%20-0.00390625%20391.910156%20-0.00390625%20391.515625%20Z%20M%20-0.00390625%20307.515625%20L%20-0.00390625%20247.515625%20C%20-0.00390625%20247.121094%200.0351562%20246.730469%200.109375%20246.34375%20C%200.1875%20245.957031%200.300781%20245.582031%200.453125%20245.21875%20C%200.601562%20244.855469%200.789062%20244.511719%201.007812%20244.183594%20C%201.226562%20243.855469%201.472656%20243.550781%201.753906%20243.273438%20C%202.03125%20242.996094%202.332031%20242.746094%202.660156%20242.527344%20C%202.988281%20242.308594%203.335938%20242.125%203.699219%20241.972656%20C%204.0625%20241.820312%204.4375%20241.707031%204.824219%20241.632812%20C%205.210938%20241.554688%205.601562%20241.515625%205.996094%20241.515625%20C%206.390625%20241.515625%206.777344%20241.554688%207.164062%20241.632812%20C%207.550781%20241.707031%207.925781%20241.820312%208.289062%20241.972656%20C%208.65625%20242.125%209%20242.308594%209.328125%20242.527344%20C%209.65625%20242.746094%209.957031%20242.996094%2010.238281%20243.273438%20C%2010.515625%20243.550781%2010.765625%20243.855469%2010.984375%20244.183594%20C%2011.203125%20244.511719%2011.386719%20244.855469%2011.539062%20245.21875%20C%2011.6875%20245.582031%2011.804688%20245.957031%2011.878906%20246.34375%20C%2011.957031%20246.730469%2011.996094%20247.121094%2011.996094%20247.515625%20L%2011.996094%20307.515625%20C%2011.996094%20307.910156%2011.957031%20308.300781%2011.878906%20308.6875%20C%2011.804688%20309.074219%2011.6875%20309.449219%2011.539062%20309.8125%20C%2011.386719%20310.175781%2011.203125%20310.519531%2010.984375%20310.847656%20C%2010.765625%20311.175781%2010.515625%20311.480469%2010.238281%20311.757812%20C%209.957031%20312.035156%209.65625%20312.285156%209.328125%20312.503906%20C%209%20312.722656%208.65625%20312.90625%208.289062%20313.058594%20C%207.925781%20313.210938%207.550781%20313.324219%207.164062%20313.398438%20C%206.777344%20313.476562%206.390625%20313.515625%205.996094%20313.515625%20C%205.601562%20313.515625%205.210938%20313.476562%204.824219%20313.398438%20C%204.4375%20313.324219%204.0625%20313.210938%203.699219%20313.058594%20C%203.335938%20312.90625%202.988281%20312.722656%202.660156%20312.503906%20C%202.332031%20312.285156%202.03125%20312.035156%201.753906%20311.757812%20C%201.472656%20311.480469%201.226562%20311.175781%201.007812%20310.847656%20C%200.789062%20310.519531%200.601562%20310.175781%200.453125%20309.8125%20C%200.300781%20309.449219%200.1875%20309.074219%200.109375%20308.6875%20C%200.0351562%20308.300781%20-0.00390625%20307.910156%20-0.00390625%20307.515625%20Z%20M%20-0.00390625%20223.515625%20L%20-0.00390625%20197.054688%20C%20-0.00390625%20196.664062%200.0351562%20196.273438%200.109375%20195.886719%20C%200.1875%20195.5%200.300781%20195.125%200.453125%20194.761719%20C%200.601562%20194.394531%200.789062%20194.050781%201.007812%20193.722656%20C%201.226562%20193.394531%201.472656%20193.09375%201.753906%20192.8125%20C%202.03125%20192.535156%202.332031%20192.285156%202.660156%20192.066406%20C%202.988281%20191.847656%203.335938%20191.664062%203.699219%20191.511719%20C%204.0625%20191.363281%204.4375%20191.25%204.824219%20191.171875%20C%205.210938%20191.09375%205.601562%20191.054688%205.996094%20191.054688%20C%206.390625%20191.054688%206.777344%20191.09375%207.164062%20191.171875%20C%207.550781%20191.25%207.925781%20191.363281%208.289062%20191.511719%20C%208.65625%20191.664062%209%20191.847656%209.328125%20192.066406%20C%209.65625%20192.285156%209.957031%20192.535156%2010.238281%20192.8125%20C%2010.515625%20193.09375%2010.765625%20193.394531%2010.984375%20193.722656%20C%2011.203125%20194.050781%2011.386719%20194.394531%2011.539062%20194.761719%20C%2011.6875%20195.125%2011.804688%20195.5%2011.878906%20195.886719%20C%2011.957031%20196.273438%2011.996094%20196.664062%2011.996094%20197.054688%20L%2011.996094%20223.515625%20C%2011.996094%20223.910156%2011.957031%20224.300781%2011.878906%20224.6875%20C%2011.804688%20225.074219%2011.6875%20225.449219%2011.539062%20225.8125%20C%2011.386719%20226.175781%2011.203125%20226.523438%2010.984375%20226.847656%20C%2010.765625%20227.175781%2010.515625%20227.480469%2010.238281%20227.757812%20C%209.957031%20228.035156%209.65625%20228.285156%209.328125%20228.503906%20C%209%20228.722656%208.65625%20228.90625%208.289062%20229.058594%20C%207.925781%20229.210938%207.550781%20229.324219%207.164062%20229.398438%20C%206.777344%20229.476562%206.390625%20229.515625%205.996094%20229.515625%20C%205.601562%20229.515625%205.210938%20229.476562%204.824219%20229.398438%20C%204.4375%20229.324219%204.0625%20229.210938%203.699219%20229.058594%20C%203.335938%20228.90625%202.988281%20228.722656%202.660156%20228.503906%20C%202.332031%20228.285156%202.03125%20228.035156%201.753906%20227.757812%20C%201.472656%20227.480469%201.226562%20227.175781%201.007812%20226.847656%20C%200.789062%20226.523438%200.601562%20226.175781%200.453125%20225.8125%20C%200.300781%20225.449219%200.1875%20225.074219%200.109375%20224.6875%20C%200.0351562%20224.300781%20-0.00390625%20223.910156%20-0.00390625%20223.515625%20Z%20M%20-0.00390625%20223.515625%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%20464.285156%20197.0625%20L%20404.285156%20197.0625%20C%20403.890625%20197.0625%20403.5%20197.023438%20403.113281%20196.945312%20C%20402.726562%20196.867188%20402.351562%20196.753906%20401.988281%20196.605469%20C%20401.625%20196.453125%20401.28125%20196.269531%20400.953125%20196.050781%20C%20400.625%20195.832031%20400.320312%20195.582031%20400.042969%20195.304688%20C%20399.765625%20195.023438%20399.515625%20194.722656%20399.296875%20194.394531%20C%20399.078125%20194.066406%20398.894531%20193.722656%20398.742188%20193.355469%20C%20398.589844%20192.992188%20398.476562%20192.617188%20398.402344%20192.230469%20C%20398.324219%20191.84375%20398.285156%20191.457031%20398.285156%20191.0625%20C%20398.285156%20190.667969%20398.324219%20190.277344%20398.402344%20189.890625%20C%20398.476562%20189.503906%20398.589844%20189.128906%20398.742188%20188.765625%20C%20398.894531%20188.402344%20399.078125%20188.054688%20399.296875%20187.726562%20C%20399.515625%20187.398438%20399.765625%20187.097656%20400.042969%20186.820312%20C%20400.320312%20186.539062%20400.625%20186.292969%20400.953125%20186.074219%20C%20401.28125%20185.855469%20401.625%20185.667969%20401.988281%20185.519531%20C%20402.351562%20185.367188%20402.726562%20185.253906%20403.113281%20185.175781%20C%20403.5%20185.101562%20403.890625%20185.0625%20404.285156%20185.0625%20L%20464.285156%20185.0625%20C%20464.679688%20185.0625%20465.070312%20185.101562%20465.457031%20185.175781%20C%20465.84375%20185.253906%20466.21875%20185.367188%20466.582031%20185.519531%20C%20466.945312%20185.667969%20467.289062%20185.855469%20467.617188%20186.074219%20C%20467.945312%20186.292969%20468.25%20186.539062%20468.527344%20186.820312%20C%20468.804688%20187.097656%20469.054688%20187.398438%20469.273438%20187.726562%20C%20469.492188%20188.054688%20469.675781%20188.402344%20469.828125%20188.765625%20C%20469.980469%20189.128906%20470.09375%20189.503906%20470.167969%20189.890625%20C%20470.246094%20190.277344%20470.285156%20190.667969%20470.285156%20191.0625%20C%20470.285156%20191.457031%20470.246094%20191.84375%20470.167969%20192.230469%20C%20470.09375%20192.617188%20469.980469%20192.992188%20469.828125%20193.355469%20C%20469.675781%20193.722656%20469.492188%20194.066406%20469.273438%20194.394531%20C%20469.054688%20194.722656%20468.804688%20195.023438%20468.527344%20195.304688%20C%20468.25%20195.582031%20467.945312%20195.832031%20467.617188%20196.050781%20C%20467.289062%20196.269531%20466.945312%20196.453125%20466.582031%20196.605469%20C%20466.21875%20196.753906%20465.84375%20196.867188%20465.457031%20196.945312%20C%20465.070312%20197.023438%20464.679688%20197.0625%20464.285156%20197.0625%20Z%20M%20380.285156%20197.0625%20L%20320.285156%20197.0625%20C%20319.890625%20197.0625%20319.5%20197.023438%20319.113281%20196.945312%20C%20318.726562%20196.867188%20318.351562%20196.753906%20317.988281%20196.605469%20C%20317.625%20196.453125%20317.28125%20196.269531%20316.953125%20196.050781%20C%20316.625%20195.832031%20316.320312%20195.582031%20316.042969%20195.304688%20C%20315.765625%20195.023438%20315.515625%20194.722656%20315.296875%20194.394531%20C%20315.078125%20194.066406%20314.894531%20193.722656%20314.742188%20193.355469%20C%20314.589844%20192.992188%20314.476562%20192.617188%20314.402344%20192.230469%20C%20314.324219%20191.84375%20314.285156%20191.457031%20314.285156%20191.0625%20C%20314.285156%20190.667969%20314.324219%20190.277344%20314.402344%20189.890625%20C%20314.476562%20189.503906%20314.589844%20189.128906%20314.742188%20188.765625%20C%20314.894531%20188.402344%20315.078125%20188.054688%20315.296875%20187.726562%20C%20315.515625%20187.398438%20315.765625%20187.097656%20316.042969%20186.820312%20C%20316.320312%20186.539062%20316.625%20186.292969%20316.953125%20186.074219%20C%20317.28125%20185.855469%20317.625%20185.667969%20317.988281%20185.519531%20C%20318.351562%20185.367188%20318.726562%20185.253906%20319.113281%20185.175781%20C%20319.5%20185.101562%20319.890625%20185.0625%20320.285156%20185.0625%20L%20380.285156%20185.0625%20C%20380.679688%20185.0625%20381.070312%20185.101562%20381.457031%20185.175781%20C%20381.84375%20185.253906%20382.21875%20185.367188%20382.582031%20185.519531%20C%20382.945312%20185.667969%20383.289062%20185.855469%20383.617188%20186.074219%20C%20383.945312%20186.292969%20384.25%20186.539062%20384.527344%20186.820312%20C%20384.804688%20187.097656%20385.054688%20187.398438%20385.273438%20187.726562%20C%20385.492188%20188.054688%20385.675781%20188.402344%20385.828125%20188.765625%20C%20385.980469%20189.128906%20386.09375%20189.503906%20386.167969%20189.890625%20C%20386.246094%20190.277344%20386.285156%20190.667969%20386.285156%20191.0625%20C%20386.285156%20191.457031%20386.246094%20191.84375%20386.167969%20192.230469%20C%20386.09375%20192.617188%20385.980469%20192.992188%20385.828125%20193.355469%20C%20385.675781%20193.722656%20385.492188%20194.066406%20385.273438%20194.394531%20C%20385.054688%20194.722656%20384.804688%20195.023438%20384.527344%20195.304688%20C%20384.25%20195.582031%20383.945312%20195.832031%20383.617188%20196.050781%20C%20383.289062%20196.269531%20382.945312%20196.453125%20382.582031%20196.605469%20C%20382.21875%20196.753906%20381.84375%20196.867188%20381.457031%20196.945312%20C%20381.070312%20197.023438%20380.679688%20197.0625%20380.285156%20197.0625%20Z%20M%20296.285156%20197.0625%20L%20236.285156%20197.0625%20C%20235.890625%20197.0625%20235.5%20197.023438%20235.113281%20196.945312%20C%20234.726562%20196.867188%20234.351562%20196.753906%20233.988281%20196.605469%20C%20233.625%20196.453125%20233.28125%20196.269531%20232.953125%20196.050781%20C%20232.625%20195.832031%20232.320312%20195.582031%20232.042969%20195.304688%20C%20231.765625%20195.023438%20231.515625%20194.722656%20231.296875%20194.394531%20C%20231.078125%20194.066406%20230.894531%20193.722656%20230.742188%20193.355469%20C%20230.589844%20192.992188%20230.476562%20192.617188%20230.402344%20192.230469%20C%20230.324219%20191.84375%20230.285156%20191.457031%20230.285156%20191.0625%20C%20230.285156%20190.667969%20230.324219%20190.277344%20230.402344%20189.890625%20C%20230.476562%20189.503906%20230.589844%20189.128906%20230.742188%20188.765625%20C%20230.894531%20188.402344%20231.078125%20188.054688%20231.296875%20187.726562%20C%20231.515625%20187.398438%20231.765625%20187.097656%20232.042969%20186.820312%20C%20232.320312%20186.539062%20232.625%20186.292969%20232.953125%20186.074219%20C%20233.28125%20185.855469%20233.625%20185.667969%20233.988281%20185.519531%20C%20234.351562%20185.367188%20234.726562%20185.253906%20235.113281%20185.175781%20C%20235.5%20185.101562%20235.890625%20185.0625%20236.285156%20185.0625%20L%20296.285156%20185.0625%20C%20296.679688%20185.0625%20297.070312%20185.101562%20297.457031%20185.175781%20C%20297.84375%20185.253906%20298.21875%20185.367188%20298.582031%20185.519531%20C%20298.945312%20185.667969%20299.292969%20185.855469%20299.617188%20186.074219%20C%20299.945312%20186.292969%20300.25%20186.539062%20300.527344%20186.820312%20C%20300.804688%20187.097656%20301.054688%20187.398438%20301.273438%20187.726562%20C%20301.492188%20188.054688%20301.675781%20188.402344%20301.828125%20188.765625%20C%20301.980469%20189.128906%20302.09375%20189.503906%20302.167969%20189.890625%20C%20302.246094%20190.277344%20302.285156%20190.667969%20302.285156%20191.0625%20C%20302.285156%20191.457031%20302.246094%20191.84375%20302.167969%20192.230469%20C%20302.09375%20192.617188%20301.980469%20192.992188%20301.828125%20193.355469%20C%20301.675781%20193.722656%20301.492188%20194.066406%20301.273438%20194.394531%20C%20301.054688%20194.722656%20300.804688%20195.023438%20300.527344%20195.304688%20C%20300.25%20195.582031%20299.945312%20195.832031%20299.617188%20196.050781%20C%20299.292969%20196.269531%20298.945312%20196.453125%20298.582031%20196.605469%20C%20298.21875%20196.753906%20297.84375%20196.867188%20297.457031%20196.945312%20C%20297.070312%20197.023438%20296.679688%20197.0625%20296.285156%20197.0625%20Z%20M%20212.285156%20197.0625%20L%20152.285156%20197.0625%20C%20151.890625%20197.0625%20151.5%20197.023438%20151.113281%20196.945312%20C%20150.726562%20196.867188%20150.351562%20196.753906%20149.988281%20196.605469%20C%20149.625%20196.453125%20149.28125%20196.269531%20148.953125%20196.050781%20C%20148.625%20195.832031%20148.320312%20195.582031%20148.042969%20195.304688%20C%20147.765625%20195.023438%20147.515625%20194.722656%20147.296875%20194.394531%20C%20147.078125%20194.066406%20146.894531%20193.722656%20146.742188%20193.355469%20C%20146.589844%20192.992188%20146.476562%20192.617188%20146.402344%20192.230469%20C%20146.324219%20191.84375%20146.285156%20191.457031%20146.285156%20191.0625%20C%20146.285156%20190.667969%20146.324219%20190.277344%20146.402344%20189.890625%20C%20146.476562%20189.503906%20146.589844%20189.128906%20146.742188%20188.765625%20C%20146.894531%20188.402344%20147.078125%20188.054688%20147.296875%20187.726562%20C%20147.515625%20187.398438%20147.765625%20187.097656%20148.042969%20186.820312%20C%20148.320312%20186.539062%20148.625%20186.292969%20148.953125%20186.074219%20C%20149.28125%20185.855469%20149.625%20185.667969%20149.988281%20185.519531%20C%20150.351562%20185.367188%20150.726562%20185.253906%20151.113281%20185.175781%20C%20151.5%20185.101562%20151.890625%20185.0625%20152.285156%20185.0625%20L%20212.285156%20185.0625%20C%20212.679688%20185.0625%20213.070312%20185.101562%20213.457031%20185.175781%20C%20213.84375%20185.253906%20214.21875%20185.367188%20214.582031%20185.519531%20C%20214.945312%20185.667969%20215.292969%20185.855469%20215.617188%20186.074219%20C%20215.945312%20186.292969%20216.25%20186.539062%20216.527344%20186.820312%20C%20216.804688%20187.097656%20217.054688%20187.398438%20217.273438%20187.726562%20C%20217.492188%20188.054688%20217.675781%20188.402344%20217.828125%20188.765625%20C%20217.980469%20189.128906%20218.09375%20189.503906%20218.167969%20189.890625%20C%20218.246094%20190.277344%20218.285156%20190.667969%20218.285156%20191.0625%20C%20218.285156%20191.457031%20218.246094%20191.84375%20218.167969%20192.230469%20C%20218.09375%20192.617188%20217.980469%20192.992188%20217.828125%20193.355469%20C%20217.675781%20193.722656%20217.492188%20194.066406%20217.273438%20194.394531%20C%20217.054688%20194.722656%20216.804688%20195.023438%20216.527344%20195.304688%20C%20216.25%20195.582031%20215.945312%20195.832031%20215.617188%20196.050781%20C%20215.292969%20196.269531%20214.945312%20196.453125%20214.582031%20196.605469%20C%20214.21875%20196.753906%20213.84375%20196.867188%20213.457031%20196.945312%20C%20213.070312%20197.023438%20212.679688%20197.0625%20212.285156%20197.0625%20Z%20M%20128.285156%20197.0625%20L%2068.285156%20197.0625%20C%2067.890625%20197.0625%2067.5%20197.023438%2067.113281%20196.945312%20C%2066.726562%20196.867188%2066.351562%20196.753906%2065.988281%20196.605469%20C%2065.625%20196.453125%2065.28125%20196.269531%2064.953125%20196.050781%20C%2064.625%20195.832031%2064.320312%20195.582031%2064.042969%20195.304688%20C%2063.765625%20195.023438%2063.515625%20194.722656%2063.296875%20194.394531%20C%2063.078125%20194.066406%2062.894531%20193.722656%2062.742188%20193.355469%20C%2062.589844%20192.992188%2062.476562%20192.617188%2062.402344%20192.230469%20C%2062.324219%20191.84375%2062.285156%20191.457031%2062.285156%20191.0625%20C%2062.285156%20190.667969%2062.324219%20190.277344%2062.402344%20189.890625%20C%2062.476562%20189.503906%2062.589844%20189.128906%2062.742188%20188.765625%20C%2062.894531%20188.402344%2063.078125%20188.054688%2063.296875%20187.726562%20C%2063.515625%20187.398438%2063.765625%20187.097656%2064.042969%20186.820312%20C%2064.320312%20186.539062%2064.625%20186.292969%2064.953125%20186.074219%20C%2065.28125%20185.855469%2065.625%20185.667969%2065.988281%20185.519531%20C%2066.351562%20185.367188%2066.726562%20185.253906%2067.113281%20185.175781%20C%2067.5%20185.101562%2067.890625%20185.0625%2068.285156%20185.0625%20L%20128.285156%20185.0625%20C%20128.679688%20185.0625%20129.070312%20185.101562%20129.457031%20185.175781%20C%20129.84375%20185.253906%20130.21875%20185.367188%20130.582031%20185.519531%20C%20130.945312%20185.667969%20131.292969%20185.855469%20131.617188%20186.074219%20C%20131.945312%20186.292969%20132.25%20186.539062%20132.527344%20186.820312%20C%20132.804688%20187.097656%20133.054688%20187.398438%20133.273438%20187.726562%20C%20133.492188%20188.054688%20133.675781%20188.402344%20133.828125%20188.765625%20C%20133.980469%20189.128906%20134.09375%20189.503906%20134.167969%20189.890625%20C%20134.246094%20190.277344%20134.285156%20190.667969%20134.285156%20191.0625%20C%20134.285156%20191.457031%20134.246094%20191.84375%20134.167969%20192.230469%20C%20134.09375%20192.617188%20133.980469%20192.992188%20133.828125%20193.355469%20C%20133.675781%20193.722656%20133.492188%20194.066406%20133.273438%20194.394531%20C%20133.054688%20194.722656%20132.804688%20195.023438%20132.527344%20195.304688%20C%20132.25%20195.582031%20131.945312%20195.832031%20131.617188%20196.050781%20C%20131.292969%20196.269531%20130.945312%20196.453125%20130.582031%20196.605469%20C%20130.21875%20196.753906%20129.84375%20196.867188%20129.457031%20196.945312%20C%20129.070312%20197.023438%20128.679688%20197.0625%20128.285156%20197.0625%20Z%20M%2044.285156%20197.0625%20L%2011.996094%20197.0625%20C%2011.601562%20197.0625%2011.210938%20197.023438%2010.828125%20196.945312%20C%2010.441406%20196.867188%2010.066406%20196.753906%209.699219%20196.605469%20C%209.335938%20196.453125%208.992188%20196.269531%208.664062%20196.050781%20C%208.335938%20195.832031%208.03125%20195.582031%207.753906%20195.304688%20C%207.476562%20195.023438%207.226562%20194.722656%207.007812%20194.394531%20C%206.789062%20194.066406%206.605469%20193.722656%206.453125%20193.355469%20C%206.304688%20192.992188%206.1875%20192.617188%206.113281%20192.230469%20C%206.035156%20191.84375%205.996094%20191.457031%205.996094%20191.0625%20C%205.996094%20190.667969%206.035156%20190.277344%206.113281%20189.890625%20C%206.1875%20189.503906%206.304688%20189.128906%206.453125%20188.765625%20C%206.605469%20188.402344%206.789062%20188.054688%207.007812%20187.726562%20C%207.226562%20187.398438%207.476562%20187.097656%207.753906%20186.820312%20C%208.03125%20186.539062%208.335938%20186.292969%208.664062%20186.074219%20C%208.992188%20185.855469%209.335938%20185.667969%209.699219%20185.519531%20C%2010.066406%20185.367188%2010.441406%20185.253906%2010.828125%20185.175781%20C%2011.210938%20185.101562%2011.601562%20185.0625%2011.996094%20185.0625%20L%2044.285156%20185.0625%20C%2044.679688%20185.0625%2045.070312%20185.101562%2045.457031%20185.175781%20C%2045.84375%20185.253906%2046.21875%20185.367188%2046.582031%20185.519531%20C%2046.945312%20185.667969%2047.292969%20185.855469%2047.617188%20186.074219%20C%2047.945312%20186.292969%2048.25%20186.539062%2048.527344%20186.820312%20C%2048.804688%20187.097656%2049.054688%20187.398438%2049.273438%20187.726562%20C%2049.492188%20188.054688%2049.679688%20188.402344%2049.828125%20188.765625%20C%2049.980469%20189.128906%2050.09375%20189.503906%2050.167969%20189.890625%20C%2050.246094%20190.277344%2050.285156%20190.667969%2050.285156%20191.0625%20C%2050.285156%20191.457031%2050.246094%20191.84375%2050.167969%20192.230469%20C%2050.09375%20192.617188%2049.980469%20192.992188%2049.828125%20193.355469%20C%2049.679688%20193.722656%2049.492188%20194.066406%2049.273438%20194.394531%20C%2049.054688%20194.722656%2048.804688%20195.023438%2048.527344%20195.304688%20C%2048.25%20195.582031%2047.945312%20195.832031%2047.617188%20196.050781%20C%2047.292969%20196.269531%2046.945312%20196.453125%2046.582031%20196.605469%20C%2046.21875%20196.753906%2045.84375%20196.867188%2045.457031%20196.945312%20C%2045.070312%20197.023438%2044.679688%20197.0625%2044.285156%20197.0625%20Z%20M%2044.285156%20197.0625%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%20470.273438%20182.574219%20L%20512.628906%20140.074219%20C%20512.90625%20139.796875%20513.207031%20139.546875%20513.535156%20139.328125%20C%20513.863281%20139.109375%20514.207031%20138.921875%20514.570312%20138.773438%20C%20514.9375%20138.621094%20515.3125%20138.507812%20515.695312%20138.429688%20C%20516.082031%20138.351562%20516.472656%20138.3125%20516.867188%20138.3125%20C%20517.261719%20138.3125%20517.652344%20138.347656%20518.039062%20138.425781%20C%20518.425781%20138.5%20518.800781%20138.613281%20519.164062%20138.765625%20C%20519.527344%20138.914062%20519.875%20139.097656%20520.203125%20139.316406%20C%20520.53125%20139.535156%20520.832031%20139.785156%20521.113281%20140.0625%20C%20521.390625%20140.339844%20521.640625%20140.640625%20521.859375%20140.96875%20C%20522.082031%20141.296875%20522.265625%20141.640625%20522.417969%20142.007812%20C%20522.566406%20142.371094%20522.683594%20142.746094%20522.761719%20143.132812%20C%20522.835938%20143.515625%20522.875%20143.90625%20522.878906%20144.300781%20C%20522.878906%20144.695312%20522.839844%20145.085938%20522.765625%20145.472656%20C%20522.6875%20145.859375%20522.574219%20146.234375%20522.425781%20146.597656%20C%20522.273438%20146.960938%20522.089844%20147.308594%20521.871094%20147.636719%20C%20521.652344%20147.964844%20521.40625%20148.269531%20521.128906%20148.546875%20L%20478.773438%20191.046875%20C%20478.496094%20191.324219%20478.191406%20191.574219%20477.863281%20191.792969%20C%20477.539062%20192.011719%20477.191406%20192.199219%20476.828125%20192.347656%20C%20476.464844%20192.5%20476.089844%20192.613281%20475.703125%20192.691406%20C%20475.316406%20192.769531%20474.925781%20192.808594%20474.53125%20192.808594%20C%20474.140625%20192.808594%20473.75%20192.773438%20473.363281%20192.695312%20C%20472.976562%20192.621094%20472.601562%20192.507812%20472.234375%20192.355469%20C%20471.871094%20192.207031%20471.527344%20192.023438%20471.199219%20191.804688%20C%20470.871094%20191.585938%20470.566406%20191.335938%20470.289062%20191.058594%20C%20470.007812%20190.78125%20469.757812%20190.480469%20469.539062%20190.152344%20C%20469.320312%20189.824219%20469.136719%20189.480469%20468.984375%20189.113281%20C%20468.832031%20188.75%20468.71875%20188.375%20468.640625%20187.988281%20C%20468.5625%20187.605469%20468.523438%20187.214844%20468.523438%20186.820312%20C%20468.523438%20186.425781%20468.558594%20186.035156%20468.636719%20185.648438%20C%20468.710938%20185.261719%20468.824219%20184.886719%20468.976562%20184.523438%20C%20469.125%20184.160156%20469.308594%20183.8125%20469.527344%20183.484375%20C%20469.746094%20183.15625%20469.996094%20182.851562%20470.273438%20182.574219%20Z%20M%20529.570312%20123.078125%20L%20571.925781%2080.578125%20C%20572.203125%2080.300781%20572.503906%2080.050781%20572.832031%2079.832031%20C%20573.160156%2079.613281%20573.503906%2079.425781%20573.867188%2079.273438%20C%20574.230469%2079.125%20574.605469%2079.007812%20574.992188%2078.929688%20C%20575.378906%2078.855469%20575.769531%2078.816406%20576.164062%2078.8125%20C%20576.558594%2078.8125%20576.949219%2078.851562%20577.335938%2078.925781%20C%20577.722656%2079.003906%20578.097656%2079.117188%20578.460938%2079.265625%20C%20578.824219%2079.417969%20579.171875%2079.601562%20579.5%2079.820312%20C%20579.828125%2080.039062%20580.128906%2080.285156%20580.410156%2080.5625%20C%20580.6875%2080.84375%20580.9375%2081.144531%20581.15625%2081.472656%20C%20581.375%2081.800781%20581.5625%2082.144531%20581.714844%2082.507812%20C%20581.863281%2082.871094%20581.980469%2083.246094%20582.058594%2083.632812%20C%20582.132812%2084.019531%20582.171875%2084.410156%20582.175781%2084.804688%20C%20582.175781%2085.199219%20582.136719%2085.589844%20582.0625%2085.976562%20C%20581.984375%2086.363281%20581.871094%2086.738281%20581.722656%2087.101562%20C%20581.570312%2087.464844%20581.386719%2087.8125%20581.167969%2088.140625%20C%20580.949219%2088.46875%20580.703125%2088.769531%20580.425781%2089.050781%20L%20538.070312%20131.546875%20C%20537.792969%20131.828125%20537.488281%20132.074219%20537.160156%20132.296875%20C%20536.835938%20132.515625%20536.488281%20132.699219%20536.125%20132.851562%20C%20535.761719%20133.003906%20535.386719%20133.117188%20535%20133.195312%20C%20534.613281%20133.273438%20534.222656%20133.3125%20533.828125%20133.3125%20C%20533.433594%20133.3125%20533.046875%20133.273438%20532.660156%20133.199219%20C%20532.273438%20133.121094%20531.898438%20133.007812%20531.53125%20132.859375%20C%20531.167969%20132.710938%20530.824219%20132.523438%20530.496094%20132.308594%20C%20530.167969%20132.089844%20529.863281%20131.839844%20529.582031%20131.5625%20C%20529.304688%20131.285156%20529.054688%20130.980469%20528.835938%20130.652344%20C%20528.617188%20130.328125%20528.429688%20129.980469%20528.28125%20129.617188%20C%20528.128906%20129.253906%20528.015625%20128.878906%20527.9375%20128.492188%20C%20527.859375%20128.105469%20527.820312%20127.714844%20527.820312%20127.324219%20C%20527.820312%20126.929688%20527.855469%20126.539062%20527.933594%20126.152344%20C%20528.007812%20125.765625%20528.121094%20125.390625%20528.273438%20125.027344%20C%20528.421875%20124.660156%20528.605469%20124.316406%20528.824219%20123.988281%20C%20529.042969%20123.660156%20529.292969%20123.355469%20529.570312%20123.078125%20Z%20M%20588.867188%2063.578125%20L%20631.222656%2021.082031%20C%20631.5%2020.800781%20631.800781%2020.554688%20632.128906%2020.332031%20C%20632.457031%2020.113281%20632.800781%2019.929688%20633.164062%2019.777344%20C%20633.527344%2019.625%20633.902344%2019.511719%20634.289062%2019.433594%20C%20634.675781%2019.355469%20635.066406%2019.316406%20635.460938%2019.316406%20C%20635.855469%2019.316406%20636.246094%2019.355469%20636.632812%2019.429688%20C%20637.019531%2019.507812%20637.394531%2019.621094%20637.757812%2019.769531%20C%20638.121094%2019.921875%20638.46875%2020.105469%20638.796875%2020.324219%20C%20639.125%2020.539062%20639.425781%2020.789062%20639.707031%2021.066406%20C%20639.984375%2021.34375%20640.234375%2021.648438%20640.453125%2021.976562%20C%20640.671875%2022.300781%20640.859375%2022.648438%20641.011719%2023.011719%20C%20641.160156%2023.375%20641.277344%2023.75%20641.351562%2024.136719%20C%20641.429688%2024.523438%20641.46875%2024.914062%20641.46875%2025.308594%20C%20641.472656%2025.699219%20641.433594%2026.089844%20641.355469%2026.476562%20C%20641.28125%2026.863281%20641.167969%2027.238281%20641.019531%2027.605469%20C%20640.867188%2027.96875%20640.683594%2028.3125%20640.464844%2028.640625%20C%20640.246094%2028.96875%20640%2029.273438%20639.71875%2029.550781%20L%20597.367188%2072.050781%20C%20597.085938%2072.328125%20596.785156%2072.578125%20596.457031%2072.796875%20C%20596.128906%2073.019531%20595.785156%2073.203125%20595.421875%2073.355469%20C%20595.058594%2073.503906%20594.683594%2073.621094%20594.296875%2073.699219%20C%20593.910156%2073.773438%20593.519531%2073.8125%20593.125%2073.816406%20C%20592.730469%2073.816406%20592.34375%2073.777344%20591.957031%2073.703125%20C%20591.570312%2073.625%20591.195312%2073.511719%20590.828125%2073.363281%20C%20590.464844%2073.210938%20590.117188%2073.027344%20589.789062%2072.808594%20C%20589.464844%2072.589844%20589.160156%2072.34375%20588.878906%2072.066406%20C%20588.601562%2071.785156%20588.351562%2071.484375%20588.132812%2071.15625%20C%20587.914062%2070.828125%20587.726562%2070.484375%20587.578125%2070.121094%20C%20587.425781%2069.757812%20587.3125%2069.382812%20587.234375%2068.996094%20C%20587.15625%2068.609375%20587.117188%2068.21875%20587.117188%2067.824219%20C%20587.113281%2067.429688%20587.152344%2067.039062%20587.230469%2066.65625%20C%20587.304688%2066.269531%20587.417969%2065.890625%20587.570312%2065.527344%20C%20587.71875%2065.164062%20587.902344%2064.816406%20588.121094%2064.488281%20C%20588.339844%2064.160156%20588.589844%2063.859375%20588.867188%2063.578125%20Z%20M%20588.867188%2063.578125%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%20648.722656%20459.082031%20L%20648.722656%20399.082031%20C%20648.722656%20398.6875%20648.761719%20398.296875%20648.839844%20397.914062%20C%20648.917969%20397.527344%20649.03125%20397.152344%20649.179688%20396.785156%20C%20649.332031%20396.421875%20649.515625%20396.078125%20649.734375%20395.75%20C%20649.953125%20395.421875%20650.203125%20395.117188%20650.480469%20394.839844%20C%20650.761719%20394.5625%20651.0625%20394.3125%20651.390625%20394.09375%20C%20651.71875%20393.875%20652.0625%20393.691406%20652.429688%20393.539062%20C%20652.792969%20393.390625%20653.167969%20393.273438%20653.554688%20393.199219%20C%20653.941406%20393.121094%20654.332031%20393.082031%20654.722656%20393.082031%20C%20655.117188%20393.082031%20655.507812%20393.121094%20655.894531%20393.199219%20C%20656.28125%20393.273438%20656.65625%20393.390625%20657.019531%20393.539062%20C%20657.382812%20393.691406%20657.730469%20393.875%20658.058594%20394.09375%20C%20658.386719%20394.3125%20658.6875%20394.5625%20658.964844%20394.839844%20C%20659.246094%20395.117188%20659.492188%20395.421875%20659.714844%20395.75%20C%20659.933594%20396.078125%20660.117188%20396.421875%20660.265625%20396.785156%20C%20660.417969%20397.152344%20660.53125%20397.527344%20660.609375%20397.914062%20C%20660.6875%20398.296875%20660.722656%20398.6875%20660.722656%20399.082031%20L%20660.722656%20459.082031%20C%20660.722656%20459.476562%20660.6875%20459.867188%20660.609375%20460.253906%20C%20660.53125%20460.640625%20660.417969%20461.015625%20660.265625%20461.378906%20C%20660.117188%20461.742188%20659.933594%20462.089844%20659.714844%20462.417969%20C%20659.492188%20462.742188%20659.246094%20463.046875%20658.964844%20463.324219%20C%20658.6875%20463.605469%20658.386719%20463.851562%20658.058594%20464.070312%20C%20657.730469%20464.289062%20657.382812%20464.476562%20657.019531%20464.625%20C%20656.65625%20464.777344%20656.28125%20464.890625%20655.894531%20464.96875%20C%20655.507812%20465.042969%20655.117188%20465.082031%20654.722656%20465.082031%20C%20654.332031%20465.082031%20653.941406%20465.042969%20653.554688%20464.96875%20C%20653.167969%20464.890625%20652.792969%20464.777344%20652.429688%20464.625%20C%20652.0625%20464.476562%20651.71875%20464.289062%20651.390625%20464.070312%20C%20651.0625%20463.851562%20650.761719%20463.605469%20650.480469%20463.324219%20C%20650.203125%20463.046875%20649.953125%20462.742188%20649.734375%20462.417969%20C%20649.515625%20462.089844%20649.332031%20461.742188%20649.179688%20461.378906%20C%20649.03125%20461.015625%20648.917969%20460.640625%20648.839844%20460.253906%20C%20648.761719%20459.867188%20648.722656%20459.476562%20648.722656%20459.082031%20Z%20M%20648.722656%20375.082031%20L%20648.722656%20315.082031%20C%20648.722656%20314.6875%20648.761719%20314.296875%20648.839844%20313.914062%20C%20648.917969%20313.527344%20649.03125%20313.152344%20649.179688%20312.785156%20C%20649.332031%20312.421875%20649.515625%20312.078125%20649.734375%20311.75%20C%20649.953125%20311.421875%20650.203125%20311.117188%20650.480469%20310.839844%20C%20650.761719%20310.5625%20651.0625%20310.3125%20651.390625%20310.09375%20C%20651.71875%20309.875%20652.0625%20309.691406%20652.429688%20309.539062%20C%20652.792969%20309.390625%20653.167969%20309.273438%20653.554688%20309.199219%20C%20653.941406%20309.121094%20654.332031%20309.082031%20654.722656%20309.082031%20C%20655.117188%20309.082031%20655.507812%20309.121094%20655.894531%20309.199219%20C%20656.28125%20309.273438%20656.65625%20309.390625%20657.019531%20309.539062%20C%20657.382812%20309.691406%20657.730469%20309.875%20658.058594%20310.09375%20C%20658.386719%20310.3125%20658.6875%20310.5625%20658.964844%20310.839844%20C%20659.246094%20311.117188%20659.492188%20311.421875%20659.714844%20311.75%20C%20659.933594%20312.078125%20660.117188%20312.421875%20660.265625%20312.785156%20C%20660.417969%20313.152344%20660.53125%20313.527344%20660.609375%20313.914062%20C%20660.6875%20314.296875%20660.722656%20314.6875%20660.722656%20315.082031%20L%20660.722656%20375.082031%20C%20660.722656%20375.476562%20660.6875%20375.867188%20660.609375%20376.253906%20C%20660.53125%20376.640625%20660.417969%20377.015625%20660.265625%20377.378906%20C%20660.117188%20377.742188%20659.933594%20378.089844%20659.714844%20378.417969%20C%20659.492188%20378.742188%20659.246094%20379.046875%20658.964844%20379.324219%20C%20658.6875%20379.605469%20658.386719%20379.851562%20658.058594%20380.070312%20C%20657.730469%20380.289062%20657.382812%20380.476562%20657.019531%20380.625%20C%20656.65625%20380.777344%20656.28125%20380.890625%20655.894531%20380.96875%20C%20655.507812%20381.042969%20655.117188%20381.082031%20654.722656%20381.082031%20C%20654.332031%20381.082031%20653.941406%20381.042969%20653.554688%20380.96875%20C%20653.167969%20380.890625%20652.792969%20380.777344%20652.429688%20380.625%20C%20652.0625%20380.476562%20651.71875%20380.289062%20651.390625%20380.070312%20C%20651.0625%20379.851562%20650.761719%20379.605469%20650.480469%20379.324219%20C%20650.203125%20379.046875%20649.953125%20378.742188%20649.734375%20378.417969%20C%20649.515625%20378.089844%20649.332031%20377.742188%20649.179688%20377.378906%20C%20649.03125%20377.015625%20648.917969%20376.640625%20648.839844%20376.253906%20C%20648.761719%20375.867188%20648.722656%20375.476562%20648.722656%20375.082031%20Z%20M%20648.722656%20291.082031%20L%20648.722656%20231.082031%20C%20648.722656%20230.6875%20648.761719%20230.296875%20648.839844%20229.914062%20C%20648.917969%20229.527344%20649.03125%20229.152344%20649.179688%20228.785156%20C%20649.332031%20228.421875%20649.515625%20228.078125%20649.734375%20227.75%20C%20649.953125%20227.421875%20650.203125%20227.117188%20650.480469%20226.839844%20C%20650.761719%20226.5625%20651.0625%20226.3125%20651.390625%20226.09375%20C%20651.71875%20225.875%20652.0625%20225.691406%20652.429688%20225.539062%20C%20652.792969%20225.390625%20653.167969%20225.273438%20653.554688%20225.199219%20C%20653.941406%20225.121094%20654.332031%20225.082031%20654.722656%20225.082031%20C%20655.117188%20225.082031%20655.507812%20225.121094%20655.894531%20225.199219%20C%20656.28125%20225.273438%20656.65625%20225.390625%20657.019531%20225.539062%20C%20657.382812%20225.691406%20657.730469%20225.875%20658.058594%20226.09375%20C%20658.386719%20226.3125%20658.6875%20226.5625%20658.964844%20226.839844%20C%20659.246094%20227.117188%20659.492188%20227.421875%20659.714844%20227.75%20C%20659.933594%20228.078125%20660.117188%20228.421875%20660.265625%20228.785156%20C%20660.417969%20229.152344%20660.53125%20229.527344%20660.609375%20229.914062%20C%20660.6875%20230.296875%20660.722656%20230.6875%20660.722656%20231.082031%20L%20660.722656%20291.082031%20C%20660.722656%20291.476562%20660.6875%20291.867188%20660.609375%20292.253906%20C%20660.53125%20292.640625%20660.417969%20293.015625%20660.265625%20293.378906%20C%20660.117188%20293.742188%20659.933594%20294.089844%20659.714844%20294.417969%20C%20659.492188%20294.742188%20659.246094%20295.046875%20658.964844%20295.324219%20C%20658.6875%20295.605469%20658.386719%20295.851562%20658.058594%20296.070312%20C%20657.730469%20296.289062%20657.382812%20296.476562%20657.019531%20296.625%20C%20656.65625%20296.777344%20656.28125%20296.890625%20655.894531%20296.96875%20C%20655.507812%20297.042969%20655.117188%20297.082031%20654.722656%20297.082031%20C%20654.332031%20297.082031%20653.941406%20297.042969%20653.554688%20296.96875%20C%20653.167969%20296.890625%20652.792969%20296.777344%20652.429688%20296.625%20C%20652.0625%20296.476562%20651.71875%20296.289062%20651.390625%20296.070312%20C%20651.0625%20295.851562%20650.761719%20295.605469%20650.480469%20295.324219%20C%20650.203125%20295.046875%20649.953125%20294.742188%20649.734375%20294.417969%20C%20649.515625%20294.089844%20649.332031%20293.742188%20649.179688%20293.378906%20C%20649.03125%20293.015625%20648.917969%20292.640625%20648.839844%20292.253906%20C%20648.761719%20291.867188%20648.722656%20291.476562%20648.722656%20291.082031%20Z%20M%20648.722656%20207.082031%20L%20648.722656%20147.082031%20C%20648.722656%20146.6875%20648.761719%20146.300781%20648.839844%20145.914062%20C%20648.917969%20145.527344%20649.03125%20145.152344%20649.179688%20144.785156%20C%20649.332031%20144.421875%20649.515625%20144.078125%20649.734375%20143.75%20C%20649.953125%20143.421875%20650.203125%20143.117188%20650.480469%20142.839844%20C%20650.761719%20142.5625%20651.0625%20142.3125%20651.390625%20142.09375%20C%20651.71875%20141.875%20652.0625%20141.691406%20652.429688%20141.539062%20C%20652.792969%20141.390625%20653.167969%20141.273438%20653.554688%20141.199219%20C%20653.941406%20141.121094%20654.332031%20141.082031%20654.722656%20141.082031%20C%20655.117188%20141.082031%20655.507812%20141.121094%20655.894531%20141.199219%20C%20656.28125%20141.273438%20656.65625%20141.390625%20657.019531%20141.539062%20C%20657.382812%20141.691406%20657.730469%20141.875%20658.058594%20142.09375%20C%20658.386719%20142.3125%20658.6875%20142.5625%20658.964844%20142.839844%20C%20659.246094%20143.117188%20659.492188%20143.421875%20659.714844%20143.75%20C%20659.933594%20144.078125%20660.117188%20144.421875%20660.265625%20144.785156%20C%20660.417969%20145.152344%20660.53125%20145.527344%20660.609375%20145.914062%20C%20660.6875%20146.300781%20660.722656%20146.6875%20660.722656%20147.082031%20L%20660.722656%20207.082031%20C%20660.722656%20207.476562%20660.6875%20207.867188%20660.609375%20208.253906%20C%20660.53125%20208.640625%20660.417969%20209.015625%20660.265625%20209.378906%20C%20660.117188%20209.742188%20659.933594%20210.089844%20659.714844%20210.417969%20C%20659.492188%20210.742188%20659.246094%20211.046875%20658.964844%20211.324219%20C%20658.6875%20211.605469%20658.386719%20211.851562%20658.058594%20212.070312%20C%20657.730469%20212.289062%20657.382812%20212.476562%20657.019531%20212.625%20C%20656.65625%20212.777344%20656.28125%20212.890625%20655.894531%20212.96875%20C%20655.507812%20213.042969%20655.117188%20213.082031%20654.722656%20213.082031%20C%20654.332031%20213.082031%20653.941406%20213.042969%20653.554688%20212.96875%20C%20653.167969%20212.890625%20652.792969%20212.777344%20652.429688%20212.625%20C%20652.0625%20212.476562%20651.71875%20212.289062%20651.390625%20212.070312%20C%20651.0625%20211.851562%20650.761719%20211.605469%20650.480469%20211.324219%20C%20650.203125%20211.046875%20649.953125%20210.742188%20649.734375%20210.417969%20C%20649.515625%20210.089844%20649.332031%20209.742188%20649.179688%20209.378906%20C%20649.03125%20209.015625%20648.917969%20208.640625%20648.839844%20208.253906%20C%20648.761719%20207.867188%20648.722656%20207.476562%20648.722656%20207.082031%20Z%20M%20648.722656%20123.082031%20L%20648.722656%2063.082031%20C%20648.722656%2062.6875%20648.761719%2062.300781%20648.839844%2061.914062%20C%20648.917969%2061.527344%20649.03125%2061.152344%20649.179688%2060.785156%20C%20649.332031%2060.421875%20649.515625%2060.078125%20649.734375%2059.75%20C%20649.953125%2059.421875%20650.203125%2059.117188%20650.480469%2058.839844%20C%20650.761719%2058.5625%20651.0625%2058.3125%20651.390625%2058.09375%20C%20651.71875%2057.875%20652.0625%2057.691406%20652.429688%2057.539062%20C%20652.792969%2057.390625%20653.167969%2057.273438%20653.554688%2057.199219%20C%20653.941406%2057.121094%20654.332031%2057.082031%20654.722656%2057.082031%20C%20655.117188%2057.082031%20655.507812%2057.121094%20655.894531%2057.199219%20C%20656.28125%2057.273438%20656.65625%2057.390625%20657.019531%2057.539062%20C%20657.382812%2057.691406%20657.730469%2057.875%20658.058594%2058.09375%20C%20658.386719%2058.3125%20658.6875%2058.5625%20658.964844%2058.839844%20C%20659.246094%2059.117188%20659.492188%2059.421875%20659.714844%2059.75%20C%20659.933594%2060.078125%20660.117188%2060.421875%20660.265625%2060.785156%20C%20660.417969%2061.152344%20660.53125%2061.527344%20660.609375%2061.914062%20C%20660.6875%2062.300781%20660.722656%2062.6875%20660.722656%2063.082031%20L%20660.722656%20123.082031%20C%20660.722656%20123.476562%20660.6875%20123.867188%20660.609375%20124.253906%20C%20660.53125%20124.640625%20660.417969%20125.015625%20660.265625%20125.378906%20C%20660.117188%20125.742188%20659.933594%20126.089844%20659.714844%20126.417969%20C%20659.492188%20126.742188%20659.246094%20127.046875%20658.964844%20127.324219%20C%20658.6875%20127.605469%20658.386719%20127.851562%20658.058594%20128.070312%20C%20657.730469%20128.289062%20657.382812%20128.476562%20657.019531%20128.625%20C%20656.65625%20128.777344%20656.28125%20128.890625%20655.894531%20128.96875%20C%20655.507812%20129.042969%20655.117188%20129.082031%20654.722656%20129.082031%20C%20654.332031%20129.082031%20653.941406%20129.042969%20653.554688%20128.96875%20C%20653.167969%20128.890625%20652.792969%20128.777344%20652.429688%20128.625%20C%20652.0625%20128.476562%20651.71875%20128.289062%20651.390625%20128.070312%20C%20651.0625%20127.851562%20650.761719%20127.605469%20650.480469%20127.324219%20C%20650.203125%20127.046875%20649.953125%20126.742188%20649.734375%20126.417969%20C%20649.515625%20126.089844%20649.332031%20125.742188%20649.179688%20125.378906%20C%20649.03125%20125.015625%20648.917969%20124.640625%20648.839844%20124.253906%20C%20648.761719%20123.867188%20648.722656%20123.476562%20648.722656%20123.082031%20Z%20M%20648.722656%2039.082031%20L%20648.722656%2012%20C%20648.722656%2011.605469%20648.761719%2011.214844%20648.839844%2010.828125%20C%20648.917969%2010.441406%20649.03125%2010.066406%20649.179688%209.703125%20C%20649.332031%209.339844%20649.515625%208.992188%20649.734375%208.664062%20C%20649.953125%208.339844%20650.203125%208.035156%20650.480469%207.757812%20C%20650.761719%207.476562%20651.0625%207.230469%20651.390625%207.011719%20C%20651.71875%206.792969%20652.0625%206.605469%20652.429688%206.457031%20C%20652.792969%206.304688%20653.167969%206.191406%20653.554688%206.113281%20C%20653.941406%206.039062%20654.332031%206%20654.722656%206%20C%20655.117188%206%20655.507812%206.039062%20655.894531%206.113281%20C%20656.28125%206.191406%20656.65625%206.304688%20657.019531%206.457031%20C%20657.382812%206.605469%20657.730469%206.792969%20658.058594%207.011719%20C%20658.386719%207.230469%20658.6875%207.476562%20658.964844%207.757812%20C%20659.246094%208.035156%20659.492188%208.339844%20659.714844%208.664062%20C%20659.933594%208.992188%20660.117188%209.339844%20660.265625%209.703125%20C%20660.417969%2010.066406%20660.53125%2010.441406%20660.609375%2010.828125%20C%20660.6875%2011.214844%20660.722656%2011.605469%20660.722656%2012%20L%20660.722656%2039.082031%20C%20660.722656%2039.476562%20660.6875%2039.867188%20660.609375%2040.253906%20C%20660.53125%2040.640625%20660.417969%2041.015625%20660.265625%2041.378906%20C%20660.117188%2041.742188%20659.933594%2042.089844%20659.714844%2042.417969%20C%20659.492188%2042.742188%20659.246094%2043.046875%20658.964844%2043.324219%20C%20658.6875%2043.605469%20658.386719%2043.851562%20658.058594%2044.070312%20C%20657.730469%2044.289062%20657.382812%2044.476562%20657.019531%2044.625%20C%20656.65625%2044.777344%20656.28125%2044.890625%20655.894531%2044.96875%20C%20655.507812%2045.042969%20655.117188%2045.082031%20654.722656%2045.082031%20C%20654.332031%2045.082031%20653.941406%2045.042969%20653.554688%2044.96875%20C%20653.167969%2044.890625%20652.792969%2044.777344%20652.429688%2044.625%20C%20652.0625%2044.476562%20651.71875%2044.289062%20651.390625%2044.070312%20C%20651.0625%2043.851562%20650.761719%2043.605469%20650.480469%2043.324219%20C%20650.203125%2043.046875%20649.953125%2042.742188%20649.734375%2042.417969%20C%20649.515625%2042.089844%20649.332031%2041.742188%20649.179688%2041.378906%20C%20649.03125%2041.015625%20648.917969%2040.640625%20648.839844%2040.253906%20C%20648.761719%2039.867188%20648.722656%2039.476562%20648.722656%2039.082031%20Z%20M%20648.722656%2039.082031%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%20648.722656%20471.082031%20L%20588.722656%20471.082031%20C%20588.328125%20471.082031%20587.9375%20471.046875%20587.550781%20470.96875%20C%20587.164062%20470.890625%20586.789062%20470.777344%20586.425781%20470.628906%20C%20586.0625%20470.476562%20585.714844%20470.292969%20585.386719%20470.074219%20C%20585.058594%20469.855469%20584.757812%20469.605469%20584.476562%20469.328125%20C%20584.199219%20469.046875%20583.949219%20468.746094%20583.730469%20468.417969%20C%20583.511719%20468.089844%20583.328125%20467.742188%20583.175781%20467.378906%20C%20583.027344%20467.015625%20582.914062%20466.640625%20582.835938%20466.253906%20C%20582.757812%20465.867188%20582.722656%20465.476562%20582.722656%20465.082031%20C%20582.722656%20464.691406%20582.757812%20464.300781%20582.835938%20463.914062%20C%20582.914062%20463.527344%20583.027344%20463.152344%20583.175781%20462.789062%20C%20583.328125%20462.421875%20583.511719%20462.078125%20583.730469%20461.75%20C%20583.949219%20461.421875%20584.199219%20461.121094%20584.476562%20460.839844%20C%20584.757812%20460.5625%20585.058594%20460.3125%20585.386719%20460.09375%20C%20585.714844%20459.875%20586.0625%20459.691406%20586.425781%20459.539062%20C%20586.789062%20459.390625%20587.164062%20459.277344%20587.550781%20459.199219%20C%20587.9375%20459.121094%20588.328125%20459.082031%20588.722656%20459.082031%20L%20648.722656%20459.082031%20C%20649.113281%20459.082031%20649.503906%20459.121094%20649.890625%20459.199219%20C%20650.277344%20459.277344%20650.652344%20459.390625%20651.015625%20459.539062%20C%20651.382812%20459.691406%20651.726562%20459.875%20652.054688%20460.09375%20C%20652.382812%20460.3125%20652.683594%20460.5625%20652.964844%20460.839844%20C%20653.242188%20461.121094%20653.492188%20461.421875%20653.710938%20461.75%20C%20653.929688%20462.078125%20654.113281%20462.421875%20654.265625%20462.789062%20C%20654.414062%20463.152344%20654.527344%20463.527344%20654.605469%20463.914062%20C%20654.683594%20464.300781%20654.722656%20464.691406%20654.722656%20465.082031%20C%20654.722656%20465.476562%20654.683594%20465.867188%20654.605469%20466.253906%20C%20654.527344%20466.640625%20654.414062%20467.015625%20654.265625%20467.378906%20C%20654.113281%20467.742188%20653.929688%20468.089844%20653.710938%20468.417969%20C%20653.492188%20468.746094%20653.242188%20469.046875%20652.964844%20469.328125%20C%20652.683594%20469.605469%20652.382812%20469.855469%20652.054688%20470.074219%20C%20651.726562%20470.292969%20651.382812%20470.476562%20651.015625%20470.628906%20C%20650.652344%20470.777344%20650.277344%20470.890625%20649.890625%20470.96875%20C%20649.503906%20471.046875%20649.113281%20471.082031%20648.722656%20471.082031%20Z%20M%20564.722656%20471.082031%20L%20504.722656%20471.082031%20C%20504.328125%20471.082031%20503.9375%20471.046875%20503.550781%20470.96875%20C%20503.164062%20470.890625%20502.789062%20470.777344%20502.425781%20470.628906%20C%20502.0625%20470.476562%20501.714844%20470.292969%20501.386719%20470.074219%20C%20501.058594%20469.855469%20500.757812%20469.605469%20500.476562%20469.328125%20C%20500.199219%20469.046875%20499.949219%20468.746094%20499.730469%20468.417969%20C%20499.511719%20468.089844%20499.328125%20467.742188%20499.175781%20467.378906%20C%20499.027344%20467.015625%20498.914062%20466.640625%20498.835938%20466.253906%20C%20498.757812%20465.867188%20498.722656%20465.476562%20498.722656%20465.082031%20C%20498.722656%20464.691406%20498.757812%20464.300781%20498.835938%20463.914062%20C%20498.914062%20463.527344%20499.027344%20463.152344%20499.175781%20462.789062%20C%20499.328125%20462.421875%20499.511719%20462.078125%20499.730469%20461.75%20C%20499.949219%20461.421875%20500.199219%20461.121094%20500.476562%20460.839844%20C%20500.757812%20460.5625%20501.058594%20460.3125%20501.386719%20460.09375%20C%20501.714844%20459.875%20502.0625%20459.691406%20502.425781%20459.539062%20C%20502.789062%20459.390625%20503.164062%20459.277344%20503.550781%20459.199219%20C%20503.9375%20459.121094%20504.328125%20459.082031%20504.722656%20459.082031%20L%20564.722656%20459.082031%20C%20565.113281%20459.082031%20565.503906%20459.121094%20565.890625%20459.199219%20C%20566.277344%20459.277344%20566.652344%20459.390625%20567.015625%20459.539062%20C%20567.382812%20459.691406%20567.726562%20459.875%20568.054688%20460.09375%20C%20568.382812%20460.3125%20568.683594%20460.5625%20568.964844%20460.839844%20C%20569.242188%20461.121094%20569.492188%20461.421875%20569.710938%20461.75%20C%20569.929688%20462.078125%20570.113281%20462.421875%20570.265625%20462.789062%20C%20570.414062%20463.152344%20570.527344%20463.527344%20570.605469%20463.914062%20C%20570.683594%20464.300781%20570.722656%20464.691406%20570.722656%20465.082031%20C%20570.722656%20465.476562%20570.683594%20465.867188%20570.605469%20466.253906%20C%20570.527344%20466.640625%20570.414062%20467.015625%20570.265625%20467.378906%20C%20570.113281%20467.742188%20569.929688%20468.089844%20569.710938%20468.417969%20C%20569.492188%20468.746094%20569.242188%20469.046875%20568.964844%20469.328125%20C%20568.683594%20469.605469%20568.382812%20469.855469%20568.054688%20470.074219%20C%20567.726562%20470.292969%20567.382812%20470.476562%20567.015625%20470.628906%20C%20566.652344%20470.777344%20566.277344%20470.890625%20565.890625%20470.96875%20C%20565.503906%20471.046875%20565.113281%20471.082031%20564.722656%20471.082031%20Z%20M%20480.722656%20471.082031%20L%20420.722656%20471.082031%20C%20420.328125%20471.082031%20419.9375%20471.046875%20419.550781%20470.96875%20C%20419.164062%20470.890625%20418.789062%20470.777344%20418.425781%20470.628906%20C%20418.0625%20470.476562%20417.714844%20470.292969%20417.386719%20470.074219%20C%20417.058594%20469.855469%20416.757812%20469.605469%20416.476562%20469.328125%20C%20416.199219%20469.046875%20415.949219%20468.746094%20415.730469%20468.417969%20C%20415.511719%20468.089844%20415.328125%20467.742188%20415.175781%20467.378906%20C%20415.027344%20467.015625%20414.914062%20466.640625%20414.835938%20466.253906%20C%20414.757812%20465.867188%20414.722656%20465.476562%20414.722656%20465.082031%20C%20414.722656%20464.691406%20414.757812%20464.300781%20414.835938%20463.914062%20C%20414.914062%20463.527344%20415.027344%20463.152344%20415.175781%20462.789062%20C%20415.328125%20462.421875%20415.511719%20462.078125%20415.730469%20461.75%20C%20415.949219%20461.421875%20416.199219%20461.121094%20416.476562%20460.839844%20C%20416.757812%20460.5625%20417.058594%20460.3125%20417.386719%20460.09375%20C%20417.714844%20459.875%20418.0625%20459.691406%20418.425781%20459.539062%20C%20418.789062%20459.390625%20419.164062%20459.277344%20419.550781%20459.199219%20C%20419.9375%20459.121094%20420.328125%20459.082031%20420.722656%20459.082031%20L%20480.722656%20459.082031%20C%20481.113281%20459.082031%20481.503906%20459.121094%20481.890625%20459.199219%20C%20482.277344%20459.277344%20482.652344%20459.390625%20483.015625%20459.539062%20C%20483.382812%20459.691406%20483.726562%20459.875%20484.054688%20460.09375%20C%20484.382812%20460.3125%20484.683594%20460.5625%20484.964844%20460.839844%20C%20485.242188%20461.121094%20485.492188%20461.421875%20485.710938%20461.75%20C%20485.929688%20462.078125%20486.113281%20462.421875%20486.265625%20462.789062%20C%20486.414062%20463.152344%20486.527344%20463.527344%20486.605469%20463.914062%20C%20486.683594%20464.300781%20486.722656%20464.691406%20486.722656%20465.082031%20C%20486.722656%20465.476562%20486.683594%20465.867188%20486.605469%20466.253906%20C%20486.527344%20466.640625%20486.414062%20467.015625%20486.265625%20467.378906%20C%20486.113281%20467.742188%20485.929688%20468.089844%20485.710938%20468.417969%20C%20485.492188%20468.746094%20485.242188%20469.046875%20484.964844%20469.328125%20C%20484.683594%20469.605469%20484.382812%20469.855469%20484.054688%20470.074219%20C%20483.726562%20470.292969%20483.382812%20470.476562%20483.015625%20470.628906%20C%20482.652344%20470.777344%20482.277344%20470.890625%20481.890625%20470.96875%20C%20481.503906%20471.046875%20481.113281%20471.082031%20480.722656%20471.082031%20Z%20M%20396.722656%20471.082031%20L%20336.722656%20471.082031%20C%20336.328125%20471.082031%20335.9375%20471.046875%20335.550781%20470.96875%20C%20335.164062%20470.890625%20334.789062%20470.777344%20334.425781%20470.628906%20C%20334.0625%20470.476562%20333.714844%20470.292969%20333.386719%20470.074219%20C%20333.058594%20469.855469%20332.757812%20469.605469%20332.476562%20469.328125%20C%20332.199219%20469.046875%20331.949219%20468.746094%20331.730469%20468.417969%20C%20331.511719%20468.089844%20331.328125%20467.742188%20331.175781%20467.378906%20C%20331.027344%20467.015625%20330.914062%20466.640625%20330.835938%20466.253906%20C%20330.757812%20465.867188%20330.722656%20465.476562%20330.722656%20465.082031%20C%20330.722656%20464.691406%20330.757812%20464.300781%20330.835938%20463.914062%20C%20330.914062%20463.527344%20331.027344%20463.152344%20331.175781%20462.789062%20C%20331.328125%20462.421875%20331.511719%20462.078125%20331.730469%20461.75%20C%20331.949219%20461.421875%20332.199219%20461.121094%20332.476562%20460.839844%20C%20332.757812%20460.5625%20333.058594%20460.3125%20333.386719%20460.09375%20C%20333.714844%20459.875%20334.0625%20459.691406%20334.425781%20459.539062%20C%20334.789062%20459.390625%20335.164062%20459.277344%20335.550781%20459.199219%20C%20335.9375%20459.121094%20336.328125%20459.082031%20336.722656%20459.082031%20L%20396.722656%20459.082031%20C%20397.113281%20459.082031%20397.503906%20459.121094%20397.890625%20459.199219%20C%20398.277344%20459.277344%20398.652344%20459.390625%20399.015625%20459.539062%20C%20399.382812%20459.691406%20399.726562%20459.875%20400.054688%20460.09375%20C%20400.382812%20460.3125%20400.683594%20460.5625%20400.964844%20460.839844%20C%20401.242188%20461.121094%20401.492188%20461.421875%20401.710938%20461.75%20C%20401.929688%20462.078125%20402.113281%20462.421875%20402.265625%20462.789062%20C%20402.414062%20463.152344%20402.527344%20463.527344%20402.605469%20463.914062%20C%20402.683594%20464.300781%20402.722656%20464.691406%20402.722656%20465.082031%20C%20402.722656%20465.476562%20402.683594%20465.867188%20402.605469%20466.253906%20C%20402.527344%20466.640625%20402.414062%20467.015625%20402.265625%20467.378906%20C%20402.113281%20467.742188%20401.929688%20468.089844%20401.710938%20468.417969%20C%20401.492188%20468.746094%20401.242188%20469.046875%20400.964844%20469.328125%20C%20400.683594%20469.605469%20400.382812%20469.855469%20400.054688%20470.074219%20C%20399.726562%20470.292969%20399.382812%20470.476562%20399.015625%20470.628906%20C%20398.652344%20470.777344%20398.277344%20470.890625%20397.890625%20470.96875%20C%20397.503906%20471.046875%20397.113281%20471.082031%20396.722656%20471.082031%20Z%20M%20312.722656%20471.082031%20L%20252.722656%20471.082031%20C%20252.328125%20471.082031%20251.9375%20471.046875%20251.550781%20470.96875%20C%20251.164062%20470.890625%20250.789062%20470.777344%20250.425781%20470.628906%20C%20250.0625%20470.476562%20249.714844%20470.292969%20249.386719%20470.074219%20C%20249.058594%20469.855469%20248.757812%20469.605469%20248.476562%20469.328125%20C%20248.199219%20469.046875%20247.949219%20468.746094%20247.730469%20468.417969%20C%20247.511719%20468.089844%20247.328125%20467.742188%20247.175781%20467.378906%20C%20247.027344%20467.015625%20246.914062%20466.640625%20246.835938%20466.253906%20C%20246.757812%20465.867188%20246.722656%20465.476562%20246.722656%20465.082031%20C%20246.722656%20464.691406%20246.757812%20464.300781%20246.835938%20463.914062%20C%20246.914062%20463.527344%20247.027344%20463.152344%20247.175781%20462.789062%20C%20247.328125%20462.421875%20247.511719%20462.078125%20247.730469%20461.75%20C%20247.949219%20461.421875%20248.199219%20461.121094%20248.476562%20460.839844%20C%20248.757812%20460.5625%20249.058594%20460.3125%20249.386719%20460.09375%20C%20249.714844%20459.875%20250.0625%20459.691406%20250.425781%20459.539062%20C%20250.789062%20459.390625%20251.164062%20459.277344%20251.550781%20459.199219%20C%20251.9375%20459.121094%20252.328125%20459.082031%20252.722656%20459.082031%20L%20312.722656%20459.082031%20C%20313.113281%20459.082031%20313.503906%20459.121094%20313.890625%20459.199219%20C%20314.277344%20459.277344%20314.652344%20459.390625%20315.015625%20459.539062%20C%20315.382812%20459.691406%20315.726562%20459.875%20316.054688%20460.09375%20C%20316.382812%20460.3125%20316.683594%20460.5625%20316.964844%20460.839844%20C%20317.242188%20461.121094%20317.492188%20461.421875%20317.710938%20461.75%20C%20317.929688%20462.078125%20318.113281%20462.421875%20318.265625%20462.789062%20C%20318.414062%20463.152344%20318.527344%20463.527344%20318.605469%20463.914062%20C%20318.683594%20464.300781%20318.722656%20464.691406%20318.722656%20465.082031%20C%20318.722656%20465.476562%20318.683594%20465.867188%20318.605469%20466.253906%20C%20318.527344%20466.640625%20318.414062%20467.015625%20318.265625%20467.378906%20C%20318.113281%20467.742188%20317.929688%20468.089844%20317.710938%20468.417969%20C%20317.492188%20468.746094%20317.242188%20469.046875%20316.964844%20469.328125%20C%20316.683594%20469.605469%20316.382812%20469.855469%20316.054688%20470.074219%20C%20315.726562%20470.292969%20315.382812%20470.476562%20315.015625%20470.628906%20C%20314.652344%20470.777344%20314.277344%20470.890625%20313.890625%20470.96875%20C%20313.503906%20471.046875%20313.113281%20471.082031%20312.722656%20471.082031%20Z%20M%20228.722656%20471.082031%20L%20205.371094%20471.082031%20C%20204.980469%20471.082031%20204.589844%20471.046875%20204.203125%20470.96875%20C%20203.816406%20470.890625%20203.441406%20470.777344%20203.078125%20470.628906%20C%20202.710938%20470.476562%20202.367188%20470.292969%20202.039062%20470.074219%20C%20201.710938%20469.855469%20201.410156%20469.605469%20201.128906%20469.328125%20C%20200.851562%20469.046875%20200.601562%20468.746094%20200.382812%20468.417969%20C%20200.164062%20468.089844%20199.980469%20467.742188%20199.828125%20467.378906%20C%20199.679688%20467.015625%20199.566406%20466.640625%20199.488281%20466.253906%20C%20199.410156%20465.867188%20199.371094%20465.476562%20199.371094%20465.082031%20C%20199.371094%20464.691406%20199.410156%20464.300781%20199.488281%20463.914062%20C%20199.566406%20463.527344%20199.679688%20463.152344%20199.828125%20462.789062%20C%20199.980469%20462.421875%20200.164062%20462.078125%20200.382812%20461.75%20C%20200.601562%20461.421875%20200.851562%20461.121094%20201.128906%20460.839844%20C%20201.410156%20460.5625%20201.710938%20460.3125%20202.039062%20460.09375%20C%20202.367188%20459.875%20202.710938%20459.691406%20203.078125%20459.539062%20C%20203.441406%20459.390625%20203.816406%20459.277344%20204.203125%20459.199219%20C%20204.589844%20459.121094%20204.980469%20459.082031%20205.371094%20459.082031%20L%20228.722656%20459.082031%20C%20229.113281%20459.082031%20229.503906%20459.121094%20229.890625%20459.199219%20C%20230.277344%20459.277344%20230.652344%20459.390625%20231.015625%20459.539062%20C%20231.382812%20459.691406%20231.726562%20459.875%20232.054688%20460.09375%20C%20232.382812%20460.3125%20232.683594%20460.5625%20232.964844%20460.839844%20C%20233.242188%20461.121094%20233.492188%20461.421875%20233.710938%20461.75%20C%20233.929688%20462.078125%20234.113281%20462.421875%20234.265625%20462.789062%20C%20234.414062%20463.152344%20234.527344%20463.527344%20234.605469%20463.914062%20C%20234.683594%20464.300781%20234.722656%20464.691406%20234.722656%20465.082031%20C%20234.722656%20465.476562%20234.683594%20465.867188%20234.605469%20466.253906%20C%20234.527344%20466.640625%20234.414062%20467.015625%20234.265625%20467.378906%20C%20234.113281%20467.742188%20233.929688%20468.089844%20233.710938%20468.417969%20C%20233.492188%20468.746094%20233.242188%20469.046875%20232.964844%20469.328125%20C%20232.683594%20469.605469%20232.382812%20469.855469%20232.054688%20470.074219%20C%20231.726562%20470.292969%20231.382812%20470.476562%20231.015625%20470.628906%20C%20230.652344%20470.777344%20230.277344%20470.890625%20229.890625%20470.96875%20C%20229.503906%20471.046875%20229.113281%20471.082031%20228.722656%20471.082031%20Z%20M%20228.722656%20471.082031%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%20205.375%2012%20L%20205.375%2072%20C%20205.375%2072.394531%20205.335938%2072.785156%20205.261719%2073.171875%20C%20205.183594%2073.558594%20205.070312%2073.933594%20204.917969%2074.296875%20C%20204.769531%2074.660156%20204.582031%2075.007812%20204.363281%2075.335938%20C%20204.144531%2075.660156%20203.898438%2075.964844%20203.617188%2076.242188%20C%20203.339844%2076.523438%20203.039062%2076.769531%20202.710938%2076.988281%20C%20202.382812%2077.207031%20202.035156%2077.394531%20201.671875%2077.542969%20C%20201.308594%2077.695312%20200.933594%2077.808594%20200.546875%2077.886719%20C%20200.160156%2077.960938%20199.769531%2078%20199.375%2078%20C%20198.980469%2078%20198.59375%2077.960938%20198.207031%2077.886719%20C%20197.820312%2077.808594%20197.445312%2077.695312%20197.078125%2077.542969%20C%20196.714844%2077.394531%20196.371094%2077.207031%20196.042969%2076.988281%20C%20195.714844%2076.769531%20195.410156%2076.523438%20195.132812%2076.242188%20C%20194.855469%2075.964844%20194.605469%2075.660156%20194.386719%2075.335938%20C%20194.167969%2075.007812%20193.984375%2074.660156%20193.832031%2074.296875%20C%20193.683594%2073.933594%20193.566406%2073.558594%20193.492188%2073.171875%20C%20193.414062%2072.785156%20193.375%2072.394531%20193.375%2072%20L%20193.375%2012%20C%20193.375%2011.605469%20193.414062%2011.214844%20193.492188%2010.832031%20C%20193.566406%2010.445312%20193.683594%2010.070312%20193.832031%209.703125%20C%20193.984375%209.339844%20194.167969%208.996094%20194.386719%208.667969%20C%20194.605469%208.339844%20194.855469%208.035156%20195.132812%207.757812%20C%20195.410156%207.480469%20195.714844%207.230469%20196.042969%207.011719%20C%20196.371094%206.792969%20196.714844%206.609375%20197.078125%206.457031%20C%20197.445312%206.308594%20197.820312%206.191406%20198.207031%206.117188%20C%20198.59375%206.039062%20198.980469%206%20199.375%206%20C%20199.769531%206%20200.160156%206.039062%20200.546875%206.117188%20C%20200.933594%206.191406%20201.308594%206.308594%20201.671875%206.457031%20C%20202.035156%206.609375%20202.382812%206.792969%20202.710938%207.011719%20C%20203.039062%207.230469%20203.339844%207.480469%20203.617188%207.757812%20C%20203.898438%208.035156%20204.144531%208.339844%20204.363281%208.667969%20C%20204.582031%208.996094%20204.769531%209.339844%20204.917969%209.703125%20C%20205.070312%2010.070312%20205.183594%2010.445312%20205.261719%2010.832031%20C%20205.335938%2011.214844%20205.375%2011.605469%20205.375%2012%20Z%20M%20205.375%2096%20L%20205.375%20156%20C%20205.375%20156.394531%20205.335938%20156.785156%20205.261719%20157.171875%20C%20205.183594%20157.558594%20205.070312%20157.933594%20204.917969%20158.296875%20C%20204.769531%20158.660156%20204.582031%20159.007812%20204.363281%20159.335938%20C%20204.144531%20159.660156%20203.898438%20159.964844%20203.617188%20160.242188%20C%20203.339844%20160.523438%20203.039062%20160.769531%20202.710938%20160.988281%20C%20202.382812%20161.207031%20202.035156%20161.394531%20201.671875%20161.542969%20C%20201.308594%20161.695312%20200.933594%20161.808594%20200.546875%20161.886719%20C%20200.160156%20161.960938%20199.769531%20162%20199.375%20162%20C%20198.980469%20162%20198.59375%20161.960938%20198.207031%20161.886719%20C%20197.820312%20161.808594%20197.445312%20161.695312%20197.078125%20161.542969%20C%20196.714844%20161.394531%20196.371094%20161.207031%20196.042969%20160.988281%20C%20195.714844%20160.769531%20195.410156%20160.523438%20195.132812%20160.242188%20C%20194.855469%20159.964844%20194.605469%20159.660156%20194.386719%20159.335938%20C%20194.167969%20159.007812%20193.984375%20158.660156%20193.832031%20158.296875%20C%20193.683594%20157.933594%20193.566406%20157.558594%20193.492188%20157.171875%20C%20193.414062%20156.785156%20193.375%20156.394531%20193.375%20156%20L%20193.375%2096%20C%20193.375%2095.605469%20193.414062%2095.214844%20193.492188%2094.832031%20C%20193.566406%2094.445312%20193.683594%2094.070312%20193.832031%2093.703125%20C%20193.984375%2093.339844%20194.167969%2092.996094%20194.386719%2092.667969%20C%20194.605469%2092.339844%20194.855469%2092.035156%20195.132812%2091.757812%20C%20195.410156%2091.480469%20195.714844%2091.230469%20196.042969%2091.011719%20C%20196.371094%2090.792969%20196.714844%2090.609375%20197.078125%2090.457031%20C%20197.445312%2090.308594%20197.820312%2090.191406%20198.207031%2090.117188%20C%20198.59375%2090.039062%20198.980469%2090%20199.375%2090%20C%20199.769531%2090%20200.160156%2090.039062%20200.546875%2090.117188%20C%20200.933594%2090.191406%20201.308594%2090.308594%20201.671875%2090.457031%20C%20202.035156%2090.609375%20202.382812%2090.792969%20202.710938%2091.011719%20C%20203.039062%2091.230469%20203.339844%2091.480469%20203.617188%2091.757812%20C%20203.898438%2092.035156%20204.144531%2092.339844%20204.363281%2092.667969%20C%20204.582031%2092.996094%20204.769531%2093.339844%20204.917969%2093.703125%20C%20205.070312%2094.070312%20205.183594%2094.445312%20205.261719%2094.832031%20C%20205.335938%2095.214844%20205.375%2095.605469%20205.375%2096%20Z%20M%20205.375%20180%20L%20205.375%20240%20C%20205.375%20240.394531%20205.335938%20240.785156%20205.261719%20241.171875%20C%20205.183594%20241.558594%20205.070312%20241.933594%20204.917969%20242.296875%20C%20204.769531%20242.660156%20204.582031%20243.007812%20204.363281%20243.335938%20C%20204.144531%20243.660156%20203.898438%20243.964844%20203.617188%20244.242188%20C%20203.339844%20244.523438%20203.039062%20244.769531%20202.710938%20244.988281%20C%20202.382812%20245.207031%20202.035156%20245.394531%20201.671875%20245.542969%20C%20201.308594%20245.695312%20200.933594%20245.808594%20200.546875%20245.886719%20C%20200.160156%20245.960938%20199.769531%20246%20199.375%20246%20C%20198.980469%20246%20198.59375%20245.960938%20198.207031%20245.886719%20C%20197.820312%20245.808594%20197.445312%20245.695312%20197.078125%20245.542969%20C%20196.714844%20245.394531%20196.371094%20245.207031%20196.042969%20244.988281%20C%20195.714844%20244.769531%20195.410156%20244.523438%20195.132812%20244.242188%20C%20194.855469%20243.964844%20194.605469%20243.660156%20194.386719%20243.335938%20C%20194.167969%20243.007812%20193.984375%20242.660156%20193.832031%20242.296875%20C%20193.683594%20241.933594%20193.566406%20241.558594%20193.492188%20241.171875%20C%20193.414062%20240.785156%20193.375%20240.394531%20193.375%20240%20L%20193.375%20180%20C%20193.375%20179.605469%20193.414062%20179.214844%20193.492188%20178.832031%20C%20193.566406%20178.445312%20193.683594%20178.070312%20193.832031%20177.703125%20C%20193.984375%20177.339844%20194.167969%20176.996094%20194.386719%20176.667969%20C%20194.605469%20176.339844%20194.855469%20176.035156%20195.132812%20175.757812%20C%20195.410156%20175.480469%20195.714844%20175.230469%20196.042969%20175.011719%20C%20196.371094%20174.792969%20196.714844%20174.609375%20197.078125%20174.457031%20C%20197.445312%20174.308594%20197.820312%20174.191406%20198.207031%20174.117188%20C%20198.59375%20174.039062%20198.980469%20174%20199.375%20174%20C%20199.769531%20174%20200.160156%20174.039062%20200.546875%20174.117188%20C%20200.933594%20174.191406%20201.308594%20174.308594%20201.671875%20174.457031%20C%20202.035156%20174.609375%20202.382812%20174.792969%20202.710938%20175.011719%20C%20203.039062%20175.230469%20203.339844%20175.480469%20203.617188%20175.757812%20C%20203.898438%20176.035156%20204.144531%20176.339844%20204.363281%20176.667969%20C%20204.582031%20176.996094%20204.769531%20177.339844%20204.917969%20177.703125%20C%20205.070312%20178.070312%20205.183594%20178.445312%20205.261719%20178.832031%20C%20205.335938%20179.214844%20205.375%20179.605469%20205.375%20180%20Z%20M%20205.375%20264%20L%20205.375%20324%20C%20205.375%20324.394531%20205.335938%20324.785156%20205.261719%20325.171875%20C%20205.183594%20325.558594%20205.070312%20325.933594%20204.917969%20326.296875%20C%20204.769531%20326.660156%20204.582031%20327.007812%20204.363281%20327.335938%20C%20204.144531%20327.660156%20203.898438%20327.964844%20203.617188%20328.242188%20C%20203.339844%20328.523438%20203.039062%20328.769531%20202.710938%20328.988281%20C%20202.382812%20329.207031%20202.035156%20329.394531%20201.671875%20329.542969%20C%20201.308594%20329.695312%20200.933594%20329.808594%20200.546875%20329.886719%20C%20200.160156%20329.960938%20199.769531%20330%20199.375%20330%20C%20198.980469%20330%20198.59375%20329.960938%20198.207031%20329.886719%20C%20197.820312%20329.808594%20197.445312%20329.695312%20197.078125%20329.542969%20C%20196.714844%20329.394531%20196.371094%20329.207031%20196.042969%20328.988281%20C%20195.714844%20328.769531%20195.410156%20328.523438%20195.132812%20328.242188%20C%20194.855469%20327.964844%20194.605469%20327.660156%20194.386719%20327.335938%20C%20194.167969%20327.007812%20193.984375%20326.660156%20193.832031%20326.296875%20C%20193.683594%20325.933594%20193.566406%20325.558594%20193.492188%20325.171875%20C%20193.414062%20324.785156%20193.375%20324.394531%20193.375%20324%20L%20193.375%20264%20C%20193.375%20263.605469%20193.414062%20263.214844%20193.492188%20262.832031%20C%20193.566406%20262.445312%20193.683594%20262.070312%20193.832031%20261.703125%20C%20193.984375%20261.339844%20194.167969%20260.996094%20194.386719%20260.667969%20C%20194.605469%20260.339844%20194.855469%20260.035156%20195.132812%20259.757812%20C%20195.410156%20259.480469%20195.714844%20259.230469%20196.042969%20259.011719%20C%20196.371094%20258.792969%20196.714844%20258.609375%20197.078125%20258.457031%20C%20197.445312%20258.308594%20197.820312%20258.191406%20198.207031%20258.117188%20C%20198.59375%20258.039062%20198.980469%20258%20199.375%20258%20C%20199.769531%20258%20200.160156%20258.039062%20200.546875%20258.117188%20C%20200.933594%20258.191406%20201.308594%20258.308594%20201.671875%20258.457031%20C%20202.035156%20258.609375%20202.382812%20258.792969%20202.710938%20259.011719%20C%20203.039062%20259.230469%20203.339844%20259.480469%20203.617188%20259.757812%20C%20203.898438%20260.035156%20204.144531%20260.339844%20204.363281%20260.667969%20C%20204.582031%20260.996094%20204.769531%20261.339844%20204.917969%20261.703125%20C%20205.070312%20262.070312%20205.183594%20262.445312%20205.261719%20262.832031%20C%20205.335938%20263.214844%20205.375%20263.605469%20205.375%20264%20Z%20M%20205.375%20348%20L%20205.375%20408%20C%20205.375%20408.394531%20205.335938%20408.785156%20205.261719%20409.171875%20C%20205.183594%20409.558594%20205.070312%20409.933594%20204.917969%20410.296875%20C%20204.769531%20410.660156%20204.582031%20411.007812%20204.363281%20411.335938%20C%20204.144531%20411.660156%20203.898438%20411.964844%20203.617188%20412.242188%20C%20203.339844%20412.523438%20203.039062%20412.769531%20202.710938%20412.988281%20C%20202.382812%20413.207031%20202.035156%20413.394531%20201.671875%20413.542969%20C%20201.308594%20413.695312%20200.933594%20413.808594%20200.546875%20413.886719%20C%20200.160156%20413.960938%20199.769531%20414%20199.375%20414%20C%20198.980469%20414%20198.59375%20413.960938%20198.207031%20413.886719%20C%20197.820312%20413.808594%20197.445312%20413.695312%20197.078125%20413.542969%20C%20196.714844%20413.394531%20196.371094%20413.207031%20196.042969%20412.988281%20C%20195.714844%20412.769531%20195.410156%20412.523438%20195.132812%20412.242188%20C%20194.855469%20411.964844%20194.605469%20411.660156%20194.386719%20411.335938%20C%20194.167969%20411.007812%20193.984375%20410.660156%20193.832031%20410.296875%20C%20193.683594%20409.933594%20193.566406%20409.558594%20193.492188%20409.171875%20C%20193.414062%20408.785156%20193.375%20408.394531%20193.375%20408%20L%20193.375%20348%20C%20193.375%20347.605469%20193.414062%20347.214844%20193.492188%20346.832031%20C%20193.566406%20346.445312%20193.683594%20346.070312%20193.832031%20345.703125%20C%20193.984375%20345.339844%20194.167969%20344.996094%20194.386719%20344.667969%20C%20194.605469%20344.339844%20194.855469%20344.035156%20195.132812%20343.757812%20C%20195.410156%20343.480469%20195.714844%20343.230469%20196.042969%20343.011719%20C%20196.371094%20342.792969%20196.714844%20342.609375%20197.078125%20342.457031%20C%20197.445312%20342.308594%20197.820312%20342.191406%20198.207031%20342.117188%20C%20198.59375%20342.039062%20198.980469%20342%20199.375%20342%20C%20199.769531%20342%20200.160156%20342.039062%20200.546875%20342.117188%20C%20200.933594%20342.191406%20201.308594%20342.308594%20201.671875%20342.457031%20C%20202.035156%20342.609375%20202.382812%20342.792969%20202.710938%20343.011719%20C%20203.039062%20343.230469%20203.339844%20343.480469%20203.617188%20343.757812%20C%20203.898438%20344.035156%20204.144531%20344.339844%20204.363281%20344.667969%20C%20204.582031%20344.996094%20204.769531%20345.339844%20204.917969%20345.703125%20C%20205.070312%20346.070312%20205.183594%20346.445312%20205.261719%20346.832031%20C%20205.335938%20347.214844%20205.375%20347.605469%20205.375%20348%20Z%20M%20205.375%20432%20L%20205.375%20459.085938%20C%20205.375%20459.480469%20205.335938%20459.867188%20205.261719%20460.253906%20C%20205.183594%20460.640625%20205.070312%20461.015625%20204.917969%20461.378906%20C%20204.769531%20461.746094%20204.582031%20462.089844%20204.363281%20462.417969%20C%20204.144531%20462.746094%20203.898438%20463.046875%20203.617188%20463.328125%20C%20203.339844%20463.605469%20203.039062%20463.855469%20202.710938%20464.074219%20C%20202.382812%20464.292969%20202.035156%20464.476562%20201.671875%20464.628906%20C%20201.308594%20464.777344%20200.933594%20464.890625%20200.546875%20464.96875%20C%20200.160156%20465.046875%20199.769531%20465.085938%20199.375%20465.085938%20C%20198.980469%20465.085938%20198.59375%20465.046875%20198.207031%20464.96875%20C%20197.820312%20464.890625%20197.445312%20464.777344%20197.078125%20464.628906%20C%20196.714844%20464.476562%20196.371094%20464.292969%20196.042969%20464.074219%20C%20195.714844%20463.855469%20195.410156%20463.605469%20195.132812%20463.328125%20C%20194.855469%20463.046875%20194.605469%20462.746094%20194.386719%20462.417969%20C%20194.167969%20462.089844%20193.984375%20461.746094%20193.832031%20461.378906%20C%20193.683594%20461.015625%20193.566406%20460.640625%20193.492188%20460.253906%20C%20193.414062%20459.867188%20193.375%20459.480469%20193.375%20459.085938%20L%20193.375%20432%20C%20193.375%20431.605469%20193.414062%20431.214844%20193.492188%20430.832031%20C%20193.566406%20430.445312%20193.683594%20430.070312%20193.832031%20429.703125%20C%20193.984375%20429.339844%20194.167969%20428.996094%20194.386719%20428.667969%20C%20194.605469%20428.339844%20194.855469%20428.035156%20195.132812%20427.757812%20C%20195.410156%20427.480469%20195.714844%20427.230469%20196.042969%20427.011719%20C%20196.371094%20426.792969%20196.714844%20426.609375%20197.078125%20426.457031%20C%20197.445312%20426.308594%20197.820312%20426.191406%20198.207031%20426.117188%20C%20198.59375%20426.039062%20198.980469%20426%20199.375%20426%20C%20199.769531%20426%20200.160156%20426.039062%20200.546875%20426.117188%20C%20200.933594%20426.191406%20201.308594%20426.308594%20201.671875%20426.457031%20C%20202.035156%20426.609375%20202.382812%20426.792969%20202.710938%20427.011719%20C%20203.039062%20427.230469%20203.339844%20427.480469%20203.617188%20427.757812%20C%20203.898438%20428.035156%20204.144531%20428.339844%20204.363281%20428.667969%20C%20204.582031%20428.996094%20204.769531%20429.339844%20204.917969%20429.703125%20C%20205.070312%20430.070312%20205.183594%20430.445312%20205.261719%20430.832031%20C%20205.335938%20431.214844%20205.375%20431.605469%20205.375%20432%20Z%20M%20205.375%20432%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%20199.1875%2014.484375%20L%20155.839844%2055.96875%20C%20155.554688%2056.242188%20155.246094%2056.484375%20154.914062%2056.695312%20C%20154.582031%2056.90625%20154.230469%2057.082031%20153.863281%2057.226562%20C%20153.496094%2057.371094%20153.117188%2057.476562%20152.730469%2057.542969%20C%20152.34375%2057.613281%20151.953125%2057.640625%20151.558594%2057.632812%20C%20151.164062%2057.625%20150.773438%2057.578125%20150.390625%2057.492188%20C%20150.007812%2057.40625%20149.632812%2057.285156%20149.273438%2057.125%20C%20148.914062%2056.96875%20148.570312%2056.773438%20148.246094%2056.546875%20C%20147.925781%2056.324219%20147.628906%2056.066406%20147.355469%2055.78125%20C%20147.082031%2055.496094%20146.839844%2055.1875%20146.628906%2054.855469%20C%20146.417969%2054.523438%20146.242188%2054.175781%20146.097656%2053.808594%20C%20145.953125%2053.441406%20145.847656%2053.0625%20145.78125%2052.675781%20C%20145.710938%2052.289062%20145.683594%2051.894531%20145.691406%2051.503906%20C%20145.699219%2051.109375%20145.746094%2050.71875%20145.832031%2050.335938%20C%20145.917969%2049.949219%20146.039062%2049.578125%20146.199219%2049.214844%20C%20146.355469%2048.855469%20146.550781%2048.515625%20146.777344%2048.191406%20C%20147%2047.871094%20147.257812%2047.570312%20147.542969%2047.300781%20L%20190.890625%205.816406%20C%20191.175781%205.542969%20191.484375%205.300781%20191.816406%205.089844%20C%20192.148438%204.878906%20192.496094%204.699219%20192.863281%204.558594%20C%20193.230469%204.414062%20193.609375%204.308594%20193.996094%204.242188%20C%20194.386719%204.171875%20194.777344%204.144531%20195.171875%204.152344%20C%20195.5625%204.160156%20195.953125%204.207031%20196.335938%204.292969%20C%20196.722656%204.378906%20197.09375%204.5%20197.457031%204.660156%20C%20197.816406%204.816406%20198.15625%205.007812%20198.480469%205.234375%20C%20198.804688%205.460938%20199.101562%205.71875%20199.375%206%20C%20199.644531%206.285156%20199.886719%206.59375%20200.097656%206.925781%20C%20200.3125%207.257812%20200.488281%207.609375%20200.628906%207.976562%20C%20200.773438%208.34375%20200.878906%208.722656%20200.945312%209.109375%20C%20201.015625%209.496094%20201.046875%209.886719%20201.035156%2010.28125%20C%20201.027344%2010.675781%20200.980469%2011.066406%20200.894531%2011.449219%20C%20200.808594%2011.835938%20200.6875%2012.207031%20200.53125%2012.566406%20C%20200.371094%2012.929688%20200.179688%2013.269531%20199.953125%2013.59375%20C%20199.726562%2013.914062%20199.472656%2014.210938%20199.1875%2014.484375%20Z%20M%20138.5%2072.5625%20L%2095.152344%20114.046875%20C%2094.867188%20114.320312%2094.558594%20114.5625%2094.226562%20114.773438%20C%2093.894531%20114.984375%2093.542969%20115.160156%2093.175781%20115.304688%20C%2092.808594%20115.445312%2092.429688%20115.550781%2092.042969%20115.621094%20C%2091.65625%20115.6875%2091.265625%20115.71875%2090.871094%20115.710938%20C%2090.476562%20115.703125%2090.085938%20115.65625%2089.703125%20115.570312%20C%2089.320312%20115.484375%2088.945312%20115.363281%2088.585938%20115.203125%20C%2088.226562%20115.042969%2087.882812%20114.851562%2087.558594%20114.625%20C%2087.238281%20114.398438%2086.941406%20114.144531%2086.667969%20113.859375%20C%2086.394531%20113.574219%2086.152344%20113.265625%2085.941406%20112.933594%20C%2085.730469%20112.601562%2085.554688%20112.253906%2085.410156%20111.886719%20C%2085.265625%20111.519531%2085.160156%20111.140625%2085.09375%20110.753906%20C%2085.023438%20110.363281%2084.996094%20109.972656%2085.003906%20109.578125%20C%2085.011719%20109.1875%2085.058594%20108.796875%2085.144531%20108.414062%20C%2085.230469%20108.027344%2085.351562%20107.65625%2085.511719%20107.292969%20C%2085.667969%20106.933594%2085.863281%20106.59375%2086.089844%20106.269531%20C%2086.3125%20105.945312%2086.570312%20105.648438%2086.855469%20105.378906%20L%20130.203125%2063.894531%20C%20130.488281%2063.621094%20130.796875%2063.378906%20131.128906%2063.167969%20C%20131.460938%2062.957031%20131.808594%2062.777344%20132.175781%2062.636719%20C%20132.542969%2062.492188%20132.921875%2062.386719%20133.308594%2062.320312%20C%20133.699219%2062.25%20134.089844%2062.21875%20134.484375%2062.230469%20C%20134.875%2062.238281%20135.265625%2062.285156%20135.648438%2062.371094%20C%20136.035156%2062.457031%20136.40625%2062.578125%20136.769531%2062.734375%20C%20137.128906%2062.894531%20137.46875%2063.085938%20137.792969%2063.3125%20C%20138.117188%2063.539062%20138.414062%2063.792969%20138.6875%2064.078125%20C%20138.957031%2064.363281%20139.199219%2064.671875%20139.410156%2065.003906%20C%20139.625%2065.335938%20139.800781%2065.6875%20139.941406%2066.054688%20C%20140.085938%2066.421875%20140.191406%2066.796875%20140.257812%2067.1875%20C%20140.328125%2067.574219%20140.359375%2067.964844%20140.347656%2068.359375%20C%20140.339844%2068.753906%20140.292969%2069.144531%20140.207031%2069.527344%20C%20140.121094%2069.910156%20140%2070.285156%20139.84375%2070.644531%20C%20139.683594%2071.003906%20139.492188%2071.347656%20139.265625%2071.671875%20C%20139.039062%2071.992188%20138.785156%2072.289062%20138.5%2072.5625%20Z%20M%2077.8125%20130.640625%20L%2034.464844%20172.125%20C%2034.179688%20172.398438%2033.871094%20172.640625%2033.539062%20172.851562%20C%2033.207031%20173.0625%2032.855469%20173.238281%2032.488281%20173.382812%20C%2032.121094%20173.523438%2031.742188%20173.628906%2031.355469%20173.699219%20C%2030.96875%20173.765625%2030.578125%20173.796875%2030.183594%20173.789062%20C%2029.789062%20173.78125%2029.398438%20173.734375%2029.015625%20173.648438%20C%2028.632812%20173.5625%2028.257812%20173.441406%2027.898438%20173.28125%20C%2027.539062%20173.121094%2027.195312%20172.929688%2026.871094%20172.703125%20C%2026.550781%20172.476562%2026.253906%20172.222656%2025.980469%20171.9375%20C%2025.707031%20171.652344%2025.464844%20171.34375%2025.253906%20171.011719%20C%2025.042969%20170.679688%2024.867188%20170.332031%2024.722656%20169.964844%20C%2024.578125%20169.597656%2024.472656%20169.21875%2024.40625%20168.832031%20C%2024.335938%20168.441406%2024.308594%20168.050781%2024.316406%20167.65625%20C%2024.324219%20167.265625%2024.371094%20166.875%2024.457031%20166.488281%20C%2024.542969%20166.105469%2024.664062%20165.734375%2024.824219%20165.371094%20C%2024.980469%20165.011719%2025.175781%20164.671875%2025.402344%20164.347656%20C%2025.625%20164.023438%2025.882812%20163.726562%2026.167969%20163.453125%20L%2069.515625%20121.96875%20C%2069.800781%20121.699219%2070.109375%20121.457031%2070.441406%20121.246094%20C%2070.773438%20121.03125%2071.121094%20120.855469%2071.488281%20120.714844%20C%2071.855469%20120.570312%2072.234375%20120.464844%2072.621094%20120.398438%20C%2073.011719%20120.328125%2073.402344%20120.296875%2073.796875%20120.308594%20C%2074.1875%20120.316406%2074.578125%20120.363281%2074.960938%20120.449219%20C%2075.347656%20120.535156%2075.71875%20120.65625%2076.082031%20120.8125%20C%2076.441406%20120.972656%2076.78125%20121.164062%2077.105469%20121.390625%20C%2077.429688%20121.617188%2077.726562%20121.871094%2078%20122.15625%20C%2078.269531%20122.441406%2078.511719%20122.75%2078.722656%20123.082031%20C%2078.9375%20123.414062%2079.113281%20123.765625%2079.253906%20124.132812%20C%2079.398438%20124.5%2079.503906%20124.875%2079.570312%20125.265625%20C%2079.640625%20125.652344%2079.671875%20126.042969%2079.660156%20126.4375%20C%2079.652344%20126.832031%2079.605469%20127.21875%2079.519531%20127.605469%20C%2079.433594%20127.988281%2079.3125%20128.363281%2079.15625%20128.722656%20C%2078.996094%20129.082031%2078.804688%20129.425781%2078.578125%20129.746094%20C%2078.351562%20130.070312%2078.097656%20130.367188%2077.8125%20130.640625%20Z%20M%2017.125%20188.71875%20L%2014.480469%20191.25%20C%2014.195312%20191.523438%2013.886719%20191.761719%2013.554688%20191.976562%20C%2013.222656%20192.1875%2012.871094%20192.363281%2012.503906%20192.507812%20C%2012.136719%20192.648438%2011.761719%20192.753906%2011.371094%20192.824219%20C%2010.984375%20192.890625%2010.59375%20192.921875%2010.199219%20192.914062%20C%209.804688%20192.902344%209.414062%20192.855469%209.03125%20192.773438%20C%208.648438%20192.6875%208.273438%20192.566406%207.914062%20192.40625%20C%207.554688%20192.246094%207.210938%20192.054688%206.886719%20191.828125%20C%206.566406%20191.601562%206.269531%20191.347656%205.996094%20191.0625%20C%205.722656%20190.777344%205.480469%20190.46875%205.269531%20190.136719%20C%205.058594%20189.804688%204.882812%20189.457031%204.738281%20189.089844%20C%204.597656%20188.722656%204.492188%20188.34375%204.421875%20187.957031%20C%204.355469%20187.566406%204.324219%20187.175781%204.332031%20186.78125%20C%204.339844%20186.390625%204.386719%20186%204.472656%20185.613281%20C%204.558594%20185.230469%204.679688%20184.859375%204.839844%20184.496094%20C%205%20184.136719%205.191406%20183.792969%205.417969%20183.472656%20C%205.640625%20183.148438%205.898438%20182.851562%206.183594%20182.578125%20L%208.828125%20180.046875%20C%209.113281%20179.777344%209.421875%20179.535156%209.753906%20179.324219%20C%2010.085938%20179.109375%2010.433594%20178.933594%2010.800781%20178.789062%20C%2011.167969%20178.648438%2011.546875%20178.542969%2011.933594%20178.472656%20C%2012.324219%20178.40625%2012.714844%20178.375%2013.109375%20178.382812%20C%2013.5%20178.394531%2013.890625%20178.441406%2014.273438%20178.527344%20C%2014.660156%20178.609375%2015.03125%20178.734375%2015.394531%20178.890625%20C%2015.753906%20179.050781%2016.09375%20179.242188%2016.417969%20179.46875%20C%2016.742188%20179.695312%2017.039062%20179.949219%2017.308594%20180.234375%20C%2017.582031%20180.519531%2017.824219%20180.828125%2018.035156%20181.160156%20C%2018.25%20181.492188%2018.425781%20181.84375%2018.566406%20182.210938%20C%2018.710938%20182.578125%2018.816406%20182.953125%2018.882812%20183.34375%20C%2018.953125%20183.730469%2018.984375%20184.121094%2018.972656%20184.515625%20C%2018.964844%20184.910156%2018.917969%20185.296875%2018.832031%20185.683594%20C%2018.746094%20186.066406%2018.625%20186.441406%2018.46875%20186.800781%20C%2018.308594%20187.160156%2018.117188%20187.503906%2017.890625%20187.824219%20C%2017.664062%20188.148438%2017.410156%20188.445312%2017.125%20188.71875%20Z%20M%2017.125%20188.71875%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%206.199219%20641.035156%20L%2049.617188%20599.625%20C%2049.902344%20599.351562%2050.210938%20599.109375%2050.542969%20598.898438%20C%2050.878906%20598.6875%2051.226562%20598.511719%2051.59375%20598.371094%20C%2051.960938%20598.226562%2052.339844%20598.125%2052.726562%20598.054688%20C%2053.117188%20597.988281%2053.507812%20597.957031%2053.902344%20597.96875%20C%2054.292969%20597.976562%2054.683594%20598.023438%2055.070312%20598.109375%20C%2055.453125%20598.195312%2055.824219%20598.320312%2056.1875%20598.480469%20C%2056.546875%20598.636719%2056.886719%20598.832031%2057.210938%20599.058594%20C%2057.53125%20599.285156%2057.828125%20599.539062%2058.101562%20599.824219%20C%2058.371094%20600.109375%2058.613281%20600.417969%2058.824219%20600.75%20C%2059.035156%20601.085938%2059.214844%20601.433594%2059.355469%20601.800781%20C%2059.496094%20602.167969%2059.601562%20602.546875%2059.667969%20602.933594%20C%2059.738281%20603.324219%2059.765625%20603.714844%2059.757812%20604.109375%20C%2059.75%20604.503906%2059.699219%20604.890625%2059.613281%20605.277344%20C%2059.527344%20605.660156%2059.40625%20606.03125%2059.246094%20606.394531%20C%2059.085938%20606.753906%2058.894531%20607.09375%2058.667969%20607.417969%20C%2058.441406%20607.738281%2058.183594%20608.035156%2057.898438%20608.308594%20L%2014.480469%20649.71875%20C%2014.195312%20649.992188%2013.886719%20650.230469%2013.554688%20650.445312%20C%2013.222656%20650.65625%2012.871094%20650.832031%2012.503906%20650.972656%20C%2012.136719%20651.117188%2011.761719%20651.21875%2011.371094%20651.289062%20C%2010.984375%20651.355469%2010.59375%20651.386719%2010.199219%20651.375%20C%209.804688%20651.367188%209.414062%20651.320312%209.03125%20651.234375%20C%208.648438%20651.148438%208.273438%20651.023438%207.914062%20650.863281%20C%207.554688%20650.707031%207.210938%20650.511719%206.890625%20650.285156%20C%206.566406%20650.058594%206.269531%20649.804688%206%20649.519531%20C%205.726562%20649.234375%205.484375%20648.925781%205.273438%20648.589844%20C%205.0625%20648.257812%204.886719%20647.910156%204.746094%20647.542969%20C%204.601562%20647.175781%204.496094%20646.796875%204.429688%20646.40625%20C%204.363281%20646.019531%204.332031%20645.628906%204.34375%20645.234375%20C%204.351562%20644.839844%204.398438%20644.453125%204.484375%20644.066406%20C%204.570312%20643.683594%204.695312%20643.3125%204.851562%20642.949219%20C%205.011719%20642.589844%205.207031%20642.25%205.433594%20641.925781%20C%205.660156%20641.605469%205.914062%20641.308594%206.199219%20641.035156%20Z%20M%2066.984375%20583.058594%20L%20110.402344%20541.648438%20C%20110.6875%20541.378906%20110.996094%20541.136719%20111.328125%20540.925781%20C%20111.664062%20540.714844%20112.011719%20540.539062%20112.378906%20540.394531%20C%20112.746094%20540.253906%20113.125%20540.148438%20113.511719%20540.082031%20C%20113.902344%20540.011719%20114.292969%20539.984375%20114.6875%20539.992188%20C%20115.082031%20540.003906%20115.46875%20540.050781%20115.855469%20540.136719%20C%20116.238281%20540.222656%20116.609375%20540.34375%20116.972656%20540.503906%20C%20117.332031%20540.664062%20117.671875%20540.855469%20117.996094%20541.082031%20C%20118.316406%20541.308594%20118.613281%20541.566406%20118.886719%20541.851562%20C%20119.160156%20542.136719%20119.398438%20542.445312%20119.609375%20542.777344%20C%20119.820312%20543.109375%20120%20543.460938%20120.140625%20543.828125%20C%20120.28125%20544.195312%20120.386719%20544.570312%20120.457031%20544.960938%20C%20120.523438%20545.347656%20120.550781%20545.738281%20120.542969%20546.132812%20C%20120.535156%20546.527344%20120.484375%20546.914062%20120.398438%20547.300781%20C%20120.3125%20547.683594%20120.191406%20548.058594%20120.03125%20548.417969%20C%20119.871094%20548.777344%20119.679688%20549.121094%20119.453125%20549.441406%20C%20119.226562%20549.765625%20118.96875%20550.0625%20118.6875%20550.332031%20L%2075.265625%20591.742188%20C%2074.980469%20592.015625%2074.671875%20592.257812%2074.339844%20592.46875%20C%2074.007812%20592.679688%2073.65625%20592.855469%2073.289062%20592.996094%20C%2072.921875%20593.140625%2072.546875%20593.246094%2072.15625%20593.3125%20C%2071.769531%20593.378906%2071.378906%20593.410156%2070.984375%20593.398438%20C%2070.589844%20593.390625%2070.203125%20593.34375%2069.816406%20593.257812%20C%2069.433594%20593.171875%2069.058594%20593.046875%2068.699219%20592.890625%20C%2068.339844%20592.730469%2068%20592.535156%2067.675781%20592.308594%20C%2067.355469%20592.082031%2067.054688%20591.828125%2066.785156%20591.542969%20C%2066.511719%20591.257812%2066.269531%20590.949219%2066.058594%20590.617188%20C%2065.847656%20590.285156%2065.671875%20589.933594%2065.53125%20589.566406%20C%2065.386719%20589.199219%2065.285156%20588.820312%2065.214844%20588.433594%20C%2065.148438%20588.042969%2065.117188%20587.652344%2065.128906%20587.261719%20C%2065.136719%20586.867188%2065.183594%20586.476562%2065.269531%20586.09375%20C%2065.355469%20585.707031%2065.480469%20585.335938%2065.640625%20584.976562%20C%2065.796875%20584.613281%2065.992188%20584.273438%2066.21875%20583.953125%20C%2066.445312%20583.628906%2066.699219%20583.332031%2066.984375%20583.058594%20Z%20M%20127.769531%20525.085938%20L%20171.1875%20483.675781%20C%20171.472656%20483.402344%20171.78125%20483.160156%20172.117188%20482.949219%20C%20172.449219%20482.738281%20172.796875%20482.5625%20173.164062%20482.417969%20C%20173.53125%20482.277344%20173.910156%20482.171875%20174.300781%20482.105469%20C%20174.6875%20482.039062%20175.078125%20482.007812%20175.472656%20482.015625%20C%20175.867188%20482.027344%20176.253906%20482.074219%20176.640625%20482.160156%20C%20177.023438%20482.246094%20177.394531%20482.367188%20177.757812%20482.527344%20C%20178.117188%20482.6875%20178.457031%20482.878906%20178.78125%20483.105469%20C%20179.101562%20483.332031%20179.398438%20483.589844%20179.671875%20483.875%20C%20179.945312%20484.160156%20180.183594%20484.46875%20180.394531%20484.800781%20C%20180.605469%20485.132812%20180.785156%20485.484375%20180.925781%20485.851562%20C%20181.066406%20486.21875%20181.171875%20486.597656%20181.242188%20486.984375%20C%20181.308594%20487.371094%20181.335938%20487.765625%20181.328125%20488.15625%20C%20181.320312%20488.550781%20181.269531%20488.941406%20181.183594%20489.324219%20C%20181.097656%20489.710938%20180.976562%20490.082031%20180.816406%20490.441406%20C%20180.65625%20490.804688%20180.464844%20491.144531%20180.238281%20491.464844%20C%20180.011719%20491.789062%20179.757812%20492.085938%20179.472656%20492.359375%20L%20136.054688%20533.769531%20C%20135.769531%20534.039062%20135.457031%20534.28125%20135.125%20534.492188%20C%20134.792969%20534.703125%20134.445312%20534.878906%20134.074219%20535.023438%20C%20133.707031%20535.164062%20133.332031%20535.269531%20132.941406%20535.335938%20C%20132.554688%20535.40625%20132.164062%20535.433594%20131.769531%20535.425781%20C%20131.375%20535.414062%20130.988281%20535.367188%20130.601562%20535.28125%20C%20130.21875%20535.195312%20129.84375%20535.074219%20129.484375%20534.914062%20C%20129.125%20534.753906%20128.785156%20534.5625%20128.460938%20534.335938%20C%20128.140625%20534.109375%20127.84375%20533.851562%20127.570312%20533.566406%20C%20127.296875%20533.28125%20127.054688%20532.972656%20126.84375%20532.640625%20C%20126.632812%20532.308594%20126.457031%20531.957031%20126.316406%20531.589844%20C%20126.171875%20531.222656%20126.070312%20530.847656%20126%20530.457031%20C%20125.933594%20530.070312%20125.902344%20529.679688%20125.914062%20529.285156%20C%20125.921875%20528.890625%20125.96875%20528.5%20126.054688%20528.117188%20C%20126.140625%20527.734375%20126.265625%20527.359375%20126.425781%20527%20C%20126.582031%20526.640625%20126.777344%20526.296875%20127.003906%20525.976562%20C%20127.230469%20525.652344%20127.484375%20525.355469%20127.769531%20525.085938%20Z%20M%20188.554688%20467.109375%20L%20190.894531%20464.878906%20C%20191.179688%20464.609375%20191.488281%20464.367188%20191.820312%20464.15625%20C%20192.152344%20463.945312%20192.503906%20463.769531%20192.871094%20463.625%20C%20193.238281%20463.484375%20193.613281%20463.378906%20194.003906%20463.3125%20C%20194.390625%20463.242188%20194.78125%20463.214844%20195.175781%20463.222656%20C%20195.570312%20463.234375%20195.960938%20463.28125%20196.34375%20463.367188%20C%20196.726562%20463.453125%20197.101562%20463.574219%20197.460938%20463.734375%20C%20197.820312%20463.894531%20198.164062%20464.085938%20198.484375%20464.3125%20C%20198.808594%20464.539062%20199.105469%20464.796875%20199.375%20465.082031%20C%20199.648438%20465.367188%20199.890625%20465.675781%20200.101562%20466.007812%20C%20200.3125%20466.339844%20200.488281%20466.691406%20200.628906%20467.058594%20C%20200.773438%20467.425781%20200.878906%20467.804688%20200.945312%20468.191406%20C%20201.011719%20468.578125%20201.042969%20468.96875%20201.03125%20469.363281%20C%20201.023438%20469.757812%20200.976562%20470.148438%20200.890625%20470.53125%20C%20200.804688%20470.917969%20200.679688%20471.289062%20200.523438%20471.648438%20C%20200.363281%20472.007812%20200.167969%20472.351562%20199.941406%20472.671875%20C%20199.714844%20472.996094%20199.460938%20473.292969%20199.175781%20473.5625%20L%20196.839844%20475.792969%20C%20196.554688%20476.066406%20196.246094%20476.308594%20195.910156%20476.519531%20C%20195.578125%20476.730469%20195.230469%20476.90625%20194.863281%20477.046875%20C%20194.492188%20477.191406%20194.117188%20477.292969%20193.726562%20477.363281%20C%20193.339844%20477.429688%20192.949219%20477.460938%20192.554688%20477.449219%20C%20192.160156%20477.441406%20191.773438%20477.394531%20191.386719%20477.308594%20C%20191.003906%20477.222656%20190.632812%20477.097656%20190.269531%20476.9375%20C%20189.910156%20476.78125%20189.570312%20476.585938%20189.246094%20476.359375%20C%20188.925781%20476.132812%20188.628906%20475.878906%20188.355469%20475.59375%20C%20188.082031%20475.308594%20187.84375%20475%20187.632812%20474.664062%20C%20187.417969%20474.332031%20187.242188%20473.984375%20187.101562%20473.617188%20C%20186.960938%20473.25%20186.855469%20472.871094%20186.785156%20472.484375%20C%20186.71875%20472.09375%20186.691406%20471.703125%20186.699219%20471.308594%20C%20186.707031%20470.914062%20186.757812%20470.527344%20186.84375%20470.140625%20C%20186.929688%20469.757812%20187.050781%20469.386719%20187.210938%20469.023438%20C%20187.371094%20468.664062%20187.5625%20468.324219%20187.789062%20468%20C%20188.015625%20467.679688%20188.269531%20467.382812%20188.554688%20467.109375%20Z%20M%20188.554688%20467.109375%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cpath%20fill='%23FFFFFF'%20d='M%20205.378906%200%20L%20265.378906%200%20C%20265.769531%200%20266.160156%200.0390625%20266.546875%200.117188%20C%20266.933594%200.191406%20267.308594%200.304688%20267.671875%200.457031%20C%20268.035156%200.609375%20268.382812%200.792969%20268.710938%201.011719%20C%20269.039062%201.230469%20269.339844%201.480469%20269.621094%201.757812%20C%20269.898438%202.035156%20270.148438%202.339844%20270.367188%202.667969%20C%20270.585938%202.996094%20270.769531%203.339844%20270.921875%203.703125%20C%20271.070312%204.066406%20271.183594%204.441406%20271.261719%204.828125%20C%20271.339844%205.214844%20271.378906%205.605469%20271.378906%206%20C%20271.378906%206.394531%20271.339844%206.785156%20271.261719%207.171875%20C%20271.183594%207.558594%20271.070312%207.933594%20270.921875%208.296875%20C%20270.769531%208.660156%20270.585938%209.007812%20270.367188%209.332031%20C%20270.148438%209.660156%20269.898438%209.964844%20269.621094%2010.242188%20C%20269.339844%2010.519531%20269.039062%2010.769531%20268.710938%2010.988281%20C%20268.382812%2011.207031%20268.035156%2011.390625%20267.671875%2011.542969%20C%20267.308594%2011.695312%20266.933594%2011.808594%20266.546875%2011.882812%20C%20266.160156%2011.960938%20265.769531%2012%20265.378906%2012%20L%20205.378906%2012%20C%20204.984375%2012%20204.59375%2011.960938%20204.207031%2011.882812%20C%20203.820312%2011.808594%20203.445312%2011.695312%20203.082031%2011.542969%20C%20202.71875%2011.390625%20202.371094%2011.207031%20202.042969%2010.988281%20C%20201.714844%2010.769531%20201.414062%2010.519531%20201.132812%2010.242188%20C%20200.855469%209.964844%20200.605469%209.660156%20200.386719%209.332031%20C%20200.167969%209.007812%20199.984375%208.660156%20199.832031%208.296875%20C%20199.683594%207.933594%20199.570312%207.558594%20199.492188%207.171875%20C%20199.414062%206.785156%20199.378906%206.394531%20199.378906%206%20C%20199.378906%205.605469%20199.414062%205.214844%20199.492188%204.828125%20C%20199.570312%204.441406%20199.683594%204.066406%20199.832031%203.703125%20C%20199.984375%203.339844%20200.167969%202.996094%20200.386719%202.667969%20C%20200.605469%202.339844%20200.855469%202.035156%20201.132812%201.757812%20C%20201.414062%201.480469%20201.714844%201.230469%20202.042969%201.011719%20C%20202.371094%200.792969%20202.71875%200.609375%20203.082031%200.457031%20C%20203.445312%200.304688%20203.820312%200.191406%20204.207031%200.117188%20C%20204.59375%200.0390625%20204.984375%200%20205.378906%200%20Z%20M%20289.378906%200%20L%20349.378906%200%20C%20349.769531%200%20350.160156%200.0390625%20350.546875%200.117188%20C%20350.933594%200.191406%20351.308594%200.304688%20351.671875%200.457031%20C%20352.035156%200.609375%20352.382812%200.792969%20352.710938%201.011719%20C%20353.039062%201.230469%20353.339844%201.480469%20353.621094%201.757812%20C%20353.898438%202.035156%20354.148438%202.339844%20354.367188%202.667969%20C%20354.585938%202.996094%20354.769531%203.339844%20354.921875%203.703125%20C%20355.070312%204.066406%20355.183594%204.441406%20355.261719%204.828125%20C%20355.339844%205.214844%20355.378906%205.605469%20355.378906%206%20C%20355.378906%206.394531%20355.339844%206.785156%20355.261719%207.171875%20C%20355.183594%207.558594%20355.070312%207.933594%20354.921875%208.296875%20C%20354.769531%208.660156%20354.585938%209.007812%20354.367188%209.332031%20C%20354.148438%209.660156%20353.898438%209.964844%20353.621094%2010.242188%20C%20353.339844%2010.519531%20353.039062%2010.769531%20352.710938%2010.988281%20C%20352.382812%2011.207031%20352.035156%2011.390625%20351.671875%2011.542969%20C%20351.308594%2011.695312%20350.933594%2011.808594%20350.546875%2011.882812%20C%20350.160156%2011.960938%20349.769531%2012%20349.378906%2012%20L%20289.378906%2012%20C%20288.984375%2012%20288.59375%2011.960938%20288.207031%2011.882812%20C%20287.820312%2011.808594%20287.445312%2011.695312%20287.082031%2011.542969%20C%20286.71875%2011.390625%20286.371094%2011.207031%20286.042969%2010.988281%20C%20285.714844%2010.769531%20285.414062%2010.519531%20285.132812%2010.242188%20C%20284.855469%209.964844%20284.605469%209.660156%20284.386719%209.332031%20C%20284.167969%209.007812%20283.984375%208.660156%20283.832031%208.296875%20C%20283.683594%207.933594%20283.570312%207.558594%20283.492188%207.171875%20C%20283.414062%206.785156%20283.378906%206.394531%20283.378906%206%20C%20283.378906%205.605469%20283.414062%205.214844%20283.492188%204.828125%20C%20283.570312%204.441406%20283.683594%204.066406%20283.832031%203.703125%20C%20283.984375%203.339844%20284.167969%202.996094%20284.386719%202.667969%20C%20284.605469%202.339844%20284.855469%202.035156%20285.132812%201.757812%20C%20285.414062%201.480469%20285.714844%201.230469%20286.042969%201.011719%20C%20286.371094%200.792969%20286.71875%200.609375%20287.082031%200.457031%20C%20287.445312%200.304688%20287.820312%200.191406%20288.207031%200.117188%20C%20288.59375%200.0390625%20288.984375%200%20289.378906%200%20Z%20M%20373.378906%200%20L%20433.378906%200%20C%20433.769531%200%20434.160156%200.0390625%20434.546875%200.117188%20C%20434.933594%200.191406%20435.308594%200.304688%20435.671875%200.457031%20C%20436.035156%200.609375%20436.382812%200.792969%20436.710938%201.011719%20C%20437.039062%201.230469%20437.339844%201.480469%20437.621094%201.757812%20C%20437.898438%202.035156%20438.148438%202.339844%20438.367188%202.667969%20C%20438.585938%202.996094%20438.769531%203.339844%20438.921875%203.703125%20C%20439.070312%204.066406%20439.183594%204.441406%20439.261719%204.828125%20C%20439.339844%205.214844%20439.378906%205.605469%20439.378906%206%20C%20439.378906%206.394531%20439.339844%206.785156%20439.261719%207.171875%20C%20439.183594%207.558594%20439.070312%207.933594%20438.921875%208.296875%20C%20438.769531%208.660156%20438.585938%209.007812%20438.367188%209.332031%20C%20438.148438%209.660156%20437.898438%209.964844%20437.621094%2010.242188%20C%20437.339844%2010.519531%20437.039062%2010.769531%20436.710938%2010.988281%20C%20436.382812%2011.207031%20436.035156%2011.390625%20435.671875%2011.542969%20C%20435.308594%2011.695312%20434.933594%2011.808594%20434.546875%2011.882812%20C%20434.160156%2011.960938%20433.769531%2012%20433.378906%2012%20L%20373.378906%2012%20C%20372.984375%2012%20372.59375%2011.960938%20372.207031%2011.882812%20C%20371.820312%2011.808594%20371.445312%2011.695312%20371.082031%2011.542969%20C%20370.71875%2011.390625%20370.371094%2011.207031%20370.042969%2010.988281%20C%20369.714844%2010.769531%20369.414062%2010.519531%20369.132812%2010.242188%20C%20368.855469%209.964844%20368.605469%209.660156%20368.386719%209.332031%20C%20368.167969%209.007812%20367.984375%208.660156%20367.832031%208.296875%20C%20367.683594%207.933594%20367.570312%207.558594%20367.492188%207.171875%20C%20367.414062%206.785156%20367.378906%206.394531%20367.378906%206%20C%20367.378906%205.605469%20367.414062%205.214844%20367.492188%204.828125%20C%20367.570312%204.441406%20367.683594%204.066406%20367.832031%203.703125%20C%20367.984375%203.339844%20368.167969%202.996094%20368.386719%202.667969%20C%20368.605469%202.339844%20368.855469%202.035156%20369.132812%201.757812%20C%20369.414062%201.480469%20369.714844%201.230469%20370.042969%201.011719%20C%20370.371094%200.792969%20370.71875%200.609375%20371.082031%200.457031%20C%20371.445312%200.304688%20371.820312%200.191406%20372.207031%200.117188%20C%20372.59375%200.0390625%20372.984375%200%20373.378906%200%20Z%20M%20457.378906%200%20L%20517.378906%200%20C%20517.769531%200%20518.160156%200.0390625%20518.546875%200.117188%20C%20518.933594%200.191406%20519.308594%200.304688%20519.671875%200.457031%20C%20520.035156%200.609375%20520.382812%200.792969%20520.710938%201.011719%20C%20521.039062%201.230469%20521.339844%201.480469%20521.621094%201.757812%20C%20521.898438%202.035156%20522.148438%202.339844%20522.367188%202.667969%20C%20522.585938%202.996094%20522.769531%203.339844%20522.921875%203.703125%20C%20523.070312%204.066406%20523.183594%204.441406%20523.261719%204.828125%20C%20523.339844%205.214844%20523.378906%205.605469%20523.378906%206%20C%20523.378906%206.394531%20523.339844%206.785156%20523.261719%207.171875%20C%20523.183594%207.558594%20523.070312%207.933594%20522.921875%208.296875%20C%20522.769531%208.660156%20522.585938%209.007812%20522.367188%209.332031%20C%20522.148438%209.660156%20521.898438%209.964844%20521.621094%2010.242188%20C%20521.339844%2010.519531%20521.039062%2010.769531%20520.710938%2010.988281%20C%20520.382812%2011.207031%20520.035156%2011.390625%20519.671875%2011.542969%20C%20519.308594%2011.695312%20518.933594%2011.808594%20518.546875%2011.882812%20C%20518.160156%2011.960938%20517.769531%2012%20517.378906%2012%20L%20457.378906%2012%20C%20456.984375%2012%20456.59375%2011.960938%20456.207031%2011.882812%20C%20455.820312%2011.808594%20455.445312%2011.695312%20455.082031%2011.542969%20C%20454.71875%2011.390625%20454.371094%2011.207031%20454.042969%2010.988281%20C%20453.714844%2010.769531%20453.414062%2010.519531%20453.132812%2010.242188%20C%20452.855469%209.964844%20452.605469%209.660156%20452.386719%209.332031%20C%20452.167969%209.007812%20451.984375%208.660156%20451.832031%208.296875%20C%20451.683594%207.933594%20451.570312%207.558594%20451.492188%207.171875%20C%20451.414062%206.785156%20451.378906%206.394531%20451.378906%206%20C%20451.378906%205.605469%20451.414062%205.214844%20451.492188%204.828125%20C%20451.570312%204.441406%20451.683594%204.066406%20451.832031%203.703125%20C%20451.984375%203.339844%20452.167969%202.996094%20452.386719%202.667969%20C%20452.605469%202.339844%20452.855469%202.035156%20453.132812%201.757812%20C%20453.414062%201.480469%20453.714844%201.230469%20454.042969%201.011719%20C%20454.371094%200.792969%20454.71875%200.609375%20455.082031%200.457031%20C%20455.445312%200.304688%20455.820312%200.191406%20456.207031%200.117188%20C%20456.59375%200.0390625%20456.984375%200%20457.378906%200%20Z%20M%20541.378906%200%20L%20601.378906%200%20C%20601.769531%200%20602.160156%200.0390625%20602.546875%200.117188%20C%20602.933594%200.191406%20603.308594%200.304688%20603.671875%200.457031%20C%20604.035156%200.609375%20604.382812%200.792969%20604.710938%201.011719%20C%20605.039062%201.230469%20605.339844%201.480469%20605.621094%201.757812%20C%20605.898438%202.035156%20606.148438%202.339844%20606.367188%202.667969%20C%20606.585938%202.996094%20606.769531%203.339844%20606.921875%203.703125%20C%20607.070312%204.066406%20607.183594%204.441406%20607.261719%204.828125%20C%20607.339844%205.214844%20607.378906%205.605469%20607.378906%206%20C%20607.378906%206.394531%20607.339844%206.785156%20607.261719%207.171875%20C%20607.183594%207.558594%20607.070312%207.933594%20606.921875%208.296875%20C%20606.769531%208.660156%20606.585938%209.007812%20606.367188%209.332031%20C%20606.148438%209.660156%20605.898438%209.964844%20605.621094%2010.242188%20C%20605.339844%2010.519531%20605.039062%2010.769531%20604.710938%2010.988281%20C%20604.382812%2011.207031%20604.035156%2011.390625%20603.671875%2011.542969%20C%20603.308594%2011.695312%20602.933594%2011.808594%20602.546875%2011.882812%20C%20602.160156%2011.960938%20601.769531%2012%20601.378906%2012%20L%20541.378906%2012%20C%20540.984375%2012%20540.59375%2011.960938%20540.207031%2011.882812%20C%20539.820312%2011.808594%20539.445312%2011.695312%20539.082031%2011.542969%20C%20538.71875%2011.390625%20538.371094%2011.207031%20538.042969%2010.988281%20C%20537.714844%2010.769531%20537.414062%2010.519531%20537.132812%2010.242188%20C%20536.855469%209.964844%20536.605469%209.660156%20536.386719%209.332031%20C%20536.167969%209.007812%20535.984375%208.660156%20535.832031%208.296875%20C%20535.683594%207.933594%20535.570312%207.558594%20535.492188%207.171875%20C%20535.414062%206.785156%20535.378906%206.394531%20535.378906%206%20C%20535.378906%205.605469%20535.414062%205.214844%20535.492188%204.828125%20C%20535.570312%204.441406%20535.683594%204.066406%20535.832031%203.703125%20C%20535.984375%203.339844%20536.167969%202.996094%20536.386719%202.667969%20C%20536.605469%202.339844%20536.855469%202.035156%20537.132812%201.757812%20C%20537.414062%201.480469%20537.714844%201.230469%20538.042969%201.011719%20C%20538.371094%200.792969%20538.71875%200.609375%20539.082031%200.457031%20C%20539.445312%200.304688%20539.820312%200.191406%20540.207031%200.117188%20C%20540.59375%200.0390625%20540.984375%200%20541.378906%200%20Z%20M%20625.378906%200%20L%20648.726562%200%20C%20649.117188%200%20649.507812%200.0390625%20649.894531%200.117188%20C%20650.28125%200.191406%20650.65625%200.304688%20651.019531%200.457031%20C%20651.386719%200.609375%20651.730469%200.792969%20652.058594%201.011719%20C%20652.386719%201.230469%20652.6875%201.480469%20652.96875%201.757812%20C%20653.246094%202.035156%20653.496094%202.339844%20653.714844%202.667969%20C%20653.933594%202.996094%20654.117188%203.339844%20654.269531%203.703125%20C%20654.417969%204.066406%20654.53125%204.441406%20654.609375%204.828125%20C%20654.6875%205.214844%20654.726562%205.605469%20654.726562%206%20C%20654.726562%206.394531%20654.6875%206.785156%20654.609375%207.171875%20C%20654.53125%207.558594%20654.417969%207.933594%20654.269531%208.296875%20C%20654.117188%208.660156%20653.933594%209.007812%20653.714844%209.332031%20C%20653.496094%209.660156%20653.246094%209.964844%20652.96875%2010.242188%20C%20652.6875%2010.519531%20652.386719%2010.769531%20652.058594%2010.988281%20C%20651.730469%2011.207031%20651.386719%2011.390625%20651.019531%2011.542969%20C%20650.65625%2011.695312%20650.28125%2011.808594%20649.894531%2011.882812%20C%20649.507812%2011.960938%20649.117188%2012%20648.726562%2012%20L%20625.378906%2012%20C%20624.984375%2012%20624.59375%2011.960938%20624.207031%2011.882812%20C%20623.820312%2011.808594%20623.445312%2011.695312%20623.082031%2011.542969%20C%20622.71875%2011.390625%20622.371094%2011.207031%20622.042969%2010.988281%20C%20621.714844%2010.769531%20621.414062%2010.519531%20621.132812%2010.242188%20C%20620.855469%209.964844%20620.605469%209.660156%20620.386719%209.332031%20C%20620.167969%209.007812%20619.984375%208.660156%20619.832031%208.296875%20C%20619.683594%207.933594%20619.570312%207.558594%20619.492188%207.171875%20C%20619.414062%206.785156%20619.378906%206.394531%20619.378906%206%20C%20619.378906%205.605469%20619.414062%205.214844%20619.492188%204.828125%20C%20619.570312%204.441406%20619.683594%204.066406%20619.832031%203.703125%20C%20619.984375%203.339844%20620.167969%202.996094%20620.386719%202.667969%20C%20620.605469%202.339844%20620.855469%202.035156%20621.132812%201.757812%20C%20621.414062%201.480469%20621.714844%201.230469%20622.042969%201.011719%20C%20622.371094%200.792969%20622.71875%200.609375%20623.082031%200.457031%20C%20623.445312%200.304688%20623.820312%200.191406%20624.207031%200.117188%20C%20624.59375%200.0390625%20624.984375%200%20625.378906%200%20Z%20M%20625.378906%200%20'%20fill-opacity='1'%20fill-rule='nonzero'/%3e%3cg%20clip-path='url(%233999f56c05)'%3e%3cg%20clip-path='url(%233dd2ef3fdd)'%3e%3cpath%20stroke-linecap='butt'%20transform='matrix(0.75,%200,%200,%200.75,%20364.507778,%20522.803203)'%20fill='none'%20stroke-linejoin='miter'%20d='M%20114.942753%200.00197997%20C%2051.463587%200.00197997%200.0000464182%2051.460313%200.0000464182%20114.944687%20C%200.0000464182%20178.429061%2051.463587%20229.892601%20114.942753%20229.892601%20C%20178.427127%20229.892601%20229.890668%20178.429061%20229.890668%20114.944687%20C%20229.890668%2051.460313%20178.427127%200.00197997%20114.942753%200.00197997%20Z%20M%20114.942753%200.00197997%20'%20stroke='%23FFFFFF'%20stroke-width='32'%20stroke-opacity='1'%20stroke-miterlimit='4'/%3e%3c/g%3e%3c/g%3e%3cpath%20stroke-linecap='round'%20transform='matrix(0.75,%200.000000000000000774,%20-0.000000000000000774,%200.75,%20497.833274,%20601.405527)'%20fill='none'%20stroke-linejoin='miter'%20d='M%207.498343%207.500965%20L%20102.665014%207.500965%20'%20stroke='%23FFFFFF'%20stroke-width='15'%20stroke-opacity='1'%20stroke-miterlimit='4'/%3e%3cpath%20stroke-linecap='round'%20transform='matrix(0.75,%200.000000000000000774,%20-0.000000000000000774,%200.75,%20330.410406,%20603.388695)'%20fill='none'%20stroke-linejoin='miter'%20d='M%207.499668%207.502574%20L%20102.661131%207.502574%20'%20stroke='%23FFFFFF'%20stroke-width='15'%20stroke-opacity='1'%20stroke-miterlimit='4'/%3e%3cpath%20stroke-linecap='round'%20transform='matrix(0,%200.75,%20-0.75,%200,%20458.97166,%20482.686868)'%20fill='none'%20stroke-linejoin='miter'%20d='M%207.500842%207.498672%20L%20102.662305%207.498672%20'%20stroke='%23FFFFFF'%20stroke-width='15'%20stroke-opacity='1'%20stroke-miterlimit='4'/%3e%3cpath%20stroke-linecap='round'%20transform='matrix(0,%200.75,%20-0.75,%200,%20458.97166,%20642.613525)'%20fill='none'%20stroke-linejoin='miter'%20d='M%207.499676%207.498672%20L%20102.661139%207.498672%20'%20stroke='%23FFFFFF'%20stroke-width='15'%20stroke-opacity='1'%20stroke-miterlimit='4'/%3e%3c/svg%3e", F3 = rl.charAt(0).toUpperCase() + rl.slice(1), qa = {
  id: rl,
  name: F3,
  version: b3,
  description: w3,
  author: x3,
  store: A0
};
function L3() {
  return Promise.resolve().then(() => D8);
}
function B3() {
  return Promise.resolve().then(() => Pd);
}
function M3() {
  return Promise.resolve().then(() => jd);
}
function R3() {
  return Promise.resolve().then(() => i7);
}
async function vg(e, t) {
  await E3(), e.registerStore(A0), e.registerStore(vn);
  const n = A0();
  e.register_microservice(n), e.registerTool(qa.id, {
    id: "VeaseModeling_AOI",
    title: "Area of Interest (Extension)",
    description: "Define an area of interest on the viewer with 4 points.",
    iconType: "svg",
    iconSource: Ml,
    component: J0(An(L3))
  }), e.registerTool(qa.id, {
    id: "VeaseModeling_VOI",
    title: "Volume of Interest (Extension)",
    description: "Create a 3D bounding box from an existing AOI with Z bounds.",
    iconType: "svg",
    iconSource: $6,
    component: J0(An(B3))
  }), e.registerTool(qa.id, {
    id: "VeaseModeling_StructuralModel",
    title: "Structural Model (Extension)",
    description: "Create a structural model from VOI, Faults, and Horizons.",
    iconType: "svg",
    iconSource: A6,
    component: J0(An(M3))
  }), e.registerTool(qa.id, {
    id: "VeaseModeling_Remesh",
    title: "Remesh Model",
    description: "Create a new remeshed version of an existing model with custom metrics.",
    iconType: "svg",
    iconSource: E6,
    component: J0(An(R3))
  }), e.UIStore.registerDataManagerTab({
    id: "classification",
    title: "Classification",
    icon: "mdi-tag-outline",
    component: J0(
      An(() => Promise.resolve().then(() => Zm))
    )
  });
}
function i0(e) {
  F0(`Vuetify: ${e}`);
}
function Ar(e) {
  F0(`Vuetify error: ${e}`);
}
function D3(e, t) {
  t = Array.isArray(t) ? t.slice(0, -1).map((n) => `'${n}'`).join(", ") + ` or '${t.at(-1)}'` : `'${t}'`, F0(`[Vuetify UPGRADE] '${e}' is deprecated, use ${t} instead.`);
}
const w2 = typeof window < "u", Rl = w2 && "IntersectionObserver" in window, N3 = w2 && "matchMedia" in window && typeof window.matchMedia == "function", $0 = () => N3 && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function ks(e, t, n) {
  z3(e, t), t.set(e, n);
}
function z3(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _s(e, t, n) {
  return e.set(T6(e, t), n), n;
}
function Lt(e, t) {
  return e.get(T6(e, t));
}
function T6(e, t, n) {
  if (typeof e == "function" ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function O6(e, t, n) {
  const a = t.length - 1;
  if (a < 0) return e === void 0 ? n : e;
  for (let r = 0; r < a; r++) {
    if (e == null)
      return n;
    e = e[t[r]];
  }
  return e == null || e[t[a]] === void 0 ? n : e[t[a]];
}
function Wn(e, t, n) {
  return e == null || !t || typeof t != "string" ? n : e[t] !== void 0 ? e[t] : (t = t.replace(/\[(\w+)\]/g, ".$1"), t = t.replace(/^\./, ""), O6(e, t.split("."), n));
}
function N2(e, t, n) {
  if (t === !0) return e === void 0 ? n : e;
  if (t == null || typeof t == "boolean") return n;
  if (e !== Object(e)) {
    if (typeof t != "function") return n;
    const r = t(e, n);
    return typeof r > "u" ? n : r;
  }
  if (typeof t == "string") return Wn(e, t, n);
  if (Array.isArray(t)) return O6(e, t, n);
  if (typeof t != "function") return n;
  const a = t(e, n);
  return typeof a > "u" ? n : a;
}
function Ha(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  return Array.from({
    length: e
  }, (n, a) => t + a);
}
function Oe(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "px";
  if (e == null || e === "")
    return;
  const n = Number(e);
  return isNaN(n) ? String(e) : isFinite(n) ? `${n}${t}` : void 0;
}
function or(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function Ps(e) {
  let t;
  return e !== null && typeof e == "object" && ((t = Object.getPrototypeOf(e)) === Object.prototype || t === null);
}
function F6(e) {
  if (e && "$el" in e) {
    const t = e.$el;
    return t?.nodeType === Node.TEXT_NODE ? t.nextElementSibling : t;
  }
  return e;
}
const Vs = Object.freeze({
  enter: "Enter",
  tab: "Tab",
  delete: "Delete",
  esc: "Escape",
  space: "Space",
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  end: "End",
  home: "Home",
  del: "Delete",
  backspace: "Backspace",
  insert: "Insert",
  pageup: "PageUp",
  pagedown: "PageDown",
  shift: "Shift"
});
function L6(e) {
  return Object.keys(e);
}
function Mi(e, t) {
  return t.every((n) => e.hasOwnProperty(n));
}
function jt(e, t) {
  const n = {};
  for (const a of t)
    Object.prototype.hasOwnProperty.call(e, a) && (n[a] = e[a]);
  return n;
}
function Is(e, t, n) {
  const a = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  for (const i in e)
    t.some((o) => o instanceof RegExp ? o.test(i) : o === i) ? a[i] = e[i] : r[i] = e[i];
  return [a, r];
}
function qt(e, t) {
  const n = {
    ...e
  };
  return t.forEach((a) => delete n[a]), n;
}
const B6 = /^on[^a-z]/, Dl = (e) => B6.test(e), j3 = ["onAfterscriptexecute", "onAnimationcancel", "onAnimationend", "onAnimationiteration", "onAnimationstart", "onAuxclick", "onBeforeinput", "onBeforescriptexecute", "onChange", "onClick", "onCompositionend", "onCompositionstart", "onCompositionupdate", "onContextmenu", "onCopy", "onCut", "onDblclick", "onFocusin", "onFocusout", "onFullscreenchange", "onFullscreenerror", "onGesturechange", "onGestureend", "onGesturestart", "onGotpointercapture", "onInput", "onKeydown", "onKeypress", "onKeyup", "onLostpointercapture", "onMousedown", "onMousemove", "onMouseout", "onMouseover", "onMouseup", "onMousewheel", "onPaste", "onPointercancel", "onPointerdown", "onPointerenter", "onPointerleave", "onPointermove", "onPointerout", "onPointerover", "onPointerup", "onReset", "onSelect", "onSubmit", "onTouchcancel", "onTouchend", "onTouchmove", "onTouchstart", "onTransitioncancel", "onTransitionend", "onTransitionrun", "onTransitionstart", "onWheel"];
function M6(e) {
  const [t, n] = Is(e, [B6]), a = qt(t, j3), [r, i] = Is(n, ["class", "style", "id", /^data-/]);
  return Object.assign(r, t), Object.assign(i, a), [r, i];
}
function $2(e) {
  return e == null ? [] : Array.isArray(e) ? e : [e];
}
function K3(e, t) {
  let n = 0;
  const a = function() {
    for (var r = arguments.length, i = new Array(r), o = 0; o < r; o++)
      i[o] = arguments[o];
    clearTimeout(n), n = setTimeout(() => e(...i), s2(t));
  };
  return a.clear = () => {
    clearTimeout(n);
  }, a.immediate = e, a;
}
function q2(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  return Math.max(t, Math.min(n, e));
}
function Es(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0";
  return e + n.repeat(Math.max(0, t - e.length));
}
function W3(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
  const n = [];
  let a = 0;
  for (; a < e.length; )
    n.push(e.substr(a, t)), a += t;
  return n;
}
function Dt() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 ? arguments[2] : void 0;
  const a = {};
  for (const r in e)
    a[r] = e[r];
  for (const r in t) {
    const i = e[r], o = t[r];
    if (Ps(i) && Ps(o)) {
      a[r] = Dt(i, o, n);
      continue;
    }
    if (n && Array.isArray(i) && Array.isArray(o)) {
      a[r] = n(i, o);
      continue;
    }
    a[r] = o;
  }
  return a;
}
function R6(e) {
  return e.map((t) => t.type === je ? R6(t.children) : t).flat();
}
function V0() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  if (V0.cache.has(e)) return V0.cache.get(e);
  const t = e.replace(/[^a-z]/gi, "-").replace(/\B([A-Z])/g, "-$1").toLowerCase();
  return V0.cache.set(e, t), t;
}
V0.cache = /* @__PURE__ */ new Map();
function Fn(e, t) {
  if (!t || typeof t != "object") return [];
  if (Array.isArray(t))
    return t.map((n) => Fn(e, n)).flat(1);
  if (t.suspense)
    return Fn(e, t.ssContent);
  if (Array.isArray(t.children))
    return t.children.map((n) => Fn(e, n)).flat(1);
  if (t.component) {
    if (Object.getOwnPropertySymbols(t.component.provides).includes(e))
      return [t.component];
    if (t.component.subTree)
      return Fn(e, t.component.subTree).flat(1);
  }
  return [];
}
var Z0 = /* @__PURE__ */ new WeakMap(), x0 = /* @__PURE__ */ new WeakMap();
let q3 = class {
  constructor(t) {
    ks(this, Z0, []), ks(this, x0, 0), this.size = t;
  }
  get isFull() {
    return Lt(Z0, this).length === this.size;
  }
  push(t) {
    Lt(Z0, this)[Lt(x0, this)] = t, _s(x0, this, (Lt(x0, this) + 1) % this.size);
  }
  values() {
    return Lt(Z0, this).slice(Lt(x0, this)).concat(Lt(Z0, this).slice(0, Lt(x0, this)));
  }
  clear() {
    Lt(Z0, this).length = 0, _s(x0, this, 0);
  }
};
function Nl(e) {
  const t = ct({});
  b2(() => {
    const a = e();
    for (const r in a)
      t[r] = a[r];
  }, {
    flush: "sync"
  });
  const n = {};
  for (const a in t)
    n[a] = R(() => t[a]);
  return n;
}
function sr(e, t) {
  return e.includes(t);
}
function D6(e) {
  return e[2].toLowerCase() + e.slice(3);
}
const T2 = () => [Function, Array];
function As(e, t) {
  return t = "on" + s0(t), !!(e[t] || e[`${t}Once`] || e[`${t}Capture`] || e[`${t}OnceCapture`] || e[`${t}CaptureOnce`]);
}
function zl(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++)
    n[a - 1] = arguments[a];
  if (Array.isArray(e))
    for (const r of e)
      r(...n);
  else typeof e == "function" && e(...n);
}
function ur(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  const n = ["button", "[href]", 'input:not([type="hidden"])', "select", "textarea", "details:not(:has(> summary))", "details > summary", "[tabindex]", '[contenteditable]:not([contenteditable="false"])', "audio[controls]", "video[controls]"].map((r) => `${r}${t ? ':not([tabindex="-1"])' : ""}:not([disabled], [inert])`).join(", ");
  let a;
  try {
    a = [...e.querySelectorAll(n)];
  } catch (r) {
    return Ar(String(r)), [];
  }
  return a.filter((r) => !r.closest("[inert]")).filter((r) => !!r.offsetParent || r.getClientRects().length > 0).filter((r) => !r.parentElement?.closest("details:not([open])") || r.tagName === "SUMMARY" && r.parentElement?.tagName === "DETAILS");
}
function N6(e, t, n) {
  let a, r = e.indexOf(document.activeElement);
  const i = t === "next" ? 1 : -1;
  do
    r += i, a = e[r];
  while ((!a || a.offsetParent == null || !(n?.(a) ?? !0)) && r < e.length && r >= 0);
  return a;
}
function zn(e, t) {
  const n = ur(e);
  if (t == null)
    (e === document.activeElement || !e.contains(document.activeElement)) && n[0]?.focus();
  else if (t === "first")
    n[0]?.focus();
  else if (t === "last")
    n.at(-1)?.focus();
  else if (typeof t == "number")
    n[t]?.focus();
  else {
    const a = N6(n, t);
    a ? a.focus() : zn(e, t === "next" ? "first" : "last");
  }
}
function Ua(e) {
  return e == null || typeof e == "string" && e.trim() === "";
}
function cr(e, t) {
  if (!(w2 && typeof CSS < "u" && typeof CSS.supports < "u" && CSS.supports(`selector(${t})`))) return null;
  try {
    return !!e && e.matches(t);
  } catch {
    return null;
  }
}
function z6(e) {
  return e.some((t) => d3(t) ? t.type === f3 ? !1 : t.type !== je || z6(t.children) : !0) ? e : null;
}
function H3(e, t) {
  if (!w2 || e === 0)
    return t(), () => {
    };
  const n = window.setTimeout(t, e);
  return () => window.clearTimeout(n);
}
function U3(e, t) {
  const n = e.clientX, a = e.clientY, r = t.getBoundingClientRect(), i = r.left, o = r.top, u = r.right, c = r.bottom;
  return n >= i && n <= u && a >= o && a <= c;
}
function ll() {
  const e = Ve(), t = (n) => {
    e.value = n;
  };
  return Object.defineProperty(t, "value", {
    enumerable: !0,
    get: () => e.value,
    set: (n) => e.value = n
  }), Object.defineProperty(t, "el", {
    enumerable: !0,
    get: () => F6(e.value)
  }), t;
}
function $s(e) {
  const t = e.key.length === 1, n = !e.ctrlKey && !e.metaKey && !e.altKey;
  return t && n;
}
function l0(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint";
}
function G3(e) {
  const t = {};
  for (const n in e)
    t[Er(n)] = e[n];
  return t;
}
function Z3(e) {
  const t = ["checked", "disabled"];
  return Object.fromEntries(Object.entries(e).filter((n) => {
    let [a, r] = n;
    return t.includes(a) ? !!r : r !== void 0;
  }));
}
function x2(e, t) {
  const n = p6();
  if (!n)
    throw new Error(`[Vuetify] ${e} must be called from inside a setup function`);
  return n;
}
function At() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "composables";
  const t = x2(e).type;
  return V0(t?.aliasName || t?.name);
}
function Y3(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : x2("injectSelf");
  const {
    provides: n
  } = t;
  if (n && e in n)
    return n[e];
}
const dr = /* @__PURE__ */ Symbol.for("vuetify:defaults");
function jl() {
  const e = We(dr);
  if (!e) throw new Error("[Vuetify] Could not find defaults instance");
  return e;
}
function gt(e, t) {
  const n = jl(), a = se(e), r = E(() => {
    if (s2(t?.disabled)) return n.value;
    const o = s2(t?.scoped), u = s2(t?.reset), c = s2(t?.root);
    if (a.value == null && !(o || u || c)) return n.value;
    let f = Dt(a.value, {
      prev: n.value
    });
    if (o) return f;
    if (u || c) {
      const v = Number(u || 1 / 0);
      for (let h = 0; h <= v && !(!f || !("prev" in f)); h++)
        f = f.prev;
      return f && typeof c == "string" && c in f && (f = Dt(Dt(f, {
        prev: f
      }), f[c])), f;
    }
    return f.prev ? Dt(f.prev, f) : f;
  });
  return c2(dr, r), r;
}
function X3(e, t) {
  return e.props && (typeof e.props[t] < "u" || typeof e.props[V0(t)] < "u");
}
function Q3() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : jl();
  const a = x2("useDefaults");
  if (t = t ?? a.type.name ?? a.type.__name, !t)
    throw new Error("[Vuetify] Could not determine component name");
  const r = E(() => n.value?.[e._as ?? t]), i = new Proxy(e, {
    get(c, f) {
      const v = Reflect.get(c, f);
      if (f === "class" || f === "style")
        return [r.value?.[f], v].filter((p) => p != null);
      if (X3(a.vnode, f)) return v;
      const h = r.value?.[f];
      if (h !== void 0) return h;
      const y = n.value?.global?.[f];
      return y !== void 0 ? y : v;
    }
  }), o = Ve();
  b2(() => {
    if (r.value) {
      const c = Object.entries(r.value).filter((f) => {
        let [v] = f;
        return v.startsWith(v[0].toUpperCase());
      });
      o.value = c.length ? Object.fromEntries(c) : void 0;
    } else
      o.value = void 0;
  });
  function u() {
    const c = Y3(dr, a);
    c2(dr, E(() => o.value ? Dt(c?.value ?? {}, o.value) : c?.value));
  }
  return {
    props: i,
    provideSubDefaults: u
  };
}
const j6 = ["top", "bottom"], J3 = ["start", "end", "left", "right"];
function ol(e, t) {
  let [n, a] = e.split(" ");
  return a || (a = sr(j6, n) ? "start" : sr(J3, n) ? "top" : "center"), {
    side: Ts(n, t),
    align: Ts(a, t)
  };
}
function Ts(e, t) {
  return e === "start" ? t ? "right" : "left" : e === "end" ? t ? "left" : "right" : e;
}
function Ri(e) {
  return {
    side: {
      center: "center",
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }[e.side],
    align: e.align
  };
}
function Di(e) {
  return {
    side: e.side,
    align: {
      center: "center",
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }[e.align]
  };
}
function Os(e) {
  return {
    side: e.align,
    align: e.side
  };
}
function Fs(e) {
  return sr(j6, e.side) ? "y" : "x";
}
let ut = class {
  constructor(t) {
    const n = document.body.currentCSSZoom ?? 1, r = t.top === void 0 ? 1 : 1 + (1 - n) / n, {
      x: i,
      y: o,
      width: u,
      height: c
    } = t;
    this.x = i * r, this.y = o * r, this.width = u * r, this.height = c * r;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
};
function Ls(e, t) {
  return {
    x: {
      before: Math.max(0, t.left - e.left),
      after: Math.max(0, e.right - t.right)
    },
    y: {
      before: Math.max(0, t.top - e.top),
      after: Math.max(0, e.bottom - t.bottom)
    }
  };
}
function K6(e) {
  if (Array.isArray(e)) {
    const t = document.body.currentCSSZoom ?? 1, n = 1 + (1 - t) / t;
    return new ut({
      x: e[0] * n,
      y: e[1] * n,
      width: 0 * n,
      height: 0 * n
    });
  } else
    return new ut(e.getBoundingClientRect());
}
function ec(e) {
  if (e === document.documentElement)
    if (visualViewport) {
      const t = document.body.currentCSSZoom ?? 1;
      return new ut({
        x: visualViewport.scale > 1 ? 0 : visualViewport.offsetLeft,
        y: visualViewport.scale > 1 ? 0 : visualViewport.offsetTop,
        width: visualViewport.width * visualViewport.scale / t,
        height: visualViewport.height * visualViewport.scale / t
      });
    } else
      return new ut({
        x: 0,
        y: 0,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      });
  else
    return new ut(e.getBoundingClientRect());
}
function Kl(e) {
  const t = new ut(e.getBoundingClientRect()), n = getComputedStyle(e), a = n.transform;
  if (a) {
    let r, i, o, u, c;
    if (a.startsWith("matrix3d("))
      r = a.slice(9, -1).split(/, /), i = Number(r[0]), o = Number(r[5]), u = Number(r[12]), c = Number(r[13]);
    else if (a.startsWith("matrix("))
      r = a.slice(7, -1).split(/, /), i = Number(r[0]), o = Number(r[3]), u = Number(r[4]), c = Number(r[5]);
    else
      return new ut(t);
    const f = n.transformOrigin, v = t.x - u - (1 - i) * parseFloat(f), h = t.y - c - (1 - o) * parseFloat(f.slice(f.indexOf(" ") + 1)), y = i ? t.width / i : e.offsetWidth + 1, p = o ? t.height / o : e.offsetHeight + 1;
    return new ut({
      x: v,
      y: h,
      width: y,
      height: p
    });
  } else
    return new ut(t);
}
function Mt(e, t, n) {
  if (typeof e.animate > "u") return {
    finished: Promise.resolve()
  };
  let a;
  try {
    a = e.animate(t, n);
  } catch {
    return {
      finished: Promise.resolve()
    };
  }
  return typeof a.finished > "u" && (a.finished = new Promise((r) => {
    a.onfinish = () => {
      r(a);
    };
  })), a;
}
const nr = /* @__PURE__ */ new WeakMap();
function tc(e, t) {
  Object.keys(t).forEach((n) => {
    if (Dl(n)) {
      const a = D6(n), r = nr.get(e);
      if (t[n] == null)
        r?.forEach((i) => {
          const [o, u] = i;
          o === a && (e.removeEventListener(a, u), r.delete(i));
        });
      else if (!r || ![...r].some((i) => i[0] === a && i[1] === t[n])) {
        e.addEventListener(a, t[n]);
        const i = r || /* @__PURE__ */ new Set();
        i.add([a, t[n]]), nr.has(e) || nr.set(e, i);
      }
    } else
      t[n] == null ? e.removeAttribute(n) : e.setAttribute(n, t[n]);
  });
}
function nc(e, t) {
  Object.keys(t).forEach((n) => {
    if (Dl(n)) {
      const a = D6(n), r = nr.get(e);
      r?.forEach((i) => {
        const [o, u] = i;
        o === a && (e.removeEventListener(a, u), r.delete(i));
      });
    } else
      e.removeAttribute(n);
  });
}
const Y0 = 2.4, Bs = 0.2126729, Ms = 0.7151522, Rs = 0.072175, ac = 0.55, rc = 0.58, ic = 0.57, lc = 0.62, Ga = 0.03, Ds = 1.45, oc = 5e-4, sc = 1.25, uc = 1.25, Ns = 0.078, zs = 12.82051282051282, Za = 0.06, js = 1e-3;
function Ks(e, t) {
  const n = (e.r / 255) ** Y0, a = (e.g / 255) ** Y0, r = (e.b / 255) ** Y0, i = (t.r / 255) ** Y0, o = (t.g / 255) ** Y0, u = (t.b / 255) ** Y0;
  let c = n * Bs + a * Ms + r * Rs, f = i * Bs + o * Ms + u * Rs;
  if (c <= Ga && (c += (Ga - c) ** Ds), f <= Ga && (f += (Ga - f) ** Ds), Math.abs(f - c) < oc) return 0;
  let v;
  if (f > c) {
    const h = (f ** ac - c ** rc) * sc;
    v = h < js ? 0 : h < Ns ? h - h * zs * Za : h - Za;
  } else {
    const h = (f ** lc - c ** ic) * uc;
    v = h > -js ? 0 : h > -Ns ? h - h * zs * Za : h + Za;
  }
  return v * 100;
}
function sl(e) {
  return !!e && /^(#|var\(--|(rgb|hsl)a?\()/.test(e);
}
function cc(e) {
  return sl(e) && !/^((rgb|hsl)a?\()?var\(--/.test(e);
}
const Ws = /^(?<fn>(?:rgb|hsl)a?)\((?<values>.+)\)/, dc = {
  rgb: (e, t, n, a) => ({
    r: e,
    g: t,
    b: n,
    a
  }),
  rgba: (e, t, n, a) => ({
    r: e,
    g: t,
    b: n,
    a
  }),
  hsl: (e, t, n, a) => qs({
    h: e,
    s: t,
    l: n,
    a
  }),
  hsla: (e, t, n, a) => qs({
    h: e,
    s: t,
    l: n,
    a
  }),
  hsv: (e, t, n, a) => qn({
    h: e,
    s: t,
    v: n,
    a
  }),
  hsva: (e, t, n, a) => qn({
    h: e,
    s: t,
    v: n,
    a
  })
};
function Ln(e) {
  if (typeof e == "number")
    return (isNaN(e) || e < 0 || e > 16777215) && i0(`'${e}' is not a valid hex color`), {
      r: (e & 16711680) >> 16,
      g: (e & 65280) >> 8,
      b: e & 255
    };
  if (typeof e == "string" && Ws.test(e)) {
    const {
      groups: t
    } = e.match(Ws), {
      fn: n,
      values: a
    } = t, r = a.split(/,\s*|\s*\/\s*|\s+/).map((i, o) => i.endsWith("%") || // unitless slv are %
    o > 0 && o < 3 && ["hsl", "hsla", "hsv", "hsva"].includes(n) ? parseFloat(i) / 100 : parseFloat(i));
    return dc[n](...r);
  } else if (typeof e == "string") {
    let t = e.startsWith("#") ? e.slice(1) : e;
    [3, 4].includes(t.length) ? t = t.split("").map((a) => a + a).join("") : [6, 8].includes(t.length) || i0(`'${e}' is not a valid hex(a) color`);
    const n = parseInt(t, 16);
    return (isNaN(n) || n < 0 || n > 4294967295) && i0(`'${e}' is not a valid hex(a) color`), fc(t);
  } else if (typeof e == "object") {
    if (Mi(e, ["r", "g", "b"]))
      return e;
    if (Mi(e, ["h", "s", "l"]))
      return qn(W6(e));
    if (Mi(e, ["h", "s", "v"]))
      return qn(e);
  }
  throw new TypeError(`Invalid color: ${e == null ? e : String(e) || e.constructor.name}
Expected #hex, #hexa, rgb(), rgba(), hsl(), hsla(), object or number`);
}
function qn(e) {
  const {
    h: t,
    s: n,
    v: a,
    a: r
  } = e, i = (u) => {
    const c = (u + t / 60) % 6;
    return a - a * n * Math.max(Math.min(c, 4 - c, 1), 0);
  }, o = [i(5), i(3), i(1)].map((u) => Math.round(u * 255));
  return {
    r: o[0],
    g: o[1],
    b: o[2],
    a: r
  };
}
function qs(e) {
  return qn(W6(e));
}
function W6(e) {
  const {
    h: t,
    s: n,
    l: a,
    a: r
  } = e, i = a + n * Math.min(a, 1 - a), o = i === 0 ? 0 : 2 - 2 * a / i;
  return {
    h: t,
    s: o,
    v: i,
    a: r
  };
}
function fc(e) {
  e = vc(e);
  let [t, n, a, r] = W3(e, 2).map((i) => parseInt(i, 16));
  return r = r === void 0 ? r : r / 255, {
    r: t,
    g: n,
    b: a,
    a: r
  };
}
function vc(e) {
  return e.startsWith("#") && (e = e.slice(1)), e = e.replace(/([^0-9a-f])/gi, "F"), (e.length === 3 || e.length === 4) && (e = e.split("").map((t) => t + t).join("")), e.length !== 6 && (e = Es(Es(e, 6), 8, "F")), e;
}
function mc(e) {
  const t = Math.abs(Ks(Ln(0), Ln(e)));
  return Math.abs(Ks(Ln(16777215), Ln(e))) > Math.min(t, 50) ? "#fff" : "#000";
}
function ce(e, t) {
  return (n) => Object.keys(e).reduce((a, r) => {
    const o = typeof e[r] == "object" && e[r] != null && !Array.isArray(e[r]) ? e[r] : {
      type: e[r]
    };
    return n && r in n ? a[r] = {
      ...o,
      default: n[r]
    } : a[r] = o, t && !a[r].source && (a[r].source = t), a;
  }, {});
}
const qe = ce({
  class: [String, Array, Object],
  style: {
    type: [String, Array, Object],
    default: null
  }
}, "component");
function la(e) {
  if (e._setup = e._setup ?? e.setup, !e.name)
    return i0("The component is missing an explicit name, unable to generate default prop value"), e;
  if (e._setup) {
    e.props = ce(e.props ?? {}, e.name)();
    const t = Object.keys(e.props).filter((n) => n !== "class" && n !== "style");
    e.filterProps = function(a) {
      return jt(a, t);
    }, e.props._as = String, e.setup = function(a, r) {
      const i = jl();
      if (!i.value) return e._setup(a, r);
      const {
        props: o,
        provideSubDefaults: u
      } = Q3(a, a._as ?? e.name, i), c = e._setup(o, r);
      return u(), c;
    };
  }
  return e;
}
function Ae() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
  return (t) => (e ? la : b6)(t);
}
function gc(e, t) {
  return t.props = e, t;
}
function $r(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "div", n = arguments.length > 2 ? arguments[2] : void 0;
  return Ae()({
    name: n ?? s0(Er(e.replace(/__/g, "-"))),
    props: {
      tag: {
        type: String,
        default: t
      },
      ...qe()
    },
    setup(a, r) {
      let {
        slots: i
      } = r;
      return () => Et(a.tag, {
        class: [e, a.class],
        style: a.style
      }, i.default?.());
    }
  });
}
function hc(e, t, n, a) {
  if (!n || l0(e) || l0(t)) return;
  const r = n.get(e);
  if (r)
    r.set(t, a);
  else {
    const i = /* @__PURE__ */ new WeakMap();
    i.set(t, a), n.set(e, i);
  }
}
function yc(e, t, n) {
  if (!n || l0(e) || l0(t)) return null;
  const a = n.get(e)?.get(t);
  if (typeof a == "boolean") return a;
  const r = n.get(t)?.get(e);
  return typeof r == "boolean" ? r : null;
}
function H2(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : /* @__PURE__ */ new WeakMap();
  if (e === t) return !0;
  if (e instanceof Date && t instanceof Date && e.getTime() !== t.getTime() || e !== Object(e) || t !== Object(t))
    return !1;
  const a = Object.keys(e);
  if (a.length !== Object.keys(t).length)
    return !1;
  const r = yc(e, t, n);
  return r || (hc(e, t, n, !0), a.every((i) => H2(e[i], t[i], n)));
}
function q6(e) {
  if (typeof e.getRootNode != "function") {
    for (; e.parentNode; ) e = e.parentNode;
    return e !== document ? null : document;
  }
  const t = e.getRootNode();
  return t !== document && t.getRootNode({
    composed: !0
  }) !== document ? null : t;
}
const Hn = "cubic-bezier(0.4, 0, 0.2, 1)", Hs = "cubic-bezier(0.0, 0, 0.2, 1)", Us = "cubic-bezier(0.4, 0, 1, 1)", Cc = {
  linear: (e) => e,
  easeInQuad: (e) => e ** 2,
  easeOutQuad: (e) => e * (2 - e),
  easeInOutQuad: (e) => e < 0.5 ? 2 * e ** 2 : -1 + (4 - 2 * e) * e,
  easeInCubic: (e) => e ** 3,
  easeOutCubic: (e) => --e ** 3 + 1,
  easeInOutCubic: (e) => e < 0.5 ? 4 * e ** 3 : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1,
  easeInQuart: (e) => e ** 4,
  easeOutQuart: (e) => 1 - --e ** 4,
  easeInOutQuart: (e) => e < 0.5 ? 8 * e ** 4 : 1 - 8 * --e ** 4,
  easeInQuint: (e) => e ** 5,
  easeOutQuint: (e) => 1 + --e ** 5,
  easeInOutQuint: (e) => e < 0.5 ? 16 * e ** 5 : 1 + 16 * --e ** 5,
  instant: (e) => 1
};
function Gs(e, t, n) {
  return Object.keys(e).filter((a) => Dl(a) && a.endsWith(t)).reduce((a, r) => (a[r.slice(0, -t.length)] = (i) => zl(e[r], i, n(i)), a), {});
}
function Wl(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
  for (; e; ) {
    if (t ? pc(e) : ql(e)) return e;
    e = e.parentElement;
  }
  return document.scrollingElement;
}
function fr(e, t) {
  const n = [];
  if (t && e && !t.contains(e)) return n;
  for (; e && (ql(e) && n.push(e), e !== t); )
    e = e.parentElement;
  return n;
}
function ql(e) {
  if (!e || e.nodeType !== Node.ELEMENT_NODE) return !1;
  const t = window.getComputedStyle(e), n = t.overflowY === "scroll" || t.overflowY === "auto" && e.scrollHeight > e.clientHeight, a = t.overflowX === "scroll" || t.overflowX === "auto" && e.scrollWidth > e.clientWidth;
  return n || a;
}
function pc(e) {
  if (!e || e.nodeType !== Node.ELEMENT_NODE) return !1;
  const t = window.getComputedStyle(e);
  return ["scroll", "auto"].includes(t.overflowY);
}
function bc(e) {
  for (; e; ) {
    if (window.getComputedStyle(e).position === "fixed")
      return !0;
    e = e.offsetParent;
  }
  return !1;
}
function Fe(e) {
  const t = x2("useRender");
  t.render = e;
}
function wc(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    leading: !0,
    trailing: !0
  }, a = 0, r = 0, i = !1, o = 0;
  function u() {
    clearTimeout(a), i = !1, o = 0;
  }
  const c = function() {
    for (var f = arguments.length, v = new Array(f), h = 0; h < f; h++)
      v[h] = arguments[h];
    clearTimeout(a);
    const y = Date.now();
    o || (o = y);
    const p = y - Math.max(o, r);
    function k() {
      r = Date.now(), a = setTimeout(u, t), e(...v);
    }
    i ? p >= t ? k() : n.trailing && (a = setTimeout(k, t - p)) : (i = !0, n.leading && k());
  };
  return c.clear = u, c.immediate = e, c;
}
const xc = ce({
  defaults: Object,
  disabled: Boolean,
  reset: [Number, String],
  root: [Boolean, String],
  scoped: Boolean
}, "VDefaultsProvider"), k2 = Ae(!1)({
  name: "VDefaultsProvider",
  props: xc(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      defaults: a,
      disabled: r,
      reset: i,
      root: o,
      scoped: u
    } = Ol(e);
    return gt(a, {
      reset: i,
      root: o,
      scoped: u,
      disabled: r
    }), () => n.default?.();
  }
});
function Hl(e) {
  return Nl(() => {
    const {
      class: t,
      style: n
    } = Sc(e);
    return {
      colorClasses: t,
      colorStyles: n
    };
  });
}
function ht(e) {
  const {
    colorClasses: t,
    colorStyles: n
  } = Hl(() => ({
    text: u2(e)
  }));
  return {
    textColorClasses: t,
    textColorStyles: n
  };
}
function at(e) {
  const {
    colorClasses: t,
    colorStyles: n
  } = Hl(() => ({
    background: u2(e)
  }));
  return {
    backgroundColorClasses: t,
    backgroundColorStyles: n
  };
}
function Sc(e) {
  const t = u2(e), n = [], a = {};
  if (t.background)
    if (sl(t.background)) {
      if (a.backgroundColor = t.background, !t.text && cc(t.background)) {
        const r = Ln(t.background);
        if (r.a == null || r.a === 1) {
          const i = mc(r);
          a.color = i, a.caretColor = i;
        }
      }
    } else
      n.push(`bg-${t.background}`);
  return t.text && (sl(t.text) ? (a.color = t.text, a.caretColor = t.text) : n.push(`text-${t.text}`)), {
    class: n,
    style: a
  };
}
const Ke = [String, Function, Object, Array], kc = /* @__PURE__ */ Symbol.for("vuetify:icons"), Tr = ce({
  icon: {
    type: Ke
  },
  // Could not remove this and use makeTagProps, types complained because it is not required
  tag: {
    type: [String, Object, Function],
    required: !0
  }
}, "icon"), Zs = Ae()({
  name: "VComponentIcon",
  props: Tr(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return () => {
      const a = e.icon;
      return g(e.tag, null, {
        default: () => [e.icon ? g(a, null, null) : n.default?.()]
      });
    };
  }
}), _c = la({
  name: "VSvgIcon",
  inheritAttrs: !1,
  props: Tr(),
  setup(e, t) {
    let {
      attrs: n
    } = t;
    return () => g(e.tag, me(n, {
      style: null
    }), {
      default: () => [I("svg", {
        class: "v-icon__svg",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        role: "img",
        "aria-hidden": "true"
      }, [Array.isArray(e.icon) ? e.icon.map((a) => Array.isArray(a) ? I("path", {
        d: a[0],
        "fill-opacity": a[1]
      }, null) : I("path", {
        d: a
      }, null)) : I("path", {
        d: e.icon
      }, null)])]
    });
  }
});
la({
  name: "VLigatureIcon",
  props: Tr(),
  setup(e) {
    return () => g(e.tag, null, {
      default: () => [e.icon]
    });
  }
});
la({
  name: "VClassIcon",
  props: Tr(),
  setup(e) {
    return () => g(e.tag, {
      class: ve(e.icon)
    }, null);
  }
});
const Pc = (e) => {
  const t = We(kc);
  if (!t) throw new Error("Missing Vuetify Icons provide!");
  return {
    iconData: E(() => {
      const a = u2(e);
      if (!a) return {
        component: Zs
      };
      let r = a;
      if (typeof r == "string" && (r = r.trim(), r.startsWith("$") && (r = t.aliases?.[r.slice(1)])), r || i0(`Could not find aliased icon "${a}"`), Array.isArray(r))
        return {
          component: _c,
          icon: r
        };
      if (typeof r != "string")
        return {
          component: Zs,
          icon: r
        };
      const i = Object.keys(t.sets).find((c) => typeof r == "string" && r.startsWith(`${c}:`)), o = i ? r.slice(i.length + 1) : r;
      return {
        component: t.sets[i ?? t.defaultSet].component,
        icon: o
      };
    })
  };
}, Vc = ["x-small", "small", "default", "large", "x-large"], mn = ce({
  size: {
    type: [String, Number],
    default: "default"
  }
}, "size");
function oa(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : At();
  return Nl(() => {
    const n = e.size;
    let a, r;
    return sr(Vc, n) ? a = `${t}--size-${n}` : n && (r = {
      width: Oe(n),
      height: Oe(n)
    }), {
      sizeClasses: a,
      sizeStyles: r
    };
  });
}
const l2 = ce({
  tag: {
    type: [String, Object, Function],
    default: "div"
  }
}, "tag"), ul = /* @__PURE__ */ Symbol.for("vuetify:theme"), y2 = ce({
  theme: String
}, "theme");
function V2(e) {
  x2("provideTheme");
  const t = We(ul, null);
  if (!t) throw new Error("Could not find Vuetify theme injection");
  const n = R(() => e.theme ?? t.name.value), a = R(() => t.themes.value[n.value]), r = R(() => t.isDisabled ? void 0 : `${t.prefix}theme--${n.value}`), i = {
    ...t,
    name: n,
    current: a,
    themeClasses: r
  };
  return c2(ul, i), i;
}
function Ic() {
  x2("useTheme");
  const e = We(ul, null);
  if (!e) throw new Error("Could not find Vuetify theme injection");
  return e;
}
const Ec = ce({
  color: String,
  disabled: Boolean,
  start: Boolean,
  end: Boolean,
  icon: Ke,
  opacity: [String, Number],
  ...qe(),
  ...mn(),
  ...l2({
    tag: "i"
  }),
  ...y2()
}, "VIcon"), ze = Ae()({
  name: "VIcon",
  props: Ec(),
  setup(e, t) {
    let {
      attrs: n,
      slots: a
    } = t;
    const r = Ve(), {
      themeClasses: i
    } = Ic(), {
      iconData: o
    } = Pc(() => r.value || e.icon), {
      sizeClasses: u
    } = oa(e), {
      textColorClasses: c,
      textColorStyles: f
    } = ht(() => e.color);
    return Fe(() => {
      const v = a.default?.();
      v && (r.value = R6(v).filter((y) => y.type === w6 && y.children && typeof y.children == "string")[0]?.children);
      const h = !!(n.onClick || n.onClickOnce);
      return g(o.value.component, {
        tag: e.tag,
        icon: o.value.icon,
        class: ve(["v-icon", "notranslate", i.value, u.value, c.value, {
          "v-icon--clickable": h,
          "v-icon--disabled": e.disabled,
          "v-icon--start": e.start,
          "v-icon--end": e.end
        }, e.class]),
        style: Ee([{
          "--v-icon-opacity": e.opacity
        }, u.value ? void 0 : {
          fontSize: Oe(e.size),
          height: Oe(e.size),
          width: Oe(e.size)
        }, f.value, e.style]),
        role: h ? "button" : void 0,
        "aria-hidden": !h,
        tabindex: h ? e.disabled ? -1 : 0 : void 0
      }, {
        default: () => [v]
      });
    }), {};
  }
}), Ct = ce({
  height: [Number, String],
  maxHeight: [Number, String],
  maxWidth: [Number, String],
  minHeight: [Number, String],
  minWidth: [Number, String],
  width: [Number, String]
}, "dimension");
function pt(e) {
  return {
    dimensionStyles: E(() => {
      const n = {}, a = Oe(e.height), r = Oe(e.maxHeight), i = Oe(e.maxWidth), o = Oe(e.minHeight), u = Oe(e.minWidth), c = Oe(e.width);
      return a != null && (n.height = a), r != null && (n.maxHeight = r), i != null && (n.maxWidth = i), o != null && (n.minHeight = o), u != null && (n.minWidth = u), c != null && (n.width = c), n;
    })
  };
}
function Ac(e) {
  return {
    aspectStyles: E(() => {
      const t = Number(e.aspectRatio);
      return t ? {
        paddingBottom: String(1 / t * 100) + "%"
      } : void 0;
    })
  };
}
const H6 = ce({
  aspectRatio: [String, Number],
  contentClass: null,
  inline: Boolean,
  ...qe(),
  ...Ct()
}, "VResponsive"), Ys = Ae()({
  name: "VResponsive",
  props: H6(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      aspectStyles: a
    } = Ac(e), {
      dimensionStyles: r
    } = pt(e);
    return Fe(() => I("div", {
      class: ve(["v-responsive", {
        "v-responsive--inline": e.inline
      }, e.class]),
      style: Ee([r.value, e.style])
    }, [I("div", {
      class: "v-responsive__sizer",
      style: Ee(a.value)
    }, null), n.additional?.(), n.default && I("div", {
      class: ve(["v-responsive__content", e.contentClass])
    }, [n.default()])])), {};
  }
}), it = ce({
  rounded: {
    type: [Boolean, Number, String],
    default: void 0
  },
  tile: Boolean
}, "rounded");
function ft(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : At();
  return {
    roundedClasses: E(() => {
      const a = on(e) ? e.value : e.rounded, r = on(e) ? !1 : e.tile, i = [];
      if (r || a === !1)
        i.push("rounded-0");
      else if (a === !0 || a === "")
        i.push(`${t}--rounded`);
      else if (typeof a == "string" || a === 0)
        for (const o of String(a).split(" "))
          i.push(`rounded-${o}`);
      return i;
    })
  };
}
const sa = ce({
  transition: {
    type: null,
    default: "fade-transition",
    validator: (e) => e !== !0
  }
}, "transition"), Nt = (e, t) => {
  let {
    slots: n
  } = t;
  const {
    transition: a,
    disabled: r,
    group: i,
    ...o
  } = e, {
    component: u = i ? cn : G2,
    ...c
  } = or(a) ? a : {};
  let f;
  return or(a) ? f = me(c, Z3({
    disabled: r,
    group: i
  }), o) : f = me({
    name: r || !a ? "" : a
  }, o), Et(u, f, n);
};
function $c(e, t) {
  if (!Rl) return;
  const n = t.modifiers || {}, a = t.value, {
    handler: r,
    options: i
  } = typeof a == "object" ? a : {
    handler: a,
    options: {}
  }, o = new IntersectionObserver(function() {
    let u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], c = arguments.length > 1 ? arguments[1] : void 0;
    const f = e._observe?.[t.instance.$.uid];
    if (!f) return;
    const v = u.some((h) => h.isIntersecting);
    r && (!n.quiet || f.init) && (!n.once || v || f.init) && r(v, u, c), v && n.once ? U6(e, t) : f.init = !0;
  }, i);
  e._observe = Object(e._observe), e._observe[t.instance.$.uid] = {
    init: !1,
    observer: o
  }, o.observe(e);
}
function U6(e, t) {
  const n = e._observe?.[t.instance.$.uid];
  n && (n.observer.unobserve(e), delete e._observe[t.instance.$.uid]);
}
const vr = {
  mounted: $c,
  unmounted: U6
}, Tc = ce({
  absolute: Boolean,
  alt: String,
  cover: Boolean,
  color: String,
  draggable: {
    type: [Boolean, String],
    default: void 0
  },
  eager: Boolean,
  gradient: String,
  lazySrc: String,
  options: {
    type: Object,
    // For more information on types, navigate to:
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    default: () => ({
      root: void 0,
      rootMargin: void 0,
      threshold: void 0
    })
  },
  sizes: String,
  src: {
    type: [String, Object],
    default: ""
  },
  crossorigin: String,
  referrerpolicy: String,
  srcset: String,
  position: String,
  ...H6(),
  ...qe(),
  ...it(),
  ...sa()
}, "VImg"), gn = Ae()({
  name: "VImg",
  directives: {
    vIntersect: vr
  },
  props: Tc(),
  emits: {
    loadstart: (e) => !0,
    load: (e) => !0,
    error: (e) => !0
  },
  setup(e, t) {
    let {
      emit: n,
      slots: a
    } = t;
    const {
      backgroundColorClasses: r,
      backgroundColorStyles: i
    } = at(() => e.color), {
      roundedClasses: o
    } = ft(e), u = x2("VImg"), c = Ve(""), f = se(), v = Ve(e.eager ? "loading" : "idle"), h = Ve(), y = Ve(), p = E(() => e.src && typeof e.src == "object" ? {
      src: e.src.src,
      srcset: e.srcset || e.src.srcset,
      lazySrc: e.lazySrc || e.src.lazySrc,
      aspect: Number(e.aspectRatio || e.src.aspect || 0)
    } : {
      src: e.src,
      srcset: e.srcset,
      lazySrc: e.lazySrc,
      aspect: Number(e.aspectRatio || 0)
    }), k = E(() => p.value.aspect || h.value / y.value || 0);
    be(() => e.src, () => {
      S(v.value !== "idle");
    }), be(k, (J, ae) => {
      !J && ae && f.value && T(f.value);
    }), dn(() => S());
    function S(J) {
      if (!(e.eager && J) && !(Rl && !J && !e.eager)) {
        if (v.value = "loading", p.value.lazySrc) {
          const ae = new Image();
          ae.src = p.value.lazySrc, T(ae, null);
        }
        p.value.src && e2(() => {
          n("loadstart", f.value?.currentSrc || p.value.src), setTimeout(() => {
            if (!u.isUnmounted)
              if (f.value?.complete) {
                if (f.value.naturalWidth || _(), v.value === "error") return;
                k.value || T(f.value, null), v.value === "loading" && w();
              } else
                k.value || T(f.value), V();
          });
        });
      }
    }
    function w() {
      u.isUnmounted || (V(), T(f.value), v.value = "loaded", n("load", f.value?.currentSrc || p.value.src));
    }
    function _() {
      u.isUnmounted || (v.value = "error", n("error", f.value?.currentSrc || p.value.src));
    }
    function V() {
      const J = f.value;
      J && (c.value = J.currentSrc || J.src);
    }
    let A = -1;
    W2(() => {
      clearTimeout(A);
    });
    function T(J) {
      let ae = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100;
      const oe = () => {
        if (clearTimeout(A), u.isUnmounted) return;
        const {
          naturalHeight: te,
          naturalWidth: L
        } = J;
        te || L ? (h.value = L, y.value = te) : !J.complete && v.value === "loading" && ae != null ? A = window.setTimeout(oe, ae) : (J.currentSrc.endsWith(".svg") || J.currentSrc.startsWith("data:image/svg+xml")) && (h.value = 1, y.value = 1);
      };
      oe();
    }
    const O = R(() => ({
      "v-img__img--cover": e.cover,
      "v-img__img--contain": !e.cover
    })), Y = () => {
      if (!p.value.src || v.value === "idle") return null;
      const J = I("img", {
        class: ve(["v-img__img", O.value]),
        style: {
          objectPosition: e.position
        },
        crossorigin: e.crossorigin,
        src: p.value.src,
        srcset: p.value.srcset,
        alt: e.alt,
        referrerpolicy: e.referrerpolicy,
        draggable: e.draggable,
        sizes: e.sizes,
        ref: f,
        onLoad: w,
        onError: _
      }, null), ae = a.sources?.();
      return g(Nt, {
        transition: e.transition,
        appear: !0
      }, {
        default: () => [g2(ae ? I("picture", {
          class: "v-img__picture"
        }, [ae, J]) : J, [[dt, v.value === "loaded"]])]
      });
    }, F = () => g(Nt, {
      transition: e.transition
    }, {
      default: () => [p.value.lazySrc && v.value !== "loaded" && I("img", {
        class: ve(["v-img__img", "v-img__img--preload", O.value]),
        style: {
          objectPosition: e.position
        },
        crossorigin: e.crossorigin,
        src: p.value.lazySrc,
        alt: e.alt,
        referrerpolicy: e.referrerpolicy,
        draggable: e.draggable
      }, null)]
    }), x = () => a.placeholder ? g(Nt, {
      transition: e.transition,
      appear: !0
    }, {
      default: () => [(v.value === "loading" || v.value === "error" && !a.error) && I("div", {
        class: "v-img__placeholder"
      }, [a.placeholder()])]
    }) : null, G = () => a.error ? g(Nt, {
      transition: e.transition,
      appear: !0
    }, {
      default: () => [v.value === "error" && I("div", {
        class: "v-img__error"
      }, [a.error()])]
    }) : null, U = () => e.gradient ? I("div", {
      class: "v-img__gradient",
      style: {
        backgroundImage: `linear-gradient(${e.gradient})`
      }
    }, null) : null, ee = Ve(!1);
    {
      const J = be(k, (ae) => {
        ae && (requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ee.value = !0;
          });
        }), J());
      });
    }
    return Fe(() => {
      const J = Ys.filterProps(e);
      return g2(g(Ys, me({
        class: ["v-img", {
          "v-img--absolute": e.absolute,
          "v-img--booting": !ee.value
        }, r.value, o.value, e.class],
        style: [{
          width: Oe(e.width === "auto" ? h.value : e.width)
        }, i.value, e.style]
      }, J, {
        aspectRatio: k.value,
        "aria-label": e.alt,
        role: e.alt ? "img" : void 0
      }), {
        additional: () => I(je, null, [g(Y, null, null), g(F, null, null), g(U, null, null), g(x, null, null), g(G, null, null)]),
        default: a.default
      }), [[vr, {
        handler: S,
        options: e.options
      }, null, {
        once: !0
      }]]);
    }), {
      currentSrc: c,
      image: f,
      state: v,
      naturalWidth: h,
      naturalHeight: y
    };
  }
}), u0 = ce({
  border: [Boolean, Number, String]
}, "border");
function L0(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : At();
  return {
    borderClasses: E(() => {
      const a = e.border;
      return a === !0 || a === "" ? `${t}--border` : typeof a == "string" || a === 0 ? String(a).split(" ").map((r) => `border-${r}`) : [];
    })
  };
}
const Oc = [null, "default", "comfortable", "compact"], z2 = ce({
  density: {
    type: String,
    default: "default",
    validator: (e) => Oc.includes(e)
  }
}, "density");
function bt(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : At();
  return {
    densityClasses: R(() => `${t}--density-${e.density}`)
  };
}
const Fc = ["elevated", "flat", "tonal", "outlined", "text", "plain"];
function ua(e, t) {
  return I(je, null, [e && I("span", {
    key: "overlay",
    class: ve(`${t}__overlay`)
  }, null), I("span", {
    key: "underlay",
    class: ve(`${t}__underlay`)
  }, null)]);
}
const Ht = ce({
  color: String,
  variant: {
    type: String,
    default: "elevated",
    validator: (e) => Fc.includes(e)
  }
}, "variant");
function ca(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : At();
  const n = R(() => {
    const {
      variant: i
    } = u2(e);
    return `${t}--variant-${i}`;
  }), {
    colorClasses: a,
    colorStyles: r
  } = Hl(() => {
    const {
      variant: i,
      color: o
    } = u2(e);
    return {
      [["elevated", "flat"].includes(i) ? "background" : "text"]: o
    };
  });
  return {
    colorClasses: a,
    colorStyles: r,
    variantClasses: n
  };
}
const Lc = ce({
  start: Boolean,
  end: Boolean,
  icon: Ke,
  image: String,
  text: String,
  ...u0(),
  ...qe(),
  ...z2(),
  ...it(),
  ...mn(),
  ...l2(),
  ...y2(),
  ...Ht({
    variant: "flat"
  })
}, "VAvatar"), rt = Ae()({
  name: "VAvatar",
  props: Lc(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: a
    } = V2(e), {
      borderClasses: r
    } = L0(e), {
      colorClasses: i,
      colorStyles: o,
      variantClasses: u
    } = ca(e), {
      densityClasses: c
    } = bt(e), {
      roundedClasses: f
    } = ft(e), {
      sizeClasses: v,
      sizeStyles: h
    } = oa(e);
    return Fe(() => g(e.tag, {
      class: ve(["v-avatar", {
        "v-avatar--start": e.start,
        "v-avatar--end": e.end
      }, a.value, r.value, i.value, c.value, f.value, v.value, u.value, e.class]),
      style: Ee([o.value, h.value, e.style])
    }, {
      default: () => [n.default ? g(k2, {
        key: "content-defaults",
        defaults: {
          VImg: {
            cover: !0,
            src: e.image
          },
          VIcon: {
            icon: e.icon
          }
        }
      }, {
        default: () => [n.default()]
      }) : e.image ? g(gn, {
        key: "image",
        src: e.image,
        alt: "",
        cover: !0
      }, null) : e.icon ? g(ze, {
        key: "icon",
        icon: e.icon
      }, null) : e.text, ua(!1, "v-avatar")]
    })), {};
  }
}), Ut = ce({
  elevation: {
    type: [Number, String],
    validator(e) {
      const t = parseInt(e);
      return !isNaN(t) && t >= 0 && // Material Design has a maximum elevation of 24
      // https://material.io/design/environment/elevation.html#default-elevations
      t <= 24;
    }
  }
}, "elevation");
function c0(e) {
  return {
    elevationClasses: R(() => {
      const n = on(e) ? e.value : e.elevation;
      return n == null ? [] : [`elevation-${n}`];
    })
  };
}
const G6 = ce({
  baseColor: String,
  divided: Boolean,
  direction: {
    type: String,
    default: "horizontal"
  },
  ...u0(),
  ...qe(),
  ...z2(),
  ...Ut(),
  ...it(),
  ...l2(),
  ...y2(),
  ...Ht()
}, "VBtnGroup"), Xs = Ae()({
  name: "VBtnGroup",
  props: G6(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: a
    } = V2(e), {
      densityClasses: r
    } = bt(e), {
      borderClasses: i
    } = L0(e), {
      elevationClasses: o
    } = c0(e), {
      roundedClasses: u
    } = ft(e);
    gt({
      VBtn: {
        height: R(() => e.direction === "horizontal" ? "auto" : null),
        baseColor: R(() => e.baseColor),
        color: R(() => e.color),
        density: R(() => e.density),
        flat: !0,
        variant: R(() => e.variant)
      }
    }), Fe(() => g(e.tag, {
      class: ve(["v-btn-group", `v-btn-group--${e.direction}`, {
        "v-btn-group--divided": e.divided
      }, a.value, i.value, r.value, o.value, u.value, e.class]),
      style: Ee(e.style)
    }, n));
  }
});
function o0(e, t) {
  let n;
  function a() {
    n = fn(), n.run(() => t.length ? t(() => {
      n?.stop(), a();
    }) : t());
  }
  be(e, (r) => {
    r && !n ? a() : r || (n?.stop(), n = void 0);
  }, {
    immediate: !0
  }), i2(() => {
    n?.stop();
  });
}
function r2(e, t, n) {
  let a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : (h) => h, r = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : (h) => h;
  const i = x2("useProxiedModel"), o = se(e[t] !== void 0 ? e[t] : n), u = V0(t), f = u !== t ? E(() => (e[t], !!((i.vnode.props?.hasOwnProperty(t) || i.vnode.props?.hasOwnProperty(u)) && (i.vnode.props?.hasOwnProperty(`onUpdate:${t}`) || i.vnode.props?.hasOwnProperty(`onUpdate:${u}`))))) : E(() => (e[t], !!(i.vnode.props?.hasOwnProperty(t) && i.vnode.props?.hasOwnProperty(`onUpdate:${t}`))));
  o0(() => !f.value, () => {
    be(() => e[t], (h) => {
      o.value = h;
    });
  });
  const v = E({
    get() {
      const h = e[t];
      return a(f.value ? h : o.value);
    },
    set(h) {
      const y = r(h), p = m2(f.value ? e[t] : o.value);
      p === y || a(p) === h || (o.value = y, i?.emit(`update:${t}`, y));
    }
  });
  return Object.defineProperty(v, "externalValue", {
    get: () => f.value ? e[t] : o.value
  }), v;
}
const Or = ce({
  modelValue: {
    type: null,
    default: void 0
  },
  multiple: Boolean,
  mandatory: [Boolean, String],
  max: Number,
  selectedClass: String,
  disabled: Boolean
}, "group"), Fr = ce({
  value: null,
  disabled: Boolean,
  selectedClass: String
}, "group-item");
function Un(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  const a = x2("useGroupItem");
  if (!a)
    throw new Error("[Vuetify] useGroupItem composable must be used inside a component setup function");
  const r = Y2();
  c2(/* @__PURE__ */ Symbol.for(`${t.description}:id`), r);
  const i = We(t, null);
  if (!i) {
    if (!n) return i;
    throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${t.description}`);
  }
  const o = R(() => e.value), u = E(() => !!(i.disabled.value || e.disabled));
  function c() {
    i?.register({
      id: r,
      value: o,
      disabled: u
    }, a);
  }
  function f() {
    i?.unregister(r);
  }
  c(), W2(() => f());
  const v = E(() => i.isSelected(r)), h = E(() => i.items.value[0].id === r), y = E(() => i.items.value[i.items.value.length - 1].id === r), p = E(() => v.value && [i.selectedClass.value, e.selectedClass]);
  return be(v, (k) => {
    a.emit("group:selected", {
      value: k
    });
  }, {
    flush: "sync"
  }), {
    id: r,
    isSelected: v,
    isFirst: h,
    isLast: y,
    toggle: () => i.select(r, !v.value),
    select: (k) => i.select(r, k),
    selectedClass: p,
    value: o,
    disabled: u,
    group: i,
    register: c,
    unregister: f
  };
}
function da(e, t) {
  let n = !1;
  const a = ct([]), r = r2(e, "modelValue", [], (y) => y === void 0 ? [] : Z6(a, y === null ? [null] : $2(y)), (y) => {
    const p = Mc(a, y);
    return e.multiple ? p : p[0];
  }), i = x2("useGroup");
  function o(y, p) {
    const k = y, S = /* @__PURE__ */ Symbol.for(`${t.description}:id`), _ = Fn(S, i?.vnode).indexOf(p);
    s2(k.value) === void 0 && (k.value = _, k.useIndexAsValue = !0), _ > -1 ? a.splice(_, 0, k) : a.push(k);
  }
  function u(y) {
    if (n) return;
    c();
    const p = a.findIndex((k) => k.id === y);
    a.splice(p, 1);
  }
  function c() {
    const y = a.find((p) => !p.disabled);
    y && e.mandatory === "force" && !r.value.length && (r.value = [y.id]);
  }
  yt(() => {
    c();
  }), W2(() => {
    n = !0;
  }), x6(() => {
    for (let y = 0; y < a.length; y++)
      a[y].useIndexAsValue && (a[y].value = y);
  });
  function f(y, p) {
    const k = a.find((S) => S.id === y);
    if (!(p && k?.disabled))
      if (e.multiple) {
        const S = r.value.slice(), w = S.findIndex((V) => V === y), _ = ~w;
        if (p = p ?? !_, _ && e.mandatory && S.length <= 1 || !_ && e.max != null && S.length + 1 > e.max) return;
        w < 0 && p ? S.push(y) : w >= 0 && !p && S.splice(w, 1), r.value = S;
      } else {
        const S = r.value.includes(y);
        if (e.mandatory && S || !S && !p) return;
        r.value = p ?? !S ? [y] : [];
      }
  }
  function v(y) {
    if (e.multiple && i0('This method is not supported when using "multiple" prop'), r.value.length) {
      const p = r.value[0], k = a.findIndex((_) => _.id === p);
      let S = (k + y) % a.length, w = a[S];
      for (; w.disabled && S !== k; )
        S = (S + y) % a.length, w = a[S];
      if (w.disabled) return;
      r.value = [a[S].id];
    } else {
      const p = a.find((k) => !k.disabled);
      p && (r.value = [p.id]);
    }
  }
  const h = {
    register: o,
    unregister: u,
    selected: r,
    select: f,
    disabled: R(() => e.disabled),
    prev: () => v(a.length - 1),
    next: () => v(1),
    isSelected: (y) => r.value.includes(y),
    selectedClass: R(() => e.selectedClass),
    items: R(() => a),
    getItemIndex: (y) => Bc(a, y)
  };
  return c2(t, h), h;
}
function Bc(e, t) {
  const n = Z6(e, [t]);
  return n.length ? e.findIndex((a) => a.id === n[0]) : -1;
}
function Z6(e, t) {
  const n = [];
  return t.forEach((a) => {
    const r = e.find((o) => H2(a, o.value)), i = e[a];
    r?.value !== void 0 ? n.push(r.id) : i?.useIndexAsValue && n.push(i.id);
  }), n;
}
function Mc(e, t) {
  const n = [];
  return t.forEach((a) => {
    const r = e.findIndex((i) => i.id === a);
    if (~r) {
      const i = e[r];
      n.push(i.value !== void 0 ? i.value : r);
    }
  }), n;
}
const Y6 = /* @__PURE__ */ Symbol.for("vuetify:v-btn-toggle"), Rc = ce({
  ...G6(),
  ...Or()
}, "VBtnToggle"), X6 = Ae()({
  name: "VBtnToggle",
  props: Rc(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      isSelected: a,
      next: r,
      prev: i,
      select: o,
      selected: u
    } = da(e, Y6);
    return Fe(() => {
      const c = Xs.filterProps(e);
      return g(Xs, me({
        class: ["v-btn-toggle", e.class]
      }, c, {
        style: e.style
      }), {
        default: () => [n.default?.({
          isSelected: a,
          next: r,
          prev: i,
          select: o,
          selected: u
        })]
      });
    }), {
      next: r,
      prev: i,
      select: o
    };
  }
});
function Q6(e, t) {
  const n = se(), a = Ve(!1);
  if (Rl) {
    const r = new IntersectionObserver((i) => {
      a.value = !!i.find((o) => o.isIntersecting);
    }, t);
    i2(() => {
      r.disconnect();
    }), be(n, (i, o) => {
      o && (r.unobserve(o), a.value = !1), i && r.observe(i);
    }, {
      flush: "post"
    });
  }
  return {
    intersectionRef: n,
    isIntersecting: a
  };
}
function T0(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "content";
  const n = ll(), a = se();
  if (w2) {
    const r = new ResizeObserver((i) => {
      e?.(i, r), i.length && (t === "content" ? a.value = i[0].contentRect : a.value = i[0].target.getBoundingClientRect());
    });
    W2(() => {
      r.disconnect();
    }), be(() => n.el, (i, o) => {
      o && (r.unobserve(o), a.value = void 0), i && r.observe(i);
    }, {
      flush: "post"
    });
  }
  return {
    resizeRef: n,
    contentRect: ia(a)
  };
}
const Dc = ce({
  bgColor: String,
  color: String,
  indeterminate: [Boolean, String],
  modelValue: {
    type: [Number, String],
    default: 0
  },
  rotate: {
    type: [Number, String],
    default: 0
  },
  width: {
    type: [Number, String],
    default: 4
  },
  ...qe(),
  ...mn(),
  ...l2({
    tag: "div"
  }),
  ...y2()
}, "VProgressCircular"), Nc = Ae()({
  name: "VProgressCircular",
  props: Dc(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = 20, r = 2 * Math.PI * a, i = se(), {
      themeClasses: o
    } = V2(e), {
      sizeClasses: u,
      sizeStyles: c
    } = oa(e), {
      textColorClasses: f,
      textColorStyles: v
    } = ht(() => e.color), {
      textColorClasses: h,
      textColorStyles: y
    } = ht(() => e.bgColor), {
      intersectionRef: p,
      isIntersecting: k
    } = Q6(), {
      resizeRef: S,
      contentRect: w
    } = T0(), _ = R(() => q2(parseFloat(e.modelValue), 0, 100)), V = R(() => Number(e.width)), A = R(() => c.value ? Number(e.size) : w.value ? w.value.width : Math.max(V.value, 32)), T = R(() => a / (1 - V.value / A.value) * 2), O = R(() => V.value / A.value * T.value), Y = R(() => Oe((100 - _.value) / 100 * r));
    return b2(() => {
      p.value = i.value, S.value = i.value;
    }), Fe(() => g(e.tag, {
      ref: i,
      class: ve(["v-progress-circular", {
        "v-progress-circular--indeterminate": !!e.indeterminate,
        "v-progress-circular--visible": k.value,
        "v-progress-circular--disable-shrink": e.indeterminate && (e.indeterminate === "disable-shrink" || $0())
      }, o.value, u.value, f.value, e.class]),
      style: Ee([c.value, v.value, e.style]),
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": e.indeterminate ? void 0 : _.value
    }, {
      default: () => [I("svg", {
        style: {
          transform: `rotate(calc(-90deg + ${Number(e.rotate)}deg))`
        },
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: `0 0 ${T.value} ${T.value}`
      }, [I("circle", {
        class: ve(["v-progress-circular__underlay", h.value]),
        style: Ee(y.value),
        fill: "transparent",
        cx: "50%",
        cy: "50%",
        r: a,
        "stroke-width": O.value,
        "stroke-dasharray": r,
        "stroke-dashoffset": 0
      }, null), I("circle", {
        class: "v-progress-circular__overlay",
        fill: "transparent",
        cx: "50%",
        cy: "50%",
        r: a,
        "stroke-width": O.value,
        "stroke-dasharray": r,
        "stroke-dashoffset": Y.value
      }, null)]), n.default && I("div", {
        class: "v-progress-circular__content"
      }, [n.default({
        value: _.value
      })])]
    })), {};
  }
}), J6 = /* @__PURE__ */ Symbol.for("vuetify:locale");
function wt() {
  const e = We(J6);
  if (!e) throw new Error("[Vuetify] Could not find injected locale instance");
  return e;
}
function xt() {
  const e = We(J6);
  if (!e) throw new Error("[Vuetify] Could not find injected rtl instance");
  return {
    isRtl: e.isRtl,
    rtlClasses: e.rtlClasses
  };
}
const Qs = {
  center: "center",
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}, Lr = ce({
  location: String
}, "location");
function Br(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, n = arguments.length > 2 ? arguments[2] : void 0;
  const {
    isRtl: a
  } = xt();
  return {
    locationStyles: E(() => {
      if (!e.location) return {};
      const {
        side: i,
        align: o
      } = ol(e.location.split(" ").length > 1 ? e.location : `${e.location} center`, a.value);
      function u(f) {
        return n ? n(f) : 0;
      }
      const c = {};
      return i !== "center" && (t ? c[Qs[i]] = `calc(100% - ${u(i)}px)` : c[i] = 0), o !== "center" ? t ? c[Qs[o]] = `calc(100% - ${u(o)}px)` : c[o] = 0 : (i === "center" ? c.top = c.left = "50%" : c[{
        top: "left",
        bottom: "left",
        left: "top",
        right: "top"
      }[i]] = "50%", c.transform = {
        top: "translateX(-50%)",
        bottom: "translateX(-50%)",
        left: "translateY(-50%)",
        right: "translateY(-50%)",
        center: "translate(-50%, -50%)"
      }[i]), c;
    })
  };
}
const zc = ce({
  chunkCount: {
    type: [Number, String],
    default: null
  },
  chunkWidth: {
    type: [Number, String],
    default: null
  },
  chunkGap: {
    type: [Number, String],
    default: 4
  }
}, "chunks");
function jc(e, t) {
  const n = R(() => !!e.chunkCount || !!e.chunkWidth), a = E(() => {
    const u = u2(t);
    if (!u)
      return 0;
    if (!e.chunkCount)
      return Number(e.chunkWidth);
    const c = Number(e.chunkCount);
    return (u - Number(e.chunkGap) * (c - 1)) / c;
  }), r = R(() => Number(e.chunkGap)), i = E(() => {
    if (!n.value)
      return {};
    const u = Oe(r.value), c = Oe(a.value);
    return {
      maskRepeat: "repeat-x",
      maskImage: `linear-gradient(90deg, #000, #000 ${c}, transparent ${c}, transparent)`,
      maskSize: `calc(${c} + ${u}) 100%`
    };
  });
  function o(u) {
    const c = u2(t);
    if (!c)
      return u;
    const f = 100 * r.value / c, v = 100 * (a.value + r.value) / c, h = Math.floor((u + f) / v);
    return q2(0, h * v - f / 2, 100);
  }
  return {
    hasChunks: n,
    chunksMaskStyles: i,
    snapValueToChunk: o
  };
}
const Kc = ce({
  absolute: Boolean,
  active: {
    type: Boolean,
    default: !0
  },
  bgColor: String,
  bgOpacity: [Number, String],
  bufferValue: {
    type: [Number, String],
    default: 0
  },
  bufferColor: String,
  bufferOpacity: [Number, String],
  clickable: Boolean,
  color: String,
  height: {
    type: [Number, String],
    default: 4
  },
  indeterminate: Boolean,
  max: {
    type: [Number, String],
    default: 100
  },
  modelValue: {
    type: [Number, String],
    default: 0
  },
  opacity: [Number, String],
  reverse: Boolean,
  stream: Boolean,
  striped: Boolean,
  roundedBar: Boolean,
  ...zc(),
  ...qe(),
  ...Lr({
    location: "top"
  }),
  ...it(),
  ...l2(),
  ...y2()
}, "VProgressLinear"), Wc = Ae()({
  name: "VProgressLinear",
  props: Kc(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = se(), r = r2(e, "modelValue"), {
      isRtl: i,
      rtlClasses: o
    } = xt(), {
      themeClasses: u
    } = V2(e), {
      locationStyles: c
    } = Br(e), {
      textColorClasses: f,
      textColorStyles: v
    } = ht(() => e.color), {
      backgroundColorClasses: h,
      backgroundColorStyles: y
    } = at(() => e.bgColor || e.color), {
      backgroundColorClasses: p,
      backgroundColorStyles: k
    } = at(() => e.bufferColor || e.bgColor || e.color), {
      backgroundColorClasses: S,
      backgroundColorStyles: w
    } = at(() => e.color), {
      roundedClasses: _
    } = ft(e), {
      intersectionRef: V,
      isIntersecting: A
    } = Q6(), T = E(() => parseFloat(e.max)), O = E(() => parseFloat(e.height)), Y = E(() => q2(parseFloat(e.bufferValue) / T.value * 100, 0, 100)), F = E(() => q2(parseFloat(r.value) / T.value * 100, 0, 100)), x = E(() => i.value !== e.reverse), G = E(() => e.indeterminate ? "fade-transition" : "slide-x-transition"), U = Ve(0), {
      hasChunks: ee,
      chunksMaskStyles: J,
      snapValueToChunk: ae
    } = jc(e, U);
    o0(ee, () => {
      const {
        resizeRef: X
      } = T0((re) => U.value = re[0].contentRect.width);
      b2(() => X.value = a.value);
    });
    const oe = E(() => ee.value ? ae(Y.value) : Y.value), te = E(() => ee.value ? ae(F.value) : F.value);
    function L(X) {
      if (!V.value) return;
      const {
        left: re,
        right: we,
        width: le
      } = V.value.getBoundingClientRect(), ke = x.value ? le - X.clientX + (we - le) : X.clientX - re;
      r.value = Math.round(ke / le * T.value);
    }
    return b2(() => {
      V.value = a.value;
    }), Fe(() => g(e.tag, {
      ref: a,
      class: ve(["v-progress-linear", {
        "v-progress-linear--absolute": e.absolute,
        "v-progress-linear--active": e.active && A.value,
        "v-progress-linear--reverse": x.value,
        "v-progress-linear--rounded": e.rounded,
        "v-progress-linear--rounded-bar": e.roundedBar,
        "v-progress-linear--striped": e.striped,
        "v-progress-linear--clickable": e.clickable
      }, _.value, u.value, o.value, e.class]),
      style: Ee([{
        bottom: e.location === "bottom" ? 0 : void 0,
        top: e.location === "top" ? 0 : void 0,
        height: e.active ? Oe(O.value) : 0,
        "--v-progress-linear-height": Oe(O.value),
        ...e.absolute ? c.value : {}
      }, J.value, e.style]),
      role: "progressbar",
      "aria-hidden": e.active ? "false" : "true",
      "aria-valuemin": "0",
      "aria-valuemax": e.max,
      "aria-valuenow": e.indeterminate ? void 0 : Math.min(parseFloat(r.value), T.value),
      onClick: e.clickable && L
    }, {
      default: () => [e.stream && I("div", {
        key: "stream",
        class: ve(["v-progress-linear__stream", f.value]),
        style: {
          ...v.value,
          [x.value ? "left" : "right"]: Oe(-O.value),
          borderTop: `${Oe(O.value / 2)} dotted`,
          opacity: parseFloat(e.bufferOpacity),
          top: `calc(50% - ${Oe(O.value / 4)})`,
          width: Oe(100 - Y.value, "%"),
          "--v-progress-linear-stream-to": Oe(O.value * (x.value ? 1 : -1))
        }
      }, null), I("div", {
        class: ve(["v-progress-linear__background", h.value]),
        style: Ee([y.value, {
          opacity: parseFloat(e.bgOpacity),
          width: e.stream ? 0 : void 0
        }])
      }, null), I("div", {
        class: ve(["v-progress-linear__buffer", p.value]),
        style: Ee([k.value, {
          opacity: parseFloat(e.bufferOpacity),
          width: Oe(oe.value, "%")
        }])
      }, null), g(G2, {
        name: G.value
      }, {
        default: () => [e.indeterminate ? I("div", {
          class: "v-progress-linear__indeterminate"
        }, [["long", "short"].map((X) => I("div", {
          key: X,
          class: ve(["v-progress-linear__indeterminate", X, S.value]),
          style: Ee(w.value)
        }, null))]) : I("div", {
          class: ve(["v-progress-linear__determinate", S.value]),
          style: Ee([w.value, {
            width: Oe(te.value, "%")
          }])
        }, null)]
      }), n.default && I("div", {
        class: "v-progress-linear__content"
      }, [n.default({
        value: F.value,
        buffer: Y.value
      })])]
    })), {};
  }
}), Ul = ce({
  loading: [Boolean, String]
}, "loader");
function Gl(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : At();
  return {
    loaderClasses: R(() => ({
      [`${t}--loading`]: e.loading
    }))
  };
}
function e5(e, t) {
  let {
    slots: n
  } = t;
  return I("div", {
    class: ve(`${e.name}__loader`)
  }, [n.default?.({
    color: e.color,
    isActive: e.active
  }) || g(Wc, {
    absolute: e.absolute,
    active: e.active,
    color: e.color,
    height: "2",
    indeterminate: !0
  }, null)]);
}
const qc = ["static", "relative", "fixed", "absolute", "sticky"], Zl = ce({
  position: {
    type: String,
    validator: (
      /* istanbul ignore next */
      (e) => qc.includes(e)
    )
  }
}, "position");
function Yl(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : At();
  return {
    positionClasses: R(() => e.position ? `${t}--${e.position}` : void 0)
  };
}
function Hc() {
  const e = x2("useRoute");
  return E(() => e?.proxy?.$route);
}
function Uc() {
  return x2("useRouter")?.proxy?.$router;
}
function Xl(e, t) {
  const n = S6("RouterLink"), a = R(() => !!(e.href || e.to)), r = E(() => a?.value || As(t, "click") || As(e, "click"));
  if (typeof n == "string" || !("useLink" in n)) {
    const h = R(() => e.href);
    return {
      isLink: a,
      isRouterLink: R(() => !1),
      isClickable: r,
      href: h,
      linkProps: ct({
        href: h
      })
    };
  }
  const i = n.useLink({
    to: R(() => e.to || ""),
    replace: R(() => e.replace)
  }), o = E(() => e.to ? i : void 0), u = Hc(), c = E(() => o.value ? e.exact ? u.value ? o.value.isExactActive?.value && H2(o.value.route.value.query, u.value.query) : o.value.isExactActive?.value ?? !1 : o.value.isActive?.value ?? !1 : !1), f = E(() => e.to ? o.value?.route.value.href : e.href), v = R(() => !!e.to);
  return {
    isLink: a,
    isRouterLink: v,
    isClickable: r,
    isActive: c,
    route: o.value?.route,
    navigate: o.value?.navigate,
    href: f,
    linkProps: ct({
      href: f,
      "aria-current": R(() => c.value ? "page" : void 0),
      "aria-disabled": R(() => e.disabled && a.value ? "true" : void 0),
      tabindex: R(() => e.disabled && a.value ? "-1" : void 0)
    })
  };
}
const Ql = ce({
  href: String,
  replace: Boolean,
  to: [String, Object],
  exact: Boolean
}, "router");
let Ni = !1;
function Gc(e, t) {
  let n = !1, a, r;
  w2 && e?.beforeEach && (e2(() => {
    window.addEventListener("popstate", i), a = e.beforeEach((o, u, c) => {
      Ni ? n ? t(c) : c() : setTimeout(() => n ? t(c) : c()), Ni = !0;
    }), r = e?.afterEach(() => {
      Ni = !1;
    });
  }), i2(() => {
    window.removeEventListener("popstate", i), a?.(), r?.();
  }));
  function i(o) {
    o.state?.replaced || (n = !0, setTimeout(() => n = !1));
  }
}
function Zc(e, t) {
  be(() => e.isActive?.value, (n) => {
    e.isLink.value && n != null && t && e2(() => {
      t(n);
    });
  }, {
    immediate: !0
  });
}
const cl = /* @__PURE__ */ Symbol("rippleStop"), Yc = 80;
function Js(e, t) {
  e.style.transform = t, e.style.webkitTransform = t;
}
function dl(e) {
  return e.constructor.name === "TouchEvent";
}
function t5(e) {
  return e.constructor.name === "KeyboardEvent";
}
const Xc = function(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a = 0, r = 0;
  if (!t5(e)) {
    const h = t.getBoundingClientRect(), y = dl(e) ? e.touches[e.touches.length - 1] : e;
    a = y.clientX - h.left, r = y.clientY - h.top;
  }
  let i = 0, o = 0.3;
  t._ripple?.circle ? (o = 0.15, i = t.clientWidth / 2, i = n.center ? i : i + Math.sqrt((a - i) ** 2 + (r - i) ** 2) / 4) : i = Math.sqrt(t.clientWidth ** 2 + t.clientHeight ** 2) / 2;
  const u = `${(t.clientWidth - i * 2) / 2}px`, c = `${(t.clientHeight - i * 2) / 2}px`, f = n.center ? u : `${a - i}px`, v = n.center ? c : `${r - i}px`;
  return {
    radius: i,
    scale: o,
    x: f,
    y: v,
    centerX: u,
    centerY: c
  };
}, mr = {
  /* eslint-disable max-statements */
  show(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (!t?._ripple?.enabled)
      return;
    const a = document.createElement("span"), r = document.createElement("span");
    a.appendChild(r), a.className = "v-ripple__container", n.class && (a.className += ` ${n.class}`);
    const {
      radius: i,
      scale: o,
      x: u,
      y: c,
      centerX: f,
      centerY: v
    } = Xc(e, t, n), h = `${i * 2}px`;
    r.className = "v-ripple__animation", r.style.width = h, r.style.height = h, t.appendChild(a);
    const y = window.getComputedStyle(t);
    y && y.position === "static" && (t.style.position = "relative", t.dataset.previousPosition = "static"), r.classList.add("v-ripple__animation--enter"), r.classList.add("v-ripple__animation--visible"), Js(r, `translate(${u}, ${c}) scale3d(${o},${o},${o})`), r.dataset.activated = String(performance.now()), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        r.classList.remove("v-ripple__animation--enter"), r.classList.add("v-ripple__animation--in"), Js(r, `translate(${f}, ${v}) scale3d(1,1,1)`);
      });
    });
  },
  hide(e) {
    if (!e?._ripple?.enabled) return;
    const t = e.getElementsByClassName("v-ripple__animation");
    if (t.length === 0) return;
    const n = Array.from(t).findLast((i) => !i.dataset.isHiding);
    if (n) n.dataset.isHiding = "true";
    else return;
    const a = performance.now() - Number(n.dataset.activated), r = Math.max(250 - a, 0);
    setTimeout(() => {
      n.classList.remove("v-ripple__animation--in"), n.classList.add("v-ripple__animation--out"), setTimeout(() => {
        e.getElementsByClassName("v-ripple__animation").length === 1 && e.dataset.previousPosition && (e.style.position = e.dataset.previousPosition, delete e.dataset.previousPosition), n.parentNode?.parentNode === e && e.removeChild(n.parentNode);
      }, 300);
    }, r);
  }
};
function n5(e) {
  return typeof e > "u" || !!e;
}
function Gn(e) {
  const t = {}, n = e.currentTarget;
  if (!(!n?._ripple || n._ripple.touched || e[cl])) {
    if (e[cl] = !0, dl(e))
      n._ripple.touched = !0, n._ripple.isTouch = !0;
    else if (n._ripple.isTouch) return;
    if (t.center = n._ripple.centered || t5(e), n._ripple.class && (t.class = n._ripple.class), dl(e)) {
      if (n._ripple.showTimerCommit) return;
      n._ripple.showTimerCommit = () => {
        mr.show(e, n, t);
      }, n._ripple.showTimer = window.setTimeout(() => {
        n?._ripple?.showTimerCommit && (n._ripple.showTimerCommit(), n._ripple.showTimerCommit = null);
      }, Yc);
    } else
      mr.show(e, n, t);
  }
}
function e1(e) {
  e[cl] = !0;
}
function et(e) {
  const t = e.currentTarget;
  if (t?._ripple) {
    if (window.clearTimeout(t._ripple.showTimer), e.type === "touchend" && t._ripple.showTimerCommit) {
      t._ripple.showTimerCommit(), t._ripple.showTimerCommit = null, t._ripple.showTimer = window.setTimeout(() => {
        et(e);
      });
      return;
    }
    window.setTimeout(() => {
      t._ripple && (t._ripple.touched = !1);
    }), mr.hide(t);
  }
}
function a5(e) {
  const t = e.currentTarget;
  t?._ripple && (t._ripple.showTimerCommit && (t._ripple.showTimerCommit = null), window.clearTimeout(t._ripple.showTimer));
}
let Zn = !1;
function t1(e, t) {
  !Zn && t.includes(e.key) && (Zn = !0, Gn(e));
}
function r5(e) {
  Zn = !1, et(e);
}
function i5(e) {
  Zn && (Zn = !1, et(e));
}
function l5(e, t, n) {
  const {
    value: a,
    modifiers: r
  } = t, i = n5(a);
  i || mr.hide(e), e._ripple = e._ripple ?? {}, e._ripple.enabled = i, e._ripple.centered = r.center, e._ripple.circle = r.circle;
  const o = or(a) ? a : {};
  o.class && (e._ripple.class = o.class);
  const u = o.keys ?? ["Enter", "Space"];
  if (e._ripple.keyDownHandler = (c) => t1(c, u), i && !n) {
    if (r.stop) {
      e.addEventListener("touchstart", e1, {
        passive: !0
      }), e.addEventListener("mousedown", e1);
      return;
    }
    e.addEventListener("touchstart", Gn, {
      passive: !0
    }), e.addEventListener("touchend", et, {
      passive: !0
    }), e.addEventListener("touchmove", a5, {
      passive: !0
    }), e.addEventListener("touchcancel", et), e.addEventListener("mousedown", Gn), e.addEventListener("mouseup", et), e.addEventListener("mouseleave", et), e.addEventListener("keydown", (c) => t1(c, u)), e.addEventListener("keyup", r5), e.addEventListener("blur", i5), e.addEventListener("dragstart", et, {
      passive: !0
    });
  } else !i && n && o5(e);
}
function o5(e) {
  e.removeEventListener("mousedown", Gn), e.removeEventListener("touchstart", Gn), e.removeEventListener("touchend", et), e.removeEventListener("touchmove", a5), e.removeEventListener("touchcancel", et), e.removeEventListener("mouseup", et), e.removeEventListener("mouseleave", et), e._ripple?.keyDownHandler && e.removeEventListener("keydown", e._ripple.keyDownHandler), e.removeEventListener("keyup", r5), e.removeEventListener("dragstart", et), e.removeEventListener("blur", i5);
}
function Qc(e, t) {
  l5(e, t, !1);
}
function Jc(e) {
  o5(e), delete e._ripple;
}
function e8(e, t) {
  if (t.value === t.oldValue)
    return;
  const n = n5(t.oldValue);
  l5(e, t, n);
}
const Kt = {
  mounted: Qc,
  unmounted: Jc,
  updated: e8
}, s5 = ce({
  active: {
    type: Boolean,
    default: void 0
  },
  activeColor: String,
  baseColor: String,
  symbol: {
    type: null,
    default: Y6
  },
  flat: Boolean,
  icon: [Boolean, String, Function, Object],
  prependIcon: Ke,
  appendIcon: Ke,
  block: Boolean,
  readonly: Boolean,
  slim: Boolean,
  stacked: Boolean,
  spaced: String,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  text: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...u0(),
  ...qe(),
  ...z2(),
  ...Ct(),
  ...Ut(),
  ...Fr(),
  ...Ul(),
  ...Lr(),
  ...Zl(),
  ...it(),
  ...Ql(),
  ...mn(),
  ...l2({
    tag: "button"
  }),
  ...y2(),
  ...Ht({
    variant: "elevated"
  })
}, "VBtn"), Je = Ae()({
  name: "VBtn",
  props: s5(),
  emits: {
    "group:selected": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      slots: a
    } = t;
    const {
      themeClasses: r
    } = V2(e), {
      borderClasses: i
    } = L0(e), {
      densityClasses: o
    } = bt(e), {
      dimensionStyles: u
    } = pt(e), {
      elevationClasses: c
    } = c0(e), {
      loaderClasses: f
    } = Gl(e), {
      locationStyles: v
    } = Br(e), {
      positionClasses: h
    } = Yl(e), {
      roundedClasses: y
    } = ft(e), {
      sizeClasses: p,
      sizeStyles: k
    } = oa(e), S = Un(e, e.symbol, !1), w = Xl(e, n), _ = E(() => e.active !== void 0 ? e.active : w.isRouterLink.value ? w.isActive?.value : S?.isSelected.value), V = R(() => _.value ? e.activeColor ?? e.color : e.color), A = E(() => ({
      color: S?.isSelected.value && (!w.isLink.value || w.isActive?.value) || !S || w.isActive?.value ? V.value ?? e.baseColor : e.baseColor,
      variant: e.variant
    })), {
      colorClasses: T,
      colorStyles: O,
      variantClasses: Y
    } = ca(A), F = E(() => S?.disabled.value || e.disabled), x = R(() => e.variant === "elevated" && !(e.disabled || e.flat || e.border)), G = E(() => {
      if (!(e.value === void 0 || typeof e.value == "symbol"))
        return Object(e.value) === e.value ? JSON.stringify(e.value, null, 0) : e.value;
    });
    function U(ee) {
      F.value || w.isLink.value && (ee.metaKey || ee.ctrlKey || ee.shiftKey || ee.button !== 0 || n.target === "_blank") || (w.isRouterLink.value ? w.navigate?.(ee) : S?.toggle());
    }
    return Zc(w, S?.select), Fe(() => {
      const ee = w.isLink.value ? "a" : e.tag, J = !!(e.prependIcon || a.prepend), ae = !!(e.appendIcon || a.append), oe = !!(e.icon && e.icon !== !0);
      return g2(g(ee, me(w.linkProps, {
        type: ee === "a" ? void 0 : "button",
        class: ["v-btn", S?.selectedClass.value, {
          "v-btn--active": _.value,
          "v-btn--block": e.block,
          "v-btn--disabled": F.value,
          "v-btn--elevated": x.value,
          "v-btn--flat": e.flat,
          "v-btn--icon": !!e.icon,
          "v-btn--loading": e.loading,
          "v-btn--readonly": e.readonly,
          "v-btn--slim": e.slim,
          "v-btn--stacked": e.stacked
        }, e.spaced ? ["v-btn--spaced", `v-btn--spaced-${e.spaced}`] : [], r.value, i.value, T.value, o.value, c.value, f.value, h.value, y.value, p.value, Y.value, e.class],
        style: [O.value, u.value, v.value, k.value, e.style],
        "aria-busy": e.loading ? !0 : void 0,
        disabled: F.value && ee !== "a" || void 0,
        tabindex: e.loading || e.readonly ? -1 : void 0,
        onClick: U,
        value: G.value
      }), {
        default: () => [ua(!0, "v-btn"), !e.icon && J && I("span", {
          key: "prepend",
          class: "v-btn__prepend"
        }, [a.prepend ? g(k2, {
          key: "prepend-defaults",
          disabled: !e.prependIcon,
          defaults: {
            VIcon: {
              icon: e.prependIcon
            }
          }
        }, a.prepend) : g(ze, {
          key: "prepend-icon",
          icon: e.prependIcon
        }, null)]), I("span", {
          class: "v-btn__content",
          "data-no-activator": ""
        }, [!a.default && oe ? g(ze, {
          key: "content-icon",
          icon: e.icon
        }, null) : g(k2, {
          key: "content-defaults",
          disabled: !oe,
          defaults: {
            VIcon: {
              icon: e.icon
            }
          }
        }, {
          default: () => [a.default?.() ?? a2(e.text)]
        })]), !e.icon && ae && I("span", {
          key: "append",
          class: "v-btn__append"
        }, [a.append ? g(k2, {
          key: "append-defaults",
          disabled: !e.appendIcon,
          defaults: {
            VIcon: {
              icon: e.appendIcon
            }
          }
        }, a.append) : g(ze, {
          key: "append-icon",
          icon: e.appendIcon
        }, null)]), !!e.loading && I("span", {
          key: "loader",
          class: "v-btn__loader"
        }, [a.loader?.() ?? g(Nc, {
          color: typeof e.loading == "boolean" ? void 0 : e.loading,
          indeterminate: !0,
          width: "2"
        }, null)])]
      }), [[Kt, !F.value && e.ripple, "", {
        center: !!e.icon
      }]]);
    }), {
      group: S
    };
  }
}), t8 = ce({
  ...qe(),
  ...l2()
}, "VCardActions"), Mr = Ae()({
  name: "VCardActions",
  props: t8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return gt({
      VBtn: {
        slim: !0,
        variant: "text"
      }
    }), Fe(() => g(e.tag, {
      class: ve(["v-card-actions", e.class]),
      style: Ee(e.style)
    }, n)), {};
  }
}), n8 = ce({
  opacity: [Number, String],
  ...qe(),
  ...l2()
}, "VCardSubtitle"), fa = Ae()({
  name: "VCardSubtitle",
  props: n8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Fe(() => g(e.tag, {
      class: ve(["v-card-subtitle", e.class]),
      style: Ee([{
        "--v-card-subtitle-opacity": e.opacity
      }, e.style])
    }, n)), {};
  }
}), d0 = $r("v-card-title"), a8 = ce({
  appendAvatar: String,
  appendIcon: Ke,
  prependAvatar: String,
  prependIcon: Ke,
  subtitle: {
    type: [String, Number, Boolean],
    default: void 0
  },
  title: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...qe(),
  ...z2(),
  ...l2()
}, "VCardItem"), Rr = Ae()({
  name: "VCardItem",
  props: a8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Fe(() => {
      const a = !!(e.prependAvatar || e.prependIcon), r = !!(a || n.prepend), i = !!(e.appendAvatar || e.appendIcon), o = !!(i || n.append), u = !!(e.title != null || n.title), c = !!(e.subtitle != null || n.subtitle);
      return g(e.tag, {
        class: ve(["v-card-item", e.class]),
        style: Ee(e.style)
      }, {
        default: () => [r && I("div", {
          key: "prepend",
          class: "v-card-item__prepend"
        }, [n.prepend ? g(k2, {
          key: "prepend-defaults",
          disabled: !a,
          defaults: {
            VAvatar: {
              density: e.density,
              image: e.prependAvatar
            },
            VIcon: {
              density: e.density,
              icon: e.prependIcon
            }
          }
        }, n.prepend) : I(je, null, [e.prependAvatar && g(rt, {
          key: "prepend-avatar",
          density: e.density,
          image: e.prependAvatar
        }, null), e.prependIcon && g(ze, {
          key: "prepend-icon",
          density: e.density,
          icon: e.prependIcon
        }, null)])]), I("div", {
          class: "v-card-item__content"
        }, [u && g(d0, {
          key: "title"
        }, {
          default: () => [n.title?.() ?? a2(e.title)]
        }), c && g(fa, {
          key: "subtitle"
        }, {
          default: () => [n.subtitle?.() ?? a2(e.subtitle)]
        }), n.default?.()]), o && I("div", {
          key: "append",
          class: "v-card-item__append"
        }, [n.append ? g(k2, {
          key: "append-defaults",
          disabled: !i,
          defaults: {
            VAvatar: {
              density: e.density,
              image: e.appendAvatar
            },
            VIcon: {
              density: e.density,
              icon: e.appendIcon
            }
          }
        }, n.append) : I(je, null, [e.appendIcon && g(ze, {
          key: "append-icon",
          density: e.density,
          icon: e.appendIcon
        }, null), e.appendAvatar && g(rt, {
          key: "append-avatar",
          density: e.density,
          image: e.appendAvatar
        }, null)])])]
      });
    }), {};
  }
}), r8 = ce({
  opacity: [Number, String],
  ...qe(),
  ...l2()
}, "VCardText"), Dr = Ae()({
  name: "VCardText",
  props: r8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Fe(() => g(e.tag, {
      class: ve(["v-card-text", e.class]),
      style: Ee([{
        "--v-card-text-opacity": e.opacity
      }, e.style])
    }, n)), {};
  }
}), i8 = ce({
  color: String,
  inset: Boolean,
  length: [Number, String],
  opacity: [Number, String],
  thickness: [Number, String],
  vertical: Boolean,
  ...qe(),
  ...y2()
}, "VDivider"), Wt = Ae()({
  name: "VDivider",
  props: i8(),
  setup(e, t) {
    let {
      attrs: n,
      slots: a
    } = t;
    const {
      themeClasses: r
    } = V2(e), {
      textColorClasses: i,
      textColorStyles: o
    } = ht(() => e.color), u = E(() => {
      const c = {};
      return e.length && (c[e.vertical ? "height" : "width"] = Oe(e.length)), e.thickness && (c[e.vertical ? "borderRightWidth" : "borderTopWidth"] = Oe(e.thickness)), c;
    });
    return Fe(() => {
      const c = I("hr", {
        class: ve([{
          "v-divider": !0,
          "v-divider--inset": e.inset,
          "v-divider--vertical": e.vertical
        }, r.value, i.value, e.class]),
        style: Ee([u.value, o.value, {
          "--v-border-opacity": e.opacity
        }, e.style]),
        "aria-orientation": !n.role || n.role === "separator" ? e.vertical ? "vertical" : "horizontal" : void 0,
        role: `${n.role || "separator"}`
      }, null);
      return a.default ? I("div", {
        class: ve(["v-divider__wrapper", {
          "v-divider__wrapper--vertical": e.vertical,
          "v-divider__wrapper--inset": e.inset
        }])
      }, [c, I("div", {
        class: "v-divider__content"
      }, [a.default()]), c]) : c;
    }), {};
  }
}), l8 = ce({
  fluid: {
    type: Boolean,
    default: !1
  },
  ...qe(),
  ...Ct(),
  ...l2()
}, "VContainer"), o8 = Ae()({
  name: "VContainer",
  props: l8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      rtlClasses: a
    } = xt(), {
      dimensionStyles: r
    } = pt(e);
    return Fe(() => g(e.tag, {
      class: ve(["v-container", {
        "v-container--fluid": e.fluid
      }, a.value, e.class]),
      style: Ee([r.value, e.style])
    }, n)), {};
  }
}), Nr = ["sm", "md", "lg", "xl", "xxl"], s8 = /* @__PURE__ */ Symbol.for("vuetify:display"), zr = ce({
  mobile: {
    type: Boolean,
    default: !1
  },
  mobileBreakpoint: [Number, String]
}, "display");
function B0() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
    mobile: null
  }, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : At();
  const n = We(s8);
  if (!n) throw new Error("Could not find Vuetify display injection");
  const a = E(() => e.mobile ? !0 : typeof e.mobileBreakpoint == "number" ? n.width.value < e.mobileBreakpoint : e.mobileBreakpoint ? n.width.value < n.thresholds.value[e.mobileBreakpoint] : e.mobile === null ? n.mobile.value : !1), r = R(() => t ? {
    [`${t}--mobile`]: a.value
  } : {});
  return {
    ...n,
    displayClasses: r,
    mobile: a
  };
}
const u5 = Nr.reduce((e, t) => (e[t] = {
  type: [Boolean, String, Number],
  default: !1
}, e), {}), c5 = Nr.reduce((e, t) => {
  const n = "offset" + s0(t);
  return e[n] = {
    type: [String, Number],
    default: null
  }, e;
}, {}), d5 = Nr.reduce((e, t) => {
  const n = "order" + s0(t);
  return e[n] = {
    type: [String, Number],
    default: null
  }, e;
}, {}), n1 = {
  col: Object.keys(u5),
  offset: Object.keys(c5),
  order: Object.keys(d5)
};
function u8(e, t, n) {
  let a = e;
  if (!(n == null || n === !1)) {
    if (t) {
      const r = t.replace(e, "");
      a += `-${r}`;
    }
    return e === "col" && (a = "v-" + a), e === "col" && (n === "" || n === !0) || (a += `-${n}`), a.toLowerCase();
  }
}
const c8 = ["auto", "start", "end", "center", "baseline", "stretch"], d8 = ce({
  cols: {
    type: [Boolean, String, Number],
    default: !1
  },
  ...u5,
  offset: {
    type: [String, Number],
    default: null
  },
  ...c5,
  order: {
    type: [String, Number],
    default: null
  },
  ...d5,
  alignSelf: {
    type: String,
    default: null,
    validator: (e) => c8.includes(e)
  },
  ...qe(),
  ...l2()
}, "VCol"), Ye = Ae()({
  name: "VCol",
  props: d8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = E(() => {
      const r = [];
      let i;
      for (i in n1)
        n1[i].forEach((u) => {
          const c = e[u], f = u8(i, u, c);
          f && r.push(f);
        });
      const o = r.some((u) => u.startsWith("v-col-"));
      return r.push({
        // Default to .v-col if no other col-{bp}-* classes generated nor `cols` specified.
        "v-col": !o || !e.cols,
        [`v-col-${e.cols}`]: e.cols,
        [`offset-${e.offset}`]: e.offset,
        [`order-${e.order}`]: e.order,
        [`align-self-${e.alignSelf}`]: e.alignSelf
      }), r;
    });
    return () => Et(e.tag, {
      class: [a.value, e.class],
      style: e.style
    }, n.default?.());
  }
}), Jl = ["start", "end", "center"], f5 = ["space-between", "space-around", "space-evenly"];
function eo(e, t) {
  return Nr.reduce((n, a) => {
    const r = e + s0(a);
    return n[r] = t(), n;
  }, {});
}
const f8 = [...Jl, "baseline", "stretch"], v5 = (e) => f8.includes(e), m5 = eo("align", () => ({
  type: String,
  default: null,
  validator: v5
})), v8 = [...Jl, ...f5], g5 = (e) => v8.includes(e), h5 = eo("justify", () => ({
  type: String,
  default: null,
  validator: g5
})), m8 = [...Jl, ...f5, "stretch"], y5 = (e) => m8.includes(e), C5 = eo("alignContent", () => ({
  type: String,
  default: null,
  validator: y5
})), a1 = {
  align: Object.keys(m5),
  justify: Object.keys(h5),
  alignContent: Object.keys(C5)
}, g8 = {
  align: "align",
  justify: "justify",
  alignContent: "align-content"
};
function h8(e, t, n) {
  let a = g8[e];
  if (n != null) {
    if (t) {
      const r = t.replace(e, "");
      a += `-${r}`;
    }
    return a += `-${n}`, a.toLowerCase();
  }
}
const y8 = ce({
  dense: Boolean,
  noGutters: Boolean,
  align: {
    type: String,
    default: null,
    validator: v5
  },
  ...m5,
  justify: {
    type: String,
    default: null,
    validator: g5
  },
  ...h5,
  alignContent: {
    type: String,
    default: null,
    validator: y5
  },
  ...C5,
  ...qe(),
  ...l2()
}, "VRow"), A2 = Ae()({
  name: "VRow",
  props: y8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = E(() => {
      const r = [];
      let i;
      for (i in a1)
        a1[i].forEach((o) => {
          const u = e[o], c = h8(i, o, u);
          c && r.push(c);
        });
      return r.push({
        "v-row--no-gutters": e.noGutters,
        "v-row--dense": e.dense,
        [`align-${e.align}`]: e.align,
        [`justify-${e.justify}`]: e.justify,
        [`align-content-${e.alignContent}`]: e.alignContent
      }), r;
    });
    return () => Et(e.tag, {
      class: ["v-row", a.value, e.class],
      style: e.style
    }, n.default?.());
  }
}), jr = $r("v-spacer", "div", "VSpacer"), C8 = ce({
  disabled: Boolean,
  group: Boolean,
  hideOnLeave: Boolean,
  leaveAbsolute: Boolean,
  mode: String,
  origin: String
}, "transition");
function lt(e, t, n) {
  return Ae()({
    name: e,
    props: C8({
      mode: n,
      origin: t
    }),
    setup(a, r) {
      let {
        slots: i
      } = r;
      const o = {
        onBeforeEnter(u) {
          a.origin && (u.style.transformOrigin = a.origin);
        },
        onLeave(u) {
          if (a.leaveAbsolute) {
            const {
              offsetTop: c,
              offsetLeft: f,
              offsetWidth: v,
              offsetHeight: h
            } = u;
            u._transitionInitialStyles = {
              position: u.style.position,
              top: u.style.top,
              left: u.style.left,
              width: u.style.width,
              height: u.style.height
            }, u.style.position = "absolute", u.style.top = `${c}px`, u.style.left = `${f}px`, u.style.width = `${v}px`, u.style.height = `${h}px`;
          }
          a.hideOnLeave && u.style.setProperty("display", "none", "important");
        },
        onAfterLeave(u) {
          if (a.leaveAbsolute && u?._transitionInitialStyles) {
            const {
              position: c,
              top: f,
              left: v,
              width: h,
              height: y
            } = u._transitionInitialStyles;
            delete u._transitionInitialStyles, u.style.position = c || "", u.style.top = f || "", u.style.left = v || "", u.style.width = h || "", u.style.height = y || "";
          }
        }
      };
      return () => {
        const u = a.group ? cn : G2;
        return Et(u, {
          name: a.disabled ? "" : e,
          css: !a.disabled,
          ...a.group ? void 0 : {
            mode: a.mode
          },
          ...a.disabled ? {} : o
        }, i.default);
      };
    }
  });
}
function p5(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "in-out";
  return Ae()({
    name: e,
    props: {
      mode: {
        type: String,
        default: n
      },
      disabled: {
        type: Boolean,
        default: $0()
      },
      group: Boolean
    },
    setup(a, r) {
      let {
        slots: i
      } = r;
      const o = a.group ? cn : G2;
      return () => Et(o, {
        name: a.disabled ? "" : e,
        css: !a.disabled,
        // mode: props.mode, // TODO: vuejs/vue-next#3104
        ...a.disabled ? {} : t
      }, i.default);
    }
  });
}
function b5() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  const n = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1) ? "width" : "height", a = Er(`offset-${n}`);
  return {
    onBeforeEnter(o) {
      o._parent = o.parentNode, o._initialStyle = {
        transition: o.style.transition,
        overflow: o.style.overflow,
        [n]: o.style[n]
      };
    },
    onEnter(o) {
      const u = o._initialStyle;
      if (!u) return;
      o.style.setProperty("transition", "none", "important"), o.style.overflow = "hidden";
      const c = `${o[a]}px`;
      o.style[n] = "0", o.offsetHeight, o.style.transition = u.transition, e && o._parent && o._parent.classList.add(e), requestAnimationFrame(() => {
        o.style[n] = c;
      });
    },
    onAfterEnter: i,
    onEnterCancelled: i,
    onLeave(o) {
      o._initialStyle = {
        transition: "",
        overflow: o.style.overflow,
        [n]: o.style[n]
      }, o.style.overflow = "hidden", o.style[n] = `${o[a]}px`, o.offsetHeight, requestAnimationFrame(() => o.style[n] = "0");
    },
    onAfterLeave: r,
    onLeaveCancelled: r
  };
  function r(o) {
    e && o._parent && o._parent.classList.remove(e), i(o);
  }
  function i(o) {
    if (!o._initialStyle) return;
    const u = o._initialStyle[n];
    o.style.overflow = o._initialStyle.overflow, u != null && (o.style[n] = u), delete o._initialStyle;
  }
}
const p8 = ce({
  target: [Object, Array]
}, "v-dialog-transition"), zi = /* @__PURE__ */ new WeakMap(), w5 = Ae()({
  name: "VDialogTransition",
  props: p8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = {
      onBeforeEnter(r) {
        r.style.pointerEvents = "none", r.style.visibility = "hidden";
      },
      async onEnter(r, i) {
        await new Promise((y) => requestAnimationFrame(y)), await new Promise((y) => requestAnimationFrame(y)), r.style.visibility = "";
        const o = i1(e.target, r), {
          x: u,
          y: c,
          sx: f,
          sy: v,
          speed: h
        } = o;
        if (zi.set(r, o), $0())
          Mt(r, [{
            opacity: 0
          }, {}], {
            duration: 125 * h,
            easing: Hs
          }).finished.then(() => i());
        else {
          const y = Mt(r, [{
            transform: `translate(${u}px, ${c}px) scale(${f}, ${v})`,
            opacity: 0
          }, {}], {
            duration: 225 * h,
            easing: Hs
          });
          r1(r)?.forEach((p) => {
            Mt(p, [{
              opacity: 0
            }, {
              opacity: 0,
              offset: 0.33
            }, {}], {
              duration: 450 * h,
              easing: Hn
            });
          }), y.finished.then(() => i());
        }
      },
      onAfterEnter(r) {
        r.style.removeProperty("pointer-events");
      },
      onBeforeLeave(r) {
        r.style.pointerEvents = "none";
      },
      async onLeave(r, i) {
        await new Promise((y) => requestAnimationFrame(y));
        let o;
        !zi.has(r) || Array.isArray(e.target) || e.target.offsetParent || e.target.getClientRects().length ? o = i1(e.target, r) : o = zi.get(r);
        const {
          x: u,
          y: c,
          sx: f,
          sy: v,
          speed: h
        } = o;
        $0() ? Mt(r, [{}, {
          opacity: 0
        }], {
          duration: 85 * h,
          easing: Us
        }).finished.then(() => i()) : (Mt(r, [{}, {
          transform: `translate(${u}px, ${c}px) scale(${f}, ${v})`,
          opacity: 0
        }], {
          duration: 125 * h,
          easing: Us
        }).finished.then(() => i()), r1(r)?.forEach((p) => {
          Mt(p, [{}, {
            opacity: 0,
            offset: 0.2
          }, {
            opacity: 0
          }], {
            duration: 250 * h,
            easing: Hn
          });
        }));
      },
      onAfterLeave(r) {
        r.style.removeProperty("pointer-events");
      }
    };
    return () => e.target ? g(G2, me({
      name: "dialog-transition"
    }, a, {
      css: !1
    }), n) : g(G2, {
      name: "dialog-transition"
    }, n);
  }
});
function r1(e) {
  const t = e.querySelector(":scope > .v-card, :scope > .v-sheet, :scope > .v-list")?.children;
  return t && [...t];
}
function i1(e, t) {
  const n = K6(e), a = Kl(t), [r, i] = getComputedStyle(t).transformOrigin.split(" ").map((_) => parseFloat(_)), [o, u] = getComputedStyle(t).getPropertyValue("--v-overlay-anchor-origin").split(" ");
  let c = n.left + n.width / 2;
  o === "left" || u === "left" ? c -= n.width / 2 : (o === "right" || u === "right") && (c += n.width / 2);
  let f = n.top + n.height / 2;
  o === "top" || u === "top" ? f -= n.height / 2 : (o === "bottom" || u === "bottom") && (f += n.height / 2);
  const v = n.width / a.width, h = n.height / a.height, y = Math.max(1, v, h), p = v / y || 0, k = h / y || 0, S = a.width * a.height / (window.innerWidth * window.innerHeight), w = S > 0.12 ? Math.min(1.5, (S - 0.12) * 10 + 1) : 1;
  return {
    x: c - (r + a.left),
    y: f - (i + a.top),
    sx: p,
    sy: k,
    speed: w
  };
}
lt("fab-transition", "center center", "out-in");
lt("dialog-bottom-transition");
lt("dialog-top-transition");
const l1 = lt("fade-transition");
lt("scale-transition");
lt("scroll-x-transition");
lt("scroll-x-reverse-transition");
lt("scroll-y-transition");
lt("scroll-y-reverse-transition");
lt("slide-x-transition");
lt("slide-x-reverse-transition");
const x5 = lt("slide-y-transition");
lt("slide-y-reverse-transition");
const S5 = p5("expand-transition", b5()), k5 = p5("expand-x-transition", b5("", !0)), b8 = ce({
  active: Boolean,
  disabled: Boolean,
  max: [Number, String],
  value: {
    type: [Number, String],
    default: 0
  },
  ...qe(),
  ...sa({
    transition: {
      component: x5
    }
  })
}, "VCounter"), w8 = Ae()({
  name: "VCounter",
  functional: !0,
  props: b8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = R(() => e.max ? `${e.value} / ${e.max}` : String(e.value));
    return Fe(() => g(Nt, {
      transition: e.transition
    }, {
      default: () => [g2(I("div", {
        class: ve(["v-counter", {
          "text-error": e.max && !e.disabled && parseFloat(e.value) > parseFloat(e.max)
        }, e.class]),
        style: Ee(e.style)
      }, [n.default ? n.default({
        counter: a.value,
        max: e.max,
        value: e.value
      }) : a.value]), [[dt, e.active]])]
    })), {};
  }
}), x8 = ce({
  text: String,
  onClick: T2(),
  ...qe(),
  ...y2()
}, "VLabel"), _5 = Ae()({
  name: "VLabel",
  props: x8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Fe(() => I("label", {
      class: ve(["v-label", {
        "v-label--clickable": !!e.onClick
      }, e.class]),
      style: Ee(e.style),
      onClick: e.onClick
    }, [e.text, n.default?.()])), {};
  }
}), S8 = ce({
  floating: Boolean,
  ...qe()
}, "VFieldLabel"), Ya = Ae()({
  name: "VFieldLabel",
  props: S8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Fe(() => g(_5, {
      class: ve(["v-field-label", {
        "v-field-label--floating": e.floating
      }, e.class]),
      style: Ee(e.style)
    }, n)), {};
  }
});
function P5(e) {
  const {
    t
  } = wt();
  function n(a) {
    let {
      name: r,
      color: i,
      ...o
    } = a;
    const u = {
      prepend: "prependAction",
      prependInner: "prependAction",
      append: "appendAction",
      appendInner: "appendAction",
      clear: "clear"
    }[r], c = e[`onClick:${r}`];
    function f(h) {
      h.key !== "Enter" && h.key !== " " || (h.preventDefault(), h.stopPropagation(), zl(c, new PointerEvent("click", h)));
    }
    const v = c && u ? t(`$vuetify.input.${u}`, e.label ?? "") : void 0;
    return g(ze, me({
      icon: e[`${r}Icon`],
      "aria-label": v,
      onClick: c,
      onKeydown: f,
      color: i
    }, o), null);
  }
  return {
    InputIcon: n
  };
}
const V5 = ce({
  focused: Boolean,
  "onUpdate:focused": T2()
}, "focus");
function I5(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : At();
  const n = r2(e, "focused"), a = R(() => ({
    [`${t}--focused`]: n.value
  }));
  function r() {
    n.value = !0;
  }
  function i() {
    n.value = !1;
  }
  return {
    focusClasses: a,
    isFocused: n,
    focus: r,
    blur: i
  };
}
const k8 = ["underlined", "outlined", "filled", "solo", "solo-inverted", "solo-filled", "plain"], E5 = ce({
  appendInnerIcon: Ke,
  bgColor: String,
  clearable: Boolean,
  clearIcon: {
    type: Ke,
    default: "$clear"
  },
  active: Boolean,
  centerAffix: {
    type: Boolean,
    default: void 0
  },
  color: String,
  baseColor: String,
  dirty: Boolean,
  disabled: {
    type: Boolean,
    default: null
  },
  glow: Boolean,
  error: Boolean,
  flat: Boolean,
  iconColor: [Boolean, String],
  label: String,
  persistentClear: Boolean,
  prependInnerIcon: Ke,
  reverse: Boolean,
  singleLine: Boolean,
  variant: {
    type: String,
    default: "filled",
    validator: (e) => k8.includes(e)
  },
  "onClick:clear": T2(),
  "onClick:appendInner": T2(),
  "onClick:prependInner": T2(),
  ...qe(),
  ...Ul(),
  ...it(),
  ...y2()
}, "VField"), o1 = Ae()({
  name: "VField",
  inheritAttrs: !1,
  props: {
    id: String,
    details: Boolean,
    ...V5(),
    ...E5()
  },
  emits: {
    "update:focused": (e) => !0,
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      emit: a,
      slots: r
    } = t;
    const {
      themeClasses: i
    } = V2(e), {
      loaderClasses: o
    } = Gl(e), {
      focusClasses: u,
      isFocused: c,
      focus: f,
      blur: v
    } = I5(e), {
      InputIcon: h
    } = P5(e), {
      roundedClasses: y
    } = ft(e), {
      rtlClasses: p
    } = xt(), k = R(() => e.dirty || e.active), S = R(() => !!(e.label || r.label)), w = R(() => !e.singleLine && S.value), _ = Y2(), V = E(() => e.id || `input-${_}`), A = R(() => e.details ? `${V.value}-messages` : void 0), T = se(), O = se(), Y = se(), F = E(() => ["plain", "underlined"].includes(e.variant)), x = E(() => e.error || e.disabled ? void 0 : k.value && c.value ? e.color : e.baseColor), G = E(() => {
      if (!(!e.iconColor || e.glow && !c.value))
        return e.iconColor === !0 ? x.value : e.iconColor;
    }), {
      backgroundColorClasses: U,
      backgroundColorStyles: ee
    } = at(() => e.bgColor), {
      textColorClasses: J,
      textColorStyles: ae
    } = ht(x);
    be(k, (L) => {
      if (w.value && !$0()) {
        const X = T.value.$el, re = O.value.$el;
        requestAnimationFrame(() => {
          const we = Kl(X), le = re.getBoundingClientRect(), ke = le.x - we.x, fe = le.y - we.y - (we.height / 2 - le.height / 2), ne = le.width / 0.75, Pe = Math.abs(ne - we.width) > 1 ? {
            maxWidth: Oe(ne)
          } : void 0, Re = getComputedStyle(X), De = getComputedStyle(re), de = parseFloat(Re.transitionDuration) * 1e3 || 150, Be = parseFloat(De.getPropertyValue("--v-field-label-scale")), ye = De.getPropertyValue("color");
          X.style.visibility = "visible", re.style.visibility = "hidden", Mt(X, {
            transform: `translate(${ke}px, ${fe}px) scale(${Be})`,
            color: ye,
            ...Pe
          }, {
            duration: de,
            easing: Hn,
            direction: L ? "normal" : "reverse"
          }).finished.then(() => {
            X.style.removeProperty("visibility"), re.style.removeProperty("visibility");
          });
        });
      }
    }, {
      flush: "post"
    });
    const oe = E(() => ({
      isActive: k,
      isFocused: c,
      controlRef: Y,
      blur: v,
      focus: f
    }));
    function te(L) {
      L.target !== document.activeElement && L.preventDefault();
    }
    return Fe(() => {
      const L = e.variant === "outlined", X = !!(r["prepend-inner"] || e.prependInnerIcon), re = !!(e.clearable || r.clear) && !e.disabled, we = !!(r["append-inner"] || e.appendInnerIcon || re), le = () => r.label ? r.label({
        ...oe.value,
        label: e.label,
        props: {
          for: V.value
        }
      }) : e.label;
      return I("div", me({
        class: ["v-field", {
          "v-field--active": k.value,
          "v-field--appended": we,
          "v-field--center-affix": e.centerAffix ?? !F.value,
          "v-field--disabled": e.disabled,
          "v-field--dirty": e.dirty,
          "v-field--error": e.error,
          "v-field--glow": e.glow,
          "v-field--flat": e.flat,
          "v-field--has-background": !!e.bgColor,
          "v-field--persistent-clear": e.persistentClear,
          "v-field--prepended": X,
          "v-field--reverse": e.reverse,
          "v-field--single-line": e.singleLine,
          "v-field--no-label": !le(),
          [`v-field--variant-${e.variant}`]: !0
        }, i.value, U.value, u.value, o.value, y.value, p.value, e.class],
        style: [ee.value, e.style],
        onClick: te
      }, n), [I("div", {
        class: "v-field__overlay"
      }, null), g(e5, {
        name: "v-field",
        active: !!e.loading,
        color: e.error ? "error" : typeof e.loading == "string" ? e.loading : e.color
      }, {
        default: r.loader
      }), X && I("div", {
        key: "prepend",
        class: "v-field__prepend-inner"
      }, [e.prependInnerIcon && g(h, {
        key: "prepend-icon",
        name: "prependInner",
        color: G.value
      }, null), r["prepend-inner"]?.(oe.value)]), I("div", {
        class: "v-field__field",
        "data-no-activator": ""
      }, [["filled", "solo", "solo-inverted", "solo-filled"].includes(e.variant) && w.value && g(Ya, {
        key: "floating-label",
        ref: O,
        class: ve([J.value]),
        floating: !0,
        for: V.value,
        "aria-hidden": !k.value,
        style: Ee(ae.value)
      }, {
        default: () => [le()]
      }), S.value && g(Ya, {
        key: "label",
        ref: T,
        for: V.value
      }, {
        default: () => [le()]
      }), r.default?.({
        ...oe.value,
        props: {
          id: V.value,
          class: "v-field__input",
          "aria-describedby": A.value
        },
        focus: f,
        blur: v
      }) ?? I("div", {
        id: V.value,
        class: "v-field__input",
        "aria-describedby": A.value
      }, null)]), re && g(k5, {
        key: "clear"
      }, {
        default: () => [g2(I("div", {
          class: "v-field__clearable",
          onMousedown: (ke) => {
            ke.preventDefault(), ke.stopPropagation();
          }
        }, [g(k2, {
          defaults: {
            VIcon: {
              icon: e.clearIcon
            }
          }
        }, {
          default: () => [r.clear ? r.clear({
            ...oe.value,
            props: {
              onFocus: f,
              onBlur: v,
              onClick: e["onClick:clear"],
              tabindex: -1
            }
          }) : g(h, {
            name: "clear",
            onFocus: f,
            onBlur: v,
            tabindex: -1
          }, null)]
        })]), [[dt, e.dirty]])]
      }), we && I("div", {
        key: "append",
        class: "v-field__append-inner"
      }, [r["append-inner"]?.(oe.value), e.appendInnerIcon && g(h, {
        key: "append-icon",
        name: "appendInner",
        color: G.value
      }, null)]), I("div", {
        class: ve(["v-field__outline", J.value]),
        style: Ee(ae.value)
      }, [L && I(je, null, [I("div", {
        class: "v-field__outline__start"
      }, null), w.value && I("div", {
        class: "v-field__outline__notch"
      }, [g(Ya, {
        ref: O,
        floating: !0,
        for: V.value,
        "aria-hidden": !k.value
      }, {
        default: () => [le()]
      })]), I("div", {
        class: "v-field__outline__end"
      }, null)]), F.value && w.value && g(Ya, {
        ref: O,
        floating: !0,
        for: V.value,
        "aria-hidden": !k.value
      }, {
        default: () => [le()]
      })])]);
    }), {
      controlRef: Y,
      fieldIconColor: G
    };
  }
}), _8 = ce({
  active: Boolean,
  color: String,
  messages: {
    type: [Array, String],
    default: () => []
  },
  ...qe(),
  ...sa({
    transition: {
      component: x5,
      leaveAbsolute: !0,
      group: !0
    }
  })
}, "VMessages"), P8 = Ae()({
  name: "VMessages",
  props: _8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = E(() => $2(e.messages)), {
      textColorClasses: r,
      textColorStyles: i
    } = ht(() => e.color);
    return Fe(() => g(Nt, {
      transition: e.transition,
      tag: "div",
      class: ve(["v-messages", r.value, e.class]),
      style: Ee([i.value, e.style])
    }, {
      default: () => [e.active && a.value.map((o, u) => I("div", {
        class: "v-messages__message",
        key: `${u}-${a.value}`
      }, [n.message ? n.message({
        message: o
      }) : o]))]
    })), {};
  }
}), A5 = /* @__PURE__ */ Symbol.for("vuetify:form"), V8 = ce({
  disabled: Boolean,
  fastFail: Boolean,
  readonly: Boolean,
  modelValue: {
    type: Boolean,
    default: null
  },
  validateOn: {
    type: String,
    default: "input"
  }
}, "form");
function I8(e) {
  const t = r2(e, "modelValue"), n = R(() => e.disabled), a = R(() => e.readonly), r = Ve(!1), i = se([]), o = se([]);
  async function u() {
    const v = [];
    let h = !0;
    o.value = [], r.value = !0;
    for (const y of i.value) {
      const p = await y.validate();
      if (p.length > 0 && (h = !1, v.push({
        id: y.id,
        errorMessages: p
      })), !h && e.fastFail) break;
    }
    return o.value = v, r.value = !1, {
      valid: h,
      errors: o.value
    };
  }
  function c() {
    i.value.forEach((v) => v.reset());
  }
  function f() {
    i.value.forEach((v) => v.resetValidation());
  }
  return be(i, () => {
    let v = 0, h = 0;
    const y = [];
    for (const p of i.value)
      p.isValid === !1 ? (h++, y.push({
        id: p.id,
        errorMessages: p.errorMessages
      })) : p.isValid === !0 && v++;
    o.value = y, t.value = h > 0 ? !1 : v === i.value.length ? !0 : null;
  }, {
    deep: !0,
    flush: "post"
  }), c2(A5, {
    register: (v) => {
      let {
        id: h,
        vm: y,
        validate: p,
        reset: k,
        resetValidation: S
      } = v;
      i.value.some((w) => w.id === h) && i0(`Duplicate input name "${h}"`), i.value.push({
        id: h,
        validate: p,
        reset: k,
        resetValidation: S,
        vm: J0(y),
        isValid: null,
        errorMessages: []
      });
    },
    unregister: (v) => {
      i.value = i.value.filter((h) => h.id !== v);
    },
    update: (v, h, y) => {
      const p = i.value.find((k) => k.id === v);
      p && (p.isValid = h, p.errorMessages = y);
    },
    isDisabled: n,
    isReadonly: a,
    isValidating: r,
    isValid: t,
    items: i,
    validateOn: R(() => e.validateOn)
  }), {
    errors: o,
    isDisabled: n,
    isReadonly: a,
    isValidating: r,
    isValid: t,
    items: i,
    validate: u,
    reset: c,
    resetValidation: f
  };
}
function $5(e) {
  const t = We(A5, null);
  return {
    ...t,
    isReadonly: E(() => !!(e?.readonly ?? t?.isReadonly.value)),
    isDisabled: E(() => !!(e?.disabled ?? t?.isDisabled.value))
  };
}
const E8 = /* @__PURE__ */ Symbol.for("vuetify:rules");
function A8(e) {
  const t = We(E8, null);
  if (!e) {
    if (!t)
      throw new Error("Could not find Vuetify rules injection");
    return t.aliases;
  }
  return t?.resolve(e) ?? R(e);
}
const $8 = ce({
  disabled: {
    type: Boolean,
    default: null
  },
  error: Boolean,
  errorMessages: {
    type: [Array, String],
    default: () => []
  },
  maxErrors: {
    type: [Number, String],
    default: 1
  },
  name: String,
  label: String,
  readonly: {
    type: Boolean,
    default: null
  },
  rules: {
    type: Array,
    default: () => []
  },
  modelValue: null,
  validateOn: String,
  validationValue: null,
  ...V5()
}, "validation");
function T8(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : At(), n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Y2();
  const a = r2(e, "modelValue"), r = E(() => e.validationValue === void 0 ? a.value : e.validationValue), i = $5(e), o = A8(() => e.rules), u = se([]), c = Ve(!0), f = E(() => !!($2(a.value === "" ? null : a.value).length || $2(r.value === "" ? null : r.value).length)), v = E(() => e.errorMessages?.length ? $2(e.errorMessages).concat(u.value).slice(0, Math.max(0, Number(e.maxErrors))) : u.value), h = E(() => {
    let T = (e.validateOn ?? i.validateOn?.value) || "input";
    T === "lazy" && (T = "input lazy"), T === "eager" && (T = "input eager");
    const O = new Set(T?.split(" ") ?? []);
    return {
      input: O.has("input"),
      blur: O.has("blur") || O.has("input") || O.has("invalid-input"),
      invalidInput: O.has("invalid-input"),
      lazy: O.has("lazy"),
      eager: O.has("eager")
    };
  }), y = E(() => e.error || e.errorMessages?.length ? !1 : e.rules.length ? c.value ? u.value.length || h.value.lazy ? null : !0 : !u.value.length : !0), p = Ve(!1), k = E(() => ({
    [`${t}--error`]: y.value === !1,
    [`${t}--dirty`]: f.value,
    [`${t}--disabled`]: i.isDisabled.value,
    [`${t}--readonly`]: i.isReadonly.value
  })), S = x2("validation"), w = E(() => e.name ?? s2(n));
  dn(() => {
    i.register?.({
      id: w.value,
      vm: S,
      validate: A,
      reset: _,
      resetValidation: V
    });
  }), W2(() => {
    i.unregister?.(w.value);
  }), yt(async () => {
    h.value.lazy || await A(!h.value.eager), i.update?.(w.value, y.value, v.value);
  }), o0(() => h.value.input || h.value.invalidInput && y.value === !1, () => {
    be(r, () => {
      if (r.value != null)
        A();
      else if (e.focused) {
        const T = be(() => e.focused, (O) => {
          O || A(), T();
        });
      }
    });
  }), o0(() => h.value.blur, () => {
    be(() => e.focused, (T) => {
      T || A();
    });
  }), be([y, v], () => {
    i.update?.(w.value, y.value, v.value);
  });
  async function _() {
    a.value = null, await e2(), await V();
  }
  async function V() {
    c.value = !0, h.value.lazy ? u.value = [] : await A(!h.value.eager);
  }
  async function A() {
    let T = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1;
    const O = [];
    p.value = !0;
    for (const Y of o.value) {
      if (O.length >= Number(e.maxErrors ?? 1))
        break;
      const x = await (typeof Y == "function" ? Y : () => Y)(r.value);
      if (x !== !0) {
        if (x !== !1 && typeof x != "string") {
          console.warn(`${x} is not a valid value. Rule functions must return boolean true or a string.`);
          continue;
        }
        O.push(x || "");
      }
    }
    return u.value = O, p.value = !1, c.value = T, u.value;
  }
  return {
    errorMessages: v,
    isDirty: f,
    isDisabled: i.isDisabled,
    isReadonly: i.isReadonly,
    isPristine: c,
    isValid: y,
    isValidating: p,
    reset: _,
    resetValidation: V,
    validate: A,
    validationClasses: k
  };
}
const T5 = ce({
  id: String,
  appendIcon: Ke,
  baseColor: String,
  centerAffix: {
    type: Boolean,
    default: !0
  },
  color: String,
  glow: Boolean,
  iconColor: [Boolean, String],
  prependIcon: Ke,
  hideDetails: [Boolean, String],
  hideSpinButtons: Boolean,
  hint: String,
  persistentHint: Boolean,
  messages: {
    type: [Array, String],
    default: () => []
  },
  direction: {
    type: String,
    default: "horizontal",
    validator: (e) => ["horizontal", "vertical"].includes(e)
  },
  "onClick:prepend": T2(),
  "onClick:append": T2(),
  ...qe(),
  ...z2(),
  ...jt(Ct(), ["maxWidth", "minWidth", "width"]),
  ...y2(),
  ...$8()
}, "VInput"), s1 = Ae()({
  name: "VInput",
  props: {
    ...T5()
  },
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      slots: a,
      emit: r
    } = t;
    const {
      densityClasses: i
    } = bt(e), {
      dimensionStyles: o
    } = pt(e), {
      themeClasses: u
    } = V2(e), {
      rtlClasses: c
    } = xt(), {
      InputIcon: f
    } = P5(e), v = Y2(), h = E(() => e.id || `input-${v}`), {
      errorMessages: y,
      isDirty: p,
      isDisabled: k,
      isReadonly: S,
      isPristine: w,
      isValid: _,
      isValidating: V,
      reset: A,
      resetValidation: T,
      validate: O,
      validationClasses: Y
    } = T8(e, "v-input", h), F = E(() => e.errorMessages?.length || !w.value && y.value.length ? y.value : e.hint && (e.persistentHint || e.focused) ? e.hint : e.messages), x = R(() => F.value.length > 0), G = R(() => !e.hideDetails || e.hideDetails === "auto" && (x.value || !!a.details)), U = E(() => G.value ? `${h.value}-messages` : void 0), ee = E(() => ({
      id: h,
      messagesId: U,
      isDirty: p,
      isDisabled: k,
      isReadonly: S,
      isPristine: w,
      isValid: _,
      isValidating: V,
      hasDetails: G,
      reset: A,
      resetValidation: T,
      validate: O
    })), J = R(() => e.error || e.disabled ? void 0 : e.focused ? e.color : e.baseColor), ae = R(() => {
      if (e.iconColor)
        return e.iconColor === !0 ? J.value : e.iconColor;
    });
    return Fe(() => {
      const oe = !!(a.prepend || e.prependIcon), te = !!(a.append || e.appendIcon);
      return I("div", {
        class: ve(["v-input", `v-input--${e.direction}`, {
          "v-input--center-affix": e.centerAffix,
          "v-input--focused": e.focused,
          "v-input--glow": e.glow,
          "v-input--hide-spin-buttons": e.hideSpinButtons
        }, i.value, u.value, c.value, Y.value, e.class]),
        style: Ee([o.value, e.style])
      }, [oe && I("div", {
        key: "prepend",
        class: "v-input__prepend"
      }, [a.prepend?.(ee.value), e.prependIcon && g(f, {
        key: "prepend-icon",
        name: "prepend",
        color: ae.value
      }, null)]), a.default && I("div", {
        class: "v-input__control"
      }, [a.default?.(ee.value)]), te && I("div", {
        key: "append",
        class: "v-input__append"
      }, [e.appendIcon && g(f, {
        key: "append-icon",
        name: "append",
        color: ae.value
      }, null), a.append?.(ee.value)]), G.value && I("div", {
        id: U.value,
        class: "v-input__details",
        role: "alert",
        "aria-live": "polite"
      }, [g(P8, {
        active: x.value,
        messages: F.value
      }, {
        message: a.message
      }), a.details?.(ee.value)])]);
    }), {
      reset: A,
      resetValidation: T,
      validate: O,
      isValid: _,
      errorMessages: y
    };
  }
}), O8 = ce({
  autocomplete: String
}, "autocomplete");
function F8(e) {
  const t = Y2(), n = Ve(0), a = R(() => e.autocomplete === "suppress"), r = R(() => a.value ? `${e.name}-${t}-${n.value}` : e.name), i = R(() => a.value ? "off" : e.autocomplete);
  return {
    isSuppressing: a,
    fieldAutocomplete: i,
    fieldName: r,
    update: () => n.value = (/* @__PURE__ */ new Date()).getTime()
  };
}
function L8(e) {
  function t(n, a) {
    !e.autofocus || !n || a[0].target?.focus?.();
  }
  return {
    onIntersect: t
  };
}
const ji = /* @__PURE__ */ Symbol("Forwarded refs");
function Ki(e, t) {
  let n = e;
  for (; n; ) {
    const a = Reflect.getOwnPropertyDescriptor(n, t);
    if (a) return a;
    n = Object.getPrototypeOf(n);
  }
}
function va(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++)
    n[a - 1] = arguments[a];
  return e[ji] = n, new Proxy(e, {
    get(r, i) {
      if (Reflect.has(r, i))
        return Reflect.get(r, i);
      if (!(typeof i == "symbol" || i.startsWith("$") || i.startsWith("__"))) {
        for (const o of n)
          if (o.value && Reflect.has(o.value, i)) {
            const u = Reflect.get(o.value, i);
            return typeof u == "function" ? u.bind(o.value) : u;
          }
      }
    },
    has(r, i) {
      if (Reflect.has(r, i))
        return !0;
      if (typeof i == "symbol" || i.startsWith("$") || i.startsWith("__")) return !1;
      for (const o of n)
        if (o.value && Reflect.has(o.value, i))
          return !0;
      return !1;
    },
    set(r, i, o) {
      if (Reflect.has(r, i))
        return Reflect.set(r, i, o);
      if (typeof i == "symbol" || i.startsWith("$") || i.startsWith("__")) return !1;
      for (const u of n)
        if (u.value && Reflect.has(u.value, i))
          return Reflect.set(u.value, i, o);
      return !1;
    },
    getOwnPropertyDescriptor(r, i) {
      const o = Reflect.getOwnPropertyDescriptor(r, i);
      if (o) return o;
      if (!(typeof i == "symbol" || i.startsWith("$") || i.startsWith("__"))) {
        for (const u of n) {
          if (!u.value) continue;
          const c = Ki(u.value, i) ?? ("_" in u.value ? Ki(u.value._?.setupState, i) : void 0);
          if (c) return c;
        }
        for (const u of n) {
          const c = u.value && u.value[ji];
          if (!c) continue;
          const f = c.slice();
          for (; f.length; ) {
            const v = f.shift(), h = Ki(v.value, i);
            if (h) return h;
            const y = v.value && v.value[ji];
            y && f.push(...y);
          }
        }
      }
    }
  });
}
const B8 = ["color", "file", "time", "date", "datetime-local", "week", "month"], O5 = ce({
  autofocus: Boolean,
  counter: [Boolean, Number, String],
  counterValue: [Number, Function],
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  suffix: String,
  role: String,
  type: {
    type: String,
    default: "text"
  },
  modelModifiers: Object,
  ...O8(),
  ...T5(),
  ...E5()
}, "VTextField"), P2 = Ae()({
  name: "VTextField",
  directives: {
    vIntersect: vr
  },
  inheritAttrs: !1,
  props: O5(),
  emits: {
    "click:control": (e) => !0,
    "mousedown:control": (e) => !0,
    "update:focused": (e) => !0,
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      emit: a,
      slots: r
    } = t;
    const i = r2(e, "modelValue"), {
      isFocused: o,
      focus: u,
      blur: c
    } = I5(e), {
      onIntersect: f
    } = L8(e), v = E(() => typeof e.counterValue == "function" ? e.counterValue(i.value) : typeof e.counterValue == "number" ? e.counterValue : (i.value ?? "").toString().length), h = E(() => {
      if (n.maxlength) return n.maxlength;
      if (!(!e.counter || typeof e.counter != "number" && typeof e.counter != "string"))
        return e.counter;
    }), y = E(() => ["plain", "underlined"].includes(e.variant)), p = se(), k = se(), S = se(), w = F8(e), _ = E(() => B8.includes(e.type) || e.persistentPlaceholder || o.value || e.active);
    function V() {
      w.isSuppressing.value && w.update(), o.value || u(), e2(() => {
        S.value !== document.activeElement && S.value?.focus();
      });
    }
    function A(F) {
      a("mousedown:control", F), F.target !== S.value && (V(), F.preventDefault());
    }
    function T(F) {
      a("click:control", F);
    }
    function O(F, x) {
      F.stopPropagation(), V(), e2(() => {
        x(), zl(e["onClick:clear"], F);
      });
    }
    function Y(F) {
      const x = F.target;
      if (!(e.modelModifiers?.trim && ["text", "search", "password", "tel", "url"].includes(e.type))) {
        i.value = x.value;
        return;
      }
      const G = x.value, U = x.selectionStart, ee = x.selectionEnd;
      i.value = G, e2(() => {
        let J = 0;
        G.trimStart().length === x.value.length && (J = G.length - x.value.length), U != null && (x.selectionStart = U - J), ee != null && (x.selectionEnd = ee - J);
      });
    }
    return Fe(() => {
      const F = !!(r.counter || e.counter !== !1 && e.counter != null), x = !!(F || r.details), [G, U] = M6(n), {
        modelValue: ee,
        ...J
      } = s1.filterProps(e), ae = o1.filterProps(e);
      return g(s1, me({
        ref: p,
        modelValue: i.value,
        "onUpdate:modelValue": (oe) => i.value = oe,
        class: ["v-text-field", {
          "v-text-field--prefixed": e.prefix,
          "v-text-field--suffixed": e.suffix,
          "v-input--plain-underlined": y.value
        }, e.class],
        style: e.style
      }, G, J, {
        centerAffix: !y.value,
        focused: o.value
      }), {
        ...r,
        default: (oe) => {
          let {
            id: te,
            isDisabled: L,
            isDirty: X,
            isReadonly: re,
            isValid: we,
            hasDetails: le,
            reset: ke
          } = oe;
          return g(o1, me({
            ref: k,
            onMousedown: A,
            onClick: T,
            "onClick:clear": (fe) => O(fe, ke),
            role: e.role
          }, qt(ae, ["onClick:clear"]), {
            id: te.value,
            active: _.value || X.value,
            dirty: X.value || e.dirty,
            disabled: L.value,
            focused: o.value,
            details: le.value,
            error: we.value === !1
          }), {
            ...r,
            default: (fe) => {
              let {
                props: {
                  class: ne,
                  ...Pe
                },
                controlRef: Re
              } = fe;
              const De = g2(I("input", me({
                ref: (de) => S.value = Re.value = de,
                value: i.value,
                onInput: Y,
                autofocus: e.autofocus,
                readonly: re.value,
                disabled: L.value,
                name: w.fieldName.value,
                autocomplete: w.fieldAutocomplete.value,
                placeholder: e.placeholder,
                size: 1,
                role: e.role,
                type: e.type,
                onFocus: u,
                onBlur: c
              }, Pe, U), null), [[vr, {
                handler: f
              }, null, {
                once: !0
              }]]);
              return I(je, null, [e.prefix && I("span", {
                class: "v-text-field__prefix"
              }, [I("span", {
                class: "v-text-field__prefix__text"
              }, [e.prefix])]), r.default ? I("div", {
                class: ve(ne),
                "data-no-activator": ""
              }, [r.default(), De]) : k6(De, {
                class: ne
              }), e.suffix && I("span", {
                class: "v-text-field__suffix"
              }, [I("span", {
                class: "v-text-field__suffix__text"
              }, [e.suffix])])]);
            }
          });
        },
        details: x ? (oe) => I(je, null, [r.details?.(oe), F && I(je, null, [I("span", null, null), g(w8, {
          active: e.persistentCounter || o.value,
          value: v.value,
          max: h.value,
          disabled: e.disabled
        }, r.counter)])]) : void 0
      });
    }), va({}, p, k, S);
  }
}), M8 = 30, u1 = 200, R8 = {
  __name: "CreateAoi",
  setup(e) {
    const t = se("+"), n = se(M8), a = We("extensionAPI"), { UIStore: r, DataBaseStore: i, HybridViewerStore: o, importItem: u } = a, c = vn(), f = A0(), v = se(""), h = se(""), y = se(""), p = se(""), k = se(""), S = se(0), w = se(!1), _ = E(
      () => v.value.trim() !== "" && h.value !== "" && y.value !== "" && p.value !== "" && k.value !== ""
    );
    function V() {
      r.setShowCreateTools(!0);
    }
    function A(Y) {
      let F = -1 / 0, x = -1 / 0, G = -1 / 0, U = 1 / 0, ee = 1 / 0, J = 1 / 0, ae = !1;
      const oe = 1e9;
      for (const { actor: te } of Object.values(Y)) {
        if (!te || !te.getVisibility())
          continue;
        const L = te.getBounds();
        L && L.every((X) => Math.abs(X) < oe) && (U = Math.min(U, L[0]), F = Math.max(F, L[1]), ee = Math.min(ee, L[2]), x = Math.max(x, L[3]), J = Math.min(J, L[4]), G = Math.max(G, L[5]), ae = !0);
      }
      return { hasObject: ae, minX: U, maxX: F, minY: ee, maxY: x, minZ: J, maxZ: G };
    }
    function T() {
      const { hybridDb: Y } = o;
      if (!Y)
        return;
      const { hasObject: F, minX: x, maxX: G, minY: U, maxY: ee, minZ: J, maxZ: ae } = A(Y);
      if (F) {
        const oe = G - x, te = ee - U;
        let L = 0;
        t.value === "+" ? L = n.value / u1 : t.value === "-" && (L = -n.value / u1), h.value = (x - oe * L).toFixed(2), p.value = (G + oe * L).toFixed(2), y.value = (U - te * L).toFixed(2), k.value = (ee + te * L).toFixed(2), S.value = (J + ae) / 2;
      }
    }
    be([t, n], T), be(
      () => r.showCreateAOI,
      (Y) => {
        Y && (v.value = "", T());
      }
    ), yt(T);
    async function O() {
      if (!_.value)
        return;
      w.value = !0;
      const Y = {
        name: v.value,
        z: S.value,
        points: [
          { x: Number.parseFloat(h.value), y: Number.parseFloat(y.value) },
          { x: Number.parseFloat(p.value), y: Number.parseFloat(y.value) },
          { x: Number.parseFloat(p.value), y: Number.parseFloat(k.value) },
          { x: Number.parseFloat(h.value), y: Number.parseFloat(k.value) }
        ]
      };
      try {
        const F = It.vease_modeling_back.aoi;
        await f.request(
          { schema: F, params: Y },
          {
            response_function: async (x) => {
              const G = { ...x, is_aoi: !0, name: v.value };
              await u(G), await i.updateItem(x.id, G);
              let U = c.classifications.find(
                (ee) => ee.type === "AOI"
              );
              U || (U = await c.createEntity({
                type: "AOI",
                name: "Area of Interest"
              })), U?.id && await c.setRelation(x.id, U.id), r.setShowCreateTools(!1);
            }
          }
        );
      } finally {
        w.value = !1;
      }
    }
    return (Y, F) => (Ne(), n2(A2, {
      "no-gutters": "",
      class: "fill-height flex-column overflow-hidden"
    }, {
      default: M(() => [
        g(Ye, {
          cols: "auto",
          class: "flex-shrink-0"
        }, {
          default: M(() => [
            g(Rr, { class: "pb-1 pt-3 align-center" }, {
              prepend: M(() => [
                g(rt, {
                  size: "32",
                  rounded: "0",
                  class: "me-2",
                  color: "transparent"
                }, {
                  default: M(() => [
                    g(gn, {
                      src: s2(Ml),
                      cover: ""
                    }, null, 8, ["src"])
                  ]),
                  _: 1
                })
              ]),
              default: M(() => [
                g(d0, {
                  class: "text-subtitle-1 text-primary font-weight-bold",
                  style: { "line-height": "1.2" }
                }, {
                  default: M(() => [...F[7] || (F[7] = [
                    pe(" Create Area of Interest ", -1)
                  ])]),
                  _: 1
                }),
                g(fa, {
                  class: "ma-0 mt-0.5 opacity-70 flex-shrink-0 text-caption text-wrap",
                  style: { "font-size": "0.72rem !important", "line-height": "1.2" }
                }, {
                  default: M(() => [...F[8] || (F[8] = [
                    pe(" Define a 2D bounding area with customizable padding. ", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        g(Ye, { class: "overflow-y-auto pt-3" }, {
          default: M(() => [
            g(Dr, { class: "pa-0 px-4" }, {
              default: M(() => [
                g(P2, {
                  modelValue: v.value,
                  "onUpdate:modelValue": F[0] || (F[0] = (x) => v.value = x),
                  label: "AOI Name",
                  variant: "outlined",
                  density: "compact",
                  class: "mb-4 text-caption",
                  "hide-details": "auto"
                }, null, 8, ["modelValue"]),
                g(A2, { dense: "" }, {
                  default: M(() => [
                    g(Ye, {
                      cols: "12",
                      class: "pb-0"
                    }, {
                      default: M(() => [...F[9] || (F[9] = [
                        I("div", { class: "text-caption font-weight-semibold text-grey" }, "Padding Settings", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                g(A2, {
                  dense: "",
                  align: "center",
                  class: "mb-3"
                }, {
                  default: M(() => [
                    g(Ye, { cols: "7" }, {
                      default: M(() => [
                        g(X6, {
                          modelValue: t.value,
                          "onUpdate:modelValue": F[1] || (F[1] = (x) => t.value = x),
                          color: "primary",
                          variant: "outlined",
                          density: "compact",
                          mandatory: "",
                          divided: "",
                          style: { height: "32px" }
                        }, {
                          default: M(() => [
                            g(Je, {
                              value: "fit",
                              size: "small",
                              class: "px-2 text-caption"
                            }, {
                              default: M(() => [...F[10] || (F[10] = [
                                pe("Fit", -1)
                              ])]),
                              _: 1
                            }),
                            g(Je, {
                              value: "+",
                              size: "small",
                              class: "px-2 text-caption"
                            }, {
                              default: M(() => [...F[11] || (F[11] = [
                                pe("+", -1)
                              ])]),
                              _: 1
                            }),
                            g(Je, {
                              value: "-",
                              size: "small",
                              class: "px-2 text-caption"
                            }, {
                              default: M(() => [...F[12] || (F[12] = [
                                pe("-", -1)
                              ])]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    t.value !== "fit" ? (Ne(), n2(Ye, {
                      key: 0,
                      cols: "5"
                    }, {
                      default: M(() => [
                        g(P2, {
                          modelValue: n.value,
                          "onUpdate:modelValue": F[2] || (F[2] = (x) => n.value = x),
                          modelModifiers: { number: !0 },
                          label: "Padding",
                          type: "number",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": "auto",
                          suffix: "%",
                          class: "text-caption"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })) : D2("", !0)
                  ]),
                  _: 1
                }),
                g(A2, { dense: "" }, {
                  default: M(() => [
                    g(Ye, {
                      cols: "12",
                      class: "pb-0"
                    }, {
                      default: M(() => [...F[13] || (F[13] = [
                        I("div", { class: "text-caption font-weight-semibold text-grey" }, "Calculated Coordinates", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                g(A2, { dense: "" }, {
                  default: M(() => [
                    g(Ye, { cols: "6" }, {
                      default: M(() => [
                        g(P2, {
                          modelValue: h.value,
                          "onUpdate:modelValue": F[3] || (F[3] = (x) => h.value = x),
                          label: "Min X",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": "auto",
                          class: "text-caption"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    g(Ye, { cols: "6" }, {
                      default: M(() => [
                        g(P2, {
                          modelValue: y.value,
                          "onUpdate:modelValue": F[4] || (F[4] = (x) => y.value = x),
                          label: "Min Y",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": "auto",
                          class: "text-caption"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    g(Ye, { cols: "6" }, {
                      default: M(() => [
                        g(P2, {
                          modelValue: p.value,
                          "onUpdate:modelValue": F[5] || (F[5] = (x) => p.value = x),
                          label: "Max X",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": "auto",
                          class: "text-caption"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    g(Ye, { cols: "6" }, {
                      default: M(() => [
                        g(P2, {
                          modelValue: k.value,
                          "onUpdate:modelValue": F[6] || (F[6] = (x) => k.value = x),
                          label: "Max Y",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": "auto",
                          class: "text-caption"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        g(Ye, {
          cols: "auto",
          class: "flex-shrink-0"
        }, {
          default: M(() => [
            g(Wt, { class: "mx-4 mt-1" }),
            g(Mr, { class: "pa-3" }, {
              default: M(() => [
                g(Je, {
                  variant: "text",
                  size: "small",
                  color: "grey-darken-1",
                  onClick: V,
                  rounded: "lg",
                  class: "text-caption"
                }, {
                  default: M(() => [...F[14] || (F[14] = [
                    pe(" Cancel ", -1)
                  ])]),
                  _: 1
                }),
                g(jr),
                g(Je, {
                  color: "primary",
                  variant: "flat",
                  size: "small",
                  loading: w.value,
                  disabled: !_.value,
                  onClick: O,
                  rounded: "lg",
                  class: "px-4 text-caption font-weight-bold"
                }, {
                  default: M(() => [...F[15] || (F[15] = [
                    pe(" Create AOI ", -1)
                  ])]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }));
  }
}, D8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: R8
}, Symbol.toStringTag, { value: "Module" })), fl = /* @__PURE__ */ Symbol.for("vuetify:list");
function F5() {
  let {
    filterable: e
  } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
    filterable: !1
  };
  const t = We(fl, {
    filterable: !1,
    hasPrepend: Ve(!1),
    updateHasPrepend: () => null
  }), n = {
    filterable: t.filterable || e,
    hasPrepend: Ve(!1),
    updateHasPrepend: (a) => {
      a && (n.hasPrepend.value = a);
    }
  };
  return c2(fl, n), t;
}
function L5() {
  return We(fl, null);
}
const to = (e) => {
  const t = {
    activate: (n) => {
      let {
        id: a,
        value: r,
        activated: i
      } = n;
      return a = m2(a), e && !r && i.size === 1 && i.has(a) || (r ? i.add(a) : i.delete(a)), i;
    },
    in: (n, a, r) => {
      let i = /* @__PURE__ */ new Set();
      if (n != null)
        for (const o of $2(n))
          i = t.activate({
            id: o,
            value: !0,
            activated: new Set(i),
            children: a,
            parents: r
          });
      return i;
    },
    out: (n) => Array.from(n)
  };
  return t;
}, B5 = (e) => {
  const t = to(e);
  return {
    activate: (a) => {
      let {
        activated: r,
        id: i,
        ...o
      } = a;
      i = m2(i);
      const u = r.has(i) ? /* @__PURE__ */ new Set([i]) : /* @__PURE__ */ new Set();
      return t.activate({
        ...o,
        id: i,
        activated: u
      });
    },
    in: (a, r, i) => {
      let o = /* @__PURE__ */ new Set();
      if (a != null) {
        const u = $2(a);
        u.length && (o = t.in(u.slice(0, 1), r, i));
      }
      return o;
    },
    out: (a, r, i) => t.out(a, r, i)
  };
}, N8 = (e) => {
  const t = to(e);
  return {
    activate: (a) => {
      let {
        id: r,
        activated: i,
        children: o,
        ...u
      } = a;
      return r = m2(r), o.has(r) ? i : t.activate({
        id: r,
        activated: i,
        children: o,
        ...u
      });
    },
    in: t.in,
    out: t.out
  };
}, z8 = (e) => {
  const t = B5(e);
  return {
    activate: (a) => {
      let {
        id: r,
        activated: i,
        children: o,
        ...u
      } = a;
      return r = m2(r), o.has(r) ? i : t.activate({
        id: r,
        activated: i,
        children: o,
        ...u
      });
    },
    in: t.in,
    out: t.out
  };
}, j8 = {
  open: (e) => {
    let {
      id: t,
      value: n,
      opened: a,
      parents: r
    } = e;
    if (n) {
      const i = /* @__PURE__ */ new Set();
      i.add(t);
      let o = r.get(t);
      for (; o != null; )
        i.add(o), o = r.get(o);
      return i;
    } else
      return a.delete(t), a;
  },
  select: () => null
}, M5 = {
  open: (e) => {
    let {
      id: t,
      value: n,
      opened: a,
      parents: r
    } = e;
    if (n) {
      let i = r.get(t);
      for (a.add(t); i != null && i !== t; )
        a.add(i), i = r.get(i);
      return a;
    } else
      a.delete(t);
    return a;
  },
  select: () => null
}, K8 = {
  open: M5.open,
  select: (e) => {
    let {
      id: t,
      value: n,
      opened: a,
      parents: r
    } = e;
    if (!n) return a;
    const i = [];
    let o = r.get(t);
    for (; o != null; )
      i.push(o), o = r.get(o);
    return new Set(i);
  }
}, no = (e) => {
  const t = {
    select: (n) => {
      let {
        id: a,
        value: r,
        selected: i
      } = n;
      if (a = m2(a), e && !r) {
        const o = Array.from(i.entries()).reduce((u, c) => {
          let [f, v] = c;
          return v === "on" && u.push(f), u;
        }, []);
        if (o.length === 1 && o[0] === a) return i;
      }
      return i.set(a, r ? "on" : "off"), i;
    },
    in: (n, a, r, i) => {
      const o = /* @__PURE__ */ new Map();
      for (const u of n || [])
        t.select({
          id: u,
          value: !0,
          selected: o,
          children: a,
          parents: r,
          disabled: i
        });
      return o;
    },
    out: (n) => {
      const a = [];
      for (const [r, i] of n.entries())
        i === "on" && a.push(r);
      return a;
    }
  };
  return t;
}, R5 = (e) => {
  const t = no(e);
  return {
    select: (a) => {
      let {
        selected: r,
        id: i,
        ...o
      } = a;
      i = m2(i);
      const u = r.has(i) ? /* @__PURE__ */ new Map([[i, r.get(i)]]) : /* @__PURE__ */ new Map();
      return t.select({
        ...o,
        id: i,
        selected: u
      });
    },
    in: (a, r, i, o) => a?.length ? t.in(a.slice(0, 1), r, i, o) : /* @__PURE__ */ new Map(),
    out: (a, r, i) => t.out(a, r, i)
  };
}, W8 = (e) => {
  const t = no(e);
  return {
    select: (a) => {
      let {
        id: r,
        selected: i,
        children: o,
        ...u
      } = a;
      return r = m2(r), o.has(r) ? i : t.select({
        id: r,
        selected: i,
        children: o,
        ...u
      });
    },
    in: t.in,
    out: t.out
  };
}, q8 = (e) => {
  const t = R5(e);
  return {
    select: (a) => {
      let {
        id: r,
        selected: i,
        children: o,
        ...u
      } = a;
      return r = m2(r), o.has(r) ? i : t.select({
        id: r,
        selected: i,
        children: o,
        ...u
      });
    },
    in: t.in,
    out: t.out
  };
}, D5 = (e) => {
  const t = {
    select: (n) => {
      let {
        id: a,
        value: r,
        selected: i,
        children: o,
        parents: u,
        disabled: c
      } = n;
      a = m2(a);
      const f = new Map(i), v = [a];
      for (; v.length; ) {
        const y = v.shift();
        c.has(y) || i.set(m2(y), r ? "on" : "off"), o.has(y) && v.push(...o.get(y));
      }
      let h = m2(u.get(a));
      for (; h; ) {
        let y = !0, p = !0;
        for (const k of o.get(h)) {
          const S = m2(k);
          if (!c.has(S) && (i.get(S) !== "on" && (y = !1), i.has(S) && i.get(S) !== "off" && (p = !1), !y && !p))
            break;
        }
        i.set(h, y ? "on" : p ? "off" : "indeterminate"), h = m2(u.get(h));
      }
      return e && !r && Array.from(i.entries()).reduce((p, k) => {
        let [S, w] = k;
        return w === "on" && p.push(S), p;
      }, []).length === 0 ? f : i;
    },
    in: (n, a, r, i) => {
      let o = /* @__PURE__ */ new Map();
      for (const u of n || [])
        o = t.select({
          id: u,
          value: !0,
          selected: o,
          children: a,
          parents: r,
          disabled: i
        });
      return o;
    },
    out: (n, a) => {
      const r = [];
      for (const [i, o] of n.entries())
        o === "on" && !a.has(i) && r.push(i);
      return r;
    }
  };
  return t;
}, H8 = (e) => {
  const t = D5(e);
  return {
    select: t.select,
    in: t.in,
    out: (a, r, i) => {
      const o = [];
      for (const [u, c] of a.entries())
        if (c === "on") {
          if (i.has(u)) {
            const f = i.get(u);
            if (a.get(f) === "on") continue;
          }
          o.push(u);
        }
      return o;
    }
  };
}, Yn = /* @__PURE__ */ Symbol.for("vuetify:nested"), N5 = {
  id: Ve(),
  root: {
    register: () => null,
    unregister: () => null,
    children: se(/* @__PURE__ */ new Map()),
    parents: se(/* @__PURE__ */ new Map()),
    disabled: se(/* @__PURE__ */ new Set()),
    open: () => null,
    openOnSelect: () => null,
    activate: () => null,
    select: () => null,
    activatable: se(!1),
    selectable: se(!1),
    opened: se(/* @__PURE__ */ new Set()),
    activated: se(/* @__PURE__ */ new Set()),
    selected: se(/* @__PURE__ */ new Map()),
    selectedValues: se([]),
    getPath: () => []
  }
}, U8 = ce({
  activatable: Boolean,
  selectable: Boolean,
  activeStrategy: [String, Function, Object],
  selectStrategy: [String, Function, Object],
  openStrategy: [String, Object],
  opened: null,
  activated: null,
  selected: null,
  mandatory: Boolean
}, "nested"), G8 = (e) => {
  let t = !1;
  const n = Ve(/* @__PURE__ */ new Map()), a = Ve(/* @__PURE__ */ new Map()), r = Ve(/* @__PURE__ */ new Set()), i = r2(e, "opened", e.opened, (w) => new Set(Array.isArray(w) ? w.map((_) => m2(_)) : w), (w) => [...w.values()]), o = E(() => {
    if (typeof e.activeStrategy == "object") return e.activeStrategy;
    if (typeof e.activeStrategy == "function") return e.activeStrategy(e.mandatory);
    switch (e.activeStrategy) {
      case "leaf":
        return N8(e.mandatory);
      case "single-leaf":
        return z8(e.mandatory);
      case "independent":
        return to(e.mandatory);
      default:
        return B5(e.mandatory);
    }
  }), u = E(() => {
    if (typeof e.selectStrategy == "object") return e.selectStrategy;
    if (typeof e.selectStrategy == "function") return e.selectStrategy(e.mandatory);
    switch (e.selectStrategy) {
      case "single-leaf":
        return q8(e.mandatory);
      case "leaf":
        return W8(e.mandatory);
      case "independent":
        return no(e.mandatory);
      case "single-independent":
        return R5(e.mandatory);
      case "trunk":
        return H8(e.mandatory);
      default:
        return D5(e.mandatory);
    }
  }), c = E(() => {
    if (typeof e.openStrategy == "object") return e.openStrategy;
    switch (e.openStrategy) {
      case "list":
        return K8;
      case "single":
        return j8;
      default:
        return M5;
    }
  }), f = r2(e, "activated", e.activated, (w) => o.value.in(w, n.value, a.value), (w) => o.value.out(w, n.value, a.value)), v = r2(e, "selected", e.selected, (w) => u.value.in(w, n.value, a.value, r.value), (w) => u.value.out(w, n.value, a.value));
  W2(() => {
    t = !0;
  });
  function h(w) {
    const _ = [];
    let V = m2(w);
    for (; V !== void 0; )
      _.unshift(V), V = a.value.get(V);
    return _;
  }
  const y = x2("nested"), p = /* @__PURE__ */ new Set(), k = wc(() => {
    e2(() => {
      n.value = new Map(n.value), a.value = new Map(a.value);
    });
  }, 100), S = {
    id: Ve(),
    root: {
      opened: i,
      activatable: R(() => e.activatable),
      selectable: R(() => e.selectable),
      activated: f,
      selected: v,
      selectedValues: E(() => {
        const w = [];
        for (const [_, V] of v.value.entries())
          V === "on" && w.push(_);
        return w;
      }),
      register: (w, _, V, A) => {
        if (p.has(w)) {
          const T = h(w).map(String).join(" -> "), O = h(_).concat(w).map(String).join(" -> ");
          Ar(`Multiple nodes with the same ID
	${T}
	${O}`);
          return;
        } else
          p.add(w);
        _ && w !== _ && a.value.set(w, _), V && r.value.add(w), A && n.value.set(w, []), _ != null && n.value.set(_, [...n.value.get(_) || [], w]), k();
      },
      unregister: (w) => {
        if (t) return;
        p.delete(w), n.value.delete(w), r.value.delete(w);
        const _ = a.value.get(w);
        if (_) {
          const V = n.value.get(_) ?? [];
          n.value.set(_, V.filter((A) => A !== w));
        }
        a.value.delete(w), k();
      },
      open: (w, _, V) => {
        y.emit("click:open", {
          id: w,
          value: _,
          path: h(w),
          event: V
        });
        const A = c.value.open({
          id: w,
          value: _,
          opened: new Set(i.value),
          children: n.value,
          parents: a.value,
          event: V
        });
        A && (i.value = A);
      },
      openOnSelect: (w, _, V) => {
        const A = c.value.select({
          id: w,
          value: _,
          selected: new Map(v.value),
          opened: new Set(i.value),
          children: n.value,
          parents: a.value,
          event: V
        });
        A && (i.value = A);
      },
      select: (w, _, V) => {
        y.emit("click:select", {
          id: w,
          value: _,
          path: h(w),
          event: V
        });
        const A = u.value.select({
          id: w,
          value: _,
          selected: new Map(v.value),
          children: n.value,
          parents: a.value,
          disabled: r.value,
          event: V
        });
        A && (v.value = A), S.root.openOnSelect(w, _, V);
      },
      activate: (w, _, V) => {
        if (!e.activatable)
          return S.root.select(w, !0, V);
        y.emit("click:activate", {
          id: w,
          value: _,
          path: h(w),
          event: V
        });
        const A = o.value.activate({
          id: w,
          value: _,
          activated: new Set(f.value),
          children: n.value,
          parents: a.value,
          event: V
        });
        if (A.size !== f.value.size)
          f.value = A;
        else {
          for (const T of A)
            if (!f.value.has(T)) {
              f.value = A;
              return;
            }
          for (const T of f.value)
            if (!A.has(T)) {
              f.value = A;
              return;
            }
        }
      },
      children: n,
      parents: a,
      disabled: r,
      getPath: h
    }
  };
  return c2(Yn, S), S.root;
}, z5 = (e, t, n) => {
  const a = We(Yn, N5), r = /* @__PURE__ */ Symbol("nested item"), i = E(() => {
    const u = m2(u2(e));
    return u !== void 0 ? u : r;
  }), o = {
    ...a,
    id: i,
    open: (u, c) => a.root.open(i.value, u, c),
    openOnSelect: (u, c) => a.root.openOnSelect(i.value, u, c),
    isOpen: E(() => a.root.opened.value.has(i.value)),
    parent: E(() => a.root.parents.value.get(i.value)),
    activate: (u, c) => a.root.activate(i.value, u, c),
    isActivated: E(() => a.root.activated.value.has(i.value)),
    select: (u, c) => a.root.select(i.value, u, c),
    isSelected: E(() => a.root.selected.value.get(i.value) === "on"),
    isIndeterminate: E(() => a.root.selected.value.get(i.value) === "indeterminate"),
    isLeaf: E(() => !a.root.children.value.get(i.value)),
    isGroupActivator: a.isGroupActivator
  };
  return dn(() => {
    a.isGroupActivator || e2(() => {
      a.root.register(i.value, a.id.value, u2(t), n);
    });
  }), W2(() => {
    a.isGroupActivator || a.root.unregister(i.value);
  }), be(i, (u, c) => {
    a.isGroupActivator || (a.root.unregister(c), e2(() => {
      a.root.register(u, a.id.value, u2(t), n);
    }));
  }), n && c2(Yn, o), o;
}, Z8 = () => {
  const e = We(Yn, N5);
  c2(Yn, {
    ...e,
    isGroupActivator: !0
  });
};
function j5() {
  const e = Ve(!1);
  return yt(() => {
    window.requestAnimationFrame(() => {
      e.value = !0;
    });
  }), {
    ssrBootStyles: R(() => e.value ? void 0 : {
      transition: "none !important"
    }),
    isBooted: ia(e)
  };
}
const Y8 = la({
  name: "VListGroupActivator",
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Z8(), () => n.default?.();
  }
}), X8 = ce({
  /* @deprecated */
  activeColor: String,
  baseColor: String,
  color: String,
  collapseIcon: {
    type: Ke,
    default: "$collapse"
  },
  disabled: Boolean,
  expandIcon: {
    type: Ke,
    default: "$expand"
  },
  rawId: [String, Number],
  prependIcon: Ke,
  appendIcon: Ke,
  fluid: Boolean,
  subgroup: Boolean,
  title: String,
  value: null,
  ...qe(),
  ...l2()
}, "VListGroup"), c1 = Ae()({
  name: "VListGroup",
  props: X8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      isOpen: a,
      open: r,
      id: i
    } = z5(() => e.value, () => e.disabled, !0), o = E(() => `v-list-group--id-${String(e.rawId ?? i.value)}`), u = L5(), {
      isBooted: c
    } = j5();
    function f(p) {
      ["INPUT", "TEXTAREA"].includes(p.target?.tagName) || r(!a.value, p);
    }
    const v = E(() => ({
      onClick: f,
      class: "v-list-group__header",
      id: o.value
    })), h = E(() => a.value ? e.collapseIcon : e.expandIcon), y = E(() => ({
      VListItem: {
        activeColor: e.activeColor,
        baseColor: e.baseColor,
        color: e.color,
        prependIcon: e.prependIcon || e.subgroup && h.value,
        appendIcon: e.appendIcon || !e.subgroup && h.value,
        title: e.title,
        value: e.value
      }
    }));
    return Fe(() => g(e.tag, {
      class: ve(["v-list-group", {
        "v-list-group--prepend": u?.hasPrepend.value,
        "v-list-group--fluid": e.fluid,
        "v-list-group--subgroup": e.subgroup,
        "v-list-group--open": a.value
      }, e.class]),
      style: Ee(e.style)
    }, {
      default: () => [n.activator && g(k2, {
        defaults: y.value
      }, {
        default: () => [g(Y8, null, {
          default: () => [n.activator({
            props: v.value,
            isOpen: a.value
          })]
        })]
      }), g(Nt, {
        transition: {
          component: S5
        },
        disabled: !c.value
      }, {
        default: () => [g2(I("div", {
          class: "v-list-group__items",
          role: "group",
          "aria-labelledby": o.value
        }, [n.default?.()]), [[dt, a.value]])]
      })]
    })), {
      isOpen: a
    };
  }
}), Q8 = ce({
  opacity: [Number, String],
  ...qe(),
  ...l2()
}, "VListItemSubtitle"), Bn = Ae()({
  name: "VListItemSubtitle",
  props: Q8(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Fe(() => g(e.tag, {
      class: ve(["v-list-item-subtitle", e.class]),
      style: Ee([{
        "--v-list-item-subtitle-opacity": e.opacity
      }, e.style])
    }, n)), {};
  }
}), Mn = $r("v-list-item-title"), J8 = ce({
  active: {
    type: Boolean,
    default: void 0
  },
  activeClass: String,
  /* @deprecated */
  activeColor: String,
  appendAvatar: String,
  appendIcon: Ke,
  baseColor: String,
  disabled: Boolean,
  lines: [Boolean, String],
  link: {
    type: Boolean,
    default: void 0
  },
  nav: Boolean,
  prependAvatar: String,
  prependIcon: Ke,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  slim: Boolean,
  subtitle: {
    type: [String, Number, Boolean],
    default: void 0
  },
  title: {
    type: [String, Number, Boolean],
    default: void 0
  },
  value: null,
  onClick: T2(),
  onClickOnce: T2(),
  ...u0(),
  ...qe(),
  ...z2(),
  ...Ct(),
  ...Ut(),
  ...it(),
  ...Ql(),
  ...l2(),
  ...y2(),
  ...Ht({
    variant: "text"
  })
}, "VListItem"), vt = Ae()({
  name: "VListItem",
  directives: {
    vRipple: Kt
  },
  props: J8(),
  emits: {
    click: (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      slots: a,
      emit: r
    } = t;
    const i = Xl(e, n), o = E(() => e.value === void 0 ? i.href.value : e.value), {
      activate: u,
      isActivated: c,
      select: f,
      isOpen: v,
      isSelected: h,
      isIndeterminate: y,
      isGroupActivator: p,
      root: k,
      parent: S,
      openOnSelect: w,
      id: _
    } = z5(o, () => e.disabled, !1), V = L5(), A = E(() => e.active !== !1 && (e.active || i.isActive?.value || (k.activatable.value ? c.value : h.value))), T = R(() => e.link !== !1 && i.isLink.value), O = E(() => !!V && (k.selectable.value || k.activatable.value || e.value != null)), Y = E(() => !e.disabled && e.link !== !1 && (e.link || i.isClickable.value || O.value)), F = E(() => V ? T.value ? "link" : O.value ? "option" : "listitem" : void 0), x = E(() => {
      if (O.value)
        return k.activatable.value ? c.value : k.selectable.value ? h.value : A.value;
    }), G = R(() => e.rounded || e.nav), U = R(() => e.color ?? e.activeColor), ee = R(() => ({
      color: A.value ? U.value ?? e.baseColor : e.baseColor,
      variant: e.variant
    }));
    be(() => i.isActive?.value, (de) => {
      de && J();
    }), dn(() => {
      i.isActive?.value && e2(() => J());
    });
    function J() {
      S.value != null && k.open(S.value, !0), w(!0);
    }
    const {
      themeClasses: ae
    } = V2(e), {
      borderClasses: oe
    } = L0(e), {
      colorClasses: te,
      colorStyles: L,
      variantClasses: X
    } = ca(ee), {
      densityClasses: re
    } = bt(e), {
      dimensionStyles: we
    } = pt(e), {
      elevationClasses: le
    } = c0(e), {
      roundedClasses: ke
    } = ft(G), fe = R(() => e.lines ? `v-list-item--${e.lines}-line` : void 0), ne = R(() => e.ripple !== void 0 && e.ripple && V?.filterable ? {
      keys: ["Enter"]
    } : e.ripple), Pe = E(() => ({
      isActive: A.value,
      select: f,
      isOpen: v.value,
      isSelected: h.value,
      isIndeterminate: y.value
    }));
    function Re(de) {
      r("click", de), !["INPUT", "TEXTAREA"].includes(de.target?.tagName) && Y.value && (i.navigate?.(de), !p && (k.activatable.value ? u(!c.value, de) : (k.selectable.value || e.value != null && !T.value) && f(!h.value, de)));
    }
    function De(de) {
      const Be = de.target;
      ["INPUT", "TEXTAREA"].includes(Be.tagName) || (de.key === "Enter" || de.key === " " && !V?.filterable) && (de.preventDefault(), de.stopPropagation(), de.target.dispatchEvent(new MouseEvent("click", de)));
    }
    return Fe(() => {
      const de = T.value ? "a" : e.tag, Be = a.title || e.title != null, ye = a.subtitle || e.subtitle != null, f2 = !!(e.appendAvatar || e.appendIcon), F2 = !!(f2 || a.append), Me = !!(e.prependAvatar || e.prependIcon), _2 = !!(Me || a.prepend);
      return V?.updateHasPrepend(_2), e.activeColor && D3("active-color", ["color", "base-color"]), g2(g(de, me(i.linkProps, {
        class: ["v-list-item", {
          "v-list-item--active": A.value,
          "v-list-item--disabled": e.disabled,
          "v-list-item--link": Y.value,
          "v-list-item--nav": e.nav,
          "v-list-item--prepend": !_2 && V?.hasPrepend.value,
          "v-list-item--slim": e.slim,
          [`${e.activeClass}`]: e.activeClass && A.value
        }, ae.value, oe.value, te.value, re.value, le.value, fe.value, ke.value, X.value, e.class],
        style: [L.value, we.value, e.style],
        tabindex: Y.value ? V ? -2 : 0 : void 0,
        "aria-selected": x.value,
        role: F.value,
        onClick: Re,
        onKeydown: Y.value && !T.value && De
      }), {
        default: () => [ua(Y.value || A.value, "v-list-item"), _2 && I("div", {
          key: "prepend",
          class: "v-list-item__prepend"
        }, [a.prepend ? g(k2, {
          key: "prepend-defaults",
          disabled: !Me,
          defaults: {
            VAvatar: {
              density: e.density,
              image: e.prependAvatar
            },
            VIcon: {
              density: e.density,
              icon: e.prependIcon
            },
            VListItemAction: {
              start: !0
            }
          }
        }, {
          default: () => [a.prepend?.(Pe.value)]
        }) : I(je, null, [e.prependAvatar && g(rt, {
          key: "prepend-avatar",
          density: e.density,
          image: e.prependAvatar
        }, null), e.prependIcon && g(ze, {
          key: "prepend-icon",
          density: e.density,
          icon: e.prependIcon
        }, null)]), I("div", {
          class: "v-list-item__spacer"
        }, null)]), I("div", {
          class: "v-list-item__content",
          "data-no-activator": ""
        }, [Be && g(Mn, {
          key: "title"
        }, {
          default: () => [a.title?.({
            title: e.title
          }) ?? a2(e.title)]
        }), ye && g(Bn, {
          key: "subtitle"
        }, {
          default: () => [a.subtitle?.({
            subtitle: e.subtitle
          }) ?? a2(e.subtitle)]
        }), a.default?.(Pe.value)]), F2 && I("div", {
          key: "append",
          class: "v-list-item__append"
        }, [a.append ? g(k2, {
          key: "append-defaults",
          disabled: !f2,
          defaults: {
            VAvatar: {
              density: e.density,
              image: e.appendAvatar
            },
            VIcon: {
              density: e.density,
              icon: e.appendIcon
            },
            VListItemAction: {
              end: !0
            }
          }
        }, {
          default: () => [a.append?.(Pe.value)]
        }) : I(je, null, [e.appendIcon && g(ze, {
          key: "append-icon",
          density: e.density,
          icon: e.appendIcon
        }, null), e.appendAvatar && g(rt, {
          key: "append-avatar",
          density: e.density,
          image: e.appendAvatar
        }, null)]), I("div", {
          class: "v-list-item__spacer"
        }, null)])]
      }), [[Kt, Y.value && ne.value]]);
    }), {
      activate: u,
      isActivated: c,
      isGroupActivator: p,
      isSelected: h,
      list: V,
      select: f,
      root: k,
      id: _,
      link: i
    };
  }
}), e9 = ce({
  color: String,
  inset: Boolean,
  sticky: Boolean,
  title: String,
  ...qe(),
  ...l2()
}, "VListSubheader"), K5 = Ae()({
  name: "VListSubheader",
  props: e9(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      textColorClasses: a,
      textColorStyles: r
    } = ht(() => e.color);
    return Fe(() => {
      const i = !!(n.default || e.title);
      return g(e.tag, {
        class: ve(["v-list-subheader", {
          "v-list-subheader--inset": e.inset,
          "v-list-subheader--sticky": e.sticky
        }, a.value, e.class]),
        style: Ee([{
          textColorStyles: r
        }, e.style])
      }, {
        default: () => [i && I("div", {
          class: "v-list-subheader__text"
        }, [n.default?.() ?? e.title])]
      });
    }), {};
  }
}), t9 = ce({
  items: Array,
  returnObject: Boolean
}, "VListChildren"), W5 = Ae()({
  name: "VListChildren",
  props: t9(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return F5(), () => n.default?.() ?? e.items?.map((a) => {
      let {
        children: r,
        props: i,
        type: o,
        raw: u
      } = a;
      if (o === "divider")
        return n.divider?.({
          props: i
        }) ?? g(Wt, i, null);
      if (o === "subheader")
        return n.subheader?.({
          props: i
        }) ?? g(K5, i, null);
      const c = {
        subtitle: n.subtitle ? (v) => n.subtitle?.({
          ...v,
          item: u
        }) : void 0,
        prepend: n.prepend ? (v) => n.prepend?.({
          ...v,
          item: u
        }) : void 0,
        append: n.append ? (v) => n.append?.({
          ...v,
          item: u
        }) : void 0,
        title: n.title ? (v) => n.title?.({
          ...v,
          item: u
        }) : void 0
      }, f = c1.filterProps(i);
      return r ? g(c1, me(f, {
        value: e.returnObject ? u : i?.value,
        rawId: i?.value
      }), {
        activator: (v) => {
          let {
            props: h
          } = v;
          const y = me(i, h, {
            value: e.returnObject ? u : i.value
          });
          return n.header ? n.header({
            props: y
          }) : g(vt, y, c);
        },
        default: () => g(W5, {
          items: r,
          returnObject: e.returnObject
        }, n)
      }) : n.item ? n.item({
        props: i
      }) : g(vt, me(i, {
        value: e.returnObject ? u : i.value
      }), c);
    });
  }
}), q5 = ce({
  items: {
    type: Array,
    default: () => []
  },
  itemTitle: {
    type: [String, Array, Function],
    default: "title"
  },
  itemValue: {
    type: [String, Array, Function],
    default: "value"
  },
  itemChildren: {
    type: [Boolean, String, Array, Function],
    default: "children"
  },
  itemProps: {
    type: [Boolean, String, Array, Function],
    default: "props"
  },
  itemType: {
    type: [Boolean, String, Array, Function],
    default: "type"
  },
  returnObject: Boolean,
  valueComparator: Function
}, "list-items"), n9 = /* @__PURE__ */ new Set(["item", "divider", "subheader"]);
function nn(e, t) {
  const n = N2(t, e.itemTitle, t), a = N2(t, e.itemValue, n), r = N2(t, e.itemChildren), i = e.itemProps === !0 ? typeof t == "object" && t != null && !Array.isArray(t) ? "children" in t ? qt(t, ["children"]) : t : void 0 : N2(t, e.itemProps);
  let o = N2(t, e.itemType, "item");
  n9.has(o) || (o = "item");
  const u = {
    title: n,
    value: a,
    ...i
  };
  return {
    type: o,
    title: String(u.title ?? ""),
    value: u.value,
    props: u,
    children: o === "item" && Array.isArray(r) ? H5(e, r) : void 0,
    raw: t
  };
}
nn.neededProps = ["itemTitle", "itemValue", "itemChildren", "itemProps", "itemType"];
function H5(e, t) {
  const n = jt(e, nn.neededProps), a = [];
  for (const r of t)
    a.push(nn(n, r));
  return a;
}
function a9(e) {
  const t = E(() => H5(e, e.items)), n = E(() => t.value.some((u) => u.value === null)), a = Ve(/* @__PURE__ */ new Map()), r = Ve([]);
  b2(() => {
    const u = t.value, c = /* @__PURE__ */ new Map(), f = [];
    for (let v = 0; v < u.length; v++) {
      const h = u[v];
      if (l0(h.value) || h.value === null) {
        let y = c.get(h.value);
        y || (y = [], c.set(h.value, y)), y.push(h);
      } else
        f.push(h);
    }
    a.value = c, r.value = f;
  });
  function i(u) {
    const c = a.value, f = t.value, v = r.value, h = n.value, y = e.returnObject, p = !!e.valueComparator, k = e.valueComparator || H2, S = jt(e, nn.neededProps), w = [];
    e: for (const _ of u) {
      if (!h && _ === null) continue;
      if (y && typeof _ == "string") {
        w.push(nn(S, _));
        continue;
      }
      const V = c.get(_);
      if (p || !V) {
        for (const A of p ? f : v)
          if (k(_, A.value)) {
            w.push(A);
            continue e;
          }
        w.push(nn(S, _));
        continue;
      }
      w.push(...V);
    }
    return w;
  }
  function o(u) {
    return e.returnObject ? u.map((c) => {
      let {
        raw: f
      } = c;
      return f;
    }) : u.map((c) => {
      let {
        value: f
      } = c;
      return f;
    });
  }
  return {
    items: t,
    transformIn: i,
    transformOut: o
  };
}
const r9 = /* @__PURE__ */ new Set(["item", "divider", "subheader"]);
function i9(e, t) {
  const n = l0(t) ? t : N2(t, e.itemTitle), a = l0(t) ? t : N2(t, e.itemValue, void 0), r = N2(t, e.itemChildren), i = e.itemProps === !0 ? qt(t, ["children"]) : N2(t, e.itemProps);
  let o = N2(t, e.itemType, "item");
  r9.has(o) || (o = "item");
  const u = {
    title: n,
    value: a,
    ...i
  };
  return {
    type: o,
    title: u.title,
    value: u.value,
    props: u,
    children: o === "item" && r ? U5(e, r) : void 0,
    raw: t
  };
}
function U5(e, t) {
  const n = [];
  for (const a of t)
    n.push(i9(e, a));
  return n;
}
function l9(e) {
  return {
    items: E(() => U5(e, e.items))
  };
}
const o9 = ce({
  baseColor: String,
  /* @deprecated */
  activeColor: String,
  activeClass: String,
  bgColor: String,
  disabled: Boolean,
  filterable: Boolean,
  expandIcon: Ke,
  collapseIcon: Ke,
  lines: {
    type: [Boolean, String],
    default: "one"
  },
  slim: Boolean,
  nav: Boolean,
  "onClick:open": T2(),
  "onClick:select": T2(),
  "onUpdate:opened": T2(),
  ...U8({
    selectStrategy: "single-leaf",
    openStrategy: "list"
  }),
  ...u0(),
  ...qe(),
  ...z2(),
  ...Ct(),
  ...Ut(),
  ...q5(),
  ...it(),
  ...l2(),
  ...y2(),
  ...Ht({
    variant: "text"
  })
}, "VList"), G5 = Ae()({
  name: "VList",
  props: o9(),
  emits: {
    "update:selected": (e) => !0,
    "update:activated": (e) => !0,
    "update:opened": (e) => !0,
    "click:open": (e) => !0,
    "click:activate": (e) => !0,
    "click:select": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      items: a
    } = l9(e), {
      themeClasses: r
    } = V2(e), {
      backgroundColorClasses: i,
      backgroundColorStyles: o
    } = at(() => e.bgColor), {
      borderClasses: u
    } = L0(e), {
      densityClasses: c
    } = bt(e), {
      dimensionStyles: f
    } = pt(e), {
      elevationClasses: v
    } = c0(e), {
      roundedClasses: h
    } = ft(e), {
      children: y,
      open: p,
      parents: k,
      select: S,
      getPath: w
    } = G8(e), _ = R(() => e.lines ? `v-list--${e.lines}-line` : void 0), V = R(() => e.activeColor), A = R(() => e.baseColor), T = R(() => e.color), O = R(() => e.selectable || e.activatable);
    F5({
      filterable: e.filterable
    }), gt({
      VListGroup: {
        activeColor: V,
        baseColor: A,
        color: T,
        expandIcon: R(() => e.expandIcon),
        collapseIcon: R(() => e.collapseIcon)
      },
      VListItem: {
        activeClass: R(() => e.activeClass),
        activeColor: V,
        baseColor: A,
        color: T,
        density: R(() => e.density),
        disabled: R(() => e.disabled),
        lines: R(() => e.lines),
        nav: R(() => e.nav),
        slim: R(() => e.slim),
        variant: R(() => e.variant)
      }
    });
    const Y = Ve(!1), F = se();
    function x(oe) {
      Y.value = !0;
    }
    function G(oe) {
      Y.value = !1;
    }
    function U(oe) {
      !Y.value && !(oe.relatedTarget && F.value?.contains(oe.relatedTarget)) && ae();
    }
    function ee(oe) {
      const te = oe.target;
      if (!(!F.value || te.tagName === "INPUT" && ["Home", "End"].includes(oe.key) || te.tagName === "TEXTAREA")) {
        if (oe.key === "ArrowDown")
          ae("next");
        else if (oe.key === "ArrowUp")
          ae("prev");
        else if (oe.key === "Home")
          ae("first");
        else if (oe.key === "End")
          ae("last");
        else
          return;
        oe.preventDefault();
      }
    }
    function J(oe) {
      Y.value = !0;
    }
    function ae(oe) {
      if (F.value)
        return zn(F.value, oe);
    }
    return Fe(() => g(e.tag, {
      ref: F,
      class: ve(["v-list", {
        "v-list--disabled": e.disabled,
        "v-list--nav": e.nav,
        "v-list--slim": e.slim
      }, r.value, i.value, u.value, c.value, v.value, _.value, h.value, e.class]),
      style: Ee([o.value, f.value, e.style]),
      tabindex: e.disabled ? -1 : 0,
      role: O.value ? "listbox" : "list",
      "aria-activedescendant": void 0,
      onFocusin: x,
      onFocusout: G,
      onFocus: U,
      onKeydown: ee,
      onMousedown: J
    }, {
      default: () => [g(W5, {
        items: a.value,
        returnObject: e.returnObject
      }, n)]
    })), {
      open: p,
      select: S,
      focus: ae,
      children: y,
      parents: k,
      getPath: w
    };
  }
}), Z5 = /* @__PURE__ */ Symbol.for("vuetify:selection-control-group"), Y5 = ce({
  color: String,
  disabled: {
    type: Boolean,
    default: null
  },
  defaultsTarget: String,
  error: Boolean,
  id: String,
  inline: Boolean,
  falseIcon: Ke,
  trueIcon: Ke,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  multiple: {
    type: Boolean,
    default: null
  },
  name: String,
  readonly: {
    type: Boolean,
    default: null
  },
  modelValue: null,
  type: String,
  valueComparator: {
    type: Function,
    default: H2
  },
  ...qe(),
  ...z2(),
  ...y2()
}, "SelectionControlGroup"), s9 = ce({
  ...Y5({
    defaultsTarget: "VSelectionControl"
  })
}, "VSelectionControlGroup");
Ae()({
  name: "VSelectionControlGroup",
  props: s9(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = r2(e, "modelValue"), r = Y2(), i = R(() => e.id || `v-selection-control-group-${r}`), o = R(() => e.name || i.value), u = /* @__PURE__ */ new Set();
    return c2(Z5, {
      modelValue: a,
      forceUpdate: () => {
        u.forEach((c) => c());
      },
      onForceUpdate: (c) => {
        u.add(c), i2(() => {
          u.delete(c);
        });
      }
    }), gt({
      [e.defaultsTarget]: {
        color: R(() => e.color),
        disabled: R(() => e.disabled),
        density: R(() => e.density),
        error: R(() => e.error),
        inline: R(() => e.inline),
        modelValue: a,
        multiple: R(() => !!e.multiple || e.multiple == null && Array.isArray(a.value)),
        name: o,
        falseIcon: R(() => e.falseIcon),
        trueIcon: R(() => e.trueIcon),
        readonly: R(() => e.readonly),
        ripple: R(() => e.ripple),
        type: R(() => e.type),
        valueComparator: R(() => e.valueComparator)
      }
    }), Fe(() => I("div", {
      class: ve(["v-selection-control-group", {
        "v-selection-control-group--inline": e.inline
      }, e.class]),
      style: Ee(e.style),
      role: e.type === "radio" ? "radiogroup" : void 0
    }, [n.default?.()])), {};
  }
});
const X5 = ce({
  label: String,
  baseColor: String,
  trueValue: null,
  falseValue: null,
  value: null,
  ...qe(),
  ...Y5()
}, "VSelectionControl");
function u9(e) {
  const t = We(Z5, void 0), {
    densityClasses: n
  } = bt(e), a = r2(e, "modelValue"), r = E(() => e.trueValue !== void 0 ? e.trueValue : e.value !== void 0 ? e.value : !0), i = E(() => e.falseValue !== void 0 ? e.falseValue : !1), o = E(() => !!e.multiple || e.multiple == null && Array.isArray(a.value)), u = E({
    get() {
      const p = t ? t.modelValue.value : a.value;
      return o.value ? $2(p).some((k) => e.valueComparator(k, r.value)) : e.valueComparator(p, r.value);
    },
    set(p) {
      if (e.readonly) return;
      const k = p ? r.value : i.value;
      let S = k;
      o.value && (S = p ? [...$2(a.value), k] : $2(a.value).filter((w) => !e.valueComparator(w, r.value))), t ? t.modelValue.value = S : a.value = S;
    }
  }), {
    textColorClasses: c,
    textColorStyles: f
  } = ht(() => {
    if (!(e.error || e.disabled))
      return u.value ? e.color : e.baseColor;
  }), {
    backgroundColorClasses: v,
    backgroundColorStyles: h
  } = at(() => u.value && !e.error && !e.disabled ? e.color : e.baseColor), y = E(() => u.value ? e.trueIcon : e.falseIcon);
  return {
    group: t,
    densityClasses: n,
    trueValue: r,
    falseValue: i,
    model: u,
    textColorClasses: c,
    textColorStyles: f,
    backgroundColorClasses: v,
    backgroundColorStyles: h,
    icon: y
  };
}
const d1 = Ae()({
  name: "VSelectionControl",
  directives: {
    vRipple: Kt
  },
  inheritAttrs: !1,
  props: X5(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      slots: a
    } = t;
    const {
      group: r,
      densityClasses: i,
      icon: o,
      model: u,
      textColorClasses: c,
      textColorStyles: f,
      backgroundColorClasses: v,
      backgroundColorStyles: h,
      trueValue: y
    } = u9(e), p = Y2(), k = Ve(!1), S = Ve(!1), w = se(), _ = R(() => e.id || `input-${p}`), V = R(() => !e.disabled && !e.readonly);
    r?.onForceUpdate(() => {
      w.value && (w.value.checked = u.value);
    });
    function A(F) {
      V.value && (k.value = !0, cr(F.target, ":focus-visible") !== !1 && (S.value = !0));
    }
    function T() {
      k.value = !1, S.value = !1;
    }
    function O(F) {
      F.stopPropagation();
    }
    function Y(F) {
      if (!V.value) {
        w.value && (w.value.checked = u.value);
        return;
      }
      e.readonly && r && e2(() => r.forceUpdate()), u.value = F.target.checked;
    }
    return Fe(() => {
      const F = a.label ? a.label({
        label: e.label,
        props: {
          for: _.value
        }
      }) : e.label, [x, G] = M6(n), U = I("input", me({
        ref: w,
        checked: u.value,
        disabled: !!e.disabled,
        id: _.value,
        onBlur: T,
        onFocus: A,
        onInput: Y,
        "aria-disabled": !!e.disabled,
        "aria-label": e.label,
        type: e.type,
        value: y.value,
        name: e.name,
        "aria-checked": e.type === "checkbox" ? u.value : void 0
      }, G), null);
      return I("div", me({
        class: ["v-selection-control", {
          "v-selection-control--dirty": u.value,
          "v-selection-control--disabled": e.disabled,
          "v-selection-control--error": e.error,
          "v-selection-control--focused": k.value,
          "v-selection-control--focus-visible": S.value,
          "v-selection-control--inline": e.inline
        }, i.value, e.class]
      }, x, {
        style: e.style
      }), [I("div", {
        class: ve(["v-selection-control__wrapper", c.value]),
        style: Ee(f.value)
      }, [a.default?.({
        backgroundColorClasses: v,
        backgroundColorStyles: h
      }), g2(I("div", {
        class: ve(["v-selection-control__input"])
      }, [a.input?.({
        model: u,
        textColorClasses: c,
        textColorStyles: f,
        backgroundColorClasses: v,
        backgroundColorStyles: h,
        inputNode: U,
        icon: o.value,
        props: {
          onFocus: A,
          onBlur: T,
          id: _.value
        }
      }) ?? I(je, null, [o.value && g(ze, {
        key: "icon",
        icon: o.value
      }, null), U])]), [[Kt, !e.disabled && !e.readonly && e.ripple, null, {
        center: !0,
        circle: !0
      }]])]), F && g(_5, {
        for: _.value,
        onClick: O
      }, {
        default: () => [F]
      })]);
    }), {
      isFocused: k,
      input: w
    };
  }
}), c9 = ce({
  indeterminate: Boolean,
  indeterminateIcon: {
    type: Ke,
    default: "$checkboxIndeterminate"
  },
  ...X5({
    falseIcon: "$checkboxOff",
    trueIcon: "$checkboxOn"
  })
}, "VCheckboxBtn"), Kr = Ae()({
  name: "VCheckboxBtn",
  props: c9(),
  emits: {
    "update:modelValue": (e) => !0,
    "update:indeterminate": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = r2(e, "indeterminate"), r = r2(e, "modelValue");
    function i(c) {
      a.value && (a.value = !1);
    }
    const o = R(() => a.value ? e.indeterminateIcon : e.falseIcon), u = R(() => a.value ? e.indeterminateIcon : e.trueIcon);
    return Fe(() => {
      const c = qt(d1.filterProps(e), ["modelValue"]);
      return g(d1, me(c, {
        modelValue: r.value,
        "onUpdate:modelValue": [(f) => r.value = f, i],
        class: ["v-checkbox-btn", e.class],
        style: e.style,
        type: "checkbox",
        falseIcon: o.value,
        trueIcon: u.value,
        "aria-checked": a.value ? "mixed" : void 0
      }), n);
    }), {};
  }
}), d9 = /* @__PURE__ */ Symbol.for("vuetify:goto");
function f9() {
  return {
    container: void 0,
    duration: 300,
    layout: !1,
    offset: 0,
    easing: "easeInOutCubic",
    patterns: Cc
  };
}
function v9(e) {
  return ao(e) ?? (document.scrollingElement || document.body);
}
function ao(e) {
  return typeof e == "string" ? document.querySelector(e) : F6(e);
}
function Wi(e, t, n) {
  if (typeof e == "number") return t && n ? -e : e;
  let a = ao(e), r = 0;
  for (; a; )
    r += t ? a.offsetLeft : a.offsetTop, a = a.offsetParent;
  return r;
}
async function f1(e, t, n, a) {
  const r = n ? "scrollLeft" : "scrollTop", i = Dt(a?.options ?? f9(), t), o = a?.rtl.value, u = (typeof e == "number" ? e : ao(e)) ?? 0, c = i.container === "parent" && u instanceof HTMLElement ? u.parentElement : v9(i.container), f = $0() ? i.patterns.instant : typeof i.easing == "function" ? i.easing : i.patterns[i.easing];
  if (!f) throw new TypeError(`Easing function "${i.easing}" not found.`);
  let v;
  if (typeof u == "number")
    v = Wi(u, n, o);
  else if (v = Wi(u, n, o) - Wi(c, n, o), i.layout) {
    const k = window.getComputedStyle(u).getPropertyValue("--v-layout-top");
    k && (v -= parseInt(k, 10));
  }
  v += i.offset, v = g9(c, v, !!o, !!n);
  const h = c[r] ?? 0;
  if (v === h) return Promise.resolve(v);
  const y = performance.now();
  return new Promise((p) => requestAnimationFrame(function k(S) {
    const _ = (S - y) / i.duration, V = Math.floor(h + (v - h) * f(q2(_, 0, 1)));
    if (c[r] = V, _ >= 1 && Math.abs(V - c[r]) < 10)
      return p(v);
    if (_ > 2)
      return i0("Scroll target is not reachable"), p(c[r]);
    requestAnimationFrame(k);
  }));
}
function m9() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const t = We(d9), {
    isRtl: n
  } = xt();
  if (!t) throw new Error("[Vuetify] Could not find injected goto instance");
  const a = {
    ...t,
    // can be set via VLocaleProvider
    rtl: R(() => t.rtl.value || n.value)
  };
  async function r(i, o) {
    return f1(i, Dt(e, o), !1, a);
  }
  return r.horizontal = async (i, o) => f1(i, Dt(e, o), !0, a), r;
}
function g9(e, t, n, a) {
  const {
    scrollWidth: r,
    scrollHeight: i
  } = e, [o, u] = e === document.scrollingElement ? [window.innerWidth, window.innerHeight] : [e.offsetWidth, e.offsetHeight];
  let c, f;
  return a ? n ? (c = -(r - o), f = 0) : (c = 0, f = r - o) : (c = 0, f = i + -u), q2(t, c, f);
}
function h9(e) {
  let {
    selectedElement: t,
    containerElement: n,
    isRtl: a,
    isHorizontal: r
  } = e;
  const i = Xn(r, n), o = Q5(r, a, n), u = Xn(r, t), c = J5(r, t), f = u * 0.4;
  return o > c ? c - f : o + i < c + u ? c - i + u + f : o;
}
function y9(e) {
  let {
    selectedElement: t,
    containerElement: n,
    isHorizontal: a
  } = e;
  const r = Xn(a, n), i = J5(a, t), o = Xn(a, t);
  return i - r / 2 + o / 2;
}
function v1(e, t) {
  return t?.[e ? "scrollWidth" : "scrollHeight"] || 0;
}
function C9(e, t) {
  return t?.[e ? "clientWidth" : "clientHeight"] || 0;
}
function Q5(e, t, n) {
  if (!n)
    return 0;
  const {
    scrollLeft: a,
    offsetWidth: r,
    scrollWidth: i
  } = n;
  return e ? t ? i - r + a : a : n.scrollTop;
}
function Xn(e, t) {
  return t?.[e ? "offsetWidth" : "offsetHeight"] || 0;
}
function J5(e, t) {
  return t?.[e ? "offsetLeft" : "offsetTop"] || 0;
}
const eu = /* @__PURE__ */ Symbol.for("vuetify:v-slide-group"), ro = ce({
  centerActive: Boolean,
  scrollToActive: {
    type: Boolean,
    default: !0
  },
  contentClass: null,
  direction: {
    type: String,
    default: "horizontal"
  },
  symbol: {
    type: null,
    default: eu
  },
  nextIcon: {
    type: Ke,
    default: "$next"
  },
  prevIcon: {
    type: Ke,
    default: "$prev"
  },
  showArrows: {
    type: [Boolean, String],
    validator: (e) => typeof e == "boolean" || ["always", "desktop", "mobile"].includes(e)
  },
  ...qe(),
  ...zr({
    mobile: null
  }),
  ...l2(),
  ...Or({
    selectedClass: "v-slide-group-item--active"
  })
}, "VSlideGroup"), gr = Ae()({
  name: "VSlideGroup",
  props: ro(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      isRtl: a
    } = xt(), {
      displayClasses: r,
      mobile: i
    } = B0(e), o = da(e, e.symbol), u = Ve(!1), c = Ve(0), f = Ve(0), v = Ve(0), h = E(() => e.direction === "horizontal"), {
      resizeRef: y,
      contentRect: p
    } = T0(), {
      resizeRef: k,
      contentRect: S
    } = T0(), w = m9(), _ = E(() => ({
      container: y.el,
      duration: 200,
      easing: "easeOutQuart"
    })), V = E(() => o.selected.value.length ? o.items.value.findIndex((fe) => fe.id === o.selected.value[0]) : -1), A = E(() => o.selected.value.length ? o.items.value.findIndex((fe) => fe.id === o.selected.value[o.selected.value.length - 1]) : -1);
    if (w2) {
      let fe = -1;
      be(() => [o.selected.value, p.value, S.value, h.value], () => {
        cancelAnimationFrame(fe), fe = requestAnimationFrame(() => {
          if (p.value && S.value) {
            const ne = h.value ? "width" : "height";
            f.value = p.value[ne], v.value = S.value[ne], u.value = f.value + 1 < v.value;
          }
          if (e.scrollToActive && V.value >= 0 && k.el) {
            const ne = k.el.children[A.value];
            O(ne, e.centerActive);
          }
        });
      });
    }
    const T = Ve(!1);
    function O(fe, ne) {
      let Pe = 0;
      ne ? Pe = y9({
        containerElement: y.el,
        isHorizontal: h.value,
        selectedElement: fe
      }) : Pe = h9({
        containerElement: y.el,
        isHorizontal: h.value,
        isRtl: a.value,
        selectedElement: fe
      }), Y(Pe);
    }
    function Y(fe) {
      if (!w2 || !y.el) return;
      const ne = Xn(h.value, y.el), Pe = Q5(h.value, a.value, y.el);
      if (!(v1(h.value, y.el) <= ne || // Prevent scrolling by only a couple of pixels, which doesn't look smooth
      Math.abs(fe - Pe) < 16)) {
        if (h.value && a.value && y.el) {
          const {
            scrollWidth: De,
            offsetWidth: de
          } = y.el;
          fe = De - de - fe;
        }
        h.value ? w.horizontal(fe, _.value) : w(fe, _.value);
      }
    }
    function F(fe) {
      const {
        scrollTop: ne,
        scrollLeft: Pe
      } = fe.target;
      c.value = h.value ? Pe : ne;
    }
    function x(fe) {
      if (T.value = !0, !(!u.value || !k.el)) {
        for (const ne of fe.composedPath())
          for (const Pe of k.el.children)
            if (Pe === ne) {
              O(Pe);
              return;
            }
      }
    }
    function G(fe) {
      T.value = !1;
    }
    let U = !1;
    function ee(fe) {
      !U && !T.value && !(fe.relatedTarget && k.el?.contains(fe.relatedTarget)) && te(), U = !1;
    }
    function J() {
      U = !0;
    }
    function ae(fe) {
      if (!k.el) return;
      function ne(Pe) {
        fe.preventDefault(), te(Pe);
      }
      h.value ? fe.key === "ArrowRight" ? ne(a.value ? "prev" : "next") : fe.key === "ArrowLeft" && ne(a.value ? "next" : "prev") : fe.key === "ArrowDown" ? ne("next") : fe.key === "ArrowUp" && ne("prev"), fe.key === "Home" ? ne("first") : fe.key === "End" && ne("last");
    }
    function oe(fe, ne) {
      if (!fe) return;
      let Pe = fe;
      do
        Pe = Pe?.[ne === "next" ? "nextElementSibling" : "previousElementSibling"];
      while (Pe?.hasAttribute("disabled"));
      return Pe;
    }
    function te(fe) {
      if (!k.el) return;
      let ne;
      if (!fe)
        ne = ur(k.el)[0];
      else if (fe === "next") {
        if (ne = oe(k.el.querySelector(":focus"), fe), !ne) return te("first");
      } else if (fe === "prev") {
        if (ne = oe(k.el.querySelector(":focus"), fe), !ne) return te("last");
      } else fe === "first" ? (ne = k.el.firstElementChild, ne?.hasAttribute("disabled") && (ne = oe(ne, "next"))) : fe === "last" && (ne = k.el.lastElementChild, ne?.hasAttribute("disabled") && (ne = oe(ne, "prev")));
      ne && ne.focus({
        preventScroll: !0
      });
    }
    function L(fe) {
      const ne = h.value && a.value ? -1 : 1, Pe = (fe === "prev" ? -ne : ne) * f.value;
      let Re = c.value + Pe;
      if (h.value && a.value && y.el) {
        const {
          scrollWidth: De,
          offsetWidth: de
        } = y.el;
        Re += De - de;
      }
      Y(Re);
    }
    const X = E(() => ({
      next: o.next,
      prev: o.prev,
      select: o.select,
      isSelected: o.isSelected
    })), re = E(() => u.value || Math.abs(c.value) > 0), we = E(() => {
      switch (e.showArrows) {
        // Always show arrows on desktop & mobile
        case "always":
          return !0;
        // Always show arrows on desktop
        case "desktop":
          return !i.value;
        // Show arrows on mobile when overflowing.
        // This matches the default 2.2 behavior
        case !0:
          return re.value;
        // Always show on mobile
        case "mobile":
          return i.value || re.value;
        // https://material.io/components/tabs#scrollable-tabs
        // Always show arrows when
        // overflowed on desktop
        default:
          return !i.value && re.value;
      }
    }), le = E(() => Math.abs(c.value) > 1), ke = E(() => {
      if (!y.value || !re.value) return !1;
      const fe = v1(h.value, y.el), ne = C9(h.value, y.el);
      return fe - ne - Math.abs(c.value) > 1;
    });
    return Fe(() => g(e.tag, {
      class: ve(["v-slide-group", {
        "v-slide-group--vertical": !h.value,
        "v-slide-group--has-affixes": we.value,
        "v-slide-group--is-overflowing": u.value
      }, r.value, e.class]),
      style: Ee(e.style),
      tabindex: T.value || o.selected.value.length ? -1 : 0,
      onFocus: ee
    }, {
      default: () => [we.value && I("div", {
        key: "prev",
        class: ve(["v-slide-group__prev", {
          "v-slide-group__prev--disabled": !le.value
        }]),
        onMousedown: J,
        onClick: () => le.value && L("prev")
      }, [n.prev?.(X.value) ?? g(l1, null, {
        default: () => [g(ze, {
          icon: a.value ? e.nextIcon : e.prevIcon
        }, null)]
      })]), I("div", {
        key: "container",
        ref: y,
        class: ve(["v-slide-group__container", e.contentClass]),
        onScroll: F
      }, [I("div", {
        ref: k,
        class: "v-slide-group__content",
        onFocusin: x,
        onFocusout: G,
        onKeydown: ae
      }, [n.default?.(X.value)])]), we.value && I("div", {
        key: "next",
        class: ve(["v-slide-group__next", {
          "v-slide-group__next--disabled": !ke.value
        }]),
        onMousedown: J,
        onClick: () => ke.value && L("next")
      }, [n.next?.(X.value) ?? g(l1, null, {
        default: () => [g(ze, {
          icon: a.value ? e.prevIcon : e.nextIcon
        }, null)]
      })])]
    })), {
      selected: o.selected,
      scrollTo: L,
      scrollOffset: c,
      focus: te,
      hasPrev: le,
      hasNext: ke
    };
  }
}), tu = /* @__PURE__ */ Symbol.for("vuetify:v-chip-group"), p9 = ce({
  baseColor: String,
  column: Boolean,
  filter: Boolean,
  valueComparator: {
    type: Function,
    default: H2
  },
  ...ro({
    scrollToActive: !1
  }),
  ...qe(),
  ...Or({
    selectedClass: "v-chip--selected"
  }),
  ...l2(),
  ...y2(),
  ...Ht({
    variant: "tonal"
  })
}, "VChipGroup");
Ae()({
  name: "VChipGroup",
  props: p9(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: a
    } = V2(e), {
      isSelected: r,
      select: i,
      next: o,
      prev: u,
      selected: c
    } = da(e, tu);
    return gt({
      VChip: {
        baseColor: R(() => e.baseColor),
        color: R(() => e.color),
        disabled: R(() => e.disabled),
        filter: R(() => e.filter),
        variant: R(() => e.variant)
      }
    }), Fe(() => {
      const f = gr.filterProps(e);
      return g(gr, me(f, {
        class: ["v-chip-group", {
          "v-chip-group--column": e.column
        }, a.value, e.class],
        style: e.style
      }), {
        default: () => [n.default?.({
          isSelected: r,
          select: i,
          next: o,
          prev: u,
          selected: c.value
        })]
      });
    }), {};
  }
});
const b9 = ce({
  activeClass: String,
  appendAvatar: String,
  appendIcon: Ke,
  baseColor: String,
  closable: Boolean,
  closeIcon: {
    type: Ke,
    default: "$delete"
  },
  closeLabel: {
    type: String,
    default: "$vuetify.close"
  },
  draggable: Boolean,
  filter: Boolean,
  filterIcon: {
    type: Ke,
    default: "$complete"
  },
  label: Boolean,
  link: {
    type: Boolean,
    default: void 0
  },
  pill: Boolean,
  prependAvatar: String,
  prependIcon: Ke,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  text: {
    type: [String, Number, Boolean],
    default: void 0
  },
  modelValue: {
    type: Boolean,
    default: !0
  },
  onClick: T2(),
  onClickOnce: T2(),
  ...u0(),
  ...qe(),
  ...z2(),
  ...Ut(),
  ...Fr(),
  ...it(),
  ...Ql(),
  ...mn(),
  ...l2({
    tag: "span"
  }),
  ...y2(),
  ...Ht({
    variant: "tonal"
  })
}, "VChip"), Qn = Ae()({
  name: "VChip",
  directives: {
    vRipple: Kt
  },
  props: b9(),
  emits: {
    "click:close": (e) => !0,
    "update:modelValue": (e) => !0,
    "group:selected": (e) => !0,
    click: (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      emit: a,
      slots: r
    } = t;
    const {
      t: i
    } = wt(), {
      borderClasses: o
    } = L0(e), {
      densityClasses: u
    } = bt(e), {
      elevationClasses: c
    } = c0(e), {
      roundedClasses: f
    } = ft(e), {
      sizeClasses: v
    } = oa(e), {
      themeClasses: h
    } = V2(e), y = r2(e, "modelValue"), p = Un(e, tu, !1), k = Un(e, eu, !1), S = Xl(e, n), w = R(() => e.link !== !1 && S.isLink.value), _ = E(() => !e.disabled && e.link !== !1 && (!!p || e.link || S.isClickable.value)), V = R(() => ({
      "aria-label": i(e.closeLabel),
      disabled: e.disabled,
      onClick(x) {
        x.preventDefault(), x.stopPropagation(), y.value = !1, a("click:close", x);
      }
    }));
    be(y, (x) => {
      x ? (p?.register(), k?.register()) : (p?.unregister(), k?.unregister());
    });
    const {
      colorClasses: A,
      colorStyles: T,
      variantClasses: O
    } = ca(() => ({
      color: !p || p.isSelected.value ? e.color ?? e.baseColor : e.baseColor,
      variant: e.variant
    }));
    function Y(x) {
      a("click", x), _.value && (S.navigate?.(x), p?.toggle());
    }
    function F(x) {
      (x.key === "Enter" || x.key === " ") && (x.preventDefault(), Y(x));
    }
    return () => {
      const x = S.isLink.value ? "a" : e.tag, G = !!(e.appendIcon || e.appendAvatar), U = !!(G || r.append), ee = !!(r.close || e.closable), J = !!(r.filter || e.filter) && p, ae = !!(e.prependIcon || e.prependAvatar), oe = !!(ae || r.prepend);
      return y.value && g2(g(x, me(S.linkProps, {
        class: ["v-chip", {
          "v-chip--disabled": e.disabled,
          "v-chip--label": e.label,
          "v-chip--link": _.value,
          "v-chip--filter": J,
          "v-chip--pill": e.pill,
          [`${e.activeClass}`]: e.activeClass && S.isActive?.value
        }, h.value, o.value, A.value, u.value, c.value, f.value, v.value, O.value, p?.selectedClass.value, e.class],
        style: [T.value, e.style],
        disabled: e.disabled || void 0,
        draggable: e.draggable,
        tabindex: _.value ? 0 : void 0,
        onClick: Y,
        onKeydown: _.value && !w.value && F
      }), {
        default: () => [ua(_.value, "v-chip"), J && g(k5, {
          key: "filter"
        }, {
          default: () => [g2(I("div", {
            class: "v-chip__filter"
          }, [r.filter ? g(k2, {
            key: "filter-defaults",
            disabled: !e.filterIcon,
            defaults: {
              VIcon: {
                icon: e.filterIcon
              }
            }
          }, r.filter) : g(ze, {
            key: "filter-icon",
            icon: e.filterIcon
          }, null)]), [[dt, p.isSelected.value]])]
        }), oe && I("div", {
          key: "prepend",
          class: "v-chip__prepend"
        }, [r.prepend ? g(k2, {
          key: "prepend-defaults",
          disabled: !ae,
          defaults: {
            VAvatar: {
              image: e.prependAvatar,
              start: !0
            },
            VIcon: {
              icon: e.prependIcon,
              start: !0
            }
          }
        }, r.prepend) : I(je, null, [e.prependIcon && g(ze, {
          key: "prepend-icon",
          icon: e.prependIcon,
          start: !0
        }, null), e.prependAvatar && g(rt, {
          key: "prepend-avatar",
          image: e.prependAvatar,
          start: !0
        }, null)])]), I("div", {
          class: "v-chip__content",
          "data-no-activator": ""
        }, [r.default?.({
          isSelected: p?.isSelected.value,
          selectedClass: p?.selectedClass.value,
          select: p?.select,
          toggle: p?.toggle,
          value: p?.value.value,
          disabled: e.disabled
        }) ?? a2(e.text)]), U && I("div", {
          key: "append",
          class: "v-chip__append"
        }, [r.append ? g(k2, {
          key: "append-defaults",
          disabled: !G,
          defaults: {
            VAvatar: {
              end: !0,
              image: e.appendAvatar
            },
            VIcon: {
              end: !0,
              icon: e.appendIcon
            }
          }
        }, r.append) : I(je, null, [e.appendIcon && g(ze, {
          key: "append-icon",
          end: !0,
          icon: e.appendIcon
        }, null), e.appendAvatar && g(rt, {
          key: "append-avatar",
          end: !0,
          image: e.appendAvatar
        }, null)])]), ee && I("button", me({
          key: "close",
          class: "v-chip__close",
          type: "button",
          "data-testid": "close-chip"
        }, V.value), [r.close ? g(k2, {
          key: "close-defaults",
          defaults: {
            VIcon: {
              icon: e.closeIcon,
              size: "x-small"
            }
          }
        }, r.close) : g(ze, {
          key: "close-icon",
          icon: e.closeIcon,
          size: "x-small"
        }, null)])]
      }), [[Kt, _.value && e.ripple, null]]);
    };
  }
});
function qi(e, t) {
  return {
    x: e.x + t.x,
    y: e.y + t.y
  };
}
function w9(e, t) {
  return {
    x: e.x - t.x,
    y: e.y - t.y
  };
}
function m1(e, t) {
  if (e.side === "top" || e.side === "bottom") {
    const {
      side: n,
      align: a
    } = e, r = a === "left" ? 0 : a === "center" ? t.width / 2 : a === "right" ? t.width : a, i = n === "top" ? 0 : n === "bottom" ? t.height : n;
    return qi({
      x: r,
      y: i
    }, t);
  } else if (e.side === "left" || e.side === "right") {
    const {
      side: n,
      align: a
    } = e, r = n === "left" ? 0 : n === "right" ? t.width : n, i = a === "top" ? 0 : a === "center" ? t.height / 2 : a === "bottom" ? t.height : a;
    return qi({
      x: r,
      y: i
    }, t);
  }
  return qi({
    x: t.width / 2,
    y: t.height / 2
  }, t);
}
const nu = {
  static: k9,
  // specific viewport position, usually centered
  connected: P9
  // connected to a certain element
}, x9 = ce({
  locationStrategy: {
    type: [String, Function],
    default: "static",
    validator: (e) => typeof e == "function" || e in nu
  },
  location: {
    type: String,
    default: "bottom"
  },
  origin: {
    type: String,
    default: "auto"
  },
  offset: [Number, String, Array],
  stickToTarget: Boolean
}, "VOverlay-location-strategies");
function S9(e, t) {
  const n = se({}), a = se();
  w2 && o0(() => !!(t.isActive.value && e.locationStrategy), (u) => {
    be(() => e.locationStrategy, u), i2(() => {
      window.removeEventListener("resize", r), visualViewport?.removeEventListener("resize", i), visualViewport?.removeEventListener("scroll", o), a.value = void 0;
    }), window.addEventListener("resize", r, {
      passive: !0
    }), visualViewport?.addEventListener("resize", i, {
      passive: !0
    }), visualViewport?.addEventListener("scroll", o, {
      passive: !0
    }), typeof e.locationStrategy == "function" ? a.value = e.locationStrategy(t, e, n)?.updateLocation : a.value = nu[e.locationStrategy](t, e, n)?.updateLocation;
  });
  function r(u) {
    a.value?.(u);
  }
  function i(u) {
    a.value?.(u);
  }
  function o(u) {
    a.value?.(u);
  }
  return {
    contentStyles: n,
    updateLocation: a
  };
}
function k9() {
}
function _9(e, t) {
  const n = Kl(e);
  return t ? n.x += parseFloat(e.style.right || 0) : n.x -= parseFloat(e.style.left || 0), n.y -= parseFloat(e.style.top || 0), n;
}
function P9(e, t, n) {
  (Array.isArray(e.target.value) || bc(e.target.value)) && Object.assign(n.value, {
    position: "fixed",
    top: 0,
    [e.isRtl.value ? "right" : "left"]: 0
  });
  const {
    preferredAnchor: r,
    preferredOrigin: i
  } = Nl(() => {
    const _ = ol(t.location, e.isRtl.value), V = t.origin === "overlap" ? _ : t.origin === "auto" ? Ri(_) : ol(t.origin, e.isRtl.value);
    return _.side === V.side && _.align === Di(V).align ? {
      preferredAnchor: Os(_),
      preferredOrigin: Os(V)
    } : {
      preferredAnchor: _,
      preferredOrigin: V
    };
  }), [o, u, c, f] = ["minWidth", "minHeight", "maxWidth", "maxHeight"].map((_) => E(() => {
    const V = parseFloat(t[_]);
    return isNaN(V) ? 1 / 0 : V;
  })), v = E(() => {
    if (Array.isArray(t.offset))
      return t.offset;
    if (typeof t.offset == "string") {
      const _ = t.offset.split(" ").map(parseFloat);
      return _.length < 2 && _.push(0), _;
    }
    return typeof t.offset == "number" ? [t.offset, 0] : [0, 0];
  });
  let h = !1, y = -1;
  const p = new q3(4), k = new ResizeObserver(() => {
    if (!h) return;
    if (requestAnimationFrame((V) => {
      V !== y && p.clear(), requestAnimationFrame((A) => {
        y = A;
      });
    }), p.isFull) {
      const V = p.values();
      if (H2(V.at(-1), V.at(-3)) && !H2(V.at(-1), V.at(-2)))
        return;
    }
    const _ = w();
    _ && p.push(_.flipped);
  });
  let S = new ut({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  be(e.target, (_, V) => {
    V && !Array.isArray(V) && k.unobserve(V), Array.isArray(_) ? H2(_, V) || w() : _ && k.observe(_);
  }, {
    immediate: !0
  }), be(e.contentEl, (_, V) => {
    V && k.unobserve(V), _ && k.observe(_);
  }, {
    immediate: !0
  }), i2(() => {
    k.disconnect();
  });
  function w() {
    if (h = !1, requestAnimationFrame(() => h = !0), !e.target.value || !e.contentEl.value) return;
    (Array.isArray(e.target.value) || e.target.value.offsetParent || e.target.value.getClientRects().length) && (S = K6(e.target.value));
    const _ = _9(e.contentEl.value, e.isRtl.value), V = fr(e.contentEl.value), A = t.stickToTarget ? 0 : 12;
    V.length || (V.push(document.documentElement), e.contentEl.value.style.top && e.contentEl.value.style.left || (_.x -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-x") || 0), _.y -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-y") || 0)));
    const T = V.reduce((ae, oe) => {
      const te = ec(oe);
      return ae ? new ut({
        x: Math.max(ae.left, te.left),
        y: Math.max(ae.top, te.top),
        width: Math.min(ae.right, te.right) - Math.max(ae.left, te.left),
        height: Math.min(ae.bottom, te.bottom) - Math.max(ae.top, te.top)
      }) : te;
    }, void 0);
    t.stickToTarget ? (T.x += Math.min(0, S.x), T.y += Math.min(0, S.y), T.width = Math.max(T.width, S.x + S.width), T.height = Math.max(T.height, S.y + S.height)) : (T.x += A, T.y += A, T.width -= A * 2, T.height -= A * 2);
    let O = {
      anchor: r.value,
      origin: i.value
    };
    function Y(ae) {
      const oe = new ut(_), te = m1(ae.anchor, S), L = m1(ae.origin, oe);
      let {
        x: X,
        y: re
      } = w9(te, L);
      switch (ae.anchor.side) {
        case "top":
          re -= v.value[0];
          break;
        case "bottom":
          re += v.value[0];
          break;
        case "left":
          X -= v.value[0];
          break;
        case "right":
          X += v.value[0];
          break;
      }
      switch (ae.anchor.align) {
        case "top":
          re -= v.value[1];
          break;
        case "bottom":
          re += v.value[1];
          break;
        case "left":
          X -= v.value[1];
          break;
        case "right":
          X += v.value[1];
          break;
      }
      return oe.x += X, oe.y += re, oe.width = Math.min(oe.width, c.value), oe.height = Math.min(oe.height, f.value), {
        overflows: Ls(oe, T),
        x: X,
        y: re
      };
    }
    let F = 0, x = 0;
    const G = {
      x: 0,
      y: 0
    }, U = {
      x: !1,
      y: !1
    };
    let ee = -1;
    for (; ; ) {
      if (ee++ > 10) {
        Ar("Infinite loop detected in connectedLocationStrategy");
        break;
      }
      const {
        x: ae,
        y: oe,
        overflows: te
      } = Y(O);
      F += ae, x += oe, _.x += ae, _.y += oe;
      {
        const L = Fs(O.anchor), X = te.x.before || te.x.after, re = te.y.before || te.y.after;
        let we = !1;
        if (["x", "y"].forEach((le) => {
          if (le === "x" && X && !U.x || le === "y" && re && !U.y) {
            const ke = {
              anchor: {
                ...O.anchor
              },
              origin: {
                ...O.origin
              }
            }, fe = le === "x" ? L === "y" ? Di : Ri : L === "y" ? Ri : Di;
            ke.anchor = fe(ke.anchor), ke.origin = fe(ke.origin);
            const {
              overflows: ne
            } = Y(ke);
            (ne[le].before <= te[le].before && ne[le].after <= te[le].after || ne[le].before + ne[le].after < (te[le].before + te[le].after) / 2) && (O = ke, we = U[le] = !0);
          }
        }), we) continue;
      }
      te.x.before && (F += te.x.before, _.x += te.x.before), te.x.after && (F -= te.x.after, _.x -= te.x.after), te.y.before && (x += te.y.before, _.y += te.y.before), te.y.after && (x -= te.y.after, _.y -= te.y.after);
      {
        const L = Ls(_, T);
        G.x = T.width - L.x.before - L.x.after, G.y = T.height - L.y.before - L.y.after, F += L.x.before, _.x += L.x.before, x += L.y.before, _.y += L.y.before;
      }
      break;
    }
    const J = Fs(O.anchor);
    return Object.assign(n.value, {
      "--v-overlay-anchor-origin": `${O.anchor.side} ${O.anchor.align}`,
      transformOrigin: `${O.origin.side} ${O.origin.align}`,
      // transform: `translate(${pixelRound(x)}px, ${pixelRound(y)}px)`,
      top: Oe(Hi(x)),
      left: e.isRtl.value ? void 0 : Oe(Hi(F)),
      right: e.isRtl.value ? Oe(Hi(-F)) : void 0,
      minWidth: Oe(J === "y" ? Math.min(o.value, S.width) : o.value),
      maxWidth: Oe(g1(q2(G.x, o.value === 1 / 0 ? 0 : o.value, c.value))),
      maxHeight: Oe(g1(q2(G.y, u.value === 1 / 0 ? 0 : u.value, f.value)))
    }), {
      available: G,
      contentBox: _,
      flipped: U
    };
  }
  return be(() => [r.value, i.value, t.offset, t.minWidth, t.minHeight, t.maxWidth, t.maxHeight], () => w()), e2(() => {
    const _ = w();
    if (!_) return;
    const {
      available: V,
      contentBox: A
    } = _;
    A.height > V.y && requestAnimationFrame(() => {
      w(), requestAnimationFrame(() => {
        w();
      });
    });
  }), {
    updateLocation: w
  };
}
function Hi(e) {
  return Math.round(e * devicePixelRatio) / devicePixelRatio;
}
function g1(e) {
  return Math.ceil(e * devicePixelRatio) / devicePixelRatio;
}
let vl = !0;
const hr = [];
function V9(e) {
  !vl || hr.length ? (hr.push(e), ml()) : (vl = !1, e(), ml());
}
let h1 = -1;
function ml() {
  cancelAnimationFrame(h1), h1 = requestAnimationFrame(() => {
    const e = hr.shift();
    e && e(), hr.length ? ml() : vl = !0;
  });
}
const au = {
  none: null,
  close: A9,
  block: $9,
  reposition: T9
}, I9 = ce({
  scrollStrategy: {
    type: [String, Function],
    default: "block",
    validator: (e) => typeof e == "function" || e in au
  }
}, "VOverlay-scroll-strategies");
function E9(e, t) {
  if (!w2) return;
  let n;
  b2(async () => {
    n?.stop(), t.isActive.value && e.scrollStrategy && (n = fn(), await new Promise((a) => setTimeout(a)), n.active && n.run(() => {
      typeof e.scrollStrategy == "function" ? e.scrollStrategy(t, e, n) : au[e.scrollStrategy]?.(t, e, n);
    }));
  }), i2(() => {
    n?.stop();
  });
}
function A9(e) {
  function t(n) {
    e.isActive.value = !1;
  }
  ru(io(e.target.value, e.contentEl.value), t);
}
function $9(e, t) {
  const n = e.root.value?.offsetParent, a = io(e.target.value, e.contentEl.value), r = [.../* @__PURE__ */ new Set([...fr(a, t.contained ? n : void 0), ...fr(e.contentEl.value, t.contained ? n : void 0)])].filter((u) => !u.classList.contains("v-overlay-scroll-blocked")), i = window.innerWidth - document.documentElement.offsetWidth, o = ((u) => ql(u) && u)(n || document.documentElement);
  o && e.root.value.classList.add("v-overlay--scroll-blocked"), r.forEach((u, c) => {
    u.style.setProperty("--v-body-scroll-x", Oe(-u.scrollLeft)), u.style.setProperty("--v-body-scroll-y", Oe(-u.scrollTop)), u !== document.documentElement && u.style.setProperty("--v-scrollbar-offset", Oe(i)), u.classList.add("v-overlay-scroll-blocked");
  }), i2(() => {
    r.forEach((u, c) => {
      const f = parseFloat(u.style.getPropertyValue("--v-body-scroll-x")), v = parseFloat(u.style.getPropertyValue("--v-body-scroll-y")), h = u.style.scrollBehavior;
      u.style.scrollBehavior = "auto", u.style.removeProperty("--v-body-scroll-x"), u.style.removeProperty("--v-body-scroll-y"), u.style.removeProperty("--v-scrollbar-offset"), u.classList.remove("v-overlay-scroll-blocked"), u.scrollLeft = -f, u.scrollTop = -v, u.style.scrollBehavior = h;
    }), o && e.root.value.classList.remove("v-overlay--scroll-blocked");
  });
}
function T9(e, t, n) {
  let a = !1, r = -1, i = -1;
  function o(u) {
    V9(() => {
      const c = performance.now();
      e.updateLocation.value?.(u), a = (performance.now() - c) / (1e3 / 60) > 2;
    });
  }
  i = (typeof requestIdleCallback > "u" ? (u) => u() : requestIdleCallback)(() => {
    n.run(() => {
      ru(io(e.target.value, e.contentEl.value), (u) => {
        a ? (cancelAnimationFrame(r), r = requestAnimationFrame(() => {
          r = requestAnimationFrame(() => {
            o(u);
          });
        })) : o(u);
      });
    });
  }), i2(() => {
    typeof cancelIdleCallback < "u" && cancelIdleCallback(i), cancelAnimationFrame(r);
  });
}
function io(e, t) {
  return Array.isArray(e) ? document.elementsFromPoint(...e).find((n) => !t?.contains(n)) : e ?? t;
}
function ru(e, t) {
  const n = [document, ...fr(e)];
  n.forEach((a) => {
    a.addEventListener("scroll", t, {
      passive: !0
    });
  }), i2(() => {
    n.forEach((a) => {
      a.removeEventListener("scroll", t);
    });
  });
}
const gl = /* @__PURE__ */ Symbol.for("vuetify:v-menu"), iu = ce({
  closeDelay: [Number, String],
  openDelay: [Number, String]
}, "delay");
function lu(e, t) {
  let n = () => {
  };
  function a(o, u) {
    n?.();
    const c = o ? e.openDelay : e.closeDelay, f = Math.max(u?.minDelay ?? 0, Number(c ?? 0));
    return new Promise((v) => {
      n = H3(f, () => {
        t?.(o), v(o);
      });
    });
  }
  function r() {
    return a(!0);
  }
  function i(o) {
    return a(!1, o);
  }
  return {
    clearDelay: n,
    runOpenDelay: r,
    runCloseDelay: i
  };
}
const O9 = ce({
  target: [String, Object],
  activator: [String, Object],
  activatorProps: {
    type: Object,
    default: () => ({})
  },
  openOnClick: {
    type: Boolean,
    default: void 0
  },
  openOnHover: Boolean,
  openOnFocus: {
    type: Boolean,
    default: void 0
  },
  closeOnContentClick: Boolean,
  ...iu()
}, "VOverlay-activator");
function F9(e, t) {
  let {
    isActive: n,
    isTop: a,
    contentEl: r
  } = t;
  const i = x2("useActivator"), o = se();
  let u = !1, c = !1, f = !0;
  const v = E(() => e.openOnFocus || e.openOnFocus == null && e.openOnHover), h = E(() => e.openOnClick || e.openOnClick == null && !e.openOnHover && !v.value), {
    runOpenDelay: y,
    runCloseDelay: p
  } = lu(e, (x) => {
    x === (e.openOnHover && u || v.value && c) && !(e.openOnHover && n.value && !a.value) && (n.value !== x && (f = !0), n.value = x);
  }), k = se(), S = {
    onClick: (x) => {
      x.stopPropagation(), o.value = x.currentTarget || x.target, n.value || (k.value = [x.clientX, x.clientY]), n.value = !n.value;
    },
    onMouseenter: (x) => {
      u = !0, o.value = x.currentTarget || x.target, y();
    },
    onMouseleave: (x) => {
      u = !1, p();
    },
    onFocus: (x) => {
      cr(x.target, ":focus-visible") !== !1 && (c = !0, x.stopPropagation(), o.value = x.currentTarget || x.target, y());
    },
    onBlur: (x) => {
      c = !1, x.stopPropagation(), p({
        minDelay: 1
      });
    }
  }, w = E(() => {
    const x = {};
    return h.value && (x.onClick = S.onClick), e.openOnHover && (x.onMouseenter = S.onMouseenter, x.onMouseleave = S.onMouseleave), v.value && (x.onFocus = S.onFocus, x.onBlur = S.onBlur), x;
  }), _ = E(() => {
    const x = {};
    if (e.openOnHover && (x.onMouseenter = () => {
      u = !0, y();
    }, x.onMouseleave = () => {
      u = !1, p();
    }), v.value && (x.onFocusin = (G) => {
      G.target.matches(":focus-visible") && (c = !0, y());
    }, x.onFocusout = () => {
      c = !1, p({
        minDelay: 1
      });
    }), e.closeOnContentClick) {
      const G = We(gl, null);
      x.onClick = () => {
        n.value = !1, G?.closeParents();
      };
    }
    return x;
  }), V = E(() => {
    const x = {};
    return e.openOnHover && (x.onMouseenter = () => {
      f && (u = !0, f = !1, y());
    }, x.onMouseleave = () => {
      u = !1, p();
    }), x;
  });
  be(a, (x) => {
    x && (e.openOnHover && !u && (!v.value || !c) || v.value && !c && (!e.openOnHover || !u)) && !r.value?.contains(document.activeElement) && (n.value = !1);
  }), be(n, (x) => {
    x || setTimeout(() => {
      k.value = void 0;
    });
  }, {
    flush: "post"
  });
  const A = ll();
  b2(() => {
    A.value && e2(() => {
      o.value = A.el;
    });
  });
  const T = ll(), O = E(() => e.target === "cursor" && k.value ? k.value : T.value ? T.el : ou(e.target, i) || o.value), Y = E(() => Array.isArray(O.value) ? void 0 : O.value);
  let F;
  return be(() => !!e.activator, (x) => {
    x && w2 ? (F = fn(), F.run(() => {
      L9(e, i, {
        activatorEl: o,
        activatorEvents: w
      });
    })) : F && F.stop();
  }, {
    flush: "post",
    immediate: !0
  }), i2(() => {
    F?.stop();
  }), {
    activatorEl: o,
    activatorRef: A,
    target: O,
    targetEl: Y,
    targetRef: T,
    activatorEvents: w,
    contentEvents: _,
    scrimEvents: V
  };
}
function L9(e, t, n) {
  let {
    activatorEl: a,
    activatorEvents: r
  } = n;
  be(() => e.activator, (c, f) => {
    if (f && c !== f) {
      const v = u(f);
      v && o(v);
    }
    c && e2(() => i());
  }, {
    immediate: !0
  }), be(() => e.activatorProps, () => {
    i();
  }), i2(() => {
    o();
  });
  function i() {
    let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : u(), f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
    c && tc(c, me(r.value, f));
  }
  function o() {
    let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : u(), f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
    c && nc(c, me(r.value, f));
  }
  function u() {
    let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : e.activator;
    const f = ou(c, t);
    return a.value = f?.nodeType === Node.ELEMENT_NODE ? f : void 0, a.value;
  }
}
function ou(e, t) {
  if (!e) return;
  let n;
  if (e === "parent") {
    let a = t?.proxy?.$el?.parentNode;
    for (; a?.hasAttribute("data-no-activator"); )
      a = a.parentNode;
    n = a;
  } else typeof e == "string" ? n = document.querySelector(e) : "$el" in e ? n = e.$el : n = e;
  return n;
}
function B9() {
  if (!w2) return Ve(!1);
  const {
    ssr: e
  } = B0();
  if (e) {
    const t = Ve(!1);
    return yt(() => {
      t.value = !0;
    }), t;
  } else
    return Ve(!0);
}
const lo = ce({
  eager: Boolean
}, "lazy");
function oo(e, t) {
  const n = Ve(!1), a = R(() => n.value || e.eager || t.value);
  be(t, () => n.value = !0);
  function r() {
    e.eager || (n.value = !1);
  }
  return {
    isBooted: n,
    hasContent: a,
    onAfterLeave: r
  };
}
function so() {
  const t = x2("useScopeId").vnode.scopeId;
  return {
    scopeId: t ? {
      [t]: ""
    } : void 0
  };
}
const y1 = /* @__PURE__ */ Symbol.for("vuetify:stack"), Tn = ct([]);
function M9(e, t, n) {
  const a = x2("useStack"), r = !n, i = We(y1, void 0), o = ct({
    activeChildren: /* @__PURE__ */ new Set()
  });
  c2(y1, o);
  const u = Ve(Number(u2(t)));
  o0(e, () => {
    const v = Tn.at(-1)?.[1];
    u.value = v ? v + 10 : Number(u2(t)), r && Tn.push([a.uid, u.value]), i?.activeChildren.add(a.uid), i2(() => {
      if (r) {
        const h = m2(Tn).findIndex((y) => y[0] === a.uid);
        Tn.splice(h, 1);
      }
      i?.activeChildren.delete(a.uid);
    });
  });
  const c = Ve(!0);
  r && b2(() => {
    const v = Tn.at(-1)?.[0] === a.uid;
    setTimeout(() => c.value = v);
  });
  const f = R(() => !o.activeChildren.size);
  return {
    globalTop: ia(c),
    localTop: f,
    stackStyles: R(() => ({
      zIndex: u.value
    }))
  };
}
function R9(e) {
  return {
    teleportTarget: E(() => {
      const n = e();
      if (n === !0 || !w2) return;
      const a = n === !1 ? document.body : typeof n == "string" ? document.querySelector(n) : n;
      if (a == null) {
        F0(`Unable to locate target ${n}`);
        return;
      }
      let r = [...a.children].find((i) => i.matches(".v-overlay-container"));
      return r || (r = document.createElement("div"), r.className = "v-overlay-container", a.appendChild(r)), r;
    })
  };
}
function D9() {
  return !0;
}
function su(e, t, n) {
  if (!e || uu(e, n) === !1) return !1;
  const a = q6(t);
  if (typeof ShadowRoot < "u" && a instanceof ShadowRoot && a.host === e.target) return !1;
  const r = (typeof n.value == "object" && n.value.include || (() => []))();
  return r.push(t), !r.some((i) => i?.contains(e.target));
}
function uu(e, t) {
  return (typeof t.value == "object" && t.value.closeConditional || D9)(e);
}
function N9(e, t, n) {
  const a = typeof n.value == "function" ? n.value : n.value.handler;
  e.shadowTarget = e.target, t._clickOutside.lastMousedownWasOutside && su(e, t, n) && setTimeout(() => {
    uu(e, n) && a && a(e);
  }, 0);
}
function C1(e, t) {
  const n = q6(e);
  t(document), typeof ShadowRoot < "u" && n instanceof ShadowRoot && t(n);
}
const p1 = {
  // [data-app] may not be found
  // if using bind, inserted makes
  // sure that the root element is
  // available, iOS does not support
  // clicks on body
  mounted(e, t) {
    const n = (r) => N9(r, e, t), a = (r) => {
      e._clickOutside.lastMousedownWasOutside = su(r, e, t);
    };
    C1(e, (r) => {
      r.addEventListener("click", n, !0), r.addEventListener("mousedown", a, !0);
    }), e._clickOutside || (e._clickOutside = {
      lastMousedownWasOutside: !1
    }), e._clickOutside[t.instance.$.uid] = {
      onClick: n,
      onMousedown: a
    };
  },
  beforeUnmount(e, t) {
    e._clickOutside && (C1(e, (n) => {
      if (!n || !e._clickOutside?.[t.instance.$.uid]) return;
      const {
        onClick: a,
        onMousedown: r
      } = e._clickOutside[t.instance.$.uid];
      n.removeEventListener("click", a, !0), n.removeEventListener("mousedown", r, !0);
    }), delete e._clickOutside[t.instance.$.uid]);
  }
};
function z9(e) {
  const {
    modelValue: t,
    color: n,
    ...a
  } = e;
  return g(G2, {
    name: "fade-transition",
    appear: !0
  }, {
    default: () => [e.modelValue && I("div", me({
      class: ["v-overlay__scrim", e.color.backgroundColorClasses.value],
      style: e.color.backgroundColorStyles.value
    }, a), null)]
  });
}
const cu = ce({
  absolute: Boolean,
  attach: [Boolean, String, Object],
  closeOnBack: {
    type: Boolean,
    default: !0
  },
  contained: Boolean,
  contentClass: null,
  contentProps: null,
  disabled: Boolean,
  opacity: [Number, String],
  noClickAnimation: Boolean,
  modelValue: Boolean,
  persistent: Boolean,
  scrim: {
    type: [Boolean, String],
    default: !0
  },
  zIndex: {
    type: [Number, String],
    default: 2e3
  },
  ...O9(),
  ...qe(),
  ...Ct(),
  ...lo(),
  ...x9(),
  ...I9(),
  ...y2(),
  ...sa()
}, "VOverlay"), b1 = Ae()({
  name: "VOverlay",
  directives: {
    vClickOutside: p1
  },
  inheritAttrs: !1,
  props: {
    _disableGlobalStack: Boolean,
    ...cu()
  },
  emits: {
    "click:outside": (e) => !0,
    "update:modelValue": (e) => !0,
    keydown: (e) => !0,
    afterEnter: () => !0,
    afterLeave: () => !0
  },
  setup(e, t) {
    let {
      slots: n,
      attrs: a,
      emit: r
    } = t;
    const i = x2("VOverlay"), o = se(), u = se(), c = se(), f = r2(e, "modelValue"), v = E({
      get: () => f.value,
      set: (de) => {
        de && e.disabled || (f.value = de);
      }
    }), {
      themeClasses: h
    } = V2(e), {
      rtlClasses: y,
      isRtl: p
    } = xt(), {
      hasContent: k,
      onAfterLeave: S
    } = oo(e, v), w = at(() => typeof e.scrim == "string" ? e.scrim : null), {
      globalTop: _,
      localTop: V,
      stackStyles: A
    } = M9(v, () => e.zIndex, e._disableGlobalStack), {
      activatorEl: T,
      activatorRef: O,
      target: Y,
      targetEl: F,
      targetRef: x,
      activatorEvents: G,
      contentEvents: U,
      scrimEvents: ee
    } = F9(e, {
      isActive: v,
      isTop: V,
      contentEl: c
    }), {
      teleportTarget: J
    } = R9(() => {
      const de = e.attach || e.contained;
      if (de) return de;
      const Be = T?.value?.getRootNode() || i.proxy?.$el?.getRootNode();
      return Be instanceof ShadowRoot ? Be : !1;
    }), {
      dimensionStyles: ae
    } = pt(e), oe = B9(), {
      scopeId: te
    } = so();
    be(() => e.disabled, (de) => {
      de && (v.value = !1);
    });
    const {
      contentStyles: L,
      updateLocation: X
    } = S9(e, {
      isRtl: p,
      contentEl: c,
      target: Y,
      isActive: v
    });
    E9(e, {
      root: o,
      contentEl: c,
      targetEl: F,
      target: Y,
      isActive: v,
      updateLocation: X
    });
    function re(de) {
      r("click:outside", de), e.persistent ? Pe() : v.value = !1;
    }
    function we(de) {
      return v.value && _.value && // If using scrim, only close if clicking on it rather than anything opened on top
      (!e.scrim || de.target === u.value || de instanceof MouseEvent && de.shadowTarget === u.value);
    }
    w2 && be(v, (de) => {
      de ? window.addEventListener("keydown", le) : window.removeEventListener("keydown", le);
    }, {
      immediate: !0
    }), W2(() => {
      w2 && window.removeEventListener("keydown", le);
    });
    function le(de) {
      de.key === "Escape" && _.value && (c.value?.contains(document.activeElement) || r("keydown", de), e.persistent ? Pe() : (v.value = !1, c.value?.contains(document.activeElement) && T.value?.focus()));
    }
    function ke(de) {
      de.key === "Escape" && !_.value || r("keydown", de);
    }
    const fe = Uc();
    o0(() => e.closeOnBack, () => {
      Gc(fe, (de) => {
        _.value && v.value ? (de(!1), e.persistent ? Pe() : v.value = !1) : de();
      });
    });
    const ne = se();
    be(() => v.value && (e.absolute || e.contained) && J.value == null, (de) => {
      if (de) {
        const Be = Wl(o.value);
        Be && Be !== document.scrollingElement && (ne.value = Be.scrollTop);
      }
    });
    function Pe() {
      e.noClickAnimation || c.value && Mt(c.value, [{
        transformOrigin: "center"
      }, {
        transform: "scale(1.03)"
      }, {
        transformOrigin: "center"
      }], {
        duration: 150,
        easing: Hn
      });
    }
    function Re() {
      r("afterEnter");
    }
    function De() {
      S(), r("afterLeave");
    }
    return Fe(() => I(je, null, [n.activator?.({
      isActive: v.value,
      targetRef: x,
      props: me({
        ref: O
      }, G.value, e.activatorProps)
    }), oe.value && k.value && g(_6, {
      disabled: !J.value,
      to: J.value
    }, {
      default: () => [I("div", me({
        class: ["v-overlay", {
          "v-overlay--absolute": e.absolute || e.contained,
          "v-overlay--active": v.value,
          "v-overlay--contained": e.contained
        }, h.value, y.value, e.class],
        style: [A.value, {
          "--v-overlay-opacity": e.opacity,
          top: Oe(ne.value)
        }, e.style],
        ref: o,
        onKeydown: ke
      }, te, a), [g(z9, me({
        color: w,
        modelValue: v.value && !!e.scrim,
        ref: u
      }, ee.value), null), g(Nt, {
        appear: !0,
        persisted: !0,
        transition: e.transition,
        target: Y.value,
        onAfterEnter: Re,
        onAfterLeave: De
      }, {
        default: () => [g2(I("div", me({
          ref: c,
          class: ["v-overlay__content", e.contentClass],
          style: [ae.value, L.value]
        }, U.value, e.contentProps), [n.default?.({
          isActive: v
        })]), [[dt, v.value], [p1, {
          handler: re,
          closeConditional: we,
          include: () => [T.value]
        }]])]
      })])]
    })])), {
      activatorEl: T,
      scrimEl: u,
      target: Y,
      animateClick: Pe,
      contentEl: c,
      rootEl: o,
      globalTop: _,
      localTop: V,
      updateLocation: X
    };
  }
}), j9 = ce({
  // TODO
  // disableKeys: Boolean,
  id: String,
  submenu: Boolean,
  disableInitialFocus: Boolean,
  ...qt(cu({
    closeDelay: 250,
    closeOnContentClick: !0,
    locationStrategy: "connected",
    location: void 0,
    openDelay: 300,
    scrim: !1,
    scrollStrategy: "reposition",
    transition: {
      component: w5
    }
  }), ["absolute"])
}, "VMenu"), K9 = Ae()({
  name: "VMenu",
  props: j9(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = r2(e, "modelValue"), {
      scopeId: r
    } = so(), {
      isRtl: i
    } = xt(), o = Y2(), u = R(() => e.id || `v-menu-${o}`), c = se(), f = We(gl, null), v = Ve(/* @__PURE__ */ new Set());
    c2(gl, {
      register() {
        v.value.add(o);
      },
      unregister() {
        v.value.delete(o);
      },
      closeParents(A) {
        setTimeout(() => {
          !v.value.size && !e.persistent && (A == null || c.value?.contentEl && !U3(A, c.value.contentEl)) && (a.value = !1, f?.closeParents());
        }, 40);
      }
    }), W2(() => {
      f?.unregister(), document.removeEventListener("focusin", k);
    }), v3(() => a.value = !1);
    let h = !1, y = -1;
    async function p() {
      h = !0, y = window.setTimeout(() => {
        h = !1;
      }, 100);
    }
    async function k(A) {
      const T = A.relatedTarget, O = A.target;
      await e2(), a.value && T !== O && c.value?.rootEl && c.value?.contentEl && // We're the menu without open submenus or overlays
      c.value?.localTop && // It isn't the document or the menu body
      ![document, c.value.rootEl].includes(O) && // It isn't inside the menu body
      !c.value.rootEl.contains(O) && (h ? !e.openOnHover && !c.value.activatorEl?.contains(O) && (a.value = !1) : (ur(c.value.contentEl)[0]?.focus(), document.removeEventListener("pointerdown", p)));
    }
    be(a, (A) => {
      A ? (f?.register(), w2 && !e.disableInitialFocus && (document.addEventListener("pointerdown", p), document.addEventListener("focusin", k, {
        once: !0
      }))) : (f?.unregister(), w2 && (clearTimeout(y), document.removeEventListener("pointerdown", p), document.removeEventListener("focusin", k)));
    }, {
      immediate: !0
    });
    function S(A) {
      f?.closeParents(A);
    }
    function w(A) {
      if (!e.disabled)
        if (A.key === "Tab" || A.key === "Enter" && !e.closeOnContentClick) {
          if (A.key === "Enter" && (A.target instanceof HTMLTextAreaElement || A.target instanceof HTMLInputElement && A.target.closest("form"))) return;
          A.key === "Enter" && A.preventDefault(), N6(ur(c.value?.contentEl, !1), A.shiftKey ? "prev" : "next", (O) => O.tabIndex >= 0) || (a.value = !1, c.value?.activatorEl?.focus());
        } else e.submenu && A.key === (i.value ? "ArrowRight" : "ArrowLeft") && (a.value = !1, c.value?.activatorEl?.focus());
    }
    function _(A) {
      if (e.disabled) return;
      const T = c.value?.contentEl;
      T && a.value ? A.key === "ArrowDown" ? (A.preventDefault(), A.stopImmediatePropagation(), zn(T, "next")) : A.key === "ArrowUp" ? (A.preventDefault(), A.stopImmediatePropagation(), zn(T, "prev")) : e.submenu && (A.key === (i.value ? "ArrowRight" : "ArrowLeft") ? a.value = !1 : A.key === (i.value ? "ArrowLeft" : "ArrowRight") && (A.preventDefault(), zn(T, "first"))) : (e.submenu ? A.key === (i.value ? "ArrowLeft" : "ArrowRight") : ["ArrowDown", "ArrowUp"].includes(A.key)) && (a.value = !0, A.preventDefault(), setTimeout(() => setTimeout(() => _(A))));
    }
    const V = E(() => me({
      "aria-haspopup": "menu",
      "aria-expanded": String(a.value),
      "aria-controls": u.value,
      "aria-owns": u.value,
      onKeydown: _
    }, e.activatorProps));
    return Fe(() => {
      const A = b1.filterProps(e);
      return g(b1, me({
        ref: c,
        id: u.value,
        class: ["v-menu", e.class],
        style: e.style
      }, A, {
        modelValue: a.value,
        "onUpdate:modelValue": (T) => a.value = T,
        absolute: !0,
        activatorProps: V.value,
        location: e.location ?? (e.submenu ? "end" : "bottom"),
        "onClick:outside": S,
        onKeydown: w
      }, r), {
        activator: n.activator,
        default: function() {
          for (var T = arguments.length, O = new Array(T), Y = 0; Y < T; Y++)
            O[Y] = arguments[Y];
          return g(k2, {
            root: "VMenu"
          }, {
            default: () => [n.default?.(...O)]
          });
        }
      });
    }), va({
      id: u,
      ΨopenChildren: v
    }, c);
  }
}), W9 = ce({
  renderless: Boolean,
  ...qe()
}, "VVirtualScrollItem"), q9 = Ae()({
  name: "VVirtualScrollItem",
  inheritAttrs: !1,
  props: W9(),
  emits: {
    "update:height": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      emit: a,
      slots: r
    } = t;
    const {
      resizeRef: i,
      contentRect: o
    } = T0(void 0, "border");
    be(() => o.value?.height, (u) => {
      u != null && a("update:height", u);
    }), Fe(() => e.renderless ? I(je, null, [r.default?.({
      itemRef: i
    })]) : I("div", me({
      ref: i,
      class: ["v-virtual-scroll__item", e.class],
      style: e.style
    }, n), [r.default?.()]));
  }
}), H9 = -1, U9 = 1, Ui = 100, G9 = ce({
  itemHeight: {
    type: [Number, String],
    default: null
  },
  itemKey: {
    type: [String, Array, Function],
    default: null
  },
  height: [Number, String]
}, "virtual");
function Z9(e, t) {
  const n = B0(), a = Ve(0);
  b2(() => {
    a.value = parseFloat(e.itemHeight || 0);
  });
  const r = Ve(0), i = Ve(Math.ceil(
    // Assume 16px items filling the entire screen height if
    // not provided. This is probably incorrect but it minimises
    // the chance of ending up with empty space at the bottom.
    // The default value is set here to avoid poisoning getSize()
    (parseInt(e.height) || n.height.value) / (a.value || 16)
  ) || 1), o = Ve(0), u = Ve(0), c = se(), f = se();
  let v = 0;
  const {
    resizeRef: h,
    contentRect: y
  } = T0();
  b2(() => {
    h.value = c.value;
  });
  const p = E(() => c.value === document.documentElement ? n.height.value : y.value?.height || parseInt(e.height) || 0), k = E(() => !!(c.value && f.value && p.value && a.value));
  let S = Array.from({
    length: t.value.length
  }), w = Array.from({
    length: t.value.length
  });
  const _ = Ve(0);
  let V = -1;
  function A(le) {
    return S[le] || a.value;
  }
  const T = K3(() => {
    const le = performance.now();
    w[0] = 0;
    const ke = t.value.length;
    for (let fe = 1; fe <= ke; fe++)
      w[fe] = (w[fe - 1] || 0) + A(fe - 1);
    _.value = Math.max(_.value, performance.now() - le);
  }, _), O = be(k, (le) => {
    le && (O(), v = f.value.offsetTop, T.immediate(), L(), ~V && e2(() => {
      w2 && window.requestAnimationFrame(() => {
        re(V), V = -1;
      });
    }));
  });
  i2(() => {
    T.clear();
  });
  function Y(le, ke) {
    const fe = S[le], ne = a.value;
    a.value = ne ? Math.min(a.value, ke) : ke, (fe !== ke || ne !== a.value) && (S[le] = ke, T());
  }
  function F(le) {
    le = q2(le, 0, t.value.length);
    const ke = Math.floor(le), fe = le % 1, ne = ke + 1, Pe = w[ke] || 0, Re = w[ne] || Pe;
    return Pe + (Re - Pe) * fe;
  }
  function x(le) {
    return Y9(w, le);
  }
  let G = 0, U = 0, ee = 0;
  be(p, (le, ke) => {
    ke && (L(), le < ke && requestAnimationFrame(() => {
      U = 0, L();
    }));
  });
  let J = -1;
  function ae() {
    if (!c.value || !f.value) return;
    const le = c.value.scrollTop, ke = performance.now();
    ke - ee > 500 ? (U = Math.sign(le - G), v = f.value.offsetTop) : U = le - G, G = le, ee = ke, window.clearTimeout(J), J = window.setTimeout(oe, 500), L();
  }
  function oe() {
    !c.value || !f.value || (U = 0, ee = 0, window.clearTimeout(J), L());
  }
  let te = -1;
  function L() {
    cancelAnimationFrame(te), te = requestAnimationFrame(X);
  }
  function X() {
    if (!c.value || !p.value || !a.value) return;
    const le = G - v, ke = Math.sign(U), fe = Math.max(0, le - Ui), ne = q2(x(fe), 0, t.value.length), Pe = le + p.value + Ui, Re = q2(x(Pe) + 1, ne + 1, t.value.length);
    if (
      // Only update the side we're scrolling towards,
      // the other side will be updated incidentally
      (ke !== H9 || ne < r.value) && (ke !== U9 || Re > i.value)
    ) {
      const De = F(r.value) - F(ne), de = F(Re) - F(i.value);
      Math.max(De, de) > Ui ? (r.value = ne, i.value = Re) : (ne <= 0 && (r.value = ne), Re >= t.value.length && (i.value = Re));
    }
    o.value = F(r.value), u.value = F(t.value.length) - F(i.value);
  }
  function re(le) {
    const ke = F(le);
    !c.value || le && !ke ? V = le : c.value.scrollTop = ke;
  }
  const we = E(() => t.value.slice(r.value, i.value).map((le, ke) => {
    const fe = ke + r.value;
    return {
      raw: le,
      index: fe,
      key: N2(le, e.itemKey, fe)
    };
  }));
  return be(t, () => {
    S = Array.from({
      length: t.value.length
    }), w = Array.from({
      length: t.value.length
    }), T.immediate(), L();
  }, {
    deep: 1
  }), {
    calculateVisibleItems: L,
    containerRef: c,
    markerRef: f,
    computedItems: we,
    paddingTop: o,
    paddingBottom: u,
    scrollToIndex: re,
    handleScroll: ae,
    handleScrollend: oe,
    handleItemResize: Y
  };
}
function Y9(e, t) {
  let n = e.length - 1, a = 0, r = 0, i = null, o = -1;
  if (e[n] < t)
    return n;
  for (; a <= n; )
    if (r = a + n >> 1, i = e[r], i > t)
      n = r - 1;
    else if (i < t)
      o = r, a = r + 1;
    else return i === t ? r : a;
  return o;
}
const X9 = ce({
  items: {
    type: Array,
    default: () => []
  },
  renderless: Boolean,
  ...G9(),
  ...qe(),
  ...Ct()
}, "VVirtualScroll"), Q9 = Ae()({
  name: "VVirtualScroll",
  props: X9(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = x2("VVirtualScroll"), {
      dimensionStyles: r
    } = pt(e), {
      calculateVisibleItems: i,
      containerRef: o,
      markerRef: u,
      handleScroll: c,
      handleScrollend: f,
      handleItemResize: v,
      scrollToIndex: h,
      paddingTop: y,
      paddingBottom: p,
      computedItems: k
    } = Z9(e, R(() => e.items));
    return o0(() => e.renderless, () => {
      function S() {
        const _ = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1) ? "addEventListener" : "removeEventListener";
        o.value === document.documentElement ? (document[_]("scroll", c, {
          passive: !0
        }), document[_]("scrollend", f)) : (o.value?.[_]("scroll", c, {
          passive: !0
        }), o.value?.[_]("scrollend", f));
      }
      yt(() => {
        o.value = Wl(a.vnode.el, !0), S(!0);
      }), i2(S);
    }), Fe(() => {
      const S = k.value.map((w) => g(q9, {
        key: w.key,
        renderless: e.renderless,
        "onUpdate:height": (_) => v(w.index, _)
      }, {
        default: (_) => n.default?.({
          item: w.raw,
          index: w.index,
          ..._
        })
      }));
      return e.renderless ? I(je, null, [I("div", {
        ref: u,
        class: "v-virtual-scroll__spacer",
        style: {
          paddingTop: Oe(y.value)
        }
      }, null), S, I("div", {
        class: "v-virtual-scroll__spacer",
        style: {
          paddingBottom: Oe(p.value)
        }
      }, null)]) : I("div", {
        ref: o,
        class: ve(["v-virtual-scroll", e.class]),
        onScrollPassive: c,
        onScrollend: f,
        style: Ee([r.value, e.style])
      }, [I("div", {
        ref: u,
        class: "v-virtual-scroll__container",
        style: {
          paddingTop: Oe(y.value),
          paddingBottom: Oe(p.value)
        }
      }, [S])]);
    }), {
      calculateVisibleItems: i,
      scrollToIndex: h
    };
  }
});
function J9(e, t) {
  const n = Ve(!1);
  let a;
  function r(u) {
    cancelAnimationFrame(a), n.value = !0, a = requestAnimationFrame(() => {
      a = requestAnimationFrame(() => {
        n.value = !1;
      });
    });
  }
  async function i() {
    await new Promise((u) => requestAnimationFrame(u)), await new Promise((u) => requestAnimationFrame(u)), await new Promise((u) => requestAnimationFrame(u)), await new Promise((u) => {
      if (n.value) {
        const c = be(n, () => {
          c(), u();
        });
      } else u();
    });
  }
  async function o(u) {
    if (u.key === "Tab" && t.value?.focus(), !["PageDown", "PageUp", "Home", "End"].includes(u.key)) return;
    const c = e.value?.$el;
    if (!c) return;
    (u.key === "Home" || u.key === "End") && c.scrollTo({
      top: u.key === "Home" ? 0 : c.scrollHeight,
      behavior: "smooth"
    }), await i();
    const f = c.querySelectorAll(":scope > :not(.v-virtual-scroll__spacer)");
    if (u.key === "PageDown" || u.key === "Home") {
      const v = c.getBoundingClientRect().top;
      for (const h of f)
        if (h.getBoundingClientRect().top >= v) {
          h.focus();
          break;
        }
    } else {
      const v = c.getBoundingClientRect().bottom;
      for (const h of [...f].reverse())
        if (h.getBoundingClientRect().bottom <= v) {
          h.focus();
          break;
        }
    }
  }
  return {
    onScrollPassive: r,
    onKeydown: o
  };
}
const ed = ce({
  closeText: {
    type: String,
    default: "$vuetify.close"
  },
  openText: {
    type: String,
    default: "$vuetify.open"
  }
}, "autocomplete");
function td(e, t) {
  const {
    t: n
  } = wt(), a = Y2(), r = E(() => `menu-${a}`), i = R(() => u2(t)), o = R(() => r.value), u = R(() => n(u2(t) ? e.closeText : e.openText));
  return {
    menuId: r,
    ariaExpanded: i,
    ariaControls: o,
    ariaLabel: u
  };
}
const nd = ce({
  chips: Boolean,
  closableChips: Boolean,
  eager: Boolean,
  hideNoData: Boolean,
  hideSelected: Boolean,
  listProps: {
    type: Object
  },
  menu: Boolean,
  menuIcon: {
    type: Ke,
    default: "$dropdown"
  },
  menuProps: {
    type: Object
  },
  multiple: Boolean,
  noDataText: {
    type: String,
    default: "$vuetify.noDataText"
  },
  openOnClear: Boolean,
  itemColor: String,
  noAutoScroll: Boolean,
  ...ed(),
  ...q5({
    itemChildren: !1
  })
}, "Select"), ad = ce({
  ...nd(),
  ...qt(O5({
    modelValue: null,
    role: "combobox"
  }), ["validationValue", "dirty", "appendInnerIcon"]),
  ...sa({
    transition: {
      component: w5
    }
  })
}, "VSelect"), mt = Ae()({
  name: "VSelect",
  props: ad(),
  emits: {
    "update:focused": (e) => !0,
    "update:modelValue": (e) => !0,
    "update:menu": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      t: a
    } = wt(), r = se(), i = se(), o = se(), {
      items: u,
      transformIn: c,
      transformOut: f
    } = a9(e), v = r2(e, "modelValue", [], (ne) => c(ne === null ? [null] : $2(ne)), (ne) => {
      const Pe = f(ne);
      return e.multiple ? Pe : Pe[0] ?? null;
    }), h = E(() => typeof e.counterValue == "function" ? e.counterValue(v.value) : typeof e.counterValue == "number" ? e.counterValue : v.value.length), y = $5(e), p = E(() => v.value.map((ne) => ne.value)), k = Ve(!1);
    let S = "", w = -1, _;
    const V = E(() => e.hideSelected ? u.value.filter((ne) => !v.value.some((Pe) => (e.valueComparator || H2)(Pe, ne))) : u.value), A = E(() => e.hideNoData && !V.value.length || y.isReadonly.value || y.isDisabled.value), T = r2(e, "menu"), O = E({
      get: () => T.value,
      set: (ne) => {
        T.value && !ne && i.value?.ΨopenChildren.size || ne && A.value || (T.value = ne);
      }
    }), {
      menuId: Y,
      ariaExpanded: F,
      ariaControls: x,
      ariaLabel: G
    } = td(e, O), U = E(() => ({
      ...e.menuProps,
      activatorProps: {
        ...e.menuProps?.activatorProps || {},
        "aria-haspopup": "listbox"
        // Set aria-haspopup to 'listbox'
      }
    })), ee = se(), J = J9(ee, r);
    function ae(ne) {
      e.openOnClear && (O.value = !0);
    }
    function oe() {
      A.value || (O.value = !O.value);
    }
    function te(ne) {
      $s(ne) && L(ne);
    }
    function L(ne) {
      if (!ne.key || y.isReadonly.value) return;
      ["Enter", " ", "ArrowDown", "ArrowUp", "Home", "End"].includes(ne.key) && ne.preventDefault(), ["Enter", "ArrowDown", " "].includes(ne.key) && (O.value = !0), ["Escape", "Tab"].includes(ne.key) && (O.value = !1), ne.key === "Home" ? ee.value?.focus("first") : ne.key === "End" && ee.value?.focus("last");
      const Pe = 1e3;
      if (!$s(ne)) return;
      const Re = performance.now();
      Re - _ > Pe && (S = "", w = -1), S += ne.key.toLowerCase(), _ = Re;
      const De = V.value;
      function de() {
        let Me = Be();
        return Me || S.at(-1) === S.at(-2) && (S = S.slice(0, -1), Me = Be(), Me) || (w = -1, Me = Be(), Me) ? Me : (S = ne.key.toLowerCase(), Be());
      }
      function Be() {
        for (let Me = w + 1; Me < De.length; Me++) {
          const _2 = De[Me];
          if (_2.title.toLowerCase().startsWith(S))
            return [_2, Me];
        }
      }
      const ye = de();
      if (!ye) return;
      const [f2, F2] = ye;
      w = F2, ee.value?.focus(F2), e.multiple || (v.value = [f2]);
    }
    function X(ne) {
      let Pe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
      if (!ne.props.disabled)
        if (e.multiple) {
          const Re = v.value.findIndex((de) => (e.valueComparator || H2)(de.value, ne.value)), De = Pe ?? !~Re;
          if (~Re) {
            const de = De ? [...v.value, ne] : [...v.value];
            de.splice(Re, 1), v.value = de;
          } else De && (v.value = [...v.value, ne]);
        } else {
          const Re = Pe !== !1;
          v.value = Re ? [ne] : [], e2(() => {
            O.value = !1;
          });
        }
    }
    function re(ne) {
      ee.value?.$el.contains(ne.relatedTarget) || (O.value = !1);
    }
    function we() {
      e.eager && o.value?.calculateVisibleItems();
    }
    function le() {
      k.value && r.value?.focus();
    }
    function ke(ne) {
      k.value = !0;
    }
    function fe(ne) {
      if (ne == null) v.value = [];
      else if (cr(r.value, ":autofill") || cr(r.value, ":-webkit-autofill")) {
        const Pe = u.value.find((Re) => Re.title === ne);
        Pe && X(Pe);
      } else r.value && (r.value.value = "");
    }
    return be(O, () => {
      if (!e.hideSelected && O.value && v.value.length) {
        const ne = V.value.findIndex((Pe) => v.value.some((Re) => (e.valueComparator || H2)(Re.value, Pe.value)));
        w2 && !e.noAutoScroll && window.requestAnimationFrame(() => {
          ne >= 0 && o.value?.scrollToIndex(ne);
        });
      }
    }), be(u, (ne, Pe) => {
      O.value || k.value && e.hideNoData && !Pe.length && ne.length && (O.value = !0);
    }), Fe(() => {
      const ne = !!(e.chips || n.chip), Pe = !!(!e.hideNoData || V.value.length || n["prepend-item"] || n["append-item"] || n["no-data"]), Re = v.value.length > 0, De = P2.filterProps(e), de = Re || !k.value && e.label && !e.persistentPlaceholder ? void 0 : e.placeholder;
      return g(P2, me({
        ref: r
      }, De, {
        modelValue: v.value.map((Be) => Be.props.value).join(", "),
        "onUpdate:modelValue": fe,
        focused: k.value,
        "onUpdate:focused": (Be) => k.value = Be,
        validationValue: v.externalValue,
        counterValue: h.value,
        dirty: Re,
        class: ["v-select", {
          "v-select--active-menu": O.value,
          "v-select--chips": !!e.chips,
          [`v-select--${e.multiple ? "multiple" : "single"}`]: !0,
          "v-select--selected": v.value.length,
          "v-select--selection-slot": !!n.selection
        }, e.class],
        style: e.style,
        inputmode: "none",
        placeholder: de,
        "onClick:clear": ae,
        "onMousedown:control": oe,
        onBlur: re,
        onKeydown: L,
        "aria-expanded": F.value,
        "aria-controls": x.value,
        "aria-label": G.value,
        title: G.value
      }), {
        ...n,
        default: () => I(je, null, [g(K9, me({
          id: Y.value,
          ref: i,
          modelValue: O.value,
          "onUpdate:modelValue": (Be) => O.value = Be,
          activator: "parent",
          contentClass: "v-select__content",
          disabled: A.value,
          eager: e.eager,
          maxHeight: 310,
          openOnClick: !1,
          closeOnContentClick: !1,
          transition: e.transition,
          onAfterEnter: we,
          onAfterLeave: le
        }, U.value), {
          default: () => [Pe && g(G5, me({
            ref: ee,
            selected: p.value,
            selectStrategy: e.multiple ? "independent" : "single-independent",
            onMousedown: (Be) => Be.preventDefault(),
            onKeydown: te,
            onFocusin: ke,
            tabindex: "-1",
            selectable: !0,
            "aria-live": "polite",
            "aria-label": `${e.label}-list`,
            color: e.itemColor ?? e.color
          }, J, e.listProps), {
            default: () => [n["prepend-item"]?.(), !V.value.length && !e.hideNoData && (n["no-data"]?.() ?? g(vt, {
              key: "no-data",
              title: a(e.noDataText)
            }, null)), g(Q9, {
              ref: o,
              renderless: !0,
              items: V.value,
              itemKey: "value"
            }, {
              default: (Be) => {
                let {
                  item: ye,
                  index: f2,
                  itemRef: F2
                } = Be;
                const Me = G3(ye.props), _2 = me(ye.props, {
                  ref: F2,
                  key: ye.value,
                  onClick: () => X(ye, null)
                });
                return ye.type === "divider" ? n.divider?.({
                  props: ye.raw,
                  index: f2
                }) ?? g(Wt, me(ye.props, {
                  key: `divider-${f2}`
                }), null) : ye.type === "subheader" ? n.subheader?.({
                  props: ye.raw,
                  index: f2
                }) ?? g(K5, me(ye.props, {
                  key: `subheader-${f2}`
                }), null) : n.item?.({
                  item: ye,
                  index: f2,
                  props: _2
                }) ?? g(vt, me(_2, {
                  role: "option"
                }), {
                  prepend: (j2) => {
                    let {
                      isSelected: Tt
                    } = j2;
                    return I(je, null, [e.multiple && !e.hideSelected ? g(Kr, {
                      key: ye.value,
                      modelValue: Tt,
                      ripple: !1,
                      tabindex: "-1",
                      onClick: (ei) => ei.preventDefault()
                    }, null) : void 0, Me.prependAvatar && g(rt, {
                      image: Me.prependAvatar
                    }, null), Me.prependIcon && g(ze, {
                      icon: Me.prependIcon
                    }, null)]);
                  }
                });
              }
            }), n["append-item"]?.()]
          })]
        }), v.value.map((Be, ye) => {
          function f2(j2) {
            j2.stopPropagation(), j2.preventDefault(), X(Be, !1);
          }
          const F2 = {
            "onClick:close": f2,
            onKeydown(j2) {
              j2.key !== "Enter" && j2.key !== " " || (j2.preventDefault(), j2.stopPropagation(), f2(j2));
            },
            onMousedown(j2) {
              j2.preventDefault(), j2.stopPropagation();
            },
            modelValue: !0,
            "onUpdate:modelValue": void 0
          }, Me = ne ? !!n.chip : !!n.selection, _2 = Me ? z6(ne ? n.chip({
            item: Be,
            index: ye,
            props: F2
          }) : n.selection({
            item: Be,
            index: ye
          })) : void 0;
          if (!(Me && !_2))
            return I("div", {
              key: Be.value,
              class: "v-select__selection"
            }, [ne ? n.chip ? g(k2, {
              key: "chip-defaults",
              defaults: {
                VChip: {
                  closable: e.closableChips,
                  size: "small",
                  text: Be.title
                }
              }
            }, {
              default: () => [_2]
            }) : g(Qn, me({
              key: "chip",
              closable: e.closableChips,
              size: "small",
              text: Be.title,
              disabled: Be.props.disabled
            }, F2), null) : _2 ?? I("span", {
              class: "v-select__selection-text"
            }, [Be.title, e.multiple && ye < v.value.length - 1 && I("span", {
              class: "v-select__selection-comma"
            }, [pe(",")])])]);
        })]),
        "append-inner": function() {
          for (var Be = arguments.length, ye = new Array(Be), f2 = 0; f2 < Be; f2++)
            ye[f2] = arguments[f2];
          return I(je, null, [n["append-inner"]?.(...ye), e.menuIcon ? g(ze, {
            class: "v-select__menu-icon",
            color: r.value?.fieldIconColor,
            icon: e.menuIcon
          }, null) : void 0]);
        }
      });
    }), va({
      isFocused: k,
      menu: O,
      select: X
    }, r);
  }
}), rd = { class: "pt-2" }, id = 20, w1 = 200, ld = 1e9, od = {
  __name: "CreateVoiAoi",
  props: {
    modelValue: {
      type: Object,
      required: !0
    },
    aoiList: {
      type: Array,
      required: !0
    }
  },
  emits: ["update:modelValue", "valid"],
  setup(e, { expose: t, emit: n }) {
    const a = n, r = se("+"), i = se(id), o = We("extensionAPI"), { HybridViewerStore: u } = o, c = E({
      get: () => e.modelValue,
      set: (k) => a("update:modelValue", k)
    }), f = E(
      () => c.value.aoi_id !== void 0 && c.value.z_min !== "" && c.value.z_max !== ""
    );
    be(f, (k) => a("valid", k), { immediate: !0 });
    function v(k, S) {
      const w = S - k;
      let _ = 0;
      r.value === "+" ? _ = i.value / w1 : r.value === "-" && (_ = -i.value / w1), c.value.z_min = (k - w * _).toFixed(2), c.value.z_max = (S + w * _).toFixed(2);
    }
    function h() {
      const { hybridDb: k } = u;
      if (!k)
        return;
      let S = -1 / 0, w = 1 / 0, _ = !1;
      for (const { actor: V } of Object.values(k)) {
        if (!V || !V.getVisibility())
          continue;
        const A = V.getBounds();
        A && A.every((T) => Math.abs(T) < ld) && (w = Math.min(w, A[4]), S = Math.max(S, A[5]), _ = !0);
      }
      _ && v(w, S);
    }
    be([r, i], h), yt(h);
    function y(k) {
      return String(k || "").replace(",", ".").replaceAll(/[^0-9eE+\-.]/gu, "");
    }
    function p(k) {
      const w = (k?.clipboardData?.getData("text") || "").match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/gu);
      w && w.length >= 2 && (c.value.z_min = y(w[0]), c.value.z_max = y(w[1]), k.preventDefault());
    }
    return t({ initializeVOICoordinates: h }), (k, S) => (Ne(), R2("div", rd, [
      g(mt, {
        modelValue: c.value.aoi_id,
        "onUpdate:modelValue": S[0] || (S[0] = (w) => c.value.aoi_id = w),
        label: "Select AOI",
        items: e.aoiList,
        "item-title": "name",
        "item-value": "id",
        variant: "outlined",
        color: "primary",
        density: "compact",
        class: "mb-3 text-caption",
        "no-data-text": "No AOI available.",
        "hide-details": "auto"
      }, {
        item: M(({ props: w }) => [
          g(vt, Fl(Ll(w)), {
            prepend: M(() => [
              g(rt, {
                size: "20",
                rounded: "sm",
                class: "me-2",
                color: "transparent"
              }, {
                default: M(() => [
                  g(gn, { src: s2(Ml) }, null, 8, ["src"])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 16)
        ]),
        _: 1
      }, 8, ["modelValue", "items"]),
      g(A2, { dense: "" }, {
        default: M(() => [
          g(Ye, {
            cols: "12",
            class: "pb-0"
          }, {
            default: M(() => [...S[5] || (S[5] = [
              I("div", { class: "text-caption font-weight-semibold text-grey" }, "Padding Settings", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }),
      g(A2, {
        dense: "",
        align: "center",
        class: "mb-3"
      }, {
        default: M(() => [
          g(Ye, { cols: "7" }, {
            default: M(() => [
              g(X6, {
                modelValue: r.value,
                "onUpdate:modelValue": S[1] || (S[1] = (w) => r.value = w),
                color: "primary",
                variant: "outlined",
                density: "compact",
                mandatory: "",
                divided: "",
                style: { height: "32px" }
              }, {
                default: M(() => [
                  g(Je, {
                    value: "fit",
                    size: "small",
                    class: "px-2 text-caption"
                  }, {
                    default: M(() => [...S[6] || (S[6] = [
                      pe("Fit", -1)
                    ])]),
                    _: 1
                  }),
                  g(Je, {
                    value: "+",
                    size: "small",
                    class: "px-2 text-caption"
                  }, {
                    default: M(() => [...S[7] || (S[7] = [
                      pe("+", -1)
                    ])]),
                    _: 1
                  }),
                  g(Je, {
                    value: "-",
                    size: "small",
                    class: "px-2 text-caption"
                  }, {
                    default: M(() => [...S[8] || (S[8] = [
                      pe("-", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["modelValue"])
            ]),
            _: 1
          }),
          r.value !== "fit" ? (Ne(), n2(Ye, {
            key: 0,
            cols: "5"
          }, {
            default: M(() => [
              g(P2, {
                modelValue: i.value,
                "onUpdate:modelValue": S[2] || (S[2] = (w) => i.value = w),
                modelModifiers: { number: !0 },
                label: "Padding",
                type: "number",
                variant: "outlined",
                density: "compact",
                "hide-details": "auto",
                suffix: "%",
                class: "text-caption"
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })) : D2("", !0)
        ]),
        _: 1
      }),
      g(A2, { dense: "" }, {
        default: M(() => [
          g(Ye, {
            cols: "12",
            class: "pb-0"
          }, {
            default: M(() => [...S[9] || (S[9] = [
              I("div", { class: "text-caption font-weight-semibold text-grey" }, "Elevation Coordinates (Z)", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }),
      g(A2, { dense: "" }, {
        default: M(() => [
          g(Ye, { cols: "6" }, {
            default: M(() => [
              g(P2, {
                modelValue: c.value.z_min,
                "onUpdate:modelValue": S[3] || (S[3] = (w) => c.value.z_min = w),
                label: "Z Min",
                variant: "outlined",
                density: "compact",
                "hide-details": "auto",
                class: "text-caption",
                onPaste: p
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          g(Ye, { cols: "6" }, {
            default: M(() => [
              g(P2, {
                modelValue: c.value.z_max,
                "onUpdate:modelValue": S[4] || (S[4] = (w) => c.value.z_max = w),
                label: "Z Max",
                variant: "outlined",
                density: "compact",
                "hide-details": "auto",
                class: "text-caption",
                onPaste: p
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ]));
  }
}, sd = { class: "pt-2" }, ud = {
  __name: "CreateVoiTopo",
  props: {
    modelValue: {
      type: Object,
      required: !0
    },
    topographyList: {
      type: Array,
      required: !0
    },
    curveList: {
      type: Array,
      required: !0
    }
  },
  emits: ["update:modelValue", "valid"],
  setup(e, { emit: t }) {
    const n = t, a = E({
      get: () => e.modelValue,
      set: (i) => n("update:modelValue", i)
    }), r = E(
      () => a.value.topography_id !== void 0 && a.value.curve_id !== void 0
    );
    return be(r, (i) => n("valid", i), { immediate: !0 }), (i, o) => (Ne(), R2("div", sd, [
      g(mt, {
        modelValue: a.value.topography_id,
        "onUpdate:modelValue": o[0] || (o[0] = (u) => a.value.topography_id = u),
        label: "Select Topography",
        items: e.topographyList,
        "item-title": "name",
        "item-value": "id",
        variant: "outlined",
        color: "primary",
        density: "compact",
        class: "mb-3 text-caption",
        "no-data-text": "No TriangulatedSurface3D available.",
        "hide-details": "auto"
      }, null, 8, ["modelValue", "items"]),
      g(mt, {
        modelValue: a.value.curve_id,
        "onUpdate:modelValue": o[1] || (o[1] = (u) => a.value.curve_id = u),
        label: "Select Curve",
        items: e.curveList,
        "item-title": "name",
        "item-value": "id",
        variant: "outlined",
        color: "primary",
        density: "compact",
        class: "mb-3 text-caption",
        "no-data-text": "No EdgedCurve available.",
        "hide-details": "auto"
      }, null, 8, ["modelValue", "items"]),
      g(P2, {
        modelValue: a.value.bottom_surface_depth,
        "onUpdate:modelValue": o[2] || (o[2] = (u) => a.value.bottom_surface_depth = u),
        label: "Bottom Surface Depth",
        type: "number",
        variant: "outlined",
        color: "primary",
        density: "compact",
        class: "mb-3 text-caption",
        "hide-details": "auto"
      }, null, 8, ["modelValue"])
    ]));
  }
}, cd = ce({
  ...qe(),
  ...V8()
}, "VForm"), jn = Ae()({
  name: "VForm",
  props: cd(),
  emits: {
    "update:modelValue": (e) => !0,
    submit: (e) => !0
  },
  setup(e, t) {
    let {
      slots: n,
      emit: a
    } = t;
    const r = I8(e), i = se();
    function o(c) {
      c.preventDefault(), r.reset();
    }
    function u(c) {
      const f = c, v = r.validate();
      f.then = v.then.bind(v), f.catch = v.catch.bind(v), f.finally = v.finally.bind(v), a("submit", f), f.defaultPrevented || v.then((h) => {
        let {
          valid: y
        } = h;
        y && i.value?.submit();
      }), f.preventDefault();
    }
    return Fe(() => I("form", {
      ref: i,
      class: ve(["v-form", e.class]),
      style: Ee(e.style),
      novalidate: !0,
      onReset: o,
      onSubmit: u
    }, [n.default?.(r)])), va(r, i);
  }
}), uo = /* @__PURE__ */ Symbol.for("vuetify:v-tabs"), du = ce({
  fixed: Boolean,
  sliderColor: String,
  hideSlider: Boolean,
  direction: {
    type: String,
    default: "horizontal"
  },
  ...qt(s5({
    selectedClass: "v-tab--selected",
    variant: "text"
  }), ["active", "block", "flat", "location", "position", "symbol"])
}, "VTab"), hl = Ae()({
  name: "VTab",
  props: du(),
  setup(e, t) {
    let {
      slots: n,
      attrs: a
    } = t;
    const {
      textColorClasses: r,
      textColorStyles: i
    } = ht(() => e.sliderColor), o = se(), u = se(), c = E(() => e.direction === "horizontal"), f = E(() => o.value?.group?.isSelected.value ?? !1);
    function v(h) {
      let {
        value: y
      } = h;
      if (y) {
        const p = o.value?.$el.parentElement?.querySelector(".v-tab--selected .v-tab__slider"), k = u.value;
        if (!p || !k) return;
        const S = getComputedStyle(p).color, w = p.getBoundingClientRect(), _ = k.getBoundingClientRect(), V = c.value ? "x" : "y", A = c.value ? "X" : "Y", T = c.value ? "right" : "bottom", O = c.value ? "width" : "height", Y = w[V], F = _[V], x = Y > F ? w[T] - _[T] : w[V] - _[V], G = Math.sign(x) > 0 ? c.value ? "right" : "bottom" : Math.sign(x) < 0 ? c.value ? "left" : "top" : "center", ee = (Math.abs(x) + (Math.sign(x) < 0 ? w[O] : _[O])) / Math.max(w[O], _[O]) || 0, J = w[O] / _[O] || 0, ae = 1.5;
        Mt(k, {
          backgroundColor: [S, "currentcolor"],
          transform: [`translate${A}(${x}px) scale${A}(${J})`, `translate${A}(${x / ae}px) scale${A}(${(ee - 1) / ae + 1})`, "none"],
          transformOrigin: Array(3).fill(G)
        }, {
          duration: 225,
          easing: Hn
        });
      }
    }
    return Fe(() => {
      const h = Je.filterProps(e);
      return g(Je, me({
        symbol: uo,
        ref: o,
        class: ["v-tab", e.class],
        style: e.style,
        tabindex: f.value ? 0 : -1,
        role: "tab",
        "aria-selected": String(f.value),
        active: !1
      }, h, a, {
        block: e.fixed,
        maxWidth: e.fixed ? 300 : void 0,
        "onGroup:selected": v
      }), {
        ...n,
        default: () => I(je, null, [n.default?.() ?? e.text, !e.hideSlider && I("div", {
          ref: u,
          class: ve(["v-tab__slider", r.value]),
          style: Ee(i.value)
        }, null)])
      });
    }), va({}, o);
  }
}), dd = (e) => {
  const {
    touchstartX: t,
    touchendX: n,
    touchstartY: a,
    touchendY: r
  } = e, i = 0.5, o = 16;
  e.offsetX = n - t, e.offsetY = r - a, Math.abs(e.offsetY) < i * Math.abs(e.offsetX) && (e.left && n < t - o && e.left(e), e.right && n > t + o && e.right(e)), Math.abs(e.offsetX) < i * Math.abs(e.offsetY) && (e.up && r < a - o && e.up(e), e.down && r > a + o && e.down(e));
};
function fd(e, t) {
  const n = e.changedTouches[0];
  t.touchstartX = n.clientX, t.touchstartY = n.clientY, t.start?.({
    originalEvent: e,
    ...t
  });
}
function vd(e, t) {
  const n = e.changedTouches[0];
  t.touchendX = n.clientX, t.touchendY = n.clientY, t.end?.({
    originalEvent: e,
    ...t
  }), dd(t);
}
function md(e, t) {
  const n = e.changedTouches[0];
  t.touchmoveX = n.clientX, t.touchmoveY = n.clientY, t.move?.({
    originalEvent: e,
    ...t
  });
}
function gd() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const t = {
    touchstartX: 0,
    touchstartY: 0,
    touchendX: 0,
    touchendY: 0,
    touchmoveX: 0,
    touchmoveY: 0,
    offsetX: 0,
    offsetY: 0,
    left: e.left,
    right: e.right,
    up: e.up,
    down: e.down,
    start: e.start,
    move: e.move,
    end: e.end
  };
  return {
    touchstart: (n) => fd(n, t),
    touchend: (n) => vd(n, t),
    touchmove: (n) => md(n, t)
  };
}
function hd(e, t) {
  const n = t.value, a = n?.parent ? e.parentElement : e, r = n?.options ?? {
    passive: !0
  }, i = t.instance?.$.uid;
  if (!a || i === void 0) return;
  const o = gd(t.value);
  a._touchHandlers = a._touchHandlers ?? /* @__PURE__ */ Object.create(null), a._touchHandlers[i] = o, L6(o).forEach((u) => {
    a.addEventListener(u, o[u], r);
  });
}
function yd(e, t) {
  const n = t.value?.parent ? e.parentElement : e, a = t.instance?.$.uid;
  if (!n?._touchHandlers || a === void 0) return;
  const r = n._touchHandlers[a];
  L6(r).forEach((i) => {
    n.removeEventListener(i, r[i]);
  }), delete n._touchHandlers[a];
}
const yl = {
  mounted: hd,
  unmounted: yd
}, fu = /* @__PURE__ */ Symbol.for("vuetify:v-window"), vu = /* @__PURE__ */ Symbol.for("vuetify:v-window-group"), mu = ce({
  continuous: Boolean,
  nextIcon: {
    type: [Boolean, String, Function, Object],
    default: "$next"
  },
  prevIcon: {
    type: [Boolean, String, Function, Object],
    default: "$prev"
  },
  reverse: Boolean,
  showArrows: {
    type: [Boolean, String],
    validator: (e) => typeof e == "boolean" || e === "hover"
  },
  verticalArrows: [Boolean, String],
  touch: {
    type: [Object, Boolean],
    default: void 0
  },
  direction: {
    type: String,
    default: "horizontal"
  },
  modelValue: null,
  disabled: Boolean,
  selectedClass: {
    type: String,
    default: "v-window-item--active"
  },
  // TODO: mandatory should probably not be exposed but do this for now
  mandatory: {
    type: [Boolean, String],
    default: "force"
  },
  crossfade: Boolean,
  transitionDuration: Number,
  ...qe(),
  ...l2(),
  ...y2()
}, "VWindow"), x1 = Ae()({
  name: "VWindow",
  directives: {
    vTouch: yl
  },
  props: mu(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: a
    } = V2(e), {
      isRtl: r
    } = xt(), {
      t: i
    } = wt(), o = da(e, vu), u = se(), c = E(() => r.value ? !e.reverse : e.reverse), f = Ve(!1), v = E(() => {
      if (e.crossfade)
        return "v-window-crossfade-transition";
      const T = e.direction === "vertical" ? "y" : "x", Y = (c.value ? !f.value : f.value) ? "-reverse" : "";
      return `v-window-${T}${Y}-transition`;
    }), h = Ve(0), y = se(void 0), p = E(() => o.items.value.findIndex((T) => o.selected.value.includes(T.id)));
    be(p, (T, O) => {
      let Y;
      const F = {
        left: 0,
        top: 0
      };
      w2 && O >= 0 && (Y = Wl(u.value), F.left = Y?.scrollLeft, F.top = Y?.scrollTop);
      const x = o.items.value.length, G = x - 1;
      x <= 2 ? f.value = T < O : T === G && O === 0 ? f.value = !1 : T === 0 && O === G ? f.value = !0 : f.value = T < O, e2(() => {
        if (!w2 || !Y) return;
        Y.scrollTop !== F.top && Y.scrollTo({
          ...F,
          behavior: "instant"
        }), requestAnimationFrame(() => {
          if (!Y) return;
          Y.scrollTop !== F.top && Y.scrollTo({
            ...F,
            behavior: "instant"
          });
        });
      });
    }, {
      flush: "sync"
    }), c2(fu, {
      transition: v,
      isReversed: f,
      transitionCount: h,
      transitionHeight: y,
      rootRef: u
    });
    const k = R(() => e.continuous || p.value !== 0), S = R(() => e.continuous || p.value !== o.items.value.length - 1);
    function w() {
      k.value && o.prev();
    }
    function _() {
      S.value && o.next();
    }
    const V = E(() => {
      const T = [], O = {
        icon: r.value ? e.nextIcon : e.prevIcon,
        class: `v-window__${c.value ? "right" : "left"}`,
        onClick: o.prev,
        "aria-label": i("$vuetify.carousel.prev")
      };
      T.push(k.value ? n.prev ? n.prev({
        props: O
      }) : g(Je, O, null) : I("div", null, null));
      const Y = {
        icon: r.value ? e.prevIcon : e.nextIcon,
        class: `v-window__${c.value ? "left" : "right"}`,
        onClick: o.next,
        "aria-label": i("$vuetify.carousel.next")
      };
      return T.push(S.value ? n.next ? n.next({
        props: Y
      }) : g(Je, Y, null) : I("div", null, null)), T;
    }), A = E(() => e.touch === !1 ? e.touch : {
      ...{
        left: () => {
          c.value ? w() : _();
        },
        right: () => {
          c.value ? _() : w();
        },
        start: (O) => {
          let {
            originalEvent: Y
          } = O;
          Y.stopPropagation();
        }
      },
      ...e.touch === !0 ? {} : e.touch
    });
    return Fe(() => g2(g(e.tag, {
      ref: u,
      class: ve(["v-window", {
        "v-window--show-arrows-on-hover": e.showArrows === "hover",
        "v-window--vertical-arrows": !!e.verticalArrows,
        "v-window--crossfade": !!e.crossfade
      }, a.value, e.class]),
      style: Ee([e.style, e.transitionDuration && !$0 ? {
        "--v-window-transition-duration": Oe(e.transitionDuration, "ms")
      } : void 0])
    }, {
      default: () => [I("div", {
        class: "v-window__container",
        style: {
          height: y.value
        }
      }, [n.default?.({
        group: o
      }), e.showArrows !== !1 && I("div", {
        class: ve(["v-window__controls", {
          "v-window__controls--left": e.verticalArrows === "left" || e.verticalArrows === !0
        }, {
          "v-window__controls--right": e.verticalArrows === "right"
        }])
      }, [V.value])]), n.additional?.({
        group: o
      })]
    }), [[yl, A.value]])), {
      group: o
    };
  }
}), Cd = ce({
  ...qt(mu(), ["continuous", "nextIcon", "prevIcon", "showArrows", "touch", "mandatory"])
}, "VTabsWindow"), pd = Ae()({
  name: "VTabsWindow",
  props: Cd(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = We(uo, null), r = r2(e, "modelValue"), i = E({
      get() {
        return r.value != null || !a ? r.value : a.items.value.find((o) => a.selected.value.includes(o.id))?.value;
      },
      set(o) {
        r.value = o;
      }
    });
    return Fe(() => {
      const o = x1.filterProps(e);
      return g(x1, me({
        _as: "VTabsWindow"
      }, o, {
        modelValue: i.value,
        "onUpdate:modelValue": (u) => i.value = u,
        class: ["v-tabs-window", e.class],
        style: e.style,
        mandatory: !1,
        touch: !1
      }), n);
    }), {};
  }
}), gu = ce({
  reverseTransition: {
    type: [Boolean, String],
    default: void 0
  },
  transition: {
    type: [Boolean, String],
    default: void 0
  },
  ...qe(),
  ...Fr(),
  ...lo()
}, "VWindowItem"), S1 = Ae()({
  name: "VWindowItem",
  directives: {
    vTouch: yl
  },
  props: gu(),
  emits: {
    "group:selected": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = We(fu), r = Un(e, vu), {
      isBooted: i
    } = j5();
    if (!a || !r) throw new Error("[Vuetify] VWindowItem must be used inside VWindow");
    const o = Ve(!1), u = E(() => i.value && (a.isReversed.value ? e.reverseTransition !== !1 : e.transition !== !1));
    function c() {
      !o.value || !a || (o.value = !1, a.transitionCount.value > 0 && (a.transitionCount.value -= 1, a.transitionCount.value === 0 && (a.transitionHeight.value = void 0)));
    }
    function f() {
      o.value || !a || (o.value = !0, a.transitionCount.value === 0 && (a.transitionHeight.value = Oe(a.rootRef.value?.clientHeight)), a.transitionCount.value += 1);
    }
    function v() {
      c();
    }
    function h(k) {
      o.value && e2(() => {
        !u.value || !o.value || !a || (a.transitionHeight.value = Oe(k.clientHeight));
      });
    }
    const y = E(() => {
      const k = a.isReversed.value ? e.reverseTransition : e.transition;
      return u.value ? {
        name: typeof k != "string" ? a.transition.value : k,
        onBeforeEnter: f,
        onAfterEnter: c,
        onEnterCancelled: v,
        onBeforeLeave: f,
        onAfterLeave: c,
        onLeaveCancelled: v,
        onEnter: h
      } : !1;
    }), {
      hasContent: p
    } = oo(e, r.isSelected);
    return Fe(() => g(Nt, {
      transition: y.value,
      disabled: !i.value
    }, {
      default: () => [g2(I("div", {
        class: ve(["v-window-item", r.selectedClass.value, e.class]),
        style: Ee(e.style)
      }, [p.value && n.default?.()]), [[dt, r.isSelected.value]])]
    })), {
      groupItem: r
    };
  }
}), bd = ce({
  ...gu()
}, "VTabsWindowItem"), wd = Ae()({
  name: "VTabsWindowItem",
  props: bd(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return Fe(() => {
      const a = S1.filterProps(e);
      return g(S1, me({
        _as: "VTabsWindowItem"
      }, a, {
        class: ["v-tabs-window-item", e.class],
        style: e.style
      }), n);
    }), {};
  }
});
function xd(e) {
  return e ? e.map((t) => or(t) ? t : {
    text: t,
    value: t
  }) : [];
}
const Sd = ce({
  alignTabs: {
    type: String,
    default: "start"
  },
  color: String,
  fixedTabs: Boolean,
  items: {
    type: Array,
    default: () => []
  },
  stacked: Boolean,
  bgColor: String,
  grow: Boolean,
  height: {
    type: [Number, String],
    default: void 0
  },
  hideSlider: Boolean,
  sliderColor: String,
  ...jt(du(), ["spaced"]),
  ...ro({
    mandatory: "force",
    selectedClass: "v-tab-item--selected"
  }),
  ...z2(),
  ...l2()
}, "VTabs"), kd = Ae()({
  name: "VTabs",
  props: Sd(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      slots: a
    } = t;
    const r = r2(e, "modelValue"), i = E(() => xd(e.items)), {
      densityClasses: o
    } = bt(e), {
      backgroundColorClasses: u,
      backgroundColorStyles: c
    } = at(() => e.bgColor), {
      scopeId: f
    } = so();
    return gt({
      VTab: {
        color: R(() => e.color),
        direction: R(() => e.direction),
        stacked: R(() => e.stacked),
        fixed: R(() => e.fixedTabs),
        sliderColor: R(() => e.sliderColor),
        hideSlider: R(() => e.hideSlider)
      }
    }), Fe(() => {
      const v = gr.filterProps(e), h = !!(a.window || e.items.length > 0);
      return I(je, null, [g(gr, me(v, {
        modelValue: r.value,
        "onUpdate:modelValue": (y) => r.value = y,
        class: ["v-tabs", `v-tabs--${e.direction}`, `v-tabs--align-tabs-${e.alignTabs}`, {
          "v-tabs--fixed-tabs": e.fixedTabs,
          "v-tabs--grow": e.grow,
          "v-tabs--stacked": e.stacked
        }, o.value, u.value, e.class],
        style: [{
          "--v-tabs-height": Oe(e.height)
        }, c.value, e.style],
        role: "tablist",
        symbol: uo
      }, f, n), {
        default: () => [a.default?.() ?? i.value.map((y) => a.tab?.({
          item: y
        }) ?? g(hl, me(y, {
          key: y.text,
          value: y.value,
          spaced: e.spaced
        }), {
          default: a[`tab.${y.value}`] ? () => a[`tab.${y.value}`]?.({
            item: y
          }) : void 0
        }))]
      }), h && g(pd, me({
        modelValue: r.value,
        "onUpdate:modelValue": (y) => r.value = y,
        key: "tabs-window"
      }, f), {
        default: () => [i.value.map((y) => a.item?.({
          item: y
        }) ?? g(wd, {
          value: y.value
        }, {
          default: () => a[`item.${y.value}`]?.({
            item: y
          })
        })), a.window?.()]
      })]);
    }), {};
  }
}), _d = {
  __name: "CreateVoi",
  setup(e) {
    const t = We("extensionAPI"), { UIStore: n, DataBaseStore: a, importItem: r } = t, i = vn(), o = A0(), u = se(""), c = se(!1), f = se("aoi"), v = se({
      aoi_id: void 0,
      z_min: "",
      z_max: ""
    }), h = se({
      topography_id: void 0,
      curve_id: void 0,
      bottom_surface_depth: 0
    }), y = se(!1), p = se(!1), k = t.DataBaseStore.refAllItems(), S = E(() => (k.value || []).filter((x) => x.is_aoi === !0).map((x) => ({
      id: x.id,
      name: x.name || x.native_file || x.id
    }))), w = E(() => (k.value || []).filter(
      (x) => x.geode_object_type === "TriangulatedSurface3D" || x.geode_object_type === "PolygonalSurface3D"
    ).map((x) => ({
      id: x.id,
      name: x.name || x.native_file || x.id
    }))), _ = E(() => (k.value || []).filter(
      (x) => x.geode_object_type === "EdgedCurve2D" || x.geode_object_type === "EdgedCurve3D"
    ).map((x) => ({
      id: x.id,
      name: x.name || x.native_file || x.id,
      type: x.geode_object_type
    }))), V = E(() => u.value.trim() === "" ? !1 : f.value === "aoi" ? y.value : p.value), A = se(void 0);
    function T() {
      n.setShowCreateTools(!0);
    }
    function O() {
      n.setShowCreateTools(!1);
    }
    be(
      () => n.showCreateVOI,
      (F) => {
        F && (f.value === "aoi" && A.value && A.value.initializeVOICoordinates(), v.value.aoi_id = void 0, h.value.topography_id = void 0, h.value.curve_id = void 0, u.value = "");
      }
    );
    async function Y() {
      if (!V.value)
        return;
      let F;
      const x = {
        name: u.value
      };
      f.value === "aoi" ? (F = It.vease_modeling_back.voi_aoi, x.aoi_id = v.value.aoi_id, x.z_min = Number.parseFloat(v.value.z_min), x.z_max = Number.parseFloat(v.value.z_max)) : (F = It.vease_modeling_back.voi_curve, x.topography_id = h.value.topography_id, x.curve_id = h.value.curve_id, x.bottom_surface_depth = Number.parseFloat(h.value.bottom_surface_depth)), c.value = !0;
      try {
        await o.request(
          { schema: F, params: x },
          {
            response_function: async (G) => {
              const U = { ...G, is_voi: !0, name: u.value };
              await r(U), await a.updateItem(G.id, U);
              let ee = i.classifications.find(
                (J) => J.type === "VOI"
              );
              ee || (ee = await i.createEntity({
                type: "VOI",
                name: "Volume of Interest"
              })), ee?.id && await i.setRelation(G.id, ee.id), O();
            }
          }
        );
      } finally {
        c.value = !1;
      }
    }
    return (F, x) => (Ne(), n2(A2, {
      "no-gutters": "",
      class: "fill-height flex-column overflow-hidden"
    }, {
      default: M(() => [
        g(Ye, {
          cols: "auto",
          class: "flex-shrink-0"
        }, {
          default: M(() => [
            g(Rr, { class: "pb-1 pt-3 align-center" }, {
              prepend: M(() => [
                g(rt, {
                  size: "32",
                  rounded: "0",
                  class: "me-2",
                  color: "transparent"
                }, {
                  default: M(() => [
                    g(gn, {
                      src: s2($6),
                      cover: ""
                    }, null, 8, ["src"])
                  ]),
                  _: 1
                })
              ]),
              default: M(() => [
                g(d0, {
                  class: "text-subtitle-1 text-primary font-weight-bold",
                  style: { "line-height": "1.2" }
                }, {
                  default: M(() => [...x[6] || (x[6] = [
                    pe(" Create Volume of Interest ", -1)
                  ])]),
                  _: 1
                }),
                g(fa, {
                  class: "ma-0 mt-0.5 opacity-70 flex-shrink-0 text-caption text-wrap",
                  style: { "font-size": "0.72rem !important", "line-height": "1.2" }
                }, {
                  default: M(() => [...x[7] || (x[7] = [
                    pe(" Define a 3D volume of interest using coordinates or surface boundaries. ", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        g(Ye, { class: "overflow-y-auto pt-3" }, {
          default: M(() => [
            g(Dr, { class: "pa-0 px-4" }, {
              default: M(() => [
                g(jn, {
                  onSubmit: Rt(Y, ["prevent"])
                }, Bl({
                  default: M(() => [
                    g(P2, {
                      modelValue: u.value,
                      "onUpdate:modelValue": x[0] || (x[0] = (G) => u.value = G),
                      label: "VOI Name",
                      variant: "outlined",
                      color: "primary",
                      density: "compact",
                      class: "mb-3 text-caption",
                      "hide-details": "auto"
                    }, null, 8, ["modelValue"]),
                    g(kd, {
                      modelValue: f.value,
                      "onUpdate:modelValue": x[1] || (x[1] = (G) => f.value = G),
                      color: "primary",
                      "align-tabs": "center",
                      grow: "",
                      class: "mb-3",
                      style: { height: "36px" }
                    }, {
                      default: M(() => [
                        g(hl, {
                          value: "aoi",
                          class: "text-caption"
                        }, {
                          default: M(() => [...x[8] || (x[8] = [
                            pe("AOI + Z", -1)
                          ])]),
                          _: 1
                        }),
                        g(hl, {
                          value: "topo",
                          class: "text-caption"
                        }, {
                          default: M(() => [...x[9] || (x[9] = [
                            pe("Topo + Curve", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 2
                }, [
                  f.value === "aoi" ? {
                    name: "default",
                    fn: M(() => [
                      g(od, {
                        ref_key: "aoiRef",
                        ref: A,
                        modelValue: v.value,
                        "onUpdate:modelValue": x[2] || (x[2] = (G) => v.value = G),
                        aoiList: S.value,
                        onValid: x[3] || (x[3] = (G) => y.value = G)
                      }, null, 8, ["modelValue", "aoiList"])
                    ]),
                    key: "0"
                  } : f.value === "topo" ? {
                    name: "default",
                    fn: M(() => [
                      g(ud, {
                        modelValue: h.value,
                        "onUpdate:modelValue": x[4] || (x[4] = (G) => h.value = G),
                        topographyList: w.value,
                        curveList: _.value,
                        onValid: x[5] || (x[5] = (G) => p.value = G)
                      }, null, 8, ["modelValue", "topographyList", "curveList"])
                    ]),
                    key: "1"
                  } : void 0
                ]), 1024)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        g(Ye, {
          cols: "auto",
          class: "flex-shrink-0"
        }, {
          default: M(() => [
            g(Wt, { class: "mx-4 mt-2" }),
            g(Mr, { class: "pa-3" }, {
              default: M(() => [
                g(Je, {
                  variant: "text",
                  size: "small",
                  color: "grey-darken-1",
                  onClick: T,
                  rounded: "lg",
                  class: "text-caption"
                }, {
                  default: M(() => [...x[10] || (x[10] = [
                    pe(" Cancel ", -1)
                  ])]),
                  _: 1
                }),
                g(jr),
                g(Je, {
                  color: "primary",
                  variant: "flat",
                  size: "small",
                  loading: c.value,
                  disabled: !V.value,
                  onClick: Y,
                  rounded: "lg",
                  class: "px-4 text-caption font-weight-bold"
                }, {
                  default: M(() => [...x[11] || (x[11] = [
                    pe(" Create VOI ", -1)
                  ])]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }));
  }
}, Pd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _d
}, Symbol.toStringTag, { value: "Module" })), Vd = $r("v-alert-title"), Id = ce({
  iconSize: [Number, String],
  iconSizes: {
    type: Array,
    default: () => [["x-small", 10], ["small", 16], ["default", 24], ["large", 28], ["x-large", 32]]
  }
}, "iconSize");
function Ed(e, t) {
  return {
    iconSize: E(() => {
      const a = new Map(e.iconSizes), r = e.iconSize ?? t() ?? "default";
      return a.has(r) ? a.get(r) : r;
    })
  };
}
const Ad = ["success", "info", "warning", "error"], $d = ce({
  border: {
    type: [Boolean, String],
    validator: (e) => typeof e == "boolean" || ["top", "end", "bottom", "start"].includes(e)
  },
  borderColor: String,
  closable: Boolean,
  closeIcon: {
    type: Ke,
    default: "$close"
  },
  closeLabel: {
    type: String,
    default: "$vuetify.close"
  },
  icon: {
    type: [Boolean, String, Function, Object],
    default: null
  },
  modelValue: {
    type: Boolean,
    default: !0
  },
  prominent: Boolean,
  title: String,
  text: String,
  type: {
    type: String,
    validator: (e) => Ad.includes(e)
  },
  ...qe(),
  ...z2(),
  ...Ct(),
  ...Ut(),
  ...Id(),
  ...Lr(),
  ...Zl(),
  ...it(),
  ...l2(),
  ...y2(),
  ...Ht({
    variant: "flat"
  })
}, "VAlert"), Td = Ae()({
  name: "VAlert",
  props: $d(),
  emits: {
    "click:close": (e) => !0,
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      emit: n,
      slots: a
    } = t;
    const r = r2(e, "modelValue"), i = R(() => {
      if (e.icon !== !1)
        return e.type ? e.icon ?? `$${e.type}` : e.icon;
    }), {
      iconSize: o
    } = Ed(e, () => e.prominent ? 44 : void 0), {
      themeClasses: u
    } = V2(e), {
      colorClasses: c,
      colorStyles: f,
      variantClasses: v
    } = ca(() => ({
      color: e.color ?? e.type,
      variant: e.variant
    })), {
      densityClasses: h
    } = bt(e), {
      dimensionStyles: y
    } = pt(e), {
      elevationClasses: p
    } = c0(e), {
      locationStyles: k
    } = Br(e), {
      positionClasses: S
    } = Yl(e), {
      roundedClasses: w
    } = ft(e), {
      textColorClasses: _,
      textColorStyles: V
    } = ht(() => e.borderColor), {
      t: A
    } = wt(), T = R(() => ({
      "aria-label": A(e.closeLabel),
      onClick(O) {
        r.value = !1, n("click:close", O);
      }
    }));
    return () => {
      const O = !!(a.prepend || i.value), Y = !!(a.title || e.title), F = !!(a.close || e.closable), x = {
        density: e.density,
        icon: i.value,
        size: e.iconSize || e.prominent ? o.value : void 0
      };
      return r.value && g(e.tag, {
        class: ve(["v-alert", e.border && {
          "v-alert--border": !!e.border,
          [`v-alert--border-${e.border === !0 ? "start" : e.border}`]: !0
        }, {
          "v-alert--prominent": e.prominent
        }, u.value, c.value, h.value, p.value, S.value, w.value, v.value, e.class]),
        style: Ee([f.value, y.value, k.value, e.style]),
        role: "alert"
      }, {
        default: () => [ua(!1, "v-alert"), e.border && I("div", {
          key: "border",
          class: ve(["v-alert__border", _.value]),
          style: Ee(V.value)
        }, null), O && I("div", {
          key: "prepend",
          class: "v-alert__prepend"
        }, [a.prepend ? g(k2, {
          key: "prepend-defaults",
          disabled: !i.value,
          defaults: {
            VIcon: {
              ...x
            }
          }
        }, a.prepend) : g(ze, me({
          key: "prepend-icon"
        }, x), null)]), I("div", {
          class: "v-alert__content"
        }, [Y && g(Vd, {
          key: "title"
        }, {
          default: () => [a.title?.() ?? e.title]
        }), a.text?.() ?? e.text, a.default?.()]), a.append && I("div", {
          key: "append",
          class: "v-alert__append"
        }, [a.append()]), F && I("div", {
          key: "close",
          class: "v-alert__close"
        }, [a.close ? g(k2, {
          key: "close-defaults",
          defaults: {
            VBtn: {
              icon: e.closeIcon,
              size: "x-small",
              variant: "text"
            }
          }
        }, {
          default: () => [a.close?.({
            props: T.value
          })]
        }) : g(Je, me({
          key: "close-btn",
          icon: e.closeIcon,
          size: "x-small",
          variant: "text"
        }, T.value), null)])]
      });
    };
  }
}), Od = {
  class: "text-caption text-grey font-weight-semibold",
  style: { "font-size": "0.65rem !important", "text-transform": "uppercase", "letter-spacing": "0.05em" }
}, Fd = {
  class: "text-caption font-weight-bold text-white",
  style: { "font-size": "0.78rem !important", "line-height": "1.1" }
}, Ld = {
  key: 3,
  class: "px-2"
}, Bd = { key: 0 }, Md = {
  key: 1,
  class: "text-italic opacity-60"
}, Rd = { key: 0 }, Dd = {
  key: 1,
  class: "text-italic opacity-60"
}, Nd = { class: "d-flex ga-1" }, zd = {
  __name: "CreateStructuralModel",
  emits: ["close", "created"],
  setup(e, { emit: t }) {
    const n = t, a = We("extensionAPI"), { UIStore: r, DataBaseStore: i } = a, o = A0(), u = vn(), c = se(1), f = se(!1), v = se(""), h = se(void 0), y = se([]), p = se([]), k = i.refAllItems();
    function S(te) {
      const L = new Set(k.value.map((we) => we.id)), X = u.relations.filter((we) => we.classification_id === te).map((we) => we.object_id).filter((we) => L.has(we)), re = u.relations.filter(
        (we) => we.classification_id === te
      ).length;
      return X.length < re && console.warn(
        `[CreateStructuralModel] Filtering out ${re - X.length} invalid object IDs for entity ${te}`
      ), X;
    }
    function w(te, L, X, re) {
      const we = S(te);
      if (we.length === 0)
        throw new Error("Selected VOI entity has no associated objects.");
      if (L.length === 0 && X.length === 0)
        return {
          schema: It.vease_modeling_back.model.voi,
          params: {
            name: re,
            id: we[0]
          }
        };
      function le(ke) {
        return ke.map((fe) => ({
          name: u.classifications.find(
            (Pe) => Pe.id === fe
          ).name,
          id: S(fe)
        }));
      }
      return {
        schema: It.vease_modeling_back.model.explicit,
        params: {
          id: we[0],
          name: re,
          faults: le(L),
          horizons: le(X)
        }
      };
    }
    const _ = E(() => u.getEntitiesByType("VOI")), V = E(() => u.getEntitiesByType("Fault")), A = E(() => u.getEntitiesByType("Horizon")), T = E(() => v.value !== "" && h.value !== void 0);
    function O() {
      T.value && (c.value = 2);
    }
    function Y() {
      c.value = 3;
    }
    function F() {
      c.value = 4;
    }
    function x() {
      c.value > 1 && (c.value -= 1);
    }
    async function G() {
      f.value = !0;
      try {
        const { schema: te, params: L } = w(
          h.value,
          y.value,
          p.value,
          v.value
        );
        await o.request(
          { schema: te, params: L },
          {
            response_function: async (X) => {
              await a.importItem(X), n("created"), n("close");
            }
          }
        );
      } catch (te) {
        console.error("Model creation failed", te);
      } finally {
        f.value = !1;
      }
    }
    function U() {
      n("close");
    }
    be(h, (te) => {
      if (te && !v.value) {
        const L = _.value.find((X) => X.id === te);
        L && (v.value = `${L.name}_model`);
      }
    });
    const ee = E(() => _.value.find((te) => te.id === h.value)), J = E(
      () => V.value.filter((te) => y.value.includes(te.id))
    ), ae = E(
      () => A.value.filter((te) => p.value.includes(te.id))
    ), oe = ["VOI", "Faults", "Horizons", "Summary"];
    return (te, L) => (Ne(), n2(A2, {
      "no-gutters": "",
      class: "fill-height flex-column overflow-hidden"
    }, {
      default: M(() => [
        g(Ye, {
          cols: "auto",
          class: "flex-shrink-0"
        }, {
          default: M(() => [
            g(Rr, { class: "pb-1 pt-3 align-center" }, {
              prepend: M(() => [
                g(rt, {
                  size: "24",
                  rounded: "0",
                  class: "me-2",
                  color: "transparent"
                }, {
                  default: M(() => [
                    g(gn, {
                      src: s2(A6),
                      style: { filter: "brightness(0) invert(1)" }
                    }, null, 8, ["src"])
                  ]),
                  _: 1
                })
              ]),
              default: M(() => [
                g(d0, {
                  class: "text-subtitle-1 text-primary font-weight-bold",
                  style: { "line-height": "1.2" }
                }, {
                  default: M(() => [...L[4] || (L[4] = [
                    pe(" Create Structural Model ", -1)
                  ])]),
                  _: 1
                }),
                g(fa, {
                  class: "ma-0 mt-0.5 opacity-70 flex-shrink-0 text-caption text-wrap",
                  style: { "font-size": "0.72rem !important", "line-height": "1.2" }
                }, {
                  default: M(() => [...L[5] || (L[5] = [
                    pe(" Guided process to build a structural model from classified data. ", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        g(Ye, { class: "overflow-y-auto pt-3" }, {
          default: M(() => [
            g(Dr, { class: "pa-0" }, {
              default: M(() => [
                g(A2, {
                  dense: "",
                  class: "px-3 py-2 mx-2 mb-3 bg-grey-darken-4 border border-white-opacity-10 rounded-lg align-center justify-space-between flex-shrink-0"
                }, {
                  default: M(() => [
                    g(Ye, { class: "d-flex flex-column pa-0" }, {
                      default: M(() => [
                        I("span", Od, "Step " + a2(c.value) + " of 4", 1),
                        I("span", Fd, a2(oe[c.value - 1]), 1)
                      ]),
                      _: 1
                    }),
                    g(Ye, {
                      cols: "auto",
                      class: "d-flex ga-1.5 align-center pa-0"
                    }, {
                      default: M(() => [
                        (Ne(), R2(je, null, P0(4, (X) => I("div", {
                          key: X,
                          class: "rounded-pill",
                          style: Ee({
                            width: c.value === X ? "16px" : "6px",
                            height: "6px",
                            background: c.value === X ? "rgba(77, 182, 172, 1)" : "rgba(255, 255, 255, 0.2)",
                            transition: "all 0.3s ease"
                          })
                        }, null, 4)), 64))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                c.value === 1 ? (Ne(), n2(jn, {
                  key: 0,
                  class: "px-2"
                }, {
                  default: M(() => [
                    g(P2, {
                      modelValue: v.value,
                      "onUpdate:modelValue": L[0] || (L[0] = (X) => v.value = X),
                      label: "Model Name",
                      variant: "outlined",
                      color: "primary",
                      placeholder: "e.g. MyStructuralModel",
                      density: "compact",
                      "hide-details": "auto",
                      class: "mb-3 text-caption rounded-lg"
                    }, {
                      "prepend-inner": M(() => [
                        g(ze, {
                          color: "primary",
                          size: "16"
                        }, {
                          default: M(() => [...L[6] || (L[6] = [
                            pe("mdi-format-title", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"]),
                    g(mt, {
                      modelValue: h.value,
                      "onUpdate:modelValue": L[1] || (L[1] = (X) => h.value = X),
                      items: _.value,
                      "item-title": "name",
                      "item-value": "id",
                      variant: "outlined",
                      color: "primary",
                      density: "compact",
                      "hide-details": "auto",
                      "no-data-text": "No VOI items found. Classify a BRep as 'VOI' first.",
                      class: "mb-3 text-caption rounded-lg"
                    }, {
                      label: M(() => [...L[7] || (L[7] = [
                        I("span", null, "Base VOI (BRep)", -1)
                      ])]),
                      "prepend-inner": M(() => [
                        g(ze, {
                          color: "primary",
                          size: "16"
                        }, {
                          default: M(() => [...L[8] || (L[8] = [
                            pe("mdi-cube-outline", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue", "items"])
                  ]),
                  _: 1
                })) : c.value === 2 ? (Ne(), n2(jn, {
                  key: 1,
                  class: "px-2"
                }, {
                  default: M(() => [
                    g(mt, {
                      modelValue: y.value,
                      "onUpdate:modelValue": L[2] || (L[2] = (X) => y.value = X),
                      items: V.value,
                      "item-title": "name",
                      "item-value": "id",
                      variant: "outlined",
                      color: "primary",
                      multiple: "",
                      chips: "",
                      "closable-chips": "",
                      density: "compact",
                      "hide-details": "auto",
                      "no-data-text": "No Fault items found. Classify surfaces as 'Fault' first.",
                      class: "mb-3 text-caption rounded-lg"
                    }, {
                      label: M(() => [...L[9] || (L[9] = [
                        I("span", null, "Select Faults", -1)
                      ])]),
                      "prepend-inner": M(() => [
                        g(ze, {
                          color: "primary",
                          size: "16"
                        }, {
                          default: M(() => [...L[10] || (L[10] = [
                            pe("mdi-slope-downhill", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue", "items"])
                  ]),
                  _: 1
                })) : c.value === 3 ? (Ne(), n2(jn, {
                  key: 2,
                  class: "px-2"
                }, {
                  default: M(() => [
                    g(mt, {
                      modelValue: p.value,
                      "onUpdate:modelValue": L[3] || (L[3] = (X) => p.value = X),
                      items: A.value,
                      "item-title": "name",
                      "item-value": "id",
                      variant: "outlined",
                      color: "primary",
                      multiple: "",
                      chips: "",
                      "closable-chips": "",
                      density: "compact",
                      "hide-details": "auto",
                      "no-data-text": "No Horizon items found. Classify surfaces as 'Horizon' first.",
                      class: "mb-3 text-caption rounded-lg"
                    }, {
                      label: M(() => [...L[11] || (L[11] = [
                        I("span", null, "Select Horizons", -1)
                      ])]),
                      "prepend-inner": M(() => [
                        g(ze, {
                          color: "primary",
                          size: "16"
                        }, {
                          default: M(() => [...L[12] || (L[12] = [
                            pe("mdi-layers-outline", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue", "items"])
                  ]),
                  _: 1
                })) : c.value === 4 ? (Ne(), R2("div", Ld, [
                  y.value.length === 0 && p.value.length === 0 ? (Ne(), n2(Td, {
                    key: 0,
                    type: "info",
                    variant: "tonal",
                    density: "compact",
                    class: "mb-3 rounded-lg text-caption"
                  }, {
                    default: M(() => [...L[13] || (L[13] = [
                      pe(" No structural elements selected. A simple VOI model will be created. ", -1)
                    ])]),
                    _: 1
                  })) : D2("", !0),
                  g(G5, {
                    lines: "one",
                    class: "bg-transparent pa-0"
                  }, {
                    default: M(() => [
                      g(vt, { class: "px-0 py-1" }, {
                        prepend: M(() => [
                          g(ze, {
                            color: "primary",
                            size: "16",
                            class: "me-2"
                          }, {
                            default: M(() => [...L[14] || (L[14] = [
                              pe("mdi-format-title", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        default: M(() => [
                          g(Mn, { class: "font-weight-bold text-caption" }, {
                            default: M(() => [...L[15] || (L[15] = [
                              pe("Model Name", -1)
                            ])]),
                            _: 1
                          }),
                          g(Bn, { class: "text-caption" }, {
                            default: M(() => [
                              pe(a2(v.value), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      g(vt, { class: "px-0 py-1" }, {
                        prepend: M(() => [
                          g(ze, {
                            color: "primary",
                            size: "16",
                            class: "me-2"
                          }, {
                            default: M(() => [...L[16] || (L[16] = [
                              pe("mdi-cube-outline", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        default: M(() => [
                          g(Mn, { class: "font-weight-bold text-caption" }, {
                            default: M(() => [...L[17] || (L[17] = [
                              pe("Base VOI", -1)
                            ])]),
                            _: 1
                          }),
                          g(Bn, { class: "text-caption" }, {
                            default: M(() => [
                              pe(a2(ee.value?.name || "None"), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      g(Wt, { class: "my-1" }),
                      g(vt, { class: "px-0 py-1" }, {
                        prepend: M(() => [
                          g(ze, {
                            color: "primary",
                            size: "16",
                            class: "me-2"
                          }, {
                            default: M(() => [...L[18] || (L[18] = [
                              pe("mdi-slope-downhill", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        default: M(() => [
                          g(Mn, { class: "font-weight-bold text-caption" }, {
                            default: M(() => [...L[19] || (L[19] = [
                              pe("Faults", -1)
                            ])]),
                            _: 1
                          }),
                          g(Bn, { class: "text-caption" }, {
                            default: M(() => [
                              J.value.length > 0 ? (Ne(), R2("span", Bd, a2(J.value.length) + " selected: " + a2(J.value.map((X) => X.name).join(", ")), 1)) : (Ne(), R2("span", Md, "None (skipped)"))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      g(vt, { class: "px-0 py-1" }, {
                        prepend: M(() => [
                          g(ze, {
                            color: "primary",
                            size: "16",
                            class: "me-2"
                          }, {
                            default: M(() => [...L[20] || (L[20] = [
                              pe("mdi-layers-outline", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        default: M(() => [
                          g(Mn, { class: "font-weight-bold text-caption" }, {
                            default: M(() => [...L[21] || (L[21] = [
                              pe("Horizons", -1)
                            ])]),
                            _: 1
                          }),
                          g(Bn, { class: "text-caption" }, {
                            default: M(() => [
                              ae.value.length > 0 ? (Ne(), R2("span", Rd, a2(ae.value.length) + " selected: " + a2(ae.value.map((X) => X.name).join(", ")), 1)) : (Ne(), R2("span", Dd, "None (skipped)"))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ])) : D2("", !0)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        g(Ye, {
          cols: "auto",
          class: "flex-shrink-0"
        }, {
          default: M(() => [
            g(Wt, { class: "mx-4 mt-1" }),
            g(Mr, { class: "px-3 pb-3 mt-1" }, {
              default: M(() => [
                g(Je, {
                  variant: "text",
                  size: "small",
                  onClick: U,
                  disabled: f.value,
                  class: "text-none rounded-lg text-caption pa-1"
                }, {
                  default: M(() => [
                    g(ze, {
                      start: "",
                      size: "14"
                    }, {
                      default: M(() => [...L[22] || (L[22] = [
                        pe("mdi-close-circle", -1)
                      ])]),
                      _: 1
                    }),
                    L[23] || (L[23] = pe(" Cancel ", -1))
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                g(jr),
                I("div", Nd, [
                  c.value > 1 ? (Ne(), n2(Je, {
                    key: 0,
                    variant: "tonal",
                    size: "small",
                    onClick: x,
                    disabled: f.value,
                    class: "text-none rounded-lg text-caption px-2"
                  }, {
                    default: M(() => [
                      g(ze, {
                        start: "",
                        size: "14"
                      }, {
                        default: M(() => [...L[24] || (L[24] = [
                          pe("mdi-chevron-left", -1)
                        ])]),
                        _: 1
                      }),
                      L[25] || (L[25] = pe(" Back ", -1))
                    ]),
                    _: 1
                  }, 8, ["disabled"])) : D2("", !0),
                  c.value === 1 ? (Ne(), n2(Je, {
                    key: 1,
                    color: "primary",
                    variant: "flat",
                    size: "small",
                    loading: f.value,
                    disabled: !T.value,
                    onClick: O,
                    class: "text-none rounded-lg font-weight-bold px-3 text-caption",
                    elevation: "2"
                  }, {
                    default: M(() => [
                      L[27] || (L[27] = pe(" Next ", -1)),
                      g(ze, {
                        end: "",
                        size: "14"
                      }, {
                        default: M(() => [...L[26] || (L[26] = [
                          pe("mdi-chevron-right", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["loading", "disabled"])) : D2("", !0),
                  c.value === 2 ? (Ne(), R2(je, { key: 2 }, [
                    g(Je, {
                      variant: "tonal",
                      size: "small",
                      onClick: Y,
                      disabled: f.value,
                      class: "text-none rounded-lg text-caption px-2"
                    }, {
                      default: M(() => [...L[28] || (L[28] = [
                        pe(" Skip ", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled"]),
                    g(Je, {
                      color: "primary",
                      variant: "flat",
                      size: "small",
                      loading: f.value,
                      disabled: y.value.length === 0,
                      onClick: Y,
                      class: "text-none rounded-lg font-weight-bold px-3 text-caption",
                      elevation: "2"
                    }, {
                      default: M(() => [
                        L[30] || (L[30] = pe(" Next ", -1)),
                        g(ze, {
                          end: "",
                          size: "14"
                        }, {
                          default: M(() => [...L[29] || (L[29] = [
                            pe("mdi-chevron-right", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ], 64)) : D2("", !0),
                  c.value === 3 ? (Ne(), R2(je, { key: 3 }, [
                    g(Je, {
                      variant: "tonal",
                      size: "small",
                      onClick: F,
                      disabled: f.value,
                      class: "text-none rounded-lg text-caption px-2"
                    }, {
                      default: M(() => [...L[31] || (L[31] = [
                        pe(" Skip ", -1)
                      ])]),
                      _: 1
                    }, 8, ["disabled"]),
                    g(Je, {
                      color: "primary",
                      variant: "flat",
                      size: "small",
                      loading: f.value,
                      disabled: p.value.length === 0,
                      onClick: F,
                      class: "text-none rounded-lg font-weight-bold px-3 text-caption",
                      elevation: "2"
                    }, {
                      default: M(() => [
                        L[33] || (L[33] = pe(" Next ", -1)),
                        g(ze, {
                          end: "",
                          size: "14"
                        }, {
                          default: M(() => [...L[32] || (L[32] = [
                            pe("mdi-chevron-right", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ], 64)) : D2("", !0),
                  c.value === 4 ? (Ne(), n2(Je, {
                    key: 4,
                    color: "success",
                    variant: "flat",
                    size: "small",
                    loading: f.value,
                    onClick: G,
                    class: "text-none rounded-lg font-weight-bold px-3 text-caption",
                    elevation: "2"
                  }, {
                    default: M(() => [
                      L[35] || (L[35] = pe(" Complete ", -1)),
                      g(ze, {
                        end: "",
                        size: "14"
                      }, {
                        default: M(() => [...L[34] || (L[34] = [
                          pe("mdi-check-circle", -1)
                        ])]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["loading"])) : D2("", !0)
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }));
  }
}, jd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: zd
}, Symbol.toStringTag, { value: "Module" })), co = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, r] of t)
    n[a] = r;
  return n;
}, Jn = /* @__PURE__ */ Symbol.for("vuetify:v-expansion-panel"), hu = ce({
  ...qe(),
  ...lo()
}, "VExpansionPanelText"), yr = Ae()({
  name: "VExpansionPanelText",
  props: hu(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = We(Jn);
    if (!a) throw new Error("[Vuetify] v-expansion-panel-text needs to be placed inside v-expansion-panel");
    const {
      hasContent: r,
      onAfterLeave: i
    } = oo(e, a.isSelected);
    return Fe(() => g(S5, {
      onAfterLeave: i
    }, {
      default: () => [g2(I("div", {
        class: ve(["v-expansion-panel-text", e.class]),
        style: Ee(e.style)
      }, [n.default && r.value && I("div", {
        class: "v-expansion-panel-text__wrapper"
      }, [n.default?.()])]), [[dt, a.isSelected.value]])]
    })), {};
  }
}), yu = ce({
  color: String,
  expandIcon: {
    type: Ke,
    default: "$expand"
  },
  collapseIcon: {
    type: Ke,
    default: "$collapse"
  },
  hideActions: Boolean,
  focusable: Boolean,
  static: Boolean,
  ripple: {
    type: [Boolean, Object],
    default: !1
  },
  readonly: Boolean,
  ...qe(),
  ...Ct()
}, "VExpansionPanelTitle"), Cr = Ae()({
  name: "VExpansionPanelTitle",
  directives: {
    vRipple: Kt
  },
  props: yu(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = We(Jn);
    if (!a) throw new Error("[Vuetify] v-expansion-panel-title needs to be placed inside v-expansion-panel");
    const {
      backgroundColorClasses: r,
      backgroundColorStyles: i
    } = at(() => e.color), {
      dimensionStyles: o
    } = pt(e), u = E(() => ({
      collapseIcon: e.collapseIcon,
      disabled: a.disabled.value,
      expanded: a.isSelected.value,
      expandIcon: e.expandIcon,
      readonly: e.readonly
    })), c = R(() => a.isSelected.value ? e.collapseIcon : e.expandIcon);
    return Fe(() => g2(I("button", {
      class: ve(["v-expansion-panel-title", {
        "v-expansion-panel-title--active": a.isSelected.value,
        "v-expansion-panel-title--focusable": e.focusable,
        "v-expansion-panel-title--static": e.static
      }, r.value, e.class]),
      style: Ee([i.value, o.value, e.style]),
      type: "button",
      tabindex: a.disabled.value ? -1 : void 0,
      disabled: a.disabled.value,
      "aria-expanded": a.isSelected.value,
      onClick: e.readonly ? void 0 : a.toggle
    }, [I("span", {
      class: "v-expansion-panel-title__overlay"
    }, null), n.default?.(u.value), !e.hideActions && g(k2, {
      defaults: {
        VIcon: {
          icon: c.value
        }
      }
    }, {
      default: () => [I("span", {
        class: "v-expansion-panel-title__icon"
      }, [n.actions?.(u.value) ?? g(ze, null, null)])]
    })]), [[Kt, e.ripple]])), {};
  }
}), Cu = ce({
  title: String,
  text: String,
  bgColor: String,
  ...Ut(),
  ...Fr(),
  ...it(),
  ...l2(),
  ...yu(),
  ...hu()
}, "VExpansionPanel"), k1 = Ae()({
  name: "VExpansionPanel",
  props: Cu(),
  emits: {
    "group:selected": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = Un(e, Jn), {
      backgroundColorClasses: r,
      backgroundColorStyles: i
    } = at(() => e.bgColor), {
      elevationClasses: o
    } = c0(e), {
      roundedClasses: u
    } = ft(e), c = R(() => a?.disabled.value || e.disabled), f = E(() => a.group.items.value.reduce((y, p, k) => (a.group.selected.value.includes(p.id) && y.push(k), y), [])), v = E(() => {
      const y = a.group.items.value.findIndex((p) => p.id === a.id);
      return !a.isSelected.value && f.value.some((p) => p - y === 1);
    }), h = E(() => {
      const y = a.group.items.value.findIndex((p) => p.id === a.id);
      return !a.isSelected.value && f.value.some((p) => p - y === -1);
    });
    return c2(Jn, a), Fe(() => {
      const y = !!(n.text || e.text), p = !!(n.title || e.title), k = Cr.filterProps(e), S = yr.filterProps(e);
      return g(e.tag, {
        class: ve(["v-expansion-panel", {
          "v-expansion-panel--active": a.isSelected.value,
          "v-expansion-panel--before-active": v.value,
          "v-expansion-panel--after-active": h.value,
          "v-expansion-panel--disabled": c.value
        }, u.value, r.value, e.class]),
        style: Ee([i.value, e.style])
      }, {
        default: () => [I("div", {
          class: ve(["v-expansion-panel__shadow", ...o.value])
        }, null), g(k2, {
          defaults: {
            VExpansionPanelTitle: {
              ...k
            },
            VExpansionPanelText: {
              ...S
            }
          }
        }, {
          default: () => [p && g(Cr, {
            key: "title"
          }, {
            default: () => [n.title ? n.title() : e.title]
          }), y && g(yr, {
            key: "text"
          }, {
            default: () => [n.text ? n.text() : e.text]
          }), n.default?.()]
        })]
      });
    }), {
      groupItem: a
    };
  }
}), Kd = ["default", "accordion", "inset", "popout"], Wd = ce({
  flat: Boolean,
  ...Or(),
  ...jt(Cu(), ["bgColor", "collapseIcon", "color", "eager", "elevation", "expandIcon", "focusable", "hideActions", "readonly", "ripple", "rounded", "tile", "static"]),
  ...y2(),
  ...qe(),
  ...l2(),
  variant: {
    type: String,
    default: "default",
    validator: (e) => Kd.includes(e)
  }
}, "VExpansionPanels"), qd = Ae()({
  name: "VExpansionPanels",
  props: Wd(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      next: a,
      prev: r
    } = da(e, Jn), {
      themeClasses: i
    } = V2(e), o = R(() => e.variant && `v-expansion-panels--variant-${e.variant}`);
    return gt({
      VExpansionPanel: {
        bgColor: R(() => e.bgColor),
        collapseIcon: R(() => e.collapseIcon),
        color: R(() => e.color),
        eager: R(() => e.eager),
        elevation: R(() => e.elevation),
        expandIcon: R(() => e.expandIcon),
        focusable: R(() => e.focusable),
        hideActions: R(() => e.hideActions),
        readonly: R(() => e.readonly),
        ripple: R(() => e.ripple),
        rounded: R(() => e.rounded),
        static: R(() => e.static)
      }
    }), Fe(() => g(e.tag, {
      class: ve(["v-expansion-panels", {
        "v-expansion-panels--flat": e.flat,
        "v-expansion-panels--tile": e.tile
      }, i.value, o.value, e.class]),
      style: Ee(e.style)
    }, {
      default: () => [n.default?.({
        prev: r,
        next: a
      })]
    })), {
      next: a,
      prev: r
    };
  }
}), Hd = ce({
  color: String,
  ...u0(),
  ...qe(),
  ...Ct(),
  ...Ut(),
  ...Lr(),
  ...Zl(),
  ...it(),
  ...l2(),
  ...y2()
}, "VSheet"), a0 = Ae()({
  name: "VSheet",
  props: Hd(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: a
    } = V2(e), {
      backgroundColorClasses: r,
      backgroundColorStyles: i
    } = at(() => e.color), {
      borderClasses: o
    } = L0(e), {
      dimensionStyles: u
    } = pt(e), {
      elevationClasses: c
    } = c0(e), {
      locationStyles: f
    } = Br(e), {
      positionClasses: v
    } = Yl(e), {
      roundedClasses: h
    } = ft(e);
    return Fe(() => g(e.tag, {
      class: ve(["v-sheet", a.value, r.value, o.value, c.value, v.value, h.value, e.class]),
      style: Ee([i.value, u.value, f.value, e.style])
    }, n)), {};
  }
}), Ud = { class: "scrollable-content" }, Gd = {
  class: "text-white opacity-80",
  style: { "font-size": "0.72rem !important", "line-height": "1.2" }
}, Zd = { class: "scrollable-content" }, Yd = {
  class: "font-weight-bold text-white opacity-50 mt-1.5 mb-0.5 text-uppercase",
  style: { "font-size": "0.62rem !important", "letter-spacing": "0.05em" }
}, Xd = {
  class: "text-white opacity-80",
  style: { "font-size": "0.72rem !important", "line-height": "1.2" }
}, Qd = {
  __name: "RemeshMetrics",
  props: {
    typeSizes: {
      type: Object,
      required: !0
    },
    componentSizes: {
      type: Object,
      required: !0
    },
    componentTypes: {
      type: Array,
      required: !0
    },
    groupedStructuralComponents: {
      type: Object,
      required: !0
    },
    defaultMetric: {
      type: Number,
      required: !0
    },
    getInheritedMetric: {
      type: Function,
      required: !0
    }
  },
  setup(e) {
    return (t, n) => (Ne(), n2(a0, {
      color: "transparent",
      class: "mt-1.5"
    }, {
      default: M(() => [
        n[2] || (n[2] = I("p", { class: "text-caption font-weight-bold mb-1.5 text-white opacity-70" }, "Metrics Configuration", -1)),
        g(qd, {
          variant: "accordion",
          theme: "dark"
        }, {
          default: M(() => [
            e.componentTypes.length > 0 ? (Ne(), n2(k1, {
              key: 0,
              "bg-color": "transparent",
              class: "rounded-lg mb-1.5 border border-white-opacity-10"
            }, {
              default: M(() => [
                g(Cr, {
                  class: "text-white text-caption py-1.5",
                  style: { "min-height": "32px" }
                }, {
                  default: M(() => [...n[0] || (n[0] = [
                    pe(" Sizes by Component Type ", -1)
                  ])]),
                  _: 1
                }),
                g(yr, null, {
                  default: M(() => [
                    I("div", Ud, [
                      (Ne(!0), R2(je, null, P0(e.componentTypes, (a) => (Ne(), n2(A2, {
                        key: a,
                        align: "center",
                        dense: ""
                      }, {
                        default: M(() => [
                          g(Ye, { cols: "7" }, {
                            default: M(() => [
                              I("span", Gd, a2(a), 1)
                            ]),
                            _: 2
                          }, 1024),
                          g(Ye, { cols: "5" }, {
                            default: M(() => [
                              g(P2, {
                                modelValue: e.typeSizes[a],
                                "onUpdate:modelValue": (r) => e.typeSizes[a] = r,
                                type: "number",
                                density: "compact",
                                variant: "underlined",
                                color: "white",
                                "hide-details": "",
                                placeholder: `Auto (${e.defaultMetric})`,
                                clearable: "",
                                class: "text-white compact-metrics-input",
                                style: { "font-size": "0.72rem !important" },
                                rules: [(r) => !r || Number.parseFloat(r) > 0 || "Must be > 0"]
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "rules"])
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024))), 128))
                    ])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })) : D2("", !0),
            Object.keys(e.groupedStructuralComponents).length > 0 ? (Ne(), n2(k1, {
              key: 1,
              "bg-color": "transparent",
              class: "rounded-lg border border-white-opacity-10"
            }, {
              default: M(() => [
                g(Cr, {
                  class: "text-white text-caption py-1.5",
                  style: { "min-height": "32px" }
                }, {
                  default: M(() => [...n[1] || (n[1] = [
                    pe(" Individual Component Overrides ", -1)
                  ])]),
                  _: 1
                }),
                g(yr, null, {
                  default: M(() => [
                    I("div", Zd, [
                      (Ne(!0), R2(je, null, P0(e.groupedStructuralComponents, (a, r) => (Ne(), R2(je, { key: r }, [
                        I("p", Yd, a2(r) + "s ", 1),
                        (Ne(!0), R2(je, null, P0(a, (i) => (Ne(), n2(A2, {
                          key: i.geode_id,
                          align: "center",
                          dense: ""
                        }, {
                          default: M(() => [
                            g(Ye, {
                              cols: "7",
                              class: "text-truncate"
                            }, {
                              default: M(() => [
                                I("span", Xd, a2(i.name), 1)
                              ]),
                              _: 2
                            }, 1024),
                            g(Ye, { cols: "5" }, {
                              default: M(() => [
                                g(P2, {
                                  modelValue: e.componentSizes[i.geode_id],
                                  "onUpdate:modelValue": (o) => e.componentSizes[i.geode_id] = o,
                                  type: "number",
                                  density: "compact",
                                  variant: "underlined",
                                  color: "white",
                                  "hide-details": "",
                                  placeholder: `Auto (${e.getInheritedMetric(i)})`,
                                  clearable: "",
                                  class: "text-white compact-metrics-input",
                                  style: { "font-size": "0.72rem !important" },
                                  rules: [(o) => !o || Number.parseFloat(o) > 0 || "Must be > 0"]
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "rules"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024))), 128))
                      ], 64))), 128))
                    ])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })) : D2("", !0)
          ]),
          _: 1
        })
      ]),
      _: 1
    }));
  }
}, Jd = /* @__PURE__ */ co(Qd, [["__scopeId", "data-v-a76cbbb2"]]), e7 = 100, t7 = 1e9, n7 = 20, a7 = 2, r7 = {
  __name: "CreateRemesh",
  emits: ["close", "created"],
  setup(e, { emit: t }) {
    const n = t, { DataBaseStore: a, HybridViewerStore: r, importItem: i } = We("extensionAPI"), o = A0(), u = vn(), c = se(""), f = se(void 0), v = se(e7), h = se(!1), y = se({}), p = se({}), k = a.refAllItems(), S = se([]), w = se([]);
    let _, V;
    function A() {
      _?.unsubscribe(), V?.unsubscribe();
    }
    m3(A);
    const T = E(
      () => (k.value || []).filter((L) => ["BRep", "StructuralModel"].includes(L.geode_object_type)).map((L) => ({
        id: L.id,
        name: L.name,
        geode_object_type: L.geode_object_type,
        geode_id: L.geode_id
      }))
    );
    function O(L) {
      const X = r.hybridDb?.[L.geode_id || L.id]?.actor?.getBounds();
      if (!X || X.some((we) => Number.isNaN(we)))
        return;
      const re = Math.min(
        Math.abs(X[1] - X[0]),
        Math.abs(X[3] - X[2]),
        Math.abs(X[5] - X[4])
      );
      re > 0 && re < t7 && (v.value = Number.parseFloat(
        (re / n7).toFixed(a7)
      ));
    }
    be(f, (L) => {
      A(), S.value = [];
      const X = T.value.find((re) => re.id === L);
      X && ((!c.value || c.value.endsWith("_remeshed")) && (c.value = `${X.name}_remeshed`), O(X)), _ = lr(
        () => Nn.model_components.where("id").equals(L).toArray()
      ).subscribe((re) => S.value = re), Nn.model_components_relation && (V = lr(
        () => Nn.model_components_relation.where("id").equals(L).toArray()
      ).subscribe((re) => w.value = re));
    });
    const Y = E(() => {
      const L = new Map(
        u.relations.map((re) => [
          re.object_id,
          re.classification_id
        ])
      ), X = new Map(
        u.classifications.filter((re) => re.type).map((re) => [re.id, re.type])
      );
      return Array.from(S.value, (re) => {
        const we = L.get(re.geode_id), le = X.get(we);
        return {
          ...re,
          resolvedType: le ?? re.type
        };
      });
    }), F = E(
      () => Y.value.filter(
        (L) => L.resolvedType && !["corner", "line", "surface", "block", "mesh"].some(
          (X) => L.resolvedType.toLowerCase().includes(X)
        )
      )
    ), x = E(
      () => Y.value.filter(
        (L) => ["corner", "line", "surface", "block"].includes(L.resolvedType?.toLowerCase())
      )
    ), G = E(
      () => [...new Set(F.value.map((L) => L.resolvedType))].toSorted(
        (L, X) => L.localeCompare(X)
      )
    ), U = E(
      () => Object.groupBy(F.value, (L) => L.resolvedType)
    );
    function ee(L) {
      return L === void 0 || L === "" || Number.parseFloat(L) > 0;
    }
    const J = E(
      () => c.value && f.value && v.value > 0 && Object.values(y.value).every((L) => ee(L)) && Object.values(p.value).every((L) => ee(L))
    );
    function ae(L) {
      const X = w.value.find(
        (re) => re.child === L.geode_id
      )?.parent;
      return p.value[X] || y.value[L.resolvedType] || v.value;
    }
    async function oe() {
      const L = x.value.map((re) => {
        const we = Number.parseFloat(
          p.value[re.geode_id] > 0 ? p.value[re.geode_id] : ae(re)
        );
        return {
          id: re.geode_id,
          metric: we,
          type: re.resolvedType.toLowerCase()
        };
      }), X = {
        id: f.value,
        name: c.value,
        default: Number.parseFloat(v.value),
        corners: [],
        lines: [],
        surfaces: [],
        blocks: []
      };
      for (const { id: re, metric: we, type: le } of L)
        le.includes("corner") && data.corners.push({ id: re, metric: we }), le.includes("line") && data.lines.push({ id: re, metric: we }), le.includes("surface") && data.surfaces.push({ id: re, metric: we }), le.includes("block") && data.blocks.push({ id: re, metric: we });
      h.value = !0;
      try {
        const re = It.vease_modeling_back.model.remesh;
        await o.request(
          { schema: re, params: X },
          {
            response_function: async (we) => {
              await i(we), n("created");
            }
          }
        );
      } catch (re) {
        console.error("Remesh failed", re);
      } finally {
        h.value = !1;
      }
    }
    function te() {
      n("close");
    }
    return (L, X) => (Ne(), n2(A2, {
      "no-gutters": "",
      class: "fill-height flex-column overflow-hidden"
    }, {
      default: M(() => [
        g(Ye, {
          cols: "auto",
          class: "flex-shrink-0"
        }, {
          default: M(() => [
            g(Rr, { class: "pb-1 pt-3 align-center" }, {
              prepend: M(() => [
                g(rt, {
                  size: "32",
                  rounded: "0",
                  class: "me-2",
                  color: "transparent"
                }, {
                  default: M(() => [
                    g(gn, {
                      src: s2(E6),
                      cover: ""
                    }, null, 8, ["src"])
                  ]),
                  _: 1
                })
              ]),
              default: M(() => [
                g(d0, {
                  class: "text-subtitle-1 text-primary font-weight-bold",
                  style: { "line-height": "1.2" }
                }, {
                  default: M(() => [...X[3] || (X[3] = [
                    pe(" Remesh Model ", -1)
                  ])]),
                  _: 1
                }),
                g(fa, {
                  class: "ma-0 mt-0.5 opacity-70 flex-shrink-0 text-caption text-wrap",
                  style: { "font-size": "0.72rem !important", "line-height": "1.2" }
                }, {
                  default: M(() => [...X[4] || (X[4] = [
                    pe(" Create a new remeshed version of an existing model with custom metrics. ", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        g(Ye, { class: "overflow-y-auto pt-3" }, {
          default: M(() => [
            g(Dr, { class: "pa-0 px-4" }, {
              default: M(() => [
                g(jn, { ref: "form" }, {
                  default: M(() => [
                    g(P2, {
                      modelValue: c.value,
                      "onUpdate:modelValue": X[0] || (X[0] = (re) => c.value = re),
                      label: "New Model Name",
                      type: "text",
                      variant: "outlined",
                      color: "primary",
                      density: "compact",
                      "hide-details": "auto",
                      rules: [(re) => !!re || "Name is required"],
                      required: "",
                      class: "mb-3 text-caption rounded-lg"
                    }, {
                      "prepend-inner": M(() => [
                        g(ze, {
                          color: "primary",
                          size: "16"
                        }, {
                          default: M(() => [...X[5] || (X[5] = [
                            pe("mdi-format-title", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue", "rules"]),
                    g(mt, {
                      modelValue: f.value,
                      "onUpdate:modelValue": X[1] || (X[1] = (re) => f.value = re),
                      items: T.value,
                      "item-title": "name",
                      "item-value": "id",
                      label: "Source Model",
                      variant: "outlined",
                      color: "primary",
                      density: "compact",
                      "hide-details": "auto",
                      rules: [(re) => !!re || "Model selection is required"],
                      class: "mb-3 text-caption rounded-lg"
                    }, {
                      "prepend-inner": M(() => [
                        g(ze, {
                          color: "primary",
                          size: "16"
                        }, {
                          default: M(() => [...X[6] || (X[6] = [
                            pe("mdi-database", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue", "items", "rules"]),
                    f.value ? (Ne(), n2(P2, {
                      key: 0,
                      modelValue: v.value,
                      "onUpdate:modelValue": X[2] || (X[2] = (re) => v.value = re),
                      type: "number",
                      min: "0.0001",
                      step: "1",
                      label: "Default Mesh Size",
                      variant: "outlined",
                      color: "primary",
                      density: "compact",
                      "hide-details": "auto",
                      rules: [(re) => re > 0 || "Must be > 0"],
                      class: "mb-3 text-caption rounded-lg"
                    }, {
                      "prepend-inner": M(() => [
                        g(ze, {
                          color: "primary",
                          size: "16"
                        }, {
                          default: M(() => [...X[7] || (X[7] = [
                            pe("mdi-ruler", -1)
                          ])]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue", "rules"])) : D2("", !0),
                    f.value ? (Ne(), n2(Jd, {
                      key: 1,
                      "type-sizes": y.value,
                      "component-sizes": p.value,
                      "component-types": G.value,
                      "grouped-structural-components": U.value,
                      "default-metric": v.value,
                      "get-inherited-metric": ae
                    }, null, 8, ["type-sizes", "component-sizes", "component-types", "grouped-structural-components", "default-metric"])) : D2("", !0)
                  ]),
                  _: 1
                }, 512)
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        g(Ye, {
          cols: "auto",
          class: "flex-shrink-0"
        }, {
          default: M(() => [
            g(Wt, { class: "mx-4 mt-2" }),
            g(Mr, { class: "pa-3" }, {
              default: M(() => [
                g(Je, {
                  variant: "text",
                  color: "grey-darken-1",
                  size: "small",
                  onClick: te,
                  disabled: h.value,
                  rounded: "lg",
                  class: "text-caption"
                }, {
                  default: M(() => [...X[8] || (X[8] = [
                    pe(" Cancel ", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"]),
                g(jr),
                g(Je, {
                  color: "primary",
                  size: "small",
                  variant: "flat",
                  loading: h.value,
                  disabled: !J.value,
                  onClick: oe,
                  rounded: "lg",
                  class: "px-4 text-caption font-weight-bold"
                }, {
                  default: M(() => [...X[9] || (X[9] = [
                    pe(" Remesh Model ", -1)
                  ])]),
                  _: 1
                }, 8, ["loading", "disabled"])
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }));
  }
}, i7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: r7
}, Symbol.toStringTag, { value: "Module" }));
function Le(e, t) {
  return (n) => Object.keys(e).reduce((a, r) => {
    const o = typeof e[r] == "object" && e[r] != null && !Array.isArray(e[r]) ? e[r] : {
      type: e[r]
    };
    return n && r in n ? a[r] = {
      ...o,
      default: n[r]
    } : a[r] = o, t && !a[r].source && (a[r].source = t), a;
  }, {});
}
const S2 = Le({
  class: [String, Array, Object],
  style: {
    type: [String, Array, Object],
    default: null
  }
}, "component");
function an(e) {
  F0(`Vuetify: ${e}`);
}
function pu(e) {
  F0(`Vuetify error: ${e}`);
}
const Z2 = typeof window < "u", fo = Z2 && "IntersectionObserver" in window, l7 = Z2 && "matchMedia" in window && typeof window.matchMedia == "function", ea = () => l7 && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function _1(e, t, n) {
  o7(e, t), t.set(e, n);
}
function o7(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function P1(e, t, n) {
  return e.set(bu(e, t), n), n;
}
function Bt(e, t) {
  return e.get(bu(e, t));
}
function bu(e, t, n) {
  if (typeof e == "function" ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function Xe(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "px";
  if (e == null || e === "")
    return;
  const n = Number(e);
  return isNaN(n) ? String(e) : isFinite(n) ? `${n}${t}` : void 0;
}
function Cl(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e);
}
function V1(e) {
  let t;
  return e !== null && typeof e == "object" && ((t = Object.getPrototypeOf(e)) === Object.prototype || t === null);
}
function s7(e) {
  if (e && "$el" in e) {
    const t = e.$el;
    return t?.nodeType === Node.TEXT_NODE ? t.nextElementSibling : t;
  }
  return e;
}
function Gi(e, t) {
  return t.every((n) => e.hasOwnProperty(n));
}
function wu(e, t) {
  const n = {};
  for (const a of t)
    Object.prototype.hasOwnProperty.call(e, a) && (n[a] = e[a]);
  return n;
}
function I1(e, t, n) {
  const a = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  for (const i in e)
    t.some((o) => o instanceof RegExp ? o.test(i) : o === i) ? a[i] = e[i] : r[i] = e[i];
  return [a, r];
}
function ma(e, t) {
  const n = {
    ...e
  };
  return t.forEach((a) => delete n[a]), n;
}
const xu = /^on[^a-z]/, Su = (e) => xu.test(e), u7 = ["onAfterscriptexecute", "onAnimationcancel", "onAnimationend", "onAnimationiteration", "onAnimationstart", "onAuxclick", "onBeforeinput", "onBeforescriptexecute", "onChange", "onClick", "onCompositionend", "onCompositionstart", "onCompositionupdate", "onContextmenu", "onCopy", "onCut", "onDblclick", "onFocusin", "onFocusout", "onFullscreenchange", "onFullscreenerror", "onGesturechange", "onGestureend", "onGesturestart", "onGotpointercapture", "onInput", "onKeydown", "onKeypress", "onKeyup", "onLostpointercapture", "onMousedown", "onMousemove", "onMouseout", "onMouseover", "onMouseup", "onMousewheel", "onPaste", "onPointercancel", "onPointerdown", "onPointerenter", "onPointerleave", "onPointermove", "onPointerout", "onPointerover", "onPointerup", "onReset", "onSelect", "onSubmit", "onTouchcancel", "onTouchend", "onTouchmove", "onTouchstart", "onTransitioncancel", "onTransitionend", "onTransitionrun", "onTransitionstart", "onWheel"];
function c7(e) {
  const [t, n] = I1(e, [xu]), a = ma(t, u7), [r, i] = I1(n, ["class", "style", "id", "inert", /^data-/]);
  return Object.assign(r, t), Object.assign(i, a), [r, i];
}
function Kn(e) {
  return e == null ? [] : Array.isArray(e) ? e : [e];
}
function sn(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  return Math.max(t, Math.min(n, e));
}
function E1(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0";
  return e + n.repeat(Math.max(0, t - e.length));
}
function d7(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
  const n = [];
  let a = 0;
  for (; a < e.length; )
    n.push(e.substr(a, t)), a += t;
  return n;
}
function en() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 ? arguments[2] : void 0;
  const a = {};
  for (const r in e)
    a[r] = e[r];
  for (const r in t) {
    const i = e[r], o = t[r];
    if (V1(i) && V1(o)) {
      a[r] = en(i, o, n);
      continue;
    }
    if (n && Array.isArray(i) && Array.isArray(o)) {
      a[r] = n(i, o);
      continue;
    }
    a[r] = o;
  }
  return a;
}
function ku(e) {
  return e.map((t) => t.type === je ? ku(t.children) : t).flat();
}
function I0() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  if (I0.cache.has(e)) return I0.cache.get(e);
  const t = e.replace(/[^a-z]/gi, "-").replace(/\B([A-Z])/g, "-$1").toLowerCase();
  return I0.cache.set(e, t), t;
}
I0.cache = /* @__PURE__ */ new Map();
function Rn(e, t) {
  if (!t || typeof t != "object") return [];
  if (Array.isArray(t))
    return t.map((n) => Rn(e, n)).flat(1);
  if (t.suspense)
    return Rn(e, t.ssContent);
  if (Array.isArray(t.children))
    return t.children.map((n) => Rn(e, n)).flat(1);
  if (t.component) {
    if (Object.getOwnPropertyDescriptor(t.component.provides, e))
      return [t.component];
    if (t.component.subTree)
      return Rn(e, t.component.subTree).flat(1);
  }
  return [];
}
var X0 = /* @__PURE__ */ new WeakMap(), S0 = /* @__PURE__ */ new WeakMap();
class f7 {
  constructor(t) {
    _1(this, X0, []), _1(this, S0, 0), this.size = t;
  }
  get isFull() {
    return Bt(X0, this).length === this.size;
  }
  push(t) {
    Bt(X0, this)[Bt(S0, this)] = t, P1(S0, this, (Bt(S0, this) + 1) % this.size);
  }
  values() {
    return Bt(X0, this).slice(Bt(S0, this)).concat(Bt(X0, this).slice(0, Bt(S0, this)));
  }
  clear() {
    Bt(X0, this).length = 0, P1(S0, this, 0);
  }
}
function vo(e) {
  const t = ct({});
  b2(() => {
    const a = e();
    for (const r in a)
      t[r] = a[r];
  }, {
    flush: "sync"
  });
  const n = {};
  for (const a in t)
    n[a] = R(() => t[a]);
  return n;
}
function pr(e, t) {
  return e.includes(t);
}
function _u(e) {
  return e[2].toLowerCase() + e.slice(3);
}
const E0 = () => [Function, Array];
function A1(e, t) {
  return t = "on" + s0(t), !!(e[t] || e[`${t}Once`] || e[`${t}Capture`] || e[`${t}OnceCapture`] || e[`${t}CaptureOnce`]);
}
function Pu(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++)
    n[a - 1] = arguments[a];
  if (Array.isArray(e))
    for (const r of e)
      r(...n);
  else typeof e == "function" && e(...n);
}
function ar(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  const n = ["button", "[href]", 'input:not([type="hidden"])', "select", "textarea", "details:not(:has(> summary))", "details > summary", "[tabindex]", '[contenteditable]:not([contenteditable="false"])', "audio[controls]", "video[controls]"].map((r) => `${r}${t ? ':not([tabindex="-1"])' : ""}:not([disabled], [inert])`).join(", ");
  let a;
  try {
    a = [...e.querySelectorAll(n)];
  } catch (r) {
    return pu(String(r)), [];
  }
  return a.filter((r) => !r.closest("[inert]")).filter((r) => !!r.offsetParent || r.getClientRects().length > 0).filter((r) => !r.parentElement?.closest("details:not([open])") || r.tagName === "SUMMARY" && r.parentElement?.tagName === "DETAILS");
}
function v7(e, t) {
  if (!(Z2 && typeof CSS < "u" && typeof CSS.supports < "u" && CSS.supports(`selector(${t})`))) return null;
  try {
    return !!e && e.matches(t);
  } catch {
    return null;
  }
}
function m7(e, t) {
  if (!Z2 || e === 0)
    return t(), () => {
    };
  const n = window.setTimeout(t, e);
  return () => window.clearTimeout(n);
}
function pl() {
  const e = Ve(), t = (n) => {
    e.value = n;
  };
  return Object.defineProperty(t, "value", {
    enumerable: !0,
    get: () => e.value,
    set: (n) => e.value = n
  }), Object.defineProperty(t, "el", {
    enumerable: !0,
    get: () => s7(e.value)
  }), t;
}
function br(e) {
  return typeof e == "string" || typeof e == "number" || typeof e == "boolean" || typeof e == "bigint";
}
function g7(e) {
  const t = ["checked", "disabled"];
  return Object.fromEntries(Object.entries(e).filter((n) => {
    let [a, r] = n;
    return t.includes(a) ? !!r : r !== void 0;
  }));
}
function O2(e, t) {
  const n = p6();
  if (!n)
    throw new Error(`[Vuetify] ${e} must be called from inside a setup function`);
  return n;
}
function $t() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "composables";
  const t = O2(e).type;
  return I0(t?.aliasName || t?.name);
}
function h7(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : O2("injectSelf");
  const {
    provides: n
  } = t;
  if (n && e in n)
    return n[e];
}
const wr = /* @__PURE__ */ Symbol.for("vuetify:defaults");
function mo() {
  const e = We(wr);
  if (!e) throw new Error("[Vuetify] Could not find defaults instance");
  return e;
}
function go(e, t) {
  const n = mo(), a = se(e), r = E(() => {
    if (s2(t?.disabled)) return n.value;
    const o = s2(t?.scoped), u = s2(t?.reset), c = s2(t?.root);
    if (a.value == null && !(o || u || c)) return n.value;
    let f = en(a.value, {
      prev: n.value
    });
    if (o) return f;
    if (u || c) {
      const v = Number(u || 1 / 0);
      for (let h = 0; h <= v && !(!f || !("prev" in f)); h++)
        f = f.prev;
      return f && typeof c == "string" && c in f && (f = en(en(f, {
        prev: f
      }), f[c])), f;
    }
    return f.prev ? en(f.prev, f) : f;
  });
  return c2(wr, r), r;
}
function y7(e, t) {
  return e.props && (typeof e.props[t] < "u" || typeof e.props[I0(t)] < "u");
}
function C7() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : mo();
  const a = O2("useDefaults");
  if (t = t ?? a.type.name ?? a.type.__name, !t)
    throw new Error("[Vuetify] Could not determine component name");
  const r = E(() => n.value?.[e._as ?? t]), i = new Proxy(e, {
    get(c, f) {
      const v = Reflect.get(c, f);
      if (f === "class" || f === "style")
        return [r.value?.[f], v].filter((p) => p != null);
      if (y7(a.vnode, f)) return v;
      const h = r.value?.[f];
      if (h !== void 0) return h;
      const y = n.value?.global?.[f];
      return y !== void 0 ? y : v;
    }
  }), o = Ve();
  b2(() => {
    if (r.value) {
      const c = Object.entries(r.value).filter((f) => {
        let [v] = f;
        return v.startsWith(v[0].toUpperCase());
      });
      o.value = c.length ? Object.fromEntries(c) : void 0;
    } else
      o.value = void 0;
  });
  function u() {
    const c = h7(wr, a);
    c2(wr, E(() => o.value ? en(c?.value ?? {}, o.value) : c?.value));
  }
  return {
    props: i,
    provideSubDefaults: u
  };
}
const Vu = ["top", "bottom"], p7 = ["start", "end", "left", "right"];
function bl(e, t) {
  let [n, a] = e.split(" ");
  return a || (a = pr(Vu, n) ? "start" : pr(p7, n) ? "top" : "center"), {
    side: $1(n, t),
    align: $1(a, t)
  };
}
function $1(e, t) {
  return e === "start" ? t ? "right" : "left" : e === "end" ? t ? "left" : "right" : e;
}
function Zi(e) {
  return {
    side: {
      center: "center",
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }[e.side],
    align: e.align
  };
}
function Yi(e) {
  return {
    side: e.side,
    align: {
      center: "center",
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }[e.align]
  };
}
function T1(e) {
  return {
    side: e.align,
    align: e.side
  };
}
function O1(e) {
  return pr(Vu, e.side) ? "y" : "x";
}
class nt {
  constructor(t) {
    const n = document.body.currentCSSZoom ?? 1, a = t instanceof Element, r = a ? 1 + (1 - n) / n : 1, {
      x: i,
      y: o,
      width: u,
      height: c
    } = a ? t.getBoundingClientRect() : t;
    this.x = i * r, this.y = o * r, this.width = u * r, this.height = c * r;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
}
function F1(e, t) {
  return {
    x: {
      before: Math.max(0, t.left - e.left),
      after: Math.max(0, e.right - t.right)
    },
    y: {
      before: Math.max(0, t.top - e.top),
      after: Math.max(0, e.bottom - t.bottom)
    }
  };
}
function Iu(e) {
  if (Array.isArray(e)) {
    const t = document.body.currentCSSZoom ?? 1, n = 1 + (1 - t) / t;
    return new nt({
      x: e[0] * n,
      y: e[1] * n,
      width: 0 * n,
      height: 0 * n
    });
  } else
    return new nt(e);
}
function b7(e) {
  if (e === document.documentElement)
    if (visualViewport) {
      const t = document.body.currentCSSZoom ?? 1;
      return new nt({
        x: visualViewport.scale > 1 ? 0 : visualViewport.offsetLeft,
        y: visualViewport.scale > 1 ? 0 : visualViewport.offsetTop,
        width: visualViewport.width * visualViewport.scale / t,
        height: visualViewport.height * visualViewport.scale / t
      });
    } else
      return new nt({
        x: 0,
        y: 0,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      });
  else
    return new nt(e);
}
function ho(e) {
  const t = new nt(e), n = getComputedStyle(e), a = n.transform;
  if (a) {
    let r, i, o, u, c;
    if (a.startsWith("matrix3d("))
      r = a.slice(9, -1).split(/, /), i = Number(r[0]), o = Number(r[5]), u = Number(r[12]), c = Number(r[13]);
    else if (a.startsWith("matrix("))
      r = a.slice(7, -1).split(/, /), i = Number(r[0]), o = Number(r[3]), u = Number(r[4]), c = Number(r[5]);
    else
      return new nt(t);
    const f = n.transformOrigin, v = t.x - u - (1 - i) * parseFloat(f), h = t.y - c - (1 - o) * parseFloat(f.slice(f.indexOf(" ") + 1)), y = i ? t.width / i : e.offsetWidth + 1, p = o ? t.height / o : e.offsetHeight + 1;
    return new nt({
      x: v,
      y: h,
      width: y,
      height: p
    });
  } else
    return new nt(t);
}
function n0(e, t, n) {
  if (typeof e.animate > "u") return {
    finished: Promise.resolve()
  };
  let a;
  try {
    a = e.animate(t, n);
  } catch {
    return {
      finished: Promise.resolve()
    };
  }
  return typeof a.finished > "u" && (a.finished = new Promise((r) => {
    a.onfinish = () => {
      r(a);
    };
  })), a;
}
const rr = /* @__PURE__ */ new WeakMap();
function w7(e, t) {
  Object.keys(t).forEach((n) => {
    if (Su(n)) {
      const a = _u(n), r = rr.get(e);
      if (t[n] == null)
        r?.forEach((i) => {
          const [o, u] = i;
          o === a && (e.removeEventListener(a, u), r.delete(i));
        });
      else if (!r || ![...r].some((i) => i[0] === a && i[1] === t[n])) {
        e.addEventListener(a, t[n]);
        const i = r || /* @__PURE__ */ new Set();
        i.add([a, t[n]]), rr.has(e) || rr.set(e, i);
      }
    } else
      t[n] == null ? e.removeAttribute(n) : e.setAttribute(n, t[n]);
  });
}
function x7(e, t) {
  Object.keys(t).forEach((n) => {
    if (Su(n)) {
      const a = _u(n), r = rr.get(e);
      r?.forEach((i) => {
        const [o, u] = i;
        o === a && (e.removeEventListener(a, u), r.delete(i));
      });
    } else
      e.removeAttribute(n);
  });
}
const Q0 = 2.4, L1 = 0.2126729, B1 = 0.7151522, M1 = 0.072175, S7 = 0.55, k7 = 0.58, _7 = 0.57, P7 = 0.62, Xa = 0.03, R1 = 1.45, V7 = 5e-4, I7 = 1.25, E7 = 1.25, D1 = 0.078, N1 = 12.82051282051282, Qa = 0.06, z1 = 1e-3;
function j1(e, t) {
  const n = (e.r / 255) ** Q0, a = (e.g / 255) ** Q0, r = (e.b / 255) ** Q0, i = (t.r / 255) ** Q0, o = (t.g / 255) ** Q0, u = (t.b / 255) ** Q0;
  let c = n * L1 + a * B1 + r * M1, f = i * L1 + o * B1 + u * M1;
  if (c <= Xa && (c += (Xa - c) ** R1), f <= Xa && (f += (Xa - f) ** R1), Math.abs(f - c) < V7) return 0;
  let v;
  if (f > c) {
    const h = (f ** S7 - c ** k7) * I7;
    v = h < z1 ? 0 : h < D1 ? h - h * N1 * Qa : h - Qa;
  } else {
    const h = (f ** P7 - c ** _7) * E7;
    v = h > -z1 ? 0 : h > -D1 ? h - h * N1 * Qa : h + Qa;
  }
  return v * 100;
}
function wl(e) {
  return !!e && /^(#|var\(--|(rgb|hsl)a?\()/.test(e);
}
function A7(e) {
  return wl(e) && !/^((rgb|hsl)a?\()?var\(--/.test(e);
}
const K1 = /^(?<fn>(?:rgb|hsl)a?)\((?<values>.+)\)/, $7 = {
  rgb: (e, t, n, a) => ({
    r: e,
    g: t,
    b: n,
    a
  }),
  rgba: (e, t, n, a) => ({
    r: e,
    g: t,
    b: n,
    a
  }),
  hsl: (e, t, n, a) => W1({
    h: e,
    s: t,
    l: n,
    a
  }),
  hsla: (e, t, n, a) => W1({
    h: e,
    s: t,
    l: n,
    a
  }),
  hsv: (e, t, n, a) => ta({
    h: e,
    s: t,
    v: n,
    a
  }),
  hsva: (e, t, n, a) => ta({
    h: e,
    s: t,
    v: n,
    a
  })
};
function Dn(e) {
  if (typeof e == "number")
    return (isNaN(e) || e < 0 || e > 16777215) && an(`'${e}' is not a valid hex color`), {
      r: (e & 16711680) >> 16,
      g: (e & 65280) >> 8,
      b: e & 255
    };
  if (typeof e == "string" && K1.test(e)) {
    const {
      groups: t
    } = e.match(K1), {
      fn: n,
      values: a
    } = t, r = a.split(/,\s*|\s*\/\s*|\s+/).map((i, o) => i.endsWith("%") || // unitless slv are %
    o > 0 && o < 3 && ["hsl", "hsla", "hsv", "hsva"].includes(n) ? parseFloat(i) / 100 : parseFloat(i));
    return $7[n](...r);
  } else if (typeof e == "string") {
    let t = e.startsWith("#") ? e.slice(1) : e;
    [3, 4].includes(t.length) ? t = t.split("").map((a) => a + a).join("") : [6, 8].includes(t.length) || an(`'${e}' is not a valid hex(a) color`);
    const n = parseInt(t, 16);
    return (isNaN(n) || n < 0 || n > 4294967295) && an(`'${e}' is not a valid hex(a) color`), T7(t);
  } else if (typeof e == "object") {
    if (Gi(e, ["r", "g", "b"]))
      return e;
    if (Gi(e, ["h", "s", "l"]))
      return ta(Eu(e));
    if (Gi(e, ["h", "s", "v"]))
      return ta(e);
  }
  throw new TypeError(`Invalid color: ${e == null ? e : String(e) || e.constructor.name}
Expected #hex, #hexa, rgb(), rgba(), hsl(), hsla(), object or number`);
}
function ta(e) {
  const {
    h: t,
    s: n,
    v: a,
    a: r
  } = e, i = (u) => {
    const c = (u + t / 60) % 6;
    return a - a * n * Math.max(Math.min(c, 4 - c, 1), 0);
  }, o = [i(5), i(3), i(1)].map((u) => Math.round(u * 255));
  return {
    r: o[0],
    g: o[1],
    b: o[2],
    a: r
  };
}
function W1(e) {
  return ta(Eu(e));
}
function Eu(e) {
  const {
    h: t,
    s: n,
    l: a,
    a: r
  } = e, i = a + n * Math.min(a, 1 - a), o = i === 0 ? 0 : 2 - 2 * a / i;
  return {
    h: t,
    s: o,
    v: i,
    a: r
  };
}
function T7(e) {
  e = O7(e);
  let [t, n, a, r] = d7(e, 2).map((i) => parseInt(i, 16));
  return r = r === void 0 ? r : r / 255, {
    r: t,
    g: n,
    b: a,
    a: r
  };
}
function O7(e) {
  return e.startsWith("#") && (e = e.slice(1)), e = e.replace(/([^0-9a-f])/gi, "F"), (e.length === 3 || e.length === 4) && (e = e.split("").map((t) => t + t).join("")), e.length !== 6 && (e = E1(E1(e, 6), 8, "F")), e;
}
function F7(e) {
  const t = Math.abs(j1(Dn(0), Dn(e)));
  return Math.abs(j1(Dn(16777215), Dn(e))) > Math.min(t, 50) ? "#fff" : "#000";
}
function Wr(e) {
  if (e._setup = e._setup ?? e.setup, !e.name)
    return an("The component is missing an explicit name, unable to generate default prop value"), e;
  if (e._setup) {
    e.props = Le(e.props ?? {}, e.name)();
    const t = Object.keys(e.props).filter((n) => n !== "class" && n !== "style");
    e.filterProps = function(a) {
      return wu(a, t);
    }, e.props._as = String, e.setup = function(a, r) {
      const i = mo();
      if (!i.value) return e._setup(a, r);
      const {
        props: o,
        provideSubDefaults: u
      } = C7(a, a._as ?? e.name, i), c = e._setup(o, r);
      return u(), c;
    };
  }
  return e;
}
function o2() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0;
  return (t) => (e ? Wr : b6)(t);
}
function Au(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "div", n = arguments.length > 2 ? arguments[2] : void 0;
  return o2()({
    name: n ?? s0(Er(e.replace(/__/g, "-"))),
    props: {
      tag: {
        type: String,
        default: t
      },
      ...S2()
    },
    setup(a, r) {
      let {
        slots: i
      } = r;
      return () => Et(a.tag, {
        class: [e, a.class],
        style: a.style
      }, i.default?.());
    }
  });
}
function L7(e, t, n, a) {
  if (!n || br(e) || br(t)) return;
  const r = n.get(e);
  if (r)
    r.set(t, a);
  else {
    const i = /* @__PURE__ */ new WeakMap();
    i.set(t, a), n.set(e, i);
  }
}
function B7(e, t, n) {
  if (!n || br(e) || br(t)) return null;
  const a = n.get(e)?.get(t);
  if (typeof a == "boolean") return a;
  const r = n.get(t)?.get(e);
  return typeof r == "boolean" ? r : null;
}
function rn(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : /* @__PURE__ */ new WeakMap();
  if (e === t) return !0;
  if (e instanceof Date && t instanceof Date && e.getTime() !== t.getTime() || e !== Object(e) || t !== Object(t))
    return !1;
  const a = Object.keys(e);
  if (a.length !== Object.keys(t).length)
    return !1;
  const r = B7(e, t, n);
  return r || (L7(e, t, n, !0), a.every((i) => rn(e[i], t[i], n)));
}
function $u(e) {
  if (typeof e.getRootNode != "function") {
    for (; e.parentNode; ) e = e.parentNode;
    return e !== document ? null : document;
  }
  const t = e.getRootNode();
  return t !== document && t.getRootNode({
    composed: !0
  }) !== document ? null : t;
}
const xr = "cubic-bezier(0.4, 0, 0.2, 1)", q1 = "cubic-bezier(0.0, 0, 0.2, 1)", H1 = "cubic-bezier(0.4, 0, 1, 1)";
function M7(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
  for (; e; ) {
    if (t ? R7(e) : yo(e)) return e;
    e = e.parentElement;
  }
  return document.scrollingElement;
}
function Sr(e, t) {
  const n = [];
  if (t && e && !t.contains(e)) return n;
  for (; e && (yo(e) && n.push(e), e !== t); )
    e = e.parentElement;
  return n;
}
function yo(e) {
  if (!e || e.nodeType !== Node.ELEMENT_NODE) return !1;
  const t = window.getComputedStyle(e), n = t.overflowY === "scroll" || t.overflowY === "auto" && e.scrollHeight > e.clientHeight, a = t.overflowX === "scroll" || t.overflowX === "auto" && e.scrollWidth > e.clientWidth;
  return n || a;
}
function R7(e) {
  if (!e || e.nodeType !== Node.ELEMENT_NODE) return !1;
  const t = window.getComputedStyle(e);
  return ["scroll", "auto"].includes(t.overflowY);
}
function D7(e) {
  for (; e; ) {
    if (window.getComputedStyle(e).position === "fixed")
      return !0;
    e = e.offsetParent;
  }
  return !1;
}
function h2(e) {
  const t = O2("useRender");
  t.render = e;
}
const St = Le({
  tag: {
    type: [String, Object, Function],
    default: "div"
  }
}, "tag"), N7 = Le({
  ...S2(),
  ...St()
}, "VCardActions"), xl = o2()({
  name: "VCardActions",
  props: N7(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return go({
      VBtn: {
        slim: !0,
        variant: "text"
      }
    }), h2(() => g(e.tag, {
      class: ve(["v-card-actions", e.class]),
      style: Ee(e.style)
    }, n)), {};
  }
}), z7 = Le({
  opacity: [Number, String],
  ...S2(),
  ...St()
}, "VCardSubtitle"), j7 = o2()({
  name: "VCardSubtitle",
  props: z7(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return h2(() => g(e.tag, {
      class: ve(["v-card-subtitle", e.class]),
      style: Ee([{
        "--v-card-subtitle-opacity": e.opacity
      }, e.style])
    }, n)), {};
  }
}), Sl = Au("v-card-title"), K7 = Le({
  defaults: Object,
  disabled: Boolean,
  reset: [Number, String],
  root: [Boolean, String],
  scoped: Boolean
}, "VDefaultsProvider"), zt = o2(!1)({
  name: "VDefaultsProvider",
  props: K7(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      defaults: a,
      disabled: r,
      reset: i,
      root: o,
      scoped: u
    } = Ol(e);
    return go(a, {
      reset: i,
      root: o,
      scoped: u,
      disabled: r
    }), () => n.default?.();
  }
});
function Co(e) {
  return vo(() => {
    const {
      class: t,
      style: n
    } = q7(e);
    return {
      colorClasses: t,
      colorStyles: n
    };
  });
}
function un(e) {
  const {
    colorClasses: t,
    colorStyles: n
  } = Co(() => ({
    text: u2(e)
  }));
  return {
    textColorClasses: t,
    textColorStyles: n
  };
}
function ln(e) {
  const {
    colorClasses: t,
    colorStyles: n
  } = Co(() => ({
    background: u2(e)
  }));
  return {
    backgroundColorClasses: t,
    backgroundColorStyles: n
  };
}
function W7(e) {
  return {
    text: typeof e.text == "string" ? e.text.replace(/^text-/, "") : e.text,
    background: typeof e.background == "string" ? e.background.replace(/^bg-/, "") : e.background
  };
}
function q7(e) {
  const t = W7(u2(e)), n = [], a = {};
  if (t.background)
    if (wl(t.background)) {
      if (a.backgroundColor = t.background, !t.text && A7(t.background)) {
        const r = Dn(t.background);
        if (r.a == null || r.a === 1) {
          const i = F7(r);
          a.color = i, a.caretColor = i;
        }
      }
    } else
      n.push(`bg-${t.background}`);
  return t.text && (wl(t.text) ? (a.color = t.text, a.caretColor = t.text) : n.push(`text-${t.text}`)), {
    class: n,
    style: a
  };
}
const U2 = [String, Function, Object, Array], H7 = /* @__PURE__ */ Symbol.for("vuetify:icons"), qr = Le({
  icon: {
    type: U2
  },
  // Could not remove this and use makeTagProps, types complained because it is not required
  tag: {
    type: [String, Object, Function],
    required: !0
  }
}, "icon"), U1 = o2()({
  name: "VComponentIcon",
  props: qr(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return () => {
      const a = e.icon;
      return g(e.tag, null, {
        default: () => [e.icon ? g(a, null, null) : n.default?.()]
      });
    };
  }
}), U7 = Wr({
  name: "VSvgIcon",
  inheritAttrs: !1,
  props: qr(),
  setup(e, t) {
    let {
      attrs: n
    } = t;
    return () => g(e.tag, me(n, {
      style: null
    }), {
      default: () => [I("svg", {
        class: "v-icon__svg",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        role: "img",
        "aria-hidden": "true"
      }, [Array.isArray(e.icon) ? e.icon.map((a) => Array.isArray(a) ? I("path", {
        d: a[0],
        "fill-opacity": a[1]
      }, null) : I("path", {
        d: a
      }, null)) : I("path", {
        d: e.icon
      }, null)])]
    });
  }
});
Wr({
  name: "VLigatureIcon",
  props: qr(),
  setup(e) {
    return () => g(e.tag, null, {
      default: () => [e.icon]
    });
  }
});
Wr({
  name: "VClassIcon",
  props: qr(),
  setup(e) {
    return () => g(e.tag, {
      class: ve(e.icon)
    }, null);
  }
});
const G7 = (e) => {
  const t = We(H7);
  if (!t) throw new Error("Missing Vuetify Icons provide!");
  return {
    iconData: E(() => {
      const a = u2(e);
      if (!a) return {
        component: U1
      };
      let r = a;
      if (typeof r == "string" && (r = r.trim(), r.startsWith("$") && (r = t.aliases?.[r.slice(1)])), r || an(`Could not find aliased icon "${a}"`), Array.isArray(r))
        return {
          component: U7,
          icon: r
        };
      if (typeof r != "string")
        return {
          component: U1,
          icon: r
        };
      const i = Object.keys(t.sets).find((c) => typeof r == "string" && r.startsWith(`${c}:`)), o = i ? r.slice(i.length + 1) : r;
      return {
        component: t.sets[i ?? t.defaultSet].component,
        icon: o
      };
    })
  };
}, Z7 = ["x-small", "small", "default", "large", "x-large"], Hr = Le({
  size: {
    type: [String, Number],
    default: "default"
  }
}, "size");
function Ur(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : $t();
  return vo(() => {
    const n = e.size;
    let a, r;
    return pr(Z7, n) ? a = `${t}--size-${n}` : n && (r = {
      width: Xe(n),
      height: Xe(n)
    }), {
      sizeClasses: a,
      sizeStyles: r
    };
  });
}
const kl = /* @__PURE__ */ Symbol.for("vuetify:theme"), kt = Le({
  theme: String
}, "theme");
function Gt(e) {
  O2("provideTheme");
  const t = We(kl, null);
  if (!t) throw new Error("Could not find Vuetify theme injection");
  const n = R(() => e.theme ?? t.name.value), a = R(() => t.themes.value[n.value]), r = R(() => t.isDisabled ? void 0 : `${t.prefix}theme--${n.value}`), i = {
    ...t,
    name: n,
    current: a,
    themeClasses: r
  };
  return c2(kl, i), i;
}
function Y7() {
  O2("useTheme");
  const e = We(kl, null);
  if (!e) throw new Error("Could not find Vuetify theme injection");
  return e;
}
const X7 = Le({
  color: String,
  disabled: Boolean,
  start: Boolean,
  end: Boolean,
  icon: U2,
  opacity: [String, Number],
  ...S2(),
  ...Hr(),
  ...St({
    tag: "i"
  }),
  ...kt()
}, "VIcon"), J2 = o2()({
  name: "VIcon",
  props: X7(),
  setup(e, t) {
    let {
      attrs: n,
      slots: a
    } = t;
    const r = Ve(), {
      themeClasses: i
    } = Y7(), {
      iconData: o
    } = G7(() => r.value || e.icon), {
      sizeClasses: u
    } = Ur(e), {
      textColorClasses: c,
      textColorStyles: f
    } = un(() => e.color);
    return h2(() => {
      const v = a.default?.();
      v && (r.value = ku(v).filter((y) => y.type === w6 && y.children && typeof y.children == "string")[0]?.children);
      const h = !!(n.onClick || n.onClickOnce);
      return g(o.value.component, {
        tag: e.tag,
        icon: o.value.icon,
        class: ve(["v-icon", "notranslate", i.value, u.value, c.value, {
          "v-icon--clickable": h,
          "v-icon--disabled": e.disabled,
          "v-icon--start": e.start,
          "v-icon--end": e.end
        }, e.class]),
        style: Ee([{
          "--v-icon-opacity": e.opacity
        }, u.value ? void 0 : {
          fontSize: Xe(e.size),
          height: Xe(e.size),
          width: Xe(e.size)
        }, f.value, e.style]),
        role: h ? "button" : void 0,
        "aria-hidden": !h,
        tabindex: h ? e.disabled ? -1 : 0 : void 0
      }, {
        default: () => [v]
      });
    }), {};
  }
}), ga = Le({
  height: [Number, String],
  maxHeight: [Number, String],
  maxWidth: [Number, String],
  minHeight: [Number, String],
  minWidth: [Number, String],
  width: [Number, String]
}, "dimension");
function ha(e) {
  return {
    dimensionStyles: E(() => {
      const n = {}, a = Xe(e.height), r = Xe(e.maxHeight), i = Xe(e.maxWidth), o = Xe(e.minHeight), u = Xe(e.minWidth), c = Xe(e.width);
      return a != null && (n.height = a), r != null && (n.maxHeight = r), i != null && (n.maxWidth = i), o != null && (n.minHeight = o), u != null && (n.minWidth = u), c != null && (n.width = c), n;
    })
  };
}
function Q7(e) {
  return {
    aspectStyles: E(() => {
      const t = Number(e.aspectRatio);
      return t ? {
        paddingBottom: String(1 / t * 100) + "%"
      } : void 0;
    })
  };
}
const Tu = Le({
  aspectRatio: [String, Number],
  contentClass: null,
  inline: Boolean,
  ...S2(),
  ...ga()
}, "VResponsive"), G1 = o2()({
  name: "VResponsive",
  props: Tu(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      aspectStyles: a
    } = Q7(e), {
      dimensionStyles: r
    } = ha(e);
    return h2(() => I("div", {
      class: ve(["v-responsive", {
        "v-responsive--inline": e.inline
      }, e.class]),
      style: Ee([r.value, e.style])
    }, [I("div", {
      class: "v-responsive__sizer",
      style: Ee(a.value)
    }, null), n.additional?.(), n.default && I("div", {
      class: ve(["v-responsive__content", e.contentClass])
    }, [n.default()])])), {};
  }
}), M0 = Le({
  rounded: {
    type: [Boolean, Number, String],
    default: void 0
  },
  tile: Boolean
}, "rounded");
function R0(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : $t();
  return {
    roundedClasses: E(() => {
      const a = on(e) ? e.value : e.rounded, r = on(e) ? !1 : e.tile, i = [];
      if (r || a === !1)
        i.push("rounded-0");
      else if (a === !0 || a === "")
        i.push(`${t}--rounded`);
      else if (typeof a == "string" || a === 0)
        for (const o of String(a).split(" "))
          i.push(`rounded-${o}`);
      return i;
    })
  };
}
const Gr = Le({
  transition: {
    type: null,
    default: "fade-transition",
    validator: (e) => e !== !0
  }
}, "transition"), _0 = (e, t) => {
  let {
    slots: n
  } = t;
  const {
    transition: a,
    disabled: r,
    group: i,
    ...o
  } = e, {
    component: u = i ? cn : G2,
    ...c
  } = Cl(a) ? a : {};
  let f;
  return Cl(a) ? f = me(c, g7({
    disabled: r,
    group: i
  }), o) : f = me({
    name: r || !a ? "" : a
  }, o), Et(u, f, n);
};
function Z1(e, t) {
  if (!fo) return;
  const n = t.modifiers || {}, a = t.value, {
    handler: r,
    options: i
  } = typeof a == "object" ? a : {
    handler: a,
    options: {}
  }, o = new IntersectionObserver(function() {
    let u = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], c = arguments.length > 1 ? arguments[1] : void 0;
    const f = e._observe?.[t.instance.$.uid];
    if (!f) return;
    const v = u.some((h) => h.isIntersecting);
    r && (!n.quiet || f.init) && (!n.once || v || f.init) && r(v, u, c), v && n.once ? _l(e, t) : f.init = !0;
  }, i);
  e._observe = Object(e._observe), e._observe[t.instance.$.uid] = {
    init: !1,
    observer: o
  }, o.observe(e);
}
function _l(e, t) {
  const n = e._observe?.[t.instance.$.uid];
  n && (n.observer.unobserve(e), delete e._observe[t.instance.$.uid]);
}
const kr = {
  mounted: Z1,
  unmounted: _l,
  updated: (e, t) => {
    e._observe?.[t.instance.$.uid] && (_l(e, t), Z1(e, t));
  }
}, J7 = Le({
  absolute: Boolean,
  alt: String,
  cover: Boolean,
  color: String,
  draggable: {
    type: [Boolean, String],
    default: void 0
  },
  eager: Boolean,
  gradient: String,
  imageClass: null,
  lazySrc: String,
  options: {
    type: Object,
    // For more information on types, navigate to:
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    default: () => ({
      root: void 0,
      rootMargin: void 0,
      threshold: void 0
    })
  },
  sizes: String,
  src: {
    type: [String, Object],
    default: ""
  },
  crossorigin: String,
  referrerpolicy: String,
  srcset: String,
  position: String,
  ...Tu(),
  ...S2(),
  ...M0(),
  ...Gr()
}, "VImg"), Ou = o2()({
  name: "VImg",
  directives: {
    vIntersect: kr
  },
  props: J7(),
  emits: {
    loadstart: (e) => !0,
    load: (e) => !0,
    error: (e) => !0
  },
  setup(e, t) {
    let {
      emit: n,
      slots: a
    } = t;
    const {
      backgroundColorClasses: r,
      backgroundColorStyles: i
    } = ln(() => e.color), {
      roundedClasses: o
    } = R0(e), u = O2("VImg"), c = Ve(""), f = se(), v = Ve(e.eager ? "loading" : "idle"), h = Ve(), y = Ve(), p = E(() => e.src && typeof e.src == "object" ? {
      src: e.src.src,
      srcset: e.srcset || e.src.srcset,
      lazySrc: e.lazySrc || e.src.lazySrc,
      aspect: Number(e.aspectRatio || e.src.aspect || 0)
    } : {
      src: e.src,
      srcset: e.srcset,
      lazySrc: e.lazySrc,
      aspect: Number(e.aspectRatio || 0)
    }), k = E(() => p.value.aspect || h.value / y.value || 0);
    be(() => e.src, () => {
      S(v.value !== "idle");
    }), be(k, (J, ae) => {
      !J && ae && f.value && T(f.value);
    }), dn(() => S());
    function S(J) {
      if (!(e.eager && J) && !(fo && !J && !e.eager)) {
        if (v.value = "loading", p.value.lazySrc) {
          const ae = new Image();
          ae.src = p.value.lazySrc, T(ae, null);
        }
        p.value.src && e2(() => {
          n("loadstart", f.value?.currentSrc || p.value.src), setTimeout(() => {
            if (!u.isUnmounted)
              if (f.value?.complete) {
                if (f.value.naturalWidth || _(), v.value === "error") return;
                k.value || T(f.value, null), v.value === "loading" && w();
              } else
                k.value || T(f.value), V();
          });
        });
      }
    }
    function w() {
      u.isUnmounted || (V(), T(f.value), v.value = "loaded", n("load", f.value?.currentSrc || p.value.src));
    }
    function _() {
      u.isUnmounted || (v.value = "error", n("error", f.value?.currentSrc || p.value.src));
    }
    function V() {
      const J = f.value;
      J && (c.value = J.currentSrc || J.src);
    }
    let A = -1;
    W2(() => {
      clearTimeout(A);
    });
    function T(J) {
      let ae = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100;
      const oe = () => {
        if (clearTimeout(A), u.isUnmounted) return;
        const {
          naturalHeight: te,
          naturalWidth: L
        } = J;
        te || L ? (h.value = L, y.value = te) : !J.complete && v.value === "loading" && ae != null ? A = window.setTimeout(oe, ae) : (J.currentSrc.endsWith(".svg") || J.currentSrc.startsWith("data:image/svg+xml")) && (h.value = 1, y.value = 1);
      };
      oe();
    }
    const O = R(() => ({
      "v-img__img--cover": e.cover,
      "v-img__img--contain": !e.cover
    })), Y = () => {
      if (!p.value.src || v.value === "idle") return null;
      const J = I("img", {
        class: ve(["v-img__img", O.value, e.imageClass]),
        style: {
          objectPosition: e.position
        },
        crossorigin: e.crossorigin,
        src: p.value.src,
        srcset: p.value.srcset,
        alt: e.alt,
        referrerpolicy: e.referrerpolicy,
        draggable: e.draggable,
        sizes: e.sizes,
        ref: f,
        onLoad: w,
        onError: _
      }, null), ae = a.sources?.();
      return g(_0, {
        transition: e.transition,
        appear: !0
      }, {
        default: () => [g2(ae ? I("picture", {
          class: "v-img__picture"
        }, [ae, J]) : J, [[dt, v.value === "loaded"]])]
      });
    }, F = () => g(_0, {
      transition: e.transition
    }, {
      default: () => [p.value.lazySrc && v.value !== "loaded" && I("img", {
        class: ve(["v-img__img", "v-img__img--preload", O.value]),
        style: {
          objectPosition: e.position
        },
        crossorigin: e.crossorigin,
        src: p.value.lazySrc,
        alt: e.alt,
        referrerpolicy: e.referrerpolicy,
        draggable: e.draggable
      }, null)]
    }), x = () => a.placeholder ? g(_0, {
      transition: e.transition,
      appear: !0
    }, {
      default: () => [(v.value === "loading" || v.value === "error" && !a.error) && I("div", {
        class: "v-img__placeholder"
      }, [a.placeholder()])]
    }) : null, G = () => a.error ? g(_0, {
      transition: e.transition,
      appear: !0
    }, {
      default: () => [v.value === "error" && I("div", {
        class: "v-img__error"
      }, [a.error()])]
    }) : null, U = () => e.gradient ? I("div", {
      class: "v-img__gradient",
      style: {
        backgroundImage: `linear-gradient(${e.gradient})`
      }
    }, null) : null, ee = Ve(!1);
    {
      const J = be(k, (ae) => {
        ae && (requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ee.value = !0;
          });
        }), J());
      });
    }
    return h2(() => {
      const J = G1.filterProps(e);
      return g2(g(G1, me({
        class: ["v-img", {
          "v-img--absolute": e.absolute,
          "v-img--booting": !ee.value,
          "v-img--fit-content": e.width === "fit-content"
        }, r.value, o.value, e.class],
        style: [{
          width: Xe(e.width === "auto" ? h.value : e.width)
        }, i.value, e.style]
      }, J, {
        aspectRatio: k.value,
        "aria-label": e.alt,
        role: e.alt ? "img" : void 0
      }), {
        additional: () => I(je, null, [g(Y, null, null), g(F, null, null), g(U, null, null), g(x, null, null), g(G, null, null)]),
        default: a.default
      }), [[kr, {
        handler: S,
        options: e.options
      }, null, {
        once: !0
      }]]);
    }), {
      currentSrc: c,
      image: f,
      state: v,
      naturalWidth: h,
      naturalHeight: y
    };
  }
}), Zr = Le({
  border: [Boolean, Number, String]
}, "border");
function Yr(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : $t();
  return {
    borderClasses: E(() => {
      const a = e.border;
      return a === !0 || a === "" ? `${t}--border` : typeof a == "string" || a === 0 ? String(a).split(" ").map((r) => `border-${r}`) : [];
    })
  };
}
const ef = [null, "default", "comfortable", "compact"], hn = Le({
  density: {
    type: String,
    default: "default",
    validator: (e) => ef.includes(e)
  }
}, "density");
function ya(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : $t();
  return {
    densityClasses: R(() => `${t}--density-${e.density}`)
  };
}
const tf = ["elevated", "flat", "tonal", "outlined", "text", "plain"];
function po(e, t) {
  return I(je, null, [e && I("span", {
    key: "overlay",
    class: ve(`${t}__overlay`)
  }, null), I("span", {
    key: "underlay",
    class: ve(`${t}__underlay`)
  }, null)]);
}
const Xr = Le({
  color: String,
  variant: {
    type: String,
    default: "elevated",
    validator: (e) => tf.includes(e)
  }
}, "variant");
function bo(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : $t();
  const n = R(() => {
    const {
      variant: i
    } = u2(e);
    return `${t}--variant-${i}`;
  }), {
    colorClasses: a,
    colorStyles: r
  } = Co(() => {
    const {
      variant: i,
      color: o
    } = u2(e);
    return {
      [["elevated", "flat"].includes(i) ? "background" : "text"]: o
    };
  });
  return {
    colorClasses: a,
    colorStyles: r,
    variantClasses: n
  };
}
const nf = Le({
  start: Boolean,
  end: Boolean,
  icon: U2,
  image: String,
  text: String,
  ...Zr(),
  ...S2(),
  ...hn(),
  ...M0(),
  ...Hr(),
  ...St(),
  ...kt(),
  ...Xr({
    variant: "flat"
  })
}, "VAvatar"), Y1 = o2()({
  name: "VAvatar",
  props: nf(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: a
    } = Gt(e), {
      borderClasses: r
    } = Yr(e), {
      colorClasses: i,
      colorStyles: o,
      variantClasses: u
    } = bo(e), {
      densityClasses: c
    } = ya(e), {
      roundedClasses: f
    } = R0(e), {
      sizeClasses: v,
      sizeStyles: h
    } = Ur(e);
    return h2(() => g(e.tag, {
      class: ve(["v-avatar", {
        "v-avatar--start": e.start,
        "v-avatar--end": e.end
      }, a.value, r.value, i.value, c.value, f.value, v.value, u.value, e.class]),
      style: Ee([o.value, h.value, e.style])
    }, {
      default: () => [n.default ? g(zt, {
        key: "content-defaults",
        defaults: {
          VImg: {
            cover: !0,
            src: e.image
          },
          VIcon: {
            icon: e.icon
          }
        }
      }, {
        default: () => [n.default()]
      }) : e.image ? g(Ou, {
        key: "image",
        src: e.image,
        alt: "",
        cover: !0
      }, null) : e.icon ? g(J2, {
        key: "icon",
        icon: e.icon
      }, null) : e.text, po(!1, "v-avatar")]
    })), {};
  }
}), af = Le({
  appendAvatar: String,
  appendIcon: U2,
  prependAvatar: String,
  prependIcon: U2,
  subtitle: {
    type: [String, Number, Boolean],
    default: void 0
  },
  title: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...S2(),
  ...hn(),
  ...St()
}, "VCardItem"), rf = o2()({
  name: "VCardItem",
  props: af(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return h2(() => {
      const a = !!(e.prependAvatar || e.prependIcon), r = !!(a || n.prepend), i = !!(e.appendAvatar || e.appendIcon), o = !!(i || n.append), u = !!(e.title != null || n.title), c = !!(e.subtitle != null || n.subtitle);
      return g(e.tag, {
        class: ve(["v-card-item", e.class]),
        style: Ee(e.style)
      }, {
        default: () => [r && I("div", {
          key: "prepend",
          class: "v-card-item__prepend"
        }, [n.prepend ? g(zt, {
          key: "prepend-defaults",
          disabled: !a,
          defaults: {
            VAvatar: {
              density: e.density,
              image: e.prependAvatar
            },
            VIcon: {
              density: e.density,
              icon: e.prependIcon
            }
          }
        }, n.prepend) : I(je, null, [e.prependAvatar && g(Y1, {
          key: "prepend-avatar",
          density: e.density,
          image: e.prependAvatar
        }, null), e.prependIcon && g(J2, {
          key: "prepend-icon",
          density: e.density,
          icon: e.prependIcon
        }, null)])]), I("div", {
          class: "v-card-item__content"
        }, [u && g(Sl, {
          key: "title"
        }, {
          default: () => [n.title?.() ?? a2(e.title)]
        }), c && g(j7, {
          key: "subtitle"
        }, {
          default: () => [n.subtitle?.() ?? a2(e.subtitle)]
        }), n.default?.()]), o && I("div", {
          key: "append",
          class: "v-card-item__append"
        }, [n.append ? g(zt, {
          key: "append-defaults",
          disabled: !i,
          defaults: {
            VAvatar: {
              density: e.density,
              image: e.appendAvatar
            },
            VIcon: {
              density: e.density,
              icon: e.appendIcon
            }
          }
        }, n.append) : I(je, null, [e.appendIcon && g(J2, {
          key: "append-icon",
          density: e.density,
          icon: e.appendIcon
        }, null), e.appendAvatar && g(Y1, {
          key: "append-avatar",
          density: e.density,
          image: e.appendAvatar
        }, null)])])]
      });
    }), {};
  }
}), lf = Le({
  opacity: [Number, String],
  ...S2(),
  ...St()
}, "VCardText"), Pl = o2()({
  name: "VCardText",
  props: lf(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return h2(() => g(e.tag, {
      class: ve(["v-card-text", e.class]),
      style: Ee([{
        "--v-card-text-opacity": e.opacity
      }, e.style])
    }, n)), {};
  }
}), wo = Le({
  elevation: {
    type: [Number, String],
    validator(e) {
      const t = parseInt(e);
      return !isNaN(t) && t >= 0 && // Material Design has a maximum elevation of 24
      // https://material.io/design/environment/elevation.html#default-elevations
      t <= 24;
    }
  }
}, "elevation");
function xo(e) {
  return {
    elevationClasses: R(() => {
      const n = on(e) ? e.value : e.elevation;
      return n == null ? [] : [`elevation-${n}`];
    })
  };
}
function Fu(e, t) {
  const n = se(), a = Ve(!1);
  if (fo) {
    const r = new IntersectionObserver((i) => {
      a.value = !!i.find((o) => o.isIntersecting);
    }, t);
    i2(() => {
      r.disconnect();
    }), be(n, (i, o) => {
      o && (r.unobserve(o), a.value = !1), i && r.observe(i);
    }, {
      flush: "post"
    });
  }
  return {
    intersectionRef: n,
    isIntersecting: a
  };
}
function O0(e, t) {
  let n;
  function a() {
    n = fn(), n.run(() => t.length ? t(() => {
      n?.stop(), a();
    }) : t());
  }
  be(e, (r) => {
    r && !n ? a() : r || (n?.stop(), n = void 0);
  }, {
    immediate: !0
  }), i2(() => {
    n?.stop();
  });
}
function D0(e, t, n) {
  let a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : (h) => h, r = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : (h) => h;
  const i = O2("useProxiedModel"), o = se(e[t] !== void 0 ? e[t] : n), u = I0(t), f = u !== t ? E(() => (e[t], !!((i.vnode.props?.hasOwnProperty(t) || i.vnode.props?.hasOwnProperty(u)) && (i.vnode.props?.hasOwnProperty(`onUpdate:${t}`) || i.vnode.props?.hasOwnProperty(`onUpdate:${u}`))))) : E(() => (e[t], !!(i.vnode.props?.hasOwnProperty(t) && i.vnode.props?.hasOwnProperty(`onUpdate:${t}`))));
  O0(() => !f.value, () => {
    be(() => e[t], (h) => {
      o.value = h;
    });
  });
  const v = E({
    get() {
      const h = e[t];
      return a(f.value ? h : o.value);
    },
    set(h) {
      const y = r(h), p = m2(f.value ? e[t] : o.value);
      p === y || a(p) === h || (o.value = y, i?.emit(`update:${t}`, y));
    }
  });
  return Object.defineProperty(v, "externalValue", {
    get: () => f.value ? e[t] : o.value
  }), v;
}
const Lu = /* @__PURE__ */ Symbol.for("vuetify:locale");
function of() {
  const e = We(Lu);
  if (!e) throw new Error("[Vuetify] Could not find injected locale instance");
  return e;
}
function Ca() {
  const e = We(Lu);
  if (!e) throw new Error("[Vuetify] Could not find injected rtl instance");
  return {
    isRtl: e.isRtl,
    rtlClasses: e.rtlClasses
  };
}
const X1 = {
  center: "center",
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
}, So = Le({
  location: String
}, "location");
function ko(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, n = arguments.length > 2 ? arguments[2] : void 0;
  const {
    isRtl: a
  } = Ca();
  return {
    locationStyles: E(() => {
      if (!e.location) return {};
      const {
        side: i,
        align: o
      } = bl(e.location.split(" ").length > 1 ? e.location : `${e.location} center`, a.value);
      function u(f) {
        return n ? n(f) : 0;
      }
      const c = {};
      return i !== "center" && (t ? c[X1[i]] = `calc(100% - ${u(i)}px)` : c[i] = 0), o !== "center" ? t ? c[X1[o]] = `calc(100% - ${u(o)}px)` : c[o] = 0 : (i === "center" ? c.top = c.left = "50%" : c[{
        top: "left",
        bottom: "left",
        left: "top",
        right: "top"
      }[i]] = "50%", c.transform = {
        top: "translateX(-50%)",
        bottom: "translateX(-50%)",
        left: "translateY(-50%)",
        right: "translateY(-50%)",
        center: "translate(-50%, -50%)"
      }[i]), c;
    })
  };
}
function Bu(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "content";
  const n = pl(), a = se();
  if (Z2) {
    const r = new ResizeObserver((i) => {
      e?.(i, r), i.length && (t === "content" ? a.value = i[0].contentRect : a.value = i[0].target.getBoundingClientRect());
    });
    W2(() => {
      r.disconnect();
    }), be(() => n.el, (i, o) => {
      o && (r.unobserve(o), a.value = void 0), i && r.observe(i);
    }, {
      flush: "post"
    });
  }
  return {
    resizeRef: n,
    contentRect: ia(a)
  };
}
const sf = Le({
  chunkCount: {
    type: [Number, String],
    default: null
  },
  chunkWidth: {
    type: [Number, String],
    default: null
  },
  chunkGap: {
    type: [Number, String],
    default: 4
  }
}, "chunks");
function uf(e, t) {
  const n = R(() => !!e.chunkCount || !!e.chunkWidth), a = E(() => {
    const u = u2(t);
    if (!u)
      return 0;
    if (!e.chunkCount)
      return Number(e.chunkWidth);
    const c = Number(e.chunkCount);
    return (u - Number(e.chunkGap) * (c - 1)) / c;
  }), r = R(() => Number(e.chunkGap)), i = E(() => {
    if (!n.value)
      return {};
    const u = Xe(r.value), c = Xe(a.value);
    return {
      maskRepeat: "repeat-x",
      maskImage: `linear-gradient(90deg, #000, #000 ${c}, transparent ${c}, transparent)`,
      maskSize: `calc(${c} + ${u}) 100%`
    };
  });
  function o(u) {
    const c = u2(t);
    if (!c)
      return u;
    const f = 100 * r.value / c, v = 100 * (a.value + r.value) / c, h = Math.floor((u + f) / v);
    return sn(0, h * v - f / 2, 100);
  }
  return {
    hasChunks: n,
    chunksMaskStyles: i,
    snapValueToChunk: o
  };
}
const cf = Le({
  absolute: Boolean,
  active: {
    type: Boolean,
    default: !0
  },
  bgColor: String,
  bgOpacity: [Number, String],
  bufferValue: {
    type: [Number, String],
    default: 0
  },
  bufferColor: String,
  bufferOpacity: [Number, String],
  clickable: Boolean,
  color: String,
  height: {
    type: [Number, String],
    default: 4
  },
  indeterminate: Boolean,
  max: {
    type: [Number, String],
    default: 100
  },
  modelValue: {
    type: [Number, String],
    default: 0
  },
  opacity: [Number, String],
  reverse: Boolean,
  stream: Boolean,
  striped: Boolean,
  roundedBar: Boolean,
  ...sf(),
  ...S2(),
  ...So({
    location: "top"
  }),
  ...M0(),
  ...St(),
  ...kt()
}, "VProgressLinear"), df = o2()({
  name: "VProgressLinear",
  props: cf(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = se(), r = D0(e, "modelValue"), {
      isRtl: i,
      rtlClasses: o
    } = Ca(), {
      themeClasses: u
    } = Gt(e), {
      locationStyles: c
    } = ko(e), {
      textColorClasses: f,
      textColorStyles: v
    } = un(() => e.color), {
      backgroundColorClasses: h,
      backgroundColorStyles: y
    } = ln(() => e.bgColor || e.color), {
      backgroundColorClasses: p,
      backgroundColorStyles: k
    } = ln(() => e.bufferColor || e.bgColor || e.color), {
      backgroundColorClasses: S,
      backgroundColorStyles: w
    } = ln(() => e.color), {
      roundedClasses: _
    } = R0(e), {
      intersectionRef: V,
      isIntersecting: A
    } = Fu(), T = E(() => parseFloat(e.max)), O = E(() => parseFloat(e.height)), Y = E(() => sn(parseFloat(e.bufferValue) / T.value * 100, 0, 100)), F = E(() => sn(parseFloat(r.value) / T.value * 100, 0, 100)), x = E(() => i.value !== e.reverse), G = E(() => e.indeterminate ? "fade-transition" : "slide-x-transition"), U = Ve(0), {
      hasChunks: ee,
      chunksMaskStyles: J,
      snapValueToChunk: ae
    } = uf(e, U);
    O0(ee, () => {
      const {
        resizeRef: X
      } = Bu((re) => U.value = re[0].contentRect.width);
      b2(() => X.value = a.value);
    });
    const oe = E(() => ee.value ? ae(Y.value) : Y.value), te = E(() => ee.value ? ae(F.value) : F.value);
    function L(X) {
      if (!V.value) return;
      const {
        left: re,
        right: we,
        width: le
      } = V.value.getBoundingClientRect(), ke = x.value ? le - X.clientX + (we - le) : X.clientX - re;
      r.value = Math.round(ke / le * T.value);
    }
    return b2(() => {
      V.value = a.value;
    }), h2(() => g(e.tag, {
      ref: a,
      class: ve(["v-progress-linear", {
        "v-progress-linear--absolute": e.absolute,
        "v-progress-linear--active": e.active && A.value,
        "v-progress-linear--reverse": x.value,
        "v-progress-linear--rounded": e.rounded,
        "v-progress-linear--rounded-bar": e.roundedBar,
        "v-progress-linear--striped": e.striped,
        "v-progress-linear--clickable": e.clickable
      }, _.value, u.value, o.value, e.class]),
      style: Ee([{
        bottom: e.location === "bottom" ? 0 : void 0,
        top: e.location === "top" ? 0 : void 0,
        height: e.active ? Xe(O.value) : 0,
        "--v-progress-linear-height": Xe(O.value),
        ...e.absolute ? c.value : {}
      }, J.value, e.style]),
      role: "progressbar",
      "aria-hidden": e.active ? "false" : "true",
      "aria-valuemin": "0",
      "aria-valuemax": e.max,
      "aria-valuenow": e.indeterminate ? void 0 : Math.min(parseFloat(r.value), T.value),
      onClick: e.clickable && L
    }, {
      default: () => [e.stream && I("div", {
        key: "stream",
        class: ve(["v-progress-linear__stream", f.value]),
        style: {
          ...v.value,
          [x.value ? "left" : "right"]: Xe(-O.value),
          borderTop: `${Xe(O.value / 2)} dotted`,
          opacity: parseFloat(e.bufferOpacity),
          top: `calc(50% - ${Xe(O.value / 4)})`,
          width: Xe(100 - Y.value, "%"),
          "--v-progress-linear-stream-to": Xe(O.value * (x.value ? 1 : -1))
        }
      }, null), I("div", {
        class: ve(["v-progress-linear__background", h.value]),
        style: Ee([y.value, {
          opacity: parseFloat(e.bgOpacity),
          width: e.stream ? 0 : void 0
        }])
      }, null), I("div", {
        class: ve(["v-progress-linear__buffer", p.value]),
        style: Ee([k.value, {
          opacity: parseFloat(e.bufferOpacity),
          width: Xe(oe.value, "%")
        }])
      }, null), g(G2, {
        name: G.value
      }, {
        default: () => [e.indeterminate ? I("div", {
          class: "v-progress-linear__indeterminate"
        }, [["long", "short"].map((X) => I("div", {
          key: X,
          class: ve(["v-progress-linear__indeterminate", X, S.value]),
          style: Ee(w.value)
        }, null))]) : I("div", {
          class: ve(["v-progress-linear__determinate", S.value]),
          style: Ee([w.value, {
            width: Xe(te.value, "%")
          }])
        }, null)]
      }), n.default && I("div", {
        class: "v-progress-linear__content"
      }, [n.default({
        value: F.value,
        buffer: Y.value
      })])]
    })), {};
  }
}), _o = Le({
  loading: [Boolean, String]
}, "loader");
function Po(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : $t();
  return {
    loaderClasses: R(() => ({
      [`${t}--loading`]: e.loading
    }))
  };
}
function Mu(e, t) {
  let {
    slots: n
  } = t;
  return I("div", {
    class: ve(`${e.name}__loader`)
  }, [n.default?.({
    color: e.color,
    isActive: e.active
  }) || g(df, {
    absolute: e.absolute,
    active: e.active,
    color: e.color,
    height: "2",
    indeterminate: !0
  }, null)]);
}
const ff = ["static", "relative", "fixed", "absolute", "sticky"], Ru = Le({
  position: {
    type: String,
    validator: (
      /* istanbul ignore next */
      (e) => ff.includes(e)
    )
  }
}, "position");
function Du(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : $t();
  return {
    positionClasses: R(() => e.position ? `${t}--${e.position}` : void 0)
  };
}
function vf() {
  const e = O2("useRoute");
  return E(() => e?.proxy?.$route);
}
function mf() {
  return O2("useRouter")?.proxy?.$router;
}
function Nu(e, t) {
  const n = S6("RouterLink"), a = R(() => !!(e.href || e.to)), r = E(() => a?.value || A1(t, "click") || A1(e, "click"));
  if (typeof n == "string" || !("useLink" in n)) {
    const h = R(() => e.href);
    return {
      isLink: a,
      isRouterLink: R(() => !1),
      isClickable: r,
      href: h,
      linkProps: ct({
        href: h
      }),
      route: R(() => {
      }),
      navigate: R(() => {
      })
    };
  }
  const i = n.useLink({
    to: R(() => e.to || ""),
    replace: R(() => e.replace)
  }), o = E(() => e.to ? i : void 0), u = vf(), c = E(() => o.value ? e.exact ? u.value ? o.value.isExactActive?.value && rn(o.value.route.value.query, u.value.query) : o.value.isExactActive?.value ?? !1 : o.value.isActive?.value ?? !1 : !1), f = E(() => e.to ? o.value?.route.value.href : e.href), v = R(() => !!e.to);
  return {
    isLink: a,
    isRouterLink: v,
    isClickable: r,
    isActive: c,
    route: R(() => o.value?.route.value),
    navigate: R(() => o.value?.navigate),
    href: f,
    linkProps: ct({
      href: f,
      "aria-current": R(() => c.value ? "page" : void 0),
      "aria-disabled": R(() => e.disabled && a.value ? "true" : void 0),
      tabindex: R(() => e.disabled && a.value ? "-1" : void 0)
    })
  };
}
const zu = Le({
  href: String,
  replace: Boolean,
  to: [String, Object],
  exact: Boolean
}, "router");
let Xi = !1;
function gf(e, t) {
  let n = !1, a, r;
  Z2 && e?.beforeEach && (e2(() => {
    window.addEventListener("popstate", i), a = e.beforeEach(() => Xi ? n ? t() : void 0 : (Xi = !0, new Promise((o) => {
      setTimeout(() => o(n ? t() : void 0));
    }))), r = e?.afterEach(() => {
      Xi = !1;
    });
  }), i2(() => {
    window.removeEventListener("popstate", i), a?.(), r?.();
  }));
  function i(o) {
    o.state?.replaced || (n = !0, setTimeout(() => n = !1));
  }
}
const Vl = /* @__PURE__ */ Symbol("rippleStop"), hf = 80;
function Q1(e, t) {
  e.style.transform = t, e.style.webkitTransform = t;
}
function Il(e) {
  return e.constructor.name === "TouchEvent";
}
function ju(e) {
  return e.constructor.name === "KeyboardEvent";
}
const yf = function(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a = 0, r = 0;
  if (!ju(e)) {
    const h = t.getBoundingClientRect(), y = Il(e) ? e.touches[e.touches.length - 1] : e;
    a = y.clientX - h.left, r = y.clientY - h.top;
  }
  let i = 0, o = 0.3;
  t._ripple?.circle ? (o = 0.15, i = t.clientWidth / 2, i = n.center ? i : i + Math.sqrt((a - i) ** 2 + (r - i) ** 2) / 4) : i = Math.sqrt(t.clientWidth ** 2 + t.clientHeight ** 2) / 2;
  const u = `${(t.clientWidth - i * 2) / 2}px`, c = `${(t.clientHeight - i * 2) / 2}px`, f = n.center ? u : `${a - i}px`, v = n.center ? c : `${r - i}px`;
  return {
    radius: i,
    scale: o,
    x: f,
    y: v,
    centerX: u,
    centerY: c
  };
}, _r = {
  /* eslint-disable max-statements */
  show(e, t) {
    let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (!t?._ripple?.enabled)
      return;
    const a = document.createElement("span"), r = document.createElement("span");
    a.appendChild(r), a.className = "v-ripple__container", n.class && (a.className += ` ${n.class}`);
    const {
      radius: i,
      scale: o,
      x: u,
      y: c,
      centerX: f,
      centerY: v
    } = yf(e, t, n), h = `${i * 2}px`;
    r.className = "v-ripple__animation", r.style.width = h, r.style.height = h, t.appendChild(a);
    const y = window.getComputedStyle(t);
    y && y.position === "static" && (t.style.position = "relative", t.dataset.previousPosition = "static"), r.classList.add("v-ripple__animation--enter"), r.classList.add("v-ripple__animation--visible"), Q1(r, `translate(${u}, ${c}) scale3d(${o},${o},${o})`), r.dataset.activated = String(performance.now()), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        r.classList.remove("v-ripple__animation--enter"), r.classList.add("v-ripple__animation--in"), Q1(r, `translate(${f}, ${v}) scale3d(1,1,1)`);
      });
    });
  },
  hide(e) {
    if (!e?._ripple?.enabled) return;
    const t = e.getElementsByClassName("v-ripple__animation");
    if (t.length === 0) return;
    const n = Array.from(t).findLast((i) => !i.dataset.isHiding);
    if (n) n.dataset.isHiding = "true";
    else return;
    const a = performance.now() - Number(n.dataset.activated), r = Math.max(250 - a, 0);
    setTimeout(() => {
      n.classList.remove("v-ripple__animation--in"), n.classList.add("v-ripple__animation--out"), setTimeout(() => {
        e.getElementsByClassName("v-ripple__animation").length === 1 && e.dataset.previousPosition && (e.style.position = e.dataset.previousPosition, delete e.dataset.previousPosition), n.parentNode?.parentNode === e && e.removeChild(n.parentNode);
      }, 300);
    }, r);
  }
};
function Ku(e) {
  return typeof e > "u" || !!e;
}
function na(e) {
  const t = {}, n = e.currentTarget;
  if (!(!n?._ripple || n._ripple.touched || e[Vl])) {
    if (e[Vl] = !0, Il(e))
      n._ripple.touched = !0, n._ripple.isTouch = !0;
    else if (n._ripple.isTouch) return;
    if (t.center = n._ripple.centered || ju(e), n._ripple.class && (t.class = n._ripple.class), Il(e)) {
      if (n._ripple.showTimerCommit) return;
      n._ripple.showTimerCommit = () => {
        _r.show(e, n, t);
      }, n._ripple.showTimer = window.setTimeout(() => {
        n?._ripple?.showTimerCommit && (n._ripple.showTimerCommit(), n._ripple.showTimerCommit = null);
      }, hf);
    } else
      _r.show(e, n, t);
  }
}
function Pr(e) {
  e[Vl] = !0;
}
function tt(e) {
  const t = e.currentTarget;
  if (t?._ripple) {
    if (window.clearTimeout(t._ripple.showTimer), e.type === "touchend" && t._ripple.showTimerCommit) {
      t._ripple.showTimerCommit(), t._ripple.showTimerCommit = null, t._ripple.showTimer = window.setTimeout(() => {
        tt(e);
      });
      return;
    }
    window.setTimeout(() => {
      t._ripple && (t._ripple.touched = !1);
    }), _r.hide(t);
  }
}
function Wu(e) {
  const t = e.currentTarget;
  t?._ripple && (t._ripple.showTimerCommit && (t._ripple.showTimerCommit = null), window.clearTimeout(t._ripple.showTimer));
}
let aa = !1;
function Cf(e, t) {
  !aa && t.includes(e.key) && (aa = !0, na(e));
}
function qu(e) {
  aa = !1, tt(e);
}
function Hu(e) {
  aa && (aa = !1, tt(e));
}
function Uu(e, t, n) {
  const {
    value: a,
    modifiers: r
  } = t, i = Ku(a);
  i || _r.hide(e), e._ripple = e._ripple ?? {}, e._ripple.enabled = i, e._ripple.centered = r.center, e._ripple.circle = r.circle;
  const o = Cl(a) ? a : {};
  o.class && (e._ripple.class = o.class);
  const u = o.keys ?? ["Enter", "Space"];
  if (e._ripple.keyDownHandler = (c) => Cf(c, u), i && !n) {
    if (r.stop) {
      e.addEventListener("touchstart", Pr, {
        passive: !0
      }), e.addEventListener("mousedown", Pr);
      return;
    }
    e.addEventListener("touchstart", na, {
      passive: !0
    }), e.addEventListener("touchend", tt, {
      passive: !0
    }), e.addEventListener("touchmove", Wu, {
      passive: !0
    }), e.addEventListener("touchcancel", tt), e.addEventListener("mousedown", na), e.addEventListener("mouseup", tt), e.addEventListener("mouseleave", tt), e.addEventListener("keydown", e._ripple.keyDownHandler), e.addEventListener("keyup", qu), e.addEventListener("blur", Hu), e.addEventListener("dragstart", tt, {
      passive: !0
    });
  } else !i && n && Gu(e);
}
function Gu(e) {
  e.removeEventListener("touchstart", Pr), e.removeEventListener("mousedown", Pr), e.removeEventListener("touchstart", na), e.removeEventListener("touchend", tt), e.removeEventListener("touchmove", Wu), e.removeEventListener("touchcancel", tt), e.removeEventListener("mousedown", na), e.removeEventListener("mouseup", tt), e.removeEventListener("mouseleave", tt), e._ripple?.keyDownHandler && e.removeEventListener("keydown", e._ripple.keyDownHandler), e.removeEventListener("keyup", qu), e.removeEventListener("blur", Hu), e.removeEventListener("dragstart", tt);
}
function pf(e, t) {
  Uu(e, t, !1);
}
function bf(e) {
  Gu(e), delete e._ripple;
}
function wf(e, t) {
  if (t.value === t.oldValue)
    return;
  const n = Ku(t.oldValue);
  Uu(e, t, n);
}
const El = {
  mounted: pf,
  unmounted: bf,
  updated: wf
}, xf = Le({
  appendAvatar: String,
  appendIcon: U2,
  disabled: Boolean,
  flat: Boolean,
  hover: Boolean,
  image: String,
  link: {
    type: Boolean,
    default: void 0
  },
  prependAvatar: String,
  prependIcon: U2,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  subtitle: {
    type: [String, Number, Boolean],
    default: void 0
  },
  text: {
    type: [String, Number, Boolean],
    default: void 0
  },
  title: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...Zr(),
  ...S2(),
  ...hn(),
  ...ga(),
  ...wo(),
  ..._o(),
  ...So(),
  ...Ru(),
  ...M0(),
  ...zu(),
  ...St(),
  ...kt(),
  ...Xr({
    variant: "elevated"
  })
}, "VCard"), Sf = o2()({
  name: "VCard",
  directives: {
    vRipple: El
  },
  props: xf(),
  setup(e, t) {
    let {
      attrs: n,
      slots: a
    } = t;
    const {
      themeClasses: r
    } = Gt(e), {
      borderClasses: i
    } = Yr(e), {
      colorClasses: o,
      colorStyles: u,
      variantClasses: c
    } = bo(e), {
      densityClasses: f
    } = ya(e), {
      dimensionStyles: v
    } = ha(e), {
      elevationClasses: h
    } = xo(e), {
      loaderClasses: y
    } = Po(e), {
      locationStyles: p
    } = ko(e), {
      positionClasses: k
    } = Du(e), {
      roundedClasses: S
    } = R0(e), w = Nu(e, n), _ = Ve(void 0);
    return be(() => e.loading, (V, A) => {
      _.value = !V && typeof A == "string" ? A : typeof V == "boolean" ? void 0 : V;
    }, {
      immediate: !0
    }), h2(() => {
      const V = e.link !== !1 && w.isLink.value, A = !e.disabled && e.link !== !1 && (e.link || w.isClickable.value), T = V ? "a" : e.tag, O = !!(a.title || e.title != null), Y = !!(a.subtitle || e.subtitle != null), F = O || Y, x = !!(a.append || e.appendAvatar || e.appendIcon), G = !!(a.prepend || e.prependAvatar || e.prependIcon), U = !!(a.image || e.image), ee = F || G || x, J = !!(a.text || e.text != null);
      return g2(g(T, me(w.linkProps, {
        class: ["v-card", {
          "v-card--disabled": e.disabled,
          "v-card--flat": e.flat,
          "v-card--hover": e.hover && !(e.disabled || e.flat),
          "v-card--link": A
        }, r.value, i.value, o.value, f.value, h.value, y.value, k.value, S.value, c.value, e.class],
        style: [u.value, v.value, p.value, {
          "--v-card-height": Xe(e.height)
        }, e.style],
        onClick: A && w.navigate.value,
        tabindex: e.disabled ? -1 : void 0
      }), {
        default: () => [U && I("div", {
          key: "image",
          class: "v-card__image"
        }, [a.image ? g(zt, {
          key: "image-defaults",
          disabled: !e.image,
          defaults: {
            VImg: {
              cover: !0,
              src: e.image
            }
          }
        }, a.image) : g(Ou, {
          key: "image-img",
          cover: !0,
          src: e.image
        }, null)]), g(Mu, {
          name: "v-card",
          active: !!e.loading,
          color: _.value
        }, {
          default: a.loader
        }), ee && g(rf, {
          key: "item",
          prependAvatar: e.prependAvatar,
          prependIcon: e.prependIcon,
          title: e.title,
          subtitle: e.subtitle,
          appendAvatar: e.appendAvatar,
          appendIcon: e.appendIcon
        }, {
          default: a.item,
          prepend: a.prepend,
          title: a.title,
          subtitle: a.subtitle,
          append: a.append
        }), J && g(Pl, {
          key: "text"
        }, {
          default: () => [a.text?.() ?? e.text]
        }), a.default?.(), a.actions && g(xl, null, {
          default: a.actions
        }), po(A, "v-card")]
      }), [[El, A && e.ripple]]);
    }), {};
  }
}), kf = {
  __name: "GlassCard",
  props: {
    variant: {
      type: String,
      default: "panel",
      validator: (e) => ["panel", "ui"].includes(e)
    },
    rounded: { type: String, default: "xl" },
    padding: { type: String, default: "pa-6" },
    theme: { type: String, default: void 0 }
  },
  setup(e) {
    const t = g3(), n = E(() => !!t.onClick);
    return (a, r) => (Ne(), n2(Sf, {
      onMousedown: r[0] || (r[0] = Rt(() => {
      }, ["stop"])),
      onClick: r[1] || (r[1] = Rt(() => {
      }, ["stop"])),
      onDblclick: r[2] || (r[2] = Rt(() => {
      }, ["stop"])),
      onContextmenu: r[3] || (r[3] = Rt(() => {
      }, ["stop"])),
      flat: "",
      ripple: n.value,
      theme: e.theme || (e.variant === "panel" ? "dark" : void 0),
      class: ve([
        e.variant === "panel" ? "glass-panel" : "glass-ui",
        "border-thin",
        `rounded-${e.rounded}`,
        e.padding,
        { "cursor-default": !n.value }
      ])
    }, Bl({ _: 2 }, [
      P0(a.$slots, (i, o) => ({
        name: o,
        fn: M((u) => [
          P6(a.$slots, o, Fl(Ll(u || {})), void 0, !0)
        ])
      }))
    ]), 1032, ["ripple", "theme", "class"]));
  }
}, Vr = /* @__PURE__ */ co(kf, [["__scopeId", "data-v-e6d8c11b"]]), Zu = Le({
  baseColor: String,
  divided: Boolean,
  direction: {
    type: String,
    default: "horizontal"
  },
  ...Zr(),
  ...S2(),
  ...hn(),
  ...wo(),
  ...M0(),
  ...St(),
  ...kt(),
  ...Xr()
}, "VBtnGroup"), J1 = o2()({
  name: "VBtnGroup",
  props: Zu(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      themeClasses: a
    } = Gt(e), {
      densityClasses: r
    } = ya(e), {
      borderClasses: i
    } = Yr(e), {
      elevationClasses: o
    } = xo(e), {
      roundedClasses: u
    } = R0(e);
    go({
      VBtn: {
        height: R(() => e.direction === "horizontal" ? "auto" : null),
        baseColor: R(() => e.baseColor),
        color: R(() => e.color),
        density: R(() => e.density),
        flat: !0,
        variant: R(() => e.variant)
      }
    }), h2(() => g(e.tag, {
      class: ve(["v-btn-group", `v-btn-group--${e.direction}`, {
        "v-btn-group--divided": e.divided
      }, a.value, i.value, r.value, o.value, u.value, e.class]),
      style: Ee(e.style)
    }, n));
  }
}), _f = Le({
  modelValue: {
    type: null,
    default: void 0
  },
  multiple: Boolean,
  mandatory: [Boolean, String],
  max: Number,
  selectedClass: String,
  disabled: Boolean
}, "group"), Pf = Le({
  value: null,
  disabled: Boolean,
  selectedClass: String
}, "group-item");
function Vf(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  const a = O2("useGroupItem");
  if (!a)
    throw new Error("[Vuetify] useGroupItem composable must be used inside a component setup function");
  const r = Y2();
  c2(/* @__PURE__ */ Symbol.for(`${t.description}:id`), r);
  const i = We(t, null);
  if (!i) {
    if (!n) return i;
    throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${t.description}`);
  }
  const o = R(() => e.value), u = E(() => !!(i.disabled.value || e.disabled));
  function c() {
    i?.register({
      id: r,
      value: o,
      disabled: u
    }, a);
  }
  function f() {
    i?.unregister(r);
  }
  c(), W2(() => f());
  const v = E(() => i.isSelected(r)), h = E(() => i.items.value[0].id === r), y = E(() => i.items.value[i.items.value.length - 1].id === r), p = E(() => v.value && [i.selectedClass.value, e.selectedClass]);
  return be(v, (k) => {
    a.emit("group:selected", {
      value: k
    });
  }, {
    flush: "sync"
  }), {
    id: r,
    isSelected: v,
    isFirst: h,
    isLast: y,
    toggle: () => i.select(r, !v.value),
    select: (k) => i.select(r, k),
    selectedClass: p,
    value: o,
    disabled: u,
    group: i,
    register: c,
    unregister: f
  };
}
function If(e, t) {
  let n = !1;
  const a = ct([]), r = D0(e, "modelValue", [], (y) => y === void 0 ? [] : Yu(a, y === null ? [null] : Kn(y)), (y) => {
    const p = Af(a, y);
    return e.multiple ? p : p[0];
  }), i = O2("useGroup");
  function o(y, p) {
    const k = y, S = /* @__PURE__ */ Symbol.for(`${t.description}:id`), _ = Rn(S, i?.vnode).indexOf(p);
    s2(k.value) === void 0 && (k.value = _, k.useIndexAsValue = !0), _ > -1 ? a.splice(_, 0, k) : a.push(k);
  }
  function u(y) {
    if (n) return;
    c();
    const p = a.findIndex((k) => k.id === y);
    a.splice(p, 1);
  }
  function c() {
    const y = a.find((p) => !p.disabled);
    y && e.mandatory === "force" && !r.value.length && (r.value = [y.id]);
  }
  yt(() => {
    c();
  }), W2(() => {
    n = !0;
  }), x6(() => {
    for (let y = 0; y < a.length; y++)
      a[y].useIndexAsValue && (a[y].value = y);
  });
  function f(y, p) {
    const k = a.find((S) => S.id === y);
    if (!(p && k?.disabled))
      if (e.multiple) {
        const S = r.value.slice(), w = S.findIndex((V) => V === y), _ = ~w;
        if (p = p ?? !_, _ && e.mandatory && S.length <= 1 || !_ && e.max != null && S.length + 1 > e.max) return;
        w < 0 && p ? S.push(y) : w >= 0 && !p && S.splice(w, 1), r.value = S;
      } else {
        const S = r.value.includes(y);
        if (e.mandatory && S || !S && !p) return;
        r.value = p ?? !S ? [y] : [];
      }
  }
  function v(y) {
    if (e.multiple && an('This method is not supported when using "multiple" prop'), r.value.length) {
      const p = r.value[0], k = a.findIndex((_) => _.id === p);
      let S = (k + y) % a.length, w = a[S];
      for (; w.disabled && S !== k; )
        S = (S + y) % a.length, w = a[S];
      if (w.disabled) return;
      r.value = [a[S].id];
    } else {
      const p = a.find((k) => !k.disabled);
      p && (r.value = [p.id]);
    }
  }
  const h = {
    register: o,
    unregister: u,
    selected: r,
    select: f,
    disabled: R(() => e.disabled),
    prev: () => v(a.length - 1),
    next: () => v(1),
    isSelected: (y) => r.value.includes(y),
    selectedClass: R(() => e.selectedClass),
    items: R(() => a),
    getItemIndex: (y) => Ef(a, y)
  };
  return c2(t, h), h;
}
function Ef(e, t) {
  const n = Yu(e, [t]);
  return n.length ? e.findIndex((a) => a.id === n[0]) : -1;
}
function Yu(e, t) {
  const n = [];
  return t.forEach((a) => {
    const r = e.find((o) => rn(a, o.value)), i = e[a];
    r?.value !== void 0 ? n.push(r.id) : i?.useIndexAsValue && n.push(i.id);
  }), n;
}
function Af(e, t) {
  const n = [];
  return t.forEach((a) => {
    const r = e.findIndex((i) => i.id === a);
    if (~r) {
      const i = e[r];
      n.push(i.value !== void 0 ? i.value : r);
    }
  }), n;
}
const Xu = /* @__PURE__ */ Symbol.for("vuetify:v-btn-toggle"), $f = Le({
  ...Zu(),
  ..._f()
}, "VBtnToggle");
o2()({
  name: "VBtnToggle",
  props: $f(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      isSelected: a,
      next: r,
      prev: i,
      select: o,
      selected: u
    } = If(e, Xu);
    return h2(() => {
      const c = J1.filterProps(e);
      return g(J1, me({
        class: ["v-btn-toggle", e.class]
      }, c, {
        style: e.style
      }), {
        default: () => [n.default?.({
          isSelected: a,
          next: r,
          prev: i,
          select: o,
          selected: u
        })]
      });
    }), {
      next: r,
      prev: i,
      select: o
    };
  }
});
const Tf = Le({
  reveal: {
    type: [Boolean, Object],
    default: !1
  }
}, "reveal");
function Of(e) {
  const n = R(() => typeof e.reveal == "object" ? Math.max(0, Number(e.reveal.duration ?? 900)) : 900), a = Ve(e.reveal ? "initial" : "disabled");
  return yt(async () => {
    e.reveal && (a.value = "initial", await new Promise((r) => requestAnimationFrame(r)), a.value = "pending", await new Promise((r) => setTimeout(r, n.value)), a.value = "done");
  }), {
    duration: n,
    state: a
  };
}
const Ff = Le({
  bgColor: String,
  color: String,
  indeterminate: [Boolean, String],
  rounded: Boolean,
  modelValue: {
    type: [Number, String],
    default: 0
  },
  rotate: {
    type: [Number, String],
    default: 0
  },
  width: {
    type: [Number, String],
    default: 4
  },
  ...S2(),
  ...Tf(),
  ...Hr(),
  ...St({
    tag: "div"
  }),
  ...kt()
}, "VProgressCircular"), Lf = o2()({
  name: "VProgressCircular",
  props: Ff(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = 20, r = 2 * Math.PI * a, i = se(), {
      themeClasses: o
    } = Gt(e), {
      sizeClasses: u,
      sizeStyles: c
    } = Ur(e), {
      textColorClasses: f,
      textColorStyles: v
    } = un(() => e.color), {
      textColorClasses: h,
      textColorStyles: y
    } = un(() => e.bgColor), {
      intersectionRef: p,
      isIntersecting: k
    } = Fu(), {
      resizeRef: S,
      contentRect: w
    } = Bu(), {
      state: _,
      duration: V
    } = Of(e), A = R(() => _.value === "initial" ? 0 : sn(parseFloat(e.modelValue), 0, 100)), T = R(() => Number(e.width)), O = R(() => c.value ? Number(e.size) : w.value ? w.value.width : Math.max(T.value, 32)), Y = R(() => a / (1 - T.value / O.value) * 2), F = R(() => T.value / O.value * Y.value), x = R(() => {
      const U = (100 - A.value) / 100 * r;
      return e.rounded && A.value > 0 && A.value < 100 ? Xe(Math.min(r - 0.01, U + F.value)) : Xe(U);
    }), G = E(() => {
      const U = Number(e.rotate);
      return e.rounded ? U + F.value / 2 / r * 360 : U;
    });
    return b2(() => {
      p.value = i.value, S.value = i.value;
    }), h2(() => g(e.tag, {
      ref: i,
      class: ve(["v-progress-circular", {
        "v-progress-circular--indeterminate": !!e.indeterminate,
        "v-progress-circular--visible": k.value,
        "v-progress-circular--disable-shrink": e.indeterminate && (e.indeterminate === "disable-shrink" || ea()),
        "v-progress-circular--revealing": ["initial", "pending"].includes(_.value)
      }, o.value, u.value, f.value, e.class]),
      style: Ee([c.value, v.value, {
        "--progress-reveal-duration": `${V.value}ms`
      }, e.style]),
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": e.indeterminate ? void 0 : A.value
    }, {
      default: () => [I("svg", {
        style: {
          transform: `rotate(calc(-90deg + ${G.value}deg))`
        },
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: `0 0 ${Y.value} ${Y.value}`
      }, [I("circle", {
        class: ve(["v-progress-circular__underlay", h.value]),
        style: Ee(y.value),
        fill: "transparent",
        cx: "50%",
        cy: "50%",
        r: a,
        "stroke-width": F.value,
        "stroke-dasharray": r,
        "stroke-dashoffset": 0
      }, null), I("circle", {
        class: "v-progress-circular__overlay",
        fill: "transparent",
        cx: "50%",
        cy: "50%",
        r: a,
        "stroke-width": F.value,
        "stroke-dasharray": r,
        "stroke-dashoffset": x.value,
        "stroke-linecap": e.rounded ? "round" : void 0
      }, null)]), n.default && I("div", {
        class: "v-progress-circular__content"
      }, [n.default({
        value: A.value
      })])]
    })), {};
  }
});
function Bf(e, t) {
  be(() => e.isActive?.value, (n) => {
    e.isLink.value && n != null && t && e2(() => {
      t(n);
    });
  }, {
    immediate: !0
  });
}
const Mf = Le({
  active: {
    type: Boolean,
    default: void 0
  },
  activeColor: String,
  baseColor: String,
  symbol: {
    type: null,
    default: Xu
  },
  flat: Boolean,
  icon: [Boolean, String, Function, Object],
  prependIcon: U2,
  appendIcon: U2,
  block: Boolean,
  readonly: Boolean,
  slim: Boolean,
  stacked: Boolean,
  spaced: String,
  ripple: {
    type: [Boolean, Object],
    default: !0
  },
  text: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...Zr(),
  ...S2(),
  ...hn(),
  ...ga(),
  ...wo(),
  ...Pf(),
  ..._o(),
  ...So(),
  ...Ru(),
  ...M0(),
  ...zu(),
  ...Hr(),
  ...St({
    tag: "button"
  }),
  ...kt(),
  ...Xr({
    variant: "elevated"
  })
}, "VBtn"), Ja = o2()({
  name: "VBtn",
  props: Mf(),
  emits: {
    "group:selected": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      slots: a
    } = t;
    const {
      themeClasses: r
    } = Gt(e), {
      borderClasses: i
    } = Yr(e), {
      densityClasses: o
    } = ya(e), {
      dimensionStyles: u
    } = ha(e), {
      elevationClasses: c
    } = xo(e), {
      loaderClasses: f
    } = Po(e), {
      locationStyles: v
    } = ko(e), {
      positionClasses: h
    } = Du(e), {
      roundedClasses: y
    } = R0(e), {
      sizeClasses: p,
      sizeStyles: k
    } = Ur(e), S = Vf(e, e.symbol, !1), w = Nu(e, n), _ = E(() => e.active !== void 0 ? e.active : w.isRouterLink.value ? w.isActive?.value : S?.isSelected.value), V = R(() => _.value ? e.activeColor ?? e.color : e.color), A = E(() => ({
      color: S?.isSelected.value && (!w.isLink.value || w.isActive?.value) || !S || w.isActive?.value ? V.value ?? e.baseColor : e.baseColor,
      variant: e.variant
    })), {
      colorClasses: T,
      colorStyles: O,
      variantClasses: Y
    } = bo(A), F = E(() => S?.disabled.value || e.disabled), x = R(() => e.variant === "elevated" && !(e.disabled || e.flat || e.border)), G = E(() => {
      if (!(e.value === void 0 || typeof e.value == "symbol"))
        return Object(e.value) === e.value ? JSON.stringify(e.value, null, 0) : e.value;
    });
    function U(ee) {
      F.value || w.isLink.value && (ee.metaKey || ee.ctrlKey || ee.shiftKey || ee.button !== 0 || n.target === "_blank") || (w.isRouterLink.value ? w.navigate.value?.(ee) : S?.toggle());
    }
    return Bf(w, S?.select), h2(() => {
      const ee = w.isLink.value ? "a" : e.tag, J = !!(e.prependIcon || a.prepend), ae = !!(e.appendIcon || a.append), oe = !!(e.icon && e.icon !== !0);
      return g2(g(ee, me(w.linkProps, {
        type: ee === "a" ? void 0 : "button",
        class: ["v-btn", S?.selectedClass.value, {
          "v-btn--active": _.value,
          "v-btn--block": e.block,
          "v-btn--disabled": F.value,
          "v-btn--elevated": x.value,
          "v-btn--flat": e.flat,
          "v-btn--icon": !!e.icon,
          "v-btn--loading": e.loading,
          "v-btn--readonly": e.readonly,
          "v-btn--slim": e.slim,
          "v-btn--stacked": e.stacked
        }, e.spaced ? ["v-btn--spaced", `v-btn--spaced-${e.spaced}`] : [], r.value, i.value, T.value, o.value, c.value, f.value, h.value, y.value, p.value, Y.value, e.class],
        style: [O.value, u.value, v.value, k.value, e.style],
        "aria-busy": e.loading ? !0 : void 0,
        disabled: F.value && ee !== "a" || void 0,
        tabindex: e.loading || e.readonly ? -1 : void 0,
        onClick: U,
        value: G.value
      }), {
        default: () => [po(!0, "v-btn"), !e.icon && J && I("span", {
          key: "prepend",
          class: "v-btn__prepend"
        }, [a.prepend ? g(zt, {
          key: "prepend-defaults",
          disabled: !e.prependIcon,
          defaults: {
            VIcon: {
              icon: e.prependIcon
            }
          }
        }, a.prepend) : g(J2, {
          key: "prepend-icon",
          icon: e.prependIcon
        }, null)]), I("span", {
          class: "v-btn__content",
          "data-no-activator": ""
        }, [!a.default && oe ? g(J2, {
          key: "content-icon",
          icon: e.icon
        }, null) : g(zt, {
          key: "content-defaults",
          disabled: !oe,
          defaults: {
            VIcon: {
              icon: e.icon
            }
          }
        }, {
          default: () => [a.default?.() ?? a2(e.text)]
        })]), !e.icon && ae && I("span", {
          key: "append",
          class: "v-btn__append"
        }, [a.append ? g(zt, {
          key: "append-defaults",
          disabled: !e.appendIcon,
          defaults: {
            VIcon: {
              icon: e.appendIcon
            }
          }
        }, a.append) : g(J2, {
          key: "append-icon",
          icon: e.appendIcon
        }, null)]), !!e.loading && I("span", {
          key: "loader",
          class: "v-btn__loader"
        }, [a.loader?.() ?? g(Lf, {
          color: typeof e.loading == "boolean" ? void 0 : e.loading,
          indeterminate: !0,
          width: "2"
        }, null)])]
      }), [[El, !F.value && e.ripple, "", {
        center: !!e.icon
      }]]);
    }), {
      group: S
    };
  }
}), Rf = Le({
  disabled: Boolean,
  group: Boolean,
  hideOnLeave: Boolean,
  leaveAbsolute: Boolean,
  mode: String,
  origin: String
}, "transition");
function ot(e, t, n) {
  return o2()({
    name: e,
    props: Rf({
      mode: n,
      origin: t
    }),
    setup(a, r) {
      let {
        slots: i
      } = r;
      const o = {
        onBeforeEnter(u) {
          a.origin && (u.style.transformOrigin = a.origin);
        },
        onLeave(u) {
          if (a.leaveAbsolute) {
            const {
              offsetTop: c,
              offsetLeft: f,
              offsetWidth: v,
              offsetHeight: h
            } = u;
            u._transitionInitialStyles = {
              position: u.style.position,
              top: u.style.top,
              left: u.style.left,
              width: u.style.width,
              height: u.style.height
            }, u.style.position = "absolute", u.style.top = `${c}px`, u.style.left = `${f}px`, u.style.width = `${v}px`, u.style.height = `${h}px`;
          }
          a.hideOnLeave && u.style.setProperty("display", "none", "important");
        },
        onAfterLeave(u) {
          if (a.leaveAbsolute && u?._transitionInitialStyles) {
            const {
              position: c,
              top: f,
              left: v,
              width: h,
              height: y
            } = u._transitionInitialStyles;
            delete u._transitionInitialStyles, u.style.position = c || "", u.style.top = f || "", u.style.left = v || "", u.style.width = h || "", u.style.height = y || "";
          }
        }
      };
      return () => {
        const u = a.group ? cn : G2;
        return Et(u, {
          name: a.disabled ? "" : e,
          css: !a.disabled,
          ...a.group ? void 0 : {
            mode: a.mode
          },
          ...a.disabled ? {} : o
        }, i.default);
      };
    }
  });
}
function Vo(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "in-out";
  return o2()({
    name: e,
    props: {
      mode: {
        type: String,
        default: n
      },
      disabled: {
        type: Boolean,
        default: ea()
      },
      group: Boolean,
      hideOnLeave: Boolean
    },
    setup(a, r) {
      let {
        slots: i
      } = r;
      const o = a.group ? cn : G2;
      return () => Et(o, {
        name: a.disabled ? "" : e,
        css: !a.disabled,
        // mode: props.mode, // TODO: vuejs/vue-next#3104
        ...a.disabled ? {} : {
          ...t,
          onLeave: (u) => {
            a.hideOnLeave ? u.style.setProperty("display", "none", "important") : t.onLeave?.(u);
          }
        }
      }, i.default);
    }
  });
}
function Io() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "y";
  return {
    onBeforeEnter(r) {
      r._parent = r.parentNode, r._initialStyle = {
        transition: r.style.transition,
        overflow: r.style.overflow,
        width: r.style.width,
        height: r.style.height
      };
    },
    onEnter(r) {
      const i = r._initialStyle;
      if (!i) return;
      r.style.setProperty("transition", "none", "important"), r.style.overflow = "hidden";
      const o = `${r.offsetWidth}px`, u = `${r.offsetHeight}px`;
      ["x", "both"].includes(t) && (r.style.width = "0"), ["y", "both"].includes(t) && (r.style.height = "0"), r.offsetHeight, r.style.transition = i.transition, e && r._parent && r._parent.classList.add(e), requestAnimationFrame(() => {
        ["x", "both"].includes(t) && (r.style.width = o), ["y", "both"].includes(t) && (r.style.height = u);
      });
    },
    onAfterEnter: a,
    onEnterCancelled: a,
    onLeave(r) {
      r._initialStyle = {
        transition: "",
        overflow: r.style.overflow,
        width: r.style.width,
        height: r.style.height
      }, r.style.overflow = "hidden", ["x", "both"].includes(t) && (r.style.width = `${r.offsetWidth}px`), ["y", "both"].includes(t) && (r.style.height = `${r.offsetHeight}px`), r.offsetHeight, requestAnimationFrame(() => {
        ["x", "both"].includes(t) && (r.style.width = "0"), ["y", "both"].includes(t) && (r.style.height = "0");
      });
    },
    onAfterLeave: n,
    onLeaveCancelled: n
  };
  function n(r) {
    e && r._parent && r._parent.classList.remove(e), a(r);
  }
  function a(r) {
    if (!r._initialStyle) return;
    const {
      width: i,
      height: o
    } = r._initialStyle;
    r.style.overflow = r._initialStyle.overflow, i != null && ["x", "both"].includes(t) && (r.style.width = i), o != null && ["y", "both"].includes(t) && (r.style.height = o), delete r._initialStyle;
  }
}
const Df = Le({
  target: [Object, Array]
}, "v-dialog-transition"), Qi = /* @__PURE__ */ new WeakMap(), Nf = o2()({
  name: "VDialogTransition",
  props: Df(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = {
      onBeforeEnter(r) {
        r.style.pointerEvents = "none", r.style.visibility = "hidden";
      },
      async onEnter(r, i) {
        await new Promise((y) => requestAnimationFrame(y)), await new Promise((y) => requestAnimationFrame(y)), r.style.visibility = "";
        const o = t6(e.target, r), {
          x: u,
          y: c,
          sx: f,
          sy: v,
          speed: h
        } = o;
        if (Qi.set(r, o), ea())
          n0(r, [{
            opacity: 0
          }, {}], {
            duration: 125 * h,
            easing: q1
          }).finished.then(() => i());
        else {
          const y = n0(r, [{
            transform: `translate(${u}px, ${c}px) scale(${f}, ${v})`,
            opacity: 0
          }, {}], {
            duration: 225 * h,
            easing: q1
          });
          e6(r)?.forEach((p) => {
            n0(p, [{
              opacity: 0
            }, {
              opacity: 0,
              offset: 0.33
            }, {}], {
              duration: 450 * h,
              easing: xr
            });
          }), y.finished.then(() => i());
        }
      },
      onAfterEnter(r) {
        r.style.removeProperty("pointer-events");
      },
      onBeforeLeave(r) {
        r.style.pointerEvents = "none";
      },
      async onLeave(r, i) {
        await new Promise((y) => requestAnimationFrame(y));
        let o;
        !Qi.has(r) || Array.isArray(e.target) || e.target.offsetParent || e.target.getClientRects().length ? o = t6(e.target, r) : o = Qi.get(r);
        const {
          x: u,
          y: c,
          sx: f,
          sy: v,
          speed: h
        } = o;
        ea() ? n0(r, [{}, {
          opacity: 0
        }], {
          duration: 85 * h,
          easing: H1
        }).finished.then(() => i()) : (n0(r, [{}, {
          transform: `translate(${u}px, ${c}px) scale(${f}, ${v})`,
          opacity: 0
        }], {
          duration: 125 * h,
          easing: H1
        }).finished.then(() => i()), e6(r)?.forEach((p) => {
          n0(p, [{}, {
            opacity: 0,
            offset: 0.2
          }, {
            opacity: 0
          }], {
            duration: 250 * h,
            easing: xr
          });
        }));
      },
      onAfterLeave(r) {
        r.style.removeProperty("pointer-events");
      }
    };
    return () => e.target ? g(G2, me({
      name: "dialog-transition"
    }, a, {
      css: !1
    }), n) : g(G2, {
      name: "dialog-transition"
    }, n);
  }
});
function e6(e) {
  const t = e.querySelector(":scope > .v-card, :scope > .v-sheet, :scope > .v-list")?.children;
  return t && [...t];
}
function t6(e, t) {
  const n = Iu(e), a = ho(t), [r, i] = getComputedStyle(t).transformOrigin.split(" ").map((_) => parseFloat(_)), [o, u] = getComputedStyle(t).getPropertyValue("--v-overlay-anchor-origin").split(" ");
  let c = n.left + n.width / 2;
  o === "left" || u === "left" ? c -= n.width / 2 : (o === "right" || u === "right") && (c += n.width / 2);
  let f = n.top + n.height / 2;
  o === "top" || u === "top" ? f -= n.height / 2 : (o === "bottom" || u === "bottom") && (f += n.height / 2);
  const v = n.width / a.width, h = n.height / a.height, y = Math.max(1, v, h), p = v / y || 0, k = h / y || 0, S = a.width * a.height / (window.innerWidth * window.innerHeight), w = S > 0.12 ? Math.min(1.5, (S - 0.12) * 10 + 1) : 1;
  return {
    x: c - (r + a.left),
    y: f - (i + a.top),
    sx: p,
    sy: k,
    speed: w
  };
}
ot("fab-transition", "center center", "out-in");
ot("dialog-bottom-transition");
ot("dialog-top-transition");
ot("fade-transition");
ot("scale-transition");
ot("scroll-x-transition");
ot("scroll-x-reverse-transition");
ot("scroll-y-transition");
ot("scroll-y-reverse-transition");
ot("slide-x-transition");
ot("slide-x-reverse-transition");
const Qu = ot("slide-y-transition");
ot("slide-y-reverse-transition");
Vo("expand-transition", Io());
const zf = Vo("expand-x-transition", Io("", "x"));
Vo("expand-both-transition", Io("", "both"));
function Ji(e, t) {
  return {
    x: e.x + t.x,
    y: e.y + t.y
  };
}
function jf(e, t) {
  return {
    x: e.x - t.x,
    y: e.y - t.y
  };
}
function n6(e, t) {
  if (e.side === "top" || e.side === "bottom") {
    const {
      side: n,
      align: a
    } = e, r = a === "left" ? 0 : a === "center" ? t.width / 2 : a === "right" ? t.width : a, i = n === "top" ? 0 : n === "bottom" ? t.height : n;
    return Ji({
      x: r,
      y: i
    }, t);
  } else if (e.side === "left" || e.side === "right") {
    const {
      side: n,
      align: a
    } = e, r = n === "left" ? 0 : n === "right" ? t.width : n, i = a === "top" ? 0 : a === "center" ? t.height / 2 : a === "bottom" ? t.height : a;
    return Ji({
      x: r,
      y: i
    }, t);
  }
  return Ji({
    x: t.width / 2,
    y: t.height / 2
  }, t);
}
const Ju = {
  static: qf,
  // specific viewport position, usually centered
  connected: Uf
  // connected to a certain element
}, Kf = Le({
  locationStrategy: {
    type: [String, Function],
    default: "static",
    validator: (e) => typeof e == "function" || e in Ju
  },
  location: {
    type: String,
    default: "bottom"
  },
  origin: {
    type: String,
    default: "auto"
  },
  offset: [Number, String, Array],
  stickToTarget: Boolean,
  viewportMargin: {
    type: [Number, String],
    default: 12
  }
}, "VOverlay-location-strategies");
function Wf(e, t) {
  const n = se({}), a = se();
  Z2 && O0(() => !!(t.isActive.value && e.locationStrategy), (u) => {
    be(() => e.locationStrategy, u), i2(() => {
      window.removeEventListener("resize", r), visualViewport?.removeEventListener("resize", i), visualViewport?.removeEventListener("scroll", o), a.value = void 0;
    }), window.addEventListener("resize", r, {
      passive: !0
    }), visualViewport?.addEventListener("resize", i, {
      passive: !0
    }), visualViewport?.addEventListener("scroll", o, {
      passive: !0
    }), typeof e.locationStrategy == "function" ? a.value = e.locationStrategy(t, e, n)?.updateLocation : a.value = Ju[e.locationStrategy](t, e, n)?.updateLocation;
  });
  function r(u) {
    a.value?.(u);
  }
  function i(u) {
    a.value?.(u);
  }
  function o(u) {
    a.value?.(u);
  }
  return {
    contentStyles: n,
    updateLocation: a
  };
}
function qf() {
}
function Hf(e, t) {
  const n = ho(e);
  return t ? n.x += parseFloat(e.style.right || 0) : n.x -= parseFloat(e.style.left || 0), n.y -= parseFloat(e.style.top || 0), n;
}
function Uf(e, t, n) {
  (Array.isArray(e.target.value) || D7(e.target.value)) && Object.assign(n.value, {
    position: "fixed",
    top: 0,
    [e.isRtl.value ? "right" : "left"]: 0
  });
  const {
    preferredAnchor: r,
    preferredOrigin: i
  } = vo(() => {
    const _ = bl(t.location, e.isRtl.value), V = t.origin === "overlap" ? _ : t.origin === "auto" ? Zi(_) : bl(t.origin, e.isRtl.value);
    return _.side === V.side && _.align === Yi(V).align ? {
      preferredAnchor: T1(_),
      preferredOrigin: T1(V)
    } : {
      preferredAnchor: _,
      preferredOrigin: V
    };
  }), [o, u, c, f] = ["minWidth", "minHeight", "maxWidth", "maxHeight"].map((_) => E(() => {
    const V = parseFloat(t[_]);
    return isNaN(V) ? 1 / 0 : V;
  })), v = E(() => {
    if (Array.isArray(t.offset))
      return t.offset;
    if (typeof t.offset == "string") {
      const _ = t.offset.split(" ").map(parseFloat);
      return _.length < 2 && _.push(0), _;
    }
    return typeof t.offset == "number" ? [t.offset, 0] : [0, 0];
  });
  let h = !1, y = -1;
  const p = new f7(4), k = new ResizeObserver(() => {
    if (!h) return;
    if (requestAnimationFrame((V) => {
      V !== y && p.clear(), requestAnimationFrame((A) => {
        y = A;
      });
    }), p.isFull) {
      const V = p.values();
      if (rn(V.at(-1), V.at(-3)) && !rn(V.at(-1), V.at(-2)))
        return;
    }
    const _ = w();
    _ && p.push(_.flipped);
  });
  let S = new nt({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  be(e.target, (_, V) => {
    V && !Array.isArray(V) && k.unobserve(V), Array.isArray(_) ? rn(_, V) || w() : _ && k.observe(_);
  }, {
    immediate: !0
  }), be(e.contentEl, (_, V) => {
    V && k.unobserve(V), _ && k.observe(_);
  }, {
    immediate: !0
  }), i2(() => {
    k.disconnect();
  });
  function w() {
    if (h = !1, requestAnimationFrame(() => h = !0), !e.target.value || !e.contentEl.value) return;
    (Array.isArray(e.target.value) || e.target.value.offsetParent || e.target.value.getClientRects().length) && (S = Iu(e.target.value));
    const _ = Hf(e.contentEl.value, e.isRtl.value), V = Sr(e.contentEl.value), A = Number(t.viewportMargin);
    V.length || (V.push(document.documentElement), e.contentEl.value.style.top && e.contentEl.value.style.left || (_.x -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-x") || 0), _.y -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-y") || 0)));
    const T = V.reduce((ae, oe) => {
      const te = b7(oe);
      return ae ? new nt({
        x: Math.max(ae.left, te.left),
        y: Math.max(ae.top, te.top),
        width: Math.min(ae.right, te.right) - Math.max(ae.left, te.left),
        height: Math.min(ae.bottom, te.bottom) - Math.max(ae.top, te.top)
      }) : te;
    }, void 0);
    t.stickToTarget ? (T.x += Math.min(A, S.x), T.y += Math.min(A, S.y), T.width = Math.max(T.width - A * 2, S.x + S.width - A), T.height = Math.max(T.height - A * 2, S.y + S.height - A)) : (T.x += A, T.y += A, T.width -= A * 2, T.height -= A * 2);
    let O = {
      anchor: r.value,
      origin: i.value
    };
    function Y(ae) {
      const oe = new nt(_), te = n6(ae.anchor, S), L = n6(ae.origin, oe);
      let {
        x: X,
        y: re
      } = jf(te, L);
      switch (ae.anchor.side) {
        case "top":
          re -= v.value[0];
          break;
        case "bottom":
          re += v.value[0];
          break;
        case "left":
          X -= v.value[0];
          break;
        case "right":
          X += v.value[0];
          break;
      }
      switch (ae.anchor.align) {
        case "top":
          re -= v.value[1];
          break;
        case "bottom":
          re += v.value[1];
          break;
        case "left":
          X -= v.value[1];
          break;
        case "right":
          X += v.value[1];
          break;
      }
      return oe.x += X, oe.y += re, oe.width = Math.min(oe.width, c.value), oe.height = Math.min(oe.height, f.value), {
        overflows: F1(oe, T),
        x: X,
        y: re
      };
    }
    let F = 0, x = 0;
    const G = {
      x: 0,
      y: 0
    }, U = {
      x: !1,
      y: !1
    };
    let ee = -1;
    for (; ; ) {
      if (ee++ > 10) {
        pu("Infinite loop detected in connectedLocationStrategy");
        break;
      }
      const {
        x: ae,
        y: oe,
        overflows: te
      } = Y(O);
      F += ae, x += oe, _.x += ae, _.y += oe;
      {
        const L = O1(O.anchor), X = te.x.before || te.x.after, re = te.y.before || te.y.after;
        let we = !1;
        if (["x", "y"].forEach((le) => {
          if (le === "x" && X && !U.x || le === "y" && re && !U.y) {
            const ke = {
              anchor: {
                ...O.anchor
              },
              origin: {
                ...O.origin
              }
            }, fe = le === "x" ? L === "y" ? Yi : Zi : L === "y" ? Zi : Yi;
            ke.anchor = fe(ke.anchor), ke.origin = fe(ke.origin);
            const {
              overflows: ne
            } = Y(ke);
            (ne[le].before <= te[le].before && ne[le].after <= te[le].after || ne[le].before + ne[le].after < (te[le].before + te[le].after) / 2) && (O = ke, we = U[le] = !0);
          }
        }), we) continue;
      }
      te.x.before && (F += te.x.before, _.x += te.x.before), te.x.after && (F -= te.x.after, _.x -= te.x.after), te.y.before && (x += te.y.before, _.y += te.y.before), te.y.after && (x -= te.y.after, _.y -= te.y.after);
      {
        const L = F1(_, T);
        G.x = T.width - L.x.before - L.x.after, G.y = T.height - L.y.before - L.y.after, F += L.x.before, _.x += L.x.before, x += L.y.before, _.y += L.y.before;
      }
      break;
    }
    const J = O1(O.anchor);
    return Object.assign(n.value, {
      "--v-overlay-anchor-origin": `${O.anchor.side} ${O.anchor.align}`,
      transformOrigin: `${O.origin.side} ${O.origin.align}`,
      // transform: `translate(${pixelRound(x)}px, ${pixelRound(y)}px)`,
      top: Xe(el(x)),
      left: e.isRtl.value ? void 0 : Xe(el(F)),
      right: e.isRtl.value ? Xe(el(-F)) : void 0,
      minWidth: Xe(J === "y" ? Math.min(o.value, S.width) : o.value),
      maxWidth: Xe(a6(sn(G.x, o.value === 1 / 0 ? 0 : o.value, c.value))),
      maxHeight: Xe(a6(sn(G.y, u.value === 1 / 0 ? 0 : u.value, f.value)))
    }), {
      available: G,
      contentBox: _,
      flipped: U
    };
  }
  return be(() => [r.value, i.value, t.offset, t.minWidth, t.minHeight, t.maxWidth, t.maxHeight], () => w()), e2(() => {
    const _ = w();
    if (!_) return;
    const {
      available: V,
      contentBox: A
    } = _;
    A.height > V.y && requestAnimationFrame(() => {
      w(), requestAnimationFrame(() => {
        w();
      });
    });
  }), {
    updateLocation: w
  };
}
function el(e) {
  return Math.round(e * devicePixelRatio) / devicePixelRatio;
}
function a6(e) {
  return Math.ceil(e * devicePixelRatio) / devicePixelRatio;
}
let Al = !0;
const Ir = [];
function Gf(e) {
  !Al || Ir.length ? (Ir.push(e), $l()) : (Al = !1, e(), $l());
}
let r6 = -1;
function $l() {
  cancelAnimationFrame(r6), r6 = requestAnimationFrame(() => {
    const e = Ir.shift();
    e && e(), Ir.length ? $l() : Al = !0;
  });
}
const e4 = {
  none: null,
  close: Xf,
  block: Qf,
  reposition: Jf
}, Zf = Le({
  scrollStrategy: {
    type: [String, Function],
    default: "block",
    validator: (e) => typeof e == "function" || e in e4
  }
}, "VOverlay-scroll-strategies");
function Yf(e, t) {
  if (!Z2) return;
  let n;
  b2(async () => {
    n?.stop(), t.isActive.value && e.scrollStrategy && (n = fn(), await new Promise((a) => setTimeout(a)), n.active && n.run(() => {
      typeof e.scrollStrategy == "function" ? e.scrollStrategy(t, e, n) : e4[e.scrollStrategy]?.(t, e, n);
    }));
  }), i2(() => {
    n?.stop();
  });
}
function Xf(e) {
  function t(n) {
    e.isActive.value = !1;
  }
  t4(Eo(e.target.value, e.contentEl.value), t);
}
function Qf(e, t) {
  const n = e.root.value?.offsetParent, a = Eo(e.target.value, e.contentEl.value), r = [.../* @__PURE__ */ new Set([...Sr(a, t.contained ? n : void 0), ...Sr(e.contentEl.value, t.contained ? n : void 0)])].filter((u) => !u.classList.contains("v-overlay-scroll-blocked")), i = window.innerWidth - document.documentElement.offsetWidth, o = ((u) => yo(u) && u)(n || document.documentElement);
  o && e.root.value.classList.add("v-overlay--scroll-blocked"), r.forEach((u, c) => {
    u.style.setProperty("--v-body-scroll-x", Xe(-u.scrollLeft)), u.style.setProperty("--v-body-scroll-y", Xe(-u.scrollTop)), u !== document.documentElement && u.style.setProperty("--v-scrollbar-offset", Xe(i)), u.classList.add("v-overlay-scroll-blocked");
  }), i2(() => {
    r.forEach((u, c) => {
      const f = parseFloat(u.style.getPropertyValue("--v-body-scroll-x")), v = parseFloat(u.style.getPropertyValue("--v-body-scroll-y")), h = u.style.scrollBehavior;
      u.style.scrollBehavior = "auto", u.style.removeProperty("--v-body-scroll-x"), u.style.removeProperty("--v-body-scroll-y"), u.style.removeProperty("--v-scrollbar-offset"), u.classList.remove("v-overlay-scroll-blocked"), u.scrollLeft = -f, u.scrollTop = -v, u.style.scrollBehavior = h;
    }), o && e.root.value.classList.remove("v-overlay--scroll-blocked");
  });
}
function Jf(e, t, n) {
  let a = !1, r = -1, i = -1;
  function o(u) {
    Gf(() => {
      const c = performance.now();
      e.updateLocation.value?.(u), a = (performance.now() - c) / (1e3 / 60) > 2;
    });
  }
  i = (typeof requestIdleCallback > "u" ? (u) => u() : requestIdleCallback)(() => {
    n.run(() => {
      t4(Eo(e.target.value, e.contentEl.value), (u) => {
        a ? (cancelAnimationFrame(r), r = requestAnimationFrame(() => {
          r = requestAnimationFrame(() => {
            o(u);
          });
        })) : o(u);
      });
    });
  }), i2(() => {
    typeof cancelIdleCallback < "u" && cancelIdleCallback(i), cancelAnimationFrame(r);
  });
}
function Eo(e, t) {
  return Array.isArray(e) ? document.elementsFromPoint(...e).find((n) => !t?.contains(n)) : e ?? t;
}
function t4(e, t) {
  const n = [document, ...Sr(e)];
  n.forEach((a) => {
    a.addEventListener("scroll", t, {
      passive: !0
    });
  }), i2(() => {
    n.forEach((a) => {
      a.removeEventListener("scroll", t);
    });
  });
}
const ev = /* @__PURE__ */ Symbol.for("vuetify:v-menu"), tv = Le({
  closeDelay: [Number, String],
  openDelay: [Number, String]
}, "delay");
function nv(e, t) {
  let n = () => {
  };
  function a(o, u) {
    n?.();
    const c = o ? e.openDelay : e.closeDelay, f = Math.max(u?.minDelay ?? 0, Number(c ?? 0));
    return new Promise((v) => {
      n = m7(f, () => {
        t?.(o), v(o);
      });
    });
  }
  function r() {
    return a(!0);
  }
  function i(o) {
    return a(!1, o);
  }
  return {
    clearDelay: n,
    runOpenDelay: r,
    runCloseDelay: i
  };
}
const av = Le({
  target: [String, Object],
  activator: [String, Object],
  activatorProps: {
    type: Object,
    default: () => ({})
  },
  openOnClick: {
    type: Boolean,
    default: void 0
  },
  openOnHover: Boolean,
  openOnFocus: {
    type: Boolean,
    default: void 0
  },
  closeOnContentClick: Boolean,
  ...tv()
}, "VOverlay-activator");
function rv(e, t) {
  let {
    isActive: n,
    isTop: a,
    contentEl: r
  } = t;
  const i = O2("useActivator"), o = se();
  let u = !1, c = !1, f = !0;
  const v = E(() => e.openOnFocus || e.openOnFocus == null && e.openOnHover), h = E(() => e.openOnClick || e.openOnClick == null && !e.openOnHover && !v.value), {
    runOpenDelay: y,
    runCloseDelay: p
  } = nv(e, (x) => {
    x === (e.openOnHover && u || v.value && c) && !(e.openOnHover && n.value && !a.value) && (n.value !== x && (f = !0), n.value = x);
  }), k = se(), S = {
    onClick: (x) => {
      x.stopPropagation(), o.value = x.currentTarget || x.target, n.value || (k.value = [x.clientX, x.clientY]), n.value = !n.value;
    },
    onMouseenter: (x) => {
      u = !0, o.value = x.currentTarget || x.target, y();
    },
    onMouseleave: (x) => {
      u = !1, p();
    },
    onFocus: (x) => {
      v7(x.target, ":focus-visible") !== !1 && (c = !0, x.stopPropagation(), o.value = x.currentTarget || x.target, y());
    },
    onBlur: (x) => {
      c = !1, x.stopPropagation(), p({
        minDelay: 1
      });
    }
  }, w = E(() => {
    const x = {};
    return h.value && (x.onClick = S.onClick), e.openOnHover && (x.onMouseenter = S.onMouseenter, x.onMouseleave = S.onMouseleave), v.value && (x.onFocus = S.onFocus, x.onBlur = S.onBlur), x;
  }), _ = E(() => {
    const x = {};
    if (e.openOnHover && (x.onMouseenter = () => {
      u = !0, y();
    }, x.onMouseleave = () => {
      u = !1, p();
    }), v.value && (x.onFocusin = (G) => {
      G.target.matches(":focus-visible") && (c = !0, y());
    }, x.onFocusout = () => {
      c = !1, p({
        minDelay: 1
      });
    }), e.closeOnContentClick) {
      const G = We(ev, null);
      x.onClick = () => {
        n.value = !1, G?.closeParents();
      };
    }
    return x;
  }), V = E(() => {
    const x = {};
    return e.openOnHover && (x.onMouseenter = () => {
      f && (u = !0, f = !1, y());
    }, x.onMouseleave = () => {
      u = !1, p();
    }), x;
  });
  be(a, (x) => {
    x && (e.openOnHover && !u && (!v.value || !c) || v.value && !c && (!e.openOnHover || !u)) && !r.value?.contains(document.activeElement) && p();
  }), be(n, (x) => {
    x || setTimeout(() => {
      k.value = void 0;
    });
  }, {
    flush: "post"
  });
  const A = pl();
  b2(() => {
    A.value && e2(() => {
      o.value = A.el;
    });
  });
  const T = pl(), O = E(() => e.target === "cursor" && k.value ? k.value : T.value ? T.el : n4(e.target, i) || o.value), Y = E(() => Array.isArray(O.value) ? void 0 : O.value);
  let F;
  return be(() => !!e.activator, (x) => {
    x && Z2 ? (F = fn(), F.run(() => {
      iv(e, i, {
        activatorEl: o,
        activatorEvents: w
      });
    })) : F && F.stop();
  }, {
    flush: "post",
    immediate: !0
  }), i2(() => {
    F?.stop();
  }), {
    activatorEl: o,
    activatorRef: A,
    target: O,
    targetEl: Y,
    targetRef: T,
    activatorEvents: w,
    contentEvents: _,
    scrimEvents: V
  };
}
function iv(e, t, n) {
  let {
    activatorEl: a,
    activatorEvents: r
  } = n;
  be(() => e.activator, (c, f) => {
    if (f && c !== f) {
      const v = u(f);
      v && o(v);
    }
    c && e2(() => i());
  }, {
    immediate: !0
  }), be(() => e.activatorProps, () => {
    i();
  }), i2(() => {
    o();
  });
  function i() {
    let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : u(), f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
    c && w7(c, me(r.value, f));
  }
  function o() {
    let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : u(), f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e.activatorProps;
    c && x7(c, me(r.value, f));
  }
  function u() {
    let c = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : e.activator;
    const f = n4(c, t);
    return a.value = f?.nodeType === Node.ELEMENT_NODE ? f : void 0, a.value;
  }
}
function n4(e, t) {
  if (!e) return;
  let n;
  if (e === "parent") {
    let a = t?.proxy?.$el?.parentNode;
    for (; a?.hasAttribute("data-no-activator"); )
      a = a.parentNode;
    n = a;
  } else typeof e == "string" ? n = document.querySelector(e) : "$el" in e ? n = e.$el : n = e;
  return n;
}
const lv = Le({
  retainFocus: Boolean,
  captureFocus: Boolean,
  /** @deprecated */
  disableInitialFocus: Boolean
}, "focusTrap"), ir = /* @__PURE__ */ new Map();
let i6 = 0;
function l6(e) {
  const t = document.activeElement;
  if (e.key !== "Tab" || !t) return;
  const n = Array.from(ir.values()).filter((f) => {
    let {
      isActive: v,
      contentEl: h
    } = f;
    return v.value && h.value?.contains(t);
  }).map((f) => f.contentEl.value);
  let a, r = t.parentElement;
  for (; r; ) {
    if (n.includes(r)) {
      a = r;
      break;
    }
    r = r.parentElement;
  }
  if (!a) return;
  const i = ar(a).filter((f) => f.tabIndex >= 0);
  if (!i.length) return;
  const o = document.activeElement;
  if (i.length === 1 && i[0].classList.contains("v-list") && i[0].contains(o)) {
    e.preventDefault();
    return;
  }
  const u = i[0], c = i[i.length - 1];
  e.shiftKey && (o === u || u.classList.contains("v-list") && u.contains(o)) && (e.preventDefault(), c.focus()), !e.shiftKey && (o === c || c.classList.contains("v-list") && c.contains(o)) && (e.preventDefault(), u.focus());
}
function ov(e, t) {
  let {
    isActive: n,
    localTop: a,
    contentEl: r
  } = t;
  const i = /* @__PURE__ */ Symbol("trap");
  let o = !1, u = -1;
  async function c() {
    o = !0, u = window.setTimeout(() => {
      o = !1;
    }, 100);
  }
  async function f(y) {
    const p = y.relatedTarget, k = y.target;
    document.removeEventListener("pointerdown", c), document.removeEventListener("keydown", v), await e2(), n.value && !o && p !== k && r.value && // We're the menu without open submenus or overlays
    u2(a) && // It isn't the document or the container body
    ![document, r.value].includes(k) && // It isn't inside the container body
    !r.value.contains(k) && ar(r.value)[0]?.focus();
  }
  function v(y) {
    if (y.key === "Tab" && (document.removeEventListener("keydown", v), n.value && r.value && y.target && !r.value.contains(y.target))) {
      const p = ar(document.documentElement);
      if (y.shiftKey && y.target === p.at(0) || !y.shiftKey && y.target === p.at(-1)) {
        const k = ar(r.value);
        k.length > 0 && (y.preventDefault(), k[0].focus());
      }
    }
  }
  const h = R(() => n.value && e.captureFocus && !e.disableInitialFocus);
  Z2 && (be(() => e.retainFocus, (y) => {
    y ? ir.set(i, {
      isActive: n,
      contentEl: r
    }) : ir.delete(i);
  }, {
    immediate: !0
  }), be(h, (y) => {
    y ? (document.addEventListener("pointerdown", c), document.addEventListener("focusin", f, {
      once: !0
    }), document.addEventListener("keydown", v)) : (document.removeEventListener("pointerdown", c), document.removeEventListener("focusin", f), document.removeEventListener("keydown", v));
  }, {
    immediate: !0
  }), i6++ < 1 && document.addEventListener("keydown", l6)), i2(() => {
    ir.delete(i), clearTimeout(u), document.removeEventListener("pointerdown", c), document.removeEventListener("focusin", f), document.removeEventListener("keydown", v), --i6 < 1 && document.removeEventListener("keydown", l6);
  });
}
const sv = /* @__PURE__ */ Symbol.for("vuetify:display");
function uv() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
    mobile: null
  }, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : $t();
  const n = We(sv);
  if (!n) throw new Error("Could not find Vuetify display injection");
  const a = E(() => e.mobile ? !0 : typeof e.mobileBreakpoint == "number" ? n.width.value < e.mobileBreakpoint : e.mobileBreakpoint ? n.width.value < n.thresholds.value[e.mobileBreakpoint] : e.mobile === null ? n.mobile.value : !1), r = R(() => t ? {
    [`${t}--mobile`]: a.value
  } : {});
  return {
    ...n,
    displayClasses: r,
    mobile: a
  };
}
function cv() {
  if (!Z2) return Ve(!1);
  const {
    ssr: e
  } = uv();
  if (e) {
    const t = Ve(!1);
    return yt(() => {
      t.value = !0;
    }), t;
  } else
    return Ve(!0);
}
const dv = Le({
  eager: Boolean
}, "lazy");
function fv(e, t) {
  const n = Ve(!1), a = R(() => n.value || e.eager || t.value);
  be(t, () => n.value = !0);
  function r() {
    e.eager || (n.value = !1);
  }
  return {
    isBooted: n,
    hasContent: a,
    onAfterLeave: r
  };
}
function a4() {
  const t = O2("useScopeId").vnode.scopeId;
  return {
    scopeId: t ? {
      [t]: ""
    } : void 0
  };
}
const o6 = /* @__PURE__ */ Symbol.for("vuetify:stack"), On = ct([]);
function vv(e, t, n) {
  const a = O2("useStack"), r = !n, i = We(o6, void 0), o = ct({
    activeChildren: /* @__PURE__ */ new Set()
  });
  c2(o6, o);
  const u = Ve(Number(u2(t)));
  O0(e, () => {
    const v = On.at(-1)?.[1];
    u.value = v ? v + 10 : Number(u2(t)), r && On.push([a.uid, u.value]), i?.activeChildren.add(a.uid), i2(() => {
      if (r) {
        const h = m2(On).findIndex((y) => y[0] === a.uid);
        On.splice(h, 1);
      }
      i?.activeChildren.delete(a.uid);
    });
  });
  const c = Ve(!0);
  r && b2(() => {
    const v = On.at(-1)?.[0] === a.uid;
    setTimeout(() => c.value = v);
  });
  const f = R(() => !o.activeChildren.size);
  return {
    globalTop: ia(c),
    localTop: f,
    stackStyles: R(() => ({
      zIndex: u.value
    }))
  };
}
function mv(e) {
  return {
    teleportTarget: E(() => {
      const n = e();
      if (n === !0 || !Z2) return;
      const a = n === !1 ? document.body : typeof n == "string" ? document.querySelector(n) : n;
      if (a == null) {
        F0(`Unable to locate target ${n}`);
        return;
      }
      let r = [...a.children].find((i) => i.matches(".v-overlay-container"));
      return r || (r = document.createElement("div"), r.className = "v-overlay-container", a.appendChild(r)), r;
    })
  };
}
function gv() {
  return !0;
}
function r4(e, t, n) {
  if (!e || i4(e, n) === !1) return !1;
  const a = $u(t);
  if (typeof ShadowRoot < "u" && a instanceof ShadowRoot && a.host === e.target) return !1;
  const r = (typeof n.value == "object" && n.value.include || (() => []))();
  return r.push(t), !r.some((i) => i?.contains(e.target));
}
function i4(e, t) {
  return (typeof t.value == "object" && t.value.closeConditional || gv)(e);
}
function hv(e, t, n) {
  const a = typeof n.value == "function" ? n.value : n.value.handler;
  e.shadowTarget = e.target, t._clickOutside.lastMousedownWasOutside && r4(e, t, n) && setTimeout(() => {
    i4(e, n) && a && a(e);
  }, 0);
}
function s6(e, t) {
  const n = $u(e);
  t(document), typeof ShadowRoot < "u" && n instanceof ShadowRoot && t(n);
}
const u6 = {
  // [data-app] may not be found
  // if using bind, inserted makes
  // sure that the root element is
  // available, iOS does not support
  // clicks on body
  mounted(e, t) {
    const n = (r) => hv(r, e, t), a = (r) => {
      e._clickOutside.lastMousedownWasOutside = r4(r, e, t);
    };
    s6(e, (r) => {
      r.addEventListener("click", n, !0), r.addEventListener("mousedown", a, !0);
    }), e._clickOutside || (e._clickOutside = {
      lastMousedownWasOutside: !1
    }), e._clickOutside[t.instance.$.uid] = {
      onClick: n,
      onMousedown: a
    };
  },
  beforeUnmount(e, t) {
    e._clickOutside && (s6(e, (n) => {
      if (!n || !e._clickOutside?.[t.instance.$.uid]) return;
      const {
        onClick: a,
        onMousedown: r
      } = e._clickOutside[t.instance.$.uid];
      n.removeEventListener("click", a, !0), n.removeEventListener("mousedown", r, !0);
    }), delete e._clickOutside[t.instance.$.uid]);
  }
};
function yv(e) {
  const {
    modelValue: t,
    color: n,
    ...a
  } = e;
  return g(G2, {
    name: "fade-transition",
    appear: !0
  }, {
    default: () => [e.modelValue && I("div", me({
      class: ["v-overlay__scrim", e.color.backgroundColorClasses.value],
      style: e.color.backgroundColorStyles.value
    }, a), null)]
  });
}
const l4 = Le({
  absolute: Boolean,
  attach: [Boolean, String, Object],
  closeOnBack: {
    type: Boolean,
    default: !0
  },
  contained: Boolean,
  contentClass: null,
  contentProps: null,
  disabled: Boolean,
  opacity: [Number, String],
  noClickAnimation: Boolean,
  modelValue: Boolean,
  persistent: Boolean,
  scrim: {
    type: [Boolean, String],
    default: !0
  },
  zIndex: {
    type: [Number, String],
    default: 2e3
  },
  ...av(),
  ...S2(),
  ...ga(),
  ...dv(),
  ...Kf(),
  ...Zf(),
  ...lv(),
  ...kt(),
  ...Gr()
}, "VOverlay"), c6 = o2()({
  name: "VOverlay",
  directives: {
    vClickOutside: u6
  },
  inheritAttrs: !1,
  props: {
    _disableGlobalStack: Boolean,
    ...ma(l4(), ["disableInitialFocus"])
  },
  emits: {
    "click:outside": (e) => !0,
    "update:modelValue": (e) => !0,
    keydown: (e) => !0,
    afterEnter: () => !0,
    afterLeave: () => !0
  },
  setup(e, t) {
    let {
      slots: n,
      attrs: a,
      emit: r
    } = t;
    const i = O2("VOverlay"), o = se(), u = se(), c = se(), f = D0(e, "modelValue"), v = E({
      get: () => f.value,
      set: (de) => {
        de && e.disabled || (f.value = de);
      }
    }), {
      themeClasses: h
    } = Gt(e), {
      rtlClasses: y,
      isRtl: p
    } = Ca(), {
      hasContent: k,
      onAfterLeave: S
    } = fv(e, v), w = ln(() => typeof e.scrim == "string" ? e.scrim : null), {
      globalTop: _,
      localTop: V,
      stackStyles: A
    } = vv(v, () => e.zIndex, e._disableGlobalStack), {
      activatorEl: T,
      activatorRef: O,
      target: Y,
      targetEl: F,
      targetRef: x,
      activatorEvents: G,
      contentEvents: U,
      scrimEvents: ee
    } = rv(e, {
      isActive: v,
      isTop: V,
      contentEl: c
    }), {
      teleportTarget: J
    } = mv(() => {
      const de = e.attach || e.contained;
      if (de) return de;
      const Be = T?.value?.getRootNode() || i.proxy?.$el?.getRootNode();
      return Be instanceof ShadowRoot ? Be : !1;
    }), {
      dimensionStyles: ae
    } = ha(e), oe = cv(), {
      scopeId: te
    } = a4();
    be(() => e.disabled, (de) => {
      de && (v.value = !1);
    });
    const {
      contentStyles: L,
      updateLocation: X
    } = Wf(e, {
      isRtl: p,
      contentEl: c,
      target: Y,
      isActive: v
    });
    Yf(e, {
      root: o,
      contentEl: c,
      targetEl: F,
      target: Y,
      isActive: v,
      updateLocation: X
    });
    function re(de) {
      r("click:outside", de), e.persistent ? Pe() : v.value = !1;
    }
    function we(de) {
      return v.value && V.value && // If using scrim, only close if clicking on it rather than anything opened on top
      (!e.scrim || de.target === u.value || de instanceof MouseEvent && de.shadowTarget === u.value);
    }
    ov(e, {
      isActive: v,
      localTop: V,
      contentEl: c
    }), Z2 && be(v, (de) => {
      de ? window.addEventListener("keydown", le) : window.removeEventListener("keydown", le);
    }, {
      immediate: !0
    }), W2(() => {
      Z2 && window.removeEventListener("keydown", le);
    });
    function le(de) {
      de.key === "Escape" && _.value && (c.value?.contains(document.activeElement) || r("keydown", de), e.persistent ? Pe() : (v.value = !1, c.value?.contains(document.activeElement) && T.value?.focus()));
    }
    function ke(de) {
      de.key === "Escape" && !_.value || r("keydown", de);
    }
    const fe = mf();
    O0(() => e.closeOnBack, () => {
      gf(fe, () => {
        if (_.value && v.value)
          return e.persistent ? Pe() : v.value = !1, !1;
      });
    });
    const ne = se();
    be(() => v.value && (e.absolute || e.contained) && J.value == null, (de) => {
      if (de) {
        const Be = M7(o.value);
        Be && Be !== document.scrollingElement && (ne.value = Be.scrollTop);
      }
    });
    function Pe() {
      e.noClickAnimation || c.value && n0(c.value, [{
        transformOrigin: "center"
      }, {
        transform: "scale(1.03)"
      }, {
        transformOrigin: "center"
      }], {
        duration: 150,
        easing: xr
      });
    }
    function Re() {
      r("afterEnter");
    }
    function De() {
      S(), r("afterLeave");
    }
    return h2(() => I(je, null, [n.activator?.({
      isActive: v.value,
      targetRef: x,
      props: me({
        ref: O
      }, G.value, e.activatorProps)
    }), oe.value && k.value && g(_6, {
      disabled: !J.value,
      to: J.value
    }, {
      default: () => [I("div", me({
        class: ["v-overlay", {
          "v-overlay--absolute": e.absolute || e.contained,
          "v-overlay--active": v.value,
          "v-overlay--contained": e.contained
        }, h.value, y.value, e.class],
        style: [A.value, {
          "--v-overlay-opacity": e.opacity,
          top: Xe(ne.value)
        }, e.style],
        ref: o,
        onKeydown: ke
      }, te, a), [g(yv, me({
        color: w,
        modelValue: v.value && !!e.scrim,
        ref: u
      }, ee.value), null), g(_0, {
        appear: !0,
        persisted: !0,
        transition: e.transition,
        target: Y.value,
        onAfterEnter: Re,
        onAfterLeave: De
      }, {
        default: () => [g2(I("div", me({
          ref: c,
          class: ["v-overlay__content", e.contentClass],
          style: [ae.value, L.value]
        }, U.value, e.contentProps), [n.default?.({
          isActive: v
        })]), [[dt, v.value], [u6, {
          handler: re,
          closeConditional: we,
          include: () => [T.value]
        }]])]
      })])]
    })])), {
      activatorEl: T,
      scrimEl: u,
      target: Y,
      animateClick: Pe,
      contentEl: c,
      rootEl: o,
      globalTop: _,
      localTop: V,
      updateLocation: X
    };
  }
}), tl = /* @__PURE__ */ Symbol("Forwarded refs");
function nl(e, t) {
  let n = e;
  for (; n; ) {
    const a = Reflect.getOwnPropertyDescriptor(n, t);
    if (a) return a;
    n = Object.getPrototypeOf(n);
  }
}
function o4(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++)
    n[a - 1] = arguments[a];
  return e[tl] = n, new Proxy(e, {
    get(r, i) {
      if (Reflect.has(r, i))
        return Reflect.get(r, i);
      if (!(typeof i == "symbol" || i.startsWith("$") || i.startsWith("__"))) {
        for (const o of n)
          if (o.value && Reflect.has(o.value, i)) {
            const u = Reflect.get(o.value, i);
            return typeof u == "function" ? u.bind(o.value) : u;
          }
      }
    },
    has(r, i) {
      if (Reflect.has(r, i))
        return !0;
      if (typeof i == "symbol" || i.startsWith("$") || i.startsWith("__")) return !1;
      for (const o of n)
        if (o.value && Reflect.has(o.value, i))
          return !0;
      return !1;
    },
    set(r, i, o) {
      if (Reflect.has(r, i))
        return Reflect.set(r, i, o);
      if (typeof i == "symbol" || i.startsWith("$") || i.startsWith("__")) return !1;
      for (const u of n)
        if (u.value && Reflect.has(u.value, i))
          return Reflect.set(u.value, i, o);
      return !1;
    },
    getOwnPropertyDescriptor(r, i) {
      const o = Reflect.getOwnPropertyDescriptor(r, i);
      if (o) return o;
      if (!(typeof i == "symbol" || i.startsWith("$") || i.startsWith("__"))) {
        for (const u of n) {
          if (!u.value) continue;
          const c = nl(u.value, i) ?? ("_" in u.value ? nl(u.value._?.setupState, i) : void 0);
          if (c) return c;
        }
        for (const u of n) {
          const c = u.value && u.value[tl];
          if (!c) continue;
          const f = c.slice();
          for (; f.length; ) {
            const v = f.shift(), h = nl(v.value, i);
            if (h) return h;
            const y = v.value && v.value[tl];
            y && f.push(...y);
          }
        }
      }
    }
  });
}
const Cv = Le({
  fullscreen: Boolean,
  scrollable: Boolean,
  ...ma(l4({
    captureFocus: !0,
    origin: "center center",
    scrollStrategy: "block",
    transition: {
      component: Nf
    },
    zIndex: 2400,
    retainFocus: !0
  }), ["disableInitialFocus"])
}, "VDialog"), pv = o2()({
  name: "VDialog",
  props: Cv(),
  emits: {
    "update:modelValue": (e) => !0,
    afterEnter: () => !0,
    afterLeave: () => !0
  },
  setup(e, t) {
    let {
      emit: n,
      slots: a
    } = t;
    const r = D0(e, "modelValue"), {
      scopeId: i
    } = a4(), o = se();
    function u() {
      n("afterEnter"), (e.scrim || e.retainFocus) && o.value?.contentEl && !o.value.contentEl.contains(document.activeElement) && o.value.contentEl.focus({
        preventScroll: !0
      });
    }
    function c() {
      n("afterLeave");
    }
    return be(r, async (f) => {
      f || (await e2(), o.value.activatorEl?.focus({
        preventScroll: !0
      }));
    }), h2(() => {
      const f = c6.filterProps(e), v = me({
        "aria-haspopup": "dialog"
      }, e.activatorProps), h = me({
        tabindex: -1
      }, e.contentProps);
      return g(c6, me({
        ref: o,
        class: ["v-dialog", {
          "v-dialog--fullscreen": e.fullscreen,
          "v-dialog--scrollable": e.scrollable
        }, e.class],
        style: e.style
      }, f, {
        modelValue: r.value,
        "onUpdate:modelValue": (y) => r.value = y,
        "aria-modal": "true",
        activatorProps: v,
        contentProps: h,
        height: e.fullscreen ? void 0 : e.height,
        width: e.fullscreen ? void 0 : e.width,
        maxHeight: e.fullscreen ? void 0 : e.maxHeight,
        maxWidth: e.fullscreen ? void 0 : e.maxWidth,
        role: "dialog",
        onAfterEnter: u,
        onAfterLeave: c
      }, i), {
        activator: a.activator,
        default: function() {
          for (var y = arguments.length, p = new Array(y), k = 0; k < y; k++)
            p[k] = arguments[k];
          return g(zt, {
            root: "VDialog"
          }, {
            default: () => [a.default?.(...p)]
          });
        }
      });
    }), o4({}, o);
  }
}), d6 = Au("v-spacer", "div", "VSpacer"), bv = { class: "bg-white-opacity-5 rounded-lg pa-4 my-6 font-weight-bold border-thin text-center" }, wv = { class: "text-white" }, xv = {
  __name: "DeleteDialog",
  props: {
    show: {
      type: Boolean,
      default: !1
    },
    item: {
      type: Object,
      default: void 0
    },
    selectedCount: {
      type: Number,
      default: 0
    }
  },
  emits: ["update:show", "confirm"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, r) => (Ne(), n2(pv, {
      "model-value": e.show,
      "onUpdate:modelValue": r[4] || (r[4] = (i) => n("update:show", i)),
      "max-width": "400"
    }, {
      default: M(() => [
        e.item ? (Ne(), n2(Vr, {
          key: 0,
          variant: "panel",
          padding: "pa-8"
        }, {
          default: M(() => [
            g(Sl, { class: "pb-2 text-h5 font-weight-bold d-flex align-center text-white" }, {
              default: M(() => [
                g(J2, {
                  icon: "mdi-trash-can-outline",
                  class: "mr-3 text-h4",
                  color: "error"
                }),
                r[5] || (r[5] = pe(" Delete Item ", -1))
              ]),
              _: 1
            }),
            g(Pl, { class: "pa-0 mt-4 text-white opacity-80" }, {
              default: M(() => [
                r[6] || (r[6] = pe(" Are you sure you want to delete this item? ", -1)),
                I("div", bv, a2(e.item.name), 1)
              ]),
              _: 1
            }),
            g(xl, { class: "px-0 pb-0" }, {
              default: M(() => [
                g(Ja, {
                  variant: "text",
                  color: "white",
                  size: "large",
                  onClick: r[0] || (r[0] = (i) => n("update:show", !1)),
                  class: "text-none rounded-lg"
                }, {
                  default: M(() => [
                    g(J2, { start: "" }, {
                      default: M(() => [...r[7] || (r[7] = [
                        pe("mdi-close-circle-outline", -1)
                      ])]),
                      _: 1
                    }),
                    r[8] || (r[8] = pe(" Cancel ", -1))
                  ]),
                  _: 1
                }),
                g(d6),
                g(Ja, {
                  color: "error",
                  size: "large",
                  variant: "flat",
                  onClick: r[1] || (r[1] = (i) => n("confirm")),
                  class: "text-none rounded-lg font-weight-bold",
                  elevation: "4"
                }, {
                  default: M(() => [
                    g(J2, { start: "" }, {
                      default: M(() => [...r[9] || (r[9] = [
                        pe("mdi-trash-can-outline", -1)
                      ])]),
                      _: 1
                    }),
                    r[10] || (r[10] = pe(" Delete ", -1))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })) : (Ne(), n2(Vr, {
          key: 1,
          variant: "panel",
          padding: "pa-8"
        }, {
          default: M(() => [
            g(Sl, { class: "pb-2 text-h5 font-weight-bold d-flex align-center text-white" }, {
              default: M(() => [
                g(J2, {
                  icon: "mdi-alert-circle-outline",
                  class: "mr-3 text-h4",
                  color: "error"
                }),
                r[11] || (r[11] = pe(" Delete Items ", -1))
              ]),
              _: 1
            }),
            g(Pl, { class: "pa-0 mt-4 text-white opacity-80" }, {
              default: M(() => [
                r[12] || (r[12] = pe(" Are you sure you want to delete ", -1)),
                I("strong", wv, a2(e.selectedCount), 1),
                r[13] || (r[13] = pe(" items? ", -1))
              ]),
              _: 1
            }),
            g(xl, { class: "px-0 pb-0 mt-8" }, {
              default: M(() => [
                g(Ja, {
                  variant: "text",
                  color: "white",
                  size: "large",
                  onClick: r[2] || (r[2] = (i) => n("update:show", !1)),
                  class: "text-none rounded-lg"
                }, {
                  default: M(() => [
                    g(J2, { start: "" }, {
                      default: M(() => [...r[14] || (r[14] = [
                        pe("mdi-close-circle-outline", -1)
                      ])]),
                      _: 1
                    }),
                    r[15] || (r[15] = pe(" Cancel ", -1))
                  ]),
                  _: 1
                }),
                g(d6),
                g(Ja, {
                  color: "error",
                  size: "large",
                  variant: "flat",
                  onClick: r[3] || (r[3] = (i) => n("confirm")),
                  class: "text-none rounded-lg font-weight-bold",
                  elevation: "4"
                }, {
                  default: M(() => [
                    g(J2, { start: "" }, {
                      default: M(() => [...r[16] || (r[16] = [
                        pe("mdi-trash-can-outline", -1)
                      ])]),
                      _: 1
                    }),
                    r[17] || (r[17] = pe(" Delete All ", -1))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }))
      ]),
      _: 1
    }, 8, ["model-value"]));
  }
}, Sv = { class: "d-flex align-center ga-2 text-white" }, kv = { class: "text-body-2" }, _v = {
  __name: "CreateEntityForm",
  props: {
    types: { type: Array, required: !0 },
    iconMap: { type: Object, required: !0 }
  },
  emits: ["create"],
  setup(e, { emit: t }) {
    const n = t, a = se(""), r = se(void 0);
    function i() {
      !a.value || !r.value || (n("create", { type: r.value, name: a.value }), a.value = "");
    }
    return (o, u) => (Ne(), n2(o8, {
      fluid: "",
      class: "pa-0 pb-2"
    }, {
      default: M(() => [
        g(a0, {
          color: "transparent",
          class: "d-flex align-center ga-3"
        }, {
          default: M(() => [
            g(ze, {
              color: "white",
              size: "24"
            }, {
              default: M(() => [...u[2] || (u[2] = [
                pe("mdi-tag-plus-outline", -1)
              ])]),
              _: 1
            }),
            g(d0, { class: "text-h5 font-weight-bold text-white px-0" }, {
              default: M(() => [...u[3] || (u[3] = [
                pe("Create New Tag", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }),
        g(A2, {
          dense: "",
          align: "center"
        }, {
          default: M(() => [
            g(Ye, {
              cols: "12",
              sm: "4",
              md: "3"
            }, {
              default: M(() => [
                g(mt, {
                  modelValue: r.value,
                  "onUpdate:modelValue": u[0] || (u[0] = (c) => r.value = c),
                  items: e.types,
                  label: "Type",
                  density: "compact",
                  variant: "outlined",
                  "hide-details": "",
                  class: "rounded-lg text-white",
                  "bg-color": "transparent",
                  color: "white",
                  "base-color": "white",
                  theme: "dark",
                  "menu-props": { theme: "dark", rounded: "lg" }
                }, {
                  selection: M(({ item: c }) => [
                    I("div", Sv, [
                      c ? (Ne(), n2(ze, {
                        key: 0,
                        icon: e.iconMap[c.raw],
                        size: "18",
                        class: "opacity-70"
                      }, null, 8, ["icon"])) : D2("", !0),
                      I("span", kv, a2(c.raw), 1)
                    ])
                  ]),
                  item: M(({ props: c, item: f }) => [
                    g(vt, me(c, {
                      density: "compact",
                      class: "px-3",
                      theme: "dark"
                    }), {
                      prepend: M(() => [
                        g(ze, {
                          icon: e.iconMap[f.raw],
                          size: "18",
                          class: "opacity-70"
                        }, null, 8, ["icon"])
                      ]),
                      _: 2
                    }, 1040)
                  ]),
                  _: 1
                }, 8, ["modelValue", "items"])
              ]),
              _: 1
            }),
            g(Ye, {
              cols: "12",
              sm: "5",
              md: "7"
            }, {
              default: M(() => [
                g(P2, {
                  modelValue: a.value,
                  "onUpdate:modelValue": u[1] || (u[1] = (c) => a.value = c),
                  label: "Tag Name (e.g. Faille Nord)",
                  density: "compact",
                  variant: "outlined",
                  "hide-details": "",
                  class: "rounded-lg text-white",
                  "bg-color": "transparent",
                  color: "white",
                  "base-color": "white",
                  theme: "dark",
                  onKeyup: h3(i, ["enter"])
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            g(Ye, {
              cols: "12",
              sm: "3",
              md: "2"
            }, {
              default: M(() => [
                g(Je, {
                  color: "primary",
                  block: "",
                  height: "40",
                  disabled: !a.value || !r.value,
                  variant: "flat",
                  class: "rounded-lg font-weight-bold text-none text-body-2",
                  elevation: "0",
                  theme: "dark",
                  onClick: i
                }, {
                  default: M(() => [...u[4] || (u[4] = [
                    pe(" Create Tag ", -1)
                  ])]),
                  _: 1
                }, 8, ["disabled"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        g(Wt, { class: "mt-8 border-opacity-10" })
      ]),
      _: 1
    }));
  }
}, Pv = Le({
  active: Boolean,
  disabled: Boolean,
  max: [Number, String],
  value: {
    type: [Number, String],
    default: 0
  },
  ...S2(),
  ...Gr({
    transition: {
      component: Qu
    }
  })
}, "VCounter"), Vv = o2()({
  name: "VCounter",
  functional: !0,
  props: Pv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = R(() => e.max ? `${e.value} / ${e.max}` : String(e.value));
    return h2(() => g(_0, {
      transition: e.transition
    }, {
      default: () => [g2(I("div", {
        class: ve(["v-counter", {
          "text-error": e.max && !e.disabled && parseFloat(e.value) > parseFloat(e.max)
        }, e.class]),
        style: Ee(e.style)
      }, [n.default ? n.default({
        counter: a.value,
        max: e.max,
        value: e.value
      }) : a.value]), [[dt, e.active]])]
    })), {};
  }
}), Iv = Le({
  text: String,
  onClick: E0(),
  ...S2(),
  ...kt()
}, "VLabel"), Ev = o2()({
  name: "VLabel",
  props: Iv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return h2(() => I("label", {
      class: ve(["v-label", {
        "v-label--clickable": !!e.onClick
      }, e.class]),
      style: Ee(e.style),
      onClick: e.onClick
    }, [e.text, n.default?.()])), {};
  }
}), Av = Le({
  floating: Boolean,
  ...S2()
}, "VFieldLabel"), er = o2()({
  name: "VFieldLabel",
  props: Av(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    return h2(() => g(Ev, {
      class: ve(["v-field-label", {
        "v-field-label--floating": e.floating
      }, e.class]),
      style: Ee(e.style)
    }, n)), {};
  }
});
function s4(e) {
  const {
    t
  } = of();
  function n(a) {
    let {
      name: r,
      color: i,
      ...o
    } = a;
    const u = {
      prepend: "prependAction",
      prependInner: "prependAction",
      append: "appendAction",
      appendInner: "appendAction",
      clear: "clear"
    }[r], c = e[`onClick:${r}`];
    function f(h) {
      h.key !== "Enter" && h.key !== " " || (h.preventDefault(), h.stopPropagation(), Pu(c, new PointerEvent("click", h)));
    }
    const v = c && u ? t(`$vuetify.input.${u}`, e.label ?? "") : void 0;
    return g(J2, me({
      icon: e[`${r}Icon`],
      "aria-label": v,
      onClick: c,
      onKeydown: f,
      color: i
    }, o), null);
  }
  return {
    InputIcon: n
  };
}
const u4 = Le({
  focused: Boolean,
  "onUpdate:focused": E0()
}, "focus");
function c4(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : $t();
  const n = D0(e, "focused"), a = R(() => ({
    [`${t}--focused`]: n.value
  }));
  function r() {
    n.value = !0;
  }
  function i() {
    n.value = !1;
  }
  return {
    focusClasses: a,
    isFocused: n,
    focus: r,
    blur: i
  };
}
const $v = ["underlined", "outlined", "filled", "solo", "solo-inverted", "solo-filled", "plain"], d4 = Le({
  appendInnerIcon: U2,
  bgColor: String,
  clearable: Boolean,
  clearIcon: {
    type: U2,
    default: "$clear"
  },
  active: Boolean,
  centerAffix: {
    type: Boolean,
    default: void 0
  },
  color: String,
  baseColor: String,
  dirty: Boolean,
  disabled: {
    type: Boolean,
    default: null
  },
  glow: Boolean,
  error: Boolean,
  flat: Boolean,
  iconColor: [Boolean, String],
  label: String,
  persistentClear: Boolean,
  prependInnerIcon: U2,
  reverse: Boolean,
  singleLine: Boolean,
  variant: {
    type: String,
    default: "filled",
    validator: (e) => $v.includes(e)
  },
  "onClick:clear": E0(),
  "onClick:appendInner": E0(),
  "onClick:prependInner": E0(),
  ...S2(),
  ..._o(),
  ...M0(),
  ...kt()
}, "VField"), f6 = o2()({
  name: "VField",
  inheritAttrs: !1,
  props: {
    id: String,
    details: Boolean,
    labelId: String,
    ...u4(),
    ...d4()
  },
  emits: {
    "update:focused": (e) => !0,
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      emit: a,
      slots: r
    } = t;
    const {
      themeClasses: i
    } = Gt(e), {
      loaderClasses: o
    } = Po(e), {
      focusClasses: u,
      isFocused: c,
      focus: f,
      blur: v
    } = c4(e), {
      InputIcon: h
    } = s4(e), {
      roundedClasses: y
    } = R0(e), {
      rtlClasses: p
    } = Ca(), k = R(() => e.dirty || e.active), S = R(() => !!(e.label || r.label)), w = R(() => !e.singleLine && S.value), _ = Y2(), V = E(() => e.id || `input-${_}`), A = R(() => e.details ? `${V.value}-messages` : void 0), T = se(), O = se(), Y = se(), F = E(() => ["plain", "underlined"].includes(e.variant)), x = E(() => e.error || e.disabled ? void 0 : k.value && c.value ? e.color : e.baseColor), G = E(() => {
      if (!(!e.iconColor || e.glow && !c.value))
        return e.iconColor === !0 ? x.value : e.iconColor;
    }), {
      backgroundColorClasses: U,
      backgroundColorStyles: ee
    } = ln(() => e.bgColor), {
      textColorClasses: J,
      textColorStyles: ae
    } = un(x);
    be(k, (re) => {
      if (w.value && !ea()) {
        const we = T.value.$el, le = O.value.$el;
        requestAnimationFrame(() => {
          const ke = ho(we), fe = new nt(le), ne = fe.x - ke.x, Pe = fe.y - ke.y - (ke.height / 2 - fe.height / 2), Re = fe.width / 0.75, De = Math.abs(Re - ke.width) > 1 ? {
            maxWidth: Xe(Re)
          } : void 0, de = getComputedStyle(we), Be = getComputedStyle(le), ye = parseFloat(de.transitionDuration) * 1e3 || 150, f2 = parseFloat(Be.getPropertyValue("--v-field-label-scale")), F2 = Be.getPropertyValue("color");
          we.style.visibility = "visible", le.style.visibility = "hidden", n0(we, {
            transform: `translate(${ne}px, ${Pe}px) scale(${f2})`,
            color: F2,
            ...De
          }, {
            duration: ye,
            easing: xr,
            direction: re ? "normal" : "reverse"
          }).finished.then(() => {
            we.style.removeProperty("visibility"), le.style.removeProperty("visibility");
          });
        });
      }
    }, {
      flush: "post"
    });
    const oe = E(() => ({
      isActive: k,
      isFocused: c,
      controlRef: Y,
      iconColor: G,
      blur: v,
      focus: f
    })), te = R(() => {
      const re = !k.value;
      return {
        "aria-hidden": re,
        for: re ? void 0 : V.value
      };
    }), L = R(() => {
      const re = w.value && k.value;
      return {
        "aria-hidden": re,
        for: re ? void 0 : V.value
      };
    });
    function X(re) {
      re.target !== document.activeElement && re.preventDefault();
    }
    return h2(() => {
      const re = e.variant === "outlined", we = !!(r["prepend-inner"] || e.prependInnerIcon), le = !!(e.clearable || r.clear) && !e.disabled, ke = !!(r["append-inner"] || e.appendInnerIcon || le), fe = () => r.label ? r.label({
        ...oe.value,
        label: e.label,
        props: {
          for: V.value
        }
      }) : e.label;
      return I("div", me({
        class: ["v-field", {
          "v-field--active": k.value,
          "v-field--appended": ke,
          "v-field--center-affix": e.centerAffix ?? !F.value,
          "v-field--disabled": e.disabled,
          "v-field--dirty": e.dirty,
          "v-field--error": e.error,
          "v-field--glow": e.glow,
          "v-field--flat": e.flat,
          "v-field--has-background": !!e.bgColor,
          "v-field--persistent-clear": e.persistentClear,
          "v-field--prepended": we,
          "v-field--reverse": e.reverse,
          "v-field--single-line": e.singleLine,
          "v-field--no-label": !fe(),
          [`v-field--variant-${e.variant}`]: !0
        }, i.value, U.value, u.value, o.value, y.value, p.value, e.class],
        style: [ee.value, e.style],
        onClick: X
      }, n), [I("div", {
        class: "v-field__overlay"
      }, null), g(Mu, {
        name: "v-field",
        active: !!e.loading,
        color: e.error ? "error" : typeof e.loading == "string" ? e.loading : e.color
      }, {
        default: r.loader
      }), we && I("div", {
        key: "prepend",
        class: "v-field__prepend-inner"
      }, [r["prepend-inner"] ? r["prepend-inner"](oe.value) : e.prependInnerIcon && g(h, {
        key: "prepend-icon",
        name: "prependInner",
        color: G.value
      }, null)]), I("div", {
        class: "v-field__field",
        "data-no-activator": ""
      }, [["filled", "solo", "solo-inverted", "solo-filled"].includes(e.variant) && w.value && g(er, me({
        key: "floating-label",
        ref: O,
        class: [J.value],
        floating: !0
      }, te.value, {
        style: ae.value
      }), {
        default: () => [fe()]
      }), S.value && g(er, me({
        key: "label",
        ref: T,
        id: e.labelId
      }, L.value), {
        default: () => [fe()]
      }), r.default?.({
        ...oe.value,
        props: {
          id: V.value,
          class: "v-field__input",
          "aria-describedby": A.value
        },
        focus: f,
        blur: v
      }) ?? I("div", {
        id: V.value,
        class: "v-field__input",
        "aria-describedby": A.value
      }, null)]), le && g(zf, {
        key: "clear"
      }, {
        default: () => [g2(I("div", {
          class: "v-field__clearable",
          onMousedown: (ne) => {
            ne.preventDefault(), ne.stopPropagation();
          }
        }, [g(zt, {
          defaults: {
            VIcon: {
              icon: e.clearIcon
            }
          }
        }, {
          default: () => [r.clear ? r.clear({
            ...oe.value,
            props: {
              onFocus: f,
              onBlur: v,
              onClick: e["onClick:clear"],
              tabindex: -1
            }
          }) : g(h, {
            name: "clear",
            onFocus: f,
            onBlur: v,
            tabindex: -1
          }, null)]
        })]), [[dt, e.dirty]])]
      }), ke && I("div", {
        key: "append",
        class: "v-field__append-inner"
      }, [r["append-inner"] ? r["append-inner"](oe.value) : e.appendInnerIcon && g(h, {
        key: "append-icon",
        name: "appendInner",
        color: G.value
      }, null)]), I("div", {
        class: ve(["v-field__outline", J.value]),
        style: Ee(ae.value)
      }, [re && I(je, null, [I("div", {
        class: "v-field__outline__start"
      }, null), w.value && I("div", {
        class: "v-field__outline__notch"
      }, [g(er, me({
        ref: O,
        floating: !0
      }, te.value), {
        default: () => [fe()]
      })]), I("div", {
        class: "v-field__outline__end"
      }, null)]), F.value && w.value && g(er, me({
        ref: O,
        floating: !0
      }, te.value), {
        default: () => [fe()]
      })])]);
    }), {
      controlRef: Y,
      fieldIconColor: G
    };
  }
}), Tv = Le({
  active: Boolean,
  color: String,
  messages: {
    type: [Array, String],
    default: () => []
  },
  ...S2(),
  ...Gr({
    transition: {
      component: Qu,
      leaveAbsolute: !0,
      group: !0
    }
  })
}, "VMessages"), Ov = o2()({
  name: "VMessages",
  props: Tv(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = E(() => Kn(e.messages)), {
      textColorClasses: r,
      textColorStyles: i
    } = un(() => e.color);
    return h2(() => g(_0, {
      transition: e.transition,
      tag: "div",
      class: ve(["v-messages", r.value, e.class]),
      style: Ee([i.value, e.style])
    }, {
      default: () => [e.active && a.value.map((o, u) => I("div", {
        class: "v-messages__message",
        key: `${u}-${a.value}`
      }, [n.message ? n.message({
        message: o
      }) : o]))]
    })), {};
  }
}), Fv = /* @__PURE__ */ Symbol.for("vuetify:form");
function Lv(e) {
  const t = We(Fv, null);
  return {
    ...t,
    isReadonly: E(() => !!(e?.readonly ?? t?.isReadonly.value)),
    isDisabled: E(() => !!(e?.disabled ?? t?.isDisabled.value))
  };
}
const Bv = /* @__PURE__ */ Symbol.for("vuetify:rules");
function Mv(e) {
  const t = We(Bv, null);
  if (!e) {
    if (!t)
      throw new Error("Could not find Vuetify rules injection");
    return t.aliases;
  }
  return t?.resolve(e) ?? R(e);
}
const Rv = Le({
  disabled: {
    type: Boolean,
    default: null
  },
  error: Boolean,
  errorMessages: {
    type: [Array, String],
    default: () => []
  },
  maxErrors: {
    type: [Number, String],
    default: 1
  },
  name: String,
  label: String,
  readonly: {
    type: Boolean,
    default: null
  },
  rules: {
    type: Array,
    default: () => []
  },
  modelValue: null,
  validateOn: String,
  validationValue: null,
  ...u4()
}, "validation");
function Dv(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : $t(), n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Y2();
  const a = D0(e, "modelValue"), r = E(() => e.validationValue === void 0 ? a.value : e.validationValue), i = Lv(e), o = Mv(() => e.rules), u = se([]), c = Ve(!0), f = E(() => !!(Kn(a.value === "" ? null : a.value).length || Kn(r.value === "" ? null : r.value).length)), v = E(() => e.errorMessages?.length ? Kn(e.errorMessages).concat(u.value).slice(0, Math.max(0, Number(e.maxErrors))) : u.value), h = E(() => {
    let T = (e.validateOn ?? i.validateOn?.value) || "input";
    T === "lazy" && (T = "input lazy"), T === "eager" && (T = "input eager");
    const O = new Set(T?.split(" ") ?? []);
    return {
      input: O.has("input"),
      blur: O.has("blur") || O.has("input") || O.has("invalid-input"),
      invalidInput: O.has("invalid-input"),
      lazy: O.has("lazy"),
      eager: O.has("eager")
    };
  }), y = E(() => e.error || e.errorMessages?.length ? !1 : e.rules.length ? c.value ? u.value.length || h.value.lazy ? null : !0 : !u.value.length : !0), p = Ve(!1), k = E(() => ({
    [`${t}--error`]: y.value === !1,
    [`${t}--dirty`]: f.value,
    [`${t}--disabled`]: i.isDisabled.value,
    [`${t}--readonly`]: i.isReadonly.value
  })), S = O2("validation"), w = E(() => e.name ?? s2(n));
  dn(() => {
    i.register?.({
      id: w.value,
      vm: S,
      validate: A,
      reset: _,
      resetValidation: V
    });
  }), W2(() => {
    i.unregister?.(w.value);
  }), yt(async () => {
    h.value.lazy || await A(!h.value.eager), i.update?.(w.value, y.value, v.value);
  }), O0(() => h.value.input || h.value.invalidInput && y.value === !1, () => {
    be(r, () => {
      if (r.value != null)
        A();
      else if (e.focused) {
        const T = be(() => e.focused, (O) => {
          O || A(), T();
        });
      }
    });
  }), O0(() => h.value.blur, () => {
    be(() => e.focused, (T) => {
      T || A();
    });
  }), be([y, v], () => {
    i.update?.(w.value, y.value, v.value);
  });
  async function _() {
    a.value = null, await e2(), await V();
  }
  async function V() {
    c.value = !0, h.value.lazy ? u.value = [] : await A(!h.value.eager);
  }
  async function A() {
    let T = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1;
    const O = [];
    p.value = !0;
    for (const Y of o.value) {
      if (O.length >= Number(e.maxErrors ?? 1))
        break;
      const x = await (typeof Y == "function" ? Y : () => Y)(r.value);
      if (x !== !0) {
        if (x !== !1 && typeof x != "string") {
          console.warn(`${x} is not a valid value. Rule functions must return boolean true or a string.`);
          continue;
        }
        O.push(x || "");
      }
    }
    return u.value = O, p.value = !1, c.value = T, u.value;
  }
  return {
    errorMessages: v,
    isDirty: f,
    isDisabled: i.isDisabled,
    isReadonly: i.isReadonly,
    isPristine: c,
    isValid: y,
    isValidating: p,
    reset: _,
    resetValidation: V,
    validate: A,
    validationClasses: k
  };
}
const f4 = Le({
  id: String,
  appendIcon: U2,
  baseColor: String,
  centerAffix: {
    type: Boolean,
    default: !0
  },
  color: String,
  glow: Boolean,
  iconColor: [Boolean, String],
  prependIcon: U2,
  hideDetails: [Boolean, String],
  hideSpinButtons: Boolean,
  hint: String,
  persistentHint: Boolean,
  messages: {
    type: [Array, String],
    default: () => []
  },
  direction: {
    type: String,
    default: "horizontal",
    validator: (e) => ["horizontal", "vertical"].includes(e)
  },
  "onClick:prepend": E0(),
  "onClick:append": E0(),
  ...S2(),
  ...hn(),
  ...wu(ga(), ["maxWidth", "minWidth", "width"]),
  ...kt(),
  ...Rv()
}, "VInput"), v6 = o2()({
  name: "VInput",
  props: {
    ...f4()
  },
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      slots: a,
      emit: r
    } = t;
    const {
      densityClasses: i
    } = ya(e), {
      dimensionStyles: o
    } = ha(e), {
      themeClasses: u
    } = Gt(e), {
      rtlClasses: c
    } = Ca(), {
      InputIcon: f
    } = s4(e), v = Y2(), h = E(() => e.id || `input-${v}`), {
      errorMessages: y,
      isDirty: p,
      isDisabled: k,
      isReadonly: S,
      isPristine: w,
      isValid: _,
      isValidating: V,
      reset: A,
      resetValidation: T,
      validate: O,
      validationClasses: Y
    } = Dv(e, "v-input", h), F = E(() => e.errorMessages?.length || !w.value && y.value.length ? y.value : e.hint && (e.persistentHint || e.focused) ? e.hint : e.messages), x = R(() => F.value.length > 0), G = R(() => !e.hideDetails || e.hideDetails === "auto" && (x.value || !!a.details)), U = E(() => G.value ? `${h.value}-messages` : void 0), ee = E(() => ({
      id: h,
      messagesId: U,
      isDirty: p,
      isDisabled: k,
      isReadonly: S,
      isPristine: w,
      isValid: _,
      isValidating: V,
      hasDetails: G,
      reset: A,
      resetValidation: T,
      validate: O
    })), J = R(() => e.error || e.disabled ? void 0 : e.focused ? e.color : e.baseColor), ae = R(() => {
      if (e.iconColor)
        return e.iconColor === !0 ? J.value : e.iconColor;
    });
    return h2(() => {
      const oe = !!(a.prepend || e.prependIcon), te = !!(a.append || e.appendIcon);
      return I("div", {
        class: ve(["v-input", `v-input--${e.direction}`, {
          "v-input--center-affix": e.centerAffix,
          "v-input--focused": e.focused,
          "v-input--glow": e.glow,
          "v-input--hide-spin-buttons": e.hideSpinButtons
        }, i.value, u.value, c.value, Y.value, e.class]),
        style: Ee([o.value, e.style])
      }, [oe && I("div", {
        key: "prepend",
        class: "v-input__prepend"
      }, [a.prepend ? a.prepend(ee.value) : e.prependIcon && g(f, {
        key: "prepend-icon",
        name: "prepend",
        color: ae.value
      }, null)]), a.default && I("div", {
        class: "v-input__control"
      }, [a.default?.(ee.value)]), te && I("div", {
        key: "append",
        class: "v-input__append"
      }, [a.append ? a.append(ee.value) : e.appendIcon && g(f, {
        key: "append-icon",
        name: "append",
        color: ae.value
      }, null)]), G.value && I("div", {
        id: U.value,
        class: "v-input__details",
        role: "alert",
        "aria-live": "polite"
      }, [g(Ov, {
        active: x.value,
        messages: F.value
      }, {
        message: a.message
      }), a.details?.(ee.value)])]);
    }), {
      reset: A,
      resetValidation: T,
      validate: O,
      isValid: _,
      errorMessages: y
    };
  }
}), Nv = Le({
  autocomplete: String
}, "autocomplete");
function zv(e) {
  const t = Y2(), n = Ve(0), a = R(() => e.autocomplete === "suppress"), r = R(() => {
    if (e.name)
      return a.value ? `${e.name}-${t}-${n.value}` : e.name;
  }), i = R(() => a.value ? "off" : e.autocomplete);
  return {
    isSuppressing: a,
    fieldAutocomplete: i,
    fieldName: r,
    update: () => n.value = (/* @__PURE__ */ new Date()).getTime()
  };
}
function jv(e) {
  function t(n, a) {
    if (!e.autofocus || !n) return;
    const r = a[0].target;
    (r.matches("input,textarea") ? r : r.querySelector("input,textarea"))?.focus();
  }
  return {
    onIntersect: t
  };
}
const Kv = ["color", "file", "time", "date", "datetime-local", "week", "month"], Wv = Le({
  autofocus: Boolean,
  counter: [Boolean, Number, String],
  counterValue: [Number, Function],
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  suffix: String,
  role: String,
  type: {
    type: String,
    default: "text"
  },
  modelModifiers: Object,
  ...Nv(),
  ...ma(f4(), ["direction"]),
  ...d4()
}, "VTextField"), qv = o2()({
  name: "VTextField",
  directives: {
    vIntersect: kr
  },
  inheritAttrs: !1,
  props: Wv(),
  emits: {
    "click:control": (e) => !0,
    "mousedown:control": (e) => !0,
    "update:focused": (e) => !0,
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      emit: a,
      slots: r
    } = t;
    const i = D0(e, "modelValue", void 0, (F) => Object.is(F, -0) ? "-0" : F), {
      isFocused: o,
      focus: u,
      blur: c
    } = c4(e), {
      onIntersect: f
    } = jv(e), v = E(() => typeof e.counterValue == "function" ? e.counterValue(i.value) : typeof e.counterValue == "number" ? e.counterValue : (i.value ?? "").toString().length), h = E(() => {
      if (n.maxlength) return n.maxlength;
      if (!(!e.counter || typeof e.counter != "number" && typeof e.counter != "string"))
        return e.counter;
    }), y = E(() => ["plain", "underlined"].includes(e.variant)), p = se(), k = se(), S = se(), w = zv(e), _ = E(() => Kv.includes(e.type) || e.persistentPlaceholder || o.value || e.active);
    function V() {
      w.isSuppressing.value && w.update(), o.value || u(), e2(() => {
        S.value !== document.activeElement && S.value?.focus();
      });
    }
    function A(F) {
      a("mousedown:control", F), F.target !== S.value && (V(), F.preventDefault());
    }
    function T(F) {
      a("click:control", F);
    }
    function O(F, x) {
      F.stopPropagation(), V(), e2(() => {
        x(), Pu(e["onClick:clear"], F);
      });
    }
    function Y(F) {
      const x = F.target;
      if (!(e.modelModifiers?.trim && ["text", "search", "password", "tel", "url"].includes(e.type))) {
        i.value = x.value;
        return;
      }
      const G = x.value, U = x.selectionStart, ee = x.selectionEnd;
      i.value = G, e2(() => {
        let J = 0;
        G.trimStart().length === x.value.length && (J = G.length - x.value.length), U != null && (x.selectionStart = U - J), ee != null && (x.selectionEnd = ee - J);
      });
    }
    return h2(() => {
      const F = !!(r.counter || e.counter !== !1 && e.counter != null), x = !!(F || r.details), [G, U] = c7(n), {
        modelValue: ee,
        ...J
      } = v6.filterProps(e), ae = f6.filterProps(e);
      return g(v6, me({
        ref: p,
        modelValue: i.value,
        "onUpdate:modelValue": (oe) => i.value = oe,
        class: ["v-text-field", {
          "v-text-field--prefixed": e.prefix,
          "v-text-field--suffixed": e.suffix,
          "v-input--plain-underlined": y.value
        }, e.class],
        style: e.style
      }, G, J, {
        centerAffix: !y.value,
        focused: o.value
      }), {
        ...r,
        default: (oe) => {
          let {
            id: te,
            isDisabled: L,
            isDirty: X,
            isReadonly: re,
            isValid: we,
            hasDetails: le,
            reset: ke
          } = oe;
          return g(f6, me({
            ref: k,
            onMousedown: A,
            onClick: T,
            "onClick:clear": (fe) => O(fe, ke),
            role: e.role
          }, ma(ae, ["onClick:clear"]), {
            id: te.value,
            labelId: `${te.value}-label`,
            active: _.value || X.value,
            dirty: X.value || e.dirty,
            disabled: L.value,
            focused: o.value,
            details: le.value,
            error: we.value === !1
          }), {
            ...r,
            default: (fe) => {
              let {
                props: {
                  class: ne,
                  ...Pe
                },
                controlRef: Re
              } = fe;
              const De = I("input", me({
                ref: (de) => S.value = Re.value = de,
                value: i.value,
                onInput: Y,
                autofocus: e.autofocus,
                readonly: re.value,
                disabled: L.value,
                name: w.fieldName.value,
                autocomplete: w.fieldAutocomplete.value,
                placeholder: e.placeholder,
                size: 1,
                role: e.role,
                type: e.type,
                onFocus: u,
                onBlur: c,
                "aria-labelledby": `${te.value}-label`
              }, Pe, U), null);
              return I(je, null, [e.prefix && I("span", {
                class: "v-text-field__prefix"
              }, [I("span", {
                class: "v-text-field__prefix__text"
              }, [e.prefix])]), g2(r.default ? I("div", {
                class: ve(ne),
                "data-no-activator": ""
              }, [r.default({
                id: te
              }), De]) : k6(De, {
                class: ne
              }), [[kr, f, null, {
                once: !0
              }]]), e.suffix && I("span", {
                class: "v-text-field__suffix"
              }, [I("span", {
                class: "v-text-field__suffix__text"
              }, [e.suffix])])]);
            }
          });
        },
        details: x ? (oe) => I(je, null, [r.details?.(oe), F && I(je, null, [I("span", null, null), g(Vv, {
          active: e.persistentCounter || o.value,
          value: v.value,
          max: h.value,
          disabled: e.disabled
        }, r.counter)])]) : void 0
      });
    }), o4({}, p, k, S);
  }
}), Hv = {
  __name: "SearchBar",
  props: {
    modelValue: { type: String, default: "" },
    label: { type: String, default: "" }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, r) => (Ne(), n2(qv, me({
      "model-value": e.modelValue,
      "onUpdate:modelValue": r[0] || (r[0] = (i) => n("update:modelValue", i)),
      "prepend-inner-icon": "mdi-magnify",
      label: e.label,
      variant: "outlined",
      density: "compact",
      "hide-details": "",
      "bg-color": "transparent",
      color: "white",
      "base-color": "white"
    }, a.$attrs), Bl({ _: 2 }, [
      P0(a.$slots, (i, o) => ({
        name: o,
        fn: M((u) => [
          P6(a.$slots, o, Fl(Ll(u || {})))
        ])
      }))
    ]), 1040, ["model-value", "label"]));
  }
};
function Uv() {
  const e = se([]);
  y3(() => e.value = []);
  function t(n, a) {
    e.value[a] = n;
  }
  return {
    refs: e,
    updateRef: t
  };
}
const Gv = ce({
  activeColor: String,
  start: {
    type: [Number, String],
    default: 1
  },
  modelValue: {
    type: Number,
    default: (e) => e.start
  },
  disabled: Boolean,
  length: {
    type: [Number, String],
    default: 1,
    validator: (e) => e % 1 === 0
  },
  totalVisible: [Number, String],
  firstIcon: {
    type: Ke,
    default: "$first"
  },
  prevIcon: {
    type: Ke,
    default: "$prev"
  },
  nextIcon: {
    type: Ke,
    default: "$next"
  },
  lastIcon: {
    type: Ke,
    default: "$last"
  },
  ariaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.root"
  },
  pageAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.page"
  },
  currentPageAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.currentPage"
  },
  firstAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.first"
  },
  previousAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.previous"
  },
  nextAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.next"
  },
  lastAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.last"
  },
  ellipsis: {
    type: String,
    default: "..."
  },
  showFirstLastPage: Boolean,
  ...u0(),
  ...qe(),
  ...z2(),
  ...Ut(),
  ...it(),
  ...mn(),
  ...l2({
    tag: "nav"
  }),
  ...y2(),
  ...Ht({
    variant: "text"
  })
}, "VPagination"), m6 = Ae()({
  name: "VPagination",
  props: Gv(),
  emits: {
    "update:modelValue": (e) => !0,
    first: (e) => !0,
    prev: (e) => !0,
    next: (e) => !0,
    last: (e) => !0
  },
  setup(e, t) {
    let {
      slots: n,
      emit: a
    } = t;
    const r = r2(e, "modelValue"), {
      t: i,
      n: o
    } = wt(), {
      isRtl: u
    } = xt(), {
      themeClasses: c
    } = V2(e), {
      width: f
    } = B0(), v = Ve(-1);
    gt(void 0, {
      scoped: !0
    });
    const {
      resizeRef: h
    } = T0((x) => {
      if (!x.length) return;
      const {
        target: G,
        contentRect: U
      } = x[0], ee = G.querySelector(".v-pagination__list > *");
      if (!ee) return;
      const J = U.width, ae = ee.offsetWidth + parseFloat(getComputedStyle(ee).marginRight) * 2;
      v.value = S(J, ae);
    }), y = E(() => parseInt(e.length, 10)), p = E(() => parseInt(e.start, 10)), k = E(() => e.totalVisible != null ? parseInt(e.totalVisible, 10) : v.value >= 0 ? v.value : S(f.value, 58));
    function S(x, G) {
      const U = e.showFirstLastPage ? 5 : 3;
      return Math.max(0, Math.floor(
        // Round to two decimal places to avoid floating point errors
        Number(((x - G * U) / G).toFixed(2))
      ));
    }
    const w = E(() => {
      if (y.value <= 0 || isNaN(y.value) || y.value > Number.MAX_SAFE_INTEGER) return [];
      if (k.value <= 0) return [];
      if (k.value === 1) return [r.value];
      if (y.value <= k.value)
        return Ha(y.value, p.value);
      const x = k.value % 2 === 0, G = x ? k.value / 2 : Math.floor(k.value / 2), U = x ? G : G + 1, ee = y.value - G;
      if (U - r.value >= 0)
        return [...Ha(Math.max(1, k.value - 1), p.value), e.ellipsis, y.value];
      if (r.value - ee >= (x ? 1 : 0)) {
        const J = k.value - 1, ae = y.value - J + p.value;
        return [p.value, e.ellipsis, ...Ha(J, ae)];
      } else {
        const J = Math.max(1, k.value - 2), ae = J === 1 ? r.value : r.value - Math.ceil(J / 2) + p.value;
        return [p.value, e.ellipsis, ...Ha(J, ae), e.ellipsis, y.value];
      }
    });
    function _(x, G, U) {
      x.preventDefault(), r.value = G, U && a(U, G);
    }
    const {
      refs: V,
      updateRef: A
    } = Uv();
    gt({
      VPaginationBtn: {
        color: R(() => e.color),
        border: R(() => e.border),
        density: R(() => e.density),
        size: R(() => e.size),
        variant: R(() => e.variant),
        rounded: R(() => e.rounded),
        elevation: R(() => e.elevation)
      }
    });
    const T = E(() => w.value.map((x, G) => {
      const U = (ee) => A(ee, G);
      if (typeof x == "string")
        return {
          isActive: !1,
          key: `ellipsis-${G}`,
          page: x,
          props: {
            ref: U,
            ellipsis: !0,
            icon: !0,
            disabled: !0
          }
        };
      {
        const ee = x === r.value;
        return {
          isActive: ee,
          key: x,
          page: o(x),
          props: {
            ref: U,
            ellipsis: !1,
            icon: !0,
            disabled: !!e.disabled || Number(e.length) < 2,
            color: ee ? e.activeColor : e.color,
            "aria-current": ee,
            "aria-label": i(ee ? e.currentPageAriaLabel : e.pageAriaLabel, x),
            onClick: (J) => _(J, x)
          }
        };
      }
    })), O = E(() => {
      const x = !!e.disabled || r.value <= p.value, G = !!e.disabled || r.value >= p.value + y.value - 1;
      return {
        first: e.showFirstLastPage ? {
          icon: u.value ? e.lastIcon : e.firstIcon,
          onClick: (U) => _(U, p.value, "first"),
          disabled: x,
          "aria-label": i(e.firstAriaLabel),
          "aria-disabled": x
        } : void 0,
        prev: {
          icon: u.value ? e.nextIcon : e.prevIcon,
          onClick: (U) => _(U, r.value - 1, "prev"),
          disabled: x,
          "aria-label": i(e.previousAriaLabel),
          "aria-disabled": x
        },
        next: {
          icon: u.value ? e.prevIcon : e.nextIcon,
          onClick: (U) => _(U, r.value + 1, "next"),
          disabled: G,
          "aria-label": i(e.nextAriaLabel),
          "aria-disabled": G
        },
        last: e.showFirstLastPage ? {
          icon: u.value ? e.firstIcon : e.lastIcon,
          onClick: (U) => _(U, p.value + y.value - 1, "last"),
          disabled: G,
          "aria-label": i(e.lastAriaLabel),
          "aria-disabled": G
        } : void 0
      };
    });
    function Y() {
      const x = r.value - p.value;
      V.value[x]?.$el.focus();
    }
    function F(x) {
      x.key === Vs.left && !e.disabled && r.value > Number(e.start) ? (r.value = r.value - 1, e2(Y)) : x.key === Vs.right && !e.disabled && r.value < p.value + y.value - 1 && (r.value = r.value + 1, e2(Y));
    }
    return Fe(() => g(e.tag, {
      ref: h,
      class: ve(["v-pagination", c.value, e.class]),
      style: Ee(e.style),
      role: "navigation",
      "aria-label": i(e.ariaLabel),
      onKeydown: F,
      "data-test": "v-pagination-root"
    }, {
      default: () => [I("ul", {
        class: "v-pagination__list"
      }, [e.showFirstLastPage && I("li", {
        key: "first",
        class: "v-pagination__first",
        "data-test": "v-pagination-first"
      }, [n.first ? n.first(O.value.first) : g(Je, me({
        _as: "VPaginationBtn"
      }, O.value.first), null)]), I("li", {
        key: "prev",
        class: "v-pagination__prev",
        "data-test": "v-pagination-prev"
      }, [n.prev ? n.prev(O.value.prev) : g(Je, me({
        _as: "VPaginationBtn"
      }, O.value.prev), null)]), T.value.map((x, G) => I("li", {
        key: x.key,
        class: ve(["v-pagination__item", {
          "v-pagination__item--is-active": x.isActive
        }]),
        "data-test": "v-pagination-item"
      }, [n.item ? n.item(x) : g(Je, me({
        _as: "VPaginationBtn"
      }, x.props), {
        default: () => [x.page]
      })])), I("li", {
        key: "next",
        class: "v-pagination__next",
        "data-test": "v-pagination-next"
      }, [n.next ? n.next(O.value.next) : g(Je, me({
        _as: "VPaginationBtn"
      }, O.value.next), null)]), e.showFirstLastPage && I("li", {
        key: "last",
        class: "v-pagination__last",
        "data-test": "v-pagination-last"
      }, [n.last ? n.last(O.value.last) : g(Je, me({
        _as: "VPaginationBtn"
      }, O.value.last), null)])])]
    })), {};
  }
}), Zv = ce({
  page: {
    type: [Number, String],
    default: 1
  },
  itemsPerPage: {
    type: [Number, String],
    default: 10
  }
}, "DataTable-paginate"), v4 = /* @__PURE__ */ Symbol.for("vuetify:data-table-pagination");
function Yv(e) {
  const t = r2(e, "page", void 0, (a) => Number(a ?? 1)), n = r2(e, "itemsPerPage", void 0, (a) => Number(a ?? 10));
  return {
    page: t,
    itemsPerPage: n
  };
}
function Xv(e) {
  const {
    page: t,
    itemsPerPage: n,
    itemsLength: a
  } = e, r = E(() => n.value === -1 ? 0 : n.value * (t.value - 1)), i = E(() => n.value === -1 ? a.value : Math.min(a.value, r.value + n.value)), o = E(() => n.value === -1 || a.value === 0 ? 1 : Math.ceil(a.value / n.value));
  be([t, o], () => {
    t.value > o.value && (t.value = o.value);
  });
  function u(y) {
    n.value = y, t.value = 1;
  }
  function c() {
    t.value = q2(t.value + 1, 1, o.value);
  }
  function f() {
    t.value = q2(t.value - 1, 1, o.value);
  }
  function v(y) {
    t.value = q2(y, 1, o.value);
  }
  const h = {
    page: t,
    itemsPerPage: n,
    startIndex: r,
    stopIndex: i,
    pageCount: o,
    itemsLength: a,
    nextPage: c,
    prevPage: f,
    setPage: v,
    setItemsPerPage: u
  };
  return c2(v4, h), h;
}
function Qv() {
  const e = We(v4);
  if (!e) throw new Error("Missing pagination!");
  return e;
}
function Jv(e) {
  const t = x2("usePaginatedItems"), {
    items: n,
    startIndex: a,
    stopIndex: r,
    itemsPerPage: i
  } = e, o = E(() => i.value <= 0 ? n.value : n.value.slice(a.value, r.value));
  return be(o, (u) => {
    t.emit("update:currentItems", u);
  }, {
    immediate: !0
  }), {
    paginatedItems: o
  };
}
const m4 = ce({
  prevIcon: {
    type: Ke,
    default: "$prev"
  },
  nextIcon: {
    type: Ke,
    default: "$next"
  },
  firstIcon: {
    type: Ke,
    default: "$first"
  },
  lastIcon: {
    type: Ke,
    default: "$last"
  },
  itemsPerPageText: {
    type: String,
    default: "$vuetify.dataFooter.itemsPerPageText"
  },
  pageText: {
    type: String,
    default: "$vuetify.dataFooter.pageText"
  },
  firstPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.firstPage"
  },
  prevPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.prevPage"
  },
  nextPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.nextPage"
  },
  lastPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.lastPage"
  },
  itemsPerPageOptions: {
    type: Array,
    default: () => [{
      value: 10,
      title: "10"
    }, {
      value: 25,
      title: "25"
    }, {
      value: 50,
      title: "50"
    }, {
      value: 100,
      title: "100"
    }, {
      value: -1,
      title: "$vuetify.dataFooter.itemsPerPageAll"
    }]
  },
  showCurrentPage: Boolean
}, "VDataTableFooter"), g6 = Ae()({
  name: "VDataTableFooter",
  props: m4(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      t: a
    } = wt(), {
      page: r,
      pageCount: i,
      startIndex: o,
      stopIndex: u,
      itemsLength: c,
      itemsPerPage: f,
      setItemsPerPage: v
    } = Qv(), h = E(() => e.itemsPerPageOptions.map((y) => typeof y == "number" ? {
      value: y,
      title: y === -1 ? a("$vuetify.dataFooter.itemsPerPageAll") : String(y)
    } : {
      ...y,
      title: isNaN(Number(y.title)) ? a(y.title) : y.title
    }));
    return Fe(() => {
      const y = m6.filterProps(e);
      return I("div", {
        class: "v-data-table-footer"
      }, [n.prepend?.(), I("div", {
        class: "v-data-table-footer__items-per-page"
      }, [I("span", {
        "aria-label": a(e.itemsPerPageText)
      }, [a(e.itemsPerPageText)]), g(mt, {
        items: h.value,
        modelValue: f.value,
        "onUpdate:modelValue": (p) => v(Number(p)),
        density: "compact",
        variant: "outlined",
        hideDetails: !0
      }, null)]), I("div", {
        class: "v-data-table-footer__info"
      }, [I("div", null, [a(e.pageText, c.value ? o.value + 1 : 0, u.value, c.value)])]), I("div", {
        class: "v-data-table-footer__pagination"
      }, [g(m6, me({
        modelValue: r.value,
        "onUpdate:modelValue": (p) => r.value = p,
        density: "comfortable",
        firstAriaLabel: e.firstPageLabel,
        lastAriaLabel: e.lastPageLabel,
        length: i.value,
        nextAriaLabel: e.nextPageLabel,
        previousAriaLabel: e.prevPageLabel,
        rounded: !0,
        showFirstLastPage: !0,
        totalVisible: e.showCurrentPage ? 1 : 0,
        variant: "plain"
      }, y), null)])]);
    }), {};
  }
}), ra = gc({
  align: {
    type: String,
    default: "start"
  },
  fixed: {
    type: [Boolean, String],
    default: !1
  },
  fixedOffset: [Number, String],
  fixedEndOffset: [Number, String],
  height: [Number, String],
  lastFixed: Boolean,
  firstFixedEnd: Boolean,
  noPadding: Boolean,
  indent: [Number, String],
  empty: Boolean,
  tag: String,
  width: [Number, String],
  maxWidth: [Number, String],
  nowrap: Boolean
}, (e, t) => {
  let {
    slots: n
  } = t;
  const a = e.tag ?? "td", r = typeof e.fixed == "string" ? e.fixed : e.fixed ? "start" : "none";
  return g(a, {
    class: ve(["v-data-table__td", {
      "v-data-table-column--fixed": r === "start",
      "v-data-table-column--fixed-end": r === "end",
      "v-data-table-column--last-fixed": e.lastFixed,
      "v-data-table-column--first-fixed-end": e.firstFixedEnd,
      "v-data-table-column--no-padding": e.noPadding,
      "v-data-table-column--nowrap": e.nowrap,
      "v-data-table-column--empty": e.empty
    }, `v-data-table-column--align-${e.align}`]),
    style: {
      height: Oe(e.height),
      width: Oe(e.width),
      maxWidth: Oe(e.maxWidth),
      left: r === "start" ? Oe(e.fixedOffset || null) : void 0,
      right: r === "end" ? Oe(e.fixedEndOffset || null) : void 0,
      paddingInlineStart: e.indent ? Oe(e.indent) : void 0
    }
  }, {
    default: () => [n.default?.()]
  });
}), em = ce({
  headers: Array
}, "DataTable-header"), g4 = /* @__PURE__ */ Symbol.for("vuetify:data-table-headers"), h4 = {
  title: "",
  sortable: !1
}, tm = {
  ...h4,
  width: 48
};
function nm() {
  const t = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []).map((n) => ({
    element: n,
    priority: 0
  }));
  return {
    enqueue: (n, a) => {
      let r = !1;
      for (let i = 0; i < t.length; i++)
        if (t[i].priority > a) {
          t.splice(i, 0, {
            element: n,
            priority: a
          }), r = !0;
          break;
        }
      r || t.push({
        element: n,
        priority: a
      });
    },
    size: () => t.length,
    count: () => {
      let n = 0;
      if (!t.length) return 0;
      const a = Math.floor(t[0].priority);
      for (let r = 0; r < t.length; r++)
        Math.floor(t[r].priority) === a && (n += 1);
      return n;
    },
    dequeue: () => t.shift()
  };
}
function Tl(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  if (!e.children)
    t.push(e);
  else
    for (const n of e.children)
      Tl(n, t);
  return t;
}
function y4(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : /* @__PURE__ */ new Set();
  for (const n of e)
    n.key && t.add(n.key), n.children && y4(n.children, t);
  return t;
}
function am(e) {
  if (e.key) {
    if (e.key === "data-table-group") return h4;
    if (["data-table-expand", "data-table-select"].includes(e.key)) return tm;
  }
}
function Ao(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  return e.children ? Math.max(t, ...e.children.map((n) => Ao(n, t + 1))) : t;
}
function rm(e) {
  let t = !1;
  function n(i, o) {
    let u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "none";
    if (i)
      if (u !== "none" && (i.fixed = u), i.fixed === !0 && (i.fixed = "start"), i.fixed === o)
        if (i.children)
          if (o === "start")
            for (let c = i.children.length - 1; c >= 0; c--)
              n(i.children[c], o, o);
          else
            for (let c = 0; c < i.children.length; c++)
              n(i.children[c], o, o);
        else
          !t && o === "start" ? i.lastFixed = !0 : !t && o === "end" ? i.firstFixedEnd = !0 : isNaN(Number(i.width)) ? Ar(`Multiple fixed columns should have a static width (key: ${i.key})`) : i.minWidth = Math.max(Number(i.width) || 0, Number(i.minWidth) || 0), t = !0;
      else if (i.children)
        if (o === "start")
          for (let c = i.children.length - 1; c >= 0; c--)
            n(i.children[c], o);
        else
          for (let c = 0; c < i.children.length; c++)
            n(i.children[c], o);
      else
        t = !1;
  }
  for (let i = e.length - 1; i >= 0; i--)
    n(e[i], "start");
  for (let i = 0; i < e.length; i++)
    n(e[i], "end");
  let a = 0;
  for (let i = 0; i < e.length; i++)
    a = C4(e[i], a);
  let r = 0;
  for (let i = e.length - 1; i >= 0; i--)
    r = p4(e[i], r);
}
function C4(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  if (!e) return t;
  if (e.children) {
    e.fixedOffset = t;
    for (const n of e.children)
      t = C4(n, t);
  } else e.fixed && e.fixed !== "end" && (e.fixedOffset = t, t += parseFloat(e.width || "0") || 0);
  return t;
}
function p4(e) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  if (!e) return t;
  if (e.children) {
    e.fixedEndOffset = t;
    for (const n of e.children)
      t = p4(n, t);
  } else e.fixed === "end" && (e.fixedEndOffset = t, t += parseFloat(e.width || "0") || 0);
  return t;
}
function im(e, t) {
  const n = [];
  let a = 0;
  const r = nm(e);
  for (; r.size() > 0; ) {
    let o = r.count();
    const u = [];
    let c = 1;
    for (; o > 0; ) {
      const {
        element: f,
        priority: v
      } = r.dequeue(), h = t - a - Ao(f);
      if (u.push({
        ...f,
        rowspan: h ?? 1,
        colspan: f.children ? Tl(f).length : 1
      }), f.children)
        for (const y of f.children) {
          const p = v % 1 + c / Math.pow(10, a + 2);
          r.enqueue(y, a + h + p);
        }
      c += 1, o -= 1;
    }
    a += 1, n.push(u);
  }
  return {
    columns: e.map((o) => Tl(o)).flat(),
    headers: n
  };
}
function b4(e) {
  const t = [];
  for (const n of e) {
    const a = {
      ...am(n),
      ...n
    }, r = a.key ?? (typeof a.value == "string" ? a.value : null), i = a.value ?? r ?? null, o = {
      ...a,
      key: r,
      value: i,
      sortable: a.sortable ?? (a.key != null || !!a.sort),
      children: a.children ? b4(a.children) : void 0
    };
    t.push(o);
  }
  return t;
}
function lm(e, t) {
  const n = se([]), a = se([]), r = se({}), i = se({}), o = se({});
  b2(() => {
    const f = (e.headers || Object.keys(e.items[0] ?? {}).map((S) => ({
      key: S,
      title: s0(S)
    }))).slice(), v = y4(f);
    t?.groupBy?.value.length && !v.has("data-table-group") && f.unshift({
      key: "data-table-group",
      title: "Group"
    }), t?.showSelect?.value && !v.has("data-table-select") && f.unshift({
      key: "data-table-select"
    }), t?.showExpand?.value && !v.has("data-table-expand") && f.push({
      key: "data-table-expand"
    });
    const h = b4(f);
    rm(h);
    const y = Math.max(...h.map((S) => Ao(S))) + 1, p = im(h, y);
    n.value = p.headers, a.value = p.columns;
    const k = p.headers.flat(1);
    for (const S of k)
      S.key && (S.sortable && (S.sort && (r.value[S.key] = S.sort), S.sortRaw && (i.value[S.key] = S.sortRaw)), S.filter && (o.value[S.key] = S.filter));
  });
  const u = {
    headers: n,
    columns: a,
    sortFunctions: r,
    sortRawFunctions: i,
    filterFunctions: o
  };
  return c2(g4, u), u;
}
function Qr() {
  const e = We(g4);
  if (!e) throw new Error("Missing headers!");
  return e;
}
const om = {
  showSelectAll: !1,
  allSelected: () => [],
  select: (e) => {
    let {
      items: t,
      value: n
    } = e;
    return new Set(n ? [t[0]?.value] : []);
  },
  selectAll: (e) => {
    let {
      selected: t
    } = e;
    return t;
  }
}, w4 = {
  showSelectAll: !0,
  allSelected: (e) => {
    let {
      currentPage: t
    } = e;
    return t;
  },
  select: (e) => {
    let {
      items: t,
      value: n,
      selected: a
    } = e;
    for (const r of t)
      n ? a.add(r.value) : a.delete(r.value);
    return a;
  },
  selectAll: (e) => {
    let {
      value: t,
      currentPage: n,
      selected: a
    } = e;
    return w4.select({
      items: n,
      value: t,
      selected: a
    });
  }
}, sm = {
  showSelectAll: !0,
  allSelected: (e) => {
    let {
      allItems: t
    } = e;
    return t;
  },
  select: (e) => {
    let {
      items: t,
      value: n,
      selected: a
    } = e;
    for (const r of t)
      n ? a.add(r.value) : a.delete(r.value);
    return a;
  },
  selectAll: (e) => {
    let {
      value: t,
      allItems: n
    } = e;
    return new Set(t ? n.map((a) => a.value) : []);
  }
}, um = ce({
  showSelect: Boolean,
  selectStrategy: {
    type: [String, Object],
    default: "page"
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  valueComparator: Function
}, "DataTable-select"), x4 = /* @__PURE__ */ Symbol.for("vuetify:data-table-selection");
function cm(e, t) {
  let {
    allItems: n,
    currentPage: a
  } = t;
  const r = r2(e, "modelValue", e.modelValue, (V) => {
    const A = e.valueComparator;
    return A ? new Set($2(V).map((T) => n.value.find((O) => A(T, O.value))?.value ?? T)) : new Set($2(V).map((T) => l0(T) ? n.value.find((O) => T === O.value)?.value ?? T : n.value.find((O) => H2(T, O.value))?.value ?? T));
  }, (V) => [...V.values()]), i = E(() => n.value.filter((V) => V.selectable)), o = E(() => a.value.filter((V) => V.selectable)), u = E(() => {
    if (typeof e.selectStrategy == "object") return e.selectStrategy;
    switch (e.selectStrategy) {
      case "single":
        return om;
      case "all":
        return sm;
      default:
        return w4;
    }
  }), c = Ve(null);
  function f(V) {
    return $2(V).every((A) => r.value.has(A.value));
  }
  function v(V) {
    return $2(V).some((A) => r.value.has(A.value));
  }
  function h(V, A) {
    const T = u.value.select({
      items: V,
      value: A,
      selected: new Set(r.value)
    });
    r.value = T;
  }
  function y(V, A, T) {
    const O = [];
    if (A = A ?? a.value.findIndex((Y) => Y.value === V.value), e.selectStrategy !== "single" && T?.shiftKey && c.value !== null) {
      const [Y, F] = [c.value, A].sort((x, G) => x - G);
      O.push(...a.value.slice(Y, F + 1).filter((x) => x.selectable));
    } else
      O.push(V), c.value = A;
    h(O, !f([V]));
  }
  function p(V) {
    const A = u.value.selectAll({
      value: V,
      allItems: i.value,
      currentPage: o.value,
      selected: new Set(r.value)
    });
    r.value = A;
  }
  const k = E(() => r.value.size > 0), S = E(() => {
    const V = u.value.allSelected({
      allItems: i.value,
      currentPage: o.value
    });
    return !!V.length && f(V);
  }), w = R(() => u.value.showSelectAll), _ = {
    toggleSelect: y,
    select: h,
    selectAll: p,
    isSelected: f,
    isSomeSelected: v,
    someSelected: k,
    allSelected: S,
    showSelectAll: w,
    lastSelectedIndex: c,
    selectStrategy: u
  };
  return c2(x4, _), _;
}
function Jr() {
  const e = We(x4);
  if (!e) throw new Error("Missing selection!");
  return e;
}
const dm = ce({
  sortBy: {
    type: Array,
    default: () => []
  },
  customKeySort: Object,
  multiSort: Boolean,
  mustSort: Boolean
}, "DataTable-sort"), S4 = /* @__PURE__ */ Symbol.for("vuetify:data-table-sort");
function fm(e) {
  const t = r2(e, "sortBy"), n = R(() => e.mustSort), a = R(() => e.multiSort);
  return {
    sortBy: t,
    mustSort: n,
    multiSort: a
  };
}
function vm(e) {
  const {
    sortBy: t,
    mustSort: n,
    multiSort: a,
    page: r
  } = e, i = (c) => {
    if (c.key == null) return;
    let f = t.value.map((h) => ({
      ...h
    })) ?? [];
    const v = f.find((h) => h.key === c.key);
    v ? v.order === "desc" ? n.value && f.length === 1 ? v.order = "asc" : f = f.filter((h) => h.key !== c.key) : v.order = "desc" : a.value ? f.push({
      key: c.key,
      order: "asc"
    }) : f = [{
      key: c.key,
      order: "asc"
    }], t.value = f, r && (r.value = 1);
  };
  function o(c) {
    return !!t.value.find((f) => f.key === c.key);
  }
  const u = {
    sortBy: t,
    toggleSort: i,
    isSorted: o
  };
  return c2(S4, u), u;
}
function k4() {
  const e = We(S4);
  if (!e) throw new Error("Missing sort!");
  return e;
}
function mm(e, t, n, a) {
  const r = wt();
  return {
    sortedItems: E(() => n.value.length ? gm(t.value, n.value, r.current.value, {
      transform: a?.transform,
      sortFunctions: {
        ...e.customKeySort,
        ...a?.sortFunctions?.value
      },
      sortRawFunctions: a?.sortRawFunctions?.value
    }) : t.value)
  };
}
function gm(e, t, n, a) {
  const r = new Intl.Collator(n, {
    sensitivity: "accent",
    usage: "sort"
  });
  return e.map((o) => [o, a?.transform ? a.transform(o) : o]).sort((o, u) => {
    for (let c = 0; c < t.length; c++) {
      let f = !1;
      const v = t[c].key, h = t[c].order ?? "asc";
      if (h === !1) continue;
      let y = Wn(o[1], v), p = Wn(u[1], v), k = o[0].raw, S = u[0].raw;
      if (h === "desc" && ([y, p] = [p, y], [k, S] = [S, k]), a?.sortRawFunctions?.[v]) {
        const w = a.sortRawFunctions[v](k, S);
        if (w == null) continue;
        if (f = !0, w) return w;
      }
      if (a?.sortFunctions?.[v]) {
        const w = a.sortFunctions[v](y, p);
        if (w == null) continue;
        if (f = !0, w) return w;
      }
      if (!f && (y instanceof Date && p instanceof Date && (y = y.getTime(), p = p.getTime()), [y, p] = [y, p].map((w) => w != null ? w.toString().toLocaleLowerCase() : w), y !== p))
        return Ua(y) && Ua(p) ? 0 : Ua(y) ? -1 : Ua(p) ? 1 : !isNaN(y) && !isNaN(p) ? Number(y) - Number(p) : r.compare(y, p);
    }
    return 0;
  }).map((o) => {
    let [u] = o;
    return u;
  });
}
const _4 = ce({
  color: String,
  disableSort: Boolean,
  fixedHeader: Boolean,
  multiSort: Boolean,
  sortAscIcon: {
    type: Ke,
    default: "$sortAsc"
  },
  sortDescIcon: {
    type: Ke,
    default: "$sortDesc"
  },
  headerProps: {
    type: Object
  },
  /** @deprecated */
  sticky: Boolean,
  ...z2(),
  ...zr(),
  ...Ul()
}, "VDataTableHeaders"), h6 = Ae()({
  name: "VDataTableHeaders",
  props: _4(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      t: a
    } = wt(), {
      toggleSort: r,
      sortBy: i,
      isSorted: o
    } = k4(), {
      someSelected: u,
      allSelected: c,
      selectAll: f,
      showSelectAll: v
    } = Jr(), {
      columns: h,
      headers: y
    } = Qr(), {
      loaderClasses: p
    } = Gl(e);
    function k(G, U) {
      if (!(e.sticky || e.fixedHeader) && !G.fixed) return;
      const ee = typeof G.fixed == "string" ? G.fixed : G.fixed ? "start" : "none";
      return {
        position: "sticky",
        left: ee === "start" ? Oe(G.fixedOffset) : void 0,
        right: ee === "end" ? Oe(G.fixedEndOffset) : void 0,
        top: e.sticky || e.fixedHeader ? `calc(var(--v-table-header-height) * ${U})` : void 0
      };
    }
    function S(G, U) {
      G.key === "Enter" && !e.disableSort && r(U);
    }
    function w(G) {
      const U = i.value.find((ee) => ee.key === G.key);
      return U ? U.order === "asc" ? e.sortAscIcon : e.sortDescIcon : e.sortAscIcon;
    }
    const {
      backgroundColorClasses: _,
      backgroundColorStyles: V
    } = at(() => e.color), {
      displayClasses: A,
      mobile: T
    } = B0(e), O = E(() => ({
      headers: y.value,
      columns: h.value,
      toggleSort: r,
      isSorted: o,
      sortBy: i.value,
      someSelected: u.value,
      allSelected: c.value,
      selectAll: f,
      getSortIcon: w
    })), Y = E(() => ["v-data-table__th", {
      "v-data-table__th--sticky": e.sticky || e.fixedHeader
    }, A.value, p.value]), F = (G) => {
      let {
        column: U,
        x: ee,
        y: J
      } = G;
      const ae = U.key === "data-table-select" || U.key === "data-table-expand", oe = U.key === "data-table-group" && U.width === 0 && !U.title, te = me(e.headerProps ?? {}, U.headerProps ?? {});
      return g(ra, me({
        tag: "th",
        align: U.align,
        class: [{
          "v-data-table__th--sortable": U.sortable && !e.disableSort,
          "v-data-table__th--sorted": o(U),
          "v-data-table__th--fixed": U.fixed
        }, ...Y.value],
        style: {
          width: Oe(U.width),
          minWidth: Oe(U.minWidth),
          maxWidth: Oe(U.maxWidth),
          ...k(U, J)
        },
        colspan: U.colspan,
        rowspan: U.rowspan,
        fixed: U.fixed,
        nowrap: U.nowrap,
        lastFixed: U.lastFixed,
        firstFixedEnd: U.firstFixedEnd,
        noPadding: ae,
        empty: oe,
        tabindex: U.sortable ? 0 : void 0,
        onClick: U.sortable ? () => r(U) : void 0,
        onKeydown: U.sortable ? (L) => S(L, U) : void 0
      }, te), {
        default: () => {
          const L = `header.${U.key}`, X = {
            column: U,
            selectAll: f,
            isSorted: o,
            toggleSort: r,
            sortBy: i.value,
            someSelected: u.value,
            allSelected: c.value,
            getSortIcon: w
          };
          return n[L] ? n[L](X) : oe ? "" : U.key === "data-table-select" ? n["header.data-table-select"]?.(X) ?? (v.value && g(Kr, {
            density: e.density,
            modelValue: c.value,
            indeterminate: u.value && !c.value,
            "onUpdate:modelValue": f
          }, null)) : I("div", {
            class: "v-data-table-header__content"
          }, [I("span", null, [U.title]), U.sortable && !e.disableSort && g(ze, {
            key: "icon",
            class: "v-data-table-header__sort-icon",
            icon: w(U)
          }, null), e.multiSort && o(U) && I("div", {
            key: "badge",
            class: ve(["v-data-table-header__sort-badge", ..._.value]),
            style: Ee(V.value)
          }, [i.value.findIndex((re) => re.key === U.key) + 1])]);
        }
      });
    }, x = () => {
      const G = E(() => h.value.filter((ee) => ee?.sortable && !e.disableSort)), U = E(() => {
        if (h.value.find((J) => J.key === "data-table-select") != null)
          return c.value ? "$checkboxOn" : u.value ? "$checkboxIndeterminate" : "$checkboxOff";
      });
      return g(ra, me({
        tag: "th",
        class: [...Y.value],
        colspan: y.value.length + 1
      }, e.headerProps), {
        default: () => [I("div", {
          class: "v-data-table-header__content"
        }, [g(mt, {
          chips: !0,
          class: "v-data-table__td-sort-select",
          clearable: !0,
          density: "default",
          items: G.value,
          label: a("$vuetify.dataTable.sortBy"),
          multiple: e.multiSort,
          variant: "underlined",
          "onClick:clear": () => i.value = [],
          appendIcon: U.value,
          "onClick:append": () => f(!c.value)
        }, {
          chip: (ee) => g(Qn, {
            onClick: ee.item.raw?.sortable ? () => r(ee.item.raw) : void 0,
            onMousedown: (J) => {
              J.preventDefault(), J.stopPropagation();
            }
          }, {
            default: () => [ee.item.title, g(ze, {
              class: ve(["v-data-table__td-sort-icon", o(ee.item.raw) && "v-data-table__td-sort-icon-active"]),
              icon: w(ee.item.raw),
              size: "small"
            }, null)]
          })
        })])]
      });
    };
    Fe(() => T.value ? I("tr", null, [g(x, null, null)]) : I(je, null, [n.headers ? n.headers(O.value) : y.value.map((G, U) => I("tr", null, [G.map((ee, J) => g(F, {
      column: ee,
      x: J,
      y: U
    }, null))])), e.loading && I("tr", {
      class: "v-data-table-progress"
    }, [I("th", {
      colspan: h.value.length
    }, [g(e5, {
      name: "v-data-table-progress",
      absolute: !0,
      active: !0,
      color: typeof e.loading == "boolean" ? void 0 : e.loading,
      indeterminate: !0
    }, {
      default: n.loader
    })])])]));
  }
}), hm = ce({
  groupBy: {
    type: Array,
    default: () => []
  }
}, "DataTable-group"), P4 = /* @__PURE__ */ Symbol.for("vuetify:data-table-group");
function ym(e) {
  return {
    groupBy: r2(e, "groupBy")
  };
}
function Cm(e) {
  const {
    disableSort: t,
    groupBy: n,
    sortBy: a
  } = e, r = se(/* @__PURE__ */ new Set()), i = E(() => n.value.map((v) => ({
    ...v,
    order: v.order ?? !1
  })).concat(t?.value ? [] : a.value));
  function o(v) {
    return r.value.has(v.id);
  }
  function u(v) {
    const h = new Set(r.value);
    o(v) ? h.delete(v.id) : h.add(v.id), r.value = h;
  }
  function c(v) {
    function h(y) {
      const p = [];
      for (const k of y.items)
        "type" in k && k.type === "group" ? p.push(...h(k)) : p.push(k);
      return [...new Set(p)];
    }
    return h({
      items: v
    });
  }
  const f = {
    sortByWithGroups: i,
    toggleGroup: u,
    opened: r,
    groupBy: n,
    extractRows: c,
    isGroupOpen: o
  };
  return c2(P4, f), f;
}
function V4() {
  const e = We(P4);
  if (!e) throw new Error("Missing group!");
  return e;
}
function pm(e, t) {
  if (!e.length) return [];
  const n = /* @__PURE__ */ new Map();
  for (const a of e) {
    const r = Wn(a.raw, t);
    n.has(r) || n.set(r, []), n.get(r).push(a);
  }
  return n;
}
function I4(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "root";
  if (!t.length) return [];
  const r = pm(e, t[0]), i = [], o = t.slice(1);
  return r.forEach((u, c) => {
    const f = t[0], v = `${a}_${f}_${c}`;
    i.push({
      depth: n,
      id: v,
      key: f,
      value: c,
      items: o.length ? I4(u, o, n + 1, v) : u,
      type: "group"
    });
  }), i;
}
function E4(e, t, n) {
  const a = [];
  for (const r of e)
    "type" in r && r.type === "group" ? (r.value != null && a.push(r), (t.has(r.id) || r.value == null) && (a.push(...E4(r.items, t, n)), n && a.push({
      ...r,
      type: "group-summary"
    }))) : a.push(r);
  return a;
}
function bm(e, t, n, a) {
  return {
    flatItems: E(() => {
      if (!t.value.length) return e.value;
      const i = I4(e.value, t.value.map((o) => o.key));
      return E4(i, n.value, u2(a));
    })
  };
}
const A4 = ce({
  item: {
    type: Object,
    required: !0
  },
  groupCollapseIcon: {
    type: Ke,
    default: "$tableGroupCollapse"
  },
  groupExpandIcon: {
    type: Ke,
    default: "$tableGroupExpand"
  },
  ...z2()
}, "VDataTableGroupHeaderRow"), wm = Ae()({
  name: "VDataTableGroupHeaderRow",
  props: A4(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      isGroupOpen: a,
      toggleGroup: r,
      extractRows: i
    } = V4(), {
      isSelected: o,
      isSomeSelected: u,
      select: c
    } = Jr(), {
      columns: f
    } = Qr(), v = E(() => i([e.item])), h = R(() => f.value.length - (f.value.some((y) => y.key === "data-table-select") ? 1 : 0));
    return () => I("tr", {
      class: "v-data-table-group-header-row",
      style: {
        "--v-data-table-group-header-row-depth": e.item.depth
      }
    }, [f.value.map((y) => {
      if (y.key === "data-table-group") {
        const p = a(e.item) ? e.groupCollapseIcon : e.groupExpandIcon, k = () => r(e.item);
        return n["data-table-group"]?.({
          item: e.item,
          count: v.value.length,
          props: {
            icon: p,
            onClick: k
          }
        }) ?? g(ra, {
          class: "v-data-table-group-header-row__column",
          colspan: h.value
        }, {
          default: () => [g(Je, {
            size: "small",
            variant: "text",
            icon: p,
            onClick: k
          }, null), I("span", null, [e.item.value]), I("span", null, [pe("("), v.value.length, pe(")")])]
        });
      } else if (y.key === "data-table-select") {
        const p = o(v.value), k = u(v.value) && !p, S = (w) => c(v.value, w);
        return n["data-table-select"]?.({
          props: {
            modelValue: p,
            indeterminate: k,
            "onUpdate:modelValue": S
          }
        }) ?? g(ra, {
          class: "v-data-table__td--select-row",
          noPadding: !0
        }, {
          default: () => [g(Kr, {
            density: e.density,
            modelValue: p,
            indeterminate: k,
            "onUpdate:modelValue": S
          }, null)]
        });
      }
      return "";
    })]);
  }
}), xm = ce({
  expandOnClick: Boolean,
  showExpand: Boolean,
  expanded: {
    type: Array,
    default: () => []
  }
}, "DataTable-expand"), $4 = /* @__PURE__ */ Symbol.for("vuetify:datatable:expanded");
function Sm(e) {
  const t = R(() => e.expandOnClick), n = r2(e, "expanded", e.expanded, (u) => new Set(u), (u) => [...u.values()]);
  function a(u, c) {
    const f = new Set(n.value), v = m2(u.value);
    if (c)
      f.add(v);
    else {
      const h = [...n.value].find((y) => m2(y) === v);
      f.delete(h);
    }
    n.value = f;
  }
  function r(u) {
    const c = m2(u.value);
    return [...n.value].some((f) => m2(f) === c);
  }
  function i(u) {
    a(u, !r(u));
  }
  const o = {
    expand: a,
    expanded: n,
    expandOnClick: t,
    isExpanded: r,
    toggleExpand: i
  };
  return c2($4, o), o;
}
function T4() {
  const e = We($4);
  if (!e) throw new Error("foo");
  return e;
}
const O4 = ce({
  index: Number,
  item: Object,
  cellProps: [Object, Function],
  collapseIcon: {
    type: Ke,
    default: "$collapse"
  },
  expandIcon: {
    type: Ke,
    default: "$expand"
  },
  onClick: T2(),
  onContextmenu: T2(),
  onDblclick: T2(),
  ...z2(),
  ...zr()
}, "VDataTableRow"), km = Ae()({
  name: "VDataTableRow",
  props: O4(),
  setup(e, t) {
    let {
      slots: n
    } = t;
    const {
      displayClasses: a,
      mobile: r
    } = B0(e, "v-data-table__tr"), {
      isSelected: i,
      toggleSelect: o,
      someSelected: u,
      allSelected: c,
      selectAll: f
    } = Jr(), {
      isExpanded: v,
      toggleExpand: h
    } = T4(), {
      toggleSort: y,
      sortBy: p,
      isSorted: k
    } = k4(), {
      columns: S
    } = Qr();
    Fe(() => I("tr", {
      class: ve(["v-data-table__tr", {
        "v-data-table__tr--clickable": !!(e.onClick || e.onContextmenu || e.onDblclick)
      }, a.value]),
      onClick: e.onClick,
      onContextmenu: e.onContextmenu,
      onDblclick: e.onDblclick
    }, [e.item && S.value.map((w, _) => {
      const V = e.item, A = `item.${w.key}`, T = `header.${w.key}`, O = {
        index: e.index,
        item: V.raw,
        internalItem: V,
        value: Wn(V.columns, w.key),
        column: w,
        isSelected: i,
        toggleSelect: o,
        isExpanded: v,
        toggleExpand: h
      }, Y = {
        column: w,
        selectAll: f,
        isSorted: k,
        toggleSort: y,
        sortBy: p.value,
        someSelected: u.value,
        allSelected: c.value,
        getSortIcon: () => ""
      }, F = typeof e.cellProps == "function" ? e.cellProps({
        index: O.index,
        item: O.item,
        internalItem: O.internalItem,
        value: O.value,
        column: w
      }) : e.cellProps, x = typeof w.cellProps == "function" ? w.cellProps({
        index: O.index,
        item: O.item,
        internalItem: O.internalItem,
        value: O.value
      }) : w.cellProps, G = w.key === "data-table-select" || w.key === "data-table-expand", U = w.key === "data-table-group" && w.width === 0 && !w.title;
      return g(ra, me({
        align: w.align,
        indent: w.intent,
        class: {
          "v-data-table__td--expanded-row": w.key === "data-table-expand",
          "v-data-table__td--select-row": w.key === "data-table-select"
        },
        fixed: w.fixed,
        fixedOffset: w.fixedOffset,
        fixedEndOffset: w.fixedEndOffset,
        lastFixed: w.lastFixed,
        firstFixedEnd: w.firstFixedEnd,
        maxWidth: r.value ? void 0 : w.maxWidth,
        noPadding: G,
        empty: U,
        nowrap: w.nowrap,
        width: r.value ? void 0 : w.width
      }, F, x), {
        default: () => {
          if (w.key === "data-table-select")
            return n["item.data-table-select"]?.({
              ...O,
              props: {
                disabled: !V.selectable,
                modelValue: i([V]),
                onClick: Rt(() => o(V), ["stop"])
              }
            }) ?? g(Kr, {
              disabled: !V.selectable,
              density: e.density,
              modelValue: i([V]),
              onClick: Rt((J) => o(V, e.index, J), ["stop"])
            }, null);
          if (w.key === "data-table-expand")
            return n["item.data-table-expand"]?.({
              ...O,
              props: {
                icon: v(V) ? e.collapseIcon : e.expandIcon,
                size: "small",
                variant: "text",
                onClick: Rt(() => h(V), ["stop"])
              }
            }) ?? g(Je, {
              icon: v(V) ? e.collapseIcon : e.expandIcon,
              size: "small",
              variant: "text",
              onClick: Rt(() => h(V), ["stop"])
            }, null);
          if (n[A] && !r.value) return n[A](O);
          const ee = a2(O.value);
          return r.value ? I(je, null, [I("div", {
            class: "v-data-table__td-title"
          }, [n[T]?.(Y) ?? w.title]), I("div", {
            class: "v-data-table__td-value"
          }, [n[A]?.(O) ?? ee])]) : ee;
        }
      });
    })]));
  }
}), F4 = ce({
  loading: [Boolean, String],
  loadingText: {
    type: String,
    default: "$vuetify.dataIterator.loadingText"
  },
  hideNoData: Boolean,
  items: {
    type: Array,
    default: () => []
  },
  noDataText: {
    type: String,
    default: "$vuetify.noDataText"
  },
  rowProps: [Object, Function],
  cellProps: [Object, Function],
  ...jt(O4(), ["collapseIcon", "expandIcon", "density"]),
  ...jt(A4(), ["groupCollapseIcon", "groupExpandIcon", "density"]),
  ...zr()
}, "VDataTableRows"), y6 = Ae()({
  name: "VDataTableRows",
  inheritAttrs: !1,
  props: F4(),
  setup(e, t) {
    let {
      attrs: n,
      slots: a
    } = t;
    const {
      columns: r
    } = Qr(), {
      expandOnClick: i,
      toggleExpand: o,
      isExpanded: u
    } = T4(), {
      isSelected: c,
      toggleSelect: f
    } = Jr(), {
      toggleGroup: v,
      isGroupOpen: h
    } = V4(), {
      t: y
    } = wt(), {
      mobile: p
    } = B0(e);
    return Fe(() => {
      const k = jt(e, ["groupCollapseIcon", "groupExpandIcon", "density"]);
      return e.loading && (!e.items.length || a.loading) ? I("tr", {
        class: "v-data-table-rows-loading",
        key: "loading"
      }, [I("td", {
        colspan: r.value.length
      }, [a.loading?.() ?? y(e.loadingText)])]) : !e.loading && !e.items.length && !e.hideNoData ? I("tr", {
        class: "v-data-table-rows-no-data",
        key: "no-data"
      }, [I("td", {
        colspan: r.value.length
      }, [a["no-data"]?.() ?? y(e.noDataText)])]) : I(je, null, [e.items.map((S, w) => {
        if (S.type === "group") {
          const A = {
            index: w,
            item: S,
            columns: r.value,
            isExpanded: u,
            toggleExpand: o,
            isSelected: c,
            toggleSelect: f,
            toggleGroup: v,
            isGroupOpen: h
          };
          return a["group-header"] ? a["group-header"](A) : g(wm, me({
            key: `group-header_${S.id}`,
            item: S
          }, Gs(n, ":groupHeader", () => A), k), a);
        }
        if (S.type === "group-summary") {
          const A = {
            index: w,
            item: S,
            columns: r.value,
            toggleGroup: v
          };
          return a["group-summary"]?.(A) ?? "";
        }
        const _ = {
          index: w,
          item: S.raw,
          internalItem: S,
          columns: r.value,
          isExpanded: u,
          toggleExpand: o,
          isSelected: c,
          toggleSelect: f
        }, V = {
          ..._,
          props: me({
            key: `item_${S.key ?? S.index}`,
            onClick: i.value ? () => {
              o(S);
            } : void 0,
            index: w,
            item: S,
            cellProps: e.cellProps,
            collapseIcon: e.collapseIcon,
            expandIcon: e.expandIcon,
            density: e.density,
            mobile: p.value
          }, Gs(n, ":row", () => _), typeof e.rowProps == "function" ? e.rowProps({
            item: _.item,
            index: _.index,
            internalItem: _.internalItem
          }) : e.rowProps)
        };
        return I(je, {
          key: V.props.key
        }, [a.item ? a.item(V) : g(km, V.props, a), u(S) && a["expanded-row"]?.(_)]);
      })]);
    }), {};
  }
}), L4 = ce({
  fixedHeader: Boolean,
  fixedFooter: Boolean,
  height: [Number, String],
  hover: Boolean,
  striped: {
    type: String,
    default: null,
    validator: (e) => ["even", "odd"].includes(e)
  },
  ...qe(),
  ...z2(),
  ...l2(),
  ...y2()
}, "VTable"), C6 = Ae()({
  name: "VTable",
  props: L4(),
  setup(e, t) {
    let {
      slots: n,
      emit: a
    } = t;
    const {
      themeClasses: r
    } = V2(e), {
      densityClasses: i
    } = bt(e);
    return Fe(() => g(e.tag, {
      class: ve(["v-table", {
        "v-table--fixed-height": !!e.height,
        "v-table--fixed-header": e.fixedHeader,
        "v-table--fixed-footer": e.fixedFooter,
        "v-table--has-top": !!n.top,
        "v-table--has-bottom": !!n.bottom,
        "v-table--hover": e.hover,
        "v-table--striped-even": e.striped === "even",
        "v-table--striped-odd": e.striped === "odd"
      }, r.value, i.value, e.class]),
      style: Ee(e.style)
    }, {
      default: () => [n.top?.(), n.default ? I("div", {
        class: "v-table__wrapper",
        style: {
          height: Oe(e.height)
        }
      }, [I("table", null, [n.default()])]) : n.wrapper?.(), n.bottom?.()]
    })), {};
  }
}), _m = ce({
  items: {
    type: Array,
    default: () => []
  },
  itemValue: {
    type: [String, Array, Function],
    default: "id"
  },
  itemSelectable: {
    type: [String, Array, Function],
    default: null
  },
  rowProps: [Object, Function],
  cellProps: [Object, Function],
  returnObject: Boolean
}, "DataTable-items");
function Pm(e, t, n, a) {
  const r = e.returnObject ? t : N2(t, e.itemValue), i = N2(t, e.itemSelectable, !0), o = a.reduce((u, c) => (c.key != null && (u[c.key] = N2(t, c.value)), u), {});
  return {
    type: "item",
    key: e.returnObject ? N2(t, e.itemValue) : r,
    index: n,
    value: r,
    selectable: i,
    columns: o,
    raw: t
  };
}
function Vm(e, t, n) {
  return t.map((a, r) => Pm(e, a, r, n));
}
function Im(e, t) {
  return {
    items: E(() => Vm(e, e.items, t.value))
  };
}
function Em(e) {
  let {
    page: t,
    itemsPerPage: n,
    sortBy: a,
    groupBy: r,
    search: i
  } = e;
  const o = x2("VDataTable"), u = () => ({
    page: t.value,
    itemsPerPage: n.value,
    sortBy: a.value,
    groupBy: r.value,
    search: i.value
  });
  let c = null;
  be(u, (f) => {
    H2(c, f) || (c && c.search !== f.search && (t.value = 1), o.emit("update:options", f), c = f);
  }, {
    deep: !0,
    immediate: !0
  });
}
const Am = (e, t, n) => {
  if (e == null || t == null) return -1;
  if (!t.length) return 0;
  e = e.toString().toLocaleLowerCase(), t = t.toString().toLocaleLowerCase();
  const a = [];
  let r = e.indexOf(t);
  for (; ~r; )
    a.push([r, r + t.length]), r = e.indexOf(t, r + t.length);
  return a.length ? a : -1;
};
function al(e, t) {
  if (!(e == null || typeof e == "boolean" || e === -1))
    return typeof e == "number" ? [[e, e + t.length]] : Array.isArray(e[0]) ? e : [e];
}
const $m = ce({
  customFilter: Function,
  customKeyFilter: Object,
  filterKeys: [Array, String],
  filterMode: {
    type: String,
    default: "intersection"
  },
  noFilter: Boolean
}, "filter");
function Tm(e, t, n) {
  const a = [], r = n?.default ?? Am, i = n?.filterKeys ? $2(n.filterKeys) : !1, o = Object.keys(n?.customKeyFilter ?? {}).length;
  if (!e?.length) return a;
  let u = null;
  e: for (let c = 0; c < e.length; c++) {
    const [f, v = f] = $2(e[c]), h = {}, y = {};
    let p = -1;
    if ((t || o > 0) && !n?.noFilter) {
      let k = !1;
      if (typeof f == "object") {
        if (f.type === "divider" || f.type === "subheader") {
          u?.type === "divider" && f.type === "subheader" && a.push(u), u = {
            index: c,
            matches: {},
            type: f.type
          };
          continue;
        }
        const _ = i || Object.keys(v);
        k = _.length === o;
        for (const V of _) {
          const A = N2(v, V), T = n?.customKeyFilter?.[V];
          if (p = T ? T(A, t, f) : r(A, t, f), p !== -1 && p !== !1)
            T ? h[V] = al(p, t) : y[V] = al(p, t);
          else if (n?.filterMode === "every")
            continue e;
        }
      } else
        p = r(f, t, f), p !== -1 && p !== !1 && (y.title = al(p, t));
      const S = Object.keys(y).length, w = Object.keys(h).length;
      if (!S && !w || n?.filterMode === "union" && w !== o && !S || n?.filterMode === "intersection" && (w !== o || !S && o > 0 && !k)) continue;
    }
    u && (a.push(u), u = null), a.push({
      index: c,
      matches: {
        ...y,
        ...h
      }
    });
  }
  return a;
}
function Om(e, t, n, a) {
  const r = Ve([]), i = Ve(/* @__PURE__ */ new Map()), o = E(() => a?.transform ? s2(t).map((c) => [c, a.transform(c)]) : s2(t));
  b2(() => {
    const c = typeof n == "function" ? n() : s2(n), f = typeof c != "string" && typeof c != "number" ? "" : String(c), v = Tm(o.value, f, {
      customKeyFilter: {
        ...e.customKeyFilter,
        ...s2(a?.customKeyFilter)
      },
      default: e.customFilter,
      filterKeys: e.filterKeys,
      filterMode: e.filterMode,
      noFilter: e.noFilter
    }), h = s2(t), y = [], p = /* @__PURE__ */ new Map();
    v.forEach((k) => {
      let {
        index: S,
        matches: w
      } = k;
      const _ = h[S];
      y.push(_), p.set(_.value, w);
    }), r.value = y, i.value = p;
  });
  function u(c) {
    return i.value.get(c.value);
  }
  return {
    filteredItems: r,
    filteredMatches: i,
    getMatches: u
  };
}
const Fm = ce({
  ...F4(),
  hideDefaultBody: Boolean,
  hideDefaultFooter: Boolean,
  hideDefaultHeader: Boolean,
  width: [String, Number],
  search: String,
  ...xm(),
  ...hm(),
  ...em(),
  ..._m(),
  ...um(),
  ...dm(),
  ..._4(),
  ...L4()
}, "DataTable"), Lm = ce({
  ...Zv(),
  ...Fm(),
  ...$m(),
  ...m4()
}, "VDataTable"), Bm = Ae()({
  name: "VDataTable",
  props: Lm(),
  emits: {
    "update:modelValue": (e) => !0,
    "update:page": (e) => !0,
    "update:itemsPerPage": (e) => !0,
    "update:sortBy": (e) => !0,
    "update:options": (e) => !0,
    "update:groupBy": (e) => !0,
    "update:expanded": (e) => !0,
    "update:currentItems": (e) => !0
  },
  setup(e, t) {
    let {
      attrs: n,
      slots: a
    } = t;
    const {
      groupBy: r
    } = ym(e), {
      sortBy: i,
      multiSort: o,
      mustSort: u
    } = fm(e), {
      page: c,
      itemsPerPage: f
    } = Yv(e), {
      disableSort: v
    } = Ol(e), {
      columns: h,
      headers: y,
      sortFunctions: p,
      sortRawFunctions: k,
      filterFunctions: S
    } = lm(e, {
      groupBy: r,
      showSelect: R(() => e.showSelect),
      showExpand: R(() => e.showExpand)
    }), {
      items: w
    } = Im(e, h), _ = R(() => e.search), {
      filteredItems: V
    } = Om(e, w, _, {
      transform: (de) => de.columns,
      customKeyFilter: S
    }), {
      toggleSort: A
    } = vm({
      sortBy: i,
      multiSort: o,
      mustSort: u,
      page: c
    }), {
      sortByWithGroups: T,
      opened: O,
      extractRows: Y,
      isGroupOpen: F,
      toggleGroup: x
    } = Cm({
      groupBy: r,
      sortBy: i,
      disableSort: v
    }), {
      sortedItems: G
    } = mm(e, V, T, {
      transform: (de) => ({
        ...de.raw,
        ...de.columns
      }),
      sortFunctions: p,
      sortRawFunctions: k
    }), {
      flatItems: U
    } = bm(G, r, O, () => !!a["group-summary"]), ee = E(() => U.value.length), {
      startIndex: J,
      stopIndex: ae,
      pageCount: oe,
      setItemsPerPage: te
    } = Xv({
      page: c,
      itemsPerPage: f,
      itemsLength: ee
    }), {
      paginatedItems: L
    } = Jv({
      items: U,
      startIndex: J,
      stopIndex: ae,
      itemsPerPage: f
    }), X = E(() => Y(L.value)), {
      isSelected: re,
      select: we,
      selectAll: le,
      toggleSelect: ke,
      someSelected: fe,
      allSelected: ne
    } = cm(e, {
      allItems: w,
      currentPage: X
    }), {
      isExpanded: Pe,
      toggleExpand: Re
    } = Sm(e);
    Em({
      page: c,
      itemsPerPage: f,
      sortBy: i,
      groupBy: r,
      search: _
    }), gt({
      VDataTableRows: {
        hideNoData: R(() => e.hideNoData),
        noDataText: R(() => e.noDataText),
        loading: R(() => e.loading),
        loadingText: R(() => e.loadingText)
      }
    });
    const De = E(() => ({
      page: c.value,
      itemsPerPage: f.value,
      sortBy: i.value,
      pageCount: oe.value,
      toggleSort: A,
      setItemsPerPage: te,
      someSelected: fe.value,
      allSelected: ne.value,
      isSelected: re,
      select: we,
      selectAll: le,
      toggleSelect: ke,
      isExpanded: Pe,
      toggleExpand: Re,
      isGroupOpen: F,
      toggleGroup: x,
      items: X.value.map((de) => de.raw),
      internalItems: X.value,
      groupedItems: L.value,
      columns: h.value,
      headers: y.value
    }));
    return Fe(() => {
      const de = g6.filterProps(e), Be = h6.filterProps(e), ye = y6.filterProps(e), f2 = C6.filterProps(e);
      return g(C6, me({
        class: ["v-data-table", {
          "v-data-table--show-select": e.showSelect,
          "v-data-table--loading": e.loading
        }, e.class],
        style: e.style
      }, f2, {
        fixedHeader: e.fixedHeader || e.sticky
      }), {
        top: () => a.top?.(De.value),
        default: () => a.default ? a.default(De.value) : I(je, null, [a.colgroup?.(De.value), !e.hideDefaultHeader && I("thead", {
          key: "thead"
        }, [g(h6, Be, a)]), a.thead?.(De.value), !e.hideDefaultBody && I("tbody", null, [a["body.prepend"]?.(De.value), a.body ? a.body(De.value) : g(y6, me(n, ye, {
          items: L.value
        }), a), a["body.append"]?.(De.value)]), a.tbody?.(De.value), a.tfoot?.(De.value)]),
        bottom: () => a.bottom ? a.bottom(De.value) : !e.hideDefaultFooter && I(je, null, [g(Wt, null, null), g(g6, de, {
          prepend: a["footer.prepend"]
        })])
      });
    }), {};
  }
}), Mm = { class: "text-body-2" }, Rm = { class: "d-flex align-center ga-2" }, Dm = { class: "text-body-2" }, Nm = {
  __name: "RelationsTable",
  props: {
    items: { type: Array, required: !0 },
    classifications: { type: Array, required: !0 },
    iconMap: { type: Object, required: !0 }
  },
  emits: ["assign"],
  setup(e, { emit: t }) {
    const n = t, a = se("");
    return (r, i) => (Ne(), n2(a0, {
      color: "transparent",
      class: "mb-10"
    }, {
      default: M(() => [
        g(a0, {
          color: "transparent",
          class: "d-flex align-center justify-space-between ga-4 mb-4"
        }, {
          default: M(() => [
            g(a0, {
              color: "transparent",
              class: "d-flex align-center ga-3"
            }, {
              default: M(() => [
                g(ze, {
                  color: "white",
                  size: "24"
                }, {
                  default: M(() => [...i[1] || (i[1] = [
                    pe("mdi-link-variant", -1)
                  ])]),
                  _: 1
                }),
                g(d0, { class: "text-h5 font-weight-bold text-white px-0" }, {
                  default: M(() => [...i[2] || (i[2] = [
                    pe("Relations", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }),
            g(Hv, {
              modelValue: a.value,
              "onUpdate:modelValue": i[0] || (i[0] = (o) => a.value = o),
              label: "Search relations...",
              class: "w-50 w-md-33 text-white"
            }, null, 8, ["modelValue"])
          ]),
          _: 1
        }),
        g(Vr, {
          variant: "ui",
          padding: "pa-0",
          class: "border border-white border-opacity-10 rounded-xl overflow-hidden"
        }, {
          default: M(() => [
            g(Bm, {
              items: e.items,
              search: a.value,
              headers: [
                { title: "Object", key: "name", sortable: !0 },
                { title: "Type", key: "geode_object_type", sortable: !0 },
                { title: "Classification", key: "entity", sortable: !0 }
              ],
              class: "bg-transparent text-white",
              "hide-default-footer": "",
              "items-per-page": -1,
              theme: "dark"
            }, {
              "item.name": M(({ item: o }) => [
                g(a0, {
                  color: "transparent",
                  class: "d-flex align-center py-1 px-4"
                }, {
                  default: M(() => [
                    g(ze, {
                      size: "16",
                      class: "mr-2 opacity-60"
                    }, {
                      default: M(() => [...i[3] || (i[3] = [
                        pe("mdi-file-outline", -1)
                      ])]),
                      _: 1
                    }),
                    I("span", Mm, a2(o.name), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              "item.geode_object_type": M(({ item: o }) => [
                g(Qn, {
                  size: "x-small",
                  variant: "outlined",
                  color: "white",
                  class: "opacity-70"
                }, {
                  default: M(() => [
                    pe(a2(o.geode_object_type), 1)
                  ]),
                  _: 2
                }, 1024)
              ]),
              "item.entity": M(({ item: o }) => [
                g(mt, {
                  "model-value": o.entity?.id,
                  items: e.classifications,
                  "item-title": "name",
                  "item-value": "id",
                  placeholder: "Unassigned",
                  density: "compact",
                  variant: "plain",
                  clearable: "",
                  "hide-details": "",
                  class: "text-caption custom-v-select px-4",
                  theme: "dark",
                  "menu-props": { theme: "dark" },
                  "onUpdate:modelValue": (u) => n("assign", o.id, u)
                }, {
                  item: M(({ props: u, item: c }) => [
                    g(vt, me(u, {
                      title: null,
                      density: "compact",
                      "min-height": "32",
                      class: "px-3"
                    }), {
                      default: M(() => [
                        I("div", Rm, [
                          g(ze, {
                            icon: e.iconMap[c.raw.type],
                            size: "small"
                          }, null, 8, ["icon"]),
                          I("span", Dm, a2(c.raw.name), 1)
                        ])
                      ]),
                      _: 2
                    }, 1040)
                  ]),
                  selection: M(({ item: u }) => [
                    u ? (Ne(), n2(Qn, {
                      key: 0,
                      size: "small",
                      "prepend-icon": e.iconMap[u.raw.type],
                      color: "white",
                      variant: "outlined",
                      class: "font-weight-bold"
                    }, {
                      default: M(() => [
                        pe(a2(u.raw.name), 1)
                      ]),
                      _: 2
                    }, 1032, ["prepend-icon"])) : D2("", !0)
                  ]),
                  _: 1
                }, 8, ["model-value", "items", "onUpdate:modelValue"])
              ]),
              _: 2
            }, 1032, ["items", "search"])
          ]),
          _: 1
        })
      ]),
      _: 1
    }));
  }
}, zm = /* @__PURE__ */ co(Nm, [["__scopeId", "data-v-15c175f2"]]), jm = ce({
  disabled: Boolean,
  modelValue: {
    type: Boolean,
    default: null
  },
  ...iu()
}, "VHover"), Km = Ae()({
  name: "VHover",
  props: jm(),
  emits: {
    "update:modelValue": (e) => !0
  },
  setup(e, t) {
    let {
      slots: n
    } = t;
    const a = r2(e, "modelValue"), {
      runOpenDelay: r,
      runCloseDelay: i
    } = lu(e, (o) => !e.disabled && (a.value = o));
    return () => n.default?.({
      isHovering: a.value,
      props: {
        onMouseenter: r,
        onMouseleave: i
      }
    });
  }
}), Wm = {
  __name: "TagCard",
  props: {
    entity: { type: Object, required: !0 },
    iconMap: { type: Object, required: !0 }
  },
  emits: ["delete"],
  setup(e) {
    return (t, n) => (Ne(), n2(Km, null, {
      default: M(({ isHovering: a, props: r }) => [
        g(Vr, me(r, {
          variant: "ui",
          padding: "pa-4",
          class: [
            "rounded-lg border border-opacity-10 d-flex align-center justify-space-between transition-swing",
            a ? "bg-grey-darken-3 elevation-4" : ""
          ]
        }), {
          default: M(() => [
            g(a0, {
              color: "transparent",
              class: "d-flex align-center ga-4"
            }, {
              default: M(() => [
                g(rt, {
                  color: "transparent",
                  size: "48",
                  rounded: "lg",
                  class: "border border-white border-opacity-25"
                }, {
                  default: M(() => [
                    g(ze, {
                      icon: e.iconMap[e.entity.type],
                      size: "24",
                      color: "white"
                    }, null, 8, ["icon"])
                  ]),
                  _: 1
                }),
                g(a0, { color: "transparent" }, {
                  default: M(() => [
                    g(d0, {
                      class: "text-h6 font-weight-bold text-white mb-1 px-0 py-0",
                      style: { "line-height": "1.2" }
                    }, {
                      default: M(() => [
                        pe(a2(e.entity.name), 1)
                      ]),
                      _: 1
                    }),
                    g(Qn, {
                      size: "x-small",
                      color: "white",
                      variant: "outlined",
                      class: "font-weight-bold px-2 py-0 border-opacity-50 opacity-80"
                    }, {
                      default: M(() => [
                        pe(a2(e.entity.type), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            g(Je, {
              icon: "mdi-trash-can-outline",
              size: "small",
              variant: "text",
              color: "grey-lighten-1",
              class: "hover:text-error",
              onClick: n[0] || (n[0] = (i) => t.$emit("delete", e.entity))
            })
          ]),
          _: 1
        }, 16, ["class"])
      ]),
      _: 1
    }));
  }
}, qm = {
  class: "d-flex flex-column ga-10 w-100",
  theme: "dark"
}, Hm = { class: "available-tags-container w-100" }, Um = { class: "d-flex align-center ga-3 mb-4" }, Gm = {
  __name: "ClassificationTab",
  props: {
    search: { type: String, default: "" }
  },
  setup(e) {
    const t = We("extensionAPI"), n = vn(), r = t.DataBaseStore.refAllItems(), i = {
      AOI: "mdi-vector-rectangle",
      VOI: "mdi-cube-outline",
      Fault: "mdi-slope-downhill",
      Horizon: "mdi-layers-outline"
    }, o = Object.keys(i), u = E(
      () => r.value.map((k) => {
        const S = n.relations.find((_) => _.object_id === k.id), w = n.classifications.find(
          (_) => _.id === S?.classification_id
        );
        return Object.assign({}, k, { entity: w });
      })
    );
    function c({ type: k, name: S }) {
      return n.createEntity({ type: k, name: S });
    }
    const f = se(!1), v = se(void 0);
    function h(k) {
      v.value = k, f.value = !0;
    }
    async function y() {
      v.value && (await n.deleteEntity(v.value.id), f.value = !1, v.value = void 0);
    }
    function p(k, S) {
      return n.setRelation(k, S);
    }
    return (k, S) => (Ne(), R2("div", qm, [
      g(_v, {
        types: s2(o),
        "icon-map": i,
        onCreate: c
      }, null, 8, ["types"]),
      g(zm, {
        items: u.value,
        classifications: s2(n).classifications,
        "icon-map": i,
        search: e.search,
        onAssign: p
      }, null, 8, ["items", "classifications", "search"]),
      I("div", Hm, [
        I("div", Um, [
          g(ze, {
            color: "white",
            size: "24",
            class: "opacity-80"
          }, {
            default: M(() => [...S[1] || (S[1] = [
              pe("mdi-shape-outline", -1)
            ])]),
            _: 1
          }),
          S[2] || (S[2] = I("div", { class: "text-h5 font-weight-bold text-white" }, "Available Tags", -1))
        ]),
        g(A2, { class: "ma-0" }, {
          default: M(() => [
            (Ne(!0), R2(je, null, P0(s2(n).classifications, (w) => (Ne(), n2(Ye, {
              key: w.id,
              cols: "12",
              sm: "6",
              md: "4",
              lg: "3",
              class: "pa-2"
            }, {
              default: M(() => [
                g(Wm, {
                  entity: w,
                  "icon-map": i,
                  onDelete: h
                }, null, 8, ["entity"])
              ]),
              _: 2
            }, 1024))), 128)),
            s2(n).classifications.length ? D2("", !0) : (Ne(), n2(Ye, {
              key: 0,
              cols: "12",
              class: "text-center py-12"
            }, {
              default: M(() => [
                g(ze, {
                  size: "64",
                  color: "grey-darken-2",
                  class: "mb-4 opacity-50"
                }, {
                  default: M(() => [...S[3] || (S[3] = [
                    pe(" mdi-tag-off-outline ", -1)
                  ])]),
                  _: 1
                }),
                S[4] || (S[4] = I("div", { class: "text-h6 text-grey-darken-1" }, "No tags created yet.", -1)),
                S[5] || (S[5] = I("div", { class: "text-body-2 text-grey-darken-2" }, " Use the form above to categorize your data. ", -1))
              ]),
              _: 1
            }))
          ]),
          _: 1
        })
      ]),
      g(xv, {
        show: f.value,
        "onUpdate:show": S[0] || (S[0] = (w) => f.value = w),
        item: v.value,
        onConfirm: y
      }, null, 8, ["show", "item"])
    ]));
  }
}, Zm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Gm
}, Symbol.toStringTag, { value: "Module" }));
export {
  vg as install,
  qa as metadata
};
