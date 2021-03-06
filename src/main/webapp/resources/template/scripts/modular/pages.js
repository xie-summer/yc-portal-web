/**
 * [description]:
 * 默认一上来就处于待编辑状态, 只有取消了编辑状态才可以编辑
 * 点击添加译员进入编辑状态, 只有打了对勾才默认退出编辑状态
 * 添加步骤必须在该列表都不在编辑状态才可以新增一个步骤
 * 只有不处于编辑状态才可以点击确定按钮
 * @return {[type]} [description]
 */
$(function(){
  var userList = [
    {
      name: '我是第一个',
      id:'transtor1',
      price:'500',
      count:'2300',
      totalPrice:''
    },
    {
      name: '我是第2个',
      id:'transtor2',
      price:'500',
      count:'2300',
      totalPrice:''
    },
    {
      name: '我是第3个',
      id:'transtor3',
      price:'500',
      count:'2300',
      totalPrice:''
    }
  ]

   // 点击弹窗
  $(document).on('click', '#fenpeirenwu', function(){
    $('#fenpei').slideDown();
    $('#eject-mask').fadeIn();
  })
   // 关闭弹窗
   $(document).on('click', '#tran-close', function(){
    $('#fenpei').slideUp();
    $('#eject-mask').fadeOut(500);
   })
  //tab切换的下拉框
  $(document).on('click', '[select-type-down]', function(){
    if($(this).parent().siblings('[select-type]').hasClass('undis')){
      $(this).parent().siblings('[select-type]').removeClass('undis')
    }else{
      $(this).parent().siblings('[select-type]').addClass('undis')
    }
    return false;
  });

  // 选择翻译还是校审
  $(document).on('click', '[select-type-item]', function () {
    var text = $(this).text();
    $(this).parents('[select-type]').siblings('a').find('span').text(text);
    $(this).parents('[select-type]').addClass('undis');
  })

  // 点击删除tab
  $(document).on('click', '[delete-tab]', function () {
    var index = $(this).parents('li').index(),
        self = $(this).parents('li'),
        tabLength = $(this).parents('ul').children().length;
        var obj=$(this).parents('ul');
        // resetId(obj);
    if(tabLength <= 1){
      alert('至少有一个编辑项')
    } else{
      deleteTab(self, index)
    }

  })

  // 增加一个tab
  $(document).on('click', '.addStep', function () {

    if($('[tabs]').children().length<=4){
      if($('.tran-tabs').hasClass('isediting')){
        alert('请完成当前编辑项');
      }else{
        var tabs = '<li class="tab-item current"><a href="#" class=""><span setActive>翻译</span><i class="img-down" select-type-down></i><i class="img-delete"delete-tab></i></a><div class="down-con clearfix undis" select-type><ul><li><a href="javascript:;" select-type-item>审校</a></li><li><a href="javascript:;" select-type-item>翻译</a></li></ul></div></li>';
        $('[tabs]').append(tabs);
        var index = $('[tabs]').children().length-1;
        resetId()
        // console.log(index)
        $('[tabs]').find('li').removeClass('current');
        makeCont(index+1);
        // console.log($('[tabs]').find('li').length)
        $('[tabs]').children().eq(index).addClass('current');
      }
    }else{
      alert('最多有5项')
    }
  });

  //点击tab切换内容区域
  $(document).on('click', '[setActive]', function () {
    var _index = $(this).parents('li').index();
    setNavActive(_index);
  });

  // 添加译员
  $(document).on('click','.add-toicon', function(){
    var toIndex = Number($(this).attr('index')) +1;
    // console.log(toIndex)
    // 添加一个译员就进入编辑状态,只有编辑状态取消才可以按确定按钮,才可以按添加步骤
    // alert($(this).parent().find('tr').length)
    if($(this).parent().find('tr').length>=3){
      alert('只允许有三项')
      return;
    }else{
      $(this).parents('.tran-tabs').addClass('isediting');
    // alert()
    // if( !$('#tran-tab1').hasClass('isediting') ){
      var users ='';
      var firstUser = userList[0].name;
      for(var i=0; i<userList.length; i++){
        users += '<li><a href="javascript:;">'+userList[i].name+'</a></li>'
      }

      var tr = '<tr class="edit">'+
                '<td class="text-l">'+
                  '<span class="name outedit">李菁菁</span>'+
                  '<div class="select-wrap isedit">'+
                    '<div class="select radius drop-down" select-user>'+firstUser+'</i></div>'+
                    '<div class="select-con undis">'+
                      '<ul>'+
                          users+
                     '</ul>'+
                    '</div>'+
                  '</div>'+
                '</td>'+
                '<td>500元/千字</td>'+
                '<td class="text-center">2300字</td>'+
                '<td class="text-center"><span class="isedit">共<input type="text" class="in-money" value="" />元</span><span class="outedit">共<span class="money">12487</span>元</span></td>'+
                '<td class="operate">'+
                  '<A href="#" class="blue-icon icon-editing"><i  class="finished-img isedit" finishedEdit></i></A>'+
                  '<A href="#"  class="red-icon icon-editing"><i  class="close-img isedit" removeEdit></i></A>'+
                  '<A href="#" class="blue-icon icon-edited"><i  class="edit-img" enterEdit></i></A>'+
                  '<A href="#"  class="red-icon icon-edited"><i  class="delete-img" removeEdit></i></A>'+
                '</td>'+
              '</tr>';
      $('[table'+toIndex+']').append(tr);
    // }
    }
  });
  // 下拉选择译员
  $(document).on('click', '[select-user]', function(){
    // console.log($(this).parent())
    $(this).parent().find('.select-con').removeClass('undis')
  });
  // 点击人员选项
  $(document).on('click', '.select-con li', function () {
    var valsel = $(this).text();
    var parent = $(this).parents('tr');
    getSelectValue(parent, valsel)
    $(this).parents('.select-con').addClass('undis')
  });
  //结束一行编辑
  $(document).on('click', '[finishedEdit]', function () {
    var parent = $(this).parents('tr');
    var selval = parent.find('[select-user]').text();
    getSelectValue(parent, selval);
    if($(this).parents('tr').siblings('tr').hasClass('edit')){
      // alert('有未完成的编辑项');
      $(this).parents('.tran-tabs').addClass('isediting');
    }else{
      $(this).parents('.tran-tabs').removeClass('isediting');
    }
    // $('#tran-tab1').removeClass('isediting');
    $(this).parents('tr').removeClass('edit');
  })
  //编辑时候点击x 按钮
  $( document).on('click', '[removeedit]', function () {
    $(this).parents('tr').remove();
  });
  // 点击编辑小 icon
  $(document).on('click', '[enteredit]', function () {
    $(this).parents('tr').addClass('edit');
    $(this).parents('.tran-tabs').addClass('isediting');
  })
  // 校验是否在编辑状态
  $(document).on('click', '#confirmfenpei', function () {
    if($('.tran-tabs').hasClass('isediting')){
      alert('有未完成的编辑项')
    }
  })

  // 删除一个 tab
  function deleteTab(self, index) {
    var lastChild = self.parent().children().length -3;
    self.remove();
    resetId();
    // console.log('lastChild', lastChild)
    $('.tran-tabs').eq(index).remove();
    $('.tran-tabs').removeClass('active');
    $('.tran-tabs').eq(lastChild).addClass('active');
    $('.tab-item').removeClass('current');
    $('.tab-item').eq(lastChild).addClass('current');
  }
  // 设置导航处于 active状态切换编辑内容区
  function setNavActive(index) {
    var idIndex = index+1;
    // console.log($("#tran-tab"+idIndex))
    if($('.tran-tabs').hasClass('isediting')){
      alert('请完成当前编辑项')
    }else{
      $('[tabs]').children('.tab-item').removeClass('current');
      $('[tabs]').children('.tab-item').eq(index).addClass('current');
      $('.tran-tabs').removeClass('active');
      $("#tran-tab"+idIndex).addClass('active');
    }

  }
  // 选择用户
  function getSelectValue(parent, itemVal) {
    parent.find('[select-user]').text(itemVal);
    parent.find('.name').text(itemVal)
  }
  // 创建新的tab
  function makeCont(index) {
    // console.log(index)
    var content = '<div id="tran-tab'+index+'" class="isediting tran-tabs active" ><div class="prompt-center-table"><table class="table table-bg  table-height60" table'+index+'><tbody></tbody></table></div><div class="add-toicon" index="'+(index-1)+'"><a href="#"><i class="icon iconfont">&#xe633;</i>添加译员</a></div></div>';
    $('.tran-tabs').removeClass('active');
    $('[btns]').before(content);
  }
  //重新分配id函数
  function resetId(){
    
    var obj =$('.prompt-center').children(".tran-tabs");
    var leng=$('.prompt-center').children(".tran-tabs").length;
    for(var j=0;j<leng;j++){
      num=j+1;
      obj[j].id="tran-tab"+num;
      // console.log(obj[j])
    } 
    $('.prompt-center').children(".tran-tabs").remove();
    for(var i=0;i<leng;i++){
    $('.prompt-samll-confirm').before(obj[i])
    console.log("触发")    
    }
  }
});