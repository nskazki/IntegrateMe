class MailListsController < ApplicationController
  # GET /mail_lists.json
  def index
    # return render json: params
    mail_api_key = params[:mail_api_key]
    if (mail_api_key.nil? || mail_api_key.empty?)
      return render json: {
          success: false,
          errors: { mail_api_key: "can't be blank" }
      }, :status => :bad_request
    end

    mail_api = MailApi.new(mail_api_key)
    return render json: mail_api.get_lists
  end
end
