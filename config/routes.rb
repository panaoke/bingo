Rails.application.routes.draw do
  # get '*path' => 'sessions#index'

	mount AceSkin::Engine => '/ace_skin'
	mount SimpleList::Engine => '/simple_list'

	namespace :admin do
		resources :users do
			member do
				put :active
				put :unactive
			end
		end
		resources :sessions, only: [:new, :create]
		get '/logout' , :controller => 'sessions' , :action => 'destroy'
		get '' , :controller => 'sessions' , :action => 'welcome'


	end

	root to: 'sessions#index'
end
