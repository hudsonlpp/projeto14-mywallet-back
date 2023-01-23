import {createTransaction, deleteTransaction, getTransactions, login, signUp, updateTransactionById} from "./controllers.js"
import {validateAuth, validateSchema} from "./middlewares.js"
import {loginSchema, signUpSchema, transactionSchema} from "./schemas.js"
import { Router } from 'express';

const router = Router();

router.get('/entries', validateAuth, getTransactions);
router.post('/entries', validateAuth, validateSchema(transactionSchema), createTransaction);
router.delete('/entries/:id', validateAuth, deleteTransaction);
router.put('/entries/:id', validateAuth, validateSchema(transactionSchema), updateTransactionById);
router.post('/signin', validateSchema(loginSchema), login);
router.post('/signup', validateSchema(signUpSchema), signUp);


export default router;