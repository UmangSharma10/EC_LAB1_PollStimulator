const express = require('express');
let app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
var listcandidates = [];
let countcan = 0;
var votedlist = new Set();

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/addcandidates', (req, res) => {
    res.render('addcandidates', { list: listcandidates });
});

app.get('/voting', (req, res) => {
    res.render('vote', { list: listcandidates, message: "" });
});

app.get('/pollresultseen', (req, res) => {
    let max = 0;
    let maxvotes1 = 0,
        maxvotes2 = 0;
    let runner = 0;
    for (let i = 0; i < countcan; i++) {
        if (listcandidates[i].votes > maxvotes1) {
            maxvotes2 = maxvotes1;
            runner = max;
            maxvotes1 = listcandidates[i].votes;
            max = i;
        } else if (listcandidates[i].votes > maxvotes2 && listcandidates[i].votes < maxvotes1) {
            maxvotes2 = listcandidates[i].votes;
            runner = i;
        }
    }
    let results = [];
    results.push({ ID: listcandidates[max].ID, name: listcandidates[max].name, votes: listcandidates[max].votes });
    results.push({ ID: listcandidates[runner].ID, name: listcandidates[runner].name, votes: listcandidates[runner].votes });
    res.render('pollresult', { list: results });
});

app.get('/votesummary', (req, res) => {
    res.render('votingsummary', { list: listcandidates });
});

app.post('/countvote', (req, res) => {
    if (votedlist.has(req.body.id)) {
        res.render('vote', { list: listcandidates, message: "SORRY, ALREADY VOTED!!" });
    } else {
        votedlist.add(req.body.id);
        for (let i = 0; i < countcan; i++) {
            if (listcandidates[i].ID == req.body.vote) {
                listcandidates[i].votes++;
            }
        }
        res.render('vote', { list: listcandidates, message: "THANK YOU FOR VOTE!!" });
    }
});

app.post('/add', (req, res) => {
    listcandidates.push({ ID: req.body.id, name: req.body.name, votes: 0 });
    countcan++;
    res.render('addcandidates', { list: listcandidates });
});


app.listen(8080);
console.log('Running at 8080');