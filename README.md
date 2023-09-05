# SPARQL Query Builder
This Node.js application exports a `buildQuery` function that outputs a SPARQL query based on given parameters.

## Installation
1. Clone the repository and navigate to its root.
2. Run:
```bash
npm install
```
3. To use the app as a local NPM package for other Node.js applications, run:
```bash
npm link
```
4. Inside the *other* Node.js application, run:
```bash
npm link sparql-query-builder
```

## Usage
The `buildQuery` function is located in `index.js` and outputs a SPARQL query based on these parameters:

1. `properties` (required)
   This should be a dictionary with each key indicating a property. In turn, each property specifies a dictionary containing the following named values:
   
   - `statements` (required)
     This should be an array containing one or more dictionary elements. The order of the elements decides the *path* to follow. Each element contains the following named values:
     
     - `predicate` (required)
       Specifies the predicate as a string. This can be a full URI or only the end of one, thus expecting a prefix.
     
     - `prefix` (optional)
       Specifies the prefix as a string. Should only be used if the predicate expects a prefix.
     
     - `subject_variable_name` (optional)
       Explicitly sets the subject variable name of the corresponding triple pattern and will solely be handled upon in case it is part of an array's first element. In case an array's first element does not have this specified, the subject variable name will be set to `?o`.
     
     - `object_variable_name` (optional)
       Explicitly sets the object variable name of the corresponding triple pattern, as well as the subject variable name of the subsequent triple pattern. In case an array's last element does not have this specified, the object variable name will be set to the property key. In case an array's any other element does not have this specified, the current and subsequent predicates will be concatenated using a property path sequence.
     
   - `filters` (optional)
     This should be a dictionary containing the following named values:
     
     - `string` (optional)
       Specifies the string to filter this property's last triple pattern's object name on as a string.
     
     - `language` (optional)
       Specifies the language to filter this property's last triple pattern's object name on as a string.
     
   - `optional` (optional)
     Specifies whether or not to make the retrieval of this property optional as a boolean.

2. `prefixes` (optional)
   This should be a dictionary that specifies which `PREFIX` statements to add to the start of the query. Each key represents the prefix name, while each value represents the corresponding URI.

3. `datasets` (optional)
   This should be an array of string elements. Each element specifies the URI of a specific graph to query against and will be mapped to the value of a `FROM` statement in the query.

4. `limit` (optional)
   This should be an integer and will be mapped to the query's `LIMIT` statement.

5. `offset` (optional)
   This should be an integer and will be mapped to the query's `OFFSET` statement.

The application also holds a `test.js` file that demonstrates how the `buildQuery` function can be used. To test it, run:
```bash
node test.js
```