const mongo = require('mongodb')

exports.upload = (req, res) => {
	let record = {}
	const address = ""

	var MongoClient = mongo.MongoClient;

	MongoClient.connect('mongodb://localhost:27017/', function(err, db) {
		if (err) throw err;
		const datweave = db.db('datweave');
		const wallets = datweave.collection('wallets')

		const query = { address: address }

		wallets.findOne(query)
		.catch((err) => {
			console.log(err)
			throw err
		})
		.then((document) => {
			if(document === undefined) {
				wallets.insertOne(record)
				.catch((err) => {
					console.log(err)
					if(err) throw err
				})
				.then((result) => {
					console.log(result)
					console.log('1 document inserted');
					db.close();
				})
			}
			else {
				wallets.updateOne(record)
				.catch((err) => {
					console.log(err)
					if(err) throw err
				})
				.then((result) => {
					console.log(result)
					console.log(`uploaded to: ${ address }`);
					db.close();
				})
			}
		})
	});	
};