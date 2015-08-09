# Starstuff
A UI library for [JXA](https://developer.apple.com/library/mac/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/)

__NOTE__: This is a new project and under heavy development, just figuring things out right now.

## Why?
The code required to build UIs using Cocoa can be quite verbose. Startstuff provides a familiar, chainable API for creating those UIs.

## Installation

```
npm install --save starstuff
```

## Usage

```javascript
import starstuff from 'starstuff';

// Create a new NSWindow. `$mainWindow` is a Starstuff object.
// Startstuff does not prevent access to original Cocoa
// objects, they are stored in the `el` property.
// ex; $mainWindow.el
var $mainWindow = starstuff.window({
  title: 'Choose an Image Window',
  rect: [0, 0, 600, 85]
}).delegate(appDelegate);

$mainWindow.append(starstuff.fieldLabel({
  id: 'fileFieldLabel',
  value: 'Image: (jpg, png, or gif):',
  rect: [25, ($mainWindow.height() - 40), 200, 24]
}))
.append(starstuff.textField({
  id: 'fileField',
  editable: false,
  rect: [25, ($mainWindow.height() - 60), 350, 24]
}))
.append(starstuff.button({
  id: 'chooseButton',
  title: 'Choose an image...',
  rect: [375, ($mainWindow.height() - 62), 150, 25],
  target: appDelegate,
  action: 'click'
}));
```

## API Reference

#### window({options})

#### fieldLabel({options})

#### textField({options})

#### button({options})

#### image({options})

#### openPanel({options})
