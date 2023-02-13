function compareArrays(fileId, array1, array2) {
  let result = [];
  for (let i = 0; i < array1.length; i++) {
    if (array2.includes(array1[i])) {
      result.push([fileId, array1[i], true]);
    } else {
      result.push([fileId, array1[i], false]);
    }
  }
  for (let i = 0; i < array2.length; i++) {
    if (!array1.includes(array2[i])) {
      result.push([fileId, array2[i], false]);
    }
  }
  return result;
}

// let array1 = [1, 2, 3, 4, 5];
// let array2 = [3, 4, 5, 6, 7];
// let comparisonResult = compareArrays("a", array1, array2);
// console.log(comparisonResult);

module.exports = { compareArrays };
