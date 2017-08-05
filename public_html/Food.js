//Food Data
milk = new Dairy("avonmore", "20", "Calcium", 15, "100", ["protein", "fats", "Dairy"]);
avocado = new Vegetable("avocado", "10g", 13, "Protein", "100", ["protein", "fats", "salad", "superFood"]);
rice = new Cereal("rice", "7g", "Carb", 12, "120", ["carb", "energy", "grain"]);
banana = new Fruit("banana", "8g", "carb", 10, "150", ["complex carb", "low GI", "tasty"]);
beef = new Meat("beef", 50, "E", 14, 150, ["protein", "fats", "iron"]);
lamb = new Meat("lamb", 50, "E", 12, 120, ["carb", "energy", "grain"]);
turkey = new Meat("turkey", 40, "B", 8, 100, ["protein", "fats", "salad", "superFood"]);
pork = new Meat("pork", 40, "D", 5, 130, ["iron", "protein"]);
pork.isHalal = false;
tofu = new Meat("tofu", 20, "A", 12, 115, ["protein", "fats", "Dairy"]);
tofu.isVegan = true;
tofu.isVegetarian = true;
quorn = new Meat("quorn", 20, "A", 12, 115, ["protein", "fats", "Dairy"]);
quorn.isVegan = true;
quorn.isVegetarian = true;
venison = new Meat("venison", 35, "C", 12, 115, ["protein", "fats", "Dairy"]);
bacon = new Meat("bacon", 40, "E", 12, 115, ["protein", "fats", "Dairy"]);
bacon.isHalal = false;
halloumi = new Meat("holloumi", 30, "B", 12, 115, ["protein", "fats", "Dairy"]);
halloumi.hasLactose = true;
halloumi.isVegetarian = true;
chicken = new Meat("chicken", 25, "B", 12, 115, ["protein", "fats", "Dairy"]);
ffmilk = new Dairy("full fat", 20, "C", 1.2, 100, ["protein", "fats", "Dairy"]);
ssmilk = new Dairy("semi-skimmed", 30, "B", 1.2, 80, ["protein", "fats", "Dairy"]);
soymilk = new Dairy("soy milk", 15, "A", 1.5, 70, ["protein", "fats", "Dairy"]);
soymilk.isVegan = true;
soymilk.hasLactose = false;
cheddar = new Dairy("cheddar", 40, "C", 3.5, 120, ["protein", "fats", "Dairy"]);
eggs = new Dairy("eggs", 22, "D", 1, 160, ["protein", "fats", "Dairy"]);
goatscheese = new Dairy("goats cheese", 50, "B", 2, "110", ["protein", "fats", "Dairy"]);
cheesesubstitute = new Dairy("cheese substitute", 9, "A", 4, "100", ["protein", "fats", "Dairy"]);
cheesesubstitute.isVegan = true;
tofu2 = new Dairy("silken tofu", 10, "A", 4.5, "140", ["protein", "fats", "Dairy"]);
tofu2.isVegan = true;

foodData = [milk, beef, avocado, rice, banana, lamb, turkey, pork, tofu, quorn, venison, bacon, halloumi, chicken, ffmilk, ssmilk, soymilk, cheddar, eggs, goatscheese, cheesesubstitute, tofu2];


//******************************************************************************
////Set up database
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
//******************************************************************************
//Initialising database

var db;
var request = window.indexedDB.open("foodDatabase", 3);

request.onerror = function (event) {
    console.log("error: Databse not open");
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: " + db);
    displayMenuList("meat");
    displayMenuList("dairy");
    displayMenuList("vegetable");
    displayMenuList("cereal");
    nameResults();
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("food", {keyPath: "name"});
    for (var i in foodData) {
        objectStore.add(foodData[i]);
    }
};





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
    this.type = "dairy";
}

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
    this.type = "meat";
}


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
    this.type = "vegetable";
}


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
    this.type = "Fruit";
}


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
    this.type = "cereal";
}

Cereal.prototype = new food();
Vegetable.prototype = new food();
Meat.prototype = new food();
Dairy.prototype = new food();
Fruit.prototype = new food();

function readAll() {
    var objectStore = db.transaction(osn).objectStore(osn);
    var request = objectStore.openCursor();

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            console.log(cursor.value.name);
            console.log(cursor.value.current);
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
//window.onbeforeunload = cleardb;

/*function getObject() {
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
 Display(item.name);
 // does not change other string
 } else {
 console.log("SHIT");
 }
 };
 }
 */
function currentItem() {
    //var name = prompt("What would you like to search").toLowerCase().trim();
    name = document.getElementById("query").value;
    name = name.toLowerCase().trim();
    var transaction = db.transaction([osn], "readwrite");
    var objectStore = transaction.objectStore(osn);
    var request = objectStore.get(name);
    //if the get function returns an error
    request.onerror = function (event) {
        Console.log("Unable to retrieve data from database!");
    };
    //if the get function returns no errors (entry still not necessarily in the db)
    request.onsuccess = function (event) {
        var item = request.result;
        item.current = true;
        console.log(item.current);
        objectStore.put(item);
        readAll();

    };
    window.location.href = "SearchResults.html";
}

function nameResults() {
    var objectStore = db.transaction([osn], "readwrite").objectStore(osn);
    var request = objectStore.openCursor();

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            var name = cursor.value.name;
            //console.log(cursor.value.current);
            var foodRequest = objectStore.get(name);
            foodRequest.onsuccess = function () {
                var item = foodRequest.result;
                if (item.current === true) {
                    document.getElementById("nameOfFood").innerHTML = item.name;
                    //new
                    //health
                    var list = document.getElementById('healthOfFood');
                    console.log("enter successfully");
                    var health = "Health: " + item.H;
                    var environ = "Environmental Impact: " + item.E;
                    var cost = "Cost: " + item.P;
                    var entry1 = document.createElement('li');
                    var entry2 = document.createElement('li');
                    var entry3 = document.createElement('li');
                    entry1.appendChild(document.createTextNode(health));
                    entry2.appendChild(document.createTextNode(environ));
                    entry3.appendChild(document.createTextNode(cost));
                    list.appendChild(entry1);
                    list.appendChild(entry2);
                    list.appendChild(entry3);
                    item.current = false;
                    objectStore.put(item);
                }

            };
            // console.log(foodRequest.result);
            //if(request.result.current === true){
            //  console.log(request.result.name);
            //}
            //if(item.current){
            //console.log(item);
            //}
            cursor.continue();
        } else {
            console.log("No more entries!");
        }
    };

    objectStore.openCursor().onerror = function (event) {
        console.log("That didn't work");
    };
}


/*function nameDisplay(name){
 //function to display on HTML screen
 document.write(name);   
 }*/

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

function userList(user) {
    //ensure user is changed to current to enable to receive stuff from user
    //take user name from HTML
    //Get user from database
    //take parameters
    //cycle through each food item
    //remove those which the user can't have
    //suggest similar items which are close to the user wants


}
function displayMenuList(Ftype) {
    var ID = Ftype + "List";
    console.log(ID);
    var list = document.getElementById(ID);
    console.log("entered successfully");
    var transaction = db.transaction([osn], "readwrite");
    var objectStore = transaction.objectStore(osn);
    var request = objectStore.openCursor();

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            if (cursor.value.type === Ftype) {
                var item = cursor.value.name;
                console.log(item);
                var entry = document.createElement('li');
                entry.appendChild(document.createTextNode(item));
                list.appendChild(entry);
                console.log(cursor.value.type);
          }
            cursor.continue();


        } else {
            console.log("No more entries!");
        }
    };

    objectStore.openCursor().onerror = function (event) {
        console.log("That didn't work");
    };



}








