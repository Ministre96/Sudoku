// DECLARATION DE VARIABLE
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var name;
var pwd;
var idGrille;
var idPlayer;
var swapNPM = true;
hide("divPM");
//DECLARATION POUR LE CANVAS
var taille = 450;
canvas.width = taille;
canvas.height = taille;
//DECLARATION POUR LES ENTREE CLAVIER
document.onkeydown = checkKey;
//DECLARATION POUR LES REGLES SPECIALES
var knight = 0;
var king = 0;
var noSeq = 0;
//DECALARATION TAB MEMOIRE POUR UNDO/REDO
var tabMemoryUndo = new Array();
tabMemoryUndo = [null, null, null, null, null];
var tabMemoryRedo = new Array();
tabMemoryRedo = [null, null, null, null, null];
var colorMemory;
var sudoku = "";
var tempCoordx = null;
var tempCoordy = null;
//DECLARATION DIFFERENT TABLEAU 
var tabBloc = new Array();
var tabCol = new Array();
var tabLine = new Array();
var tabExcluded = new Array();

canvas.onclick = showCoords;
var tabHint = new Array(9);
for (var i = 0; i < 9; i++) {
    tabHint[i] = new Array(9);
    for (var j = 0; j < 9; j++) {
        tabHint[i][j] = new Array(9);
    }
}
var tabHinted = new Array(9);
for (var j = 0; j < 9; j++) {
    tabHinted = new Array(9);
}

//INITIALISATION
Init();
function Init(){
    document.getElementById("sudoku").style.display = "none";
    document.getElementById("rejouer").style.display = "none";
}
function initCanvas(){
    drawSudoku();
    createHint();
    createPM();
    setBaseValue();
    createTabLine();
    updateTabBloc();
    createTabCol();
    updateHint();
}

//LOGIN
function login(){
    name = document.getElementById("name").value;
    pwd = document.getElementById("password").value;
    if (name !=""){
        var xhr = new XMLHttpRequest();
        var param = "name="+ encodeURIComponent(name);
        param =param+"&password="+encodeURIComponent(pwd);
        xhr.onreadystatechange=function(){
            if (this.readyState === 4 && this.status === 200) {
                if (xhr.responseText === "0"){ // compte inexistant faut le créer
                    register(name, pwd);
                } else { // tout est ok, on récup l'id et on recherche les grilles non faites
                    idPlayer = xhr.responseText;
                    searchGrille(xhr.responseText);
                }
            }
        }
        xhr.open("POST", "Login.php", true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(param);
    } else {
        alert("Veuillez remplir le champ \"Nom\"")
    }
}

//REGISTER
function register (name, pwd){
    name = document.getElementById("name").value;
    pwd = document.getElementById("password").value;
    var xhr = new XMLHttpRequest();
    var param = "name="+ encodeURIComponent(name);
    param =param+"&password="+encodeURIComponent(pwd);
    xhr.onreadystatechange=function(){
        if (this.readyState === 4 && this.status === 200) {
            if (xhr.responseText === "0"){
                alert("Une erreur est survenue veuillez réessayer");
            } else {
                idPlayer = xhr.responseText;
                document.getElementById("sudoku").style.display = "block";
                document.getElementById("connexion").style.display = "none";
                var nbrRand = Math.floor(Math.random() * 10) + 1;
                getGrilles(nbrRand);
            }
        }
    }
    xhr.open("POST", "Register.php", true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(param);
}

// FONCTION DE RECHERCHE DE GRILLES NON FAITES PAR L'USER
function searchGrille(id){
    var xhr = new XMLHttpRequest();
    var param = "id="+ encodeURIComponent(id);
    xhr.onreadystatechange=function(){
        if (this.readyState === 4 && this.status === 200) {
            if (xhr.responseText != "0"){
                var nbr = xhr.responseText;
                getGrilles(nbr);
                document.getElementById("sudoku").style.display = "block";
                document.getElementById("connexion").style.display = "none";
            }
        }
    }
    xhr.open("POST", "GetGrillesFromPlayedGrid.php", true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(param);
}

//RECUPERATION GRILLE
function getGrilles(nbr){
    var json;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "GetGrilles.php", true);
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            json = this.responseText;
            // On récupère une grille parmis toutes les grilles
            getOneGrille(json, nbr);
        }
    }
    xhr.send();
}
function getOneGrille(json, nbr){
    const value = JSON.parse(json);
    for (i=1 ; i<=Object.keys(value).length ; i++){
        if (value[i]["gid"] == nbr) {
            sudoku = value[i]["grille"];
            knight = value[i]["knight"];
            king = value[i]["king"];
            noSeq = value[i]["noseq"];
            idGrille = nbr;
            initCanvas();
        }
    }
}

// FONCTION DE FIN DE PARTIE
function finish(){
    alert ("Vous avez réussi !!!");

    var xhr = new XMLHttpRequest();
    var param = "idGrille="+ encodeURIComponent(idGrille);
    param =param+"&idPlayer="+encodeURIComponent(idPlayer);
    xhr.onreadystatechange=function(){
        if (this.readyState === 4 && this.status === 200) {
            if (xhr.responseText === "0"){
                document.getElementById("sudoku").style.display = "none";
                document.getElementById("rejouer").style.display = "block";
            } else {
                alert ("Une erreur est survenue, la grille n'as pas été enregistrée.")
            }
        }
    }
    xhr.open("POST", "FinishGrid.php", true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send(param);
}

// FONCTION REJOUER
function rejouer(){
    searchGrille(idPlayer);
}

// FONCTION RETOUR A LA PAGE D'ACCUEIL
function retour(){
    document.getElementById("rejouer").style.display = "none";
    document.getElementById("connexion").style.display = "block";
}


//VERIFICATION DES REGLES DE LA GRILLE
function verifRules(){
    if(sudoku.charAt(83)==1){
        knight = 1;
    }else{
        knight = 0;
    }
    if(sudoku.charAt(86)==1){
        king = 1;
    }else{
        king = 0;
    }
    if(sudoku.charAt(89)==1){
        noSeq = 1;
    }else{
        noSeq = 0;
    }
    showRules();
}

// AFFICHER LA REGLE DE LA GRILLE
function showRules(){
    if(knight == 1){
        document.getElementById("knight").innerHTML = "Règle du Chevalier";  
    }else{
        document.getElementById("knight").style.display = "none";
    }
    if(king == 1){
        document.getElementById("king").innerHTML = "Règle du Roi";  
    }else{
        document.getElementById("king").style.display = "none";
    }
    if(noSeq == 1){
        document.getElementById("noSeq").innerHTML = "Règle du Non Séquentiel";  
    }else{
        document.getElementById("noSeq").style.display = "none";
    }
    if((knight+king+noSeq) == 0 ){
        document.getElementById("noRule").innerHTML = "Aucune règle particulière"
    }else{
        document.getElementById("noRule").style.display = "none";
    }
}
//DESSINER LA GRILLE DE SUDOKU AVEC LE CANVAS
function drawSudoku(){
    for (i = 0; i < 10; i++) {
        ctx.lineWidth = 1.0;
        if (i % 3 == 0) {
        ctx.lineWidth = 2.0;
    }
    ctx.beginPath();
    ctx.moveTo((i * taille / 9), 0)
    ctx.lineTo((i * taille / 9), taille);
    ctx.stroke();
    }
    for (i = 0; i < 10; i++) {
        ctx.lineWidth = 1.0;
        if (i % 3 == 0) {
            ctx.lineWidth = 2.0;
        }
        ctx.beginPath();
        ctx.moveTo(0, (i * taille / 9))
        ctx.lineTo(taille, (i * taille / 9));
        ctx.stroke();
    }
}

// CHANGE LA COULEUR DE LA CASE
function setColor(memory){
    if(tempCoordx > 0 || tempCoordy >0){
    var color = document.getElementById("chooseColor").value;
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.lineWidth =1.0;
    if(memory != null){
        ctx.fillStyle = 'rgb('+memory.substr(0,3)+','+memory.substr(3,3)+','+memory.substr(6,3)+')';
        ctx.clearRect((tempCoordx *50), (tempCoordy *50),50, 50);
        ctx.fillRect((tempCoordx *50), (tempCoordy *50),50, 50);
    }else{
        addMemoryUndo("b", colorMemory);
        ctx.fillRect((tempCoordx *50), (tempCoordy *50),50, 50);
    }
    
    tempCoordx = -1;
    tempCoordy =-1;
}
    

}

//AJOUT DES VALEURS DE BASE DANS LA GRILLE
function setBaseValue(){
    var element = document.getElementById("sudoku");
    var cpt = 0;
    verifRules();
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++){
            var tag = document.createElement("div");
            var c = "c";
            var c = c.concat(j);
            var caracter = c.concat(i);
            tag.setAttribute("id", caracter);
            tag.classList.add(caracter);
            element.appendChild(tag);
            tag.style.fontSize = 30 + 'px';
            tag.style.position = "absolute";
            tag.style.left = 28+(taille/9*j) + 'px';
            tag.style.top = 18+(taille/9*i) + 'px';
            if(sudoku.charAt(cpt)== "."){
                document.getElementById(caracter).innerHTML = " ";
            } else {
                document.getElementById(caracter).innerHTML = sudoku.charAt(cpt);
            }
            cpt++;
        }
    }
}

//FONCTION DE RECUPERATION DES COORDONNEE + SELCTION DE LA CASE
function showCoords(event) {
    var x = event.pageX;
    var y = event.pageY;
    x =Number.parseInt(((x-10)/50));
    y =Number.parseInt(((y-10)/50));
    if(x<taille && y<taille){
        if((tabExcluded.find(checkExcluded)) == null){
            drawSelectCase(x, y);
        }
    }
    // VERIFIE LES VALEURS DE BASE DE LA GRILLE
    function checkExcluded(excluded){
        return excluded == x.toString().concat(y);
    }
}
//GESTION INPUT CLAVIER
function checkKey(e){
    if(tempCoordx != null){
        var x, y;
        x = tempCoordx;
        y = tempCoordy;
        e = e || window.event;
        if(e.keyCode == '8' || e.keyCode == '46'){  
            clearSelectedCase();
        }else if(e.keyCode == '37'){
            x--;
            if(x>-1 && (tabExcluded.find(checkExcluded)) == null){
                
                drawSelectCase(x, y);
            }
        }else if(e.keyCode == '38'){
            y--;
            if(y>-1 && (tabExcluded.find(checkExcluded)) == null){
                
                drawSelectCase(x, y);
            }
        }else if(e.keyCode == '39'){
            x++;
            if(x<9 && (tabExcluded.find(checkExcluded)) == null){
               
                drawSelectCase(x, y);
            }
        }else if(e.keyCode == '40'){
            y++;
            if(y<9 && (tabExcluded.find(checkExcluded)) == null){
                
                drawSelectCase(x, y);
            }
        }else if(e.keyCode == '49'|| e.keyCode == '97'){
           setNumber(1,true);
        }else if(e.keyCode == '50'|| e.keyCode == '98' ){
            setNumber(2,true);
         }else if(e.keyCode == '51'|| e.keyCode == '99'){
            setNumber(3,true);
         }else if(e.keyCode == '52'|| e.keyCode == '100'){
            setNumber(4,true);
         }else if(e.keyCode == '53'|| e.keyCode == '101'){
            setNumber(5,true);
         }else if(e.keyCode == '54'|| e.keyCode == '102'){
            setNumber(6,true);
         }else if(e.keyCode == '55'|| e.keyCode == '103'){
            setNumber(7,true);
         }else if(e.keyCode == '56'|| e.keyCode == '104'){
            setNumber(8,true);
         }else if(e.keyCode == '57'|| e.keyCode == '105'){
            setNumber(9,true);
         }
        function checkExcluded(excluded){
            return excluded == x.toString().concat(y);
        }
    }
    
}

// COLORIE LA CASE SELECTIONNEE + RECUPERATION COORDONEE
function drawSelectCase(x, y){
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = "#7FD3EF";
    ctx.lineWidth =1.0;
    ctx.fillRect((x *50), (y *50),50, 50);
    ctx.strokeRect((x *50), (y *50),50, 50);
    ctx.strokeStyle = "black";
    ctx.clearRect((tempCoordx *50), (tempCoordy *50),50, 50);
    ctx.strokeRect((tempCoordx *50), (tempCoordy *50),50, 50);
    tempCoordx = x;
    tempCoordy =y;
}

//AJOUT D'UN NOMBRE DANS LA GRILLE
function setNumber(num, memory){
    if (memory == true) {
        addMemoryUndo("a", tabLine[tempCoordx+tempCoordy*9]);
    }else{
    }
    updateTab(num);
    showUpdate(num);
    updateHint();
    hideHint();
    
}
//EFFACER LES VALEURS D'UNE CASE DE LA GRILLE
function clearSelectedCase(){
    setNumber(".");
    for (var i = 0; i < 9; i++) {
        clearPM(i);
        
    }
}

//AFFICHE LE NOMBRE + VERIFICATION DES REGLES + MISE EN COULEUR (VERT OU ROUGE)
function showUpdate(num){
    var nbCase = "c";
    nbCase = nbCase.concat(tempCoordx);
    nbCase = nbCase.concat(tempCoordy);
    if(num=="."){
        num = " "
    }
    document.getElementById(nbCase).innerHTML = num;
    if(verifValue() == (3+king+knight+noSeq)){
    document.getElementById(nbCase).style.color="green";
    }else{
        document.getElementById(nbCase).style.color="red";
    }
}

//FONCTION DE CREATION ET DE MAJ DES DIFFERENT TABLEAU (Lignes, colonnes et block)
function createTabLine(){
    tabExcluded.length = 0;
    var cpt = 0;
    var temp;
    for (var i = 0; i < 81; i++) {  
        tabLine[i]= sudoku.charAt(i);
        //TABLEAU STOCKANT LES CASES A BLOQUER POUR LE SELECTED
        if(sudoku.charAt(i)!= "."){
            temp = (i%9);
            tabExcluded[cpt] = temp.toString().concat(((i-(i%9))/9));
            cpt++;
        }
    }
}

// CREATION DE LA COLONNE
// La création de la ligne est créé automatiquement
// La création du block est géré dans l'update
function createTabCol(){
    var cpt = null;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            tabCol[cpt]= tabLine[i+j*9];
            cpt++;
        }
        
    }
}
function updateTab(num){
    updateTabLine(num);
    updateTabCol(num);
    updateTabBloc();
}
function updateTabLine(num){
    tabLine[tempCoordx+tempCoordy*9] = num;
}
function updateTabCol(num){
    tabCol[tempCoordx*9+tempCoordy]=num;
}
function updateTabBloc(){
    var cpt =0;
    for (var l = 0; l < 3; l++) {
        for (var k = 0; k < 3; k++) {
            for (var j = 0; j < 3; j++) {
                for (var i = 0; i < 3; i++) {
                    tabBloc[cpt] = tabLine[i+j*9+k*3+l*27];
                    cpt++;
                }
            }
        }   
    }
}
//FONCTIONS DE VERIFICATION GENERALE
function verifValue(){
    var test = verifLine()+ verifCol()+ verifBloc();
    if(knight == 1){
        test = test + verifKnight();
    }
    if(king == 1){
        test = test + verifKing();
    }
    if(noSeq == 1){
        test = test + verifNoSeq();
    }
    return test;
}
// FUNCTION DE VERIFICATION PAR LIGNE, COLONNE OU BLOCK
function verifLine(){
    var num = 0;
    return verif(num);
}

function verifCol(){
    var num = 1;
    return verif(num);
}

function verifBloc(){
    var num = 2;
    return verif(num);
}

// FUNCTION DE VERIFICATION APPELEE PAR LES LIGNES, COLONNES ET BLOCKS
function verif(num){
    var tabTemp = new Array();
    var startValue;
    var value;
    var verify = 0;

    if (num == 0) { // LIGNES
        value = tempCoordx+tempCoordy*9;
        startValue = value-value%9;
        tabTemp = tabLine;
    }else if(num ==1){  // COLONNE
        value = tempCoordx*9+tempCoordy;
        startValue = value-value%9;
        tabTemp = tabCol;
    }else if(num == 2){ // BLOCKS
        value = (27*(Math.floor(tempCoordy/3))) + (9*(Math.floor(tempCoordx/3))) + ((tempCoordy%3)*3);
        if(tempCoordx%3 != 0){
            value = value + tempCoordx%3;
        }
       startValue = value - value%9;
       tabTemp = tabBloc;
    }
    for (var i = 0; i < 9; i++) {
        if (tabTemp[startValue+i]==tabTemp[value]) {
            verify++;
        }
     }
     if (verify == 1) {
         return 1;
     }
     return 0;           
}

// VERIFICATION DES REGLES DU ROI
function verifKing(){
    var value = tempCoordx+tempCoordy*9;
    var verify = 0;
    var i=0;
    var j=0;
    var cpti = 0;
    var cptj = 0;
    if (tempCoordy < 1) {
        i++;
    }else if(tempCoordy > 7){
        cpti--;
    }
    if(tempCoordx > 7 ){
        cptj--;
    }
    for (i; i < (3+cpti); i++) {
        j=0;
        if(tempCoordx < 1){
            j++;
        }
        for (j; j < (3+cptj); j++) {
            if(tabLine[value] == (tabLine[value-10+(9*i)+j])){
                verify++;
            }
        }
    }
    if (verify == 1) {
        return 1;
    }
    return 0;
}

// VERIFICATION DE LA REGLE DU CHEVALIER
function verifKnight(){
    var verify = 0;
    var value = tempCoordx+tempCoordy*9;
    if (tempCoordx > 1 && tempCoordy > 0) {
        verify = verify + equalsKnight(tabLine[value], tabLine[value-19]);
    }
    if (tempCoordx>1 && tempCoordy<8) {
       verify = verify + equalsKnight(tabLine[value], tabLine[value-17]);
    }
    if (tempCoordx > 0 && tempCoordy>1) {
        verify = verify + equalsKnight(tabLine[value], tabLine[value-11]);
    }
    if (tempCoordx > 0 && tempCoordy<7) {
        verify = verify + equalsKnight(tabLine[value], tabLine[value-7]);
    }
    if(tempCoordx <8 && tempCoordy>1){
        verify = verify + equalsKnight(tabLine[value], tabLine[value+7]);
    }
    if (tempCoordx<8 && tempCoordy<7 ) {
        verify = verify + equalsKnight(tabLine[value], tabLine[value+11]);
    }
    if(tempCoordx<7 && tempCoordy>0){
        verify = verify + equalsKnight(tabLine[value], tabLine[value+17]);
    }
    if(tempCoordx<7 && tempCoordy<8){
        verify = verify + equalsKnight(tabLine[value], tabLine[value+19]);
    }
    if (verify == 0) {
        return 1;
    }
    return 0;
}
function equalsKnight(nbr1, nbr2){
    if(nbr1 == nbr2){
        return 1;
    }
    return 0;
}

// VERIFICATION DE LA REGLE NON SEQUENCIELLE
function verifNoSeq(){
    var i = 0;
    var j =0;
    var cpti = 0;
    var cptj = 0;
    var valueLine = tempCoordx+tempCoordy*9;
    var valueCol = tempCoordx*9+tempCoordy;
    var verify = 0;
    if (tempCoordy < 1) {
        i++;
    }else if(tempCoordy > 7){
        cpti--;
    }
    for (i; i < 2+cpti; i++) {
        if(tabLine[valueLine] == (parseInt(tabLine[valueLine+i*2-1])-1) || tabLine[valueLine] == (parseInt(tabLine[valueLine+i*2-1])+1)){
            verify++;
        }
    }
    if (tempCoordy < 1) {
        j++;
    }else if(tempCoordy > 7){
        cptj--;
    }
    for (j; j < 2+cptj; j++) {
        if(tabCol[valueCol] == (parseInt(tabCol[valueCol+j*2-1])-1) || tabCol[valueCol] == (parseInt(tabCol[valueCol+j*2-1])+1)){
            verify++;
        }
    }
    if (verify == 0) {
        return 1;
    }
    return 0;

}

// AJOUT DE LA DERNIERE ACTION A LA MEMOIRE
function addMemoryUndo(fct, value){
    fct = fct.concat(tempCoordx).concat(tempCoordy).concat(value);
    for (var i = 0; i < 4; i++) {
        tabMemoryUndo[4-i] = tabMemoryUndo[4-i-1];
    }
    tabMemoryUndo[0]= fct;
}

// GESTION DU UNDO
function undo(){
    ctx.clearRect((tempCoordx *50), (tempCoordy *50),50, 50);
    ctx.strokeRect((tempCoordx *50), (tempCoordy *50),50, 50);
    var undoValue =null;
    var cpt = 0;
    var rgb;
    while(undoValue == null){
        undoValue = tabMemoryUndo[cpt];
        cpt++;
        if (cpt>5) {
            return 0;
        }
    }

    //addMemoryRedo(undoValue);
    for (var i = 0; i < 4; i++) {
        tabMemoryUndo[i] = tabMemoryUndo[i+1];
        
    }
    var testSwitch = undoValue.charAt(0);
    switch(testSwitch){
        // set number stockée sous 4 caractère
        case 'a':
            tempCoordx = undoValue.charAt(1);
            
            tempCoordy = undoValue.charAt(2);
            var value = undoValue.charAt(3)

            setNumber(value, false);
            break;
        // changer la couleur
        case 'b':
            tempCoordx = undoValue.charAt(1);
            tempCoordy = undoValue.charAt(2);
            rgb = undoValue.substr(3,9);
            setColor(rgb);
            break;
    }
    tempCoordx = -1000;
    tempCoordy = -1000;
}

// function non gérée et non utilisée
function addMemoryRedo(tempUndo){
    for (var i = 0; i < 5; i++) {
        tabMemoryRedo[i] = tabMemoryRedo[i+1];
    }
    tabMemoryRedo[0]= tempUndo;
}

// CREATION DU HINT (aide qui affiche toutes les positibilités de la case)
function createHint(){
    var element = document.getElementById("sudoku");
    for (var i = 0; i <9;i++) {
        for (var j = 0; j <9;j++) {
          for(var k = 0; k <3;k++) {
              for (var l = 0; l < 3; l++) {
                var kl = 3*k+l;
                var h = "h"+i+j+kl;
                var tag = document.createElement("div");
                tag.setAttribute("id", h);
                tag.classList.add(h);
                element.appendChild(tag);
                tag.style.fontSize = 10 + 'px';
                tag.style.position = "absolute";
                tag.style.color="green";
                tag.style.display="none";
                tag.style.left = 15+((taille/9*j+(l*15)))+ 'px'; 
                tag.style.top = 12 +((taille/9*i+(k*15)))+ 'px';
                document.getElementById(h).innerHTML = 3*k+l+1;
              }
          }
        }
      }
      for (var m = 0; m < 9; m++) {
        for (var n = 0; n < 9; n++) {
            for (var o = 0; o < 9; o++) {
                tabHint[m][n][o] = o;
            }
        }
    }
}

// EFFACE LES VALEURS DE LA CASE ET AFFICHE LES HINTS
function hint(){
    clearSelectedCase();
    showHint();
}
function showHint(){
    setNumber(".", false);
    for (var k = 0; k < 9; k++) {
        hintCase = "h";
        hintCase = hintCase.concat(tempCoordy.toString()).concat(tempCoordx.toString()).concat(k.toString());
        document.getElementById(hintCase).style.display="none";
        if(tabHint[tempCoordy][tempCoordx][k] != 0){
            document.getElementById(hintCase).style.display="block";
        }
    }
}

// MAJ DES HINTS LORSQUE L'UTILISATEUR MET UN NOMBRE
function updateHint(){
    var x = tempCoordx;
    var y = tempCoordy;
    var value;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            tempCoordx = j;
            tempCoordy = i;
            value = tabLine[i*9+j];
            for (var k = 0; k < 9; k++) {
                updateTab(k+1);
                if(verifValue() == (3+king+knight+noSeq)){
                    tabHint[i][j][k] = k+1;
                    }else{
                        tabHint[i][j][k] = 0;
                }
            }
            updateTab(value);
        }
    }
    tempCoordx = x;
    tempCoordy =y;
}

// CACHE LES HINTS
function hideHint(){
    for (var k = 0; k < 9; k++) {
        hintCase = "h";
        hintCase = hintCase.concat(tempCoordy.toString()).concat(tempCoordx.toString()).concat(k.toString());
        document.getElementById(hintCase).style.display="none";
        }
}

// CHANGE L'AFFICHAGE DES BOUTONS NORMAUX A PENCIL MARK
function swapPencilMark(){
    if (swapNPM==true) {
        hide("divNumber");
        show("divPM");
        swapNPM = false;
    } else {
        hide("divPM");
        show("divNumber");
        swapNPM = true;
    }
}
function hide(div){
    document.getElementById(div).style.display="none";
}
function show(div){
    document.getElementById(div).style.display="block";
}

// CREATION DU PENCIL MARK
function createPM(){
    var element = document.getElementById("sudoku");
    for (var i = 0; i <9;i++) {
        for (var j = 0; j <9;j++) {
          for(var k = 0; k <3;k++) {
              for (var l = 0; l < 3; l++) {
                var kl = 3*k+l;
                var p = "p"+i+j+kl;
                var tag = document.createElement("div");
                tag.setAttribute("id", p);
                tag.classList.add(p);
                element.appendChild(tag);
                tag.style.fontSize = 10 + 'px';
                tag.style.position = "absolute";
                tag.style.display="none";
                tag.style.color="blue";
                tag.style.left = 15+((taille/9*j+(l*15)))+ 'px'; 
                tag.style.top = 12 +((taille/9*i+(k*15)))+ 'px';
                document.getElementById(p).innerHTML = 3*k+l+1;
            }
            
          }
        }
    }
}

// AFFICHE LE PENCIL MARK DANS LA CASE
function setPM(nbr){
    nbr--;
    pmCase = "p";
    pmCase = pmCase.concat(tempCoordy.toString()).concat(tempCoordx.toString()).concat(nbr.toString());
    if(document.getElementById(pmCase).style.display=="block"){
        clearPM(nbr);
    }else{
        document.getElementById(pmCase).style.display="block";
    }
    
}

// SUPPRIME LE PENCIL MARK LORSQUE L'ON RECLIQUE SUR LE NOMBRE
function clearPM(nbr){
    pmCase = "p";
    pmCase = pmCase.concat(tempCoordy.toString()).concat(tempCoordx.toString()).concat(nbr.toString());
    document.getElementById(pmCase).style.display="none";
}

// VERIFIE QUE LA GRILLE SOIT COMPLETE SANS ERREURS
function validate(){
    var x = tempCoordx;
    var y = tempCoordy;
    var verif=0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            tempCoordx = i;
            tempCoordy =j;
            if(verifValue() != (3+king+knight+noSeq)){
               verif++;
            }
        } 
    }
    if(verif==0){
        finish();
    }else{
        alert("Le sudoku n'est pas correct");
        tempCoordx =x;
        tempCoordy =y;
    } 
}
