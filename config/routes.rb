get 'worktimes', :to => 'worktimes#index'
resource :worktimes, :only => [:create, :update, :destroy]
