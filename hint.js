
const inputDiv = document.getElementById("txtAnswer");
const hintField = document.getElementById("lblHint");
const caseSens = document.getElementById("caseSens");
const correctAnswer = "George Washington";

document.getElementById("correctAnswer").innerText = `Correct answer: ${correctAnswer}.`

inputDiv.addEventListener('input',function(){
    const currentAnswerCS = caseSens.checked ? inputDiv.textContent : inputDiv.textContent.toLowerCase();
    const correctAnswerCS = caseSens.checked ? correctAnswer : correctAnswer.toLowerCase();
	const editingString = evaluateAnswer(currentAnswerCS, correctAnswerCS);

	hintField.style.visibility = 'visible';
	hintField.innerHTML = getHint(currentAnswerCS, editingString);

});

inputDiv.addEventListener('focusout',()=>(hintField.style.visibility = 'hidden'));
function getHint(answer, editingString) {

    if (editingString === "") {
		return "<span>Hint: </span><span class='correct'>" + answer + "<\/span>";
	}

	let hint = "<span>Hint: </span>";
    let idx = 0;
	for (let i = 0; i < editingString.length; i++) {

        const currentEditing = editingString.charAt(i);
        const currentSymbol = answer.charAt(idx);
        switch(currentEditing){
            case "E":
                hint += "<span class='correct'>" + currentSymbol + "<\/span>";
                idx++;
                break;
            case "C":
                hint += "<span class='wrong'>" + currentSymbol + "<\/span>";
                idx++;
                break;
            case "D":
                hint += "<span class='extra'>"+currentSymbol + "<\/span>";
                idx++;
                break;
            case "I":
                hint += "<span class='wrong'>_<\/span>";
                break;
        }

	}
	return hint;
}


// ---------- distance editing algorithm  -----------------

function diff(a, b) {
	return (a === b) ? 0 : 1; 
}

function evaluateAnswer(currentAnswer, expectedAnswer) {

	if (expectedAnswer === currentAnswer) {
		return "";
	}

	const expectedLength = expectedAnswer.length;
	const currentLength = currentAnswer.length;

	let d = Array.from(Array(currentLength + 1), () => new Array(expectedLength + 1));
	let moves = Array.from(Array(currentLength + 1), () => new Array(expectedLength + 1));

	for (let i = 0; i < currentLength + 1; i++) {
		for (let j = 0; j < expectedLength + 1; j++) {
			if (i === 0 && j === 0){
                d[i][j] = 0;
            }
			else if (i === 0) {
				d[i][j] = j;
				moves[i][j] = "I";
			}
			else if (j === 0) {
				d[i][j] = i;
				moves[i][j] = "D";
			}
			else {
				const c = diff(currentAnswer[i - 1], expectedAnswer[j - 1]);
				const insertCost = d[i][j - 1] + 1;
				const deleteCost = d[i - 1][j] + 1;
				const changeCost = d[i - 1][j - 1] + c;
				if (insertCost <= deleteCost && insertCost <= changeCost) {
					d[i][j] = insertCost;
					moves[i][j] = "I";
				} else if (deleteCost <= changeCost) {
                    d[i][j] = deleteCost;
                    moves[i][j] = "D";
				} else {
                    d[i][j] = changeCost;
                    moves[i][j] = (c == 0) ? "E" : "C";
				}

			}
		}
	}

	let i = currentLength;
	let j = expectedLength;
	let editingString = "";

	while (i > 0 || j > 0) {
		editingString = moves[i][j] + editingString;
		if (moves[i][j] === "I") {
			j--;
		} else if (moves[i][j] === "D") {
			i--;
		} else {
			i--;
			j--;
		}
	}

	return editingString;
}














