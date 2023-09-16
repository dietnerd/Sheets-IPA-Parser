/**
 * Count the number of times that a specific graph (or multi-graph) occurs over a range of words.
 * 
 * This function specifically does NOT work with IPA and will likely be MUCH slower as a result of unique diphthongs.
 * 
 * @param {Array<Array<String>>} words All words to be analyzed 
 * @param {Array<Array<String>>} ...phonemes All graphs / multi-graphs to search for
 * 
 * @return Range of combos of phonemes
 * 
 * @customfunction
 */
function GRAPHCOUNT(words,...phonemes) { 
  if (phonemes.length == 0) {
    throw new Error("There are no phoneme ranges provided!");
  }

  let multiMap = {}; 
 
  // iterate through all phonemes 
  phonemes.forEach(function(section) {
    section.forEach(function(row) {
      row.forEach(function(cell) {  
        if (multiMap[cell.length] == null) {
          multiMap[cell.length] = {};
        }
        multiMap[cell.length][cell] = 0;
      });
    });
  });

  // build regex to specifically account for trigraphs and digraphs
  var regexString = "";
  for (var i = 10; i > 1; --i) { 
    // skip multigraph map if it does not exist for this length
    if (multiMap[i] == null) {
      continue;
    }
    // initialize regex group
    if (regexString == "") {
      regexString = "(?:";
    }

    for (const [key, val] of Object.entries(multiMap[i])) {
      regexString += key + "|";
    } 
  }
  // clip final "|" and close out non-capture group, generate regex
  if (regexString != "") {
    regexString = regexString.substring(0, regexString.length - 1) + "|.)";
  } else {
    // there are only singular graphs - 
    regexString = ".";
  } 
  let regex = new RegExp(regexString, "g");

  // finally, begin to go through all words
  words.forEach(function(row) {
    row.forEach(function(cell) {
      // skip over cell if it is null
      if (cell == null || cell.length == 0) {
        return;
      }

      // split apart all IPA phonemes
      var match = cell.match(regex); 
      if (match != null) {
        for (var i = 0; i < match.length; ++i) { 
          var phoneme = match[i];
          if (phoneme in multiMap[phoneme.length]) {
            multiMap[phoneme.length][phoneme] += 1;
          }
        } 
      }
    });
  });

  var retval = []; 
  for (const [length, collection] of Object.entries(multiMap)) {
    for (const [key, val] of Object.entries(collection)) {
      retval.push([key, val]);
    }
  }

  return retval;
}

/**
 * Count the amount of times that a specific phoneme occurs in a range of IPA words
 * 
 * This function is specifically geared toward IPA and works faster than PHONEMECOUNT as a result of higher predictability of IPA symbols
 * 
 * @param {Array<Array<String>>} words All words
 * @param {Array<Array<String>>} ...phonemes Phonemes to search for. Can use multiple different kinds of 
 * 
 * @return Range of combos of phonemes
 * 
 * @customfunction
 */
function IPACOUNT(words, ...phonemes) {
  if (phonemes.length == 0) {
    throw new Error("There are no phoneme ranges provided!");
  }
  
  // regex, get only instances of phoneme. DON'T get stops that are part of affricates
  var regex = new RegExp(".(?:[͜͡].|['ːʷʲʰˤˀᵝᵊʱˡⁿʳᵗˠ]|[̀́̌̃])?(?![͡'])", "g");

  // instantialize the phoneme map. Skip over everything that is blank.
  var phonemeMap = {};
  for (let i = 0; i < phonemes.length; ++i) {
    for (let j = 0; j < phonemes[i].length; ++j) {
      for (let k = 0; k < phonemes[i][j].length; ++k) {
        let cell = phonemes[i][j][k];
        if (cell == null || cell.length == 0) {
          continue;
        }
        // skip over cell kept in parenthesis
        if (cell.match(/\(.*\)/g) != null) {
          continue;
        }
        // capture the first instance of a value that ISN'T blank spaces
        let match = cell.match(/[^\s]+/);
        if (match != null) {
          phonemeMap[match[0]] = 0;
        }
      }
    }
  } 

  // Go over every word that you want counted
  for (let i = 0; i < words.length; ++i) {
    for (let j = 0; j < words[i].length; ++j) {
      let cell = words[i][j];
      if (cell == null || cell.length == 0) {
        continue;
      }

      // split apart all IPA phonemes
      var match = cell.match(regex); 
      if (match != null) {
        for (var k = 0; k < match.length; ++k) {
          if (match[k] in phonemeMap) {
            phonemeMap[match[k]] += 1;
          }
        } 
      }
    }
  } 

  var retval = [];
  for (const [key, val] of Object.entries(phonemeMap)) {
    retval.push([key, val]);
  }
  return retval;;
} 

function test() {
  
  var sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/10QGOdZie7YDzGfO4ETq78VlOvVPqcaKxY6HXP4yP9Vs/edit#gid=478952578").getSheetByName("Raarit"); 
  var words = sheet.getRange(2, 3, sheet.getLastRow()-2,1).getValues();
  var val = GRAPHCOUNT(words, [['a','b','y','tz','tl','ts','ky']]);
}
