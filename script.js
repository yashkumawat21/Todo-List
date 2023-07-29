const DEFAULT_OPTION = "Choose category";
var firstcontent="",lastcontent="";
var forduedate;
var forduedatelast;
var forduetime;
var totalcontent;
var sortdict = {

	Low:1,
	Medium:2,
	High:3
}

var draggingElement;
window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	activityarr = JSON.parse(localStorage.getItem('activity')) || [];


	subtasks = JSON.parse(localStorage.getItem('subtasks')) || [];

	
	
	


	

	filterforcategory= document.getElementById("categoryfilter");

	filterforcategory.addEventListener("change", filters);

		
		
		
	
	filterforpriority= document.getElementById("priorityfilter");

	filterforpriority.addEventListener("change", filters);

	filterdate=document.querySelector('#enddate');
	filterdate.addEventListener('change', filters,false);

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
				
				return sortdict[b.priority]-sortdict[a.priority];
			})
			
			DisplayTodos();
		}
		else{
			DisplayTodos();
		}
	})


		

	search=document.querySelector('#searchbar');
	search.addEventListener('keyup',e=>{
		const text = e.target.value.toLowerCase();
		
    const allItem = document.querySelectorAll('.containdiv');
	
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
	const newTodoForm = document.querySelector('#new-todo-form');
	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();
		const comple=e.target.elements.content.value;
		forduedatelast=e.target.elements.duedate.value;
		forduetime=e.target.elements.duedatetime.value
		autocompletion(comple);
		const todo = {
			content: totalcontent,
			category: e.target.elements.category.value,
            priority : e.target.elements.priority.value,
			duedate :forduedatelast,
			duetime:forduetime,
			tag:e.target.elements.tag.value,
			todoid:new Date().getTime(),

			done: false,
			//createdAt: 
			
		}
		
		

		todos.push(todo);
		let newdatetme= new Date( new Date().getTime());
		activityarr.push("New task added: "+ todo.content+ " at "+ newdatetme);
		displayactivity();

		localStorage.setItem('todos', JSON.stringify(todos));

		// Reset the form
		e.target.reset();

		

		DisplayTodos();
		updateSelectOptions();
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
		let newdatetme= new Date( new Date().getTime());
		activityarr.push("New Subtask  added to: "+ selectedtask+ " at "+ newdatetme);
		displayactivity();
		localStorage.setItem('subtasks', JSON.stringify(subtasks));
		e.target.reset();
		DisplayTodos();
		
	})

	reminderform =document.querySelector("#reminder");


	reminderform.addEventListener('submit', e=>{
		e.preventDefault();
		debugger;
		let ar=e.target.elements.dated.value;
		let br=e.target.elements.timed.value;
		const k= new Date(ar+" "+br);

		let remindertask=e.target.elements.remindercontent.value;

		let d=Date.parse(k);

		setReminderAlert(d,remindertask);

		e.target.reset();

		
	})


	displayactivity();
	DisplayTodos();
	updateSelectOptions();
	
})


function setReminderAlert(reminderTime,content) {
	const currentTime = new Date().getTime();
	const timeToReminder = reminderTime - currentTime;
  
	if (timeToReminder <= 0) {
	  console.log("Reminder time should be in the future.");
	  return;
	}
  
	setTimeout(() => {
	  // This code will be executed when the reminder time is reached
	  alert(content);
	}, timeToReminder);
  }

function filters(){
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";
	const stdate = document.querySelector('#startdate');
	
	let begindate=0;
	let lastdate=0
	console.log(begindate +"and"+ lastdate);
	
	if(stdate.value!==""){
		begindate=Date.parse(stdate.value);
	}
	if(filterdate.value!==""){
		lastdate=Date.parse(filterdate.value);
	}

	
	todos.forEach(todo => {
		
		let chk=Date.parse(todo.duedate);
	if((filterforcategory.value==="Choose category" || todo.category==filterforcategory.value ) && (filterforpriority.value==="default" || todo.priority==filterforpriority.value )   && (begindate==0 || lastdate==0 || (chk>=begindate && chk<=lastdate))){

		
		displayinsidetodo(todo,todoList);
	}
		
		})

	

}
/*
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
	

	
	todos.forEach(todo => {

		
		if(chk>begindate && chk<lastdate){
			displayinsidetodo(todo,todoList);
		}
	})
}
*/

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
	category.classList.add('check');
	const tags=document.createElement('div');
	tags.classList.add('check');
	const priority=document.createElement('div');
	priority.classList.add('check');
	const Duedate=document.createElement('div');
	Duedate.classList.add('check');
	const Duetime=document.createElement('div');
	Duetime.classList.add('check');
	

	input.type = 'checkbox';
	input.checked = todo.done;
	span.classList.add('bubble');
	
	
	content.classList.add('todo-content');
	actions.classList.add('actions');
	edit.classList.add('edit');
	deleteButton.classList.add('delete');


	

	/*tag=document.createElement('button');
	tag.classList.add("tagbttn")
	tag.innerHTML=todo.tag;
*/
	
	content.innerHTML = `<input type="text" value="${todo.content}" >`;
	category.innerHTML = `<input type="text" value="${todo.category}" >`;
	tags.innerHTML=`<input type="text" value="${todo.tag}" readonly>`;
	priority.innerHTML=`<input type="text" value="${todo.priority}" readonly>`;
	Duedate.innerHTML=`<input type="date" value= "${todo.duedate}" readonly>`;
	Duetime.innerHTML=`<input type="time" value= "${todo.duetime}" readonly>`;
	edit.innerHTML = 'Edit';
	deleteButton.innerHTML = 'Delete';

   

	label.appendChild(input);
	label.appendChild(span);
	actions.appendChild(edit);
	actions.appendChild(deleteButton);
	todoItem.appendChild(label);
	todoItem.appendChild(content);
	todoItem.appendChild(tags);
	
	todoItem.appendChild(category);
	todoItem.appendChild(priority);
	todoItem.appendChild(Duedate);
	todoItem.appendChild(Duetime);
	todoItem.appendChild(actions);

	let a=Date.parse(todo.duedate+ " "+todo.duetime);

	let b= new Date().getTime();

	if(a<b && !todo.done){
		maincontainer.classList.add("expiredtask")
		todoItem.classList.add("expiredtask");
	}
	else{
		maincontainer.classList.remove("expiredtask")
		todoItem.classList.remove("expiredtask");
	}


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
		let newdatetme= new Date( new Date().getTime());

		if (subtodo.done) {
			subItem.classList.add('done');
			activityarr.push("Sub Task " +subtodo.content + "mark as done at "+newdatetme );
		} else {
			subItem.classList.remove('done');
			activityarr.push("Sub Task " + subtodo.content + "mark as undone at "+newdatetme );
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
			let newdatetme= new Date( new Date().getTime());

			
			activityarr.push("Task " + deftask + " updated to " + subtodo.subcontent+ " at "+newdatetme);
		localStorage.setItem('subtasks', JSON.stringify(subtasks));
		displayactivity();

		  }
		  
	})

	subdeleteButton.addEventListener('click', (e) => {
		subtasks = subtasks.filter(t => t != subtodo);
		let newdatetme= new Date( new Date().getTime());
		activityarr.push("Task "+ subtodo.subcontent+ " was deleted at "+newdatetme);
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

	
	
	
	input.addEventListener('change', (e) => {
		todo.done = e.target.checked;
		localStorage.setItem('todos', JSON.stringify(todos));
		
		let newdatetme= new Date( new Date().getTime());
		if (todo.done) {
			todoItem.classList.add('done');
			activityarr.push("Task " +todo.content + "mark as done at "+newdatetme );
		} else {
			todoItem.classList.remove('done');
			activityarr.push("Task " + todo.content + "mark as undone at " +newdatetme);
		}

		displayactivity();

		DisplayTodos();

	})

	

	edit.addEventListener('click', (e) => {
		const input = content.querySelector('input');
		const categoryinput=category.querySelector('input');
		const priorinput=priority.querySelector('input');
		const dateinput=Duedate.querySelector('input');
		const timeinput =Duetime.querySelector('input');
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
		edit.style.backgroundColor="orange";
		
			input.removeAttribute("readonly");
			
			categoryinput.removeAttribute("readonly");

			priorinput.removeAttribute("readonly");
			dateinput.removeAttribute("readonly");
			timeinput.removeAttribute("readonly");
			

			input.focus();

			
			
		  } else {

			
			edit.innerText = "Edit";
			edit.style.backgroundColor="blue";
			input.setAttribute("readonly",true);
			categoryinput.setAttribute("readonly", true);
			priorinput.setAttribute("readonly", true);
			dateinput.setAttribute("readonly",true);
			timeinput.setAttribute("readonly",true);
			todo.content=input.value;

			todo.category=categoryinput.value;

			todo.priority=priorinput.value;
			todo.duedate=dateinput.value;
			todo.duetime=timeinput.value;
			updateSelectOptions();
			let newdatetme= new Date( new Date().getTime());
			activityarr.push("Task " + deftask + " updated to " + todo.content +" at "+newdatetme);
		localStorage.setItem('todos', JSON.stringify(todos));
		displayactivity();

		  }
		  
	})

	deleteButton.addEventListener('click', (e) => {
		todos = todos.filter(t => t != todo);
		let newdatetme= new Date( new Date().getTime());
		activityarr.push("Task "+ todo.content+ " was deleted at "+ newdatetme)
		localStorage.setItem('todos', JSON.stringify(todos));
		DisplayTodos();
		updateSelectOptions();
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
		
		let credate= new Date().getTime();
		let expdate=Date.parse(todo.duedate);
		

		if(credate+86400000 >expdate && !todo.done){
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
	
	totaltasks();
	

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
	
  }

  function onDrop(event){
   //debugger;
   var beforeTarget;
   let tempIndex;
   let afterindex;
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
			  afterindex = index;
		  });
		  if(afterindex>=tempIndex){
			afterindex=afterindex+1;
		  }
	  
		  // insert the temp
		  subtasks.splice(afterindex, 0, toInsertObj);
	  
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
	console.log(todos);

    // find the index of one to be inserted before

    todos.forEach( (todoObj, index) => {
      if( todoObj.todoid == beforeTarget.todoid )
        afterindex = index;
    });
	
	
	console.log("fd"+tempIndex);
	if(afterindex>=tempIndex){
		afterindex=afterindex+1;
	  }

    // insert the temp
    todos.splice(afterindex, 0, toInsertObj);
	console.log(todos);
	DisplayTodos();
	localStorage.setItem('todos', JSON.stringify(todos));

    
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


  function padTo2Digits(num) {
	return num.toString().padStart(2, '0');
  }
  
  function formatDate(date) {
	return [
		date.getFullYear(), 
	  padTo2Digits(date.getMonth() + 1),
	  padTo2Digits(date.getDate()) ,
	].join('-');
  }
function autocompletion(textcon){
	console.log(textcon);
	

	
	var datename="";

	var lastidx=textcon.length;
	let idxin;

	for(let i=textcon.length-1;i>=0;i--){

		if(textcon[i]==" "){
			idxin=i-3;
			break;
		}

		datename=datename+ textcon[i];
		

	}
	const lastcontent = Array.from(datename).reverse().join("");

	

		if(lastcontent.toLowerCase()=="tomorrow"){

			totalcontent=textcon.substr(0,idxin);


			forduedate= new Date(new Date().getTime()+86400000);
			
			forduedatelast=formatDate(forduedate);
			console.log(forduedatelast);


			


		}
		else if(lastcontent.toLowerCase()=="today"){
			totalcontent=textcon.substr(0,idxin);


			forduedate= new Date(new Date().getTime());
			
			forduedatelast=formatDate(forduedate);
			console.log(forduedatelast);

		}
		else if(lastcontent.toLowerCase()=="pm" || lastcontent.toLowerCase()=="am"){

			var str="";
			var totalstr=" "


			for(let i=textcon.length-1;i>=0;i--){

				if(textcon[i]==" "){
					const arrstr = Array.from(str).reverse().join("");
					if(arrstr=="by"){
						str=""
						idxin=i;
						break;
					}
					else{
						totalstr=totalstr +" "+str;
						str="";
					}

				}
				else{ 
		
				str=str+ textcon[i];
				}
				
				
		
			}
			totalcontent=textcon.substr(0,idxin);

			let newarr=Array.from(totalstr).reverse().join("");
			
			forduedate= new Date(newarr);
			forduetime=forduedate.toLocaleTimeString('en-US', { hour12: false });
			console.log(forduetime)
			forduedatelast=formatDate(forduedate);
			console.log(forduedatelast);
			
		}

		else{

	
	
		totalcontent=textcon;
		}
	

	
}