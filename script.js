let i = Math.floor(Math.random() * 2)
let startTime = undefined
let keys = ""
const shiftThreshold = 12
$(window).on("load", function() {
  setup(texts[i])
})

$(document).on('keydown', function(e) {
  let key = event.keyCode || event.charCode
  if (32 <= key && key < 90) {
    keys += String.fromCharCode(key)
    return
  }
  switch (key) {
    case 8:
      keys += "<"
      break
    case 192:
      keys += "'"
      break
    case 13:
    case 14:
    case 15:
    default:
      break
  }
});

function setup(text) {
  //Reset things
  $("#Legend").html("")
  startTime = undefined
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
  // Show the user a message with their time
  console.log(keys)
  $("#message").html("Completed!")
  $("#sub-message").html("Your time: " + (time / 1000) + " seconds")
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