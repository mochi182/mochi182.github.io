/* ------------------------------ PARA LIMPIAR TEXTO ------------------------------ */

class LimpiarTexto{
    
    limpiar(text){
        let to_clean = text;
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
                lista_comentarios.push(String(comentario))
            }
        } )
    }
}

async function analizar() {
    texto_titulos = limpiarTexto.limpiar(lista_titulos.join(' '))
    texto_descripciones = limpiarTexto.limpiar(lista_descripciones.join(' '))
    texto_comentarios = limpiarTexto.limpiar(lista_comentarios.join(' '))

    var similitudCoseno1 = new SimilitudCoseno(clases, texto_titulos)
    var similitudCoseno2 = new SimilitudCoseno(clases, texto_descripciones)
    var similitudCoseno3 = new SimilitudCoseno(clases, texto_descripciones)

    var valores_finales = {
        "input_data":[
            {
                "fields":[],
                "values":[[]]
            }
        ]
    }
    var simil_titulos = similitudCoseno1.calcular()
    var simil_descripciones = similitudCoseno2.calcular()
    var simil_comentarios = similitudCoseno3.calcular()

    var values = [[]]
    var fields = []
    for (const key in simil_titulos) {
        let key2 = "titulo(" + key + ")"
        //valores_finales[key2] = simil_titulos[key]
        fields.push(key2)

        if (simil_titulos[key] == 0) {
            values[0].push(null)
        } else {
            values[0].push(simil_titulos[key])
        }
    }
    for (const key in simil_descripciones) {
        let key2 = "descripcion(" + key + ")"
        //valores_finales[key2] = simil_descripciones[key]
        fields.push(key2)

        if (simil_titulos[key] == 0) {
            values[0].push(null)
        } else {
            values[0].push(simil_descripciones[key])
        }
    }
    for (const key in simil_comentarios) {
        let key2 = "comentarios(" + key + ")"
        //valores_finales[key2] = simil_comentarios[key]
        fields.push(key2)

        if (simil_titulos[key] == 0) {
            values[0].push(null)
        } else {
            values[0].push(simil_comentarios[key])
        }
    }
    valores_finales["input_data"][0]["fields"] = fields
    valores_finales["input_data"][0]["values"] = values
    //console.log(JSON.stringify(valores_finales))

    token = "eyJraWQiOiIyMDIxMDcxOTE4MzciLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJJQk1pZC02NzYwMDA1VDVSIiwiaWQiOiJJQk1pZC02NzYwMDA1VDVSIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiNGVlNDE1ZjEtNTRhNC00NTJhLWI1MDctOTc3MDY5NWM0YjhmIiwiaWRlbnRpZmllciI6IjY3NjAwMDVUNVIiLCJnaXZlbl9uYW1lIjoiQXJpc3RpZGVzIiwiZmFtaWx5X25hbWUiOiJJc2F6YSIsIm5hbWUiOiJBcmlzdGlkZXMgSXNhemEiLCJlbWFpbCI6ImFyaXN0aWRlcy5pc2F6YUB1dHAuYWMucGEiLCJzdWIiOiJhcmlzdGlkZXMuaXNhemFAdXRwLmFjLnBhIiwiYXV0aG4iOnsic3ViIjoiYXJpc3RpZGVzLmlzYXphQHV0cC5hYy5wYSIsImlhbV9pZCI6IklCTWlkLTY3NjAwMDVUNVIiLCJuYW1lIjoiQXJpc3RpZGVzIElzYXphIiwiZ2l2ZW5fbmFtZSI6IkFyaXN0aWRlcyIsImZhbWlseV9uYW1lIjoiSXNhemEiLCJlbWFpbCI6ImFyaXN0aWRlcy5pc2F6YUB1dHAuYWMucGEifSwiYWNjb3VudCI6eyJib3VuZGFyeSI6Imdsb2JhbCIsInZhbGlkIjp0cnVlLCJic3MiOiJiMjViNWI1ZjcyYTg0MjQ4YjkwN2E3YWM2YWE0NjBjMCIsImZyb3plbiI6dHJ1ZX0sImlhdCI6MTYyNzQ5OTYzMywiZXhwIjoxNjI3NTAzMjMzLCJpc3MiOiJodHRwczovL2lhbS5jbG91ZC5pYm0uY29tL2lkZW50aXR5IiwiZ3JhbnRfdHlwZSI6InVybjppYm06cGFyYW1zOm9hdXRoOmdyYW50LXR5cGU6YXBpa2V5Iiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiZGVmYXVsdCIsImFjciI6MSwiYW1yIjpbInB3ZCJdfQ.J9ycGZg5ylY9xOklbi9H4xYK79mNYrC83bn1Oc3B_4pyMi-6ayrQ10eqZOAjXs2ln9K9B6zIzYxKfLKkRsYd7cc2xL9KjyAcdndQMVOf_lcCPcSsaAjyyGUK8tECK4ugwTp21cvxuCwkNETQyPIIjyyUNsVLOKf85E7kQvdk-8T6PTjGFtfVCt2le9TbARn3GKAIW1MZ-nlMbjJjJmIhZW7Q_qHHcbkSwiEdtLv_tv9-j4zM7GSJO_k9pkuBtPiwkxeBqZh8A74_QrA1Wsa_65ALZeaDZtACvjZPTix6bHT7-4ZKF6lfVbOIzSQbvvehbBKNX73By9halbznzHe3Rw"
    ibm_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/8bfc23d0-516b-4392-9635-7d786d7c3067/predictions?version=2021-07-28"
    var payload = JSON.stringify(valores_finales);
    
    var peticion = new XMLHttpRequest(); 
    peticion.onreadystatechange = function() {
        if (peticion.readyState == XMLHttpRequest.DONE) {
            alert(peticion.responseText)
            console.log(peticion.responseText);
            res_2_json = JSON.parse(peticion.responseText)
            clasificacion = res_2_json["predictions"][0]["values"][0][0];
        }
    }
    peticion.open("POST", ibm_url);
    peticion.setRequestHeader("Content-Type", "application/json");
    peticion.setRequestHeader("Authorization", "Bearer " + token);
    peticion.send(payload);

}


async function generar_token() {
    var ibm_api_key = ""

    var token_url = "https://iam.ng.bluemix.net/identity/token";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", token_url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization", "Basic Yng6Yng=");
    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.status);
        token = xhr.responseText["access_token"]
        console.log(xhr.responseText);
    }};
    var data = "apikey=" + ibm_api_key + "&grant_type=urn%3Aibm%3Aparams%3Aoauth%3Agrant-type%3Aapikey";
    xhr.send(data);
}

async function mostrar_resultados(){
    let tabla_res = `
    <table class="table">
        <thead class="thead-dark">
            <tr>
                <th colspan="2">
                    <h3>Resultados</h3>
                </th>
            </tr>
        </thead>
        <tr>
            <td>
                <h4>Nombre</h4>
            </td>
            <td>
                ${nombre_canal}
            </td>
        </tr>
        <tr>
            <td>
                <h4>Títulos</h4>
            </td>
            <td>
                <div class="blob">
                    ${texto_titulos}
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <h4>Descripciones</h4>
            </td>
            <td>
                <div class="blob">
                    ${texto_descripciones}
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <h4>Comentarios</h4>
            </td>
            <td>
                <div class="blob">
                    ${texto_comentarios}
                </div>
            </td>
        </tr>
        <tr class="table-success">
            <td>
                <h4>Categoría</h4>
            </td>
            <td>
                <div class="blob">
                    ${clasificacion}
                </div>
            </td>
        </tr>
    </table>
    
    `
    $("#resultados").append(tabla_res)
}


/* ------------------------------ EJECUCIÓN ------------------------------ */

//var clases = [ "technology", "music", "food", "travel", "videogames", "football", "science", "anime"]
var cantidad_comentarios = 8
var token = ""
var clasificacion = ""
var ibm_url = ""

var api_key = ""
var nombre_canal = ""
var lista_titulos = []
var lista_descripciones = []
var lista_comentarios = []
var limpiarTexto = new LimpiarTexto()

var clases = { 'technology' : ['drive', 'text', 'type', 'word', 'processing', 'computerbased', 'image', 'engine', 'gaming', 'aol', 'clip', 'design', 'knowledge', 'batch', 'dell', 'capabilities', 'gnome', 'compiler', 'proprietary', 'technologies', 'notepad', 'control', 'users', 'applet', 'login', 'card', 'techie', 'enables', 'testing', 'punched', 'xml', 'handheld', 'security', 'programmers', 'process', 'digital', 'natural', 'hemisphere', 'precomputer', 'disassembler', 'device', 'calculator', 'surf', 'intellij', 'terminal', 'cadra', 'monkey', 'escape', 'equipment', 'malevolent', 'megapixel', 'intel', 'third', 'bill', 'call', 'resistive', 'cyberpsychology', 'metaprogram', 'android', 'video', 'communications', 'use', 'novell', 'acrobat', 'alan', 'technical', 'technological', 'graphic', 'startup', 'adrem', 'program', 'office', 'corel', 'cyberterrorism', 'engineer', 'tree', 'lever', 'internet', 'hacker', 'analog', 'metaloxidesemiconductor', 'extranet', 'musical', 'nokia', 'meatware', 'bot', 'files', 'environment', 'mosfet', 'numbers', 'beta', 'framework', 'vacuum', 'encode', 'workstation', 'developer', 'virtual', 'recode', 'netscape', 'telephone', 'nonprogramming', 'screen', 'encryption', 'industrial', 'library', 'edholm', 'micro', 's', 'packages', 'personal', 'music', 'enabled', 'configuration', 'wave', 'programmes', 'belight', 'pseudocode', 'miniaturization', 'telecomputer', 'bug', 'dramality', 'assentor', 'poke', 'downloader', 'product', 'expertise', 'money', 'tukey', 'modem', 'search', 'qwerty', 'teleinstruction', 'electronic', 'display', 'applets', 'cyberjunkie', 'migrator', 'coding', 'microcode', 'graphics', 'authoring', 'programmer', 'computerism', 'machines', 'informatics', 'cyberintrusion', 'john', 'cybernetwork', 'cyberjargon', 'utility', 'processor', 'g', 'iphone', 'adware', 'branch', 'metadata', 'automation', 'gnu', 'algorithm', 'bitness', 'linux', 'battery', 'embedded', 'workflow', 'square', 'propylon', 'technology', 'developers', 'visual', 'flash', 'multithreaded', 'patch', 'emulation', 'license', 'networking', 'servlet', 'programmable', 'palm', 'tools', 'nasa', 'hackathon', 'highlevel', 'synapta', 'server', 'cinematize', 'wordprocessing', 'division', 'tape', 'addon', 'homo', 'programs', 'msn', 'intranet', 'multinetworked', 'provider', 'ssh', 'uploader', 'hitachi', 'prebuilt', 'vm', 'debugging', 'teletype', 'uninstall', 'adobe', 'satellite', 'key', 'cybersavvy', 'biotechnology', 'macintosh', 'learn', 'communication', 'devices', 'chemistry', 'converter', 'analytical', 'computer', 'bracket', 'compatible', 'lg', 'facebook', 'language', 'parser', 'idea', 'wireless', 'developed', 'quicksort', 'aging', 'undelete', 'gantt', 'assembler', 'user', 'minicomputer', 'platform', 'pcs', 'blackberry', 'mozilla', 'industry', 'playbill', 'isogon', 'foundation', 'alphabet', 'computernik', 'marketing', 'rootkit', 'linker', 'field', 'eclipse', 'browsing', 'summarizer', 'opensource', 'aid', 'avast', 'spyware', 'tv', 'management', 'hostmaster', 'science', 'regression', 'enterprise', 'agenda', 'appender', 'servers', 'ai', 'hp', 'computerologist', 'html', 'phone', 'multinetwork', 'killer', 'ibook', 'corporation', 'cad', 'studio', 'desktop', 'bioscience', 'systems', 'constellations', 'antiaging', 'multitasking', 'integrated', 'symantec', 'weapon', 'algorithms', 'computing', 'shareware', 'robotics', 'mainframe', 'audio', 'nessus', 'organize', 'computerlike', 'disk', 'scancode', 'your', 'apple', 'eyebeam', 'ietf', 'machine', 'biocomputing', 'cybersystem', 'molecules', 'compy', 'bionics', 'aeronautical', 'tool', 'products', 'srx', 'computeritis', 'microcomputer', 'app', 'central', 'nanocomputer', 'agile', 'applications', 'multimedia', 'slot', 'counterprogramming', 'chiclet', 'discover', 'interface', 'floppy', 'section', 'pc', 'anticomputer', 'unit', 'source', 'compact', 'bluetooth', 'available', 'peripheral', 'open', 'mac', 'cyanea', 'noncomputer', 'lovelace', 'unix', 'pair', 'project', 'cpu', 'scaling', 'apps', 'moore', 'microprocessor', 'sap', 'structure', 'screensaver', 'freeware', 'software', 'based', 'automated', 'applied', 'skill', 'navigation', 'providers', 'circuit', 'mobile', 'access', 'rom', 'firmware', 'upgrade', 'predefined', 'command', 'programming', 'hack', 'microsoft', 'autonomics', 'gates', 'engineering', 'toolkit', 'thirdparty', 'cisco', 'motherboard', 'gtk', 'chinese', 'quantum', 'insp', 'pessimize', 'samsung', 'payment', 'computerist', 'aspectoriented', 'multiload', 'google', 'electronics', 'table', 'store', 'medicine', 'uses', 'maintenance', 'room', 'puter', 'data', 'realtime', 'ag', 'neurocomputer', 'wifi', 'bloatware', 'in', 'functionality', 'oracle', 'architecture', 'portability', 'shrinkwrapped', 'orient', 'ios', 'hewlettpackard', 'biomedical', 'database', 'computerized', 'camera', 'softlifting', 'waterfall', 'innovations', 'magnetic', 'prehistory', 'os', 'system', 'eseries', 'w', 'package', 'supervisory', 'windows', 'ecos', 'mnemonic', 'hash', 'teleprogramming', 'cyberinteraction', 'operating', 'eater', 'cybertechnology', 'optimizer', 'computeraided', 'cybersuicide', 'write', 'free', 'fault', 'virtualize', 'telnet', 'preprogram', 'groupware', 'browsers', 'manufacturing', 'keyboard', 'malware', 'messaging', 'computerology', 'analytics', 'netzine', 'laptop', 'swing', 'keygen', 'test', 'imode', 'procedure', 'hardware', 'bios', 'manager', 'readymade', 'storage', 'agentry', 'cyberphilosophy', 'extensible', 'brain', 'metaprogramming', 'teleprogrammed', 'telecommuter', 'outspring', 'editor', 'spooler', 'neolithic', 'oppo', 'plugins', 'graphical', 'von', 'oss', 'online', 'right', 'logon', 'relational', 'eye', 'reader', 'feature', 'multitask', 'curly', 'media', 'tuner', 'http', 'webbased', 'crossgrade', 'web', 'immix', 'instruction', 'huawei', 'energy', 'subprogram', 'good', 'coreid', 'computation', 'function', 'courseware', 'compute', 'observatory', 'net', 'array', 'computerize', 'printing', 'model', 'hard', 'turing', 'home', 'documentation', 'computercide', 'instrument', 'interactive', 'application', 'assistant', 'ringtone', 'biology', 'forms', 'disc', 'debug', 'multitouch', 'club', 'ada', 'tech', 'accelerometer', 'cellular', 'broadband', 'scientist', 'wc', 'tube', 'softmodem', 'network', 'supercomputer', 'multiprogramming', 'plugin', 'dbms', 'integrates', 'programme', 'symbian', 'networks', 'ecosystem', 'assembly', 'scientific', 'segmentation', 'line', 'quiche', 'acclivity', 'stream', 'discovery', 'neumann', 'databases', 'antivirus', 'dumb', 'alpha', 'allows', 'using', 'ebcdic', 'subroutine', 'routine', 'background', 'transhumanism', 'excel', 'development', 'information', 'wardialer', 'cybersociology', 'nanotechnology', 'ibm', 'wheel', 'download', 'code', 'solutions', 'operator', 'commercial', 'dolphin', 'object', 'service', 'incrementor', 'computers', 'kludge', 'binary', 'browser', 'flow', 'chart', 'touchscreen', 'graphician', 'soft', 'cybernetic', 'clearstory', 'ergonomics', 'spring', 'chip', 'computerdom', 'lithium', 'expansion', 'interpreter', 'support', 'load', 'pda'],
'music' : ['age', 'tongue', 'miles', 'power', 'darkcore', 'doors', 'mg', 'turntablism', 'floyd', 'housetribal', 'wedding', 'listening', 'college', 'gulf', 'grosso', 'funky', 'grateful', 'house', 'janis', 'madonna', 'folk', 'choir', 'baladas', 'digital', 'beethoven', 'cream', 'idm', 'oratorio', 'renaissance', 'wonder', 'james', 'horrorcore', 'tekno', 'berry', 'neil', 'carl', 'clearwater', 'composer', 'pink', 'gaye', 'electronica', 'archaeology', 'video', 'zeppelin', 'breakcore', 'temptations', 'double', 'cash', 'mitchell', 'lennon', 'yardbirds', 'hellbilly', 'makina', 'game', 'roy', 'elton', 'gospel', 'rave', 'jordan', 'art', 'psychedelic', 'progression', 'musical', 'illbient', 'county', 'lyrical', 'drone', 'chord', 'terrorcore', 'golden', 'funk', 'live', 'police', 'nails', 'lyrics', 'speedcore', 'west', 'theme', 'booker', 'black', 'urban', 'raggacore', 'intelligent', 'tunes', 'polyphony', 'hardcore', 'miracles', 'furniture', 'drumstep', 'joni', 'acdc', 'chamber', 'ancient', 'christian', 'industrial', 'who', 'al', 'rundmc', 'radiohead', 'bowie', 'band', 'latino', 'us', 'sung', 'praise', 'music', 'goth', 'inch', 'dansband', 'wave', 'future', 'electronicore', 'notation', 'chiptune', 'gabber', 'tops', 'jska', 'country', 'electric', 'oldschool', 'technodnb', 'space', 'perkins', 'acid', 'aretha', 'everly', 'fats', 'deep', 'impressionist', 'metal', 'diva', 'cooke', 'dead', 'etta', 'electronic', 'drifters', 'electroswing', 'song', 'doomcore', 'twin', 'coding', 'sertanejo', 'skweee', 'neurofunk', 'diddley', 'dre', 'rem', 'clash', 'crunkcore', 'electropop', 'death', 'scratch', 'ethnic', 'beach', 'hardstyle', 'john', 'supremes', 'bounce', 'eminem', 'midwest', 'ragga', 'western', 'orchestra', 'futurepop', 'allman', 'elvis', 'nelson', 'hyphy', 'garfunkel', 'chant', 'concert', 'trap', 'yorkshire', 'heads', 'tom', 'synthpunk', 'mass', 'piano', 'vandellas', 'cajun', 'recapitulation', 'bakersfield', 'gangsta', 'antifolk', 'songwriter', 'sonata', 'franklin', 'richard', 'chap', 'electroindustrial', 'francocountry', 'concrte', 'jerry', 'nine', 'string', 'ludwig', 'liquid', 'tonk', 'neofolk', 'cybergrind', 'ross', 'enemy', 'jack', 'backbeat', 'easy', 'pistols', 'composition', 'led', 'tape', 'lewis', 'requiem', 'martha', 'ghetto', 'nu', 'sound', 'nrg', 'cumbia', 'low', 'coast', 'drumfunk', 'german', 'computer', 'improvisation', 'prince', 'gothic', 'language', 'singer', 'eagles', 'crunk', 'timbre', 'sex', 'radio', 'velvet', 'moombahton', 'synthpop', 'jpunk', 'rolling', 'opera', 'orbison', 'comedy', 'electroacoustic', 'steampunk', 'folktronica', 'beat', 'rock', 'stone', 'field', 'jackin', 'dancepunk', 'vocal', 'drum', 'baltimore', 'guns', 'hank', 'regstep', 'the', 'ambient', 'shoegaze', 'frank', 'waters', 'tv', 'bap', 'jrock', 'jimi', 'techno', 'uk', 'recording', 'electrogrime', 'eurobeat', 'green', 'marvin', 'dark', 'shirelles', 'concerto', 'form', 'electro', 'chicago', 'family', 'chuck', 'dr', 'punkabilly', 'marley', 'greece', 'tune', 'new', 'east', 'turner', 'drumnbass', 'fiddle', 'jumpup', 'morrison', 'out', 'jingles', 'jersey', 'singalong', 'n', 'dutch', 'synthcore', 'jumpstyle', 'howlin', 'coldwave', 'filk', 'rap', 'lounge', 'kinks', 'domino', 'nwa', 'downtempo', 'merenrap', 'dubtronica', 'creedence', 'choral', 'conscious', 'electropunk', 'broken', 'britpunk', 'spector', 'techstep', 'public', 'bebop', 'nintendocore', 'school', 'mafioso', 'quartet', 'charles', 'u', 'aggrotech', 'eric', 'smith', 'medieval', 'harmonize', 'hinrg', 'wilson', 'japanoise', 'bouncy', 'melody', 'tonality', 'flute', 'chorus', 'curtis', 'standup', 'harmonise', 'carlos', 'young', 'dubstep', 'worship', 'genre', 'lead', 'boys', 'redding', 'sambass', 'french', 'sly', 'greek', 'witch', 'happy', 'byrds', 'scale', 'jackie', 'metallica', 'contemporary', 'phil', 'trip', 'st', 'full', 'big', 'beastie', 'themes', 'psyprog', 'hip', 'punk', 'bass', 'theatre', 'smokey', 'qawwali', 'uplifting', 'organum', 'santana', 'nova', 'bossa', 'british', 'muse', 'crossover', 'blues', 'sing', 'thrash', 'dream', 'buddy', 'williams', 'off', 'presley', 'perry', 'expressionist', 'toytown', 'underground', 'dub', 'step', 'electronics', 'dance', 'brick', 'parliamentfunkadelic', 'schranz', 'bubblegum', 'experimental', 'chillstep', 'indie', 'karaoke', 'indietronica', 'italo', 'jayz', 'skool', 'muddy', 'southern', 'entertainment', 'hop', 'bit', 'tupac', 'bolero', 'breakbeat', 'dylan', 'zappa', 'symphonic', 'rhapsody', 'baggy', 'accompaniment', 'bassline', 'roxy', 'stevie', 'classic', 'darkstep', 'breaks', 'red', 'johnny', 'body', 'bachata', 'sabbath', 'jungle', 'parsons', 'asian', 'joplin', 'dubstyle', 'nortec', 'elevator', 'motswako', 'rhythm', 'skynyrd', 'keyboard', 'enka', 'lynyrd', 'ballet', 'grime', 'singing', 'psytrance', 'swing', 'nashville', 'brown', 'parody', 'hendrix', 'technofolk', 'lullabies', 'davis', 'honky', 'lowercase', 'ghettotech', 'popular', 'jpop', 'glitch', 'louis', 'queen', 'goa', 'beatles', 'minimalism', 'old', 'little', 'florida', 'van', 'taylor', 'talking', 'nirvana', 'fitness', 'musicology', 'pop', 'reactionary', 'novelty', 'turbofolk', 'soul', 'matt', 'garage', 'wolf', 'freak', 'lee', 'noise', 'roses', 'hardstep', 'jazz', 'cowpunk', 'bluegrass', 'cowboy', 'later', 'cities', 'michael', 'speed', 'clapton', 'boy', 'hard', 'fugue', 'avantgarde', 'hiphoprap', 'ray', 'harmony', 'brothers', 'instrument', 'breakstep', 'nerdcore', 'exercise', 'grunge', 'alternative', 'club', 'zydeco', 'dirty', 'orchestral', 'tech', 'violin', 'bitpop', 'countryrap', 'trance', 'ramones', 'dancerock', 'gram', 'berlin', 'workout', 'balearic', 'lute', 'tweedle', 'bop', 'musician', 'mayfield', 'brostep', 'on', 'and', 'ricky', 'poetry', 'crust', 'isolationism', 'laptronica', 'emotional', 'lubbock', 'diana', 'early', 'bo', 'gfunk', 'jackson', 'monophony', 'stones', 'madchester', 'simon', 'americana', 'instrumental', 'tecno', 'american', 'latin', 'background', 'chillwave', 'darkside', 'detroit', 'high', 'petty', 'alternativo', 'idmexperimental', 'psychobilly', 'guitar', 'vaudeville', 'holly', 'sam', 'stories', 'dirt', 'march', 'cantata', 'otis', 'eurodance', 'david', 'ccm', 'robinson', 'bob', 'technopop', 'bruce', 'thx', 'hardbag', 'south', 'progressive', 'chill', 'musique', 'patti', 'city', 'aerosmith', 'sheet', 'tango', 'romantic', 'hiphop'],
'food' : ['eat', 'buy', 'etna', 'heat', 'conductor', 'parfry', 'yogurt', 'florentine', 'irori', 'risotto', 'dwelling', 'chargrill', 'lamb', 'chisel', 'overdo', 'flour', 'dessert', 'bean', 'cooky', 'alimentation', 'glycogen', 'braai', 'chef', 'exsanguination', 'cookshop', 'center', 'bakery', 'livestock', 'cheese', 'cookie', 'baked', 'house', 'frizzle', 'vegetables', 'finch', 'manipulate', 'fudge', 'chief', 'maize', 'actin', 'deglaze', 'security', 'lyonnaise', 'cook', 'dressing', 'hood', 'brewmaster', 'barbeque', 'lunch', 'culinarian', 'leadership', 'poivre', 'clean', 'leaves', 'navigator', 'cookline', 'bake', 'kitchen', 'soup', 'make', 'potatoes', 'grillmaster', 'firepit', 'scallop', 'microwave', 'roasting', 'gastropub', 'guv', 'hibachi', 'vegetable', 'commissariat', 'up', 'fried', 'profession', 'vegetarianism', 'fry', 'junk', 'designer', 'buco', 'sauce', 'wok', 'bacteria', 'fermentation', 'foody', 'baste', 'caterer', 'agriculture', 'ristorante', 'atrium', 'salt', 'storyteller', 'supplies', 'frypan', 'abode', 'detective', 'convenience', 'griddle', 'protein', 'scone', 'haricot', 'gist', 'cookstove', 'frankfurt', 'cheat', 'officer', 'kitchenless', 'ducasse', 'pasta', 'saltiness', 'whip', 'pont', 'decorator', 'cow', 'measure', 'tub', 'diner', 'underdone', 'bleu', 'wood', 'ham', 'patio', 'safety', 'frying', 'cookout', 'barbecuer', 'mise', 'likes', 'carbonado', 'poultry', 'dine', 'dress', 'undercook', 'drink', 'milk', 'spray', 'provender', 'broil', 'goods', 'recoct', 'fake', 'appreciate', 'overboil', 'latex', 'preparation', 'gourmand', 'acid', 'deep', 'hairdresser', 'ingredient', 'get', 'salami', 'couvre', 'food', 'omnivorous', 'halal', 'squire', 'myoglobin', 'chyme', 'dishes', 'nuke', 'nut', 'pudding', 'dairy', 'cereal', 'benjamin', 'nourishment', 'best', 'season', 'winemaker', 'commander', 'pig', 'cupboards', 'do', 'salesman', 'gather', 'waiter', 'veau', 'doublet', 'coffeemaker', 'beef', 'viands', 'connective', 'appliance', 'coddle', 'monastery', 'substance', 'balti', 'shirr', 'roast', 'menu', 'oven', 'heads', 'rumen', 'banchan', 'laundry', 'lieu', 'dishpan', 'animal', 'waitress', 'habitation', 'bbq', 'escoffier', 'steam', 'date', 'medium', 'commissioner', 'extraordinaire', 'gallopin', 'chiefs', 'pressure', 'hors', 'haute', 'duvre', 'peanut', 'count', 'toaster', 'quorn', 'boyardee', 'oil', 'marinade', 'restaurant', 'thompson', 'edible', 'chasseur', 'range', 'ceo', 'steaks', 'stylist', 'omega', 'side', 'growth', 'percolation', 'cattle', 'brochette', 'pantry', 'renowned', 'dawg', 'simmer', 'cookable', 'kill', 'maid', 'charcoal', 'keep', 'bistro', 'skillet', 'plant', 'from', 'book', 'brigade', 'crispen', 'feed', 'sugar', 'chocolatier', 'blanquette', 'foods', 'saucepan', 'egg', 'entree', 'meat', 'coconut', 'decor', 'pork', 'industry', 'tatty', 'gourmet', 'tissue', 'bread', 'babbo', 'turn', 'adjudant', 'cookery', 'comedy', 'raw', 'entre', 'wine', 'chimney', 'doublebreasted', 'mixologist', 'stick', 'hamburger', 'tofu', 'flesh', 'preserve', 'sandwich', 'cake', 'skipper', 'dancer', 'veal', 'cooker', 'cooks', 'elastin', 'cookroom', 'burgers', 'read', 'lobster', 'tournedos', 'sausage', 'mycophile', 'family', 'precook', 'genetic', 'organization', 'breakfast', 'gastronomist', 'deer', 'eatery', 'utensil', 'hospital', 'auguste', 'fridge', 'chairperson', 'cabinets', 'villa', 'fruit', 'well', 'foodstuff', 'doeuvre', 'kitchener', 'stove', 'culture', 'preservation', 'sink', 'palmitic', 'huntergatherer', 'population', 'cetera', 'your', 'chophouse', 'celebrity', 'public', 'hoisin', 'apartment', 'sushi', 'wheat', 'place', 'braise', 'stir', 'artisan', 'basin', 'friend', 'multifunctional', 'dining', 'cognate', 'uncooked', 'poach', 'veganism', 'pizza', 'galley', 'cafeteria', 'victual', 'parch', 'myosin', 'muscle', 'rice', 'teakettle', 'pastry', 'lead', 'entertain', 'bartender', 'saute', 'deli', 'cookmaid', 'apron', 'blanch', 'french', 'pan', 'bronze', 'unbaked', 'open', 'mix', 'auditor', 'prebake', 'eatable', 'nylon', 'zap', 'ringleader', 'stew', 'inwardness', 'centre', 'pith', 'essence', 'hangi', 'yourself', 'smell', 'freezer', 'kernel', 'ph', 'follow', 'butchery', 'produce', 'shrimp', 'germ', 'gratin', 'dishwashing', 'casserole', 'sir', 'heart', 'fat', 'parboil', 'downstairs', 'bone', 'engineering', 'boil', 'rotisserie', 'have', 'overcook', 'gardener', 'volition', 'off', 'vitamin', 'guest', 'brasserie', 'be', 'refrigerator', 'lard', 'cookhouse', 'polony', 'seafood', 'domicile', 'sustenance', 'misrepresent', 'cheesemonger', 'tenderization', 'fries', 'cupboard', 'lemon', 'greasy', 'uncook', 'wangle', 'dishwasher', 'room', 'headman', 'marrow', 'jefe', 'bathroom', 'bit', 'material', 'choreographer', 'guy', 'sausages', 'charcuterie', 'supercook', 'cooking', 'waffle', 'create', 'recipe', 'comedian', 'spoon', 'modify', 'roaster', 'hot', 'consultant', 'nutrient', 'boss', 'au', 'saucy', 'fancy', 'red', 'cooktop', 'fire', 'chocolate', 'gentleman', 'ostrich', 'grillroom', 'amino', 'writer', 'chieftain', 'steak', 'preserver', 'colorist', 'ready', 'epicurean', 'can', 'boneless', 'brown', 'upstairs', 'culinary', 'supervisor', 'manager', 'pigmeat', 'falsify', 'change', 'presenter', 'scampo', 'grill', 'editor', 'director', 'pot', 'white', 'bitter', 'health', 'steakhouse', 'right', 'aliment', 'cholesterol', 'gastronome', 'butter', 'soul', 'broasted', 'osso', 'ruler', 'charge', 'kitchens', 'farmer', 'garage', 'kitchenware', 'shop', 'caf', 'energy', 'good', 'smoke', 'leftover', 'cordon', 'caboose', 'chicken', 'bacon', 'resistance', 'rare', 'burn', 'hard', 'nutriment', 'cacciatora', 'home', 'favorite', 'desserts', 'enchilada', 'scullery', 'comestible', 'solid', 'closet', 'sarge', 'turkey', 'alter', 'iroquois', 'nutrition', 'many', 'ingredients', 'de', 'caramelize', 'interior', 'impress', 'pabulum', 'cuisine', 'foremost', 'stuff', 'on', 'baking', 'concoct', 'leader', 'and', 'juggle', 'wonderful', 'burger', 'sommelier', 'entrepreneur', 'breast', 'proprietor', 'tuna', 'shiso', 'fireplace', 'oxtail', 'slavery', 'castle', 'hunger', 'japan', 'latin', 'barbecue', 'head', 'fish', 'necktie', 'horsemeat', 'meal', 'basement', 'chop', 'core', 'account', 'foodie', 'sunny', 'scriptwriter', 'broadside', 'kitchenette', 'baker', 'hostess', 'devil', 'mammal', 'sonsie', 'prepare', 'seasoned', 'direction', 'sheep', 'chairman', 'nub', 'soft', 'cabinet', 'cookpot', 'hearth', 'vegetarian', 'sum', 'longhouse', 'famed'],
'travel' : ['buy', 'macao', 'pedestrian', 'industries', 'solo', 'centers', 'gest', 'russia', 'finland', 'leicester', 'expedition', 'mauritius', 'trundle', 'dormitory', 'refuge', 'community', 'versus', 'oakwood', 'sightseeing', 'payments', 'tenement', 'norm', 'house', 'aerostat', 'timor', 'ymca', 'fatherland', 'entrepreneurs', 'odyssey', 'location', 'cook', 'su', 'suite', 'thailand', 'buddhist', 'around', 'sortie', 'apartotel', 'traipse', 'swash', 'kitchen', 'recession', 'stray', 'nation', 'steps', 'student', 'derail', 'renaissance', 'cafe', 'publica', 'boutique', 'bunk', 'holidaymakers', 'area', 'timeshare', 'automobile', 'kibworth', 'egypt', 'court', 'up', 'roam', 'recreation', 'continent', 'finance', 'bosniaherzegovina', 'yemen', 'crawl', 'trippers', 'coaching', 'destinations', 'exeter', 'enterprises', 'lucia', 'economies', 'agriculture', 'progression', 'round', 'takeoff', 'abbey', 'flier', 'oceanfront', 'mall', 'africa', 'environment', 'spas', 'abode', 'trips', 'hejira', 'nobility', 'suriname', 'travelers', 'descend', 'bahamas', 'lakeside', 'zoom', 'creep', 'airfoil', 'mauritania', 'teleport', 'fisheries', 'bird', 'west', 'protestantism', 'urban', 'explorer', 'shanghai', 'residence', 'trinidad', 'beautification', 'ballistics', 'clubs', 'safaris', 'chaucer', 'convent', 'industrial', 'flypast', 'latvia', 'christian', 'nonstop', 'downtown', 'music', 'guesthouse', 'asia', 'gentry', 'wing', 'farecard', 'peregrine', 'goods', 'country', 'motor', 'road', 'hyatt', 'jet', 'canteen', 'nightlife', 'jura', 'train', 'sanctuary', 'aviator', 'sericulture', 'world', 'outflank', 'holdall', 'duke', 'sector', 'commuting', 'get', 'raft', 'local', 'airport', 'food', 'tented', 'loughborough', 'diptera', 'itinerate', 'costal', 'displace', 'song', 'intercontinental', 'fall', 'locals', 'switzerland', 'politic', 'markets', 'activities', 'transportation', 'thrust', 'ride', 'pakistan', 'motion', 'staircase', 'kong', 'jetliner', 'motels', 'waterpark', 'visa', 'flophouse', 'promoting', 'venue', 'water', 'wanderlust', 'monastery', 'marinas', 'canterbury', 'india', 'permanent', 'circle', 'maiden', 'resources', 'condominium', 'mainland', 'tertiary', 'calais', 'mount', 'precess', 'barbados', 'ethiopia', 'overcrowded', 'luxury', 'fleabag', 'hermitage', 'comoros', 'makeshift', 'taxicab', 'hospice', 'israel', 'northern', 'booming', 'pearling', 'europe', 'riviera', 'glide', 'wander', 'airline', 'projects', 'athens', 'argentina', 'services', 'wayfare', 'range', 'youth', 'lithuania', 'brazil', 'gibraltar', 'aquaculture', 'flock', 'nominal', 'by', 'growth', 'expand', 'sri', 'rail', 'maldives', 'guinea', 'excursion', 'fiji', 'run', 'roadhouse', 'market', 'wayfarer', 'spa', 'rite', 'xu', 'post', 'book', 'cybertravel', 'forestry', 'air', 'north', 'propulsion', 'united', 'hotel', 'hostel', 'abscond', 'chile', 'residential', 'zimbabwe', 'bulgaria', 'bed', 'imaret', 'beachfront', 'multilingualism', 'province', 'malaysia', 'pandemic', 'france', 'evasion', 'quadrant', 'camping', 'bushwhack', 'hotelier', 'spaceflight', 'england', 'suites', 'ecological', 'hostelry', 'the', 'travelling', 'handicraft', 'emerging', 'journey', 'touring', 'sailplane', 'states', 'aviation', 'national', 'iata', 'hawker', 'helicopter', 'etruria', 'snowshoe', 'squirrel', 'kite', 'seaside', 'biggest', 'kiribati', 'lodging', 'voyager', 'tinker', 'cooperation', 'barbuda', 'hong', 'organization', 'overflight', 'fortravel', 'bioscience', 'new', 'east', 'global', 'naycation', 'aeronautics', 'dynasty', 'chengda', 'aparthotel', 'malaysian', 'agricultural', 'lates', 'beautify', 'lounge', 'state', 'break', 'starwood', 'adorn', 'culture', 'spread', 'casinos', 'iran', 'oxbridge', 'inn', 'your', 'dwell', 'mansion', 'australia', 'rural', 'trajectory', 'circumflex', 'passenger', 'aileron', 'london', 'mastercard', 'mode', 'tripper', 'voyage', 'place', 'insect', 'decorate', 'retrograde', 'resource', 'republic', 'dining', 'stable', 'planning', 'move', 'aeroplane', 'cafeteria', 'creativity', 'shulgi', 'gatehouse', 'spain', 'island', 'lebanon', 'res', 'tt', 'sit', 'five', 'trade', 'housing', 'sightsee', 'entrepreneurship', 'bedsit', 'citrus', 'leave', 'circumnavigate', 'gaseous', 'opportunities', 'return', 'export', 'kyrgyzstan', 'casino', 'venezuela', 'grenada', 'swim', 'fly', 'agro', 'apiculture', 'flu', 'theatre', 'regional', 'someplace', 'cultural', 'passage', 'commerce', 'parlour', 'agri', 'lift', 'bureau', 'manhattan', 'flyover', 'touristry', 'walking', 'playground', 'peregrinate', 'luggage', 'inns', 'commute', 'thanatourism', 'times', 'islam', 'chinese', 'andorra', 'at', 'premises', 'guangdong', 'class', 'backpacking', 'byway', 'roll', 'government', 'choose', 'ventoux', 'step', 'literature', 'attractions', 'honeymooners', 'haven', 'horticulture', 'flights', 'economy', 'prance', 'petrarch', 'sustainable', 'room', 'slovakia', 'viticulture', 'coastal', 'bookings', 'tram', 'hop', 'visitor', 'francesco', 'holiday', 'edifice', 'hamburg', 'hostelling', 'digression', 'destination', 'glider', 'papua', 'autobiography', 'concierge', 'fam', 'ballroom', 'balloon', 'america', 'ensuite', 'homeless', 'carpark', 'tour', 'planes', 'nauru', 'gymnasiums', 'body', 'euromonitor', 'arrivals', 'behavior', 'arts', 'map', 'itinerary', 'back', 'nice', 'overgo', 'boosting', 'drift', 'areas', 'land', 'airliner', 'wayfaring', 'swing', 'formation', 'austria', 'tourist', 'major', 'change', 'junketeer', 'ritz', 'ship', 'flew', 'tobago', 'landed', 'canada', 'health', 'cyprus', 'amenity', 'betravel', 'fledge', 'hotels', 'lanka', 'hostels', 'tourism', 'thruway', 'investments', 'china', 'exports', 'airways', 'conference', 'trekker', 'cursorily', 'jaunt', 'worldwide', 'floriculture', 'ski', 'cities', 'advertising', 'hub', 'ecotourism', 'lodge', 'zealand', 'driving', 'bungalow', 'cuba', 'eco', 'syria', 'home', 'grand', 'coach', 'rocket', 'extended', 'commission', 'businesspeople', 'guidebooks', 'slovenia', 'traveling', 'phuket', 'turkey', 'musher', 'other', 'maritime', 'deforestation', 'largest', 'vacationers', 'corner', 'thriving', 'sailing', 'trance', 'mountains', 'tavern', 'motel', 'souvenir', 'ming', 'stairway', 'biodiversity', 'goethe', 'caravanserai', 'landing', 'transport', 'haiti', 'buoyancy', 'spend', 'runway', 'housed', 'capital', 'palace', 'flying', 'dormitories', 'hospitality', 'castle', 'japan', 'american', 'airplane', 'latin', 'brussels', 'development', 'homeland', 'hajj', 'park', 'commercial', 'lam', 'ages', 'league', 'object', 'service', 'vacation', 'accommodation', 'maisonette', 'stay', 'kilometrage', 'steamer', 'fodder', 'elapse', 'economic', 'pilgrim', 'residences', 'south', 'staycation', 'atmosphere', 'orphanage', 'dorms', 'pub', 'iceland', 'come'],
'videogames' : ['paper', 'word', 'hold', 'community', 'control', 'kimishima', 'internationalization', 'cook', 'digital', 'narrative', 'walmart', 'calculator', 'ugo', 'input', 'use', 'gwen', 'september', 'mariah', 'mobiclip', 'kart', 'hockey', 'live', 'nintendo', 'translation', 'chance', 'black', 'gameboard', 'balance', 'nhl', 'second', 'tradesfolk', 'supply', 'harm', 'multinational', 'gay', 'local', 'metal', 'lebron', 'eminem', 'super', 'tournament', 'blow', 'frame', 'sprite', 'adapter', 'businesswear', 'polo', 'magazine', 'satellaview', 'europe', 'maruyama', 'disney', 'trader', 'overtrade', 'commodore', 'roofball', 'radio', 'transact', 'pork', 'france', 'intellectual', 'raw', 'offer', 'usd', 'cathode', 'enterprise', 'national', 'samoa', 'paris', 'insider', 'pocket', 'new', 'out', 'arakawa', 'culture', 'reexchange', 'fanboy', 'irvine', 'rice', 'policy', 'interface', 'incoterm', 'hunter', 'gamey', 'profanity', 'trip', 'casino', 'tokyo', 'parks', 'perfect', 'mythology', 'minidvd', 'uri', 'bandy', 'commodity', 'konami', 'at', 'noncommercial', 'distribution', 'monopoly', 'store', 'practices', 'dexterity', 'hero', 'tupac', 'amiga', 'simulator', 'takeda', 'educational', 'generic', 'component', 'gamehouse', 'galaxy', 'can', 'duck', 'furriery', 'ntsc', 'michigan', 'devise', 'soundtrack', 'console', 'toca', 'media', 'conker', 'tradesperson', 'interactive', 'solid', 'memory', 'nomic', 'hanafuda', 'ultra', 'code', 'service', 'browserbased', 'touchscreen', 'graphing', 'over', 'mariners', 'cybercommerce', 'resale', 'croft', 'gaming', 'backward', 'macs', 'duty', 'taboo', 'three', 'card', 'slave', 'device', 'lost', 'amazon', 'bill', 'bravia', 'child', 'orton', 'hepburn', 'xl', 'foist', 'golden', 'controller', 'nival', 'soviet', 'virtual', 'rating', 'eb', 'atlus', 'hulu', 'spectator', 'rochester', 'world', 'cologne', 'group', 'rough', 'modem', 'property', 'deadly', 'purchase', 'distraction', 'nikki', 'birmingham', 'modern', 'processor', 'toronto', 'cry', 'badminton', 'smash', 'total', 'philips', 'midgame', 'cheerlead', 'biathlon', 'master', 'guinea', 'dpad', 'certified', 'rolly', 'run', 'jadestone', 'videogame', 'user', 'h', 'character', 'korea', 'quota', 'zero', 'rock', 'puzzler', 'study', 'famicom', 'marketeer', 'tumor', 'bad', 'passtime', 'actioner', 'corporation', 'backgammon', 'localization', 'brasil', 'integrated', 'alcoholic', 'shareholder', 'playtest', 'vienna', 'replay', 'casual', 'contact', 'film', 'fusajiro', 'rule', 'quo', 'tactical', 'religious', 'sleep', 'morality', 'argonaut', 'steven', 'soylent', 'coordination', 'sidescroller', 'miitomo', 'sexual', 'baer', 'color', 'outsport', 'iguana', 'dvr', 'table', 'sega', 'bionicle', 'bit', 'social', 'windows', 'tetris', 'final', 'ted', 'kombat', 'bethesda', 'motorola', 'beatles', 'sixth', 'wireball', 'subbuteo', 'factor', 'enough', 'china', 'web', 'misdeal', 'fallout', 'wild', 'life', 'wiiware', 'bayonetta', 'dena', 'golf', 'sexuality', 'silence', 'disc', 'romanization', 'accelerometer', 'cartel', 'rugger', 'seattle', 'network', 'thomas', 'olympics', 'troak', 'disport', 'development', 'cdrom', 'board', 'kaitos', 'sanity', 'foldinghome', 'madworld', 'huckster', 'pda', 'atl', 'donkey', 'december', 'washington', 'cricket', 'incredible', 'fight', 'football', 'odyssey', 'haha', 'psychosocial', 'corporate', 'scifi', 'equipment', 'x', 'overkill', 'sd', 'designer', 'valve', 'union', 'contract', 'race', 'sportsaholic', 'advocacy', 'sim', 'developer', 'officer', 'roller', 'clay', 'minecraft', 'postdeal', 'otheros', 'stereoscopy', 'street', 'minnesota', 'advergaming', 'space', 'honor', 'vision', 'nikon', 'company', 'twin', 'motion', 'seller', 'wii', 'swap', 'longitudinal', 'square', 'inis', 'playoff', 'gameplaying', 'boycott', 'heroinware', 'greenpeace', 'playability', 'melbourne', 'tradable', 'liquid', 'reality', 'sportling', 'nasa', 'beverage', 'syndication', 'labor', 'pak', 'is', 'north', 'united', 'prequel', 'egg', 'basketry', 'the', 'states', 'jugendgefhrdende', 'helicopter', 'defense', 'hedgehog', 'downloadable', 'tatsumi', 'wall', 'pal', 'eve', 'outdoor', 'rising', 'rubber', 'undealt', 'highdefinition', 'mortal', 'cinematics', 'aggression', 'iron', 'project', 'st', 'bend', 'software', 'everything', 'mobile', 'engineering', 'grey', 'strong', 'truckman', 'wifi', 'manhunt', 'redmond', 'dmc', 'damned', 'golgo', 'oxo', 'facto', 'sportless', 'fun', 'as', 'cap', 'harry', 'major', 'addiction', 'rainmaker', 'baseball', 'ds', 'nintendogs', 'paddle', 'exergaming', 'roguelike', 'squeaker', 'just', 'luxor', 'eidos', 'zealand', 'ray', 'usa', 'home', 'mario', 'ii', 'berlin', 'tube', 'j', 'pillow', 'uav', 'yen', 'kidvid', 'american', 'latin', 'intelligence', 'league', 'arbitrage', 'bundesprfstelle', 'city', 'resell', 'tannery', 'mind', 'center', 'for', 'playing', 'secret', 'daff', 'caledonia', 'job', 'floorball', 'third', 'mini', 'comics', 'hidden', 'game', 'shovelware', 'symbol', 'nineholes', 'zombie', 'cambridge', 'intertraffic', 'retailer', 'massachusetts', 'ring', 'lenny', 'frankfurt', 'cheat', 'trek', 'chamber', 'gameland', 's', 'personal', 'ante', 'sportive', 'imagine', 'kick', 'drake', 'ohio', 'initial', 'morpheme', 'display', 'switzerland', 'executive', 'fatal', 'dodgeball', 'kong', 'autostereoscopy', 'partnership', 'museum', 'pong', 'svr', 'hotseat', 'technology', 'd', 'shopping', 'taxicab', 'association', 'mascot', 'marble', 'duct', 'proprietorship', 'basket', 'york', 'post', 'belly', 'essentials', 'nonsports', 'transactive', 'field', 'term', 'depositary', 'transaction', 'gaisha', 'freedom', 'dark', 'setting', 'player', 'fur', 'multisport', 'livearea', 'day', 'joint', 'strategy', 'knock', 'plan', 'public', 'short', 'gamestress', 'u', 'wogball', 'planning', 'spong', 'shoemaking', 'pc', 'trade', 'spacewar', 'peripheral', 'cpu', 'hilton', 'berkshire', 'skill', 'mega', 'minoru', 'porting', 'indie', 'mod', 'jadoube', 'potter', 'one', 'smartphone', 'education', 'pall', 'puzzle', 'free', 'principle', 'pokmon', 'castlevania', 'girl', 'australians', 'occupation', 'tower', 'dracula', 'psx', 'texas', 'sportsplex', 'sid', 'white', 'dinosaur', 'eye', 'ward', 'television', 'multitap', 'net', 'nba', 'rare', 'brookhaven', 'sportlike', 'propaganda', 'bridge', 'application', 'assistant', 'laboratory', 'entrepreneur', 'plus', 'line', 'miyamoto', 'namco', 'tic', 'computerspielemuseum', 'guitar', 'probability', 'private', 'dealer', 'knight', 'ram'],
'football' : ['bocce', 'bayern', 'paper', 'winchester', 'rivelino', 'coaches', 'beckenbauer', 'cup', 'cameroonian', 'authentically', 'sportsmanship', 'cricket', 'hen', 'beckham', 'college', 'cleats', 'imperial', 'ronaldo', 'stoke', 'striker', 'pea', 'zico', 'shooting', 'robinho', 'afc', 'card', 'weekend', 'lewandowski', 'cheerleading', 'dressing', 'trinity', 'playing', 'fixing', 'coached', 'roman', 'triathlon', 'official', 'royal', 'gold', 'laws', 'puskas', 'cycling', 'clean', 'professional', 'nations', 'fabrica', 'lost', 'madrid', 'equipment', 'handball', 'draw', 'snowboarding', 'hallamshire', 'wales', 'under', 'athletes', 'fifa', 'bball', 'area', 'video', 'intercollegiate', 'court', 'units', 'kopa', 'foot', 'track', 'finals', 'etymology', 'game', 'goalkeeper', 'flip', 'kemari', 'coaching', 'croatian', 'archery', 'lus', 'chu', 'hug', 'boot', 'harrow', 'basten', 'federation', 'honeyball', 'halfback', 'olympic', 'cambridge', 'scotland', 'ballplayer', 'karate', 'warwickshire', 'fox', 'hockey', 'foul', 'live', 'honour', 'matches', 'breitner', 'soviet', 'press', 'aerobic', 'volleyball', 'extra', 'sitter', 'church', 'buffon', 'sister', 'tournaments', 'african', 'organizational', 'bullet', 'roller', 'nhl', 'mob', 'play', 'clubs', 'ivorian', 'civil', 'ancient', 'saintgermain', 'interscholastic', 'usl', 'lancashire', 'lothar', 'elimination', 'doping', 'blackjack', 'competition', 'inch', 'wave', 'babysitters', 'bilbao', 'rusher', 'alfredo', 'indirect', 'street', 'country', 'bale', 'sunday', 'espaa', 'xiii', 'tourn', 'world', 'clsico', 'passing', 'ladies', 'volleyballer', 'joining', 'clausura', 'fa', 'figo', 'running', 'chess', 'winning', 'crosse', 'intercontinental', 'ligue', 'jlio', 'footballers', 'beach', 'english', 'mijatovi', 'dodgeball', 'semipro', 'englishspeaking', 'water', 'real', 'goal', 'sergio', 'played', 'quidditch', 'regulation', 'alfonso', 'super', 'wrestling', 'junior', 'stadium', 'parliament', 'baresi', 'midlands', 'genuine', 'pong', 'gareth', 'kickoff', 'defender', 'sporting', 'square', 'copa', 'slice', 'tournament', 'modric', 'whitecaps', 'veracious', 'roundball', 'rangers', 'technology', 'c', 'swansea', 'badminton', 'association', 'team', 'misconduct', 'northern', 'europe', 'reality', 'sportling', 'soccer', 'serie', 'athletic', 'leagues', 'athens', 'ultimate', 'futsal', 'basketball', 'act', 'blackheath', 'belgrade', 'youth', 'winger', 'division', 'charterhouse', 'female', 'shrewsbury', 'wiffle', 'chukguk', 'nordahl', 'cuju', 'meazza', 'metrication', 'i', 'coast', 'ramos', 'la', 'mls', 'weah', 'language', 'varsity', 'prez', 'bus', 'middle', 'florentino', 'united', 'germany', 'stadiums', 'scottish', 'woodwork', 'france', 'cf', 'han', 'lacrosse', 'pounds', 'treble', 'santiago', 'england', 'field', 'boxtobox', 'curling', 'goalkick', 'midfield', 'roundrobin', 'raymond', 'minute', 'the', 'di', 'nutmeg', 'snchez', 'sevilla', 'states', 'europa', 'boxing', 'national', 'riot', 'indoor', 'agility', 'dribbling', 'hit', 'teams', 'win', 'luka', 'paris', 'truth', 'denmark', 'greece', 'player', 'parent', 'organization', 'pocket', 'match', 'dinamo', 'away', 'out', 'hospital', 'period', 'cristiano', 'footbal', 'dynasty', 'amrica', 'kit', 'rowing', 'softball', 'libertadores', 'tennis', 'touch', 'firsttime', 'day', 'ferenc', 'signal', 'qualification', 'ronaldinho', 'brazilian', 'replay', 'competitions', 'harpastum', 'socrates', 'direct', 'hoops', 'oceania', 'of', 'del', 'place', 'medieval', 'mma', 'rule', 'confederations', 'spanish', 'xavi', 'nk', 'offside', 'teacher', 'fan', 'veritable', 'row', 'captain', 'clinical', 'canoe', 'factual', 'independence', 'spain', 'glasgow', 'semi', 'carlos', 'champion', 'zagreb', 'boys', 'hosts', 'halves', 'greek', 'kaka', 'placekicking', 'bookmaking', 'zinedine', 'rossi', 'ssc', 'preston', 'moore', 'cruyff', 'premier', 'casino', 'neeskens', 'auto', 'swim', 'dive', 'tie', 'ballgame', 'people', 'munich', 'matthaus', 'conmebol', 'chelsea', 'montreal', 'elite', 'great', 'players', 'headgear', 'british', 'women', 'shin', 'authentic', 'kocsis', 'gridiron', 'gymnastics', 'dummy', 'atltico', 'off', 'at', 'irish', 'sheffield', 'jockstrap', 'class', 'all', 'dick', 'muller', 'romario', 'dance', 'table', 'zidane', 'ebenezer', 'suarez', 'pole', 'room', 'in', 'paralympic', 'eton', 'supercopa', 'mcgregor', 'pentathlon', 'stfano', 'sivori', 'iniesta', 'hoof', 'athlete', 'halftime', 'rummenigge', 'vancouver', 'impact', 'two', 'ice', 'system', 'bobsleigh', 'tetherball', 'ofc', 'cracker', 'lineo', 'final', 'balloon', 'jairzinho', 'goals', 'red', 'tour', 'australian', 'z', 'liverpool', 'keegan', 'fourth', 'injury', 'waterpolo', 'free', 'freemasons', 'back', 'asian', 'relegation', 'yashin', 'fullback', 'qualifiers', 'eastern', 'oxford', 'ball', 'formation', 'manager', 'major', 'ioc', 'hugo', 'badge', 'pele', 'fiveaside', 'bundesliga', 'order', 'galatasaray', 'genuineness', 'baseball', 'referee', 'flap', 'netball', 'rey', 'episkyros', 'guard', 'hairdryer', 'canada', 'broomball', 'online', 'tailback', 'fencing', 'nfl', 'amateur', 'sacked', 'manchester', 'subbuteo', 'esports', 'hamm', 'european', 'iffhs', 'authenticity', 'caf', 'footy', 'feminism', 'host', 'dropkick', 'zrich', 'napoli', 'stoichkov', 'nba', 'truthful', 'punting', 'hard', 'single', 'timewasting', 'exhibition', 'sweden', 'midfielder', 'pitch', 'coach', 'championship', 'throwin', 'maldini', 'organisation', 'assistant', 'shootout', 'predrag', 'put', 'golf', 'feint', 'cobb', 'other', 'kak', 'archaeological', 'cardio', 'corner', 'sailing', 'de', 'pigskin', 'winter', 'powerhouse', 'balltohand', 'gianluigi', 'quarterback', 'rugger', 'mia', 'carrier', 'tavern', 'hernandez', 'on', 'truly', 'j', 'and', 'apertura', 'william', 'el', 'baggio', 'weightlifting', 'korfball', 'line', 'championships', 'twolegged', 'rules', 'target', 'olympics', 'punter', 'pusks', 'aston', 'fc', 'scoring', 'japan', 'uppingham', 'latin', 'garrincha', 'calcium', 'american', 'barcelona', 'frisbee', 'organise', 'man', 'hisher', 'v', 'park', 'ages', 'league', 'confederation', 'war', 'a', 'athletics', 'per', 'goalkeepers', 'empire', 'treatment', 'dictionary', 'own', 'taekwondo', 'juventus', 'board', 'games', 'dinamored', 'david', 'tourney', 'futbol', 'brace', 'cw', 'gambling', 'fraud', 'summer', 'uefa', 'actual', 'borussia', 'chip', 'nettie', 'footballs', 'it', 'city', 'sheet', 'roberto', 'eusebio', 'dribble'],
'science' : ['age', 'paper', 'electromagnetism', 'fallacy', 'processing', 'peradeniya', 'systematics', 'teratology', 'innovation', 'stereochemistry', 'ren', 'knowledge', 'design', 'community', 'edwina', 'control', 'copernicus', 'modification', 'species', 'isaac', 'cell', 'exobiology', 'see', 'currie', 'scientifically', 'for', 'linguistics', 'astrogeology', 'pecham', 'alhazen', 'hydrodynamic', 'religion', 'aircraft', 'mathematician', 'verifiability', 'kaiser', 'mechanic', 'our', 'royal', 'laws', 'electromagnetic', 'nonoverlapping', 'yale', 'planck', 'curriculum', 'optics', 'expert', 'teleological', 'horgan', 'fallibilist', 'max', 'equipment', 'renaissance', 'cause', 'practicum', 'mathematics', 'thesis', 'heliocentrism', 'potential', 'biologist', 'area', 'communications', 'separate', 'researcher', 'botany', 'icbm', 'oleochemistry', 'technological', 'demarcation', 'junk', 'technical', 'consciousness', 'petrophysics', 'program', 'interpretations', 'abbasid', 'office', 'teaches', 'falsificationism', 'art', 'karl', 'glycochemistry', 'internet', 'explanation', 'presocratic', 'electrochemistry', 'gross', 'ability', 'fact', 'actuality', 'gethsemane', 'antibiotic', 'grantsmanship', 'institution', 'paleoclimatology', 'awareness', 'alkindi', 'usaibia', 'chemist', 'researchers', 'causation', 'experiment', 'cytochemistry', 'automobiles', 'csic', 'physics', 'primatology', 'phrenology', 'alhaytham', 'press', 'geophysics', 'glaciology', 'biometeorology', 'chris', 'paleontology', 'creative', 'enigmatology', 'embryology', 'measure', 'mooney', 'ancient', 'potentiality', 'industrial', 'catastrophism', 'library', 'journalism', 's', 'physical', 'bivalent', 'molecular', 'cryogenics', 'gottfried', 'des', 'psychophysiology', 'macrophysics', 'theoretician', 'activator', 'country', 'fund', 'aperient', 'multiscience', 'measurements', 'fiction', 'razor', 'world', 'causality', 'paul', 'bionanoscience', 'product', 'recherche', 'dalton', 'femtochemistry', 'christine', 'vision', 'inorganic', 'theoriser', 'ideology', 'hydroscience', 'dogma', 'almagest', 'toxicology', 'geosciences', 'search', 'cosmochemistry', 'phd', 'learned', 'studies', 'lab', 'zymurgy', 'doubt', 'interdisciplinary', 'eleatic', 'mmr', 'purgative', 'thought', 'peckham', 'uniformitarianism', 'motion', 'modern', 'informatics', 'climatology', 'john', 'methodology', 'ufology', 'supersymmetry', 'einstein', 'dei', 'western', 'toledo', 'geochronology', 'elements', 'chemo', 'cryptology', 'graduate', 'mass', 'doctorate', 'serology', 'geometry', 'olympiads', 'fallibilism', 'ethics', 'battery', 'sociobiology', 'exact', 'proscience', 'keith', 'byzantine', 'criminalistics', 'alchemical', 'technology', 'psychology', 'mechanistic', 'superscience', 'neuroscience', 'c', 'view', 'ludwig', 'descartes', 'magazine', 'misconduct', 'error', 'europe', 'wittgenstein', 'confirmation', 'critique', 'creationism', 'agronomy', 'magnetochemistry', 'ic', 'act', 'k', 'polytechnic', 'genomics', 'priori', 'bio', 'euclid', 'hogwarts', 'immunochemistry', 'growth', 'britain', 'zoochemistry', 'noncritical', 'meteoritics', 'studied', 'xenobiology', 'degree', 'affirming', 'physically', 'physicist', 'kinetics', 'microbiology', 'chemically', 'satellite', 'biotechnology', 'era', 'oceanography', 'book', 'gourd', 'communication', 'warring', 'chemistry', 'pure', 'analytical', 'realism', 'thanatology', 'language', 'geocentric', 'ip', 'neurochemistry', 'bioacoustics', 'middle', 'united', 'csiro', 'developed', 'university', 'parasitology', 'review', 'acadmie', 'aristotle', 'intersubjective', 'parmenides', 'reversible', 'empirical', 'foundation', 'research', 'biomedicine', 'field', 'study', 'cryptanalytics', 'aristotelian', 'nonscience', 'studying', 'kinesiology', 'the', 'laxative', 'sciencelike', 'metaphysics', 'darwin', 'states', 'scientifique', 'axiom', 'science', 'stroud', 'philosopher', 'national', 'agrobiology', 'deductive', 'truth', 'particle', 'galileo', 'astrobiology', 'scientism', 'naturalism', 'physiology', 'bioscience', 'east', 'funding', 'classical', 'instrumentalism', 'period', 'late', 'aeronautics', 'bioengineering', 'integrated', 'syriac', 'pseudoscience', 'cargo', 'cult', 'category', 'chemical', 'apply', 'state', 'robotics', 'strategics', 'literary', 'radiochemistry', 'theorizer', 'stanovich', 'population', 'human', 'to', 'analysis', 'socrates', 'public', 'johannes', 'paleobiology', 'charles', 'arithmetic', 'palynology', 'agrology', 'gnomes', 'templatescience', 'biologically', 'wilson', 'logy', 'theory', 'ziman', 'advancement', 'architectonics', 'feynman', 'zoology', 'spheres', 'policy', 'concept', 'arms', 'hypotheses', 'biochemist', 'law', 'herschel', 'meteorology', 'isidore', 'forschungsgemeinschaft', 'authoritarian', 'polyvalent', 'greek', 'reproducible', 'anarchism', 'nature', 'microscopy', 'croquet', 'analytic', 'magic', 'developmental', 'civilization', 'method', 'number', 'venkateswara', 'centre', 'antiscience', 'modeling', 'peer', 'seismology', 'skill', 'vie', 'mythology', 'textbook', 'palaeontology', 'glycoscience', 'psychological', 'gerontology', 'cage', 'imre', 'medicament', 'geology', 'aspects', 'colloid', 'falsifiable', 'occam', 'consequent', 'epistemological', 'reporter', 'naturalist', 'institutes', 'atoms', 'engineering', 'magisteria', 'electron', 'aerobiology', 'quantum', 'bachelor', 'rod', 'institute', 'calculus', 'biologic', 'caliphate', 'neurophysics', 'literature', 'peirce', 'phenomena', 'phenomenon', 'allomerism', 'differential', 'medicine', 'wisdom', 'constructive', 'mssbauer', 'hundred', 'experimental', 'harvard', 'ichthyology', 'evolutionary', 'methodological', 'room', 'imply', 'fusion', 'nose', 'organon', 'posteriori', 'economics', 'newtonian', 'biomedical', 'radioactivity', 'sociolinguistics', 'phusis', 'lincei', 'disease', 'spallation', 'roehampton', 'not', 'facts', 'final', 'learning', 'empiricism', 'educational', 'smartphone', 'thermodynamics', 'works', 'atomic', 'translators', 'predictions', 'education', 'rationalism', 'histochemistry', 'inoculation', 'behavior', 'rescue', 'crystallography', 'mathematical', 'warnock', 'fringe', 'statistical', 'hypothesis', 'histology', 'psycholinguistics', 'experiments', 'kingdom', 'mcscience', 'selection', 'transactions', 'progress', 'precalculus', 'museology', 'correlation', 'council', 'authority', 'vaccine', 'metallurgy', 'universities', 'faculty', 'sci', 'earth', 'virtuosity', 'scienticide', 'media', 'lysenkoism', 'stem', 'subject', 'topic', 'accademia', 'festival', 'biophysics', 'reversibly', 'feyerabend', 'certainty', 'genetics', 'energy', 'mechanics', 'archeology', 'bacon', 'focuses', 'zoologist', 'printing', 'anticatalyst', 'model', 'l', 'hard', 'single', 'concepts', 'radiobiology', 'problem', 'rocket', 'comparative', 'medication', 'antigen', 'teaching', 'nutrition', 'abi', 'de', 'popper', 'cytology', 'origin', 'witelo', 'cryobiology', 'schools', 'scientist', 'perspective', 'thammasat', 'undergraduate', 'unreactive', 'statistics', 'on', 'metamathematics', 'pharmacognosy', 'and', 'scienceless', 'poetry', 'scientific', 'cognitive', 'antiquity', 'international', 'rules', 'capital', 'biomathematics', 'imprs', 'ptolemy', 'trial', 'citizen', 'focus', 'formula', 'american', 'macrochemistry', 'information', 'academic', 'nanotechnology', 'does', 'ages', 'biomimetics', 'history', 'princeton', 'a', 'empire', 'fundamental', 'probability', 'causes', 'organic', 'focusing', 'trigonometry', 'rocketry', 'four', 'astronomy', 'theorem', 'xray', 'society', 'sciences', 'academy', 'ergonomics', 'effect', 'william', 'newscientist', 'sanders'],
'anime' : ['neon', 'rumbling', 'laserdisc', 'yori', 'eureka', 'paprika', 'light', 'no', 'supernatural', 'soundtracks', 'high', 'erotica', 'silent', 'satirical', 'bleach', 'mainstream', 'outlaw', 'amaterasu', 'lelouch', 'viz', 'noir', 'nicht', 'movie', 'time', 'rozen', 'webcomic', 'magi', 'club', 'adaptations', 'moribito', 'oneshot', 'simulcast', 'dragon', 'tokyo', 'kagura', 'spirited', 'mightiest', 'haruhi', 'gto', 'swim', 'spoof', 'subtitled', 'scrapped', 'th', 'novel', 'century', 'gemeinschaft', 'swordsman', 'ayn', 'rosario', 'moons', 'myhime', 'complex', 'doujinshi', 'weekly', 'suit', 'ellipsis', 'boy', 'adventure', 'valley', 'minato', 'manga', 'ef', 'ghibli', 'wars', 'are', 'to', 'flower', 'evangelion', 'die', 'cosplay', 'who', 'quill', 'shippden', 'ninja', 'mobile', 'male', 'award', 'seiner', 'gum', 'shnen', 'seven', 'xmas', 'memories', 'ball', 'dgrayman', 'nickelodeon', 'spice', 'genre', 'auf', 'ohne', 'animatrix', 'perfect', 'koroni', 'moon', 'subgenre', 'nd', 'shell', 'east', 'panic', 'hiruzen', 'orientalism', 'diary', 'hulu', 'knight', 'metal', 'bara', 'there', 'cry', 'copal', 'spirit', 'iruka', 'jiraiya', 'inuyasha', 'monster', 'rurouni', 'seed', 'godzilla', 'reservoir', 'bebop', 'and', 'aoshi', 'sie', 'art', 'renmei', 'mongolian', 'otaku', 'rain', 'vii', 'jetix', 'our', 'aired', 'sasuke', 'vom', 'kai', 'school', 'grave', 'tezuka', 'after', 'kenshin', 'sky', 'echt', 'kon', 'fatestay', 'air', 'oder', 'hearts', 'monte', 'austen', 'girl', 'hacksign', 'porco', 'cristo', 'dicken', 'serialized', 'kanji', 'wind', 'bamboo', 'sailor', 'hatte', 'nodame', 'darker', 'love', 'cel', 'anthology', 'gt', 'here', 'psp', 'katakana', 'twin', 'wie', 'at', 'movies', 'through', 'akira', 'furigana', 'potter', 'final', 'semester', 'united', 'raid', 'usa', 'now', 'grapher', 'ziel', 'kaze', 'wer', 'characters', 'today', 'on', 'episode', 'sein', 'maiden', 'tankbon', 'talkie', 'rosso', 'his', 'barrage', 'television', 'x', 'they', 'alle', 'magica', 'index', 'tsukihime', 'berserk', 'godfathers', 'steinsgate', 'video', 'tsubasa', 'debuted', 'titan', 'von', 'chobits', 'sequel', 'uchiha', 'full', 'animax', 'gurren', 'onepunch', 'ni', 'ah', 'anime', 'lagoon', 'oav', 'noburo', 'serials', 'shuffle', 'rumble', 'ein', 'place', 'theme', 'shonen', 'joost', 'next', 'tail', 'elfen', 'wolf', 'new', 'goddess', 'paranoia', 'satire', 'gainax', 'melancholy', 'trust', 'orochimaru', 'alone', 'mushishi', 'clover', 'cyberpunk', 'beats', 'advance', 'flcl', 'lagann', 'ghost', 'castle', 'sinojapanese', 'squad', 'gantz', 'studio', 'beat', 'genshiken', 'gankutsuou', 'strawberry', 'last', 'bloodlust', 'ninjutsu', 'target', 'juliet', 'zanzibar', 'cantabile', 'future', 'yu', 'online', 'chronicle', 'durarara', 'basket', 'afternoon', 'ytv', 'gunslinger', 'experiments', 'azumanga', 'namikaze', 'actress', 'conan', 'ova', 'naku', 'geass', 'immer', 'ii', 'karin', 'productions', 'gungrave', 'ghoul', 'hayao', 'then', 'days', 'tsunade', 'kingdoms', 'special', 'black', 'comixart', 'princess', 'story', 'hentai', 'snow', 'fireflies', 'vhs', 'jojo', 'alchemist', 'claymore', 'gesellschaft', 'land', 'witch', 'note', 'tale', 'zero', 'superhero', 'eden', 'kimi', 'gundam', 'pokemon', 'genesis', 'stand', 'nintendo', 'xxxholic', 'circumstances', 'sequels', 'goraku', 'lunar', 'brotherhood', 'millennium', 'konami', 'baccano', 'sakura', 'sketch', 'itachi', 'dnangel', 'hina', 'animated', 'aniplex', 'harry', 'star', 'bizarre', 'me', 'onizuka', 'dvd', 'mythology', 'looking', 'nach', 'nagato', 'a', 'serial', 'toei', 'or', 'miyazaki', 'tokusatsu', 'betrayal', 'innocence', 'returns', 'fruits', 'scroll', 'attack', 'whisper', 'parody', 'starz', 'language', 'boys', 'thriller', 'frau', 'promised', 'howl', 'the', 'prequel', 'romeo', 'moving', 'clannad', 'certain', 'fairy', 'not', 'bild', 'ragnarok', 'cowboy', 'yakuza', 'crusade', 'zeit', 'confucianism', 'einen', 'rod', 'agent', 'shana', 'hatake', 'away', 'toradora', 'ovas', 'dramas', 'xd', 'sarutobi', 'end', 'twelve', 'nausica', 'shueisha', 'parodies', 'leben', 'und', 'dubbing', 'ouran', 'game', 'reflection', 'files', 'nerd', 'fullmetal', 'kiki', 'yamato', 'fantasy', 'initial', 'twins', 'shojo', 'japanese', 'honey', 'daioh', 'can', 'delivery', 'liveaction', 'rebirth', 'spinoff', 'featured', 'chop', 'theatrical', 'soundtrack', 'blood', 'cardcaptor', 'josei', 'sword', 'schon', 'clash', 'my', 'mecha', 'halfmoon', 'nana', 'excel', 'kakashi', 'death', 'gareizero', 'of', 'cat', 'zelda', 'media', 'meer', 'guardian', 'ai', 'premiered', 'stigma', 'you', 'dead', 'champloo', 'speed', 'we', 'legend', 'saga', 'detective', 'bushido', 'hellsing', 'comic', 'when', 'disappearance', 'gear', 'fandom', 'japan', 'shakugan', 'disciple', 'cartoon', 'young', 'deutschland', 'lucky', 'read', 'sind', 'service', 'englisch', 'umino', 'great', 'butler', 'comics', 'chrono', 'gig', 'lied', 'trigun', 'audience', 'second', 'samurai', 'blue', 'disney', 'escaflowne', 'style', 'tobi', 'summer', 'trinity', 'original', 'hakusho', 'nhk', 'film', 'angel', 'kana', 'shamballa', 'robot', 'naruto', 'piece', 'fiction', 'series', 'comedy', 'early', 'kanon', 'adaption', 'eve', 'states', 'welcome', 'that', 'saw', 'scryed', 'r', 'soul', 'familiar', 'planetes', 'hunter', 'het', 'children', 'eine', 'exorcist', 'premiere', 'from', 'man', 'ihr', 'conqueror', 'yaoi', 'in', 'host', 'jump', 'midori', 'appleseed', 'titled', 'vision', 'skip', 'per', 'toonami', 'suzumiya', 'adult', 'rahxephon', 'blade', 'wing', 'world', 'day', 'heart', 'ergo', 'again', 'basilisk', 'avatar', 'leapt', 'golden', 'kurenai', 'oreimo', 'fumoffu', 'another', 'journey', 'kino', 'masashi', 'sensei', 'centimeters', 'anohana', 'totoro', 'miniseries', 'one', 'count', 'ich', 'steampunk', 'eater', 'shinobi', 'kishimoto', 'gaara', 'than', 'sich', 'teil', 'gaiden', 'dresden', 'generations', 'network', 'yuri', 'neighbor', 'bakemonogatari', 'films', 'distant', 'lain', 'vampire', 'z', 'proxy', 'osamu', 'haibane', 'comingofage', 'kaleido', 'vocabulary', 'scanlation']
}

$("#form").submit(function(event) {
    var channelId = $("#canal").val();
    api_key = $("#llave").val();
    llamada1(channelId, api_key).then(llamada2).then(llamada3)
    event.preventDefault()
})

$("#boton_analizar").click(function(event) {
    analizar()
    event.preventDefault()
})

$("#boton_mostrar_res").click(function(event) {
    mostrar_resultados()
    event.preventDefault()
})