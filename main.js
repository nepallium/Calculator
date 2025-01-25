log = console.log;


const screen = document.querySelector(".screen");
const calcLog = screen.querySelector(".log");
const entry = screen.querySelector(".entry");
const buttons = document.querySelectorAll("button");
let inputsArray = [];
let currentNum = null;
let resultExists = false;

buttons.forEach(button => 
    button.addEventListener("click", click)
);

function click(event) {
    let clickedButton = event.target;
    let btnContent = clickedButton.textContent
    switch (clickedButton.className) {
        case "": // user clicks on number
            // CurrentNum depends on itself only, not on the screen output!
            currentNum = currentNum*10 + +btnContent;
            entry.textContent = currentNum;
            
            // If array length == 2, it means there is an operator inside the array.
            // No need to update value at inputsArray[length-1]
            let sliceEnd = inputsArray.length === 2 ? 0 : 1;
            inputsArray = [...inputsArray.slice(0, inputsArray.length-sliceEnd), currentNum];
            break;

        case "operator":
            // Reset CurrentNum to allow user to input next number for the operation
            currentNum = null;
            
            // Not enough elements to perform an operation on. Break out of switch
            if (inputsArray.length < 3) {
                inputsArray.push(btnContent)
                break;
            }
            // ElSE perform operation by using switch fallthrough
            
        case "equal":
            if (inputsArray.length === 3){
                let result = operate(...inputsArray);
                entry.textContent = result;
                
                inputsArray = [result]; 
                // Will not cause problem if user enters another number directly,
                // since inputsArray[0] will be replaced by said number since array.length != 2 (check logic under case "")
                
                currentNum = null;
                
                // Keep operator in memory if it was clicked before pressing "="
                if (btnContent !== "=") {
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
            if (currentNum !== null) {
                currentNum = +currentNum.toString().slice(0, -1);
                entry.textContent = currentNum;
            }
    }
    log(currentNum, inputsArray);
}

function operate(num1, operator, num2) {
    switch (operator) {
        case "+": return add(num1, num2);
        case "-": return subtract(num1, num2);
        case "x": return multiply(num1, num2);
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
        return "Math ERROR ⌐(ಠ۾ಠ)¬";
    }
    return +(a/b).toFixed(5);
}
// Darken button when hovering
buttons.forEach(button =>
    button.addEventListener("mouseover", () => button.style.filter = "brightness(85%)")
)
buttons.forEach(button =>
    button.addEventListener("mouseleave", () => button.style.filter = "")
);