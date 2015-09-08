module Support
	class Log < ::Logger

		def initialize(arg)
			super(*arg)
			@default_formatter = Formatter.new
		end

		class Formatter < ::Logger::Formatter
			Format = "%s [%s] %s\n"

			def initialize
				@datetime_format = ""
			end

			def call(severity, datetime, progname, msg)
				Format % [datetime, severity, msg2str(msg)]
			end

		end

		module LogMethods
			[:info, :debug, :warn, :error, :fail, :unkonow].each do |log_type|
				define_method "logger_#{log_type}" do |msg|
					logger_support.send(log_type, msg)
				end
			end

			def logger_support
				self.support_logger ||= Support::Log.new(format_file_name support_logger_file)
			end

			def format_file_name(file_name)
				"#{file_name.split('.').first}.log"
			end
		end

	end
end