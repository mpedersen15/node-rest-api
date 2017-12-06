const mongoose = require('mongoose');

let TrendSchema = new mongoose.Schema({
    numDataSets:{
        type: Number,
        default: 0
    },
    score: {
		type: Number,
    },
	startTime: {
        type: Number,
	},
	endTime: {
		type: Number,
    },
    breakdown: {
        type: {
            secondsDeep: Number,
            secondsLight: Number,
            secondsRestless: Number,
            secondsAwake: Number,
            secondsTotal: Number
        },
    },
	_creator: {
		required: true,
		type: mongoose.Schema.Types.ObjectId
	}
});

TrendSchema.methods.updateTrend = function(sleep) {
    let trend = this;
    console.log('Updating trend for ' + trend._creator + ' with sleep ' + JSON.stringify(sleep));
    
    trend.set({numDataSets: trend.numDataSets + 1});
    return trend.save().then(newTrend => {
        console.log('new trend',JSON.stringify(newTrend));
        return newTrend;
    });

    /* return trend.update({
        $inc: {
            numDataSets: 1
        }
    }).then(
        
        trend => {
            console.log('new trend',JSON.stringify(trend));
            return trend;
        }
    ); */

};

const Trend = mongoose.model('Trend', TrendSchema);

module.exports = { Trend };