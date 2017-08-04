// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Open (or create) the database
var open = indexedDB.open("NewDatabase", 3);

// Create the schema
open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("MyObjectStore", {keyPath: "id"});
    var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
};

open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("MyObjectStore", {keyPath: "id"});
    var index = store.createIndex("NameIndex", ["name.first", "name.last"]);
};

open.onsuccess = function() {
    // Start a new transaction
    var db = open.result;
    var tx = db.transaction("MyObjectStore", "readwrite");
    var store = tx.objectStore("MyObjectStore");
    var index = store.index("NameIndex");

    // Add some data
    var John = ({id: 12345, name: {first: "John", last: "Doe"}, age: 42});
    var Bob = ({id: 67890, name: {first: "Bob", last: "Smith"}, age: 35});
    var Claire = ({id: 11121, name: {first: "Claire", last: "Smith"}, age: 27});
    var David = ({id: 11122, name: {first: "David", last: "Smith"}, age: 27});
    
    var supermarket = [John, Bob, Claire,David];
    
    for(var i = 0; i<supermarket.length; i++){
        store.put(supermarket[i]);   
    }
   // store.put(supermarket[0]);
    //store.put(supermarket[1]);
    //store.put(supermarket[2])
   
    // Query the data
    var getJohn = store.get(12345);
    var getBob = index.get(["Bob", "Smith"]);
    var getClaire = store.get(11121);
    var getDavid = store.get(11122);

    getJohn.onsuccess = function() {
        console.log(getJohn.result.name.first);  // => "John"
    };

    getBob.onsuccess = function() {
        console.log(getBob.result.name.first);   // => "Bob"
    };
    
    getClaire.onsuccess = function() {
        console.log(getClaire.result.name.first);   // => "Bob"
    };
    
    getDavid.onsuccess = function(){
        console.log(getDavid.result.name.first);   // => "Bob"
    };

    // Close the db when the transaction is done
    tx.oncomplete = function() {
        db.close();
    };
};