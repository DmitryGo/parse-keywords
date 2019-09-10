import express from 'express';
import fs from 'fs-extra';
import _ from 'lodash';

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';
const app = express();

// Получение ключей из файла kws.json {"ae" : ["qqq", "wwww"]}
app.get('/kws', (req, res) => {
	try {
		fs.readJson('src/json/kws.json', (err, obj) => {
			if (err) console.log(err);

			res.json(obj);

			const keys = _.map(obj, (item, key) => {
				const data = item.join(',').replace(/["{}]+/g, '').replace(/,+/g, '\n');
				fs.writeFile(`src/resultKws/${key}.txt`, data, errorWrite => {
					if (errorWrite) console.error(errorWrite);

					console.log(key, 'Success');
				});

				return key;
			});

			console.log(keys);
		});
	} catch (error) {
		res.json({error});
		console.log(error);
	}
});

app.listen(PORT, () => {
	console.log(`Server listening on: ${PORT}`);
});
