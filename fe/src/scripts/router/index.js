import Router from 'sme-router'

import goodsController from '../controllers/goods.controller'

import {
  ActiveClass,
  NavLink
} from './action'

const register = () => {
  const router = new Router('router-view')

  // 路由导航链接事件绑定
  NavLink(router)

  // 路由切换时导航高亮设置
  router.use((req) => {
    ActiveClass()
  })

  router.route('/goods', async (req, res, next) => {
    let {
      pageNo = 1,
      pageSize = 2,
      keywords = ''
    } = req.query || {}

    res.render(await goodsController.list({
      pageNo,
      pageSize,
      keywords,
      router
    }))
    goodsController.bindListEvents({router, req})
  })

  router.route('/save', (req, res, next) => {
    res.render(goodsController.save())
    $(document).ready(function() {
      $('#reservationtime').daterangepicker({
        timePicker: true, //显示时间
        timePicker24Hour: true, //时间制
        timePickerSeconds: true, //时间显示到秒
        startDate: moment().hours(0).minutes(0).seconds(0), //设置开始日期
        endDate: moment(new Date()), //设置结束器日期
        maxDate: moment(new Date().setFullYear(new Date().getFullYear()+1)), //设置最大日期
        locale: {
          format: "YYYY-MM-DD HH:mm:ss", //设置显示格式
          applyLabel: '确定', //确定按钮文本
          cancelLabel: '取消', //取消按钮文本
        },
      }, function (start, end, label) {
        $('#reservationtime').html(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
        sessionStorage.setItem("saleTime", start.format('YYYY-MM-DD HH:mm:ss'));
        sessionStorage.setItem("stopSaleTime", end.format('YYYY-MM-DD HH:mm:ss'));
      });
    })
    goodsController.bindSaveEvents(router)
  })

  router.route('/update', async (req, res, next) => {
    res.render(positionController.update())
    let {
      id,
      pageNo
    } = req.params
    let {
      keywords = ''
    } = req.query
    res.render(await positionController.update({
      id
    }))
    positionController.bindUpdateEvents({
      pageNo,
      router,
      keywords
    })
  })

  router.route('*', (req, res, next) => {
    res.redirect('/home')
  })
}

export default {
  register
}