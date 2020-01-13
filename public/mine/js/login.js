
$(function() {
    $("#form").bootstrapValidator({

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 对字段进行校验
        fields: {
            username: {
                // 校验的规则
                validators: {
                    // 非空校验
                    notEmpty: {
                        // 为空时显示的提示信息
                        message: "用户名不能为空"
                    },
                    // 长度要求 2-6 位
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: "用户名长度必须是 2-6 位"
                    },
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    // 长度校验
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "密码长度必须是6-12位"
                    },
                    // 专门用于配置回调提示信息的校验规则
                    callback: {
                        message: "密码错误"
                    }
                }
            }
        }
    });

    $('#form').on("success.form.bv", function( e ) {
        // 阻止默认的表单提交
        e.preventDefault();

        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            dataType: "json",
            data: $('#form').serialize(),
            success: function( info ) {
                console.log( info )

                if ( info.success ) {
                    // alert( "登录成功" );
                    location.href = "index.html";
                }

                if ( info.error === 1000 ) {
                    $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }

                if ( info.error === 1001 ) {
                    $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback")
                }
            }

        })

    });

    $('.reset').click(function() {
        console.log( 1111 );
        $('#form').data("bootstrapValidator").resetForm();
    });

});