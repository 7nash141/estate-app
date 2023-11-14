import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
    name: {
        type: String,
        requierd: true,
    },
    description: {
        type: String,
        requierd: true,
    },
    address: {
        type: String,
        requierd: true,
    },
    regularPrice: {
        type: Number,
        requierd: true,

    },
    discountPrice: {
        type: Number,
        requierd: true,

    },
    bathrooms: {
        type: Number,
        requierd: true,
    },
    bedrooms: {
        type: Number,
        requierd: true,
    },
    furnished: {
        type: Boolean,
        requierd: true,
    },
    parking: {
        type: Boolean,
        requierd: true,
    },
    type: {
        type: String,
        requierd: true,
    },
    offer: {
        type: Boolean,
        requierd: true,
    },
    imageUrls: {
        type: Array,
        requierd: true,
    },
    userRef: {
        type: String,
        requierd: true,
    },
}, { timestamps: true });
const Lisiting = mongoose.model('Lisitng', ListingSchema);

export default Lisiting;