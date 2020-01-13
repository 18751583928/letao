//登录拦截
if ( location.href.indexOf("login.html") === -1 ) {
    $.ajax({
        url: "/employee/checkRootLogin",
        type: "get",
        success: function( info ) {
            // console.log( info );
            if ( info.success ) {

            }
            if ( info.error === 400 ) {
                // 进行拦截, 拦截到登录页
                location.href = "login.html";
            }
        }
    })
}


$(".category").on('click',function () {
    $('.child').toggle()
});

$('.menu').on('click',function () {
    $('.aside-left,.menu').toggleClass('box')
    $('.main').toggleClass('pad')
});

$('.nav a').on('click',function () {
    $(this).addClass('current').siblings().removeClass('current')
});

$('.out').click(function () {
    $('#logoutModal').modal("show");
});

$("#logoutBtn").click(function () {
   $.ajax({
       url: "/employee/employeeLogout",
       type: "GET",
       dataType: "json",
       success:function (info) {
           if(info.success){
               location.href = "login.html"
           }
       }
   })
});

