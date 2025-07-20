# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the target-mod project.

## Project Overview

The target-mod is a Minecraft Bedrock Edition add-on that creates a permanent target block with redstone functionality. The block behaves like the vanilla target block but is more durable and can only be broken with axes.

## Installation Instructions

### Manual Installation
1. Copy `behavior_packs/target_block/` to `%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\behavior_packs\`
2. Copy `resource_packs/target_block/` to `%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\resource_packs\`
3. Enable both packs in world settings
4. **Important**: Enable "Beta APIs" experimental feature for redstone functionality

### Package Installation
1. Zip behavior pack contents → rename to `target_block_behavior.mcpack`
2. Zip resource pack contents → rename to `target_block_resource.mcpack`  
3. Double-click each .mcpack file to install

## Architecture

### Block Identifier
- **Block ID**: `custom:target_block`
- **Menu Category**: Equipment (Creative inventory)

### Block Properties
- **Destruction**: Only breakable with axes (wooden through netherite)
- **Mining Speed**: 2.0 seconds base, varies by axe type (netherite fastest at 0.2s)
- **Explosion Resistance**: 1000 (extremely high)
- **Pushable**: false (immovable by pistons)
- **Flammable**: false (fire-resistant)
- **Map Color**: Red (#FF0000)

### Redstone System Architecture

#### Block State Management
- **State**: `custom:signal_strength` (values 0-15)
- **Default**: 0 (no signal)
- **Signal Duration**: 8 ticks (0.4 seconds)
- **Light Emission**: Proportional to signal strength when active

#### Signal Calculation Algorithm
```javascript
// Distance-based signal strength calculation
const maxDistance = 0.5; // blocks from center
const signalStrength = Math.max(1, Math.min(15, Math.round(15 - (distance / maxDistance) * 14)));
```
- **Perfect center hit**: Signal strength 15
- **Edge hits**: Signal strength 1
- **Linear scaling**: Based on 3D distance from block center

#### Redstone Conductivity
- **Inactive state**: Non-conductive, allows wire step-down
- **Active state**: Conductive, powers adjacent redstone components
- **Auto-shutoff**: Signal automatically turns off after 8 ticks

### Script System

#### Main Components
1. **projectileHitBlock Event**: Handles direct projectile hits on target block
2. **projectileHitEntity Event**: Handles projectile hits on entities near target (2-block radius)
3. **Timer Management**: Tracks active signals and auto-shutoff timers
4. **Block Permutation System**: Updates block state for redstone signal

#### Key Functions
- `calculateSignalStrength(hitLocation, blockCenter)`: Calculates signal strength 1-15 based on 3D distance
- `emitRedstoneSignal(blockLocation, signalStrength, dimension, player)`: Sets block permutation state and timer
- **Block Permutation System**: Uses `block.permutation.withState()` to set signal strength
- **Error Handling**: Try-catch blocks around all block operations and state changes

#### Event System
```javascript
world.afterEvents.projectileHitBlock.subscribe((event) => {
    // Handle direct projectile hits on target block
    const { projectile, hitBlockPermutation, location, dimension } = event;
    // Calculate signal strength based on hit accuracy
    // Set block state using permutation system
});

world.afterEvents.projectileHitEntity.subscribe((event) => {
    // Handle projectile hits on entities near target blocks (2-block search radius)
    const { projectile, hitVector, location, dimension } = event;
    // Search for target blocks within 2-block radius
    // Calculate signal strength and emit redstone signal
});
```

## File Structure

```
target-mod/
├── behavior_packs/
│   └── target_block/
│       ├── manifest.json          # Behavior pack configuration
│       ├── blocks/
│       │   └── target_block.json  # Block definition with states & permutations
│       ├── scripts/
│       │   └── main.js           # Redstone logic and event handlers
│       └── pack_icon.png         # Behavior pack icon
├── resource_packs/
│   └── target_block/
│       ├── manifest.json          # Resource pack configuration
│       ├── blocks.json           # Block texture mapping
│       ├── models/blocks/
│       │   └── target_block.geo.json  # 3D block model
│       ├── textures/
│       │   ├── terrain_texture.json   # Texture atlas config
│       │   └── blocks/
│       │       └── target_block.png   # Block texture (16x16)
│       ├── texts/
│       │   └── en_US.lang        # Block name localization
│       └── pack_icon.png         # Resource pack icon
└── README.md                     # Installation and usage guide
```

## Dependencies

### Behavior Pack Dependencies
- `@minecraft/server` version 1.9.0 (Script API)
- Resource pack UUID: `c3d4e5f6-g7h8-9012-3456-789012cdefgh`

### Resource Pack Dependencies
- Behavior pack UUID: `a1b2c3d4-e5f6-7890-1234-567890abcdef`

## Development Notes

### Testing Requirements
- **Beta APIs**: Must be enabled in world settings for script functionality
- **Projectile Types**: Works with arrows, snowballs, tridents, eggs, ender pearls, etc.
- **Redstone Components**: Compatible with dust, repeaters, comparators, pistons, dispensers
- **Signal Strength**: Test with different hit positions to verify 1-15 signal range
- **Block States**: Verify light emission and redstone conductivity changes with signal strength

### Common Issues
- **No redstone signal**: Check if Beta APIs are enabled and projectiles are hitting the block
- **Block not appearing**: Verify pack installation and activation
- **Mining issues**: Ensure using correct axe type (wooden through netherite)
- **Script errors**: Check console for JavaScript errors
- **Signal not turning off**: Verify timer system is working (8-tick duration)
- **Wrong signal strength**: Check projectile hit accuracy (center = 15, edge = 1)

### Customization Points
- **Signal duration**: Modify timeout value in `emitRedstoneSignal()` (currently 8 ticks)
- **Signal calculation**: Adjust `maxDistance` in `calculateSignalStrength()` 
- **Mining speeds**: Edit `item_specific_speeds` in block definition
- **Explosion resistance**: Modify `explosion_resistance` value
- **Texture**: Replace `target_block.png` with custom 16x16 texture

### UUID Configuration
All UUIDs are hardcoded in manifests. Generate new UUIDs if creating derivative projects to avoid conflicts.

## Performance Considerations

- **Timer Management**: Active signals map prevents memory leaks
- **Error Handling**: Graceful fallback for block access failures
- **Search Radius**: 2-block radius for entity hits balances functionality vs performance
- **Dimension Scoping**: Currently hardcoded to overworld dimension