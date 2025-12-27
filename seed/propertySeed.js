import mongoose from '../db.js'
import Property from '../models/Property.js'

const properties = [
    {
        name: 'Boardwalk',
        price: 400,
        rent: 50,
        images: 'boardwalk.png'
    },
    {
        name: 'Park Place',
        price: 350,
        rent: 35,
        image: 'park-place.png'
    }
]
const seedProperties = async () => {
    try {
        await Property.deleteMany()
        await Property.insertMany(properties)
        console.log('Properties seeded successfully')
        process.exit()
    }
    catch(error) {
        console.error(error)
        process.exit(1)
    }
}

seedProperties()

