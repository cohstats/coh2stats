I want the live matches to be server side rendered.

We will need to fetch 2 things server side:

- the firestore data - cache that for at least 30 minutes
- the live matches data - cache that for 1.5 minute

We need to modify the component to be server side rendered and correctly fetch the data
and pass it to displaying data.

also keep in mind that there are dropboxes where you can change stuff which affects
what we should fetch.
