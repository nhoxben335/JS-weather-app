module.export = {
    port: process.env.PORT,
    files:[".//**/*/.{html,htm,css,js}"],
    server: {
        baseDir: ["./src","./build/contracts"]
    }

}