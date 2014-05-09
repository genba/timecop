class TimecopMailer < Mailer
  def report(mail_to)
    @yesterday = Worktime
      .joins(:worker)
      .where("worktimes.started_at >= ?", Date.yesterday)
      .where("worktimes.finished_at < ?", Date.today)
      .group(:worker_id)
      .select("worker_id, SUM(worktimes.workedtime) as sum")

    @week = Worktime
      .joins(:worker)
      .where("worktimes.started_at >= ?", Date.today - 7.days)
      .where("worktimes.finished_at < ?", Date.today)
      .group(:worker_id)
      .select("worker_id, SUM(worktimes.workedtime) as sum")

    @month = Worktime
      .joins(:worker)
      .where("worktimes.started_at >= ?", Date.today - 1.month)
      .where("worktimes.finished_at < ?", Date.today)
      .group(:worker_id)
      .select("worker_id, SUM(worktimes.workedtime) as sum")

    mail :to => mail_to,
      :subject => "Timecop report"
  end
end
