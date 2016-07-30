class CompetitionsController < ApplicationController
  # allow POST { "competition": { "name": "some-name" } } and { "name": "some-name" }
  wrap_parameters :competition

  # GET /competitions.json
  def index
    competitions = Competition.all
    render json: competitions
  end

  # GET /competitions/:id.json
  def show
    competitions = Competition.find(params[:id])
    render json: competitions
  end

  # POST /competitions.json
  def create
    allowed_params = competition_params
    competition = Competition.new(allowed_params)

    unless competition.valid?
      return render json: {
          success: false,
          errors: competition.errors
      }, :status => :bad_request
    end

    mail_api = MailApi.new(allowed_params[:mail_api_key])
    check_result = mail_api.check_list allowed_params[:mail_list_id]
    unless check_result .nil?
      return render json: {
          success: false,
          errors: { mail_list_id: check_result }
      }, :status => :bad_request
    end

    competition.save!
    return render json: { success: true }
  end

  private
  # Never trust parameters from the scary internet, only allow the white list through.
  def competition_params
    params.require(:competition).permit(:name, :requires_entry_name, :owner_email, :mail_api_key, :mail_list_id)
  end
end
