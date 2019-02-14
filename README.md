# RedisKit

## 概述

RedisKit是一款基于 [ioredis](https://github.com/luin/ioredis) 开发的Redis GUI客户端，此应用基于electron开发，可兼容windows、macos、linux系统，GUI使用Vue+ElementUI进行开发。



``` json

config: {
  name: String || '默认服务器',
  host: String || 'localhost',
  port: Integer || 6379,
  password: String | '',
  db: String || null,
  retryStrategy: Function || function (times) {
    if (times <= 2) {
      return 500
    }
    Message.error('连接服务器失败。')
  },
  onError: Function
}
format: 'RAW'/'JSON' | 'RAW'
databases: Array
store: Array || []
model: {
  index: Integer || null
  key: String || null
  type: String || null
  value: Object || null
  field: Object || null
  fieldValue: Object || null
}

```

