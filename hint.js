
var expectedAnswer = document.getElementById("txtExpected").textContent;

function setExpectedAnswer(){
	expectedAnswer = document.getElementById("txtExpected").textContent;
}

function hideHint() {
	document.getElementById("lblHint").style.visibility = 'hidden';
}


function checkAnswerOnInput()
{
	const currentAnswer = document.getElementById("txtAnswer").textContent;
	const editing = evaluateAnswer(currentAnswer, expectedAnswer, false)

	document.getElementById("lblHint").style.visibility = 'visible';
	document.getElementById("lblHint").innerHTML = getHint(currentAnswer, editing);

}

function getHint(answer, editing) {

	if (editing == "") {
		return "<span style='color: green;font-weight: bold;'>" + answer + "<\/span>"
	}

	var hint = "";
	var answerIndex = 0;
	for (var i = 0; i < editing.length; i++) {
		if (editing.charAt(i) == "E") {
			hint += "<span style='color: green;font-weight: bold;'>" + answer.charAt(answerIndex) + "<\/span>"
			answerIndex++;
		} else if (editing.charAt(i) == "C") {
			hint += "<span style='color: red;font-weight: bold;'>" + answer.charAt(answerIndex) + "<\/span>"
			answerIndex++;
		} else if (editing.charAt(i) == "D") {
			hint += "<span style='color: red;text-decoration:line-through;font-weight: bold;'>" + answer.charAt(answerIndex) + "<\/span>"
			answerIndex++;
		} else if (editing.charAt(i) == "I") {
			hint += "<span style='color: red;font-weight: bold;'>_<\/span>"
		}
	}
	return hint;
}


// ---------- distance editing algorithm  -----------------

function diff(a, b) {
	if (a == b) {
		return 0;
	}
	else {
		return 1;
	}
}

function evaluateAnswer(currentAnswer, expectedAnswer, caseSensitive) {

	currentAnswer = currentAnswer.replace(String.fromCharCode(160), " "); //&nbsp;

	if (!caseSensitive) {
		currentAnswer = currentAnswer.toLowerCase();
		expectedAnswer = expectedAnswer.toLowerCase();
	}

	if (expectedAnswer == currentAnswer) {
		return "";
	}

	var expectedLength = expectedAnswer.length;
	var currentLength = currentAnswer.length;

	var d = Array.from(Array(currentLength + 1), () => new Array(expectedLength + 1));

	for (var i = 0; i < currentLength + 1; i++) {
		d[i][0] = i;
	}
	for (var j = 0; j < expectedLength + 1; j++) {
		d[0][j] = j;
	}

	var moves = Array.from(Array(currentLength + 1), () => new Array(expectedLength + 1));

	for (var i = 0; i < currentLength + 1; i++) {
		for (var j = 0; j < expectedLength + 1; j++) {
			if (i == 0 && j == 0) d[i][j] = 0;
			else if (i == 0) {
				d[i][j] = j;
				moves[i][j] = "I";
			}
			else if (j == 0) {
				d[i][j] = i;
				moves[i][j] = "D";
			}
			else {
				var c = diff(currentAnswer[i - 1], expectedAnswer[j - 1]);
				var res1 = d[i][j - 1] + 1;
				var res2 = d[i - 1][j] + 1;
				var res3 = d[i - 1][j - 1] + c;
				var result;
				if (res1 <= res2 && res1 <= res3) {
					result = res1;
					moves[i][j] = "I";
				} else {
					if (res2 <= res3) {
						result = res2;
						moves[i][j] = "D";
					} else {
						result = res3;
						moves[i][j] = (c == 0) ? "E" : "C";
					}
				}

				d[i][j] = result;
			}
		}
	}


	var i = currentLength;
	var j = expectedLength;
	editing = "";

	while (i > 0 || j > 0) {
		editing = moves[i][j] + editing;
		if (moves[i][j] == "I") {
			j--;
		} else if (moves[i][j] == "D") {
			i--;
		} else {
			i--;
			j--;
		}
	}

	return editing;
}














