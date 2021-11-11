// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/storage';
import { getStorage, uploadBytes, ref as sRef, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js';
import {
    getDatabase,
    ref,
    push,
    set,
    onChildAdded,
    remove,
    onChildRemoved,
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
// Your web app's Firebase configuration



// import "firebase/compat/storage ";
const firebaseConfig = {
    apiKey: "AIzaSyDooaWi5DcWY0oKpOm5z8W0uFc-7uK3754",
    authDomain: "test-47d47.firebaseapp.com",
    databaseURL: "https://test-47d47-default-rtdb.firebaseio.com",
    projectId: "test-47d47",
    storageBucket: "test-47d47.appspot.com",
    messagingSenderId: "311288543013",
    appId: "1:311288543013:web:2886dabb7366fe05784ccc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app); //RealtimeDBに接続
const dbRef = ref(db, "chat"); //RealtimeDB内の"chat"を使う
// Initialize firebase


//firebaseデータ登録
$("#send").on("click", function() {
    let now = new Date();
    let msg = {
        uname: name,
        text: $("#input").val(),
        channel: room_name,
        timestamp: now.toLocaleString() //現在時刻をタイムスタンプの値に設定
    };
    const newPostRef = push(dbRef); //ユニークKEYを生成
    set(newPostRef, msg); //"chat"にユニークKEYをつけてオブジェクトデータを登録
});




// input要素
const fileInput = document.getElementById('sendFile');
const fileDownload = document.getElementById('dlFile');
// changeイベントで呼び出す関数
const handleFileSelect = () => {
        const files = fileInput.files;
        for (let i = 0; i < files.length; i++) {

            console.log(files[i].name);　 // 1つ1つのファイルデータはfiles[i]で取得できる
            let file = files[i];

            const storage = getStorage();
            const imageRef = sRef(storage, files[i].name);
            uploadBytes(imageRef, file).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });


        }

    }
    // ファイル選択時にhandleFileSelectを発火
fileInput.addEventListener('change', handleFileSelect);

const fileDownloader= () =>{
    const storage = getStorage();
    getDownloadURL(sRef(storage, 'anim.gif'))
    .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
            const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        // Or inserted into an <img> element
        const img = document.getElementById('myimg');
        img.setAttribute('src', url);
    })
    .catch((error) => {
        // Handle any errors
    });
}

fileDownload.addEventListener('click',fileDownloader);


onChildAdded(dbRef, function(data) {
    let log = data.val();
    if (x == 0) { //1番最初のリロード・チャット表示(general宛だけ)
        if (log.channel == "general") {
            appendMessage(log.text, log.uname, log.timestamp);
        }
    }
    if (x > 1000) { //以降変更が加わったらチャット表示
        appendMessage(log.text, log.uname, log.timestamp);
    }

});