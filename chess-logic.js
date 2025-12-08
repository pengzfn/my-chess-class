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
