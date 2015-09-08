module ApplicationHelper
	def current_app
		@current_app = nil
		fullpath = request.fullpath
		@current_app = 'index' if fullpath == '/'
		@current_app = 'cart' if /^\/carts/ =~ fullpath
		@current_app = 'user' if /^\/members\/my_account/ =~ fullpath

		@current_app
	end
end
