const sequelize = require("../config/database");

const updateAllBooksAverageScores = async () => {
  try {
    await sequelize.query(
      `UPDATE books b
       JOIN (
           SELECT bookId, AVG(userScore) AS avgScore
           FROM borrows
           WHERE userScore IS NOT NULL
           GROUP BY bookId
       ) AS avgScores
       ON b.id = avgScores.bookId
       SET b.averageScore = avgScores.avgScore`,
      {
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    console.log("Average scores for all books updated successfully");
  } catch (error) {
    console.error("Error updating average scores for books:", error);
  }
};

module.exports = updateAllBooksAverageScores;
