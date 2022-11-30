module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define('tmp_testing_books', {
      title: {
          type: Sequelize.STRING,
      },
      description: {
          type: Sequelize.STRING,
      },
      publisher: {
          type: Sequelize.STRING,
      },
  });
  return Book;
}