import dayjs from "dayjs";
import db from "./config.js";
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

const createTransaction = async (req, res) => {
  const transactionData = req.body;

  const { session } = res.locals;

  const user = await db.collection('users').findOne({ _id: session.userId });

  if (!user) return res.sendStatus(401);

  const newTransaction = { ...transactionData, date: dayjs().format('DD/MM'), id: uuid() };

  await db.collection('users').updateOne({
    _id: session.userId
  },
    {
      $set: { transactions: [...user.transactions, newTransaction] }
    });

  res.sendStatus(201);

};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.collection('users').findOne({ 'transactions.id': id });
    if (!user) return res.status(404).send('Transação não encontrada');

    const filteredTransactions = user.transactions.filter(transaction => transaction.id !== id);

    await db.collection('users').updateOne({
      'transactions.id': id
    },
      {
        $set: {
          transactions: filteredTransactions
        }
      });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send('Não foi possível deletar sua transação');
  }
};

const getTransactions = async (req, res) => {
    const session = res.locals.session;
  
    const user = await db.collection('users').findOne({ _id: session.userId });
  
    if (!user) return res.sendStatus(404);
  
    res.send(user.transactions);
  };

const login = async (req, res) => {
  const loginData = req.body;

  const user = await db.collection('users').findOne({ email: loginData.email });

  if (!user) return res.status(401).send('Email não cadastrado');

  const match = await bcrypt.compare(loginData.password, user.password);

  if (!match) {
    return res.status(401).send('Senha incorreta');
  }

  const token = uuid();

  const sessionInfo = {
    userId: user._id,
    token
  };

  await db.collection('sessions').insertOne(sessionInfo);

  return res.send({
    token,
    name: user.name
  });
};

const signUp = async (req, res) => {
  const signUpData = req.body;
  const saltRounds = 10;

  const isEmailInUse = !!(await db.collection('users').findOne({ email: signUpData.email }));

  if (isEmailInUse) return res.status(409).send('Email já cadastrado');

  const hashPassword = await bcrypt.hash(signUpData.password, saltRounds);

  const user = {
    name: signUpData.name,
    email: signUpData.email,
    password: hashPassword,
    transactions: [],
  };

  await db.collection('users').insertOne(user);
  res.sendStatus(201);
};

const updateTransactionById = async (req, res) => {
    const { id } = req.params;
    const { value, description } = req.body;
  
    try {
      const { transactions } = await db.collection('users').findOne({
        'transactions.id': id
      });
  
      if (!transactions) return res.status(404).send('Transação não enconrada');
  
      const updatedTransactions = transactions.map(transaction => {
        if (transaction.id !== id) return transaction;
  
        return {
          ...transaction,
          value,
          description,
          updatedAt: dayjs().format('DD/MM/YYYY HH:mm:ss')
        };
      });
  
      console.log(updatedTransactions);
  
      await db.collection('users').updateOne({
        'transactions.id': id
      },
        {
          $set: { transactions: updatedTransactions }
        });
  
      res.sendStatus(200);
  
    } catch (error) {
      console.log(error);
      res.status(500).send('Não foi possível atualizar sua transação');
    }
  };

export {createTransaction, deleteTransaction, getTransactions, login, signUp, updateTransactionById};