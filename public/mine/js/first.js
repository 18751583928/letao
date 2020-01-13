$(function () {
// 当前页
    var currentPage = 1;
    // 一页多少条
    var pageSize = 5;

    // 1. 一进入页面, 进行渲染
    render();

    function render() {
        $.ajax({
            type: 'get',
            url: "/category/queryTopCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (info) {
               // console.log(info);
                var htmlStr = template("tpl", info);
                $('.content tbody').html(htmlStr);

                $('#paginator').bootstrapPaginator({
                    // 指定bootstrap版本
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),

                    // 当页面被点击时触发
                    onPageClicked: function (a, b, c, page) {
                        // page 当前点击的页码
                        currentPage = page;
                        // 调用 render 重新渲染页面
                        render();
                    }
                });
            }
        })
    }

    $("#addBtn").click(function () {
        $("#addModal").modal("show");
    });

    //表单验证插件
    $("#form").bootstrapValidator({
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 校验的字段
        fields: {
            categoryName: {
                // 校验规则
                validators: {
                    // 非空检验
                    notEmpty: {
                        // 提示信息
                        message: "请输入一级分类名称"
                    }
                }
            }
        }
    });

    $("#form").on('success.form.bv',function (e) {
        e.preventDefault();
        $.ajax({
            type:'post',
            url: "/category/addTopCategory",
            data:$("#form").serialize(),
            success:function (info) {
                console.log(info)
                if(info.success){
                    $("#addModal").modal('hide');
                    currentPage = 1;
                    render();
                    // 重置表单校验状态和 表单内容
                    // 传 true 不仅可以重置 状态, 还可以重置内容
                    $('#form').data("bootstrapValidator").resetForm( true );
                }

            }
        })
    })
});