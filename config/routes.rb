Rails.application.routes.draw do
  # get '*path' => 'sessions#index'

  resources :templates

	mount AceSkin::Engine => '/ace_skin'
	mount SimpleList::Engine => '/simple_list'

	namespace :admin do
		resources :users do
			member do
				put :active
				put :unactive
			end
		end
		resources :sessions, only: [:new, :create, :update] do
			collection do
				get :set_psw
				get :info
			end
			member do
				put :update_psw
			end
		end
		get '/logout' , :controller => 'sessions' , :action => 'destroy'
		get '/login' , :controller => 'sessions' , :action => 'welcome'
		get '' , :controller => 'sessions' , :action => 'welcome'

	end

	root to: 'sessions#index'
end
