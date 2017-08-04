/* global paras */
//global variables
osn = "user";
kpn = "email";
paras = ["Environmental Impact","Health","Cost"];
//Open the database for the new script
var db;
var request = window.indexedDB.open("newDatabase", 3);
request.onerror = function(event) {
   console.log("error");
};
request.onsuccess = function(event) {
   db = request.result;
   console.log("success: "+ db);
};
request.onupgradeneeded = function(event) {
    db = event.target.result;
    var objectStore = db.createObjectStore(osn, {keyPath: kpn});

    objectStore.add({email:'giveusmoney@gmail.com'});
};

function getObject(email){
    var transaction = db.transaction([osn]);
    var objectStore = transaction.objectStore(osn);
    var request = objectStore.get(email);
    //if the get function returns an error
    request.onerror = function(event) {
        alert("Unable to retrieve data from database!");
    };
    //if the get function returns no errors (entry still not necessarily in the db)
    request.onsuccess = function(event) {
        if(request.result){
            str = request.result.string;// does not change other string
            parameter(str);
        }
        else{
            console.log("SHIT");
        }
    };
}

function parameter(strg,email){
    //ravelobject
    usr = JSON.parse(strg, ravelForDb);
    //set preferences
    usr.preferences(document.getElementById(paras[0]).value,document.getElementById(paras[1]).value,document.getElementById(paras[2]).value);
    //unravelobject
    objectstring = JSON.stringify(usr,unravelForDb);
    //retain the entered info so as to be able to search the item
    var handler = JSON.stringify(usr);
    usr = JSON.parse(handler);
    //Pass the string (containing the methods) into the object that can be saved
    usr["string"] = objectstring;
    //delete object from database
    var request = db.transaction(["user"]).objectStore(osn).delete(email);///This needs to remove shit
    //adds modified object (with encrypted original) to the database/////
    var request = db.transaction(["user"], "readwrite").objectStore(osn).add(usr);
    
    request.onsuccess = function(event) {
        alert("Your account was created successfully\r\nWelcome to Counting Carbon");
    };

    request.onerror = function(event) {
        alert("That email is already associated with an account");
    };
}
////////////////////////////////////////////////////////////////////////////////
//Not called by html////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function readall(){
    var objectStore = db.transaction("user").objectStore("user");
    var request = objectStore.openCursor();

    objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;

    if (cursor) {
            console.log(cursor.value.string);
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

function unravelForDb(key, value) {
    if (typeof value === 'function') {
        return value.toString();
    }
    return value;
}

function ravelForDb(key, value) {
/////////usr2 = JSON.parse(objectstring, ravelForDb);
    if (value && typeof value === "string" && value.substr(0, 8) === "function") {
        var startBody = value.indexOf('{') + 1;
        var endBody = value.lastIndexOf('}');
        var startArgs = value.indexOf('(') + 1;
        var endArgs = value.indexOf(')');

        return new Function(value.substring(startArgs, endArgs), value.substring(startBody, endBody));
    }
    return value;
}
