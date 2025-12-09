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
        isProcessing: false, // Debounce flag to prevent rapid clicks

        // 初始化
        init: function (boardId, startFen) {
            console.log('Initializing ChessApp...');
            try {
                this.game = new Chess(startFen || 'start');

                var config = {
                    draggable: true,
                    position: startFen || 'start',
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
                this.showError('棋盘初始化失败，请刷新页面重试。');
            }
        },

        // 显示用户友好的错误信息
        showError: function (message) {
            var statusEl = document.getElementById('statusInfo');
            if (statusEl) {
                statusEl.textContent = '⚠️ ' + message;
                statusEl.style.borderLeftColor = '#fc8181';
                statusEl.style.color = '#fc8181';
            }
        },

        // 验证 FEN 字符串
        validateFen: function (fen) {
            if (!fen || typeof fen !== 'string') return false;
            try {
                var testGame = new Chess(fen);
                return testGame !== null;
            } catch (e) {
                console.warn('Invalid FEN:', fen, e);
                return false;
            }
        },

        // 拖拽开始
        onDragStart: function (source, piece, position, orientation) {
            if (!this.game || this.game.game_over()) return false;
            if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
            return true;
        },

        // 放置棋子
        onDrop: function (source, target) {
            try {
                var move = this.game.move({
                    from: source,
                    to: target,
                    promotion: 'q'
                });

                if (move === null) return 'snapback';

                this.undoStack = [];
                this.updateStatus();
                this.updateHint(this.currentVariation);
            } catch (e) {
                console.error('Error in onDrop:', e);
                return 'snapback';
            }
        },

        // 动画结束
        onSnapEnd: function () {
            if (this.board && this.game) {
                this.board.position(this.game.fen());
            }
        },

        // 加载变例 - 带验证
        loadVariation: function (variation) {
            if (!variation) {
                console.warn('loadVariation called with null/undefined');
                return;
            }

            // 验证变例数据完整性
            if (!variation.fen || !variation.moves || !variation.steps) {
                console.error('Invalid variation data: missing required fields', variation);
                this.showError('变例数据不完整');
                return;
            }

            // 验证 moves 和 steps 长度匹配
            if (variation.moves.length !== variation.steps.length) {
                console.warn('Warning: moves.length !== steps.length',
                    variation.moves.length, variation.steps.length);
            }

            console.log('Loading variation:', variation.title);

            try {
                // 验证 FEN
                if (!this.validateFen(variation.fen)) {
                    this.showError('FEN 格式错误: ' + variation.title);
                    return;
                }

                this.currentVariation = variation;
                this.stepIndex = 0;

                this.game.load(variation.fen);
                this.board.position(variation.fen);
                this.undoStack = [];

                this.updateStatus();
                this.updateHint(variation);
            } catch (e) {
                console.error('Error loading variation:', e);
                this.showError('加载变例失败: ' + variation.title);
            }
        },

        // 下一步 - 带防抖和错误处理
        nextMove: function () {
            // 防止快速点击
            if (this.isProcessing) return;
            this.isProcessing = true;

            try {
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
                    } else {
                        console.error('Invalid move in variation:', moveStr,
                            'at step', this.stepIndex,
                            'FEN:', this.game.fen());
                        this.showError('无效走法: ' + moveStr);
                    }
                }
                // 否则重做 (从 undoStack)
                else if (this.undoStack.length > 0) {
                    var undoMove = this.undoStack.pop();
                    if (undoMove) {
                        var result = this.game.move(undoMove);
                        if (result) {
                            this.board.position(this.game.fen());
                            this.updateStatus();
                            this.updateHint(this.currentVariation);
                        } else {
                            // 恢复到栈中
                            this.undoStack.push(undoMove);
                            console.error('Failed to redo move:', undoMove);
                        }
                    }
                }
            } catch (e) {
                console.error('Error in nextMove:', e);
            } finally {
                // 释放防抖锁
                var self = this;
                setTimeout(function () {
                    self.isProcessing = false;
                }, 150);
            }
        },

        // 上一步 - 带防抖和错误处理
        prevMove: function () {
            // 防止快速点击
            if (this.isProcessing) return;
            this.isProcessing = true;

            try {
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
            } catch (e) {
                console.error('Error in prevMove:', e);
            } finally {
                var self = this;
                setTimeout(function () {
                    self.isProcessing = false;
                }, 150);
            }
        },

        // 重置
        reset: function () {
            try {
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
            } catch (e) {
                console.error('Error in reset:', e);
                // 强制重置到初始状态
                this.game = new Chess();
                this.board.start();
                this.undoStack = [];
                this.stepIndex = 0;
                this.updateStatus();
            }
        },

        // 翻转
        flipBoard: function () {
            if (this.board) {
                this.board.flip();
            }
        },

        // 更新状态文字
        updateStatus: function () {
            if (!this.game) return;

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

            // 如果在变例中，显示进度
            if (this.currentVariation && this.currentVariation.moves) {
                var total = this.currentVariation.moves.length;
                var current = this.stepIndex;
                status += ' [' + current + '/' + total + ']';
            }

            var statusEl = document.getElementById('statusInfo');
            if (statusEl) {
                statusEl.textContent = status;
                // 重置样式
                statusEl.style.borderLeftColor = '#4fd1c5';
                statusEl.style.color = '#4fd1c5';
            }

            var debugEl = document.getElementById('fenDebug');
            if (debugEl) debugEl.textContent = this.game.fen();
        },

        // 更新右侧提示 - 使用 CSS 类而非内联样式
        updateHint: function (variation) {
            var hintEl = document.getElementById('hintText');
            if (!hintEl) return;

            if (!variation) {
                hintEl.innerHTML = '<h3>欢迎</h3><p>请选择一个变例开始。</p>';
                return;
            }

            var html = '<h3>' + this.escapeHtml(variation.title) + '</h3>';
            html += '<p>' + this.escapeHtml(variation.description) + '</p>';

            if (variation.steps && variation.steps.length > 0) {
                html += '<ul>';
                var self = this;
                variation.steps.forEach(function (step, index) {
                    var isCurrent = (index === self.stepIndex);
                    var className = isCurrent ? 'current-step' : '';
                    html += '<li class="' + className + '">' + self.escapeHtml(step) + '</li>';
                });
                html += '</ul>';
            }

            hintEl.innerHTML = html;
        },

        // HTML 转义防止 XSS
        escapeHtml: function (text) {
            if (!text) return '';
            var div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };
})();