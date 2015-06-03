
//AQUEST ES EL FITXER QUE PROCESSARA TOTES LES DADES I SENCARREGARA DE CARREGAR TOTS ELS OBJECTES QUE INTERVINDRAN AL JOC EN EL MODE VSCPU//

//VARIABLES GLOBALS
var alsada_finestrajoc = 450;//Alçada de la finestra SVG
var amplada = 750;//Amplada de la finestra SVG
var colorsedificis = ["#ff2d79","green","#0000cc","gray","maroon","tomato","purple","darkCyan"];//Array amb els possibles colors dels edificis
var ample_edifici = 0;
var alturas_edificis = new Array();//Array on posteriorment introduirem dades importants per tal de generar els gorillas
var ample_edificis_pergorilla = new Array();//Array on posteriorment introduirem dades importants per tal de generar els gorillas
var centrargorilla_aleatori_array = new Array();//Array on posteriorment introduirem dades importants per tal de generar els gorillas
var partsapintar = ["#path266","#path2383","#path266","#path4313","#path250","#path4317"];//ID de les parts que si es tracten correctament amb attr fill, podem cambiar de color els gorillas
var gravetat;
var planetes = {
    lluna:{nom:"lluna",gravetat:1.62,fons:"img/backgrounds_game/llunas_bonas.svg",colorfons: 'rgb(0, 0, 102)'},
    terra:{nom:"terra",gravetat:9.8,fons:"img/backgrounds_game/terra.svg",colorfons: "#2e8f2d"},
    mart:{nom:"mart",gravetat:3.7,fons:"img/backgrounds_game/mart.svg",colorfons: "#ff3000"}
}
var angles_cpu;
var velocitat_cpu;

var posicio_ocupada_per_player1;

var edificis = new Array();

var player1_attributes = {nom:"",x:"", y:"", posicio:0,num_edifici:"",turn:false,victoria:false};//PERSONA FISICA
var player2_attributes = {nom:"",x:"", y:"", posicio:0,num_edifici:"",turn:false,victoria:false};//PLAYER2=CPU


var sons = {cop_edifici:"sound/cop_edifici.mp3",cop_gorilla:"sound/cop_gorilla.mp3",guanyar:"sound/guanyar.mp3",intro:"sound/intro.mp3",llensa_platan:"sound/llensa_platan.mp3"};

//OBJECTE SNAP enmagatzemat a la seguent variable
var datosplatano = {
    platano:"",
    velocitat: 0,
    angle:0,
    gravetat: 0,
    time:0,
    x: 0,
    y: 0
};


//Funció on carregarem tots els objectes de l'escenari i apartat visual
function init(nomjugador,cpu,escenari){

    set_noms(nomjugador,cpu);
    //alert(escenari);

    load_bg(escenari);
    set_marcadors_inicials();
    //generar_edificis();

}

function load_bg(escenari){
    switch(escenari){
        case "lluna": escenari = planetes.lluna.fons;
            set_planeta('lluna');
            set_info_header('lluna');
            break;
        case "terra": escenari = planetes.terra.fons;
            set_planeta('terra');
            set_info_header('terra');
            break;
        case "mart": escenari = planetes.mart.fons;
            set_planeta('mart');
            set_info_header('mart');
            break;
    }

    var s = Snap("#finestrajoc");
    Snap.load(escenari, onSVGLoaded) ;

    function onSVGLoaded( data ){ 
        //Un cop s'ha carregat el fons comencem a cridar a totes les funcions, podriem dir que aixo es una mena de init() secundari pero a l'hora principal
        s.append( data );
        generar_edificis();
        generar_gorillas();       
        $("#boca_sorpresa").css("display","none");

    }


}

//GENERATE FUNCTIONS

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
        set_array_edificis(a,rect);
        var p = s.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
            fill: colorsedificis[coloreficiirandom],
            stroke: colorsedificis[coloreficiirandom],
            strokeWidth: 4
        });
        // To create pattern,
        // just specify dimensions in pattern method:
        p = p.pattern(0, 0, 10, 10);
        // Then use it as a fill on big circle
        rect.attr({
            fill: p
        });
        //ample_edifici += Math.floor(Math.random() * (70 - 0) + 0);
        distancia_x+=ample_edifici;

    }
}



function generar_gorillas(){
    generar_player1();
}


function generar_player1(){
    var s = Snap("#finestrajoc");
    Snap.load("img/players/gorilla_orange_bueno_backup.svg",colocarlos);
    function colocarlos(dades){
        s.append(dades);
        var mono1 = Snap("#monosvg");
        var colocarmono = Math.floor(Math.random() * (7 - 0) + 0);
        posicio_ocupada_per_player1 = colocarmono;
        //alert(ample_edificis_pergorilla[colocarmono]+"eee");
        while(ample_edificis_pergorilla[colocarmono] > 725){
            colocarmono = Math.floor(Math.random() * (7 - 0) + 0);       
            //alert("hmm");
        }
        var centrargorilla_aleatori = Math.floor(Math.random() * ((centrargorilla_aleatori_array[colocarmono]-40) - 20) + 20);
        mono1.attr({x:(ample_edificis_pergorilla[colocarmono]+centrargorilla_aleatori),y:alturas_edificis[colocarmono]-44});

        player1_attributes.x=mono1.attr('x');        
        player1_attributes.y=mono1.attr('y');
        player1_attributes.num_edifici = colocarmono;
        generar_player2();

    }

}


function generar_player2(){
    var s = Snap("#finestrajoc");
    Snap.load("img/players/gorilla_orange_bueno_backup2.svg",colocarlos2);
    function colocarlos2(dades){
        s.append(dades);
        var mono2 = Snap("#monosvg2");
        var colocarmono_player2 = Math.floor(Math.random() * (7 - 0) + 0);
        while(ample_edificis_pergorilla[colocarmono_player2] > 725){
            colocarmono_player2 = Math.floor(Math.random() * (7 - 0) + 0);       
            //alert("hmm");
        }
        //alert(posicio_ocupada_per_player1);
        //alert(colocarmono_player2);
        while(posicio_ocupada_per_player1 == colocarmono_player2){
            colocarmono_player2 = Math.floor(Math.random() * (7 - 0) + 0);
            //alert("mateix edifici. Cambiant de edifici...");
        }
        var centrargorilla_aleatori = Math.floor(Math.random() * ((centrargorilla_aleatori_array[colocarmono_player2]-40) - 20) + 20);
        mono2.attr({x:(ample_edificis_pergorilla[colocarmono_player2]+centrargorilla_aleatori),y:alturas_edificis[colocarmono_player2]-44});
        //mono2.attr({id:'mono_red_cpu'});




        //Pintem el gorilla de vermell
        set_red_gorilla(mono2);


        player2_attributes.x=mono2.attr('x');        
        player2_attributes.y=mono2.attr('y');
        player2_attributes.num_edifici = colocarmono_player2;
        //set_esquerra_dreta();

        //SEGUIM PER AQUI JA QUE HEM DE SEGUIR SEMPRE EL FIL DE L'ULTIM OBJECTE SVG QUE HAGUEM CARREGAT

        //alert(getplayer2_posicio());

    }
}

//GETTERS

function getplayer1_position_x(){
    return parseInt(player1_attributes.x);
}

function getplayer1_position_y(){
    return parseInt(player1_attributes.y);
}

function getplayer2_position_x(){
    return parseInt(player2_attributes.x);
}

function getplayer2_position_y(){
    return parseInt(player2_attributes.y);
}

function getplayer1_posicio(){
    return player1_attributes.posicio;

}
function getplayer2_posicio(){
    return player2_attributes.posicio;

}

function getplayer2_numeroedifici(){
    return player2_attributes.num_edifici;
}



//SETTERS
function set_info_header(nomplaneta){
    $("#info_escenari").append("<h4>Gravetat del planeta "+nomplaneta+" = "+planetes[nomplaneta].gravetat+" m/s²</h4>");
}

function set_planeta(nom){
    gravetat = planetes[nom].gravetat;
    colorfons = planetes[nom].colorfons;
    //gravetat_planeta_actiu = gravetat

}

//Aquesta funcio ens emmagatzema els objectes SNAP edifici a l'array edificis per tal de fer comprovacions despres
function set_array_edificis(cont,edifici){
    edificis[cont]=edifici;
}

function set_red_gorilla(cpu_man){

    for(var m=0; m<partsapintar.length; m++){
        var arojo = cpu_man.select(partsapintar[m]);
        arojo.attr({fill:'red'});    
    }

}


function set_esquerra_dreta(){
    var cont=0;
    //alert(getplayer2_position_x());
    //alert(getplayer1_position_x());
    if(getplayer1_position_x()<getplayer2_position_x()){
        //alert(getplayer2_position_x()+" dreta");
        player2_attributes.posicio=1;
        player1_attributes.posicio=0;

    }
    if(getplayer1_position_x()>getplayer2_position_x()){
        //alert(getplayer2_position_x()+" esquerra");
        player2_attributes.posicio=0;
        player1_attributes.posicio=1;

    }

}

function set_noms(nom_jugador,cpu){
    player1_attributes.nom=nom_jugador;
    player2_attributes.nom=cpu;
}

function set_marcadors_inicials(){
    // Store
    if(!localStorage.getItem("player_cpu") || !localStorage.getItem("player_fisic")){
        localStorage.setItem("player_fisic",5);
        localStorage.setItem("player_cpu",5);
    }
    // Retrieve
    $("#marcador_player").html("["+localStorage.getItem("player_fisic")+"] ").css("color","tomato");
    $("#marcador_cpu").html(" ["+localStorage.getItem("player_cpu")+"]").css("color","tomato");
}

/////////////////////////// A PARTIR DE AQUI COMENÇAN LES FUNCIONS PER AL JOC, TORNS, ETC
/////////////////////////// UN COP HO TENIM TOT INICIALITZAT ES HORA DE COMENÇAR A JUGAR, EL PRIMER TORN SERA ASSIGNAT DE FORMA ALEATORIA

function setturns(){
    var tornaleat = Math.floor(Math.random() * (2 - 0) + 1);
    switch(tornaleat){
        case 1: player1_attributes.turn=true;
            player2_attributes.turn=false;
            break;

        case 2: player2_attributes.turn=true;
            player1_attributes.turn=false;
            break;
    }
    //fabricar_vars_cpu();
    joc();
    //alert(tornaleat);
    //joc();

}


function joc(){

    if(player1_attributes.turn){
        $("#boto_llensador").fadeOut("fast");
        //$("#boto_llensador").hide();
        reset_platan_info();
        $("#platans").remove();
        fabricar_vars_cpu();
        $("#cpu_info").css("color","#ff69b4");
        $("#jugador_info").css("color","black");
    }else{        
        $("#boto_llensador").fadeIn("fast");
        $("#jugador_info").css("color","#ff69b4");
        $("#cpu_info").css("color","black");
    }


}


function player_animate_bras(){
    switch(getplayer2_posicio()){
        case 0: //alert(getplayer2_posicio());
            //BRAS ESQUERRA ANIMACIO FINAL
            var player2snap = Snap("#monosvg2");
            var allmono = Snap("#grup_total");
            //var bras = $("#bras_llensador");
            var bras_esquerra = player2snap.select('#bras_esquerra');
            bras_esquerra.animate(
                {transform: 'r75,160,160'},600,mina.bounce,function(){
                    load_banana(0,getplayer2_position_x(),getplayer2_position_y());
                    bras_esquerra.animate({transform:'t-30,-39'},600,mina.elastic);

                });
            break;

        case 1: // alert(getplayer2_posicio());
            var player2snap = Snap("#monosvg2");
            var allmono = Snap("#grup_total");
            //var bras = $("#bras_llensador");
            var bras_dret = player2snap.select('#bras_dret');

            //BRAS DRET ANIMACIO FINAL
            bras_dret.animate(
                {transform: 'r-75,135,135'},600,mina.bounce,function(){
                    //alert("ei");
                    load_banana(1,getplayer2_position_x(),getplayer2_position_y());
                    bras_dret.animate({transform: '0,0'},600,mina.elastic);

                });
            break;


    }

}

function cpu_animate_bras(angles_cpu_u,velocitat_cpu_u){
    switch(getplayer1_posicio()){
        case 0: //alert(getplayer2_posicio());
            //BRAS ESQUERRA ANIMACIO FINAL
            var player1snap = Snap("#monosvg");
            //var allmono_cpu = Snap("#grup_total");
            //var bras = $("#bras_llensador");
            var bras_esquerra_cpu = player1snap.select('#bras_esquerra');
            bras_esquerra_cpu.animate(
                {transform: 'r75,160,160'},600,mina.bounce,function(){
                    load_banana_cpu(angles_cpu_u,velocitat_cpu_u,0,getplayer1_position_x(),getplayer1_position_y());
                    bras_esquerra_cpu.animate({transform:'t-30,-39'},600,mina.elastic);

                });
            break;

        case 1: // alert(getplayer2_posicio());
            var player1snap = Snap("#monosvg");
            //var allmono_cpu = Snap("#grup_total");
            //var bras = $("#bras_llensador");
            var bras_dret_cpu = player1snap.select('#bras_dret');

            //BRAS DRET ANIMACIO FINAL
            bras_dret_cpu.animate(
                {transform: 'r-75,135,135'},600,mina.bounce,function(){
                    //alert("ei");
                    load_banana_cpu(angles_cpu,velocitat_cpu,1,getplayer1_position_x(),getplayer1_position_y());
                    bras_dret_cpu.animate({transform: '0,0'},600,mina.elastic);

                });
            break;


    }

}

function fabricar_vars_cpu(){

    angles_cpu = Math.floor(Math.random() * (70 - 0) + 1);
    velocitat_cpu = Math.floor(Math.random() * (100 - 0) + 1);
    cpu_animate_bras(angles_cpu,velocitat_cpu);

}

//var gravetat = 9.8;
function load_banana(posiciojugador,player_x,player_y){
    //posiciojugador=0;
    //posiciojugador=0;
    if(posiciojugador===0){
        fer_sonar_sons(sons.llensa_platan);
        var s = Snap("#finestrajoc");
        function colplatan(data){
            s.append(data);
            var platans = Snap("#platans");
            //player_x = player_x +10;
            platans.attr({x:player_x,y:player_y});
            var platansencer = platans.select('#platans_tot');
            //platansencer.attr({x:player_x});
            datosplatano.platano=platans;

            //set_velocitat_i_angles();
            datosplatano.angle= angles;
            datosplatano.gravetat = gravetat;            
            datosplatano.velocitat = velocitat;
            datosplatano.x=getplayer2_position_x();
            datosplatano.y=getplayer2_position_y()-20;
            datosplatano.platano.attr({x:player_x});
            datosplatano.platano.attr({y:player_y})-20;
            //alert(datosplatano.x);
            //alert(datosplatano.y);
            //setTimeout(function(){move_object_parra()}, 1000);
            //alf = setInterval(function () {move_object_parra()}, 10);
            //alert("esquerra");
            move_object_parra();
            //$("#platans").remove();


        }
        Snap.load("img/platan/platans.svg",colplatan);

    }else if(posiciojugador===1){
        fer_sonar_sons(sons.llensa_platan);
        var s = Snap("#finestrajoc");
        function colocar_platan(data){
            s.append(data);
            var platans = Snap("#platans");
            //player_x = player_x +10;
            platans.attr({x:player_x,y:player_y});
            var platansencer = platans.select('#platans_tot');
            //platansencer.attr({x:player_x});
            datosplatano.platano=platans;

            //set_velocitat_i_angles();
            datosplatano.angle=-angles;
            datosplatano.gravetat = gravetat;            
            datosplatano.velocitat = -velocitat;
            datosplatano.x=getplayer2_position_x();
            datosplatano.y=getplayer2_position_y()-20;
            datosplatano.platano.attr({x:player_x});
            datosplatano.platano.attr({y:player_y})-20;
            //alert(datosplatano.x);
            //alert(datosplatano.y);
            //setTimeout(function(){move_object_parra()}, 1000);
            //alf = setInterval(function () {move_object_parra()}, 10);
            move_object_parra();
            //$("#platans").remove();


        }
        Snap.load("img/platan/platans.svg",colocar_platan);

    }
}

function load_banana_cpu(angles_cpu_ban,velocitat_cpu_ban,posiciojugador,player_x,player_y){
    //posiciojugador=0;
    //posiciojugador=0;
    if(posiciojugador===0){
        var s = Snap("#finestrajoc");
        fer_sonar_sons(sons.llensa_platan);
        function colplatan(data){
            s.append(data);
            var platans = Snap("#platans");
            //player_x = player_x +10;
            platans.attr({x:player_x,y:player_y});
            var platansencer = platans.select('#platans_tot');
            //platansencer.attr({x:player_x});
            datosplatano.platano=platans;

            //set_velocitat_i_angles();
            datosplatano.angle= angles_cpu_ban;
            datosplatano.gravetat = gravetat;            
            datosplatano.velocitat = velocitat_cpu_ban;
            datosplatano.x=getplayer1_position_x();
            datosplatano.y=getplayer1_position_y()-20;
            //alert("posicio x player: "+getplayer1_position_x()+" posicio Y player: "+getplayer1_position_y());
            datosplatano.platano.attr({x:player_x});
            datosplatano.platano.attr({y:player_y})-20;
            //alert(datosplatano.x);
            //alert(datosplatano.y);
            //setTimeout(function(){move_object_parra()}, 1000);
            //alf = setInterval(function () {move_object_parra()}, 10);
            //alert("esquerra");
            move_object_parra();
            //$("#platans").remove();


        }
        Snap.load("img/platan/platans.svg",colplatan);

    }else if(posiciojugador===1){
        fer_sonar_sons(sons.llensa_platan);
        var s = Snap("#finestrajoc");
        function colocar_platan(data){
            s.append(data);
            var platans = Snap("#platans");
            //player_x = player_x +10;
            platans.attr({x:player_x,y:player_y});
            var platansencer = platans.select('#platans_tot');
            //platansencer.attr({x:player_x});
            datosplatano.platano=platans;

            //set_velocitat_i_angles();
            datosplatano.angle=-angles_cpu_ban;
            datosplatano.gravetat = gravetat;            
            datosplatano.velocitat = -velocitat_cpu_ban;
            datosplatano.x=getplayer1_position_x();
            datosplatano.y=getplayer1_position_y()-20;
            //alert("posicio x player: "+getplayer1_position_x()+" posicio Y player: "+getplayer1_position_y());
            datosplatano.platano.attr({x:player_x});
            datosplatano.platano.attr({y:player_y})-20;
            //alert(datosplatano.x);
            //alert(datosplatano.y);
            //setTimeout(function(){move_object_parra()}, 1000);
            //alf = setInterval(function () {move_object_parra()}, 10);
            move_object_parra();
            //$("#platans").remove();


        }
        Snap.load("img/platan/platans.svg",colocar_platan);

    }
}
function move_object_parra() {
    //alert(datosplatano.platano.attr('x'));
    //ixplat = $("#platans").attr('x');
    // work out the new position of the ball
    x = datosplatano.velocitat * Math.cos(datosplatano.angle * Math.PI/180) * datosplatano.time + parseFloat(datosplatano.x);
    y = datosplatano.velocitat * Math.sin(datosplatano.angle * Math.PI/180) * datosplatano.time -0.5 * datosplatano.gravetat * Math.pow(datosplatano.time,2);
    y = datosplatano.y - y;

    // set the position of the ball

    datosplatano.platano.attr({x:x,y:y});
    /*datosplatano.platano.animate({
        transform: 'rotate(0 256 256)'
    },500);*/
    // $("#ball").css({'left': x, 'top': y});

    // incriment time
    datosplatano.time += 0.05;
    //alert(x+"  "+y);


    if(colisio_sol(x,y)){

    }

    if(colisio_player_1(x,y)){
        if(player1_attributes.turn){
            fer_sonar_sons(sons.cop_gorilla);
            adios_banana();      
            restar_resultat_marcador("player_cpu");
            //AL MOMENT DE ANIMAR AL GUANYADOR ES COMPROVA SI EL PLAYER HA GUANYAT
            animacio_guanyador("#monosvg2");
            animacio_perdedor("#monosvg");

            //alert(localStorage.getItem("player_cpu"));
            /*if(localStorage.getItem("player_cpu")==0){
                alert("eep");
                //sumar_punts_bd(player2_attributes.nom);
            }*/

        }else{
            //sumar_punts_bd(player2_attributes.nom);
            fer_sonar_sons(sons.cop_gorilla);
            adios_banana();   
            restar_resultat_marcador("player_cpu");
            //AL MOMENT DE ANIMAR AL GUANYADOR ES COMPROVA SI EL PLAYER HA GUANYAT
            animacio_guanyador("#monosvg2");
            animacio_perdedor("#monosvg");

            //alert(localStorage.getItem("player_cpu"));

        }
    }
    if(colisio_player_2(x,y)){
        if(player2_attributes.turn){
            fer_sonar_sons(sons.cop_gorilla);
            adios_banana();
            restar_resultat_marcador("player_fisic");
            //AL MOMENT DE ANIMAR AL GUANYADOR ES COMPROVA SI EL PLAYER HA GUANYAT
            animacio_guanyador("#monosvg");
            animacio_perdedor("#monosvg2");


        }else{
            fer_sonar_sons(sons.cop_gorilla);
            adios_banana();
            restar_resultat_marcador("player_fisic");
            //AL MOMENT DE ANIMAR AL GUANYADOR ES COMPROVA SI EL PLAYER HA GUANYAT
            animacio_guanyador("#monosvg");
            animacio_perdedor("#monosvg2");



        }
    }



    //tambe comprovar aqui colisio per player 2 o sigui qui sigui que hagi tirat per si es mata a ell mateix, despres per aixo comprovar qui ha guanyat la ronda depenent de qui 
    //hagi matat a qui

    //i tambe anar rotant el platan a mida que avança la animacio
    if(colisio_edifici(x,y)){
        crear_colisio(x,y);
        adios_banana();
        cambiar_torn();
        fer_sonar_sons(sons.cop_edifici);
    }    
    if(offscreen_parra(x, y)) {
        adios_banana();
        cambiar_torn();
    } else {
        sigue_banana();
    }


}

function cambiar_torn(){
    if(player1_attributes.turn){
        player1_attributes.turn=false;
        player2_attributes.turn=true;
    }else{
        player2_attributes.turn=false;
        player1_attributes.turn=true;
    }
    joc();

}

function reset_platan_info(){
    datosplatano.angle=0;
    datosplatano.velocitat=0;
    datosplatano.gravetat=gravetat;
    datosplatano.platano="";
    datosplatano.time=0;
}

function offscreen_parra(x, y) {
    var offscreen = false;
    if(x > 750) offscreen = true;
    if(x < 0) offscreen = true;
    if(y > 450) offscreen = true;
    //if(y < 0) offscreen = true;
    return offscreen;
}

function adios_banana(){

    reset_platan_info();
    $("#platans").remove();

}

function sigue_banana(){
    setTimeout(function(){move_object_parra()}, 10);

}

function colisio_edifici(banana_posicio_x,banana_posicio_y){
    for ( var i = 0; i < edificis.length; i++ ) {
        //alert(getplayer2_numeroedifici());
        if ( coledi(edificis[i],banana_posicio_x, banana_posicio_y) ) return true;
    }
    return false;
}
var cont = 0;
function coledi(edifici,banana_x,banana_y){

    if ( edifici.attr('y') - 10 <= banana_y && ( banana_x > edifici.attr('x') && banana_x < parseInt(edifici.attr('x')) + parseInt(edifici.attr('width')))) {
        //this.colissions.push( [x - 20, y] );
        //this.createColission( x - 20, y );
        //alert(edifici.attr('id'));
        if(cont==0){
            //alert("if Y de edifici : "+edifici.attr('y')+" es < que la Y de la banana :"+banana_y+" ii (Primera evaluacio) banana x :"+banana_x+" es menor que la x del edifici : "+edifici.attr('x')+" mes ample de edifici : "+edifici.attr('width'));
            //alert("edifici y:"+edifici.attr('y')+"\n banana Y:"+banana_y+"\n banana x:"+banana_x+"\nx edifici:"+edifici.attr('x')+"\n width edifici:"+edifici.attr('width')+"\n ID EDIFICI: "+edifici.attr('id'));
            cont = 1;
            //alert(eval(edifici.attr('x')+edifici.attr('width')));
        }


        return true;
    }
    return false;


}


function crear_colisio(x,y){

    var s = Snap("#finestrajoc");
    var cercle = s.circle(x+10,y+10,15);
    cercle.attr({
        fill: colorfons,
        stroke: 'none'    
    });

}

function colisio_sol(x,y){

    if ( x <= (750 / 2) + 20 && x >= (750 / 2) - 20 && y <= 80 && y >= 40 ) {
        $("#boca_sorpresa").show();
        $("#lluna_somriu").hide();
        //alert(y);
        return true;
    }
    $("#boca_sorpresa").hide();
    $("#lluna_somriu").show();

    return false;
}

function colisio_player_1(x,y){
    if ( parseInt(getplayer1_position_y()) <= y && x > parseInt(getplayer1_position_x()) - 45 / 2 && x < parseInt(getplayer1_position_x()) + 45 / 2 ) {
        //this.dead = true;
        //alert("hit mono1");
        return true;
    }
    return false;
}

function colisio_player_2(x,y){
    if ( parseInt(getplayer2_position_y()) <= y && x > parseInt(getplayer2_position_x()) - 45 / 2 && x < parseInt(getplayer2_position_x()) + 45 / 2 ) {
        //this.dead = true;
        //alert("hit mono1");
        return true;
    }
    return false;
}

function animacio_guanyador(id){

    var guanyat = setInterval(function(){
        //alert(id);
        //alert(getplayer2_posicio());
        //BRAS ESQUERRA ANIMACIO FINAL
        var player2snap = Snap(id);
        var allmono = Snap("#grup_total");
        //var bras = $("#bras_llensador");
        var bras_esquerra = player2snap.select('#bras_esquerra');
        bras_esquerra.animate(
            {transform: 'r75,160,160'},600,mina.bounce,function(){
                //load_banana(0,getplayer2_position_x(),getplayer2_position_y());
                bras_esquerra.animate({transform:'t-30,-39'},600,mina.elastic);

            });


        // alert(getplayer2_posicio());
        var player2snap = Snap(id);
        var allmono = Snap("#grup_total");
        //var bras = $("#bras_llensador");
        var bras_dret = player2snap.select('#bras_dret');

        //BRAS DRET ANIMACIO FINAL
        bras_dret.animate(
            {transform: 'r-75,135,135'},600,mina.bounce,function(){
                //alert("ei");
                //load_banana(1,getplayer2_position_x(),getplayer2_position_y());
                bras_dret.animate({transform: '0,0'},600,mina.elastic);

            });

        fer_sonar_sons(sons.guanyar);


    },1200);        
    setTimeout(function(){

        if(localStorage.getItem('player_cpu')==0){
            reset_punts();
            window.location.href="/fi_joc";

        }else{
            window.location.href="/vscpu";
        }

        if(localStorage.getItem('player_fisic')==0){
            reset_punts();
            window.location.href="/fi_joc_negatiu";
        }else{
            window.location.href="/vscpu";
        }
        clearInterval(guanyat);
        //
    },4000);

}

function animacio_perdedor(id){
    //alert("llego");
    var player2snap = Snap(id);
    var allmono = Snap("#grup_total");
    //var bras = $("#bras_llensador");
    var sencer = player2snap.select('#g4339');
    sencer.animate({
        transform: 't0,500'
    },2000);   

}

function restar_resultat_marcador(jugador){
    localStorage.setItem(jugador,localStorage.getItem(jugador)-1);
    print_punts();
}

function print_punts(){
    $("#marcador_player").html("["+localStorage.getItem("player_fisic")+"] ").css("color","tomato");
    $("#marcador_cpu").html(" ["+localStorage.getItem("player_cpu")+"]").css("color","tomato");
}

function fer_sonar_sons(so){
    var mySound = new buzz.sound(so);
    mySound.play();
}

function sumar_punts_bd(jugador){
    if(jugador!=="cpu"){
        window.location.href="/fi_joc";
    }else{
        window.location.href="/vscpu";
    }

}

function reset_punts(){
    localStorage.setItem("player_fisic",5);
    localStorage.setItem("player_cpu",5);
}