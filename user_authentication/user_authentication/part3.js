////////part 3////////////

//1

function register(){

    setTimeout(()=>{
        console.log("register completed");
    },2500)

}

function sendWelcomeMessage(){

    setTimeout(()=>{
        console.log("sendWelcomeMessage completed");
    },3000)

}

function login(){

    setTimeout(()=>{
        console.log("login completed");
    },2000)

}

function fetchProfile(){

    setTimeout(()=>{
        console.log("fetchProfile completed");
    },4000)

}

function updateStatus(){

    setTimeout(()=>{
        console.log("updateStatus completed");
    },1500)

}

function logout(){

    setTimeout(()=>{
        console.log("logout completed");
    },3500)

}

register(sendWelcomeMessage(login(fetchProfile(updateStatus(logout( 
    ()=>{
        console.log("All operations finished!");
    }
))))));


//2

function register(callback){

    setTimeout(()=>{
        console.log("register completed");
        callback();
    },2500)

}

function sendWelcomeMessage(callback){

    setTimeout(()=>{
        console.log("sendWelcomeMessage completed");
        callback();
    },3000)

}

function login(callback){

    setTimeout(()=>{
        console.log("login completed");
        callback();
    },2000)

}

function fetchProfile(callback){

    setTimeout(()=>{
        console.log("fetchProfile completed");
        callback();
    },4000)

}

function updateStatus(callback){

    setTimeout(()=>{
        console.log("updateStatus completed");
        callback();
    },1500)

}

function logout(callback){

    setTimeout(()=>{
        console.log("logout completed");
        callback();
    },3500)

}

register(()=>
sendWelcomeMessage(()=>{
    login(()=>{
        fetchProfile(()=>{
            updateStatus(()=>{
                logout(
                    ()=>{
                        console.log("All operations finished!");
                    }
                );
            })
        })
    })
})
);


//3
///*
function register(){
return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("register completed");
    },2500)
})
}

function sendWelcomeMessage(){
return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("sendWelcomeMessage completed");
    },3000)
})
}

function login(){
return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("login completed");
    },2000)
})
}

function fetchProfile(){
return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("fetchProfile completed");
    },4000)
})
}

function updateStatus(){
return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("updateStatus completed");
    },1500)
})
}

function logout(){
return new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("logout completed");
    },3500)
})
} 

register().then(result=>{
    console.log(result);
    return sendWelcomeMessage();
}).then(result=>{
    console.log(result);
    return login();
}).then(result=>{
    console.log(result);
    return fetchProfile();
}).then(result=>{
    console.log(result);
    return updateStatus();
}).then(result=>{
    console.log(result);
    return logout();
}).then(result=>{
    console.log(result);
    
}).then(()=>{
    console.log("All operations finished!");
})



//4
///*

async function operations(){
    const reg = await register();
    console.log(reg);

    const welcome = await sendWelcomeMessage();
    console.log(welcome);

    const log = await login();
    console.log(log);

    const prof = await fetchProfile();
    console.log(prof);

    const status = await updateStatus();
    console.log(status);

    const out = await logout();
    console.log(out);

    console.log("All operations finished!");
}

operations();
