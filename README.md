A Node.js API combining two data sets vet-data.js & dental-data.js and returning a singular json response. 

Options for GET requests:

1. To search by availability use the query params "from" & "to"
    For example: http://localhost:5000/?from=9:00&to=23:00

2. To search by name using "name"
    For example: http://localhost:5000/?name=Swedish Medical

3. For state use "state"
    For example: http://localhost:5000/?state=NY or 
    http://localhost:5000/?state=New York

You can also use any combination of these three together to filter down.
The root just returns all of the data.

Quick start: npm install, npm test, npm start