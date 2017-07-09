export default {
	set: (name, val) => {
		window.localStorage.setItem(name, JSON.stringify(val));
	},
	get: (name) => JSON.parse(window.localStorage.getItem(name))
}
