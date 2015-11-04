'use strict';

const csv = require('csv');
const fs = require('fs');
const iconv = require('iconv-lite');
const progress = require('progress-stream');
const path = require('path');
const config = require('./config');

var parser = csv.parse();
var stringifier = csv.stringify();

// Input and output file streams and progress streams.

const IN_FILE = path.normalize(process.argv[2]);
const OUT_FILE = `${path.basename(IN_FILE, '.csv')}.done.csv`;
var readStream = fs.createReadStream(IN_FILE);
var writeStream = fs.createWriteStream(OUT_FILE);
var progressStream = progress({
    length: fs.statSync(IN_FILE).size,
    time: 500 // ms
});

//
// Process config.
//

const HAS_COLUMN = {};
config.columns.forEach(columnId => {
  HAS_COLUMN['' + columnId] = true;
});

const FILTERS = config.filters.map(row => {
  let isEligible = {};
  row.values.forEach(value => {
    isEligible[value] = true;
  });
  return {
    col: row.col, isEligible
  };
});

const SHOULD_FILTER = FILTERS.length > 0;

//
// Parser stream processing
//

parser.on('readable', () => {
  let record;
  while(record = parser.read()){

    if(SHOULD_FILTER && !FILTERS.some(filter => filter.isEligible[record[filter.col]])){
      // The row does not match any condition in the filter, should skip.
      continue;
    }

    // Write only columns listed in the config.
    stringifier.write(record.filter((item, index) => {
      return HAS_COLUMN[''+index];
    }));
  }
});

progressStream.on('progress', p => {
  console.log(`Progress: ${p.percentage.toFixed(2)} %\t${Math.round(p.remaining/1000000)} seconds left. `);
});

//
// Piping the input file to the set stream and to the output file.
//

stringifier.pipe(writeStream);
readStream.pipe(progressStream).pipe(iconv.decodeStream('big5')).pipe(parser);
