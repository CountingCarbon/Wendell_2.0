/* global paras, diets, osn, kpn */
dbname = "newDatabase";
osn = "user";
kpn = "email";
paras = ["Environmental Impact","Health","Cost"];
diets = ["halal","gluten","vegan","vegetarian"];
//Open the database for the new script
var db;
var request = window.indexedDB.open(dbname, 3);
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

function getUser(email,func){
    //var email = "peterpan@countingcarbonnow.com";//This needs to be passed fromn the previous html file
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
            func(str,email);
        }
        else{
            console.log("SHIT");
        }
    };
}

//Call this function evertime you need to update the user and pass it the function that edits its parameter's
function updateUser(innerfunc){
    var transaction = db.transaction([osn]);
    var objectStore = transaction.objectStore(osn);
    var request = objectStore.get("current email holder");
    //if the get function returns an error
    request.onerror = function(event) {
        alert("Unable to retrieve data from database!");
    };
    //if the get function returns no errors (entry still not necessarily in the db)
    request.onsuccess = function(event) {
        if(request.result){
            console.log(request.result.name + "has been updated");
            getUser(request.result.name, innerfunc);
        }
        else{
            console.log("Can't find who current user is");
        }
    };
}

function parameter(strg,email){
    //ravelobject
    usr = JSON.parse(strg, ravelForDb);
    //set preferences
    usr.preferences(document.getElementById(paras[0]).value,document.getElementById(paras[1]).value,document.getElementById(paras[2]).value);
    usr.dietary(document.getElementById(diets[0]).checked,document.getElementById(diets[1]).checked,document.getElementById(diets[2]).checked,document.getElementById(diets[3]).checked);
    //unravelobject
    objectstring = JSON.stringify(usr,unravelForDb);
    //retain the entered info so as to be able to search the item
    var handler = JSON.stringify(usr);
    usr = JSON.parse(handler);
    //Pass the string (containing the methods) into the object that can be saved
    usr["string"] = objectstring;
    //delete object from database
    var request = db.transaction([osn], "readwrite").objectStore(osn).delete(email);///This needs to remove shit
    //adds modified object (with encrypted original) to the database/////
    var request = db.transaction([osn], "readwrite").objectStore(osn).add(usr);
    
    request.onsuccess = function(event) {
        alert("Your preferences have been saved");
    };

    request.onerror = function(event) {
        alert("ERROR");
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

//Call the clear function when the page closes NBNBNBNBNBNBNB///////////////////
window.onbeforeunload = cleardb;
////////////////////////////////////////////////////////////////////////////////
//Delete and start again
function cleardb(){
    //Close database,can't delete and open database
    db.close();

    var request = window.indexedDB.deleteDatabase(dbname,3);

    request.onerror = function(event) {
       console.log("error: in deletion");
    };

    request.onsuccess = function(event) {
       db = request.result;
       console.log("success in deletion: ");
    };
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////