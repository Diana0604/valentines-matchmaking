$(".question").hide();
$("#submit").hide();

$("#agreeButton").click(function(){
    if($('#agreeCheckbox').is(":checked")){
        $(".letter").hide();
        $(".question").show();
        $("#submit").show();
    }
});