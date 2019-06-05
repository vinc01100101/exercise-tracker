const mongoose = require('mongoose');
const collection = require('./mongoose-GLOBALS').collection;
const genId = require('gen-id')('nnnnana');

function openConnection(done){
	mongoose.connect(process.env.DB_URI,{useNewUrlParser: true},(err)=>{
		if(err){
			console.log("Error occured upon connection")
			done(err);
		}else{
			done(null)
		};
	});
}

function isAlreadyExist(key,value,done){
	console.log('Verifying '+ key + ': ' + value);
	collection.findOne({[key]:value},(err,result)=>{
		if(err){
			console.log("Error occured upon finding");
			done(err)
		}else{
			(!result || result == '') ? done(null,null) : done(null,result);
		}
	})
}

const regUser = (res,username)=>{
	openConnection((err)=>{ //open the connection
		if(err)throw err; //if connection error
		isAlreadyExist('username',username,(err,result)=>{ //check db
			if(err)throw err; //if error upon finding
			if(result){ //if exists
				console.log("Username already exist!");
				res.send("Username already exist");
				mongoose.connection.close();
			}else{ //if not exists
				console.log("Saving...");
				const data = {
					username: username,
					_id: genId.generate()
				};
				const doc = new collection(data);
				doc.save((err)=>{
					if(err)throw err;
					console.log("Username & ID successfully saved");
					res.json(data);
					mongoose.connection.close();
				});
			};
		});
	});
}

const updateData = (res,data)=>{
	openConnection(err=>{
		if(err)throw err;
		isAlreadyExist('_id',data.id,(err,result)=>{
			if(result){
				console.log(result)
				const doc = {
					description: data.desc,
					duration: data.dur,
					date: new Date(data.date).toString()
				}
				result.log.push(doc);
				result.count = result.log.length;
				result.save((err,result)=>{
					if(err)throw err;
					console.log("SAVED");
					doc.username = result.username;
					doc['_id'] = result['_id'];
					res.json(doc)
				})
			}else{
				res.send("Invalid ID")
				console.log('ID not found')
			}
		})
	})
}

const getData = (res,data)=>{
	openConnection(err=>{
		if(err)throw err;
		isAlreadyExist('_id',data.userId,(err,result)=>{
			if(err)throw err;
			if(result){
				const log = result.log.filter(obj=>{
					return obj.duration >= (data.from || 0) && obj.duration <= (data.to || Math.max(...result.log.map(d=>d.duration)));
				}).slice(0,(data.limit || result.log.length))
				result.log = log;
				res.json(result)
			}else{
				console.log("ID not found");
				res.send("Invalid ID");
			}
		})
	})
}

module.exports.getData = getData;
module.exports.regUser = regUser;
module.exports.updateData = updateData;
