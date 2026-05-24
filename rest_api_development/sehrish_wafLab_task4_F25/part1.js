use ali_database

db.createCollection("personals_collection")

db.personals_collection.insertMany([
    {
        "registration_number": "001",
        "name": "Ali Ahmed",
        "city": "Rawalpindi"
    },
    {
        "registration_number": "002", 
        "name": "Sara Khan",
        "city": "Islamabad"
    },
    {
        "registration_number": "003",
        "name": "Usman Malik", 
        "city": "Lahore"
    },
    {
        "registration_number": "004",
        "name": "Fatima Raza",
        "city": "Rawalpindi"
    },
    {
        "registration_number": "005",
        "name": "Bilal Hassan",
        "city": "Karachi"
    }
])

db.createCollection("academics_collection")

db.academics_collection.insertMany([
    {
        "registration_number": "001",
        "degree_enrolled": "Computer Science",
        "enrollment_year": 2020,
        "favorite_course": "Database Systems"
    },
    {
        "registration_number": "002",
        "degree_enrolled": "Electrical Engineering", 
        "enrollment_year": 2019,
        "favorite_course": "Circuit Analysis"
    },
    {
        "registration_number": "003",
        "degree_enrolled": "Business Administration",
        "enrollment_year": 2018,
        "favorite_course": "Marketing"
    },
    {
        "registration_number": "004",
        "degree_enrolled": "Software Engineering",
        "enrollment_year": 2019,
        "favorite_course": "Web Development"
    },
    {
        "registration_number": "005",
        "degree_enrolled": "Data Science",
        "enrollment_year": 2021,
        "favorite_course": "Machine Learning"
    }
])

db.personals_collection.find().pretty()

db.academics_collection.find().pretty()

db.personals_collection.find(
    {city: "Rawalpindi"}, 
    {name: 1, _id: 0}
).pretty()

db.academics_collection.aggregate([
    {
        $match: {enrollment_year: 2019}
    },
    {
        $lookup: {
            from: "personals_collection",
            localField: "registration_number", 
            foreignField: "registration_number",
            as: "personal_info"
        }
    },
    {
        $unwind: "$personal_info"
    },
    {
        $project: {
            name: "$personal_info.name",
            enrollment_year: 1,
            _id: 0
        }
    }
]).pretty()

db.personals_collection.updateMany(
    {city: {$in: ["Rawalpindi", "Islamabad"]}},
    {$set: {city: "Rawalpindi/Islamabad"}}
)

db.personals_collection.find().pretty()

var early_students = db.academics_collection.find(
    {enrollment_year: {$lt: 2019}}
).toArray()

var reg_numbers = early_students.map(function(student) {
    return student.registration_number
})

db.personals_collection.deleteMany({
    registration_number: {$in: reg_numbers}
})

db.academics_collection.deleteMany({
    enrollment_year: {$lt: 2019}
})

db.personals_collection.find().pretty()
db.academics_collection.find().pretty()