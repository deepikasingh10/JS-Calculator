// ============== Button toggle ==============
const button = document.querySelector(".theme-toggle");
const buttonToggle = document.querySelector(".theme-toggle span");

// Changing background color when user clicks on btnSwitch 
button.onclick = function () {
    buttonToggle.classList.toggle("active-btn");
    document.body.classList.toggle("active-dark")
}
// ============== Calculator functionality ==============
// Variables
const keys = document.querySelectorAll('.key');
// Calculator Display Screen Input and output
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');
// Variable for history
const history_display = document.querySelector('.history');
let isMemorySet = false;
let input = "";
let history = [];
let memory = null;
let res = 0;

// for loop to iterating over key elements
for (let key of keys) {
    const value = key.dataset.key;

    // Add event listeners for button click
    key.addEventListener('click', () => {
        // clear everything
        if (value === "clear") {
            clearInput();
            input = "";
            display_input.innerHTML = "";
            display_output.innerHTML = "0";

            // removes last element using slice method
        } else if (value === "backspace") {
            input = input.slice(0, -1);
            display_input.innerHTML = CleanInput(input);

            // show result when user clicked equal(=) sign
        } else if (value === "=") {
            calculate("=");
            historyStorage();

            // show memory when user clicked M
        } else if (value === "M") {
            console.log(res)
            savememory();

        } else {
            if (ValidateInput(value)) {
                input += value;
                display_input.innerHTML = CleanInput(input);
            }
        }
    });
}

// add a event mouseup to perform live calculation
addEventListener('mouseup', calculate);

// calculate function to perform different arithmetic operations
function calculate(val) {
    let operators = [];
    let numbers = [];
    if (val === "=") {
        operators.push("=");
    }

    let number = "";
    for (let char of input) {
        // prepareOperator is used to check character
        if (prepareOperator(char)) {
            operators.push(char);
            numbers.push(Number(number));
            number = "";
        }
        else {
            number += char;
        }
    }
    numbers.push(Number(number));
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        const operator = operators[i];
        const operand = numbers[i + 1];

        // Switch case statements
        switch (operator) {
            case "+":
                result += operand;
                break;
            case "-":
                result -= operand;
                break;
            case "*":
                result *= operand;
                break;
            case "/":
                result /= operand;
                break;
            case "%":
                result = (numbers[i] / 100) * operand;
                break;
            case "=":
                result = new Function('return ' + input)();
                const calculation = `${CleanInput(input)}=${result}`;
                history.push(calculation);
                newHistoryDisplay();
                res = result;
        }
    }
    if (!isNaN(result) && isFinite(result)) {
        display_output.innerHTML = CleanOutput(result);
    }
    else {
        display_output.innerHTML = CleanOutput(res);
    }
}

// clearInput function to clears everything when AC is clicked
function clearInput() {
    input = "";
    display_input.innerHTML = "";
    display_output.innerHTML = "";
}

// prepareOperator function is used to check character
function prepareOperator(char) {
    return ['=', '+', '-', '*', '/', '%'].includes(char);
}

// CleanInput function takes input string and replaces certain character with their corresponding html elements
function CleanInput(input) {
    return input.replace(/(\*|\/|\+|\-|\%)/g, ' $1 ');
}

// CleanOutput function takes numeric input
function CleanOutput(output) {
    let output_string;
    // converting e into a number
    if (Number.isFinite(output) && Math.abs(output) > 1e9) {
        output_string = output.toLocaleString('en', { maximumFractionDigits: 10 });
    }
    else {
        output_string = output.toString();
    }
    return output_string;
}

// This function checks whether the input is valid or not
function ValidateInput(value) {
    let last_input = input.slice(-1);
    let operators = ["+", "-", "*", "/", "%"];

    if (value === "." && last_input === ".") {
        return false;
    }
    if (operators.includes(value)) {
        if (operators.includes(last_input)) {
            return false;
        } else {
            return true;
        }
    }
    return true;
}

// save memory function
function savememory() {
    if (input !== ""){
        const result = res;
        if (typeof result === "number" && Number.isFinite(result)){
            memory = result;
            display_input.innerHTML = CleanOutput(memory);
        memoryStorage();
        }
    }else if (memory !== null){
        input = memory.toString();
        display_input.innerHTML = CleanInput(input);
    }
}

// newHistoryDisplay function
function newHistoryDisplay() {
    let historyHtml = "";
    for (let i = history.length - 1; i >= 0; i--) {
        const calculation = history[i];
        if (calculation.includes('=')) {
            historyHtml += `<div>${calculation}</div>`;
        }
    }
    history_display.innerHTML = historyHtml;
}

// Retrieve the history data to localStorage
if (localStorage.getItem('calculatorHistory')) {
    // JSON.parse() to convert text into a JavaScript object
    history = JSON.parse(localStorage.getItem('calculatorHistory'));
    newHistoryDisplay();
}



// function to store history in local Storage
function historyStorage() {
    // JSON.stringify() function will convert any data into string
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
}

// Retrieve the memory data to sessionStorage
if (sessionStorage.getItem('calculatorMemory')) {
    // parseFloat() function parses a string argument and returns a floating point number
    memory = parseFloat(sessionStorage.getItem('calculatorMemory'));
    display_input.innerHTML = CleanOutput(memory);
}

// function to store memory in Session Storage
function memoryStorage() {
    //store the data in sessionStorage
    sessionStorage.setItem('calculatorMemory', memory.toString());
}









