var objectStore = db.transaction(osn).objectStore(osn);
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
            alert("No more entries!");
        }
    };

    objectStore.openCursor().onerror = function (event) {
        console.log("That didn't work");
    };
    
var list = document.getElementById('nameOfFood');

function dropdownList() {
    nameResults();
    console.log("enter siucceessfully");
    var health = "Health: " + item.E;
    document.getElementById('boldStuff2').innerHTML = health;
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(health));
    list.appendChild(entry);
}