(function () {
    // 1. 依赖检查
    if (typeof Chess === 'undefined' || typeof Chessboard === 'undefined') {
        console.error('Critical Error: Chess.js or Chessboard.js not loaded.');
        return;
    }

    window.ChessApp = {
        game: null,
        board: null,
        undoStack: [],
        currentVariation: null,
        stepIndex: 0,

        // 初始化
        init: function (boardId, startFen) {
            console.log('Initializing ChessApp...');
            try {
                this.game = new Chess(startFen || 'start');

                var config = {
                    draggable: true,
                    position: startFen || 'start',
                    // 尝试使用 CDN 图片，如果失败可能需要本地回退（这里保持 CDN）
                    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
                    onDragStart: this.onDragStart.bind(this),
                    onDrop: this.onDrop.bind(this),
                    onSnapEnd: this.onSnapEnd.bind(this)
                };

                this.board = Chessboard(boardId, config);

                // 响应式调整
                window.addEventListener('resize', () => {
                    if (this.board) this.board.resize();
                });

                this.updateStatus();
                console.log('ChessApp initialized successfully.');
            } catch (e) {
                console.error('ChessApp initialization failed:', e);
                alert('Failed to initialize chessboard. Please check console for details.');
            }
        },

        // 拖拽开始
        onDragStart: function (source, piece, position, orientation) {
            if (this.game.game_over()) return false;
            if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
            return true; // 允许拖拽
        },

        // 放置棋子
        onDrop: function (source, target) {
            var move = this.game.move({
                from: source,
                to: target,
                promotion: 'q'
            });

            if (move === null) return 'snapback';

            this.undoStack = [];
            this.updateStatus();
            // 用户手动走棋后，更新提示（虽然可能偏离变例，但保持 UI 响应）
            this.updateHint(this.currentVariation);
        },

        // 动画结束
        onSnapEnd: function () {
            this.board.position(this.game.fen());
        },

        // 加载变例
        loadVariation: function (variation) {
            if (!variation) return;
            console.log('Loading variation:', variation.title);
            this.currentVariation = variation;
            this.stepIndex = 0;

            this.game.load(variation.fen);
            this.board.position(variation.fen);
            this.undoStack = [];

            this.updateStatus();
            this.updateHint(variation);
        },

        // 下一步
        nextMove: function () {
            // 优先走变例
            if (this.currentVariation && this.currentVariation.moves &&
                this.stepIndex < this.currentVariation.moves.length) {

                var moveStr = this.currentVariation.moves[this.stepIndex];
                var move = this.game.move(moveStr);

                if (move) {
                    this.board.position(this.game.fen());
                    this.stepIndex++;
                    this.updateStatus();
                    this.updateHint(this.currentVariation);
                }
                return;
            }

            // 否则重做
            if (this.undoStack.length > 0) {
                var move = this.undoStack.pop();
                this.game.move(move);
                this.board.position(this.game.fen());
                this.updateStatus();
                this.updateHint(this.currentVariation);
            }
        },

        // 上一步
        prevMove: function () {
            var move = this.game.undo();
            if (move) {
                this.undoStack.push(move);
                this.board.position(this.game.fen());

                if (this.currentVariation && this.stepIndex > 0) {
                    this.stepIndex--;
                }

                this.updateStatus();
                this.updateHint(this.currentVariation);
            }
        },

        // 重置
        reset: function () {
            if (this.currentVariation) {
                this.loadVariation(this.currentVariation);
            } else {
                this.game.reset();
                this.board.start();
                this.undoStack = [];
                this.stepIndex = 0;
                this.currentVariation = null;
                this.updateStatus();
                this.updateHint(null);
            }
        },

        // 翻转
        flipBoard: function () {
            this.board.flip();
        },

        // 更新状态文字
        updateStatus: function () {
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

            var statusEl = document.getElementById('statusInfo');
            if (statusEl) statusEl.textContent = status;

            var debugEl = document.getElementById('fenDebug');
            if (debugEl) debugEl.textContent = this.game.fen();
        },

        // 更新右侧提示
        updateHint: function (variation) {
            var hintEl = document.getElementById('hintText');
            if (!hintEl) return;

            if (!variation) {
                hintEl.innerHTML = '<h3>欢迎</h3><p>请选择一个变例开始。</p>';
                return;
            }

            var html = '<h3>' + variation.title + '</h3>';
            html += '<p>' + variation.description + '</p>';

            if (variation.steps) {
                html += '<ul>';
                variation.steps.forEach((step, index) => {
                    // 高亮当前应该走的这一步 (stepIndex)
                    // 或者高亮刚刚走完的这一步? 
                    // 逻辑：stepIndex 指向"下一个要走的步数索引"。
                    // 所以高亮 index === stepIndex 表示"请走这一步"。
                    var isCurrent = (index === this.stepIndex);
                    var style = isCurrent ? 'background: rgba(102, 126, 234, 0.2); font-weight: bold; color: #667eea; padding: 2px 5px; border-radius: 4px; border-left: 3px solid #667eea;' : 'padding: 2px 5px;';

                    html += '<li style="' + style + '">' + step + '</li>';
                });
                html += '</ul>';
            }

            hintEl.innerHTML = html;
        }
    };
})();