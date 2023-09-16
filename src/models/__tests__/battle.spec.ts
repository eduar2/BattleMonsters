import { Battle } from '..';

describe('Battle Model', () => {
  test('should have relation mapping', () => {
    console.log("1");
    console.log(Battle.relationMappings);
    expect(Battle.relationMappings).toHaveProperty('monsterARelation');
    expect(Battle.relationMappings).toHaveProperty('monsterBRelation');
    expect(Battle.relationMappings).toHaveProperty('winnerRelation');
  });
});
