/**
 * Scotland Opening Data - Extracted from HTML files
 * This file contains all variation data for the Scotland Opening lectures.
 * 
 * CRITICAL: Each variation must satisfy:
 *   1. `fen` accurately represents the STARTING position before any moves
 *   2. `moves.length === steps.length` for proper sync
 *   3. All moves are valid from the given FEN position
 */

// =====================================================
// LESSON 1: Opening Principles
// =====================================================
const SCOTLAND_1_DATA = {
    intro: {
        title: "核心思想：为何走 d4?",
        // Position after 1.e4 e5 2.Nf3 Nc6 3.d4 - Black's turn
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
        description: "苏格兰开局不同于意大利或西班牙开局，它通过 d4 直接冲击中心，迫使黑方做出反应。",
        moves: ["exd4", "Nxd4"],
        steps: [
            "3...exd4 黑方除了吃兵外没有好的选择",
            "4.Nxd4 白方控制了中心 d4 和 e4 格。至此白方占据空间优势。"
        ]
    },
    variation_d6: {
        title: "变例：4... d6 (长易位进攻)",
        // Position after 1.e4 e5 2.Nf3 Nc6 3.d4 - Black's turn
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
        description: "针对 4...d6 的被动走法，白方可以选择极具攻击性的长易位计划。",
        moves: ["exd4", "Nxd4", "d6", "Nc3", "Nf6", "Be3", "Be7", "Qd2", "O-O", "O-O-O"],
        steps: [
            "3...exd4",
            "4.Nxd4",
            "4...d6 比较被动",
            "5.Nc3 正常出子",
            "5...Nf6",
            "6.Be3 准备长易位架构",
            "6...Be7",
            "7.Qd2 黑方短易位时我们长易位",
            "7...O-O",
            "8.O-O-O ! 推荐！白方后续将以 f3-g4-g5 发动猛烈攻势"
        ]
    },
    variation_nxd4: {
        title: "变例：4... Nxd4 (不推荐)",
        // Position after 1.e4 e5 2.Nf3 Nc6 3.d4 - Black's turn
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
        description: "这是业余棋手常犯的错误，过早释放中心压力，让白后站稳 d4。",
        moves: ["exd4", "Nxd4", "Nxd4", "Qxd4", "Nf6", "e5"],
        steps: [
            "3...exd4",
            "4.Nxd4",
            "4...Nxd4 ? 放弃中心控制",
            "5.Qxd4 白后在中心站得很稳",
            "5...Nf6 如果黑方想出马",
            "6.e5 ! 立即驱逐，黑方出子困难"
        ]
    },
    instructive_g6: {
        title: "教学局：4...g6 及其陷阱",
        // Position after 1.e4 e5 2.Nf3 Nc6 3.d4 - Black's turn
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
        description: "针对 4...g6，白方可以通过弃兵、弃子发动迅猛的攻势。",
        moves: [
            "exd4", "Nxd4", "g6", "Nc3", "Bg7", "Be3", "Nf6",
            "Nxc6", "bxc6", "e5", "Ng8", "f4", "f6", "Bc4",
            "fxe5", "O-O", "d5", "Nxd5", "cxd5", "Bxd5", "Rb8", "Bf7+"
        ],
        steps: [
            "3...exd4",
            "4.Nxd4",
            "4...g6 准备出侧翼象",
            "5.Nc3",
            "5...Bg7",
            "6.Be3",
            "6...Nf6 ?! 这是一个开局错误",
            "7.Nxc6 ! 立即交换",
            "7...bxc6",
            "8.e5 ! 逼退黑马",
            "8...Ng8 (若走Nh5则g4丢子)",
            "9.f4 巩固中心",
            "9...f6 反击",
            "10.Bc4 ! 弃兵争先",
            "10...fxe5",
            "11.O-O ! 再次弃兵，保持攻势",
            "11...d5",
            "12.Nxd5 ! 精彩的弃子",
            "12...cxd5",
            "13.Bxd5 威胁黑车",
            "13...Rb8 ? 败着(应走Bf5)",
            "14.Bf7+ ! 抽后，白胜"
        ]
    }
};

// =====================================================
// LESSON 2: Classic Traps
// =====================================================
const SCOTLAND_2_DATA = {
    mainline: {
        title: "苏格兰开局主线",
        // Position after 1.e4 e5 2.Nf3 Nc6 3.d4 - Black's turn
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
        description: "黑方接受交换是目前最主流的走法。",
        moves: ["exd4", "Nxd4", "Nf6", "Nc3", "Bb4"],
        steps: [
            "3...exd4 吃掉中心兵",
            "4.Nxd4 白方吃回",
            "4...Nf6 攻击e4兵",
            "5.Nc3 保护",
            "5...Bb4 牵制马"
        ]
    },
    classical: {
        title: "经典变例 (Bc5)",
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
        description: "黑方出象到c5，给白方中心马施加压力。",
        moves: ["exd4", "Nxd4", "Bc5", "Be3", "Qf6"],
        steps: [
            "3...exd4",
            "4.Nxd4",
            "4...Bc5 控制中心",
            "5.Be3 保护马",
            "5...Qf6 增加压力"
        ]
    },
    mieses: {
        title: "Mieses 变例",
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
        description: "这是卡斯帕罗夫钟爱的变例，导致非常尖锐的局面。",
        moves: ["exd4", "Nxd4", "Nf6", "Nxc6", "bxc6", "e5", "Qe7", "Qe2"],
        steps: [
            "3...exd4",
            "4.Nxd4",
            "4...Nf6",
            "5.Nxc6 交换",
            "5...bxc6",
            "6.e5! 赶马",
            "6...Qe7 牵制",
            "7.Qe2 解除牵制"
        ]
    },
    trap_qh4: {
        title: "陷阱：过早出后",
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
        description: "黑方过早出后，白方利用Nb5威胁c7。",
        moves: ["exd4", "Nxd4", "Qh4", "Nb5", "Qxe4+", "Be2", "Kd8", "Nxc7"],
        steps: [
            "3...exd4",
            "4.Nxd4",
            "4...Qh4? 过早出后",
            "5.Nb5! 威胁c7",
            "5...Qxe4+ 吃兵将军",
            "6.Be2 象出挡驾",
            "6...Kd8 被迫失去易位权",
            "7.Nxc7! 叉抓车和吃兵"
        ]
    },
    trap_f7: {
        title: "陷阱：f7 弱点",
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
        description: "如果黑方不小心，白方会利用f7点进行突破 (苏格兰弃兵变化)。",
        moves: ["exd4", "Bc4", "Bc5", "Ng5", "Nh6", "Nxf7", "Nxf7", "Bxf7+", "Kxf7", "Qh5+"],
        steps: [
            "3...exd4 吃兵",
            "4.Bc4! 苏格兰弃兵",
            "4...Bc5 正常应对",
            "5.Ng5! 瞄准f7",
            "5...Nh6 保护",
            "6.Nxf7! 弃马",
            "6...Nxf7",
            "7.Bxf7+ 弃象",
            "7...Kxf7",
            "8.Qh5+ 抽杀回子"
        ]
    }
};

// =====================================================
// LESSON 3: Mieses Variation Deep Dive
// =====================================================
const SCOTLAND_3_DATA = {
    mieses_intro: {
        title: "为什么选择 Mieses 变例？",
        // Position after 1.e4 e5 2.Nf3 Nc6 3.d4 - Black's turn
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3",
        description: "4...Nf6 是卡尔波夫、克拉姆尼克等大师的选择。白方应避免 5.Nc3（允许 Bb4 牵制），而应果断走 5.Nxc6 交换！",
        moves: ["exd4", "Nxd4", "Nf6", "Nxc6", "bxc6", "e5"],
        steps: [
            "3...exd4",
            "4.Nxd4",
            "4...Nf6 攻击 e4 兵，保留象的发展选择",
            "5.Nxc6! 关键一步，避免 5.Nc3 Bb4 的复杂局面",
            "5...bxc6 只能这样吃",
            "6.e5! 核心思路：驱马赢先手，占据空间"
        ]
    },
    main_line: {
        title: "主线：Qe7 牵制与 c4 驱马",
        // Position after 6.e5 - Black's turn (this FEN must match!)
        fen: "r1bqkb1r/p1pp1ppp/2p2n2/4P3/8/8/PPP2PPP/RNBQKB1R b KQkq - 0 6",
        description: "面对 e5，黑方最强应对是 6...Qe7! 牵制 e 兵。白方则用 Qe2 解除牵制，再用 c4 驱赶黑马。",
        moves: ["Qe7", "Qe2", "Nd5", "c4", "Ba6", "b3", "O-O-O"],
        steps: [
            "6...Qe7! 牵制 e5 兵",
            "7.Qe2 解除牵制",
            "7...Nd5 马跳中心",
            "8.c4! 驱赶马，为白马腾出 c3",
            "8...Ba6 牵制 c4 兵",
            "9.b3 巩固中心",
            "9...O-O-O 黑方长易位（但 a 线开放有风险）"
        ]
    },
    mistake_nd5: {
        title: "错误：6...Nd5? (直接跳马)",
        // Position after 6.e5 - Black's turn
        fen: "r1bqkb1r/p1pp1ppp/2p2n2/4P3/8/8/PPP2PPP/RNBQKB1R b KQkq - 0 6",
        description: "黑方如果不先走 Qe7 牵制，而直接跳马 Nd5，会陷入发展困难。",
        moves: ["Nd5", "c4", "Nb6", "Nc3", "Bb4", "Qg4"],
        steps: [
            "6...Nd5? 自然但不精确",
            "7.c4 驱马",
            "7...Nb6 马被迫退边",
            "8.Nc3 白马发展",
            "8...Bb4 试图牵制",
            "9.Qg4! 攻击 g7，若短易位则 Bh6 得子"
        ]
    },
    mistake_g6: {
        title: "错误：g6? (在主线中的失误)",
        // Position after 9.b3 in main line - Black's turn
        // 1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6 6.e5 Qe7 7.Qe2 Nd5 8.c4 Ba6 9.Nc3
        fen: "r3kb1r/p1ppqppp/b1p5/3nP3/2P5/1PN5/P3QPPP/R1B1KB1R b KQkq - 0 9",
        description: "在主线中，黑方试图走 g6 准备 Bg7，但这是一个开局失误，白方可以立即惩罚。",
        moves: ["g6", "Qe4", "Bg7", "Bg5", "Qxe5", "Qxe5", "Bxe5"],
        steps: [
            "9...g6? 试图 fianchetto，但这是失误",
            "10.Qe4! 后切入中心，威胁 Nf6+",
            "10...Bg7 被迫出象",
            "11.Bg5! 弃兵发起进攻",
            "11...Qxe5 贪吃 e5 兵",
            "12.Qxe5 换后",
            "12...Bxe5 白方利用阵型缺陷保持持续攻势"
        ]
    },
    game_demo: {
        title: "精彩对局：惩罚 g6 的完整战术",
        // Position after 9...g6 - White's turn
        // FEN: 白方c1象, f1象未动; 黑方马在d5, 后在e7, 象在a6
        fen: "r3kb1r/p1ppqp1p/b1p3p1/3nP3/2P5/1PN5/P3QPPP/R1B1KB1R w KQkq - 0 10",
        description: "白方利用 Ne4! 威胁 Nf6+，黑方被迫应对。白方随后用 Bg5 和 Nf6+ 发起强力攻击，获得持久优势。",
        moves: [
            "Ne4",      // 10.Ne4! 威胁 Nf6+ 抽后
            "Bg7",      // 10...Bg7 被迫出象
            "Bg5",      // 11.Bg5! 攻击黑后
            "Qb4+",     // 11...Qb4+ 将军
            "Qd2",      // 12.Qd2 挡驾
            "Qxd2+",    // 12...Qxd2+ 换后
            "Kxd2",     // 13.Kxd2
            "Bxe5",     // 13...Bxe5 吃e5兵
            "Nf6+",     // 14.Nf6+! 抽将！
            "Kf8",      // 14...Kf8 避开
            "Nxd5"      // 15.Nxd5 吃回马，白方优势
        ],
        steps: [
            "10.Ne4! 威胁 Nf6+ 抽后得子",
            "10...Bg7 被迫出象防守 f6",
            "11.Bg5! 攻击黑后，发起进攻",
            "11...Qb4+ 将军争取时间",
            "12.Qd2 挡驾",
            "12...Qxd2+ 换后",
            "13.Kxd2 白王虽然无法易位，但局面主动",
            "13...Bxe5 黑方吃回 e5 兵",
            "14.Nf6+! 精彩抽将！威胁吃象",
            "14...Kf8 (若 gxf6?? 则 Bxf6 抓住 h8 车)",
            "15.Nxd5 吃回马，白方双象 + 开放局面，明显优势"
        ]
    }
};

// Export for use in other scripts (if using modules in future)
if (typeof window !== 'undefined') {
    window.SCOTLAND_1_DATA = SCOTLAND_1_DATA;
    window.SCOTLAND_2_DATA = SCOTLAND_2_DATA;
    window.SCOTLAND_3_DATA = SCOTLAND_3_DATA;
}
