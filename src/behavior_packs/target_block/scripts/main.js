import { world, system } from '@minecraft/server';

console.log('Target block script starting...');

// Target block identifier
const TARGET_BLOCK_ID = 'custom:target_block';

// Map to store active signals and their timers
const activeSignals = new Map();

// Simple tick counter for basic functionality test
let tickIndex = 0;

function mainTick() {
    try {
        tickIndex++;
        
        // Log every 100 ticks to verify script is running
        if (tickIndex % 100 === 0) {
            console.log(`Script is running - tick ${tickIndex}`);
        }
        
    } catch (e) {
        console.warn("Error in main tick: " + e);
    }
    
    system.run(mainTick);
}

function activateTargetBlock2(block, player, distance = 0) {
    // ...existing code...
    // Place a redstone block above the target block
    const redstonePos = { x: block.x, y: block.y + 1, z: block.z };
    const dim = block.dimension;
    dim.getBlock(redstonePos).setType("minecraft:redstone_block");
    // Remove it after 8 ticks
    system.runTimeout(() => {
        dim.getBlock(redstonePos).setType("minecraft:air");
    }, 8);
    // ...existing code...
}

// Function to activate target block and emit redstone signal
function activateTargetBlock(block, player, distance = 0) {
    try {
        // Calculate signal strength based on distance from center (15 is max, 1 is min)
        let signalStrength = Math.max(1, Math.min(15, Math.floor(15 - distance)));
        
        console.log(`block: ${JSON.stringify(block)}`);
        if (!block) {
            console.log("block is undefined or null");
            return;
        }

        // Set the block state for redstone signal
        block.setPermutation(block.permutation.withState('custom:signal_strength', signalStrength));
        block.setPermutation(block.permutation.withState('redstone_signal_strength', signalStrength));

        // Send message to player
        if (player) {
            player.sendMessage(`§aTarget hit! Signal strength: ${signalStrength}`);
        }
        
        console.log(`Target block activated with signal strength: ${signalStrength}`);
        
        // Store the active signal
        const blockKey = `${block.x}_${block.y}_${block.z}`;
        console.log(`Block key: ${blockKey}`);

        // Clear any existing timer for this block
        if (activeSignals.has(blockKey)) {
            console.log(`Block key exists. Clearing previous timer.`);
            system.clearRun(activeSignals.get(blockKey));
        }
        
        // Set timer to turn off signal after 8 ticks (like vanilla target block)
        const timerId = system.runTimeout(() => {
            try {
                // Turn off the signal
                block.setPermutation(block.permutation.withState('custom:signal_strength', 0));
                activeSignals.delete(blockKey);
                
                if (player) {
                    player.sendMessage(`§7Target signal turned off`);
                }
                console.log('Target block signal turned off');
            } catch (e) {
                console.warn("Error turning off target signal: " + e);
            }
        }, 8);
        
        activeSignals.set(blockKey, timerId);
        
    } catch (e) {
        console.warn("Error activating target block: " + e);
    }
}

// Handle target block placement
world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const { block, player } = event;
    
    if (block.typeId === TARGET_BLOCK_ID) {
        player.sendMessage(`§aTarget block placed! Right-click to test!!!!!!!!!!`);
        console.log('Target block placed successfully');
    }
});


// Handle projectile hits on target blocks
world.afterEvents.projectileHitBlock.subscribe((event) => {
    const { hitVector, projectile, source } = event;
    console.log(`projectileHitBlock`);
    console.log(JSON.stringify(event));

    const block = event.getBlockHit()?.block;

    if (block.typeId === TARGET_BLOCK_ID) {
        console.log("target block hit by projectile!!!!");
        // Get the player who shot the projectile
        //const source = projectile.getComponent('minecraft:projectile')?.source;
        let player = null;
        if (!source) {
            console.log("source is undefined or null");
            return;
        }
        console.log(JSON.stringify(source));
        if (source && source.typeId === 'minecraft:player') {
            player = source;
        }
        
        // Calculate distance from block center for signal strength
        const blockCenter = { x: block.x + 0.5, y: block.y + 0.5, z: block.z + 0.5 };
        console.log(`blockCenter: ${JSON.stringify(blockCenter)}`);
        console.log(`hitVector: ${JSON.stringify(hitVector)}`);
        if (!blockCenter) {
            console.log("blockCenter is undefined or null");
            return;
        }        
        if (!hitVector) {
            console.log("hitVector is undefined or null");
            return;
        }
        if (!hitVector.x || !hitVector.y || !hitVector.z) {
            console.log("hitVector coordinates are undefined or null");
            return;
        }

        const distance = Math.sqrt(
            Math.pow(hitVector.x - blockCenter.x, 2) + 
            Math.pow(hitVector.y - blockCenter.y, 2) + 
            Math.pow(hitVector.z - blockCenter.z, 2)
        );
        
        console.log(`Projectile hit target block at distance: ${distance}`);
        activateTargetBlock(block, player, distance);
    }
});

// Use beforeEvents to catch the block type before it's destroyed
world.beforeEvents.playerBreakBlock.subscribe((event) => {
    const { block, player } = event;
    
    if (block.typeId === TARGET_BLOCK_ID) {
        player.sendMessage(`§6Target block broken!`);
        console.log('Target block broken');
    }
});

// Start the tick system
system.run(mainTick);

console.log('Target block system loaded successfully');