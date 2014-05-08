module Timecop
  module Hooks
    class ViewIssuesShowDescriptionBottomHook < Redmine::Hook::ViewListener
      render_on(:view_issues_show_description_bottom, :partial => 'worktimes/index', :layout => false)
    end
  end
end
