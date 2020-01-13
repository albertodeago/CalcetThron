export class Team {
    constructor({ striker, keeper }) {
        this.striker = striker
        this.keeper = keeper
    }

    toJSON() {
        return {
            striker: this.striker,
            keeper: this.keeper
        }
    }
}

export class Result {
    constructor({ blue, red }) {
        this.blue = parseInt(blue)
        this.red = parseInt(red)
    }

    toJSON() {
        return {
            blue: this.blue,
            red: this.red
        }
    }
}

export class Game {
    constructor({
        id,
        creationDate = new Date().getTime(),
        redTeam,
        blueTeam,
        result,
        redKeeperGoals,
        redKeeperAutogoals,
        redStrikerGoals,
        redStrikerAutogoals,
        blueKeeperGoals,
        blueKeeperAutogoals,
        blueStrikerGoals,
        blueStrikerAutogoals,
        exchangedELO = null,
        trueSkillChanges = null
    }) {

        this.id = id;
        this.creationDate = creationDate
        this.redTeam = new Team(redTeam)
        this.blueTeam = new Team(blueTeam)
        this.result = new Result(result)

        this.redKeeperGoals = redKeeperGoals
        this.redKeeperAutogoals = redKeeperAutogoals
        this.redStrikerGoals = redStrikerGoals
        this.redStrikerAutogoals = redStrikerAutogoals
        this.blueKeeperGoals = blueKeeperGoals
        this.blueKeeperAutogoals = blueKeeperAutogoals
        this.blueStrikerGoals = blueStrikerGoals
        this.blueStrikerAutogoals = blueStrikerAutogoals

        this.exchangedELO = exchangedELO
        this.trueSkillChanges = trueSkillChanges
    }

    toJSON() {
        return {
            id: this.id,
            creationDate: this.creationDate,
            redTeam: this.redTeam.toJSON(),
            blueTeam: this.blueTeam.toJSON(),
            result: this.result.toJSON(),
            redKeeperGoals: this.redKeeperGoals,
            redKeeperAutogoals: this.redKeeperAutogoals,
            redStrikerGoals: this.redStrikerGoals,
            redStrikerAutogoals: this.redStrikerAutogoals,
            blueKeeperGoals: this.blueKeeperGoals,
            blueKeeperAutogoals: this.blueKeeperAutogoals,
            blueStrikerGoals: this.blueStrikerGoals,
            blueStrikerAutogoals: this.blueStrikerAutogoals,
            exchangedELO: this.exchangedELO
        }
    }
}