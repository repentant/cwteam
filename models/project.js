let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let projectSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    createdAt: Date,
    active: Boolean,
    team: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: String
    }]

});

module.exports = mongoose.model('Project', projectSchema);