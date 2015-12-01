#模型设计文档

##模型列表

1. 模型设计
	> 1.1 用户模型( user ) 后台管理系统的使用者
	
		字段名				字段类型		  字段说明	
		id:					BsonId
		name: 				string			# 名称
		login:				string			# 登录名
		password:			string			# 密码
		status:				enum(string)	# 用户状态 {'active' => '激活'， 'unactive' => '未激活'}
		role:				enum(string)	# 角色, 决定其管理权限 {admin: '超级管理员'}
		
	> 1.2 商户(merchant）
		
		字段名				字段类型		  字段说明	
		id:					BsonId			# 商户号
		name: 				string			# 商户名称
		login:				string			# 登录名
		password:			string			# 密码
		status:				enum(string)	# 用户状态 {'active' => '激活'， 'unactive' => '未激活'}
		role:				enum(string)	# 角色, 决定其管理权限 {admin: '超级管理员'}
		
	> 1.3 模板( template )  美工预先制作好印章模板的信息记录
			
		字段名				字段类型		  字段说明	
		id:					BsonId
		merchant_id:		BsonId			# 商户号, null表示公共模板
		name: 				string			# 名称
		image_url: 			string			# 图片地
		shape_type:			enum(string)	# {rectangle: '长方', round: '圆', other: '其他'}
		height:				integer			# 高度(单位像素)
		width:				integer			# 宽度(单位像素)
		category_id:		integer			# 品类id
		active:				boolean			# 是否激活, 激活后可用, default: true
		price:				decimal			# 价格

	> 1.4 品类( category ) 模板的分类
	
		字段名				字段类型		  字段说明	
		id:					BsonId
		name: 				string			# 名称
		desc: 				string			# 描述文字
		detail:				text			# 一段介绍的富文本
		sort_num:			integer			# 排序字段
	
	> 1.5 会员 ( member ) 网站会员的信息记录
	
		字段名				字段类型		  字段说明
		
		id: 				BsonId
		m_uuid:				string			# 用户访问时记录在cookie中, 用于标示用户身份
		
	> 1.6 图案( stamp ) 	会员对模板编辑后保存的结果
		
		字段名				字段类型		  字段说明

		id: 				string
		member_id:			BsonId			# 会员的id
		svg_detail:			String			# 图片的地址
		template_id:		BsonId			# 参考模板的id
		price:				decimal			# 价格
	
	> 1.7 订单 ( order )

		字段名				字段类型		  字段说明

		id: 				string
		member_id:			BsonId			# 会员的id

	> 1.8 订单条目 (order_item)

		字段名				字段类型		  字段说明

		id: 				string
		order_id:			integer			# 订单id
		stamp_id:			integer			# 图案的id
		num:				integer			# 数量
		price:				decimal			# 单价价格