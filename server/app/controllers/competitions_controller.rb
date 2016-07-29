class CompetitionsController < ApplicationController
  # allow POST { "competition": { "name": "some-name" } } and { "name": "some-name" }
  wrap_parameters :competition

  # GET /competitions.json
  def index
    @competitions = Competition.all
    render json: @competitions
  end

  # GET /competitions/:id.json
  def show
    @competitions = Competition.find(params[:id])
    render json: @competitions
  end

  # POST /competitions.json
  def create
    @competition = Competition.new(competition_params)

    if @competition.save
      render json: {success: true}
    else
      render json: {success: false, errors: @competition.errors}
    end
  end

  private
  # Never trust parameters from the scary internet, only allow the white list through.
  def competition_params
    params.require(:competition).permit(:name, :requires_entry_name)
  end
end
