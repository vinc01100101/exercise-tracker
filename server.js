const express = require('express');
const app = express();
require('dotenv').config();
require('./mongoose-event-listeners');

app.use((req,res,next)=>{
	console.log(
		"-----------------------\n" +
		req.method + '||' + req.path + '||' + (req.headers['x-forwarded-for']  || req.connection.remoteAddress)
	)
	next();
})

app.use(express.static(__dirname + '/public/'));
app.use(express.urlencoded({extended: false}));

app.get('/',(ref,res,next)=>{
	res.sendFile(__dirname+ '/view/index.html')
})

const regUser = require("./register").regUser;
app.post('/api/exercise/new-user',(req,res)=>{
	regUser(res,req.body.username);
})
const updateData = require('./register').updateData;
app.post('/api/exercise/add',(req,res)=>{
	updateData(res,req.body);
})
const getData = require('./register').getData;
app.get('/api/exercise/log',(req,res)=>{
	const data = {
		userId: req.query.userId,
		from: req.query.from,
		to: req.query.to,
		limit: req.query.limit
	};
	getData(res,data);
})
const port = process.env.PORT;
app.listen(port,()=>{
	console.log("Listening to port " + port);
})