const originalEval = window.eval;

// eval を上書き
window.eval = function(str) {
    console.log("Intercepted eval code:\n", str);
    return originalEval(str);
};

function log(...args) {
    console.log("[YT-Blocker]", ...args);
}

function getDescriptionText() {
    const desc = document.querySelector("#description-inline-expander");

    if (!desc) {
        log("概要欄が見つからない");
        return "";
    }

    const text = desc.innerText;
    log("概要欄取得:", text.slice(0, 100)); // 長すぎ防止

    return text;
}

function isSuspicious(text) {
    for (const rule of suspiciousRules) {
        if (rule.test(text)) {
            log("怪しいルール一致:", rule);
            return true;
        }
    }

    log("怪しい判定なし");
    return false;
}

function blockDescription() {
    const desc = document.querySelector("#description-inline-expander");

    if (!desc) {
        log("ブロック対象が存在しない");
        return;
    }

    if (desc.classList.contains("blocked-description")) {
        log("既にブロック済み");
        return;
    }

    log("概要欄をブロック実行");

    desc.classList.add("blocked-description");

    const warning = document.createElement("div");
    warning.className = "warning-box";
    warning.innerText = "⚠ この概要欄は利用規約に違反しています。";

    desc.parentElement.prepend(warning);
}

function check() {
    log("チェック開始");

    const text = getDescriptionText();
    if (!text) {
        log("テキスト空 → スキップ");
        return;
    }

    if (isSuspicious(text)) {
        log("怪しいと判定 → ブロック");

        blockDescription();

        // ★ここ追加
        blockChannelActions();
        forceBlockButtons();

    } else {
        log("安全と判定");
    }
}

// MutationObserver（デバッグ強化）
const observer = new MutationObserver((mutations) => {
    log("DOM変更検知:", mutations.length);
    check();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

log("拡張機能 初期化");

// 初回実行
setTimeout(() => {
    log("初回チェック実行");
    check();
}, 2000);

function blockChannelActions() {
    log("チャンネル操作ブロック");

    // 登録ボタン
    const subBtn = document.querySelector("ytd-subscribe-button-renderer");

    if (subBtn && !subBtn.classList.contains("blocked-subscribe")) {
        log("登録ボタンをブロック");

        subBtn.classList.add("blocked-subscribe");
        subBtn.style.pointerEvents = "none";
        subBtn.style.opacity = "0.3";

        const warn = document.createElement("div");
        warn.innerText = "⚠ 登録非推奨";
        warn.style.color = "red";
        warn.style.fontSize = "12px";

        subBtn.appendChild(warn);
    }

    // メンバーになる
    const joinBtn = document.querySelector(
        "ytd-button-renderer a[href*='membership'], ytd-button-renderer tp-yt-paper-button"
    );

    if (joinBtn && !joinBtn.classList.contains("blocked-join")) {
        log("メンバー参加をブロック");

        joinBtn.classList.add("blocked-join");
        joinBtn.style.pointerEvents = "none";
        joinBtn.style.opacity = "0.3";

        const warn = document.createElement("div");
        warn.innerText = "⚠ メンバー参加非推奨";
        warn.style.color = "red";
        warn.style.fontSize = "12px";

        joinBtn.parentElement.appendChild(warn);
    }
}

function forceBlockButtons() {
    const buttons = document.querySelectorAll("button, a");

    buttons.forEach(btn => {
        const t = btn.innerText;

        if (t.includes("登録") || t.includes("Subscribe")) {
            btn.style.pointerEvents = "none";
            btn.style.opacity = "0.3";
        }

        if (t.includes("メンバー") || t.includes("Join")) {
            btn.style.pointerEvents = "none";
            btn.style.opacity = "0.3";
        }
    });
}