# encoding: utf-8
namespace :city do

	desc "根据data/city_info文件导入省市区信息"
	task :import  => :environment do
		path = File.join(Rails.root, 'data/city_info')
		Province.delete_all
		City.delete_all
		Area.delete_all
		province, city, area = nil
		File.open(path) do |file|
			file.each_line do |line|
				next if line.first == '#'

				split_num = line.size - line.squish.size
				id, name = line.squish.split(' ')
				case split_num
		      when 3
			      province = Province.create({id: id, name: name})
		      when 4
						city = City.create({id: id, name: name, province_id: province.id})
					when 5
						area = Area.create({id: id,
						                            name: name,
						                            city_id: city.id,
						                            province_id: province.id,
						                            desc: [province.name, city.name, name].join('-')
						                           })
	       end
			end
		end
		puts ({ region: Province.count, city: City.count, district: District.count})
	end

	def insert_city

	end

	def insert_region

	end

	def insert_district

	end




end