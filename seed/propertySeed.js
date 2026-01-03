import mongoose from '../db.js'
import Property from '../models/Property.js'

const properties = [
  { name: 'Crimson Alley', price: 60, rent: 2 },
  { name: 'Azure Street', price: 60, rent: 4 },

  { name: 'Iron Station', price: 200, rent: 25 },

  { name: 'Emerald Road', price: 100, rent: 6 },

  { name: 'Emerald Lane', price: 100, rent: 6 },
  { name: 'Emerald Court', price: 120, rent: 8 },

  { name: 'Sapphire Way', price: 140, rent: 10 },
  { name: 'Energy Grid', price: 150, rent: 15 },
  { name: 'Sapphire Path', price: 140, rent: 10 },
  { name: 'Sapphire Plaza', price: 160, rent: 12 },

  { name: 'Sky Station', price: 200, rent: 25 },

  { name: 'Amber Street', price: 180, rent: 14 },
  { name: 'Amber Avenue', price: 180, rent: 14 },
  { name: 'Amber Boulevard', price: 200, rent: 16 },


  { name: 'Ruby Road', price: 220, rent: 18 },

  { name: 'Ruby Lane', price: 220, rent: 18 },
  { name: 'Ruby Court', price: 240, rent: 20 },

  { name: 'Steel Station', price: 200, rent: 25 },

  { name: 'Onyx Street', price: 260, rent: 22 },
  { name: 'Onyx Avenue', price: 260, rent: 22 },
  { name: 'Water Works', price: 150, rent: 15 },
  { name: 'Onyx Plaza', price: 280, rent: 24 },

  { name: 'Obsidian Way', price: 300, rent: 26 },
  { name: 'Obsidian Path', price: 300, rent: 26 },
  { name: 'Obsidian Court', price: 320, rent: 28 },

  { name: 'Void Station', price: 200, rent: 25 },

  { name: 'Crown Avenue', price: 350, rent: 35 },
  { name: 'Crown Plaza', price: 400, rent: 50 }
]

const seedProperties = async () => {
  await Property.deleteMany()
  await Property.insertMany(properties)
  console.log('✅ 40 properties seeded')
  process.exit()
}

seedProperties()
