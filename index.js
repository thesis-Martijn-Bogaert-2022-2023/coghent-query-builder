// Function to process the properties
function buildQuery(properties, prefixes) {
	// Holds unique prefixes
	const usedPrefixes = new Set();

	// Holds variable names for SELECT statement
	const selectVariables = [];

	// Holds statements for WHERE clause as strings
	const whereStatements = [];

	// Loop over each property
	for (const [propertyName, propertyDetails] of Object.entries(properties)) {
		const propertyStatements = propertyDetails['statements'];
		const propertyFilters = propertyDetails['filters'];

		// Statements are required to build query for current property
		if (!propertyStatements) continue;

		// "Human made object" (artwork) is starting subject
		let nextSubject = 'human_made_object';

		// Start statements for property in WHERE clause with property name as comment
		let statementsSparql = `# ${propertyName}`;

		// Build WHERE statements for current property
		propertyStatements.forEach((statement, index) => {
			const prefix = statement['prefix'];
			const predicate = statement['predicate'];
			let objectVariableName = statement['object_variable_name'];

			// Add prefix to set of prefixes
			usedPrefixes.add(prefix);

			// Use property name as object variable name in case ending object varialbe name isn't available
			if (!objectVariableName && index >= propertyStatements.length - 1) {
				objectVariableName = propertyName;
			}

			// Start new triple in case subject is ready, build property path sequence otherwise
			if (nextSubject) {
				statementsSparql += `\n?${nextSubject} `;
			} else {
				statementsSparql += '/';
			}

			// Add optional prefix and predicate
			if (prefix) {
				statementsSparql += `${prefix}:`;
			}
			statementsSparql += predicate;

			// Finish triple in case object variable name is available
			if (objectVariableName) {
				statementsSparql += ` ?${objectVariableName}.`;
				nextSubject = objectVariableName;
			} else {
				nextSubject = null;
			}
		});

		// Build FILTER statements for current property
		if (propertyFilters) {
			// Filter on given string if available
			const stringFilter = propertyFilters['string'];
			if (stringFilter) {
				statementsSparql += `\nFILTER(regex(?${nextSubject}, "${stringFilter}", "i"))`;
			}

			// Filter on given language if available
			const languageFilter = propertyFilters['language'];
			if (languageFilter) {
				statementsSparql += `\nFILTER(LANG(?${nextSubject}) = "${languageFilter}")`;
			}
		}

		// Add finishing object variable name to array for SELECT statement
		selectVariables.push(nextSubject);

		// Add statements for current property to array containing all statements for WHERE clause
		whereStatements.push(statementsSparql);
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

const properties = {
	title: {
		statements: [{ prefix: 'cidoc', predicate: 'P102_has_title' }],
	},
	description: {
		statements: [
			{
				prefix: 'cidoc',
				predicate: 'P3_has_note',
				object_variable_name: 'note',
			},
		],
		filters: { string: 'luchter', language: 'nl' },
	},
};

const prefixes = {
	cidoc: '<http://www.cidoc-crm.org/cidoc-crm/>',
	skos: '<http://www.w3.org/2004/02/skos/core#>',
};

const query = buildQuery(properties, prefixes);
console.log(query);
