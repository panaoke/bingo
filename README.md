#模型设计文档

##模型列表

1. 模型设计
	> 1.1 商品 ( user )
	
		字段名				字段类型		  字段说明	
		id:					integer
		name: 				string			# 名称
		login:				string			# 登录名
		password:			string			# 密码
		status:				enum(string)	# 用户状态 {'active' => '激活'， 'unactive' => '未激活'}
		role:				string			# 角色, 决定其管理权限
		
	> 1.2 模板( template)
			
		字段名				字段类型		  字段说明	
		id:					integer
		name: 				string			# 名称
		image_url: 			string			# 图片地址
		shape_type:			enum(string)	# {rectangle: '长方', round: 圆, other: 其他}
		size_type:			enum(string)	# 尺寸类型{ 40_40: '40x40', '50_50': '50x50' }
		category_id:		integer			# 品类id
		
		
	> 1.3 品类( category )
	
		字段名				字段类型		  字段说明	
		id:					integer
		name: 				string			# 名称
		desc: 				string			# 图片地址
		detail:				text			#  一段介绍的富文本
		
	
	> 1.4 会员 ( member )
	
		字段名				字段类型		  字段说明
		
		id: 				string
		name: 				string 		 	# 名称
		phone:				string			# 手机号
		captcha:			string			# 验证码
		captcha_invalid_at: time			# 验证码失效时间
		password:			string			# 密码
		score:				integer			# 用户积分
		last_login_at:		datetime		# 最后一次登录时间
		
	> 1.5 图案(stamp) 	
		
	> x.1 省市区信息
	
	>> x.1.1 省份 ( region )
		
		字段名				字段类型		  字段说明
		
		id: 				string		
		name:				string			# 名称
		
	>> x.1.2 地级市 ( city )
		
		字段名				字段类型		  字段说明
		
		id: 				string		
		name:				string			# 名称
		region_id			string			# 省id
	>> x.1.3 县区 ( district )
		
		字段名				字段类型		  字段说明
		
		id: 				string		
		name:				string			# 名称
		city_id:			string			# 地级市id
		region_id:			string			# 省id, 冗余信息方便查询
		desc: 				string			# 详细地址信息, 格式: 省名称-地级市名称-区名称						