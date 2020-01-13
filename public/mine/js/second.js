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
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (info) {
                console.log(info);
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
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "get",
            data: {
                page: 1,
                pageSize: 100
            },
            success: function( info ){
                var htmlStr = template( "tpl2", info );
                $('.dropdown-menu').html( htmlStr );
            }
        })
    });

    $(".dropdown-menu").on('click','a',function () {
        var txt=$(this).text();
        var id=$(this).data('id');
        $("#dropdownText").text(txt);
        // 将选中的 id 设置到 input 表单元素中
        $('[name="categoryId"]').val( id );

        $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });

    $('#fileupload').fileupload({
        dataType: "json",
        // done, 当图片上传完成, 响应回来时调用
        done: function( e, data ) {
            console.log( data );
            // 获取上传成功的图片地址
            var picAddr = data.result.picAddr;
            // 设置图片地址
            $('#imgBox img').attr("src", picAddr);
            // 将图片地址存在隐藏域中
            $('[name="brandLogo"]').val( picAddr );

            // 重置校验状态
            $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
        }
    });

    $('#form').bootstrapValidator({
        excluded: [],
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 校验的字段
        fields: {
            // 品牌名称
            brandName: {
                //校验规则
                validators: {
                    notEmpty: {
                        message: "请输入二级分类名称"
                    }
                }
            },
            // 一级分类的id
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            // 图片的地址
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传图片"
                    }
                }
            }
        }
    });


    $('#form').on('success.form.bv',function (e) {
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$('#form').serialize(),
            success:function (info) {
                console.log(info)
                $('#addModal').modal('hide');
                currentPage=1;
                render();
                $('#dropdownText').text("请选择一级分类");
                $('#imgBox img').attr("src", "../image/none.png")
            }
        })
    })
});