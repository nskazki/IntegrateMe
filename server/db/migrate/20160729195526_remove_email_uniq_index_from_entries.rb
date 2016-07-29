class RemoveEmailUniqIndexFromEntries < ActiveRecord::Migration
  def change
    remove_index :entries, column: [:competition_id, :email]
  end
end
