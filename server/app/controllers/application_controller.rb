class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format.json? }

  # ActionController::RoutingError (No route matches [OPTIONS] "/api/:resource"):
  def options
    head :ok
  end

  # unmatched_route exception -> json
  rescue_from ActiveRecord::RecordNotFound, :with => :unmatched_route
  def unmatched_route(exception)
    render json: { success: false, error: exception.message }, :status => :not_found
  end

  # other exception-> json
  rescue_from StandardError do |exception|
    render json: { success: false, error: exception.message }, :status => :internal_server_error
  end
end
