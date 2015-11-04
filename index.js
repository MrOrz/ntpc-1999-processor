'use strict';

var csv = require('csv');
var fs = require('fs');
var iconv = require('iconv-lite');
var progress = require('progress-stream');
var path = require('path');

var parser = csv.parse();
var stringifier = csv.stringify();

const hasColumn = {};
[0, 7, 8, 9, 10, 12, 15].forEach((columnId) => {
  hasColumn['' + columnId] = true;
});

const ROW_MATCHERS = [
  {col: 7, values: ['路面坑洞']}
];

const IN_FILE = path.normalize(process.argv[2]);
const OUT_FILE = `${path.basename(IN_FILE, '.csv')}.done.csv`;

parser.on('readable', () => {
  let record;
  while(record = parser.read()){
    let isMatched = ROW_MATCHERS.some(
      matcher => matcher.values.indexOf(record[matcher.col]) !== -1
    );

    if(ROW_MATCHERS.length > 0 && !isMatched){
      continue;
    }

    record = record.filter((item, index) => {
      return hasColumn[''+index];
    });

    stringifier.write(record);
  }
});

var progressStream = progress({
    length: fs.statSync(IN_FILE).size,
    time: 200
});

progressStream.on('progress', function(progress) {
    console.log(`Progress: ${progress.percentage.toFixed(2)} %\t${Math.round(progress.remaining/1000000)} seconds left. `);
});

var readStream = fs.createReadStream(IN_FILE);
var writeStream = fs.createWriteStream(OUT_FILE);

stringifier.pipe(writeStream);
readStream.pipe(progressStream).pipe(iconv.decodeStream('big5')).pipe(parser);
