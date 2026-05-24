db.students.insertMany([
    {
        "name": "Umer Khan",
        "age": 25,
        "grades": {
            "math": 85,
            "english": 78,
            "computer": 92
        },
        "address": {
            "city": "Lahore",
            "zipcode": "54000"
        }
    },
    {
        "name": "Ayesha Malik",
        "age": 22,
        "grades": {
            "math": 92,
            "english": 95,
            "computer": 88
        },
        "address": {
            "city": "Islamabad",
            "zipcode": "44000"
        }
    },
    {
        "name": "Bilal Ahmed",
        "age": 24,
        "grades": {
            "math": 75,
            "english": 82,
            "computer": 79
        },
        "address": {
            "city": "Rawalpindi",
            "zipcode": "44000"
        }
    },
    {
        "name": "Sana Khan",
        "age": 23,
        "grades": {
            "math": 88,
            "english": 91,
            "computer": 94
        },
        "address": {
            "city": "Islamabad",
            "zipcode": "44000"
        }
    },
    {
        "name": "Omar Shah",
        "age": 26,
        "grades": {
            "math": 65,
            "english": 72,
            "computer": 81
        },
        "address": {
            "city": "Karachi",
            "zipcode": "75000"
        }
    }
])

db.students.find({
    "grades.english": {$gt: 90}
}).pretty()

db.students.find({
    "address.city": "Islamabad"
}).pretty()

db.students.find({
    "grades.math": {$lt: 80},
    "address.zipcode": "44000"
}).pretty()

db.students.find({}, {
    "name": 1,
    "grades.computer": 1,
    "address.city": 1,
    "_id": 0
}).pretty()

db.students.find({
    "grades.math": {$gte: 70, $lte: 90}
}).pretty()