const paginate = async (model, page, limit, query) => {
  const totalItems = await model.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (page - 1) * limit;

  const items = await model
    .find(query)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return {
    totalItems,
    totalPages,
    currentPage: page,
    items,
  };
};

module.exports = { paginate };
