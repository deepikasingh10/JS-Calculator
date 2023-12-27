// ============== Button toggle ==============
const button = document.querySelector(".theme-toggle");
const buttonToggle = document.querySelector(".theme-toggle span");

// Changing background color when user clicks on btnSwitch 
button.onclick = function () {
	buttonToggle.classList.toggle("active-btn");
	document.body.classList.toggle("active-dark")
}
// ============== Calculator functionality ==============
const keys = document.querySelectorAll('.key');
// Calculator Display Screen
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";
let records = [];

for (let key of keys) {
	const value = key.dataset.key;

	//Handle different button values
	key.addEventListener('click', () => {//Handling button clicks
		// clear everything
		if (value == "clear") {
			input = "";
			display_input.innerHTML = "";
			display_output.innerHTML = "";

			// removes last element using slice method
		} else if (value == "backspace") {
			input = input.slice(0, -1);
			display_input.innerHTML = CleanInput(input);

			// show result when user clicked
		} else if (value == "=") {
			//function calculate() { }
			let result = eval(PerpareInput(input));
			display_output.innerHTML = CleanOutput(result);
			input = result;
			records.push(input);

			// show history when user clicked M
		} else if (value == "M") {
			let result = history();
			display_output.innerHTML = CleanOutput(result);
			input = result;

		// } else if (value == "=") {
		//function calculate() { }

		} else {
			if (ValidateInput(value)) {
				input += value;
				display_input.innerHTML = CleanInput(input);
			}
		}
	})
}

// This function takes input string and replaces certain character with their corresponding html elements
function CleanInput(input) {
	let input_array = input.split("");
	let input_array_length = input_array.length;

	for (let i = 0; i < input_array_length; i++) {
		if (input_array[i] == "*") {
			input_array[i] = ` <span class="operator">x</span> `;
		} else if (input_array[i] == "/") {
			input_array[i] = ` <span class="operator">÷</span> `;
		} else if (input_array[i] == "+") {
			input_array[i] = ` <span class="operator">+</span> `;
		} else if (input_array[i] == "-") {
			input_array[i] = ` <span class="operator">-</span> `;
		} else if (input_array[i] == "%") {
			input_array[i] = `<span class="percent">%</span>`;
		}
	}
	return input_array.join("");
}

// This function takes numeric input
function CleanOutput(output) {
	let output_string = output.toString();
	let decimal = output_string.split(".")[1];
	output_string = output_string.split(".")[0];

	let output_array = output_string.split("");

	if (output_array.length > 3) {
		for (let i = output_array.length - 3; i > 0; i -= 3) {
			output_array.splice(i, 0, ",");
		}
	}
	if (decimal) {
		output_array.push(".");
		output_array.push(decimal);
	}
	return output_array.join("");
}

// This function checks whether the input is valid or not
function ValidateInput(value) {
	let last_input = input.slice(-1);
	let operators = ["+", "-", "*", "/"];

	if (value == "." && last_input == ".") {
		return false;
	}

	if (operators.includes(value)) {
		if (operators.includes(last_input)) {
			return false;
		} else {
			return true;
		}
	} return true;
}

// This function takes input for the evaluation
function PerpareInput(input) {
	let input_array = input.split("");

	for (let i = 0; i < input_array.length; i++) {
		if (input_array[i] == "%") {
			input_array[i] = "/100";
		}
	}
	return input_array.join("");
}

// function calculate() {
// 	let operators = [];
// 	let numbers = [];

// 	let number = "";
// 	for (let char of input) {
// 		if (operators(char)) {
// 			operators.push(char);
// 			numbers.push(Number(number));
// 			number = "";
// 		}
// 		else {
// 			number += char;
// 		}
// 	}
// 	numbers.push(Number(number));
// 	let result = numbers[0];
// 	for (let i = 0; i < operators.length; i++) {
// 		const operator = operators[i];
// 		const operand = numbers[i + 1];
// 	}
// 	switch (operators) {
// 		case "+":
// 			result += operand
// 			break;
// 		case "-":
// 			result -= operand
// 			break;
// 		case "x":
// 			result *= operand
// 			break;
// 		case "/":
// 			result /= operand
// 			break;
// 		case "%":
// 			result %= (numbers[i] / 100) * operand;
// 			break;
// 	}
// }
// if (!isNaN(result) && isFinite(result)) {
// 	display_output.innerHTML = CleanOutput(result);
// 	//input = result;
// 	//records.push(input);
// }
// else {
// 	display_output.innerHTML = "Error";
// }

// This function shows history
function history() {
	try {
		if (records == '') {
			return ' '
		}
		else
			return records.pop();
	}
	catch (error) {
		return 'ERROR';
	}
}



