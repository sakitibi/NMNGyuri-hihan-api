let nmngyuriloopalert = Math.floor(Math.random() * 4);

function nmngyuriloopalertfunc(){
  if (nmngyuriloopalert === 0){
    alert("名前は長い方が有利戦争の応戦にご協力をお願い致します。");
  } else if (nmngyuriloopalert === 1) {
      alert("名前は長い方が有利反対にご協力をお願い致します。");
  } else if (nmngyuriloopalert === 2) {
      alert("名前は長い方が有利は悪質な荒らしです、\n撲滅にご協力をお願い致します");
  } else if (nmngyuriloopalert === 3){
      alert("名前は長い方が有利は登録者を買っています\n今すぐ通報して下さい");
  }
}

nmngyuriloopalertfunc();

setInterval(() => {
  nmngyuriloopalert = Math.floor(Math.random() * 4);
  nmngyuriloopalertfunc();
}, 150000);
