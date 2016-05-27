// // var log = console.log.bind(console, "debug: ");

// // var log = function () {
//   // console.log(arguments, "debug");
// // }

// // var log = {}

// // log.debug = function () {
// //   var len = arguments.length;
// //   for(var i = 0; i < len; i++) {
// //     console.log(arguments[i]);
// //   }
// // }

// // log.debug("hello", "dsd");

// log("test/temp.js start");

// function momentjsUse() {
//   var oldt = new Date('2016-04-22');
//   var nowt = new Date();
//   var interval = moment().subtract(5, 'days');
//   log( 'monent', oldt, nowt, interval.toString());
// }

// var Test = new Mongo.Collection('test');
// function upsertUse() {
//   var ret = Test.upsert({num: 2}, {$set: {abc: 'a'}});
//   console.log("upsertUse", ret);
// }
// // upsertUse();



// function observeChangesUse() {
//   var Test = new Mongo.Collection('observeChangesUse');

//   Test.find({}).observe({
//     changed: function (newDoc, oldDoc) {
//       console.log("changed", newDoc, oldDoc);
//     },
//   });
// }
// // observeChangesUse();


function cloneTest() {
  Object.prototype.clone = function () {
    var Constructor = this.constructor;
    var obj = new Constructor();

    for (var attr in this) {
        if (this.hasOwnProperty(attr)) {
            if (typeof(this[attr]) !== "function") {
                if (this[attr] === null) {
                    obj[attr] = null;
                }
                else {
                  obj[attr] = this[attr].clone();
                }
            }
        }
    }
    return obj;
  };

  var a = {a: '12', b: '123'};
  log( 'a --- ', a.clone() );

}
// cloneTest();


function testMatch (test) {
  check(test, {
    // label: Match.Maybe(String),
    list: [
      {a: Match.Maybe(String)}
    ]
  })
  log("testMatch", test);
}
// testMatch({list: [{a: '123'}, {}]});


function testSplit () {
  var arr = 'name-area-industry-type'.split('-');
  console.log(arr);
}
// testSplit();


function testReplace () {
  str = 'aa.$.bb';
  console.log(str.replace('$', 0), str );
}

// testReplace();
function testExtend () {
  var a = [{a:1}, {b:1}];
  var b = [{c: 1}];
  console.log(a.concat(b), a , b );
}
// testExtend();


// log("test/temp.js end");







