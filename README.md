# Target Block Add-on

A Minecraft Bedrock Edition add-on that adds a new target block that can be placed anywhere in the world to practice projectile shooting.

## Features

- **Permanent Target Block**: A durable block that resists explosions and lasts forever
- **Placeable Anywhere**: Can be placed in any environment
- **Target Design**: Classic bullseye appearance for easy identification
- **Durable**: High explosion resistance to prevent accidental destruction
- **Redstone Integration**: Emits redstone signals when hit by projectiles
- **Variable Signal Strength**: Signal strength (1-15) based on proximity to center
- **Automatic Shutoff**: Redstone signal turns off after 8 ticks (0.4 seconds)

## Installation

### Method 1: Copy to Minecraft Folder

1. Navigate to your Minecraft folder:
   - **Windows**: `%localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\`
   - **iOS**: Files App > On My iPhone > Minecraft > games > com.mojang
   - **Android**: `/storage/emulated/0/games/com.mojang/`

2. Copy the folders:
   - Copy `behavior_packs/target_block/` to `behavior_packs/`
   - Copy `resource_packs/target_block/` to `resource_packs/`

3. Launch Minecraft and create a new world or edit an existing world
4. Go to Behavior Packs and enable "Target Block Behavior Pack"
5. Go to Resource Packs and enable "Target Block Resource Pack"

### Method 2: Create .mcpack Files

1. Create behavior pack:
   - Zip the contents of `behavior_packs/target_block/`
   - Rename the .zip file to `target_block_behavior.mcpack`

2. Create resource pack:
   - Zip the contents of `resource_packs/target_block/`
   - Rename the .zip file to `target_block_resource.mcpack`

3. Double-click each .mcpack file to install them in Minecraft

## Usage

Once installed, you can:
- Find the Target Block in your creative inventory under the Equipment category
- Place it anywhere in the world
- **Redstone Functionality**:
  - Shoot arrows, snowballs, or other projectiles at the target
  - The block will emit a redstone signal when hit
  - Signal strength depends on how close to the center you hit (1-15)
  - Perfect center hits give maximum signal strength (15)
  - Signal automatically turns off after 0.4 seconds
- Connect redstone dust, repeaters, or other redstone components
- Use it for target practice, decoration, or complex redstone contraptions
- The block will persist through explosions and other destructive events

## Customization

To customize the target block:
- Replace `textures/blocks/target_block.png` with your own 16x16 texture
- Modify `blocks/target_block.json` to adjust block properties
- Update `texts/en_US.lang` to change the block name

## Technical Details

- **Block ID**: `custom:target_block`
- **Explosion Resistance**: 1000 (extremely high)
- **Mining Time**: 2.0 seconds (only with axe)
- **Tool Required**: Any axe (wooden, stone, iron, golden, diamond, netherite)
- **Sound**: Wood breaking sound
- **Map Color**: Red (#FF0000)
- **Redstone Properties**:
  - **Signal Duration**: 8 ticks (0.4 seconds)
  - **Signal Strength**: 1-15 based on hit accuracy
  - **Trigger**: Any projectile hit (arrows, snowballs, etc.)
  - **Detection Range**: 2 block radius for entity hits near target

## Requirements

- Minecraft Bedrock Edition 1.20.80 or higher
- **Experimental Features**: Enable "Beta APIs" in world settings for redstone functionality
- **Script API**: Required for projectile detection and redstone signal emission

## Notes

- You'll need to create the actual PNG image files for textures and pack icons
- The texture placeholder files (.png.txt) should be replaced with actual .png images
- Test the add-on in a creative world first before using in survival mode