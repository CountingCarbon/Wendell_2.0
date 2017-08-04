/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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

//Create database with inital item
const initdata = [
    {name:'potatoes', price:3.6, gofCO2:46, calories:7, tags:["protein","carb"]},
    {name:'air', price:0, gofCO2:0, calories:0, tags:["carb"]}
];

var db;
var request = window.indexedDB.open("newDatabase", 3);

request.onerror = function(event) {
   console.log("error: ");
};

request.onsuccess = function(event) {
   db = request.result;
   console.log("success: "+ db);
};
request.onupgradeneeded = function(event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("food", {keyPath: "name"});

    for (var i in initdata) {
       objectStore.add(initdata[i]);
    }
};

//Now we are in the vastly unchartered waters of what I wrote myself
function readdata(){
    var a = prompt("Search for food item here","Carrots").toLowerCase();
    var transaction = db.transaction(["food"]);
    var objectStore = transaction.objectStore("food");
    var request = objectStore.get(a);

    //if the get function returns an error
    request.onerror = function(event) {
        alert("Unable to retrieve data from database!");
    };

    //if the get function returns no errors (entry still not necessarily in the db)
    request.onsuccess = function(event) {
        if(request.result){
            console.log(request.result);
            alert("Price: $" + request.result.price + ", Grams of CO2: " + request.result.gofCO2);
        }
        else{
            alert(a + " is not in your database");
            console.log("Not in db");
        }
    };
}

function lessthan(){
    var max = parseFloat(prompt("What is your maximum price?","Enter a number"));
    var objectStore = db.transaction("food").objectStore("food");
    var request = objectStore.openCursor();
    k = 0;
    
    objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    
    if (cursor) {
        if (cursor.value.price <= max) {
            console.log(cursor.value.name);
            cursor.continue();
            //k resets everytime what the hell?
            k = k + 1;
            console.log(k);
        }
        else{
            cursor.continue();
        }
    }
    else {
        if(k===0){
            alert("Your price is too low");
        }
        alert("No more entries! " + k);
    }
    };

    objectStore.openCursor().onerror = function(event) {
        console.log("That didn't work");
    };    
}

function readtoconsole(){
    var objectStore = db.transaction("food").objectStore("food");
    var request = objectStore.openCursor();

    objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;

    if (cursor) {
            console.log(cursor.value.name);
            cursor.continue();
        }
        else {
            alert("No more entries!");
        }
    };

    objectStore.openCursor().onerror = function(event) {
        console.log("That didn't work");
    };
}

function addobjectstring(){
    var objstr = prompt("Input food object list","copy and paste from excel").toLowerCase().trim().split('><');
    for(var i in objstr){
        console.log(objstr[i]);
        obj = JSON.parse(objstr[i]);
        var request = db.transaction(["food"], "readwrite").objectStore("food").add(obj);

        request.onerror = function(event) {
            console.log("Unable to add " + obj["name"] + "\r\nIt is already exist in your database! ");
        };
    }
}

function addobject(){
    var obj = prompt("Input food object","copy paste from excel").toLowerCase();
    console.log(obj);
    console.log(typeof obj);
    obj = JSON.parse(obj);
    var request = db.transaction(["food"], "readwrite").objectStore("food").add(obj);
    
    request.onsuccess = function(event) {
        alert(obj["name"] + " has been added to your database.");
    };

    request.onerror = function(event) {
        alert("Unable to add " + obj["name"] + "\r\nIt is already exist in your database! ");
    }; 
}

function smartlist(){
    var x = parseFloat(prompt("Input the customer's ideal price","0-10"));
    var y = parseFloat(prompt("Input the customer's ideal gofCO2","10-100"));
    shortest = 100;
    dis = 0;
    winner = "string";
    
    var objectStore = db.transaction("food").objectStore("food");
    var request = objectStore.openCursor();

    objectStore.openCursor("tomatoes","next").onsuccess = function(event) {
    var cursor = event.target.result;

    if (cursor) {
        dis = Math.sqrt((cursor.value.price - x)^2 + (cursor.value.gofCO2 - y)^2);
            if(dis<=shortest){
                shortest = dis;
                console.log(shortest);
                winner = cursor.value.name;
                console.log(winner);
                cursor.continue();
            }
            else{
                cursor.continue();
            }
    }
    else {
        alert(winner);
    }
    };
}

function smartlist2(){
    
    for(var i in cursor){
        
    }
}

function cleardb(){
    //Close database; can't delete and open database
    db.close();

    var request = window.indexedDB.deleteDatabase("newDatabase",3);

    request.onerror = function(event) {
       console.log("error: in deletion");
    };

    request.onsuccess = function(event) {
       db = request.result;
       console.log("success in deletion: ");
    };

    //Close the page because there's nothing left to fiddle with
    window.close(); //can't close a window the script didn't open
}
//Call the clear function when the page closes NBNBNBNBNBNBNB//////////////////////
window.onbeforeunload = cleardb;


//Old functions no longer called bythe html
function adddata(){
    var a = prompt("Input food item's name","Beef").toLowerCase().trim();
    var b = parseFloat(prompt("Input food item's price","20"));
    var c = parseFloat(prompt("Input food's associated CO2","46"));
    var request = db.transaction(["food"], "readwrite").objectStore("food").add({name:a, price:b, gofCO2:c});
    //error handlers.add({name:a, 
    request.onsuccess = function(event) {
        alert(a + " has been added to your database.");
    };

     request.onerror = function(event) {
        alert("Unable to add " + a + "\r\nIt is already exist in your database! ");
    };   
}
function addstring(){
    var a = prompt("Input food item list","seperated by commas no square brackets").toLowerCase().trim().split(',');
    var b = prompt("Input food item price list","seperated by commas no square brackets").split(',');
    var c = prompt("Input food item gofCO2 list","seperated by commas no square brackets").split(',');

    for(var i in a){
        var request = db.transaction(["food"], "readwrite").objectStore("food").add({name:a[i], price:parseFloat(b[i]), gofCO2:parseFloat(c[i])});
        request.onsuccess = function(event) {
            console.log(a[i] + " has been added to your database.");
        };

         request.onerror = function(event) {
            console.log("Unable to add " + a[i] + "\r\nIt is already exist in your database! ");
        }; 
    }
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


