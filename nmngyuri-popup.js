let nmngyuripopup = Math.floor(Math.random() * 2);

if (nmngyuripopup === 0){
    popup1();
} else if (nmngyuripopup === 1) {
    popup2();
}

function popup1(){
  window.open("https://sakitibi-com9.webnode.jp/page/25", "popupWindow", "width=800,height=600");
}

function popup2(){
  window.open("https://sakitibi-com9.webnode.jp/page/25-2", "popupWindow", "width=800,height=600");
}
