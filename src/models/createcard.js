const mongoose = require('mongoose');
const { Schema } = mongoose;
const personSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    age: Number,
    stories: [{ type: Schema.Types.ObjectId, ref: '' }]
  });
  