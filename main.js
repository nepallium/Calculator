log = console.log;

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

function operate(num1, operator, num2) {
    num1 = +num1;
    num2 = +num2;
    switch (operator) {
        case "+": return add(num1, num2);
        case "-": return subtract(num1, num2);
        case "*": return multiply(num1, num2);
        case "/": return divide(num1, num2);
        default: return "UH OH!";
    }
}

const screen = document.querySelector(".screen");
const calcLog = screen.querySelector(".log");
const entry = screen.querySelector(".entry");
const buttons = document.querySelectorAll("button");


buttons.forEach(button => 
    button.addEventListener("click", clicked));

function clicked(event) {
    entry.textContent = event.target.textContent;
}