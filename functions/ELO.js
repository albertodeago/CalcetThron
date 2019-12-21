
/**
 * The minimum amount of ELO exchanged
 */
const minExchanged = 5;

/**
 * The maximum amount of ELO exchanged
 */
const maxExchanged = 25;

/**
 * The amount of ELO exchanged in a pair ELO team match
 */
const baseExchange = 15;

/**
 * The higher this is, the less ELO is exchanged in games with similar team ELO
 */
const divisorFactor = 20;

/**
 * Calculate the amount of ELO exchanged
 * @param {Number} team1Elo 
 * @param {Number} team2ELO 
 */
const getExchangedELO = (team1Elo, team2ELO) => Math.min(Math.max(baseExchange - Math.round(((team1Elo - team2ELO)) / divisorFactor), minExchanged), maxExchanged);

export { getExchangedELO };