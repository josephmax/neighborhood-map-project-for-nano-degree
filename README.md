# Hotel Search App for nano-degree

this is a Knockout application using: ES6, Babel, Webpack and Bootstrap. 

third-party API used:

- Google Map API
- NYTimes API

To install:

npm install

npm run watch

open `index.html` in browser

## User Manual
----
Search hotels around:
- press `search near me` button to search around current location within a radius of 1000
- type in the `search bar` and `chose result from google autocomplete`, then you get hotels around the target location within a radius of 1000

Relocate:
- press `relocate` button to relocate your current location and set it to the center of your screen

Expand:
- press `expand` button to fit all your `Markers` to the screen

Filter:
- choose condition in `filter` dropdown list to filter the search result

ListItem:
- press the `list items` to show target item in the center of the map.
- the `heart` icon shows whether this place is in your favorite clips. click the `heart` icon to add favorite.

Fav Clips:
- press the `directory` button or the `title` to toggle fold.
- click the `fav clip` item to show target item in the center of the map.
- click the `delete` icon button to remove the target item from fav clips.

Markers on the Map:
- click the `Marker` on the map to trigger a detailed info window and search the relevant news from `NYTimes` with links.
