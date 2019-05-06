/*
CREATE TABLE `list` (
  `goodsId` int(11) NOT NULL COMMENT '商品id',
  `name` varchar(255) NOT NULL COMMENT '商品名称',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `lineprice` decimal(10,2) NOT NULL COMMENT '商品划线价格',
  `channel` int(2) NOT NULL COMMENT '商品渠道',
  `stock` int(8) NOT NULL COMMENT '商品kucun',
  `code` varchar(20) NOT NULL COMMENT '商品编号',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
*/