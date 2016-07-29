class AddProcessStatusToEntries < ActiveRecord::Migration
  def change
    add_column :entries, :process_status, :string, default: 'success'
  end
end
