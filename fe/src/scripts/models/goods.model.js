const list = ({
    pageNo,
    pageSize,
    keywords
  }) => {
    return $.ajax({
      url: `/api/goods/list?pageNo=${pageNo}&pageSize=${pageSize}&keywords=${keywords||''}`,
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
      url: `/api/goods/listall?keywords=${keywords||''}`,
      headers: {
        'X-Access-Token': localStorage.getItem('token')
      },
      success: (result) => {
        return result
      }
    })
  }
  
  const listone = ({id}) => {
    return $.ajax({
      url: `/api/goods/listone?id=${id}`,
      success: (result) => {
        return result
      }
    })
  }
  
  const save = (params) => {
    return $.ajax({
      type: "POST",
      url: '/api/goods/save',
      dataType: "json",
      data: {
        params,
      },
      success: (result) => {
        return result
      }
    })
  }

  const update = (params) => {
    return $.ajax({
      type: "POST",
      url: '/api/goods/update',
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
    goodsId
  }) => {
    return $.ajax({
      url: '/api/goods/lowershelf',
      data: {
        goodsId
      },
      success: (result) => {
        return result
      }
    })
  }
  
  const uppershelf = ({
    goodsId
  }) => {
    return $.ajax({
      url: '/api/goods/uppershelf',
      data: {
        goodsId
      },
      success: (result) => {
        return result
      }
    })
  }
  
  const cloneupload = ({
    imgData,
    imgName
  }) => {
    return $.ajax({
      type: "POST",
      url: '/api/qiniu/cloneupload',
      dataType: "json",
      data: {
        imgData,
        imgName
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
    imgData,
    imgName
  }) => {
    return $.ajax({
      type: "POST",
      url: '/api/qiniu/moreupload',
      dataType: "json",
      data: {
        imgData,
        imgName
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
    save,
    update
  }