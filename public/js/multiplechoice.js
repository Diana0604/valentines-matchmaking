$(".remove").hide();
var nextMult = 3;

//multiple choice specifics
$(".new").click(function(){
    console.log('click new detected');
    var txt1 = '<input type="text" class="form-control" name="answer' + nextMult +'" id="answer' + nextMult + '">';
    console.log('adding element: ' + txt1);
    $(this).before(txt1);
    nextMult++;
    $(".remove").show();
});
$(".remove").click(function(){
    console.log('click remove detected');
    nextMult--;
    console.log("delecting element with id: " + "#answer" + nextMult);
    $("#answer" + nextMult).remove();
    if(nextMult === 3){
        $(this).hide();
    }
});