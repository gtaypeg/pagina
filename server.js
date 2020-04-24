let express = require('express');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let fetch = require('node-fetch');
let app = express();
let cors = require('cors');
app.use(cors());
//Mongoose connection

mongoose.connect('mongodb+srv://gabriel:gatgdvlg13@gabrielcluster0-nyj73.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// MONGOOSE SCHEMA

const LastestSchema = new Schema({
	search: [
		{
			term: String,
			when: Date,
		},
	],
});

const Lastest = mongoose.model('Lastest', LastestSchema);

app.get('/api/imagesearch/:q', (req, res) => {
	let q = req.params.q;
	let o = req.query.offset || 1;

	fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyAwDSW226TGjo9gWDo4xL7GoI8qmeiLR2Q&cx=000926181737549391458:mb1jw7k7mbu&searchType=image&q=${q}&start=${o}`)
		.then((data) => data.json())
		.then((dataJson) => {
			let response = [];
			for (let i = 0; i < 10; i++) {
				response[i] = {
					url: dataJson.items[i].link,
					snippet: dataJson.items[i].snippet,
					thumbnail: {
						url: dataJson.items[i].image.thumbnailLink,
						width: dataJson.items[i].image.thumbnailWidth,
						height: dataJson.items[i].image.thumbnailHeight,
					},
					context: dataJson.items[i].image.contextlink,
				};
			}
			Lastest.updateOne(
				{},
				{
					$push: {
						search: [
							{
								term: q.replace(/\+/g, ' '),
								when: new Date(),
							},
						],
					},
				},
				{ upsert: true }
			).exec((err, data) => {
				if (err) {
					console.log(err);
				} else {
					res.json(response);
				}
			});
		})
		.catch(() => {
			console.log('');
		});
});
app.get('/api/latest/imagesearch', (req, res) => {
	Lastest.findOne({}, { 'search.term': 1, 'search.when': 1 }).exec((err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.json(data.search);
		}
	});
});
app.listen(3000, () => {
	console.log('server inciado');
});
