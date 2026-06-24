import { sql } from '../configs/db.js';
import { v4 as uuidv4 } from 'uuid';

const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const transaction = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;`;

    res.status(200).send({ success: 1, data: transaction });
  } catch (error) {
    console.log('Error fetching transaction:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

const deleteTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ success: 0, message: 'No transaction ID provided!' });
    }

    const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *;`;

    if (result.length === 0) {
      return res.status(404).send({ success: 0, message: 'Transaction not found!' });
    }

    res.status(200).send({ success: 1, message: 'Transaction deleted successfully!', data: result });
  } catch (error) {
    console.log('Error deleting transaction:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

const createTransaction = async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).send({ success: 0, message: 'All fields are required!' });
    }

    const id = uuidv4();

    const newTransaction = await sql`INSERT INTO transactions (id, user_id, title, amount, category)
              VALUES (${id}, ${user_id}, ${title}, ${amount}, ${category}) RETURNING *;`;

    console.log('New transaction created:', newTransaction);

    res.status(201).send({ success: 1, message: 'Transaction created successfully!', newTransaction: newTransaction[0] });
  } catch (error) {
    console.log('Error creating transaction:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

const getSummaryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`SELECT 
    COALESCE(SUM(amount), 0) AS balance
    FROM transactions WHERE user_id = ${userId};`;

    const incomeResult = await sql`SELECT 
    COALESCE(SUM(amount), 0) AS income
    FROM transactions WHERE user_id = ${userId} AND amount > 0;`;

    const expenseResult = await sql`SELECT 
    COALESCE(SUM(amount), 0) AS expense
    FROM transactions WHERE user_id = ${userId} AND amount < 0;`;

    res.status(200).send({ success: 1, data: { balance: balanceResult[0].balance, income: incomeResult[0].income, expense: expenseResult[0].expense } });
  } catch (error) {
    console.log('Error fetching transaction summary:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

export { getTransactionsByUserId, deleteTransactionById, createTransaction, getSummaryByUserId };