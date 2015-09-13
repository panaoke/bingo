class Template < ActiveRecord::Base
	include Support::Model

	enum_field :shape_type, collection: {rectangle: '长方', round: '圆', other: '其他'}
	enum_field :size_type, collection: { '40_40': '40x40', '50_50': '50x50' }
	enum_boolean :active
	belongs_to :category

	def category_label
		category.name
  end

  def get_svg
    RestClient.get(image_url)
  end


	class << self

		def category_id_collection
			Hash[Category.all.map{|c| [c.id, c.name]}]
    end

    def test
      Category.all.each do |c|
        (1..5).to_a.each do |index|
          self.create({
             "name"=>"精美#{c.name}-#{index}",
             "image_url"=>
                 "http://beauty-dev.oss-cn-hangzhou.aliyuncs.com/fast_upload/1442121141351848.svg",
             "shape_type"=>"rectangle",
             "size_type"=>"40_40",
             "category_id"=> c.id,
             "price"=>998,
             "desc"=>""
          })
        end
      end
    end

	end
end
