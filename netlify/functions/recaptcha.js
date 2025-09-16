exports.handler = async function (event) {
  const { name, email, launch } = event.queryStringParameters.name;
  if (name !== "") return { statusCode: 500 };
  if (email !== "test@geode-solutions.com") return { statusCode: 500 };
  if (launch !== false) return { statusCode: 500 };
  return { statusCode: 200 };
};
