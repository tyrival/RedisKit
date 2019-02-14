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

