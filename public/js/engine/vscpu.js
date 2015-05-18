//AQUEST ES EL FITXER QUE PROCESSARA TOTES LES DADES I SENCARREGARA DE CARREGAR TOTS ELS OBJECTES QUE INTERVINDRAN AL JOC EN EL MODE VSCPU//

//VARIABLES GLOBALS
var alsada_finestrajoc = 450;//Alçada de la finestra SVG
var amplada = 750;//Amplada de la finestra SVG
var colorsedificis = ["#ff2d79","green","#0000cc","gray","maroon","tomato","purple","darkCyan"];//Array amb els possibles colors dels edificis
var ample_edifici = 0;
var alturas_edificis = new Array();//Array on posteriorment introduirem dades importants per tal de generar els gorillas
var ample_edificis_pergorilla = new Array();//Array on posteriorment introduirem dades importants per tal de generar els gorillas
var centrargorilla_aleatori_array = new Array();//Array on posteriorment introduirem dades importants per tal de generar els gorillas


var posicio_ocupada_per_player1;

//Funció on carregarem tots els objectes de l'escenari i apartat visual
function init(){
    load_bg();
    //generar_edificis();

}

function load_bg(){

    var s = Snap("#finestrajoc");
    Snap.load("img/backgrounds_game/llunas_bonas.svg", onSVGLoaded) ;

    function onSVGLoaded( data ){ 
        //Un cop s'ha carregat el fons comencem a cridar a totes les funcions, podriem dir que aixo es una mena de init() secundari pero a l'hora principal
        s.append( data );
        generar_edificis();
        generar_gorillas();
        $("#boca_sorpresa").css("display","none");

    }
}

function generar_edificis(){
    var distancia_x = 0;
    for(var a=0; a<10; a++){
        //Fem un random per aconseguir el color del edifici
        var coloreficiirandom = Math.floor(Math.random() * (8 - 0) + 0);
        var s = Snap("#finestrajoc");
        //ample dels edificis
        ample_edifici = Math.floor(Math.random() * (150 - 55) + 55);
        //altura dels edificis
        y_random = Math.floor(Math.random() * (400 - 250) + 250);
        //Guardem a un array les altures per tal de despres colocar als gorillas
        alturas_edificis[a]=y_random;
        ample_edificis_pergorilla[a]=distancia_x;

        //Guardem la amplada del edifici per fer un random per a centrar el gorilla aleatoriament despres a la funcio generar_gorillas()
        centrargorilla_aleatori_array[a]=ample_edifici;

        var rect = s.rect(distancia_x, y_random, ample_edifici, alsada_finestrajoc-y_random);
        rect.attr({
            index: 3,
            fill: colorsedificis[coloreficiirandom],
            id: 'edifici'+a,
            strokeWidth: 2,
            stroke: 'black'
        });
        /*for(var k=0; k<20;k++){
            for(var w=0; w<2;w++){
                if(w==0){
                    var rect3 = s.rect(distancia_x+5,y_random+5,10,10);
                    rect3.attr({
                        index: 3,
                        fill: yellow,
                        id: 'ventana'+k+w,
                        strokeWidth: 1,
                        stroke: 'black'

                   });
                }

            }

        }*/
        //ample_edifici += Math.floor(Math.random() * (70 - 0) + 0);
        distancia_x+=ample_edifici;

    }
}

function generar_gorillas(){
    generar_player1();
    generar_player2();
}


function generar_player1(){
    var s = Snap("#finestrajoc");
    Snap.load("img/players/gorilla_orange.svg",colocarlos);
    function colocarlos(dades){
        s.append(dades);
        var mono = Snap("#monosvg");
        var colocarmono = Math.floor(Math.random() * (7 - 0) + 0);
        posicio_ocupada_per_player1 = colocarmono;
        //alert(ample_edificis_pergorilla[colocarmono]+"eee");
        while(ample_edificis_pergorilla[colocarmono] > 750){
            colocarmono = Math.floor(Math.random() * (7 - 0) + 0);       
            alert("hmm");
        }
        var centrargorilla_aleatori = Math.floor(Math.random() * ((centrargorilla_aleatori_array[colocarmono]-40) - 20) + 20);
        mono.attr({x:(ample_edificis_pergorilla[colocarmono]+centrargorilla_aleatori),y:alturas_edificis[colocarmono]-44});
    }
}


function generar_player2(){
    var s = Snap("#finestrajoc");
    Snap.load("img/players/gorilla_final_red.svg",colocarlos);
    function colocarlos(dades){
        s.append(dades);
        var mono = Snap("#monosvg_player2");
        var colocarmono_player2 = Math.floor(Math.random() * (7 - 0) + 0);
        while(ample_edificis_pergorilla[colocarmono_player2] > 750){
            colocarmono_player2 = Math.floor(Math.random() * (7 - 0) + 0);       
            alert("hmm");
        }
        //alert(posicio_ocupada_per_player1);
        //alert(colocarmono_player2);
        while(posicio_ocupada_per_player1 == colocarmono_player2){
            var colocarmono_player2 = Math.floor(Math.random() * (7 - 0) + 0);
            //alert("mateix edifici. Cambiant de edifici...");
        }
        var centrargorilla_aleatori = Math.floor(Math.random() * ((centrargorilla_aleatori_array[colocarmono_player2]-40) - 20) + 20);
        mono.attr({x:(ample_edificis_pergorilla[colocarmono_player2]+centrargorilla_aleatori),y:alturas_edificis[colocarmono_player2]-44});
    }
}

