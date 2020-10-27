#!/usr/bin/env node

const faker = require('faker');
var md5 = require('md5');
var fs = require('fs');

const chalk = require("chalk");
const boxen = require("boxen");

const yargs = require("yargs");

const options = yargs
 .usage("Usage: -n Number of Records to be populated")
 .option("n", { alias: "numberOfRecords", describe: "Number of Records", type: "number", demandOption: true })
 .argv;

const greeting2 = `Hello, We are generating ${options.numberOfRecords} records for you`;

console.log(greeting2);


const greeting = chalk.white.bold("Generating Tesla Sample Data...");

const boxenOptions = {
 padding: 1,
 margin: 1,
 borderStyle: "round",
 borderColor: "green",
 backgroundColor: "#555555"
};
const msgBox = boxen( greeting, boxenOptions );

console.log(msgBox);



var threshold = options.numberOfRecords;
var datetime = new Date();
var month = datetime.getUTCMonth() + 1
var amount = 0;
var creditCardNumbers = generateCreditCardNumber();
var sampleDataFileName = "sample_" + datetime.getDate() + "_" + month  + "_" +datetime.getFullYear() 
                        +"_" +datetime.getHours()+ "_" + datetime.getMinutes() +"_" +datetime.getSeconds()+ ".csv"

var transactionFileName = "transaction_" + datetime.getDate() + "_" + month  + "_" +datetime.getFullYear() 
                        +"_" +datetime.getHours()+ "_" + datetime.getMinutes() +"_" +datetime.getSeconds()+ ".txt"

var accountFileName = "account_" + datetime.getDate() + "_" + month  + "_" +datetime.getFullYear() 
                        +"_" +datetime.getHours()+ "_" + datetime.getMinutes() +"_" +datetime.getSeconds()+ ".txt"
                        
var sampleDataStream = fs.createWriteStream(sampleDataFileName, {flags: 'a'});
var transactionStream = fs.createWriteStream(transactionFileName, {flags: 'a'});
var accountStream = fs.createWriteStream(accountFileName, {flags: 'a'});

sampleDataStream.write("")
for(let i = 0; i < threshold; i++){
    let transaction = generateFileData(i);
    generateTransactionData(transaction);
    generateAccountData(transaction);
}
sampleDataStream.write(String(threshold));
sampleDataStream.end();
transactionStream.end();
accountStream.end();

var data =  amount.toFixed(2) + "," + threshold / 2 + "," + threshold / 2 + "\n"

appendData(data)

async function appendData(data){
    // using appendFile.
    const fsp = require('fs').promises;
    await fsp.appendFile(
        sampleDataFileName, data
    );
    
}

function generateCreditCardNumber() {
    
    let creditCardNumbers = [];
    for (let i = 0; i < threshold/100; i++) {
        creditCardNumbers.push(faker.finance.creditCardNumber());
    }

    console.log("generateCreditCardNumber completed");
    return(creditCardNumbers)
}


function generateFileData(i){
    let transactionAmt = faker.finance.amount(20, 1000, 2)
    amount = amount + transactionAmt;

    let creditCardNumber = md5(faker.random.arrayElement(creditCardNumbers)); 
    let merchantDetail = faker.company.companyName().replace(",", "")
    let uniqueID = faker.random.uuid()
    let createdDateTime = faker.date.recent(30).toISOString()

    sampleDataStream.write(String(creditCardNumber + "," + transactionAmt + "," + merchantDetail + "," 
                    + uniqueID + "," + createdDateTime + "\n"));

    return {
        creditCardNumber : creditCardNumber,
        transactionAmt : transactionAmt,
        merchantDetail: merchantDetail,
        type: i % 2 == 0 ? 'DEBIT' : 'CREDIT',
        uniqueID : uniqueID,
        createdDateTime : createdDateTime
    }
}

function generateTransactionData(record){
    transactionStream.write("insert into Transaction (CardNumber,Amount,Type,Merchant,UniqueID,CreatedDateTime," +
    "Status,AuthorizationStatus" + ") values ( " +
    "'" + record.creditCardNumber + "'" + "," +
    record.transactionAmt + "," +
    "'" + record.type + "'" + "," +
    "'" + record.merchantDetail + "'" + "," +
    "'" + record.uniqueID + "'" + "," +
    record.createdDateTime + "," +
    "'" + "A" + "'" + "," +
    "'" + "Approved" + "'" +
    ");\n");
}

function generateAccountData(record){
    accountStream.write("insert into Account (CardNumber,Balance,CreditLimit,Status) values ( " +
    "'" + record.creditCardNumber + "'" + "," +
    faker.finance.amount() + "," +
    10000 + "," +
    "'" + "Active" + "'" +
    ");\n");
}