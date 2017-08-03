//global variables
osn = "user";
kpn = "email";
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
function parameter(){
    //get object
    obj = getObject("peterpan@countingcarbonnow.com");
    console.log(obj);
    //ravelobject
    
    //currentuser.preferences(document.getElementById(paras[0]).value,document.getElementById(paras[1]).value,document.getElementById(paras[2]).value);   
        
    //unravelobject
        
    //store user
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
