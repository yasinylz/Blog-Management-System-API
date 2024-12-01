import winston from "winston";
const  logger=winston.createLogger({
    level:'info',
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info)=>`[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename:'logs/error.log',level:'error'}),
        new winston.transports.File({filename:'logs/combined.log'})
    ]  // Error loglarını error.log dosyasına, bütün logları combined.log dosyasına kaydetmesi için transports ekliyoruz.
   
})
export default logger;