
var kick = new Howl({
    src: ['./assets/sonidos/kick.wav']
  });
var snare = new Howl({
    src: ['./assets/sonidos/snare.wav']
  });
var piano = new Howl({
    src: ['./assets/sonidos/piano.mp3']
  });

var loop = true;
var detenido = false;
var filas = document.getElementsByTagName("tr");

$( "td.beat" ).click(function() {
    var filaI = this.parentElement.getAttribute('id');
    this.classList.add("on");
    this.style.backgroundColor ="red";
});

function sonidos_por_beat(i){
    if(filas[1].cells[i].className.includes('on')){
        kick.play();
    };
    if(filas[2].cells[i].className.includes('on')){
        snare.play();
    };
    if(filas[3].cells[i].className.includes('on')){
        piano.play();
    };
};

function botonLoop(){
    if (loop){
        loop = false;
        alert(loop);
    } else{
        loop = true;
        alert(loop);
    }
};

function botonStop(){
    detenido = true;
};

function botonPlay() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var x = document.getElementById("BPM").value;

    if(x){
        duracion = ((16*60)/x)*1000;
        duracion_1_beat = duracion/16;
        var tiempo_transcurrido = 0;
        var i = 0;

        function accionPlay() {
            sonidos_por_beat(i);
            i += 1;
            tiempo_transcurrido += duracion_1_beat;
            if(detenido){
                detenido = false;
                return null;
            } else{
                if (loop){
                    if(i ==15){
                        i=0;
                    };
                    setTimeout(accionPlay, duracion_1_beat);
                } else{
                    if (tiempo_transcurrido >= duracion){
                        return null;
                    } else{
                        setTimeout(accionPlay, duracion_1_beat);
                    }
                }
            }
        };
        accionPlay();
    }else{
        alert('Ingrese un BPM');
    }
};