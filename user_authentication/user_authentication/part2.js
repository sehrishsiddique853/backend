const fs =require("fs");
fs.writeFileSync("./com.txt","");
fs.writeFileSync("./org.gov","");
fs.writeFileSync("./edu.txt","");
fs.writeFileSync("./uk.txt","");
const data=fs.readFileSync("./MOCK_DATA.json","utf8");

const record = JSON.parse(data);
  record.map(info=>{

  });
  record.forEach(info => {
    const email=info.email;
    if(email.endsWith(".com")){
            fs.appendFileSync("./com.txt",JSON.stringify(info));
        }
        else if(email.endsWith(".org")){
            fs.appendFileSync("./org.gov",JSON.stringify(info));
        }
        else if(email.endsWith(".edu")){
            fs.appendFileSync("./edu.txt",JSON.stringify(info));
        }
        else if(email.endsWith(".uk")){
            fs.appendFileSync("./uk.txt",JSON.stringify(info));
        }
        
});