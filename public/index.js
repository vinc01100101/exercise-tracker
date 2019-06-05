function onSubmit(){
	const input = document.getElementById('date').value;
	const date = new Date(input)
	
	if(date == 'Invalid Date'){
		alert("Invalid DATE input");
		event.preventDefault();
	}
}