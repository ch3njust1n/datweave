const mongo = require('mongodb')

exports.wallet = (req, res) => {
	const url = req.originalUrl.trim().split('/').filter(x => x.length > 0)
    const address = url[1]

	var MongoClient = require('mongodb').MongoClient;

	MongoClient.connect('mongodb://localhost:27017/', function(err, db) {
		if (err) throw err;
		const arweave = db.db('arweave');

		arweave.collection('wallets').findOne({ address: address })
		.catch((err) => {
			console.log(err)
			if (err) throw err
		})
		.then((document) => {
			res.json({ data: document.winstons })
			db.close()
		})
	});	
};