async function run({
  parameters,
}: {
  parameters: {
    condition: string;
    true: string[];
    false: string[];
  };
}) {
  const { condition, true: trueActions, false: falseActions } = parameters;

  try {
    const conditionValue = JSON.parse(condition.toLowerCase());
    if (typeof conditionValue === "boolean" && conditionValue) {
      return trueActions;
    } else {
      return falseActions;
    }
  } catch (error) {
    throw new Error(`Invalid condition: ${condition}`);
  }
}

export default { run };
