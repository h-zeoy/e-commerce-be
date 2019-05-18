import posListTpl from '../views/goods.list.html'
import posSaveTpl from '../views/goods.save.html'
import posUpdateTpl from '../views/goods.update.html'
import posModel from '../models/goods.model'
import moment from 'moment';
import goodsModel from '../models/goods.model';

const _genID = () => {
  return Math.random().toString(36).substr(2) + Date.now().toString(36)
}
function checkNumber(obj){ 
  var reg = /^[0-9]+$/; 
  if(obj!=""&&!reg.test(obj)){ 
    alert('只能输入数字！'); 
    return false; 
  } 
}
var cloneImg = "";
var moreImg = [];
var cloneName = "";
var moreName = []

const _handleAddSubmitClick = async() => {
  let params = {};
  var goodsInfo = [];
  if (!cloneImg) {
    $('#thumbnailUrl-group').addClass('has-error');
    $("#thumbnailUrl-group").find('span[class^="help-block"]').text("请上传图片");
  }
  if ($('#name').val() === '') {
    $('#name').parent().parent().addClass('has-error')
    $('#name').parent().parent().find('span[class^="help-block"]').text("请输入商品名称");
  }
  if ($('#price').val() === '') {
    $('#price').parent().parent().addClass('has-error')
    $('#price').parent().parent().find('span[class^="help-block"]').text("请输入商品价格");
  }
  if ($('#linePrice').val() === '') {
    $('#linePrice').parent().parent().addClass('has-error')
    $('#linePrice').parent().parent().find('span[class^="help-block"]').text("请输入商品原价格");
  }
  if ($('#detail').val() === '') {
    $('#detail').parent().parent().addClass('has-error')
    $('#detail').parent().parent().find('span[class^="help-block"]').text("请输入商品详情");
  }
  if (moreImg.length === 0) {
    $('#form-imgUrl').addClass('has-error');
    $("#form-imgUrl").find('span[class^="help-block"]').text("请上传图片");
  }
  params['thumbnailUrl'] =cloneImg;
  params['imgUrl'] =moreImg;
  params['name'] = $('#name').val();
  params['price'] = $('#price').val();
  params['linePrice'] = $('#linePrice').val();
  params['detail'] = $('#detail').val();
  params['type'] =$(':radio[name="type"]:checked').val();
  params['saleTime'] = sessionStorage.getItem('saleTime');
  params['stopSaleTime'] = sessionStorage.getItem('stopSaleTime');
  $("input[name='goodsInfo']").map(function(index, item) {
    goodsInfo[index] = {name: $(item).val().replace(/\s+/g,"").split(","), info: $(this).siblings().val().replace(/\s+/g,"").split(",")}
  })
  params['goodsInfo'] =  JSON.stringify(goodsInfo);
  params['channel'] =$(':radio[name="channel"]:checked').val();
  let result = await posModel.save(params);
  alert(result.data.msg);
}

function modifySubmitData () {
  $("#thumbnailUrl").val(cloneImg);
  $("#imgUrl").val(moreImg);
}

const _handleUpdateSubmitClick = async(router, pageNo, keywords, id) => {
  let params = {};
  let goodsInfo = []
  params['id'] =id;
  params['thumbnailUrl'] =cloneImg;
  params['imgUrl'] =moreImg;
  params['name'] = $('#name').val();
  params['price'] = $('#price').val();
  params['linePrice'] = $('#linePrice').val();
  params['detail'] = $('#detail').val();
  params['saleTime'] = sessionStorage.getItem('saleTime');
  params['stopSaleTime'] = sessionStorage.getItem('stopSaleTime');
  $("input[name='goodsInfo']").map(function(index, item) {
    goodsInfo[index] = {name: $(item).val().replace(/\s+/g,"").split(","), info: $(this).siblings().val().replace(/\s+/g,"").split(",")}
  })
  params['goodsInfo'] =  JSON.stringify(goodsInfo);
  params['channel'] =$(':radio[name="channel"]:checked').val();
  let result = await goodsModel.update(params);
  if (result.success) {
    router.go(`/goods?pageNo=${pageNo}&keywords=${keywords || ''}`)
  } else {
    alert('数据修改失败');
  }
}

const _handleUpperShelfClick = async ({
  goodsId
}) => {
  let result = await posModel.uppershelf({
    goodsId
  });
  if (result.success) {
    location.reload();
  } else {
    alert('商品上架失败，请与管理员联系.')
  }
}

const _handleLowerShelfClick = async ({
  goodsId
}) => {
  let result = await posModel.lowershelf({
    goodsId
  });

  if (result.success) {
    location.reload();
  } else {
    alert('商品下架失败，请与管理员联系.')
  }
}

const bindListEvents = ({
  router,
  req
}) => {
  // 添加事件绑定
  $('#addbtn').on('click', () => router.go('/save'))

  // 修改事件绑定
  $('.pos-update').on('click', function () {
    let id = $(this).attr('posid')
    let pageNo = $(this).attr('pageno')
    let keywords = $(this).attr('keywords')
    router.go(`/update?id=${id}&pageNo=${pageNo}&keywords=${keywords}`)
  })

  // 商品上架 
  $('.pos-upperShelf').on('click', function () {
    console.log('商品上架');
    let goodsId = $(this).attr('posid')
    let type = $(this).attr('type')
    _handleUpperShelfClick({
      goodsId,
      type
    })
  })

  // 商品下架 
  $('.pos-lowerShelf').on('click', function () {
    console.log('商品下架');
    let goodsId = $(this).attr('posid')
    let type = $(this).attr('type')
    _handleLowerShelfClick({
      goodsId,
      type
    });
  })

  // 搜索事件绑定
  $('#possearch').on('click', function () {
    let keywords = $('#keywords').val()
    router.go(`/goods?pageNo=1&keywords=${keywords}`)
  })
}



const bindSaveEvents = (router) => {
  $('#posback').on('click', () => router.go('/goods'))
  $('#possubmit').on('click', _handleAddSubmitClick)
  $('#imgUrl').on("change", _handleAddMore)
  $('#thumbnailUrl').on("change", _handleAddClone)
  $('#add-input').on('click', _handleAddInput)
  $('#rm-input').on('click', _handleRmInput)
  $('#cloneUpload').on('click', _handleCloneUpload)
  $('#moreUpload').on('click', _handleMoreUpload)
  $('.img-group').on('click', function(event) {
    var reg = new RegExp('deteleClone');
    var clone = reg.test(event.target.className)
    if (event.target.tagName === 'I' && clone) {
      $(event.target).parent().remove();
      cloneImg = '';
      cloneName = '';
    } else if (event.target.tagName === 'I' && !clone) {
      var index = $(event.target).parent().attr('data-id');
      $(event.target).parent().remove();
      moreImg.splice(index,1);
      moreName.splice(index,1);
    }
  })
  
}
const _handleAddInput = function() {
  var el = $(`<p style="display: flex">
    <input style="flex: 2" type="text" class="form-control goodsInfo" name="goodsInfo"  placeholder="例如: 颜色">
    <input style="flex: 8" type="text" class="form-control goodsInfoGui" name="goodsInfoGui"  placeholder="例如: 红色,绿色">
  </p>`)
  $('#add-el-input').append(el) 
}

const _handleRmInput = function() {
  if ($(this).parent().siblings().length) (
    $(this).parent().siblings()[0].remove()
  );
}

const _handleCloneUpload = async function() {
  if (cloneImg) {
    let result = await (posModel.cloneupload({
      imgData: cloneImg,
      imgName: cloneName
    }))
    if (result.success) {
      cloneImg = result.data.imageUrl;
      alert('上传成功');
    } else {
      alert('上传失败，请与管理员联系');
    }
  } else {
    alert('请选择图片');
  }
}

const _handleMoreUpload = async function() {
  if (moreImg.length !== 0) {
    let result = await (posModel.moreupload({
      imgData: moreImg,
      imgName: moreName
    }))
    if (result.success) {
      moreImg = result.data.imageUrl;
      console.log(moreImg);
      alert('上传成功');
    } else {
      alert('上传失败，请与管理员联系');
    }
  } else {
    alert('请选择图片');
  }
}

const _handleAddMore = function() {
  var files = this.files;
  var length = files.length;
  if (moreImg.length + length <=5) {
    for (let i = 0; i < length; i++) {
      var reader = new FileReader();
      reader.readAsDataURL(files[i]);//读取文件
      reader.onload = function (e) {
        moreImg.push(this.result);
        moreName.push(files[i].name);
        var div = $("<div class='flexBox' data-id="+i+"><img src='"+this.result+"'/><p class='aaron'>"+files[i].name+"</p><i class='deleteImg deteleMore'></i></div>")
        $('#add-more').before(div);
      };
    }
    
  } else {
    alert('最多只能添加5张图片');
  } 
}

const _handleAddClone = function() {
  var files = this.files;
  var reader = new FileReader();
    reader.readAsDataURL(files[0]);//读取文件 
    reader.onload = function () {
      !cloneImg ? (cloneImg = this.result, cloneName = files[0].name) : $('#add-clone-Image').remove();
      var div = $("<div class='flexBox' id='add-clone-Image'><img src='"+this.result+"'/><p class='aaron'>"+files[0].name+"</p><i class='deleteImg deteleClone'></i></div>")
        $('#add-clone').before(div);
    };
    
}

const bindUpdateEvents = ({
  router,
  pageNo,
  id,
  keywords
}) => {
  $('#posback').on('click', () => router.go(`/goods?pageNo=${pageNo}&keywords=${keywords||''}`));
  $('#possubmit').on('click', _handleUpdateSubmitClick.bind(this, router, pageNo, keywords, id));
  $('#add-input').on('click', _handleAddInput)
  $('#rm-input').on('click', _handleRmInput)
  $('#imgUrl').on("change", _handleAddMore)
  $('#thumbnailUrl').on("change", _handleAddClone)
  $('#cloneUpload').on('click', _handleCloneUpload)
  $('#moreUpload').on('click', _handleMoreUpload)
  $('.deteleClone').on('click', function() {
    $(this).parent().remove();
    cloneImg = '',
    cloneName = ''
  })
  $('.deteleMore').on('click', function() {
    let index = $(this).parent().attr("data-id");
    $(this).parent().remove();
    moreImg.splice(index,1);
    moreName.splice(index,1);
    
  })
}

const list = async ({
  pageNo,
  pageSize,
  router,
  keywords
}) => {
  let result = await (posModel.list({
    pageNo,
    pageSize,
    keywords
  }))

  if (result.success) {
    let total = result.data.total
    let pageCount = Math.ceil(total / ~~pageSize)
    let html = template.render(posListTpl, {
      list: result.data.result,
      pageArray: new Array(pageCount),
      pageCount,
      pageSize,
      total,
      keywords,
      pageNo: ~~pageNo
    })

    return html
  } else {
    router.go('/')
    return
  }
}

const save = () => {
  return posSaveTpl
}

const update = async({id}) => {
  let result = (await posModel.listone({id}))['data'];
  result[0].goodsInfo = JSON.parse(result[0].goodsInfo);
  sessionStorage.setItem('type', result[0].type);
  sessionStorage.setItem('channel', result[0].channel);
  sessionStorage.setItem("saleTime", moment(new Date(Date.parse(result[0].saleTime))).format('YYYY-MM-DD HH:mm:ss'));
  sessionStorage.setItem("stopSaleTime", moment(new Date(Date.parse(result[0].stopSaleTime))).format('YYYY-MM-DD HH:mm:ss'));
  result[0].imgUrl = result[0].imgUrl.split(',');
  moreName = [];
  for (let i = 0; i< result[0].imgUrl.length; i++) {
    moreImg.push(result[0].imgUrl[i]);
    moreName.push(moreImg[i].match(/pr66pkeg3.bkt.clouddn.com\/(\S*)/)[1]);
  }
  cloneImg = result[0].thumbnailUrl;
  cloneName = cloneImg.match(/pr66pkeg3.bkt.clouddn.com\/(\S*)/)[1]
  result[0].cloneName = cloneName;
  result[0].moreName = moreName;
  let html = template.render(posUpdateTpl, {
    pos: result[0]
  })
  return html
}


export default {
  list,
  bindListEvents,
  save,
  bindSaveEvents,
  update,
  bindUpdateEvents
}