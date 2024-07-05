const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function compare() {
    const masterCsvPath = path.join(__dirname, 'master.csv');
    const wordlist1Path = path.join(__dirname, 'wordlist1.csv');

    let masterArray = [];
    let wordlist1Array = [];

    // Function to read file and process lines
    async function readFileAndProcessLines(filePath, array) {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(filePath),
        });

        return new Promise((resolve, reject) => {
            readInterface.on('line', function(line) {
                let data = line.split(',');
                // Assuming the intention is to subtract the values in columns 2 and 3 (index 1 and 2)
                let word = `${data[1]}_${data[2]}`; // Ensure numerical subtraction
                array.push(word);
            }).on('close', () => {
                resolve();
            }).on('error', (error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    // Read and process master.csv
    await readFileAndProcessLines(masterCsvPath, masterArray);

    // Read and process wordlist1.csv
    await readFileAndProcessLines(wordlist1Path, wordlist1Array);

    let duplicates = [];

    // Find duplicates

    // Using a Set to store the masterArray values for faster lookup
    let masterSet = new Set(masterArray);

    // Loop through wordlist1Array and check if the value is in masterSet
    wordlist1Array.forEach((word) => {
        if (masterSet.has(word)) {
            duplicates.push(word);
        }
    });

    let uniquewords = []

    wordlist1Array.forEach((word) => {
        if (!masterSet.has(word)) {
            uniquewords.push(word);
        }
    })

    console.log("Master count:", masterArray.length);
    console.log("Wordlist1 count:", wordlist1Array.length);
    console.log("Duplicate count:", duplicates.length);
    console.log("Unique count:", uniquewords.length);
    console.log(uniquewords);

    // Write to file
    let csvformat = []
    uniquewords.forEach((word) => {
        let data = word.split('_');
        let csvstring = `,${data[0]},${data[1]}`;
        console.log(csvstring);
    })

    console.log(csvformat);

}



compare().catch(console.error);