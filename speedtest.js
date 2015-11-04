var csv = require('csv'),
    fs = require('fs');

var generator = csv.generate({seed: 1, columns: 2, length: 20});
var parser = csv.parse();
var transformer = csv.transform(function(data){
  return data.map(function(value){return value.toUpperCase()});
});
var stringifier = csv.stringify();

// parser.on('readable', function(){
//   while(data = parser.read()){
//     transformer.write(data);
//   }
// });

// transformer.on('readable', function(){
//   while(data = transformer.read()){
//     stringifier.write(data);
//   }
// });

// stringifier.on('readable', function(){
//   while(data = stringifier.read()){
//     process.stdout.write(data);
//   }
// });

var readStream = fs.createReadStream(__dirname+'/1041021-50000.utf8.csv', {
  encoding: 'utf8'
});
var writeStream = fs.createWriteStream(__dirname+'/processed.csv');

// stringifier.pipe(writeStream);
readStream.pipe(parser).pipe(transformer).pipe(stringifier).pipe(writeStream);