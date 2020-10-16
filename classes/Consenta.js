const { Kubik } = require('rubik-main');
const fetch = require('node-fetch');
const set = require('lodash/set');

const methods = require('./Consenta/methods');

const DEFAULT_HOST = 'http://consenta.ru';

/**
 * The Consenta kubik for the Rubik
 * @class
 * @prop {String} login
 * @prop {String} password
 * @prop {String} supplierId
 * @prop {String} host
 */
class Consenta extends Kubik {
  constructor(options) {
    super(...arguments);

    if (!options) options = {};
    this.login = options.login || null;
    this.password = options.password || null;
    this.supplierId = options.supplierId || null;
    this.host = options.host || null;

    this.methods.forEach(this.generateMethod, this);
  }

  /**
   * Осуществляет запрос к Consenta
   * @param  {String}         path   Путь запроса
   * @param  {String}         host   Хост. Если не указан будет взят из this
   * @param  {Object|String}  body   Тело запроса. Если объект, то преобразуется в JSON
   * @param  {String}         method Метод запроса. Если не указан и есть тело то будет POST, а если тела нет то GET
   * @return {Promise}
   */
  async request({ path, host, body, method }) {

    const headers = {};
    if (body) {
      if (!body.login) body.login = this.login;
      if (!body.password) body.password = this.password;
      if (!body.supplierId) body.supplierId = this.supplierId;
      if (!method) method = 'POST';
      if (typeof(body) === 'object') {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json; charset=UTF-8';
      }
    }
    if (!method) method = 'GET';

    const url = this.getUrl({ path, host });
    const res = await fetch(url, { method, body, headers });

    return await res.json();
  }

  getUrl({ path, host }) {
    if (!host) host = this.host;
    return `${host}/${path}`;
  }

  up({ config }) {
    this.config = config;

    const options = config.get(this.name);

    this.login = this.login || options.login;
    this.password = this.password || options.password;
    this.supplierId = this.supplierId || options.supplierId;
    this.host = this.host || options.host || DEFAULT_HOST;
  }

  /**
   * Сгенерировать метод API
   *
   * Создает функцию для запроса к API, привязывает ее к текущему контексту
   * и кладет в семантичное имя внутри this.
   * В итоге он разбирет путь на части, и раскладывает его по семантичным объектам:
   * one/two/three -> this.one.two.three({});
   * @param  {String}  path путь запроса, без ведущего /: one/two/three
   */
  generateMethod({ kubikName, apiName }) {
    const apiMethod = (body, options) => {
      if (!options) options = {};
      const { host, token } = options;
      return this.request({ path: apiName, body, host, token });
    };
    set(this, kubikName, apiMethod);
  }
}

// Чтобы не создавать при каждой инициализации класса,
// пишем значения имени и зависимостей в протип
Consenta.prototype.dependencies = Object.freeze(['config']);
Consenta.prototype.methods = Object.freeze(methods);
Consenta.prototype.name = 'consenta';

module.exports = Consenta;
