(() => {
  "use strict";

  const CONFIG = window.SHOP_CONFIG || {};
  const fmt = (n) => "KES " + n.toLocaleString("en-KE");

  // ---------- Catalogue ----------
  const SEAT_SIZES = [
    { id: "1", label: "1 seater", price: 800, was: 1000 },
    { id: "2", label: "2 seater", price: 1800, was: 2000 },
    { id: "3", label: "3 seater", price: 2200, was: 2500 },
    { id: "5", label: "5 seater", price: 3800, was: 4000 },
    { id: "7", label: "7 seater", price: 4200, was: 4500 },
  ];

  const SEAT_STYLES = [
    {
      id: "bubble", name: "Turkey Bubble",
      colours: [
        { name: "Navy Blue", hex: "#1f3a8a", img: "img/bubble-blue.webp" },
        { name: "Maroon", hex: "#8c1d2c", img: "img/bubble-maroon.webp" },
        { name: "Chocolate Brown", hex: "#3e2a1f", img: "img/bubble-brown.webp" },
        { name: "Beige", hex: "#e6cfa6", img: "img/bubble-beige.webp" },
        { name: "Peach", hex: "#d9a98a", img: "img/bubble-stock.webp" },
        { name: "Grey Blue", hex: "#8fa4bf", img: "img/bubble-stock.webp" },
      ],
    },
    {
      id: "jacquard", name: "Jacquard",
      colours: [
        { name: "Maroon", hex: "#7c1c2c", img: "img/jacquard-maroon.webp" },
        { name: "Cream", hex: "#d9c39a", img: "img/jacquard-cream.webp" },
        { name: "Brown", hex: "#5a4134", img: "img/jacquard-brown.webp" },
        { name: "Grey", hex: "#6b6f7c", img: "img/jacquard-grey.webp" },
      ],
    },
  ];

  const BNB = [
    { id: "duvet-cover", name: "Striped Duvet Cover", desc: "Crisp white hotel-stripe duvet cover set.", img: "img/duvet-cover.webp",
      variants: [{ label: "5×6", price: 2400 }, { label: "6×6", price: 2700 }] },
    { id: "duvet", name: "White Duvet", desc: "Soft, fluffy white duvet for all-season comfort.", img: "img/duvets.webp",
      variants: [{ label: "4×6", price: 1800 }, { label: "5×6", price: 2100 }, { label: "6×6", price: 2400 }, { label: "7×8", price: 4500 }] },
    { id: "quilted-duvet", name: "Quilted Duvet", desc: "Thick quilted white duvet with a hotel finish.", img: "img/quilted-duvet.webp",
      variants: [{ label: "Standard", price: 3500 }] },
    { id: "mattress-protector", name: "Waterproof Mattress Protector", desc: "Fitted, quilted and spill-proof. White, green, pink & blue.", img: "img/mattress-protector.webp",
      variants: [{ label: "4×6", price: 1999 }, { label: "5×6", price: 2200 }, { label: "6×6", price: 2300 }] },
    { id: "pillow-protector", name: "Pillow Protector", desc: "Quilted protector that keeps pillows fresh for every guest.", img: "img/pillow-protector.webp",
      variants: [{ label: "Standard", price: 1400 }] },
    { id: "pillow", name: "Hotel Pillow", desc: "Plump, full hotel-style sleeping pillow.", img: "img/pillows.webp",
      variants: [{ label: "Standard", price: 1200 }] },
    { id: "throw-pillow", name: "Throw Pillow Insert", desc: "White cushion inserts for sofas and beds.", img: "img/throw-pillows.webp",
      variants: [{ label: "Each", price: 300 }] },
    { id: "bed-runner", name: "Bed Runner", desc: "Instant hotel look. Orange, maroon, yellow, grey & navy.", img: "img/bed-runners.webp",
      variants: [{ label: "Standard", price: 1800 }] },
    { id: "towel", name: "White Bath Towel", desc: "Thick, absorbent hotel-white towels.", img: "img/towels.webp",
      variants: [{ label: "Each", price: 1500 }] },
    { id: "hotel-bath-mat", name: "Hotel Bath Mat", desc: "White cotton towel-style bath mats.", img: "img/hotel-bath-mats.webp",
      variants: [{ label: "Each", price: 800 }] },
    { id: "antislip-mat", name: "Anti-Slip Shower Mat", desc: "Strong suction cups, quick drainage. 50×80cm.", img: "img/antislip-bath-mat.webp",
      variants: [{ label: "Each", price: 850 }] },
    { id: "fluffy-rug", name: "Fluffy Rug", desc: "Soft faux-fur rug. White, grey or cream.", img: "img/fluffy-rugs.webp",
      variants: [{ label: "Each", price: 2500 }] },
  ];

  // ---------- Cart ----------
  const STORE_KEY = "ihc-cart-v1";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); } catch (_) { cart = []; }
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (_) {} };

  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}, html = "") => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (html) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function addToCart(item) {
    const existing = cart.find((c) => c.key === item.key);
    if (existing) existing.qty += item.qty; else cart.push(item);
    save(); renderCart();
    toast(`Added: ${item.name}`);
  }

  function renderCart() {
    const list = $("#cart");
    list.innerHTML = "";
    let total = 0, count = 0;
    cart.forEach((c, i) => {
      total += c.price * c.qty; count += c.qty;
      const li = el("li", {}, `<span>${esc(c.name)}<small>${esc(c.detail)} · ${c.qty} × ${fmt(c.price)}</small></span><strong>${fmt(c.price * c.qty)}</strong>`);
      const rm = el("button", { type: "button", "aria-label": `Remove ${c.name}` }, "×");
      rm.addEventListener("click", () => { cart.splice(i, 1); save(); renderCart(); });
      li.appendChild(rm);
      list.appendChild(li);
    });
    $("#cart-empty").hidden = cart.length > 0;
    $("#cart-total-row").hidden = cart.length === 0;
    $("#cart-total").textContent = fmt(total);
    document.querySelectorAll("[data-cart-count]").forEach((n) => (n.textContent = count));
    document.querySelectorAll("[data-cart-total]").forEach((n) => (n.textContent = fmt(total)));
    $("#sticky-cta").hidden = cart.length === 0 || orderInView;
    return total;
  }

  let orderInView = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => { orderInView = en.isIntersecting; renderCart(); }, { threshold: 0.05 }).observe($("#order"));
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // ---------- Seat cover configurator ----------
  const sc = { style: SEAT_STYLES[0], colour: SEAT_STYLES[0].colours[0], size: SEAT_SIZES[2], qty: 1 };

  function radio(btn, group, checked) {
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", String(checked));
    btn.type = "button";
    group.appendChild(btn);
  }

  function renderSeat() {
    const styleBox = $("#sc-style"); styleBox.innerHTML = "";
    SEAT_STYLES.forEach((s) => {
      const b = el("button", {}, esc(s.name));
      b.addEventListener("click", () => { sc.style = s; sc.colour = s.colours[0]; renderSeat(); });
      radio(b, styleBox, s === sc.style);
    });

    const colBox = $("#sc-colours"); colBox.innerHTML = "";
    sc.style.colours.forEach((c) => {
      const b = el("button", { class: "swatch", "aria-label": c.name, title: c.name, style: `background:${c.hex}` });
      b.addEventListener("click", () => { sc.colour = c; renderSeat(); });
      radio(b, colBox, c === sc.colour);
    });
    $("#sc-colour-name").textContent = "· " + sc.colour.name;

    const sizeBox = $("#sc-sizes"); sizeBox.innerHTML = "";
    SEAT_SIZES.forEach((z) => {
      const b = el("button", { class: "size" }, `<b>${z.label}</b>${fmt(z.price)}<br><s>${fmt(z.was)}</s>`);
      b.addEventListener("click", () => { sc.size = z; renderSeat(); });
      radio(b, sizeBox, z === sc.size);
    });

    const img = $("#sc-image");
    if (!img.src.endsWith(sc.colour.img)) {
      img.style.opacity = 0;
      setTimeout(() => { img.src = sc.colour.img; img.onload = () => (img.style.opacity = 1); }, 150);
    }
    img.alt = `${sc.style.name} seat cover in ${sc.colour.name}`;
    $("#sc-tag").textContent = `${sc.style.name} · ${sc.colour.name}`;
    $("#sc-qty").textContent = sc.qty;
    $("#sc-price").textContent = fmt(sc.size.price * sc.qty);
    $("#sc-was").textContent = fmt(sc.size.was * sc.qty);
  }

  document.querySelectorAll("[data-qty]").forEach((b) =>
    b.addEventListener("click", () => { sc.qty = Math.max(1, Math.min(20, sc.qty + Number(b.dataset.qty))); renderSeat(); })
  );
  $("#sc-add").addEventListener("click", () => {
    addToCart({
      key: `seat-${sc.style.id}-${sc.colour.name}-${sc.size.id}`,
      name: `${sc.style.name} Seat Cover`,
      detail: `${sc.colour.name}, ${sc.size.label}`,
      price: sc.size.price, qty: sc.qty,
    });
  });

  // ---------- BnB grid ----------
  function renderBnb() {
    const grid = $("#bnb-grid");
    BNB.forEach((p, i) => {
      const card = el("article", { class: "card reveal", style: `--d:${(i % 3) * 0.08}s` });
      const options = p.variants.map((v, j) => `<option value="${j}">${esc(v.label)} — ${fmt(v.price)}</option>`).join("");
      const single = p.variants.length === 1;
      card.innerHTML = `
        <div class="card__img"><img src="${p.img}" alt="${esc(p.name)}" loading="lazy" decoding="async"></div>
        <div class="card__body">
          <h3 class="card__title">${esc(p.name)}</h3>
          <p class="card__desc">${esc(p.desc)}</p>
          <span class="price">${single ? fmt(p.variants[0].price) : "from " + fmt(Math.min(...p.variants.map((v) => v.price)))}</span>
          <div class="card__row">
            ${single ? "" : `<select aria-label="${esc(p.name)} size">${options}</select>`}
            <button type="button" class="btn btn--primary">Add</button>
          </div>
        </div>`;
      card.querySelector("button").addEventListener("click", () => {
        const sel = card.querySelector("select");
        const v = p.variants[sel ? Number(sel.value) : 0];
        addToCart({ key: `${p.id}-${v.label}`, name: p.name, detail: v.label, price: v.price, qty: 1 });
      });
      grid.appendChild(card);
    });
  }

  // ---------- Order form ----------
  function orderText(data, total) {
    const lines = cart.map((c) => `• ${c.qty} × ${c.name} (${c.detail}) — ${fmt(c.price * c.qty)}`);
    const buyer = [
      `Name: ${data.name}`, `Phone: ${data.phone}`, data.email && `Email: ${data.email}`,
      `Location: ${data.location}`, data.notes && `Notes: ${data.notes}`,
    ].filter(Boolean);
    return ["NEW ORDER — Irene Household Collections", "", ...lines, "", `Total (excl. delivery): ${fmt(total)}`, "", ...buyer].join("\n");
  }

  $("#order-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target, msg = $("#form-msg"), btn = $("#submit-btn");
    msg.className = "form-msg"; msg.textContent = "";

    if (!cart.length) { msg.classList.add("err"); msg.textContent = "Please add at least one item to your order."; $("#seat-covers").scrollIntoView(); return; }
    let ok = true;
    form.querySelectorAll("input[required]").forEach((i) => { const v = i.checkValidity(); i.setAttribute("aria-invalid", String(!v)); ok = ok && v; });
    if (!ok) { msg.classList.add("err"); msg.textContent = "Please check your name, phone number (e.g. 0712 345 678) and location."; return; }
    if (form._honey.value) return;

    const data = Object.fromEntries(new FormData(form));
    const total = renderCart();
    const text = orderText(data, total);

    if (!CONFIG.orderEmail) {
      window.location.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
      return;
    }

    btn.disabled = true; btn.textContent = "Sending…";
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONFIG.orderEmail)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New order: ${data.name} — ${fmt(total)}`,
          _template: "box", _captcha: "false",
          Name: data.name, Phone: data.phone, Email: data.email || "-", Location: data.location,
          Items: cart.map((c) => `${c.qty} × ${c.name} (${c.detail}) — ${fmt(c.price * c.qty)}`).join("\n"),
          Total: fmt(total), Notes: data.notes || "-",
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || String(out.success) !== "true") throw new Error(out.message || "send failed");
      cart = []; save(); renderCart(); form.reset();
      msg.classList.add("ok");
      msg.textContent = "Thank you! Your order has been received — we'll call you shortly to confirm.";
      if (typeof window.fbq === "function") window.fbq("track", "Purchase", { value: total, currency: "KES" });
    } catch (_) {
      msg.classList.add("err");
      msg.innerHTML = `Couldn't send right now. <a href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}">Send your order on WhatsApp instead</a>.`;
    } finally {
      btn.disabled = false; btn.textContent = "Place order";
    }
  });

  // ---------- Reveal on scroll (once, staggered) ----------
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach((n) => n.classList.add("in")); return; }
    document.querySelectorAll(".hero .reveal, .section__head .reveal").forEach((n, i) => n.style.setProperty("--d", `${i * 0.08}s`));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((n) => io.observe(n));
  }

  renderSeat();
  renderBnb();
  renderCart();
  initReveal();
})();
