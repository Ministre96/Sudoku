var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// DECLARATION DE VARIABLE
var taille = 450;
canvas.width = taille;
canvas.height = taille;
var nbr = 1;
var lettre = "c";
document.onkeydown = checkKey;

//var sudoku = getGrille(2);
var sudoku = "7.4..6..9.8..1......3.2.45.........2.56...78.1.........25.3.1......4..6.9..5..3.7";
var tempCoordx = null;
var tempCoordy = null;
var tabBloc = new Array();
var tabCol = new Array();
var tabLine = new Array();
var tabExcluded = new Array();
//AJOUT EVENT SUR ELEMENT HTML
var c = document.getElementById("canvas");
c.onclick = showCoords;

//RECUPERATION GRILLE
/*function getBaseValue(nbr){
    var xhr = new XMLHttpRequest();
    var json = xhr.responseText;
    xhr.open("POST", "GetGrilles.php", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(nbr);
    var grille = JSON.parse(json);
    var sudoku = grille["grille"];
    createtabLine(ta chaine de caractère json)
    return sudoku;
}*/

//INITIALISATION
Init();

function Init(){
    drawSudoku();
    setBaseValue();
    //getBaseValue();
    createTabLine();
    updateTabBloc();
    createTabCol();
}

//DESSIN DE LA GRILLE DE SUDOKU AVEC CANVA
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

//AJOUT DES VALEURS DE BASE DANS LA GRILLE
function setBaseValue(){
    var element = document.getElementById("sudoku");
    var cpt = 0;
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


//FONCTION RECUP DES COORDONNE + SELCTION DE LA CASE 
function showCoords(event) {
    var x = event.pageX;
    var y = event.pageY;
    x =Number.parseInt(((x-10)/50));
    y =Number.parseInt(((y-10)/50));
    var coords = "X coords: " + x + ", Y coords: " + y;
    if(x<taille && y<taille){
        if((tabExcluded.find(checkExcluded)) == null){
            drawSelectCase(x, y);
            
        }
    }
    function checkExcluded(excluded){
        return excluded == x.toString().concat(y);
    }
  }
//DEPLACEMENT FLECHE CLAVIER (PERSPECTIVE D AMELIO: FAIRE UN SAUT DE CASE QUAND CASE LOCK)
function checkKey(e){
    if(tempCoordx != null){
        var x, y;
        x = tempCoordx;
        y = tempCoordy;
        e = e || window.event;
        if(e.keyCode == '37'){
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
        }else if(e.keyCode == '49'){
           updateTab(1);
           showUpdate(1);
        }else if(e.keyCode == '50' || e.keyCode == '97'){
            updateTab(2);
            showUpdate(2);
         }else if(e.keyCode == '51'|| e.keyCode == '98'){
            updateTab(3);
            showUpdate(3);
         }else if(e.keyCode == '52'|| e.keyCode == '99'){
            updateTab(4);
            showUpdate(4);
         }else if(e.keyCode == '53'|| e.keyCode == '100'){
            updateTab(5);
            showUpdate(5);
         }else if(e.keyCode == '54'|| e.keyCode == '101'){
            updateTab(6);
            showUpdate(6);
         }else if(e.keyCode == '55'|| e.keyCode == '102'){
            updateTab(7);
            showUpdate(7);
         }else if(e.keyCode == '56'|| e.keyCode == '103'){
            updateTab(8);
            showUpdate(8);
         }else if(e.keyCode == '57'|| e.keyCode == '104'){
            updateTab(9);
            showUpdate(9);
         }
        function checkExcluded(excluded){
            return excluded == x.toString().concat(y);
        }
    }
    
}


function drawSelectCase(x, y){
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = "#1F9AC4";
    ctx.fillStyle = "#7FD3EF";
    ctx.lineWidth =1.0;
    ctx.fillRect((x *50), (y *50),50, 50);
    ctx.strokeRect((x *50), (y *50),50, 50);
    ctx.strokeStyle = "black";
    ctx.fillStyle = null;
    ctx.clearRect((tempCoordx *50), (tempCoordy *50),50, 50);
    ctx.strokeRect((tempCoordx *50), (tempCoordy *50),50, 50);
    tempCoordx = x;
    tempCoordy =y;
}



//AJOUT D UN NOMBRE DANS LA GRILLE
function setNumber(num){
    updateTab(num);
    showUpdate(num);
}
//EFFACER UN NOMBRE DE LA GRILLE
function clearSelectedCase(){
    var nbCase = "c";
    nbCase = nbCase.concat(tempCoordx);
    nbCase = nbCase.concat(tempCoordy);
    var cleared = "."
    document.getElementById(nbCase).innerHTML = " ";
    updateTab(cleared);
}
function showUpdate(num){
    var nbCase = "c";
    nbCase = nbCase.concat(tempCoordx);
    nbCase = nbCase.concat(tempCoordy);
    document.getElementById(nbCase).innerHTML = num;
    if(verifValue() == 3){
    document.getElementById(nbCase).style.color="green";
    }else{
        document.getElementById(nbCase).style.color="red";
    }
}

//FONCTION DE CREATION ET DE MAJ DES DIFF TAB
function createTabLine(){
    tabExcluded.length = 0;
    var cpt = 0;
    var temp;
    for (let i = 0; i < 81; i++) {  
        tabLine[i]= sudoku.charAt(i);
        //TABLEAU STOCKANT LES CASES A BLOQUER POUR LE SELECTED
        if(sudoku.charAt(i)!= "."){
            temp = (i%9);
            tabExcluded[cpt] = temp.toString().concat(((i-(i%9))/9));
            cpt++;
        }
    }
}
  function createTabCol(){
    var cpt = null;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
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
    for (let l = 0; l < 3; l++) {
        for (let k = 0; k < 3; k++) {
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 3; i++) {
                    tabBloc[cpt] = tabLine[i+j*9+k*3+l*27];
                    cpt++;
                }
            }
        }   
    }
}
//FONCTIONS DE VERIFICATION 
function verifValue(){
    var test = verifLine()+ verifCol()+ verifBloc();
    return test;
}

function verif(num){
    var tabTemp = new Array();
    var startValue;
    var value;
    var verify = 0;
    if (num == 0) {
        value = tempCoordx+tempCoordy*9;
        startValue = value-value%9;
        tabTemp = tabLine;
    }else if(num ==1){
        value = tempCoordx*9+tempCoordy;
        startValue = value-value%9;
        tabTemp = tabCol;
    }else if(num == 2){
        value = (27*(Math.floor(tempCoordy/3))) + (9*(Math.floor(tempCoordx/3))) + ((tempCoordy%3)*3);
        if(tempCoordx%3 != 0){
            value = value + tempCoordx%3;
        }
       startValue = value - value%9;
       tabTemp = tabBloc;
       
    }
    for (let i = 0; i < 9; i++) {
        if (tabTemp[startValue+i]==tabTemp[value]) {
            verify++;
            
        }
     }
     
     if (verify == 1) {
         return true;
     }
     return false;           
}
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
