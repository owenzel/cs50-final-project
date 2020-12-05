// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

function Matching(users){

    
    // this.users = users;
    users = shuffle(users);

    let matches = [];

    // ASSUMING EVEN # of USERS -- update edge case later for odd
    for (i = 0; i < users.length; i += 2)
    {
        matches.push([users[i], users[i + 1]]);
    }

    return matches;
}

module.exports = Matching;