var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// DECLARATION DE VARIABLE
var taille = 450;
canvas.width = taille;
canvas.height = taille;
var nbr = 1;
var lettre = "c";


//var sudoku = getGrille(2);
var sudoku = "7.4..6..9.8..1......3.2.45.........2.56...78.1.........25.3.1......4..6.9..5..3.7";
var tempCoordx = null;
var tempCoordy = null;
var tabBloc = new Array();
var tabCol = new Array();
var tabLine = new Array();

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
            var c = c.concat(i);
            var caracter = c.concat(j);
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
        document.getElementById("demo").innerHTML = coords;
        tempCoordx = x;
        tempCoordy =y;
    }
  }

//AJOUT D UN NOMBRE DANS LA GRILLE
function setNumber(num){
    var nbCase = "c";
    nbCase = nbCase.concat(tempCoordx);
    nbCase = nbCase.concat(tempCoordy);
    updateTab(num);
    document.getElementById(nbCase).innerHTML = num;
    if(verifValue() == false){
    document.getElementById(nbCase).style.color="green";
    }else{
        document.getElementById(nbCase).style.color="red";
    }
}

//FONCTION DE CREATION ET DE MAJ DES DIFF TAB
function createTabLine(){
    for (let i = 0; i < 81; i++) {
        tabLine[i]= sudoku.charAt(i);
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
    tabLine[tempCoordx*9+tempCoordy]=num;
}
function updateTabBloc(){
    var cpt =null;
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
    var test = verifLine()+ verifCol() + verifBloc();
    return test;
}
function verif(startValue, num){
    var tabTemp = new Array();
    var startValue;
    var value;
    var verify = 0;
    switch(num){
        case 0:
            value = tempCoordx*9+tempCoordy;
            startValue = value-value%9;
            tabTemp = tabLine;
            break;
        case 1:
            value = tempCoordx+tempCoordy*9;
            startValue = value-value%9;
            tabTemp = tabCol;
            break;
        case 2:
            startValue = (((tempCoordx+1)-(tempCoordx+1)%3) +((tempCoordy+1)-(tempCoordy+1)%3))*9;
            value = ((((tempCoordx+1)-(tempCoordx+1)%3) +((tempCoordy+1)-(tempCoordy+1)%3))*9)+((tempCoordx%3)+((tempCoordy%3)*3));
            tabTemp = tabBloc;
            break;
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
    return verif(startValue, num);
}

function verifCol(){
    var num = 1;
    return verif(startValue, num);
}

function verifBloc(){
    var num = 2;
    return verif(startValue, num);
}
