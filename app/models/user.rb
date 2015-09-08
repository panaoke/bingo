class User < ActiveRecord::Base
	include Support::Model
	include BCrypt

	validates_uniqueness_of :login, :message => t(:login_required)
	class_attribute :status_collection, :role_collection
	enum_field :status, collection: {active: '激活', unactive: '未激活'}
	enum_field :role, collection: {admin: '超级管理员', product_manager: '商品管理员', manager: '管理员'}

	def password
		@password ||= Password.new(read_attribute(:password))
	end

	def password=(new_password)
		write_attribute(:password, Password.create(new_password)) unless new_password.blank?
	end

	def ability
		Ability.new(self)
	end

	def to_label
		login
	end

	class Ability
		include CanCan::Ability

		def initialize(user)
			user ||= User.new
			case user.role
				when 'admin'
					can :manage, :all
				when 'manager'
					can :manage, :all
					cannot :write, :user
				when 'product_manager'
					can :manage, :product
					can :manage, :category
			end

			# 用户通用的查看能力
			cannot :write, :report
			cannot :write, :member
			cannot :write, :counter
			can :read, :product
			can :read, :category
			can :read, :member
			cannot :write, :order
			can :ship, :order
			cannot :write, :payment
		end

		def rules
			@rules ||= []
		end

	end

end
