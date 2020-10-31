/**
 * 操作状态。
 */
const Status = {
  NONE: 0,
  STORING: 1,
  STORED: 2,
  FAILED: 3
}
/**
 * 操作浏览器数据库 IndexedDB 类
 */
class IndexedDBScheduler {
  /**
   *
   * @param {Object} options
   */
  constructor (options) {
    if (!Cesium.defined(options.name)) {
      throw new Cesium.DeveloperError('options.name is required.')
    }
    let deferred = Cesium.when.defer()
    this.dbname = options.name
    let dbRequest = window.indexedDB.open(this.dbname)
    let that = this
    dbRequest.onsuccess = event => {
      that.db = event.target.result
      that.version = that.db.version
      that.cachestatus = that.cachestatus || {}
      deferred.resolve(that)
    }
    dbRequest.onupgradeneeded = event => {
      that.db = event.target.result
      that.version = that.db.version
      deferred.resolve(that)
    }
    dbRequest.onerror = event => {
      that.db = null
      deferred.reject('create database fail, error code : ' + event.target.errorcode)
    }
    this.layer = options.layer || null
    this.storageType = options.storageType || 'arrayBuffer'
    this.creatingTable = !1
    this.cachestatus = {}
    return deferred.promise
  }
  /**
   * 检查对象仓库是否存在。
   * @param {String} storeName 对象仓库（表）名称
   */
  checkObjectStoreExist (storeName) {
    return Cesium.defined(this.db) ? this.db.objectStoreNames.contains(storeName) : false
  }
  /**
  *  创建 IndexedDB 浏对象仓库，IndexedDB 是浏览器提供的本地数据库
  * @param {String} storeName 对象仓库（表）名称
  * @returns {Promise}
  */
  createObjectStore (storeName) {
    const deferred = Cesium.when.defer()
    if (this.creatingTable) {
      deferred.reject(false)
    } else {
      if (this.db.objectStoreNames.contains(storeName)) {
        deferred.reject(false)
        return deferred.promise
      }
      this.creatingTable = true
      const version = parseInt(this.db.version)
      this.db.close()
      let that = this
      // 打开或新建 IndexedDB 数据库
      let dbRequest = window.indexedDB.open(this.dbname, version + 1)
      dbRequest.onupgradeneeded = event => {
        let db = event.target.result
        that.db = db
        // 创建对象仓库（表）
        let objectStore = db.createObjectStore(storeName, {
          keyPath: 'id'
        })
        if (Cesium.defined(objectStore)) {
          // 创建索引
          objectStore.createIndex('value', 'value', {
            unique: false
          })
          that.creatingTable = false
          that.cachestatus = that.cachestatus || {}
          that.cachestatus[storeName] = {}
          that.db.close()
          let dbRequest = window.indexedDB.open(that.dbname)
          dbRequest.onsuccess = event => {
            that.db = event.target.result
            deferred.resolve(true)
          }
        } else {
          that.creatingTable = false
          deferred.resolve(false)
        }
      }
      dbRequest.onsuccess = event => {
        event.target.result.close()
        deferred.resolve(true)
      }
      dbRequest.onerror = event => {
        that.creatingTable = false
        deferred.reject(false)
      }
    }
    return deferred.promise
  }

  /**
   * 向对象仓库写入数据记录。
   * @param {String} storeName 对象仓库（表）名称
   * @param {Number} id 主键
   * @param {*} value 值
   * @returns {Promise}
   */
  putElementInDB (storeName, id, value) {
    const deferred = Cesium.when.defer()
    if (!Cesium.defined(this.db)) {
      deferred.reject(false)
      return deferred.promise
    }
    const { cachestatus, db } = this
    if (Cesium.defined(cachestatus[storeName]) && Cesium.defined(cachestatus[storeName][id] &&
      (cachestatus[storeName][id] === Status.STORING || cachestatus[storeName][id] === Status.STORED))) {
      deferred.resolve(false)
      return deferred.promise
    }
    if (db.objectStoreNames.contains(storeName)) {
      cachestatus[storeName] = cachestatus[storeName] || {}
      try {
        let request = db.transaction([storeName], 'readwrite').objectStore(storeName).add({
          id: id,
          value: value
        })
        cachestatus[storeName][id] = Status.STORING
        request.onsuccess = event => {
          cachestatus[storeName][id] = Status.STORED
          deferred.resolve(true)
        }
        request.onerror = event => {
          cachestatus[storeName][id] = Status.FAILED
          deferred.resolve(false)
        }
      } catch (error) {
        deferred.reject(null)
        return deferred.promise
      }
    } else {
      this.createObjectStore(storeName).then(() => {
        let request = db.transaction([storeName], 'readwrite').objectStore(storeName).add({
          id: id,
          value: value
        })
        request.onsuccess = function (e) {
          deferred.resolve(true)
        }
        request.onerror = function (e) {
          deferred.reject(false)
        }
      }, () => {
        deferred.reject(false)
      })
    }
    return deferred.promise
  }
  /**
   * 向对象仓库读取数据。
   * @param {String} storeName 对象仓库（表）名称
   * @param {Number} id 主键
   * @returns {Promise}
   */
  getElementFromDB (storeName, id) {
    const deferred = Cesium.when.defer()
    const { db } = this
    if (!Cesium.defined(db)) {
      return null
    }
    if (!db.objectStoreNames.contains(storeName)) {
      return null
    }
    try {
      let transaction = db.transaction([storeName])
      let objectStore = transaction.objectStore(storeName)
      let request = objectStore.get(id)
      request.onsuccess = e => {
        return Cesium.defined(e.target.result) ? void deferred.resolve(e.target.result.value) : void deferred.reject(null)
      }
      request.onerror = e => {
        deferred.reject(null)
      }
    } catch (error) {
      deferred.reject(null)
    }
    return deferred.promise
  }
  /**
   * 更新数据。
   * @param {String} storeName
   * @param {Number} id
   * @param {*} value
   * @returns {Promise}
   */
  updateElementInDB (storeName, id, value) {
    const deferred = Cesium.when.defer()
    const { db } = this
    if (!Cesium.defined(db)) {
      deferred.resolve(false)
      return deferred.promise
    }
    if (!db.objectStoreNames.contains(storeName)) {
      deferred.resolve(false)
      return deferred.promise
    }
    try {
      let request = db.transaction([storeName], 'readwrite')
        .objectStore(storeName)
        .put({ id: id, value: value })
      request.onsuccess = () => {
        deferred.resolve(true)
      }
      request.onerror = () => {
        deferred.resolve(false)
      }
    } catch (e) {
      deferred.resolve(false)
    }
    return deferred.promise
  }
  /**
   * 移除数据。
   * @param {String} storeName
   * @param {Number} id
   * @returns {Promise}
   */
  removeElementFromDB (storeName, id) {
    const deferred = Cesium.when.defer()
    const { db } = this
    if (!Cesium.defined(db)) {
      deferred.resolve(false)
      return deferred.promise
    }

    if (!db.objectStoreNames.contains(storeName)) {
      deferred.resolve(false)
      return deferred.promise
    }
    try {
      let request = db.transaction([storeName], 'readwrite')
        .objectStore(storeName)
        .delete(id)
      request.onsuccess = () => {
        deferred.resolve(true)
      }
      request.onerror = () => {
        deferred.resolve(false)
      }
    } catch (e) {
      deferred.resolve(false)
    }
    return deferred.promise
  }
  /**
   *  清空对象仓库
   * @param {String} storeName
   */
  clear (storeName) {
    const deferred = Cesium.when.defer()
    const { db } = this
    if (!Cesium.defined(db)) {
      deferred.resolve(false)
      return deferred.promise
    }

    if (!db.objectStoreNames.contains(storeName)) {
      deferred.resolve(false)
      return deferred.promise
    }

    try {
      let request = db.transaction([storeName], 'readwrite')
        .objectStore(storeName)
        .clear()
      request.onsuccess = () => {
        deferred.resolve(true)
      }
      request.onerror = () => {
        deferred.resolve(false)
      }
    } catch (e) {
      deferred.resolve(false)
    }
    return deferred.promise
  }
}

export default IndexedDBScheduler
