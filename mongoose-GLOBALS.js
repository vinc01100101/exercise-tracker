const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	username: String,
	_id: String,
	count: Number,
	log: Array
},{collection: 'exercise_tracker'})

module.exports.collection = mongoose.model('',schema);