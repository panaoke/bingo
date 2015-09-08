class AppConfig
	class_attribute :config
	self.config = HashWithIndifferentAccess.new(YAML.load_file("#{Rails.root}/config/app_config.yml")[Rails.env])
end