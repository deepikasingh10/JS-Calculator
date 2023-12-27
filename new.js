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
let input = "";
let history = [];
let records = [];

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
            let result = calculate();
            display_output.innerHTML = CleanOutput(result);
            input = result;
            records.push(input);

// show memory when user clicked M
        } else if (value === "M") {
            let result = savememory();
            display_output.innerHTML = CleanOutput(result);
            input = result;
            // retrieve the data
            const memoryElements = JSON.parse(sessionStorage.getItem(MEMORY_STORAGE));
            if (!memoryElements.includes(input)) {
                memoryElements.push(input);
            }
            // store the data
            sessionStorage.setItem(MEMORY_STORAGE, JSON.stringify(memoryElements));
            input = display_output.value;
            refreshMemory();

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

function savememory(){
    if (input !== ""){
        const result = calculate();
        if (typeof result === "number" && Number.isFinite(result)){
            memoryValue = result;
            display_input.innerHTML = CleanOutput(memoryValue);
        }
    }else if (memoryValue !== null){
        input = memoryValue.toString();
        display_input.innerHTML = CleanInput(input);
    }
    sessionStorage.setItem("memory", memoryValue);
}

// savememory function
function savememory() {
    try {
        if (records == '') {
            return ' '
        } else
            return records.pop();
    }
    catch (error) {
        return 'ERROR';
    }
}

// newHistoryDisplay function
function newHistoryDisplay() {
    let historyHtml = "";
    for (let calculation of history) {
        historyHtml = `<div>${calculation}</div>`+historyHtml
    }
    history_display.innerHTML = historyHtml;
}

// Variable for memory storage 
const MEMORY_STORAGE = 'memory_storage';

// Session Storage for Memory
if (sessionStorage.getItem(MEMORY_STORAGE) == null) {
    sessionStorage.setItem(MEMORY_STORAGE, JSON.stringify([]))
}
refreshMemory();

// refreshMemory function for storing memory in session storage
function refreshMemory() {
    memory_display=""
    memory_display.innerHTML = '';
    // JSON.parse() to convert text into a JavaScript object
    let memoryElements = JSON.parse(sessionStorage.getItem(MEMORY_STORAGE));
    for (let i = memoryElements.length - 1; i >= 0; i--) {
        const div = document.createElement('div');
        div.innerHTML = `
            <div>${truncate(memoryElements[i], 14)}</div>
            <div>${truncate(calculate(), 14)}</div>`;

        memory_display.appendChild(div);
    }
}







