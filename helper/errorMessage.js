const errorMessage = (body, status, errors) => {
	const error = new Error(body);
	error.statusCode = status;
	error.data = errors ? errors.array() : null;
	throw error;
};

module.exports = errorMessage;
