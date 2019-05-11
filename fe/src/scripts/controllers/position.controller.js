import posListTpl from '../views/position.list.html'
import posSaveTpl from '../views/position.save.html'
import posUpdateTpl from '../views/position.update.html'

import posModel from '../models/position.model'

const _genID = () => {
  return Math.random().toString(36).substr(2) + Date.now().toString(36)
}

const _handleAddSubmitClick = () => {
  let options = {
    "success": (result, status) => {
      if (result.ret) {
        $("#possave").get(0).reset()
      } else {
        alert('插入失败')
      }
    },
    "resetForm": true,
    "dataType": "json"
  };
  $("#possave").ajaxSubmit(options)
}

const _handleUpdateSubmitClick = (router, pageNo, keywords) => {
  let options = {
    "success": (result, status) => {
      if (result.ret) {
        $("#posupdate").get(0).reset()
      } else {
        alert('修改失败')
      }
    },
    "resetForm": true,
    "dataType": "json"
  };
  $("#posupdate").ajaxSubmit(options)
  router.go(`/position?pageNo=${pageNo}&keywords=${keywords || ''}`)
}

const _handleUpperShelfClick = async ({
  goodsId,
  type
}) => {
  console.log(goodsId,
    type);
  let result = await posModel.uppershelf({
    goodsId,
    type
  });
  if (result.ret) {
    location.reload();
  } else {
    alert('商品上架失败，请与管理员联系.')
  }
}

const _handleLowerShelfClick = async ({
  goodsId,
  type
}) => {
  console.log(goodsId,
    type);
  let result = await posModel.lowershelf({
    goodsId,
    type
  });
  if (result.ret) {
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
    console.log(1111);
    let id = $(this).attr('posid')
    let pageNo = $(this).attr('pageno')
    let keywords = $(this).attr('keywords')
    router.go(`/update/${id}/${pageNo}?keywords=${keywords}`)
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
    let {
      pageNo = 1
    } = req.query || {}

    router.go(`/position?pageNo=${pageNo}&keywords=${keywords}`)
  })
}



const bindSaveEvents = (router) => {
  $('#posback').on('click', () => router.go('/position'))
  $('#possubmit').on('click', _handleAddSubmitClick)
  $('#imgUrl').on("change", _handleAddMore)
  $('#thumbnailUrl').on("change", _handleAddClone)
}

const _handleAddMore = function() {
  var files = this.files;
  var length = files.length;
  for (let i = 0; i < length; i++) {
    var reader = new FileReader();
    reader.readAsDataURL(files[i]);//读取文件
    reader.onload = function (e) {
      var div = $("<div class='flexBox'><img src='"+this.result+"'/><p class='aaron'>"+files[i].name+"</p></div>")
      $('#add-more').before(div);
    };
  }
}

const _handleAddClone = function() {
  var files = this.files;
  var reader = new FileReader();
    reader.readAsDataURL(files[0]);//读取文件
    reader.onload = function () {
      var div = $("<div class='flexBox'><img src='"+this.result+"'/><p class='aaron'>"+files[0].name+"</p></div>")
      $('#add-clone').before(div);
    };
}

const bindUpdateEvents = ({
  router,
  pageNo,
  keywords
}) => {
  $('#posback').on('click', () => router.go(`/position?pageNo=${pageNo}&keywords=${keywords||''}`))
  $('#possubmit').on('click', _handleUpdateSubmitClick.bind(this, router, pageNo, keywords))
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
  if (result.ret) {
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
const update = () => {
  return posUpdateTpl
}
// const update = async ({
//   goodsId,
//   type
// }) => {
//   const pos = (await posModel.listone({goodsId, type}))['data']
//   let html = template.render(posUpdateTpl, {
//     pos
//   })

//   return html
// }

export default {
  list,
  bindListEvents,
  save,
  bindSaveEvents,
  update,
  bindUpdateEvents
}