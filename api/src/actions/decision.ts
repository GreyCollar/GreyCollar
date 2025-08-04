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

  if (condition && condition.trim() !== "") {
    return trueActions;
  } else {
    return falseActions;
  }
}

export default { run };
