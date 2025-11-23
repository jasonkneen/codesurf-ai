function fn(schema, cb) {
  const result = (input) => {
    const parsed = schema.parse(input);
    return cb(parsed);
  };
  result.force = (input) => cb(input);
  result.schema = schema;
  return result;
}
export {
  fn as f
};
