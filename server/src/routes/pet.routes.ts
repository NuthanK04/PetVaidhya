import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/pet.controller";
import {
  addMedicalRecord,
  getMedicalRecords,
  addVaccination,
  getVaccinations,
  getReminders,
} from "../controllers/health-record.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

// Vaccination Reminders across all user pets
router.get("/reminders/vaccinations", getReminders);

// Standard Pet CRUD
router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

// Pet Medical Records
router.post("/:petId/medical-records", addMedicalRecord);
router.get("/:petId/medical-records", getMedicalRecords);

// Pet Vaccinations
router.post("/:petId/vaccinations", addVaccination);
router.get("/:petId/vaccinations", getVaccinations);

export default router;