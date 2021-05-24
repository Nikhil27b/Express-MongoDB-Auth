const mongoose = require("mongoose");

mongoose.connect(process.env.SECRET_DB ,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then((res)=>{
    console.log("Database connected");
}).catch((e)=>{
    console.log(e);
})