const { Article } = require('./entities');
const defineAbilityFor = require('./defineAbility');

const user = { id: 1 };
const ability = defineAbilityFor(user);
const article = new Article();

console.log(ability.can('read', article));
console.log(ability.can('update', article));