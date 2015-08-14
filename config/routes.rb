Rails.application.routes.draw do
  get '*path' => 'sessions#index'

	root to: 'sessions#index'
end
