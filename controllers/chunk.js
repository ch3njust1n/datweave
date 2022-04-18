/*
API for data chunks
*/

const mongo = require('mongodb')

exports.post_chunk = (req, res) => {
	const MongoClient = mongo.MongoClient;

	console.log('/post_chunk')

	const body = req.body
	const chunk = body.chunk
	const offset = body.offset


	// make chunk string readable so can compare to mongo record while developing
	const sub_len = 10
	const chunk_truncated = chunk.substring(0, sub_len)+'...'+chunk.substring(chunk.length - sub_len)

	MongoClient.connect('mongodb://localhost:27017/', function(err, db) {
		if (err) throw err;
		const datweave = db.db('datweave');
		const transactions = datweave.collection('transactions')

		const query = { data_root: body.data_root }

		transactions.findOne(query)
		.catch((err) => {
			console.log(err) // TEST
			throw err
		})
		.then((document) => {
			if(document == null || document === undefined) {
				res.status(404).end() // TEST
			}
			else {

				if(!('chunk' in document)) {
					document.chunk = {}
				}

				document.chunk[offset] = chunk

				transactions.updateOne(query, { $set: document })
				.catch((err) => {
					if(err) {
						console.log(err) // TEST
						res.status(500).end()
						throw err
					}
				})
				.then((result) => {
					res.status(200).end() // TEST
				})
			}

			db.close()
		})
	});	
};


exports.get_chunk = (req, res) => {
	console.log('/get_chunk')

	let params = req.params['0'].split('/')
	const query = { id: params[0] }
	const offset = params[1]

	const MongoClient = mongo.MongoClient;

	MongoClient.connect('mongodb://localhost:27017/', function(err, db) {
		if(err) {
			res.status(500).end()
			throw err
		}

		const datweave = db.db('datweave');
		const transactions = datweave.collection('transactions')

		transactions.findOne(query)
		.catch((err) => {
			console.log(err)
			res.status(500).end()
			throw err
		})
		.then((document) => {
			if(document == null || document === undefined) {
				res.status(404).end()
			}
			else {
				res.status(200).json({ 
					data: document.chunk[offset]
				})
			}
		})

		db.close()
	})
}