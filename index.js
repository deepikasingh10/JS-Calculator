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
let memory=null;

// for loop to iterating over key elements
for (let key of keys) {
    const value = key.dataset.key;
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
            calculate();
            historyStorage();
           // show memory when user clicked M
        } else if (value === "M") {
            savememory();

        } else {
            if (ValidateInput(value)) {
                input += value;
                display_input.innerHTML = CleanInput(input);
            }
        }
    });  
}
// calculate function to perform different arithmetic operations
function calculate() {
    let operators = [];
    let numbers = [];

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
        }
    }

    if (!isNaN(result) && isFinite(result)) {
        display_output.innerHTML = CleanOutput(result);
    }
    else {
        display_output.innerHTML = "Error";
    }

    // Add the calculation to the history
    const calculation = `${CleanInput(input)}=${CleanOutput(result)}`;
    history.push(calculation);
    newHistoryDisplay();
    return result;
}
// add a event to perform live calculation
addEventListener("mouseup", calculate);

// clearInput function clears everything
function clearInput() {
    input = "";
    display_input.innerHTML = "";
    display_output.innerHTML = "";
}

// prepareOperator function is used to check character
function prepareOperator(char) {
    return ['+', '-', '*', '/', '%'].includes(char);
}

// CleanInput function takes input string and replaces certain character with their corresponding html elements
function CleanInput(input) {
    return input.replace(/(\*|\/|\+|\-|\%)/g, ' $1 ');
}

// CleanOutput function takes numeric input
function CleanOutput(output) {
    let output_string;
    // converting e into a number
    if (Number.isFinite(output) && Math.abs(output) > 1e9) 
    {
        output_string = output.toLocaleString('en', { maximumFractionDigits: 10 });
    } 
    else 
    {
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
function savememory(){
    if (input !== ""){
        const result = calculate();
        if (typeof result === "number" && Number.isFinite(result)){
            memoryValue = result;
            display_input.innerHTML = CleanOutput(memoryValue);
            memoryStorage();
        }
    }else if (memoryValue !== null){
        input = memoryValue.toString();
        display_input.innerHTML = CleanInput(input);
    }
}

// newHistoryDisplay function
function newHistoryDisplay() {
    let historyHtml = "";
    for (let i=history.length-1;i>=0;i--) {
        const calculation=history[i];
        if (calculation.includes('=')){
            historyHtml += `<div>${calculation}</div>`;
         }
    }
    history_display.innerHTML = historyHtml;
}

// Retrieve the history data to localStorage
if (localStorage.getItem('calculatorHistory')){
    // JSON.parse() to convert text into a JavaScript object
    history=JSON.parse(localStorage.getItem('calculatorHistory'));
    newHistoryDisplay();
}



// function to store history in local Storage
function historyStorage(){
    // JSON.stringify() function will convert any data into string
    localStorage.setItem('calculatorHistory',JSON.stringify(history));
}

// Retrieve the memory data to sessionStorage
if (sessionStorage.getItem('calculatorMemory')){
    // parseFloat() function parses a string argument and returns a floating point number
    memoryValue=parseFloat(sessionStorage.getItem('calculatorMemory'));
    display_input.innerHTML=CleanOutput(memoryValue);
}

// function to store memory in Session Storage
function memoryStorage(){
    //store the data in sessionStorage
    sessionStorage.setItem('calculatorMemory', memoryValue.toString());
}









