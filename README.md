# axios-cache
基于axios的变量级缓存插件
##使用方法
将index.js和cache.js引入项目
（1）
```javascript
  import axios from 'axios'
import wrapper from 'axios-cache-plugin'

let http = wrapper(axios, {
  maxCacheSize: 15
})
export default http
```
（2）
```javascript
import axios from 'axios'
import wrapper from 'axios-cache-plugin'

let http = axios.create({
  withCredentials: false
})

let httpProxy = wrapper(http, {
  maxCacheSize: 15
})
export default httpProxy`
```
