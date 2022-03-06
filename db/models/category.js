import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CategorySchema = new Schema({
    Id: Number,
    ParentID: Number,
    Name: String,
    SeName: String,
    Position: Number,
    NameForTracking: String
});

CategorySchema.add({
    Categories: [CategorySchema]
});

export const Category = model('Category', CategorySchema);