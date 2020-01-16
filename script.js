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
var yearDict={"60":[],"70":[],"80":[]};
var songsDict;
var prevSongs=[];
var TIMER_DURATION =15; //in seconds
window.onload = function () {
  //change me to shuffle must be comma seperated.
  this.readFile();
  console.log(yearDict);
  document.querySelector("#isReady").innerHTML = "Ready";
};


function getSong(year){
  var length = yearDict[year].length;
  songsDict = yearDict[year];
  var totalLength = yearDict["60"].length +yearDict["70"].length+yearDict["80"].length;
  var j = Math.floor(Math.random() * (length + 1 ));
  if (prevSongs.length===totalLength){
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
    
    var remaining = ( yearDict["60"].length + yearDict["70"].length  +yearDict["80"].length)-prevSongs.length;
    document.getElementById("remain").innerHTML =remaining;

    document.getElementById("player").innerHTML ='';
    // document.getElementById("player").innerHTML="<iframe width='560' height='315' src='https://www.youtube.com/embed/"+songsDict[j].link+"' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"
    document.getElementById("fulllink").href=songsDict[j].fulllink;
    document.getElementById("fulllink").click(function(e){ e.preventDefault(); window.open(this.href);});
    this.disableOthers();
    this.startTimer(TIMER_DURATION, "#time",songsDict[j].movie);
  }else{
    getSong(year);
  }
  
  
}
function finishGame(){
  songSS = document.createElement("h1");
    songSS.innerHTML = "Thanks for Playing!";
    document.getElementById("songs").innerHTML ='';
    document.getElementById("songs").appendChild(songSS);
    prevSongs=[];
    var remaining = ( yearDict["60"].length + yearDict["70"].length  +yearDict["80"].length)-prevSongs.length;
    document.getElementById("remain").innerHTML =remaining;
    document.getElementById("player").innerHTML ='';
}

function startTimer(duration, display, movie) {
    var timer = duration, minutes, seconds;
    handler= setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.querySelector(display).textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(handler); 
            document.querySelector(display).innerHTML = "Times up!";
            document.getElementById("player").innerHTML= "<h2>"+ movie+"</h3>";
            document.getElementById("y70").disabled = false;
            document.getElementById("y80").disabled = false;
            document.getElementById("y60").disabled = false;
        }
    }, 1000);
}
function updateTime(){
  TIMER_DURATION = document.getElementById("timerValue").value;
  document.getElementById("timerNum").innerHTML = TIMER_DURATION;
}

function readFile(){
  file  = "songs.csv";
  fetch(file)
  .then(response => 
    response.text()
    ).then(
      text => {
        songs = text.split("\n");
        songs.forEach(element => {
          song = element.split(",");
          yearDict[song[0]].push({"song":song[1],"movie":song[2],"link":song[3].substr(song[3].length - 11), "fulllink":song[3]})
        });
        console.log("songs done.")
      });
}

function disableOthers(){
  document.getElementById("y60").disabled = true;
  document.getElementById("y70").disabled = true;
  document.getElementById("y80").disabled = true;
}