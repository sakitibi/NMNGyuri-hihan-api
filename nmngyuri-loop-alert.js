let nmngyuri = Math.floor(Math.random() * 2);

function nmngyurialert(){
    nmngyuri = Math.floor(Math.random() * 2);
    if (nmngyuri === 0){
        alert("名前は長い方が有利戦争の応戦にご協力をお願い致します。");
    } else if (nmngyuri === 1) {
        alert("名前は長い方が有利反対にご協力をお願い致します。");
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loop() {
  while (true) {
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log(`データ取得: ${data.status}`);
    nmngyurialert();
    // 3秒待機
    await sleep(3000);
  }
}

loop();
