import express from 'express';
import fs from 'fs-extra';
import _ from 'lodash';

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';
const app = express();

// Получение ключей из файла kws.json {"ae" : ["qqq", "wwww"]}
app.get('/kws', (req, res) => {
	try {
		fs.readJson('src/json/kws/kws.json', (err, obj) => {
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

const mapDirTopAppsAll = ['BR-PT', 'CN', 'DE', 'ES', 'FR', 'IT', 'JP', 'MX', 'RU', 'US-AU-CA-GB'];
const mapDirTopAppsRu = ['RU'];

const readFilesTopJson = (dirName, fileNameText, onError) => {
	fs.readdir(dirName, async(err, fileNames) => {
		if (err) {
			onError(err);

			return;
		}

		const data = await _.reduce(fileNames, async(acc, fileName) => {
			const result = await acc;
			const obj = await fs.readJsonSync(`${dirName}/${fileName}`);
			const dataFile = await _.map(obj && obj.data || [], 'keyword');

			result.push(dataFile);

			return result;
		}, Promise.resolve([]));

		await fs.writeFile(
			`src/resultTopApps/json/${fileNameText}.txt`,
			(_.flatten(data).join(',')).replace(/,+/g, '\n'),
			errorWrite => {
				if (errorWrite) console.error(errorWrite);
			},
		);

		await console.log(fileNameText, 'Success');
	});
};

// Получение ключей из дирректории top_apps
app.get('/top_apps', (req, res) => {
	try {
		_.map(mapDirTopAppsAll, item => {
			readFilesTopJson(`src/json/top_apps/${item}`, item, err => {
				res.json({err});
				console.log(err);
			});
		});
	} catch (error) {
		res.json({error});
		console.log(error);
	}
});

app.listen(PORT, () => {
	console.log(`Server listening on: ${PORT}`);
});
