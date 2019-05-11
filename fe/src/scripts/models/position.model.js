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

const listone = (id) => {
  return $.ajax({
    url: '/api/position/listone',
    data: {
      id
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

export default {
  list,
  lowershelf,
  uppershelf,
  listone,
  listall
}