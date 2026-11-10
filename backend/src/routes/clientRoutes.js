import express from 'express';
import { 
  getAllClients, 
  saveClient, 
  deleteClient 
} from '../controllers/clientController.js';

const router = express.Router();

router.get('/', getAllClients);
router.post('/save', saveClient);
router.delete('/:id', deleteClient);

export default router;

