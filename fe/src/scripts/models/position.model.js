const list = ({
  pageNo,
  pageSize,
  keywords
}) => {
  return $.ajax({
    url: `/api/position/list?pageNo=${pageNo}&pageSize=${pageSize}&keywords=${keywords||''}`,
    headers: {
      'X-Access-Token': localStorage.getItem('token')
    },
    success: (result) => {
      return result
    }
  })
}

const listall = ({
  keywords
}) => {
  return $.ajax({
    url: `/api/position/listall?keywords=${keywords||''}`,
    headers: {
      'X-Access-Token': localStorage.getItem('token')
    },
    success: (result) => {
      return result
    }
  })
}

const listone = ({goodsId, type}) => {
  return $.ajax({
    url: '/api/position/listone',
    data: {
      goodsId,
      type
    },
    success: (result) => {
      return result
    }
  })
}

const save = (params) => {
  return $.ajax({
    type: "POST",
    url: '/api/position/save',
    dataType: "json",
    data: {
      params,
    },
    success: (result) => {
      return result
    }
  })
}

const lowershelf = ({
  goodsId,
  type
}) => {
  return $.ajax({
    url: '/api/position/lowershelf',
    data: {
      goodsId,
      type
    },
    success: (result) => {
      return result
    }
  })
}

const uppershelf = ({
  goodsId,
  type
}) => {
  return $.ajax({
    url: '/api/position/uppershelf',
    data: {
      goodsId,
      type
    },
    success: (result) => {
      return result
    }
  })
}

const cloneupload = ({
  imgData
}) => {
  return $.ajax({
    type: "POST",
    url: '/api/qiniu/cloneupload',
    dataType: "json",
    data: {
      imgData,
    },
    // headers: {
    //   'X-Access-Token': localStorage.getItem('token')
    // },
    success: (result) => {
      return result
    }
  })
}

const moreupload = ({
  imgData
}) => {
  return $.ajax({
    type: "POST",
    url: '/api/qiniu/moreupload',
    dataType: "json",
    data: {
      imgData,
    },
    success: (result) => {
      return result
    }
  })
}


export default {
  list,
  lowershelf,
  uppershelf,
  listone,
  listall,
  cloneupload,
  moreupload,
  save
}