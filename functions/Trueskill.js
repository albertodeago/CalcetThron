const trueSkill = require("ts-trueskill");

// all players start with this raw rating
const initialRating = 1000;

// conservative estimate is calculated as mu - sigmaCorrectionFactor * sigma (for leaderboard)
// probability of player rating being above mu - 3sigma = 99.7%
// probability of player rating being above mu - 2sigma = 95.5%
// probability of player rating being above mu - 1sigma = 68.3%
// probability of player rating being above mu - 0sigma = 50% (not very useful lol)
// const sigmaCorrectionFactor = 2; // this will be used on the frontend, 

// init trueskill (starts from 1000 instead of 50)
const calcetThronTrueskill = new trueSkill.TrueSkill(initialRating);
calcetThronTrueskill.drawProbability = 0; // calcetto games cannot be draws


/**
 * Calculate new rating with calcetThron trueskill instance and return results
 * @param {Object<mu: number, sigma: number>} winnerKeeper
 * @param {Object<mu: number, sigma: number>} winnerStriker
 * @param {Object<mu: number, sigma: number>} loserKeeper
 * @param {Object<mu: number, sigma: number>} loserStriker
 * @returns {Array<Array<Rating>>}
 */
const getTrueSkill = (winnerKeeper, winnerStriker, loserKeeper, loserStriker) => {
    const trueSkillWinnerKeeper = new trueSkill.Rating(winnerKeeper.mu, winnerKeeper.sigma);
    const trueSkillWinnerStriker = new trueSkill.Rating(winnerStriker.mu, winnerStriker.sigma);
    const trueSkillLoserKeeper = new trueSkill.Rating(loserKeeper.mu, loserKeeper.sigma);
    const trueSkillLoserStriker = new trueSkill.Rating(loserStriker.mu, loserStriker.sigma);
    const newRankings = calcetThronTrueskill.rate([
        [
            trueSkillWinnerKeeper,
            trueSkillWinnerStriker,
        ],[
            trueSkillLoserKeeper,
            trueSkillLoserStriker
        ]
    ]);

    return newRankings;
};

/**
 * Create and return an initial rating for our calcetThron trueskill instance
 * @returns {Rating}
 */
const getInitial = () => calcetThronTrueskill.createRating();

/** 
 * NOTE: to calculate our ranking we need to apply this formula:
 * Rating.mu - sigmaCorrectionFactor * Rating.sigma
 */

module.exports.getTrueSkill = getTrueSkill;
module.exports.getInitial = getInitial;