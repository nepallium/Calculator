log = console.log;

const screen = document.querySelector(".screen");
const calcLog = screen.querySelector(".log");
const entry = screen.querySelector(".entry");
const buttons = document.querySelectorAll("button");
let inputsArray = [];
let currentNum = null;
let isFloat = false;

buttons.forEach(button => 
    button.addEventListener("click", (event) => click(event.target))
);
// Calc using keyboard
document.addEventListener("keydown", (event) => {

});

function click(clickedButton) {
    let btnContent = clickedButton.textContent;
    switch (clickedButton.className) {
        case "": // user clicks on number
            // CurrentNum depends on itself only, not on the screen output!
            if (isFloat) {
                let [tmp, numOfDecimals] = (entry.textContent.split("."));
                currentNum = currentNum + (+btnContent)/Math.pow(10, numOfDecimals.length + 1);
                entry.textContent += btnContent; // using string notation since JS bugs out with large decimals
            }
            else {
                currentNum = currentNum*10 + +btnContent;
                entry.textContent = currentNum;
            }
            
            // If array length == 2, it means there is an operator inside the array.
            // No need to update value at inputsArray[length-1]
            let sliceEnd = inputsArray.length === 2 ? 0 : 1;
            inputsArray = [...inputsArray.slice(0, inputsArray.length-sliceEnd), currentNum];
            break;

        case "operator":
            if (typeof inputsArray[0] === "number" 
                && (inputsArray.length === 1 ||
                    inputsArray.length === 2) // If user wants to change the operator
                ) {
                // Reset CurrentNum to allow user to input next number for the operation
                currentNum = null;
                
                // Not enough elements to perform an operation on. Break out of switch
                if (inputsArray.length < 3) {
                    // If user wants to change the operator
                    if (inputsArray.length === 2) {
                        inputsArray.pop();
                    }
                    inputsArray.push(btnContent)
                    isFloat = false; // reset isFloat so that when entering a new number, it doesn't add onto the decimals of the previous number
                    break;
                }
                // ElSE perform operation by using switch fallthrough
                // perform case "equal"
            }
            
        case "equal":
            if (inputsArray.length === 3){
                let result = operate(...inputsArray); // round to 4 digits
                entry.textContent = result;
                
                inputsArray = [result]; 
                // Will not cause problem if user enters another number directly,
                // since inputsArray[0] will be replaced by said number since array.length != 2 (check logic under case "")
                
                currentNum = null;
                
                // Keep operator in memory if it was clicked before pressing "="
                if (btnContent !== "=" && 
                    (!(inputsArray.includes("⌐(ಠ۾ಠ)¬")))
                ) {
                    inputsArray.push(btnContent);
                }
            }
            break;
        
        case "clear":
            inputsArray = [];
            entry.textContent = "";
            currentNum = null;
            break;

        case "delete":
            // Delete digit if currentNum holds a value
            if (currentNum !== null) {
                currentNum = +currentNum.toString().slice(0, -1);
                
                // IF the currentNum is 0, this means user has deleted the whole number
                // Remove it from the array
                if (currentNum === 0) {
                    currentNum = null;
                    entry.textContent = "";
                    inputsArray.pop();
                } 
                // ELSE update the currentNum
                else {
                    entry.textContent = currentNum;
                    let sliceEnd = inputsArray.length === 2 ? 0 : 1;
                    inputsArray = [...inputsArray.slice(0, inputsArray.length-sliceEnd), currentNum];
                }
            }
            break;

        case "dot":
            if (!(entry.textContent.includes("."))) {
                entry.textContent += ".";
                isFloat = true;
            }
    }
    log(currentNum, inputsArray);
}

function operate(num1, operator, num2) {
    switch (operator) {
        // added + to remove trailing 0s from number
        case "+": return +add(num1, num2).toFixed(4);
        case "—": return +subtract(num1, num2).toFixed(4);
        case "x": return +multiply(num1, num2).toFixed(4);
        case "÷": return divide(num1, num2);
        default: return "UH OH!";
    }
}


function add(a, b) {
    return a+b;
}
function subtract(a,b) {
    return a-b;
}
function multiply(a,b) {
    return a*b;
}
function divide(a,b) {
    if (b === 0) {
        return "⌐(ಠ۾ಠ)¬";
    }
    return +(a/b).toFixed(4);
}
// Darken button when hovering
buttons.forEach(button =>
    button.addEventListener("mouseover", () => button.style.filter = "brightness(85%)")
)
buttons.forEach(button =>
    button.addEventListener("mouseleave", () => button.style.filter = "")
);