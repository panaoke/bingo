class Time

	# 时间戳, 精确到秒
	def stamp
		@stamp ||= "#{strftime('%y%m%d%H%M%S')}"
	end

end