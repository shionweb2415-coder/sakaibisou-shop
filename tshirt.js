/*
 * Tシャツ相談フォームの入力・確認機能。
 * 受付先のメールアドレスが確定したら ORDER_EMAIL に設定してください。
 * 現状はバックエンド／送信サービス未接続のため、自動送信はしません。
 * mailto: はお客様のメールアプリで下書きを開くだけです（自動送信ではありません）。
 */
const ORDER_EMAIL = "";

const form = document.getElementById("tshirt-form");
const review = document.getElementById("review-panel");
const summaryEl = document.getElementById("order-summary");
const totalEl = document.getElementById("total-count");
const qtyError = document.getElementById("qty-error");
const positionError = document.getElementById("position-error");
const colorOther = document.getElementById("color-other");
const emailLink = document.getElementById("email-order");
const statusEl = document.getElementById("copy-status");
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

function getTotal() {
  return sizes.reduce((sum, size) => sum + (Number(form.elements[`qty${size}`].value) || 0), 0);
}

function updateTotal() {
  totalEl.textContent = getTotal().toLocaleString("ja-JP");
  qtyError.hidden = true;
}

function updateColor() {
  colorOther.hidden = form.elements.color.value !== "その他";
}

function chosenPositions() {
  return [...form.querySelectorAll('input[name="printPosition"]:checked')].map(input => input.value);
}

function optional(value) {
  return String(value || "").trim() || "未指定";
}

function buildSummary() {
  const data = new FormData(form);
  const quantity = sizes
    .map(size => ({ size, count: Number(data.get(`qty${size}`)) || 0 }))
    .filter(item => item.count > 0)
    .map(item => `${item.size}：${item.count}枚`).join(" / ");
  const color = data.get("color") === "その他" ? `その他（${optional(data.get("colorOther"))}）` : data.get("color");
  const deadline = data.get("deadline") || "未指定";
  return [
    "【オリジナルTシャツ制作 ご相談内容】",
    "",
    "■ 制作内容",
    `ご利用目的：${data.get("usage")}`,
    `デザインの準備状況：${data.get("design")}`,
    `デザインのイメージ：${optional(data.get("details"))}`,
    "",
    "■ Tシャツの仕様",
    `希望カラー：${color}`,
    `希望枚数：${quantity}（合計 ${getTotal()}枚）`,
    `プリント位置：${chosenPositions().join("・")}`,
    "",
    "■ 希望条件",
    `希望納期：${deadline}`,
    `予算の目安：${optional(data.get("budget"))}`,
    `その他の希望：${optional(data.get("message"))}`,
    "",
    "■ お客様情報",
    `お名前：${data.get("customer").trim()}`,
    `会社・団体名：${optional(data.get("company"))}`,
    `メールアドレス：${data.get("email").trim()}`,
    `電話番号：${optional(data.get("phone"))}`,
    "",
    "※この内容だけでは正式発注になりません。"
  ].join("\n");
}

form.querySelectorAll('input[type="number"]').forEach(input => input.addEventListener("input", updateTotal));
form.querySelectorAll('input[name="color"]').forEach(input => input.addEventListener("change", updateColor));
form.querySelectorAll('input[name="printPosition"]').forEach(input => input.addEventListener("change", () => { positionError.hidden = true; }));

form.addEventListener("submit", event => {
  event.preventDefault();
  qtyError.hidden = true;
  positionError.hidden = true;
  statusEl.textContent = "";

  if (!form.reportValidity()) return;
  if (getTotal() < 1) {
    qtyError.hidden = false;
    form.elements.qtyXS.focus();
    return;
  }
  if (chosenPositions().length === 0) {
    positionError.hidden = false;
    form.querySelector('input[name="printPosition"]').focus();
    return;
  }

  const summary = buildSummary();
  summaryEl.textContent = summary;
  review.hidden = false;
  if (ORDER_EMAIL.trim()) {
    emailLink.href = `mailto:${encodeURIComponent(ORDER_EMAIL.trim())}?subject=${encodeURIComponent("オリジナルTシャツ制作のお見積もり相談")}&body=${encodeURIComponent(summary)}`;
    emailLink.hidden = false;
  } else {
    emailLink.hidden = true;
    emailLink.removeAttribute("href");
  }
  review.scrollIntoView({ behavior: "smooth", block: "start" });
  review.focus({ preventScroll: true });
});

document.getElementById("edit-order").addEventListener("click", () => {
  review.hidden = true;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  form.querySelector("select").focus({ preventScroll: true });
});

document.getElementById("copy-order").addEventListener("click", async () => {
  const text = summaryEl.textContent;
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard API is not available");
    await navigator.clipboard.writeText(text);
    statusEl.textContent = "依頼内容をコピーしました。";
  } catch (_) {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);
    temp.select();
    try {
      const ok = document.execCommand("copy");
      statusEl.textContent = ok ? "依頼内容をコピーしました。" : "コピーできませんでした。上の内容を選択してコピーしてください。";
    } catch (_) {
      statusEl.textContent = "コピーできませんでした。上の内容を選択してコピーしてください。";
    } finally {
      temp.remove();
    }
  }
});

updateTotal();
updateColor();
