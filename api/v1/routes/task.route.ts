import Task from "../models/task.model";

import express, { Request, Response, Router }  from "express";

import * as controller from "../controller/task.controller";
const router: Router = express.Router();


router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.post("/create", controller.create);

router.patch("/edit/:id", controller.edit);

router.delete("/delete/:id", controller.deleteTask);

export const taskRoutes: Router = router;