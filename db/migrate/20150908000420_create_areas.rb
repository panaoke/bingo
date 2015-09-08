class CreateAreas < ActiveRecord::Migration
  def change
    create_table :areas do |t|
      t.string :name
      t.string :city_id
      t.string :province_id

      t.timestamps null: false
    end
  end
end
