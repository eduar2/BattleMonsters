import { Monster } from "../models";


export const getDamage = (attack: number, defense: number): number => {
    return attack - defense <= 0 ? 1 : attack - defense;
}

export const getWinner = (monsterOne: Monster, monsterTwo: Monster): Monster => {
    const firstAttacker =
        monsterOne.speed > monsterTwo.speed ||
            (monsterOne.speed === monsterTwo.speed && monsterOne.attack > monsterTwo.attack)
            ? monsterOne
            : monsterTwo;
    const secondAttacker = firstAttacker === monsterOne ? monsterTwo : monsterOne;
    let firstAttackerHP = firstAttacker.hp;
    let secondAttackerHP = secondAttacker.hp;
    let damage;
    let winner = null;

    while (!winner) {
        damage = getDamage(firstAttacker.attack, secondAttacker.defense);
        secondAttackerHP -= damage;

        if (secondAttackerHP <= 0) {
            winner = firstAttacker;
            return winner
        }

        damage = getDamage(secondAttacker.attack, firstAttacker.defense);

        firstAttackerHP -= damage;

        if (firstAttackerHP <= 0) {
            winner = secondAttacker;
            return winner
        }
    }
    return winner;
}

export const BattleServices = {
    getWinner,
};


