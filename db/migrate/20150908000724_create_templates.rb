class CreateTemplates < ActiveRecord::Migration
  def change
    create_table :templates do |t|
      t.string :name
      t.string :image_url
      t.string :shape_type
      t.string :size_type
      t.integer :category_id
      t.boolean :active
      t.decimal :price
      t.text :desc

      t.timestamps null: false
    end
  end
end
