class Entity {
  constructor(attrs) {
    Object.assign(this, attrs);
  }
}

class Article extends Entity { }

module.exports = {
  Article
};