//dont touch me
Array.prototype.shuffle = function() {
    var i = this.length;
    if (i == 0) return this;
    while (--i) {
        var j = Math.floor(Math.random() * (i + 1 ));
        var a = this[i];
        var b = this[j];
        this[i] = b;
        this[j] = a;
    }
    return this;
};
//pls no touch
var songsDict = [];
var prevSongs=[];
window.onload = function () {
  //change me to shuffle must be comma seperated.
  TIMER_DURATION =15; //in seconds
  sixtysongs = "Yeh reshmi zulfein ye sharbati aankhen tumhe dekh kar - DO RAASTE,Aaja aaja mein hun pyar tera walla walla - TESRI MANZIL,Pholon ke rang se rang ki umang se -PREM PUJARI,Din Dhal Jayehai raat na jaye tu tho na ayi teri yaad satay -  GUIDE,Abhi na jao chhod kar ke dil abhi bhara nahi - HUMDONNO,Roop Tera mastana pyar mera diwan bhool kahi ham se na hoja ye - ARADHANA,Hoth  pe aisi baat mai daba ke chali aai khol jaye - JEWEL THIEF,Mora gora aanga laie le mohe saam rang dayi de choopa jooinge raath - BANDINI,Bhai Bhattur Bhai Bhattur ham jaiyenge kitane door najooka naaajok meri jawani  -PADOSAN,Ye mera prem patra padh kar tum naraj na hona  - SANGAM,Piya aiso jiya mein  samiye gayo re  - SAHIB BIWI GHULAM,Gunaam Hai koi -  GUNAAM,mujhe teri mohabbat ka sahara  - AAP AYE BAHAR AAYE,Chahunga mein tujhe sanjh savre - DOSTI,Sawan ka mahina pawan kare shore jiyarar- MILAN,Nain lade jahien to manwa kasak hoi bekarey - GANGA JAMUNA,Ude jab jab zulfen teri  kawarioka dil machle  - NAYA DAUR,Dil ke Jharoke me tuzko bethakar yadonke   - BRAHAMCHARI,Mere Mehboob tuje Meri Mohabat ki kasam  - MERE MEHBOOB,Mohe panghat pe nandlal ched gayo rey morei naajuak kalaya marod  - MUGHAL E AZAM ,Dil ka bhanwar kare pukar pyar karaag suno pyar ka raag suno re  - TERE GHAR KE SAMNE,Diwana mastana hua dil jaane khana hoke bahar aayi - BOMBAY KA BABU,Kahin deep jale kahin dil - BEES SAAL BAAD,Laal chaadi maidan khadi kya khoob ladi  - JANWAR";
  var songs = sixtysongs.split(","); //can change delimeter
  songs.forEach((e)=>{
    var songAnsPair = e.split("-");
    songsDict.push({"song":songAnsPair[0],"movie":songAnsPair[1]});
  });
  document.querySelector("#timer").addEventListener("click", ()=>{
    startTimer(TIMER_DURATION,"#time");
  });
  document.querySelector("#isReady").innerHTML = "Ready";
};


function getSong(){
  var length = songsDict.length;
  var j = Math.floor(Math.random() * (length + 1 ));
  if (prevSongs.length===songsDict.length){
    songSS = document.createElement("h1");
    songSS.innerHTML = "Thanks for Playing!";
    document.getElementById("songs").innerHTML ='';
    document.getElementById("songs").appendChild(songSS);
  }
  
  if (!prevSongs.includes(songsDict[j].song)){
    prevSongs.push(songsDict[j].song);
    var shuffledSentence = songsDict[j].song.split(' ').shuffle().join(' ');
    songSS = document.createElement("h1");
    songSS.innerHTML = shuffledSentence;
    //empty the elemtn
    document.getElementById("songs").innerHTML ='';
    document.getElementById("songs").appendChild(songSS);
    
    var remaining = songsDict.length-prevSongs.length;
    document.getElementById("remain").innerHTML =remaining;
  }else{
    getSong();
  }
  
  
}
function finishGame(){
  songSS = document.createElement("h1");
    songSS.innerHTML = "Thanks for Playing!";
    document.getElementById("songs").innerHTML ='';
    document.getElementById("songs").appendChild(songSS);
    prevSongs=[];
    var remaining = songs.length-prevSongs.length;
    document.getElementById("remain").innerHTML =remaining;
}
function findSong(song){
  for (i=0;i<songsDict.length;i++){
    if (songsDict[i].song===song)
      return songsDict[i];
  }
}
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    handler= setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.querySelector(display).textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(handler); 
            document.querySelector(display).innerHTML = "EXPIRED";
        }
    }, 1000);
}