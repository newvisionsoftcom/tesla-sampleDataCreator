const faker = require('faker');
var md5 = require('md5');
var fs = require('fs');
const { resolve } = require('path');

// let creditCardNumbers = [];

const threshold = 1000000;
// const threshold = 1000;

class FileRecord {
    constructor(creditCardNumber, amount, type, merchantDetail, uniqueID, createdDateTime, status, authorizationStatus) {
        this.creditCardNumber = creditCardNumber;
        this.amount = amount;
        this.type = type;
        this.merchantDetail = merchantDetail
        this.uniqueID = uniqueID;
        this.createdDateTime = createdDateTime;
        this.status = status;
        this.authorizationStatus = authorizationStatus
    }
    print() {
        return this.creditCardNumber + "," + this.amount + "," + this.merchantDetail + "," + this.uniqueID + "," + this.createdDateTime;
    }
}

asyncTask();
// generateCreditCardNumber().then(generateFileData).then(generateTransactionData).then(generateAccountData);

async function asyncTask() {
    // return Promise.all([generateCreditCardNumber(), generateFileData(), generateTransactionData(), generateAccountData()])
    let creditCardNumbers = await generateCreditCardNumber();
    let records = await generateFileData(creditCardNumbers);
    let result = await generateTransactionData(records);
    if(result){
     await generateAccountData(records, result);
    }


    // toPrint = await generateTransactionData()
    // toPrint = await generateAccountData()
    console.log(result); // Prints out " A B C"

}

function generateTransactionData(records) {

    return new Promise((resolve, reject) => {
        var stream = fs.createWriteStream("Transaction.txt");
        stream.once('open', function (fd) {
            for (let i = 0; i < threshold; i++) {
                stream.write("insert into Transaction (CardNumber,Amount,Type,Merchant,UniqueID,CreatedDateTime," +
                    "Status,AuthorizationStatus" + ") values ( " +
                    "'" + records[i].creditCardNumber + "'" + "," +
                    records[i].amount + "," +
                    "'" + records[i].type + "'" + "," +
                    "'" + records[i].merchantDetail + "'" + "," +
                    "'" + records[i].uniqueID + "'" + "," +
                    records[i].createdDateTime + "," +
                    "'" + "A" + "'" + "," +
                    "'" + "Approved" + "'" +
                    ");");
                stream.write("\n");
            }
            stream.end();
            resolve(true);
        });
        
    });
}

function generateAccountData(records, res) {
    if (res) {
        return new Promise((resolve, reject) => {
            var stream = fs.createWriteStream("Account.txt");
            stream.once('open', function (fd) {
                for (let i = 0; i < threshold; i++) {
                    stream.write("insert into Account (CardNumber,Balance,CreditLimit,Status) values ( " +
                        "'" + records[i].creditCardNumber + "'" + "," +
                        faker.finance.amount() + "," +
                        10000 + "," +
                        "'" + "Active" + "'" +
                        ");");
                    stream.write("\n");
                }
                stream.end();
            });
            console.log("generateAccountData completed");
            resolve(true);
        });
    }

}

function generateFileData(creditCardNumbers) {

    return new Promise((resolve, reject) => {
        let records = [];
        var amount = 0;
        let transactionAmt = 0;
        for (let i = 1; i <= threshold; i++) {
            transactionAmt = faker.finance.amount(20, 1000, 2)
            amount = amount + transactionAmt;
            records.push(
                new FileRecord(
                    md5(faker.random.arrayElement(creditCardNumbers)),
                    transactionAmt,
                    i % 2 == 0 ? 'DEBIT' : 'CREDIT',
                    faker.company.companyName(),
                    faker.random.uuid(),
                    faker.date.recent(30).toISOString()
                )
            );
        }
        // console.log(records.length);
        // console.log((records[1]).print());
        var stream = fs.createWriteStream("sampleDataWith1MillionRecords.txt");
        stream.once('open', function (fd) {
            stream.write(amount.toFixed(2) + "," + threshold / 2 + "," + threshold / 2);
            stream.write("\n");
            for (let i = 0; i < threshold; i++) {
                stream.write((records[i]).print());
                stream.write("\n");
            }
            stream.write(String(threshold));
            stream.end();
        });
        console.log("generateFileData completed");
        resolve(records);
    });
}


function generateCreditCardNumber() {

    // var stream = fs.createWriteStream("CreditCardDetails.txt");
    // stream.once('open', function (fd) {
    //     for (var j in creditCardNumbers) {
    //         stream.write(creditCardNumbers[j] + "\n");
    //     }
    //     stream.end();
    // });
    return new Promise((resolve, reject) => {
        let creditCardNumbers = [];
        for (let i = 1; i <= 10000; i++) {
            creditCardNumbers.push(faker.finance.creditCardNumber());
        }
        console.log("generateCreditCardNumber completed");
        resolve(creditCardNumbers);
    });
}