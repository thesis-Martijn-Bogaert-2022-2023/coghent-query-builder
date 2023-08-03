// Function to process the properties
function buildQuery(properties, prefixes) {
	// Holds unique prefixes
	const usedPrefixes = new Set();

	// Holds variable names for SELECT statement
	const selectVariables = [];

	// Holds statements for WHERE clause as strings
	const whereStatements = [];

	// Loop over each property
	for (const [property, predicateDescriptions] of Object.entries(properties)) {
		// "Human made object" (artwork) is starting subject
		let nextSubject = 'human_made_object';

		// Start statements for property in WHERE clause with property name as comment
		let statements = `# ${property}`;

		predicateDescriptions.forEach((predicateDescription, index) => {
			const prefix = predicateDescription['prefix'];
			const predicate = predicateDescription['predicate'];
			let objectVariableName = predicateDescription['object_variable_name'];

			// Add prefix to set of prefixes
			usedPrefixes.add(prefix);

			// Use property name as object variable name in case ending object varialbe name isn't available
			if (!objectVariableName && index >= predicateDescriptions.length - 1) {
				objectVariableName = property;
			}

			// Start new triple in case subject is ready, build property path sequence otherwise
			if (nextSubject) {
				statements += `\n?${nextSubject} `;
			} else {
				statements += '/';
			}

			// Add optional prefix and predicate
			if (prefix) {
				statements += `${prefix}:`;
			}
			statements += predicate;

			// Finish triple in case object variable name is available
			if (objectVariableName) {
				statements += ` ?${objectVariableName}.`;
				nextSubject = objectVariableName;
			} else {
				nextSubject = null;
			}
		});

		// Add finishing object variable name to array for SELECT statement
		selectVariables.push(nextSubject);

		// Add statements for current property to array containing all statements for WHERE clause
		whereStatements.push(statements);
	}

	let query = '';

	// Add prefix statements to query
	prefixStatements = [...usedPrefixes]
		.map((prefix) => `PREFIX ${prefix}:${prefixes[prefix]}`)
		.join('\n');
	query += `${prefixStatements}\n\n`;

	// Add select statement to query
	selectStatement = selectVariables.reduce(
		(accumulator, currentVariable) => `${accumulator} ?${currentVariable}`,
		'SELECT'
	);
	query += `${selectStatement}\n\n`;

	// Add where clause to query
	whereClause = `WHERE {\n\n${whereStatements.join('\n\n')}\n\n}`;
	query += whereClause;

	return query;
}

// Example usage
const properties = {
	title: [
		{
			prefix: 'cidoc',
			predicate: 'P102_has_title',
			object_variable_name: 'titleVar',
		},
	],
	objectname: [
		{ prefix: 'cidoc', predicate: 'P41i_was_classified_by' },
		{ prefix: 'cidoc', predicate: 'P42_assigned' },
		{ prefix: 'skos', predicate: 'prefLabel' },
	],
};

const prefixes = {
	cidoc: '<http://www.cidoc-crm.org/cidoc-crm/>',
	skos: '<http://www.w3.org/2004/02/skos/core#>',
};

const query = buildQuery(properties, prefixes);
console.log(query);
