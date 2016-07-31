var express = require('express');

var restAPP = express();

app.get('/login', function(req, res) {
    res.send({msg:'', result: true});
});

app.listen(3000);

console.log('Listening on port 3000...');
