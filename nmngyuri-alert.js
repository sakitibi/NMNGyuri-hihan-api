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
function shouldShowAlert() {
    const last = parseInt(document.cookie.lastNMNGshown || "0", 10);
    return (Date.now() - last) > 600000 || typeof last === 'undefined';
}
document.addEventListener('DOMContentLoaded', function(){
    if(shouldShowAlert()){
        NMNGyuriAlertMain();
    }
});

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

function NMNGyuriAlertMain(){
    const container = document.createElement("div");
    container.classList.add("sms-auth-modal-overlay");
    if(Boolean(getCookieValue('nmngAgree')) && shouldShowAlert()){
        container.classList.add("sms-auth-modal-overlay--after-open");
    }
    Object.assign(container.style, {
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 999999
    });
    document.body.appendChild(container);
    container.innerHTML = (`
        <div id="sms-container" style="vertical-align: middle; position: absolute; inset: 50% auto auto 50%; transform: translate(-50%, -50%); z-index: 999999; max-width: 500px; box-sizing: border-box; width: 90%; background: rgb(255, 255, 255); padding: 0px; border: none; border-radius: 8px; box-shadow: rgb(0, 0, 0) 0px 0px 10px; text-align: left;">
            <div class="sms-form">
                <h3 class="modal-title">${nmngyuritext}</h3>
                <div class="button-container">
                    <button class="submit-btn secondary">同意する</button>
                </div>
            </div>
        </div>
    `);
    const stylesheet = document.createElement("style");
    stylesheet.textContent = (`
        .sms-auth-modal-overlay--after-open {
            opacity: 1 !important;
        }
        .sms-auth-modal-overlay {
            bottom: 0;
            left: 0;
            opacity: 0;
            position: fixed;
            right: 0;
            top: 0;
            transition: opacity .5s ease-in-out;
        }
        .sms-form h3.modal-title {
            background-color: #4f5a60;
            background-image: none;
            border-radius: 8px 8px 0 0;
            border-style: none;
            color: #fff;
            font-size: 1rem;
            font-weight: 400;
            margin: 0;
            padding: .5rem .8rem;
            -webkit-text-decoration: none;
            text-decoration: none;
        }
        .sms-form .submit-btn.secondary {
            background-color: #5cb85c;
            border-color: #4cae4c;
            color: #fff;
        }
        .sms-form .button-container .submit-btn, .sms-form button.close-modal {
            border-radius: 5px;
            border-style: solid;
            font-size: 1rem;
            margin-bottom: .5rem;
            padding: 4px 10px;
            width: 16rem;
            cursor: pointer;
        }
        .sms-form .button-container {
            text-align: center;
        }
    `);
    document.head.appendChild(stylesheet);
    document.querySelector(".submit-btn.secondary").addEventListener('click', function(){
        container.remove();
        document.cookie = `nmngAgree=true; lastNMNGshown=${Date.now()}; max-age=2147483647;`;
    });
}
