"use strict";
// Constants
const numSystems = {
	binary: {
		radix: 2,
		regex: /^[+-]?[01e]+$/
	},
	octal: {
		radix: 8,
		regex: /^[+-]?[01234567e]+$/
	},
	decimal: {
		radix: 10,
		regex: /^[+-]?[\de]+$/
	},
	hexadecimal: {
		radix: 16,
		regex: /^[+-]?[\dabcdef]+$/
	}
};

// Reference to HTML elements
const fromSelect = document.getElementById("from-select");
const toSelect = document.getElementById("to-select");
const inputEl = document.getElementById("input");

fromSelect.addEventListener("change", e => changeSelectOption(toSelect, e.target.value));
toSelect.addEventListener("change", e => changeSelectOption(fromSelect, e.target.value));

inputEl.addEventListener("keydown", e => {
	if (e.key === "Enter") convert();
});

// Validate entered number
inputEl.addEventListener("keyup", e => {
	validateNumber(e.char);
});
inputEl.addEventListener("beforeinput", e => validateNumber(e.data));
document.getElementById("convert-btn").addEventListener("click", convert);

function convert() {
	const input = inputEl.value;
	if (input === "") return printResult("Please enter a number to convert.", "red");

	const from = fromSelect.value.toLowerCase();
	const to = toSelect.value.toLowerCase();

	const numSystem = numSystems[from];

	if (numSystem.regex.test(input) === false) return printResult(`Please enter a valid ${from} number.`, "red");

	// Parse the string as the "from" radix stringify it as the "to" radix
	const parsedNumber = parseInt(input, numSystem.radix);
	let result = parsedNumber.toString(numSystems[to].radix);

	// Two's complement representation (no idea if this works correctly)
	// eslint-disable-next-line no-bitwise
	if (numSystems[to].radix === 2 && parsedNumber < 0) result = `Binary number: ${result}\nBinary signed two's complement: ${(parsedNumber >>> 0).toString(2)}`;

	if ([NaN, "NaN"].includes(result)) {
		return printResult("An error occurred (RESULT_NAN). Make sure you entered a valid number.", "red");
	}
	if (parsedNumber < Number.MIN_SAFE_INTEGER || parsedNumber > Number.MAX_SAFE_INTEGER) {
		return printResult("The entered number was too big or too small to be represented accurately.", "red");
	}

	printResult(result);
}
function validateNumber(data) {
	const input = inputEl.value + (data ?? "");
	const from = fromSelect.value;

	const numSystem = numSystems[from.toLowerCase()];

	if (numSystem.regex.test(input) === false) inputEl.style.borderColor = "red";
	else inputEl.style.borderColor = "var(--fg-color)";
}

function printResult(text, color = "var(--fg-color)") {
	const element = document.getElementById("result");
	element.innerText = text;
	element.style.color = color;
}

// Used to change the option on the other select menu if it's the same as the one on the current select menu
// For example: select menu 2's option is "Decimal", user chooses "Decimal" on select menu 1, select menu 2's option changes to another
function changeSelectOption(select, optText) {
	validateNumber("");
	const arr = Array.from(select.children);
	// If an option with the same innerText as the text provided is selected
	if (arr.find(e => e.innerText === optText).selected === true) {
		arr.find(e => e.innerText !== optText).selected = true;
	}
}
