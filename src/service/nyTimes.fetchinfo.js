import $ from 'jquery';

/**
 * NYTimes api and returns a promise
 */
export const fetchNYTInfo = placeInstance => {
		let {name} = placeInstance;
		return new Promise((resolve, reject) => {
				var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
				url += '?' + $.param({'api-key': 'f1c00dcbf3e84f85b7a97b4e71ff0f6d', q: name})
				$.getJSON(url, function (data) {
					if (data.status === 'OK') {
						let result = data.response.docs;
						if (result.length > 5) {
							result = result.splice(0, 5);
						}
						resolve(data.response.docs);
					} else {
						reject(err);
					}
				}).fail(function (err) {
					reject(err);
				})
		});
}
