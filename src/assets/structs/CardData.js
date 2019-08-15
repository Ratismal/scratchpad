export default class CardData {
  constructor(data = {}) {
    this.populate(data, 'content', 'New Card');
    this.populate(data, 'key', Date.now());
    this.populate(data, 'x', 50);
    this.populate(data, 'y', 50);
    this.populate(data, 'frost', null);
    this.populate(data, 'title', 'New Card');
    this.populate(data, 'type', 'normal');
    this.populate(data, 'iframe', {
      src: 'https://google.com',
      width: '450',
      height: '200',
      frameborder: '0'
    });
  }

  populate(data, key, def) {
    this[key] = data[key] || def;
  }
}