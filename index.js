// Bring in our dependencies
const express = require('express')
const app = express();
const bodyParser = require('body-parser')

var textParser = bodyParser.text({ type: 'text/plain' })

//  Connect all our routes to our application
app.post('/log', textParser, function(req, res){
	if (!req.body){
		return res.sendStatus(400)
	} else {
		console.log(req.body)
	}
	res.send("OK")
})

app.use('/', express.static('public'));

// Turn on that server!
app.listen(80);
