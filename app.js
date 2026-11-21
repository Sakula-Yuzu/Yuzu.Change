(function () {
  var UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var LOWER = "abcdefghijklmnopqrstuvwxyz";
  var MAX = 100;
  var SAMPLE = "SakulaYuzu";
  var STORAGE_KEY = "fancy-font-tool";
  var HANGUL_FILLER = "\u3164";
  var BLANK_NICK = HANGUL_FILLER + HANGUL_FILLER + HANGUL_FILLER + HANGUL_FILLER + HANGUL_FILLER + HANGUL_FILLER + HANGUL_FILLER + HANGUL_FILLER;
  var FILTERS = ["经典", "全部", "花体", "粗斜", "符号", "特效"];

  function codes(start, holes) {
    var out = [];
    for (var i = 0; i < 26; i++) out.push(String.fromCodePoint(holes && holes[i] != null ? holes[i] : start + i));
    return out;
  }

  function mapLetters(upper, lower, mode) {
    var map = {};
    for (var i = 0; i < 26; i++) {
      var up = upper[i];
      var lo = lower[i] || up;
      if (mode === "lower") {
        map[UPPER[i]] = lo;
        map[LOWER[i]] = lo;
      } else if (mode === "upper") {
        map[UPPER[i]] = up;
        map[LOWER[i]] = up;
      } else {
        map[UPPER[i]] = up;
        map[LOWER[i]] = lo;
      }
    }
    return function (text) {
      return Array.from(text, function (ch) {
        return map[ch] || ch;
      }).join("");
    };
  }

  function styled(upperStart, lowerStart, mode, upperHoles, lowerHoles) {
    return mapLetters(codes(upperStart, upperHoles), codes(lowerStart, lowerHoles), mode);
  }

  function eachChar(text, fn) {
    return Array.from(text, fn).join("");
  }

  var FLIP = {
    a: "\u0250", b: "q", c: "\u0254", d: "p", e: "\u01dd", f: "\u025f", g: "\u0183", h: "\u0265",
    i: "\u1d09", j: "\u027e", k: "\u029e", l: "l", m: "\u026f", n: "u", o: "o", p: "d", q: "b",
    r: "\u0279", s: "s", t: "\u0287", u: "n", v: "\u028c", w: "\u028d", x: "x", y: "\u028e", z: "z",
    A: "\u2200", B: "\ua4ed", C: "\u0186", D: "\u15e1", E: "\u018e", F: "\u2132", G: "\u05e4", H: "H",
    I: "I", J: "\u017f", K: "\ua4d8", L: "\u02e5", M: "W", N: "N", O: "O", P: "\u0500", Q: "Q",
    R: "\u1d1a", S: "S", T: "\u2534", U: "\u2229", V: "\u039b", W: "M", X: "X", Y: "\u2144", Z: "Z",
    "0": "0", "1": "\u0196", "2": "\u1105", "3": "\u0190", "4": "\u3123", "5": "\u03db", "6": "9",
    "7": "\u3125", "8": "8", "9": "6", ".": "\u02d9", ",": "'", "'": ",", "?": "\u00bf", "!": "\u00a1",
    "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{",
  };

  var SMALL_CAPS = [0x1d00, 0x0299, 0x1d04, 0x1d05, 0x1d07, 0x0493, 0x0262, 0x029c, 0x026a, 0x1d0a, 0x1d0b, 0x029f, 0x1d0d, 0x0274, 0x1d0f, 0x1d18, 0x01eb, 0x0280, 0x0073, 0x1d1b, 0x1d1c, 0x1d20, 0x1d21, 0x0078, 0x028f, 0x1d22].map(function (cp) {
    return String.fromCodePoint(cp);
  });

  var styles = [
    { id: "script-lower", name: "花体小写", group: "花体", classic: true, convert: styled(0x1d4d0, 0x1d4ea, "lower") },
    { id: "sans-bi", name: "无衬线粗斜", group: "粗斜", classic: true, convert: styled(0x1d63c, 0x1d656, "both") },
    { id: "sans-bold", name: "无衬线粗体", group: "粗斜", classic: true, convert: styled(0x1d5d4, 0x1d5ee, "both") },
    { id: "sans-italic", name: "无衬线斜体", group: "粗斜", classic: true, convert: styled(0x1d608, 0x1d622, "both") },
    { id: "serif-bold", name: "衬线粗体", group: "粗斜", classic: true, convert: styled(0x1d400, 0x1d41a, "both") },
    { id: "serif-italic", name: "衬线斜体", group: "粗斜", classic: true, convert: styled(0x1d434, 0x1d44e, "both", {}, { 7: 0x210e }) },
    { id: "script-bold", name: "花体粗体", group: "花体", classic: true, convert: styled(0x1d4d0, 0x1d4ea, "both") },
    { id: "script", name: "手写花体", group: "花体", classic: true, convert: styled(0x1d49c, 0x1d4b6, "both", { 1: 0x212c, 4: 0x2130, 5: 0x2131, 7: 0x210b, 8: 0x2110, 11: 0x2112, 12: 0x2133, 17: 0x211b }, { 4: 0x1d452, 6: 0x1d454, 14: 0x1d45c }) },
    { id: "neg-circle", name: "反白圆圈", group: "符号", classic: true, convert: styled(0x1f150, 0x1f150, "upper") },
    { id: "double", name: "双线体", group: "符号", classic: true, convert: styled(0x1d538, 0x1d552, "both", { 2: 0x2102, 7: 0x210d, 13: 0x2115, 15: 0x2119, 16: 0x211a, 17: 0x211d, 25: 0x2124 }) },
    { id: "small-caps", name: "小号大写", group: "花体", classic: true, convert: mapLetters(SMALL_CAPS, SMALL_CAPS, "lower") },
    { id: "serif-bi", name: "衬线粗斜", group: "粗斜", classic: false, convert: styled(0x1d468, 0x1d482, "both") },
    { id: "fraktur", name: "哥特体", group: "符号", classic: false, convert: styled(0x1d504, 0x1d51e, "both", { 2: 0x212d, 7: 0x210c, 8: 0x2111, 17: 0x211c, 25: 0x2128 }) },
    { id: "fraktur-bold", name: "粗哥特", group: "符号", classic: false, convert: styled(0x1d56c, 0x1d586, "both") },
    { id: "mono", name: "等宽", group: "符号", classic: false, convert: styled(0x1d670, 0x1d68a, "both") },
    { id: "fullwidth", name: "全角", group: "符号", classic: false, convert: styled(0xff21, 0xff41, "both") },
    { id: "circle", name: "圆圈字母", group: "符号", classic: false, convert: styled(0x24b6, 0x24d0, "both") },
    { id: "square", name: "方块字母", group: "符号", classic: false, convert: styled(0x1f130, 0x1f130, "upper") },
    { id: "neg-square", name: "反白方块", group: "符号", classic: false, convert: styled(0x1f170, 0x1f170, "upper") },
    { id: "strike", name: "删除线", group: "特效", classic: false, convert: function (text) { return eachChar(text, function (ch) { return ch === " " ? ch : ch + "\u0336"; }); } },
    { id: "underline", name: "下划线", group: "特效", classic: false, convert: function (text) { return eachChar(text, function (ch) { return ch === " " ? ch : ch + "\u0332"; }); } },
    { id: "flip", name: "颠倒", group: "特效", classic: false, convert: function (text) { return Array.from(text, function (ch) { return FLIP[ch] || ch; }).reverse().join(""); } },
    { id: "spaced", name: "加宽", group: "特效", classic: false, convert: function (text) { return Array.from(text).join(" "); } },
    { id: "blank", name: "空白间隔", group: "特效", classic: false, convert: function (text) { return Array.from(text).join(HANGUL_FILLER); } },
  ];

  function styleById(id) {
    for (var i = 0; i < styles.length; i++) if (styles[i].id === id) return styles[i];
    return styles[0];
  }

  function convert(id, text) {
    return styleById(id).convert(text);
  }

  var ICON_STAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.8 6.6 19.8l1-6.1L3.2 9.4l6.1-.9L12 3z"/></svg>';
  var ICON_STAR_ON = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.8 6.6 19.8l1-6.1L3.2 9.4l6.1-.9L12 3z"/></svg>';
  var ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>';

  var state = {
    text: SAMPLE,
    styleId: styles[0].id,
    favs: [],
    filter: "经典",
    query: "",
    flash: null,
    ready: false,
  };
  var toastTimer = null;

  function notify(message) {
    var live = document.getElementById("live");
    var old = document.querySelector(".toast");
    if (old) old.remove();
    live.textContent = message;
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    document.body.appendChild(el);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.remove();
    }, 1600);
  }

  function writeClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(fallback);
    }
    return Promise.resolve(fallback());
    function fallback() {
      try {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        var ok = document.execCommand("copy");
        area.remove();
        return ok;
      } catch (err) {
        return false;
      }
    }
  }

  function copyValue(value, id, emptyNote) {
    if (!value) {
      notify(emptyNote);
      return;
    }
    writeClipboard(value).then(function (ok) {
      if (!ok) {
        notify("复制失败，请长按文字手动复制");
        return;
      }
      state.flash = id;
      render();
      notify("已复制");
      setTimeout(function () {
        if (state.flash === id) {
          state.flash = null;
          render();
        }
      }, 1200);
    });
  }

  function persist() {
    if (!state.ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        text: state.text,
        styleId: state.styleId,
        favs: state.favs,
      }));
    } catch (err) { /* private mode */ }
  }

  function shownStyles() {
    var q = state.query.trim();
    return styles.filter(function (style) {
      if (q && style.name.indexOf(q) === -1) return false;
      if (state.filter === "全部") return true;
      if (state.filter === "经典") return style.classic;
      if (state.filter === "收藏") return state.favs.indexOf(style.id) !== -1;
      return style.group === state.filter;
    });
  }

  function render() {
    var style = styleById(state.styleId);
    var output = convert(state.styleId, state.text);
    var usingSample = state.text.length === 0;
    document.getElementById("style-label").textContent = "当前样式 · " + style.name;
    var result = document.getElementById("result");
    if (state.text.length > 0) {
      result.textContent = output;
      result.classList.remove("empty");
    } else {
      result.textContent = "请输入要转换的字母";
      result.classList.add("empty");
    }
    document.getElementById("meta").textContent = state.text.length > 0
      ? "输出 " + Array.from(output).length + " 个字符，可粘贴到其他App"
      : "当前只能转换英文字母，数字和中文无法转换";
    document.getElementById("count").textContent = state.text.length + "/" + MAX;
    var input = document.getElementById("input");
    if (input.value !== state.text) input.value = state.text;
    document.getElementById("copy").textContent = state.flash === state.styleId ? "已复制" : "复制";
    document.getElementById("alpha-upper").textContent = convert(state.styleId, UPPER);
    document.getElementById("alpha-lower").textContent = convert(state.styleId, LOWER);

    var filters = state.favs.length ? FILTERS.concat(["收藏"]) : FILTERS.slice();
    if (state.filter === "收藏" && !state.favs.length) state.filter = "经典";
    var chips = document.getElementById("chips");
    chips.innerHTML = "";
    filters.forEach(function (item) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip" + (state.filter === item ? " on" : "");
      btn.setAttribute("aria-pressed", state.filter === item ? "true" : "false");
      btn.textContent = item;
      btn.addEventListener("click", function () {
        state.filter = item;
        persist();
        render();
      });
      chips.appendChild(btn);
    });

    var list = document.getElementById("list");
    var items = shownStyles();
    list.innerHTML = "";
    if (!items.length) {
      var empty = document.createElement("p");
      empty.className = "empty-list";
      empty.textContent = "没有匹配的样式";
      list.appendChild(empty);
      return;
    }
    var ul = document.createElement("ul");
    ul.setAttribute("role", "radiogroup");
    ul.setAttribute("aria-label", "花体样式");
    items.forEach(function (item) {
      var preview = convert(item.id, usingSample ? SAMPLE : state.text);
      var selected = item.id === state.styleId;
      var faved = state.favs.indexOf(item.id) !== -1;
      var li = document.createElement("li");
      var row = document.createElement("div");
      row.className = "style-row" + (selected ? " on" : "");

      var main = document.createElement("button");
      main.type = "button";
      main.className = "style-main";
      main.setAttribute("role", "radio");
      main.setAttribute("aria-checked", selected ? "true" : "false");
      var prev = document.createElement("span");
      prev.className = "preview";
      prev.textContent = preview;
      var name = document.createElement("span");
      name.className = "style-name";
      name.textContent = item.name;
      main.appendChild(prev);
      main.appendChild(name);
      main.addEventListener("click", function () {
        state.styleId = item.id;
        persist();
        copyValue(preview, item.id, "没有可复制的内容");
      });

      var star = document.createElement("button");
      star.type = "button";
      star.className = "icon-btn" + (faved ? " copy" : "");
      star.setAttribute("aria-label", (faved ? "取消收藏" : "收藏") + item.name);
      star.setAttribute("aria-pressed", faved ? "true" : "false");
      star.innerHTML = faved ? ICON_STAR_ON : ICON_STAR;
      star.addEventListener("click", function () {
        if (faved) state.favs = state.favs.filter(function (id) { return id !== item.id; });
        else state.favs = state.favs.concat([item.id]);
        persist();
        render();
      });

      var copy = document.createElement("button");
      copy.type = "button";
      copy.className = "icon-btn copy";
      copy.setAttribute("aria-label", "复制" + item.name);
      copy.innerHTML = state.flash === item.id ? ICON_CHECK : ICON_COPY;
      copy.addEventListener("click", function () {
        state.styleId = item.id;
        persist();
        copyValue(preview, item.id, "没有可复制的内容");
      });

      row.appendChild(main);
      row.appendChild(star);
      row.appendChild(copy);
      li.appendChild(row);
      ul.appendChild(li);
    });
    list.appendChild(ul);
  }

  function boot() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (typeof data.text === "string") state.text = data.text.slice(0, MAX);
        if (typeof data.styleId === "string" && styles.some(function (s) { return s.id === data.styleId; })) state.styleId = data.styleId;
        if (Array.isArray(data.favs)) {
          state.favs = data.favs.filter(function (id) {
            return styles.some(function (s) { return s.id === id; });
          });
        }
      }
    } catch (err) { /* ignore */ }
    state.ready = true;

    document.getElementById("input").addEventListener("input", function (event) {
      state.text = event.target.value.slice(0, MAX);
      persist();
      render();
    });
    document.getElementById("upper").addEventListener("click", function () {
      state.text = state.text.toUpperCase();
      persist();
      render();
    });
    document.getElementById("lower").addEventListener("click", function () {
      state.text = state.text.toLowerCase();
      persist();
      render();
    });
    document.getElementById("clear").addEventListener("click", function () {
      state.text = "";
      persist();
      render();
    });
    document.getElementById("copy").addEventListener("click", function () {
      copyValue(convert(state.styleId, state.text), state.styleId, "请先输入要转换的字母");
    });
    document.getElementById("result").addEventListener("click", function () {
      copyValue(convert(state.styleId, state.text), state.styleId, "请先输入要转换的字母");
    });
    document.getElementById("blank").addEventListener("click", function () {
      copyValue(BLANK_NICK, "blank-nick", "没有可复制的内容");
    });
    document.getElementById("search").addEventListener("input", function (event) {
      state.query = event.target.value;
      render();
    });
    render();
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { convert: convert, styles: styles, BLANK_NICK: BLANK_NICK };
  }
})();
