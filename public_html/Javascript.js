//Global variables
osn = "user";//objectstore name
kpn = "email";//key path name, change in first item too
paras = ["Environmental Impact","Health","Cost"];//Match the html values that the guys are inputting
currentuser = {};//for passing users from page to page must be varible not global
//////Set up database
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
////////////////////////////////////////////////////////////////////////////////
////////////////////////////Database Complete///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function user() {
    this.personal = function (name, email, password) {
        this.name = name;//This should match the global variable kpn
        this.email = email;
        this.password = password;
    };

    this.dietary = function (Halal, GF, vegan, vegetarian) {
        this.Halal = Halal;
        this.GF = GF;
        this.vegan = vegan;
        this.vegetarian = vegetarian;
    };

    this.preferences = function (E, H, P) {
        this.E = E;//These should match the global array parameters
        this.H = H;//These should match the global array parameters
        this.P = P;//These should match the global array parameters
    };

    this.addList = function (list) {
        if (this.lists) {
            this.lists.push(list);
            this.nofl++;
        } 
        else {
            this.lists = [];
            this.nofl = 1;
            this.lists.push(list);
            
        }

        this.delete = function (list) {
            // Searches for position of food item in list
            var index = this.lists.indexOf(list);
            //If the index exists it removes it
            if (index > -1) {
                this.lists.splice(index, 1);//splice takes in (position, number of items to remove
                this.nofl--;
            }
        };
    };
}

function list() {
    //starting shite
    this.items = [];
    this.nofi = 0;
    //sets the list name
    this.name = function (name) {
        this.name = name;
    };
    //adds to list
    this.add = function (item) {
        this.items.push(item);
        this.nofi++;
    };

    //deletes
    this.delete = function (food) {
        // Searches for position of food item in list
        var index = this.items.indexOf(food);
        //If the index exists it removes it
        if (index > -1) {
            this.items.splice(index, 1);//splice takes in (position, number of items to remove
            this.nofi--;
        }
    };
}

function getForm(){
    //new user
    usr = new user();
    //get from form
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    //fill in user info
    usr.personal(name,email,password);
    //turn entire thing into a string
    var objectstring = JSON.stringify(usr,unravelForDb);
    //retain the entered info so as to be able to search the item
    var handler = JSON.stringify(usr);
    usr2 = JSON.parse(handler);
    //Pass the string (containing the methods) into the object that can be saved
    usr2["string"] = objectstring;
    
    /////adds modified object (with encrypted original) to the database/////
    var request = db.transaction(["user"], "readwrite").objectStore(osn).add(usr2);
    
    request.onsuccess = function(event) {
        alert("Your account was created successfully\r\nWelcome to Counting Carbon");
    };

    request.onerror = function(event) {
        alert("That email is already associated with an account");
    };
    currentuser = usr;
};

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

function getObject(email){
    //var request = db.transaction([osn]).objectStore(osn).get(email);
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
            return request.result;
            console.log(request.result);
        }
        else{
            console.log("SHIT");
        }
    };
}

function readall(){
    var objectStore = db.transaction(osn).objectStore(osn);
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







//Call the clear function when the page closes NBNBNBNBNBNBNB///////////////////
//window.onbeforeunload = cleardb;
////////////////////////////////////////////////////////////////////////////////
//Delete and start again
function cleardb(){
    //Close database,can't delete and open database
    db.close();

    var request = window.indexedDB.deleteDatabase("newDatabase",3);

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