const DEFAULT_OPTION = "Choose category";



var draggingElement;
window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	activityarr = JSON.parse(localStorage.getItem('activity')) || [];


	subtasks = JSON.parse(localStorage.getItem('subtasks')) || [];

	
	
	


	const newTodoForm = document.querySelector('#new-todo-form');

	filterforcategory= document.getElementById("categoryfilter");

	filterforcategory.addEventListener("change", e=>{

		
		
		if(filterforcategory.value !== 'Show All'){
			
			filtercategories();
			
		}
		else{
			
			DisplayTodos();
		}
	});
	
	filterforpriority= document.getElementById("priorityfilter");

	filterforpriority.addEventListener("change", e=>{

		
		if(filterforpriority.value !== 'defaultpriority'){
			
			filterpriority();
			
		}
		else{
			
			DisplayTodos();
		}
	});

	sortforduedate=document.getElementById("sortfilter");
	sortforduedate.addEventListener("change" , e=>{
		
			
		if(sortforduedate.value === 'date'){
			
			todos.sort((a,b)=> {
				let ADate=Date.parse(a.duedate);
				let BDate=Date.parse(b.duedate);
				return ADate-BDate;
			})
			
			DisplayTodos();
		}
		else if(sortforduedate.value === 'priorbasis') {

			todos.sort((a,b)=> {
				console.log(b.priority);
				return b.priority-a.priority;
			})
			
			DisplayTodos();
		}
		else{
			DisplayTodos();
		}
	})
	filterdate=document.querySelector('#enddate');
	filterdate.addEventListener('change', e =>{

		funcdate();

	})

	search=document.querySelector('#searchbar');
	search.addEventListener('keyup',e=>{
		const text = e.target.value.toLowerCase();
		
    const allItem = document.querySelectorAll('.containdiv');
	console.log(allItem);
	
	console.log(allItem);
    for (let task of allItem) {
		console.log(task);
		const itemper=task.children[0].tag;
		if(itemper.toLowerCase().indexOf(text) != -1){
			task.style.display = 'flex';
		}
		else{
			let flag=0;

			for(let i=0;i<task.childElementCount;i++){
				const item = task.children[i].children[1].children[0].value;
				if (item.toLowerCase().indexOf(text) != -1){
					task.style.display = 'flex';
					flag=1;
				}

			}
			if(flag==0){
				task.style.display = 'none';

			}
		}
       
		

		
     
    };
	})

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();
		
		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
            priority : e.target.elements.priority.value,
			duedate :e.target.elements.duedate.value,
			tag:e.target.elements.tag.value,
			todoid:new Date().getTime(),

			done: false,
			//createdAt: 
			
		}
		
		

		todos.push(todo);
		activityarr.push("New task added: "+ todo.content);
		displayactivity();

		localStorage.setItem('todos', JSON.stringify(todos));

		// Reset the form
		e.target.reset();

		

		DisplayTodos();
	})

	taskbar=document.querySelector("#parentoption");

	subtaskform=document.querySelector("#subtask");

	subtaskform.addEventListener('submit', e => {
		e.preventDefault();

		var findid;
		const selectedtask=e.target.elements.selectparent.value;
		console.log(selectedtask);
		todos.forEach(todo => {
			if(selectedtask == todo.content){
				findid=todo.todoid;
			}
		})
		console.log(findid);
		const subtodo ={

			parentid:findid,
			done:false,
			mainid:new Date().getTime(),
			subcontent:e.target.elements.subtaskcontent.value
		}

		subtasks.push(subtodo);
		activityarr.push("New Subtask  added to: "+ selectedtask);
		displayactivity();
		localStorage.setItem('subtasks', JSON.stringify(subtasks));
		e.target.reset();
		DisplayTodos();
		
	})


	displayactivity();
	DisplayTodos();
	
})

function filterpriority(){
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";
	todos.forEach(todo => {

		if(todo.priority==filterforpriority.value){
		displayinsidetodo(todo,todoList);
		}

	})

}
function filtercategories(){
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";
	
	todos.forEach(todo => {

		
		if(todo.category == filterforcategory.value){
			displayinsidetodo(todo,todoList);
		}
	})

}

function funcdate(){
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";
	const stdate = document.querySelector('#startdate');

	let begindate=Date.parse(stdate.value);
	let lastdate=Date.parse(filterdate.value);
	
	todos.forEach(todo => {

		let chk=Date.parse(todo.duedate);
		if(chk>begindate && chk<lastdate){
			displayinsidetodo(todo,todoList);
		}
	})
}


function displayinsidetodo(todo,todoList){
	const maincontainer=document.createElement('div');
	maincontainer.classList.add('containdiv');
	const todoItem = document.createElement('div');
	todoItem.classList.add('todo-item');

	const label = document.createElement('label');
	const input = document.createElement('input');
	const span = document.createElement('span');
	const content = document.createElement('div');
	const actions = document.createElement('div');
	const edit = document.createElement('button');
	const deleteButton = document.createElement('button');

	const category=document.createElement('div');
	category.classList.add('checkcategory');
	const priority=document.createElement('div');
	priority.classList.add('checkpriority');
	const Duedate=document.createElement('div');
	Duedate.classList.add('checkpriority');

	input.type = 'checkbox';
	input.checked = todo.done;
	span.classList.add('bubble');
	
	
	content.classList.add('todo-content');
	actions.classList.add('actions');
	edit.classList.add('edit');
	deleteButton.classList.add('delete');
	var priorval;

	if(todo.priority==='1'){
		priorval="Low"
	}
	else if(todo.priority==='2'){
		priorval="Medium"
	}
	else{
		priorval="High";
	}

	/*tag=document.createElement('button');
	tag.classList.add("tagbttn")
	tag.innerHTML=todo.tag;
*/
	
	content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
	category.innerHTML = `<input type="text" value="${todo.category}" readonly>`;
	priority.innerHTML=`<input type="text" value="${priorval}" readonly>`;
	Duedate.innerHTML=`<input type="text" value= "${todo.duedate}" readonly>`;
	edit.innerHTML = 'Edit';
	deleteButton.innerHTML = 'Delete';

   

	label.appendChild(input);
	label.appendChild(span);
	actions.appendChild(edit);
	actions.appendChild(deleteButton);
	todoItem.appendChild(label);
	todoItem.appendChild(content);
	//todoItem.appendChild(tag);
	
	todoItem.appendChild(category);
	todoItem.appendChild(priority);
	todoItem.appendChild(Duedate);
	todoItem.appendChild(actions);
	todoItem.draggable=true;
	todoItem.todoid=todo.todoid;
	todoItem.tag=todo.tag;
	maincontainer.appendChild(todoItem);
	subtasks.forEach(subtodo =>{

		if(subtodo.parentid ==todo.todoid){
			const subItem = document.createElement('div');
	subItem.classList.add('sub-item');
const sublabel = document.createElement('label');
	const subinput = document.createElement('input');
	const subspan = document.createElement('span');
	const subcontent = document.createElement('div');
	const subactions = document.createElement('div');
	const subedit = document.createElement('button');
	const subdeleteButton = document.createElement('button');

	subinput.type = 'checkbox';
	subinput.checked = subtodo.done;
	subspan.classList.add('bubble');
	
	
	subcontent.classList.add('todo-content');
	subactions.classList.add('actions');
	subedit.classList.add('edit');
	subdeleteButton.classList.add('delete');
	subcontent.innerHTML = `<input type="text" value="${subtodo.subcontent}" readonly>`;
	
	subedit.innerHTML = 'Edit';
	subdeleteButton.innerHTML = 'Delete';
	sublabel.appendChild(subinput);
	sublabel.appendChild(subspan);
	subactions.appendChild(subedit);
	subactions.appendChild(subdeleteButton);
	subItem.appendChild(sublabel);
	subItem.appendChild(subcontent);
	//todoItem.appendChild(tag);
	
	
	subItem.appendChild(subactions);
	subItem.draggable=true;
	subItem.mainid=subtodo.mainid;
	if(subtodo.done){
		subItem.classList.add('done');
	}
	maincontainer.appendChild(subItem);

	subinput.addEventListener('change', (e) => {
		subtodo.done = e.target.checked;
		localStorage.setItem('subtasks', JSON.stringify(subtasks));
		

		if (subtodo.done) {
			subItem.classList.add('done');
			activityarr.push("Sub Task " +subtodo.content + "mark as done." );
		} else {
			subItem.classList.remove('done');
			activityarr.push("Sub Task " + subtodo.content + "mark as undone." );
		}

		displayactivity();

		DisplayTodos();

	})

	subedit.addEventListener('click', (e) => {
		const input = subcontent.querySelector('input');
		
		var deftask=input.value;
		
	

		
		if (subedit.innerText.toLowerCase() == "edit") {
		subedit.innerText = "Save";
		
			input.removeAttribute("readonly");
			
			

			input.focus();

			
			
		  } else {

			
			subedit.innerText = "Edit";
			input.setAttribute("readonly",true);
			
			subtodo.subcontent=input.value;

			
			activityarr.push("Task " + deftask + " updated to " + subtodo.subcontent);
		localStorage.setItem('subtasks', JSON.stringify(subtasks));
		displayactivity();

		  }
		  
	})

	subdeleteButton.addEventListener('click', (e) => {
		subtasks = subtasks.filter(t => t != subtodo);
		activityarr.push("Task "+ subtodo.subcontent+ " was deleted.")
		localStorage.setItem('subtasks', JSON.stringify(subtasks));
		DisplayTodos();
		displayactivity();

		
	})

	

		}

	})
	todoList.appendChild(maincontainer);

	if (todo.done) {
		todoItem.classList.add('done');
	}
	updateSelectOptions();
	totaltasks();
	input.addEventListener('change', (e) => {
		todo.done = e.target.checked;
		localStorage.setItem('todos', JSON.stringify(todos));
		

		if (todo.done) {
			todoItem.classList.add('done');
			activityarr.push("Task " +todo.content + "mark as done." );
		} else {
			todoItem.classList.remove('done');
			activityarr.push("Task " + todo.content + "mark as undone." );
		}

		displayactivity();

		DisplayTodos();

	})

	edit.addEventListener('click', (e) => {
		const input = content.querySelector('input');
		const categoryinput=category.querySelector('input');
		const priorinput=priority.querySelector('input');
		const dateinput=Duedate.querySelector('input');
		var deftask=input.value;
		
	/*	input.removeAttribute('readonly');
		//edit.innerText='Save'
		input.focus();
		input.addEventListener('blur', (e) => {
			input.setAttribute('readonly', true);
			todo.content = e.target.value;
			
			DisplayTodos()

		})*/

		
		if (edit.innerText.toLowerCase() == "edit") {
		edit.innerText = "Save";
		
			input.removeAttribute("readonly");
			
			categoryinput.removeAttribute("readonly");

			priorinput.removeAttribute("readonly");
			dateinput.removeAttribute("readonly");

			input.focus();

			console.log(categoryinput.value);
		console.log(todo.content);
			
		  } else {

			
			edit.innerText = "Edit";
			input.setAttribute("readonly",true);
			categoryinput.setAttribute("readonly", true);
			priorinput.setAttribute("readonly", true);
			dateinput.setAttribute("readonly",true);
			todo.content=input.value;

			todo.category=categoryinput.value;

			todo.priority=priorinput.value;
			todo.duedate=dateinput.value;
			activityarr.push("Task " + deftask + " updated to " + todo.content);
		localStorage.setItem('todos', JSON.stringify(todos));
		displayactivity();

		  }
		  
	})

	deleteButton.addEventListener('click', (e) => {
		todos = todos.filter(t => t != todo);
		activityarr.push("Task "+ todo.content+ " was deleted.")
		localStorage.setItem('todos', JSON.stringify(todos));
		DisplayTodos();
		displayactivity();

		
	})

	todoList.addEventListener("dragstart",onDragstart,false);
    todoList.addEventListener("drop", onDrop, false);
    todoList.addEventListener("dragover", onDragover, false);






}


function DisplayTodos () {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

/*	todos.forEach(todo => {
		displayinsidetodo(todo,todoList);

	})*/

	const expiredList=document.querySelector('#listexpired');
	expiredList.innerHTML = "";

	todos.forEach(todo => {
		
		let credate=todo.todoid;
		let expdate=Date.parse(todo.duedate);
		

		if(credate>expdate && !todo.done){
			displayinsidetodo(todo,expiredList);
		}
		else{
			displayinsidetodo(todo,todoList);

		}
	})

}

function updateSelectOptions() {
    let options = [];

    todos.forEach(todo => {
		options.push(todo.category);

	})

    let optionsSet = new Set(options);

    // empty the select options
    filterforcategory.innerHTML = "";

    let newOptionElem = document.createElement('option');
    newOptionElem.value = DEFAULT_OPTION;
    newOptionElem.innerText = DEFAULT_OPTION;
    filterforcategory.appendChild(newOptionElem);
	

    for (let option of optionsSet) {
      let newOptionElem = document.createElement('option');
      newOptionElem.value = option;
      newOptionElem.innerText = option;
      filterforcategory.appendChild(newOptionElem);
    }
	let newOption = document.createElement('option');
    newOption.value = "Show All";
    newOption.innerText ="Show All";
    filterforcategory.appendChild(newOption);


  }

function displayactivity(){
const activityitem=document.querySelector('#logboxactivity');
activityitem.innerHTML="";

activityarr.forEach(act=>{
	const maindiv=document.createElement('li');
	maindiv.innerText=act;
	activityitem.append(maindiv);
})
localStorage.setItem('activity', JSON.stringify(activityarr));

}

function onDragstart(event){
	
	
    draggingElement = event.target; //trElem
	console.log(draggingElement.mainid);
  }

  function onDrop(event){
   //debugger;
   var beforeTarget;
   let tempIndex;
   beforeTarget = event.target;
	if(draggingElement.className == "sub-item"){


		while(beforeTarget.className != "sub-item"){
			beforeTarget = beforeTarget.parentElement;
		  }
	  
		  
	  
		  
	  
		 
	  
		  // find the index of one to be taken out
		  subtasks.forEach( (todoObj, index) => {
			if( todoObj.mainid == draggingElement.mainid )
			  tempIndex = index;
		  });
		  
	  
		  // pop the element
		  let [toInsertObj] = subtasks.splice(tempIndex, 1);
	  
		  // find the index of one to be inserted before
	  
		  subtasks.forEach( (todoObj, index) => {
			if( todoObj.mainid == beforeTarget.mainid )
			  tempIndex = index;
		  });
		  
	  
		  // insert the temp
		  subtasks.splice(tempIndex, 0, toInsertObj);
	  
		  DisplayTodos();
		  localStorage.setItem('subtasks', JSON.stringify(subtasks));

	}
   else{
     

    // to look through parent until it is tr
    while(beforeTarget.className != "todo-item"){
      beforeTarget = beforeTarget.parentElement;
	}

    

	

   

    // find the index of one to be taken out
    todos.forEach( (todoObj, index) => {
      if( todoObj.todoid == draggingElement.todoid )
        tempIndex = index;
    });
	console.log(tempIndex);

    // pop the element
    let [toInsertObj] = todos.splice(tempIndex, 1);

    // find the index of one to be inserted before

    todos.forEach( (todoObj, index) => {
      if( todoObj.todoid == beforeTarget.todoid )
        tempIndex = index;
    });
	console.log(tempIndex);

    // insert the temp
    todos.splice(tempIndex, 0, toInsertObj);

	DisplayTodos();
	localStorage.setItem('todos', JSON.stringify(todos));

    // update storage
}

  }

  function onDragover(event){
    event.preventDefault();
  }

  function totaltasks(){

	let options = [];

    todos.forEach(todo => {
		options.push(todo.content);

	})

    let optionsSet = new Set(options);

    // empty the select options
    taskbar.innerHTML = "";

    let newOptionElem = document.createElement('option');
    newOptionElem.value = "Choose Task";
    newOptionElem.innerText = "Choose Task";
    taskbar.appendChild(newOptionElem);
	

    for (let option of optionsSet) {
      let newOptionElem = document.createElement('option');
      newOptionElem.value = option;
      newOptionElem.innerText = option;
      taskbar.appendChild(newOptionElem);
    }
	
  }