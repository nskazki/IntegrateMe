class ErrorsController < ApplicationController
  def raise_unmatched_route
    unmatched_route(ActionController::RoutingError.new("No route matches [#{request.method}] #{request.path}"))
  end
end
