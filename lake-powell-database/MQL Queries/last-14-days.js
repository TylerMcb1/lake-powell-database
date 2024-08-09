use(`LP-WATER-DATA`);

var currDate = new Date();

db.LP.find({
    "Date": { $lte: currDate },
    $expr: {
        $gte: [
            "$Date", {
                $subtract: [currDate, 14 * 24 * 60 * 60 * 1000]
            }
        ]
    }
}).sort({ "Date": -1})