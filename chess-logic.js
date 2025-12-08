/**
 * 国际象棋核心逻辑模块
 * 提供完整的国际象棋游戏功能，包括走棋验证、悔棋、规则判断等
 */

(function(window) {
    'use strict';

    // ========== 全局变量 ==========
    var board = null;
    var game = null;
    var undoStack = []; // 用于实现"下一步"功能
    var currentVariation = null;
    var isFlipped = false; // 追踪棋盘是否翻转

    // ========== 棋盘事件处理 ==========
    function onDragStart(source, piece, position, orientation) {
        // 游戏结束时不允许走棋
        if (game.game_over()) return false;
        
        // 只能移动轮到的一方的棋子
        if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    }

    function onDrop(source, target) {
        // 清空重做栈（新走棋后不能再重做）
        undoStack = [];
        
        // 尝试走这一步
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // 默认升变为后
        });

        // 如果走法非法，让棋子弹回
        if (move === null) return 'snapback';

        // 更新状态显示
        updateStatus();
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    // ========== 状态更新 ==========
    function updateStatus() {
        var status = '';
        var moveColor = game.turn() === 'w' ? '白方' : '黑方';

        // 检查游戏状态
        if (game.in_checkmate()) {
            status = '将死！' + moveColor + '输了。';
        } else if (game.in_draw()) {
            status = '平局！';
        } else if (game.in_stalemate()) {
            status = '逼和！';
        } else if (game.in_threefold_repetition()) {
            status = '三次重复局面，平局！';
        } else if (game.in_check()) {
            status = moveColor + '被将军！';
        } else {
            status = '轮到' + moveColor + '走棋';
        }

        // 如果棋盘翻转了，添加视角提示
        if (isFlipped) {
            status += ' <span style="color:#999;font-size:0.9em;">(当前视角：黑方)</span>';
        }

        var statusEl = document.getElementById('statusInfo');
        var counterEl = document.getElementById('moveCounter');
        
        if (statusEl) {
            statusEl.innerHTML = status;
        }
        if (counterEl) {
            counterEl.textContent = '当前步数：' + game.history().length;
        }
        
        // 更新按钮状态
        updateButtons();
    }

    function updateButtons() {
        var prevBtn = document.getElementById('prevBtn');
        var nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = (game.history().length === 0);
        }
        if (nextBtn) {
            nextBtn.disabled = (undoStack.length === 0);
        }
    }

    // ========== 按钮功能 ==========
    function undoMove() {
        var move = game.undo();
        if (move) {
            undoStack.push(move); // 将撤销的步数存入栈
            board.position(game.fen());
            updateStatus();
            console.log('撤销了一步:', move.san);
        }
    }

    function redoMove() {
        if (undoStack.length > 0) {
            var move = undoStack.pop();
            game.move({
                from: move.from,
                to: move.to,
                promotion: move.promotion
            });
            board.position(game.fen());
            updateStatus();
            console.log('重做了一步:', move.san);
        }
    }

    function resetBoard(initialFen) {
        game.load(initialFen);
        board.position(initialFen);
        undoStack = [];
        updateStatus();
        
        var hintEl = document.getElementById('hintText');
        if (hintEl) {
            hintEl.innerHTML = '棋盘已重置到初始位置。';
        }
        console.log('重置棋盘');
    }

    function flipBoard() {
        board.flip();
        isFlipped = !isFlipped; // 切换翻转状态
        
        // 立即更新状态，确保文字不消失
        updateStatus();
        
        var hintEl = document.getElementById('hintText');
        if (hintEl) {
            var viewText = isFlipped ? '黑方' : '白方';
            hintEl.innerHTML = '棋盘已翻转视角。<br>当前视角：' + viewText;
        }
        console.log('翻转棋盘，当前视角：', isFlipped ? '黑方' : '白方');
    }

    // ========== 变例加载 ==========
    function loadVariation(variationData, initialFen) {
        if (!variationData) return;

        // 重置到变例起始位置
        var startFen = variationData.fen || initialFen;
        game.load(startFen);
        board.position(startFen);
        undoStack = [];

        // 更新提示文本
        updateHintText(variationData);
        updateStatus();
    }

    function updateHintText(variation) {
        var hintEl = document.getElementById('hintText');
        if (!hintEl) return;

        var html = '<strong>' + variation.title + '</strong><br><br>';
        html += variation.description + '<br><br>';
        
        if (variation.steps && variation.steps.length > 0) {
            html += '<strong>变例演示：</strong><ul>';
            variation.steps.forEach(function(step) {
                html += '<li>' + step + '</li>';
            });
            html += '</ul>';
        }
        
        hintEl.innerHTML = html;
    }

    // ========== 初始化函数 ==========
    function initChessGame(startFen) {
        // 初始化 Chess.js 游戏对象
        game = new Chess();
        game.load(startFen);

        // 棋盘配置
        var config = {
            draggable: true,
            position: startFen,
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd,
            pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
        };

        // 初始化棋盘
        board = Chessboard('myBoard', config);

        // 初始化状态显示
        updateStatus();

        // 响应式调整
        $(window).resize(board.resize);

        // 返回API对象，供外部调用
        return {
            undoMove: undoMove,
            redoMove: redoMove,
            resetBoard: function() { resetBoard(startFen); },
            flipBoard: flipBoard,
            loadVariation: function(variation) { loadVariation(variation, startFen); },
            getGame: function() { return game; },
            getBoard: function() { return board; }
        };
    }

    // ========== 暴露API到全局 ==========
    window.ChessLogic = {
        init: initChessGame
    };

})(window);
