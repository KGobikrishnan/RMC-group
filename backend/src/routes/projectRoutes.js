import express from 'express';
import { 
  getAllProjects, 
  getProjectById, 
  saveProject, 
  deleteProject, 
  calculateEstimate 
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/save', saveProject);
router.delete('/:id', deleteProject);
router.post('/calculate', calculateEstimate);

export default router;

