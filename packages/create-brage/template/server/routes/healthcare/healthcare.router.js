import { Router } from "express";
import HealthcareController from "./healthcare.controller.js";

const createHealthcareRouter = ({ pingPool }) => {

    const healthcareRouter = Router();
    const healthcareController = new HealthcareController({ pingPool });
    
    healthcareRouter.get('/api', healthcareController.checkApi);
    healthcareRouter.get('/database', healthcareController.checkDatabase);

    return healthcareRouter;
}

export default createHealthcareRouter;