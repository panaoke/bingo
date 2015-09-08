module BaseHelper

	def controller_name
		params[:controller].gsub('/', '.').singularize
	end

	def view_action(id, index = nil)
		I18n.t!("action.#{id}") rescue id.to_s.humanize
	end

	def view_resource(id, index = nil)
		index ||= controller_name
		I18n.t!("#{index}.#{id}") rescue id.to_s.humanize
	end

	def view_title(id, index = nil)
		index ||= controller_name
		I18n.t!("app_title.#{index}.#{id}") rescue id.to_s.humanize
	end

	def view_menu(id)
		I18n.t!("app.#{id}") rescue id.to_s.humanize
	end

end
