class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format.json? }

  # exception-> json
  rescue_from StandardError do |exception|
    render json: { error: exception.message }, :status => 500
  end
end
