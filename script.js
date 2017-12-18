let text = "Test 123 test blah blah blah woo more text"
let startTime = undefined
const shiftThreshold = 12
$(function(){
  // Set the content of the text to be typed
  let target = text
  $("#TypeThis").html(splitTextToSpans(target))

  let usedWidth = $("#TextEntry").width()
  let docWidth = $( document ).width();
  let scaleUp = (docWidth-20) / usedWidth
  let fontSize = $(".typing").first().css("font-size")
  console.log(fontSize)
  $(".typing").each(function(){
    console.log($(this))
    $(this).css("font-size", fontSize*scaleUp)
  })
  // When the user makes a change
  $("#TextEntry").bind("input", function(){
    let val = $("#TextEntry").val()

    // If timer isn't started, then start it
    if (startTime === undefined) {
      startTime = new Date().getTime()
      $("#Legend").html("Timer has started!")
    }

    // If the user has finished, display their time
    if (val == target){
      let time = new Date().getTime() -startTime
      alert("Your time: "+(time/1000)+"seconds")
    }

    // For each character...
    // (this is neccessary because of autocomplete)
    for (let i=0; i<target.length; i++) {
      // ...decide what color it should be,
      let color = "#FFFFFF"
      if (val[i] == target[i]){
        color = "#4CAF50"
      } else if (val[i] !== undefined) {
        color = "#F44336"
      }
      // and assign that color
      $("#char-"+i).css("background-color", color)
    }

    // Show and hide letters in order to shift along
    for (let i=0; i<val.length-shiftThreshold; i++) {
      $("#char-"+i).hide()
    }
    for (let i=val.length-shiftThreshold; i<target.length; i++) {
      $("#char-"+i).show()
    }
  })

  // If the user tries to cheat
  $("#TextEntry").bind("paste",function(){
    alert("Oi. That's cheating.")
  })
})

function splitTextToSpans(text){
  let letters = text.split("")
  let newContents = ""
  for (let i=0; i<letters.length; i++) {
    newContents += "<span class='single-char' id='char-" + i + "'>"+letters[i]+"</span>"
  }
  return newContents
}

function checkInput(target, actual){
  
}
