// 确保依赖库已加载
if (typeof Chess === 'undefined' || typeof Chessboard === 'undefined') {
    console.error('严重错误: Chess.js 或 Chessboard.js 未加载！请检查 HTML 头部的 script 标签。');
}

window.ChessApp = {
    game: null,
    board: null,
    undoStack: [],
    currentVariation: null,
    stepIndex: 0,
    
    // 初始化函数
    init: function(boardId, startFen) {
        console.log('正在初始化 ChessApp...');
        
        // 1. 初始化游戏逻辑 (Chess.js)
        // 注意：如果 Fen 为空，默认标准开局
        this.game = new Chess(startFen || 'start');
        
        // 2. 配置棋盘 UI (Chessboard.js)
        var config = {
            draggable: true,
            position: startFen || 'start',
            // 强制使用维基百科图片 (用户要求)
            pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
            onDragStart: this.onDragStart,
            onDrop: this.onDrop,
            onSnapEnd: this.onSnapEnd
        };
        
        // 3. 渲染棋盘
        this.board = Chessboard(boardId, config);
        this.undoStack = [];
        this.updateStatus();
        
        // 响应窗口大小变化
        window.addEventListener('resize', () => {
            this.board.resize();
        });

        console.log('ChessApp 初始化成功, 当前 FEN:', this.game.fen());
    },

    // 拖拽开始：限制只能走当前回合的棋子
    onDragStart: function(source, piece, position, orientation) {
        // 由于回调函数中 this 指向会有变化，我们需要直接访问 window.ChessApp.game
        var game = window.ChessApp.game;
        
        if (game.game_over()) return false;

        // 只有轮到的一方可以动 (White's turn -> move w, Black's turn -> move b)
        if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    },

    // 放置棋子
    onDrop: function(source, target) {
        var app = window.ChessApp;
        var game = app.game;

        // 尝试走棋
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // 简易处理：默认升变皇后
        });

        // 非法移动，棋子弹回
        if (move === null) return 'snapback';

        // 合法移动：清空重做栈，更新状态
        app.undoStack = [];
        app.updateStatus();
    },

    // 动画结束，同步状态
    onSnapEnd: function() {
        window.ChessApp.board.position(window.ChessApp.game.fen());
    },

    // 加载变例
    loadVariation: function(variationData) {
        console.log('加载变例:', variationData.title);
        this.currentVariation = variationData;
        this.stepIndex = 0;
        
        // 加载 FEN
        this.game.load(variationData.fen);
        this.board.position(variationData.fen);
        this.undoStack = [];
        
        // 更新文字
        this.updateStatus();
        this.updateHint(variationData);
    },

    // 下一步 (优先走变例预设的棋，否则重做)
    nextMove: function() {
        // 1. 如果有变例数据，且还没走完
        if (this.currentVariation && this.currentVariation.moves && 
            this.stepIndex < this.currentVariation.moves.length) {
            
            var moveStr = this.currentVariation.moves[this.stepIndex];
            var move = this.game.move(moveStr);
            
            if (move) {
                this.board.position(this.game.fen());
                this.stepIndex++;
                this.updateStatus();
            }
            return;
        }

        // 2. 如果是普通模式下的重做 (Redo)
        if (this.undoStack.length > 0) {
            var nextMove = this.undoStack.pop();
            this.game.move(nextMove);
            this.board.position(this.game.fen());
            this.updateStatus();
        }
    },

    // 上一步 (Undo)
    prevMove: function() {
        var move = this.game.undo();
        if (move) {
            this.undoStack.push(move);
            this.board.position(this.game.fen());
            
            // 如果在变例中回退，索引也要减
            if (this.currentVariation && this.stepIndex > 0) {
                this.stepIndex--;
            }
            
            this.updateStatus();
        }
    },

    // 重置
    reset: function() {
        if (this.currentVariation) {
            // 重置当前变例
            this.loadVariation(this.currentVariation);
        } else {
            // 重置回纯初始状态
            this.game.reset();
            this.board.start();
        }
    },

    // 翻转视角
    flipBoard: function() {
        this.board.flip();
    },

    // 更新状态栏
    updateStatus: function() {
        var status = '';
        var moveColor = this.game.turn() === 'w' ? '白方' : '黑方';

        if (this.game.in_checkmate()) {
            status = '游戏结束，' + moveColor + '被将死。';
        } else if (this.game.in_draw()) {
            status = '游戏结束，和棋。';
        } else {
            status = '轮到 ' + moveColor + ' 走棋';
            if (this.game.in_check()) {
                status += ' (将军!)';
            }
        }

        $('#statusInfo').text(status);
        $('#fenDebug').text(this.game.fen()); // 调试用
    },

    // 更新右侧解说
    updateHint: function(data) {
        var html = `<h3>${data.title}</h3>`;
        html += `<p>${data.description}</p>`;
        if (data.steps) {
            html += '<ul>';
            data.steps.forEach(function(s, i) {
                // 高亮当前步
                var style = (i === window.ChessApp.stepIndex) ? 'font-weight:bold;color:#667eea;' : '';
                html += `<li style="${style}">${s}</li>`;
            });
            html += '</ul>';
        }
        $('#hintText').html(html);
    }
};

// 侧边栏折叠功能 (直接挂在 window 上，防止找不到)
window.toggleSidebarCategory = function(headerElement) {
    var content = headerElement.nextElementSibling;
    var arrow = headerElement.querySelector('.arrow');
    
    if (content.style.display === 'block') {
        content.style.display = 'none';
        if(arrow) arrow.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'block';
        if(arrow) arrow.style.transform = 'rotate(90deg)';
    }
};