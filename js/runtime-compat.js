(function applyRuntimeCompat(global) {
  if (!global) {
    return;
  }

  const perf = global.performance || {};

  if (typeof perf.mark !== "function") {
    perf.mark = function mark() {};
  }

  if (typeof perf.measure !== "function") {
    perf.measure = function measure() {};
  }

  if (typeof perf.clearMarks !== "function") {
    perf.clearMarks = function clearMarks() {};
  }

  if (typeof perf.clearMeasures !== "function") {
    perf.clearMeasures = function clearMeasures() {};
  }

  global.performance = perf;

  if (!global.mgt || typeof global.mgt !== "object") {
    global.mgt = {};
  }

  if (typeof global.mgt.clearMarks !== "function") {
    global.mgt.clearMarks = function clearMarks() {};
  }
})(typeof window !== "undefined" ? window : globalThis);
