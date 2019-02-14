import Redis from 'ioredis'
import {Message, MessageBox} from 'element-ui'

class RedisClient {
  constructor (config) {
    if (!config) {
      throw new Error('RedisKit构造参数出错。')
    }
    this.resetModel()
    this.config = Object.assign({
      name: '默认服务器',
      host: 'localhost',
      port: 6379,
      password: '',
      retryStrategy: function (times) {
        if (times <= 2) {
          return 500
        }
        Message.error('连接服务器失败。')
      },
      onError: null
    }, config)
    this.databases = []
    this.store = []
    this.connection = new Redis(this)
    this.format = 'RAW'
    // 注册统一错误处理
    if (this.config.onError && typeof this.config.onError) {
      this.connection.on('error', this.config.onError)
    }
  }

  /**
   * 加载数据库列表
   * @param callback
   */
  loadDatabases (callback) {
    this.databases = []
    // 获取数据库列表
    this.connection.config(['get', 'databases'], (_, reply) => {
      if (!reply) {
        return
      }
      let count = parseInt(reply[1])
      if (!count) {
        return
      }
      for (let i = 0; i < count; i++) {
        this.databases.push(i.toString())
      }
      this.config.db = null
      this.doCallback(callback, [this.databases])
    })
  }

  /**
   * 获取数据库列表
   * @returns {Array}
   */
  getDatabases () {
    return this.databases
  }

  /**
   * 选择数据库
   * @param db
   */
  selectDatabase (db, callback) {
    this.config.db = db
    this.loadStore(callback)
  }

  /**
   * 加载数据key
   */
  loadStore (callback) {
    this.resetStore()
    this.connection = new Redis(this.config)
    // 查询所有key
    this.connection.keys(['*'], (_, reply) => {
      if (!reply || !reply.length) {
        return
      }
      // 遍历key，构造查询key对应的数据类型的命令
      let client = this.connection.multi()
      for (let i = 0; i < reply.length; i++) {
        let key = reply[i]
        client = client.type(key)
      }
      // 查询类型
      client.exec((_, results) => {
        let data = []
        for (let i = 0; i < results.length; i++) {
          data.push({
            key: reply[i],
            type: results[i][1]
          })
        }
        this.store = data
        this.doCallback(callback, [this.store])
      })
    })
  }

  /**
   * 载入数据值
   * @param callback
   */
  loadValue (callback) {
    let data = this.store[this.model.index]
    this.model.key = data.key
    this.model.type = data.type
    switch (this.model.type) {
      case 'string':
        this.connection.get(this.model.key).then((result) => {
          this.model.value = result
          this.model.fieldValue = this.formatValue(result)
          this.doCallback(callback, [result])
        })
        break
      case 'hash':
        this.connection.hgetall(this.model.key).then((result) => {
          this.model.value = result
          this.doCallback(callback, [result])
        })
        break
      case 'list':
        this.connection.lrange(this.model.key, 0, -1).then((result) => {
          this.model.value = result
          this.doCallback(callback, [result])
        })
        break
      case 'set':
        this.connection.smembers(this.model.key).then((result) => {
          this.model.value = result
          this.doCallback(callback, [result])
        })
        break
      case 'zset':
        this.connection.zrange(this.model.key, 0, -1, 'withscores').then((result) => {
          this.model.value = result
          this.doCallback(callback, [result])
        })
        break
      default:
        this.doCallback(callback)
        break
    }
  }

  /**
   * 选择Key
   * @param index
   * @param callback
   */
  selectKey (index, callback) {
    this.resetModel()
    if (index === null || index === undefined) {
      this.doCallback(callback)
      return
    }
    this.model.index = index
    this.loadValue(callback)
  }

  /**
   * 增加key
   */
  addKey (key, type, value, callback) {
    let client = this.connection
    let cb = () => {
      this.loadStore(callback)
    }
    switch (type) {
      case 'string':
        client.set(key, value, cb)
        break
      case 'hash':
        client.hset(key, 'item', '', cb)
        break
      case 'list':
        client.lpush(key, 'item', cb)
        break
      case 'set':
        client.sadd(key, 'item', cb)
        break
      case 'zset':
        client.zadd(key, 0, 'item', cb)
        break
      default:
        break
    }
  }

  /**
   * 移除键
   * @param key
   * @param callback
   */
  removeKey (key, callback) {
    if (key === undefined || key === null) {
      Message({message: '未选中任何键', type: 'error', duration: 1000})
      return
    }
    MessageBox.confirm('是否确定删除此键？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.connection.del(key, (_, result) => {
        this.loadStore(callback)
      })
    }).catch(() => {
    })
  }

  /**
   * 获取value的field的值
   * @param field
   * @returns {*}
   */
  selectField (field) {
    if (field === null || field === undefined) {
      return
    }
    this.model.field = field
    switch (this.model.type) {
      case 'string':
        break
      case 'zset':
        this.model.fieldValue = this.formatValue(this.model.value[field * 2])
        break
      default:
        this.model.fieldValue = this.formatValue(this.model.value[field])
        break
    }
    return this.model.fieldValue
  }

  /**
   * 排序
   * @param isAsc
   * @param callback
   */
  sort (isAsc, callback) {
    switch (this.model.type) {
      case 'zset':
        if (isAsc) {
          this.loadValue()
        } else {
          this.connection.zrevrange(this.model.key, 0, -1, 'withscores', (_, result) => {
            this.model.value = result
            this.doCallback(callback, [isAsc])
          })
        }
        break
      default:
        this.loadValue()
        break
    }
  }

  /**
   * 增加hash key
   */
  addHashField (callback) {
    let field = 'item'
    let index = 0
    while (this.existFieldInHash(this.model.value, field)) {
      field = 'item' + index
      index++
    }
    let value = ''
    this.connection.hset(this.model.key, field, value)
      .then(() => {
        this.loadValue()
        this.doCallback(callback, [this.model, field, value])
      })
  }

  /**
   * 保存hash field
   * @param field
   * @param callback
   */
  saveHashField (field, callback) {
    this.connection.hexists(this.model.key, field)
      .then((result) => {
        if (result > 0) {
          Message.error('键【' + field + '】已存在，无法修改。')
          return
        }
        this.connection.multi()
          .hset(this.model.key, field, this.model.fieldValue)
          .hdel(this.model.key, this.model.field)
          .exec(() => {
            delete this.model.value[this.model.field]
            this.model.value[field] = this.model.fieldValue
            this.model.field = field
            this.doCallback(callback, [this.model, field])
          })
      })
  }

  /**
   * 判断hash是否包含field
   * @param field
   */
  existFieldInHash (hash, field) {
    if (hash.hasOwnProperty(field)) {
      return true
    }
    return false
  }

  /**
   * 删除hash key
   */
  removeHashField (field, callback) {
    if (field === undefined || field === null) {
      Message({message: '未选中任何Hash Key', type: 'error', duration: 1000})
      return
    }
    MessageBox.confirm('是否确定删除此属性？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.connection.hdel(this.model.key, this.model.field, () => {
        this.loadValue()
        this.doCallback(callback, [this.model, field])
      })
    }).catch(() => {
    })
  }

  /**
   * 增加数组元素
   * @param callback
   * @param isAtHead
   */
  addListItem (isPrepend, callback) {
    let item = 'item'
    if (isPrepend) {
      this.connection.lpush(this.model.key, item)
        .then(() => {
          this.model.value.unshift(item)
          this.doCallback(callback, [this.model, item])
        })
    } else {
      this.connection.rpush(this.model.key, item)
        .then(() => {
          this.model.value.push(item)
          this.doCallback(callback, [this.model, item])
        })
    }
  }

  /**
   * 移除数组元素
   * @param index
   * @param callback
   */
  removeListItem (index, callback) {
    if (index === undefined || index === null) {
      Message({message: '未选中任何数组元素', type: 'error', duration: 1000})
      return
    }
    MessageBox.confirm('是否确定删除此数组元素？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let val = 'DELETE' + new Date().getTime()
      this.connection.multi()
        .lset(this.model.key, index, val)
        .lrem(this.model.key, 0, val)
        .exec(() => {
          this.model.value.splice(index, 1)
          this.doCallback(callback, [this.model, index])
        })
    }).catch(() => {
      this.doCallback(callback, [this.model, index])
    })
  }

  /**
   * 增加set元素
   */
  addSetItem (callback) {
    let set = this.model.value
    let item = 'item'
    let index = 0
    while (this.existItemInSet(set, item)) {
      item = 'item' + index
      index++
    }
    this.connection.sadd(this.model.key, item)
      .then(() => {
        this.model.value.push(item)
        this.doCallback(callback, [this.model, item])
      })
  }

  /**
   * 判断元素是否存在set中，set的存储方式为数组
   */
  existItemInSet (array, item) {
    if (!array || !array.length) {
      return false
    }
    for (let i = 0; i < array.length; i++) {
      let ele = array[i]
      if (ele === item) {
        return true
      }
    }
    return false
  }

  /**
   * 删除set元素
   */
  removeSetItem (item, callback) {
    if (item === undefined || item === null) {
      Message({message: '未选中任何集合元素', type: 'error', duration: 1000})
      return
    }
    MessageBox.confirm('是否确定删除此元素？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let set = this.model.value
      this.connection.srem(this.model.key, item).then(() => {
        if (set && set.length) {
          for (let i = 0; i < set.length; i++) {
            let ele = set[i]
            if (ele === item) {
              set.splice(i, 1)
              break
            }
          }
          this.doCallback(callback, [this.model, item])
        }
      })
    }).catch(() => {
      this.doCallback(callback, [this.model, item])
    })
  }

  /**
   * 增加zset元素
   */
  addZsetItem (callback) {
    let zset = this.model.value
    let item = 'item'
    let index = 0
    while (this.existItemInZset(zset, item)) {
      item = 'item' + index
      index++
    }
    this.connection.zadd(this.model.key, 0, item)
      .then(() => {
        this.model.value.push(item)
        this.model.value.push(0)
        this.doCallback(callback, [this.model, item])
      })
      .catch(() => {
        this.doCallback(callback, [this.model, item])
      })
  }

  /**
   * 判断元素是否存在set中，set的存储方式为数组
   */
  existItemInZset (array, item) {
    if (!array || !array.length) {
      return false
    }
    for (let i = 0; i < array.length / 2; i++) {
      let ele = array[i * 2]
      if (ele === item) {
        return true
      }
    }
    return false
  }

  /**
   * 删除set元素
   */
  removeZsetItem (item, callback) {
    if (item === undefined || item === null) {
      Message({message: '未选中任何集合元素', type: 'error', duration: 1000})
      return
    }
    MessageBox.confirm('是否确定删除此元素？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.connection.zrem(this.model.key, item).then(() => {
        if (this.model.value && this.model.value.length) {
          for (let i = 0; i < this.model.value.length; i++) {
            let ele = this.model.value[i]
            if (ele === item) {
              this.model.value.splice(i, 2)
              break
            }
          }
        }
        this.doCallback(callback, [this.model, item])
      })
    }).catch(() => {
      this.doCallback(callback, [this.model, item])
    })
  }

  /**
   * 保存zset的分数
   */
  saveZsetScore (score, callback) {
    let origScore = this.model.value[this.model.field * 2 + 1]
    if (score !== origScore) {
      let field = this.model.value[this.model.field * 2]
      this.connection.multi()
        .zrem(this.model.key, field)
        .zadd(this.model.key, score, field)
        .exec(() => {
          this.loadValue()
          this.doCallback(callback, [this.model, score])
        })
    }
  }

  /**
   * 设置过期时间
   */
  setExpireTime (key, second, callback) {
    this.connection.expire(key, second, () => {
      this.doCallback(callback, [this.model, key, second])
    })
  }

  /**
   * 保存值
   * @param fieldValue
   * @param callback
   */
  saveField (fieldValue, callback) {
    let client = this.connection
    switch (this.model.type) {
      case 'string':
        client.set(this.model.key, fieldValue, (error, result) => {
          this.loadValue()
          this.doCallback(callback, [error, result])
        })
        break
      case 'hash':
        client.hset(this.model.key, this.model.field, fieldValue, (error, result) => {
          this.loadValue()
          this.doCallback(callback, [error, result])
        })
        break
      case 'list':
        client.lset(this.model.key, this.model.field, fieldValue, (error, result) => {
          this.loadValue()
          this.doCallback(callback, [error, result])
        })
        break
      case 'set':
        client.multi()
          .srem(this.model.key, this.model.value[this.model.field])
          .sadd(this.model.key, fieldValue)
          .exec((error, result) => {
            this.loadValue()
            this.doCallback(callback, [error, result])
          })
        break
      case 'zset':
        let score = this.model.value[this.model.field * 2 + 1]
        client.multi()
          .zrem(this.model.key, this.model.value[this.model.field * 2])
          .zadd(this.model.key, score, fieldValue)
          .exec((error, result) => {
            this.loadValue()
            this.doCallback(callback, [error, result])
          })
        break
      default:
        break
    }
  }

  /**
   * 格式化数据
   * @param value
   * @param format
   * @returns {string}
   */
  formatValue (value) {
    try {
      switch (this.format) {
        case 'JSON':
          return JSON.stringify(JSON.parse(value), null, 2)
        default:
          return JSON.stringify(JSON.parse(value))
      }
    } catch (e) {
      this.format = 'RAW'
      return value
    }
  }

  resetStore () {
    this.store = []
    this.resetModel()
  }

  resetModel () {
    if (!this.model) {
      this.model = {
        index: null,
        key: null,
        type: null,
        value: null,
        field: null,
        fieldValue: null
      }
    }
    this.model.index = null
    this.model.key = null
    this.model.type = null
    this.model.value = null
    this.resetField()
  }

  resetField () {
    this.model.field = null
    this.model.fieldValue = null
  }

  doCallback (callback, args) {
    if (callback && typeof callback === 'function') {
      callback.apply(this, args)
    }
  }
}

export default RedisClient
