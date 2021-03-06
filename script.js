let uid = Math.random().toString(36).substr(2, 10);
let i = Math.floor(Math.random() * 2)
let startTime = undefined
let keys = ""
let lastVal = ""
let stats = {
	regularKeys: 0,
	autocompletes: 0
}
const shiftThreshold = 12
$(window).on("load", function() {
	setup(texts[i])
})

function setup(text) {
	//Reset things
	$("#Legend").html("")
	startTime = undefined
	lastVal = ""
	keys = ""

	// Set the content of the text to be typed
	let target = text
	$("#TypeThis").html(splitTextToSpans(target))

	let usedWidth = $("#TextEntry").width()
	let docWidth = $(document).width()
	let scaleUp = (docWidth - 20) / usedWidth
	let fontSize = $(".typing").first().css("font-size")
	console.log(fontSize)
	$(".typing").each(function() {
		console.log($(this))
		$(this).css("font-size", fontSize * scaleUp)
	})
	// When the user makes a change
	$("#TextEntry").val("").bind("input", function() {
		let val = $("#TextEntry").val()

		addToKeys = inferAction(lastVal, val)
		keys += addToKeys

		$("#Legend").html(`${escapeLTGT(keys)}  keypresses: ${stats.regularKeys}  autocompletes: ${stats.autocompletes}`)

		lastVal = val

		// If timer isn't started, then start it
		if (startTime === undefined) {
			startTime = new Date().getTime()
			$("#Legend").html("Timer has started!")
		}

		// If the user has finished, display their time
		if (val == target) {
			let time = new Date().getTime() - startTime
			finished(time)
		}

		// For each character...
		// (this is neccessary because of autocomplete)
		for (let i = 0; i < target.length; i++) {
			// ...decide what color it should be,
			let color = "#FFFFFF"
			if (val[i] == target[i]) {
				color = "#4CAF50"
			} else if (val[i] !== undefined) {
				color = "#F44336"
			}
			// and assign that color
			$("#char-" + i).css("background-color", color)
		}

		// Show and hide letters in order to shift along
		for (let i = 0; i < val.length - shiftThreshold; i++) {
			$("#char-" + i).hide()
		}
		for (let i = val.length - shiftThreshold; i < target.length; i++) {
			$("#char-" + i).show()
		}
	}).focus()

	// If the user tries to cheat
	$("#TextEntry").bind("paste", function() {
		alert("Oi. That's cheating.")
	})
}

function splitTextToSpans(text) {
	let letters = text.split("")
	let newContents = ""
	for (let i = 0; i < letters.length; i++) {
		newContents += "<span class='single-char' id='char-" + i + "'>" + letters[i] + "</span>"
	}
	return newContents
}



function finished(time) {
	let line = `${uid},${i},${time},${stats.regularKeys},${stats.autocompletes},${keys}`
	console.log(line)
	// Show the user a message with their time
	$("#message").html("Completed!")
	$("#sub-message").html("Your time: " + (time / 1000) + " seconds\n")
	$("#TyperContainer").hide()
	$("#message-box").show()
	$("#nextText").on("click", function() {
		// Switch the text and reset the page
		i = (i + 1) % 2
		setup(texts[i])
		$("#TyperContainer").show()
		$("#message-box").hide()
		$("TextEntry").show().focus()
	})
}

function inferAction(oldText, newText) {
	let lengthIncrease = newText.length - oldText.length

	if (lengthIncrease == 1) {
		// If only the last character is different
		if (oldText == newText.slice(0, -lengthIncrease)) {
			// Then a character has been typed
			stats.regularKeys++;
			return newText.slice(-1)
		} else {
			// Otherwise, a word has been auto(completed/corrected)
			stats.autocompletes++;
			return `>(${newText.split(" ").slice(-1)[0]})`
		}

	} else if (lengthIncrease > 1) {
		// The word has been autocompleted
		stats.autocompletes++;
		return `[${newText.split(" ").slice(-1)[0]}]`

	} else if (lengthIncrease == -1) {
		// If only the last character is different
		if (oldText.slice(0, -1) == newText) {
			// Then a character has been deleted
			stats.regularKeys++;
			return "<"
		} else {
			// Otherwise, a word has been autocorrected
			stats.autocompletes++;
			return "(<)"
		}

	} else if (lengthIncrease < -1) {
		//More that one letter has been deleted
		stats.regularKeys++;
		return "(<<)"

	} else {
		//Text is the same length
		if (oldText == newText) {
			return ""
		} else {
			stats.autocompletes++;
			return "()"
		}
	}
}


function escapeLTGT(unsafe) {
	return unsafe.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}