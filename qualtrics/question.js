/* Paste into the store question's JavaScript (question gear menu > Add JavaScript).
   Replace everything in the box with this code.
   - Hides the Next button until the respondent has an item in the cart.
   - Saves every store_* field into embedded data as the respondent browses.
   Works in both the Simple layout and the classic layouts.
   In the Survey Flow, declare each field BEFORE this block:
     Simple layout:   __js_store_cart_item, __js_store_event_log, ...
     Classic layouts: store_cart_item, store_event_log, ...
   (see README for the full list) */

Qualtrics.SurveyEngine.addOnload(function () {
  var q = this;

  // Optional safety: only accept data from your GitHub Pages site.
  // Leave as "" to accept any origin, or set to e.g. "https://your-username.github.io"
  var ALLOWED_ORIGIN = "";

  q.hideNextButton();

  function setED(key, value) {
    value = (value === null || value === undefined) ? "" : String(value);
    try {
      if (typeof Qualtrics.SurveyEngine.setJSEmbeddedData === "function") {
        Qualtrics.SurveyEngine.setJSEmbeddedData(key, value);   // Simple layout
      }
    } catch (e) {}
    try { Qualtrics.SurveyEngine.setEmbeddedData(key, value); } catch (e) {}  // classic layouts
  }

  function onMessage(ev) {
    if (ALLOWED_ORIGIN && ev.origin !== ALLOWED_ORIGIN) return;
    var d = ev.data;
    if (!d || d.source !== "mockstore") return;
    if (d.type === "error") { setED("store_load_error", d.message || "error"); q.showNextButton(); return; }
    var f = d.fields || {};
    for (var k in f) { if (Object.prototype.hasOwnProperty.call(f, k)) setED(k, f[k]); }
    if (d.cartReady) q.showNextButton(); else q.hideNextButton();
  }

  window.addEventListener("message", onMessage);
  Qualtrics.SurveyEngine.addOnUnload(function () {
    window.removeEventListener("message", onMessage);
  });
});
