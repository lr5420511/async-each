# async-each #

这是一个提供了异步遍历功能的工具，可以通过插件拓展工具的遍历器。已经提供的方法包括forEach，every，some，filter，map，sort，reduce。

#

>   安装： npm install async-series-each --save-dev

#

## 提供的遍历器： ##

+  forEach(callback[, thisArg])  
>  调用方法及参数和同步版本forEach(Array.prototype.forEach)一致，功能也一致。

+  every(callback[, thisArg])
>  调用方法及参数和同步版本every(Array.prototype.every)一致，功能也一致。

+  some(callback[, thisArg])
>  调用方法及参数和同步版本some(Array.prototype.some)一致，功能也一致。

+  filter(callback[, thisArg])
>  调用方法及参数和同步版本filter(Array.prototype.filter)一致，功能也一致。

+  map(callback[, thisArg])
>  调用方法及参数和同步版本map(Array.prototype.map)一致，功能也一致。

+  reduce(callback[, fir])
>  调用方法及参数和同步版本reduce(Array.prototype.reduce)一致，功能也一致。

+  sort(callback)
>  调用方法及参数和同步版本sort(Array.prototype.sort)一致，功能也一致。内部采用的是插入排序，海量数据慎用。

+  你可以通过插件编写需要的遍历器

#

## 用法： ##

>  建议安装promise化工具： npm install new-promiseify --save-dev

### 调用环境应该是在async函数内部或者Promise实例的回调函数内部 ###

       //导入
       const each = require('async-series-each');
       const promiseify = require('new-promiseify');
       const fs = require('fs');

       //forEach
       await each([0, 0, 0, 0]).forEach(async(cur, i, ar) => {
         await promiseify([setTimeout, 0, 0])(5000);
         console.log(`Current index is ${i}`);
       });

       //every
       const vaild = await each([1, 2, 3, 0, 4]).every(async(cur, i, ar) => {
           await promiseify([setTimeout, 0, 0])(5000);
           return console.log(cur) || cur;
       });

       //some
       const vaild = await each([0, 0, 0, false, true, 1]).some(async(cur, i, ar) => {
           await promiseify([setTimeout, 0, 0])(5000);
           return console.log(cur) || cur;
       });

       //filter
       const ar = await each([1, 2, 0, false, true, [], {}, null]).filter(async(cur, i, ar) => {
           await promiseify([setTimeout, 0, 0])(5000);
           return console.log(cur) || !cur;
       });

       //map
       const ctns = await each(['./1.md', './2.md', './3.md']).map(async(cur, i, ar) => {
           const ctn = await promiseify(fs.readFile)(cur, 'utf8');
           return console.log(cur) || ctn;
       });

       //reduce
       const res = await each(['./1.md', './2.md', './3.md']).reduce(async(res, cur, i, ar) => {
         const ctn = await promiseify(fs.readFile)(cur, 'utf8');
         return console.log(cur) || `${res + (i + 1)}. ${ctn}\n`;
       }, 'Read file content:\n');

       //sort
       const ar = await each(['./1.md', './2.md', './3.md']).sort(async(prev, cur) => {
           const rdFile = promiseify(fs.readFile),
           firCtn = await rdFile(prev, 'utf8'),
           secCtn = await rdFile(cur, 'utf8');
           return firCtn > secCtn ? 1 : -1;
       });


#

## 一点说明 ##

>  为什么不直接在Array.prototype上拓展？

>  因为我希望这个拓展是温和的，而不是具有侵入性的。

#

## 插件的写法 ##

以some方法为例

       module.exports = function SomeAsyncPlugin(Series) {
          //Regist some command to prototype of Series
          Series.prototype.some = async function(callback, cur = Series.root) {
              callback = callback.bind(cur);
              const src = this.source,
                  len = src.length;
              for (let i = 0; i < len; i++) {
                  const cont = await callback(src[i], i, src);
                  if (cont) return true;
              }
              return false;
          };
       };
