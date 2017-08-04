//Set up database
//making all indexed db version respond to the same call
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
//Some other commands must also be "generalised"
osn = "food"; //object store name
kpn = "name"; //key path name
//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
//if the function returns false then whatever browser is in use does not support indexed DB and the code sends below alert
if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

//const initdata = [
//   {name:'potatoes', price:3.6, gofCO2:46, calories:7, tags:["protein","carb"]},
// {name:'air', price:0, gofCO2:0, calories:0, tags:["carb"]}
//];

function food(name, E, H, P, cal, tag) {
    this.name = name;
    this.E = E; //environment
    this.H = H; //health
    this.P = P; //price
    this.cal = cal; //calories
    this.tag = tag; //array of tags
    this.current = false;

    this.print = function () {
        //display product info  
        for (var property in this) {

            if (typeof this[property] !== 'function') { //Check if the property is not a function
                console.log(property + ": " + this[property]); //print values
            }
        }
    };


}
;

function Dairy(name, E, H, P, cal, tag) {
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
}
;

function Meat(name, E, H, P, cal, tag) {
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
}
;

function Vegetable(name, E, H, P, cal, tag) {
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
}
;

function Fruit(name, E, H, P, cal, tag) {
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
}
;

function Cereal(name, E, H, P, cal, tag) {
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
}
;

Cereal.prototype = new food();
Vegetable.prototype = new food();
Meat.prototype = new food();
Dairy.prototype = new food();


milk = new Dairy("avonmore", "20", "Calcium", "100", ["protein", "fats", "Dairy"]);
beef = new Meat("brazillian", "50", "Protein", "150", ["iron", "protein"]);
avocado = new Vegetable("avocado", "10g", "Protein", "100", ["protein", "fats", "salad", "superFood"]);
rice = new Cereal("rice", "7g", "Carb", "120", ["carb", "energy", "grain"]);
banana = new Fruit("banana", "8g", "carb", "150", ["complex carb", "low GI", "tasty"]);

//beef.print();
//milk.print();
//avocado.print();
//rice.print();
//banana.print();

foodData = [milk, beef, avocado, rice, banana];

var db;
var request = window.indexedDB.open("foodDatabase", 3);

request.onerror = function (event) {
    console.log("error: ");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: " + db);
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("food", {keyPath: "name"});
    for (var i in foodData) {
        objectStore.add(foodData[i]);
    }
};

function readAll() {
    var objectStore = db.transaction(osn).objectStore(osn);
    var request = objectStore.openCursor();

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            console.log(cursor.value.name);
            cursor.continue();
        } else {
            alert("No more entries!");
        }
    };

    objectStore.openCursor().onerror = function (event) {
        console.log("That didn't work");
    };
}

function cleardb() {
    //Close database; can't delete and open database
    db.close();

    var request = window.indexedDB.deleteDatabase("foodDatabase", 3);

    request.onerror = function (event) {
        console.log("error: in deletion");
    };

    request.onsuccess = function (event) {
        db = request.result;
        console.log("success in deletion: ");
    };

    //Close the page because there's nothing left to fiddle with
    window.close(); //can't close a window the script didn't open
}
//Call the clear function when the page closes NBNBNBNBNBNBNB//////////////////////
window.onbeforeunload = cleardb;

function getObject() {
    //var name = prompt("What would you like to search").toLowerCase().trim();
    name = document.getElementById("query").value;
    name = name.toLowerCase().trim();
    var transaction = db.transaction([osn]);
    var objectStore = transaction.objectStore(osn);
    var request = objectStore.get(name);
    //if the get function returns an error
    request.onerror = function (event) {
        alert("Unable to retrieve data from database!");
    };
    //if the get function returns no errors (entry still not necessarily in the db)
    request.onsuccess = function (event) {
        if (request.result) {
            var details = [];
            var item = request.result;
            console.log(item.name);
            for(var i in item){
               details[i] = item[i];
               console.log(details[i]);
            }
            // does not change other string
        } else {
            console.log("SHIT");
        }
    };
}
function sortInventory(user){
    //function to sort lists based on user input
      
}

/*
function getProductInfo() {
    var name = getObject().name;
    var transaction = db.transaction([osn]);
    var objectStore = transaction.objectStore(osn);
    var request = objectStore.get(name);

    request.onerror = function (event) {
        alert("Unable to retrieve data from database!");
    };

    request.onsuccess = function (event) {
        var details = [];
        if (request.result) {
            for (var i in item) {
                details[i] = item[i];
                console.log((item[i]));
            }
            console.log(request.result.name);
            // does not change other string
        } else {
            console.log("SHIT");
        }
    };

}
*/









