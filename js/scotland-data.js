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

// =====================================================
// LESSON 4: Steinitz Variation (斯坦尼茨变例)
// =====================================================
const SCOTLAND_4_DATA = {
    d5_trap: {
        title: "冷门陷阱：4...d5 变例",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        description: "这是讲师特别提到的一个书本上罕见但逻辑看似合理的走法。如果白方应对不当（如走看似自然的 Bb5），黑方可以轻松获得平先甚至反击的机会。正确的反击方案是保持简单的出子逻辑。",
        moves: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "d5", "exd5", "Qxd5", "Qe2+", "Be6", "Nb5", "O-O-O", "N1c3"],
        steps: [
            "1.e4 占领中心",
            "1...e5",
            "2.Nf3",
            "2...Nc6",
            "3.d4 苏格兰开局",
            "3...exd4",
            "4.Nxd4",
            "4...d5 黑方试图一步解决中心问题，但在战术上有缺陷",
            "5.exd5 白方最佳应对，直接吃掉",
            "5...Qxd5",
            "6.Qe2+! 关键着法！强迫黑方挡格，为后续战术做铺垫",
            "6...Be6 黑方必须应将（若 Nge7 则 Nb5 威胁 c7 优势巨大）",
            "7.Nb5 利用先手威胁 c7 格，马位置极佳",
            "7...O-O-O 黑方为了解围不得不长易位",
            "8.N1c3 白方简单出子，双象优势+更好兵型，白优"
        ]
    },
    steinitz_main: {
        title: "斯坦尼茨变例主线 (4...Qh4)",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        description: "黑方第4步直接出后攻击 e4 兵，这是极具挑衅性的走法。白方的核心策略是不贪恋兵力，而是利用出子速度（Activity）来惩罚黑方过早出后。",
        moves: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Qh4", "Nc3", "Bb4", "Be2", "Qxe4", "Nb5", "Bxc3+", "bxc3", "Kd8", "O-O"],
        steps: [
            "1.e4",
            "1...e5",
            "2.Nf3",
            "2...Nc6",
            "3.d4",
            "3...exd4",
            "4.Nxd4",
            "4...Qh4 斯坦尼茨变例！黑方威胁 e4 兵，意图混战",
            "5.Nc3 保护 e4 并发展子力",
            "5...Bb4 钳制白马，再次对 e4 施压",
            "6.Be2! 弃掉 e4 兵！最关键的一步，临场很难找到",
            "6...Qxe4 黑方接受弃兵",
            "7.Ndb5 威胁 Nxc7 抽车或杀王，同时攻击黑后",
            "7...Bxc3+ 黑方为了消除威胁，不得不交换",
            "8.bxc3 兵型被打散，但获得双象+极快出子速度",
            "8...Kd8 黑王失去易位权，白方拥有巨大补偿",
            "9.O-O 白方安全易位，将通过 Re1 攻击滞留中心的黑后和黑王"
        ]
    },
    mitkov_variation: {
        title: "Mitkov 改进尝试 (6...Nf6)",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        description: "这是马其顿特级大师 Mitkov 喜爱的变例，试图不直接吃 e4 兵而是先出马。但此走法被一位 2100 分棋手精彩驳倒。",
        moves: ["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Nxd4", "Qh4", "Nc3", "Bb4", "Be2", "Nf6", "Nf5", "Qxe4", "Nxg7+", "Ke7", "O-O", "Bxc3", "bxc3", "Qg6", "Nh5", "d6", "Nf4", "Qg8", "Re1"],
        steps: [
            "1.e4",
            "1...e5",
            "2.Nf3",
            "2...Nc6",
            "3.d4",
            "3...exd4",
            "4.Nxd4",
            "4...Qh4",
            "5.Nc3",
            "5...Bb4",
            "6.Be2",
            "6...Nf6 Mitkov 的改进着法，推迟吃兵",
            "7.Nf5! 精彩！直接攻击黑后（原文误听为 Na5，实为 Nf5 配合 Nxg7+）",
            "7...Qxe4 黑方被迫吃兵，否则无路可走",
            "8.Nxg7+ 白方抽将！",
            "8...Ke7 (若 Kf8 则 Bh6 配合后续进攻致命)",
            "9.O-O 白方优先安全王位并准备出车",
            "9...Bxc3",
            "10.bxc3",
            "10...Qg6 黑后试图逃离危险区域",
            "11.Nh5 利用牵制和位置优势，白马极其活跃",
            "11...d6",
            "12.Nf4 再次攻击黑后，马调整到攻击位置",
            "12...Qg8 黑后被逼退",
            "13.Re1! 车占据 e 线直指黑王，通过 Ba3+ 拥有毁灭性攻势"
        ]
    }
};

// Export for use in other scripts (if using modules in future)
if (typeof window !== 'undefined') {
    window.SCOTLAND_1_DATA = SCOTLAND_1_DATA;
    window.SCOTLAND_2_DATA = SCOTLAND_2_DATA;
    window.SCOTLAND_3_DATA = SCOTLAND_3_DATA;
    window.SCOTLAND_4_DATA = SCOTLAND_4_DATA;
}
