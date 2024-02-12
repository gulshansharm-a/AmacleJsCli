const  Test  = require("../src/Amacle/Models/Test")

const t = new Test();
t.select("*").get().then(res=>{
    console.log(res);
})