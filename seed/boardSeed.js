import mongoose from '../db.js'
import Property from '../models/Property.js'
import BoardTile from '../models/BoardTile.js'

const seedBoard = async () => {
  await BoardTile.deleteMany()
  const getProp = async (name) => await Property.findOne({ name })

  const tiles = [
    { index: 0, type: 'GO' },

    { index: 1, type: 'PROPERTY', property: await getProp('Crimson Alley') },
    { index: 2, type: 'CARD' }, // Mystic Chest
    { index: 3, type: 'PROPERTY', property: await getProp('Azure Street') },
    { index: 4, type: 'TAX' }, // Income Tax

    { index: 5, type: 'STATION', property: await getProp('Iron Station') },

    { index: 6, type: 'PROPERTY', property: await getProp('Emerald Road') },
    { index: 7, type: 'CARD' },
    { index: 8, type: 'PROPERTY', property: await getProp('Emerald Lane') },
    { index: 9, type: 'PROPERTY', property: await getProp('Emerald Court') },
    { index: 10, type: 'JAIL' },

    { index: 11, type: 'PROPERTY', property: await getProp('Sapphire Way') },
    { index: 12, type: 'UTILITY', property: await getProp('Energy Grid') },
    { index: 13, type: 'PROPERTY', property: await getProp('Sapphire Path') },
    { index: 14, type: 'PROPERTY', property: await getProp('Sapphire Plaza') },
    { index: 15, type: 'STATION', property: await getProp('Sky Station') },

    { index: 16, type: 'PROPERTY', property: await getProp('Amber Street') },
    { index: 17, type: 'CARD' },
    { index: 18, type: 'PROPERTY', property: await getProp('Amber Avenue') },
    { index: 19, type: 'PROPERTY', property: await getProp('Amber Boulevard') },
    { index: 20, type: 'FREE_PARKING' },

    { index: 21, type: 'PROPERTY', property: await getProp('Ruby Road') },
    { index: 22, type: 'CARD' },
    { index: 23, type: 'PROPERTY', property: await getProp('Ruby Lane') },
    { index: 24, type: 'PROPERTY', property: await getProp('Ruby Court') },
    { index: 25, type: 'STATION', property: await getProp('Steel Station') },

    { index: 26, type: 'PROPERTY', property: await getProp('Onyx Street') },
    { index: 27, type: 'PROPERTY', property: await getProp('Onyx Avenue') },
    { index: 28, type: 'UTILITY', property: await getProp('Water Works') },
    { index: 29, type: 'PROPERTY', property: await getProp('Onyx Plaza') },
    { index: 30, type: 'GO_TO_JAIL' },

    { index: 31, type: 'PROPERTY', property: await getProp('Obsidian Way') },
    { index: 32, type: 'PROPERTY', property: await getProp('Obsidian Path') },
    { index: 33, type: 'CARD' },
    { index: 34, type: 'PROPERTY', property: await getProp('Obsidian Court') },
    { index: 35, type: 'STATION', property: await getProp('Void Station') },

    { index: 36, type: 'PROPERTY', property: await getProp('Crown Avenue') },
    { index: 37, type: 'TAX' }, // Luxury Tax
    { index: 38, type: 'PROPERTY', property: await getProp('Crown Plaza') },
    { index: 39, type: 'CARD' }, // optional last card
  ]

  await BoardTile.insertMany(tiles)
  console.log('✅ 40 board tiles seeded')
  process.exit()
}

seedBoard()
