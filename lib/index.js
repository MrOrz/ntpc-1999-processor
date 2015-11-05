'use strict';

const csv = require('csv');
const fs = require('fs');
const iconv = require('iconv-lite');
const progress = require('progress-stream');
const path = require('path');
const config = require('./config');

// Input and output file streams and progress streams.

const IN_FILES = process.argv.slice(2).map(p => path.normalize(p));
const OUT_FILE = `${path.basename(IN_FILES[0], '.csv')}.merged.csv`;

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
// Piping the input file down to the parser
//

var processedRows = [];
var doneCount = 0;
IN_FILES.forEach(infile => {
  fs.createReadStream(infile)
    .pipe(progressFactory(infile))
    .pipe(iconv.decodeStream('big5'))
    .pipe(parserFactory())
    .on('end', () => {
      doneCount += 1;
      if(doneCount < IN_FILES.length){return;}

      //
      // When all parsing is done, sort the data and do writing
      //
      console.log(`Sorting ${processedRows.length} records...`);
      processedRows.sort((a, b) => {
        var valA = a[config.sortWithColumn], valB = b[config.sortWithColumn];
        if(valA < valB) {
          return -1;
        } else if(valA > valB){
          return 1;
        }else {
          return 0;
        }
      });
      csv.stringify(processedRows, {rowDelimiter: 'windows'}, (err, data) => {
        if(err){ throw err; }
        fs.writeFileSync(OUT_FILE, config.prependContent);
        fs.writeFileSync(OUT_FILE, data, {flag: 'a'});
        console.log(`Written to ${OUT_FILE}`);
      });
    });
});

function parserFactory(){
  //
  // Parser stream processing
  //
  var skippedInitialRows = 0;
  var parser = csv.parse();
  parser.on('readable', () => {
    let record;
    while(record = parser.read()){

      if(skippedInitialRows < config.rowsToSkip){
        skippedInitialRows += 1;
        continue;
      }

      if(SHOULD_FILTER && !FILTERS.some(filter => filter.isEligible[record[filter.col]])){
        // The row does not match any condition in the filter, should skip.
        continue;
      }

      // Write only columns listed in the config.
      processedRows.push(record.filter((item, index) => {
        return HAS_COLUMN[''+index];
      }));
    }
  });

  return parser;
}

function progressFactory(infile) {
  var progressStream = progress({
      length: fs.statSync(infile).size,
      time: 500 // ms
  });
  var name = path.basename(infile);

  progressStream.on('progress', p => {
    console.log(`Reading ${name}: ${p.percentage.toFixed(2)} %\t${Math.round(p.remaining/1000000)} seconds left. `);
  });

  return progressStream;
}