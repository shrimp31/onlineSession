window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

//ルーム機能
const socket = io();
const url = new URL(window.location.href);
const params = url.searchParams;
const room = params.get("roomNumber");
const userName = params.get("userName");
const password = params.get("password");
socket.on("connect", () => {
  socket.emit("joinRoom", room, userName, password);
});
socket.on("passwordError",()=>{
    alert("パスワードが違います")
    window.location.href = `/room`;
})
document.getElementById("roomNumber").innerText = "部屋番号：" + room;



// クラス
const piano = new Piano();
const drum = new Drum();
const guitar = new Guitar();

// クリック
const pianoKey = document.getElementsByClassName("pianokey");
for (i = 0; i < pianoKey.length; i++) {
  ((i) => {
    pianoKey[i].addEventListener(
      "click",
      () => {
        const hz = 440 * Math.pow(2, (1 / 12) * (i - 9));
        socket.emit("piano", hz);
      },
      false
    );
  })(i);
}

// キーボード
document.addEventListener("keyup", (e) => {
  if (e.key in piano.keys) {
    const hz = 440 * Math.pow(2, (1 / 12) * (piano.keys[e.key] - 9));
    socket.emit("piano", hz);
  }
});

// ソケット
socket.on("piano", (hz) => {
  piano.play(hz);
});

// ドラム
socket.on("drum", (src) => {
  drum.play(src);
});

// ギター
socket.on("guitar", (src, i) => {
  guitar.play(src, i);
});
