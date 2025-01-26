log = console.log;

const screen = document.querySelector(".screen");
const calcLog = screen.querySelector(".log");
const entry = screen.querySelector(".entry");
const buttons = document.querySelectorAll("button");
let inputsArray = [];
let currentNum = null;
let isFloat = false;
let firstNumAsString;

buttons.forEach(button =>
    button.addEventListener("click", (event) => click(event.target)) // pass the element (button)
);

// Calculate using keyboard
document.addEventListener("keydown", (event) => {
    let keypress = event.key;
    let fakeClickBtn;

    if (Number.isInteger(+keypress)) {
        // Simulate getting the event.target of a click
        fakeClickBtn = document.createElement("button");
        fakeClickBtn.innerText = keypress;
        click(fakeClickBtn);
    }
    else {
        switch (keypress) {
            case "Enter":
                fakeClickBtn = document.getElementById("=");
                click(fakeClickBtn);
                break;
            case "c":
                fakeClickBtn = document.getElementById("clear");
                click(fakeClickBtn);
                break;
            case "=":
            case "+":
            case "x":
            case "/":
            case "-":
            case ".":
            case "Backspace":
                fakeClickBtn = document.getElementById(keypress);
                click(fakeClickBtn);
                break;
            default: null;
        }
    }

});

function click(clickedButton) {
    let btnContent = clickedButton.textContent;
    switch (clickedButton.className) {
        case "": // user clicks on number
            // Remove filler text (used for keeping calcLog above entry)
            if (entry.textContent === "filler") {
                entry.textContent = "";
                entry.style.color = "#f5f9fd";
            }

            // CurrentNum depends on itself only, not on the screen output!
            if (isFloat) {
                let [tmp, numOfDecimals] = (entry.textContent.split("."));
                currentNum = currentNum + (+btnContent) / Math.pow(10, numOfDecimals.length + 1);
                entry.textContent += btnContent; // using string notation since JS bugs out with large decimals
            }
            else {
                currentNum = currentNum * 10 + +btnContent;
                entry.textContent = currentNum;
            }

            // If array length == 2, it means there is an operator inside the array.
            // Therefore, no need to update value at inputsArray[0]
            let indexToChange = inputsArray.length >= 2 ? 2 : 0;
            inputsArray[indexToChange] = currentNum;

            // Clears log if a NEW operation is started. 
            // (There is an operation already present on the log, and user is entering a NEW number
            // therefore, wants to erase previous operation from memory)
            if (indexToChange === 0) {
                calcLog.textContent = "";
            }

            break;

        case "operator":
            if (typeof inputsArray[0] === "number"
                && (inputsArray.length === 1 ||
                    inputsArray.length === 2) // If user wants to change the operator
            ) {
                if (isFloat && entry.textContent.at(-1) === ".") {
                    entry.textContent = entry.textContent.slice(0, -1);
                }

                // Reset CurrentNum to allow user to input next number for the operation
                currentNum = null;

                // IF not enough elements to perform an operation on: Break out of switch
                if (inputsArray.length < 3) {
                    // If user wants to change the operator
                    if (inputsArray.length === 2) {
                        inputsArray.pop();
                    }
                    inputsArray.push(btnContent) // add operator to array
                    isFloat = false; // reset isFloat so that when entering a new number, it doesn't add onto the decimals of the previous number

                    // CALCULATOR LOG
                    firstNumAsString = entry.textContent;
                    calcLog.textContent = `${firstNumAsString} ${inputsArray[1]}`;

                    break;
                }
                // ElSE perform the operation by using switch fallthrough (instead of breaking)
                // aka perform case "equal" below

            }

        case "equal":
            if (inputsArray.length === 3) {
                // Longer way to account for bad JS rounding for floats
                calcLog.textContent = `${firstNumAsString} ${inputsArray[1]} ${entry.textContent} = `;

                let result = operate(...inputsArray);
                entry.textContent = result;

                inputsArray = [result];
                // Will not cause problem if user enters another number directly,
                // since inputsArray[0] will be replaced by said number since array.length != 2 (check logic under case "")

                currentNum = null;
                isFloat = false; // reset isFloat so that when entering a new number, it doesn't add onto the decimals of the previous number

                // Keep operator in memory if an operator was clicked before pressing "="
                if (btnContent !== "=" &&
                    (!(inputsArray.includes("⌐(ಠ۾ಠ)¬")))
                ) {
                    inputsArray.push(btnContent);
                    firstNumAsString = entry.textContent;
                    calcLog.textContent = `${firstNumAsString} ${inputsArray[1]}`;
                }
            }
            break;

        case "clear":
            inputsArray = [];
            entry.textContent = "";
            calcLog.textContent = "";
            currentNum = null;
            isFloat = false;
            firstNumAsString = "";
            break;

        case "delete":
            // User deletes the decimal point
            if (entry.textContent.at(-1) === ".") {
                isFloat = false;
                entry.textContent = entry.textContent.slice(0, -1);
            }

            // Delete digit if currentNum holds a value
            else if (currentNum !== null || entry.textContent === "0") {
                entry.textContent = entry.textContent.slice(0, -1);

                // IF the currentNum is 0, this means user has deleted the whole number (except case: 0.xxx)
                // Remove it from the array
                if (entry.textContent === "") {
                    // Keep the calcLog text ABOVE the entry box
                    if (calcLog.textContent !== "") {
                        entry.textContent = "filler";
                        entry.style.color = "#7CBDD5" // screen blue
                    }
                    currentNum = null;
                    inputsArray.pop();
                }
                // ELSE update the currentNum
                else {
                    currentNum = +entry.textContent;
                    let indexToChange = inputsArray.length >= 2 ? 2 : 0;
                    inputsArray[indexToChange] = currentNum;
                }
            }
            break;

        case "dot":
            if (isFloat === false) {
                if (currentNum === null) { // user pressed dot without entering a number first
                    currentNum = 0;
                    let indexToChange = inputsArray.length >= 2 ? 2 : 0;
                    inputsArray[indexToChange] = currentNum;
                    entry.textContent = "0"

                    // Clear calcLog if "dot" was pressed after an operation already finished calculatting
                    if (calcLog.textContent.includes("=")) {
                        calcLog.textContent = "";
                    }
                }
                entry.textContent += ".";
                isFloat = true;
            }
    }
    log(currentNum, inputsArray);
}

function operate(num1, operator, num2) {
    switch (operator) {
        // added "+" to remove trailing 0s from number
        case "+": return +add(num1, num2).toFixed(4);
        case "—": return +subtract(num1, num2).toFixed(4);
        case "x": return +multiply(num1, num2).toFixed(4);
        case "÷": return divide(num1, num2);
        default: return "UH OH!";
    }
}


function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    if (b === 0) {
        return "⌐(ಠ۾ಠ)¬";
    }
    return +(a / b).toFixed(4);
}
// Darken button when hovering
buttons.forEach(button =>
    button.addEventListener("mouseover", () => button.style.filter = "brightness(85%)")
)
buttons.forEach(button =>
    button.addEventListener("mouseleave", () => button.style.filter = "")
);