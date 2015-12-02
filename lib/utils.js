'use strict';

// Returns a hashify function that creates unique hash for each
// unique value.
//
exports.hashify = function(tokenMap) {
  if(!tokenMap) {
    tokenMap = {};
  }
  return function(token){
    if(tokenMap[token]){
      return tokenMap[token];
    }

    let randomHash;
    do {
      randomHash = (+(''+Math.random()).slice(2)).toString(36);
    } while (tokenMap[randomHash]);

    tokenMap[randomHash] = true;
    tokenMap[token] = randomHash;
    return randomHash;
  }
}