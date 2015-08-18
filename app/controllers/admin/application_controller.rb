module Admin
	class ApplicationController < ActionController::Base
		include ::BaseController
		helper BaseHelper

		before_action :find_model_class
		before_filter :admin_before_filter
		protect_from_forgery with: :exception

		def find_model_class
			params[:model_class] ||= self.class.to_s.gsub('Admin::', '').gsub('Controller', '').tableize
		end

		def admin_before_filter
			validate_user
			current_app
		end

		def validate_user
			validate_flag = false
			if user_id && (@user = User.find(user_id) rescue nil)
				validate_flag = true
			end
			unless validate_flag
				session[:visit_url] = env['PATH_INFO'] if env['PATH_INFO'] != '/admin' && env['PATH_INFO'].include?('/sessions/')
				redirect_to('/admin/sessions/new')
			end
		end

		def current_app

		end

		module Common
			def user_id
				session[:user_id]
			end

			def user
				@user ||= User.find(user_id)
			end

			def user_ability
				@user_ability ||= user.ability
			end

			def can?(*arg)
				user_ability.can?(*arg)
			end

			def cannot(*arg)
				user_ability.cannot(*arg)
			end

			def can_read?
				!(permission_manage? && !user_ability.can?(:read, model_singularize_name.to_sym))
			end

			def can_write?
				!(permission_manage? && !user_ability.can?(:write, model_singularize_name.to_sym))
			end


			# # 为了使cancan的生效, 需要重命名改方法为 current_user
			# alias_method :current_user, :user

			def user_name
				user.name
			end

			def current_link_groups
				if @link_groups.nil?
					@link_groups = HashWithIndifferentAccess.new
					::SimpleList::Config.config[:link_groups].each do |g_code, g_config|
						g_config[:links].each do |l_code, l_config|
							if can?(:read, l_code.to_sym)
								if @link_groups[g_code].blank?
									@link_groups[g_code] = g_config

									@link_groups[g_code][:links] = HashWithIndifferentAccess.new
								end

								@link_groups[g_code][:links][l_code] = l_config
							end
						end
					end
				end

				@link_groups
			end

		end

		helper Common
		include Common

	end
end

