# 🧘‍♀️ Wellness Center Features

## Overview
The Wellness Center is a comprehensive mood-improving feature integrated into ZenFlow that provides three main therapeutic tools:

### 1. 🫁 Guided Breathing Exercises
- **Visual Breathing Guide**: Animated circle that expands and contracts to guide breathing
- **4-Phase Breathing Cycle**: 
  - Inhale (4 seconds)
  - Hold (2 seconds) 
  - Exhale (6 seconds)
  - Pause (2 seconds)
- **Real-time Instructions**: Dynamic text prompts for each phase
- **Start/Stop Controls**: Easy to use interface

### 2. ⏰ Meditation Timer
- **Customizable Duration**: 1, 2, 3, 5, 10, 15, 20, or 30 minutes
- **Visual Progress Bar**: Shows remaining time with gradient animation
- **Large Time Display**: Easy-to-read countdown timer
- **Auto-stop**: Automatically ends when time is reached

### 3. 🎵 Calming Sounds
- **8 Ambient Sound Options**:
  - Forest Rain (5:00)
  - Ocean Waves (4:00)
  - Birds Chirping (3:00)
  - Thunderstorm (3:20)
  - Wind Through Trees (3:40)
  - Crackling Fire (5:00)
  - Mountain Stream (4:10)
  - White Noise (10:00)
- **Volume Control**: Adjustable from 0-100%
- **Random Sound**: Play random ambient sound
- **Loop Playback**: Continuous playing for extended sessions
- **Individual Selection**: Choose specific sounds

## How to Access
1. Go to the **Playground** page
2. Click the **🧘‍♀️ Wellness** button in the top navigation
3. Choose your preferred mode (Breathing, Timer, or Sounds)
4. Follow the guided instructions

## Technical Implementation
- **React Component**: `WellnessCenter.tsx`
- **Framer Motion**: Smooth animations and transitions
- **Audio API**: Web Audio for sound management
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## Sound Files Location
```
public/sounds/ambient/
├── forest-rain.mp3
├── ocean-waves.mp3
├── birds-chirping.mp3
├── thunderstorm.mp3
├── wind-trees.mp3
├── crackling-fire.mp3
├── mountain-stream.mp3
└── white-noise.mp3
```

## Future Enhancements
- [ ] Real ambient sound files (currently using placeholders)
- [ ] Custom sound upload
- [ ] Breathing pattern customization
- [ ] Session history tracking
- [ ] Integration with thought processing
- [ ] Mobile app optimization

## Usage Tips
- **For Stress Relief**: Use breathing exercises with ocean waves
- **For Focus**: Try meditation timer with white noise
- **For Sleep**: Use forest rain with 20+ minute timer
- **For Anxiety**: Combine breathing with crackling fire sounds



