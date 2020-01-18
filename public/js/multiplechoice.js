var nextMult = $(".answer").length + 1;
if(nextMult <= 3) $(".remove").hide();

//multiple choice specifics
$(".new").click(function(){
    console.log('click new detected');
    var txt1 = '<input type="text" class="form-control  answer" name="question[possibleAnswers][' + nextMult +']" id="answer' + nextMult + '">';
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