class EntriesController < ApplicationController
  # allow POST { "entry": { "name": "some-name" ... } } and { "name": "some-name" ... }
  wrap_parameters :entry

  # GET /entries.json
  def index
    entries = Entry.all
    render json: entries
  end

  # POST /entries.json
  def create
    allowed_params = entry_params
    entry = Entry.new allowed_params

    unless entry.valid?
      return render json: {
          success: false,
          errors: entry.errors
      }, :status => :bad_request
    end

    mail_api_key = entry.competition.mail_api_key
    mail_list_id = entry.competition.mail_list_id
    mail_api = MailApi.new mail_api_key

    begin
      mail_api.add_member_to_list mail_list_id, allowed_params[:email], allowed_params[:name]
    rescue => e
      entry.process_status = 'problem'
      entry.save!
      # will be handled by ApplicationController
      raise e
    end

    entry.save!
    return render json: { success: true }
  end

  private
  # Never trust parameters from the scary internet, only allow the white list through.
  def entry_params
    params.require(:entry).permit(:competition_id, :name, :email)
  end

end
