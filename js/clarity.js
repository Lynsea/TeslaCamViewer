/* Portfolio Umami v1: anonymous pageviews; no account identifiers or form values. */
(function () {
  'use strict';
  try {
    var config = {"websiteId": "f624b400-d78b-554b-afdb-a723956b98af", "hosts": ["teslacam.io", "www.teslacam.io"], "consent": null, "origin": "https://portfolio-umami-collector.wallpaper3d.workers.dev"};
    if (window.top !== window.self || window.__portfolioUmami) return;
    if (location.protocol !== 'https:' || config.hosts.indexOf(location.hostname) < 0) return;
    if (!/^[a-f0-9-]{36}$/i.test(config.websiteId) || !document.head) return;
    var state = { loading: false, ready: false, failed: false, last: null };
    window.__portfolioUmami = state;
    var privatePath = /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?(?:admin|ops|api|auth|account|settings|billing|checkout|dashboard|login|logout|sign-in|sign-up|signup|reset-password|forgot-password|verify-email|creations|my-creations|my-videos|my-works|journal|viewer|editor|orders|credits|payment|payments|purchase|profile|history)(?:\/|\.html|$)/i;
    function permitted() {
      if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true) return false;
      try {
        if (privatePath.test(decodeURIComponent(location.pathname))) return false;
        var rule = config.consent;
        if (!rule) return true;
        var raw = localStorage.getItem(rule.key);
        if (rule.kind === 'string') return rule.required ? raw === 'allow' : raw !== 'deny' && raw !== 'decline';
        var saved = JSON.parse(raw);
        if (saved && rule.expires && !(saved[rule.expires] > Date.now())) saved = null;
        if (saved && rule.timestamp && (!(saved[rule.timestamp] <= Date.now()) || Date.now() - saved[rule.timestamp] >= 15552000000)) saved = null;
        return rule.required ? Boolean(saved && saved.analytics === true) : !saved || saved.analytics !== false;
      } catch (_) { return false; }
    }
    function page() {
      var source = new URL(location.href);
      var clean = new URL(source.pathname, source.origin);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (key) {
        var value = source.searchParams.get(key);
        if (value && /^[a-z0-9_.:-]{1,100}$/i.test(value)) clean.searchParams.set(key, value);
      });
      return clean.href;
    }
    window.__portfolioUmamiBeforeSend = function (type, payload) {
      return type === 'event' && permitted() && payload.website === config.websiteId ? payload : null;
    };
    function sync() {
      if (!permitted()) { state.last = null; return; }
      if (!state.ready) {
        if (state.loading || state.failed || window.umami) return;
        state.loading = true;
        var script = document.createElement('script');
        script.src = config.origin + '/script.js';
        script.async = true;
        script.referrerPolicy = 'origin';
        script.setAttribute('data-website-id', config.websiteId);
        script.setAttribute('data-host-url', config.origin);
        script.setAttribute('data-auto-track', 'false');
        script.setAttribute('data-auto-pageview', 'false');
        script.setAttribute('data-performance', 'false');
        script.setAttribute('data-do-not-track', 'true');
        script.setAttribute('data-fetch-credentials', 'omit');
        script.setAttribute('data-domains', config.hosts.join(','));
        script.setAttribute('data-before-send', '__portfolioUmamiBeforeSend');
        script.onload = function () { state.ready = Boolean(window.umami && window.umami.track); sync(); };
        script.onerror = function () { state.failed = true; };
        document.head.appendChild(script);
        return;
      }
      var url = page();
      if (state.last === url) return;
      var referrer = '';
      try { referrer = new URL(state.last || document.referrer).origin + '/'; } catch (_) {}
      state.last = url;
      window.umami.track({ website: config.websiteId, hostname: location.hostname,
        url: url, referrer: referrer, title: location.pathname,
        language: navigator.language, screen: screen.width + 'x' + screen.height });
    }
    ['pushState', 'replaceState'].forEach(function (method) {
      var original = history[method];
      history[method] = function () { var result = original.apply(this, arguments); sync(); return result; };
    });
    ['popstate', 'hashchange', 'storage', 'focus'].forEach(function (name) { window.addEventListener(name, sync); });
    document.addEventListener('click', function () { setTimeout(sync, 0); });
    sync();
  } catch (_) { /* Optional analytics never interrupts the original application. */ }
})();

/* Microsoft Clarity. Public configuration; no user identifiers or custom payloads. */
(function () {
  "use strict";
  var config = {"projectId":"yzrpah28xw","hosts":["teslacam.io","www.teslacam.io"]};
  if (window.top !== window.self) return;
  if (window.__siteClarity || !/^[a-z0-9]+$/.test(config.projectId)) return;
  if (location.protocol !== "https:" || config.hosts.indexOf(location.hostname) < 0) return;
  var state = { loaded: false, stopped: false, storage: "denied" };
  window.__siteClarity = state;
  var privatePath = /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?(?:admin|ops|api|auth|account|settings|billing|checkout|dashboard|login|logout|sign-in|sign-up|signup|reset-password|forgot-password|verify-email|creations|my-creations|my-videos|my-works|journal|viewer|editor|orders|credits|payment|payments|purchase|profile|history)(?:\/|\.html|$)/i;
  var publicQuery = /^(?:utm_[a-z_]+|gclid|dclid|fbclid|msclkid|lang|hl|page|ref|source)$/i;
  function publicUrl(value) {
    try {
      var url = new URL(value, location.href);
      if (url.origin !== location.origin || privatePath.test(decodeURIComponent(url.pathname))) return false;
      for (var key of url.searchParams.keys()) if (!publicQuery.test(key)) return false;
      return !/(?:token|password|secret|email|prompt)=|@/i.test(url.hash);
    } catch (_) { return false; }
  }
  function optedOut() {
    return navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
  }
  function choice() {
    if (!config.consent) return { allowed: true, storage: "denied" };
    var rule = config.consent, saved;
    try {
      var raw = localStorage.getItem(rule.key);
      saved = rule.kind === "string" ? raw : JSON.parse(raw);
    } catch (_) {}
    if (rule.kind === "string") {
      return { allowed: rule.required ? saved === "allow" : saved !== "deny" && saved !== "decline", storage: saved === "allow" ? "granted" : "denied" };
    }
    if (saved && rule.expires && !(saved[rule.expires] > Date.now())) saved = null;
    if (saved && rule.timestamp && (!(saved[rule.timestamp] <= Date.now()) || Date.now() - saved[rule.timestamp] >= 15552000000)) saved = null;
    return { allowed: !saved || saved.analytics !== false, storage: saved && saved.analytics === true ? "granted" : "denied" };
  }
  function mask(root) {
    if (!root || !root.querySelectorAll) return;
    var selector = "form,input,textarea,select,[contenteditable],canvas,video,img,[data-private],[data-user-menu],.user-menu,.account-menu,[data-slot='avatar'],[data-slot='dropdown-menu-content']";
    if (root.matches && root.matches(selector)) root.setAttribute("data-clarity-mask", "true");
    root.querySelectorAll(selector).forEach(function (node) { node.setAttribute("data-clarity-mask", "true"); });
  }
  function disclose() {
    if (!/^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?privacy(?:-policy)?(?:\/|\.html|$)/i.test(location.pathname)) return;
    if (document.getElementById("clarity-privacy-disclosure")) return;
    var host = document.querySelector("main article,article,main");
    if (!host) return;
    var paragraph = document.createElement("p");
    paragraph.id = "clarity-privacy-disclosure";
    var chinese = /^zh/i.test(document.documentElement.lang);
    paragraph.textContent = chinese
      ? "我们使用 Microsoft Clarity 的热力图和会话回放了解页面点击与滚动情况，Microsoft 会接收网站使用数据。表单与媒体内容会被屏蔽，账号及支付页面不参与录制；只有现有隐私设置明确允许后才启用分析存储。了解 Microsoft 如何处理数据："
      : "We use Microsoft Clarity heatmaps and session recordings to understand page clicks and scrolling. Microsoft receives website usage data. Forms and media are masked, and account and payment pages are excluded. Analytics storage is enabled only when an existing privacy choice explicitly allows it. Learn how Microsoft handles data: ";
    var link = document.createElement("a");
    link.href = "https://privacy.microsoft.com/privacystatement";
    link.textContent = chinese ? "Microsoft 隐私声明" : "Microsoft Privacy Statement";
    link.rel = "noopener noreferrer";
    paragraph.appendChild(link);
    host.appendChild(paragraph);
  }
  function stop() {
    if (!state.loaded || state.stopped) return;
    state.stopped = true;
    if (document.body) document.body.setAttribute("data-clarity-mask", "true");
    window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
    window.clarity("stop");
  }
  function sync() {
    disclose();
    var consent = choice();
    if (optedOut() || !publicUrl(location.href) || !consent.allowed) { stop(); return; }
    if (state.stopped) return;
    if (!state.loaded) {
      if (window.clarity) return; // Preserve an existing integration instead of loading twice.
      mask(document);
      if (window.MutationObserver) new MutationObserver(function (records) {
        records.forEach(function (record) { record.addedNodes.forEach(mask); });
      }).observe(document.documentElement, { childList: true, subtree: true });
      window.clarity = function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      state.loaded = true;
      window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: consent.storage });
      var script = document.createElement("script");
      script.id = "microsoft-clarity-tag";
      script.async = true;
      script.src = "https://www.clarity.ms/tag/" + config.projectId;
      script.referrerPolicy = "origin";
      script.onerror = function () { state.error = "tag-load-failed"; };
      document.head.appendChild(script);
    } else if (state.storage !== consent.storage) {
      window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: consent.storage });
    }
    state.storage = consent.storage;
  }
  ["pushState", "replaceState"].forEach(function (method) {
    var original = history[method];
    history[method] = function () {
      if (arguments[2] != null && !publicUrl(arguments[2])) stop();
      var result = original.apply(this, arguments);
      sync();
      return result;
    };
  });
  window.addEventListener("popstate", sync);
  window.addEventListener("hashchange", sync);
  window.addEventListener("storage", sync);
  document.addEventListener("click", function () { setTimeout(sync, 0); }, true);
  document.addEventListener("submit", function () { setTimeout(sync, 0); }, true);
  document.addEventListener("visibilitychange", sync);
  sync();
})();
