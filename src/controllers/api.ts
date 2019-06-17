"use strict";

import async from "async";
import request from "request";
import { Response, Request, NextFunction } from "express";

import { Balance } from "../domain/balance";


/**
 * GET /api
 * List of API examples.
 */
export let balance = (req: Request, res: Response) => {
  res.json({
    balance: Balance(req.params.id, 0, new Date())
  });
};
