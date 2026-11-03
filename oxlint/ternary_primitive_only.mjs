// Oxlint JS plugin: a ternary may only choose between simple values.
// Calls, functions, and non-empty objects and arrays belong in an if/else or in a named variable.
// Empty objects and arrays ({} and []) are allowed as neutral fallbacks.

const FORBIDDEN_TYPES = new Set([
  "ArrayExpression",
  "ArrowFunctionExpression",
  "AwaitExpression",
  "CallExpression",
  "ClassExpression",
  "FunctionExpression",
  "ImportExpression",
  "NewExpression",
  "ObjectExpression",
  "TaggedTemplateExpression",
]);

const WRAPPER_TYPES = new Set([
  "ChainExpression",
  "TSAsExpression",
  "TSNonNullExpression",
  "TSSatisfiesExpression",
  "TSTypeAssertion",
]);

function unwrap(node) {
  let current = node;
  while (WRAPPER_TYPES.has(current.type)) {
    current = current.expression;
  }
  return current;
}

function isEmptyLiteral(node) {
  if (node.type === "ArrayExpression") {
    return node.elements.length === 0;
  }
  if (node.type === "ObjectExpression") {
    return node.properties.length === 0;
  }
  return false;
}

const rule = {
  meta: {
    type: "suggestion",
    schema: [],
  },
  create(context) {
    function check(branch) {
      const value = unwrap(branch);
      if (FORBIDDEN_TYPES.has(value.type) && !isEmptyLiteral(value)) {
        context.report({
          node: branch,
          message: `A ternary branch must be a primitive value or an empty object/array, found ${value.type}. Use an if/else or a named variable instead.`,
        });
      }
    }
    return {
      ConditionalExpression(node) {
        check(node.consequent);
        check(node.alternate);
      },
    };
  },
};

export default {
  meta: { name: "local" },
  rules: { "ternary-primitive-only": rule },
};
