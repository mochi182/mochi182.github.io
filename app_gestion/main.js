//1. llamada al api de youtube
//2. ordena los comentarios descripcion y titulo
//3. convierte eso a numeritos
//4. envia a api del modelo ya entrenado
//5. presenta resultado

/* ------------------------------ PARA LIMPIAR TEXTO ------------------------------ */

class LimpiarTexto{

    constructor(text){
        this.text = text
    }
    
    limpiar(){
        let to_clean = this.text;
        let simbolos_re = /\++|-+|\*+|\/+|\\+|#+|\$+|%+|@+|!+|_+|\?+|¿+|\"|\n+|('s)+|'+/g
        to_clean = to_clean.replace(simbolos_re, " ").toLowerCase()
        let cleaned = ""
        for (var i = 0; i < to_clean.length; i++){
            cleaned += this.es_letra(to_clean[i])
        }
        cleaned = cleaned.replace(/ +/g, " ")
        return cleaned
    }

    es_letra(simbolo){
        var letras = ['a','b','c','d','e','f',
        'g','h','i','j','k','l',
        'm','n','o','p','q','r',
        's','t','u','v','w','x','y', 'z', ' ']
        if (letras.includes(simbolo)){
            return simbolo
        }
        else {
            return ""
        }
    }
}

/* ------------------------------ SIMILITUD COSENO ------------------------------ */

class SimilitudCoseno{ 
    
    constructor(clases, texto){
        this.clases = clases
        this.texto = texto
    }

    frecuencia_inversa(t,n){
        return Math.log10(t/n) + 1
    }

    producto_punto(l1, l2){
        let res = 0
        for (let i = 0; i < l1.length; i++){    
            res += (l1[i] * l2[i])
        }
        return res
    }

    get_palabras_de_clases() {
        let every_word = []
        for (const key in this.clases) {
            every_word = every_word.concat(this.clases[key])
        }
        let every_word_set = new Set(every_word)
        this.palabras_de_clases = [...every_word_set]
    }

    get_palabras_utiles() {
        this.text_split = this.texto.split(/ |\n/)
        let text_list_set = new Set(this.text_split)
        let text_list = Array.from(text_list_set);
        let messirve = []
        for (let i = 0; i < text_list.length; i++){
            if (this.palabras_de_clases.includes(text_list[i])) {
                messirve.push(text_list[i])
            }
        }
        this.palabras_utiles = messirve
    }

    conteo(lista, w){
        var count = 0;
        for(var i = 0; i < lista.length; ++i){
            if(lista[i] == w)
                count++;
        }
        return count
    }

    obtener_d(){
        let d = {}
        for (const key in this.clases) {
            d[key] = []
            for (let i = 0; i < this.palabras_de_clases.length; i++) {
                d[key].push(this.conteo(this.clases[key], this.palabras_de_clases[i]))
            }
        }
        this.d = d
        this.total_docs = Object.keys(d).length
    }

    vector_consulta(){
        let vq = []
        for (let i = 0; i < this.palabras_de_clases.length; i++) {
            vq.push(this.conteo(this.palabras_utiles, this.palabras_de_clases[i]))
        }
        this.vq = vq
    }

    obtener_n_docs(){
        let n_docs = {}
        for (let i = 0; i < this.palabras_de_clases.length; i++) {
            let count = 0
            for (const key in this.clases){
                if (this.clases[key].includes(this.palabras_de_clases[i])) {
                    count++;
                }
            }
            n_docs[this.palabras_de_clases[i]] = count
        }
        this.n_docs = n_docs
    }

    frecuencia_inversa_por_d(){
        //alert(this.d["music"])
        let nueva_lista = []
        let i
        for (const key1 in this.d){
            nueva_lista = []
            i = 0
            for (const key2 in this.n_docs) {
                nueva_lista.push(this.d[key1][i] * this.frecuencia_inversa(this.total_docs, this.n_docs[key2]))
                i++
            }
            this.d[key1] = nueva_lista
        }
    }

    hypot(lista) {
        let res = 0
        for (let i = 0; i < lista.length; i++) {
            res += Math.pow(lista[i], 2)
        }
        return Math.sqrt(res)
    }

    divideIfNotZero(numerator, denominator) {
        if (denominator === 0 || isNaN(denominator)) {
                return 0;}
        else {
                return numerator / denominator;}
        }

    similitud() {
        let sim_cos = {}
        let hq = this.hypot(this.vq)
        for (const key in this.d) {
            let hd = this.hypot(this.d[key])
            let similitud = this.divideIfNotZero(this.producto_punto(this.d[key], this.vq), (hd * hq))
            sim_cos[key] = similitud
        }
        this.sim_cos = sim_cos
    }

    calcular() {
        this.get_palabras_de_clases()
        this.get_palabras_utiles()
        this.obtener_d()
        this.vector_consulta()
        this.obtener_n_docs()
        this.frecuencia_inversa_por_d()
        this.similitud()
        return this.sim_cos
    }

    imprimir() {
        for (const key in this.d) {
            alert(key)
            alert(this.sim_cos[key])
        }
    }

}

/* ------------------------------ LLAMADAS A API ------------------------------ */

async function llamada1(channelId, api_key){

    //poke = "https://pokeapi.co/api/v2/pokemon/1"
    let cantidad_videos = String(3)
    url_1 = "https://youtube.googleapis.com/youtube/v3/search?part=snippet%2C%20id&channelId=" + channelId + "&maxResults=" + cantidad_videos + "&type=video&key=" + api_key
    const respuesta = await fetch(url_1)

    if (respuesta.status == 200) {
        const peticion = respuesta.json()
        return peticion
    } else {
        alert("No es un canal válido.")
    }
}

async function llamada2(api){

    let videos = api["items"]
    nombre_canal = videos[0]["snippet"]["channelTitle"]
    let cantidad_comentarios = String(3)


    let promises = [];
    for (let i = 0; i < videos.length; i++) {

        //url = "https://pokeapi.co/api/v2/pokemon/" + String(i)
        let videoTitle = videos[i]["snippet"]["title"]
        let videoDescripcion = videos[i]["snippet"]["description"]
        lista_titulos.push(videoTitle)
        lista_descripciones.push(videoDescripcion)

        let videoId = videos[i]["id"]["videoId"]
        //alert(videoId)
        url_2 = "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=" + cantidad_comentarios + "&videoId=" + videoId + "&key=" + api_key

        promises.push(await fetch(url_2));

    } 

    return promises
}

async function llamada3(api){
    for (let i = 0; i < api.length; i++) {
        api[i].json().then((data) => {
            for (let j = 0; j < data["items"].length; j++) {
                let comentario = data["items"][j]["snippet"]["topLevelComment"]["snippet"]["textOriginal"]
                lista_comentarios.push(comentario)
            }
        } )
    }
}

async function llamada4(api){

    alert(nombre_canal)
    alert(lista_titulos)
    alert(lista_descripciones)
    alert(lista_comentarios)

    url_3 = "watson studio"
    const respuesta = await fetch(url_3)
    const  peticion3 =  respuesta.json()
    return peticion3
}

async function mostrar_resultados(api){
    //var dato3 = api
}


/* ------------------------------ EJECUCIÓN ------------------------------ */

var api_key = "AIzaSyBg2TsMSgaZhpgDOfjVKhOxOwOTANV1Za4"
var clases = [ "technology", "music", "food", "travel", "videogames", "football", "science", "anime"]
var cantidad_comentarios = 8

var nombre_canal = ""
var lista_titulos = []
var lista_descripciones = []
var lista_comentarios = []


    
/*
$("#form").submit(function(event) {

    var channelId = $("#canal").val();
    llamada1(channelId, api_key).then(llamada2).then(llamada3).then(llamada4).then(mostrar_resultados)

    event.preventDefault()

}) */