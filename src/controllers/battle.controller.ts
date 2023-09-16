import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Battle, Monster } from '../models';
import { Id } from 'objection';
import { NOT_EXISTENT_MONSTER, NOT_SAME_MONSTER, NO_MONSTERS_MESSAGE } from '../utils/constants';
import { BattleServices } from '../services/battle.services';

const list = async (req: Request, res: Response): Promise<Response> => {
  const battles = await Battle.query();
  return res.status(StatusCodes.OK).json(battles);
};

const startBattle = async (req:Request, res:Response): Promise<Response> =>{
  const { monsterOne, monsterTwo } = req.body;

  if (!monsterOne || !monsterTwo) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: NO_MONSTERS_MESSAGE,
    });
  }

  if (monsterOne === monsterTwo) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: NOT_SAME_MONSTER,
    });
  }
  const monsters = await Promise.all([
    Monster.query().findOne({name: monsterOne }),
    Monster.query().findOne({name: monsterTwo }),
  ]);

  const firstMonster = monsters[0];
  const secondMonster = monsters[1];

  if (!firstMonster || !secondMonster) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: NOT_EXISTENT_MONSTER });
  }
  
  const winner = BattleServices.getWinner(firstMonster, secondMonster);
  await Battle.query().insert({
    monsterA: firstMonster,
    monsterB: secondMonster,
    winner: winner
  })
 

  return res.status(StatusCodes.CREATED).json(winner);
  
};
const deleteBattle = async (req: Request, res: Response): Promise<Response> => {
  const id: Id = req.params.id;

  const deletedBattle = await Battle.query().deleteById(id);

  if (!deletedBattle) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }

  return res.sendStatus(StatusCodes.NO_CONTENT);
};


export const BattleController = {
  list,
  deleteBattle,
  startBattle
};
