export class Utils {
    static random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static allPossibleCombinations(items: any[], isCombination = false): any {
        // finding all possible combinations of the last 2 items
        // remove those 2, add these combinations
        // isCombination shows if the last element is itself part of the combination series
        if (items.length == 1) {
            return items[0]
        }
        else if (items.length == 2) {
            var combinations = []
            for (var i = 0; i < items[1].length; i++) {
                for (var j = 0; j < items[0].length; j++) {
                    if (isCombination) {
                        // clone array to not modify original array
                        var combination: any[] = items[1][i].slice();
                        combination.push(items[0][j]);
                    }
                    else {
                        if (items[1][i] != items[0][j]) {
                            var combination = [items[1][i], items[0][j]];
                            combinations.push(combination);

                        }
                    }
                }
            }
            return combinations
        }
        else if (items.length > 2) {
            var last2 = items.slice(-2);
            var butLast2 = items.slice(0, items.length - 2);
            last2 = this.allPossibleCombinations(last2, isCombination);
            butLast2.push(last2)
            var combinations = butLast2;
            return this.allPossibleCombinations(combinations, isCombination = true)
        }
    }
    //Object of Objects
    static objectToArray(object: any) {
        console.log(object)
        return Object.keys(object).map(key => object[key])
    }
}