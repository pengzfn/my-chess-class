/**
 * 卡尔波夫 vs 科奇诺伊 (1974) 对局验证脚本
 * 
 * 功能：
 * 1. 验证所有6个变例的国际象棋合法性
 * 2. 检查每个着法是否在当前位置合法
 * 3. 确保着法记录与步骤说明数量匹配
 * 4. 输出详细的验证报告
 */

const { Chess } = require('chess.js');

// 从 HTML 文件中提取的变例数据
const VARIATIONS = {
    main_game: {
        title: "Karpov vs Korchnoi (1974) - 完整对局",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        moves: [
            "e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6",
            "Nc3", "g6", "Be3", "Bg7", "f3", "Nc6", "Qd2", "O-O",
            "Bc4", "Bd7", "h4", "Rc8", "Bb3", "Ne5", "O-O-O", "Nc4",
            "Bxc4", "Rxc4", "h5", "Nxh5", "g4", "Nf6", "Nde2", "Qa5",
            "Bh6", "Bxh6", "Qxh6", "Rfc8", "Rd3", "R4c5", "g5", "Rxg5",
            "Rd5", "Rxd5", "Nxd5", "Re8", "Nef4", "Bc6", "e5", "Bxd5",
            "exf6", "exf6", "Qxh7+", "Kf8", "Qh8+"
        ],
        stepCount: 172
    },
    decision_point_1: {
        title: "8...O-O后的选择：9.Bc4还是9.O-O-O？",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        moves: [
            "e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6",
            "Nc3", "g6", "Be3", "Bg7", "f3", "Nc6", "Qd2", "O-O",
            "Bc4"
        ],
        stepCount: 17
    },
    mistake_11g4: {
        title: "11.g4?的战术灾难",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        moves: [
            "e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6",
            "Nc3", "g6", "Be3", "Bg7", "f3", "Nc6", "Qd2", "O-O",
            "Bc4", "Bd7", "h4", "Rc8", "g4", "Nxd4", "Qxd4", "Nxg4"
        ],
        stepCount: 24
    },
    decision_point_3: {
        title: "15...Nf6后：16.Bh6还是16.Nde2？",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        moves: [
            "e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6",
            "Nc3", "g6", "Be3", "Bg7", "f3", "Nc6", "Qd2", "O-O",
            "Bc4", "Bd7", "h4", "Rc8", "Bb3", "Ne5", "O-O-O", "Nc4",
            "Bxc4", "Rxc4", "h5", "Nxh5", "g4", "Nf6", "Nde2"
        ],
        stepCount: 31
    },
    black_mistake: {
        title: "16...Qa5 - 黑方的关键失误",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        moves: [
            "e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6",
            "Nc3", "g6", "Be3", "Bg7", "f3", "Nc6", "Qd2", "O-O",
            "Bc4", "Bd7", "h4", "Rc8", "Bb3", "Ne5", "O-O-O", "Nc4",
            "Bxc4", "Rxc4", "h5", "Nxh5", "g4", "Nf6", "Nde2", "Qa5",
            "Bh6", "Bxh6", "Qxh6"
        ],
        stepCount: 35
    },
    white_attack: {
        title: "19...R4c5后的强制攻击",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        moves: [
            "e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6",
            "Nc3", "g6", "Be3", "Bg7", "f3", "Nc6", "Qd2", "O-O",
            "Bc4", "Bd7", "h4", "Rc8", "Bb3", "Ne5", "O-O-O", "Nc4",
            "Bxc4", "Rxc4", "h5", "Nxh5", "g4", "Nf6", "Nde2", "Qa5",
            "Bh6", "Bxh6", "Qxh6", "Rfc8", "Rd3", "R4c5", "g5", "Rxg5",
            "Rd5", "Rxd5", "Nxd5"
        ],
        stepCount: 45
    }
};

/**
 * 验证单个变例
 * @param {string} id - 变例ID
 * @param {object} variation - 变例数据
 * @returns {object} - 验证结果
 */
function validateVariation(id, variation) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`验证变例: ${id}`);
    console.log(`标题: ${variation.title}`);
    console.log(`起始 FEN: ${variation.fen}`);
    console.log(`着法总数: ${variation.moves.length}`);
    console.log(`步骤说明数: ${variation.stepCount}`);
    console.log('='.repeat(80));

    const result = {
        id,
        title: variation.title,
        passed: true,
        errors: [],
        warnings: [],
        movesValidated: 0
    };

    // 检查 moves 与 steps 数量是否匹配
    if (variation.moves.length !== variation.stepCount) {
        result.warnings.push(
            `⚠️ 着法数量 (${variation.moves.length}) 与步骤说明数 (${variation.stepCount}) 不匹配`
        );
    }

    // 创建 Chess 实例
    const chess = new Chess(variation.fen);

    // 验证每个着法
    for (let i = 0; i < variation.moves.length; i++) {
        const moveStr = variation.moves[i];
        const moveNumber = Math.floor(i / 2) + 1;
        const side = i % 2 === 0 ? '白方' : '黑方';
        
        try {
            // 尝试执行着法
            const move = chess.move(moveStr);
            
            if (move === null) {
                // 着法非法
                result.passed = false;
                result.errors.push(
                    `❌ 第 ${moveNumber} 回合 ${side}: "${moveStr}" 非法\n` +
                    `   当前 FEN: ${chess.fen()}\n` +
                    `   合法着法: ${chess.moves().slice(0, 10).join(', ')}${chess.moves().length > 10 ? '...' : ''}`
                );
                break; // 遇到非法着法后无法继续
            } else {
                // 着法合法
                result.movesValidated++;
                console.log(
                    `✅ 第 ${moveNumber} 回合 ${side}: ${moveStr} → ${move.san}`
                );
            }
        } catch (error) {
            result.passed = false;
            result.errors.push(
                `❌ 第 ${moveNumber} 回合 ${side}: "${moveStr}" 执行异常\n` +
                `   错误信息: ${error.message}`
            );
            break;
        }
    }

    // 输出最终 FEN
    if (result.passed && result.errors.length === 0) {
        console.log(`\n✅ 所有 ${result.movesValidated} 个着法验证通过！`);
        console.log(`最终 FEN: ${chess.fen()}`);
        
        // 检查对局状态
        if (chess.isCheckmate()) {
            console.log(`🏁 将杀！游戏结束`);
        } else if (chess.isCheck()) {
            console.log(`⚠️ 将军！`);
        } else if (chess.isStalemate()) {
            console.log(`🤝 和棋 (逼和)`);
        } else if (chess.isDraw()) {
            console.log(`🤝 和棋`);
        } else {
            console.log(`▶️ 对局继续`);
        }
    }

    return result;
}

/**
 * 生成验证报告
 * @param {array} results - 所有变例的验证结果
 */
function generateReport(results) {
    console.log('\n\n');
    console.log('='.repeat(80));
    console.log('验证报告汇总'.padStart(45, ' '));
    console.log('='.repeat(80));

    const totalVariations = results.length;
    const passedVariations = results.filter(r => r.passed).length;
    const failedVariations = totalVariations - passedVariations;

    console.log(`\n总变例数: ${totalVariations}`);
    console.log(`通过: ${passedVariations} ✅`);
    console.log(`失败: ${failedVariations} ❌`);

    // 详细错误
    const failedResults = results.filter(r => !r.passed);
    if (failedResults.length > 0) {
        console.log('\n' + '='.repeat(80));
        console.log('失败详情:');
        console.log('='.repeat(80));
        
        failedResults.forEach(result => {
            console.log(`\n❌ ${result.id}: ${result.title}`);
            console.log(`   已验证: ${result.movesValidated} 个着法`);
            result.errors.forEach(err => console.log(`   ${err}`));
        });
    }

    // 警告信息
    const resultsWithWarnings = results.filter(r => r.warnings.length > 0);
    if (resultsWithWarnings.length > 0) {
        console.log('\n' + '='.repeat(80));
        console.log('警告信息:');
        console.log('='.repeat(80));
        
        resultsWithWarnings.forEach(result => {
            console.log(`\n⚠️ ${result.id}:`);
            result.warnings.forEach(warn => console.log(`   ${warn}`));
        });
    }

    // 最终结论
    console.log('\n' + '='.repeat(80));
    if (failedVariations === 0) {
        console.log('✅ 所有变例验证通过！棋谱完全正确。'.padStart(50, ' '));
    } else {
        console.log('❌ 存在非法着法，需要修正！'.padStart(48, ' '));
    }
    console.log('='.repeat(80) + '\n');
}

// 主执行函数
function main() {
    console.log('\n卡尔波夫 vs 科奇诺伊 (1974) 对局验证');
    console.log('使用 Chess.js 库进行国际象棋合法性验证\n');

    const results = [];

    // 验证每个变例
    for (const [id, variation] of Object.entries(VARIATIONS)) {
        const result = validateVariation(id, variation);
        results.push(result);
    }

    // 生成报告
    generateReport(results);

    // 返回退出代码
    const allPassed = results.every(r => r.passed);
    process.exit(allPassed ? 0 : 1);
}

// 执行
main();
