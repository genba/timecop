module TimecopMailerHelper
  def readable_time(secondsTotal)
    hours = (secondsTotal / 60 / 60).floor
    secondsTotal -= (hours * 60 * 60)

    minutes = (secondsTotal / 60).floor
    secondsTotal -= (minutes * 60);

    seconds = secondsTotal;

    "%5d:%02d:%02d" % [hours, minutes, seconds]
  end
end
