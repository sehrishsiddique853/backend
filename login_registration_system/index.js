//part 1
const fs = require("fs");

// Array of JSON files to be merged
const files = ["file1.json", "file2.json", "file3.json", "file4.json", "file5.json", "file6.json", "file7.json"];
let mergedata = []; // Initialize empty array to store merged data

// Loop through each file in the files array
files.forEach(filename => {
    // Read and parse JSON data from each file
    const jsondata = JSON.parse(fs.readFileSync(filename, "utf8"));
    // Concatenate the parsed data to the mergedata array
    mergedata = mergedata.concat(jsondata); 
});

// Write the merged data to a new file called employees.json
// The null and 2 parameters format the JSON with 2-space indentation
fs.writeFileSync("employees.json", JSON.stringify(mergedata, null, 2));

//part 2
const http = require("http");
// Read the merged employees.json file
const data = fs.readFileSync("employees.json", "utf8");
// Parse the JSON data into a JavaScript object
const record = JSON.parse(data);

// Create an HTTP server
const server = http.createServer((req, res) => {
    const url = req.url; // Get the requested URL
    
    // Object to categorize IP addresses by class
    const ipClasses = {
        classA: [], // 1.0.0.1 to 126.255.255.254
        classB: [], // 128.1.0.1 to 191.255.255.254
        classC: [], // 192.0.1.1 to 223.255.254.254
        classD: [], // 224.0.0.0 to 239.255.255.255 (multicast)
        classE: []  // 240.0.0.0 to 255.255.255.254 (reserved)
    };

    // Categorize each record based on IP address class
    record.forEach(info => {
        const ip = info.ip_address;
        // Extract the first octet of the IP address
        const firstOctet = parseInt(ip.substring(0, ip.indexOf(".")));

        // Class A: 1-126
        if (firstOctet >= 1 && firstOctet <= 126) {
            ipClasses.classA.push(info);
        } 
        // Class B: 128-191
        else if (firstOctet >= 128 && firstOctet <= 191) {
            ipClasses.classB.push(info);
        } 
        // Class C: 192-223
        else if (firstOctet >= 192 && firstOctet <= 223) {
            ipClasses.classC.push(info);
        } 
        // Class D: 224-239 (multicast)
        else if (firstOctet >= 224 && firstOctet <= 239) {
            ipClasses.classD.push(info);
        } 
        // Class E: 240-255 (reserved)
        else if (firstOctet >= 240 && firstOctet <= 255) {
            ipClasses.classE.push(info);
        }
    });

    // Set response header to indicate JSON content
    res.setHeader("Content-Type", "application/json");
    
    // Route handling based on URL path
    if (url === "/api/employees/classA") {
        res.writeHead(200); // OK status
        res.end(JSON.stringify(ipClasses.classA, null, 2));
    } else if (url === "/api/employees/classB") {
        res.writeHead(200);
        res.end(JSON.stringify(ipClasses.classB, null, 2));
    } else if (url === "/api/employees/classC") {
        res.writeHead(200);
        res.end(JSON.stringify(ipClasses.classC, null, 2));
    } else if (url === "/api/employees/classD") {
        res.writeHead(200);
        res.end(JSON.stringify(ipClasses.classD, null, 2));
    } else if (url === "/api/employees/classE") {
        res.writeHead(200);
        res.end(JSON.stringify(ipClasses.classE, null, 2));
    } else {
        res.writeHead(404); // Not Found status
        res.end(JSON.stringify({ error: "Route not found" }));
    }
});

// Start the server on port 5555
server.listen(5555, () => {
    console.log("Server is running on http://localhost:5555");
});

//part 3

// Function to delete Class E IP addresses from the records
function deleteCllassE(){
     // Filter out records with Class E IP addresses (240-255)
     const exceptc = record.filter(info => {
        const ip = info.ip_address;
        const firstOctet = parseInt(ip.substring(0, ip.indexOf(".")));
        // Keep only records that are NOT in Class E range
        return !(firstOctet >= 240 && firstOctet <= 255);
    });
        
    // Write the filtered data back to employees.json
    fs.writeFileSync("employees.json", JSON.stringify(exceptc, null, 2));
    console.log("Class E employees deleted successfully!");
}

// Function to update company name for Class D IP addresses
function changeClassD(){
     // Loop through all records
     record.forEach(info => {
        const ip = info.ip_address;
        const firstOctet = parseInt(ip.substring(0, ip.indexOf(".")));
        // If IP is in Class D range (224-239), update company name
        if (firstOctet >= 224 && firstOctet <= 239) {
       info.company="XYZ Corp";
    }
    });
        
    // Write the updated records back to employees.json
    fs.writeFileSync("employees.json", JSON.stringify(record, null, 2));
    console.log("Class D employees updated successfully!");
}

// Function to merge new employees from new_employees.json
function mergenew() {
    // Read and parse both files
    const filenew1 = JSON.parse(fs.readFileSync("employees.json", "utf8"));
    const filenew2 = JSON.parse(fs.readFileSync("new_employees.json", "utf8"));

    // Assign new IDs to new employees starting from 7000
    let i = 7000;
    filenew2.forEach(info => {
        info.id = i; // Assign sequential ID
        i++; // Increment ID counter
    });

    // Merge both arrays
    const mergedata = filenew1.concat(filenew2);

    // Write the combined array back to employees.json
    fs.writeFileSync("employees.json", JSON.stringify(mergedata, null, 2));

    console.log("New employees merged successfully.");
}

function retreiveclassC(){
     // Filter out records with Class E IP addresses (240-255)
     const getc = record.filter(info => {
        const ip = info.ip_address;
        const firstOctet = parseInt(ip.substring(0, ip.indexOf(".")));
        // Keep only records that are NOT in Class E range
        return (firstOctet >= 192 && firstOctet <= 223);
    });
        
    // Write the filtered data back to employees.json
    console.log(getc);
    console.log("Class C employees retrieved successfully!");
}

// Call the functions in sequence
mergenew();     
deleteCllassE();
changeClassD(); 
retreiveclassC()

//part 3
