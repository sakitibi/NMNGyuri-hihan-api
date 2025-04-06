let nmngyuri = Math.floor(Math.random() * 2);
let count = 0;

while( count >= 0){
    count + 1;
    if (count === 1000){
        nmngyurialert();
    }
}

function nmngyurialert(){
    nmngyuri = Math.floor(Math.random() * 2);
    if (nmngyuri === 0){
        alert("名前は長い方が有利戦争の応戦にご協力をお願い致します。");
    } else if (nmngyuri === 1) {
        alert("名前は長い方が有利反対にご協力をお願い致します。");
    }
    count = 0;
}
