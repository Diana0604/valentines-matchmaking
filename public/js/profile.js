function initialize(){
    //general
    $(".btn-edit").hide();
}

initialize();
//username
$(".edit-icon-username").click(function(){
    $(".username").prop('disabled', false);
    $(".edit-username").show();
    $(".edit-icon-username").hide();
});

$(".edit-username").click(function(){
    $(".username").prop('disabled', true);
    $(".btn-edit").hide();
    $(".edit-icon-email").show();
    $(".edit-icon-username").show();
});
//email
$(".edit-icon-email").click(function(){
    $(".email").prop('disabled', false);
    $(".edit-email").show();
    $(".edit-icon-email").hide();
});

$(".edit-email").click(function(){
    $(".email").prop('disabled', true);
    $(".btn-edit").hide();
    $(".edit-icon-email").show();
    $(".edit-icon-username").show();
});