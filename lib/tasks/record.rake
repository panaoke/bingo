# encoding: utf-8
namespace :record do

	desc "根据配置文件record_up的内容，调用rails脚手脚快速生成model对象的任务"
	task :create  => :environment do
		record_configs = get_record_configs
		created_record_configs = get_records

		record_configs.each do |record_name, record_config|
			record_name = record_name.singularize
			unless created_record_configs.has_key?(record_name)
				created_record_configs.update generate_create_by_record_config(record_name, record_config)
			end
		end

		record_created_models(created_record_configs)
	end

	desc "根据配置文件record_up的内容，调用rails脚手脚对应全部的model"
	task :destroy  => [:environment] do
		created_record_configs = get_records
		name = ENV['name']
		if name && (name = name.singularize)
			generate_destroy_by_record_config(name)
			created_record_configs.delete(name)

			record_created_models(created_record_configs)
		end
	end

	desc "根据配置文件record_up的内容，调用rails脚手脚删除全部的model"
	task :destroy_all  => :environment do

		get_records.keys.each do |record_name|
			generate_destroy_by_record_config(record_name)
		end

		record_created_models({})
	end

	def generate_create_by_record_config(name, fields)
		field_str = fields.map{|field_name, field_type| "#{field_name}:#{format_field_type(field_type)}"}.join(" ")
		puts "create model #{name} start"
		puts "rails generate active_record:model #{name} #{field_str}"
		`rails generate active_record:model #{name} #{field_str}`
		puts "create model #{name} end"
		{name => fields}
	end

	def generate_destroy_by_record_config(name)
		puts "destroy model #{name} start"
		`rails destroy scaffold  #{name}`
		puts "destroy model #{name} end"
	end

	def record_created_models(record_configs)
		File.open(get_record_file, 'w') {|f| f.write record_configs.to_yaml }
	end

	def get_record_file
		unless File.exist? record_file_path
			File.open(record_file_path, "w") {}
		end

		record_file_path
	end

	def get_records
		data = YAML.load_file(File.join(get_record_file))
		data.is_a?(FalseClass) ? { } : data
	end

	def get_record_configs
		YAML.load_file(File.join(Rails.root, 'config/record.yml'))
	end

	def record_file_path
		"#{Rails.root}/config/record_up.yml"
	end

	def format_field_type(type)
		if /enum\([\w]+\)/ =~ type
			type.split(/enum\(/).last.gsub(')', '')
		else
			type
		end
	end

end