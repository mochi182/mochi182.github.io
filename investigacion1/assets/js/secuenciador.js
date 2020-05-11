function seleccionante(){
    var seleccion = document.getElementById('seleccionador').value;
    var filas = document.getElementsByTagName("tr");
    for(var i=0; i< filas.length; i++){
        var claseFila = filas[i].getAttribute('class');
        if (claseFila == seleccion || claseFila == "foot"){
            filas[i].style.display = 'table-row';
        } else{
            filas[i].style.display = 'none';
        }
    };
};

$( "#seleccionador" ).change(function() {
    seleccionante();
});

$(document).ready(function() {
    seleccionante();
});