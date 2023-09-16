import app from '../../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { NOT_EXISTENT_MONSTER, NOT_SAME_MONSTER } from '../../utils/constants';

const server = app.listen();

beforeAll(async () => jest.useFakeTimers());
afterAll(async () => server.close());

describe('BattleController', () => {
  describe('List', () => {
    test('should list all battles', async () => {
      const response = await request(server).get('/battle');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Battle', () => {
    test('should fail when trying a battle of monsters with an undefined monster', async () => {
      const response = await request(server)
        .post(`/battle`)
        .send(undefined);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test('should fail when trying a battle of monsters with an inexistent monster', async () => {
      const response = await request(server)
        .post(`/battle`)
        .send({ monsterOne: "Monster One", monsterTwo:"Monster Two" });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe(NOT_EXISTENT_MONSTER);
    });

    test('should fail when trying a battle with same mosnter', async () => {
      const response = await request(server)
        .post(`/battle`)
        .send({ monsterOne: "Monster One", monsterTwo:"Monster One" });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe(NOT_SAME_MONSTER);
    });

    test('should insert a battle of monsters successfully with monster 1 winning', async () => {
      const monster1 = await request(server).post(`/monsters`).send({
        createdAt: null,
        updatedAt: null,
        name: "MonsterOne",
        imageUrl: 'url',
        attack: 10,
        defense: 10,
        hp: 10,
        speed: 10,
      });
      const monster2 = await request(server).post(`/monsters`).send({
        createdAt: null,
        updatedAt: null,
        name: "MonsterTwo",
        imageUrl: 'url',
        attack: 1,
        defense: 1,
        hp: 1,
        speed: 1,
      });

      const response = await request(server)
        .post(`/battle`)
        .send({ monsterOne: monster1.body.name, monsterTwo: monster2.body.name });
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.name).toStrictEqual('MonsterOne');
    });
  });

  test('should insert a battle of monsters successfully with monster 2 winning', async () => {
    const monster1 = await request(server).post(`/monsters`).send({
      createdAt: null,
      updatedAt: null,
      name: "MonsterThree",
      imageUrl: 'url',
      attack: 1,
      defense: 1,
      hp: 1,
      speed: 1,
    });
    const monster2 = await request(server).post(`/monsters`).send({
      createdAt: null,
      updatedAt: null,
      name: "MonsterFour",
      imageUrl: 'url',
      attack: 10,
      defense: 10,
      hp: 10,
      speed: 10,
    });
    const response = await request(server)
      .post(`/battle`)
      .send({ monsterOne: monster1.body.name, monsterTwo: monster2.body.name });
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.name).toBe('MonsterFour');
  });
});

describe('Delete Battle', () => {
  test('should delete a battle successfully', async () => {
    const responseBattles = await request(server).get('/battle');

    const deleteResponse = await request(server).delete(
      `/battle/${responseBattles.body[0].id}`
    );
    expect(deleteResponse.status).toBe(StatusCodes.NO_CONTENT);
  });

  test("should return 404 if the battle doesn't exists", async () => {
    const response = await request(server).delete(
      `/battle/9999`
    );
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});

