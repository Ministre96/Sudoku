var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var taille = 450;
canvas.width = taille;
canvas.height = taille;
var nbr = 1;
var lettre = "c";
var sudoku = "7.4..6..9.8..1......3.2.45.........2.56...78.1.........25.3.1......4..6.9..5..3.7"
var tabSudoku = new Array(9);
var tempCoordx = null;
var tempCoordy = null;
for (var i = 0; i < 9; i++)
{
 tabSudoku[i] = new Array(9);
}
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
    tag.style.left = 28+(taille/9*i) + 'px';
    tag.style.top = 18+(taille/9*j) + 'px';
    if(sudoku.charAt(cpt)== "."){
        document.getElementById(caracter).innerHTML = " ";
    } else {
        document.getElementById(caracter).innerHTML = sudoku.charAt(cpt);
    }
    
    
    cpt++;
}
var c = document.getElementById("canvas");
c.onclick = showCoords;

//fonction qui vérifie la règle de base sudoku 
function verifRB(){
    for(let i=0; i <9; i++){
        var erreurLigne = verifLigne(i);
        var erreurColonne = verifColonne(i);
        var erreurBloc = verifBloc(i);
    }

}

function verifLigne(num){
    var test = null;
    for (let i = 0; i < tabSudoku.length-1; i++) {
        for (let j = 0; j < tabSudoku.length; j++) {
            if(tabSudoku[num][i]==tab[num][i+j+1]){
                test = test.concat(j);
            }
        }
    }
    return test;
}

function verifColonne(num){
    var test = null;
    for (let i = 0; i < tabSudoku.length-1; i++) {
        for (let j = 0; j < tabSudoku.length; j++) {
            if(tabSudoku[i][num]==tab[i+j+1][num]){
                test = test.concat(j);
            }
        }
    }
    return test;
}

function verifBloc(num){
    var test = null;
    for (let i = 0; i < tabSudoku.length-1; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if(tabSudoku[i+num-num%3][num]==tab[i+j+1][num]){
                    test = test.concat(j);
                }
                
            }
            
        }
    }
    return test;
}
function showCoords(event) {
    var x = event.pageX;
    var y = event.pageY;
    x =Number.parseInt(((x-10)/50));
    y =Number.parseInt(((y-10)/50));
    var coords = "X coords: " + x + ", Y coords: " + y;
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
