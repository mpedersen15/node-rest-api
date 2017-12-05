var mongoose = require('mongoose');

let SleepSchema = new mongoose.Schema({
    score: {
		type: Number,
		// required: true,
    },
    rawData: {
        type: [],
        required:true
    },
	startTime: {
        type: Number,
        required: true
	},
	endTime: {
		type: Number,
        required: true
    },
    processedData: {
        type: [],
        // required: true
    },
    breakdown: {
        type: {
            secondsDeep: Number,
            secondsLight: Number,
            secondsRestless: Number,
            secondsAwake: Number,
            secondsTotal: Number
        },
        // required: true
    },
	_creator: {
		required: true,
		type: mongoose.Schema.Types.ObjectId
	}
});

SleepSchema.pre('save', function(next) {
    let sleep = this;

    console.log('sleep', JSON.stringify(sleep));
    let { processedData, score, breakdown } = processData(sleep.rawData);
    console.log('do we get to the processed data?');
    sleep.processedData = processedData;
    sleep.score = score;
    sleep.breakdown = breakdown;

    next();
});

var Sleep = mongoose.model('Sleep', SleepSchema);



function processData(rawData) {
    
    let processedData = [];
    for (let i = 0, numEls = rawData.length; i < numEls; i++){
        processedData.push(rawData[i] * 2);
    }

    let score = Math.random() * 30 + 70;

    let breakdown = {
        secondsAwake: 10,
        secondsRestless: 15,
        secondsLight: 20, 
        secondsDeep: 25,
        secondsTotal: 70
    };

    console.log('processedData', JSON.stringify(processedData));
    console.log('score', score);
    console.log('breakdown', JSON.stringify(breakdown));

    return {
        processedData,
        score,
        breakdown
    };
}

module.exports = {Sleep};

