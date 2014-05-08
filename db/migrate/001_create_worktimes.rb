class CreateWorktimes < ActiveRecord::Migration
  def change
    create_table :worktimes do |t|
      t.integer :issue_id, :null => false
      t.integer :worker_id, :null => false
      t.timestamp :started_at, :null => false
      t.timestamp :finished_at, :null => false
      t.integer :workedtime, :default => 0, :null => false
    end
  end
end
