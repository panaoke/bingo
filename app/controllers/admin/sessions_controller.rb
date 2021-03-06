module Admin
	class SessionsController < ::Admin::ApplicationController
		skip_before_filter :admin_before_filter, only: [:new, :create, :destroy]
		layout 'simple_list/login'

		def welcome
			render 'welcome', layout: 'simple_list/application'
		end

		def new
			params[:session] = {login: cookies[:remember_login] }
			if session[:user_id].blank?
				render 'new'
			else
				render 'welcome', layout: 'simple_list/application'
			end
		end

		def create
			login, password = params[:session][:login].try(:squish), params[:session][:password].try(:squish)
			if login.blank? || password.blank?
				@error_info = 'please_input_login_and_password'
				return render 'new'
			end

			user = User.by_scopes({login: login}).first

			if user.blank?
				@error_info = 'login_is_not_exists'
				return render 'new'
			end

			if user.password != password
				@error_info = 'password_is_invalid'
				return render 'new'
			end

			if params[:remember_me].blank?
				cookies[:remember_login] = '' if cookies[:remember_login] == login
			else
				cookies[:remember_login] = login
			end

			session[:user_id] = user.id

			if !session[:visit_url].blank?
				redirect_to session[:visit_url]
				session[:visit_url] = nil

				return
			end

			# 自动跳转到用户的第一个有权限的链接
			user_first_link = (current_link_groups.first.last[:links].first.last[:url] rescue nil)
			return redirect_to user_first_link if user_first_link

			redirect_to(:action => 'welcome')
		end

		def destroy
			session[:user_id] = nil
			params[:session] = {login: cookies[:remember_login]}
			return redirect_to('/admin/sessions/new')
		end

		def update
			name = params[:user][:name].try(:squish)

			status = user.update_attributes({name: name})
			render json: {
					       is_success: status,
					       record: user,
					       error_infos: user.errors.messages.values.flatten
			       }
		end

		def update_psw
			psw, psw_confirm = params[:user][:psw].try(:squish), params[:user][:psw_confirm].try(:squish)

			return render_json({error_infos: ['请输入密码']}) if psw.blank? && psw_confirm.blank?

			return render_json({error_infos: ['两次密码输入不一致']}) if psw != psw_confirm

			user.password = psw
			status = user.save
			render json: {
	       is_success: status,
	       record: user,
	       error_infos: user.errors.messages.values.flatten
			}
		end

		def set_psw
			render 'set_psw', layout: false
		end

		def info
			render 'info', layout: false
		end

		def render_json(options)
			options[:is_success] ||= false
			render json: options
		end

	end
end

