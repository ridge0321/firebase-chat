// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
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

function dataSendToDB(txt,type, fName, url) {
    let now = new Date();
    let msg = {
        uname: name,
        text: txt,
        channel: room_name,
        dataType: type,
        fileName: fName,
        fileUrl: url,
        timestamp: now.toLocaleString() //現在時刻をタイムスタンプの値に設定
    };

    const newPostRef = push(dbRef); //ユニークKEYを生成
    set(newPostRef, msg); //"chat"にユニークKEYをつけてオブジェクトデータを登録
}

//メッセージ送信時発火
$("#send").on("click", function() {
    let inputVal=$("#input").val();
    console.log(inputVal.slice(0,4)+'slice')
    if(inputVal.slice(0,4)=='http'){ //リンクを検出
        dataSendToDB(inputVal,'link', 'null', 'null');
    }else{
        dataSendToDB(inputVal,'msg', 'null', 'null');
    }
});


//ファイルのやりとりのあれこれ（仮）

// input要素
const fileInput = document.getElementById('file');

//------------ファイル選択＆storageへアップロード------------------

//以下を行う
//1.ファイルをstorageへ送信
//2.storageに保存されたファイルのurlを取得
//3.取得したurlをRealtimeDatabaseに記録

const handleFileSelect = async() => {
        const files = fileInput.files;
        for (let i = 0; i < files.length; i++) {

            let file = files[i];
            let fileName = files[i].name;
            const storage = getStorage();
            const imageRef = sRef(storage, fileName);

//1.ファイルをstorageへ送信
            await uploadBytes(imageRef, file).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });
//2.storageに保存されたファイルのurlを取得
            let fileUrl = await fileUrlDownloader(fileName); //アップロード完了後にUrlを取りにいく

//3.取得したurlをRealtimeDatabaseに記録
            if(checkImgExt(fileName)){
                dataSendToDB(fileName,'img',fileName,fileUrl);
            }else{
                dataSendToDB(fileName,'other',fileName,fileUrl);
            };


        }

    }
    // ファイル選択時にhandleFileSelectを発火
fileInput.addEventListener('change', handleFileSelect);
//----------------------------------------------------------



//fileNameと同じ名前のファイルのリンクをfirebase storageから取得＋リンクをセットするメソッドを呼び出し
//getDownloadURLの呼び出し＋Urlを返す
const fileUrlDownloader = async(fileName) => {
        // console.log(fileName);
        const storage = getStorage();
        let getUrl; //戻り値格納用変数

        await getDownloadURL(sRef(storage, fileName)) //処理に時間がかかるのでawaitが必要
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
                getUrl = url;

            })
            .catch((error) => {
                // Handle any errors
            });
        return getUrl;
    }


//メッセージを追加
onChildAdded(dbRef, function(data) {
    let log = data.val();
    // console.log(log.fileName);
    // console.log(log.fileUrl);
    if (x == 0) { //1番最初のリロード・チャット表示(general宛だけ)
        if (log.channel == "general") {
            appendContent(log.uname, log.text,log.dataType,log.fileUrl, log.timestamp);
        }
    }
    if (x > 1000) { //以降変更が加わったらチャット表示
        appendContent(log.uname, log.text,log.dataType,log.fileUrl, log.timestamp);
    }

});

//ファイル送受信のプロセス
//---------------------
//1.ファイルをstorageへ送信
//2.storageに保存されたファイルのurlを取得
//3.取得したurlをRealtimeDatabaseに記録
//4.RDが各ユーザーに追加されたデータを送る  （onChildAdded）
//5.送信されたデータをメッセージ・画像・ファイルに応じた方法で表示 (appendMessage等)