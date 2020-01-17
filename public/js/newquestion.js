function initialize(){
    //general
    $("div.hide").hide();

    //multiple choice
    nextMult = 3;
    $(".remove").hide();
}

initialize();

//1 - when a type is chosen - show options for that type
/*$(".#choosetype").click(function(){
    initialize();
    var type = $("#type").val();
    $("#"+type).show();
    $("#general").show();
});
*/
$( "#type" )
  .change(function() {
    initialize();
    var type = $("#type").val();
    $("#"+type).show();
    $("#general").show();
    /*
    var str = "";
    $( "select option:selected" ).each(function() {
      str += $( this ).text() + " ";
    });
    $( "div" ).text( str );
    */
  })
  .trigger( "change" );