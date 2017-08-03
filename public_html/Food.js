function food(name, E, H, P, cal, tag){
  this.name = name; 
  this.E = E; //environment
  this.H = H; //health
  this.P = P; //price
  this.cal = cal; //calories
  this.tag = tag; //array of tags
  
  this.print = function(){
    //display product info  
    for(var property in this){
        
        if (typeof this[property] !== 'function'){ //Check if the property is not a function
            console.log(property + ": " + this[property]); //print values
        }
    }
};
  
  
  };
  
  function Dairy(name, E, H, P, cal, tag){
  this.name = name; 
  this.E = E; //environment
  this.H = H; //health
  this.P = P; //price
  this.cal = cal; //calories
  this.tag = tag; //array of tags
  this.isVegan = false;
  this.isVeggie = true; 
  this.isHalal = true;
  this.hasGluten = false;
  this.hasLactose = true; 
  };
  
  function Meat(name, E, H, P, cal, tag){
  this.name = name; 
  this.E = E; //environment
  this.H = H; //health
  this.P = P; //price
  this.cal = cal; //calories
  this.tag = tag; //array of tags
  this.isVegan = false;
  this.isVeggie = false; 
  this.isHalal = true;
  this.hasGluten = false;
  this.hasLactose = false; 
  };
  
  function Vegetable(name, E, H, P, cal, tag){
  this.name = name; 
  this.E = E; //environment
  this.H = H; //health
  this.P = P; //price
  this.cal = cal; //calories
  this.tag = tag; //array of tags
  this.isVegan = true;
  this.isVeggie = true; 
  this.isHalal = true;
  this.hasGluten = false;
  this.hasLactose = false; 
  };
  
  function Cereal(name, E, H, P, cal, tag){
  this.name = name; 
  this.E = E; //environment
  this.H = H; //health
  this.P = P; //price
  this.cal = cal; //calories
  this.tag = tag; //array of tags
  this.isVegan = true;
  this.isVeggie = true; 
  this.isHalal = true;
  this.hasGluten = false;
  this.hasLactose = false; 
  };

Cereal.prototype = new food();
Vegetable.prototype = new food();
Meat.prototype = new food();
Dairy.prototype = new food();


milk = new Dairy("Avonmore", "20","Calcium","100",["protein","fats","Dairy"]);
beef = new Meat ("Brazillian","50","Protein","150", ["iron", "protein"]);
avacado = new Vegetable("avacado", "10g", "Protein","100", ["protein", "fats", "salad", "superFood"]);
rice = new Cereal("rice", "7g","Carb","120", ["carb","energy","grain"]);

beef.print();
milk.print();
avacado.print();
rice.print();

const foodData = [milk, beef, avacado, rice];

//Set up database
//making all indexed db version respond to the same call
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
//Some other commands must also be "generalised"
//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
//if the function returns false then whatever browser is in use does not support indexed DB and the code sends below alert
if (!window.indexedDB) {
window.alert("Your browser doesn't support a stable version of IndexedDB.");
}
/*
var request = window.indexedDB.open("MyTestDatabase", 3);

request.onerror = function(event) {
    console.log("Error!");
};

request.onsuccess = function(event) {
   db = request.result;
   console.log("Success: "+ db);
};

// This event is only implemented in recent browsers
request.onupgradeneeded = function(event) { 
    db = event.target.result;
} */

var db;
const foodDB = "Food Database";
var request = indexedDB.open(foodDB, 3);
request.onerror = function(event) {
  console.log("Error!")
};
request.onupgradeneeded = function(event) {
  var db = event.target.result;

  // Create an objectStore to hold information about Food. We're going to use name as our key
  // *******REMEMBER TO CHANGE KEY WHEN COPYING IN PRODUCTSS WITH SAME NAME**********
  var objectStore = db.createObjectStore("food", { keyPath: "name" });

  // Create an index to search food by name. We may have duplicates
  // so we can't use a unique index.
  objectStore.createIndex("name", "name", { unique: true });

  // Search food by tag
  objectStore.createIndex("tag", "tag", { unique: false });

  // Use transaction oncomplete to make sure the objectStore creation is 
  // finished before adding data into it.
  objectStore.transaction.oncomplete = function(event) {
    // Store values in the newly created objectStore.
    var foodObjectStore = db.transaction("food", "readwrite").objectStore("food");
    for (var i in foodData) {
      foodObjectStore.add(foodData[i]);
    }
  };
};

var transaction = db.transaction(["Food Database"]);
var objectStore = transaction.objectStore("food");
var request = objectStore.get("avacado");
request.onerror = function(event) {
  // Handle errors!
};
request.onsuccess = function(event) {
  // Do something with the request.result!
  alert("avacado" + request.result.name);
};























/*
//database.length should be the variable which allows us to cycle through the database could you change this
var suggest = function(food){ //suggest any foods which may match the criteria
    var suggestions = []; //hold suggested foods
    
    for(var i = 0; i<dataBase.length; i++) //cycle through entries in database
    {
        compareTag = []; //compare tags
        var counter = 0; //reset to zero each time
        var compare = database[i]; //let compare take the value of the food item we are looking at
        for(var j = 0; j<food.tag.length; j++) //cycle through tags in food item
        {
            for(var k = 0; k<compare.length; k++){ //cycle through food you are comparing to
               if(food.tag[j] === compare.tag[k]){
                   counter++ //add to counter everytime the tag matches
                   compareTag[counter -1] = food.tag[j];// adds into the array the tag which matches
               } 
            }
        }
        suggestions.push([compare.name, compareTag, counter]); //suggestions is an array of an array which contains the suggested food the comparable tags and the
    }
};

var rankSuggestions = function(suggestions){
    for(var i = 0; i<suggestions.length; i++){
        //suggestions[]
    }
}


*/