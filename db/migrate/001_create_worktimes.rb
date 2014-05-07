class CreateWorktimes < ActiveRecord::Migration
  def change
    create_table :worktimes do |t|
      t.integer :issue_id
      t.integer :worker_id
      t.timestamp :started_at
      t.timestamp :finished_at
    end
  end
end
