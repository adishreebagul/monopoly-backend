import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rent: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null }
})

const Property = mongoose.model('Property', propertySchema)

export default Property