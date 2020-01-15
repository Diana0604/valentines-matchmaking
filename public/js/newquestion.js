var nextMult = null;

function initialize(){
    //general
    $("div").hide();

    //multiple choice
    nextMult = 3;
    $("#multiplechoice .remove").hide();
}

initialize();

//1 - when a type is chosen - show options for that type
$("#choosetype").click(function(){
    initialize();
    var type = $("#type").val();
    $("#"+type).show();
    $("#general").show();
});

//multiple choice specifics
$("#multiplechoice .new").click(function(){
    console.log('click new detected');
    var txt1 = '<input type="text" name="answer' + nextMult +'" id="answer' + nextMult + '">';
    console.log('adding element: ' + txt1);
    $(this).before(txt1);
    nextMult++;
    $("#multiplechoice .remove").show();
});
$("#multiplechoice .remove").click(function(){
    console.log('click remove detected');
    nextMult--;
    console.log("delecting element with id: " + "#answer" + nextMult);
    $("#multiplechoice #answer" + nextMult).remove();
    if(nextMult === 3){
        $(this).hide();
    }
});