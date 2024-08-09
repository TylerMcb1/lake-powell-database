use(`LP-WATER-DATA`);

var oldDate = new Date("1983-07-01T00:00:00Z");
var newDate = new Date("1983-07-15T00:00:00Z");

db.LP.find({
    "Date": {
        $gte: oldDate,
        $lte: newDate
    }
}).sort({ "Date": -1})