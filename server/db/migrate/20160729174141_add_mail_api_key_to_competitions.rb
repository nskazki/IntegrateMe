class AddMailApiKeyToCompetitions < ActiveRecord::Migration
  def change
    add_column :competitions, :mail_api_key, :string
  end
end
