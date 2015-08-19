Rails.application.routes.draw do
  # get '*path' => 'sessions#index'

  mount AceSkin::Engine => '/ace_skin'

  root to: 'sessions#index'
end
