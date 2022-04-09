const app = require('./app')
const connectDb = require('./config/database')
const dotenv = require('dotenv')


//handling uncaught Exception
process.on('uncaughtException',(err)=>{
    console.log(`Error ${err.message}`);
    console.log(`Shutting down server due to Uncaught Exception`);
    process.exit(1)
})

dotenv.config({path:'../backend/config/config.env'})

connectDb()

const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT} Port`);
})


//unhandled promise rejection errors
//agr error aaye to server band hojae pura
process.on("unhandledRejection",(err)=>{
    console.log(`Error ${err.message}`);
    console.log(`Shutting down server due to Unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1)
    })
})