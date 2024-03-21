
// Get the current date
const currentDate = new Date();

// Format the date as desired
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = currentDate.toLocaleDateString('en-CA', options);

// Update the content of the HTML element with id "currentDate"
document.querySelector(".date").textContent = formattedDate;

//create objects to save data
var data = (localStorage.getItem("todoList")) ? JSON.parse(localStorage.getItem("todoList")) : {
    todo: [],
    completed: [],
    dateForTodoItem: [],
    dateForCompletedItem: []
};

//localStorage.clear();
renderTodoList();
console.log(data);



//user click add button
document.getElementById("add").addEventListener("click", function(){
    var value = document.getElementById("item").value;
    if(value){

        var emptyDivTag = document.querySelector(".liEmpty");
        if (emptyDivTag) emptyDivTag.remove();

        addItemTodo(value);
        document.getElementById("item").value = "";
        //hasAnyContent();

        data.todo.push(value);
        data.dateForTodoItem.push(formattedDate);
        objectUpdate();
    };
    
});

// function hasAnyContent(){
//     var ulTodoTag = document.getElementById("todo");
//     var ulCompletedTag = document.getElementById("completed");

//     if((ulTodoTag.childNodes.length === 0) && (ulCompletedTag.childNodes.length === 0)){

//         var ulParent = document.querySelector(".container");
//         var ulItem = document.createElement("ul");
//         var liItem = document.createElement("li");

//         var liEmptyMessage = document.createElement("div");
//         ulItem.classList.add("liEmpty");
//         liEmptyMessage.textContent = "YOU FINISH ALL TASKS!!!";

//         liItem.appendChild(liEmptyMessage);
//         ulItem.appendChild(liItem);
//         ulParent.appendChild(ulItem);
//     }
//     else{
//         var emptyDivTag = document.querySelector(".liEmpty");
//         if (emptyDivTag) emptyDivTag.remove();
//     }
// }

function renderTodoList(){
    if(!data.todo.length && !data.completed.length){
        var ulParent = document.querySelector(".container");
        var ulItem = document.createElement("ul");
        var liItem = document.createElement("li");

        var liEmptyMessage = document.createElement("div");
        ulItem.classList.add("liEmpty");
        liEmptyMessage.textContent = "YOU FINISH ALL TASKS!!!";

        liItem.appendChild(liEmptyMessage);
        ulItem.appendChild(liItem);
        ulParent.appendChild(ulItem);
        return;
    }

    for(var i = 0; i < data.todo.length; i++){
        var value = data.todo[i];
        var date = data.dateForTodoItem[i];
        addItemTodo(value, date);
    }

    for(var j = 0; j < data.completed.length; j++){
        var value = data.completed[j];
        var date = data.dateForCompletedItem[j];
        addItemTodo(value, date, true);
    }

    //hasAnyContent();
    
}

function objectUpdate(){

    localStorage.setItem("todoList", JSON.stringify(data));
}

function removeItem(){
    var liTag = this.parentNode.parentNode;
    var ulTag = liTag.parentNode;
    var targetUlTagId = ulTag.id;
    ulTag.removeChild(liTag);

    if(targetUlTagId === "todo"){
        data.todo.splice(data.todo.indexOf(liTag.childNodes[1].textContent), 1);
        data.dateForTodoItem.splice(data.dateForTodoItem.indexOf(liTag.firstChild.textContent), 1);
    }else{
        data.completed.splice(data.completed.indexOf(liTag.childNodes[1].textContent), 1);
        data.dateForCompletedItem.splice(data.dateForCompletedItem.indexOf(liTag.firstChild.textContent), 1);
    }

    var ulTodoTag = document.getElementById("todo");
    var ulCompletedTag = document.getElementById("completed");

    if((ulTodoTag.childElementCount == 0) && (ulCompletedTag.childElementCount == 0)){
        var ulParent = document.querySelector(".container");
        var ulItem = document.createElement("ul");
        var liItem = document.createElement("li");

        var liEmptyMessage = document.createElement("div");
        ulItem.classList.add("liEmpty");
        liEmptyMessage.textContent = "YOU FINISH ALL TASKS!!!";

        liItem.appendChild(liEmptyMessage);
        ulItem.appendChild(liItem);
        ulParent.appendChild(ulItem);
    }
    objectUpdate();

}

function completeItem(){
    var liTag = this.parentNode.parentNode;
    var ulTag = liTag.parentNode;
    var targetUlTagId = ulTag.id;

    var target = (targetUlTagId === "todo")? document.getElementById("completed") : document.getElementById("todo");
    ulTag.removeChild(liTag);
    target.insertBefore(liTag, target.childNodes[0]);

    (this.parentNode.parentNode.parentNode.id === "completed")? this.style.backgroundColor = "#5fa098" : this.style.backgroundColor = "#7b7470";
    //this.style.backgroundColor = "green";

    //object
    if(targetUlTagId === "todo"){
        data.todo.splice(data.todo.indexOf(liTag.childNodes[1].textContent), 1);
        data.completed.push(liTag.childNodes[1].textContent);
        data.dateForTodoItem.splice(data.dateForTodoItem.indexOf(liTag.firstChild.textContent), 1);
        data.dateForCompletedItem.push(liTag.firstChild.textContent);
    }else{
        data.completed.splice(data.completed.indexOf(liTag.childNodes[1].textContent), 1);
        data.todo.push(liTag.childNodes[1].textContent);
        data.dateForCompletedItem.splice(data.dateForCompletedItem.indexOf(liTag.firstChild.textContent), 1);
        data.dateForTodoItem.push(liTag.firstChild.textContent);
    }

    objectUpdate();

}

function addItemTodo(text, date, completed){

    var ulList = (completed) ? document.getElementById("completed") : document.getElementById("todo");

    var checkDateFrom = (date) ? date : formattedDate;

    var liItem = document.createElement("li");

    var date = document.createElement("div");
    date.classList.add("todoDate");
    date.textContent = checkDateFrom;


    var todoContent = document.createElement("p");
    todoContent.classList.add("todoContent");
    todoContent.textContent = text;

    var buttons = document.createElement("div");
    buttons.classList.add("buttons");

    var removeButton = document.createElement("button");
    removeButton.classList.add("removeButton");
    removeButton.textContent = "REMOVE";

    var completeButton = document.createElement("button");
    completeButton.classList.add("completeButton");
    completeButton.textContent = "COMPLETE";

    buttons.appendChild(removeButton);
    buttons.appendChild(completeButton);
    liItem.appendChild(date);
    liItem.appendChild(todoContent);
    liItem.appendChild(buttons);
    //ulList.appendChild(liItem);
    ulList.insertBefore(liItem, ulList.childNodes[0]);

    if(completed){
        completeButton.style.backgroundColor = "green";
    }

    removeButton.addEventListener("click", removeItem);
    completeButton.addEventListener("click", completeItem);
}