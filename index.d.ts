export interface Statement {
	prefix?: string;
	predicate: string;
	subject_variable_name?: string; // Added this line
	object_variable_name?: string;
}

export interface PropertyDetails {
	statements: Statement[];
	filters?: {
		string?: string;
		language?: string;
	};
	optional?: boolean;
}

export interface Properties {
	[propertyName: string]: PropertyDetails;
}

export function buildQuery(
	properties: Properties,
	prefixes?: { [prefix: string]: string },
	datasets?: string[],
	limit?: number,
	offset?: number
): string;
