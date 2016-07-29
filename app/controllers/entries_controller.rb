class EntriesController < ApplicationController
  # allow POST { "entry": { "name": "some-name" ... } } and { "name": "some-name" ... }
  wrap_parameters :entry

  # GET /entries.json
  def index
    @entries = Entry.all
    render json: @entries
  end

  # POST /entries.json
  def create
    @entry = Entry.new(entry_params)

    if @entry.save
      render json: {success: true}
    else
      render json: {success: false, errors: @entry.errors}
    end
  end

  private
  # Never trust parameters from the scary internet, only allow the white list through.
  def entry_params
    params.require(:entry).permit(:competition_id, :name, :email)
  end

end
