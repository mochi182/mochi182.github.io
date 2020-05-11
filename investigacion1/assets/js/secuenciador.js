
var kick = new Howl({
    src: ['./assets/sonidos/kick.wav']
  });
var snare = new Howl({
    src: ['./assets/sonidos/snare.wav']
  });
var piano = new Howl({
    src: ['./assets/sonidos/piano.mp3']
  });


$( "td.beat" ).click(function() {
    var filaI = this.parentElement.getAttribute('id');
    this.classList.add("on");
    this.style.backgroundColor ="red";
});

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

function queSonidos(i){
    var x = document.getElementById("BPM").value;
    var filas = document.getElementsByTagName("tr");
    if(filas[0].cells[i].className.includes('on')){
        kick.play();
    };
    if(filas[1].cells[i].className.includes('on')){
        snare.play();
    };
    if(filas[2].cells[i].className.includes('on')){
        piano.play();
    };
};

function PLAY(){ 
    for(var i = 0; i<18; i++){
      queSonidos(i);
    };
    
};
