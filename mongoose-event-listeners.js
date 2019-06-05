const mongoose = require('mongoose');

mongoose.connection.on('connected', ()=>{console.log('Mongoose connected'); });
mongoose.connection.on('disconnected', ()=>{console.log('Mongoose disconnected'); });
mongoose.connection.on('reconnect', ()=>{console.log('Mongoose reconnected'); });
mongoose.connection.on('error', err=>{console.log('Mongoose connection error: ' + err); }); 


process.on('SIGINT',()=>{
	if(mongoose.connection.readyState==1){
		mongoose.connection.close(()=>{
			console.log('Mongoose disconnected through app termination');
			process.exit(0);	
		})
	}else{
		process.exit(0);	
	};
})