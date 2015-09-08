class Template < ActiveRecord::Base
	include Support::Model

	enum_field :shape_type, collection: {rectangle: '长方', round: '圆', other: '其他'}
	enum_field :size_type, collection: { '40_40': '40x40', '50_50': '50x50' }
	enum_boolean :active


	class << self
		def category_id_collection
			Hash[Category.all.map{|c| [c.id, c.name]}]
		end
	end
end
