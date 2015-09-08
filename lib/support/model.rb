module Support
	module Model
		extend ActiveSupport::Concern


		module InstanceMethods

			def serialize_attrs attribute_keys
				(attribute_keys || []).each_with_object({}) do |attr, attrs|
					default_method = "#{attr}_serialize".to_sym
					begin
						attrs[attr] = self.send(self.respond_to?(default_method) ? default_method : attr)
					rescue => err
						raise err if Rails.env == 'development'
					end
				end
			end

			def full_error_messages
				errors.map { |_attribute, message| message }
			end

		end

		module ClassMethods
			def t(*args)
				key = args[0]
				args[0] = "#{tableize}.#{key}"

				I18n.t(args)
			end

			def tableize
				self.name.tableize
			end

			def enum_field(field_name, options)
				options = options.symbolize_keys
				options[:type] ||= :string

				collection_name = "#{field_name}_collection"


				class_attribute collection_name
				self.send("#{collection_name}=", options[:collection])

				send :define_method, "#{field_name}_label" do
					format_value = options[:type] == :integer ? self.send(field_name) : self.send(field_name).try(:to_sym)
					self.send(collection_name)[format_value]
				end

				send :define_method, "#{field_name}=" do |value|
					format_value = options[:type] == :integer ? value.to_i : value.to_sym
					if self.send(collection_name)[format_value]
						self.send(:write_attribute, field_name, format_value)
					else
						self.send(:write_attribute, field_name, options[:default]) if options[:default]
					end
				end

				define_singleton_method("default_#{field_name}") do
					options[:default] || options[:collection].keys.first
				end

			end

			def enum_boolean(field_name)
				enum_field field_name, collection: { true => '是', false => '否' }
			end

			def validate_field(filter_name, field, error_message, &block)
				validate_method_name = :"validate_#{field}"

				send :define_method, validate_method_name do
					flag = false
					(flag = yield(self)) rescue nil
					self.errors.add(field, error_message) unless flag
					flag
				end

				self.send(filter_name, validate_method_name)
			end

		end

		included do
			self.send(:include, InstanceMethods)
			self.send(:extend, ClassMethods)
		end

	end
end