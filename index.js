// Bring in our dependencies
const express = require('express')
const app = express();
const bodyParser = require('body-parser')

var textParser = bodyParser.text({
	type: 'text/plain'
})

//  Connect all our routes to our application
app.post('/log', textParser, function(req, res) {
	if (!req.body) {
		return res.sendStatus(400)
	} else {
		console.log("TYPE\t" + req.body)
	}
	res.send("OK")
})

app.get('/submit', textParser, function(req, res) {
	if (!req.body) {
		return res.sendStatus(400)
	} else {
		let keys = ["id", "gender", "age", "autocorrect", "autocomplete", "OS"]
		let data = []
		for (key of keys) {
			data.push(req.query[key])
		}
		console.log("FORM\t" + data.join("\t"))
	}
	res.send("OK")
})

app.use('/', express.static('public'));
app.use('/tryit', express.static('tryit'));

// Turn on that server!
app.listen(3000);