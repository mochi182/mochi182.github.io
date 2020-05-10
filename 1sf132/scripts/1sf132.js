$( "td.columnaSemanas" ).click(function() {
    if ($(this).parent().attr("id") == undefined) {
        $("tr").each(function() {
            $(this).css("border-top", "");
            $(this).css("border-bottom", "");
            $(this).removeAttr("id");
        })
        $(this).parent().css("border-top", "6px solid rgb(109, 81, 237)");
        $(this).parent().css("border-bottom", "6px solid rgb(109, 81, 237)");
        $(this).parent().attr("id", "selected");
    } else  {
        $(this).parent().css("border-top", "");
        $(this).parent().css("border-bottom", "");
        $(this).parent().removeAttr("id");
    }
});

$(".flexContenido").click(function() {
    alert("Info de la asignación...");
});

$(".flexContenido").each(function() {
    if ($(this).text().includes("Calidad")){
        $(this).css("background", "linear-gradient(315deg, rgba(100,132,217,1) 9%, rgba(233,239,255,1) 9%, rgba(227,244,255,1) 94%)");};
    if ($(this).text().includes("OAC")){
        $(this).css("background", "linear-gradient(315deg, rgba(252,97,139,1) 9%, rgba(233,239,255,1) 9%, rgba(227,244,255,1) 94%)");};
    if ($(this).text().includes("Base de datos 2")){
        $(this).css("background", "linear-gradient(315deg, rgba(223,222,152,1) 9%, rgba(233,239,255,1) 9%, rgba(227,244,255,1) 94%");};
    if ($(this).text().includes("Estadística")){
        $(this).css("background", "linear-gradient(315deg, rgba(100,217,111,1) 9%, rgba(233,239,255,1) 9%, rgba(227,244,255,1) 94%");};
    if ($(this).text().includes("Programación 2")){
        $(this).css("background", "linear-gradient(315deg, rgba(252,154,97,1) 9%, rgba(233,239,255,1) 9%, rgba(227,244,255,1) 94%)");};
    if ($(this).text().includes("Métodos numéricos")){
        $(this).css("background", "linear-gradient(315deg, rgba(184,100,217,1) 9%, rgba(233,239,255,1) 9%, rgba(227,244,255,1) 94%)");};
    if ($(this).text().includes("Información")){
        $(this).css("background", "linear-gradient(315deg, rgba(208,208,208,1) 9%, rgba(233,239,255,1) 9%, rgba(227,244,255,1) 94%)");};
})
