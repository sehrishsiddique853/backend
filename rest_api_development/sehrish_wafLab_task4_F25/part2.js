use information_db
db.createCollection("information")

db.createCollection("classA")
db.createCollection("classB") 
db.createCollection("classC")
db.createCollection("classD")
db.createCollection("classE")

function classifyIP(ip) {
    var firstOctet = parseInt(ip.split('.')[0]);
    
    if (firstOctet >= 1 && firstOctet <= 126) return "A";
    if (firstOctet >= 128 && firstOctet <= 191) return "B";
    if (firstOctet >= 192 && firstOctet <= 223) return "C";
    if (firstOctet >= 224 && firstOctet <= 239) return "D";
    if (firstOctet >= 240 && firstOctet <= 255) return "E";
    return "Unknown";
}

var cursor = db.information.find();
cursor.forEach(function(doc) {
    var ipClass = classifyIP(doc.ip_address);
    
    switch(ipClass) {
        case "A":
            db.classA.insert(doc);
            break;
        case "B":
            db.classB.insert(doc);
            break;
        case "C":
            db.classC.insert(doc);
            break;
        case "D":
            db.classD.insert(doc);
            break;
        case "E":
            db.classE.insert(doc);
            break;
    }
});

function calculateGenderRatio(collectionName) {
    var total = db[collectionName].count();
    var males = db[collectionName].count({gender: "Male"});
    var females = db[collectionName].count({gender: "Female"});
    
    print("Collection: " + collectionName);
    print("Total: " + total);
    print("Males: " + males);
    print("Females: " + females);
    
    if (females > 0) {
        var ratio = (males / females).toFixed(2);
        print("Ratio: " + ratio + ":1");
    } else {
        print("Ratio: No females");
    }
    print("");
}

var collections = ["information", "classA", "classB", "classC", "classD", "classE"];
collections.forEach(function(coll) {
    calculateGenderRatio(coll);
});

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (var i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

collections.forEach(function(collectionName) {
    var primeDocs = db[collectionName].find().toArray().filter(function(doc) {
        return isPrime(parseInt(doc.id));
    });
    
    var primeIds = primeDocs.map(function(doc) {
        return doc._id;
    });
    
    db[collectionName].deleteMany({
        _id: {$in: primeIds}
    });
    
    print("Deleted from " + collectionName + ": " + primeIds.length);
});

collections.forEach(function(collectionName) {
    var result = db[collectionName].updateMany(
        {email: /\.gov$/},
        {$set: {Organization: "QAU"}}
    );
    
    print("Updated in " + collectionName + ": " + result.modifiedCount);
});