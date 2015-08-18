module Admin
	module BaseHelper

		def model_url
			"/admin/#{model_singularize_name.tableize}"
		end


	end
end

