const buttons = document.querySelectorAll(".button");
const calcOperation = document.querySelector(".calc-operation");
const operation = calcOperation.appendChild(document.createElement("span"));
const calcTyped = document.querySelector(".calc-typed");
const errorSpan = document.querySelector(".operationError");

function handleType(typed) {
	errorSpan.textContent = null;
	const lastTyped = operation.textContent?.slice(-1);

	if (typed === "c") {
		clearAll();
		return;
	}
	if (typed === "ce" || typed === "e") {
		clearEntry();
		return;
	}
	if (typed === "Backspace") {
		goBack();
		return;
	}
	if (
		(typed === "x" && lastTyped === "x") ||
		(typed === "/" && lastTyped === "/") ||
		(typed === "+" && lastTyped === "+") ||
		(typed === "%" && lastTyped === "%") ||
		(typed === "-" && lastTyped === "-") ||
		(typed === "*" && lastTyped === "*")
	) {
		return;
	}
	if (typed === "negative" || typed === "n") {
		addNegative();
		return;
	}
	if (typed === "%") {
		operation.textContent += "/100";
		return;
	}
	if (typed === "=" || typed === "Enter") {
		const expression = operation.textContent;
		const formattedExp = replaceXAndComma(expression);
		const isValid = validExpression(formattedExp);
		if (!isValid.valid) {
			errorSpan.textContent = isValid.error;
			operation.textContent = null;
			return;
		}
		isValid.valid && doCalc(formattedExp);
		return;
	}
	operation.textContent.length > 39 && calcOperation.classList.add("clip");
	showTypedButton(typed);
}
document.addEventListener('keydown', (e) => {
	const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e', 'c', 'n', 'Backspace', '%', '+', '-', '/', '*', ',', 'Enter'];
	if (allowedKeys.includes(e.key)) {
		handleType(e.key);
	}
});


buttons.forEach((button) => {
	button.addEventListener("click", (e) => {
		handleType(e.target.id);
	});
});

function replaceAsteriskAndDot(typed) {
	return typed.toString().replaceAll("*", "x").replaceAll(".", ",");
}
function replaceXAndComma(typed) {
	return typed.toString().replaceAll("x", "*").replaceAll(",", ".");
}

function validExpression(expression) {
	if (expression.includes("/0")) {
		return { valid: false, error: "Não é possível dividir por zero" };
	}
	return { valid: true, error: "" };
}

function showTypedButton(typed) {
	operation.textContent += replaceAsteriskAndDot(typed);
}
//TODO: melhorar erro
//TODO: máscara para os milhares 1.000.000
function doCalc(expression) {
	try {
		const answer = eval(expression);
		if (answer.toString().length > 14) {
			calcTyped.style.fontSize = "25px";
		}
		calcTyped.textContent = replaceAsteriskAndDot(answer);
		operation.textContent = replaceAsteriskAndDot(answer);
	} catch (error) {
		console.log(error);
		goBack();
	}
}
function clearAll() {
	operation.textContent = null;
	calcTyped.textContent = null;
}
function clearEntry() {
	calcTyped.textContent = '';
	const { entries } = groupExpression();
	entries.splice(-1, 1);
	operation.textContent = entries.join("");
}

//TODO: Melhorar regex
function groupExpression() {
	const entry = operation.textContent;
	const regex = /[\d\,]+|\D+/g;
	const entries = entry.match(regex);
	const lastEntry = `-${entries.at(-1)}`;
	return { entries, lastEntry };
}

function addNegative() {
	const { entries, lastEntry } = groupExpression();
	entries.splice(-1, 1, lastEntry);
	operation.textContent = entries.join("");
}

function goBack() {
	operation.textContent = operation.textContent
		.slice(0, -1)
		.replaceAll("*", "X");
}
