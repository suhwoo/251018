// Astray - Little Planet Game
class Game {
    constructor() {
        console.log("게임 초기화 시작...");
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        console.log("캔버스 크기:", this.width, "x", this.height);
        
        // 게임 상태
        this.gameState = {
            health: 100,
            oxygen: 100,
            parts: 0,
            maxParts: 10,
            inventory: [],
            messages: []
        };
        
        // 플레이어
        this.player = {
            x: 100,
            y: 300,
            width: 20,
            height: 30,
            speed: 3,
            facing: 1 // 1: 오른쪽, -1: 왼쪽
        };
        
        console.log("플레이어 위치:", this.player.x, this.player.y);
        
        // 게임 월드
        this.world = {
            platforms: [],
            items: [],
            clues: [],
            escapeShip: null,
            caves: [],
            ruins: [],
            stars: [] // 별들을 저장할 배열 추가
        };
        
        // 입력 처리
        this.keys = {};
        this.setupEventListeners();
        
        // 게임 초기화
        this.initWorld();
        console.log("월드 초기화 완료. 플랫폼:", this.world.platforms.length, "아이템:", this.world.items.length);
        this.gameLoop();
        
        this.addMessage("미지의 행성에 불시착했습니다. 탈출선을 복구해야 합니다.", "warning");
        console.log("게임 초기화 완료!");
    }
    
    setupEventListeners() {
        // 키보드 입력
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            if (e.key.toLowerCase() === 'e') {
                this.interact();
            }
            if (e.key.toLowerCase() === 'i') {
                this.toggleInventory();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    initWorld() {
        // 별들 생성
        this.createStars();
        
        // 평면 맵 생성
        this.createFlatMap();
        
        // 아이템 배치
        this.createItems();
        
        // 단서 배치
        this.createClues();
        
        // 탈출선 배치
        this.createEscapeShip();
        
        // 동굴과 폐허 생성
        this.createCavesAndRuins();
    }
    
    createStars() {
        // 별들을 한 번만 생성
        for (let i = 0; i < 100; i++) {
            this.world.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height
            });
        }
    }
    
    createFlatMap() {
        // 평면 맵의 구조물들 (장애물이나 특별한 지역)
        this.world.platforms.push({
            x: 200, y: 200, width: 100, height: 50,
            type: 'ruin'
        });
        
        this.world.platforms.push({
            x: 400, y: 300, width: 80, height: 50,
            type: 'ruin'
        });
        
        this.world.platforms.push({
            x: 600, y: 150, width: 120, height: 50,
            type: 'ruin'
        });
        
        this.world.platforms.push({
            x: 800, y: 250, width: 100, height: 50,
            type: 'ruin'
        });
        
        this.world.platforms.push({
            x: 1000, y: 200, width: 150, height: 50,
            type: 'ruin'
        });
        
        // 동굴 입구
        this.world.platforms.push({
            x: 300, y: 400, width: 60, height: 40,
            type: 'cave_entrance'
        });
        
        // 큰 폐허 지역
        this.world.platforms.push({
            x: 500, y: 100, width: 200, height: 80,
            type: 'large_ruin'
        });
    }
    
    createItems() {
        // 탈출선 부품들 - 평면 맵에 배치
        this.world.items.push({
            x: 250, y: 180, width: 15, height: 15,
            type: 'ship_part',
            collected: false,
            name: '엔진 부품'
        });
        
        this.world.items.push({
            x: 450, y: 280, width: 15, height: 15,
            type: 'ship_part',
            collected: false,
            name: '연료 탱크'
        });
        
        this.world.items.push({
            x: 650, y: 130, width: 15, height: 15,
            type: 'ship_part',
            collected: false,
            name: '제어 모듈'
        });
        
        this.world.items.push({
            x: 850, y: 230, width: 15, height: 15,
            type: 'ship_part',
            collected: false,
            name: '항법 시스템'
        });
        
        this.world.items.push({
            x: 1050, y: 180, width: 15, height: 15,
            type: 'ship_part',
            collected: false,
            name: '생명 유지 장치'
        });
        
        this.world.items.push({
            x: 350, y: 380, width: 15, height: 15,
            type: 'ship_part',
            collected: false,
            name: '동력 코어'
        });
        
        this.world.items.push({
            x: 550, y: 80, width: 15, height: 15,
            type: 'ship_part',
            collected: false,
            name: '방어막 발생기'
        });
        
        this.world.items.push({
            x: 750, y: 350, width: 15, height: 15,
            type: 'ship_part',
            collected: false,
            name: '통신 장비'
        });
        
        this.world.items.push({
            x: 150, y: 300, width: 15, height: 15,
            type: 'ship_part',
            collected: false,
            name: '센서 어레이'
        });
        
        this.world.items.push({
            x: 950, y: 100, width: 15, height: 15,
            type: 'ship_part',
            collected: false,
            name: '자동 조종 장치'
        });
    }
    
    createClues() {
        // 외계 언어 조각들 - 평면 맵에 배치
        this.world.clues.push({
            x: 220, y: 200, width: 20, height: 20,
            type: 'alien_text',
            collected: false,
            text: "이곳은 고대 외계 문명의 유적지입니다."
        });
        
        this.world.clues.push({
            x: 420, y: 300, width: 20, height: 20,
            type: 'map_fragment',
            collected: false,
            text: "지하 동굴 시스템의 일부 지도가 발견되었습니다."
        });
        
        this.world.clues.push({
            x: 620, y: 150, width: 20, height: 20,
            type: 'alien_text',
            collected: false,
            text: "탈출선은 행성의 북쪽 지역에 있을 것입니다."
        });
        
        this.world.clues.push({
            x: 320, y: 400, width: 20, height: 20,
            type: 'map_fragment',
            collected: false,
            text: "동굴 깊숙한 곳에 숨겨진 보물이 있다는 기록이 있습니다."
        });
        
        this.world.clues.push({
            x: 520, y: 100, width: 20, height: 20,
            type: 'alien_text',
            collected: false,
            text: "이 행성의 대기는 독성이 있어 산소 공급이 필요합니다."
        });
    }
    
    createEscapeShip() {
        this.world.escapeShip = {
            x: 1100, y: 50, width: 80, height: 60,
            repaired: false,
            repairProgress: 0
        };
    }
    
    createCavesAndRuins() {
        // 동굴들 - 평면 맵에 배치
        this.world.caves.push({
            x: 300, y: 400, width: 60, height: 40,
            type: 'cave',
            explored: false
        });
        
        this.world.caves.push({
            x: 600, y: 500, width: 80, height: 50,
            type: 'cave',
            explored: false
        });
        
        // 폐허들 - 평면 맵에 배치
        this.world.ruins.push({
            x: 200, y: 200, width: 40, height: 40,
            type: 'ruin',
            explored: false
        });
        
        this.world.ruins.push({
            x: 750, y: 350, width: 50, height: 50,
            type: 'ruin',
            explored: false
        });
        
        this.world.ruins.push({
            x: 100, y: 500, width: 60, height: 60,
            type: 'ruin',
            explored: false
        });
    }
    
    update() {
        this.handleInput();
        this.updatePlayer();
        this.updateGameState();
        this.checkCollisions();
    }
    
    handleInput() {
        // 4방향 이동 (WASD)
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.player.x -= this.player.speed;
            this.player.facing = -1;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.player.x += this.player.speed;
            this.player.facing = 1;
        }
        if (this.keys['w'] || this.keys['arrowup']) {
            this.player.y -= this.player.speed;
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            this.player.y += this.player.speed;
        }
    }
    
    updatePlayer() {
        // 화면 경계 체크
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > this.width) {
            this.player.x = this.width - this.player.width;
        }
        if (this.player.y < 0) this.player.y = 0;
        if (this.player.y + this.player.height > this.height) {
            this.player.y = this.height - this.player.height;
        }
    }
    
    updateGameState() {
        // 산소 감소 (시간이 지날수록) - 더 빠르게 감소
        this.gameState.oxygen -= 0.05;
        if (this.gameState.oxygen < 0) {
            this.gameState.oxygen = 0;
            this.gameState.health -= 0.2;
        }
        
        // 체력이 0이 되면 게임 오버
        if (this.gameState.health <= 0) {
            this.addMessage("산소 부족으로 사망했습니다...", "error");
            this.gameOver();
        }
        
        // UI 업데이트
        this.updateUI();
    }
    
    checkCollisions() {
        // 아이템과의 충돌
        this.world.items.forEach(item => {
            if (!item.collected && this.isColliding(this.player, item)) {
                this.collectItem(item);
            }
        });
        
        // 단서와의 충돌
        this.world.clues.forEach(clue => {
            if (!clue.collected && this.isColliding(this.player, clue)) {
                this.collectClue(clue);
            }
        });
        
        // 탈출선과의 충돌
        if (this.world.escapeShip && this.isColliding(this.player, this.world.escapeShip)) {
            this.interactWithEscapeShip();
        }
        
        // 구조물과의 충돌 (장애물로 작용)
        this.world.platforms.forEach(platform => {
            if (this.isColliding(this.player, platform)) {
                this.handlePlatformCollision(platform);
            }
        });
    }
    
    handlePlatformCollision(platform) {
        // 플레이어가 구조물에 부딪혔을 때 밀어내기
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        const platformCenterX = platform.x + platform.width / 2;
        const platformCenterY = platform.y + platform.height / 2;
        
        const deltaX = playerCenterX - platformCenterX;
        const deltaY = playerCenterY - platformCenterY;
        
        // 더 작은 거리 방향으로 밀어내기
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
            // 좌우로 밀어내기
            if (deltaX > 0) {
                this.player.x = platform.x + platform.width;
            } else {
                this.player.x = platform.x - this.player.width;
            }
        } else {
            // 상하로 밀어내기
            if (deltaY > 0) {
                this.player.y = platform.y + platform.height;
            } else {
                this.player.y = platform.y - this.player.height;
            }
        }
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    collectItem(item) {
        item.collected = true;
        this.gameState.parts++;
        this.gameState.inventory.push(item);
        this.addMessage(`${item.name}을(를) 획득했습니다!`, "success");
        
        if (this.gameState.parts >= this.gameState.maxParts) {
            this.addMessage("모든 부품을 수집했습니다! 탈출선으로 가세요!", "success");
        }
    }
    
    collectClue(clue) {
        clue.collected = true;
        this.gameState.inventory.push(clue);
        this.addMessage("단서를 발견했습니다!", "info");
        this.addMessage(clue.text, "info");
    }
    
    interact() {
        // 근처 아이템이나 단서와 상호작용
        const nearbyItems = this.world.items.filter(item => 
            !item.collected && this.getDistance(this.player, item) < 50
        );
        const nearbyClues = this.world.clues.filter(clue => 
            !clue.collected && this.getDistance(this.player, clue) < 50
        );
        
        if (nearbyItems.length > 0) {
            this.collectItem(nearbyItems[0]);
        } else if (nearbyClues.length > 0) {
            this.collectClue(nearbyClues[0]);
        }
    }
    
    interactWithEscapeShip() {
        if (this.gameState.parts >= this.gameState.maxParts) {
            this.addMessage("탈출선을 복구했습니다! 게임 클리어!", "success");
            this.gameWin();
        } else {
            this.addMessage(`탈출선 복구에 필요한 부품: ${this.gameState.maxParts - this.gameState.parts}개`, "warning");
        }
    }
    
    getDistance(obj1, obj2) {
        const dx = (obj1.x + obj1.width/2) - (obj2.x + obj2.width/2);
        const dy = (obj1.y + obj1.height/2) - (obj2.y + obj2.height/2);
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    toggleInventory() {
        // 인벤토리 토글 (간단한 구현)
        const inventoryDiv = document.getElementById('inventory-items');
        if (inventoryDiv.style.display === 'none') {
            inventoryDiv.style.display = 'flex';
        } else {
            inventoryDiv.style.display = 'none';
        }
    }
    
    addMessage(text, type = 'info') {
        this.gameState.messages.push({ text, type, timestamp: Date.now() });
        const messageLog = document.getElementById('message-log');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        messageLog.appendChild(messageDiv);
        messageLog.scrollTop = messageLog.scrollHeight;
        
        // 메시지가 너무 많아지면 오래된 것 제거
        if (this.gameState.messages.length > 10) {
            this.gameState.messages.shift();
            messageLog.removeChild(messageLog.firstChild);
        }
    }
    
    updateUI() {
        document.getElementById('health').textContent = Math.max(0, Math.floor(this.gameState.health));
        document.getElementById('oxygen').textContent = Math.max(0, Math.floor(this.gameState.oxygen));
        document.getElementById('parts').textContent = `${this.gameState.parts}/${this.gameState.maxParts}`;
        
        // 인벤토리 업데이트
        const inventoryDiv = document.getElementById('inventory-items');
        inventoryDiv.innerHTML = '';
        this.gameState.inventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.textContent = item.type === 'ship_part' ? '⚙️' : '📜';
            itemDiv.title = item.name || item.text;
            inventoryDiv.appendChild(itemDiv);
        });
    }
    
    render() {
        // 화면 지우기
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 배경 그리기
        this.drawBackground();
        
        // 플랫폼 그리기
        this.world.platforms.forEach(platform => {
            this.drawPlatform(platform);
        });
        
        // 아이템 그리기
        this.world.items.forEach(item => {
            if (!item.collected) {
                this.drawItem(item);
            }
        });
        
        // 단서 그리기
        this.world.clues.forEach(clue => {
            if (!clue.collected) {
                this.drawClue(clue);
            }
        });
        
        // 동굴과 폐허 그리기
        this.world.caves.forEach(cave => {
            this.drawCave(cave);
        });
        
        this.world.ruins.forEach(ruin => {
            this.drawRuin(ruin);
        });
        
        // 탈출선 그리기
        if (this.world.escapeShip) {
            this.drawEscapeShip(this.world.escapeShip);
        }
        
        // 플레이어 그리기
        this.drawPlayer();
        
        // 미니맵 그리기
        this.drawMinimap();
        
        // 디버깅 정보 그리기
        this.drawDebugInfo();
    }
    
    drawBackground() {
        // 우주 배경
        this.ctx.fillStyle = '#000428';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 별들 그리기 (미리 생성된 별들)
        this.ctx.fillStyle = '#ffffff';
        this.world.stars.forEach(star => {
            this.ctx.fillRect(star.x, star.y, 1, 1);
        });
        
        // 행성 표면 그라데이션 (전체 화면)
        const gradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, Math.max(this.width, this.height) / 2
        );
        gradient.addColorStop(0, '#2c1810');
        gradient.addColorStop(0.7, '#1a1a1a');
        gradient.addColorStop(1, '#0a0a0a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    drawPlatform(platform) {
        // 구조물 타입에 따른 색상
        let color = '#6a6a6a';
        if (platform.type === 'ruin') color = '#8b4513';
        if (platform.type === 'large_ruin') color = '#654321';
        if (platform.type === 'cave_entrance') color = '#2a2a2a';
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // 테두리
        this.ctx.strokeStyle = '#8a8a8a';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        
        // 구조물 타입 표시
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            platform.type.replace('_', ' ').toUpperCase(),
            platform.x + platform.width / 2,
            platform.y + platform.height / 2 + 4
        );
    }
    
    drawItem(item) {
        // 아이템 배경
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fillRect(item.x - 2, item.y - 2, item.width + 4, item.height + 4);
        
        // 아이템 본체
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillRect(item.x, item.y, item.width, item.height);
        
        // 반짝이는 효과
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(item.x + 2, item.y + 2, item.width - 4, item.height - 4);
        
        // 테두리
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(item.x, item.y, item.width, item.height);
    }
    
    drawClue(clue) {
        // 단서 배경
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(clue.x - 2, clue.y - 2, clue.width + 4, clue.height + 4);
        
        // 단서 본체
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillRect(clue.x, clue.y, clue.width, clue.height);
        
        // 신비로운 효과
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(clue.x + 2, clue.y + 2, clue.width - 4, clue.height - 4);
        
        // 테두리
        this.ctx.strokeStyle = '#0000ff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(clue.x, clue.y, clue.width, clue.height);
    }
    
    drawCave(cave) {
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(cave.x, cave.y, cave.width, cave.height);
        
        // 동굴 입구 효과
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(cave.x + 5, cave.y + 5, cave.width - 10, cave.height - 10);
    }
    
    drawRuin(ruin) {
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(ruin.x, ruin.y, ruin.width, ruin.height);
        
        // 폐허 효과
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(ruin.x + 2, ruin.y + 2, ruin.width - 4, ruin.height - 4);
    }
    
    drawEscapeShip(ship) {
        this.ctx.fillStyle = '#4a9eff';
        this.ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
        
        // 탈출선 디테일
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(ship.x + 10, ship.y + 10, ship.width - 20, ship.height - 20);
        
        // 복구 상태 표시
        if (this.gameState.parts >= this.gameState.maxParts) {
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(ship.x + 5, ship.y + 5, ship.width - 10, 5);
        }
    }
    
    drawPlayer() {
        // 플레이어 몸체 (더 밝은 색으로)
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 플레이어 머리
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.player.x + 5, this.player.y, 10, 10);
        
        // 방향 표시
        this.ctx.fillStyle = '#ff0000';
        if (this.player.facing === 1) {
            this.ctx.fillRect(this.player.x + this.player.width - 5, this.player.y + 5, 5, 5);
        } else {
            this.ctx.fillRect(this.player.x, this.player.y + 5, 5, 5);
        }
        
        // 플레이어 테두리
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
    }
    
    drawMinimap() {
        const minimapSize = 150;
        const minimapX = this.width - minimapSize - 10;
        const minimapY = 10;
        
        // 미니맵 배경
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
        
        // 미니맵 테두리
        this.ctx.strokeStyle = '#4a9eff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);
        
        // 플레이어 위치
        const playerMapX = minimapX + (this.player.x / this.width) * minimapSize;
        const playerMapY = minimapY + (this.player.y / this.height) * minimapSize;
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(playerMapX - 2, playerMapY - 2, 4, 4);
        
        // 아이템 위치
        this.world.items.forEach(item => {
            if (!item.collected) {
                const itemMapX = minimapX + (item.x / this.width) * minimapSize;
                const itemMapY = minimapY + (item.y / this.height) * minimapSize;
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(itemMapX - 1, itemMapY - 1, 2, 2);
            }
        });
        
        // 탈출선 위치
        if (this.world.escapeShip) {
            const shipMapX = minimapX + (this.world.escapeShip.x / this.width) * minimapSize;
            const shipMapY = minimapY + (this.world.escapeShip.y / this.height) * minimapSize;
            this.ctx.fillStyle = '#4a9eff';
            this.ctx.fillRect(shipMapX - 2, shipMapY - 2, 4, 4);
        }
    }
    
    gameOver() {
        this.addMessage("게임 오버! 다시 시도하세요.", "error");
        // 게임 재시작 로직을 여기에 추가할 수 있습니다
    }
    
    gameWin() {
        this.addMessage("축하합니다! 행성에서 탈출에 성공했습니다!", "success");
        // 승리 화면 로직을 여기에 추가할 수 있습니다
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    drawDebugInfo() {
        // 디버깅 정보를 화면에 표시
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        
        let y = 20;
        this.ctx.fillText(`플레이어: (${this.player.x}, ${this.player.y})`, 10, y);
        y += 20;
        this.ctx.fillText(`플랫폼: ${this.world.platforms.length}개`, 10, y);
        y += 20;
        this.ctx.fillText(`아이템: ${this.world.items.length}개`, 10, y);
        y += 20;
        this.ctx.fillText(`단서: ${this.world.clues.length}개`, 10, y);
        y += 20;
        this.ctx.fillText(`산소: ${Math.floor(this.gameState.oxygen)}`, 10, y);
    }
}

// 게임 시작
window.addEventListener('load', () => {
    new Game();
});
