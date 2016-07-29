class AddOwnerEmailToCompetitions < ActiveRecord::Migration
  def change
    add_column :competitions, :owner_email, :string
  end
end
