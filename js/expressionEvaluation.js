const operations = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
};

const opsByPrecedence = ["*/", "+-"];
const num = "-?\\d+\\.?\\d*";
const space = "\\s*";

const patterns = opsByPrecedence.map((ops) => {
  return new RegExp(`(${num})${space}([${ops}])${space}(${num})`);
});

/**
 * evalの代わりに式を評価する
 * @param { string } expression 
 * @returns 計算後の値
 */
function evaluate(expression) {
  console.log(expression);
  console.log(typeof expression);

  for (const pattern of patterns) {

    const found = expression.match(pattern);

    if (found) {
      const [match, a, op, b] = found;
      return evaluate(
        expression.replace(match, operations[op](Number(a), Number(b)))
      );
    }

  }

  return expression;
}