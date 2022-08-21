const buttons = document.querySelectorAll(".button");
const calcOperation = document.querySelector(".calc-operation");
const operation = calcOperation.appendChild(document.createElement("span"));
const calcTyped = document.querySelector(".calc-typed");
const errorSpan = document.querySelector(".operationError");
const blink = document.querySelector(".blink-me");

//TODO: acessível com teclado
buttons.forEach((button) => {
	button.addEventListener("click", (e) => {
		errorSpan.textContent = null;
		const lastTyped = operation.textContent?.slice(-1);
		const typed = e.key ?? e.target.id;

		if (typed === "C") {
			clearAll();
			2;
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
			(typed === "-" && lastTyped === "-")
		) {
			return;
		}
		if (typed === "negative") {
			addNegative();
			return;
		}
		if (typed === "%") {
			operation.textContent += "/100";
			return;
		}
		if (typed === "=") {
			const expression = operation.textContent.replaceAll("x", "*");
			const isValid = validExpression(expression);
			if (!isValid.valid) {
				errorSpan.textContent = isValid.error;
				operation.textContent = null;
				return;
			}
			isValid.valid && doCalc(expression);
			return;
		}
		operation.textContent.length > 39 && calcOperation.classList.add("clip");
		showTypedButton(typed);
	});
})

function validExpression(expression) {
	if (expression.includes("/0")) {
		return { valid: false, error: "Não é possível dividir por zero" };
	}
	return { valid: true, error: "" };
}

function showTypedButton(typed) {
	operation.textContent += typed;
}
//TODO: melhorar erro
//TODO: máscara para os milhares 1.000.000
function doCalc(expression) {
	try {
		const answer = eval(expression);
		if (answer.toString().length > 14) {
			calcTyped.style.fontSize = "25px";
		}
		calcTyped.textContent = answer;
		operation.textContent = answer;
	} catch (error) {
		goBack();
	}
}
function clearAll() {
	operation.textContent = null;
	calcTyped.textContent = null;
}

//TODO: Melhorar regex
function groupExpression() {
	const entry = operation.textContent;
	const regex = /[\d\.]+|\D+/g;
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
