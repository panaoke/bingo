class TemplatesController < ApplicationController
  layout 'application'
  before_action :find_temp, only: [:show]

  def show

  end

  def find_temp
    @temp ||= Template.find(params[:id])
  end


end
