$(function () {
    // 当前页
    var currentPage = 1;
    // 一页多少条
    var pageSize = 5;
    // 1. 一进入页面, 进行渲染
    var picArr = []; // 专门用来保存图片对象
    render();

    function render() {
        $.ajax({
            type: 'get',
            url: "/product/queryProductDetailList",
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

    $("#addBtn").on('click',function () {
        $("#addModal").modal('show');
        $.ajax({
            type:'get',
            url:"/category/querySecondCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            success:function (info) {
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
        $('[name="brandId"]').val( id );
    });

    $('#fileupload').fileupload({
        dataType: "json",
        // done, 当图片上传完成, 响应回来时调用
        done: function( e, data ) {
            // console.log( data );
            // 获取图片地址对象
            var picObj = data.result;
            // console.log(picObj);
            // 获取上传成功的图片地址
            var picAddr = picObj.picAddr;
            // 新得到的图片对象, 应该推到数组的最前面    push pop shift unshift
            picArr.unshift( picObj );
            // 新的图片, 应该添加到 imgBox 最前面去
            $('#imgBox').prepend('<img src="'+ picAddr +'" width="100">');
            // 如果上传的图片个数大于 3个, 需要将最旧的那个(最后面的哪项), 要删除
            if(picArr.length>3){
                picArr.pop();
                $("#imgBox img:last-of-type").remove();
            }
            // 通过 last-of-type 找到imgBox盒子中最后一个 img 类型的标签, 让他自杀

            if ( picArr.length === 3 ) {
                $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID")
            }
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
            // 商品名称
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            // 商品描述
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式, 必须是非零开头的数字'
                    }
                }
            },
            // 尺码校验, 规则必须是 32-40, 两个数字-两个数字
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 32-40'
                    }
                }
            },
            // 商品价格
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品价格"
                    }
                }
            },
            // 商品原价
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            // 标记图片是否上传满三张
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    });


    $('#form').on('success.form.bv', function (e) {
        e.preventDefault();
        var params = $('#form').serialize();
        console.log(picArr);
        params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
        params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: params,
            success: function (info) {
                console.log(info);
                $('#addModal').modal('hide');
                $('#form').data("bootstrapValidator").resetForm(true);
                currentPage = 1;
                render();
                $('#dropdownText').text("请选择二级分类");
                // 删除结构中的所有图片
                $('#imgBox img').remove();
                // 重置数组 picArr
                picArr = [];
            }
        })
    })

    $(".content tbody").on('click', '.btn', function () {
        $("#userModal").modal('show');
        var id = $(this).parent().data('id');
        var statu = $(this).hasClass('btn-success') ? 1 : 0;

        $("#submitBtn").click(function () {
            $.ajax({
                type:'post',
                url:"/product/queryProductDetailList",
                data:{
                    id:id,
                    statu:statu
                },
                success:function (info) {
                    if(info.success){
                        $("#userModal").modal('hide');
                        render()
                    }
                }
            })
        })
    });
});