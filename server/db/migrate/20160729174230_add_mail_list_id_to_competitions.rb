class AddMailListIdToCompetitions < ActiveRecord::Migration
  def change
    add_column :competitions, :mail_list_id, :string
  end
end
