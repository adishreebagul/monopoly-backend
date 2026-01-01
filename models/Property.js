import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rent: { type: Number, required: true },
})

const Property = mongoose.model('Property', propertySchema)

export default Property