// 简单测试 - 不依赖外部模块
const moves1 = ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Bc5", "Be3", "Qf6", "c3", "Nge7", "Bc4", "Ne5", "Be2", "Qg6", "O-O", "d6", "f4", "Qxe4", "Bf2", "Bxd4", "cxd4", "Ng6", "g3", "O-O", "Nc3", "Qf5", "d5"];

const moves6 = ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Bc5", "Be3", "Qf6", "c3", "Nge7", "Bc4", "Ne5", "Be2", "Qg6", "O-O", "d6", "f4", "Qxe4", "Bf2", "Bxd4", "cxd4", "Ng6", "g3", "Bh3", "Bf3", "Qf5"];

console.log("变例1 moves数量:", moves1.length);
console.log("变例6 moves数量:", moves6.length);

// 检查第13-14步
console.log("\n变例1第13-14步:");
console.log("13:", moves1[12]);  
console.log("14:", moves1[13]);

console.log("\n变例6第25-26步:");
console.log("25:", moves6[24]);
console.log("26:", moves6[25]);
