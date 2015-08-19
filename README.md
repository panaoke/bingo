#模型设计文档

##模型列表

1. 模型设计
	> 1.1 管理用户 ( user ) 后台管理系统的使用者
	
		字段名				字段类型		  字段说明	
		id:					integer
		name: 				string			# 名称
		login:				string			# 登录名
		password:			string			# 密码
		status:				enum(string)	# 用户状态 {'active' => '激活'， 'unactive' => '未激活'}
		role:				enum(string)	# 角色, 决定其管理权限 {admin: '超级管理员'}
		
	> 1.2 模板( template)  美工预先制作好印章模板的信息记录
			
		字段名				字段类型		  字段说明	
		id:					integer
		name: 				string			# 名称
		image_url: 			string			# 图片地址
		shape_type:			enum(string)	# {rectangle: '长方', round: 圆, other: 其他}
		size_type:			enum(string)	# 尺寸类型{ 40_40: '40x40', '50_50': '50x50' }
		category_id:		integer			# 品类id
		active:				boolean			# 是否激活, 激活后可用, default: true
		
		
	> 1.3 品类( category ) 模板的分类
	
		字段名				字段类型		  字段说明	
		id:					integer
		name: 				string			# 名称
		desc: 				string			# 描述文字
		detail:				text			# 一段介绍的富文本
		
	
	> 1.4 会员 ( member ) 网站会员的信息记录
	
		字段名				字段类型		  字段说明
		
		id: 				string
		name: 				string 		 	# 名称
		phone:				string			# 手机号
		captcha:			string			# 验证码
		captcha_invalid_at: time			# 验证码失效时间
		password:			string			# 密码
		last_login_at:		datetime		# 最后一次登录时间

	> 1.5 会员收货地址 ( address )

		字段名				字段类型		  字段说明

		id: 				string
		member_id:			integer			# 会员id
		person:				string			# 收货人
		phone:				string			# 电话
		area_id:			integer			# 区域id
		area_desc:			string			# 区域信息
		detail:				string			# 街道地址
		
	> 1.6 图案( stamp ) 	会员对模板编辑后保存的结果
		
		字段名				字段类型		  字段说明

		id: 				string
		m_uuid:				string			# 会员的uuid
		member_id:			string			# 会员的id
		image_url:			string			# 图片的地址
		template_id:		string			# 参考模板的id
		price:				decimal			# 价格
	
	> 1.7 订单 ( order )

		字段名				字段类型		  字段说明

		id: 				string
		m_uuid:				string			# 会员的uuid
		member_id:			string			# 会员的id
		person:				string			# 收货人
		area_id:			integer			# 收货区域id
		address:			string			# 收货详情地址
		phone:				string			# 电话
		pay_status:			enum(string)	# 支付状态{init: '待支付', success: '支付成功', failed: '支付失败'}
		pay_way:			string			# 支付方式{alipay: '支付宝', wap_alipay: '支付宝无线'}
		payment_no:			string			# 支付流水编号
		amount:				decimal			# 总额
		shipment:			decimal			# 快递费
		shipment_code:		enum(string)	# 快递公司标识 {sf: '顺丰', yt: '圆通', st: '申通', ems: '邮政'}
		shipment_no:		string			# 快递单号
				
	> 1.8 订单条目 (order_item)

		字段名				字段类型		  字段说明

		id: 				string
		order_id:			integer			# 订单id
		stamp_id:			integer			# 图案的id
		num:				integer			# 数量
		price:				decimal			# 单价价格

	> 1.9 支付流水 ( payment ) 记录订单支付信息

		id:					integer
		payment_no:			string			# 支付编号
		order_id:			integer			# 订单id
		order_no:			string			# 订单号
		total_fee:			float			# 总费用
	    subject:			string			# 简要概述
	    member_code: 		string			# 用户的标识符
	    pay_way:			enum(string)	# 支付方式 {wap_alipay: '支付宝无线网页', alipay: '支付宝'}
	    status:				enum(string)	# 支付状态{'init' => '初始化', 'paying' => '支付中',
	    										'success' => '支付完成', 'failed' => '支付失败'}
	    trade_no:			string			# 支付流水号， 由支付接口返回

	> x.0 留言其消息通知 ( msg )

		字段名				字段类型		  字段说明

		id: 				string

		member_id:			integer			# 订单id
		m_uuid:				string			# 会员的uuid
		msg_code:			integer			# {0: '系统通知', 1: '给单一会员的回复', 2: '会员的意见'}
		title:				string			# 标题
		content:			text			# 内容


	> x.1 省市区信息
	
	>> x.1.1 省份 ( province )
		
		字段名				字段类型		  字段说明
		
		id: 				string		
		name:				string			# 名称
		
	>> x.1.2 地级市 ( city )
		
		字段名				字段类型		  字段说明
		
		id: 				string		
		name:				string			# 名称
		province_id			string			# 省id
	>> x.1.3 县区 ( area )
		
		字段名				字段类型		  字段说明
		
		id: 				string		
		name:				string			# 名称
		city_id:			string			# 地级市id
		province_id:		string			# 省id, 冗余信息方便查询
		desc: 				string			# 详细地址信息, 格式: 省名称-地级市名称-区名称						