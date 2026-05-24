const fs =require("fs");
fs.writeFileSync("./IP_Class_A.txt","");
fs.writeFileSync("./IP_Class_B.txt","");
fs.writeFileSync("./IP_Class_C.txt","");
fs.writeFileSync("./IP_Class_D.txt","");
fs.writeFileSync("./IP_Class_E.txt","");
const data=fs.readFileSync("./mock_ip.json","utf8");

const record = JSON.parse(data);
  
  record.forEach(info => {
    const ip=info.ip_address;
    const firstOctetStr = ip.substring(0, ip.indexOf(".")); 
const firstOctet = parseInt(firstOctetStr);
    if(firstOctet >= 1 && firstOctet <= 126){
            fs.appendFileSync("./IP_Class_A.txt",JSON.stringify(info));
        }
        else if(firstOctet >= 128 && firstOctet <= 191){
            fs.appendFileSync("./IP_Class_B.txt",JSON.stringify(info));
        }
        else if(firstOctet >= 192 && firstOctet <= 223){
            fs.appendFileSync("./IP_Class_C.txt",JSON.stringify(info));
        }
        else if(firstOctet >= 224 && firstOctet <= 239){
            fs.appendFileSync("./IP_Class_D.txt",JSON.stringify(info));
        }
        else if(firstOctet >= 240 && firstOctet <= 255){
            fs.appendFileSync("./IP_Class_D.txt",JSON.stringify(info));
        }
        
});