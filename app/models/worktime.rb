class Worktime < ActiveRecord::Base
  unloadable

  belongs_to :worker, :class_name => 'User', :foreign_key => 'worker_id'

  before_save :calculate_workedtime

  validates_presence_of :started_at
  validates_presence_of :finished_at
  validates_presence_of :issue_id
  validates_presence_of :worker_id

  private
  def calculate_workedtime
    self.workedtime = self.finished_at - self.started_at
  end
end
