module.exports = {
    random: function (max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    randomSort: function (arr, newArr) {
        // 如果原数组arr的length值等于1时，原数组只有一个值，其键值为0
        // 同时将这个值push到新数组newArr中
        if (arr.length == 1) {
            newArr.push(arr[0]);
            return newArr; // 相当于递归退出
        }
        // 在原数组length基础上取出一个随机数
        var random = Math.ceil(Math.random() * arr.length) - 1;
        // 将原数组中的随机一个值push到新数组newArr中
        newArr.push(arr[random]);
        // 对应删除原数组arr的对应数组项
        arr.splice(random, 1);
        return this.randomSort(arr, newArr);
    }
};
