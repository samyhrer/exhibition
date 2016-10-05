var data = require('../data-source/seamen.json')
              .results[0]
			         .data
               .filter((row)=>{
                  return (row.row[1] && row.row[0])
               })
			         .map((row, index)=>{
      	         return {
      	         	displayName: row.row[1] + ' ' + row.row[0]
      	         }
			         });

var range = (from, to) => {
  return Promise.resolve(data.slice(from, to));
}

module.exports = {
  range: range
}