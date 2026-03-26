# 🎨 MS Paint-Style Drawing Tools

## Complete Feature Set

### 🛠️ Tools (6 Total)
1. **✏️ Pencil** - Freehand drawing with color and size
2. **🪣 Fill Bucket** - Fill enclosed areas with color
3. **🧹 Eraser** - Erase parts of the drawing (draws white)
4. **📏 Line** - Draw straight lines
5. **▭ Rectangle** - Draw rectangular outlines
6. **○ Circle** - Draw circular outlines

### 🎨 Color Palette
- **20 preset colors** arranged in 2 rows (MS Paint classic colors)
- **Custom color picker** - Choose any color with HTML5 color input
- **Current color indicator** - Shows selected foreground color
- **Background color indicator** - Shows white background

### 🖌️ Brush Sizes
- **6 sizes available**: 1px, 3px, 5px, 8px, 12px, 16px
- **Visual preview** - Each button shows actual brush size as a dot
- **Responsive selection** - Highlights currently selected size

### 🎯 Tool Behavior

#### Pencil Tool
- Click and drag to draw freehand
- Uses selected color and brush size
- Smooth lines with rounded caps and joins
- Real-time synchronization to all players

#### Fill Bucket
- Click on any enclosed area to fill with selected color
- Uses flood fill algorithm
- Instant fill, no dragging needed
- Perfect for coloring large areas

#### Eraser
- Click and drag to erase (draws white)
- Uses selected brush size
- Works just like drawing but with white color

#### Line Tool
- Click to set start point
- Drag to desired end point
- Release to draw the line
- Preview shows during dragging

#### Rectangle Tool
- Click to set one corner
- Drag to opposite corner
- Release to draw the rectangle outline
- Preview shows during dragging

#### Circle Tool
- Click to set center point
- Drag to define radius
- Release to draw the circle outline
- Preview shows during dragging

## 🎨 MS Paint-Style Layout

### Tool Panel (Left Side)
```
┌─────────────┐
│   Tools     │
├──────┬──────┤
│  ✏️  │  🪣  │
├──────┼──────┤
│  🧹  │  📏  │
├──────┼──────┤
│  ▭   │  ○   │
└──────┴──────┘
```

### Color Palette (Center)
- 2 rows × 10 columns = 20 colors
- Selected color has black border and scales up
- Custom color picker for any RGB value
- Current/background color indicators

### Brush Size Panel (Right)
- Visual size indicators (dots showing actual size)
- Quick selection buttons
- Clear canvas button below

## 🔄 Real-Time Synchronization

All drawing actions sync instantly:
- **Pen strokes**: Broadcasted point-by-point
- **Fill operations**: Single event with coordinates
- **Shapes**: Sent as complete shapes with start/end points
- **Clear canvas**: Clears for all players simultaneously

## 🎮 How to Use

### Drawing with Tools:
1. **Select a tool** from the tool panel (left)
2. **Choose a color** from the palette
3. **Pick brush size** (for pen/eraser/line/rectangle/circle)
4. **Draw on canvas**:
   - Pen/Eraser: Click and drag
   - Fill: Single click in area
   - Shapes: Click start point, drag, release

### Filling Areas:
1. Select **🪣 Fill Bucket**
2. Choose your fill color
3. Click inside any enclosed area
4. The area fills instantly!

### Drawing Shapes:
1. Select shape tool (📏 Line, ▭ Rectangle, or ○ Circle)
2. Choose color and size
3. Click to start, drag to preview, release to draw
4. Shape appears for all players

### Clearing Canvas:
- Click **"🗑️ Clear Canvas"** button
- Entire canvas clears for all players
- Useful for starting fresh mid-turn

## 🎯 Technical Implementation

### Canvas: HTML5 Canvas API
- **Size**: 800×600 pixels
- **Context**: 2D rendering context
- **Mouse events**: mouseDown, mouseMove, mouseUp, mouseLeave

### Flood Fill Algorithm
- **Method**: Iterative with stack
- **Performance**: Optimized with visited set
- **Color matching**: Exact RGB comparison

### Shape Preview
- **Technique**: ImageData snapshot
- **Restore**: Revert to snapshot during drag
- **Finalize**: Draw permanent shape on mouse up

### Socket Events
```javascript
// Pen/Eraser strokes
emit('draw', { x, y, color, size, tool: 'pen' })

// Fill bucket
emit('draw', { x, y, color, size, tool: 'fill' })

// Shapes
emit('draw', { 
  tool: 'line|rectangle|circle',
  startX, startY, endX, endY, 
  color, size 
})

// Clear canvas
emit('clearCanvas')
```

## 🎨 Color Palette

### Row 1 (Dark/Bright):
Black, Gray, Dark Red, Red, Orange, Yellow, Green, Blue, Dark Blue, Purple

### Row 2 (Light/Pastel):
White, Light Gray, Brown, Pink, Gold, Cream, Light Green, Sky Blue, Slate Blue, Lavender

### Custom Color:
HTML5 color picker for unlimited colors

## ✨ Key Features

✅ 6 professional drawing tools
✅ 20+ colors + custom picker
✅ 6 brush sizes with visual preview
✅ Flood fill for fast coloring
✅ Shape tools with live preview
✅ MS Paint-style UI layout
✅ Real-time multi-player sync
✅ Smooth freehand drawing
✅ Clear canvas function
✅ Tool highlighting/selection
✅ Responsive design

## 🚀 Try It Now!

1. Start the game and become the drawer
2. You'll see the full MS Paint-style toolbar
3. Try each tool to get familiar
4. Use fill bucket to color large areas quickly
5. Draw shapes for structured drawings
6. Other players see everything in real-time!

**Have fun drawing!** 🎨✨
