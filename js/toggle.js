const toggleButton = document.getElementsByClassName('toggle-button')[0];
const myNavbarBody = document.getElementsByClassName('myNavbarBody')[0];
const dropdownbButton = document.getElementsByClassName('dropdown')[0];
const dropdownContent = document.getElementsByClassName('dropdownContent')[0];

toggleButton.addEventListener("click", () => {
		myNavbarBody.classList.toggle('active');	
	})
	
dropdownbButton.addEventListener("click", () => {
		dropdownContent.classList.toggle('active');
	})