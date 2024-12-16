function parseType(value) {
  if (typeof value != 'string') {
    return undefined;
  }

  const keys = ['home', 'personal'];

  if (keys.includes(value) != true) {
    return undefined;
  }

  return value;
}

function parseIsFavourite(value) {
  if (typeof value != 'string') {
    return undefined;
  }

  if (value !== 'true' && value != 'false') {
    return undefined;
  }

  return value;
}

export function parseFilterParams(query) {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
}
