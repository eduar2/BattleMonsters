import app from '../../app';
import { getDamage, getWinner } from '../battle.services';
import factories from '../../factories';

const server = app.listen();

beforeAll(async () => jest.useFakeTimers());
afterAll(async () => server.close());

describe('BattleServices', () => {
  describe('GetDamage', () => {
    test('should return correct damage', async () => {
      const damage = getDamage(10, 6);
      expect(damage).toStrictEqual(4);
    });
  });

  describe('GetWinner', () => {
    const monster1 = factories.monster.build();
    const monster2 = factories.monster.build();
    test('should return monster1 as winner', async () => {
      monster1.attack = 10
      monster1.defense = 10
      monster1.hp = 10
      monster1.speed = 10
      monster2.attack = 1
      monster2.defense = 1
      monster2.hp = 1
      monster2.speed = 1
      const winner = getWinner(monster1, monster2);
      expect(winner).toBe(monster1);
    });

    test('should return monster2 as winner', async () => {
      monster1.attack = 101
      monster1.defense = 101
      monster1.hp = 101
      monster1.speed = 101
      monster2.attack = 100
      monster2.defense = 100
      monster2.hp = 100
      monster2.speed = 100
      const winner = getWinner(monster1, monster2);
      expect(winner).toBe(monster2);
    });
  });

});

