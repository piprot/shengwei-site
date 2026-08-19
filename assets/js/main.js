// ===== 通用交互：年份 + 留资表单 =====
// 留资表单默认提交到“飞书多维表”或 Formspree，零后端成本。
// 二选一，把对应 ENDPOINT 填上即可（另一个留空）。

// 方案 A：飞书多维表「写入记录」API（需自建自建应用/自动化 webhook）
//   文档：在飞书多维表「自动化」里加“当表单提交→写入多维表”，或用开放 API。
//   这里用 webhook 方式对接你已有的「班班 美杜莎」机器人所在流程。
const FEISHU_WEBHOOK = ""; // 例：https://www.feishu.cn/flow/api/webhook/xxxx

// 方案 B：Formspree（海外友好，免备案即可收件）
const FORMSPREE_ID = "";   // 例：xjezldkk，则提交到 https://formspree.io/f/xjezldkk

document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  const form = document.getElementById("lead-form");
  const msg = document.getElementById("form-msg");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    msg.textContent = "提交中…";

    try {
      if (FEISHU_WEBHOOK) {
        await fetch(FEISHU_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, _source: location.hostname, _at: new Date().toISOString() }),
        });
      } else if (FORMSPREE_ID) {
        await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(form),
        });
      } else {
        // 未配置时仅本地提示，避免丢单；上线前务必配置一端
        console.log("留资数据（未配置接收端）：", data);
      }
      msg.textContent = "已收到，我们会尽快联系你 ✅";
      form.reset();
    } catch (err) {
      msg.textContent = "提交失败，请稍后重试或直接在群里联系盈盈。";
    }
  });
});
