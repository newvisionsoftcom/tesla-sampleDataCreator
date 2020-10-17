const faker = require('faker');
var md5 = require('md5');
var fs = require('fs');
var prepend = require('prepend');

var threshold = 1000000;
var datetime = new Date();
var month = datetime.getUTCMonth() + 1
var amount = 0;
var creditCardNumbers = generateCreditCardNumber();
var sampleDataFileName = "sample_" + datetime.getDate() + "_" + month  + "_" +datetime.getFullYear() 
                        +"_" +datetime.getHours()+ "_" + datetime.getMinutes() +"_" +datetime.getSeconds()+ ".csv"


                        
var sampleDataStream = fs.createWriteStream(sampleDataFileName, {flags: 'a'});

for(let i = 0; i < threshold; i++){
    generateFileData();
    //generateTransactionData(records);
    //generateAccountData(records, result);
}
sampleDataStream.write(String(threshold));
sampleDataStream.end();

var data = "\n" + amount.toFixed(2) + "," + threshold / 2 + "," + threshold / 2 + "\n"

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


function generateFileData(){
    let transactionAmt = faker.finance.amount(20, 1000, 2)
    amount = amount + transactionAmt;

    let creditCardNumber = md5(faker.random.arrayElement(creditCardNumbers)); 
    let merchantDetail = faker.company.companyName().replace(",", "")
    let uniqueID = faker.random.uuid()
    let createdDateTime = faker.date.recent(30).toISOString()

    sampleDataStream.write(String(creditCardNumber + "," + transactionAmt + "," + merchantDetail + "," 
                    + uniqueID + "," + createdDateTime + "\n"));


}