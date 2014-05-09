class WorktimesController < ApplicationController
  unloadable

  def index
    worktimes = Worktime.where(:issue_id => params[:issue_id])
    render :json => worktimes.to_json(:include => { :worker => { :only => :firstname } }), :status => :ok
  end

  def create
    worktime = Worktime.new({
        started_at: params[:started_at],
        finished_at: params[:finished_at],
        worker: User.current,
        issue_id: params[:issue_id]
      })

    worktime.save

    render :json => worktime.to_json(:include => { :worker => { :only => :firstname } }), :status => :created
  rescue => e
    Rails.logger.error e
    render :json => true, :status => :unprocessable_entity
  end

  def update
    worktime = Worktime.find(params[:id])
    worktime.started_at = params[:started_at]
    worktime.finished_at = params[:finished_at]

    worktime.save

    render :json => worktime.to_json(:include => { :worker => { :only => :firstname } }), :status => :ok
  rescue => e
    Rails.logger.error e
    render :json => true, :status => :unprocessable_entity
  end

  def destroy
    worktime = Worktime.find(params[:id])
    worktime.destroy

    render :json => {:id => params[:id]}, :status => :ok
  rescue => e
    Rails.logger.error e
    render :josn => true, :status => :unprocessable_entity
  end
end
