var socket = io.connect('http://192.168.1.134:6969/lanmode');
var escenaris = ["lluna","terra","mart"];
socket.on('news', function (data) {

    $("#num_jugadors_linia").html(data);
    //socket.emit('my other event', { my: 'data' });
});


socket.on('seleccio_escenari',function(){
    $("#esperar").fadeOut("slow",function(){
        $("#jumbowrapper").fadeIn("slow");
    });
    $("#sb-slider li a img").click(function(){
        for(var o=0; o<3; o++){                        
            if($(this).attr('id')==escenaris[o]){
                //alert(planetes.);
                escenaritemporal = $(this).attr('id');
                //alert("aribo");
                socket.emit('seleccio_feta',{escenari:escenaritemporal});
                $("#jumbowrapper").fadeOut('slow',function(){

                    //init("<%= user.local.username %>","cpu",escenaritemporal);
                    $("#jumbo").fadeIn('slow');
                }); 
            }
        }

    });

});

socket.on('joc_ple',function(){
    $("#esperar").fadeOut("slow",function(){
        $("#joc_ple").fadeIn("fast");
    });


});

socket.on('load_bg',function(nivell,noms){
    //alert(noms.primer+"  "+noms.segon);
    init(noms.primer,noms.segon,nivell);
    $("#jumbowrapper").fadeOut("fast");
    $("#jumbo").fadeIn("fast");
    //socket.emit('afegir_nom',); 

});

socket.on('torn_aleatori',function(){
    $("#pre_joc").fadeOut("fast");
    $("#jumbowrapper").hide();
    fer_sonar_sons(sons.intro);
});

socket.on('alert',function(alertar){
    alert(alertar);
});

