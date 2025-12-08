<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>苏格兰开局 - 大师复盘课</title>
    <link rel="stylesheet" href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>
    <script src="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js"></script>
    <script src="chess-logic.js"></script>
    <style>
        /* ...（保持紫色大师风格，略）... */
    </style>
</head>
<body>
    <a href="scotland-intro.html" class="back-button">← 返回目录</a>
    <div class="container">
        <!-- 左侧侧边栏 ...（略，见前文）... -->
        <!-- 右侧主区域 ...（略，见前文）... -->
    </div>
    <script>
        /**
         * ChessApp - 国际象棋核心逻辑模块
         * 提供棋盘初始化、走棋验证、悔棋、翻转等功能
         */
        var ChessApp = (function() {
            // ========== 私有变量 ==========
            var board = null;       // chessboard.js 棋盘实例
            var game = null;        // chess.js 游戏引擎
            var undoStack = [];     // 悔棋历史栈（用于"下一步"功能）
            var currentVariation = null;  // 当前加载的变例
            var variationMoveIndex = 0;   // 变例中当前走到第几步
            var startFen = '';      // 初始 FEN

            // ========== 私有函数 ==========

            /**
             * 拖拽开始：检查是否允许移动
             */
            function onDragStart(source, piece, position, orientation) {
                // 游戏结束不能走
                if (game.game_over()) return false;

                // 只能走自己颜色的棋子
                if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                    (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                    return false;
                }

                return true;
            }

            /**
             * 放置棋子：验证走法合法性
             */
            function onDrop(source, target) {
                // 尝试走棋
                var move = game.move({
                    from: source,
                    to: target,
                    promotion: 'q' // 默认升变为后
                });

                // 非法走法，棋子弹回
                if (move === null) return 'snapback';

                // 走棋成功，清空重做栈
                undoStack = [];
                updateStatus();
            }

            /**
             * 动画结束后同步棋盘
             */
            function onSnapEnd() {
                board.position(game.fen());
            }

            /**
             * 更新状态显示
             */
            function updateStatus() {
                var statusEl = document.getElementById('statusInfo');
                var counterEl = document.getElementById('moveCounter');
                
                if (!statusEl) return;

                var moveColor = game.turn() === 'w' ? '白方' : '黑方';
                var status = '';

                if (game.in_checkmate()) {
                    status = '♚ 将死！' + (game.turn() === 'w' ? '黑方' : '白方') + '获胜！';
                } else if (game.in_draw()) {
                    status = '🤝 和棋';
                } else {
                    status = '轮到' + moveColor + '走棋';
                    if (game.in_check()) {
                        status += ' ⚠️ 将军！';
                    }
                }

                statusEl.textContent = status;

                // 更新步数
                if (counterEl) {
                    var history = game.history();
                    counterEl.textContent = '已走步数：' + history.length;
                }
            }

            /**
             * 更新提示文字
             */
            function updateHint(text) {
                var hintEl = document.getElementById('hintText');
                if (hintEl) {
                    hintEl.innerHTML = text;
                }
            }

            // ========== 公开 API ==========
            return {
                /**
                 * 初始化棋盘
                 * @param {string} boardId - 棋盘容器 ID
                 * @param {string} fen - 初始 FEN 字符串
                 */
                init: function(boardId, fen) {
                    startFen = fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
                    
                    // 初始化 chess.js 引擎
                    game = new Chess(startFen);
                    undoStack = [];

                    // 配置 chessboard.js
                    var config = {
                        draggable: true,
                        position: startFen,
                        onDragStart: onDragStart,
                        onDrop: onDrop,
                        onSnapEnd: onSnapEnd,
                        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
                    };

                    // 创建棋盘
                    board = Chessboard(boardId, config);

                    // 响应式调整
                    $(window).resize(function() {
                        board.resize();
                    });

                    updateStatus();
                    console.log('ChessApp 初始化完成');
                    
                    return this;
                },

                /**
                 * 加载指定 FEN 局面
                 * @param {string} fen - FEN 字符串
                 * @param {string} description - 局面描述（可选）
                 */
                loadFen: function(fen, description) {
                    if (!game || !board) {
                        console.error('ChessApp 未初始化');
                        return;
                    }

                    game.load(fen);
                    board.position(fen);
                    undoStack = [];
                    currentVariation = null;
                    variationMoveIndex = 0;
                    
                    updateStatus();
                    
                    if (description) {
                        updateHint(description);
                    }
                },

                /**
                 * 加载变例对象
                 * @param {object} variation - 变例对象 {fen, moves, title, description, steps}
                 */
                loadVariation: function(variation) {
                    if (!variation) return;

                    currentVariation = variation;
                    variationMoveIndex = 0;

                    // 加载初始 FEN
                    game.load(variation.fen);
                    board.position(variation.fen);
                    undoStack = [];

                    updateStatus();

                    // 构建提示文字
                    var hintHtml = '<strong>' + variation.title + '</strong><br><br>';
                    hintHtml += variation.description + '<br><br>';
                    
                    if (variation.steps && variation.steps.length > 0) {
                        hintHtml += '<strong>走法步骤：</strong><ol>';
                        variation.steps.forEach(function(step) {
                            hintHtml += '<li>' + step + '</li>';
                        });
                        hintHtml += '</ol>';
                        hintHtml += '<p style="color:#667eea;">💡 点击"下一步"按钮查看标准走法</p>';
                    }

                    updateHint(hintHtml);
                },

                /**
                 * 悔棋（上一步）
                 */
                undo: function() {
                    var move = game.undo();
                    if (move) {
                        undoStack.push(move);
                        board.position(game.fen());
                        updateStatus();
                    }
                },

                /**
                 * 重做（下一步）- 优先执行变例走法
                 */
                redo: function() {
                    // 如果有变例，执行变例中的下一步
                    if (currentVariation && currentVariation.moves && 
                        variationMoveIndex < currentVariation.moves.length) {
                        
                        var moveStr = currentVariation.moves[variationMoveIndex];
                        var move = game.move(moveStr);
                        
                        if (move) {
                            variationMoveIndex++;
                            board.position(game.fen());
                            updateStatus();
                            
                            // 高亮当前步骤
                            if (currentVariation.steps && currentVariation.steps[variationMoveIndex - 1]) {
                                var stepInfo = '当前：' + currentVariation.steps[variationMoveIndex - 1];
                                var counterEl = document.getElementById('moveCounter');
                                if (counterEl) {
                                    counterEl.textContent = stepInfo;
                                }
                            }
                        }
                        return;
                    }

                    // 否则从悔棋栈恢复
                    if (undoStack.length > 0) {
                        var redoMove = undoStack.pop();
                        game.move(redoMove);
                        board.position(game.fen());
                        updateStatus();
                    }
                },

                /**
                 * 重置棋盘到初始状态
                 */
                reset: function() {
                    if (currentVariation) {
                        // 如果有当前变例，重置到变例初始状态
                        game.load(currentVariation.fen);
                        board.position(currentVariation.fen);
                        variationMoveIndex = 0;
                    } else {
                        // 否则重置到全局初始状态
                        game.load(startFen);
                        board.position(startFen);
                    }
                    undoStack = [];
                    updateStatus();
                },

                /**
                 * 翻转棋盘
                 */
                flip: function() {
                    board.flip();
                },

                /**
                 * 获取当前 FEN
                 */
                getFen: function() {
                    return game ? game.fen() : '';
                },

                /**
                 * 获取走棋历史
                 */
                getHistory: function() {
                    return game ? game.history() : [];
                }
            };
        })();

        var chessAPI = null;
        var scotlandFEN = 'rnbqkbnr/pppp1ppp/8/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3';
        var variations = { /* ...见前文... */ };
        function toggleCategory(element) {
            element.classList.toggle('active');
            var list = element.nextElementSibling;
            list.classList.toggle('show');
        }
        function loadVariation(element, id) {
            document.querySelectorAll('.variation-item').forEach(function(item) {
                item.classList.remove('active');
            });
            element.classList.add('active');
            var variation = variations[id] || variations[7];
            if (chessAPI) chessAPI.loadVariation(variation);
        }
        window.addEventListener('load', function() {
            chessAPI = ChessLogic.init(scotlandFEN);
            document.querySelectorAll('.category-title')[2].click();
        });
    </script>
</body>
</html>
