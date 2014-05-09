namespace :timecop do
  desc "Send Timecop report"
  task :report, [:mail_to] => :environment do |t, args|
    TimecopMailer.report(args[:mail_to]).deliver
  end
end
