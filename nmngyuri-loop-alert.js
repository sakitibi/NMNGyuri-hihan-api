let nmngyurialert = Math.floor(Math.random() * 4);
let nmngyuritext = null;

if (nmngyurialert === 0){
    nmngyuritext = "名前は長い方が有利戦争の応戦にご協力をお願い致します。";
} else if (nmngyurialert === 1) {
    nmngyuritext = "名前は長い方が有利反対にご協力をお願い致します。";
} else if (nmngyurialert === 2) {
    nmngyuritext = "名前は長い方が有利は悪質な荒らしです、<br/>撲滅にご協力をお願い致します";
} else if (nmngyurialert === 3){
    nmngyuritext = "名前は長い方が有利は登録者を買っています<br/>今すぐ通報して下さい";
}
function getCookieValue(name) {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return false; // 該当するCookieがない場合
}
function shouldShowAlert() {
    const last = parseInt(localStorage.getItem("lastNMNGshown") || "0", 10);
    return (Date.now() - last) > 600000 || typeof last === 'undefined';
}
document.addEventListener('DOMContentLoaded', function(){
    if(shouldShowAlert()){
        NMNGyuriAlertMain();
    }
});

function NMNGyuriAlertMain(){
    const container = document.createElement("div");
    container.classList.add("sms-auth-modal-overlay");
    if(!Boolean(getCookieValue('nmngAgree')) || shouldShowAlert()){
        setTimeout(() => {
            container.classList.add("sms-auth-modal-overlay--after-open");
        }, 2000);
    }
    document.body.appendChild(container);
    container.innerHTML = (`
        <div id="sms-container">
            <div class="sms-form">
                <h3 class="modal-title">${nmngyuritext}</h3>
                <div class="button-container">
                    <button class="submit-btn secondary">同意する</button>
                </div>
            </div>
        </div>
    `);
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "https://sakitibi.github.io/NMNGyuri-hihan-api/css/nmngyuri-hihan-alert.css";
    document.head.appendChild(stylesheet);
    document.querySelector(".submit-btn.secondary").addEventListener('click', function(){
        container.remove();
        localStorage.setItem("lastNMNGshown", Date.now());
        document.cookie = `nmngAgree=true; max-age=2147483647;`;
    });
}

setInterval(() => {
      nmngyurialert = Math.floor(Math.random() * 4);
      if(shouldShowAlert()){
            NMNGyuriAlertMain();
      }
}, 150000);
