/**
 * Enemy Manager - Handles all enemy-related functionality
 * 
 * ENEMY CONFIGURATION PARAMETERS:
 * 
 * speedX/speedY: { min, max } - Range of horizontal/vertical movement speeds
 * points: number - Base score points awarded when enemy is destroyed
 * respawnDelay: number - Milliseconds before enemy can respawn (currently unused)
 * width/height: number - Enemy collision box dimensions in pixels
 * directionChangeProbability: number - Per-frame probability (0.0-1.0) of switching to homing behavior
 * reverseMovementProbability: number - Per-frame probability (0.0-1.0) of reversing Y-direction movement
 * 
 * ENEMY TYPE BEHAVIORS:
 * Type 1: Basic red diamond - simple movement patterns
 * Type 2: Blue cross - slightly more erratic movement
 * Type 3: Purple triangle - moderate difficulty with increased homing
 * Type 4: Cyan star - has force field deflection ability, can reverse Y-direction
 * Type 5: Red cross - shoots bullets, rotates to match movement direction
 * Type 6: Orange arrow - high retrograde capability, can reverse Y-direction frequently
 * Type 7: Purple hexagon - moderate difficulty with balanced homing and agility
 * Type 8: Golden beetle/boss - capture fighter prototype, high mobility and aggression
 * 
 * LEVEL MULTIPLIERS:
 * speedMultiplier: Applied to all enemy speeds from level config
 * eccentricityMultiplier: Applied to direction change and reverse movement probabilities
 */
class EnemyManager {
    constructor(canvas, ctx, soundManager, visualEffects) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.soundManager = soundManager;
        this.visualEffects = visualEffects;
        
        // Game state references
        this.enemies = [];
        this.spawnSchedule = [];
        this.nextSpawnIndex = 0;
        this.totalEnemiesCreated = 0;
        
        // Tractor beam global state
        this.activeTractorBeamCount = 0;
        
        // Base enemy configurations
        this.enemyBaseConfig = {
            type1: {
                speedX: { min: 1.0, max: 2.5 },
                speedY: { min: 0.6, max: 1.2 },
                points: 20,
                respawnDelay: 750,
                width: 22,
                height: 22,
                directionChangeProbability: 0.008,
                reverseMovementProbability: 0.0
            },
            type2: {
                speedX: { min: 0.5, max: 1.5 },
                speedY: { min: 0.7, max: 1.3 },
                points: 30,
                respawnDelay: 950,
                width: 26,
                height: 26,
                directionChangeProbability: 0.012,
                reverseMovementProbability: 0.0
            },
            type3: {
                speedX: { min: 1.0, max: 2.0 },
                speedY: { min: .8, max: 1.4 },
                points: 45,
                respawnDelay: 975,
                width: 30,
                height: 30,
                directionChangeProbability: 0.015,
                reverseMovementProbability: 0.0
            },
            type4: {
                speedX: { min: 0.8, max: 1.8 },
                speedY: { min: 0.9, max: 1.5 },
                points: 60,
                respawnDelay: 1100,
                width: 32,
                height: 32,
                directionChangeProbability: 0.020,
                reverseMovementProbability: 0.015
            },
            type5: {
                speedX: { min: 1.2, max: 2.2 },
                speedY: { min: 1.0, max: 1.6 },
                points: 75,
                respawnDelay: 1200,
                width: 28,
                height: 28,
                directionChangeProbability: 0.025,
                reverseMovementProbability: 0.0
            },
            type6: {
                speedX: { min: 1.0, max: 2.0 },
                speedY: { min: 1.1, max: 1.7 },
                points: 90,
                respawnDelay: 1300,
                width: 30,
                height: 30,
                directionChangeProbability: 0.030,
                reverseMovementProbability: 0.025
            },
            type7: {
                speedX: { min: 1.1, max: 2.1 },
                speedY: { min: 1.0, max: 1.6 },
                points: 80,
                respawnDelay: 1250,
                width: 32,
                height: 32,
                directionChangeProbability: 0.022,
                reverseMovementProbability: 0.018
            },
            type8: {
                speedX: { min: 1.3, max: 2.3 },
                speedY: { min: 1.2, max: 1.8 },
                points: 100,
                respawnDelay: 1400,
                width: 34,
                height: 34,
                directionChangeProbability: 0.035,
                reverseMovementProbability: 0.020
            }
        };
    }
    
    // Initialize enemies for a new level
    initializeLevel(levelConfig) {
        this.levelConfig = levelConfig;
        this.enemies.length = 0;
        this.totalEnemiesCreated = 0;
        this.spawnSchedule = this.generateSpawnSchedule(levelConfig);
        this.nextSpawnIndex = 0;
        this.activeTractorBeamCount = 0; // Reset tractor beam state for new level
    }
    
    // Generate spawn schedule for the current level
    generateSpawnSchedule(levelConfig) {
        const schedule = [];
        
        for (let i = 0; i < levelConfig.global.maxEnemies; i++) {
            // Random time within the spawn window
            const randomTime = Math.random() * levelConfig.global.spawnTimeWindow;
            schedule.push({
                spawnTime: randomTime,
                spawned: false
            });
        }
        
        // Sort by spawn time so we can process chronologically
        schedule.sort((a, b) => a.spawnTime - b.spawnTime);
        
        return schedule;
    }
    
    // Create new enemy
    createEnemy(type = 1) {
        // Play spawn sound
        this.soundManager.playSpawnSound();
        
        // Determine enemy type based on level and spawn chances
        let enemyType = type;
        let config;
        
        if (type === 1) {
            // Random type selection for automatic spawning
            const allowedTypes = this.levelConfig.allowedEnemyTypes;
            
            // Randomly pick from allowed types
            enemyType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
            config = this.enemyBaseConfig[`type${enemyType}`];
        } else {
            // Specific type requested - check if it's allowed
            if (this.levelConfig.allowedEnemyTypes.includes(type)) {
                config = this.enemyBaseConfig[`type${type}`];
            } else {
                // Fallback to first allowed type
                enemyType = this.levelConfig.allowedEnemyTypes[0];
                config = this.enemyBaseConfig[`type${enemyType}`];
            }
        }
        
        // Apply level speed multiplier
        const speedMultiplier = this.levelConfig.global.speedMultiplier || 1.0;
        
        const enemy = {
            x: Math.random() * (this.canvas.width - config.width),
            y: Math.random() * -50 - 20,
            width: config.width,
            height: config.height,
            speedX: (Math.random() * (config.speedX.max - config.speedX.min) + config.speedX.min) * speedMultiplier,
            speedY: (Math.random() * (config.speedY.max - config.speedY.min) + config.speedY.min) * speedMultiplier,
            direction: Math.random() > 0.5 ? 1 : -1,
            directionY: 1,
            alive: true,
            type: enemyType
        };
        
        // Add rotation for type 5 enemies to match their direction of travel
        if (enemyType === 5) {
            const vx = enemy.speedX * enemy.direction;
            const vy = enemy.speedY * enemy.directionY;
            enemy.rotation = Math.atan2(vy, vx) - Math.PI/2;
        }
        
        // Add force field properties for type 4 enemies
        if (enemyType === 4) {
            enemy.forceField = {
                active: false,
                nextActivationTime: Math.random() * 10000 + 5000,
                duration: 10000,
                activationChance: 0.20,
                lastCheckTime: Date.now()
            };
        }
        
        // Add tractor beam properties for type 8 enemies
        if (enemyType === 8) {
            enemy.tractorBeam = {
                active: false,
                length: 0,
                maxLength: 80,
                growthRate: 4, // pixels per frame
                fireChance: 0.003, // per frame probability of firing
                cooldownTime: 3000, // 3 seconds between beam uses
                prepareTime: 800, // 0.8 seconds to slow down movement before firing
                growthTime: 550, // 0.55 seconds to grow to full length (+10%)
                holdTime: 1100, // 1.1 seconds hold at full length (+10%)
                retractTime: 880, // 0.88 seconds to retract (+10%)
                lastFireTime: 0,
                startTime: 0,
                phase: 'idle', // 'idle', 'preparing', 'growing', 'holding', 'retracting'
                originalSpeedX: 0, // Store original speeds for restoration
                originalSpeedY: 0
            };
        }
        
        return enemy;
    }
    
    // Spawn enemies based on schedule
    spawnEnemies(gameStartTime, totalPausedTime) {
        // Don't spawn if game hasn't started yet
        if (gameStartTime === 0) return;
        
        // Calculate current game time, excluding paused time
        const currentTime = (Date.now() - gameStartTime - totalPausedTime) / 1000;
        
        // Check if any scheduled spawns are ready
        while (this.nextSpawnIndex < this.spawnSchedule.length) {
            const spawn = this.spawnSchedule[this.nextSpawnIndex];
            
            if (!spawn.spawned && currentTime >= spawn.spawnTime) {
                this.enemies.push(this.createEnemy());
                spawn.spawned = true;
                this.totalEnemiesCreated++;
                this.nextSpawnIndex++;
            } else {
                // Since schedule is sorted, no more spawns are ready yet
                break;
            }
        }
    }
    
    // Enhanced collision check that handles both rectangular and circular collision
    checkEnhancedCollision(obj1, obj2) {
        // Check if either object is a type 4 enemy (circular collision)
        const obj1IsType4 = obj1.type === 4;
        const obj2IsType4 = obj2.type === 4;
        
        if (obj1IsType4 && !obj2IsType4) {
            return this.checkCircularCollision(obj1, obj2);
        } else if (obj2IsType4 && !obj1IsType4) {
            return this.checkCircularCollision(obj2, obj1);
        } else if (obj1IsType4 && obj2IsType4) {
            // Both are type 4, use circle-to-circle collision (optimized)
            const center1X = obj1.x + obj1.width / 2;
            const center1Y = obj1.y + obj1.height / 2;
            const radius1 = obj1.width / 2;
            
            const center2X = obj2.x + obj2.width / 2;
            const center2Y = obj2.y + obj2.height / 2;
            const radius2 = obj2.width / 2;
            
            const dx = center1X - center2X;
            const dy = center1Y - center2Y;
            const distanceSquared = dx * dx + dy * dy;
            
            const radiusSum = radius1 + radius2;
            return distanceSquared < (radiusSum * radiusSum);
        } else {
            // Neither is type 4, use regular rectangular collision
            return this.checkCollision(obj1, obj2);
        }
    }
    
    // Regular collision detection
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // Circular collision detection for type 4 enemies
    checkCircularCollision(circle, rect) {
        // Get circle center and radius
        const circleX = circle.x + circle.width / 2;
        const circleY = circle.y + circle.height / 2;
        const radius = circle.width / 2;
        
        // Get rectangle center
        const rectCenterX = rect.x + rect.width / 2;
        const rectCenterY = rect.y + rect.height / 2;
        
        // Calculate squared distance between centers (avoid Math.sqrt)
        const dx = circleX - rectCenterX;
        const dy = circleY - rectCenterY;
        const distanceSquared = dx * dx + dy * dy;
        
        // Check if squared distance is less than squared radius sum
        const otherRadius = Math.min(rect.width, rect.height) / 2;
        const radiusSum = radius + otherRadius;
        return distanceSquared < (radiusSum * radiusSum);
    }
    
    // Check if enemies are colliding and handle avoidance
    handleEnemyCollision() {
        for (let i = 0; i < this.enemies.length; i++) {
            for (let j = i + 1; j < this.enemies.length; j++) {
                const enemy1 = this.enemies[i];
                const enemy2 = this.enemies[j];
                
                if (enemy1.alive && enemy2.alive && this.checkEnhancedCollision(enemy1, enemy2)) {
                    const centerX1 = enemy1.x + enemy1.width / 2;
                    const centerY1 = enemy1.y + enemy1.height / 2;
                    const centerX2 = enemy2.x + enemy2.width / 2;
                    const centerY2 = enemy2.y + enemy2.height / 2;
                    
                    const dx = centerX1 - centerX2;
                    const dy = centerY1 - centerY2;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 0) {
                        const separationForce = this.levelConfig.global.collisionSeparation;
                        const separationX = (dx / distance) * separationForce;
                        const separationY = (dy / distance) * separationForce;
                        
                        enemy1.x += separationX;
                        enemy1.y += separationY;
                        enemy2.x -= separationX;
                        enemy2.y -= separationY;
                        
                        enemy1.x = Math.max(0, Math.min(this.canvas.width - enemy1.width, enemy1.x));
                        enemy1.y = Math.max(0, Math.min(this.canvas.height - enemy1.height, enemy1.y));
                        enemy2.x = Math.max(0, Math.min(this.canvas.width - enemy2.width, enemy2.x));
                        enemy2.y = Math.max(0, Math.min(this.canvas.height - enemy2.height, enemy2.y));
                        
                        // Only reverse direction 40% of the time to reduce interference with direction change logic
                        if (Math.random() < 0.4) {
                            enemy1.direction *= -1;
                            enemy2.direction *= -1;
                        }
                    }
                }
            }
        }
    }
    
    // Handle enemy collision for external enemies array (for backward compatibility)
    handleEnemyCollisionForArray(enemies, levelConfig) {
        for (let i = 0; i < enemies.length; i++) {
            for (let j = i + 1; j < enemies.length; j++) {
                const enemy1 = enemies[i];
                const enemy2 = enemies[j];
                
                if (enemy1.alive && enemy2.alive && this.checkEnhancedCollision(enemy1, enemy2)) {
                    const centerX1 = enemy1.x + enemy1.width / 2;
                    const centerY1 = enemy1.y + enemy1.height / 2;
                    const centerX2 = enemy2.x + enemy2.width / 2;
                    const centerY2 = enemy2.y + enemy2.height / 2;
                    
                    const dx = centerX1 - centerX2;
                    const dy = centerY1 - centerY2;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 0) {
                        const separationForce = levelConfig.global.collisionSeparation;
                        const separationX = (dx / distance) * separationForce;
                        const separationY = (dy / distance) * separationForce;
                        
                        enemy1.x += separationX;
                        enemy1.y += separationY;
                        enemy2.x -= separationX;
                        enemy2.y -= separationY;
                        
                        enemy1.x = Math.max(0, Math.min(this.canvas.width - enemy1.width, enemy1.x));
                        enemy1.y = Math.max(0, Math.min(this.canvas.height - enemy1.height, enemy1.y));
                        enemy2.x = Math.max(0, Math.min(this.canvas.width - enemy2.width, enemy2.x));
                        enemy2.y = Math.max(0, Math.min(this.canvas.height - enemy2.height, enemy2.y));
                        
                        enemy1.direction *= -1;
                        enemy2.direction *= -1;
                    }
                }
            }
        }
    }
    
    // Update all enemies
    updateEnemies(player, enemyBullets) {
        const now = Date.now();
        
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (enemy.alive) {
                const baseConfig = this.enemyBaseConfig[`type${enemy.type}`];
                const eccentricityMultiplier = this.levelConfig.global.eccentricityMultiplier || 1.0;

                // Initialize decision timers if not set
                if (!enemy.nextDirectionChangeTime) {
                    const avgInterval = 1000 / (baseConfig.directionChangeProbability * eccentricityMultiplier);
                    enemy.nextDirectionChangeTime = now + Math.random() * avgInterval;
                }
                if (!enemy.nextReverseTime && (enemy.type === 4 || enemy.type === 6 || enemy.type === 7)) {
                    const avgInterval = 1000 / (baseConfig.reverseMovementProbability * eccentricityMultiplier);
                    enemy.nextReverseTime = now + Math.random() * avgInterval;
                }

                // Stochastic Direction Change: Check timer instead of probability
                if (now >= enemy.nextDirectionChangeTime) {
                    // 50% chance to home toward player, 50% chance for random direction
                    if (Math.random() < 0.5) {
                        const playerDir = this.calculateDirectionToPlayer(enemy, player);
                        // Update enemy direction to point toward player
                        enemy.direction = playerDir.directionX > 0 ? 1 : -1;
                        enemy.directionY = playerDir.directionY > 0 ? 1 : -1;
                    } else {
                        // Random direction change
                        enemy.direction = Math.random() > 0.5 ? 1 : -1;
                        // 30% chance to also change Y direction for more interesting movement
                        if (Math.random() < 0.3) {
                            enemy.directionY *= -1;
                        }
                    }
                    
                    // Schedule next direction change with reasonable variance
                    const avgInterval = 1000 / (baseConfig.directionChangeProbability * eccentricityMultiplier);
                    enemy.nextDirectionChangeTime = now + avgInterval + (Math.random() - 0.5) * avgInterval * 0.5;
                }

                // Y-Direction Reversal Logic (Types 4, 6, and 7)
                if (enemy.type === 4) {
                    if (enemy.y > this.canvas.height * 0.1 && now >= enemy.nextReverseTime) {
                        enemy.directionY *= -1;
                        const avgInterval = 1000 / (baseConfig.reverseMovementProbability * eccentricityMultiplier);
                        enemy.nextReverseTime = now + avgInterval + (Math.random() - 0.5) * avgInterval * 0.5;
                    }
                } else if (enemy.type === 6) {
                    if (now >= enemy.nextReverseTime) {
                        enemy.directionY *= -1;
                        const avgInterval = 1000 / (baseConfig.reverseMovementProbability * eccentricityMultiplier);
                        enemy.nextReverseTime = now + avgInterval + (Math.random() - 0.5) * avgInterval * 0.5;
                    }
                } else if (enemy.type === 7) {
                    if (enemy.y > this.canvas.height * 0.3 && now >= enemy.nextReverseTime) {
                        enemy.directionY *= -1;
                        const avgInterval = 1000 / (baseConfig.reverseMovementProbability * eccentricityMultiplier);
                        enemy.nextReverseTime = now + avgInterval + (Math.random() - 0.5) * avgInterval * 0.5;
                    }
                }

                // Normal Movement (using current direction)
                const actualVx = enemy.speedX * enemy.direction;
                const actualVy = enemy.speedY * enemy.directionY;

                enemy.x += actualVx;
                enemy.y += actualVy;

                // X Boundary Collision
                if (enemy.x <= 0 || enemy.x >= this.canvas.width - enemy.width) {
                    enemy.direction *= -1;
                    enemy.x = Math.max(0, Math.min(this.canvas.width - enemy.width, enemy.x));
                }
                
                // Update rotation for type 5 enemies to match their actual direction of travel
                if (enemy.type === 5) {
                    const targetRotation = Math.atan2(actualVy, actualVx) - Math.PI / 2;
                    
                    // Initialize rotation if not set
                    if (enemy.rotation === undefined) {
                        enemy.rotation = targetRotation;
                    } else {
                        // Smooth rotation interpolation to prevent jumpiness
                        const rotationSpeed = 0.15;
                        
                        // Handle angle wrapping (shortest path between angles)
                        let angleDiff = targetRotation - enemy.rotation;
                        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
                        
                        enemy.rotation += angleDiff * rotationSpeed;
                    }
                    
                    // Type 5 enemies can shoot bullets
                    if (!enemy.lastShot) enemy.lastShot = 0;
                    if (!enemy.nextShotTime) enemy.nextShotTime = now + 2000 + Math.random() * 3000;
                    if (now >= enemy.nextShotTime) {
                        enemy.lastShot = now;
                        enemy.nextShotTime = now + 2000 + Math.random() * 3000;
                        
                        const bulletSpeed = 3;
                        const bulletVx = Math.sin(enemy.rotation) * bulletSpeed;
                        const bulletVy = -Math.cos(enemy.rotation) * bulletSpeed;
                        
                        enemyBullets.push({
                            x: enemy.x + enemy.width / 2 - 2,
                            y: enemy.y + enemy.height / 2 - 3,
                            width: 4,
                            height: 6,
                            vx: bulletVx,
                            vy: bulletVy
                        });
                        this.soundManager.playEnemyBulletSound();
                    }
                }
                
                // Handle wrapping for enemies going off screen
                if (enemy.y > this.canvas.height) {
                    enemy.y = Math.random() * -50 - 20;
                    enemy.x = Math.random() * (this.canvas.width - enemy.width);
                    enemy.direction = Math.random() > 0.5 ? 1 : -1;
                    enemy.directionY = 1;
                    if (enemy.type === 5) {
                        const patrolVx = enemy.speedX * enemy.direction;
                        const patrolVy = enemy.speedY * enemy.directionY;
                        enemy.rotation = Math.atan2(patrolVy, patrolVx) - Math.PI / 2;
                    }
                } else if (enemy.y < -100) {
                    enemy.y = this.canvas.height + 20;
                    enemy.x = Math.random() * (this.canvas.width - enemy.width);
                    enemy.direction = Math.random() > 0.5 ? 1 : -1;
                    enemy.directionY = 1;
                    if (enemy.type === 5) {
                        const patrolVx = enemy.speedX * enemy.direction;
                        const patrolVy = enemy.speedY * enemy.directionY;
                        enemy.rotation = Math.atan2(patrolVy, patrolVx) - Math.PI / 2;
                    }
                }
                
                // Update force field for type 4 enemies
                if (enemy.type === 4 && enemy.forceField) {
                    const currentTime = now;
                    if (!enemy.forceField.active) {
                        if (currentTime - enemy.forceField.lastCheckTime >= enemy.forceField.nextActivationTime) {
                            if (Math.random() < enemy.forceField.activationChance) {
                                enemy.forceField.active = true;
                                enemy.forceField.activationStartTime = currentTime;
                            }
                            enemy.forceField.lastCheckTime = currentTime;
                            enemy.forceField.nextActivationTime = Math.random() * 10000 + 5000;
                        }
                    } else {
                        if (currentTime - enemy.forceField.activationStartTime >= enemy.forceField.duration) {
                            enemy.forceField.active = false;
                            enemy.forceField.lastCheckTime = currentTime;
                            enemy.forceField.nextActivationTime = Math.random() * 10000 + 5000;
                        }
                    }
                }
                
                // Update tractor beam for type 8 enemies
                if (enemy.type === 8 && enemy.tractorBeam) {
                    const currentTime = now;
                    const beam = enemy.tractorBeam;
                    
                    if (beam.phase === 'idle') {
                        // Check if we should fire the tractor beam
                        if (currentTime - beam.lastFireTime >= beam.cooldownTime) {
                            if (Math.random() < beam.fireChance) {
                                // Only allow beam if no other tractor beam is active
                                if (this.activeTractorBeamCount === 0) {
                                    // Start preparation phase - store original speeds
                                    beam.active = true;
                                    beam.startTime = currentTime;
                                    beam.length = 0;
                                    beam.phase = 'preparing';
                                    beam.originalSpeedX = enemy.speedX;
                                    beam.originalSpeedY = enemy.speedY;
                                    this.activeTractorBeamCount++;
                                }
                            }
                        }
                    } else if (beam.phase === 'preparing') {
                        // Preparation phase - ease movement to zero
                        const elapsedTime = currentTime - beam.startTime;
                        const prepareProgress = Math.min(elapsedTime / beam.prepareTime, 1.0);
                        
                        // Ease out movement using smooth interpolation
                        const easeOutFactor = 1.0 - prepareProgress;
                        const smoothEase = easeOutFactor * easeOutFactor; // Quadratic ease-out
                        
                        enemy.speedX = beam.originalSpeedX * smoothEase;
                        enemy.speedY = beam.originalSpeedY * smoothEase;
                        
                        if (prepareProgress >= 1.0) {
                            // Preparation complete, start growing beam
                            beam.phase = 'growing';
                            beam.startTime = currentTime; // Reset timer for growing phase
                            // Start tractor beam sound
                            beam.soundInstance = this.soundManager.playTractorBeamSound();
                        }
                    } else if (beam.phase === 'growing') {
                        // Growing phase - extend the beam
                        const elapsedTime = currentTime - beam.startTime;
                        const growthProgress = Math.min(elapsedTime / beam.growthTime, 1.0);
                        beam.length = growthProgress * beam.maxLength;
                        
                        if (growthProgress >= 1.0) {
                            beam.phase = 'holding';
                            beam.length = beam.maxLength;
                        }
                    } else if (beam.phase === 'holding') {
                        // Holding phase - keep beam at full length, enemy stays motionless
                        const elapsedTime = currentTime - beam.startTime;
                        if (elapsedTime >= beam.holdTime) {
                            beam.phase = 'retracting';
                            beam.startTime = currentTime; // Reset timer for retracting phase
                        }
                    } else if (beam.phase === 'retracting') {
                        // Retracting phase - shrink the beam and restore movement
                        const elapsedTime = currentTime - beam.startTime;
                        const retractProgress = Math.min(elapsedTime / beam.retractTime, 1.0);
                        beam.length = beam.maxLength * (1.0 - retractProgress);
                        
                        // Gradually restore movement during retraction
                        const easeInFactor = retractProgress;
                        const smoothEase = easeInFactor * easeInFactor; // Quadratic ease-in
                        
                        enemy.speedX = beam.originalSpeedX * smoothEase;
                        enemy.speedY = beam.originalSpeedY * smoothEase;
                        
                        if (retractProgress >= 1.0) {
                            // Beam cycle complete - fully restore movement
                            beam.active = false;
                            beam.length = 0;
                            beam.phase = 'idle';
                            beam.lastFireTime = currentTime;
                            
                            // Restore original movement speeds
                            enemy.speedX = beam.originalSpeedX;
                            enemy.speedY = beam.originalSpeedY;
                            
                            // Stop tractor beam sound
                            if (beam.soundInstance) {
                                this.soundManager.stopTractorBeamSound(beam.soundInstance);
                                beam.soundInstance = null;
                            }
                            
                            // Release the global tractor beam lock
                            this.activeTractorBeamCount = Math.max(0, this.activeTractorBeamCount - 1);
                        }
                    }
                }
            }
        }
        
        this.handleEnemyCollision();
        this.removeDeadEnemies();
    }
    
    // Get points for an enemy type
    getEnemyPoints(enemyType) {
        const basePoints = this.enemyBaseConfig[`type${enemyType}`]?.points || this.enemyBaseConfig.type1.points;
        const scoreBonus = this.levelConfig.global.scoreBonus || 0;
        return basePoints + scoreBonus;
    }
    
    // Remove dead enemies
    removeDeadEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (!this.enemies[i].alive) {
                const enemy = this.enemies[i];
                // Clean up tractor beam if enemy had an active beam
                if (enemy.type === 8 && enemy.tractorBeam && enemy.tractorBeam.active) {
                    // Stop tractor beam sound
                    if (enemy.tractorBeam.soundInstance) {
                        this.soundManager.stopTractorBeamSound(enemy.tractorBeam.soundInstance);
                        enemy.tractorBeam.soundInstance = null;
                    }
                    
                    // Restore original movement if enemy was in preparation or beam phase
                    if (enemy.tractorBeam.phase !== 'idle' && enemy.tractorBeam.originalSpeedX !== 0) {
                        enemy.speedX = enemy.tractorBeam.originalSpeedX;
                        enemy.speedY = enemy.tractorBeam.originalSpeedY;
                    }
                    
                    // Release the global tractor beam lock
                    this.activeTractorBeamCount = Math.max(0, this.activeTractorBeamCount - 1);
                }
                this.enemies.splice(i, 1);
            }
        }
    }
    
    // Clear all enemies
    clearEnemies() {
        this.enemies.length = 0;
    }
    
    // Get enemies array (for external access)
    getEnemies() {
        return this.enemies;
    }
    
    // Get alive enemies count
    getAliveEnemiesCount() {
        return this.enemies.filter(e => e.alive).length;
    }
    
    // Get total enemies created
    getTotalEnemiesCreated() {
        return this.totalEnemiesCreated;
    }
    
    // Get spawn schedule info
    getSpawnScheduleInfo() {
        return {
            nextSpawnIndex: this.nextSpawnIndex,
            totalScheduled: this.spawnSchedule.length
        };
    }
    
    // Get enemy base configuration (for external access)
    getEnemyBaseConfig() {
        return this.enemyBaseConfig;
    }

    // Calculate direction towards the player
    calculateDirectionToPlayer(enemy, player) {
        if (!enemy || !player) {
            return { directionX: 0, directionY: 1 };
        }

        const dx = player.x + (player.width / 2) - (enemy.x + enemy.width / 2);
        const dy = player.y + (player.height / 2) - (enemy.y + enemy.height / 2);

        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared === 0) {
            return { directionX: 0, directionY: 1 };
        }

        // Only calculate sqrt when we need normalized direction
        const distance = Math.sqrt(distanceSquared);
        return {
            directionX: dx / distance,
            directionY: dy / distance
        };
    }
} 
