export async function hasuraFetch(query, variables = {}) {
	const res = await fetch(process.env.HASURA_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	const json = await res.json();
	return json.data;
}
